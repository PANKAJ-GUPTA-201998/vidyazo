"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  getChildProfile,
  getChildAttendance,
  getChildTestScores,
  getChildUpcomingClasses,
  getChildFeeStatus,
} from "@/lib/actions/parent";
import {
  Users,
  Video,
  ClipboardCheck,
  Calendar,
  IndianRupee,
  TrendingUp,
  AlertCircle,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ParentDashboardClient({
  childrenList,
}: {
  childrenList: any[];
}) {
  const [selectedChild, setSelectedChild] = useState<string | null>(
    childrenList.length > 0 ? childrenList[0].id : null
  );

  const [data, setData] = useState<{
    profile: any;
    attendance: any[];
    tests: any[];
    classes: any[];
    fee: any;
  } | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!selectedChild) return;
      setLoading(true);
      
      const [profile, attendance, tests, classes, fee] = await Promise.all([
        getChildProfile(selectedChild),
        getChildAttendance(selectedChild),
        getChildTestScores(selectedChild),
        getChildUpcomingClasses(selectedChild),
        getChildFeeStatus(selectedChild),
      ]);

      setData({ profile, attendance, tests, classes, fee });
      setLoading(false);
    }
    fetchData();
  }, [selectedChild]);

  if (childrenList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <Users className="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#1a1a2e]">No Children Linked</h2>
          <p className="text-gray-500 mt-1 max-w-sm">
            We couldn't find any student accounts linked to your phone number.
            Please contact support if you think this is a mistake.
          </p>
        </div>
        <a href="https://wa.me/917983696587" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="mt-4">
            Contact Support
          </Button>
        </a>
      </div>
    );
  }

  // Calculate attendance %
  let attendancePct = 0;
  if (data?.attendance && data.attendance.length > 0) {
    const presentCount = data.attendance.filter((a) => a.present).length;
    attendancePct = Math.round((presentCount / data.attendance.length) * 100);
  }

  // Chart data
  const testScores = data?.tests?.slice().reverse() || [];

  return (
    <div className="space-y-6">
      {/* Child Selector */}
      {childrenList.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {childrenList.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChild(child.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedChild === child.id
                  ? "bg-[#1a1a2e] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden relative">
                {child.avatar_url ? (
                  <Image src={child.avatar_url} alt="" fill className="object-cover" />
                ) : (
                  <Users className="w-3 h-3 m-1.5 text-gray-500" />
                )}
              </div>
              <span className="font-medium text-sm">
                {child.full_name?.split(" ")[0] || "Student"}
              </span>
            </button>
          ))}
        </div>
      )}

      {loading || !data ? (
        <div className="space-y-4">
          <div className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
            <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          </div>
        </div>
      ) : (
        <>
          {/* Profile Header */}
          <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 relative overflow-hidden flex-shrink-0">
              {data.profile?.avatar_url ? (
                <Image src={data.profile.avatar_url} alt="" fill className="object-cover" />
              ) : (
                <GraduationCap className="w-8 h-8 m-4 text-gray-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1a1a2e]">
                {data.profile?.full_name}
              </h2>
              <p className="text-sm text-gray-500">
                Class {data.profile?.class_grade} • {data.profile?.board}
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-0 shadow-sm rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-blue-600/80 text-xs font-semibold uppercase tracking-wider mb-1">
                      Attendance
                    </p>
                    <h3 className="text-2xl font-bold text-blue-900">
                      {attendancePct}%
                    </h3>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  This month
                </p>
              </CardContent>
            </Card>

            <Card className={`border-0 shadow-sm rounded-2xl bg-gradient-to-br ${
              data.fee?.status === "paid" 
                ? "from-green-50 to-green-100/50" 
                : "from-red-50 to-red-100/50"
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                      data.fee?.status === "paid" ? "text-green-600/80" : "text-red-600/80"
                    }`}>
                      Fee Status
                    </p>
                    <h3 className={`text-xl font-bold ${
                      data.fee?.status === "paid" ? "text-green-900" : "text-red-900"
                    }`}>
                      {data.fee?.status === "paid" ? "Paid" : "Due"}
                    </h3>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    data.fee?.status === "paid" ? "bg-green-500/10" : "bg-red-500/10"
                  }`}>
                    {data.fee?.status === "paid" ? (
                      <ClipboardCheck className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </div>
                {data.fee?.status === "pending" && (
                  <Button size="sm" className="w-full mt-2 h-7 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg">
                    Pay ₹{data.fee?.amount || "..."}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Test Performance Chart */}
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Recent Test Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              {testScores.length > 0 ? (
                <div className="flex items-end gap-2 h-32 pt-4">
                  {testScores.map((test, i) => {
                    const score = Math.round((test.score / test.total) * 100);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs font-semibold text-[#1a1a2e]">
                          {score}%
                        </span>
                        <div className="w-full bg-gray-100 rounded-t-lg overflow-hidden" style={{ height: "100px" }}>
                          <div
                            className="w-full bg-gradient-to-t from-green-400 to-green-500 rounded-t-lg transition-all"
                            style={{ height: `${score}%`, marginTop: `${100 - score}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-400 truncate w-full text-center">
                          {test.test?.title?.split(" ")[0] || `W${i+1}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center text-gray-400 text-sm">
                  No tests taken yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Classes */}
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardHeader className="pb-3 border-b border-gray-50">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Video className="w-4 h-4 text-blue-500" />
                Upcoming Classes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              {data.classes && data.classes.length > 0 ? (
                <div className="space-y-3">
                  {data.classes.map((cls) => (
                    <div key={cls.id} className="flex items-start justify-between py-2 border-b border-gray-50 last:border-0 last:pb-0">
                      <div>
                        <p className="font-semibold text-sm text-[#1a1a2e]">
                          {cls.batch?.subject} • {cls.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(cls.scheduled_at).toLocaleString('en-IN', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm text-center py-4">
                  No upcoming classes scheduled.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
