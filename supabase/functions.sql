-- =====================================================
-- VIDYAZO SUPPLEMENTARY FUNCTIONS
-- Run this after schema.sql in Supabase SQL Editor
-- =====================================================

-- Function to increment batch strength (used when enrolling a student)
CREATE OR REPLACE FUNCTION increment_batch_strength(p_batch_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE batches
  SET current_strength = current_strength + 1
  WHERE id = p_batch_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement batch strength (used when removing a student)
CREATE OR REPLACE FUNCTION decrement_batch_strength(p_batch_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE batches
  SET current_strength = GREATEST(current_strength - 1, 0)
  WHERE id = p_batch_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View: Student dashboard summary
-- Returns key stats for a student
CREATE OR REPLACE FUNCTION get_student_summary(p_student_id UUID)
RETURNS TABLE (
  total_classes_attended BIGINT,
  total_tests_taken BIGINT,
  average_score NUMERIC,
  last_test_score INTEGER,
  streak_days INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM attendance WHERE student_id = p_student_id AND present = true),
    (SELECT COUNT(*) FROM test_submissions WHERE student_id = p_student_id),
    (SELECT COALESCE(AVG(score::numeric / total * 100), 0) FROM test_submissions WHERE student_id = p_student_id),
    (SELECT score FROM test_submissions WHERE student_id = p_student_id ORDER BY submitted_at DESC LIMIT 1),
    0::INTEGER; -- streak calculation is done client-side
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View: Admin dashboard stats
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS TABLE (
  total_students BIGINT,
  active_students BIGINT,
  total_revenue BIGINT,
  tests_this_month BIGINT,
  reports_sent BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM profiles WHERE role = 'student'),
    (SELECT COUNT(DISTINCT student_id) FROM enrollments WHERE status = 'active'),
    (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'paid'
     AND month = TO_CHAR(NOW(), 'YYYY-MM')),
    (SELECT COUNT(*) FROM tests
     WHERE created_at >= DATE_TRUNC('month', NOW())),
    (SELECT COUNT(*) FROM ai_reports WHERE sent_to_parent = true
     AND created_at >= DATE_TRUNC('month', NOW()));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
