'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Heart, Share2, TrendingUp, DollarSign } from 'lucide-react';

// Mock NFT data for shareable pages
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
    collection: 'Nova Reyes',
    image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&h=600&fit=crop',
    price: '0.75',
    description: 'Iridescent fragments stitched into a cosmic tapestry',
    rarity: 2,
  },
  {
    id: 'silk-echoes',
    name: 'Silk Echoes',
    collection: 'Atari Bloom',
    image: 'https://images.unsplash.com/photo-1517816428104-797678c7cf0c?w=800&h=600&fit=crop',
    price: '1.10',
    description: 'Audio-reactive drapery translating ambient sound into light',
    rarity: 1,
  },
];

const nfts = mockNFTs;

interface NFTDetailPageClientProps {
  params: Promise<{ id: string }>;
}

export default function NFTDetailPageClient(props: NFTDetailPageClientProps) {
  const params = props.params as unknown as { id: string };
  const nft = nfts.find((n) => n.id === params.id);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  if (!nft) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">NFT Not Found</h1>
          <p className="text-slate-400">This NFT does not exist</p>
        </div>
      </div>
    );
  }

  const detailUrl = `https://farbasenft.xyz/nft/${params.id}`;

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* NFT Image */}
        <div className="mb-8">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-900">
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => setIsFavorited(!isFavorited)}
                className={`p-3 rounded-full backdrop-blur-md transition ${
                  isFavorited
                    ? 'bg-red-500/80 text-white'
                    : 'bg-black/40 text-white hover:bg-black/60'
                }`}
                title={isFavorited ? 'Remove favorite' : 'Add favorite'}
              >
                <Heart className="w-6 h-6" fill={isFavorited ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className="p-3 rounded-full bg-cyan-500/80 text-white hover:bg-cyan-600 transition"
                title="Share NFT"
              >
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* NFT Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <p className="text-cyan-400 text-sm font-semibold mb-2 uppercase">
              {nft.collection}
            </p>
            <h1 className="text-4xl font-bold text-white mb-2">{nft.name}</h1>
            <p className="text-slate-400">{nft.description}</p>
          </div>

          {/* Price Info */}
          <div className="bg-slate-900 rounded-2xl p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">Current Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-cyan-400">
                    {nft.price}
                  </span>
                  <span className="text-slate-400">ETH</span>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">Floor Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-emerald-400">
                    {parseFloat(nft.price) * 0.85}
                  </span>
                  <span className="text-slate-400">ETH</span>
                </div>
              </div>
            </div>

            {/* Buy Button */}
            <button className="w-full bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 rounded-lg transition">
              Make Offer
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900 rounded-lg p-4 text-center">
              <p className="text-slate-400 text-sm mb-2">Rarity</p>
              <p className="text-lg font-bold text-white">
                {nft.rarity === 1 ? '🟢 Common' : nft.rarity === 2 ? '🔵 Uncommon' : nft.rarity === 3 ? '🟣 Rare' : '🟡 Legendary'}
              </p>
            </div>
            <div className="bg-slate-900 rounded-lg p-4 text-center">
              <p className="text-slate-400 text-sm mb-2">Owner</p>
              <p className="text-lg font-bold text-white">0x...abc</p>
            </div>
            <div className="bg-slate-900 rounded-lg p-4 text-center">
              <p className="text-slate-400 text-sm mb-2">Network</p>
              <p className="text-lg font-bold text-white">Base</p>
            </div>
          </div>

          {/* Traits */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Properties</h3>
            <div className="grid grid-cols-2 gap-3">
              {['Background', 'Eyes', 'Mouth', 'Accessories'].map((trait) => (
                <div key={trait} className="bg-slate-900 rounded-lg p-3 text-center">
                  <p className="text-slate-400 text-xs mb-1">{trait}</p>
                  <p className="text-sm font-semibold text-white">
                    {trait} Value
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Share on Farcaster</h2>
            <p className="text-slate-400 mb-6">
              Share this NFT in your Farcaster feed and let collectors discover it
            </p>

            {/* Share Link */}
            <div className="bg-slate-800 rounded-lg p-4 mb-6">
              <p className="text-slate-400 text-xs mb-2">Share Link</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={detailUrl}
                  readOnly
                  placeholder="Share link"
                  className="flex-1 bg-slate-700 text-white text-sm rounded px-3 py-2 font-mono"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(detailUrl);
                  }}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded transition"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-slate-800 rounded-lg p-4 mb-6 text-sm">
              <p className="text-slate-300 mb-3">To share in Farcaster:</p>
              <ol className="text-slate-400 space-y-2 list-decimal list-inside">
                <li>Copy the link above</li>
                <li>Open Warpcast and create a new cast</li>
                <li>Paste the link in your cast</li>
                <li>The NFT preview will appear automatically</li>
                <li>Post your cast!</li>
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
