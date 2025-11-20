"use client";

import { useEffect } from "react";

/**
 * Component to initialize Farcaster Mini App SDK and call ready()
 * This is required to hide the splash screen and display the app
 * 
 * IMPORTANT: Call ready() as fast as possible to avoid splash screen timeout
 */
export function MiniAppSDK() {
  useEffect(() => {
    // Immediately try to call ready() without any checks or delays
    (async () => {
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");
        
        // Call ready() immediately - don't check if in Mini App first
        // If not in Mini App, this will just fail silently
        await sdk.actions.ready({ disableNativeGestures: false });
        console.log("✅ Mini App SDK ready() called");
      } catch (err) {
        // Silently fail if not in Mini App context
        console.log("ℹ️ Not in Mini App context or ready() failed:", err);
      }
    })();
  }, []);

  return null;
}


