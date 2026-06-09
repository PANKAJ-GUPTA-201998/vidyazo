"use client";

import { useEffect, useState } from "react";
import { Trophy, Medal } from "lucide-react";
import { getLeaderboard } from "@/features/student-dashboard/actions/streaks";
import { useUser } from "@/features/auth/use-user";

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
    <div className="group bg-white/80 backdrop-blur-md rounded-[32px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] p-8 sm:p-10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-100 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-y-1/3 -translate-x-1/3 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <h3 className="text-[18px] font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          Batch Top 5
        </h3>
        <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
        </span>
      </div>

      {loading ? (
        <div className="space-y-4 relative z-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-slate-100/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center bg-slate-50/50 rounded-[24px] border border-dashed border-slate-200 relative z-10">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3">
            <Trophy className="w-5 h-5 text-slate-300" />
          </div>
          <p className="text-[14px] font-medium text-slate-500">
            No data yet.<br/>Take a test to appear here!
          </p>
        </div>
      ) : (
        <div className="space-y-3 relative z-10">
          {/* Top 5 */}
          {top5.map((entry, index) => {
            const isMe = entry.studentId === profile?.id;
            return (
              <div
                key={entry.studentId}
                className={`flex items-center justify-between text-[14px] p-3 rounded-[16px] transition-all duration-300 hover:scale-[1.02] group/row ${
                  isMe
                    ? "bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-100/50 shadow-sm"
                    : "hover:bg-slate-50 hover:shadow-sm"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full text-[12px] font-bold ${isMe ? 'bg-rose-500 text-white shadow-[0_4px_10px_rgba(244,63,94,0.3)]' : 'bg-slate-100 text-slate-500 group-hover/row:bg-slate-200 transition-colors'}`}>
                    {entry.rank}
                  </span>
                  <span className={`font-bold ${isMe ? 'text-gray-900' : 'text-gray-700'} flex items-center gap-2 group-hover/row:text-indigo-600 transition-colors`}>
                    {entry.firstName} {isMe && <span className="text-[10px] uppercase tracking-wider bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-full ml-1">You</span>}
                    {entry.rank <= 3 && <span className="drop-shadow-sm transition-transform group-hover/row:scale-125 group-hover/row:rotate-12">{rankIcons[entry.rank]}</span>}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-black text-gray-900 bg-white/50 px-2 py-1 rounded-lg shadow-sm border border-white/80">{entry.testAvg}%</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{entry.attendancePct}% ATT</span>
                </div>
              </div>
            );
          })}

          {/* Show user's rank if not in top 5 */}
          {!userInTop5 && userEntry && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-[14px] p-3 rounded-[16px] transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-100/50 shadow-sm">
                <div className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full text-[12px] font-bold bg-rose-500 text-white shadow-[0_4px_10px_rgba(244,63,94,0.3)]">
                    {userEntry.rank}
                  </span>
                  <span className="font-bold text-gray-900 flex items-center gap-2">
                    {userEntry.firstName} <span className="text-[10px] uppercase tracking-wider bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-full ml-1">You</span>
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-black text-gray-900 bg-white/50 px-2 py-1 rounded-lg shadow-sm border border-white/80">{userEntry.testAvg}%</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{userEntry.attendancePct}% ATT</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
