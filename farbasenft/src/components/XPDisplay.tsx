"use client";

import { useXP } from "@/hooks/useXP";
import { xpProgress } from "@/lib/xp";
import { useEffect } from "react";

export function XPDisplay() {
  const { userXP, loading, claimDailyLogin } = useXP();

  if (!userXP) {
    return null;
  }

  const progress = xpProgress(userXP.totalXP, userXP.level);
  const today = new Date().toISOString().split("T")[0];
  const canClaimDaily = userXP.lastLoginDate !== today;

  return (
    <div className="rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-cyan-300/80">Level {userXP.level}</p>
          <p className="text-2xl font-bold text-white">{userXP.totalXP.toLocaleString()} XP</p>
        </div>
        {canClaimDaily && (
          <button
            onClick={claimDailyLogin}
            disabled={loading}
            className="rounded-lg bg-cyan-500/20 px-3 py-1.5 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/30 border border-cyan-400/30 disabled:opacity-50"
          >
            {loading ? "Claiming..." : "Claim Daily +100 XP"}
          </button>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-300">
          <span>Progress to Level {userXP.level + 1}</span>
          <span>{progress.current.toLocaleString()} / {progress.needed.toLocaleString()} XP</span>
        </div>
        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

