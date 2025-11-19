"use client";

import { useEffect } from "react";

/**
 * Suppresses harmless MetaMask provider conflict errors and other non-critical warnings
 */
export function ConsoleErrorFilter() {
  useEffect(() => {
    // Store original console methods
    const originalError = console.error;
    const originalWarn = console.warn;
    
    const shouldSuppress = (message: string): boolean => {
      if (!message) return false;
      const str = String(message).toLowerCase();
      
      return (
        str.includes("metamask encountered an error setting the global ethereum provider") ||
        str.includes("cannot set property ethereum") ||
        str.includes("which has only a getter") ||
        str.includes("ethereum of #<window>") ||
        str.includes("cross-origin-opener-policy") ||
        str.includes("http error! status: 404") ||
        str.includes("http error! status: 401") ||
        str.includes("failed to fetch") ||
        str.includes("preload") ||
        str.includes("not used") ||
        str.includes("failed to load resource") ||
        str.includes("/dashboard") ||
        str.includes("404 (not found)") ||
        str.includes("401 (unauthorized)") ||
        str.includes("401") && str.includes("unauthorized")
      );
    };
    
    // Override console.error with proper binding
    console.error = function(...args: unknown[]) {
      const message = String(args[0] || "");
      if (!shouldSuppress(message)) {
        originalError.call(console, ...args);
      }
    };
    
    // Override console.warn with proper binding
    console.warn = function(...args: unknown[]) {
      const message = String(args[0] || "");
      if (!shouldSuppress(message)) {
        originalWarn.call(console, ...args);
      }
    };

    // Cleanup: restore original console methods on unmount
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  return null;
}
