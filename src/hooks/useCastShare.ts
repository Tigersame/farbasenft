"use client";

import { useState, useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import type { MiniAppCast, CastShareParams } from "@/lib/castShare";
import { parseCastShareParams } from "@/lib/castShare";

interface UseCastShareReturn {
  /** Whether we're in a cast share context */
  isCastShare: boolean;
  /** URL parameters (available immediately) */
  params: CastShareParams | null;
  /** Enriched cast data from SDK (available after init) */
  cast: MiniAppCast | null;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
}

/**
 * Hook for handling cast share extension context
 * 
 * Provides both URL parameters (immediate) and SDK context (after init)
 * 
 * @example
 * function SharePage() {
 *   const { isCastShare, params, cast } = useCastShare();
 *   
 *   if (!isCastShare) {
 *     return <div>Not a shared cast</div>;
 *   }
 *   
 *   return (
 *     <div>
 *       <h1>Cast from @{cast?.author.username}</h1>
 *       <p>{cast?.text}</p>
 *     </div>
 *   );
 * }
 */
export function useCastShare(): UseCastShareReturn {
  const [isCastShare, setIsCastShare] = useState(false);
  const [params, setParams] = useState<CastShareParams | null>(null);
  const [cast, setCast] = useState<MiniAppCast | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeCastShare = async () => {
      try {
        setIsLoading(true);

        // First, check URL parameters (available immediately)
        if (typeof window !== "undefined") {
          const searchParams = new URLSearchParams(window.location.search);
          const urlParams = parseCastShareParams(searchParams);
          
          if (urlParams) {
            setIsCastShare(true);
            setParams(urlParams);
          }
        }

        // Then, check SDK context (available after initialization)
        const isInMiniApp = await sdk.isInMiniApp();
        
        if (isInMiniApp) {
          const context = await sdk.context;
          
          if (context.location && context.location.type === "cast_share") {
            setIsCastShare(true);
            setCast(context.location.cast);
          }
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to load cast share context");
        setError(error);
        console.error("Error initializing cast share:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCastShare();
  }, []);

  return {
    isCastShare,
    params,
    cast,
    isLoading,
    error,
  };
}
