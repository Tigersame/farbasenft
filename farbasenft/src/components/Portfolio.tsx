'use client';

import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Filter } from 'lucide-react';
import { useAccount } from 'wagmi';

interface PortfolioNFT {
  id: string;
  name: string;
  collection: string;
  boughtPrice: number;
  currentPrice: number;
  quantity: number;
  acquiredDate: string;
  image: string;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  nftName: string;
  price: number;
  quantity: number;
  date: string;
  txHash: string;
}

export default function Portfolio() {
  const { address } = useAccount();
  const [ownedNFTs, setOwnedNFTs] = useState<PortfolioNFT[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'holdings' | 'history'>('holdings');
  const [filterType, setFilterType] = useState<'all' | 'profit' | 'loss'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolioData();
  }, [address]);

  const fetchPortfolioData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls
      const mockNFTs: PortfolioNFT[] = [
        {
          id: '1',
          name: 'Cosmic Wanderer #42',
          collection: 'Space NFTs',
          boughtPrice: 2.5,
          currentPrice: 3.8,
          quantity: 1,
          acquiredDate: '2024-10-15',
          image: 'https://placehold.co/300x300?text=NFT1',
        },
        {
          id: '2',
          name: 'Digital Art #007',
          collection: 'Contemporary',
          boughtPrice: 1.2,
          currentPrice: 0.95,
          quantity: 1,
          acquiredDate: '2024-09-20',
          image: 'https://placehold.co/300x300?text=NFT2',
        },
        {
          id: '3',
          name: 'Genesis Pass',
          collection: 'Membership',
          boughtPrice: 5.0,
          currentPrice: 7.2,
          quantity: 2,
          acquiredDate: '2024-08-10',
          image: 'https://placehold.co/300x300?text=NFT3',
        },
      ];

      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'buy',
          nftName: 'Cosmic Wanderer #42',
          price: 2.5,
          quantity: 1,
          date: '2024-10-15',
          txHash: '0x1234...5678',
        },
        {
          id: '2',
          type: 'buy',
          nftName: 'Digital Art #007',
          price: 1.2,
          quantity: 1,
          date: '2024-09-20',
          txHash: '0xabcd...ef01',
        },
        {
          id: '3',
          type: 'buy',
          nftName: 'Genesis Pass',
          price: 5.0,
          quantity: 2,
          date: '2024-08-10',
          txHash: '0x2468...ace0',
        },
      ];

      setOwnedNFTs(mockNFTs);
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProfit = (nft: PortfolioNFT) => {
    return (nft.currentPrice - nft.boughtPrice) * nft.quantity;
  };

  const calculateProfitPercent = (nft: PortfolioNFT) => {
    return ((nft.currentPrice - nft.boughtPrice) / nft.boughtPrice) * 100;
  };

  const totalValue = ownedNFTs.reduce((sum, nft) => sum + nft.currentPrice * nft.quantity, 0);
  const totalCost = ownedNFTs.reduce((sum, nft) => sum + nft.boughtPrice * nft.quantity, 0);
  const totalProfit = totalValue - totalCost;
  const totalProfitPercent = (totalProfit / totalCost) * 100;

  const filteredNFTs = ownedNFTs.filter((nft) => {
    if (filterType === 'profit') return calculateProfit(nft) > 0;
    if (filterType === 'loss') return calculateProfit(nft) < 0;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Wallet className="h-8 w-8 text-cyan-400" />
        <h2 className="text-3xl font-bold text-white">Portfolio</h2>
      </div>

      {/* Portfolio Summary */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
            <p className="text-xs text-slate-400 mb-1">Total Value</p>
            <p className="text-2xl font-bold text-white">{totalValue.toFixed(2)} ETH</p>
            <p className="text-xs text-slate-500 mt-2">{ownedNFTs.length} NFTs</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
            <p className="text-xs text-slate-400 mb-1">Total Cost</p>
            <p className="text-2xl font-bold text-white">{totalCost.toFixed(2)} ETH</p>
            <p className="text-xs text-slate-500 mt-2">Investment</p>
          </div>

          <div
            className={`p-4 rounded-lg border ${
              totalProfit >= 0
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}
          >
            <p className="text-xs text-slate-400 mb-1">Total P&L</p>
            <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)} ETH
            </p>
            <p
              className={`text-xs mt-2 ${totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
            >
              {totalProfit >= 0 ? '+' : ''}{totalProfitPercent.toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700">
        <button
          onClick={() => setActiveTab('holdings')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'holdings'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          Holdings ({ownedNFTs.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          History ({transactions.length})
        </button>
      </div>

      {/* Holdings Tab */}
      {activeTab === 'holdings' && (
        <div className="space-y-4">
          {/* Filter */}
          <div className="flex gap-2">
            <Filter className="h-5 w-5 text-slate-400" />
            {(['all', 'profit', 'loss'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  filterType === type
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {type === 'all' ? 'All' : type === 'profit' ? '📈 Profit' : '📉 Loss'}
              </button>
            ))}
          </div>

          {/* NFT List */}
          <div className="space-y-3">
            {loading ? (
              <p className="text-slate-400">Loading portfolio...</p>
            ) : filteredNFTs.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                {filterType === 'profit'
                  ? 'No profitable NFTs'
                  : filterType === 'loss'
                    ? 'No losses'
                    : 'No NFTs owned yet'}
              </div>
            ) : (
              filteredNFTs.map((nft) => {
                const profit = calculateProfit(nft);
                const profitPercent = calculateProfitPercent(nft);
                const isProfitable = profit > 0;

                return (
                  <div
                    key={nft.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-cyan-500/50 transition-all"
                  >
                    {/* Image */}
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="w-20 h-20 rounded-lg object-cover shrink-0"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-400">{nft.collection}</p>
                      <p className="font-semibold text-white truncate">{nft.name}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Acquired: {new Date(nft.acquiredDate).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Prices */}
                    <div className="text-right">
                      <p className="text-xs text-slate-400 mb-1">Entry / Current</p>
                      <p className="font-semibold text-white">
                        {nft.boughtPrice.toFixed(2)} / {nft.currentPrice.toFixed(2)} ETH
                      </p>
                    </div>

                    {/* P&L */}
                    <div
                      className={`px-3 py-2 rounded text-right shrink-0 ${
                        isProfitable
                          ? 'bg-emerald-500/20 border border-emerald-500/30'
                          : 'bg-red-500/20 border border-red-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-1 justify-end">
                        {isProfitable ? (
                          <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <ArrowDownLeft className="h-4 w-4 text-red-400" />
                        )}
                        <span
                          className={`font-semibold ${
                            isProfitable ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {isProfitable ? '+' : ''}{profit.toFixed(2)} ETH
                        </span>
                      </div>
                      <p
                        className={`text-xs ${
                          isProfitable ? 'text-emerald-300' : 'text-red-300'
                        }`}
                      >
                        {isProfitable ? '+' : ''}{profitPercent.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {loading ? (
            <p className="text-slate-400">Loading history...</p>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-slate-400">No transaction history</div>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800 border border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      tx.type === 'buy'
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {tx.type === 'buy' ? (
                      <ArrowDownLeft className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {tx.type === 'buy' ? 'Purchased' : 'Sold'} {tx.nftName}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(tx.date).toLocaleDateString()} • x{tx.quantity}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`font-semibold ${tx.type === 'buy' ? 'text-red-400' : 'text-emerald-400'}`}>
                    {tx.type === 'buy' ? '-' : '+'}{tx.price.toFixed(2)} ETH
                  </p>
                  <a
                    href={`https://basescan.org/tx/${tx.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    View TX
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Info */}
      <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
        <p className="text-sm text-cyan-200">
          💡 <strong>Portfolio Insights:</strong> Track your holdings, monitor profit/loss, and review your trading history. All data synced with your wallet.
        </p>
      </div>
    </div>
  );
}
