# ROADMAP (tick tasks with [x]; /next does the first unchecked one)

## Phase 1 -
_(add tasks as `- [ ] ...`)_

## Phase 2 -
_(add tasks as `- [ ] ...`)_

## Phase 3 -
_(add tasks as `- [ ] ...`)_

## Cleanup ideas (safest first)
- [ ] Make cron routes weekly-report + monthly-payments export GET (Vercel cron uses GET); currently 405
- [ ] Add .env.example listing env vars (no code change)
- [ ] Add missing /account-suspended page (proxy redirects there)
- [x] Remove duplicate test route src/app/test/[testId] (it broke the build: ambiguous /test/[*])
- [ ] Remove unused dep @google/generative-ai; standardize on sonner (drop react-hot-toast)
- [ ] Merge duplicate generateAIReport (lib/actions/reports.ts vs features/ai/actions.ts); one model constant
- [ ] Schedule or delete api/cron/class-reminders
- [ ] Turn off ignoreBuildErrors after fixing tsc errors
- [ ] Split src/app/(admin)/admin/tests/create/client.tsx (431 lines)
- [ ] Split src/lib/actions/reports.ts (309 lines: reports vs parent tokens vs AI)
- [ ] Merge lib/actions/* and features/*/actions into one convention
- [ ] Split src/features/student-dashboard/actions/students.ts (students + batches + enrollments)
- [ ] Break up large landing/marketing pages (pricing-section 315, competitive-exams 296, subjects-section 297)
