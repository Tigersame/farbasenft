"use client";

import { useQuickAuth } from "@/lib/useQuickAuth";
import { useMiniAppContext } from "@/lib/useMiniAppContext";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

/**
 * Debug component to help troubleshoot Farcaster connection issues
 * Now inside OnchainKitProvider so it can safely use useMiniKit
 * Remove this in production
 */
export function FarcasterDebug() {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const { context: miniKitContext } = useMiniKit();
  const { 
    user: quickAuthUser, 
    isAvailable: isQuickAuthAvailable,
    isAuthenticated: isQuickAuth 
  } = useQuickAuth();
  const { context: sdkContext, isInMiniApp } = useMiniAppContext();

  const allDisabled = !isInMiniApp && !isQuickAuthAvailable && !isQuickAuth && !miniKitContext?.user && !sdkContext?.user;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-xs rounded-lg border border-slate-700 bg-slate-900 p-3 text-xs text-slate-300">
      <p className="font-semibold text-white mb-2">🔍 Farcaster Debug</p>
      <div className="space-y-1">
        <p>In Mini App: {isInMiniApp ? "✅" : "❌"}</p>
        <p>Quick Auth Available: {isQuickAuthAvailable ? "✅" : "❌"}</p>
        <p>Quick Auth Authenticated: {isQuickAuth ? "✅" : "❌"}</p>
        <p>MiniKit Context: {miniKitContext?.user ? "✅" : "❌"}</p>
        <p>SDK Context: {sdkContext?.user ? "✅" : "❌"}</p>
        {quickAuthUser && <p>FID: {quickAuthUser.fid}</p>}
        {miniKitContext?.user?.fid && <p>MiniKit FID: {miniKitContext.user.fid}</p>}
        {miniKitContext?.user?.username && <p>Username: @{miniKitContext.user.username}</p>}
      </div>
      {allDisabled && (
        <div className="mt-3 pt-3 border-t border-slate-700">
          <p className="text-amber-400 font-semibold mb-1">⚠️ Browser Mode</p>
          <p className="text-slate-400 text-xs leading-relaxed">
            Open this app in <strong>Warpcast</strong> or <strong>Farcaster mobile app</strong> to enable all features.
          </p>
          <div className="mt-2 space-y-1 text-xs">
            <p className="text-slate-500">To test:</p>
            <ol className="list-decimal list-inside space-y-0.5 text-slate-400 ml-2">
              <li>Open Warpcast (web or mobile)</li>
              <li>Create a cast with this URL</li>
              <li>Click the mini app button</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

