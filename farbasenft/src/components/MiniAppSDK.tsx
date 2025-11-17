"use client";

import { useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { useSDKEvents } from "@/lib/useSDKEvents";

/**
 * Component to initialize Farcaster Mini App SDK and call ready()
 * This is required to hide the splash screen and display the app
 * 
 * Reference: https://miniapps.farcaster.xyz/docs/guides/loading
 * 
 * Best practices:
 * - Call ready() when interface is ready (avoid jitter and content reflows)
 * - Don't call ready() until interface has loaded
 * - Use placeholders/skeleton states if additional loading is required
 * - Call ready() as soon as possible while avoiding jitter
 */
export function MiniAppSDK() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInMiniApp, setIsInMiniApp] = useState(false);

  // Set up event listeners
  useSDKEvents();

  useEffect(() => {
    let mounted = true;

    const initializeSDK = async () => {
      try {
        // Check if we're in a Farcaster Mini App context
        const inMiniApp = await sdk.isInMiniApp();
        
        if (mounted) {
          setIsInMiniApp(inMiniApp);
        }
        
        if (!inMiniApp) {
          // Not in Mini App context, but we can still mark as ready
          // This allows the app to work in regular browsers
          if (mounted) {
            setIsReady(true);
            console.log("ℹ️ Not in Mini App context - app will work in browser mode");
          }
          return;
        }

        // Wait for DOM to be ready and initial content to load
        // This prevents jitter and content reflows
        // Following best practices: call ready() when interface is ready
        const waitForContent = () => {
          return new Promise<void>((resolve) => {
            // Wait for document to be ready
            if (document.readyState === "complete") {
              resolve();
            } else {
              window.addEventListener("load", () => resolve(), { once: true });
            }
          });
        };

        // Wait a small amount for initial render to complete
        // This ensures the interface has loaded before hiding splash screen
        await waitForContent();
        
        // Small delay to ensure React has rendered initial content
        // This prevents jitter when splash screen is hidden
        await new Promise(resolve => setTimeout(resolve, 100));

        // Call ready() to hide the splash screen and display the app
        // This is critical - without it, users see an infinite loading screen
        // Reference: https://miniapps.farcaster.xyz/docs/guides/loading#calling-ready
        await sdk.actions.ready();
        
        if (mounted) {
          setIsReady(true);
          console.log("✅ Mini App SDK initialized and ready - splash screen hidden");
          
            // Log context information for debugging
            try {
              const context = await sdk.context;
            console.log("📱 Mini App context:", {
              user: context?.user ? {
                fid: context.user.fid,
                username: context.user.username,
                displayName: context.user.displayName,
              } : null,
            });
          } catch (ctxError) {
            // Context may not be available immediately
            console.log("ℹ️ Context not yet available");
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to initialize SDK";
        console.error("❌ Mini App SDK initialization error:", errorMessage);
        
        if (mounted) {
          setError(errorMessage);
          // Still mark as ready to prevent infinite loading
          setIsReady(true);
        }
      }
    };

    // Initialize SDK - useEffect ensures this only runs once
    // Following React best practices from the documentation
    initializeSDK();

    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array - only run once on mount

  // This component doesn't render anything visible
  // It just handles SDK initialization
  return null;
}

