"use client";

import { useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

/**
 * Hook for managing Mini App notifications
 * 
 * Use this to prompt users to add the Mini App and enable notifications
 */
export function useNotifications() {
  const addMiniApp = useCallback(async () => {
    try {
      const response = await sdk.actions.addMiniApp();
      
      if (response.notificationDetails) {
        return {
          success: true,
          notificationsEnabled: true,
          message: "Mini App added with notifications enabled!",
        };
      } else {
        return {
          success: true,
          notificationsEnabled: false,
          message: "Mini App added. Enable notifications in settings to receive updates.",
        };
      }
    } catch (error) {
      console.error("Failed to add Mini App:", error);
      return {
        success: false,
        notificationsEnabled: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }, []);

  return { addMiniApp };
}

