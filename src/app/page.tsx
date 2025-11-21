'use client';

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Swap } from "@coinbase/onchainkit/swap";
import type { Token } from "@coinbase/onchainkit/token";
import { useXP } from "@/hooks/useXP";
import { useAccount } from "wagmi";
import { SwapWrapper } from "@/components/SwapWrapper";
import { ModernSwap } from "@/components/ModernSwap";

import { AppLayout } from "@/components/AppLayout";
import { NFTActions } from "@/components/NFTActions";
import { FarcasterShare } from "@/components/FarcasterShare";
import { XPDisplay } from "@/components/XPDisplay";
import { SBTClaim } from "@/components/SBTClaim";
import { UserProfile } from "@/components/UserProfile";
import { SIDEBAR_SECTION_EVENT } from "@/components/SidebarWithStore";
import Dashboard from "@/components/Dashboard";
import { curatorNotes, trendingDrops } from "@/data/nfts";
import FarbaseMintNFTGallery from "@/components/FarbaseMintGallery";
import Leaderboard from "@/components/Leaderboard";
import Favorites from "@/components/Favorites";
import Portfolio from "@/components/Portfolio";
import SearchFilters from "@/components/SearchFilters";
import { FarbaseBanner } from "@/components/FarbaseBanner";

const categoryStyles: Record<string, string> = {
  auction: "bg-purple-500/10 text-purple-200 ring-1 ring-purple-400/40",
  reserve: "bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-400/40",
  "buy-now": "bg-sky-500/10 text-sky-200 ring-1 ring-sky-400/40",
};

// Mainnet Base tokens (chainId: 8453)
const mainnetTokens = {
  ethToken: {
    name: "ETH",
    symbol: "ETH",
    address: "",
    decimals: 18,
    image: "https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png",
    chainId: 8453,
  } as Token,
  usdcToken: {
    name: "USDC",
    symbol: "USDC",
    address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
    decimals: 6,
    image:
      "https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2",
    chainId: 8453,
  } as Token,
  degenToken: {
    name: "DEGEN",
    symbol: "DEGEN",
    address: "0x4ed4e862860bed51a9570b96d89af5e1b0efefed",
    decimals: 18,
    image:
      "https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/3b/bf/3bbf118b5e6dc2f9e7fc607a6e7526647b4ba8f0bea87125f971446d57b296d2-MDNmNjY0MmEtNGFiZi00N2I0LWIwMTItMDUyMzg2ZDZhMWNm",
    chainId: 8453,
  } as Token,
  wethToken: {
    name: "Wrapped ETH",
    symbol: "WETH",
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
    image: "https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png",
    chainId: 8453,
  } as Token,
  daiToken: {
    name: "Dai Stablecoin",
    symbol: "DAI",
    address: "0x50c5725949a6f0c72e6c4a641f24049a917db0cb",
    decimals: 18,
    image: "https://ethereum-optimism.github.io/data/DAI/logo.svg",
    chainId: 8453,
  } as Token,
};

// Sepolia testnet tokens (chainId: 84532)
const sepoliaTokens = {
  ethToken: {
    name: "ETH",
    symbol: "ETH",
    address: "",
    decimals: 18,
    image: "https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png",
    chainId: 84532,
  } as Token,
  usdcToken: {
    name: "USDC",
    symbol: "USDC",
    address: "0x0b2C639c533813f4Aa9D7837CAf62653d53975E5",
    decimals: 6,
    image:
      "https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2",
    chainId: 84532,
  } as Token,
  degenToken: {
    name: "DEGEN",
    symbol: "DEGEN",
    address: "0x0000000000000000000000000000000000000000", // Not available on Sepolia
    decimals: 18,
    image:
      "https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/3b/bf/3bbf118b5e6dc2f9e7fc607a6e7526647b4ba8f0bea87125f971446d57b296d2-MDNmNjY0MmEtNGFiZi00N2I0LWIwMTItMDUyMzg2ZDZhMWNm",
    chainId: 84532,
  } as Token,
  wethToken: {
    name: "Wrapped ETH",
    symbol: "WETH",
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
    image: "https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png",
    chainId: 84532,
  } as Token,
  daiToken: {
    name: "Dai Stablecoin",
    symbol: "DAI",
    address: "0x0000000000000000000000000000000000000000", // Not available on Sepolia
    decimals: 18,
    image: "https://ethereum-optimism.github.io/data/DAI/logo.svg",
    chainId: 84532,
  } as Token,
};

