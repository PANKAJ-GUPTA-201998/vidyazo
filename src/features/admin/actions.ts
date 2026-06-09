"use server";

import { createServiceRoleClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ==========================================
// TEACHERS
// ==========================================

export async function addTeacher(data: Record<string, unknown>) {
  const supabase = await createServiceRoleClient();
  const { error } = await supabase.from("teachers").insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/teachers");
}

export async function deleteTeacher(id: string) {
  const supabase = await createServiceRoleClient();
  const { error } = await supabase.from("teachers").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/teachers");
}

// ==========================================
// RESULTS
// ==========================================

export async function addResult(data: Record<string, unknown>) {
  const supabase = await createServiceRoleClient();
  const { error } = await supabase.from("student_results").insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/results");
}

export async function deleteResult(id: string) {
  const supabase = await createServiceRoleClient();
  const { error } = await supabase.from("student_results").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/results");
}

// ==========================================
// STUDY MATERIALS
// ==========================================

export async function addMaterial(data: Record<string, unknown>) {
  const supabase = await createServiceRoleClient();
  const { error } = await supabase.from("study_materials").insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/materials");
}

export async function deleteMaterial(id: string) {
  const supabase = await createServiceRoleClient();
  const { error } = await supabase.from("study_materials").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/materials");
}
