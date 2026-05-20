/**
 * src/types/database.ts
 *
 * Complete TypeScript interfaces for all Vidyazo database tables.
 * Follows the Supabase generated-types pattern (Database["public"]["Tables"][...]).
 *
 * ⚠️  Regenerate this file with:
 *       npx supabase gen types typescript --project-id <your-project-id> > src/types/supabase.d.ts
 *     For now, these are hand-crafted to match the schema exactly.
 */

// ============================================================
// Primitive Enums
// ============================================================

export type UserRole = "student" | "parent" | "admin";
export type ProfileStatus = "active" | "blocked" | "inactive";
export type SubscriptionStatus =
  | "created"
  | "active"
  | "halted"
  | "cancelled"
  | "expired";
export type PlanId = "basic" | "pro";

// Legacy enums (kept for backward-compat with existing code)
export type Board = "CBSE" | "ICSE" | "UP" | "MP" | "BIHAR" | "MAHARASHTRA" | "OTHER";
export type PlanType = "batch" | "hybrid" | "one_on_one";
export type EnrollmentStatus = "active" | "paused" | "cancelled";
export type ClassStatus = "scheduled" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type ScoreTrend = "improving" | "stable" | "declining";
export type Difficulty = "easy" | "medium" | "hard";
export type NotificationType =
  | "class_reminder"
  | "test_ready"
  | "report_sent"
  | "payment_due"
  | "streak";

// ============================================================
// Table: profiles
// ============================================================

