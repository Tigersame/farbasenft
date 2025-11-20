"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { Connected } from "@coinbase/onchainkit";
import Image from "next/image";

interface NFTSellModalProps {
  nft: any;
  onClose: () => void;
}

export function NFTSellModal({ nft, onClose }: NFTSellModalProps) {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("7"); // days
  const [listingType, setListingType] = useState<"fixed" | "auction">("fixed");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState<"details" | "review" | "confirm">("details");

  const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS as `0x${string}` | undefined;
  const sellFunction = process.env.NEXT_PUBLIC_MARKETPLACE_SELL_FUNCTION || "listToken";

  const handleList = async () => {
    if (!price || parseFloat(price) <= 0) {
      setMessage("Enter a valid price");
      return;
    }

    if (!marketplaceAddress) {
      setMessage("⚠️ Marketplace contract not configured. Set NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS");
      return;
    }

    try {
      setLoading(true);
      setMessage("Preparing listing...");
      setStep("confirm");

      // Call marketplace contract to list NFT
      const priceWei = parseEther(price);
      
      setMessage("Waiting for wallet confirmation...");
      
      // This assumes standard ERC721 marketplace pattern
      // Adjust based on your marketplace contract ABI
      const txHash = await writeContractAsync({
        address: marketplaceAddress,
        abi: [
          {
            name: sellFunction,
            type: "function",
            stateMutability: "nonpayable",
            inputs: [
              { name: "tokenId", type: "uint256" },
              { name: "price", type: "uint256" },
            ],
            outputs: [],
          },
        ],
        functionName: sellFunction,
        args: [BigInt(nft.id || 1), priceWei],
      });

      setMessage("✅ NFT listed successfully!");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Listing error:", error);
      setMessage(
        `Error: ${error instanceof Error ? error.message : "Failed to list NFT"}`
      );
      setStep("details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-700 max-w-md w-full shadow-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-900 flex items-center justify-between p-4 sm:p-6 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
            <h2 className="text-lg sm:text-xl font-bold text-white">List NFT for Sale</h2>
          </div>
          <button
            onClick={onClose}
            title="Close dialog"
            className="text-slate-400 hover:text-white transition p-1 min-h-11 min-w-11 flex items-center justify-center"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* NFT Preview */}
          <div className="rounded-lg sm:rounded-xl border border-slate-700 overflow-hidden bg-slate-800/50">
            <div className="relative h-40 sm:h-48 w-full bg-slate-800">
              <Image
                src={nft.image}
                alt={nft.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="p-3 sm:p-4">
              <p className="text-sm font-semibold text-white">{nft.title}</p>
              <p className="text-xs text-slate-400">{nft.artist}</p>
            </div>
          </div>

          {step === "details" && (
            <div className="space-y-3 sm:space-y-4">
              {/* Listing Type */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-300">Listing Type</label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button
                    onClick={() => setListingType("fixed")}
                    className={`p-2.5 sm:p-3 rounded-lg border transition min-h-11 ${
                      listingType === "fixed"
                        ? "border-purple-500 bg-purple-500/10 text-purple-300"
                        : "border-slate-600 bg-slate-800/50 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    <p className="font-semibold text-xs sm:text-sm">Fixed Price</p>
                    <p className="text-[10px] sm:text-xs text-slate-400">Set a buy now price</p>
                  </button>
                  <button
                    onClick={() => setListingType("auction")}
                    className={`p-2.5 sm:p-3 rounded-lg border transition min-h-11 ${
                      listingType === "auction"
                        ? "border-blue-500 bg-blue-500/10 text-blue-300"
                        : "border-slate-600 bg-slate-800/50 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    <p className="font-semibold text-xs sm:text-sm">Auction</p>
                    <p className="text-[10px] sm:text-xs text-slate-400">Accept bids</p>
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-300">Sale Price</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-16 rounded-lg border border-slate-600 bg-slate-800 text-white text-sm placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none transition"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <select 
                      title="Select currency"
                      className="bg-transparent text-purple-400 font-semibold text-xs sm:text-sm border-none outline-none cursor-pointer"
                    >
                      <option>ETH</option>
                    </select>
                  </div>
                </div>
                {price && (
                  <p className="text-[10px] sm:text-xs text-slate-400">
                    ≈ ${(parseFloat(price) * 3500).toFixed(2)} USD
                  </p>
                )}
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-300">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  aria-label="Select listing duration"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-slate-600 bg-slate-800 text-white text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none transition"
                >
                  <option value="1">1 day</option>
                  <option value="3">3 days</option>
                  <option value="7">7 Days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                </select>
              </div>

              {/* Summary Box */}
              <div className="rounded-lg border border-white/5 bg-slate-800/50 p-3 sm:p-4 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-slate-400">Listing type:</span>
                  <span className="text-white font-semibold capitalize">{listingType}</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-slate-400">Duration:</span>
                  <span className="text-white font-semibold">{duration} days</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-slate-400">Platform fee (2.5%):</span>
                  <span className="text-white font-semibold">{price ? (parseFloat(price) * 0.025).toFixed(4) : "0.00"} ETH</span>
                </div>
                <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                  <span className="text-white font-semibold text-xs sm:text-sm">You'll receive:</span>
                  <span className="text-emerald-300 font-bold text-sm sm:text-base">
                    {price ? (parseFloat(price) * 0.975).toFixed(4) : "0.00"} ETH
                  </span>
                </div>
              </div>

              {/* Message */}
              {message && (
                <div className={`p-2.5 sm:p-3 rounded-lg text-xs sm:text-sm ${
                  message.includes("Error") || message.includes("⚠️")
                    ? "bg-red-500/10 border border-red-500/30 text-red-300"
                    : "bg-blue-500/10 border border-blue-500/30 text-blue-300"
                }`}>
                  {message}
                </div>
              )}
            </div>
          )}

          {step === "review" && (
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4 space-y-2.5 sm:space-y-3">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-slate-400">Price</span>
                  <span className="text-white font-semibold">{price} ETH</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-slate-400">Duration</span>
                  <span className="text-white font-semibold">{duration} days</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-slate-400">Type</span>
                  <span className="text-white font-semibold capitalize">{listingType} Price</span>
                </div>
                <div className="pt-2 sm:pt-3 border-t border-slate-700 flex justify-between items-center">
                  <span className="text-slate-300 text-xs sm:text-sm">You will receive</span>
                  <span className="text-emerald-300 font-bold text-sm sm:text-base">
                    {price ? (parseFloat(price) * 0.975).toFixed(4) : "0"} ETH
                  </span>
                </div>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed">
                2.5% platform fee applies. You'll receive the remaining amount after sale.
              </p>
            </div>
          )}

          {step === "confirm" && (
            <div className="text-center space-y-3 sm:space-y-4 py-4">
              <div className="animate-spin">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-purple-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">{message}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900 p-3 sm:p-6 border-t border-slate-700 flex gap-2 sm:gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 min-h-11 rounded-lg border border-slate-600 text-slate-300 font-medium text-sm hover:bg-slate-800 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <Connected>
            <button
              onClick={() => {
                if (step === "details") {
                  setStep("review");
                } else if (step === "review") {
                  handleList();
                }
              }}
              disabled={loading || !price}
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 min-h-11 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : step === "details" ? "Continue" : "Complete Listing"}
            </button>
          </Connected>
        </div>
      </div>
    </div>
  );
}
