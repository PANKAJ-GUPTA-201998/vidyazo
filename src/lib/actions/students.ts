"use server";

import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import type { Profile, Batch, Enrollment } from "@/types/database";
import { revalidatePath } from "next/cache";

// ============================================================
// STUDENT / PROFILE ACTIONS
// ============================================================

export async function getStudents() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*, enrollments(*, batch:batches(*))")
    .eq("role", "student")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getStudentById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*, enrollments(*, batch:batches(*))")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createStudent(formData: {
  full_name: string;
  phone: string;
  class_grade: number;
  board: string;
  parent_phone?: string;
}) {
  const supabase = await createServiceRoleClient();

  // Create auth user with phone
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    phone: `+91${formData.phone}`,
    phone_confirm: true,
    user_metadata: { full_name: formData.full_name },
  });

  if (authError) throw authError;

  // Update profile with additional info
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: formData.full_name,
      class_grade: formData.class_grade,
      board: formData.board,
      parent_phone: formData.parent_phone || null,
    })
    .eq("id", authUser.user.id);

  if (profileError) throw profileError;

  revalidatePath("/admin/students");
  return authUser.user;
}

export async function updateStudent(
  id: string,
  updates: Partial<Pick<Profile, "full_name" | "class_grade" | "board" | "parent_phone" | "status">>
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/students");
}

// ============================================================
// BATCH ACTIONS
// ============================================================

export async function getBatches(includeInactive = false) {
  const supabase = await createClient();
  let query = supabase
    .from("batches")
    .select("*")
    .order("created_at", { ascending: false });

  if (!includeInactive) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Batch[];
}

export async function createBatch(formData: {
  name: string;
  subject: string;
  class_grade: number;
  board: string;
  schedule: Record<string, string>;
  max_capacity: number;
  price_monthly: number;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("batches")
    .insert({
      name: formData.name,
      subject: formData.subject,
      class_grade: formData.class_grade,
      board: formData.board,
      schedule: formData.schedule,
      max_capacity: formData.max_capacity,
      price_monthly: formData.price_monthly,
    })
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/admin/batches");
  return data as Batch;
}

export async function updateBatch(id: string, updates: Partial<Batch>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("batches")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/batches");
}

// ============================================================
// ENROLLMENT ACTIONS
// ============================================================

export async function enrollStudent(formData: {
  student_id: string;
  batch_id: string;
  plan: "batch" | "hybrid" | "one_on_one";
  price_override?: number;
}) {
  const supabase = await createClient();

  // Insert enrollment
  const { data, error } = await supabase
    .from("enrollments")
    .insert(formData)
    .select()
    .single();

  if (error) throw error;

  // Increment batch strength
  await supabase.rpc("increment_batch_strength", { batch_id: formData.batch_id });

  revalidatePath("/admin/students");
  revalidatePath("/admin/batches");
  return data as Enrollment;
}

export async function updateEnrollmentStatus(
  id: string,
  status: "active" | "paused" | "cancelled"
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("enrollments")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/students");
}

export async function getMyEnrollments() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("enrollments")
    .select("*, batch:batches(*)")
    .eq("student_id", user.id)
    .eq("status", "active");

  if (error) throw error;
  return data;
}
