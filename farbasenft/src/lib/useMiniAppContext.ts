"use client";

import { useState, useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

/**
 * Hook to get Farcaster Mini App context
 * Provides user information and app context when available
 * 
 * Reference: https://miniapps.farcaster.xyz/docs/context
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
        const inMiniApp = await sdk.isInMiniApp();
        
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

    // Listen for context updates
    const handleContextUpdate = (event: CustomEvent) => {
      if (mounted) {
        setContext(event.detail);
      }
    };

    // Note: SDK may not have a context update event, but we can check periodically
    // or when the component mounts again
    window.addEventListener("farcaster:context:update", handleContextUpdate as EventListener);

    return () => {
      mounted = false;
      window.removeEventListener("farcaster:context:update", handleContextUpdate as EventListener);
    };
  }, []);

  return {
    context,
    isInMiniApp,
    isLoading,
    error,
    user: context?.user || null,
  };
}

