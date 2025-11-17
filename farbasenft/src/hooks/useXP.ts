"use client";

import { useState, useEffect, useCallback } from "react";
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
    return addXP("DAILY_LOGIN");
  }, [addXP]);

  // Check and claim daily login on mount
  useEffect(() => {
    if (address) {
      fetchXP().then(() => {
        // Auto-claim daily login if available
        if (userXP) {
          const today = new Date().toISOString().split("T")[0];
          if (userXP.lastLoginDate !== today) {
            claimDailyLogin();
          }
        }
      });
    }
  }, [address, fetchXP, claimDailyLogin, userXP]);

  return {
    userXP,
    loading,
    error,
    fetchXP,
    addXP,
    claimDailyLogin,
  };
}

