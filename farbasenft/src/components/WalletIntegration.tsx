'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useEnsName } from 'wagmi';

interface BaseNameInfo {
  name: string;
  address: string;
  avatar?: string;
  bio?: string;
}

export function WalletIntegration() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false);
  const [baseNameInfo, setBaseNameInfo] = useState<BaseNameInfo | null>(null);
  const [loadingBaseName, setLoadingBaseName] = useState(false);
  const { data: ensName } = useEnsName({ address });

  // Fetch Base name/avatar information
  useEffect(() => {
    if (!address) {
      setBaseNameInfo(null);
      return;
    }

    const fetchBaseNameInfo = async () => {
      try {
        setLoadingBaseName(true);
        // Try to fetch from Basenames service
        const response = await fetch(`/api/wallet/basename?address=${address}`);
        if (response.ok) {
          const data = await response.json();
          setBaseNameInfo(data);
        }
      } catch (error) {
        console.error('Failed to fetch Base name info:', error);
      } finally {
        setLoadingBaseName(false);
      }
    };

    fetchBaseNameInfo();
  }, [address]);

  const displayName = baseNameInfo?.name || ensName || address?.slice(0, 6) + '...' + address?.slice(-4);
  const displayAvatar = baseNameInfo?.avatar;

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-linear-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 px-3 py-2">
          {displayAvatar && (
            <img
              src={displayAvatar}
              alt={displayName}
              className="w-6 h-6 rounded-full"
            />
          )}
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Connected</span>
            <span className="text-sm font-semibold text-white">{displayName}</span>
          </div>
        </div>
        <button
          onClick={() => disconnect()}
          className="rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 px-3 py-2 text-sm font-medium text-red-300 transition"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-lg bg-linear-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 px-4 py-2 font-semibold text-white transition shadow-lg shadow-cyan-500/50"
      >
        Connect Wallet
      </button>

      {/* Connect Wallet Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-cyan-500/30 bg-linear-to-br from-slate-900/95 via-slate-900/95 to-cyan-900/20 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="relative p-6 border-b border-cyan-500/20">
              <h2 className="text-2xl font-bold text-white">Connect Wallet</h2>
              <p className="mt-1 text-sm text-slate-400">
                Choose your preferred wallet to get started
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white transition"
                aria-label="Close wallet connection modal"
                title="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Connectors */}
            <div className="p-6 space-y-3">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => {
                    connect({ connector });
                    setIsOpen(false);
                  }}
                  disabled={isPending}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-cyan-500/20 bg-cyan-500/5 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition disabled:opacity-50"
                >
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h16z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-white">{connector.name}</p>
                    <p className="text-xs text-slate-400">
                      {connector.uid === 'coinbaseWalletSDK'
                        ? 'Coinbase Wallet'
                        : connector.uid === 'metaMask'
                          ? 'MetaMask Browser Extension'
                          : 'WalletConnect Compatible'}
                    </p>
                  </div>
                  {isPending && (
                    <div className="w-5 h-5 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
                  )}
                </button>
              ))}
            </div>

            {/* Info Section */}
            <div className="border-t border-cyan-500/20 p-6 bg-cyan-500/5">
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400 text-xs font-bold">
                    ✓
                  </div>
                  <p className="text-slate-300">
                    <span className="font-semibold text-white">Resolve Basenames</span> - Connect with your Base domain name
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400 text-xs font-bold">
                    ✓
                  </div>
                  <p className="text-slate-300">
                    <span className="font-semibold text-white">Secure & Fast</span> - Powered by Coinbase and Web3 standards
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400 text-xs font-bold">
                    ✓
                  </div>
                  <p className="text-slate-300">
                    <span className="font-semibold text-white">Base L2</span> - Optimized for Base blockchain transactions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
