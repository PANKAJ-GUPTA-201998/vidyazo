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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#1a1a2e] flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Study Streak
        </h3>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Trophy className="w-3.5 h-3.5" />
          Best: {longestStreak}d
        </div>
      </div>

      {/* Current Streak */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2">
          <span className="text-4xl">🔥</span>
          <span className="text-5xl font-extrabold text-[#1a1a2e]">
            {streakCount}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {streakCount === 1 ? "day" : "days"} streak
        </p>
      </div>

      {/* 7-day grid */}
      <div className="flex justify-center gap-2 mb-4">
        {days.map((day) => (
          <div key={day.dateStr} className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-gray-400 font-medium">
              {day.dayLabel}
            </span>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                day.isActive
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-300"
              }`}
            >
              {day.isActive ? "✓" : "·"}
            </div>
          </div>
        ))}
      </div>

      {/* Message */}
      <p className="text-center text-sm text-gray-500 font-medium">
        {getMessage()}
      </p>
    </div>
  );
}
