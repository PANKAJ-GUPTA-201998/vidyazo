/**
 * src/app/api/subscription/status/route.ts
 *
 * GET /api/subscription/status
 *
 * Returns the current user's subscription access status.
 * Polled by the /payment/verifying page every 2 seconds.
 *
 * Security: Uses the session cookie (anon key + RLS) — no service role.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserSubscriptionStatus } from "@/lib/access-control";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ hasAccess: false, reason: "unauthenticated" }, { status: 401 });
  }

  const result = await getUserSubscriptionStatus(supabase, user.id);

  return NextResponse.json({
    hasAccess: result.hasAccess,
    reason: result.reason,
    currentPeriodEnd: result.currentPeriodEnd?.toISOString() ?? null,
  });
}
