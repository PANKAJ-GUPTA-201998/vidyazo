"use client";

import { useUser } from "@/features/auth/use-user";
import {
  Video,
  ClipboardCheck,
  TrendingUp,
  Calendar,
  BookOpen,
  Flame,
} from "lucide-react";

import Link from "next/link";
import { StreakCard } from "@/features/student-dashboard/components/streak-card";
import { LeaderboardCard } from "@/features/student-dashboard/components/leaderboard-card";
import { StudyMaterialsTab } from "@/components/dashboard/study-materials-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

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
      
      {/* Background ambient gradient with animated glowing orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-rose-200/20 blur-[100px] animate-pulse-slow mix-blend-multiply" />
        <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/20 blur-[100px] animate-pulse-slow mix-blend-multiply" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] rounded-full bg-purple-200/10 blur-[120px] animate-pulse-slow mix-blend-multiply" style={{ animationDelay: '4s' }} />
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
      </div>

      {/* Greeting Header */}
      <div className="mb-12 relative animate-slide-up" style={{ animationDelay: '0ms' }}>
        <h1 className="text-[2.5rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight leading-tight mb-3">
          Welcome back, {profile?.full_name?.split(" ")[0] || "Student"}
        </h1>
        <p className="text-gray-500 text-[16px] font-medium max-w-2xl">
          You have <span className="text-gray-900 font-bold">{activeTest && enrollments.length > 0 ? "two" : activeTest || enrollments.length > 0 ? "one" : "no"}</span> priority tasks remaining for today. Your performance has been exceptional this week.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        {/* Animated Pill Navigation */}
        <div className="flex justify-center -mt-28 mb-16 relative z-50 animate-slide-up" style={{ animationDelay: '100ms' }}>
           <TabsList className="bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full p-1.5 h-14 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
             <TabsTrigger value="overview" className="rounded-full px-8 text-[15px] font-bold transition-all duration-500 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-gray-900 text-gray-400 hover:text-gray-600 relative z-10">Overview</TabsTrigger>
             <TabsTrigger value="materials" className="rounded-full px-8 text-[15px] font-bold transition-all duration-500 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-gray-900 text-gray-400 hover:text-gray-600 relative z-10">Study Materials</TabsTrigger>
           </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">

          {/* Priority Cards */}
          <div className="flex flex-col gap-5">
            {/* Upcoming Class Card */}
            {enrollments.length > 0 && (
              <div className="group relative bg-white/80 backdrop-blur-sm rounded-[24px] border border-gray-100/80 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-500 hover:shadow-[0_20px_40px_-12px_rgba(37,99,235,0.1)] hover:-translate-y-1 animate-slide-up overflow-hidden" style={{ animationDelay: '200ms' }}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50/80 border border-blue-100/50 rounded-full mb-5 transition-transform group-hover:scale-105">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                    </span>
                    <span className="text-[11px] font-bold text-blue-700 uppercase tracking-widest">Upcoming Class</span>
                  </div>
                  <h3 className="text-[24px] font-extrabold text-gray-900 mb-2 tracking-tight group-hover:text-blue-950 transition-colors">{enrollments[0]?.batch?.subject || "Subject"}</h3>
                  <p className="text-[15px] font-medium text-gray-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {enrollments[0]?.batch?.name || "Batch Name"} • Starts soon
                  </p>
                </div>
                <Link href="/classes" className="relative z-10">
                  <Button className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full px-8 py-6 text-[15px] font-bold shadow-[0_8px_20px_rgba(37,99,235,0.25)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_24px_rgba(37,99,235,0.35)] border-0">
                    <span className="relative z-10 flex items-center gap-2">Join Class <Video className="w-4 h-4" /></span>
                    <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                  </Button>
                </Link>
              </div>
            )}

            {/* Pending Test Card */}
            {activeTest && (
              <div className="group relative bg-white/80 backdrop-blur-sm rounded-[24px] border border-gray-100/80 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-500 hover:shadow-[0_20px_40px_-12px_rgba(244,63,94,0.1)] hover:-translate-y-1 animate-slide-up overflow-hidden" style={{ animationDelay: '300ms' }}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-orange-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50/80 border border-rose-100/50 rounded-full mb-5 transition-transform group-hover:scale-105">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                    </span>
                    <span className="text-[11px] font-bold text-rose-700 uppercase tracking-widest">Action Required</span>
                  </div>
                  <h3 className="text-[24px] font-extrabold text-gray-900 mb-2 tracking-tight group-hover:text-rose-950 transition-colors">{activeTest.title}</h3>
                  <p className="text-[15px] font-medium text-gray-500 flex items-center gap-2">
                    <ClipboardCheck className="w-4 h-4 text-gray-400" />
                    {activeTest.questions?.length || 0} Questions • {activeTest.duration_minutes || 30} Minutes
                  </p>
                </div>
                <Link href={`/test/${activeTest.id}`} className="relative z-10">
                  <Button className="relative overflow-hidden bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 py-6 text-[15px] font-bold shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_24px_rgba(0,0,0,0.25)] border-0">
                    <span className="relative z-10">Start Test Now</span>
                    <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-4">
            <div className="group bg-white/60 backdrop-blur-md rounded-[24px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 sm:p-8 flex flex-col justify-center transition-all duration-500 hover:-translate-y-1 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-indigo-500 transition-colors">Total Classes</p>
                <BookOpen className="w-4 h-4 text-gray-200 group-hover:text-indigo-200 transition-colors" />
              </div>
              <p className="text-4xl sm:text-[42px] font-black text-gray-900 leading-none tracking-tight">18</p>
            </div>
            <div className="group bg-white/60 backdrop-blur-md rounded-[24px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 sm:p-8 flex flex-col justify-center transition-all duration-500 hover:-translate-y-1 animate-slide-up" style={{ animationDelay: '450ms' }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-rose-500 transition-colors">Tests Taken</p>
                <ClipboardCheck className="w-4 h-4 text-gray-200 group-hover:text-rose-200 transition-colors" />
              </div>
              <p className="text-4xl sm:text-[42px] font-black text-gray-900 leading-none tracking-tight">{testSubmissionsCount.toString().padStart(2, '0')}</p>
            </div>
            <div className="group bg-white/60 backdrop-blur-md rounded-[24px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 sm:p-8 flex flex-col justify-center transition-all duration-500 hover:-translate-y-1 animate-slide-up" style={{ animationDelay: '500ms' }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-orange-500 transition-colors">Weekly Streak</p>
                <Flame className="w-4 h-4 text-gray-200 group-hover:text-orange-200 transition-colors" />
              </div>
              <p className="text-4xl sm:text-[42px] font-black text-gray-900 leading-none tracking-tight">03</p>
            </div>
          </div>

          {/* Performance Trend */}
          <div className="bg-white/80 backdrop-blur-md rounded-[32px] border border-white shadow-[0_12px_40px_rgb(0,0,0,0.04)] p-8 sm:p-10 mt-4 animate-slide-up overflow-hidden relative group" style={{ animationDelay: '600ms' }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-indigo-50/50 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="flex justify-between items-end mb-10 relative z-10">
              <h3 className="text-[18px] font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                Performance Trend
              </h3>
            </div>
            
            <div className="flex items-center justify-between gap-3 sm:gap-6 mb-10 relative z-10">
              {[0, 1, 2, 3].map((i) => {
                const isLast = i === 3;
                const score = progressData[i] || 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar">
                    <div className="w-full bg-slate-100/80 rounded-full h-3 overflow-hidden relative border border-slate-200/50">
                      <div 
                        className={`absolute left-0 top-0 bottom-0 rounded-full transition-all duration-1000 ease-out group-hover/bar:brightness-110 ${isLast ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-slate-300 to-slate-400'}`}
                        style={{ width: `${score}%` }} 
                      />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-[12px] font-bold ${isLast ? 'text-indigo-600' : 'text-gray-400'}`}>{score}%</span>
                      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">WK {i + 1}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="relative z-10">
              {improvement > 0 ? (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 px-6 py-4 rounded-2xl text-[14px] font-bold border border-emerald-100/60 shadow-sm flex items-center gap-3 animate-fade-in">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg shadow-inner">🎯</div>
                  Excellent work! Your score improved by {improvement}% this week.
                </div>
              ) : (
                <div className="bg-slate-50 text-slate-600 px-6 py-4 rounded-2xl text-[14px] font-medium border border-slate-100 shadow-sm flex items-center gap-3 animate-fade-in">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center text-lg shadow-sm">💡</div>
                  Keep practicing consistently to see your scores improve!
                </div>
              )}
            </div>
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
