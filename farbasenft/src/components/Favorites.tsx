'use client';

import { useState, useEffect } from 'react';
import { Heart, Bell, X, AlertCircle } from 'lucide-react';

interface FavoriteNFT {
  id: string;
  name: string;
  price: number;
  image: string;
  collection: string;
  alertPrice?: number;
  currentPrice: number;
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteNFT[]>([]);
  const [showAddAlert, setShowAddAlert] = useState<string | null>(null);
  const [alertPrices, setAlertPrices] = useState<{ [key: string]: number }>({});
  const [priceAlerts, setPriceAlerts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    loadFavorites();
    loadPriceAlerts();
  }, []);

  const loadFavorites = () => {
    const stored = localStorage.getItem('favoriteNFTs');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  };

  const loadPriceAlerts = () => {
    const stored = localStorage.getItem('priceAlerts');
    if (stored) {
      setPriceAlerts(JSON.parse(stored));
    }
  };

  const removeFavorite = (id: string) => {
    const updated = favorites.filter((f) => f.id !== id);
    setFavorites(updated);
    localStorage.setItem('favoriteNFTs', JSON.stringify(updated));
    // Also remove price alert if exists
    const newAlerts = { ...priceAlerts };
    delete newAlerts[id];
    setPriceAlerts(newAlerts);
    localStorage.setItem('priceAlerts', JSON.stringify(newAlerts));
  };

  const setPriceAlert = (id: string, alertPrice: number) => {
    const newAlerts = { ...priceAlerts, [id]: alertPrice };
    setPriceAlerts(newAlerts);
    localStorage.setItem('priceAlerts', JSON.stringify(newAlerts));
    setShowAddAlert(null);
    setAlertPrices({ ...alertPrices, [id]: 0 });
  };

  const checkPriceAlerts = (nft: FavoriteNFT) => {
    const alertPrice = priceAlerts[nft.id];
    if (alertPrice && nft.currentPrice <= alertPrice) {
      return true;
    }
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart className="h-8 w-8 text-red-500" fill="currentColor" />
          <h2 className="text-3xl font-bold text-white">My Favorites</h2>
        </div>
        <span className="px-3 py-1 rounded-full bg-slate-700 text-slate-200 text-sm font-medium">
          {favorites.length} NFTs
        </span>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No favorites yet</p>
          <p className="text-slate-500 text-sm mt-2">
            Heart NFTs to add them to your watchlist and set price alerts
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((nft) => {
            const hasAlert = priceAlerts[nft.id];
            const alertTriggered = checkPriceAlerts(nft);

            return (
              <div
                key={nft.id}
                className="relative rounded-lg bg-slate-800 overflow-hidden border border-slate-700 hover:border-cyan-500/50 transition-all group"
              >
                {/* Alert Badge */}
                {alertTriggered && (
                  <div className="absolute top-2 right-2 z-10 px-2 py-1 rounded-full bg-red-500/90 flex items-center gap-1 text-xs font-semibold text-white">
                    <AlertCircle className="h-3 w-3" />
                    Price Alert!
                  </div>
                )}

                {/* Image */}
                <div className="relative w-full h-40 bg-slate-700 overflow-hidden">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">{nft.collection}</p>
                    <h3 className="font-semibold text-white truncate">{nft.name}</h3>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Current Price</p>
                      <p className="text-lg font-bold text-cyan-400">{nft.currentPrice.toFixed(2)} ETH</p>
                    </div>
                    {hasAlert && (
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Alert at</p>
                        <p className="text-sm font-semibold text-emerald-400">
                          {hasAlert.toFixed(2)} ETH
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Price Alert Input */}
                  {showAddAlert === nft.id ? (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Alert price"
                        value={alertPrices[nft.id] || ''}
                        onChange={(e) =>
                          setAlertPrices({ ...alertPrices, [nft.id]: parseFloat(e.target.value) || 0 })
                        }
                        className="flex-1 px-2 py-1 rounded bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        onClick={() => setPriceAlert(nft.id, alertPrices[nft.id])}
                        className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium"
                      >
                        Set
                      </button>
                      <button
                        onClick={() => setShowAddAlert(null)}
                        className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddAlert(nft.id)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium transition-colors"
                    >
                      <Bell className="h-4 w-4" />
                      {hasAlert ? 'Change Alert' : 'Set Price Alert'}
                    </button>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFavorite(nft.id)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm font-medium transition-colors border border-red-500/20"
                  >
                    <X className="h-4 w-4" />
                    Remove from Favorites
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info */}
      <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
        <p className="text-sm text-cyan-200">
          💡 <strong>Pro Tip:</strong> Set price alerts to get notified when your favorite NFTs drop to your target price. The app will alert you when conditions are met!
        </p>
      </div>
    </div>
  );
}
