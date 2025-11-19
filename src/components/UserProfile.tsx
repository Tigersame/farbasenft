"use client";

import { Connected } from "@coinbase/onchainkit";
import { Identity, Avatar, Name } from "@coinbase/onchainkit/identity";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useAccount, useBalance } from "wagmi";
import { base } from "wagmi/chains";

/**
 * User Profile Component
 * 
 * Follows Base Mini App product guidelines:
 * - Shows user's profile with avatar and username
 * - Avoids showing 0x addresses
 * - Visible on screen
 */
export function UserProfile() {
  const { address } = useAccount();
  const { context } = useMiniKit();
  const { data: balanceData, isLoading: balanceLoading } = useBalance({
    address: address,
    chainId: base.id,
  });

  // Show Farcaster profile if available, otherwise show wallet profile
  const displayName = context?.user?.displayName || context?.user?.username 
    ? `@${context.user.username}` 
    : null;
  const avatarUrl = context?.user?.pfpUrl;

  if (!address && !context?.user) {
    return null;
  }

  return (
    <Connected>
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Profile"
            className="h-10 w-10 rounded-full"
          />
        ) : (
          <Identity>
            <Avatar className="h-10 w-10" />
          </Identity>
        )}
        <div className="flex-1 min-w-0">
          {displayName ? (
            <p className="text-sm font-semibold text-white truncate">{displayName}</p>
          ) : (
            <Identity>
              <Name className="text-sm font-semibold text-white truncate" />
            </Identity>
          )}
          <p className="text-xs text-slate-400">Collector</p>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          {balanceLoading ? (
            <div className="h-5 w-20 animate-pulse rounded bg-slate-700/50"></div>
          ) : balanceData ? (
            <>
              <p className="text-sm font-semibold text-white">
                {parseFloat(balanceData.formatted).toFixed(4)} {balanceData.symbol}
              </p>
              <p className="text-xs text-slate-400">Balance</p>
            </>
          ) : null}
        </div>
      </div>
    </Connected>
  );
}

