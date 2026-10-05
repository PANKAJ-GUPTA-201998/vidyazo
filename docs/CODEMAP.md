# CODEMAP - feature -> files (paths relative to repo root). Keep <150 lines.

## Auth / access
- Middleware (auth, role redirects, subscription gate for /dashboard): src/proxy.ts
- Subscription check: src/lib/access-control.ts; API: src/app/api/subscription/status/route.ts
- Login (phone OTP): src/app/(auth)/login/page.tsx; Onboarding: src/app/(auth)/onboarding/page.tsx
- OAuth/OTP callback: src/app/api/auth/callback/route.ts
- Current user hook: src/features/auth/use-user.ts
- Supabase clients: src/lib/supabase/{client,server}.ts
- DB types: src/types/database.ts (+ src/types/index.ts)

## Marketing (public)
- Landing: src/app/page.tsx + src/components/landing/*.tsx (hero, pricing-section, navbar, faq, ...)
- Pages: src/app/(marketing)/{about,features,pricing,subjects,how-it-works,competitive-exams,direct-admission}/page.tsx
- AI reports promo: src/app/ai-reports/page.tsx
- Prices/plan text/colors: src/lib/constants.ts
- i18n (Hindi/English): src/lib/i18n.ts, src/contexts/language-context.tsx

## Student
- Layout/nav: src/app/(dashboard)/layout.tsx
- Dashboard: src/app/(dashboard)/dashboard/{page,client}.tsx
- Classes + recordings: src/app/(dashboard)/classes/*; src/lib/actions/classes.ts
- Reports: src/app/(dashboard)/reports/*; src/lib/actions/reports.ts (getMyReports)
- Study materials: src/components/dashboard/study-materials-tab.tsx; src/lib/actions/materials.ts
- Streaks/leaderboard: src/features/student-dashboard/actions/streaks.ts, components/{streak-card,leaderboard-card}.tsx
- Notifications: src/components/dashboard/notification-bell.tsx; src/lib/actions/notifications.ts

## Tests
- Take test: src/app/(dashboard)/test/[id]/{page.tsx,TestClient.tsx}
- Submit API: src/app/api/tests/submit/route.ts
- Test actions (list/create/submit/score): src/lib/actions/tests.ts
- Admin list/create: src/app/(admin)/admin/tests/{page,client}.tsx, tests/create/{page,client}.tsx
- Admin results: src/app/(admin)/admin/results/*; src/features/admin/actions.ts (addResult)

## AI reports + WhatsApp
- Report generation (Claude, sonnet-4): src/lib/actions/reports.ts (generateAIReport, generateWeeklyReports, parent tokens)
- Duplicate generator (old haiku-3): src/features/ai/actions.ts; Anthropic helper (haiku-4.5): src/features/ai/anthropic.ts
- Weekly cron: src/app/api/cron/weekly-report/route.ts
- WhatsApp sends/templates: src/lib/whatsapp.ts
- Admin reports UI: src/app/(admin)/admin/reports/*
- Parent magic-link view: src/app/(parent)/parent/report/[token]/page.tsx

## Parent
- Layout: src/app/(parent)/parent/layout.tsx; login: parent/login/page.tsx
- Dashboard: src/app/(parent)/parent/dashboard/{page,client}.tsx
- Data (children, attendance, scores, fees): src/lib/actions/parent.ts

## Payments
- Order/payment records/monthly generation: src/features/payments/actions.ts
- Razorpay helpers + signature verify: src/lib/razorpay.ts; checkout hook: src/features/payments/use-razorpay.ts
- Gate component: src/features/payments/PremiumGate.tsx
- Webhook: src/app/api/webhooks/razorpay/route.ts
- Post-checkout page: src/app/payment/verifying/page.tsx
- Monthly cron: src/app/api/cron/monthly-payments/route.ts
- Admin: src/app/(admin)/admin/payments/*

## Admin (all under src/app/(admin)/admin/, each = page.tsx + client.tsx)
- Layout: src/app/(admin)/layout.tsx; Overview: admin/page.tsx; stats: src/lib/actions/stats.ts
- students, batches -> src/features/student-dashboard/actions/students.ts
- teachers, results, materials -> src/features/admin/actions.ts
- Class reminders cron (NOT in vercel.json): src/app/api/cron/class-reminders/route.ts

## Database (run SQL manually in Supabase)
- Base schema: supabase/schema.sql; functions: supabase/functions.sql; seed: supabase/seed.sql
- Added tables (teachers, student_results, notifications, study_materials, parent_accounts, student_streaks, exam_waitlist): supabase/migrations/001_new_tables.sql
- subscriptions, parent_links, RLS/access control: supabase/migrations/002_auth_access_control.sql
- Signup trigger fix: fix_trigger.sql

## Config / infra
- Cron schedule: vercel.json; Next config: next.config.ts; shadcn: components.json
- PWA/offline page: src/app/~offline/page.tsx; root layout: src/app/layout.tsx; styles: src/app/globals.css
- UI primitives: src/components/ui/*; providers: src/components/shared/providers.tsx; utils: src/lib/utils.ts
