"use client";

import { Users, BookOpen, Target, TrendingUp } from "lucide-react";

export function StatsSection() {
  const stats = [
    { label: "Active Students", value: "10,000+", icon: Users, color: "text-blue-500", bg: "bg-blue-100" },
    { label: "Average Score Increase", value: "+15%", icon: TrendingUp, color: "text-green-500", bg: "bg-green-100" },
    { label: "Live Classes Conducted", value: "50,000+", icon: BookOpen, color: "text-orange-500", bg: "bg-orange-100" },
    { label: "Tests Generated", value: "100k+", icon: Target, color: "text-purple-500", bg: "bg-purple-100" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a2e] mb-4">
            Trusted by Thousands of Indian Families
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Our results speak for themselves. We are proud to be the fastest-growing online tuition platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-gray-50 border border-gray-100 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300 shadow-sm">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${stat.bg}`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <h3 className="text-4xl font-extrabold text-[#1a1a2e] mb-2">{stat.value}</h3>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
