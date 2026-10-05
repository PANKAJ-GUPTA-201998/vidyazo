# STATUS (keep <40 lines; update via /done)

## Works (live on Vercel)
- Marketing site, student dashboard, admin panel (students, batches, teachers, tests, results, materials, payments, reports), parent dashboard + magic-link report
- Phone OTP auth with role/status/subscription gate (src/proxy.ts)
- Razorpay order + webhook; weekly AI report cron; WhatsApp sending
- Notifications, streaks, leaderboard, PWA offline page

## Next
- See docs/ROADMAP.md (no phases filled in yet)

## Known bugs / risks
- `next.config.ts` has `ignoreBuildErrors: true` -> type errors ship silently; run `npx tsc --noEmit`.
- No automated tests, no .env.example.
- Prices differ: constants.ts (899/1499/2999) vs CLAUDE.md original brief (599/1099/2999). Confirm intended.
- Two test-taking routes: /test/[testId] and /test/[id] (dashboard group) - check which one is linked.
- Duplicate `generateAIReport` in lib/actions/reports.ts (sonnet-4) and features/ai/actions.ts (haiku-3); hard-coded model ids differ.
- proxy.ts redirects to /account-suspended, which has no page (404).
- proxy.ts treats "/" prefix list as public incl. /ai-reports; /api/cron/* is guarded only by CRON_SECRET bearer.
- class-reminders cron route exists but is not scheduled in vercel.json.
- Unused deps: @google/generative-ai; two toast libs (sonner, react-hot-toast).
- Migrations are manual SQL; schema.sql may lag migrations.
