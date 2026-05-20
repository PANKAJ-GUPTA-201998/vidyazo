/**
 * src/lib/access-control.ts
 *
 * Subscription access-control helper.
 * Usable from both middleware (via createServerClient) and Server Components.
 *
 * Security model:
 *  - Reads from the `subscriptions` table using the anon key + RLS.
 *    The RLS policy "subscriptions: student self select" ensures a user can
 *    only ever read their own subscription row.
 *  - This function never touches the service role key — it uses the
 *    caller-supplied Supabase client which carries the session JWT.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { SubscriptionAccessResult, SubscriptionAccessReason } from "@/types/database";

// Re-export the result type so callers can import from one place
export type { SubscriptionAccessResult };

/**
 * Check whether a profile has an active paid subscription or an active free trial.
 *
 * @param supabase   An authenticated Supabase client (server or middleware).
 * @param profileId  The profile.id (= auth.users.id) to check.
 *
 * @returns {SubscriptionAccessResult}
 *   hasAccess        – true if dashboard access should be granted
 *   reason           – granular reason string for logging / redirects
 *   currentPeriodEnd – the Date when access expires, or null
 */
export async function getUserSubscriptionStatus(
  supabase: SupabaseClient,
  profileId: string
): Promise<SubscriptionAccessResult> {
  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("status, current_period_end, trial_ends_at")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    // Log but fail open (treat as no subscription) — don't crash middleware
    console.error("[access-control] Error fetching subscription:", error.message);
  }

  // No subscription row at all
  if (!subscription) {
    return { hasAccess: false, reason: "no_subscription", currentPeriodEnd: null };
  }

  const now = new Date();

  // Check paid access: status === 'active' AND current_period_end is in the future
  if (
    subscription.status === "active" &&
    subscription.current_period_end !== null
  ) {
    const periodEnd = new Date(subscription.current_period_end);
    if (periodEnd > now) {
      return {
        hasAccess: true,
        reason: "active",
        currentPeriodEnd: periodEnd,
      };
    }
    // Active status but expired period — treat as expired
    return { hasAccess: false, reason: "expired", currentPeriodEnd: periodEnd };
  }

  // Check free trial: trial_ends_at is in the future
  if (subscription.trial_ends_at !== null) {
    const trialEnd = new Date(subscription.trial_ends_at);
    if (trialEnd > now) {
      return {
        hasAccess: true,
        reason: "trial",
        currentPeriodEnd: trialEnd,
      };
    }
  }

  // Subscription exists but neither condition passed
  const reason: SubscriptionAccessReason =
    subscription.status === "cancelled" ||
    subscription.status === "expired" ||
    subscription.status === "halted"
      ? "expired"
      : "no_subscription";

  return { hasAccess: false, reason, currentPeriodEnd: null };
}
