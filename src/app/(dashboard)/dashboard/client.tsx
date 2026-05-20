"use client";

import { useUser } from "@/hooks/use-user";
import {
  Video,
  ClipboardCheck,
  TrendingUp,
  Calendar,
  BookOpen,
  Flame,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { StreakCard } from "@/components/dashboard/streak-card";
import { LeaderboardCard } from "@/components/dashboard/leaderboard-card";
import { StudyMaterialsTab } from "@/components/dashboard/study-materials-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ActiveTest = {
  id: string;
  title: string;
  questions?: unknown[];
  duration_minutes?: number;
  week_number?: number;
} | null;

type Enrollment = {
  batch?: {
    id?: string;
    subject?: string;
    name?: string;
  };
};

export default function DashboardClient({ 
  activeTest,
  testSubmissionsCount,
  progressData,
  enrollments
}: {
  activeTest: ActiveTest;
  testSubmissionsCount: number;
  progressData: number[];
  enrollments: Enrollment[];
}) {
  const { profile } = useUser();
  
  // Calculate improvement
  let improvement = 0;
  if (progressData.length >= 2) {
    improvement = progressData[progressData.length - 1] - progressData[progressData.length - 2];
  }

  return (
    <div className="space-y-8 pb-20 md:pb-6 animate-fade-in max-w-4xl mx-auto pt-6">
      
      {/* Background ambient gradient */}
      <div className="fixed top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[#fff0f3]/60 via-[#f8f9fa]/40 to-transparent -z-10 pointer-events-none" />

      {/* Greeting Header */}
      <div className="mb-10">
        <h1 className="text-[2.5rem] font-bold text-[#111] tracking-tight leading-tight mb-2">
          Welcome back, {profile?.full_name?.split(" ")[0] || "Student"}
        </h1>
        <p className="text-gray-500 text-[15px]">
          You have {activeTest && enrollments.length > 0 ? "two" : activeTest || enrollments.length > 0 ? "one" : "no"} priority tasks remaining for today. Your performance has been exceptional this week.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        {/* We keep the tabs invisible here because the mockup moves them to the top bar, 
            but we need the functionality. We'll style it to be very subtle or hidden if needed.
            Actually, the mockup shows them at the top. We will render them as a soft pill. */}
        <div className="flex justify-center -mt-24 mb-16 relative z-50">
           {/* In a real integration, this would be in the header. We'll position it nicely. */}
           <TabsList className="bg-white/80 backdrop-blur-md border border-gray-100 shadow-sm rounded-full p-1 h-12">
             <TabsTrigger value="overview" className="rounded-full px-6 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-black text-gray-500">Overview</TabsTrigger>
             <TabsTrigger value="materials" className="rounded-full px-6 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-black text-gray-500">Study Materials</TabsTrigger>
           </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">

          {/* Priority Cards */}
          <div className="flex flex-col gap-5">
            {/* Upcoming Class Card */}
            {enrollments.length > 0 && (
              <div className="bg-white rounded-[24px] border border-gray-100/50 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-full mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">Upcoming Class</span>
                  </div>
                  <h3 className="text-[22px] font-bold text-[#111] mb-1.5">{enrollments[0]?.batch?.subject || "Subject"}</h3>
                  <p className="text-[14px] text-gray-500">
                    {enrollments[0]?.batch?.name || "Batch Name"} • Starts soon
                  </p>
                </div>
                <Link href="/classes">
                  <Button className="bg-[#ff4d6d] hover:bg-[#ff3355] text-white rounded-full px-8 py-6 text-[15px] font-semibold shadow-[0_4px_14px_rgba(255,77,109,0.3)] transition-all hover:scale-105 border-0">
                    Join Class
                  </Button>
                </Link>
              </div>
            )}

            {/* Pending Test Card */}
            {activeTest && (
              <div className="bg-white rounded-[24px] border border-gray-100/50 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-100 rounded-full mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff4d6d]" />
                    <span className="text-[11px] font-semibold text-red-500 uppercase tracking-wide">Action Required</span>
                  </div>
                  <h3 className="text-[22px] font-bold text-[#111] mb-1.5">{activeTest.title}</h3>
                  <p className="text-[14px] text-gray-500">
                    {activeTest.questions?.length || 0} Questions • {activeTest.duration_minutes || 30} Minutes
                  </p>
                </div>
                <Link href={`/test/${activeTest.id}`}>
                  <Button className="bg-[#111] hover:bg-black text-white rounded-full px-8 py-6 text-[15px] font-semibold shadow-[0_4px_14px_rgba(0,0,0,0.15)] transition-all hover:scale-105 border-0">
                    Start Test Now
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-4 sm:gap-5 mt-2">
            <div className="bg-white rounded-[24px] border border-gray-100/50 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.03)] p-6 flex flex-col justify-center">
              <p className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Total Classes</p>
              <p className="text-3xl sm:text-[34px] font-bold text-[#111] leading-none">18</p>
            </div>
            <div className="bg-white rounded-[24px] border border-gray-100/50 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.03)] p-6 flex flex-col justify-center">
              <p className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Tests Taken</p>
              <p className="text-3xl sm:text-[34px] font-bold text-[#111] leading-none">{testSubmissionsCount.toString().padStart(2, '0')}</p>
            </div>
            <div className="bg-white rounded-[24px] border border-gray-100/50 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.03)] p-6 flex flex-col justify-center">
              <p className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Weekly Streak</p>
              <p className="text-3xl sm:text-[34px] font-bold text-[#111] leading-none">03</p>
            </div>
          </div>

          {/* Performance Trend */}
          <div className="bg-white rounded-[24px] border border-gray-100/50 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.03)] p-6 sm:p-8 mt-2">
            <h3 className="text-[15px] font-bold text-[#111] mb-8">Performance Trend</h3>
            
            <div className="flex items-center justify-between gap-2 sm:gap-4 mb-8">
              {[0, 1, 2, 3].map((i) => {
                const isLast = i === 3;
                const score = progressData[i] || 0;
                // Determine width based on score, but in mockup they are horizontal bars
                // The mockup shows them all the same width, just different colors.
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3">
                    <div className={`w-full h-2.5 rounded-full ${isLast ? 'bg-[#112a46]' : 'bg-slate-100'}`} />
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">WK {i + 1}</span>
                  </div>
                );
              })}
            </div>
            
            {improvement > 0 ? (
              <div className="bg-[#eefcf2] text-[#29904d] px-5 py-3.5 rounded-xl text-[13px] font-medium border border-[#d1f4de]">
                Excellent work! Your score improved by {improvement}% this week.
              </div>
            ) : (
              <div className="bg-slate-50 text-slate-600 px-5 py-3.5 rounded-xl text-[13px] font-medium border border-slate-100">
                Keep practicing consistently to see your scores improve!
              </div>
            )}
          </div>

          {/* Leaderboard/Streak Compact */}
          <div className="flex flex-col gap-6">
            <StreakCard />
            <LeaderboardCard batchId={enrollments[0]?.batch?.id || null} />
          </div>

        </TabsContent>

        <TabsContent value="materials">
          <StudyMaterialsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
