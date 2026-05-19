/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Download, IndianRupee, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRouter } from "next/navigation";

const statusStyles: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  overdue: "bg-red-100 text-red-700",
  failed: "bg-red-100 text-red-700",
};

export type PaymentFormatted = {
  id: string;
  student: string;
  batch: string;
  plan: string;
  amount: number;
  status: string;
  date: string;
};

export default function PaymentsClient({ 
  initialPayments, 
  summary, 
  selectedMonth 
}: { 
  initialPayments: PaymentFormatted[];
  summary: any;
  selectedMonth: string;
}) {
  const router = useRouter();

  const summaryCards = [
    {
      label: "Total Expected",
      value: summary.totalExpected,
      icon: IndianRupee,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Total Received",
      value: summary.totalReceived,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Pending",
      value: summary.pending,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      label: "Overdue",
      value: summary.overdue,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Payments</h1>
          <p className="text-gray-400 text-sm mt-1">
            Track and manage student payments
          </p>
        </div>
        <div className="flex gap-2">
          <Select 
            defaultValue={selectedMonth}
            onValueChange={(val) => {
              router.push(`/admin/payments?month=${val}`);
            }}
          >
            <SelectTrigger className="rounded-xl w-40">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026-06">June 2026</SelectItem>
              <SelectItem value="2026-05">May 2026</SelectItem>
              <SelectItem value="2026-04">April 2026</SelectItem>
              <SelectItem value="2026-03">March 2026</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="rounded-xl border-gray-200 cursor-pointer"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <Card key={card.label} className="border-0 shadow-md rounded-2xl">
            <CardContent className="p-4">
              <div
                className={`w-10 h-10 rounded-xl ${card.bgColor} flex items-center justify-center mb-3`}
              >
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className="text-2xl font-bold text-[#1a1a2e]">{card.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payments Table */}
      <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                    Student
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3 hidden sm:table-cell">
                    Batch
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3 hidden md:table-cell">
                    Plan
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                    Amount
                  </th>
                  <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                    Status
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3 hidden sm:table-cell">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {initialPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400">
                      No payments found for this month.
                    </td>
                  </tr>
                ) : (
                  initialPayments.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-medium text-[#1a1a2e] text-sm">
                        {p.student}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 hidden sm:table-cell">
                      {p.batch}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 hidden md:table-cell">
                      {p.plan}
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm font-semibold text-[#1a1a2e]">
                      ₹{p.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <Badge
                        className={`text-[10px] ${statusStyles[p.status]}`}
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm text-gray-400 hidden sm:table-cell">
                      {p.date}
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
