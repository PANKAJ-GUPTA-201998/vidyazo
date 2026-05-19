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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#1a1a2e] flex items-center gap-2">
          <Trophy className="w-5 h-5 text-purple-500" />
          Leaderboard
        </h3>
        <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded-full">
          This Week
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">
          No data yet — take a test to appear here!
        </p>
      ) : (
        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 text-[10px] text-gray-400 font-bold uppercase px-3 pb-1">
            <span className="col-span-1">#</span>
            <span className="col-span-5">Name</span>
            <span className="col-span-3 text-center">Score</span>
            <span className="col-span-3 text-center">Attend</span>
          </div>

          {/* Top 5 */}
          {top5.map((entry) => {
            const isMe = entry.studentId === profile?.id;
            return (
              <div
                key={entry.studentId}
                className={`grid grid-cols-12 gap-2 items-center px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isMe
                    ? "bg-[#e94560]/5 border border-[#e94560]/20 font-semibold"
                    : rankBg[entry.rank] || "hover:bg-gray-50"
                }`}
              >
                <span className="col-span-1 flex items-center">
                  {entry.rank <= 3
                    ? rankIcons[entry.rank]
                    : <span className="text-gray-400 text-xs font-bold">{entry.rank}</span>}
                </span>
                <span className="col-span-5 text-[#1a1a2e] truncate">
                  {entry.firstName}
                  {isMe && <span className="text-[10px] text-[#e94560] ml-1">(You)</span>}
                </span>
                <span className="col-span-3 text-center text-xs">
                  {entry.testAvg}%
                </span>
                <span className="col-span-3 text-center text-xs">
                  {entry.attendancePct}%
                </span>
              </div>
            );
          })}

          {/* Show user's rank if not in top 5 */}
          {!userInTop5 && userEntry && (
            <>
              <div className="text-center text-gray-300 text-xs py-1">· · ·</div>
              <div className="grid grid-cols-12 gap-2 items-center px-3 py-2.5 rounded-xl text-sm bg-[#e94560]/5 border border-[#e94560]/20 font-semibold">
                <span className="col-span-1 text-gray-400 text-xs font-bold">
                  {userEntry.rank}
                </span>
                <span className="col-span-5 text-[#1a1a2e] truncate">
                  {userEntry.firstName}
                  <span className="text-[10px] text-[#e94560] ml-1">(You)</span>
                </span>
                <span className="col-span-3 text-center text-xs">
                  {userEntry.testAvg}%
                </span>
                <span className="col-span-3 text-center text-xs">
                  {userEntry.attendancePct}%
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
