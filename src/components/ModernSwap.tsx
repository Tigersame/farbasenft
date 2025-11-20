"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import Image from "next/image";

interface Token {
  symbol: string;
  name: string;
  icon?: string;
  balance?: string;
}

const TOKENS: Token[] = [
  { symbol: "ETH", name: "Ethereum", balance: "0.0" },
  { symbol: "USDC", name: "USD Coin", balance: "0.0" },
  { symbol: "USDT", name: "Tether", balance: "0.0" },
  { symbol: "DAI", name: "Dai Stablecoin", balance: "0.0" },
];

export function ModernSwap() {
  const { address, isConnected } = useAccount();
  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [sellToken, setSellToken] = useState<Token>(TOKENS[0]);
  const [buyToken, setBuyToken] = useState<Token>(TOKENS[1]);
  const [showSellTokens, setShowSellTokens] = useState(false);
  const [showBuyTokens, setShowBuyTokens] = useState(false);

  const handleSwapTokens = () => {
    const temp = sellToken;
    setSellToken(buyToken);
    setBuyToken(temp);
    const tempAmount = sellAmount;
    setSellAmount(buyAmount);
    setBuyAmount(tempAmount);
  };

  const handleMaxClick = () => {
    setSellAmount(sellToken.balance || "0.0");
  };

  const handleSwap = () => {
    if (!sellAmount || parseFloat(sellAmount) === 0) return;
    // Add swap logic here
    console.log("Swapping:", sellAmount, sellToken.symbol, "for", buyToken.symbol);
  };

  const isSwapDisabled = !isConnected || !sellAmount || parseFloat(sellAmount) === 0;

  return (
    <div className="w-full max-w-md mx-auto bg-[#0a0f1e] rounded-2xl border border-slate-700/50 p-4 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Go back"
          title="Go back"
        >
          <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-white">Swap</h2>
        <button 
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Settings"
          title="Settings"
        >
          <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Sell Section */}
      <div className="bg-[#1a2332] rounded-xl p-4 mb-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Sell</span>
          <button 
            onClick={handleMaxClick}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Max
          </button>
        </div>
        <div className="flex items-center justify-between gap-3">
          <input
            type="text"
            value={sellAmount}
            onChange={(e) => setSellAmount(e.target.value)}
            placeholder="0.0"
            className="bg-transparent text-3xl text-white font-semibold outline-none flex-1 w-full"
          />
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-slate-500">~</span>
          <button
            onClick={() => setShowSellTokens(!showSellTokens)}
            className="flex items-center gap-2 hover:bg-slate-700/50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
              {sellToken.symbol.charAt(0)}
            </div>
            <span className="text-sm text-white font-medium">{sellToken.symbol}</span>
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Sell Token Dropdown */}
        {showSellTokens && (
          <div className="mt-2 border border-slate-700 rounded-lg bg-[#0a0f1e] p-2 space-y-1">
            {TOKENS.filter(t => t.symbol !== buyToken.symbol).map((token) => (
              <button
                key={token.symbol}
                onClick={() => {
                  setSellToken(token);
                  setShowSellTokens(false);
                }}
                className="w-full flex items-center gap-3 p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  {token.symbol.charAt(0)}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm text-white font-medium">{token.symbol}</div>
                  <div className="text-xs text-slate-500">{token.name}</div>
                </div>
                <div className="text-xs text-slate-400">{token.balance}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Swap Button */}
      <div className="flex justify-center -my-2 relative z-10">
        <button
          onClick={handleSwapTokens}
          className="bg-[#0a0f1e] border-2 border-slate-700 hover:border-slate-600 p-2 rounded-lg transition-colors"
          aria-label="Swap tokens"
          title="Swap tokens"
        >
          <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>
      </div>

      {/* Buy Section */}
      <div className="bg-[#1a2332] rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Buy</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <input
            type="text"
            value={buyAmount}
            onChange={(e) => setBuyAmount(e.target.value)}
            placeholder="0.0"
            className="bg-transparent text-3xl text-white font-semibold outline-none flex-1 w-full"
            readOnly
          />
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-slate-500">~</span>
          <button
            onClick={() => setShowBuyTokens(!showBuyTokens)}
            className="flex items-center gap-2 hover:bg-slate-700/50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
              {buyToken.symbol.charAt(0)}
            </div>
            <span className="text-sm text-white font-medium">{buyToken.symbol}</span>
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Buy Token Dropdown */}
        {showBuyTokens && (
          <div className="mt-2 border border-slate-700 rounded-lg bg-[#0a0f1e] p-2 space-y-1">
            {TOKENS.filter(t => t.symbol !== sellToken.symbol).map((token) => (
              <button
                key={token.symbol}
                onClick={() => {
                  setBuyToken(token);
                  setShowBuyTokens(false);
                }}
                className="w-full flex items-center gap-3 p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                  {token.symbol.charAt(0)}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm text-white font-medium">{token.symbol}</div>
                  <div className="text-xs text-slate-500">{token.name}</div>
                </div>
                <div className="text-xs text-slate-400">{token.balance}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Swap Action Button */}
      <button
        onClick={handleSwap}
        disabled={isSwapDisabled}
        className={`w-full py-4 rounded-xl font-semibold text-base transition-all ${
          isSwapDisabled
            ? "bg-blue-500/20 text-blue-300/50 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
        }`}
      >
        {!isConnected 
          ? "Connect Wallet" 
          : !sellAmount || parseFloat(sellAmount) === 0
          ? "Complete the fields to continue"
          : "Swap"
        }
      </button>

      {/* Info Text */}
      {!isConnected && (
        <p className="text-xs text-slate-500 text-center mt-3">
          Connect your wallet to start swapping
        </p>
      )}
    </div>
  );
}
