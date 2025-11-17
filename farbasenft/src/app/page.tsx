'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { Swap } from "@coinbase/onchainkit/swap";
import type { Token } from "@coinbase/onchainkit/token";
import { useXP } from "@/hooks/useXP";
import { SwapWrapper } from "@/components/SwapWrapper";

import { AppLayout } from "@/components/AppLayout";
import { NFTActions } from "@/components/NFTActions";
import { FarcasterShare } from "@/components/FarcasterShare";
import { XPDisplay } from "@/components/XPDisplay";
import { SBTClaim } from "@/components/SBTClaim";
import { UserProfile } from "@/components/UserProfile";
import { SIDEBAR_SECTION_EVENT } from "@/components/SidebarWithStore";
import { curatorNotes, trendingDrops } from "@/data/nfts";

const categoryStyles: Record<string, string> = {
  auction: "bg-purple-500/10 text-purple-200 ring-1 ring-purple-400/40",
  reserve: "bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-400/40",
  "buy-now": "bg-sky-500/10 text-sky-200 ring-1 ring-sky-400/40",
};

const ethToken: Token = {
  name: "ETH",
  symbol: "ETH",
  address: "",
  decimals: 18,
  image: "https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png",
  chainId: 8453,
};

const usdcToken: Token = {
  name: "USDC",
  symbol: "USDC",
  address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
  decimals: 6,
  image:
    "https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2",
  chainId: 8453,
};

const degenToken: Token = {
  name: "DEGEN",
  symbol: "DEGEN",
  address: "0x4ed4e862860bed51a9570b96d89af5e1b0efefed",
  decimals: 18,
  image:
    "https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/3b/bf/3bbf118b5e6dc2f9e7fc607a6e7526647b4ba8f0bea87125f971446d57b296d2-MDNmNjY0MmEtNGFiZi00N2I0LWIwMTItMDUyMzg2ZDZhMWNm",
  chainId: 8453,
};

const swapFromTokens = [ethToken, usdcToken, degenToken];
const swapToTokens = [usdcToken, ethToken, degenToken];

const swapHighlights = [
  "Aggregator-backed routing across Base liquidity pools.",
  "ETH, USDC, and community tokens like DEGEN supported out of the box.",
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

  // Reset section when clicking on logo or other navigation
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleHashChange = () => {
      const hash = window.location.hash;
      // Reset to show all when hash is cleared or set to gallery
      if (!hash || hash === "") {
        setActiveSection(null);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const { addXP } = useXP();
  
  // Track swap completion for XP (listen for swap success events)
  useEffect(() => {
    const handleSwapComplete = () => {
      addXP("SWAP").catch(console.error);
    };
    
    // Listen for swap events
    window.addEventListener("swap:success", handleSwapComplete);
    return () => window.removeEventListener("swap:success", handleSwapComplete);
  }, [addXP]);

  // Determine what to show based on active section
  const showAll = activeSection === null || activeSection === "gallery";
  const showMarketplace = showAll || activeSection === "marketplace";
  const showCuratorNotes = showAll;
  const showSwap = showAll || activeSection === "swap";
  const showNFTExperience = showAll || activeSection === "mint" || activeSection === "buy" || activeSection === "sell" || activeSection === "listings";

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-7xl space-y-10 px-6 py-12 sm:px-8 lg:px-10">
        {/* User Profile - Visible per Base guidelines */}
        <section id="profile" className="space-y-4">
          <UserProfile />
        </section>

        {/* XP System Section */}
        <section className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <XPDisplay />
            <SBTClaim />
          </div>
        </section>
        {showMarketplace && (
          <section className="space-y-6" id="marketplace">
            <SectionHeading
              eyebrow="Marketplace"
              title="Live & trending drops"
              description="Curate art-first auctions, reserve drops, and buy-now collections—all optimized for Base Account flows."
            />
            <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 sm:gap-5">
              {trendingDrops.slice(0, 4).map((drop) => (
                <div
                  key={drop.id}
                  className="flex min-h-[320px] max-h-[320px] flex-col overflow-hidden rounded-2xl border border-white/5 bg-slate-900/60 p-3 sm:p-4"
                >
                  <div className="relative mx-auto h-[160px] w-[160px] shrink-0 overflow-hidden rounded-xl border border-white/10 sm:h-[250px] sm:w-[250px]">
                    <Image
                      src={drop.image}
                      alt={drop.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 160px, 250px"
                    />
                    <span
                      className={`absolute left-2 top-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold sm:left-3 sm:top-3 sm:px-3 ${categoryStyles[drop.category]}`}
                    >
                      {drop.category.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="mt-2 flex min-w-0 flex-1 flex-col gap-1 overflow-hidden sm:mt-3 sm:gap-1.5">
                    <h3 className="truncate text-sm font-semibold text-white sm:text-base">{drop.title}</h3>
                    <p className="text-xs text-slate-400">{drop.artist}</p>
                    <p className="line-clamp-1 text-xs text-slate-300">{drop.description}</p>
                  </div>
                  <div className="mt-auto space-y-1.5 sm:space-y-2">
                    <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-400 sm:gap-2">
                      <div className="rounded-lg border border-white/10 px-2 py-1 sm:px-2.5 sm:py-1.5">
                        <p className="font-semibold text-white">Reserve</p>
                        <p className="truncate text-xs">{drop.reserve}</p>
                      </div>
                      <div className="rounded-lg border border-white/10 px-2 py-1 sm:px-2.5 sm:py-1.5">
                        <p className="font-semibold text-white">Status</p>
                        <p className="truncate text-xs">{drop.endsIn}</p>
                      </div>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-slate-950/70 p-2 sm:p-2.5">
                      <FarcasterShare 
                        nftTitle={drop.title}
                        nftImage={drop.image}
                        customText={`Check out "${drop.title}" by ${drop.artist} on farbasenft! 🎨`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

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

        {showSwap && (
          <section
            id="swap-portal"
            className="space-y-5 rounded-3xl border border-white/5 bg-slate-900/60 p-6"
          >
            <SectionHeading
              eyebrow="Swap Portal"
              title="Rebalance on Base without leaving farbasenft"
              description="Powered by OnchainKit swap components and the Base aggregator so collectors can move between ETH, USDC, and community tokens in a couple of taps."
            />
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
              <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-5">
                <SwapWrapper
                  from={swapFromTokens}
                  to={swapToTokens}
                  experimental={{ useAggregator: true }}
                  title="Swap on Base"
                  headerLeftContent={
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
                      Base L2
                    </span>
                  }
                />
              </div>
              <div className="space-y-4 rounded-2xl border border-white/5 bg-slate-900/60 p-5">
                <h3 className="text-lg font-semibold text-white">Swap highlights</h3>
                <ul className="space-y-3 text-sm text-slate-200">
                  {swapHighlights.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-cyan-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {showNFTExperience && (
          <section className="space-y-5" id="nft-experience">
            <SectionHeading
              eyebrow="Mint · Sell · Collect"
              title="Manage NFTs end-to-end inside farbasenft"
              description="Connect a wallet, resolve Basenames, mint new works, and interact with your marketplace contracts without leaving the mini app."
            />
            <NFTActions />
          </section>
        )}
      </div>
    </AppLayout>
  );
}
