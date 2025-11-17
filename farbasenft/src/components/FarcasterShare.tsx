"use client";

import { useMiniKit, useComposeCast } from "@coinbase/onchainkit/minikit";
import { Wallet, ConnectWallet } from "@coinbase/onchainkit/wallet";
import { minikitConfig } from "@/lib/minikit.config";
import { useQuickAuth } from "@/lib/useQuickAuth";
import { useSDKActions } from "@/lib/useSDKActions";

interface FarcasterShareProps {
  nftTitle?: string;
  nftImage?: string;
  nftUrl?: string;
  customText?: string;
}

export function FarcasterShare({ nftTitle, nftImage, nftUrl, customText }: FarcasterShareProps) {
  const { context } = useMiniKit();
  const { composeCast: miniKitComposeCast } = useComposeCast();
  const { composeCast: sdkComposeCast } = useSDKActions();
  const { 
    user: quickAuthUser, 
    isLoading: isAuthLoading, 
    signIn, 
    isAuthenticated: isQuickAuth,
    isAvailable: isQuickAuthAvailable,
    error: quickAuthError
  } = useQuickAuth();
  
  // Use Quick Auth user if available, otherwise fall back to MiniKit context
  const isAuthenticated = isQuickAuth || !!context?.user;
  const userFid = quickAuthUser?.fid || context?.user?.fid;

  // Use MiniKit composeCast if available, otherwise fall back to SDK
  const composeCast = miniKitComposeCast || sdkComposeCast;

  const handleShareNFT = () => {
    const displayName = context?.user?.displayName ?? context?.user?.username ?? (userFid ? `FID ${userFid}` : "collector");
    const shareUrl = nftUrl || `${window.location.origin}/share/${displayName}`;
    
    const shareText = customText || 
      (nftTitle 
        ? `Check out this NFT: ${nftTitle} on farbasenft! 🎨`
        : `Check out farbasenft - Foundation-inspired NFT gallery on Base! 🎨`);

    composeCast({
      text: shareText,
      embeds: nftImage ? [nftImage, shareUrl] : [shareUrl],
    });
  };

  const handleShareApp = () => {
    const displayName = context?.user?.displayName ?? context?.user?.username ?? (userFid ? `FID ${userFid}` : "collector");
    composeCast({
      text: `Check out ${minikitConfig.miniapp.name}! ${minikitConfig.miniapp.description}`,
      embeds: [`${window.location.origin}/share/${displayName}`],
    });
  };

  const handleQuickAuthSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error("Quick Auth sign in failed:", error);
    }
  };

  // Check if we're in a Farcaster context (MiniKit or Quick Auth available)
  const isInFarcasterContext = isQuickAuthAvailable || !!context;
  
  // Always show connect button - let users try to connect
  if (!isAuthenticated) {
    return (
      <div className="space-y-3">
        <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
          {isInFarcasterContext ? (
            "Connect your Farcaster account to share NFTs and cast to your profile."
          ) : (
            <>
              <p className="font-semibold mb-1">Connect to Farcaster</p>
              <p className="text-xs text-amber-300/80">
                Open this app in Warpcast or Farcaster mobile app for the best experience. 
                You can also try connecting below.
              </p>
            </>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {/* Quick Auth Sign In Button - Always show, but may not work outside Farcaster */}
          <button
            type="button"
            onClick={handleQuickAuthSignIn}
            disabled={isAuthLoading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500/20 px-4 py-2.5 text-sm font-semibold text-amber-200 transition hover:bg-amber-500/30 border border-amber-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAuthLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Connecting...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                {isQuickAuthAvailable ? "Sign In with Farcaster" : "Try Farcaster Connect"}
              </>
            )}
          </button>
          
          {/* Show error message if Quick Auth failed */}
          {quickAuthError && (
            <div className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-200">
              {quickAuthError.message}
              {!isQuickAuthAvailable && (
                <p className="mt-1 text-xs text-red-300/80">
                  Make sure you're in Warpcast or Farcaster app to use this feature.
                </p>
              )}
            </div>
          )}
          
          {/* Wallet Connection Button - Always show as alternative */}
          <Wallet>
            <ConnectWallet
              disconnectedLabel="Connect Wallet (Alternative)"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-700/50 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700/70 border border-slate-600/50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              Connect Wallet
            </ConnectWallet>
          </Wallet>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">
            {context?.user?.displayName || 
             (context?.user?.username ? `@${context.user.username}` : null) || 
             (userFid ? `FID ${userFid}` : "Farcaster User")}
          </p>
          <p className="text-xs text-slate-400">
            FID: {userFid}
            {isQuickAuth && quickAuthUser && (
              <span className="ml-2 text-xs text-green-400">✓ Quick Auth</span>
            )}
          </p>
        </div>
        {context?.user?.pfpUrl && (
          <img
            src={context.user.pfpUrl}
            alt="Profile"
            className="h-10 w-10 rounded-full border border-white/10"
          />
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {nftTitle && (
          <button
            type="button"
            onClick={handleShareNFT}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-500/20 px-4 py-2 text-sm font-semibold text-purple-200 transition hover:bg-purple-500/30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Share NFT
          </button>
        )}
        <button
          type="button"
          onClick={handleShareApp}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/30"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          Share App
        </button>
      </div>
    </div>
  );
}

