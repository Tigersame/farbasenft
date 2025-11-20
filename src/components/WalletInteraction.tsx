"use client";

import { useState } from "react";
import { useAccount, useConnect, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";

/**
 * Wallet Connection Component
 * 
 * Follows Farcaster Mini App wallet guidelines:
 * - Auto-connects to user's wallet in Farcaster context
 * - No wallet selection dialog needed
 * - Simple connect button for users without wallet
 * 
 * Reference: https://miniapps.farcaster.xyz/docs/guides/wallets
 */
export function WalletConnection() {
  const { isConnected, address } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const [showDetails, setShowDetails] = useState(false);

  const handleConnect = () => {
    // Connect to first connector (Farcaster Mini App connector)
    if (connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  };

  if (isConnected) {
    return (
      <div className="space-y-3">
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-200">Wallet Connected</p>
                <p className="text-xs text-emerald-300/70">Ready for transactions</p>
              </div>
            </div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-emerald-300 hover:text-emerald-200 transition"
            >
              {showDetails ? 'Hide' : 'Details'}
            </button>
          </div>
          
          {showDetails && address && (
            <div className="mt-3 pt-3 border-t border-emerald-500/20">
              <p className="text-xs text-emerald-300/80 break-all">
                {address}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
        <div className="flex items-start gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Connect Wallet</p>
            <p className="text-xs text-slate-400 mt-1">
              Connect your wallet to start transacting on Base
            </p>
          </div>
        </div>
        
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConnecting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </span>
          ) : (
            'Connect Wallet'
          )}
        </button>
      </div>
    </div>
  );
}

/**
 * Simple Transaction Component
 * Demonstrates sending a transaction with Wagmi
 */
export function SendTransactionExample() {
  const { isConnected } = useAccount();
  const { sendTransaction, data: hash, isPending, error } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const handleSend = () => {
    if (!recipient || !amount) return;
    
    sendTransaction({
      to: recipient as `0x${string}`,
      value: parseEther(amount),
    });
  };

  if (!isConnected) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
        <p className="text-sm text-amber-200">
          Connect your wallet to send transactions
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Amount (ETH)
          </label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.01"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      <button
        onClick={handleSend}
        disabled={isPending || isConfirming || !recipient || !amount}
        className="w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Send Transaction'}
      </button>

      {hash && (
        <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-3">
          <p className="text-xs font-semibold text-slate-300 mb-1">Transaction Hash:</p>
          <p className="text-xs text-slate-400 break-all">{hash}</p>
        </div>
      )}

      {isSuccess && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
          <p className="text-sm text-emerald-200 font-semibold">✓ Transaction confirmed!</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
          <p className="text-sm text-red-200">{error.message}</p>
        </div>
      )}
    </div>
  );
}
