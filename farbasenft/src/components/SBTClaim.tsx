"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useXP } from "@/hooks/useXP";
import { parseAbi } from "viem";

const SBT_ABI = parseAbi([
  "function claim()",
  "function canClaim(address) view returns (bool)",
  "function remainingClaims() view returns (uint256)",
  "function totalClaimed() view returns (uint256)",
]);

const sbtContractAddress = process.env.NEXT_PUBLIC_SBT_CONTRACT_ADDRESS as `0x${string}` | undefined;

export function SBTClaim() {
  const { address } = useAccount();
  const { userXP, fetchXP, addXP } = useXP();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  
  const [canClaim, setCanClaim] = useState(false);
  const [claimInfo, setClaimInfo] = useState<{
    canClaim: boolean;
    alreadyClaimed: boolean;
    limitReached: boolean;
    remaining: number;
    totalClaimed: number;
  } | null>(null);

  useEffect(() => {
    if (address) {
      // Check API for claim status
      fetch(`/api/xp/sbt/claim?wallet=${address}`)
        .then(res => res.json())
        .then(data => {
          setClaimInfo(data);
          setCanClaim(data.canClaim && !userXP?.sbtClaimed);
        })
        .catch(console.error);
    }
  }, [address, userXP]);

  // Handle successful transaction
  useEffect(() => {
    if (isSuccess && address) {
      // Award XP and update status
      addXP("SBT_CLAIM").then(() => {
        fetchXP();
        setCanClaim(false);
        alert("🎉 SBT Claimed! You earned 1,000 XP!");
      });
    }
  }, [isSuccess, address, addXP, fetchXP]);

  const handleClaim = async () => {
    if (!address || !canClaim || !sbtContractAddress) {
      if (!sbtContractAddress) {
        alert("SBT contract not configured. Please set NEXT_PUBLIC_SBT_CONTRACT_ADDRESS");
      }
      return;
    }

    try {
      // Call smart contract to claim SBT
      writeContract({
        address: sbtContractAddress,
        abi: SBT_ABI,
        functionName: "claim",
      });
    } catch (error) {
      console.error("SBT claim error:", error);
      alert("Failed to claim SBT. Make sure you're connected to Base network.");
    }
  };

  const claiming = isPending || isConfirming;

  if (!address) {
    return (
      <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4">
        <p className="text-sm text-amber-200">Connect wallet to claim your SBT</p>
      </div>
    );
  }

  if (userXP?.sbtClaimed || claimInfo?.alreadyClaimed) {
    return (
      <div className="rounded-2xl border border-green-400/30 bg-green-400/10 p-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎖️</span>
          <div>
            <p className="text-sm font-semibold text-green-200">SBT Claimed!</p>
            <p className="text-xs text-green-300/80">You've earned your Soulbound Token</p>
          </div>
        </div>
      </div>
    );
  }

  if (claimInfo?.limitReached) {
    return (
      <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4">
        <p className="text-sm text-red-200">SBT claim limit reached (20,000 users)</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-purple-400/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">🎖️ Claim Your SBT</h3>
          <p className="text-sm text-slate-300">
            Be among the first 20,000 users! Claim your Soulbound Token and earn 1,000 XP.
          </p>
        </div>
      </div>
      
      {claimInfo && (
        <div className="mb-3 text-xs text-slate-400">
          <p>{claimInfo.remaining.toLocaleString()} SBTs remaining</p>
          <p>{claimInfo.totalClaimed.toLocaleString()} already claimed</p>
        </div>
      )}

      <button
        onClick={handleClaim}
        disabled={!canClaim || claiming || !sbtContractAddress}
        className="w-full rounded-xl bg-purple-500/20 px-4 py-3 text-sm font-semibold text-purple-200 transition hover:bg-purple-500/30 border border-purple-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {claiming ? (isConfirming ? "Confirming..." : "Claiming...") : "Claim SBT + 1,000 XP"}
      </button>
      {!sbtContractAddress && (
        <p className="mt-2 text-xs text-amber-400">
          SBT contract not configured. Set NEXT_PUBLIC_SBT_CONTRACT_ADDRESS
        </p>
      )}
    </div>
  );
}

