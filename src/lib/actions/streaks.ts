"use server";

import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

// ============================================================
// UPDATE STREAK (call on dashboard visit / class attendance / test submit)
// ============================================================

export async function updateStreak(studentId?: string) {
  const supabase = await createClient();

  let userId = studentId;
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    userId = user.id;
  }

  const serviceClient = await createServiceRoleClient();
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // Get current streak record
  const { data: existing } = await serviceClient
    .from("student_streaks")
    .select("*")
    .eq("student_id", userId)
    .single();

  if (!existing) {
    // Create new streak record
    const { data } = await serviceClient
      .from("student_streaks")
      .insert({
        student_id: userId,
        current_streak: 1,
        longest_streak: 1,
        last_active_date: today,
      })
      .select()
      .single();
    return data;
  }

  // Already active today
  if (existing.last_active_date === today) {
    return existing;
  }

  // Check if yesterday was active (streak continues)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  let newStreak: number;
  if (existing.last_active_date === yesterdayStr) {
    // Streak continues
    newStreak = existing.current_streak + 1;
  } else {
    // Streak broken, reset to 1
    newStreak = 1;
  }

  const newLongest = Math.max(newStreak, existing.longest_streak);

  const { data } = await serviceClient
    .from("student_streaks")
    .update({
      current_streak: newStreak,
      longest_streak: newLongest,
      last_active_date: today,
      updated_at: new Date().toISOString(),
    })
    .eq("student_id", userId)
    .select()
    .single();

  return data;
}

// ============================================================
// GET STREAK (for current user)
// ============================================================

export async function getStreak() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("student_streaks")
    .select("*")
    .eq("student_id", user.id)
    .single();

  return data;
}

// ============================================================
// GET LEADERBOARD (for a batch, current week)
// ============================================================

export async function getLeaderboard(batchId: string) {
  const serviceClient = await createServiceRoleClient();

  // Get all active students in the batch
  const { data: enrollments } = await serviceClient
    .from("enrollments")
    .select("student_id, profile:profiles(id, full_name)")
    .eq("batch_id", batchId)
    .eq("status", "active");

  if (!enrollments || enrollments.length === 0) return [];

  // Get this week's start date (Monday)
  const now = new Date();
  const dayOfWeek = now.getDay();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  weekStart.setHours(0, 0, 0, 0);

  const results = [];

  for (const enrollment of enrollments) {
    const studentId = enrollment.student_id;
    const profile = enrollment.profile as { id: string; full_name: string } | null;

    // Get test submissions this week
    const { data: submissions } = await serviceClient
      .from("test_submissions")
      .select("score, total")
      .eq("student_id", studentId)
      .gte("submitted_at", weekStart.toISOString());

    // Get attendance this week
    const { data: attendance } = await serviceClient
      .from("attendance")
      .select("present, class:classes(scheduled_at)")
      .eq("student_id", studentId);

    // Calculate test average
    let testAvg = 0;
    if (submissions && submissions.length > 0) {
      const totalScore = submissions.reduce((a, s) => a + s.score, 0);
      const totalPossible = submissions.reduce((a, s) => a + s.total, 0);
      testAvg = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;
    }

    // Calculate attendance %
    let attendPct = 0;
    if (attendance && attendance.length > 0) {
      const present = attendance.filter((a) => a.present).length;
      attendPct = (present / attendance.length) * 100;
    }

    // Composite score: test avg (60%) + attendance (40%)
    const compositeScore = Math.round(testAvg * 0.6 + attendPct * 0.4);

    results.push({
      studentId,
      name: profile?.full_name || "Student",
      firstName: (profile?.full_name || "Student").split(" ")[0],
      testAvg: Math.round(testAvg),
      attendancePct: Math.round(attendPct),
      compositeScore,
    });
  }

  // Sort by composite score descending
  results.sort((a, b) => b.compositeScore - a.compositeScore);

  return results.map((r, i) => ({ ...r, rank: i + 1 }));
}
