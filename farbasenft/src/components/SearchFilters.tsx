'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface SearchFilters {
  query: string;
  priceMin: number;
  priceMax: number;
  collection: string;
  rarity: string;
  sortBy: 'price-asc' | 'price-desc' | 'newest' | 'trending';
}

interface NFTItem {
  id: string;
  name: string;
  collection: string;
  price: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  image: string;
  views: number;
}

interface SearchFilterProps {
  onFiltersChange: (filters: SearchFilters) => void;
  nfts: NFTItem[];
}

export default function SearchFilters({ onFiltersChange, nfts }: SearchFilterProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    priceMin: 0,
    priceMax: 100,
    collection: '',
    rarity: '',
    sortBy: 'trending',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const collections = useMemo(() => {
    return [...new Set(nfts.map((n) => n.collection))];
  }, [nfts]);

  const rarities = ['common', 'uncommon', 'rare', 'legendary'];

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange(updated);
  };

  const handleReset = () => {
    const reset: SearchFilters = {
      query: '',
      priceMin: 0,
      priceMax: 100,
      collection: '',
      rarity: '',
      sortBy: 'trending',
    };
    setFilters(reset);
    onFiltersChange(reset);
  };

  const activeFilterCount = [
    filters.query,
    filters.collection,
    filters.rarity,
    filters.priceMin > 0 || filters.priceMax < 100,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search NFTs by name, creator..."
          value={filters.query}
          onChange={(e) => handleFilterChange({ query: e.target.value })}
          className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        />
      </div>

      {/* Sort & Advanced Toggle */}
      <div className="flex gap-2">
        <select
          value={filters.sortBy}
          onChange={(e) =>
            handleFilterChange({
              sortBy: e.target.value as SearchFilters['sortBy'],
            })
          }
          aria-label="Sort by"
          className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
        >
          <option value="trending">📈 Trending</option>
          <option value="newest">✨ Newest</option>
          <option value="price-asc">💰 Price: Low to High</option>
          <option value="price-desc">💸 Price: High to Low</option>
        </select>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
            showAdvanced
              ? 'bg-cyan-500 text-white'
              : 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-cyan-500/50'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters {activeFilterCount > 0 && <span className="badge">{activeFilterCount}</span>}
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="space-y-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Price Range (ETH)
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min="0"
                step="0.1"
                value={filters.priceMin}
                onChange={(e) => handleFilterChange({ priceMin: parseFloat(e.target.value) || 0 })}
                placeholder="Min"
                className="flex-1 px-3 py-2 rounded bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-cyan-500"
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={filters.priceMax}
                onChange={(e) => handleFilterChange({ priceMax: parseFloat(e.target.value) || 100 })}
                placeholder="Max"
                className="flex-1 px-3 py-2 rounded bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Collection Filter */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Collection</label>
            <select
              value={filters.collection}
              onChange={(e) => handleFilterChange({ collection: e.target.value })}
              aria-label="Filter by collection"
              className="w-full px-3 py-2 rounded bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-cyan-500"
            >
              <option value="">All Collections</option>
              {collections.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          {/* Rarity Filter */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Rarity</label>
            <div className="grid grid-cols-2 gap-2">
              {rarities.map((rarity) => (
                <button
                  key={rarity}
                  onClick={() =>
                    handleFilterChange({
                      rarity: filters.rarity === rarity ? '' : rarity,
                    })
                  }
                  className={`px-3 py-2 rounded text-sm font-medium transition-all capitalize ${
                    filters.rarity === rarity
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {rarity === 'common' && '🟢'}
                  {rarity === 'uncommon' && '🔵'}
                  {rarity === 'rare' && '🟣'}
                  {rarity === 'legendary' && '🟡'} {rarity}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="w-full px-3 py-2 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <X className="h-4 w-4" />
            Reset Filters
          </button>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.query && (
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-sm flex items-center gap-2 border border-cyan-500/30">
              Search: {filters.query}
              <button
                onClick={() => handleFilterChange({ query: '' })}
                title="Remove query filter"
                className="hover:text-cyan-200"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.collection && (
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-sm flex items-center gap-2 border border-cyan-500/30">
              {filters.collection}
              <button
                onClick={() => handleFilterChange({ collection: '' })}
                title="Remove collection filter"
                className="hover:text-cyan-200"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.rarity && (
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-sm flex items-center gap-2 border border-cyan-500/30">
              {filters.rarity}
              <button
                onClick={() => handleFilterChange({ rarity: '' })}
                title="Remove rarity filter"
                className="hover:text-cyan-200"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {(filters.priceMin > 0 || filters.priceMax < 100) && (
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-sm flex items-center gap-2 border border-cyan-500/30">
              {filters.priceMin} - {filters.priceMax} ETH
              <button
                onClick={() => handleFilterChange({ priceMin: 0, priceMax: 100 })}
                title="Remove price filter"
                className="hover:text-cyan-200"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
