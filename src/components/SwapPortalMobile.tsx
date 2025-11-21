"use client";

import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Avatar, Name } from '@coinbase/onchainkit/identity';

// SwapPortal_Mobile_MiniApp - Optimized for Farcaster Mini Apps (mobile-first)
// Single-file component with Tailwind CSS. Adapted to use Wagmi hooks.

interface Token {
  symbol: string;
  decimals: number;
  address?: string;
}

interface SwapPortalMobileProps {
  onOpenExternal?: (txHash: string) => void;
}

export default function SwapPortalMobile({ onOpenExternal }: SwapPortalMobileProps) {
  // --- Wallet state from Wagmi ---
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  // --- State ---
  const [fromToken, setFromToken] = useState<Token>({symbol: 'ETH', decimals: 18, address: ''});
  const [toToken, setToToken] = useState<Token>({symbol: 'USDC', decimals: 6, address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913'});
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [priceImpact, setPriceImpact] = useState<number | null>(null);
  const [slippage, setSlippage] = useState(0.5); // %
  const [deadline, setDeadline] = useState(20); // minutes
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- Effects / helpers ---
  useEffect(() => {
    // If fromAmount changes, fetch quote
    if (!fromAmount || isNaN(Number(fromAmount))) {
      setToAmount('');
      return;
    }
    let ignore = false;
    async function fetchQuote() {
      setLoadingQuote(true);
      try {
        // Placeholder: replace with real quote call to your router / aggregator
        const q = await fakeQuote(fromToken, toToken, fromAmount);
        if (!ignore) {
          setToAmount(q.amountOut);
          setPriceImpact(q.priceImpact);
        }
      } catch (e) {
        if (!ignore) setError('Quote failed');
      } finally {
        if (!ignore) setLoadingQuote(false);
      }
    }
    fetchQuote();
    return () => { ignore = true; };
  }, [fromAmount, fromToken, toToken]);

  // --- Wallet Connect (using Wagmi) ---
  const connectWallet = async () => {
    try {
      // Use first available connector (farcasterMiniApp, then coinbaseWallet)
      const connector = connectors[0];
      if (connector) {
        connect({ connector });
      }
    } catch (e) {
      setError('Failed to connect wallet');
    }
  };

  const disconnectWallet = () => disconnect();

  // --- Swap action ---
  const handleSwap = async () => {
    setError(null);
    if (!isConnected || !address) return setError('Connect your wallet first');
    if (!fromAmount || Number(fromAmount) <= 0) return setError('Enter amount');

    setConfirming(true);
    try {
      // optimistic UI: show pending state immediately
      const optimisticTx = { hash: '0xoptimistic', status: 'pending' };
      setTxHash(optimisticTx.hash);

      // performSwap should call your relayer / router (e.g., Uniswap router on Base chain)
      const receipt = await fakePerformSwap({
        fromToken,
        toToken,
        fromAmount,
        slippage,
        deadline,
        wallet: address,
      });

      // replace optimistic hash with actual
      setTxHash(receipt.txHash || null);
      setConfirming(false);
    } catch (e) {
      setError((e as Error).message || 'Swap failed');
      setConfirming(false);
      setTxHash(null);
    }
  };

  // --- Token selector modal simplified ---
  const swapTokens = () => {
    const tempFrom = fromToken;
    const tempFromAmount = fromAmount;
    setFromToken(toToken);
    setToToken(tempFrom);
    setFromAmount(toAmount);
    setToAmount(tempFromAmount);
  };

  // --- Small helpers for display ---
  const shortAddr = (addr: string) => addr ? addr.slice(0,6) + '…' + addr.slice(-4) : '';

  return (
    <div className="w-full min-h-screen bg-[#0b0f14] text-white p-4 sm:p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-sm font-bold">F</div>
          <div>
            <div className="text-sm opacity-80">Farbase Swap</div>
            <div className="text-xs opacity-60">Base chain — mobile mini app</div>
          </div>
        </div>
        <div>
          {!isConnected ? (
            <button onClick={connectWallet} className="px-3 py-1 rounded-lg bg-white text-black text-sm font-medium">Connect</button>
          ) : (
            <div className="flex items-center gap-2">
              <Avatar address={address as `0x${string}`} className="w-5 h-5" />
              <div className="text-xs opacity-80">
                <Name address={address as `0x${string}`} />
              </div>
              <button onClick={disconnectWallet} className="text-xs opacity-60">Disconnect</button>
            </div>
          )}
        </div>
      </div>

      {/* Card */}
      <div className="bg-[#0f1720] rounded-2xl p-4 shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="text-xs opacity-70">From</div>
          <div className="text-xs opacity-70">Balance: {isConnected ? '…' : '—'}</div>
        </div>

        <div className="flex items-center gap-3">
          <input
            inputMode="decimal"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            placeholder="0.0"
            className="flex-1 bg-transparent outline-none text-2xl font-semibold"
          />

          <div className="flex items-center gap-2 bg-[#0b1220] px-3 py-2 rounded-xl">
            <div className="text-sm font-semibold">{fromToken.symbol}</div>
            <button onClick={() => { /* open token selector */ }} className="text-xs opacity-60">▼</button>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button onClick={swapTokens} className="p-1 rounded-full bg-[#0b1220] text-xs">⇅</button>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs opacity-70">To</div>
          <div className="text-xs opacity-70">Estimated</div>
        </div>

        <div className="flex items-center gap-3">
          <input
            value={toAmount}
            readOnly
            placeholder="0.0"
            className="flex-1 bg-transparent outline-none text-2xl font-semibold opacity-80"
          />

          <div className="flex items-center gap-2 bg-[#0b1220] px-3 py-2 rounded-xl">
            <div className="text-sm font-semibold">{toToken.symbol}</div>
            <button onClick={() => { /* open token selector */ }} className="text-xs opacity-60">▼</button>
          </div>
        </div>

        {/* Quote / warnings */}
        <div className="flex flex-col gap-1 text-xs opacity-70">
          {loadingQuote ? <div>Fetching quote…</div> : (
            <>
              <div>Price impact: {priceImpact != null ? `${(priceImpact*100).toFixed(2)}%` : '—'}</div>
              <div>Slippage tolerance: {slippage}%</div>
            </>
          )}
          {error && <div className="text-red-400">{error}</div>}
        </div>

        <div className="flex gap-2">
          <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={slippage}
            onChange={(e) => setSlippage(Number(e.target.value))}
            className="w-full"
            aria-label="Slippage tolerance slider"
          />
        </div>

        <div className="flex gap-2">
          <button onClick={() => { setSlippage(0.5); }} className="flex-1 py-2 rounded-xl bg-[#111827] text-sm">0.5%</button>
          <button onClick={() => { setSlippage(1); }} className="flex-1 py-2 rounded-xl bg-[#111827] text-sm">1%</button>
          <button onClick={() => { setSlippage(3); }} className="flex-1 py-2 rounded-xl bg-[#111827] text-sm">3%</button>
        </div>

        <div>
          <button
            onClick={handleSwap}
            disabled={!fromAmount || confirming}
            className="w-full py-3 rounded-2xl text-sm font-semibold bg-linear-to-r from-indigo-500 to-pink-500 disabled:opacity-50"
          >
            {confirming ? 'Confirming…' : (isConnected ? 'Swap' : 'Connect Wallet to Swap')}
          </button>
        </div>

        {/* Tx / result */}
        {txHash && (
          <div className="text-xs opacity-80 mt-2">
            Tx: <button onClick={() => onOpenExternal && onOpenExternal(txHash)} className="underline">{shortAddr(txHash)}</button>
          </div>
        )}
      </div>

      {/* Footer notes */}
      <div className="text-xs opacity-60">
        Built for mobile mini-apps — lightweight, single-column flow. Replace fake RPC & quote functions with your onchain router (Uniswap-style) on Base chain.
      </div>
    </div>
  );
}

/* ----------------- Helper placeholders (replace in production) ----------------- */
async function fakeQuote(fromToken: Token, toToken: Token, fromAmount: string) {
  // simulate API latency
  await new Promise(r => setTimeout(r, 400));
  const amountOut = (Number(fromAmount) * 0.98).toFixed(6);
  return { amountOut, priceImpact: 0.0123 };
}

async function fakePerformSwap({ fromToken, toToken, fromAmount, slippage, deadline, wallet }: {
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  slippage: number;
  deadline: number;
  wallet: string;
}) {
  await new Promise(r => setTimeout(r, 1200));
  return { txHash: '0x1234567890abcdef1234567890abcdef' };
}
