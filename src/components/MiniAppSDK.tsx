"use client";

import { useEffect, useState } from "react";

/**
 * Component to initialize Farcaster Mini App SDK and call ready()
 * This is required to hide the splash screen and display the app
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
            console.log("ℹ️ Running in browser mode");
          }
          return;
        }

        // Wait for DOM to be ready
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
        await new Promise(resolve => setTimeout(resolve, 150));

        // Call ready() to hide the splash screen
        await sdk.actions.ready().catch((e) => {
          console.warn("⚠️ Failed to call sdk.actions.ready():", e);
        });
        
        if (mounted) {
          setIsReady(true);
          console.log("✅ Mini App SDK ready");
        }
      } catch (err) {
        console.error("❌ SDK error:", err);
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

  return null;
}