// Helper function to get tokens based on chain
function getTokensForChain(chainId?: number) {
  if (chainId === 84532) {
    return sepoliaTokens;
  }
  return mainnetTokens;
}

const swapHighlights = [
  "Instant swaps with best rates across multiple DEXs on Base L2",
  "Gas-optimized transactions - save up to 95% compared to Ethereum mainnet",
  "Support for ETH, USDC, WETH, DAI, and community tokens like DEGEN",
  "Secure aggregator routing ensures you always get the best price",
  "Seamlessly integrated - swap without leaving your NFT browsing experience",
];

function SectionHeading({ title, eyebrow, description }: { title: string; eyebrow?: string; description?: string }) {
  return (
    <div className="space-y-2">
      {eyebrow ? <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{eyebrow}</p> : null}
      <h2 className="text-3xl font-semibold text-white">{title}</h2>
      {description ? <p className="text-base text-slate-300">{description}</p> : null}
    </div>
  );
}

export default function Page() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [pendingNFT, setPendingNFT] = useState<any>(null);
  const [showSearchFilters, setShowSearchFilters] = useState(false);
  const [shareNFT, setShareNFT] = useState<any>(null);
  const { address, chainId } = useAccount();

  // Get tokens based on current chain
  const currentTokens = getTokensForChain(chainId);
  const swapFromTokens = [
    currentTokens.ethToken,
    currentTokens.usdcToken,
    currentTokens.wethToken,
    currentTokens.degenToken,
    currentTokens.daiToken,
  ].filter((token) => token.address !== "0x0000000000000000000000000000000000000000"); // Filter out unavailable tokens
  
  const swapToTokens = [
    currentTokens.usdcToken,
    currentTokens.ethToken,
    currentTokens.wethToken,
    currentTokens.degenToken,
    currentTokens.daiToken,
  ].filter((token) => token.address !== "0x0000000000000000000000000000000000000000"); // Filter out unavailable tokens
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{ section: string }>;
      const section = customEvent.detail?.section;
      if (section) {
        setActiveSection(section);
      } else {
        setActiveSection(null);
      }
    };
    window.addEventListener(SIDEBAR_SECTION_EVENT, handler as EventListener);
    return () => {
      window.removeEventListener(SIDEBAR_SECTION_EVENT, handler as EventListener);
    };
  }, []);

  // Sync activeSection with URL hash changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove # prefix
      
      // Map hashes to section names
      const hashMap: Record<string, string | null> = {
        "dashboard": "dashboard",
        "": null,
        "gallery": "gallery",
        "farbasemint-gallery": "gallery",
        "mint": "mint",
        "nft-experience": "mint",
        "swap-portal": "swap",
        "marketplace": "marketplace",
        "profile": "profile",
      };
      
      const section = hashMap[hash] || null;
      setActiveSection(section);
      
      // Scroll to section if it exists
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      }
    };
    
    // Call on initial load to sync with current hash
    handleHashChange();
    
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const { addXP } = useXP();
  
  // Load pending NFT purchase from session storage
  useEffect(() => {
    if (activeSection === "swap" || window.location.hash === "#swap-portal") {
      const pending = sessionStorage.getItem('pendingNFTPurchase');
      if (pending) {
        try {
          setPendingNFT(JSON.parse(pending));
        } catch (e) {
          console.error('Failed to parse pending NFT:', e);
        }
      }
    }
  }, [activeSection]);
  
  // Handle swap completion and award XP (requires on-chain transaction)
  const handleSwapComplete = useCallback((transactionHash?: string) => {
    if (transactionHash) {
      // Only award XP for verified on-chain transactions
      addXP("SWAP", { transactionHash }).catch(console.error);
      console.log(`On-chain swap verified: ${transactionHash}. XP awarded!`);
    } else {
      console.log("Swap completed but transaction hash not verified. No XP awarded - swaps must be completed on-chain.");
    }
    // Clear pending NFT after successful swap (user can now complete purchase)
    if (pendingNFT) {
      console.log(`Swapped successfully! Ready to purchase ${pendingNFT.name}`);
    }
  }, [addXP, pendingNFT]);

  // Determine what to show based on active section
  // Default (null) shows all sections except dashboard
  const showDashboard = activeSection === "dashboard";
  const showGallery = activeSection === null || activeSection === "gallery";
  const showMarketplace = activeSection === null || activeSection === "marketplace";
  const showCuratorNotes = activeSection === null;
  const showSwap = activeSection === null || activeSection === "swap";
  const showNFTExperience = activeSection === null || activeSection === "nft-experience" || activeSection === "mint" || activeSection === "buy" || activeSection === "sell" || activeSection === "listings";
  const showFarbaseMintGallery = activeSection === null || activeSection === "gallery" || activeSection === "farbasemint-gallery";
  const showProfile = activeSection === null || activeSection === "profile" || !showDashboard;
  const showLeaderboard = activeSection === "leaderboard";
  const showFavorites = activeSection === "favorites";
  const showPortfolio = activeSection === "portfolio";

  return (
    <AppLayout>
      <FarbaseBanner />
      <div className="mx-auto w-full max-w-7xl space-y-10 px-6 py-12 sm:px-8 lg:px-10">
        {/* Farbase Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-950 via-blue-900 to-blue-950 p-12 shadow-2xl">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-linear-to-br from-cyan-500/20 to-transparent"></div>
            <div className="absolute inset-0 bg-linear-to-tr from-purple-500/20 to-transparent"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 space-y-4">
            <h1 className="text-5xl font-bold text-white md:text-6xl">Farbase</h1>
            <p className="max-w-2xl text-xl text-slate-100 md:text-2xl">
              A next-gen NFT marketplace built on Base with seamless Farcaster integration
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200">
                <span className="inline-block h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
                Live on Base
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-400/10 px-4 py-2 text-sm font-medium text-purple-200">
                <span className="inline-block h-2 w-2 rounded-full bg-purple-400"></span>
                Multi-chain Ready
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-200">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
                Farcaster Native
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Section - Full page, hides other content */}
        {showDashboard && (
          <section id="dashboard" className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <Dashboard />
          </section>
        )}

        {/* All other content hidden when dashboard is active */}
        {!showDashboard && (
          <>
            {/* User Profile - Always visible when not on Dashboard */}
            {showProfile && (
              <section id="profile" className="space-y-4">
                <UserProfile />
              </section>
            )}

            {/* XP System Section - Always visible when not on Dashboard */}
            <section className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <XPDisplay />
                <SBTClaim />
              </div>
            </section>

            {/* FarbaseMint NFT Gallery - Toggle with farbasemint-gallery section */}
            {showFarbaseMintGallery && (
              <section className="space-y-6" id="gallery">
                <FarbaseMintNFTGallery initialTab="trending" />
              </section>
            )}

            {/* Marketplace Section - Show on default or marketplace section */}
            {showMarketplace && (
              <section className="space-y-6" id="marketplace">
                <SectionHeading
                  eyebrow="Marketplace"
                  title="Live & trending drops"
                  description="Curate art-first auctions, reserve drops, and buy-now collections—all optimized for Base Account flows."
                />
                <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-3 sm:gap-4">
                  {trendingDrops.slice(0, 4).map((drop) => (
                    <div
                      key={drop.id}
                      className="flex flex-col overflow-hidden rounded-xl border border-white/5 bg-slate-900/60 p-2 sm:p-3 hover:border-white/20 transition"
                    >
                      <div className="relative mx-auto h-[90px] w-[90px] shrink-0 overflow-hidden rounded-lg border border-white/10 sm:h-[120px] sm:w-[120px]">
                        <Image
                          src={drop.image}
                          alt={drop.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 90px, 120px"
                        />
                        <span
                          className={`absolute left-1.5 top-1.5 inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold sm:left-2 sm:top-2 sm:px-2 ${categoryStyles[drop.category]}`}
                        >
                          {drop.category.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="mt-1.5 flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden sm:mt-2 sm:gap-1">
                        <h3 className="truncate text-xs font-semibold text-white sm:text-sm">{drop.title}</h3>
                        <p className="text-[10px] text-slate-400 sm:text-xs">{drop.artist}</p>
                        <p className="line-clamp-1 text-[10px] text-slate-300 sm:text-xs">{drop.description}</p>
                      </div>
                      <div className="mt-auto space-y-1.5 sm:space-y-2">
                        <div className="grid grid-cols-2 gap-1 text-xs text-slate-400 sm:gap-1.5">
                          <div className="rounded-md border border-white/10 px-1.5 py-1 sm:px-2 sm:py-1 bg-slate-950/40">
                            <p className="font-semibold text-white text-[10px] sm:text-xs">Reserve</p>
                            <p className="truncate text-[10px] sm:text-xs text-cyan-300 font-medium">{drop.reserve}</p>
                          </div>
                          <div className="rounded-md border border-white/10 px-1.5 py-1 sm:px-2 sm:py-1 bg-slate-950/40">
                            <p className="font-semibold text-white text-[10px] sm:text-xs">Ends In</p>
                            <p className="truncate text-[10px] sm:text-xs text-purple-300 font-medium">{drop.endsIn}</p>
                          </div>
                        </div>
                        <div className="flex gap-1 sm:gap-1.5">
                          <button 
                            onClick={() => setShareNFT(drop)}
                            className="flex-1 px-2 py-1.5 rounded-md bg-slate-800/50 hover:bg-slate-800 border border-slate-600 text-slate-300 hover:text-white transition" 
                            title="Share on Farcaster"
                          >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            <span className="ml-1 text-[10px] sm:text-xs">Share</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Curator Notes - Show on default view only */}
            {showCuratorNotes && (
              <section className="space-y-5" id="curator-notes">
                <SectionHeading
                  eyebrow="Curation"
                  title="Curator notes"
                  description="Onboard collectors instantly—no wallet pop-ups, no email gates."
                />
                <div className="grid gap-6 md:grid-cols-3">
                  {curatorNotes.map((note) => (
                    <div key={note.title} className="rounded-2xl border border-white/5 bg-slate-900/60 p-5">
                      <p className="text-sm font-semibold text-white">{note.title}</p>
                      <p className="mt-3 text-sm text-slate-300">{note.body}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Swap Portal - Show on default or swap section */}
            {showSwap && (
              <section
                id="swap-portal"
                className="space-y-4 sm:space-y-6 rounded-2xl sm:rounded-3xl border border-cyan-500/20 bg-linear-to-br from-slate-900/80 to-slate-900/60 p-3 sm:p-6 shadow-xl shadow-cyan-500/5"
              >
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-cyan-400">Swap Portal</span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-emerald-300">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Live
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white leading-tight">Rebalance on Base L2</h2>
                  <p className="text-xs sm:text-sm lg:text-base text-slate-300 max-w-2xl leading-relaxed">
                    Powered by OnchainKit aggregator. Swap between ETH, stablecoins, and community tokens with the best rates.
                  </p>
                </div>

                <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.2fr_1fr]">
                  <div className="flex items-center justify-center">
                    <ModernSwap />
                  </div>

                  <div className="space-y-3 sm:space-y-5">
                    {/* Pending NFT Purchase Info */}
                    {pendingNFT && (
                      <div className="rounded-xl sm:rounded-2xl border border-emerald-500/30 bg-linear-to-br from-emerald-900/20 to-slate-900/60 p-3 sm:p-5">
                        <div className="mb-2 sm:mb-3 flex items-center gap-2">
                          <svg className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <h4 className="text-xs sm:text-sm font-semibold text-white">Pending Purchase</h4>
                        </div>
                        <div className="mb-2 sm:mb-3 space-y-1 sm:space-y-2">
                          <p className="text-[10px] sm:text-xs text-slate-300">{pendingNFT.name}</p>
                          <p className="text-xs sm:text-sm font-bold text-emerald-300">Price: {pendingNFT.price} ETH</p>
                        </div>
                        <p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed">
                          Swap ETH or USDC to ensure you have enough balance, then return to the gallery to complete your purchase.
                        </p>
                      </div>
                    )}

                    <div className="rounded-xl sm:rounded-2xl border border-white/5 bg-slate-900/60 p-3 sm:p-5">
                      <h3 className="mb-3 sm:mb-4 text-sm sm:text-base lg:text-lg font-semibold text-white">Why Swap on Base?</h3>
                      <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-200">
                        {swapHighlights.map((item, index) => (
                          <li key={item} className="flex items-start gap-2 sm:gap-3">
                            <span className="mt-0.5 sm:mt-1 inline-flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-cyan-400 shrink-0" />
                            <span className="flex-1 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl sm:rounded-2xl border border-purple-500/20 bg-linear-to-br from-purple-900/20 to-slate-900/60 p-3 sm:p-5">
                      <div className="mb-2 sm:mb-3 flex items-center gap-2">
                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <h4 className="text-xs sm:text-sm font-semibold text-white">Earn XP Rewards</h4>
                      </div>
                      <p className="text-[10px] sm:text-xs text-slate-300 leading-relaxed">
                        Complete on-chain swaps to earn XP and unlock exclusive perks. Only verified blockchain transactions count!
                      </p>
                    </div>

                    <XPDisplay />
                  </div>
                </div>
              </section>
            )}

            {/* NFT Experience section removed for Mini App */}

            {/* Leaderboard Section */}
            {showLeaderboard && (
              <section className="space-y-6" id="leaderboard">
                <Leaderboard />
              </section>
            )}

            {/* Favorites Section */}
            {showFavorites && (
              <section className="space-y-6" id="favorites">
                <Favorites />
              </section>
            )}

            {/* Portfolio Section */}
            {showPortfolio && (
              <section className="space-y-6" id="portfolio">
                <Portfolio />
              </section>
            )}
          </>
        )}
      </div>

      {/* Share Modal */}
      {shareNFT && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-linear-to-b from-slate-800 to-slate-900 rounded-xl p-4 max-w-sm w-full border border-slate-700 shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => setShareNFT(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white transition"
              title="Close share modal"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* NFT Preview */}
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white mb-3">{shareNFT.title}</h2>
              <div className="bg-slate-700 rounded-lg overflow-hidden mb-3">
                <img
                  src={shareNFT.image}
                  alt={shareNFT.title}
                  className="w-full h-32 object-cover"
                />
              </div>
              <p className="text-xs text-slate-300">By {shareNFT.artist}</p>
              {shareNFT.description && (
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">{shareNFT.description}</p>
              )}
            </div>

            {/* Share URL */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Shareable Link
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  readOnly
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/nft/${shareNFT.id}`}
                  className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-2.5 py-1.5 text-slate-300 text-xs truncate"
                  title="Shareable link"
                  placeholder="Share link"
                  aria-label="Shareable link"
                />
                <button
                  onClick={() => {
                    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/nft/${shareNFT.id}`;
                    navigator.clipboard.writeText(url);
                    alert('Link copied to clipboard!');
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition text-xs"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Share Message */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Share Message
              </label>
              <textarea
                defaultValue={`Check out "${shareNFT.title}" by ${shareNFT.artist} on FarbaseNFT! 🎨`}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-2.5 py-1.5 text-slate-300 text-xs resize-none h-16"
                title="Share message"
                placeholder="Share message"
                aria-label="Share message"
              />
            </div>

            {/* Share Options */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/nft/${shareNFT.id}`;
                  const text = `Check out "${shareNFT.title}" by ${shareNFT.artist} on FarbaseNFT! 🎨`;
                  
                  if (navigator.share) {
                    navigator.share({
                      title: shareNFT.title,
                      text: text,
                      url: url,
                    });
                  } else {
                    // Fallback: copy to clipboard
                    navigator.clipboard.writeText(`${text}\n${url}`);
                    alert('Link copied to clipboard!');
                  }
                }}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Share
              </button>
              <button
                onClick={() => setShareNFT(null)}
                className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
