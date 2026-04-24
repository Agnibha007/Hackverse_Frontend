import React, { useEffect } from "react";
import { useSocialStore, useAuthStore } from "../../store/index.js";
import { Trophy, Zap } from "lucide-react";

export function Leaderboard() {
  const { leaderboard, fetchLeaderboard } = useSocialStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  if (!leaderboard.length) return null;

  const MEDAL = ["#FFD700", "#C0C0C0", "#CD7F32"];

  return (
    <div className="bg-neon-darker border border-neon-blue/20 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-neon-blue/10">
        <Trophy size={14} className="text-yellow-400" />
        <span className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest">Leaderboard</span>
      </div>
      <div className="divide-y divide-neon-blue/5">
        {leaderboard.slice(0, 8).map((entry, i) => {
          const isMe = entry.id === user?.id;
          const isTop = i === 0;
          return (
            <div key={entry.id}
              className={`flex items-center gap-2.5 px-3 py-2 transition-all ${isMe ? "bg-neon-pink/5" : ""} ${isTop ? "bg-yellow-400/5" : ""}`}>
              <div className="w-5 text-center shrink-0">
                {i < 3
                  ? <span style={{ color: MEDAL[i] }} className="text-xs font-bold">{i + 1}</span>
                  : <span className="text-[10px] font-mono text-gray-600">{i + 1}</span>
                }
              </div>
              <div className="w-7 h-7 rounded-full bg-neon-dark border border-neon-blue/20 flex items-center justify-center text-[10px] font-cyber font-bold text-neon-pink shrink-0 overflow-hidden">
                {entry.profile_image_url
                  ? <img src={entry.profile_image_url} alt="" className="w-full h-full object-cover" />
                  : (entry.callsign || entry.username || "?")[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-mono truncate ${isMe ? "text-neon-pink font-bold" : "text-white"}`}>
                  {entry.callsign || entry.username}
                  {isMe && <span className="ml-1 text-[9px] text-neon-pink/60">(you)</span>}
                </p>
                <p className="text-[10px] font-mono text-gray-600">
                  {entry.collectible_count} drops · LV.{entry.level}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Zap size={10} className="text-neon-pink" />
                <span className="text-[10px] font-mono text-neon-pink">{entry.xp_points}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
