import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import crypto from "crypto";

/**
 * POST /api/webhooks/razorpay
 * Razorpay webhook for payment confirmation
 */
export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    // Verify webhook signature
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("[Razorpay] Webhook signature mismatch");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle payment.captured event
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;

      const supabase = await createServiceRoleClient();

      // Find payment record by Razorpay order ID
      const { data: paymentRecord, error: findError } = await supabase
        .from("payments")
        .select("id")
        .eq("razorpay_order_id", orderId)
        .single();

      if (findError || !paymentRecord) {
        console.error("[Razorpay] Payment record not found for order:", orderId);
        return NextResponse.json(
          { error: "Payment record not found" },
          { status: 404 }
        );
      }

      // Update payment status
      const { error: updateError } = await supabase
        .from("payments")
        .update({
          status: "paid",
          razorpay_payment_id: paymentId,
          paid_at: new Date().toISOString(),
        })
        .eq("id", paymentRecord.id);

      if (updateError) {
        console.error("[Razorpay] Update failed:", updateError);
        return NextResponse.json(
          { error: "Update failed" },
          { status: 500 }
        );
      }

      console.log(`[Razorpay] Payment ${paymentId} captured for order ${orderId}`);
    }

    // Handle payment.failed event
    if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;

      const supabase = await createServiceRoleClient();

      await supabase
        .from("payments")
        .update({ status: "failed" })
        .eq("razorpay_order_id", orderId);

      console.log(`[Razorpay] Payment failed for order ${orderId}`);
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("[Razorpay] Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
