-- =====================================================
-- VIDYAZO MIGRATION 002: Auth & Access Control
-- Run this in Supabase SQL Editor AFTER schema.sql
-- =====================================================

-- =====================================================
-- STEP 1: Enums
-- =====================================================

-- Profile status enum (adds status + auth_user_id alias to existing profiles table)
DO $$ BEGIN
  CREATE TYPE profile_status AS ENUM ('active', 'blocked', 'inactive');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Subscription status enum
DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM ('created', 'active', 'halted', 'cancelled', 'expired');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =====================================================
-- STEP 2: Alter existing profiles table
-- Add columns required by the new auth system
-- (keeps backward-compat with all existing queries)
-- =====================================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS status profile_status NOT NULL DEFAULT 'active',
  -- auth_user_id is an alias; the PK `id` already IS auth.users.id
  -- We expose it as a computed column view-alias below
  ADD COLUMN IF NOT EXISTS batch_id_legacy UUID; -- retain old FK if used

-- Index for fast status checks in middleware
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- =====================================================
-- STEP 3: Subscriptions table
-- Only the service role may write to this table.
-- =====================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id                      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id              UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id                 TEXT NOT NULL DEFAULT 'basic',          -- 'basic' | 'pro'
  status                  subscription_status NOT NULL DEFAULT 'created',
  razorpay_subscription_id TEXT UNIQUE,                           -- Razorpay sub ID
  razorpay_payment_id      TEXT,                                  -- latest captured payment
  current_period_end      TIMESTAMPTZ,                            -- NULL until first payment
  trial_ends_at           TIMESTAMPTZ,                            -- NULL if no trial
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_profile    ON subscriptions(profile_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status     ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_rzp_sub_id ON subscriptions(razorpay_subscription_id);

-- Auto-update updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STEP 4: Parent Links table
-- =====================================================

CREATE TABLE IF NOT EXISTS parent_links (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_profile_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_profile_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_verified         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(parent_profile_id, student_profile_id)
);

CREATE INDEX IF NOT EXISTS idx_parent_links_parent  ON parent_links(parent_profile_id);
CREATE INDEX IF NOT EXISTS idx_parent_links_student ON parent_links(student_profile_id);

-- =====================================================
-- STEP 5: Update handle_new_user trigger to include
--          email and status fields
-- =====================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, phone, full_name, email, role, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.phone, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.email, NEW.raw_user_meta_data->>'email', ''),
    'student',   -- default role on signup
    'active'     -- default status on signup
  )
  ON CONFLICT (id) DO NOTHING;  -- idempotent: ignore if profile already exists
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create trigger (DROP IF EXISTS first to avoid duplicate)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- STEP 6: Helper functions
-- =====================================================

-- Check if the calling user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if the calling user is a parent
CREATE OR REPLACE FUNCTION is_parent()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'parent'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- =====================================================
-- STEP 7: RLS Policies
-- =====================================================

-- ---- PROFILES ----
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop old policies first to ensure idempotency
DROP POLICY IF EXISTS "Users can read own profile"     ON profiles;
DROP POLICY IF EXISTS "Users can update own profile"   ON profiles;
DROP POLICY IF EXISTS "Admin can read all profiles"    ON profiles;
DROP POLICY IF EXISTS "Admin can update all profiles"  ON profiles;

-- Users can only read their own profile row
CREATE POLICY "profiles: self select"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can only update their own profile row
CREATE POLICY "profiles: self update"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can read ALL profiles
CREATE POLICY "profiles: admin select all"
  ON profiles FOR SELECT
  USING (is_admin());

-- Admins can update ALL profiles
CREATE POLICY "profiles: admin update all"
  ON profiles FOR UPDATE
  USING (is_admin());

-- Parents can read their linked students' profiles
CREATE POLICY "profiles: parent reads linked students"
  ON profiles FOR SELECT
  USING (
    is_parent() AND
    EXISTS (
      SELECT 1 FROM parent_links
      WHERE parent_profile_id = auth.uid()
        AND student_profile_id = profiles.id
        AND is_verified = TRUE
    )
  );

-- ---- SUBSCRIPTIONS ----
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Students can read their own subscription
CREATE POLICY "subscriptions: student self select"
  ON subscriptions FOR SELECT
  USING (auth.uid() = profile_id);

-- Admins can read all subscriptions
CREATE POLICY "subscriptions: admin select all"
  ON subscriptions FOR SELECT
  USING (is_admin());

-- Service role bypasses RLS entirely (no explicit policy needed for service role).
-- IMPORTANT: No INSERT/UPDATE/DELETE policy for anon or authenticated role —
-- only the service role key (used in webhook handler) can write to this table.

-- ---- BATCHES ----
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active batches"          ON batches;
DROP POLICY IF EXISTS "Admin can do everything with batches"    ON batches;

-- Students can only read batches they are enrolled in (regardless of is_active flag on batch)
CREATE POLICY "batches: enrolled student select"
  ON batches FOR SELECT
  USING (
    is_admin() OR
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.batch_id  = batches.id
        AND enrollments.student_id = auth.uid()
        AND enrollments.status      = 'active'
    )
  );

-- Admins can do everything
CREATE POLICY "batches: admin all"
  ON batches FOR ALL
  USING (is_admin());

-- ---- ENROLLMENTS ----
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can read own enrollments"         ON enrollments;
DROP POLICY IF EXISTS "Admin can do everything with enrollments"  ON enrollments;

-- Students can read their own enrollment rows (student_id is the live column name)
CREATE POLICY "enrollments: student self select"
  ON enrollments FOR SELECT
  USING (auth.uid() = student_id);

-- Admins can do everything
CREATE POLICY "enrollments: admin all"
  ON enrollments FOR ALL
  USING (is_admin());

-- ---- PARENT LINKS ----
ALTER TABLE parent_links ENABLE ROW LEVEL SECURITY;

-- Parents can see their own links
CREATE POLICY "parent_links: parent self select"
  ON parent_links FOR SELECT
  USING (auth.uid() = parent_profile_id);

-- Students can see who is linked to them
CREATE POLICY "parent_links: student self select"
  ON parent_links FOR SELECT
  USING (auth.uid() = student_profile_id);

-- Admins can do everything
CREATE POLICY "parent_links: admin all"
  ON parent_links FOR ALL
  USING (is_admin());

-- ---- STUDY MATERIALS (if table exists) ----
-- Students can only read materials belonging to their enrolled batches
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'study_materials') THEN
    EXECUTE '
      ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "study_materials: student enrolled select" ON study_materials;
      CREATE POLICY "study_materials: student enrolled select"
        ON study_materials FOR SELECT
        USING (
          is_admin() OR
          is_free = TRUE OR
          (
            batch_id IS NOT NULL AND
            EXISTS (
              SELECT 1 FROM enrollments
              WHERE enrollments.batch_id   = study_materials.batch_id
                AND enrollments.profile_id = auth.uid()
                AND enrollments.is_active   = TRUE
            )
          )
        );

      DROP POLICY IF EXISTS "study_materials: admin all" ON study_materials;
      CREATE POLICY "study_materials: admin all"
        ON study_materials FOR ALL
        USING (is_admin());
    ';
  END IF;
END $$;
