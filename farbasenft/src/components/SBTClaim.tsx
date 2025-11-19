"use client";

import { useState, useEffect, useRef } from "react";
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

  // Use ref to track if XP claim is in progress to prevent duplicates
  const xpClaimInProgressRef = useRef(false);

  useEffect(() => {
    if (address) {
      // Check API for claim status
      fetch(`/api/xp/sbt/claim?wallet=${address}`)
        .then(res => res.json())
        .then(data => {
          setClaimInfo(data);
          // Can claim if: API says can claim AND user hasn't claimed in XP system
          setCanClaim(data.canClaim && !userXP?.sbtClaimed);
        })
        .catch(console.error);
    }
  }, [address, userXP?.sbtClaimed]);

  // Handle successful transaction
  useEffect(() => {
    if (isSuccess && address && !xpClaimInProgressRef.current) {
      // Award XP and update status
      const claimXP = async () => {
        // Prevent duplicate executions
        if (xpClaimInProgressRef.current) return;
        xpClaimInProgressRef.current = true;

        try {
          const success = await addXP("SBT_CLAIM");
          if (success) {
            // Fetch updated XP data
            await fetchXP();
            setCanClaim(false);
            alert("🎉 SBT Claimed! You earned 1,000 XP!");
          } else {
            alert("⚠️ SBT minted but XP update failed. Refreshing...");
            await fetchXP();
          }
        } catch (error) {
          console.error("Failed to claim XP:", error);
          alert("Error processing XP reward. Please refresh the page.");
          await fetchXP();
        } finally {
          xpClaimInProgressRef.current = false;
        }
      };
      claimXP();
    }
  }, [isSuccess, address, addXP, fetchXP]);

  const handleClaim = async () => {
    if (!address) {
      alert("Please connect your wallet first");
      return;
    }

    if (!canClaim) {
      alert("You cannot claim SBT at this time. Check if you've already claimed or if the limit has been reached.");
      return;
    }

    if (!sbtContractAddress || sbtContractAddress === "0x_your_contract_address") {
      alert("⚠️ SBT contract address is not configured.\n\nTo enable SBT claiming:\n1. Deploy the SBT.sol contract to Base network\n2. Set NEXT_PUBLIC_SBT_CONTRACT_ADDRESS in .env.local\n3. Reload the app\n\nFor now, the XP reward system is functional without contract integration.");
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
      alert("Failed to claim SBT. Make sure you're connected to Base network and have gas for the transaction.");
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
    <div className="rounded-2xl border border-purple-400/30 bg-linear-to-br from-purple-500/10 to-pink-500/10 p-4">
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

      {!sbtContractAddress || sbtContractAddress === "0x_your_contract_address" ? (
        <div className="space-y-3">
          <button
            onClick={handleClaim}
            className="w-full rounded-xl bg-amber-500/20 px-4 py-3 text-sm font-semibold text-amber-200 transition hover:bg-amber-500/30 border border-amber-400/30 flex items-center justify-center gap-2"
          >
            <span>⚠️</span>
            <span>Setup Contract</span>
          </button>
          <p className="text-xs text-amber-300 bg-amber-400/10 rounded-lg p-2 border border-amber-400/20">
            SBT contract not configured. Click the button for setup instructions, or you can still earn XP through other activities.
          </p>
        </div>
      ) : (
        <button
          onClick={handleClaim}
          disabled={!canClaim || claiming}
          className="w-full rounded-xl bg-purple-500/20 px-4 py-3 text-sm font-semibold text-purple-200 transition hover:bg-purple-500/30 border border-purple-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {claiming ? (isConfirming ? "Confirming..." : "Claiming...") : "Claim SBT + 1,000 XP"}
        </button>
      )}
    </div>
  );
}

