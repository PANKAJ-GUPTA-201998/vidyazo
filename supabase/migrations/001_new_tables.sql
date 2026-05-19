-- =====================================================
-- VIDYAZO MIGRATION 001 — New Tables + Fixes
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. FIX class_grade constraint (6-10 → 6-12)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_class_grade_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_class_grade_check CHECK (class_grade BETWEEN 6 AND 12);

-- 2. TEACHERS
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  photo_url TEXT,
  qualification TEXT,
  experience_years INTEGER,
  subjects TEXT[],
  boards TEXT[],
  intro_video_url TEXT,
  bio TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. STUDENT RESULTS / TESTIMONIALS
CREATE TABLE IF NOT EXISTS student_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  class_grade INTEGER,
  board TEXT,
  subject TEXT,
  score_before INTEGER,
  score_after INTEGER,
  exam_year INTEGER,
  parent_quote TEXT,
  student_photo_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. STUDY MATERIALS
CREATE TABLE IF NOT EXISTS study_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES batches(id),
  class_grade INTEGER,
  subject TEXT,
  topic TEXT,
  title TEXT NOT NULL,
  file_url TEXT,
  is_free BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. PARENT ACCOUNTS
CREATE TABLE IF NOT EXISTS parent_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  full_name TEXT,
  student_ids UUID[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. STUDENT STREAKS
CREATE TABLE IF NOT EXISTS student_streaks (
  student_id UUID PRIMARY KEY REFERENCES profiles(id),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date DATE,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. EXAM WAITLIST
CREATE TABLE IF NOT EXISTS exam_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  phone TEXT,
  exam_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_study_materials_batch ON study_materials(batch_id);
CREATE INDEX IF NOT EXISTS idx_study_materials_class ON study_materials(class_grade, subject);
CREATE INDEX IF NOT EXISTS idx_student_results_featured ON student_results(is_featured) WHERE is_featured = true;

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Teachers: public read
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active teachers" ON teachers
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can manage teachers" ON teachers
  FOR ALL USING (is_admin());

-- Student Results: public read
ALTER TABLE student_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read featured results" ON student_results
  FOR SELECT USING (true);
CREATE POLICY "Admin can manage results" ON student_results
  FOR ALL USING (is_admin());

-- Notifications: users read own
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admin can manage all notifications" ON notifications
  FOR ALL USING (is_admin());

-- Study Materials: authenticated read
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read materials" ON study_materials
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage materials" ON study_materials
  FOR ALL USING (is_admin());

-- Parent Accounts: own record only
ALTER TABLE parent_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can manage parent accounts" ON parent_accounts
  FOR ALL USING (is_admin());

-- Student Streaks: own record
ALTER TABLE student_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own streak" ON student_streaks
  FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Users can update own streak" ON student_streaks
  FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Admin can manage streaks" ON student_streaks
  FOR ALL USING (is_admin());

-- Exam Waitlist: insert only (no read for users)
ALTER TABLE exam_waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can join waitlist" ON exam_waitlist
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can read waitlist" ON exam_waitlist
  FOR SELECT USING (is_admin());

-- =====================================================
-- STORAGE BUCKETS (run separately if needed)
-- =====================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('teacher-photos', 'teacher-photos', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('study-materials', 'study-materials', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('student-photos', 'student-photos', true);
