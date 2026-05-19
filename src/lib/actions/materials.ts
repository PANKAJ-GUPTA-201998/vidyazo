"use server";

import { createClient } from "@/lib/supabase/server";

export async function getStudentMaterials() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // First, get student's profile to know class_grade and active enrollments
  const { data: profile } = await supabase
    .from("profiles")
    .select("class_grade, enrollments(batch_id, status)")
    .eq("id", user.id)
    .single();

  if (!profile) return [];

  const classGrade = profile.class_grade;
  const activeBatchIds = profile.enrollments
    .filter((e: any) => e.status === "active")
    .map((e: any) => e.batch_id);

  const isActiveSubscriber = activeBatchIds.length > 0;

  // Query study materials
  // We want materials for their class_grade, OR specific to their batch
  let query = supabase.from("study_materials").select("*");
  
  if (classGrade && activeBatchIds.length > 0) {
    query = query.or(`class_grade.eq.${classGrade},batch_id.in.(${activeBatchIds.join(",")})`);
  } else if (classGrade) {
    query = query.eq("class_grade", classGrade);
  } else if (activeBatchIds.length > 0) {
    query = query.in("batch_id", activeBatchIds);
  }

  const { data: materials, error } = await query;
  
  if (error || !materials) return [];

  // Return materials and subscriber status
  return {
    materials,
    isActiveSubscriber
  };
}
