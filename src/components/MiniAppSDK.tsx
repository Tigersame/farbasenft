"use client";

import { useEffect, useState } from "react";

/**
 * Component to initialize Farcaster Mini App SDK and call ready()
 * This is required to hide the splash screen and display the app
 * 
 * Best practices from Farcaster docs:
 * - Call ready() as soon as possible while avoiding jitter
 * - Wait for interface to load before calling ready()
 * - Use skeleton states if additional loading is required
 */
export function MiniAppSDK() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeSDK = async () => {
      try {
        // Dynamically import SDK to avoid SSR issues
        const { sdk } = await import("@farcaster/miniapp-sdk");
        
        // Check if we're in a Farcaster Mini App context
        const inMiniApp = await sdk.isInMiniApp().catch(() => false);
        
        if (!inMiniApp) {
          if (mounted) {
            setIsReady(true);
            console.log("ℹ️ Running in browser mode - not in Farcaster Mini App");
          }
          return;
        }

        console.log("✅ Detected Farcaster Mini App context");

        // Call ready() immediately - don't wait for content
        // The splash screen timeout is more important than avoiding jitter
        try {
          await sdk.actions.ready({ disableNativeGestures: false });
          console.log("✅ Mini App SDK ready() called successfully");
        } catch (e) {
          console.warn("⚠️ Failed to call sdk.actions.ready():", e);
        }
        
        if (mounted) {
          setIsReady(true);
        }
      } catch (err) {
        console.error("❌ Mini App SDK initialization error:", err);
        // Fail gracefully - still show the app
        if (mounted) {
          setIsReady(true);
        }
      }
    };

    initializeSDK();

    return () => {
      mounted = false;
    };
  }, []);

  // Return null - this component only handles SDK initialization
  // Loading states are handled by Suspense boundaries
  return null;
}


