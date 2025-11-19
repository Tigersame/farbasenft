'use client';

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

interface UserStats {
  totalTrades: number;
  totalVolume: string;
  totalNFTsOwned: number;
  successRate: number;
  totalXP: number;
  level: number;
}

interface TradeHistory {
  id: string;
  type: 'buy' | 'sell' | 'list' | 'mint';
  nftName: string;
  price: string;
  currency: 'ETH' | 'USDC';
  timestamp: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export default function Dashboard() {
  const { address } = useAccount();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [trades, setTrades] = useState<TradeHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    if (!address) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch user stats with caching
        const statsRes = await fetch(`/api/dashboard/stats?wallet=${address}&range=${timeRange}`, {
          cache: 'force-cache',
          headers: {
            'Cache-Control': 'max-age=60', // Cache for 60 seconds
          }
        });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // Fetch trade history with caching
        const tradesRes = await fetch(`/api/dashboard/trades?wallet=${address}&range=${timeRange}`, {
          cache: 'force-cache',
          headers: {
            'Cache-Control': 'max-age=60', // Cache for 60 seconds
          }
        });
        if (tradesRes.ok) {
          const tradesData = await tradesRes.json();
          setTrades(tradesData);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [address, timeRange]);

  if (!address) {
    return (
      <div className="rounded-2xl border border-cyan-400/30 bg-linear-to-br from-cyan-500/10 to-purple-500/10 p-8 text-center">
        <p className="text-lg text-slate-300">Connect your wallet to view your dashboard</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-800/50" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Total Trades */}
        <div className="rounded-xl border border-emerald-500/30 bg-linear-to-br from-emerald-500/10 to-emerald-600/5 p-4">
          <p className="text-xs uppercase tracking-wider text-emerald-300/80">Total Trades</p>
          <p className="mt-2 text-3xl font-bold text-white">{stats?.totalTrades || 0}</p>
          <p className="mt-1 text-xs text-slate-400">
            {Math.floor((stats?.totalTrades || 0) * 0.15)} pending
          </p>
        </div>

        {/* Trading Volume */}
        <div className="rounded-xl border border-blue-500/30 bg-linear-to-br from-blue-500/10 to-blue-600/5 p-4">
          <p className="text-xs uppercase tracking-wider text-blue-300/80">Trading Volume</p>
          <p className="mt-2 text-3xl font-bold text-white">{stats?.totalVolume || '0'} ETH</p>
          <p className="mt-1 text-xs text-slate-400">≈ ${(parseFloat(stats?.totalVolume || '0') * 2400).toFixed(0)}</p>
        </div>

        {/* NFTs Owned */}
        <div className="rounded-xl border border-purple-500/30 bg-linear-to-br from-purple-500/10 to-purple-600/5 p-4">
          <p className="text-xs uppercase tracking-wider text-purple-300/80">NFTs Owned</p>
          <p className="mt-2 text-3xl font-bold text-white">{stats?.totalNFTsOwned || 0}</p>
          <p className="mt-1 text-xs text-slate-400">+2 this month</p>
        </div>

        {/* Success Rate */}
        <div className="rounded-xl border border-pink-500/30 bg-linear-to-br from-pink-500/10 to-pink-600/5 p-4">
          <p className="text-xs uppercase tracking-wider text-pink-300/80">Success Rate</p>
          <p className="mt-2 text-3xl font-bold text-white">{stats?.successRate || 0}%</p>
          <p className="mt-1 text-xs text-slate-400">Completed trades</p>
        </div>

        {/* Current Level */}
        <div className="rounded-xl border border-cyan-500/30 bg-linear-to-br from-cyan-500/10 to-cyan-600/5 p-4">
          <p className="text-xs uppercase tracking-wider text-cyan-300/80">Level</p>
          <p className="mt-2 text-3xl font-bold text-white">{stats?.level || 1}</p>
          <p className="mt-1 text-xs text-slate-400">{stats?.totalXP || 0} XP</p>
        </div>
      </div>

      {/* Trading History */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Trading History</h3>
            <p className="text-sm text-slate-400">Your recent transactions</p>
          </div>

          {/* Time Range Filter */}
          <div className="flex gap-2">
            {(['7d', '30d', '90d', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  timeRange === range
                    ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/50'
                    : 'bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-slate-800'
                }`}
              >
                {range === 'all' ? 'All' : range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {trades.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    NFT
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr key={trade.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                          trade.type === 'buy'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : trade.type === 'sell'
                              ? 'bg-red-500/20 text-red-300'
                              : trade.type === 'list'
                                ? 'bg-blue-500/20 text-blue-300'
                                : 'bg-purple-500/20 text-purple-300'
                        }`}
                      >
                        {trade.type.charAt(0).toUpperCase() + trade.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white">{trade.nftName}</td>
                    <td className="px-4 py-3">
                      <span className="text-white font-semibold">
                        {trade.price} {trade.currency}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(trade.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                          trade.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : trade.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-slate-400">No trades yet. Start buying or selling NFTs!</p>
          </div>
        )}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Activity Chart Placeholder */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 md:col-span-2">
          <h3 className="mb-4 text-lg font-bold text-white">Trading Activity</h3>
          <div className="flex h-40 items-end gap-2 rounded-lg bg-slate-800/30 p-4">
            {[65, 59, 80, 81, 56, 55, 40, 48, 65, 52, 71, 68].map((value, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-linear-to-t from-cyan-500 to-purple-500 transition hover:opacity-80"
                style={{ height: `${value}%` }}
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400">Last 12 months activity</p>
        </div>

        {/* Portfolio Distribution */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
          <h3 className="mb-4 text-lg font-bold text-white">Portfolio</h3>
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-slate-300">ETH</span>
                <span className="text-emerald-400 font-semibold">45%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                <div className="h-full w-[45%] bg-emerald-500" />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-slate-300">USDC</span>
                <span className="text-blue-400 font-semibold">35%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                <div className="h-full w-[35%] bg-blue-500" />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-slate-300">DEGEN</span>
                <span className="text-purple-400 font-semibold">20%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                <div className="h-full w-[20%] bg-purple-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
