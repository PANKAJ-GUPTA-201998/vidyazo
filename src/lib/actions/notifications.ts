"use server";

import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { NotificationType } from "@/types/database";

// ============================================================
// CREATE NOTIFICATION (admin/system use)
// ============================================================

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  actionUrl?: string
) {
  const supabase = await createServiceRoleClient();
  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    type,
    title,
    message,
    action_url: actionUrl || null,
  });
  if (error) {
    console.error("Failed to create notification:", error);
    throw error;
  }
}

// ============================================================
// BATCH CREATE NOTIFICATIONS (for all students in a batch)
// ============================================================

export async function createBatchNotifications(
  batchId: string,
  type: NotificationType,
  title: string,
  message: string,
  actionUrl?: string
) {
  const supabase = await createServiceRoleClient();

  // Get all active students in this batch
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("student_id")
    .eq("batch_id", batchId)
    .eq("status", "active");

  if (!enrollments || enrollments.length === 0) return 0;

  const notifications = enrollments.map((e) => ({
    user_id: e.student_id,
    type,
    title,
    message,
    action_url: actionUrl || null,
  }));

  const { error } = await supabase.from("notifications").insert(notifications);
  if (error) {
    console.error("Failed to create batch notifications:", error);
    throw error;
  }
  return notifications.length;
}

// ============================================================
// GET UNREAD NOTIFICATIONS (for current user)
// ============================================================

export async function getUnreadNotifications() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_read", false)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Failed to fetch notifications:", error);
    return [];
  }
  return data || [];
}

// ============================================================
// GET ALL NOTIFICATIONS (paginated)
// ============================================================

export async function getNotifications(limit = 20) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data || [];
}

// ============================================================
// MARK ONE AS READ
// ============================================================

export async function markOneRead(notificationId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);

  if (error) throw error;
  revalidatePath("/dashboard");
}

// ============================================================
// MARK ALL AS READ
// ============================================================

export async function markAllRead() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  if (error) throw error;
  revalidatePath("/dashboard");
}

// ============================================================
// GET UNREAD COUNT
// ============================================================

export async function getUnreadCount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  if (error) return 0;
  return count || 0;
}
