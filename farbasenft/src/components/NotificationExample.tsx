"use client";

import { useState } from "react";
import { useNotifications } from "@/lib/useNotifications";

/**
 * Example component demonstrating how to add the Mini App and enable notifications
 * 
 * This component shows how to:
 * 1. Prompt users to add the Mini App
 * 2. Handle notification enablement
 * 3. Display status to users
 */
export function NotificationExample() {
  const { addMiniApp } = useNotifications();
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddMiniApp = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const result = await addMiniApp();
      
      if (result.success) {
        if (result.notificationsEnabled) {
          setStatus("✅ Mini App added with notifications enabled! You'll receive updates about your NFTs.");
        } else {
          setStatus("✅ Mini App added! Enable notifications in settings to receive updates.");
        }
      } else {
        setStatus(`❌ Error: ${result.error || "Failed to add Mini App"}`);
      }
    } catch (error) {
      setStatus(`❌ Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-blue-400/30 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6">
      <h3 className="text-lg font-semibold text-white mb-2">🔔 Enable Notifications</h3>
      <p className="text-sm text-slate-300 mb-4">
        Add this Mini App to your Base or Farcaster client and enable notifications to receive updates about:
      </p>
      <ul className="text-xs text-slate-400 mb-4 space-y-1 list-disc list-inside">
        <li>New NFT listings</li>
        <li>Bid updates</li>
        <li>Purchase confirmations</li>
        <li>XP milestones</li>
      </ul>
      
      <button
        onClick={handleAddMiniApp}
        disabled={loading}
        className="w-full rounded-xl bg-blue-500/20 px-4 py-3 text-sm font-semibold text-blue-200 transition hover:bg-blue-500/30 border border-blue-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Adding Mini App..." : "Add Mini App & Enable Notifications"}
      </button>

      {status && (
        <div className={`mt-4 rounded-lg border p-3 ${
          status.includes("✅")
            ? "border-green-400/30 bg-green-500/10"
            : "border-red-400/30 bg-red-500/10"
        }`}>
          <p className={`text-xs ${
            status.includes("✅")
              ? "text-green-200"
              : "text-red-200"
          }`}>
            {status}
          </p>
        </div>
      )}
    </div>
  );
}

