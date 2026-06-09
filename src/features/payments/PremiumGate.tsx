/**
 * src/components/shared/PremiumGate.tsx
 *
 * Server Component — subscription tier gate.
 *
 * Security model:
 *  - Data is fetched entirely server-side. Premium content is NEVER included
 *    in the HTML sent to the client if the user doesn't have access.
 *    (Unlike client-side conditional rendering which can be inspected in DevTools.)
 *  - Uses the anon key + RLS so only the signed-in user's subscription is readable.
 *  - No client JavaScript is required for the access check.
 *
 * Usage:
 *   <PremiumGate requiredPlan="pro">
 *     <SomePremiumContent />
 *   </PremiumGate>
 */

import { createClient } from "@/lib/supabase/server";
import type { PlanId } from "@/types/database";
import Link from "next/link";
import { Lock, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

// ─── Props ────────────────────────────────────────────────────────────────────

interface PremiumGateProps {
  requiredPlan: PlanId;
  children: React.ReactNode;
}

// ─── Plan display helpers ─────────────────────────────────────────────────────

const PLAN_LABELS: Record<PlanId, string> = {
  basic: "Basic",
  pro: "Pro",
};

const PLAN_RANK: Record<PlanId, number> = {
  basic: 1,
  pro: 2,
};

const PRO_FEATURES = [
  "1-on-1 doubt sessions",
  "AI-powered progress reports",
  "Unlimited test attempts",
  "Parent performance dashboard",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default async function PremiumGate({
  requiredPlan,
  children,
}: PremiumGateProps) {
  const supabase = await createClient();

  // Fetch the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Not logged in — render upgrade prompt (middleware should have redirected
    // already, but this is a fallback for server components rendered directly)
    return <UpgradePrompt currentPlan={null} requiredPlan={requiredPlan} />;
  }

  // Fetch user's active subscription
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan_id, status, current_period_end, trial_ends_at")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const now = new Date();

  // Determine if the subscription is currently active (paid or trial)
  const isActive =
    subscription?.status === "active" &&
    subscription?.current_period_end !== null &&
    new Date(subscription.current_period_end) > now;

  const isTrialActive =
    subscription?.trial_ends_at !== null &&
    subscription?.trial_ends_at !== undefined &&
    new Date(subscription.trial_ends_at) > now;

  const hasAnyAccess = isActive || isTrialActive;
  const currentPlan = (subscription?.plan_id ?? null) as PlanId | null;

  // Check plan tier sufficiency
  const requiredRank = PLAN_RANK[requiredPlan];
  const currentRank = currentPlan ? PLAN_RANK[currentPlan] : 0;
  const hasSufficientPlan = hasAnyAccess && currentRank >= requiredRank;

  // ✅ User has access — render premium content
  // The content is ONLY returned here, never leaks to the upgrade prompt branch
  if (hasSufficientPlan) {
    return <>{children}</>;
  }

  // ❌ Insufficient plan — render upgrade card without children in DOM
  return <UpgradePrompt currentPlan={currentPlan} requiredPlan={requiredPlan} />;
}

// ─── Upgrade Prompt Card ──────────────────────────────────────────────────────

function UpgradePrompt({
  currentPlan,
  requiredPlan,
}: {
  currentPlan: PlanId | null;
  requiredPlan: PlanId;
}) {
  const currentLabel = currentPlan ? PLAN_LABELS[currentPlan] : "Free";
  const requiredLabel = PLAN_LABELS[requiredPlan];

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-6 shadow-xl"
      role="region"
      aria-label="Premium content locked"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-violet-400/10 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-indigo-400/10 blur-2xl"
      />

      {/* Lock icon */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 shadow-lg shadow-violet-600/30">
          <Lock className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-500">
            Premium Content
          </p>
          <h3 className="text-base font-bold text-gray-900">
            {requiredLabel} Plan Required
          </h3>
        </div>
      </div>

      {/* Plan badges */}
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">
          Your plan:{" "}
          <span className="ml-1 font-semibold text-gray-900">{currentLabel}</span>
        </span>
        <ArrowRight className="h-4 w-4 text-gray-400" />
        <span className="inline-flex items-center gap-1 rounded-full bg-violet-600 px-3 py-1 font-semibold text-white shadow-sm">
          <Sparkles className="h-3.5 w-3.5" />
          {requiredLabel}
        </span>
      </div>

      {/* Feature list */}
      {requiredPlan === "pro" && (
        <ul className="mb-5 space-y-2">
          {PRO_FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-violet-500" />
              {feature}
            </li>
          ))}
        </ul>
      )}

      {/* CTA */}
      <Link
        href={`/pricing?upgrade=${requiredPlan}`}
        id="premium-gate-upgrade-cta"
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:bg-violet-700 hover:shadow-violet-700/40 active:scale-95"
      >
        <Sparkles className="h-4 w-4" />
        Upgrade to {requiredLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>

      <p className="mt-3 text-center text-xs text-gray-400">
        Cancel anytime · Instant access after payment
      </p>
    </div>
  );
}
