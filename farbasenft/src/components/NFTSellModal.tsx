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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Sell NFT</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* NFT Preview */}
          <div className="rounded-xl border border-slate-700 overflow-hidden bg-slate-800/50">
            <div className="relative h-48 w-full bg-slate-800">
              <Image
                src={nft.image}
                alt={nft.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold text-white">{nft.title}</p>
              <p className="text-xs text-slate-400">by {nft.artist}</p>
            </div>
          </div>

          {step === "details" && (
            <div className="space-y-4">
              {/* Listing Type */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Listing Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setListingType("fixed")}
                    className={`p-3 rounded-lg border transition ${
                      listingType === "fixed"
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                        : "border-slate-600 bg-slate-800/50 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    <p className="font-semibold text-sm">Fixed Price</p>
                    <p className="text-xs text-slate-400">Sell immediately</p>
                  </button>
                  <button
                    onClick={() => setListingType("auction")}
                    className={`p-3 rounded-lg border transition ${
                      listingType === "auction"
                        ? "border-blue-500 bg-blue-500/10 text-blue-300"
                        : "border-slate-600 bg-slate-800/50 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    <p className="font-semibold text-sm">Auction</p>
                    <p className="text-xs text-slate-400">Bidding system</p>
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Price (ETH)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-800 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 outline-none transition"
                />
                {price && (
                  <p className="text-xs text-slate-400">
                    ≈ ${(parseFloat(price) * 3500).toFixed(2)} USD (at $3,500/ETH)
                  </p>
                )}
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-800 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 outline-none transition"
                >
                  <option value="1">1 day</option>
                  <option value="3">3 days</option>
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                </select>
              </div>

              {/* Message */}
              {message && (
                <div className={`p-3 rounded-lg text-sm ${
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
            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Price</span>
                  <span className="text-white font-semibold">{price} ETH</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Duration</span>
                  <span className="text-white font-semibold">{duration} days</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Type</span>
                  <span className="text-white font-semibold capitalize">{listingType} Price</span>
                </div>
                <div className="pt-3 border-t border-slate-700 flex justify-between items-center">
                  <span className="text-slate-300">You will receive</span>
                  <span className="text-emerald-300 font-bold">
                    {price ? (parseFloat(price) * 0.975).toFixed(4) : "0"} ETH
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                2.5% platform fee applies. You'll receive the remaining amount after sale.
              </p>
            </div>
          )}

          {step === "confirm" && (
            <div className="text-center space-y-4">
              <div className="animate-spin">
                <svg className="w-8 h-8 text-emerald-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-slate-300">{message}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition disabled:opacity-50"
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
              className="flex-1 px-4 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : step === "details" ? "Review" : "List NFT"}
            </button>
          </Connected>
        </div>
      </div>
    </div>
  );
}