export interface Profile {
  /** Primary key — mirrors auth.users.id exactly */
  id: string;
  /** Convenience alias; same as id */
  auth_user_id?: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone: string;
  status: ProfileStatus;
  // Legacy fields (from original schema, kept for compat)
  parent_phone: string | null;
  parent_email: string | null;
  class_grade: number | null;
  board: Board | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Table: subscriptions
// ============================================================

export interface Subscription {
  id: string;
  profile_id: string;
  plan_id: PlanId;
  status: SubscriptionStatus;
  /** Razorpay subscription ID (rzp_sub_...) */
  razorpay_subscription_id: string | null;
  /** Latest captured Razorpay payment ID */
  razorpay_payment_id: string | null;
  /** When the current billing period ends (null until first payment) */
  current_period_end: string | null;
  /** Free trial expiry (null if no trial offered) */
  trial_ends_at: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Table: batches
// ============================================================

export interface Batch {
  id: string;
  name: string;
  subject: string;
  /** UUID of the admin who created/owns the batch */
  admin_id: string | null;
  class_grade: number;
  board: Board;
  schedule: Record<string, string>; // { "mon": "19:00", "wed": "19:00" }
  max_capacity: number;
  current_strength: number;
  price_monthly: number; // in paise
  is_active: boolean;
  created_at: string;
}

// ============================================================
// Table: enrollments
// ============================================================

export interface Enrollment {
  id: string;
  /** FK → profiles.id — kept as student_id to match live DB column */
  student_id: string;
  /** Alias for student_id used in new access-control code */
  profile_id?: string;
  batch_id: string;
  plan: PlanType;
  status: EnrollmentStatus;
  is_active: boolean;
  price_override: number | null; // in paise
  enrolled_at: string;
}

// ============================================================
// Table: parent_links
// ============================================================

export interface ParentLink {
  id: string;
  parent_profile_id: string;
  student_profile_id: string;
  is_verified: boolean;
  created_at: string;
}

// ============================================================
// Table: classes
// ============================================================

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

// ============================================================
// Table: attendance
// ============================================================

export interface Attendance {
  id: string;
  class_id: string;
  student_id: string;
  present: boolean;
}

// ============================================================
// Table: tests
// ============================================================

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

// ============================================================
// Table: test_submissions
// ============================================================

export interface TopicScore {
  correct: number;
  total: number;
}

export interface TestSubmission {
  id: string;
  test_id: string;
  student_id: string;
  answers: Record<string, number>;
  score: number;
  total: number;
  topic_scores: Record<string, TopicScore>;
  time_taken_seconds: number | null;
  submitted_at: string;
}

// ============================================================
// Table: ai_reports
// ============================================================

export interface TopicPerformance {
  name: string;
  score: number;
  color: string;
  bgColor: string;
}

export interface ReportContent {
  overall_score: number;
  previous_score: number;
  score_trend?: ScoreTrend;
  topics: TopicPerformance[];
  weak_topics: string[];
  strong_topics: string[];
  ai_comment_hindi: string;
  teacher_note: string;
  // AI-generated narrative fields
  effort_rating?: number;
  summary_english?: string;
  summary_hindi?: string;
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

// ============================================================
// Table: payments
// ============================================================

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

// ============================================================
// Table: notifications
// ============================================================

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

// ============================================================
// Table: study_materials
// ============================================================

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

// ============================================================
// Table: parent_tokens (legacy — kept for compat)
// ============================================================

export interface ParentToken {
  id: string;
  student_id: string;
  token: string;
  is_active: boolean;
  created_at: string;
}

// ============================================================
// Joined / Composite Types
// ============================================================

/** Convenience type: Profile + its latest Subscription row */
export interface UserProfile {
  profile: Profile;
  subscription: Subscription | null;
}

/** Access-control result returned by getUserSubscriptionStatus() */
export type SubscriptionAccessReason =
  | "active"       // paid, current_period_end in the future
  | "trial"        // trial_ends_at in the future
  | "expired"      // subscription row exists but both dates are past
  | "no_subscription" // no subscription row at all
  | "blocked";     // profile.status === 'blocked' | 'inactive'

export interface SubscriptionAccessResult {
  hasAccess: boolean;
  reason: SubscriptionAccessReason;
  currentPeriodEnd: Date | null;
}

// ============================================================
// Supabase generated-types skeleton (extend as needed)
// ============================================================

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & Pick<Profile, "id">;
        Update: Partial<Profile>;
      };
      subscriptions: {
        Row: Subscription;
        Insert: Partial<Subscription> & Pick<Subscription, "profile_id" | "plan_id">;
        Update: Partial<Subscription>;
      };
      batches: {
        Row: Batch;
        Insert: Partial<Batch> & Pick<Batch, "name" | "subject" | "price_monthly">;
        Update: Partial<Batch>;
      };
      enrollments: {
        Row: Enrollment;
        Insert: Partial<Enrollment> & Pick<Enrollment, "profile_id" | "batch_id">;
        Update: Partial<Enrollment>;
      };
      parent_links: {
        Row: ParentLink;
        Insert: Omit<ParentLink, "id" | "created_at">;
        Update: Partial<ParentLink>;
      };
      payments: {
        Row: Payment;
        Insert: Partial<Payment> & Pick<Payment, "student_id" | "enrollment_id" | "amount" | "month">;
        Update: Partial<Payment>;
      };
      notifications: {
        Row: Notification;
        Insert: Partial<Notification> & Pick<Notification, "user_id" | "type" | "title">;
        Update: Partial<Notification>;
      };
      study_materials: {
        Row: StudyMaterial;
        Insert: Partial<StudyMaterial> & Pick<StudyMaterial, "title">;
        Update: Partial<StudyMaterial>;
      };
    };
    Functions: Record<string, unknown>;
    Enums: {
      user_role: UserRole;
      profile_status: ProfileStatus;
      subscription_status: SubscriptionStatus;
    };
  };
};

// ============================================================
// Legacy table types (kept for backward-compat with existing components)
// ============================================================

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

export interface StudentStreak {
  student_id: string;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
  updated_at: string;
}

export interface ParentAccount {
  id: string;
  phone: string;
  full_name: string | null;
  student_ids: string[];
  created_at: string;
}

export interface ExamWaitlist {
  id: string;
  full_name: string | null;
  phone: string | null;
  exam_type: string | null;
  created_at: string;
}

// ============================================================
// Extended / Join types (legacy, kept for backward-compat)
// ============================================================

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
