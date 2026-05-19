import {
  Users,
  IndianRupee,
  ClipboardCheck,
  Send,
  Plus,
  FileText,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAdminStats } from "@/lib/actions/stats";

const quickActions = [
  {
    label: "Create Test",
    icon: Plus,
    href: "/admin/tests/create",
    color: "gradient-accent text-white",
  },
  {
    label: "Add Class",
    icon: FileText,
    href: "/admin/batches",
    color: "bg-[#1a1a2e] text-white",
  },
  {
    label: "Send Reports",
    icon: Send,
    href: "/admin/reports",
    color: "bg-green-600 text-white",
  },
];

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  const statCards = [
    {
      label: "Active Students",
      value: stats.active_students.toString(),
      change: `out of ${stats.total_students} total`,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Revenue This Month",
      value: `₹${(stats.total_revenue / 100).toLocaleString("en-IN")}`,
      change: "Current month",
      icon: IndianRupee,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Tests This Month",
      value: stats.tests_this_month.toString(),
      change: "All batches covered",
      icon: ClipboardCheck,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Reports Sent",
      value: stats.reports_sent.toString(),
      change: "This month",
      icon: Send,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a2e]">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">
          Overview of your tuition business
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-md rounded-2xl hover:shadow-lg transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-11 h-11 rounded-xl ${stat.bgColor} flex items-center justify-center`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-[#1a1a2e]">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
              <p className="text-xs text-green-600 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <Button
                className={`${action.color} rounded-xl px-5 py-5 font-semibold hover:scale-105 transition-transform cursor-pointer`}
              >
                <action.icon className="w-5 h-5 mr-2" />
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
