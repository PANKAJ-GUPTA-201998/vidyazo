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
  const today = new Date();

  return (
    <div className="space-y-8 pb-20 md:pb-6 animate-fade-in">
      {/* Greeting Hero */}
      <div className="relative rounded-3xl overflow-hidden glass border border-white/40 shadow-xl shadow-[#e94560]/10 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#e94560]/20 to-[#0f3460]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e] tracking-tight">
              Hi, {profile?.full_name?.split(" ")[0] || "Student"}! <span className="inline-block animate-wave">👋</span>
            </h2>
            <p className="text-gray-500 font-medium mt-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#e94560]" />
              {format(today, "EEEE, d MMMM yyyy")}
            </p>
          </div>
          <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-2xl bg-white/50 border border-white backdrop-blur-md shadow-sm">
            <span className="text-3xl font-bold text-[#e94560]">{format(today, "d")}</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-sm grid-cols-2 mb-8 bg-white/50 backdrop-blur-md border border-white/60 p-1.5 rounded-2xl shadow-sm">
          <TabsTrigger value="overview" className="rounded-xl font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-[#e94560] transition-all">Overview</TabsTrigger>
          <TabsTrigger value="materials" className="rounded-xl font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-[#e94560] transition-all">Study Materials</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">

          {/* Top Actions: Class & Test */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Today's Class Card */}
            {enrollments.length > 0 ? (
              <Card className="relative border-0 shadow-xl shadow-blue-500/20 bg-gradient-to-br from-[#0f3460] to-[#1a1a2e] text-white rounded-3xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <CardContent className="p-6 sm:p-8 relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-200 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-400/20">
                        Upcoming Class
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{enrollments[0]?.batch?.subject || "Subject"}</h3>
                    <p className="text-blue-200 text-sm font-medium">
                      {enrollments[0]?.batch?.name || "Batch Name"}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-blue-100/70">
                      <Video className="w-4 h-4" />
                      <span>Ready to learn?</span>
                    </div>
                    <Link href="/classes">
                      <Button className="bg-white text-[#0f3460] hover:bg-blue-50 rounded-xl font-bold px-6 shadow-lg shadow-white/10 transition-all hover:scale-105 cursor-pointer">
                        Join Class
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-dashed border-gray-200 shadow-none bg-gray-50/50 rounded-3xl h-full flex items-center justify-center min-h-[200px]">
                <CardContent className="p-6 text-center text-gray-500">
                  <Video className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">No upcoming classes</p>
                </CardContent>
              </Card>
            )}

            {/* This Week's Test */}
            {activeTest ? (
              <Card className="relative border-0 shadow-xl shadow-[#e94560]/20 gradient-accent text-white rounded-3xl overflow-hidden group">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <CardContent className="p-6 sm:p-8 relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-full border border-white/20 animate-pulse">
                        Action Required
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-1 leading-tight">{activeTest.title}</h3>
                    <p className="text-white/80 text-sm font-medium flex items-center gap-2">
                      <ClipboardCheck className="w-4 h-4" />
                      {activeTest.questions?.length || 0} Questions • {activeTest.duration_minutes || 30} Mins
                    </p>
                  </div>
                  <div className="mt-8 flex items-center justify-end">
                    <Link href={`/test/${activeTest.id}`}>
                      <Button className="bg-white text-[#e94560] hover:bg-rose-50 rounded-xl font-bold px-6 shadow-lg shadow-white/10 transition-all hover:scale-105 cursor-pointer">
                        Start Test Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-gray-100 shadow-sm bg-white rounded-3xl h-full flex items-center justify-center min-h-[200px]">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
                    <span className="text-3xl">🎉</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">You're all caught up!</h3>
                  <p className="text-sm text-gray-500 font-medium">No pending tests for this week.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-3xl bg-white/50 backdrop-blur-sm">
              <CardContent className="p-5 sm:p-6 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-3 shadow-lg shadow-green-500/30">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-black text-[#1a1a2e]">18</p>
                <p className="text-xs sm:text-sm font-medium text-gray-500 mt-1 uppercase tracking-wider">Classes</p>
              </CardContent>
            </Card>
            <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-3xl bg-white/50 backdrop-blur-sm">
              <CardContent className="p-5 sm:p-6 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-3 shadow-lg shadow-purple-500/30">
                  <ClipboardCheck className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-black text-[#1a1a2e]">{testSubmissionsCount}</p>
                <p className="text-xs sm:text-sm font-medium text-gray-500 mt-1 uppercase tracking-wider">Tests Taken</p>
              </CardContent>
            </Card>
            <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-3xl bg-white/50 backdrop-blur-sm">
              <CardContent className="p-5 sm:p-6 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-3 shadow-lg shadow-orange-500/30">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-black text-[#1a1a2e]">3</p>
                <p className="text-xs sm:text-sm font-medium text-gray-500 mt-1 uppercase tracking-wider">Week Streak</p>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Progress Chart */}
            <Card className="lg:col-span-8 border border-white/60 shadow-lg shadow-gray-200/50 rounded-3xl bg-white/80 backdrop-blur-xl">
              <CardHeader className="pb-2 border-b border-gray-100/50 px-6 sm:px-8 pt-6 sm:pt-8">
                <CardTitle className="text-lg font-bold text-[#1a1a2e] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-xl">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    Performance Trend
                  </div>
                  <span className="text-sm font-semibold text-[#e94560] bg-rose-50 px-3 py-1 rounded-full">
                    Last 4 Tests
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 pt-8">
                <div className="flex items-end justify-around gap-2 sm:gap-6 h-40">
                  {progressData.map((score, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                      <span className="text-sm font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity -translate-y-2">
                        {score}%
                      </span>
                      <div className="w-full max-w-[60px] bg-gray-100 rounded-t-2xl rounded-b-md overflow-hidden relative shadow-inner h-[120px]">
                        <div
                          className="absolute bottom-0 w-full rounded-t-xl rounded-b-md transition-all duration-1000 ease-out"
                          style={{
                            height: `${score}%`,
                            background: `linear-gradient(to top, ${i === progressData.length - 1 ? '#e94560, #ff6b81' : '#cbd5e1, #94a3b8'})`,
                          }}
                        >
                          <div className="absolute inset-0 bg-white/20 w-full h-full" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', mixBlendMode: 'overlay' }} />
                        </div>
                      </div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">W{i + 1}</span>
                    </div>
                  ))}
                </div>
                {progressData.length > 1 && progressData[progressData.length - 1] > progressData[progressData.length - 2] && (
                  <div className="mt-6 p-4 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center gap-2 animate-fade-in">
                    <span className="text-xl">🚀</span>
                    <p className="text-sm text-green-700 font-semibold">
                      Excellent work! Your score improved by {progressData[progressData.length - 1] - progressData[progressData.length - 2]}% this week.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Leaderboard/Streak Compact */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <StreakCard />
              <LeaderboardCard batchId={enrollments[0]?.batch?.id || null} />
            </div>
          </div>

        </TabsContent>

        <TabsContent value="materials">
          <StudyMaterialsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
