"use client";

import { useEffect, useState } from "react";
import { Trophy, Medal, Award } from "lucide-react";
import { getLeaderboard } from "@/lib/actions/streaks";
import { useUser } from "@/hooks/use-user";

interface LeaderboardEntry {
  studentId: string;
  firstName: string;
  testAvg: number;
  attendancePct: number;
  compositeScore: number;
  rank: number;
}

const rankIcons = [
  null, // 0-indexed padding
  <Medal key="gold" className="w-5 h-5 text-yellow-500" />,
  <Medal key="silver" className="w-5 h-5 text-gray-400" />,
  <Medal key="bronze" className="w-5 h-5 text-amber-700" />,
];

const rankBg = ["", "bg-yellow-50", "bg-gray-50", "bg-amber-50"];

export function LeaderboardCard({ batchId }: { batchId: string | null }) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useUser();

  useEffect(() => {
    async function fetch() {
      if (!batchId) {
        setLoading(false);
        return;
      }
      try {
        const data = await getLeaderboard(batchId);
        setEntries(data);
      } catch {
        // Table may not exist yet
      }
      setLoading(false);
    }
    fetch();
  }, [batchId]);

  if (!batchId) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-[#1a1a2e] flex items-center gap-2 mb-3">
          <Trophy className="w-5 h-5 text-purple-500" />
          Leaderboard
        </h3>
        <p className="text-sm text-gray-400 text-center py-4">
          Join a batch to see the leaderboard
        </p>
      </div>
    );
  }

  const top5 = entries.slice(0, 5);
  const userEntry = entries.find((e) => e.studentId === profile?.id);
  const userInTop5 = top5.some((e) => e.studentId === profile?.id);

  return (
    <div className="bg-white rounded-[24px] border border-gray-100/50 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.03)] p-6 sm:p-8 mt-2">
      <h3 className="text-[15px] font-bold text-[#111] mb-6">Batch Top 5</h3>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-100/50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-[13px] font-medium text-gray-500">
            No data yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Top 5 */}
          {top5.map((entry) => {
            const isMe = entry.studentId === profile?.id;
            return (
              <div
                key={entry.studentId}
                className={`flex items-center justify-between text-[13px] ${
                  isMe
                    ? "bg-[#fff0f3] -mx-4 px-4 py-2 rounded-xl"
                    : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-4 text-center font-semibold ${isMe ? 'text-[#ff4d6d]' : 'text-gray-400'}`}>
                    {entry.rank}
                  </span>
                  <span className={`font-medium ${isMe ? 'text-[#111]' : 'text-gray-600'} flex items-center gap-2`}>
                    {entry.firstName} {isMe && "(You)"}
                    {entry.rank <= 3 && rankIcons[entry.rank]}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-bold text-[#111]">{entry.testAvg}%</span>
                  <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{entry.attendancePct}% ATT</span>
                </div>
              </div>
            );
          })}

          {/* Show user's rank if not in top 5 */}
          {!userInTop5 && userEntry && (
            <>
              <div className="text-center text-gray-300 text-xs py-2">· · ·</div>
              <div className="flex items-center justify-between text-[13px] bg-[#fff0f3] -mx-4 px-4 py-2 rounded-xl">
                <div className="flex items-center gap-4">
                  <span className="w-4 text-center font-semibold text-[#ff4d6d]">
                    {userEntry.rank}
                  </span>
                  <span className="font-medium text-[#111] flex items-center gap-2">
                    {userEntry.firstName} (You)
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-bold text-[#111]">{userEntry.testAvg}%</span>
                  <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{userEntry.attendancePct}% ATT</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
