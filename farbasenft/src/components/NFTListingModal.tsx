'use client';

import React, { useState } from 'react';

interface NFTListingModalProps {
  nft: {
    tokenId: string;
    name: string;
    image: string;
    collection?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onList: (listingData: ListingData) => Promise<void>;
}

export interface ListingData {
  tokenId: string;
  price: string;
  currency: 'ETH' | 'USDC';
  duration: number; // in days
  listingType: 'fixed' | 'auction';
  reservePrice?: string;
}

export default function NFTListingModal({ nft, isOpen, onClose, onList }: NFTListingModalProps) {
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<'ETH' | 'USDC'>('ETH');
  const [duration, setDuration] = useState(7);
  const [listingType, setListingType] = useState<'fixed' | 'auction'>('fixed');
  const [reservePrice, setReservePrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!price || parseFloat(price) <= 0) {
      setError('Please enter a valid price');
      return;
    }

    if (listingType === 'auction' && reservePrice && parseFloat(reservePrice) <= 0) {
      setError('Please enter a valid reserve price');
      return;
    }

    setIsSubmitting(true);

    try {
      const listingData: ListingData = {
        tokenId: nft.tokenId,
        price,
        currency,
        duration,
        listingType,
        ...(listingType === 'auction' && reservePrice ? { reservePrice } : {}),
      };

      await onList(listingData);
      onClose();
      
      // Reset form
      setPrice('');
      setReservePrice('');
      setDuration(7);
      setListingType('fixed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to list NFT');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-lg bg-linear-to-br from-purple-950/95 via-black/95 to-violet-950/95 border border-violet-500/30 rounded-2xl shadow-2xl overflow-hidden"
        style={{
          boxShadow: '0 0 40px rgba(139,92,246,0.3), inset 0 0 20px rgba(139,92,246,0.05)'
        }}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-violet-500/20">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
            List NFT for Sale
          </h2>
          <button
            onClick={onClose}
            title="Close dialog"
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* NFT Preview */}
        <div className="p-6 border-b border-violet-500/20">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-violet-500/30">
              <img 
                src={nft.image} 
                alt={nft.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{nft.name}</h3>
              {nft.collection && (
                <p className="text-sm text-gray-400">{nft.collection}</p>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Listing Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Listing Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setListingType('fixed')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  listingType === 'fixed'
                    ? 'border-violet-500 bg-violet-500/20 text-white'
                    : 'border-violet-500/30 bg-violet-500/5 text-gray-400 hover:border-violet-500/50'
                }`}
              >
                <div className="font-semibold">Fixed Price</div>
                <div className="text-xs mt-1">Set a buy now price</div>
              </button>
              <button
                type="button"
                onClick={() => setListingType('auction')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  listingType === 'auction'
                    ? 'border-violet-500 bg-violet-500/20 text-white'
                    : 'border-violet-500/30 bg-violet-500/5 text-gray-400 hover:border-violet-500/50'
                }`}
              >
                <div className="font-semibold">Auction</div>
                <div className="text-xs mt-1">Accept bids</div>
              </button>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {listingType === 'fixed' ? 'Sale Price' : 'Starting Price'}
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.001"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                aria-label="NFT price"
                className="w-full px-4 py-3 bg-black/50 border border-violet-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                required
              />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as 'ETH' | 'USDC')}
                aria-label="Select currency"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-violet-500/20 border border-violet-500/30 rounded px-3 py-1 text-white text-sm focus:outline-none"
              >
                <option value="ETH">ETH</option>
                <option value="USDC">USDC</option>
              </select>
            </div>
          </div>

          {/* Reserve Price (for auctions) */}
          {listingType === 'auction' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reserve Price (Optional)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.001"
                  value={reservePrice}
                  onChange={(e) => setReservePrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-black/50 border border-violet-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Minimum price to accept for this auction
              </p>
            </div>
          )}

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              aria-label="Select listing duration"
              className="w-full px-4 py-3 bg-black/50 border border-violet-500/30 rounded-lg text-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            >
              <option value={1}>1 Day</option>
              <option value={3}>3 Days</option>
              <option value={7}>7 Days</option>
              <option value={14}>14 Days</option>
              <option value={30}>30 Days</option>
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Summary */}
          <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Listing type:</span>
              <span className="text-white capitalize">{listingType}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Duration:</span>
              <span className="text-white">{duration} day{duration > 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Platform fee (2.5%):</span>
              <span className="text-white">
                {price ? (parseFloat(price) * 0.025).toFixed(4) : '0.00'} {currency}
              </span>
            </div>
            <div className="pt-2 border-t border-violet-500/20 flex justify-between font-semibold">
              <span className="text-gray-300">You'll receive:</span>
              <span className="text-emerald-400">
                {price ? (parseFloat(price) * 0.975).toFixed(4) : '0.00'} {currency}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-violet-500/30 rounded-lg text-gray-300 hover:bg-violet-500/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 rounded-lg text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                boxShadow: '0 0 20px rgba(139,92,246,0.4)'
              }}
            >
              {isSubmitting ? 'Listing...' : 'Complete Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
