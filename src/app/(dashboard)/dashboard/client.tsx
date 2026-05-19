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
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-bold text-[#1a1a2e]">
          Hi {profile?.full_name?.split(" ")[0] || "Student"}! 👋
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          {format(today, "EEEE, d MMMM yyyy")}
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-sm grid-cols-2 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="materials">Study Materials</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">

      {/* Today's Class Card */}
      {enrollments.length > 0 && (
        <Card className="border-0 shadow-lg shadow-blue-100/50 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Your Class</p>
                <h3 className="text-xl font-bold mb-1">{enrollments[0]?.batch?.subject || "Subject"}</h3>
                <p className="text-blue-100 text-sm">
                  {enrollments[0]?.batch?.name || "Batch Name"}
                </p>
                <p className="text-blue-200 text-sm mt-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Scheduled times
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Video className="w-6 h-6" />
              </div>
            </div>
            <Link href="/classes">
              <Button className="mt-4 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-semibold cursor-pointer">
                View Classes
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* This Week's Test */}
      {activeTest ? (
        <Card className="border-0 shadow-lg shadow-orange-100/50 bg-gradient-to-br from-orange-500 to-rose-500 text-white rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-orange-100 text-sm mb-1">
                  New Test Available!
                </p>
                <h3 className="text-xl font-bold mb-1">{activeTest.title}</h3>
                <p className="text-orange-100 text-sm">
                  {activeTest.questions?.length || 0} questions • {activeTest.duration_minutes || 30} minutes
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <ClipboardCheck className="w-6 h-6" />
              </div>
            </div>
            <Link href={`/test/${activeTest.id}`}>
              <Button className="mt-4 bg-white text-orange-600 hover:bg-orange-50 rounded-xl font-semibold cursor-pointer">
                Take Test Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm bg-gray-50 rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-700">No pending tests</h3>
              <p className="text-sm text-gray-500">You are all caught up!</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-xl">🎉</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mx-auto mb-2">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-[#1a1a2e]">18</p>
            <p className="text-xs text-gray-400 mt-0.5">Classes</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-2">
              <ClipboardCheck className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-[#1a1a2e]">{testSubmissionsCount}</p>
            <p className="text-xs text-gray-400 mt-0.5">Tests Taken</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md rounded-2xl">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-2">
              <Flame className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-[#1a1a2e]">3</p>
            <p className="text-xs text-gray-400 mt-0.5">Week Streak</p>
          </CardContent>
        </Card>
      </div>

      {/* Streak + Leaderboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StreakCard />
        <LeaderboardCard batchId={enrollments[0]?.batch?.id || null} />
      </div>

      {/* Progress Card */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1a1a2e] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="flex items-end gap-2 h-32">
            {progressData.map((score, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <span className="text-xs font-semibold text-[#1a1a2e]">
                  {score}%
                </span>
                <div className="w-full bg-gray-100 rounded-t-lg overflow-hidden" style={{ height: "100px" }}>
                  <div
                    className="w-full gradient-accent rounded-t-lg transition-all duration-1000"
                    style={{
                      height: `${score}%`,
                      marginTop: `${100 - score}%`,
                    }}
                  />
                </div>
                <span className="text-[10px] text-gray-400">W{i + 1}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-green-600 font-medium mt-3 text-center">
            📈 Great! Improving every week!
          </p>
        </CardContent>
      </Card>
      
      </TabsContent>

      <TabsContent value="materials">
        <StudyMaterialsTab />
      </TabsContent>
    </Tabs>
  </div>
  );
}
