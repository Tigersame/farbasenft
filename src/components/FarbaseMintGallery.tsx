/*
FarbaseMint NFT Gallery (React + Tailwind)
Designed as a Farcaster Mini App compatible component.

Visual theme updates in this version:
- Dark neon brand: violet glow accents, glass panels, subtle outer neon outlines on hover.
- Card glass effect using backdrop-blur and translucent panels for metadata.
- Neon gradient borders and glowing "Mint Now" button with soft shadow.
- Improved heart (like) styling with neon accent and subtle pulse on hover.
- Inline style fallbacks for glow effects (helpful if Tailwind config lacks custom utilities).

Notes:
- Tailwind should include `backdrop-blur` and `ring` utilities; otherwise the inline styles will provide the glow.
- If you want a different accent color, change `ACCENT_COLOR` below.
*/

'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useAccount, useConnect, useBalance } from 'wagmi';
import { WalletControls } from '@/components/WalletControls';
import NFTListingModal, { ListingData } from '@/components/NFTListingModal';
import { deDuplicatedFetch } from '@/lib/deDupeFetch';
import { useXP } from '@/hooks/useXP';

const METADATA_PROXY = process.env.NEXT_PUBLIC_METADATA_PROXY || 'https://cloudflare-ipfs.com/ipfs';
const IMAGE_CDN = process.env.NEXT_PUBLIC_IMAGE_CDN || 'https://ipfs.io/ipfs/';
const ACCENT_COLOR = '139,92,246'; // rgb for violet (used in inline glows)

const fetcher = async (url: string) => {
  const res = await deDuplicatedFetch(url, { dedupeKey: url });
  return res.json();
};
const PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900"><rect width="100%" height="100%" fill="%2334454e"/></svg>';

interface NFTToken {
  tokenId: string;
  name: string;
  image: string;
  collection?: string;
  collectionAvatar?: string;
  collectionBanner?: string;
  price?: string;
  likes: number;
  rarity?: string;
  attributes?: Array<{ trait_type?: string; value: string }>;
}

interface GalleryData {
  items: NFTToken[];
}

