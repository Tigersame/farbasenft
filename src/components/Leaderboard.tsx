'use client';

import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Zap } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  address: string;
  username: string;
  totalXP: number;
  weeklyXP: number;
  nftsOwned: number;
  achievements: string[];
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [timeframe, setTimeframe] = useState<'all' | 'month' | 'week'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      // Simulate fetching leaderboard data
      const mockData: LeaderboardEntry[] = [
        {
          rank: 1,
          address: '0x1234...5678',
          username: 'ProCollector',
          totalXP: 8500,
          weeklyXP: 450,
          nftsOwned: 42,
          achievements: ['First NFT', 'Swap Master', 'Early Adopter'],
        },
        {
          rank: 2,
          address: '0xabcd...ef01',
          username: 'NFTWhale',
          totalXP: 7200,
          weeklyXP: 380,
          nftsOwned: 156,
          achievements: ['Collector', 'Whale', 'Community Star'],
        },
        {
          rank: 3,
          address: '0x2468...ace0',
          username: 'TradeKing',
          totalXP: 6800,
          weeklyXP: 320,
          nftsOwned: 28,
          achievements: ['Swap Master', 'Trading Pro'],
        },
        {
          rank: 4,
          address: '0x1357...beef',
          username: 'MintMaster',
          totalXP: 5900,
          weeklyXP: 290,
          nftsOwned: 89,
          achievements: ['First Mint', 'Active Trader'],
        },
        {
          rank: 5,
          address: '0x9876...5432',
          username: 'SBTHolder',
          totalXP: 5200,
          weeklyXP: 210,
          nftsOwned: 15,
          achievements: ['SBT Claimer', 'Verified'],
        },
      ];
      setLeaderboard(mockData);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-slate-400 to-slate-600';
      case 3:
        return 'from-orange-400 to-orange-600';
      default:
        return 'from-slate-600 to-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="h-8 w-8 text-yellow-400" />
          <h2 className="text-3xl font-bold text-white">Leaderboard</h2>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-2">
        {(['all', 'month', 'week'] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              timeframe === tf
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {tf === 'all' ? 'All Time' : tf === 'month' ? 'This Month' : 'This Week'}
          </button>
        ))}
      </div>

      {/* Leaderboard Table */}
      {loading ? (
        <div className="text-center py-8 text-slate-400">Loading leaderboard...</div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 transition-all"
            >
              {/* Rank Badge */}
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br ${getMedalColor(
                  entry.rank
                )} shrink-0`}
              >
                <span className="text-lg font-bold text-white">{entry.rank}</span>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{entry.username}</p>
                <p className="text-xs text-slate-400">{entry.address}</p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-right">
                <div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-cyan-400">
                    <Zap className="h-4 w-4" />
                    {entry.totalXP.toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-400">Total XP</p>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-emerald-400">
                    <TrendingUp className="h-4 w-4" />
                    {entry.nftsOwned}
                  </div>
                  <p className="text-xs text-slate-400">NFTs</p>
                </div>
              </div>

              {/* Achievements */}
              <div className="hidden md:flex gap-1 shrink-0">
                {entry.achievements.slice(0, 2).map((achievement, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-500/30"
                  >
                    {achievement}
                  </span>
                ))}
                {entry.achievements.length > 2 && (
                  <span className="px-2 py-1 text-xs rounded-full bg-slate-600/30 text-slate-300">
                    +{entry.achievements.length - 2}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
        <p className="text-sm text-cyan-200">
          💡 <strong>Tip:</strong> Earn XP by swapping, minting NFTs, claiming SBTs, and participating in the community. Climb the leaderboard and unlock special achievements!
        </p>
      </div>
    </div>
  );
}
