"use client";

import { useEffect } from "react";

/**
 * Suppresses harmless MetaMask provider conflict errors
 * This error occurs when multiple wallet extensions try to set window.ethereum
 * It's harmless and doesn't affect functionality
 */
export function ConsoleErrorFilter() {
  useEffect(() => {
    // Set up error filter immediately
    const originalError = console.error;
    const originalWarn = console.warn;
    
    const shouldSuppress = (message: string): boolean => {
      return (
        message.includes("MetaMask encountered an error setting the global Ethereum provider") ||
        message.includes("Cannot set property ethereum") ||
        message.includes("which has only a getter") ||
        message.includes("ethereum of #<Window>")
      );
    };
    
    console.error = (...args: unknown[]) => {
      const message = args[0]?.toString() || "";
      if (shouldSuppress(message)) {
        return; // Suppress MetaMask provider conflict errors (harmless)
      }
      originalError.apply(console, args);
    };
    
    console.warn = (...args: unknown[]) => {
      const message = args[0]?.toString() || "";
      if (shouldSuppress(message)) {
        return; // Also suppress warnings with same pattern
      }
      originalWarn.apply(console, args);
    };

    // Cleanup: restore original console methods on unmount
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  return null;
}