export default function FarbaseMintNFTGallery({ initialTab = 'live' }: { initialTab?: string }) {
  const [tab, setTab] = useState(initialTab);
  const [optimisticLikes, setOptimisticLikes] = useState<Record<string, number>>({});
  const [selectedNFTForListing, setSelectedNFTForListing] = useState<NFTToken | null>(null);
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [showInsufficientFundsWarning, setShowInsufficientFundsWarning] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ type: 'buy' | 'mint'; token?: NFTToken } | null>(null);

  const { address, isConnected } = useAccount();
  const { connectors } = useConnect();
  const { data: balanceData } = useBalance({ address });
  const { addXP } = useXP();

  const { data, error, isLoading, mutate } = useSWR<GalleryData>(`/api/nfts?tab=${tab}`, fetcher, { 
    revalidateOnFocus: false,
    revalidateIfStale: false, 
    dedupingInterval: 600_000, // 10 minutes - very aggressive caching to prevent rate limits
    focusThrottleInterval: 600_000,
    errorRetryInterval: 120_000, // 2 minutes between retries
    errorRetryCount: 3,
    keepPreviousData: true, // Keep old data while fetching new
  });

  useEffect(() => {
    async function ready() {
      try {
        // await sdk.actions.ready()
      } catch(e) {}
    }
    ready();
  }, []);

  const parentRef = useRef<HTMLDivElement>(null);
  const items = data?.items || [];
  const columns = 3;
  const rowCount = Math.ceil(items.length / columns);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 380,
    overscan: 6,
  });

  const virtualItems = rowVirtualizer.getVirtualItems ? rowVirtualizer.getVirtualItems() : [];
  const totalSize = rowVirtualizer.getTotalSize ? rowVirtualizer.getTotalSize() : rowCount * 340;

  function handleLike(tokenId: string) {
    setOptimisticLikes(prev => ({...prev, [tokenId]: (prev[tokenId] || 0) + 1 }));
    fetch(`/api/nfts/like`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId: tokenId })
    }).catch(() => {
      setOptimisticLikes(prev => ({...prev, [tokenId]: Math.max((prev[tokenId]||1) - 1, 0) }));
    });
  }

  function handleMint(tokenId: string) {
    if (!isConnected) {
      // Find and trigger the first connector (usually Coinbase Smart Wallet)
      const connector = connectors[0];
      if (connector) {
        console.log(`Opening wallet for minting NFT ${tokenId}`);
        // The ConnectWallet button in WalletControls will handle the connection
        // This is a trigger signal for the wallet modal to open
        const connectButton = document.querySelector('[data-testid="cw-connect-button"]');
        if (connectButton) {
          (connectButton as HTMLButtonElement).click();
        }
      }
    } else {
      // Wallet is connected, proceed with mint flow
      console.log(`Minting NFT ${tokenId} with wallet ${address}`);
      // Award XP for minting/creating NFT
      addXP("NFT_CREATE", { tokenId }).catch(console.error);
      // TODO: Implement actual mint transaction logic here
    }
  }

  function handleOpenListingModal(token: NFTToken) {
    setSelectedNFTForListing(token);
    setIsListingModalOpen(true);
  }

  function handleCloseListingModal() {
    setIsListingModalOpen(false);
    setSelectedNFTForListing(null);
  }

  function handleBuyNFT(token: NFTToken) {
    console.log(`Buying NFT ${token.name} for ${token.price} ETH`);
    
    // Check if wallet is connected
    if (!isConnected) {
      setPendingAction({ type: 'buy', token });
      setShowInsufficientFundsWarning(true);
      return;
    }

    // Check if user has sufficient funds
    const nftPrice = parseFloat(token.price || "0");
    const userBalance = balanceData?.value ? Number(balanceData.value) / 1e18 : 0;
    
    if (userBalance < nftPrice) {
      setPendingAction({ type: 'buy', token });
      setShowInsufficientFundsWarning(true);
      return;
    }

    // Store the NFT being purchased in session storage for reference in swap portal
    if (typeof window !== "undefined") {
      sessionStorage.setItem('pendingNFTPurchase', JSON.stringify({
        tokenId: token.tokenId,
        name: token.name,
        price: token.price,
        image: token.image,
      }));
    }
    
    // Sufficient funds, proceed to payment
    console.log(`User has sufficient funds. Proceeding to purchase ${token.name}`);
    // Award XP for NFT purchase
    addXP("NFT_BUY", { tokenId: token.tokenId, price: token.price }).catch(console.error);
    // TODO: Implement actual payment/purchase transaction
    window.location.hash = "#swap-portal";
  }

  async function handleListNFT(listingData: ListingData) {
    try {
      const response = await fetch('/api/nft/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listingData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to list NFT');
      }

      const result = await response.json();
      console.log('NFT listed successfully:', result);
      alert('NFT listed successfully!');
    } catch (error) {
      console.error('Failed to list NFT:', error);
      throw error;
    }
  }

  return (
    <div className="min-h-screen p-6" style={{background: 'radial-gradient(1200px 600px at 10% 10%, rgba(139,92,246,0.12), transparent), linear-gradient(180deg,#0b0212,#1b0630)'}}>
      <header className="mb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">FarbaseMint</h1>
            <p className="text-sm text-white/60">Live · Trending · Hot · New — Neon gallery</p>
          </div>
          <div className="hidden md:block">
            <WalletControls />
          </div>
        </div>
        
        {/* Mobile wallet controls */}
        <div className="md:hidden">
          <WalletControls />
        </div>
        
        <nav className="flex gap-2 overflow-x-auto">
          {['live','trending','hot','new'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-full font-medium transition whitespace-nowrap ${tab===t? 'bg-white text-black' : 'bg-white/5 text-white/80 hover:bg-white/10'}`}>{t}</button>
          ))}
        </nav>
      </header>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({length:6}).map((_,i) => (
            <div key={i} className="animate-pulse bg-linear-to-b from-black/60 to-black/40 rounded-2xl h-80" />
          ))}
        </div>
      )}

      {error && <div className="text-red-400">Failed to load gallery</div>}

      {!isLoading && !error && (
        <div ref={parentRef} className="h-[72vh] overflow-auto">
          <div style={{ height: `${totalSize}px`, position: 'relative' }}>
            {virtualItems.map(virtualRow => {
              const start = virtualRow.index * columns;
              const cols: (NFTToken | undefined)[] = [];
              for (let c = 0; c < columns; c++) cols.push(items[start + c]);

              return (
                <div key={virtualRow.index} style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`
                }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
                  {cols.map((it, idx) => it ? (
                    <Card 
                      key={it.tokenId} 
                      token={it} 
                      optimisticLikes={optimisticLikes[it.tokenId] || 0} 
                      onLike={() => handleLike(it.tokenId)} 
                      onMint={() => handleMint(it.tokenId)}
                      onSell={handleOpenListingModal}
                      onBuy={handleBuyNFT}
                    />
                  ) : (
                    <div key={`empty-${virtualRow.index}-${idx}`} className="bg-linear-to-b from-black/60 to-black/40 rounded-2xl h-80" />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <footer className="mt-6 text-sm text-white/50">Built for Farcaster Mini Apps · FarbaseMint</footer>

      {/* NFT Listing Modal */}
      {selectedNFTForListing && (
        <NFTListingModal
          nft={selectedNFTForListing}
          isOpen={isListingModalOpen}
          onClose={handleCloseListingModal}
          onList={handleListNFT}
        />
      )}

      {/* Insufficient Funds Warning Modal */}
      {showInsufficientFundsWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-2xl border border-red-500/30 bg-linear-to-br from-red-900/20 to-slate-900/60 p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-start gap-3 mb-4">
              <svg className="h-6 w-6 text-red-400 shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {!isConnected ? "Wallet Not Connected" : "Insufficient Funds"}
                </h3>
                <p className="text-sm text-slate-300 mt-1">
                  {!isConnected
                    ? "Please connect your wallet to proceed"
                    : `You need ${pendingAction?.token?.price} ETH to buy this NFT. Current balance: ${balanceData?.value ? (Number(balanceData.value) / 1e18).toFixed(4) : '0'} ETH`}
                </p>
              </div>
            </div>

            <div className="mb-6 p-4 rounded-lg bg-slate-950/50 border border-white/10">
              <p className="text-xs text-slate-400 mb-2">NFT Details:</p>
              {pendingAction?.token && (
                <>
                  <p className="text-sm font-semibold text-white">{pendingAction.token.name}</p>
                  <p className="text-xs text-slate-400 mt-1">Price: {pendingAction.token.price} ETH</p>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowInsufficientFundsWarning(false)}
                className="flex-1 py-2 px-4 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-white font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowInsufficientFundsWarning(false);
                  if (!isConnected) {
                    // Trigger wallet connection
                    const connectButton = document.querySelector('[data-testid="cw-connect-button"]');
                    if (connectButton) {
                      (connectButton as HTMLButtonElement).click();
                    }
                  } else {
                    // Redirect to swap portal to get funds
                    if (pendingAction?.token) {
                      sessionStorage.setItem('pendingNFTPurchase', JSON.stringify({
                        tokenId: pendingAction.token.tokenId,
                        name: pendingAction.token.name,
                        price: pendingAction.token.price,
                        image: pendingAction.token.image,
                      }));
                    }
                    window.location.hash = "#swap-portal";
                  }
                }}
                className="flex-1 py-2 px-4 rounded-lg bg-emerald-600/80 hover:bg-emerald-500/80 text-white font-semibold transition"
              >
                {!isConnected ? "Connect Wallet" : "Get Funds"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ token, optimisticLikes, onLike, onMint, onSell, onBuy }: { 
  token: NFTToken; 
  optimisticLikes: number; 
  onLike: () => void; 
  onMint: () => void;
  onSell: (token: NFTToken) => void;
  onBuy?: (token: NFTToken) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const image = !imgError && token.image ? (token.image.startsWith('ipfs://') ? IMAGE_CDN + token.image.replace('ipfs://', '') : token.image) : PLACEHOLDER;

  const avatar = token.collectionAvatar ? (token.collectionAvatar.startsWith('ipfs://') ? IMAGE_CDN + token.collectionAvatar.replace('ipfs://','') : token.collectionAvatar) : null;
  const rarity = token.rarity || token.attributes?.find(a=>/rarit/i.test(a.trait_type || ''))?.value || null;

  const neonBase = `0 4px 12px rgba(${ACCENT_COLOR},0.15), 0 0 20px rgba(${ACCENT_COLOR},0.05)`;

  return (
    <article className="relative rounded-xl overflow-hidden hover:scale-[1.02] transition-transform duration-200" style={{border: '1px solid rgba(255,255,255,0.08)', boxShadow: neonBase}}>
      {/* Image Container */}
      <div className="relative w-full aspect-square bg-gray-800 overflow-hidden">
        <img src={image} onError={() => setImgError(true)} alt={token.name} loading="lazy" className="object-cover w-full h-full hover:scale-105 transition-transform duration-300" />
        
        {/* Rarity badge */}
        {rarity && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-bold backdrop-blur-sm bg-violet-600/90 text-white border border-violet-400/40 shadow-lg">{rarity}</div>
        )}
        
        {/* Like button */}
        <button onClick={onLike} className="absolute top-2 right-2 p-2 rounded-full backdrop-blur-md bg-black/50 border border-white/20 hover:scale-110 hover:bg-black/60 transition" title="Like">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current text-red-400"><path d="M12 21s-7.5-4.35-9.5-7.05C-1.5 7.2 6 3 12 8.2 18 3 25.5 7.2 21.5 13.95 19.5 16.65 12 21 12 21z"/></svg>
        </button>
      </div>

      {/* Info Panel */}
      <div className="p-4 bg-linear-to-b from-gray-900/95 to-gray-950/95 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-3">
          {avatar ? (
            <img src={avatar} alt={`${token.collection} avatar`} className="w-10 h-10 rounded-full border-2 border-white/10 object-cover shadow-md" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-violet-600/20 flex items-center justify-center text-sm text-violet-300 font-bold border-2 border-violet-500/30">
              {token.collection?.charAt(0) || 'C'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-base font-bold text-white truncate">{token.name}</div>
            <div className="text-sm text-gray-400 truncate">{token.collection || 'Unknown'}</div>
          </div>
        </div>

        {/* Price and Stats */}
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
          <div>
            <div className="text-xs text-gray-500 mb-0.5">Price</div>
            <div className="text-base font-bold text-violet-400">{token.price ? `${token.price} ETH` : '—'}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-0.5">Likes</div>
            <div className="text-base font-semibold text-gray-300">{token.likes + (optimisticLikes || 0)}</div>
          </div>
        </div>

        {/* Action Buttons - 3 buttons in grid */}
        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={() => onSell(token)}
            className="py-2 px-3 rounded-lg text-sm font-semibold bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 transition hover:scale-105"
          >
            Sell
          </button>
          <button 
            onClick={() => onBuy?.(token)}
            className="py-2 px-3 rounded-lg text-sm font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 transition hover:scale-105"
          >
            Buy
          </button>
          <button onClick={onMint} className="py-2 px-3 rounded-lg text-sm font-bold bg-linear-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white transition hover:scale-105" style={{boxShadow: `0 4px 12px rgba(${ACCENT_COLOR},0.3)`}}>
            Mint
          </button>
        </div>
      </div>
    </article>
  );
}
