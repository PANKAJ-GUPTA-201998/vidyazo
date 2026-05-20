/**
 * src/app/api/webhooks/razorpay/route.ts
 *
 * ⚠️  SERVICE ROLE KEY IS USED HERE.
 * Reason: Writing to the `subscriptions` table requires bypassing RLS because
 * the webhook is called by Razorpay's servers — there is no authenticated user
 * session. The service role key lets us update subscription records server-side
 * after verifying the Razorpay HMAC signature. It is NEVER sent to the client.
 *
 * Security checklist:
 *  ✓ Signature verified with RAZORPAY_WEBHOOK_SECRET before any DB write.
 *  ✓ Service role client created only inside this server-side route handler.
 *  ✓ RAZORPAY_WEBHOOK_SECRET is a separate secret from RAZORPAY_KEY_SECRET.
 *  ✓ Returns 400 for invalid signatures; 200 for all valid events (Razorpay
 *    retries on non-2xx, so we always ack valid events even if DB op fails).
 */

import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import crypto from "crypto";

// ─── Razorpay Subscription Event Payload Shapes ──────────────────────────────

interface RazorpaySubscriptionEntity {
  id: string;               // rzp_sub_...
  plan_id: string;
  status: string;
  current_start: number;    // Unix timestamp
  current_end: number;      // Unix timestamp
  charge_at: number;        // Unix timestamp of next charge
}

interface RazorpayPaymentEntity {
  id: string;               // pay_...
  subscription_id: string;  // rzp_sub_...
}

interface RazorpayEvent {
  entity: "event";
  account_id: string;
  event: string;            // e.g. "subscription.activated"
  contains: string[];
  payload: {
    subscription?: { entity: RazorpaySubscriptionEntity };
    payment?: { entity: RazorpayPaymentEntity };
  };
  created_at: number;
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  // 1. Read raw body as text (required for HMAC verification)
  const rawBody = await request.text();

  // 2. Verify Razorpay HMAC signature
  //    Razorpay signs the raw body with RAZORPAY_WEBHOOK_SECRET using SHA-256.
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[razorpay/webhook] RAZORPAY_WEBHOOK_SECRET env var missing");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const incomingSignature = request.headers.get("x-razorpay-signature") ?? "";
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  if (
    !crypto.timingSafeEqual(
      Buffer.from(incomingSignature, "hex"),
      Buffer.from(expectedSignature, "hex")
    )
  ) {
    console.warn("[razorpay/webhook] Signature mismatch — possible spoofed request");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // 3. Parse event
  let event: RazorpayEvent;
  try {
    event = JSON.parse(rawBody) as RazorpayEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  console.log(`[razorpay/webhook] Received event: ${event.event}`);

  // 4. Service role client — only created after signature is verified
  const supabase = await createServiceRoleClient();

  // ─── Event: subscription.activated ───────────────────────────────────────
  if (event.event === "subscription.activated") {
    const sub = event.payload.subscription?.entity;
    const pay = event.payload.payment?.entity;

    if (!sub) {
      console.error("[razorpay/webhook] subscription.activated missing subscription entity");
      return NextResponse.json({ status: "ok" }); // ack anyway
    }

    // Map Razorpay plan_id to our internal plan_id
    const planId = mapRazorpayPlanToPlanId(sub.plan_id);

    // current_period_end = sub.current_end (Unix seconds → ISO string)
    const currentPeriodEnd = new Date(sub.current_end * 1000).toISOString();

    const { error } = await supabase
      .from("subscriptions")
      .upsert(
        {
          razorpay_subscription_id: sub.id,
          razorpay_payment_id: pay?.id ?? null,
          status: "active",
          plan_id: planId,
          current_period_end: currentPeriodEnd,
          // trial_ends_at left untouched if row already exists
        },
        {
          onConflict: "razorpay_subscription_id",
          ignoreDuplicates: false,
        }
      );

    if (error) {
      console.error("[razorpay/webhook] DB upsert failed:", error.message);
      // Still return 200 so Razorpay doesn't retry forever — log for manual fix
    }
  }

  // ─── Event: subscription.halted ──────────────────────────────────────────
  if (event.event === "subscription.halted") {
    const sub = event.payload.subscription?.entity;
    if (!sub) return NextResponse.json({ status: "ok" });

    const { error } = await supabase
      .from("subscriptions")
      .update({ status: "halted" })
      .eq("razorpay_subscription_id", sub.id);

    if (error) {
      console.error("[razorpay/webhook] halted update failed:", error.message);
    }
  }

  // ─── Event: subscription.cancelled ───────────────────────────────────────
  if (event.event === "subscription.cancelled") {
    const sub = event.payload.subscription?.entity;
    if (!sub) return NextResponse.json({ status: "ok" });

    const { error } = await supabase
      .from("subscriptions")
      .update({ status: "cancelled" })
      .eq("razorpay_subscription_id", sub.id);

    if (error) {
      console.error("[razorpay/webhook] cancelled update failed:", error.message);
    }
  }

  // ─── Event: subscription.completed ───────────────────────────────────────
  if (event.event === "subscription.completed") {
    const sub = event.payload.subscription?.entity;
    if (!sub) return NextResponse.json({ status: "ok" });

    const { error } = await supabase
      .from("subscriptions")
      .update({ status: "expired" })
      .eq("razorpay_subscription_id", sub.id);

    if (error) {
      console.error("[razorpay/webhook] completed→expired update failed:", error.message);
    }
  }

  // ─── Event: subscription.charged (renewal) ───────────────────────────────
  if (event.event === "subscription.charged") {
    const sub = event.payload.subscription?.entity;
    const pay = event.payload.payment?.entity;
    if (!sub) return NextResponse.json({ status: "ok" });

    const currentPeriodEnd = new Date(sub.current_end * 1000).toISOString();

    const { error } = await supabase
      .from("subscriptions")
      .update({
        status: "active",
        current_period_end: currentPeriodEnd,
        razorpay_payment_id: pay?.id ?? null,
      })
      .eq("razorpay_subscription_id", sub.id);

    if (error) {
      console.error("[razorpay/webhook] charged update failed:", error.message);
    }
  }

  // Always acknowledge valid events
  return NextResponse.json({ status: "ok" });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Map a Razorpay plan_id (e.g. "plan_AbcBasic") to our internal plan_id.
 * Update this mapping when you add new plans to Razorpay.
 */
function mapRazorpayPlanToPlanId(razorpayPlanId: string): "basic" | "pro" {
  const PRO_PLAN_IDS = (process.env.RAZORPAY_PRO_PLAN_IDS ?? "").split(",");
  if (PRO_PLAN_IDS.includes(razorpayPlanId)) return "pro";
  return "basic";
}
