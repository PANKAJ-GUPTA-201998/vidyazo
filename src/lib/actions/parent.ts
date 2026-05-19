"use server";

import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

export async function getLinkedChildren() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.phone) return [];

  // Check if they are explicitly registered in parent_accounts
  const serviceClient = await createServiceRoleClient();
  const { data: parentAccount } = await serviceClient
    .from("parent_accounts")
    .select("student_ids")
    .eq("phone", user.phone)
    .single();

  let studentIds: string[] = [];

  if (parentAccount && parentAccount.student_ids) {
    studentIds = parentAccount.student_ids;
  } else {
    // Fallback: Check profiles table for matching parent_phone
    const { data: matchingProfiles } = await serviceClient
      .from("profiles")
      .select("id")
      .eq("parent_phone", user.phone);
      
    if (matchingProfiles) {
      studentIds = matchingProfiles.map((p) => p.id);
    }
  }

  if (studentIds.length === 0) return [];

  // Fetch basic profiles for these children
  const { data: children } = await serviceClient
    .from("profiles")
    .select("id, full_name, class_grade, board, avatar_url")
    .in("id", studentIds);

  return children || [];
}

export async function getChildProfile(studentId: string) {
  const supabase = await createServiceRoleClient();
  const { data } = await supabase
    .from("profiles")
    .select("*, enrollments(*, batch(*))")
    .eq("id", studentId)
    .single();
  return data;
}

export async function getChildAttendance(studentId: string) {
  const supabase = await createServiceRoleClient();
  
  // Get this month's attendance
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data } = await supabase
    .from("attendance")
    .select("present, class:classes(scheduled_at)")
    .eq("student_id", studentId)
    .gte("class.scheduled_at", startOfMonth.toISOString());
    
  return data || [];
}

export async function getChildTestScores(studentId: string) {
  const supabase = await createServiceRoleClient();
  const { data } = await supabase
    .from("test_submissions")
    .select("score, total, submitted_at, test:tests(title, week_number)")
    .eq("student_id", studentId)
    .order("submitted_at", { ascending: false })
    .limit(4);
  return data || [];
}

export async function getChildUpcomingClasses(studentId: string) {
  const supabase = await createServiceRoleClient();
  
  // Get enrolled active batches
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("batch_id")
    .eq("student_id", studentId)
    .eq("status", "active");
    
  if (!enrollments || enrollments.length === 0) return [];
  const batchIds = enrollments.map((e) => e.batch_id);

  // Get upcoming classes
  const now = new Date().toISOString();
  const { data } = await supabase
    .from("classes")
    .select("id, title, topic, scheduled_at, meet_link, batch:batches(subject)")
    .in("batch_id", batchIds)
    .eq("status", "scheduled")
    .gte("scheduled_at", now)
    .order("scheduled_at", { ascending: true })
    .limit(3);
    
  return data || [];
}

export async function getChildFeeStatus(studentId: string) {
  const supabase = await createServiceRoleClient();
  
  const now = new Date();
  const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const { data } = await supabase
    .from("payments")
    .select("*")
    .eq("student_id", studentId)
    .eq("month", monthStr)
    .single();
    
  return data || { status: "pending", amount: 0, month: monthStr };
}
