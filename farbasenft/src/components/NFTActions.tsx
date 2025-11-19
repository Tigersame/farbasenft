"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Connected } from "@coinbase/onchainkit";
import { Identity, Avatar, Name } from "@coinbase/onchainkit/identity";
import { parseAbi, parseEther, type Abi } from "viem";
import { useAccount, useWriteContract } from "wagmi";

import { Info, Tip, Warning } from "@/components/Primitives";
import { FarcasterShare } from "@/components/FarcasterShare";
import { SIDEBAR_PANEL_EVENT } from "@/components/SidebarWithStore";
import { useXP } from "@/hooks/useXP";
import { getImageDimensions, validateImageDimensions, formatAspectRatio, type ImageValidationResult } from "@/lib/imageValidation";

const marketplaceAddress = process.env
  .NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS as `0x${string}` | undefined;
const sellAbiJson = process.env.NEXT_PUBLIC_MARKETPLACE_SELL_ABI;
const buyAbiJson = process.env.NEXT_PUBLIC_MARKETPLACE_BUY_ABI;

const defaultSellAbi = parseAbi(["function listToken(uint256 tokenId,uint256 price)"]);
const defaultBuyAbi = parseAbi(["function buyListing(uint256 listingId)"]);

const mockStats = [
  { label: "Floor", value: "1.28 ETH", detail: "Base verified" },
  { label: "24h Volume", value: "182.4 ETH", detail: "+12.6%" },
  { label: "Owners", value: "3.2k", detail: "68% unique" },
];

const mockListings = [
  { id: 7124, price: 1.35, expiry: "in 2h", seller: "bas3/anise" },
  { id: 7069, price: 1.42, expiry: "in 6h", seller: "bas3/raoul" },
  { id: 7011, price: 1.58, expiry: "in 12h", seller: "bas3/artplus" },
  { id: 6903, price: 1.62, expiry: "1d", seller: "bas3/collector" },
];

const mockActivity = [
  { action: "Mint", user: "bas3/vanta", value: "0.08 ETH", when: "3m ago" },
  { action: "Buy", user: "bas3/cove", value: "1.44 ETH", when: "41m ago" },
  { action: "Sell", user: "bas3/sodium", value: "1.50 ETH", when: "1h ago" },
  { action: "Mint", user: "bas3/ora", value: "0.08 ETH", when: "2h ago" },
  { action: "Buy", user: "bas3/atlas", value: "1.32 ETH", when: "4h ago" },
  { action: "Sell", user: "bas3/opal", value: "1.55 ETH", when: "5h ago" },
];

const nftPanels = [
  { id: "overview", label: "Overview", badge: "Summary" },
  { id: "list", label: "Sell", badge: "Orders" },
  { id: "buy", label: "Buy", badge: "Sweep" },
  { id: "swap", label: "Swap", badge: "Liquidity" },
  { id: "types", label: "Playbook", badge: "Guide" },
  { id: "activity", label: "Activity", badge: "Feed" },
];

function useMarketplaceAbi(customJson: string | undefined, fallback: Abi) {
  return useMemo(() => {
    if (!customJson) return fallback;
    try {
      const parsed = JSON.parse(customJson);
      return parsed as Abi;
    } catch (error) {
      console.error("Failed to parse marketplace ABI JSON", error);
      return fallback;
    }
  }, [customJson, fallback]);
}

