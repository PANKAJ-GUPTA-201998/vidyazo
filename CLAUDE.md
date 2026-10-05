# VIDYAZO - online tuition platform (Class 6-12, India)
Batch classes, 1-on-1, weekly AI tests, AI progress reports sent to parents via WhatsApp.
Live on Vercel: **push to main = production deploy.** Never push to main without being asked.

## Token rule
Before searching code, check docs/CODEMAP.md. Open only the files it points to.
Status/next work: docs/STATUS.md, docs/ROADMAP.md. Past choices: docs/DECISIONS.md.

## Stack
- Next.js 16.2 (App Router, webpack) + React 19 + TypeScript + Tailwind 4 + shadcn/ui (base-ui)
- Supabase (Postgres + RLS + phone OTP auth) via @supabase/ssr
- AI: Anthropic SDK (`@anthropic-ai/sdk`); Razorpay payments; WhatsApp via custom API (`src/lib/whatsapp.ts`)
- State: Zustand. Icons: lucide-react. Toasts: sonner (react-hot-toast also present in 2 layouts)
- AGENTS.md: this Next.js has breaking changes; check `node_modules/next/dist/docs/` before using unfamiliar APIs.

## Layout (src/)
- `app/(marketing)`, `app/page.tsx` public pages; `app/(auth)` login/onboarding
- `app/(dashboard)` student; `app/(admin)/admin` owner; `app/(parent)/parent` parent
- `app/api/{cron,webhooks,tests,subscription,auth}` route handlers
- `features/*` and `lib/actions/*` server actions (two overlapping styles, see CODEMAP)
- `components/{ui,landing,dashboard,shared}`, `lib/` (supabase, razorpay, whatsapp, access-control), `types/database.ts`
- `proxy.ts` = auth/role/subscription middleware (Next 16 name). `supabase/` = SQL schema + migrations (run manually in Supabase).
- Page pattern: `page.tsx` (server, fetch) + `client.tsx` (interactive UI).

## Commands
- `npm run dev` / `npm run build` / `npm run lint`
- No test suite exists. Verify with `npm run lint` and `npx tsc --noEmit`; build ignores TS errors (`next.config.ts`), so run tsc yourself.
- Deploy: push to `main` -> Vercel. Crons in `vercel.json` (Bearer `CRON_SECRET`).
- Env vars (no .env.example in repo): NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY,
  ANTHROPIC_API_KEY, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, NEXT_PUBLIC_RAZORPAY_KEY_ID, RAZORPAY_WEBHOOK_SECRET,
  RAZORPAY_PRO_PLAN_IDS, WHATSAPP_API_URL, WHATSAPP_API_KEY, CRON_SECRET, NEXT_PUBLIC_APP_URL

## Business rules
- Plans: Batch / Hybrid / 1-on-1. Prices live in `src/lib/constants.ts` (source of truth; paise). Batch max 25.
- Weekly test Sunday; AI report Monday (cron `0 1:30 UTC Mon`), sent to parent WhatsApp.
- Parents: magic-link report `/parent/report/[token]` (no login) plus parent login/dashboard.
- Roles: admin / parent / student (profiles.role). Admin is a single owner.

## Coding rules
- TypeScript strict; server components by default, `'use client'` only when needed.
- Supabase RLS for user data; service-role client only in server actions/API routes, never in client or proxy.
- Money in paise (Razorpay takes paise). Dates in IST (Asia/Kolkata).
- AI reports bilingual Hindi + English. Mobile-first UI.
- Files kebab-case (existing exceptions: TestClient.tsx, PremiumGate.tsx); components PascalCase.
- Keep changes small; do not add new dependencies or refactor unrelated code. Update docs/CODEMAP.md when files move.
- Because main deploys live, avoid risky changes without lint/tsc passing.
