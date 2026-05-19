// Database types matching Supabase schema

export type UserRole = "student" | "parent" | "admin";
export type Board = "CBSE" | "ICSE" | "UP" | "MP" | "BIHAR" | "MAHARASHTRA" | "OTHER";
export type PlanType = "batch" | "hybrid" | "one_on_one";
export type EnrollmentStatus = "active" | "paused" | "cancelled";
export type ClassStatus = "scheduled" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type ScoreTrend = "improving" | "stable" | "declining";
export type Difficulty = "easy" | "medium" | "hard";

export interface Profile {
  id: string;
  phone: string;
  full_name: string;
  role: UserRole;
  parent_phone: string | null;
  class_grade: number | null;
  board: Board | null;
  batch_id: string | null;
  is_active: boolean;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Batch {
  id: string;
  name: string;
  subject: string;
  class_grade: number;
  board: Board;
  schedule: Record<string, string>; // e.g. {"mon": "19:00", "wed": "19:00"}
  max_capacity: number;
  current_strength: number;
  price_monthly: number; // in paise
  is_active: boolean;
  created_at: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  batch_id: string;
  plan: PlanType;
  status: EnrollmentStatus;
  price_override: number | null; // in paise, for founding members
  joined_at: string;
}

export interface Class {
  id: string;
  batch_id: string;
  title: string;
  topic: string;
  scheduled_at: string;
  meet_link: string | null;
  recording_url: string | null;
  status: ClassStatus;
  created_at: string;
}

export interface Attendance {
  id: string;
  class_id: string;
  student_id: string;
  present: boolean;
}

export interface QuestionOption {
  id: string;
  question: string;
  options: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
  topic: string;
  difficulty: Difficulty;
}

export interface Test {
  id: string;
  batch_id: string;
  title: string;
  week_number: number;
  questions: QuestionOption[];
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
}

export interface TopicScore {
  correct: number;
  total: number;
}

export interface TestSubmission {
  id: string;
  test_id: string;
  student_id: string;
  answers: Record<string, number>; // { question_id: selected_option_index }
  score: number;
  total: number;
  topic_scores: Record<string, TopicScore>;
  time_taken_seconds: number | null;
  submitted_at: string;
}

export interface TopicPerformance {
  name: string;
  score: number;
  color: string;
  bgColor: string;
}

export interface ReportContent {
  overall_score: number;
  previous_score: number;
  topics: TopicPerformance[];
  weak_topics: string[];
  strong_topics: string[];
  ai_comment_hindi: string;
  teacher_note: string;
}

export interface AIReport {
  id: string;
  student_id: string;
  week_start: string;
  content: ReportContent;
  sent_to_parent: boolean;
  sent_at: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  student_id: string;
  enrollment_id: string;
  amount: number; // in paise
  month: string; // "2026-05"
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  status: PaymentStatus;
  paid_at: string | null;
  created_at: string;
}

export interface ParentToken {
  id: string;
  student_id: string;
  token: string;
  is_active: boolean;
  created_at: string;
}

// Extended types with joins
export interface EnrollmentWithBatch extends Enrollment {
  batch: Batch;
}

export interface EnrollmentWithStudent extends Enrollment {
  profile: Profile;
}

export interface ClassWithBatch extends Class {
  batch: Batch;
}

export interface TestSubmissionWithTest extends TestSubmission {
  test: Test;
}

// ============================================================
// NEW TABLES (Migration 001)
// ============================================================

export type NotificationType = "class_reminder" | "test_ready" | "report_sent" | "payment_due" | "streak";

export interface Teacher {
  id: string;
  full_name: string;
  photo_url: string | null;
  qualification: string | null;
  experience_years: number | null;
  subjects: string[];
  boards: string[];
  intro_video_url: string | null;
  bio: string | null;
  is_active: boolean;
  created_at: string;
}

export interface StudentResult {
  id: string;
  student_name: string;
  class_grade: number | null;
  board: string | null;
  subject: string | null;
  score_before: number | null;
  score_after: number | null;
  exam_year: number | null;
  parent_quote: string | null;
  student_photo_url: string | null;
  is_featured: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string | null;
  is_read: boolean;
  action_url: string | null;
  created_at: string;
}

export interface StudyMaterial {
  id: string;
  batch_id: string | null;
  class_grade: number | null;
  subject: string | null;
  topic: string | null;
  title: string;
  file_url: string | null;
  is_free: boolean;
  created_at: string;
}

export interface ParentAccount {
  id: string;
  phone: string;
  full_name: string | null;
  student_ids: string[];
  created_at: string;
}

export interface StudentStreak {
  student_id: string;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
  updated_at: string;
}

export interface ExamWaitlist {
  id: string;
  full_name: string | null;
  phone: string | null;
  exam_type: string | null;
  created_at: string;
}
