"use client";

import { useEffect, useState } from "react";
import { Flame, Trophy } from "lucide-react";
import { getStreak, updateStreak } from "@/lib/actions/streaks";
import type { StudentStreak } from "@/types/database";

export function StreakCard() {
  const [streak, setStreak] = useState<StudentStreak | null>(null);

  useEffect(() => {
    async function init() {
      // Update streak on dashboard visit
      await updateStreak();
      const data = await getStreak();
      setStreak(data);
    }
    init();
  }, []);

  // Build 7-day activity grid
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const dayLabel = d.toLocaleDateString("en-US", { weekday: "narrow" });
    const isActive =
      streak?.last_active_date &&
      new Date(streak.last_active_date) >= new Date(dateStr);
    return { dateStr, dayLabel, isActive: !!isActive && i >= 7 - (streak?.current_streak || 0) };
  });

  const streakCount = streak?.current_streak || 0;
  const longestStreak = streak?.longest_streak || 0;

  const getMessage = () => {
    if (streakCount === 0) return "Start your streak today! 🚀";
    if (streakCount < 3) return "Great start! Keep going 💪";
    if (streakCount < 7) return `${7 - streakCount} more days for your badge 🏅`;
    if (streakCount < 14) return "Amazing! You're on fire! 🔥";
    return "Unstoppable! You're a champion! 🏆";
  };

  return (
    <div className="group bg-white/80 backdrop-blur-md rounded-[32px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] p-8 sm:p-10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-100 to-orange-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-10 relative z-10">
        <h3 className="text-[18px] font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          Day Streak
        </h3>
        <span className="text-[12px] font-bold text-rose-500 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100 uppercase tracking-widest shadow-inner">
          Best: {longestStreak}d
        </span>
      </div>

      {/* Current Streak */}
      <div className="flex items-center gap-4 mb-10 relative z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-orange-400 blur-xl opacity-20 animate-pulse" />
          <span className="text-[64px] leading-none drop-shadow-md animate-[bounce_3s_ease-in-out_infinite] block relative z-10">🔥</span>
        </div>
        <span className="text-[84px] font-black text-transparent bg-clip-text bg-gradient-to-br from-rose-500 to-orange-400 leading-none tracking-tighter drop-shadow-sm">
          {streakCount}
        </span>
      </div>

      {/* 7-day grid */}
      <div className="flex items-center gap-2 sm:gap-3 relative z-10">
        {days.map((day, i) => {
          const isActive = day.isActive; 
          
          return (
            <div
              key={day.dateStr}
              className={`flex-1 aspect-square rounded-[16px] transition-all duration-500 ease-out transform hover:scale-110 ${
                isActive
                  ? "bg-gradient-to-br from-rose-400 to-rose-500 shadow-[0_8px_16px_rgba(244,63,94,0.3)] shadow-inner border border-rose-400/50"
                  : "bg-slate-100 shadow-inner border border-slate-200/50"
              }`}
              style={{ transitionDelay: `${i * 50}ms` }}
            />
          );
        })}
      </div>
    </div>
  );
}
