"use client";

import { useState, useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { onMiniAppEvent } from "./miniAppEvents";

/**
 * Hook to get Farcaster Mini App context
 * Provides user information and app context when available
 * 
 * Reference: 
 * - https://miniapps.farcaster.xyz/docs/context
 * - https://miniapps.farcaster.xyz/docs/sdk/is-in-mini-app
 */
export function useMiniAppContext() {
  const [context, setContext] = useState<Awaited<typeof sdk.context> | null>(null);
  const [isInMiniApp, setIsInMiniApp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchContext = async () => {
      try {
        setIsLoading(true);
        
        // Use SDK's isInMiniApp method
        // Reference: https://miniapps.farcaster.xyz/docs/sdk/is-in-mini-app
        const inMiniApp = await sdk.isInMiniApp().catch(() => false);
        
        if (mounted) {
          setIsInMiniApp(inMiniApp);
        }

        if (inMiniApp) {
          const ctx = await sdk.context;
          if (mounted) {
            setContext(ctx);
          }
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to get context");
        if (mounted) {
          setError(error);
          console.error("Failed to get Mini App context:", error);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchContext();

    // Listen for context updates using event system
    const subscription = onMiniAppEvent("miniapp:context:update", ({ context: updatedContext }) => {
      if (mounted) {
        setContext(updatedContext);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    sdk,
    context,
    isInMiniApp,
    isLoading,
    error,
    user: context?.user || null,
    client: context?.client || null,
    location: context?.location || null,
  };
}

