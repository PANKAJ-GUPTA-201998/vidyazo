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
    <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl shadow-orange-500/10 p-6 overflow-hidden group">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-orange-400 to-rose-400 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-[#1a1a2e] flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            Study Streak
          </h3>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-full border border-yellow-200/50">
            <Trophy className="w-3.5 h-3.5" />
            Best: {longestStreak}d
          </div>
        </div>

        {/* Current Streak */}
        <div className="text-center mb-8 relative">
          <div className="flex items-center justify-center gap-2 animate-bounce-slow">
            <span className="text-5xl drop-shadow-sm">🔥</span>
            <span className="text-6xl font-black bg-gradient-to-br from-orange-500 to-rose-500 bg-clip-text text-transparent drop-shadow-sm">
              {streakCount}
            </span>
          </div>
          <p className="text-sm font-semibold text-gray-400 mt-2 uppercase tracking-widest">
            {streakCount === 1 ? "Day Streak" : "Days Streak"}
          </p>
        </div>

        {/* 7-day grid */}
        <div className="flex justify-between items-center mb-6 px-2">
          {days.map((day) => (
            <div key={day.dateStr} className="flex flex-col items-center gap-2">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                {day.dayLabel}
              </span>
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-sm transition-all duration-300 ${
                  day.isActive
                    ? "bg-gradient-to-br from-orange-400 to-rose-500 text-white shadow-lg shadow-orange-500/30 scale-110"
                    : "bg-gray-100 text-gray-300 border border-gray-200"
                }`}
              >
                {day.isActive ? "✓" : "·"}
              </div>
            </div>
          ))}
        </div>

        {/* Message */}
        <div className="bg-orange-50/50 rounded-2xl p-3 border border-orange-100/50">
          <p className="text-center text-sm text-orange-800 font-medium">
            {getMessage()}
          </p>
        </div>
      </div>
    </div>
  );
}
