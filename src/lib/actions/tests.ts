"use server";

import { createClient } from "@/lib/supabase/server";
import type { Test, QuestionOption, TestSubmission, TopicScore } from "@/types/database";
import { revalidatePath } from "next/cache";
import { generateAIReport } from "./ai";

// ============================================================
// TEST ACTIONS (Admin)
// ============================================================

export async function getTests(batchId?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("tests")
    .select("*, batch:batches(name)")
    .order("created_at", { ascending: false });

  if (batchId) {
    query = query.eq("batch_id", batchId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getTestById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tests")
    .select("*, batch:batches(name, class_grade, board)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createTest(formData: {
  batch_id: string;
  title: string;
  week_number: number;
  questions: QuestionOption[];
  duration_minutes: number;
  is_active: boolean;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tests")
    .insert({
      batch_id: formData.batch_id,
      title: formData.title,
      week_number: formData.week_number,
      questions: formData.questions,
      duration_minutes: formData.duration_minutes,
      is_active: formData.is_active,
    })
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/admin/tests");
  return data as Test;
}

export async function toggleTestActive(id: string, is_active: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("tests")
    .update({ is_active })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/tests");
}

export async function getTestSubmissions(testId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("test_submissions")
    .select("*, profile:profiles(full_name, phone)")
    .eq("test_id", testId)
    .order("submitted_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getTestSubmissionCount(testId: string) {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("test_submissions")
    .select("*", { count: "exact", head: true })
    .eq("test_id", testId);

  if (error) throw error;
  return count || 0;
}

// ============================================================
// TEST TAKING (Student)
// ============================================================

export async function getActiveTestForStudent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Get student's active enrollments
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("batch_id")
    .eq("student_id", user.id)
    .eq("status", "active");

  if (!enrollments || enrollments.length === 0) return null;

  const batchIds = enrollments.map((e) => e.batch_id);

  // Get active tests for those batches that student hasn't submitted yet
  const { data: tests, error } = await supabase
    .from("tests")
    .select("*")
    .in("batch_id", batchIds)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) throw error;
  if (!tests || tests.length === 0) return null;

  const test = tests[0];

  // Check if already submitted
  const { data: existing } = await supabase
    .from("test_submissions")
    .select("id")
    .eq("test_id", test.id)
    .eq("student_id", user.id)
    .single();

  if (existing) return null; // Already submitted

  return test as Test;
}

export async function submitTest(formData: {
  test_id: string;
  answers: Record<string, number>;
  time_taken_seconds: number;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Fetch the test to get correct answers
  const { data: test, error: testError } = await supabase
    .from("tests")
    .select("questions")
    .eq("id", formData.test_id)
    .single();

  if (testError || !test) throw testError || new Error("Test not found");

  const questions = test.questions as QuestionOption[];

  // Calculate score and topic scores
  let score = 0;
  const total = questions.length;
  const topicScores: Record<string, TopicScore> = {};

  questions.forEach((q) => {
    // Initialize topic if not exists
    if (!topicScores[q.topic]) {
      topicScores[q.topic] = { correct: 0, total: 0 };
    }
    topicScores[q.topic].total++;

    // Check answer
    const studentAnswer = formData.answers[q.id];
    if (studentAnswer === q.correct) {
      score++;
      topicScores[q.topic].correct++;
    }
  });

  // Insert submission
  const { data, error } = await supabase
    .from("test_submissions")
    .insert({
      test_id: formData.test_id,
      student_id: user.id,
      answers: formData.answers,
      score,
      total,
      topic_scores: topicScores,
      time_taken_seconds: formData.time_taken_seconds,
    })
    .select()
    .single();

  if (error) throw error;

  // Trigger AI Report generation asynchronously (don't block the response)
  // In a real prod setup, this should be an edge function or queue
  generateAIReport(data.id).catch(err => {
    console.error("Background AI generation failed:", err);
  });

  revalidatePath("/dashboard");
  return data as TestSubmission;
}

// ============================================================
// STUDENT TEST HISTORY
// ============================================================

export async function getMyTestSubmissions() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("test_submissions")
    .select("*, test:tests(title, week_number, batch_id)")
    .eq("student_id", user.id)
    .order("submitted_at", { ascending: false });

  if (error) throw error;
  return data;
}
