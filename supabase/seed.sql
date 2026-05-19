-- =====================================================
-- VIDYAZO SEED DATA
-- Run this AFTER schema.sql and functions.sql
-- Creates demo data for testing
-- =====================================================

-- NOTE: You must first create an admin user in Supabase Auth Dashboard
-- Then update the UUID below to match your admin user's ID.

-- =====================================================
-- 1. BATCHES (no auth dependency)
-- =====================================================
INSERT INTO batches (id, name, subject, class_grade, board, schedule, max_capacity, current_strength, price_monthly, is_active) VALUES
  ('b0000001-0000-0000-0000-000000000001', 'Class 10 Math - Evening', 'Mathematics', 10, 'CBSE',
   '{"mon": "19:00", "wed": "19:00", "fri": "19:00"}'::jsonb, 25, 18, 59900, true),

  ('b0000001-0000-0000-0000-000000000002', 'Class 9 Science - Morning', 'Science', 9, 'ICSE',
   '{"tue": "10:00", "thu": "10:00", "sat": "10:00"}'::jsonb, 25, 12, 59900, true),

  ('b0000001-0000-0000-0000-000000000003', 'Class 8 Math - Afternoon', 'Mathematics', 8, 'CBSE',
   '{"mon": "16:00", "wed": "16:00", "fri": "16:00"}'::jsonb, 25, 8, 59900, true),

  ('b0000001-0000-0000-0000-000000000004', 'Class 10 Science - Morning', 'Science', 10, 'CBSE',
   '{"tue": "10:00", "thu": "10:00", "sat": "10:00"}'::jsonb, 25, 15, 59900, true),

  ('b0000001-0000-0000-0000-000000000005', 'Class 7 Math', 'Mathematics', 7, 'BIHAR',
   '{"tue": "17:00", "thu": "17:00"}'::jsonb, 20, 4, 39900, true);

-- =====================================================
-- 2. CLASSES (upcoming schedule)
-- =====================================================
INSERT INTO classes (batch_id, title, topic, scheduled_at, meet_link, status) VALUES
  -- Class 10 Math
  ('b0000001-0000-0000-0000-000000000001', 'Quadratic Equations - Part 3', 'Algebra',
   NOW() + INTERVAL '1 hour', 'https://meet.google.com/abc-defg-hij', 'scheduled'),
  ('b0000001-0000-0000-0000-000000000001', 'Coordinate Geometry Basics', 'Geometry',
   NOW() + INTERVAL '2 days', 'https://meet.google.com/abc-defg-hij', 'scheduled'),
  ('b0000001-0000-0000-0000-000000000001', 'Probability & Statistics', 'Statistics',
   NOW() + INTERVAL '4 days', 'https://meet.google.com/abc-defg-hij', 'scheduled'),

  -- Past completed classes
  ('b0000001-0000-0000-0000-000000000001', 'Quadratic Equations - Part 2', 'Algebra',
   NOW() - INTERVAL '3 days', 'https://meet.google.com/abc-defg-hij', 'completed'),
  ('b0000001-0000-0000-0000-000000000001', 'Linear Equations Revision', 'Algebra',
   NOW() - INTERVAL '5 days', 'https://meet.google.com/abc-defg-hij', 'completed'),
  ('b0000001-0000-0000-0000-000000000001', 'Trigonometry - Sin, Cos, Tan', 'Trigonometry',
   NOW() - INTERVAL '8 days', 'https://meet.google.com/abc-defg-hij', 'completed'),

  -- Class 9 Science
  ('b0000001-0000-0000-0000-000000000002', 'Force and Laws of Motion', 'Physics',
   NOW() + INTERVAL '1 day', 'https://meet.google.com/xyz-abcd-efg', 'scheduled'),
  ('b0000001-0000-0000-0000-000000000002', 'Atoms and Molecules', 'Chemistry',
   NOW() + INTERVAL '3 days', 'https://meet.google.com/xyz-abcd-efg', 'scheduled');

