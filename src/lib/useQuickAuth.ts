"use client";

import { useState, useEffect, useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

interface QuickAuthUser {
  fid: number;
  token?: string;
}

interface UseQuickAuthReturn {
  user: QuickAuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAvailable: boolean;
  signIn: () => Promise<void>;
  signOut: () => void;
  error: Error | null;
}

/**
 * Check if Quick Auth is available in the current context
 */
async function isQuickAuthAvailable(): Promise<boolean> {
  try {
    // Check if we're in a Farcaster Mini App
    const isInMiniApp = await sdk.isInMiniApp();
    if (!isInMiniApp) {
      return false;
    }

    // Check if quickAuth is available on the SDK
    if (!sdk.quickAuth || typeof sdk.quickAuth.getToken !== "function") {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Hook for Farcaster Quick Auth authentication
 * Handles token retrieval and user verification
 */
export function useQuickAuth(): UseQuickAuthReturn {
  const [user, setUser] = useState<QuickAuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Check if Quick Auth is available on mount
  useEffect(() => {
    const checkAvailability = async () => {
      const available = await isQuickAuthAvailable();
      setIsAvailable(available);
    };
    checkAvailability();
  }, []);

  const signIn = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check availability first
      const available = await isQuickAuthAvailable();
      if (!available) {
        const error = new Error("Farcaster connection is only available in Warpcast or Farcaster app. Please open this app in Warpcast to connect.");
        setError(error);
        setIsLoading(false);
        return;
      }

      // Check if quickAuth methods exist
      if (!sdk.quickAuth || typeof sdk.quickAuth.getToken !== "function") {
        const error = new Error("Quick Auth is not supported in this environment.");
        setError(error);
        setIsLoading(false);
        return;
      }

      // Get token from Farcaster SDK
      const result = await sdk.quickAuth.getToken();
      if (!result || !result.token) {
        throw new Error("Failed to retrieve authentication token.");
      }

      const authToken = result.token;
      setToken(authToken);

      // Verify token with backend
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || window.location.origin;
      
      // Use regular fetch if quickAuth.fetch is not available
      const fetchMethod = sdk.quickAuth.fetch || fetch;
      const response = await fetchMethod(`${backendUrl}/api/auth`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`);
      }

      const data = await response.json();
      setUser({ fid: data.fid, token: authToken });
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Authentication failed");
      setError(error);
      setToken(null);
      setUser(null);
      // Only log error if it's not a "not available" error
      if (!error.message.includes("not available") && !error.message.includes("not supported")) {
        console.error("Quick Auth sign in error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  // Auto-sign in if we're in a Farcaster context
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check availability first
        const available = await isQuickAuthAvailable();
        if (!available) {
          return;
        }

        // Check if we're in a Farcaster context
        const context = await sdk.context;
        if (context?.user && sdk.quickAuth && typeof sdk.quickAuth.getToken === "function") {
          // Try to get token if available
          try {
            const result = await sdk.quickAuth.getToken();
            if (result?.token) {
              const authToken = result.token;
              setToken(authToken);
              // Verify with backend
              const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || window.location.origin;
              const fetchMethod = sdk.quickAuth.fetch || fetch;
              const response = await fetchMethod(`${backendUrl}/api/auth`, {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              });

              if (response.ok) {
                const data = await response.json();
                setUser({ fid: data.fid, token: authToken });
              }
            }
          } catch {
            // Token not available, user needs to sign in
            // This is expected in some contexts
          }
        }
      } catch (err) {
        // Not in Farcaster context or SDK not available
        // This is expected when not in a Farcaster client
      }
    };

    initAuth();
  }, []);

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    isAvailable,
    signIn,
    signOut,
    error,
  };
}

