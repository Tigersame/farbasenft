"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAccount } from "wagmi";
import type { UserXP, XPAction } from "@/lib/xp";

export function useXP() {
  const { address } = useAccount();
  const [userXP, setUserXP] = useState<UserXP | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user XP
  const fetchXP = useCallback(async () => {
    if (!address) {
      setUserXP(null);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/xp?wallet=${address}`);
      if (!response.ok) throw new Error("Failed to fetch XP");
      const data = await response.json();
      setUserXP(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load XP");
      console.error("Failed to fetch XP:", err);
    } finally {
      setLoading(false);
    }
  }, [address]);

  // Add XP for an action
  const addXP = useCallback(async (action: XPAction, metadata?: Record<string, unknown>) => {
    if (!address) return false;

    try {
      setLoading(true);
      const response = await fetch("/api/xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: address,
          action,
          metadata,
        }),
      });

      if (!response.ok) throw new Error("Failed to add XP");
      const data = await response.json();
      
      if (data.success) {
        setUserXP(data.userXP);
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add XP");
      console.error("Failed to add XP:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [address]);

  // Claim daily login
  const claimDailyLogin = useCallback(async () => {
    // Use the main /api/xp endpoint with DAILY_LOGIN action
    return addXP("DAILY_LOGIN");
  }, [addXP]);

  // Fetch XP on wallet connection
  useEffect(() => {
    if (address) {
      fetchXP();
    }
  }, [address]);

  // Auto-claim daily login when XP is fetched (only once per session)
  const dailyLoginClaimedRef = useRef(false);
  useEffect(() => {
    if (userXP && address && !dailyLoginClaimedRef.current) {
      const today = new Date().toISOString().split("T")[0];
      if (userXP.lastLoginDate !== today) {
        dailyLoginClaimedRef.current = true;
        claimDailyLogin();
      }
    }
  }, []);

  return {
    userXP,
    loading,
    error,
    fetchXP,
    addXP,
    claimDailyLogin,
  };
}

