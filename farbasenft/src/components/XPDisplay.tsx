"use client";

import { useXP } from "@/hooks/useXP";
import { xpProgress, XP_REWARDS } from "@/lib/xp";
import { useEffect, useState } from "react";
import styles from "./XPDisplay.module.css";

export function XPDisplay() {
  const { userXP, loading, claimDailyLogin, fetchXP } = useXP();
  const [claimSuccess, setClaimSuccess] = useState(false);
  
  const handleNavigation = (hash: string) => {
    window.location.hash = hash;
  };

  // Refresh XP when component mounts
  useEffect(() => {
    fetchXP();
  }, [fetchXP]);

  // Show placeholder when no wallet connected or loading
  if (!userXP) {
    return (
      <div className="rounded-2xl border border-cyan-400/30 bg-linear-to-br from-cyan-500/10 to-purple-500/10 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-cyan-300/80">XP System</p>
            <p className="text-2xl font-bold text-white">Connect Wallet</p>
          </div>
        </div>
        <p className="text-sm text-slate-400">Connect your wallet to start earning XP and level up!</p>
      </div>
    );
  }

  const progress = xpProgress(userXP.totalXP, userXP.level);
  const today = new Date().toISOString().split("T")[0];
  const canClaimDaily = userXP.lastLoginDate !== today;

  const handleClaimDaily = async () => {
    const success = await claimDailyLogin();
    if (success) {
      setClaimSuccess(true);
      setTimeout(() => setClaimSuccess(false), 2000);
      await fetchXP(); // Refresh XP data
    }
  };

  const xpItems = [
    {
      label: "Daily Login",
      xp: XP_REWARDS.DAILY_LOGIN,
      action: handleClaimDaily,
      isAction: true,
      disabled: !canClaimDaily,
    },
    {
      label: "On-Chain Swap",
      xp: XP_REWARDS.SWAP,
      action: () => handleNavigation("#swap-portal"),
    },
    {
      label: "Buy NFT",
      xp: XP_REWARDS.NFT_BUY,
      action: () => handleNavigation("#marketplace"),
    },
    {
      label: "Sell NFT",
      xp: XP_REWARDS.NFT_SELL,
      action: () => handleNavigation("#gallery"),
    },
    {
      label: "Mint NFT",
      xp: XP_REWARDS.NFT_CREATE,
      action: () => handleNavigation("#create"),
    },
    {
      label: "Claim SBT",
      xp: XP_REWARDS.SBT_CLAIM,
      action: () => handleNavigation("#sbt"),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-cyan-400/30 bg-linear-to-br from-cyan-500/10 to-purple-500/10 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-cyan-300/80">Level {userXP.level}</p>
            <p className="text-2xl font-bold text-white">{userXP.totalXP.toLocaleString()} XP</p>
          </div>
          {canClaimDaily && (
            <button
              onClick={handleClaimDaily}
              disabled={loading}
              className="rounded-lg bg-cyan-500/20 px-3 py-1.5 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/30 border border-cyan-400/30 disabled:opacity-50"
            >
              {loading ? "Claiming..." : "Claim Daily +100 XP"}
            </button>
          )}
          {!canClaimDaily && (
            <div className="text-xs text-cyan-300/60">Daily claimed ✓</div>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-300">
            <span>Progress to Level {userXP.level + 1}</span>
            <span>{progress.current.toLocaleString()} / {progress.needed.toLocaleString()} XP</span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>

        {claimSuccess && (
          <p className="text-xs text-green-400 mt-2">✓ Daily login claimed!</p>
        )}
      </div>

      {/* XP Earning Opportunities - Clickable */}
      <div className="rounded-2xl border border-purple-400/30 bg-linear-to-br from-purple-500/10 to-pink-500/10 p-3">
        <p className="text-xs uppercase tracking-wider text-purple-300/80 mb-2">Earn XP - Click to Access Portal</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {xpItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              disabled={item.disabled && item.isAction}
              className="rounded-lg bg-slate-800/50 p-2 border border-purple-400/20 transition hover:border-purple-400/50 hover:bg-slate-800/80 disabled:opacity-50 disabled:cursor-not-allowed text-left"
            >
              <p className="text-purple-200">{item.label}</p>
              <p className="text-purple-400 font-semibold">+{item.xp} XP</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


