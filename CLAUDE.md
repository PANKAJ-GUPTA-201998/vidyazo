# VIDYAZO - AI-Powered Online Tuition Platform

## Project Overview
Vidyazo is an online tuition platform for Indian school students (Class 6-10).
It offers batch classes, 1-on-1 sessions, weekly AI tests, and AI-generated
progress reports sent to parents via WhatsApp.

## Tech Stack
- Frontend: Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui
- Backend: Next.js API Routes
- Database: Supabase (PostgreSQL)
- Auth: Supabase Auth (Phone OTP)
- AI: Anthropic Claude API (claude-haiku-4-5-20251001)
- Payments: Razorpay
- WhatsApp: AiSensy API
- Hosting: Vercel
- State: Zustand

## Key Business Rules
- 3 plans: Batch (Rs 599/mo), Hybrid (Rs 1099/mo), 1-on-1 (Rs 2999/mo)
- Batch max capacity: 25 students
- Weekly test every Sunday
- AI report generated Monday morning, sent to parent WhatsApp
- Parent view via magic link (no login needed)
- Admin is single user (owner/tutor)

## Coding Conventions
- Use TypeScript strict mode
- Use server components by default, 'use client' only when needed
- Use Supabase RLS for all data access
- API routes use Supabase service role for admin ops
- All prices in paise (multiply by 100 for Razorpay)
- Dates in IST (Asia/Kolkata timezone)
- Hindi support in AI reports (bilingual Hindi+English)
- Mobile-first responsive design
- Use lucide-react for icons
- Use sonner for toast notifications
- File naming: kebab-case for files, PascalCase for components

## Database Tables
profiles, batches, enrollments, classes, attendance,
tests, test_submissions, ai_reports, payments, parent_tokens

## Important Paths
- Landing: /
- Student Dashboard: /dashboard
- Take Test: /test/[id]
- Admin: /admin
- Parent View: /parent/[token]
