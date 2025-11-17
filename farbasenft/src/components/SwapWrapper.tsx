"use client";

import { Swap } from "@coinbase/onchainkit/swap";
import type { Token } from "@coinbase/onchainkit/token";
import { useEffect } from "react";

interface SwapWrapperProps {
  from: Token[];
  to: Token[];
  experimental?: { useAggregator?: boolean };
  title?: string;
  headerLeftContent?: React.ReactNode;
}

/**
 * Wrapper around Swap component to track XP
 * Dispatches event when swap completes
 */
export function SwapWrapper({ from, to, experimental, title, headerLeftContent }: SwapWrapperProps) {
  useEffect(() => {
    // Listen for swap completion from OnchainKit
    // Note: This is a simplified approach - you may need to adjust based on actual Swap component events
    const handleSwapSuccess = () => {
      window.dispatchEvent(new CustomEvent("swap:success"));
    };

    // Check for swap success indicators
    const observer = new MutationObserver(() => {
      // Look for success indicators in the DOM
      const successElements = document.querySelectorAll('[data-swap-success], .swap-success');
      if (successElements.length > 0) {
        handleSwapSuccess();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

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

