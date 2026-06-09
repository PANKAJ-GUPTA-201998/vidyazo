/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPayments, getPaymentSummary } from "@/features/payments/actions";
import PaymentsClient from "./client";
import { format } from "date-fns";

export default async function PaymentsPage(props: {
  searchParams: Promise<{ month?: string }>;
}) {
  const searchParams = await props.searchParams;
  const currentMonth = format(new Date(), "yyyy-MM");
  const selectedMonth = searchParams.month || currentMonth;

  // Fetch real data from server actions
  const paymentsData = await getPayments(selectedMonth);
  const summary = await getPaymentSummary(selectedMonth);

  // Format payments for the client
  const formattedPayments = paymentsData.map((p: any) => ({
    id: p.id,
    student: p.profile?.full_name || "Unknown",
    batch: p.enrollment?.batch?.name || "-",
    plan: p.enrollment?.plan || "-",
    amount: p.amount / 100, // convert paise to rupees
    status: p.status,
    date: p.paid_at ? format(new Date(p.paid_at), "yyyy-MM-dd") : "-",
  }));

  // Format summary for the client
  const formattedSummary = {
    totalExpected: `₹${(summary.total_expected / 100).toLocaleString("en-IN")}`,
    totalReceived: `₹${(summary.total_received / 100).toLocaleString("en-IN")}`,
    pending: `₹${(summary.pending / 100).toLocaleString("en-IN")}`,
    overdue: summary.overdue.toString(),
  };

  return (
    <PaymentsClient 
      initialPayments={formattedPayments} 
      summary={formattedSummary} 
      selectedMonth={selectedMonth} 
    />
  );
}
