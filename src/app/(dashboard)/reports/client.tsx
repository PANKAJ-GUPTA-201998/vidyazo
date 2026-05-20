"use client";

import { Award, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { AIReport } from "@/types/database";

type OverallTrend = {
  label: string;
  icon: string;
  change: string;
};

export default function ReportsClient({ 
  initialReports, 
  overallTrend 
}: { 
  initialReports: AIReport[]; 
  overallTrend: OverallTrend 
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1a1a2e]">My Reports</h2>

      {/* Overall Trend */}
      <Card className="border-0 shadow-md rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Overall Trend</p>
              <p className={`text-3xl font-extrabold ${overallTrend.icon === 'declining' ? 'text-red-600' : 'text-green-600'}`}>{overallTrend.label}</p>
              <p className="text-sm text-gray-400 mt-1">{overallTrend.change}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
              <Award className="w-7 h-7 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Reports */}
      {initialReports.length === 0 ? (
        <div className="text-center p-10 text-gray-500">
          No reports generated yet.
        </div>
      ) : (
        initialReports.map((report) => {
          // Since we don't store actual numeric scores in ai_reports but text, we can show effort rating
          const effort = report.content.effort_rating;
          
          return (
            <Card
              key={report.id}
              className="border-0 shadow-md rounded-2xl overflow-hidden"
            >
              {/* Report Header */}
              <div className="gradient-hero p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Week Start</p>
                    <p className="font-semibold">{report.week_start}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-extrabold">
                      {effort}/5 🌟
                    </p>
                    <div
                      className={`flex items-center gap-1 text-sm justify-end text-white/80`}
                    >
                      Effort Rating
                    </div>
                  </div>
                </div>
              </div>

            <CardContent className="p-4 space-y-4">
              {/* Topics Summary (as generated from AI) */}
              <div className="space-y-2.5">
                <div className="text-sm font-medium text-gray-700">Summary</div>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {report.content.summary_english}
                </p>
              </div>

              {/* Weak/Strong */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-red-50">
                  <p className="text-[10px] font-semibold text-red-600 uppercase mb-1.5">
                    ⚡ Focus Areas
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {report.content.weak_topics.map((t: string) => (
                      <Badge
                        key={t}
                        className="bg-red-100 text-red-700 text-[10px]"
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-green-50">
                  <p className="text-[10px] font-semibold text-green-600 uppercase mb-1.5">
                    🌟 Strong
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {report.content.strong_topics.map((t: string) => (
                      <Badge
                        key={t}
                        className="bg-green-100 text-green-700 text-[10px]"
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Comment */}
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span className="text-[10px] font-semibold text-blue-600 uppercase">
                    AI Analysis
                  </span>
                </div>
                <p className="text-sm text-blue-800 leading-relaxed">
                  &quot;{report.content.summary_hindi}&quot;
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })
      )}
    </div>
  );
}
