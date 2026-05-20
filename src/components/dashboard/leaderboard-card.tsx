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
    <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl shadow-purple-500/10 p-6 overflow-hidden group h-full">
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-purple-400 to-[#e94560] rounded-full blur-3xl opacity-10 group-hover:opacity-30 transition-opacity duration-700" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-[#1a1a2e] flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-purple-600" />
            </div>
            Leaderboard
          </h3>
          <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100 uppercase tracking-wider">
            This Week
          </span>
        </div>

        {loading ? (
          <div className="space-y-3 flex-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-100/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            <Award className="w-10 h-10 text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-500">
              No data yet — take a test<br/>to appear here!
            </p>
          </div>
        ) : (
          <div className="space-y-3 flex-1 flex flex-col">
            {/* Header */}
            <div className="grid grid-cols-12 gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider px-4 pb-1">
              <span className="col-span-1">#</span>
              <span className="col-span-5">Name</span>
              <span className="col-span-3 text-center">Score</span>
              <span className="col-span-3 text-center">Attend</span>
            </div>

            {/* Top 5 */}
            <div className="space-y-2">
              {top5.map((entry) => {
                const isMe = entry.studentId === profile?.id;
                return (
                  <div
                    key={entry.studentId}
                    className={`grid grid-cols-12 gap-2 items-center px-4 py-3 rounded-2xl text-sm transition-all duration-300 hover:scale-[1.02] ${
                      isMe
                        ? "bg-gradient-to-r from-[#e94560]/10 to-rose-500/5 border border-[#e94560]/30 font-bold shadow-sm"
                        : "bg-white border border-gray-100 shadow-sm hover:shadow-md"
                    }`}
                  >
                    <span className="col-span-1 flex items-center justify-center w-6">
                      {entry.rank <= 3
                        ? rankIcons[entry.rank]
                        : <span className="text-gray-400 text-xs font-bold">{entry.rank}</span>}
                    </span>
                    <span className="col-span-5 text-[#1a1a2e] font-semibold truncate flex items-center gap-1.5">
                      {entry.firstName}
                      {isMe && <span className="text-[9px] bg-[#e94560] text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider">You</span>}
                    </span>
                    <span className="col-span-3 text-center font-bold text-[#1a1a2e]">
                      {entry.testAvg}%
                    </span>
                    <span className="col-span-3 text-center text-xs font-medium text-gray-500">
                      {entry.attendancePct}%
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Show user's rank if not in top 5 */}
            {!userInTop5 && userEntry && (
              <div className="mt-auto pt-3">
                <div className="text-center text-gray-300 text-xs py-2">· · ·</div>
                <div className="grid grid-cols-12 gap-2 items-center px-4 py-3 rounded-2xl text-sm bg-gradient-to-r from-[#e94560]/10 to-rose-500/5 border border-[#e94560]/30 font-bold shadow-sm">
                  <span className="col-span-1 text-gray-400 text-xs font-bold text-center">
                    {userEntry.rank}
                  </span>
                  <span className="col-span-5 text-[#1a1a2e] font-semibold truncate flex items-center gap-1.5">
                    {userEntry.firstName}
                    <span className="text-[9px] bg-[#e94560] text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider">You</span>
                  </span>
                  <span className="col-span-3 text-center font-bold text-[#1a1a2e]">
                    {userEntry.testAvg}%
                  </span>
                  <span className="col-span-3 text-center text-xs font-medium text-gray-500">
                    {userEntry.attendancePct}%
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