export function NFTActions() {
  const sellAbi = useMarketplaceAbi(sellAbiJson, defaultSellAbi);
  const buyAbi = useMarketplaceAbi(buyAbiJson, defaultBuyAbi);
  const sellFunctionName = process.env.NEXT_PUBLIC_MARKETPLACE_SELL_FUNCTION ?? "listToken";
  const buyFunctionName = process.env.NEXT_PUBLIC_MARKETPLACE_BUY_FUNCTION ?? "buyListing";

  const { writeContractAsync } = useWriteContract();
  const { addXP } = useXP();
  const [sellState, setSellState] = useState<string | null>(null);
  const [buyState, setBuyState] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState("");
  const [priceEth, setPriceEth] = useState("");
  const [listingId, setListingId] = useState("");
  const [listingLoading, setListingLoading] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [activePanel, setActivePanel] = useState<string>("overview");
  
  // NFT preview states for listing/buying
  const [nftImageUrl, setNftImageUrl] = useState<string | null>(null);
  const [nftName, setNftName] = useState<string | null>(null);
  const [fetchingNFT, setFetchingNFT] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{ panel: string }>;
      const nextPanel = customEvent.detail?.panel;
      if (!nextPanel) return;
      const exists = nftPanels.some((panel) => panel.id === nextPanel);
      if (!exists) return;
      setActivePanel(nextPanel);
    };
    window.addEventListener(SIDEBAR_PANEL_EVENT, handler as EventListener);
    return () => {
      window.removeEventListener(SIDEBAR_PANEL_EVENT, handler as EventListener);
    };
  }, []);

  const handleList = async () => {
    if (!marketplaceAddress) {
      setSellState("Set marketplace address env var.");
      return;
    }
    if (!tokenId || !priceEth) {
      setSellState("Enter token ID and price.");
      return;
    }
    try {
      setListingLoading(true);
      setSellState("Submitting transaction...");
      const args = [BigInt(tokenId), parseEther(priceEth)];
      await writeContractAsync({
        address: marketplaceAddress,
        abi: sellAbi,
        functionName: sellFunctionName,
        args,
      });
      setSellState("Listing transaction submitted.");
      // Award XP for selling (after successful transaction)
      try {
        await addXP("NFT_SELL", { tokenId, price: priceEth });
      } catch (xpError) {
        console.error("Failed to award XP for sell:", xpError);
      }
    } catch (error) {
      console.error(error);
      setSellState(`Listing failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setListingLoading(false);
    }
  };

  const handleBuy = async () => {
    if (!marketplaceAddress) {
      setBuyState("Set marketplace address env var.");
      return;
    }
    if (!listingId) {
      setBuyState("Enter listing ID.");
      return;
    }
    try {
      setBuyLoading(true);
      setBuyState("Submitting transaction...");
      const args = [BigInt(listingId)];
      await writeContractAsync({
        address: marketplaceAddress,
        abi: buyAbi,
        functionName: buyFunctionName,
        args,
      });
      setBuyState("Purchase submitted.");
      // Award XP for buying (after successful transaction)
      try {
        await addXP("NFT_BUY", { listingId });
      } catch (xpError) {
        console.error("Failed to award XP for buy:", xpError);
      }
    } catch (error) {
      console.error(error);
      setBuyState(`Purchase failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setBuyLoading(false);
    }
  };

  // Fetch NFT metadata when token ID is entered
  useEffect(() => {
    const fetchNFTMetadata = async () => {
      if (!tokenId || !marketplaceAddress) {
        setNftImageUrl(null);
        setNftName(null);
        return;
      }
      
      // Only fetch if tokenId is a valid number
      if (isNaN(Number(tokenId)) || Number(tokenId) < 0) {
        setNftImageUrl(null);
        setNftName(null);
        return;
      }
      
      try {
        setFetchingNFT(true);
        const response = await fetch(`/api/nft/metadata?contract=${marketplaceAddress}&tokenId=${tokenId}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.image) {
            setNftImageUrl(data.image);
            setNftName(data.name || `Token #${tokenId}`);
          }
        } else {
          // Clear preview if fetch fails
          setNftImageUrl(null);
          setNftName(null);
        }
      } catch (error) {
        console.error("Failed to fetch NFT metadata:", error);
        setNftImageUrl(null);
        setNftName(null);
      } finally {
        setFetchingNFT(false);
      }
    };
    
    const timeoutId = setTimeout(fetchNFTMetadata, 500);
    return () => clearTimeout(timeoutId);
  }, [tokenId, marketplaceAddress]);

  const IdentityHeader = () => {
    const { address } = useAccount();
    
    return (
      <section className="overflow-hidden rounded-3xl border border-white/5 bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 p-6">
        <Connected>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Identity address={address}>
                <div className="relative">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-sky-500/30 blur" />
                  <Avatar className="relative h-14 w-14 rounded-full border border-sky-400/60" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-[0.3em] text-sky-300/80">Basename</span>
                  <Name className="text-2xl font-semibold text-white" />
                  <p className="text-sm text-slate-300">Connected via Base Account · Smart wallet ready</p>
                </div>
              </Identity>
            </div>
            <div className="flex flex-wrap gap-6">
              {mockStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-400">{stat.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </Connected>
      </section>
    );
  };

  const ListingPanel = () => (
    <section className="space-y-6 rounded-3xl border border-white/5 bg-slate-900/60 p-6">
      <header className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Pro listing tools</h3>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
          Secondary market
        </span>
      </header>
      <Connected>
        <div className="space-y-5 rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-lg">
          {/* NFT Preview */}
          {nftImageUrl && (
            <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4">
              <p className="mb-2 text-xs font-semibold text-slate-300">NFT Preview</p>
              <div className="flex gap-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-white/10">
                  <Image
                    src={nftImageUrl}
                    alt={nftName || "NFT"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{nftName || `Token #${tokenId}`}</p>
                  <p className="text-xs text-slate-400">Token ID: {tokenId}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Token ID
              <input
                value={tokenId}
                onChange={(event) => setTokenId(event.target.value)}
                placeholder="7124"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/40"
              />
              {fetchingNFT && (
                <p className="text-xs text-slate-500">Fetching NFT data...</p>
              )}
            </label>
            <label className="space-y-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Price (ETH)
              <input
                value={priceEth}
                onChange={(event) => setPriceEth(event.target.value)}
                placeholder="1.42"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/40"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={handleList}
            disabled={listingLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:bg-slate-400/40 disabled:text-slate-600"
          >
            {listingLoading ? "Submitting listing..." : "List NFT"}
          </button>
          {sellState ? <p className="text-sm text-slate-300">{sellState}</p> : null}
        </div>
      </Connected>
      <Warning>
        Update <code>NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS</code>, <code>
          NEXT_PUBLIC_MARKETPLACE_SELL_FUNCTION
        </code>, and optional <code>NEXT_PUBLIC_MARKETPLACE_SELL_ABI</code> (JSON array) to match your marketplace contract.
      </Warning>
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-sm text-slate-200">
          <thead className="bg-slate-950/90 text-xs uppercase tracking-[0.2em] text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left">Listing</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Expiry</th>
              <th className="px-4 py-3 text-left">Seller</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {mockListings.map((listing) => (
              <tr key={listing.id} className="bg-slate-950/50 hover:bg-slate-900/70">
                <td className="px-4 py-3 font-medium text-white">#{listing.id}</td>
                <td className="px-4 py-3 text-emerald-300">{listing.price.toFixed(2)} ETH</td>
                <td className="px-4 py-3 text-slate-400">{listing.expiry}</td>
                <td className="px-4 py-3 text-slate-300">{listing.seller}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  const ListingPreview = () => {
    const floor = mockListings.reduce((min, listing) => Math.min(min, listing.price), Number.POSITIVE_INFINITY);
    const topListing = mockListings[0];
    return (
      <section className="space-y-4 rounded-3xl border border-white/5 bg-slate-900/60 p-6">
        <header className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Market snapshot</h3>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
            Live orders
          </span>
        </header>
        <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Floor (simulated)</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-300">{floor.toFixed(2)} ETH</p>
          <p className="text-xs text-slate-400">Listing #{topListing.id} · {topListing.seller}</p>
        </div>
        <div className="space-y-2 text-xs text-slate-400">
          {mockListings.slice(0, 3).map((listing) => (
            <div key={listing.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3">
              <span className="text-slate-300">#{listing.id}</span>
              <span className="font-semibold text-white">{listing.price.toFixed(2)} ETH</span>
              <span>{listing.expiry}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const BuyPanel = () => (
    <section className="space-y-5 rounded-3xl border border-white/5 bg-slate-900/60 p-6">
      <header className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Sweep or buy</h3>
        <span className="rounded-full border border-purple-400/40 px-3 py-1 text-xs font-semibold text-purple-200">
          Live order
        </span>
      </header>
      <Connected>
        <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-lg">
          {/* NFT Preview for Listing */}
          {listingId && nftImageUrl && (
            <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4">
              <p className="mb-2 text-xs font-semibold text-slate-300">Listing Preview</p>
              <div className="flex gap-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-white/10">
                  <Image
                    src={nftImageUrl}
                    alt={nftName || "NFT"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{nftName || `Listing #${listingId}`}</p>
                  <p className="text-xs text-slate-400">Listing ID: {listingId}</p>
                </div>
              </div>
            </div>
          )}
          
          <label className="space-y-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
            Listing ID
            <input
              value={listingId}
              onChange={(event) => setListingId(event.target.value)}
              placeholder="7069"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
            />
          </label>
          <button
            type="button"
            onClick={handleBuy}
            disabled={buyLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-white hover:text-white disabled:cursor-not-allowed disabled:border-white/10 disabled:text-slate-500"
          >
            {buyLoading ? "Submitting purchase..." : "Buy now"}
          </button>
          {buyState ? <p className="text-sm text-slate-300">{buyState}</p> : null}
        </div>
      </Connected>
      <Info>
        Buying relies on <code>NEXT_PUBLIC_MARKETPLACE_BUY_FUNCTION</code> (default <code>buyListing</code>). Override the ABI via
        <code> NEXT_PUBLIC_MARKETPLACE_BUY_ABI</code> if your marketplace expects additional parameters or payable value.
      </Info>
    </section>
  );

  const SwapPanel = () => (
    <section className="space-y-5 rounded-3xl border border-white/5 bg-slate-900/60 p-6">
      <header className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Swap inventory</h3>
        <span className="rounded-full border border-cyan-400/40 px-3 py-1 text-xs font-semibold text-cyan-200">
          Liquidity
        </span>
      </header>
      <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-lg">
        <p className="text-sm text-slate-300">
          Need to rebalance before grabbing a listing? Use the in-app Base swap portal for instant ETH ⇄ USDC ⇄ DEGEN routing.
          Quotes are aggregator-backed with paymaster support when configured.
        </p>
        <Link
          href="#swap-portal"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
        >
          Open swap portal
        </Link>
        <Tip>
          Set <code>NEXT_PUBLIC_ONCHAINKIT_API_KEY</code> with swap scope (and <code>NEXT_PUBLIC_PAYMASTER_RPC_URL</code> if you
          plan to sponsor gas) to unlock one-tap conversions.
        </Tip>
      </div>
    </section>
  );

  const TypesPanel = () => (
    <section className="space-y-6 rounded-3xl border border-white/5 bg-slate-900/60 p-6">
      <header className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">NFT release playbook</h3>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
          Formats
        </span>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          {
            title: "1/1 artworks",
            copy: "Single edition, auction or reserve mechanics. Ideal for hero drops & collector spotlights.",
          },
          {
            title: "Limited editions",
            copy: "Fixed supply (e.g. /50) with flat price or bonding curve. Track sell-through in activity feed.",
          },
          {
            title: "Open editions",
            copy: "Time-gated mint window with paymaster-backed mints for Base onboarding campaigns.",
          },
          {
            title: "Tiered collections",
            copy: "Use marketplace listing API to surface floor, mid, grail tiers similar to Blur trait tabs.",
          },
          {
            title: "Dynamic traits",
            copy: "Update metadata post-mint via webhook events—great for progressive reveals or quests.",
          },
          {
            title: "Soulbound passes",
            copy: "Non-transferable membership NFTs for drop access, using marketplace checks to disable sell flow.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
            <h4 className="text-base font-semibold text-white">{item.title}</h4>
            <p className="mt-2 text-sm text-slate-300">{item.copy}</p>
          </div>
        ))}
      </div>
      <Info>
        Pair Basename handles with collection roles so collectors see branded usernames across mint, buy, and activity feeds.
      </Info>
    </section>
  );

  const ActivityPanel = (compact = false) => {
    const entries = compact ? mockActivity.slice(0, 4) : mockActivity;
    return (
      <section className="space-y-5 rounded-3xl border border-white/5 bg-slate-900/60 p-6">
        <header className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Live activity</h3>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
            Blur-style feed
          </span>
        </header>
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <div
              key={`${entry.action}-${index}`}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-slate-900 text-xs font-semibold text-slate-200">
                  {entry.action.slice(0, 1)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{entry.action}</p>
                  <p className="text-xs text-slate-400">{entry.user}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-emerald-300">{entry.value}</p>
                <p className="text-xs text-slate-400">{entry.when}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderPanel = () => {
    switch (activePanel) {
      case "overview":
        return (
          <div className="space-y-10">
            <IdentityHeader />
            <div className="grid gap-6 xl:grid-cols-2">
              {ListingPreview()}
            </div>
            {ActivityPanel(true)}
          </div>
        );
      case "list":
        return ListingPanel();
      case "buy":
        return BuyPanel();
      case "swap":
        return SwapPanel();
      case "types":
        return TypesPanel();
      case "activity":
        return ActivityPanel();
      default:
        return ListingPreview();
    }
  };

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <div className="flex-1 space-y-8 transition-all lg:pr-6 xl:pr-10">{renderPanel()}</div>
      <nav className="sticky top-6 flex w-full flex-wrap gap-3 self-start rounded-3xl border border-white/5 bg-slate-900/70 p-4 lg:w-64 lg:flex-col">
        {nftPanels.map((panel) => {
          const isActive = activePanel === panel.id;
          return (
            <button
              key={panel.id}
              type="button"
              onClick={() => setActivePanel(panel.id)}
              aria-pressed={isActive ? 'true' : 'false'}
              className={`flex flex-1 items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-400/40 lg:flex-none ${
                isActive
                  ? "border-white/30 bg-white/10 text-white shadow-lg shadow-slate-900/40"
                  : "border-white/10 bg-slate-950/70 text-slate-300 hover:border-white/20 hover:bg-slate-900/60 hover:text-white"
              }`}
            >
              <span>{panel.label}</span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-300"
                }`}
              >
                {panel.badge}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
