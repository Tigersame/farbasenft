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

        // Wait for critical content to be ready to avoid jitter
        // Check for key elements that should be loaded before showing the app
        const waitForCriticalContent = () => {
          return new Promise<void>((resolve) => {
            const checkContent = () => {
              // Wait for document to be interactive or complete
              if (document.readyState === "complete" || document.readyState === "interactive") {
                // Give a brief moment for React to hydrate and render initial content
                setTimeout(() => resolve(), 100);
              } else {
                window.addEventListener("DOMContentLoaded", () => {
                  setTimeout(() => resolve(), 100);
                }, { once: true });
              }
            };
            checkContent();
          });
        };

        await waitForCriticalContent();

        // Call ready() to hide the splash screen - do this ASAP after content is ready
        await sdk.actions.ready({ disableNativeGestures: false }).catch((e) => {
          console.warn("⚠️ Failed to call sdk.actions.ready():", e);
        });
        
        if (mounted) {
          setIsReady(true);
          console.log("✅ Mini App SDK ready() called - splash screen hidden");
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


