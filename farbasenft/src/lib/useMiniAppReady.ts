"use client";

import { useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

/**
 * Hook to handle calling ready() when the app interface is fully loaded
 * Follows Farcaster Mini Apps best practices:
 * - Call ready() when interface is ready (avoid jitter and content reflows)
 * - Don't call ready() until interface has loaded
 * - Use placeholders/skeleton states if additional loading is required
 * 
 * Reference: https://miniapps.farcaster.xyz/docs/guides/loading
 */
export function useMiniAppReady() {
  const [isReady, setIsReady] = useState(false);
  const [isInMiniApp, setIsInMiniApp] = useState(false);

  useEffect(() => {
    let mounted = true;

    const callReady = async () => {
      try {
        // Check if we're in a Farcaster Mini App context
        const inMiniApp = await sdk.isInMiniApp();
        
        if (mounted) {
          setIsInMiniApp(inMiniApp);
        }

        if (!inMiniApp) {
          // Not in Mini App context - no need to call ready()
          if (mounted) {
            setIsReady(true);
          }
          return;
        }

        // Wait for content to be ready to avoid jitter
        // Following best practices: call ready() when interface is ready
        const waitForContent = () => {
          return new Promise<void>((resolve) => {
            if (document.readyState === "complete") {
              resolve();
            } else {
              window.addEventListener("load", () => resolve(), { once: true });
            }
          });
        };

        await waitForContent();
        
        // Small delay to ensure initial render is complete
        // This prevents content reflow when splash screen is hidden
        await new Promise(resolve => setTimeout(resolve, 100));

        // Call ready() to hide the splash screen
        await sdk.actions.ready();
        
        if (mounted) {
          setIsReady(true);
        }
      } catch (error) {
        console.error("Failed to call ready():", error);
        // Still mark as ready to prevent infinite loading
        if (mounted) {
          setIsReady(true);
        }
      }
    };

    callReady();

    return () => {
      mounted = false;
    };
  }, []);

  return { isReady, isInMiniApp };
}

