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
import { XPDisplay } from "@/components/XPDisplay";
import { SBTClaim } from "@/components/SBTClaim";
import { UserProfile } from "@/components/UserProfile";
import { SIDEBAR_SECTION_EVENT } from "@/components/SidebarWithStore";
import Dashboard from "@/components/Dashboard";
import Leaderboard from "@/components/Leaderboard";
import Favorites from "@/components/Favorites";
import Portfolio from "@/components/Portfolio";
import SearchFilters from "@/components/SearchFilters";
import FarbaseMiniGallery from "@/components/FarbaseMiniGallery";

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
  const showSwap = activeSection === null || activeSection === "swap";
  const showNFTExperience = activeSection === null || activeSection === "nft-experience" || activeSection === "mint" || activeSection === "buy" || activeSection === "sell" || activeSection === "listings";
  const showProfile = activeSection === null || activeSection === "profile" || !showDashboard;
  const showLeaderboard = activeSection === "leaderboard";
  const showFavorites = activeSection === "favorites";
  const showPortfolio = activeSection === "portfolio";

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-7xl space-y-10 px-6 py-12 sm:px-8 lg:px-10">
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
            {/* Gallery Section - FarbaseMiniGallery */}
            {showGallery && (
              <section id="gallery" className="space-y-4">
                <FarbaseMiniGallery />
              </section>
            )}

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
    </AppLayout>
  );
}
