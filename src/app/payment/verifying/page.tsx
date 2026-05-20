"use client";

/**
 * src/app/payment/verifying/page.tsx
 *
 * Payment Verifying Page — client component.
 *
 * After a user completes Razorpay checkout, they are redirected here.
 * The page polls GET /api/subscription/status every 2 seconds.
 * Once the backend confirms hasAccess: true (set by the webhook),
 * the user is redirected to /dashboard.
 *
 * Polling is capped at 30 seconds to avoid infinite loops — after that,
 * an error state is shown with a support link.
 */

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, HeadphonesIcon } from "lucide-react";

// ─── Config ───────────────────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 2_000;
const MAX_DURATION_MS = 30_000;
const STATUS_ENDPOINT = "/api/subscription/status";

// ─── Component ────────────────────────────────────────────────────────────────

export default function PaymentVerifyingPage() {
  const router = useRouter();

  type PageState = "polling" | "success" | "timeout";
  const [state, setState] = useState<PageState>("polling");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const startTimeRef = useRef<number>(Date.now());
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Elapsed-seconds ticker for progress display
    timerRef.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1_000);

    // Poll subscription status
    pollRef.current = setInterval(async () => {
      const elapsed = Date.now() - startTimeRef.current;

      // Timeout guard
      if (elapsed >= MAX_DURATION_MS) {
        clearAll();
        setState("timeout");
        return;
      }

      try {
        const res = await fetch(STATUS_ENDPOINT, { cache: "no-store" });
        if (!res.ok) return; // transient error — keep polling

        const data: { hasAccess: boolean; reason: string } = await res.json();

        if (data.hasAccess) {
          clearAll();
          setState("success");
          // Brief success flash before redirect
          setTimeout(() => router.replace("/dashboard"), 1_200);
        }
      } catch {
        // Network hiccup — keep polling
      }
    }, POLL_INTERVAL_MS);

    return clearAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function clearAll() {
    if (pollRef.current) clearInterval(pollRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  const progressPercent = Math.min(
    100,
    (elapsedSeconds / (MAX_DURATION_MS / 1000)) * 100
  );

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-violet-950 to-slate-950 px-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          {/* Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-12 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-violet-500/25 blur-3xl"
          />

          {/* ── Polling state ── */}
          {state === "polling" && (
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="relative flex h-20 w-20 items-center justify-center">
                {/* Spinning ring */}
                <div className="absolute inset-0 rounded-full border-4 border-violet-500/20" />
                <div
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-400"
                  style={{ animation: "spin 1s linear infinite" }}
                />
                <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
              </div>

              <div>
                <h1 className="text-xl font-bold text-white">
                  Verifying Payment
                </h1>
                <p className="mt-1 text-sm text-white/50">
                  Hang tight — confirming your subscription…
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full">
                <div className="mb-1 flex justify-between text-xs text-white/30">
                  <span>Checking…</span>
                  <span>{elapsedSeconds}s</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400 transition-all duration-1000"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <p className="text-xs text-white/30">
                This usually takes under 10 seconds
              </p>
            </div>
          )}

          {/* ── Success state ── */}
          {state === "success" && (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 ring-4 ring-emerald-500/30">
                <CheckCircle2 className="h-10 w-10 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Payment Confirmed!
                </h1>
                <p className="mt-1 text-sm text-white/50">
                  Redirecting to your dashboard…
                </p>
              </div>
            </div>
          )}

          {/* ── Timeout / Error state ── */}
          {state === "timeout" && (
            <div className="flex flex-col items-center gap-5 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/15 ring-4 ring-rose-500/30">
                <XCircle className="h-10 w-10 text-rose-400" />
              </div>

              <div>
                <h1 className="text-xl font-bold text-white">
                  Verification Timed Out
                </h1>
                <p className="mt-2 text-sm text-white/50">
                  We couldn't confirm your subscription within 30 seconds. Your
                  payment may still be processing — please wait a minute and
                  check your dashboard again.
                </p>
              </div>

              <div className="flex w-full flex-col gap-2">
                <a
                  href="/dashboard"
                  id="payment-verify-go-dashboard"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
                >
                  Go to Dashboard
                </a>
                <a
                  href="mailto:support@vidyazo.com?subject=Payment%20Verification%20Issue"
                  id="payment-verify-contact-support"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10"
                >
                  <HeadphonesIcon className="h-4 w-4" />
                  Contact Support
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Fine print */}
        <p className="mt-4 text-center text-xs text-white/20">
          Powered by Razorpay · Payments secured by 256-bit encryption
        </p>
      </div>

      {/* Inline keyframe for the spinner (avoids Tailwind arbitrary animation) */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}
