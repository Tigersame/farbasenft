'use client';

import { useState } from 'react';
import { Share2, TrendingUp, Users, Zap } from 'lucide-react';

interface NFTItem {
  id: string;
  name: string;
  collection: string;
  image: string;
  price: string;
  description: string;
  rarity: number;
}

const mockNFTs: NFTItem[] = [
  {
    id: 'chromatic-dreams',
    name: 'Chromatic Dreams',
    collection: 'Lumen Flow',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop',
    price: '1.25',
    description: 'A meditation on light, motion, and collective memory',
    rarity: 3,
  },
  {
    id: 'aurora-veil',
    name: 'Aurora Veil',
    collection: 'Lumen Flow',
    image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&h=600&fit=crop',
    price: '0.75',
    description: 'Iridescent fragments stitched into a cosmic tapestry',
    rarity: 2,
  },
  {
    id: 'silk-echoes',
    name: 'Silk Echoes',
    collection: 'Nova Reyes',
    image: 'https://images.unsplash.com/photo-1517816428104-797678c7cf0c?w=800&h=600&fit=crop',
    price: '1.10',
    description: 'Audio-reactive drapery translating ambient sound into light',
    rarity: 1,
  },
  {
    id: 'digital-bloom',
    name: 'Digital Bloom',
    collection: 'Nova Reyes',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
    price: '0.85',
    description: 'Florescent digital flowers blooming eternally',
    rarity: 2,
  },
];

interface CollectionPageClientProps {
  collectionId: string;
}

export default function CollectionPageClient(props: CollectionPageClientProps) {
  const { collectionId } = props;
  const collectionNFTs = mockNFTs.filter((n) => n.collection === collectionId);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'recent' | 'trending'>('price');

  if (collectionNFTs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Collection Not Found</h1>
          <p className="text-slate-400">This collection does not exist</p>
        </div>
      </div>
    );
  }

  const floorPrice = Math.min(...collectionNFTs.map((n) => parseFloat(n.price)));
  const collectionUrl = `https://farbasenft.xyz/collection/${collectionId}`;
  const sortedNFTs =
    sortBy === 'price'
      ? [...collectionNFTs].sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
      : sortBy === 'trending'
        ? [...collectionNFTs].reverse()
        : collectionNFTs;

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Banner */}
        <div className="relative h-64 rounded-2xl overflow-hidden mb-8 bg-linear-to-r from-cyan-600 to-blue-600">
          <img
            src={collectionNFTs[0].image}
            alt={collectionId}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <h1 className="text-4xl font-bold text-white mb-2">{collectionId}</h1>
            <p className="text-cyan-100">
              {collectionNFTs.length} items • Created on Base
            </p>
          </div>
          <button
            onClick={() => setShowShareModal(true)}
            className="absolute top-4 right-4 p-3 rounded-full bg-cyan-500/80 text-white hover:bg-cyan-600 transition"
            title="Share collection"
          >
            <Share2 className="w-6 h-6" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 rounded-xl p-4">
            <p className="text-slate-400 text-sm mb-2">Floor Price</p>
            <p className="text-2xl font-bold text-cyan-400">{floorPrice} ETH</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-4">
            <p className="text-slate-400 text-sm mb-2">Items</p>
            <p className="text-2xl font-bold text-emerald-400">
              {collectionNFTs.length}
            </p>
          </div>
          <div className="bg-slate-900 rounded-xl p-4">
            <p className="text-slate-400 text-sm mb-2">Owners</p>
            <p className="text-2xl font-bold text-violet-400">
              {Math.ceil(collectionNFTs.length * 0.7)}
            </p>
          </div>
          <div className="bg-slate-900 rounded-xl p-4">
            <p className="text-slate-400 text-sm mb-2">Volume</p>
            <p className="text-2xl font-bold text-orange-400">
              {(collectionNFTs.length * 2.5).toFixed(1)} ETH
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          <div className="flex gap-2">
            {(['price', 'recent', 'trending'] as const).map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  sortBy === option
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {option === 'price'
                  ? '💰 Lowest Price'
                  : option === 'recent'
                    ? '🕐 Recently Added'
                    : '🔥 Trending'}
              </button>
            ))}
          </div>
        </div>

        {/* NFT Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedNFTs.map((nft) => (
            <a
              key={nft.id}
              href={`/nft/${nft.id}`}
              className="group bg-slate-900 rounded-xl overflow-hidden hover:bg-slate-800 transition"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-800">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white mb-2 truncate">{nft.name}</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-slate-400 text-xs">Price</p>
                    <p className="text-lg font-bold text-cyan-400">{nft.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-xs">Rarity</p>
                    <p className="text-sm font-bold text-emerald-400">
                      {nft.rarity === 1 ? 'Common' : nft.rarity === 2 ? 'Uncommon' : nft.rarity === 3 ? 'Rare' : 'Leg'}
                    </p>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">
              Share {collectionId} Collection
            </h2>
            <p className="text-slate-400 mb-6">
              Let other collectors discover this amazing collection on Farcaster
            </p>

            {/* Share Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-slate-800 rounded-lg p-3 text-center">
                <p className="text-sm font-bold text-cyan-400">
                  {collectionNFTs.length}
                </p>
                <p className="text-xs text-slate-400">Items</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-3 text-center">
                <p className="text-sm font-bold text-emerald-400">{floorPrice}</p>
                <p className="text-xs text-slate-400">ETH Floor</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-3 text-center">
                <p className="text-sm font-bold text-violet-400">
                  {Math.ceil(collectionNFTs.length * 0.7)}
                </p>
                <p className="text-xs text-slate-400">Owners</p>
              </div>
            </div>

            {/* Share Link */}
            <div className="bg-slate-800 rounded-lg p-4 mb-6">
              <p className="text-slate-400 text-xs mb-2">Share Link</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={collectionUrl}
                  readOnly
                  placeholder="Share link"
                  className="flex-1 bg-slate-700 text-white text-sm rounded px-3 py-2 font-mono"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(collectionUrl);
                  }}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded transition"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-slate-800 rounded-lg p-4 mb-6 text-sm">
              <p className="text-slate-300 mb-3">To share on Farcaster:</p>
              <ol className="text-slate-400 space-y-2 list-decimal list-inside">
                <li>Copy the link</li>
                <li>Create a new cast in Warpcast</li>
                <li>Paste the link</li>
                <li>Collection preview appears automatically</li>
                <li>Post to your followers!</li>
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
