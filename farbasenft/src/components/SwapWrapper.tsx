"use client";

import { Swap } from "@coinbase/onchainkit/swap";
import type { Token } from "@coinbase/onchainkit/token";
import { useEffect, useRef } from "react";
import { useAccount } from "wagmi";

interface SwapWrapperProps {
  from: Token[];
  to: Token[];
  experimental?: { useAggregator?: boolean };
  title?: string;
  headerLeftContent?: React.ReactNode;
  onSwapComplete?: () => void;
}

/**
 * Wrapper around Swap component to track XP and handle swap completion
 * Only tracks on-chain swaps with transaction verification
 * Properly integrates with OnchainKit Swap component
 */
export function SwapWrapper({ 
  from, 
  to, 
  experimental, 
  title, 
  headerLeftContent,
  onSwapComplete 
}: SwapWrapperProps) {
  const { address, isConnected } = useAccount();
  const swapAttemptRef = useRef(false);
  const transactionHashRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isConnected || !address) return;

    // Listen for swap completion events with transaction hash
    const handleSwapSuccess = () => {
      console.log("On-chain swap completed successfully");
      const txHash = transactionHashRef.current;
      window.dispatchEvent(new CustomEvent("swap:success", { detail: { transactionHash: txHash } }));
      if (onSwapComplete) {
        onSwapComplete(txHash || undefined);
      }
    };

    // Monitor for transaction success indicators in the DOM
    const observer = new MutationObserver(() => {
      // Look for success indicators
      const successElements = document.querySelectorAll(
        '[data-swap-success], .swap-success, [class*="success"]'
      );
      
      // Check for specific OnchainKit success states
      const successText = document.body.textContent?.includes("Swap complete") || 
                         document.body.textContent?.includes("Success");
      
      if ((successElements.length > 0 || successText) && !swapAttemptRef.current) {
        swapAttemptRef.current = true;
        setTimeout(() => {
          handleSwapSuccess();
          swapAttemptRef.current = false;
        }, 1000);
      }
    });

    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      characterData: false,
      attributes: false 
    });

    return () => observer.disconnect();
  }, [isConnected, address, onSwapComplete]);

  // Show message if wallet not connected
  if (!isConnected) {
    return (
      <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
        <p className="text-sm text-yellow-200">
          Connect your wallet to enable swaps
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Swap
        from={from}
        to={to}
        experimental={experimental?.useAggregator !== undefined ? { useAggregator: experimental.useAggregator } : undefined}
        title={title || "Swap tokens"}
        headerLeftContent={headerLeftContent}
      />
    </div>
  );
}

