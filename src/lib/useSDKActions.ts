"use client";

import { useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

/**
 * Custom hook for Farcaster Mini App SDK actions
 * Provides safe wrappers for SDK navigation and interaction methods
 * 
 * Reference: https://miniapps.farcaster.xyz/docs/actions
 */
export function useSDKActions() {
  /**
   * Open an external URL using SDK action
   * This ensures cross-client compatibility
   */
  const openUrl = useCallback(async (url: string) => {
    try {
      const isInMiniApp = await sdk.isInMiniApp();
      if (isInMiniApp) {
        await sdk.actions.openUrl({ url });
      } else {
        // Fallback for non-Mini App contexts
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error("Failed to open URL:", error);
      // Fallback to window.open
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }, []);

  /**
   * Compose a cast using SDK action
   * This ensures the cast composer opens correctly in all clients
   */
  const composeCast = useCallback(async (params: { text: string; embeds?: string[] }) => {
    try {
      const isInMiniApp = await sdk.isInMiniApp();
      if (isInMiniApp) {
        await sdk.actions.composeCast({
          text: params.text,
          embeds: params.embeds ? (params.embeds.length === 1 ? [params.embeds[0]] : [params.embeds[0], params.embeds[1]]) as [string] | [string, string] : undefined,
        });
      } else {
        // Fallback: try to use MiniKit if available
        console.warn("Not in Mini App context. Casting may not work.");
      }
    } catch (error) {
      console.error("Failed to compose cast:", error);
    }
  }, []);

  /**
   * View a cast using SDK action
   * Opens the cast in the native client viewer
   */
  const viewCast = useCallback(async (params: { castHash: string; fid?: number }) => {
    try {
      const isInMiniApp = await sdk.isInMiniApp();
      if (isInMiniApp) {
        await sdk.actions.viewCast({ hash: params.castHash });
      } else {
        // Fallback: open in browser
        const url = `https://warpcast.com/~/conversations/${params.castHash}`;
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error("Failed to view cast:", error);
    }
  }, []);

  /**
   * Trigger haptic feedback
   */
  const triggerHaptic = useCallback(async (type: "light" | "medium" | "heavy" | "success" | "warning" | "error" = "light") => {
    // Haptic feedback is not available in the SDK, fail silently
    console.log(`Haptic feedback: ${type}`);
  }, []);

  /**
   * Navigate back in the Mini App
   */
  const navigateBack = useCallback(async () => {
    // Navigate back is not available in the SDK, use browser back
    window.history.back();
  }, []);

  return {
    openUrl,
    composeCast,
    viewCast,
    triggerHaptic,
    navigateBack,
  };
}

