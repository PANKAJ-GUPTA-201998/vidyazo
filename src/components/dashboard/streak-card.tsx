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
    <div className="bg-white rounded-[24px] border border-gray-100/50 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.03)] p-6 sm:p-8 mt-2">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[15px] font-bold text-[#111]">Day Streak</h3>
        <span className="text-[11px] font-semibold text-[#ff4d6d]">Rest: 12</span>
      </div>

      {/* Current Streak */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-[54px] leading-none drop-shadow-sm">🔥</span>
        <span className="text-[64px] font-bold text-[#ff4d6d] leading-none tracking-tight">
          {streakCount}
        </span>
      </div>

      {/* 7-day grid */}
      <div className="flex items-center gap-2">
        {days.map((day, i) => {
          // In the mockup, it's just 7 blank rounded squares. 
          // Active ones are solid red, inactive are solid light grey.
          const isMockupActive = i < 4; // Mockup shows 4 active. Let's use real logic but style like mockup.
          const isActive = day.isActive; 
          
          return (
            <div
              key={day.dateStr}
              className={`flex-1 aspect-square rounded-[14px] transition-all duration-300 ${
                isActive
                  ? "bg-[#ff4d6d]"
                  : "bg-gray-100"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
