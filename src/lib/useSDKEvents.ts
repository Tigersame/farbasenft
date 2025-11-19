"use client";

import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

/**
 * Hook to handle Farcaster Mini App SDK events
 * Listens for context updates and other SDK events
 * 
 * Reference: https://miniapps.farcaster.xyz/docs/events
 */
export function useSDKEvents() {
  useEffect(() => {
    const handleContextUpdate = (event: CustomEvent) => {
      console.log("Mini App context updated:", event.detail);
      // You can dispatch custom events or update state here
      window.dispatchEvent(new CustomEvent("farcaster:context:update", { detail: event.detail }));
    };

    // Listen for SDK events if available
    // Note: The exact event API may vary based on SDK version
    if (typeof window !== "undefined") {
      window.addEventListener("farcaster:context:update", handleContextUpdate as EventListener);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("farcaster:context:update", handleContextUpdate as EventListener);
      }
    };
  }, []);
}

