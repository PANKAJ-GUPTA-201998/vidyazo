/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import type { Payment } from "@/types/database";
import { revalidatePath } from "next/cache";

// ============================================================
// PAYMENT ACTIONS (Admin)
// ============================================================

export async function getPayments(month?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("payments")
    .select("*, profile:profiles(full_name, phone), enrollment:enrollments(plan, batch:batches(name))")
    .order("created_at", { ascending: false });

  if (month) {
    query = query.eq("month", month);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getPaymentSummary(month: string) {
  const supabase = await createClient();

  const { data: payments, error } = await supabase
    .from("payments")
    .select("amount, status")
    .eq("month", month);

  if (error) throw error;

  const summary = {
    total_expected: 0,
    total_received: 0,
    pending: 0,
    overdue: 0,
  };

  payments?.forEach((p) => {
    summary.total_expected += p.amount;
    if (p.status === "paid") {
      summary.total_received += p.amount;
    } else if (p.status === "pending") {
      summary.pending += p.amount;
    }
    if (p.status === "pending") {
      summary.overdue++;
    }
  });

  return summary;
}

export async function createPaymentRecord(formData: {
  student_id: string;
  enrollment_id: string;
  amount: number;
  month: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments")
    .insert(formData)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/admin/payments");
  return data as Payment;
}

export async function markPaymentPaid(
  id: string,
  razorpay_payment_id?: string
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("payments")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      razorpay_payment_id: razorpay_payment_id || null,
    })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/payments");
}

// ============================================================
// RAZORPAY ORDER CREATION
// ============================================================

export async function createRazorpayOrder(paymentId: string) {
  const supabase = await createClient();

  // Get payment record
  const { data: payment, error } = await supabase
    .from("payments")
    .select("*, profile:profiles(full_name, phone)")
    .eq("id", paymentId)
    .single();

  if (error || !payment) throw error || new Error("Payment not found");

  // Create Razorpay order
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(
        `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
      ).toString("base64")}`,
    },
    body: JSON.stringify({
      amount: payment.amount, // Already in paise
      currency: "INR",
      receipt: `vidyazo_${paymentId}`,
      notes: {
        student_id: payment.student_id,
        payment_id: paymentId,
        month: payment.month,
      },
    }),
  });

  const order = await response.json();

  // Save Razorpay order ID
  await supabase
    .from("payments")
    .update({ razorpay_order_id: order.id })
    .eq("id", paymentId);

  return {
    orderId: order.id,
    amount: payment.amount,
    currency: "INR",
    name: "Vidyazo",
    description: `Tuition - ${payment.month}`,
    prefill: {
      contact: (payment as any).profile?.phone || "",
      name: (payment as any).profile?.full_name || "",
    },
  };
}

// ============================================================
// STUDENT PAYMENT VIEWS
// ============================================================

export async function getMyPayments() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("payments")
    .select("*, enrollment:enrollments(plan, batch:batches(name))")
    .eq("student_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// ============================================================
// GENERATE MONTHLY PAYMENTS FOR ALL ACTIVE ENROLLMENTS
// ============================================================

export async function generateMonthlyPayments(month: string) {
  const supabase = await createServiceRoleClient();

  // Get all active enrollments with batch pricing
  const { data: enrollments, error } = await supabase
    .from("enrollments")
    .select("*, batch:batches(price_monthly)")
    .eq("status", "active");

  if (error) throw error;
  if (!enrollments) return 0;

  // Check which payments already exist for this month
  const { data: existingPayments } = await supabase
    .from("payments")
    .select("enrollment_id")
    .eq("month", month);

  const existingEnrollmentIds = new Set(
    existingPayments?.map((p) => p.enrollment_id) || []
  );

  // Create missing payment records
  const newPayments = enrollments
    .filter((e) => !existingEnrollmentIds.has(e.id))
    .map((e) => ({
      student_id: e.student_id,
      enrollment_id: e.id,
      amount: e.price_override || (e as any).batch?.price_monthly || 0,
      month,
    }));

  if (newPayments.length === 0) return 0;

  const { error: insertError } = await supabase
    .from("payments")
    .insert(newPayments);

  if (insertError) throw insertError;

  revalidatePath("/admin/payments");
  return newPayments.length;
}