-- Add recording URLs to completed classes
UPDATE classes SET recording_url = 'https://youtube.com/watch?v=example1' WHERE title = 'Quadratic Equations - Part 2';
UPDATE classes SET recording_url = 'https://youtube.com/watch?v=example2' WHERE title = 'Linear Equations Revision';
UPDATE classes SET recording_url = 'https://youtube.com/watch?v=example3' WHERE title = 'Trigonometry - Sin, Cos, Tan';

-- =====================================================
-- 3. SAMPLE TEST
-- =====================================================
INSERT INTO tests (id, batch_id, title, week_number, duration_minutes, is_active, questions) VALUES
  ('f0000001-0000-0000-0000-000000000001',
   'b0000001-0000-0000-0000-000000000001',
   'Weekly Math Test - Week 5', 5, 30, true,
   '[
     {"id":"q1","question":"If the roots of x² - 5x + 6 = 0 are α and β, what is the value of α + β?","options":["5","6","-5","3"],"correct":0,"topic":"Algebra","difficulty":"medium"},
     {"id":"q2","question":"The distance between points A(2,3) and B(5,7) is:","options":["5","4","7","3"],"correct":0,"topic":"Geometry","difficulty":"medium"},
     {"id":"q3","question":"Sin 30° × Cos 60° + Cos 30° × Sin 60° = ?","options":["1","0","√3/2","1/2"],"correct":0,"topic":"Trigonometry","difficulty":"medium"},
     {"id":"q4","question":"The mean of first 10 natural numbers is:","options":["5.5","5","6","4.5"],"correct":0,"topic":"Statistics","difficulty":"easy"},
     {"id":"q5","question":"If 2x + 3 = 15, then x = ?","options":["6","5","7","9"],"correct":0,"topic":"Algebra","difficulty":"easy"},
     {"id":"q6","question":"The area of a circle with radius 7 cm is (π = 22/7):","options":["154 cm²","144 cm²","49 cm²","22 cm²"],"correct":0,"topic":"Geometry","difficulty":"medium"},
     {"id":"q7","question":"Tan 45° = ?","options":["1","0","√2","1/√2"],"correct":0,"topic":"Trigonometry","difficulty":"easy"},
     {"id":"q8","question":"Mode of {2, 3, 4, 3, 5, 3, 6} is:","options":["3","4","5","2"],"correct":0,"topic":"Statistics","difficulty":"easy"},
     {"id":"q9","question":"Factorize: x² - 9","options":["(x+3)(x-3)","(x+9)(x-1)","(x+3)²","(x-3)²"],"correct":0,"topic":"Algebra","difficulty":"medium"},
     {"id":"q10","question":"The sum of angles of a triangle is:","options":["180°","360°","90°","270°"],"correct":0,"topic":"Geometry","difficulty":"easy"},
     {"id":"q11","question":"Cos 0° = ?","options":["1","0","-1","1/2"],"correct":0,"topic":"Trigonometry","difficulty":"easy"},
     {"id":"q12","question":"Median of {1, 2, 3, 4, 5} is:","options":["3","2","4","2.5"],"correct":0,"topic":"Statistics","difficulty":"easy"},
     {"id":"q13","question":"If a:b = 2:3 and b:c = 4:5, then a:b:c = ?","options":["8:12:15","2:3:5","4:6:5","2:4:5"],"correct":0,"topic":"Algebra","difficulty":"hard"},
     {"id":"q14","question":"Perimeter of a square with side 8 cm is:","options":["32 cm","64 cm","16 cm","24 cm"],"correct":0,"topic":"Geometry","difficulty":"easy"},
     {"id":"q15","question":"Sin²θ + Cos²θ = ?","options":["1","0","2","Sin2θ"],"correct":0,"topic":"Trigonometry","difficulty":"easy"}
   ]'::jsonb);

-- =====================================================
-- INSTRUCTIONS FOR ADMIN SETUP
-- =====================================================
-- After running this seed:
-- 1. Create an admin user via Supabase Auth Dashboard (use phone +91XXXXXXXXXX)
-- 2. Update the admin's profile: UPDATE profiles SET role = 'admin' WHERE phone = 'XXXXXXXXXX';
-- 3. Create test students via the Admin Panel or Auth Dashboard
-- 4. Enroll students into batches via Admin Panel
