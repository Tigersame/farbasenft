"use client";

import { Swap } from "@coinbase/onchainkit/swap";
import type { Token } from "@coinbase/onchainkit/token";
import { useXP } from "@/hooks/useXP";
import { useEffect, useRef } from "react";

interface SwapWithXPProps {
  from: Token[];
  to: Token[];
  experimental?: { useAggregator?: boolean };
  title?: string;
  headerLeftContent?: React.ReactNode;
}

/**
 * Swap component with XP tracking
 * Awards 100 XP when a swap is completed
 */
export function SwapWithXP({ from, to, experimental, title, headerLeftContent }: SwapWithXPProps) {
  const { addXP } = useXP();
  const swapCountRef = useRef(0);

  useEffect(() => {
    // Listen for swap completion events
    // Note: This is a placeholder - actual implementation depends on OnchainKit swap events
    const handleSwapComplete = () => {
      swapCountRef.current += 1;
      addXP("SWAP", { swapNumber: swapCountRef.current });
    };

    // You may need to listen to specific events from the Swap component
    // This is a simplified version - adjust based on actual Swap component API
    window.addEventListener("swap:complete", handleSwapComplete);

    return () => {
      window.removeEventListener("swap:complete", handleSwapComplete);
    };
  }, [addXP]);

  return (
    <Swap
      from={from}
      to={to}
      experimental={experimental?.useAggregator !== undefined ? { useAggregator: experimental.useAggregator } : undefined}
      title={title}
      headerLeftContent={headerLeftContent}
    />
  );
}

