'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface WalletBalance {
  token: string;
  symbol: string;
  balance: string;
  usdValue: string;
  decimals: number;
}

export function WalletBalance() {
  const { address } = useAccount();
  const [balances, setBalances] = useState<WalletBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalUsd, setTotalUsd] = useState('0');

  useEffect(() => {
    if (!address) {
      setBalances([]);
      return;
    }

    const fetchBalances = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/wallet/balances?address=${address}`);
        if (response.ok) {
          const data = await response.json();
          setBalances(data.balances || []);
          setTotalUsd(data.totalUsd || '0');
        }
      } catch (error) {
        console.error('Failed to fetch balances:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [address]);

  if (!address) {
    return null;
  }

  return (
    <div className="rounded-xl border border-cyan-500/30 bg-linear-to-br from-cyan-500/10 to-purple-500/10 p-4">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-wider text-cyan-300/80">Portfolio Value</p>
        <p className="mt-1 text-2xl font-bold text-white">${totalUsd}</p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Assets
        </p>
        {loading ? (
          <div className="animate-pulse space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-slate-700/30 rounded" />
            ))}
          </div>
        ) : balances.length > 0 ? (
          balances.map((balance) => (
            <div key={balance.token} className="flex items-center justify-between text-sm">
              <span className="text-slate-300">{balance.symbol}</span>
              <div className="text-right">
                <p className="font-semibold text-white">{balance.balance}</p>
                <p className="text-xs text-slate-500">${balance.usdValue}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">No assets yet</p>
        )}
      </div>
    </div>
  );
}
