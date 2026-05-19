"use server";

import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import type { AIReport, ReportContent } from "@/types/database";
import { revalidatePath } from "next/cache";

// ============================================================
// AI REPORT ACTIONS (Admin)
// ============================================================

export async function getReports(weekStart?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("ai_reports")
    .select("*, profile:profiles(full_name, class_grade, board, parent_phone)")
    .order("created_at", { ascending: false });

  if (weekStart) {
    query = query.eq("week_start", weekStart);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getReportById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ai_reports")
    .select("*, profile:profiles(full_name, class_grade, board)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function markReportSent(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("ai_reports")
    .update({
      sent_to_parent: true,
      sent_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/reports");
}

export async function createReport(formData: {
  student_id: string;
  week_start: string;
  content: ReportContent;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ai_reports")
    .insert(formData)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/admin/reports");
  return data as AIReport;
}

// ============================================================
// GENERATE AI REPORT (uses Claude)
// ============================================================

export async function generateAIReport(studentId: string, weekStart: string) {
  const supabase = await createServiceRoleClient();

  // Fetch student profile
  const { data: student } = await supabase
    .from("profiles")
    .select("full_name, class_grade, board")
    .eq("id", studentId)
    .single();

  if (!student) throw new Error("Student not found");

  // Fetch recent test submissions
  const { data: submissions } = await supabase
    .from("test_submissions")
    .select("score, total, topic_scores, submitted_at")
    .eq("student_id", studentId)
    .order("submitted_at", { ascending: false })
    .limit(4);

  // Fetch attendance
  const { count: attendanceCount } = await supabase
    .from("attendance")
    .select("*", { count: "exact", head: true })
    .eq("student_id", studentId)
    .eq("present", true);

  // Build prompt for Claude
  const prompt = `You are an AI tutor analyzing a student's weekly performance.
Generate a report in JSON format for the parent.

Student: ${student.full_name}
Class: ${student.class_grade}
Board: ${student.board}
Week: ${weekStart}

Recent Test Submissions:
${JSON.stringify(submissions || [], null, 2)}

Attendance this period: ${attendanceCount || 0} classes attended

Generate a JSON report with this exact structure:
{
  "overall_score": 85,
  "previous_score": 80,
  "topics": [
    { "name": "Mathematics", "score": 90, "color": "bg-blue-500", "bgColor": "bg-blue-100" },
    { "name": "English", "score": 75, "color": "bg-orange-500", "bgColor": "bg-orange-100" },
    { "name": "Sanskrit", "score": 95, "color": "bg-green-500", "bgColor": "bg-green-100" }
  ],
  "weak_topics": ["English Grammar"],
  "strong_topics": ["Sanskrit", "Maths"],
  "ai_comment_hindi": "2-3 sentences summary in Hindi/Hinglish for the parent",
  "teacher_note": "1 sentence note for the teacher"
}

Be encouraging but honest. Use simple Hindi/Hinglish that parents understand.
Respond ONLY with valid JSON, no extra text.`;

  // Call Claude API
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey || anthropicKey === "your_anthropic_key") {
    // Return a mock report if API key is not configured
    const mockContent: ReportContent = {
      overall_score: 85,
      previous_score: 80,
      topics: [
        { name: "Mathematics", score: 90, color: "bg-blue-500", bgColor: "bg-blue-100" },
        { name: "English", score: 75, color: "bg-orange-500", bgColor: "bg-orange-100" },
        { name: "Sanskrit", score: 95, color: "bg-green-500", bgColor: "bg-green-100" }
      ],
      weak_topics: ["English Grammar", "Maths: Trigonometry"],
      strong_topics: ["Sanskrit Vyakaranam", "Maths: Algebra"],
      ai_comment_hindi: `${student.full_name} ne is hafte Mathematics aur Sanskrit mein bahut achha perform kiya hai. English Grammar pe thoda aur dhyan dene ki zaroorat hai. Overall progress badhiya hai!`,
      teacher_note: "Focus on English grammar exercises and provide extra trigonometry worksheets.",
    };
    return createReport({
      student_id: studentId,
      week_start: weekStart,
      content: mockContent,
    });
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": anthropicKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const result = await response.json();
  const content = JSON.parse(
    result.content[0].text
  ) as ReportContent;

  return createReport({
    student_id: studentId,
    week_start: weekStart,
    content,
  });
}

// ============================================================
// BATCH GENERATE REPORTS FOR ALL STUDENTS
// ============================================================

export async function generateWeeklyReports(weekStart: string) {
  const supabase = await createServiceRoleClient();

  // Get all active students
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("student_id")
    .eq("status", "active");

  if (!enrollments) return 0;

  // Check existing reports for this week
  const { data: existingReports } = await supabase
    .from("ai_reports")
    .select("student_id")
    .eq("week_start", weekStart);

  const existingStudentIds = new Set(
    existingReports?.map((r) => r.student_id) || []
  );

  const uniqueStudentIds = [
    ...new Set(enrollments.map((e) => e.student_id)),
  ].filter((id) => !existingStudentIds.has(id));

  // Generate reports for each student
  let generated = 0;
  for (const studentId of uniqueStudentIds) {
    try {
      await generateAIReport(studentId, weekStart);
      generated++;
    } catch (err) {
      console.error(`Failed to generate report for ${studentId}:`, err);
    }
  }

  revalidatePath("/admin/reports");
  return generated;
}

// ============================================================
// STUDENT REPORT VIEWS
// ============================================================

export async function getMyReports() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("ai_reports")
    .select("*")
    .eq("student_id", user.id)
    .order("week_start", { ascending: false });

  if (error) throw error;
  return data as AIReport[];
}

// ============================================================
// PARENT REPORT (Public - via magic token)
// ============================================================

export async function getReportByParentToken(token: string) {
  const supabase = await createServiceRoleClient();

  // Lookup parent token
  const { data: tokenRecord, error: tokenError } = await supabase
    .from("parent_tokens")
    .select("student_id, is_active")
    .eq("token", token)
    .single();

  if (tokenError || !tokenRecord || !tokenRecord.is_active) {
    return null;
  }

  // Get latest report for this student
  const { data: report, error: reportError } = await supabase
    .from("ai_reports")
    .select("*, profile:profiles(full_name, class_grade, board)")
    .eq("student_id", tokenRecord.student_id)
    .eq("sent_to_parent", true)
    .order("week_start", { ascending: false })
    .limit(1)
    .single();

  if (reportError) return null;
  return report;
}

// ============================================================
// PARENT TOKEN MANAGEMENT
// ============================================================

export async function createParentToken(studentId: string) {
  const supabase = await createServiceRoleClient();

  // Generate unique token
  const token = crypto.randomUUID().replace(/-/g, "").slice(0, 16);

  const { data, error } = await supabase
    .from("parent_tokens")
    .insert({ student_id: studentId, token })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getParentToken(studentId: string) {
  const supabase = await createServiceRoleClient();

  const { data } = await supabase
    .from("parent_tokens")
    .select("token")
    .eq("student_id", studentId)
    .eq("is_active", true)
    .single();

  return data?.token || null;
}
