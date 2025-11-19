'use client';

import { useState } from 'react';
import { Share2, Trophy, Zap, TrendingUp } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  fid: number;
  username: string;
  xp: number;
  change: number;
}

// Mock leaderboard data
const generateMockLeaderboard = (): LeaderboardEntry[] => {
  const usernames = [
    'alice.eth',
    'bob.nft',
    'charlie.fc',
    'diana.xyz',
    'evan.art',
    'fiona.defi',
    'george.dao',
    'hannah.base',
    'isaac.sol',
    'julia.web3',
    'kevin.mint',
    'luna.trade',
    'mike.stake',
    'nina.swap',
    'oscar.pool',
  ];

  return usernames.map((username, index) => ({
    rank: index + 1,
    fid: 1000 + index,
    username,
    xp: Math.floor(Math.random() * 5000) + 10000,
    change: Math.floor(Math.random() * 11) - 5,
  }));
};

type TimeframeName = 'weekly' | 'monthly' | 'alltime';

export default function LeaderboardPageClient() {
  const [timeframe, setTimeframe] = useState<TimeframeName>('weekly');
  const [showShareModal, setShowShareModal] = useState(false);
  const leaderboard = generateMockLeaderboard();
  const leaderboardUrl = 'https://farbasenft.xyz/leaderboard';

  const timeframeLabels: Record<TimeframeName, string> = {
    weekly: '📅 This Week',
    monthly: '📆 This Month',
    alltime: '🏆 All Time',
  };

  const isCurrentUserInTop = Math.random() > 0.7; // 30% chance user is in top

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl font-bold text-white">XP Leaderboard</h1>
            <Trophy className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-slate-400 mb-8">
            Compete, earn XP, and climb the ranks. Top earners get exclusive rewards!
          </p>

          {/* Timeframe Filter */}
          <div className="flex gap-3 justify-center mb-8">
            {(['weekly', 'monthly', 'alltime'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  timeframe === tf
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {timeframeLabels[tf]}
              </button>
            ))}
          </div>

          {/* Share Button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-2 rounded-lg transition"
          >
            <Share2 className="w-5 h-5" />
            Share Leaderboard
          </button>
        </div>

        {/* User Position Banner (if in top) */}
        {isCurrentUserInTop && (
          <div className="bg-linear-to-r from-yellow-600 to-orange-600 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1">Your Position</p>
                <p className="text-3xl font-bold text-white">#47 of 10,000+</p>
              </div>
              <Zap className="w-12 h-12 text-yellow-300" />
            </div>
            <p className="text-white/70 mt-2 text-sm">
              Keep earning XP to climb higher and unlock exclusive rewards!
            </p>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="bg-slate-900 rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 bg-slate-800 px-6 py-4 font-semibold text-slate-400 text-sm">
            <div className="md:col-span-1">Rank</div>
            <div className="md:col-span-5">User</div>
            <div className="md:col-span-3">XP</div>
            <div className="md:col-span-3">Change</div>
          </div>

          {/* Leaderboard Entries */}
          {leaderboard.map((entry) => {
            const isMedal = entry.rank <= 3;
            const medalEmoji = ['🥇', '🥈', '🥉'][entry.rank - 1];

            return (
              <div
                key={entry.rank}
                className={`grid md:grid-cols-12 gap-4 px-6 py-4 border-t border-slate-800 hover:bg-slate-800 transition ${
                  isMedal ? 'bg-slate-800/50' : ''
                }`}
              >
                {/* Rank */}
                <div className="md:col-span-1 flex items-center">
                  <span className="text-lg font-bold text-white">
                    {isMedal ? medalEmoji : `#${entry.rank}`}
                  </span>
                </div>

                {/* Username */}
                <div className="md:col-span-5 flex items-center">
                  <div>
                    <p className="font-semibold text-white">{entry.username}</p>
                    <p className="text-xs text-slate-400">FID: {entry.fid}</p>
                  </div>
                </div>

                {/* XP */}
                <div className="md:col-span-3 flex items-center">
                  <div>
                    <p className="text-lg font-bold text-cyan-400">
                      {entry.xp.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400">XP</p>
                  </div>
                </div>

                {/* Change */}
                <div className="md:col-span-3 flex items-center">
                  <div
                    className={`flex items-center gap-2 ${
                      entry.change > 0
                        ? 'text-emerald-400'
                        : entry.change < 0
                          ? 'text-red-400'
                          : 'text-slate-400'
                    }`}
                  >
                    {entry.change > 0 ? (
                      <>
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-semibold">+{entry.change}</span>
                      </>
                    ) : entry.change < 0 ? (
                      <>
                        <TrendingUp className="w-4 h-4 rotate-180" />
                        <span className="font-semibold">{entry.change}</span>
                      </>
                    ) : (
                      <span className="font-semibold">—</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reward Info */}
        <div className="mt-12 grid md:grid-cols-3 gap-4">
          <div className="bg-slate-900 rounded-xl p-6">
            <div className="text-yellow-400 text-2xl mb-2">🥇</div>
            <h3 className="font-bold text-white mb-2">Top 10</h3>
            <p className="text-slate-400 text-sm">
              Exclusive NFT badge + 1000 USDC monthly
            </p>
          </div>
          <div className="bg-slate-900 rounded-xl p-6">
            <div className="text-blue-400 text-2xl mb-2">🏅</div>
            <h3 className="font-bold text-white mb-2">Top 100</h3>
            <p className="text-slate-400 text-sm">
              Verified profile badge + 100 USDC monthly
            </p>
          </div>
          <div className="bg-slate-900 rounded-xl p-6">
            <div className="text-purple-400 text-2xl mb-2">⭐</div>
            <h3 className="font-bold text-white mb-2">Top 1000</h3>
            <p className="text-slate-400 text-sm">
              XP multiplier boost + trading discounts
            </p>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">
              Share Leaderboard
            </h2>
            <p className="text-slate-400 mb-6">
              Challenge your friends and show off the competition
            </p>

            {/* Share Stats */}
            <div className="bg-slate-800 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-slate-400 text-xs mb-1">Timeframe</p>
                  <p className="font-bold text-white">
                    {timeframeLabels[timeframe]}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-xs mb-1">Top Earner</p>
                  <p className="font-bold text-cyan-400">
                    {leaderboard[0].xp.toLocaleString()} XP
                  </p>
                </div>
              </div>
            </div>

            {/* Share Link */}
            <div className="bg-slate-800 rounded-lg p-4 mb-6">
              <p className="text-slate-400 text-xs mb-2">Share Link</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={leaderboardUrl}
                  readOnly
                  placeholder="Share link"
                  className="flex-1 bg-slate-700 text-white text-sm rounded px-3 py-2 font-mono"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(leaderboardUrl);
                  }}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded transition"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Share Message Template */}
            <div className="bg-slate-800 rounded-lg p-4 mb-6">
              <p className="text-slate-400 text-xs mb-2">Share Message</p>
              <textarea
                defaultValue={`🏆 Check out the XP leaderboard on @FarcastMints! Can you beat my score? ${leaderboardUrl}`}
                className="w-full bg-slate-700 text-white text-sm rounded px-3 py-2 resize-none h-24"
                placeholder="Share message"
              />
            </div>

            {/* Instructions */}
            <div className="bg-slate-800 rounded-lg p-4 mb-6 text-sm">
              <p className="text-slate-300 mb-3">How to share:</p>
              <ol className="text-slate-400 space-y-2 list-decimal list-inside">
                <li>Copy the link or message</li>
                <li>Open Warpcast</li>
                <li>Create a new cast</li>
                <li>Paste the content</li>
                <li>Post to challenge friends!</li>
              </ol>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
