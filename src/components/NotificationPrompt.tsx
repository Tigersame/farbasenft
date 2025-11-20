"use client";

import { useState } from "react";
import { useMiniAppContext } from "@/lib/useMiniAppContext";
import { sdk } from "@farcaster/miniapp-sdk";

/**
 * Notification Prompt Component
 * 
 * Prompts users to add the Mini App and enable notifications
 * Uses sdk.actions.addMiniApp() to trigger the native prompt
 * 
 * Reference: https://miniapps.farcaster.xyz/docs/guides/notifications
 */
export function NotificationPrompt() {
  const { isInMiniApp } = useMiniAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleEnableNotifications = async () => {
    if (!isInMiniApp) {
      setStatus("error");
      setMessage("This feature only works in Farcaster Mini Apps");
      return;
    }

    setIsLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      // Prompt user to add the Mini App
      // This triggers the native "Add to My Apps" dialog
      // If accepted, notifications are enabled by default
      await sdk.actions.addMiniApp();
      
      setStatus("success");
      setMessage("Thank you! You'll receive updates from farbasenft.");
    } catch (error) {
      console.error("[NotificationPrompt] Error:", error);
      setStatus("error");
      setMessage("Unable to enable notifications. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Only show in Farcaster context
  if (!isInMiniApp) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
          <svg className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-2">
            Stay Updated
          </h3>
          <p className="text-sm text-slate-300 mb-4">
            Get notified about new NFT drops, auction results, and exclusive rewards. 
            Enable notifications to never miss an opportunity.
          </p>

          <button
            onClick={handleEnableNotifications}
            disabled={isLoading}
            className="w-full sm:w-auto py-2.5 px-6 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enabling...
              </span>
            ) : (
              "Enable Notifications"
            )}
          </button>

          {status === "success" && (
            <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
              <p className="text-sm text-emerald-200">{message}</p>
            </div>
          )}

          {status === "error" && (
            <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
              <p className="text-sm text-red-200">{message}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700">
        <p className="text-xs text-slate-400">
          <span className="font-semibold">Rate Limits:</span> 1 notification per 30 seconds, 
          100 per day per user. You can disable notifications anytime in your Farcaster settings.
        </p>
      </div>
    </div>
  );
}

/**
 * Notification Status Display
 * Shows current notification settings
 */
export function NotificationStatus({ enabled }: { enabled: boolean }) {
  return (
    <div className={`rounded-lg border p-3 ${
      enabled 
        ? "border-emerald-500/30 bg-emerald-500/10" 
        : "border-slate-700 bg-slate-900/60"
    }`}>
      <div className="flex items-center gap-2">
        {enabled ? (
          <>
            <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="text-sm font-semibold text-emerald-200">
              Notifications Enabled
            </span>
          </>
        ) : (
          <>
            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            <span className="text-sm font-semibold text-slate-400">
              Notifications Disabled
            </span>
          </>
        )}
      </div>
    </div>
  );
}
