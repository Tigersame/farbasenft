"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { useVirtualizer } from '@tanstack/react-virtual';
import clsx from 'clsx';
import { useAccount } from 'wagmi';
import { Avatar, Name } from '@coinbase/onchainkit/identity';

// --- minimal fetcher for SWR ---
const fetcher = (url: string) => fetch(url).then((r) => r.json());

// --- Types ---
interface NFT {
  id: string | number;
  title: string;
  image: string;
  collection: string;
  price: string;
  rarity?: string;
  description?: string;
}

interface CompactNFTCardProps {
  nft: NFT;
  onMint?: (nft: NFT) => void;
  onOpen?: (nft: NFT) => void;
  onSell?: (nft: NFT) => void;
  onBuy?: (nft: NFT) => void;
  loading?: boolean;
}

// --- Compact NFT Card (110px thumbnail + title+price one row) ---
function CompactNFTCard({ nft, onMint, onOpen, onSell, onBuy, loading }: CompactNFTCardProps) {
  const { id = '—', title = 'Untitled NFT', image = '/placeholder-110.png', collection = 'Collection', price = '—', rarity } = nft || {};

  return (
    <div className="w-full mx-auto" style={{ maxWidth: 380, marginBottom: 12 }}>
      <div className="flex gap-3 bg-[#0d121c] rounded-xl border border-[#1a2436] p-3 shadow-sm">

        {/* Thumbnail (110px) */}
        <button
          onClick={() => onOpen?.(nft)}
          className="relative rounded-lg overflow-hidden flex-shrink-0"
          style={{ width: 110, height: 110 }}
        >
          <img
            src={image}
            loading="lazy"
            alt={title}
            className="w-full h-full object-cover"
            style={{ aspectRatio: '1/1' }}
            draggable={false}
            onError={(e) => {
              e.currentTarget.src = '/placeholder-110.png';
            }}
          />
          {rarity && (
            <span className="absolute top-1 left-1 bg-black/60 text-[10px] px-2 py-0.5 rounded-md text-white">{rarity}</span>
          )}
        </button>

        {/* Right content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="truncate">
              <h3 className="text-sm font-semibold text-white truncate">{title}</h3>
              <p className="text-[11px] text-gray-400 truncate">{collection}</p>
            </div>

            <span className="text-xs font-semibold text-blue-400 ml-2">{price}</span>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-gray-500">#{id}</span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onMint?.(nft)}
                disabled={loading}
                className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg active:scale-[0.97] disabled:opacity-50"
                aria-label={`Mint ${title}`}
              >
                {loading ? '...' : 'Mint'}
              </button>

              <button
                onClick={() => onBuy?.(nft)}
                disabled={loading}
                className="px-3 py-1.5 bg-[#111827] text-white text-xs rounded-lg border border-[#1f2a34] disabled:opacity-50"
                aria-label={`Buy ${title}`}
              >
                Buy
              </button>

              <button
                onClick={() => onSell?.(nft)}
                disabled={loading}
                className="px-3 py-1.5 bg-[#0b1722] text-white text-xs rounded-lg border border-[#243244] disabled:opacity-50"
                aria-label={`Sell ${title}`}
              >
                Sell
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Modal ---
interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

function Modal({ open, onClose, children, title }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full md:max-w-lg bg-[#07101a] rounded-t-2xl md:rounded-2xl p-4 m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-300 text-xl">✕</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

// --- CreateForm component (upload + metadata) ---
interface CreateFormProps {
  onDone?: () => void;
}

function CreateForm({ onDone }: CreateFormProps) {
  const [name, setName] = useState('');
  const [collection, setCollection] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [price, setPrice] = useState('0.001');
  const [uploading, setUploading] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] ?? null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Pick an image');
    setUploading(true);

    try {
      const form = new FormData();
      form.append('file', file);
      const up = await fetch('/api/upload', { method: 'POST', body: form });
      const uploaded = await up.json(); // { url }

      const metaRes = await fetch('/api/nfts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, collection, image: uploaded.url, price }),
      });
      await metaRes.json();

      onDone?.();
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block">
        <div className="text-sm text-gray-300 mb-1">Name</div>
        <input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="w-full rounded-lg p-2 bg-[#07121a] border border-[#1a2436] text-white text-sm" 
          required
        />
      </label>

      <label className="block">
        <div className="text-sm text-gray-300 mb-1">Collection</div>
        <input 
          value={collection} 
          onChange={(e) => setCollection(e.target.value)} 
          className="w-full rounded-lg p-2 bg-[#07121a] border border-[#1a2436] text-white text-sm" 
          required
        />
      </label>

      <label className="block">
        <div className="text-sm text-gray-300 mb-1">Image</div>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFile} 
          className="w-full text-sm text-gray-300" 
          required
        />
      </label>

      <label className="block">
        <div className="text-sm text-gray-300 mb-1">Price (ETH)</div>
        <input 
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
          className="w-full rounded-lg p-2 bg-[#07121a] border border-[#1a2436] text-white text-sm" 
          type="number"
          step="0.001"
          min="0"
          required
        />
      </label>

      <div className="flex justify-end">
        <button 
          type="submit" 
          disabled={uploading} 
          className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : 'Create'}
        </button>
      </div>
    </form>
  );
}

// --- NFT Details (view modal) ---
interface NFTDetailsProps {
  nft: NFT | null;
  onMint?: (nft: NFT) => void;
  onBuy?: (nft: NFT) => void;
  onSell?: (nft: NFT) => void;
}

function NFTDetails({ nft, onMint, onBuy, onSell }: NFTDetailsProps) {
  if (!nft) return null;
  return (
    <div className="space-y-3">
      <div className="w-full rounded-lg overflow-hidden">
        <img src={nft.image} alt={nft.title} className="w-full h-64 object-cover" />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white">{nft.title}</h3>
        <p className="text-[13px] text-gray-300">{nft.collection} • #{nft.id}</p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-300">Price</div>
          <div className="text-lg font-semibold text-blue-400">{nft.price}</div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => onBuy?.(nft)} className="px-4 py-2 bg-blue-600 rounded-lg text-white text-sm">Buy</button>
          <button onClick={() => onMint?.(nft)} className="px-4 py-2 bg-[#0b1722] rounded-lg text-white text-sm">Mint</button>
          <button onClick={() => onSell?.(nft)} className="px-4 py-2 bg-[#111827] rounded-lg text-white text-sm">Sell</button>
        </div>
      </div>

      {nft.description && (
        <div className="text-sm text-gray-400">{nft.description}</div>
      )}
    </div>
  );
}

// --- WalletStatus component (using wagmi) ---
function WalletStatus() {
  const { address, isConnected } = useAccount();

  const shortAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="flex items-center gap-2">
      {isConnected && address ? (
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <Avatar address={address as `0x${string}`} className="w-5 h-5" />
          <Name address={address as `0x${string}`} />
        </div>
      ) : (
        <span className="text-xs text-gray-400">Not connected</span>
      )}
    </div>
  );
}

// --- Main Gallery component ---
export default function FarbaseMiniGallery() {
  // pagination / data
  const [cursor, setCursor] = useState<string | null>(null);
  const { data, error, mutate, isValidating } = useSWR(`/api/nfts?cursor=${cursor ?? ''}`, fetcher, { revalidateOnFocus: false });
  const items: NFT[] = data?.items ?? [];

  // virtualizer
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 134,
    overscan: 6,
  });

  // UI state
  const [selected, setSelected] = useState<{ action: string; nft?: NFT } | null>(null);
  const [minting, setMinting] = useState(false);
  const [buying, setBuying] = useState(false);
  const [selling, setSelling] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // handlers (optimistic placeholders)
  const handleMint = useCallback(async (nft: NFT) => {
    setMinting(true);
    try {
      const res = await fetch('/api/mint', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tokenId: nft.id }) });
      await res.json();
      setToast({ type: 'success', message: 'Mint transaction submitted' });
      mutate();
    } catch (e) {
      console.error(e);
      setToast({ type: 'error', message: 'Mint failed' });
    } finally {
      setMinting(false);
    }
  }, [mutate]);

  const handleBuy = useCallback(async (nft: NFT) => {
    setBuying(true);
    try {
      const res = await fetch('/api/buy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tokenId: nft.id }) });
      await res.json();
      setToast({ type: 'success', message: 'Buy order submitted' });
      mutate();
    } catch (e) {
      console.error(e);
      setToast({ type: 'error', message: 'Buy failed' });
    } finally {
      setBuying(false);
    }
  }, [mutate]);

  const handleSell = useCallback(async (nft: NFT) => {
    setSelling(true);
    try {
      const res = await fetch('/api/sell', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tokenId: nft.id }) });
      await res.json();
      setToast({ type: 'success', message: 'Sell order created' });
      mutate();
    } catch (e) {
      console.error(e);
      setToast({ type: 'error', message: 'Sell failed' });
    } finally {
      setSelling(false);
    }
  }, [mutate]);

  // auto-load next page when near end
  useEffect(() => {
    const virtualItems = rowVirtualizer.getVirtualItems();
    const last = virtualItems?.[virtualItems.length - 1];
    if (last && data?.nextCursor && last.index >= items.length - 3) {
      setCursor(data.nextCursor);
    }
  }, [rowVirtualizer, data, items.length]);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div className="min-h-screen bg-[#07101a] text-white p-3">
      {/* header */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">
            FM
          </div>
          <div>
            <h1 className="text-lg font-bold">FarbaseMints</h1>
            <p className="text-xs text-gray-400">Compact gallery — Mini App friendly</p>
          </div>
        </div>

        {/* Wallet & actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <WalletStatus />

          <button
            className="text-xs px-3 py-1.5 rounded-lg bg-[#0e1a2b] border border-[#18304a] text-white"
            onClick={() => mutate()}
          >
            Refresh
          </button>

          <button 
            className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white" 
            onClick={() => setSelected({ action: 'create' })}
          >
            Create
          </button>
        </div>
      </div>

      {/* gallery container (virtualized) */}
      <div ref={parentRef} className="h-[74vh] overflow-auto -mx-3 px-3">
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
          {virtualItems.map((virtualRow) => {
            const nft = items[virtualRow.index];
            if (!nft) return null;
            return (
              <div
                key={nft.id}
                data-index={virtualRow.index}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${virtualRow.start}px)` }}
              >
                <CompactNFTCard
                  nft={nft}
                  onMint={handleMint}
                  onOpen={(n) => setSelected({ action: 'view', nft: n })}
                  onBuy={handleBuy}
                  onSell={handleSell}
                  loading={minting || buying || selling}
                />
              </div>
            );
          })}

          {/* empty state */}
          {!isValidating && items.length === 0 && (
            <div className="p-6 text-center text-gray-400">No NFTs yet. Create one!</div>
          )}

          {/* loading */}
          {isValidating && (
            <div className="p-4 text-center text-gray-400">Loading...</div>
          )}
        </div>
      </div>

      {/* Selected modal (view / create) */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.action === 'create' ? 'Create / Upload' : (selected?.action === 'view' ? 'NFT Details' : 'Action')}
      >
        {selected?.action === 'create' && <CreateForm onDone={() => { setSelected(null); mutate(); }} />}
        {selected?.action === 'view' && <NFTDetails nft={selected.nft ?? null} onMint={handleMint} onBuy={handleBuy} onSell={handleSell} />}
      </Modal>

      {/* toast */}
      {toast && (
        <div className={clsx(
          'fixed left-1/2 -translate-x-1/2 bottom-6 px-4 py-2 rounded-xl shadow-lg z-50',
          toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'
        )}>
          <div className="text-sm text-white">{toast.message}</div>
        </div>
      )}
    </div>
  );
}
