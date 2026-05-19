-- =====================================================
-- VIDYAZO DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. PROFILES (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'parent', 'admin')),
  parent_phone TEXT,
  parent_email TEXT,
  class_grade INTEGER CHECK (class_grade >= 6 AND class_grade <= 10),
  board TEXT CHECK (board IN ('CBSE', 'ICSE', 'UP', 'MP', 'BIHAR', 'MAHARASHTRA', 'OTHER')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BATCHES
CREATE TABLE batches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  class_grade INTEGER NOT NULL,
  board TEXT NOT NULL,
  schedule JSONB NOT NULL DEFAULT '{}',
  max_capacity INTEGER DEFAULT 25,
  current_strength INTEGER DEFAULT 0,
  price_monthly INTEGER NOT NULL, -- in paise
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ENROLLMENTS
CREATE TABLE enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('batch', 'hybrid', 'one_on_one')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  price_override INTEGER, -- in paise, for founding members
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, batch_id)
);

-- 4. CLASSES
CREATE TABLE classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  meet_link TEXT,
  recording_url TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ATTENDANCE
CREATE TABLE attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  present BOOLEAN DEFAULT FALSE,
  UNIQUE(class_id, student_id)
);

-- 6. TESTS
CREATE TABLE tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  week_number INTEGER NOT NULL,
  questions JSONB NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TEST SUBMISSIONS
CREATE TABLE test_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  topic_scores JSONB NOT NULL,
  time_taken_seconds INTEGER,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(test_id, student_id)
);

-- 8. AI REPORTS
CREATE TABLE ai_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  week_start DATE NOT NULL,
  content JSONB NOT NULL,
  sent_to_parent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PAYMENTS
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL, -- in paise
  month TEXT NOT NULL, -- "2026-05"
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. PARENT TOKENS
CREATE TABLE parent_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  token TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_batch ON enrollments(batch_id);
CREATE INDEX idx_classes_batch ON classes(batch_id);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_test_submissions_student ON test_submissions(student_id);
CREATE INDEX idx_test_submissions_test ON test_submissions(test_id);
CREATE INDEX idx_ai_reports_student ON ai_reports(student_id);
CREATE INDEX idx_payments_student ON payments(student_id);
CREATE INDEX idx_parent_tokens_token ON parent_tokens(token);

-- =====================================================
-- UPDATED_AT TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =====================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, phone, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.phone, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_tokens ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES POLICIES
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
CREATE POLICY "Admin can read all profiles" ON profiles
  FOR SELECT USING (is_admin());
CREATE POLICY "Admin can update all profiles" ON profiles
  FOR UPDATE USING (is_admin());

-- BATCHES POLICIES
CREATE POLICY "Anyone can read active batches" ON batches
  FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admin can do everything with batches" ON batches
  FOR ALL USING (is_admin());

-- ENROLLMENTS POLICIES
CREATE POLICY "Students can read own enrollments" ON enrollments
  FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Admin can do everything with enrollments" ON enrollments
  FOR ALL USING (is_admin());

-- CLASSES POLICIES
CREATE POLICY "Students can read classes for enrolled batches" ON classes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.batch_id = classes.batch_id
      AND enrollments.student_id = auth.uid()
      AND enrollments.status = 'active'
    )
  );
CREATE POLICY "Admin can do everything with classes" ON classes
  FOR ALL USING (is_admin());

-- ATTENDANCE POLICIES
CREATE POLICY "Students can read own attendance" ON attendance
  FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Admin can do everything with attendance" ON attendance
  FOR ALL USING (is_admin());

-- TESTS POLICIES
CREATE POLICY "Students can read active tests for their batches" ON tests
  FOR SELECT USING (
    is_active = TRUE AND
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.batch_id = tests.batch_id
      AND enrollments.student_id = auth.uid()
      AND enrollments.status = 'active'
    )
  );
CREATE POLICY "Admin can do everything with tests" ON tests
  FOR ALL USING (is_admin());

-- TEST SUBMISSIONS POLICIES
CREATE POLICY "Students can read own submissions" ON test_submissions
  FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can insert own submission" ON test_submissions
  FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Admin can read all submissions" ON test_submissions
  FOR SELECT USING (is_admin());

-- AI REPORTS POLICIES
CREATE POLICY "Students can read own reports" ON ai_reports
  FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Admin can do everything with reports" ON ai_reports
  FOR ALL USING (is_admin());

-- PAYMENTS POLICIES
CREATE POLICY "Students can read own payments" ON payments
  FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Admin can do everything with payments" ON payments
  FOR ALL USING (is_admin());

-- PARENT TOKENS - service role only (no direct user access)
CREATE POLICY "Admin can manage parent tokens" ON parent_tokens
  FOR ALL USING (is_admin());



