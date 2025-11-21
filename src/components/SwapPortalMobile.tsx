"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { Avatar, Name } from '@coinbase/onchainkit/identity';

// Enhanced SwapPortal_Mobile_MiniApp
// - Wagmi wallet integration (Base chain)
// - 0x API quote wiring (chainId=8453 for Base)
// - Compact token selector modal
// - Mobile-first Tailwind CSS styling

interface Token {
  symbol: string;
  decimals: number;
  address: string;
  icon?: string;
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
  const [fromToken, setFromToken] = useState<Token>({symbol: 'ETH', decimals: 18, address: '0x0000000000000000000000000000000000000000'});
  const [toToken, setToToken] = useState<Token>({symbol: 'USDC', decimals: 6, address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913'});
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [priceImpact, setPriceImpact] = useState<number | null>(null);
  const [slippage, setSlippage] = useState(0.5); // %
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Token selector modal
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [selectingFor, setSelectingFor] = useState<'from' | 'to' | 'none'>('none');
  const [tokenSearchQuery, setTokenSearchQuery] = useState('');

  // Token list for Base chain - replace with TokenLists.org or onchain data in production
  const tokenList = useMemo(() => ([
    {symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', decimals: 18, icon: '\u{29E0}'},
    {symbol: 'USDC', address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', decimals: 6, icon: '\u{1F4B5}'},
    {symbol: 'WETH', address: '0x4200000000000000000000000000000000000006', decimals: 18, icon: '\u{29E0}'},
    {symbol: 'DAI', address: '0x50c5725949a6f0c72e6c4a641f24049a917db0cb', decimals: 18, icon: '\u{25C8}'},
    {symbol: 'DEGEN', address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed', decimals: 18, icon: '\u{1F3A9}'},
  ]), []);

  // Fetch balance for fromToken
  const { data: balanceData } = useBalance({
    address: address as `0x${string}` | undefined,
    token: fromToken.address === '0x0000000000000000000000000000000000000000' 
      ? undefined 
      : fromToken.address as `0x${string}`,
    chainId: 8453, // Base mainnet
  });

  // Filtered token list based on search
  const filteredTokens = useMemo(() => {
    if (!tokenSearchQuery) return tokenList;
    const query = tokenSearchQuery.toLowerCase();
    return tokenList.filter(tok => 
      tok.symbol.toLowerCase().includes(query) || 
      tok.address.toLowerCase().includes(query)
    );
  }, [tokenList, tokenSearchQuery]);

  // --- Quote / aggregator (0x API for Base chain) ---
  async function fetchQuoteZeroX(fromAddr: string, toAddr: string, amountDecimal: string) {
    setLoadingQuote(true);
    setError(null);
    try {
      // Convert to integer string based on decimals
      const amountInt = parseUnitsString(amountDecimal, fromToken.decimals || 18);

      // Build params for 0x API (Base chain = chainId 8453)
      const params = new URLSearchParams({
        buyToken: toAddr === '0x0000000000000000000000000000000000000000' ? 'ETH' : toAddr,
        sellToken: fromAddr === '0x0000000000000000000000000000000000000000' ? 'ETH' : fromAddr,
        sellAmount: amountInt,
        slippagePercentage: (slippage / 100).toString(),
      });
      
      // 0x API endpoint for Base chain
      const url = `https://base.api.0x.org/swap/v1/quote?${params.toString()}`;

      const res = await fetch(url);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.reason || 'Quote API failed');
      }
      const json = await res.json();

      // Extract numeric buyAmount and convert to decimal string
      const buyAmount = json.buyAmount || json.guaranteedPrice || null;
      const amountOutDecimal = buyAmount ? formatUnitsString(buyAmount, toToken.decimals || 18) : '';

      // Price impact heuristic (0x may not always surface this)
      const pi = json.estimatedPriceImpact ? parseFloat(json.estimatedPriceImpact) / 100 : null;

      setToAmount(amountOutDecimal);
      setPriceImpact(pi);
      setLoadingQuote(false);
      return json;
    } catch (e) {
      setLoadingQuote(false);
      setError((e as Error).message || 'Quote failed');
      setToAmount('');
      return null;
    }
  }

  // Auto-quote on input change (debounced)
  useEffect(() => {
    if (!fromAmount || isNaN(Number(fromAmount)) || Number(fromAmount) <= 0) {
      setToAmount('');
      setPriceImpact(null);
      setError(null);
      return;
    }
    const tid = setTimeout(() => {
      fetchQuoteZeroX(fromToken.address, toToken.address, fromAmount);
    }, 420);
    return () => clearTimeout(tid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromAmount, fromToken.address, toToken.address, fromToken.decimals, toToken.decimals, slippage]);

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
      // Get a 0x quote with takerAddress to get executable transaction data
      const amountInt = parseUnitsString(fromAmount, fromToken.decimals || 18);
      const params = new URLSearchParams({
        buyToken: toToken.address === '0x0000000000000000000000000000000000000000' ? 'ETH' : toToken.address,
        sellToken: fromToken.address === '0x0000000000000000000000000000000000000000' ? 'ETH' : fromToken.address,
        sellAmount: amountInt,
        slippagePercentage: (slippage / 100).toString(),
        takerAddress: address,
      });
      
      const url = `https://base.api.0x.org/swap/v1/quote?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to get quote');
      const quote = await res.json();

      // In production, use wallet signer to send transaction:
      // await wallet.signer.sendTransaction({
      //   to: quote.to,
      //   data: quote.data,
      //   value: quote.value || '0',
      // });

      // For demo: show optimistic UI then simulate completion
      setTxHash('0xoptimistic');
      await new Promise(r => setTimeout(r, 1200));
      setTxHash('0x1234567890abcdef1234567890abcdef');
      setConfirming(false);
    } catch (e) {
      setError((e as Error).message || 'Swap failed');
      setConfirming(false);
      setTxHash(null);
    }
  };

  // --- Token selector functions ---
  const openTokenSelector = (which: 'from' | 'to') => {
    setSelectingFor(which);
    setTokenModalOpen(true);
    setTokenSearchQuery('');
  };

  const pickToken = (tok: Token) => {
    if (selectingFor === 'from') setFromToken(tok);
    if (selectingFor === 'to') setToToken(tok);
    setTokenModalOpen(false);
    setSelectingFor('none');
  };

  // --- Token swap (flip from/to) ---
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
          <div className="text-xs opacity-70">
            Balance: {isConnected ? (
              balanceData ? (
                <span className="font-medium text-cyan-400">
                  {parseFloat(balanceData.formatted).toFixed(6)} {balanceData.symbol}
                </span>
              ) : (
                <span className="animate-pulse">Loading...</span>
              )
            ) : '—'}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            inputMode="decimal"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            placeholder="0.0"
            className="flex-1 bg-transparent outline-none text-2xl font-semibold"
          />

          <div className="flex items-center gap-2 bg-[#0b1220] px-3 py-2 rounded-xl cursor-pointer hover:bg-[#0f1720] transition-colors" onClick={() => openTokenSelector('from')}>
            <span className="text-lg" style={{fontFamily: 'system-ui, sans-serif'}}>{fromToken.icon || '○'}</span>
            <div className="text-sm font-semibold">{fromToken.symbol}</div>
            <span className="text-xs opacity-60">▼</span>
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

          <div className="flex items-center gap-2 bg-[#0b1220] px-3 py-2 rounded-xl cursor-pointer hover:bg-[#0f1720] transition-colors" onClick={() => openTokenSelector('to')}>
            <span className="text-lg" style={{fontFamily: 'system-ui, sans-serif'}}>{toToken.icon || '○'}</span>
            <div className="text-sm font-semibold">{toToken.symbol}</div>
            <span className="text-xs opacity-60">▼</span>
          </div>
        </div>

        {/* Quote / warnings */}
        <div className="flex flex-col gap-1 text-xs">
          {loadingQuote ? (
            <div className="opacity-70">Fetching quote…</div>
          ) : (
            <>
              <div className="opacity-70">Price impact: {priceImpact != null ? `${(priceImpact*100).toFixed(2)}%` : '—'}</div>
              <div className="opacity-70">Slippage tolerance: {slippage}%</div>
            </>
          )}
          {error && <div className="text-red-400 font-medium mt-1">⚠️ {error}</div>}
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
        Built for mobile mini-apps — lightweight, single-column flow. Integrated with 0x API for Base chain swaps.
      </div>

      {/* Token selector modal */}
      {tokenModalOpen && (
        <div className="fixed inset-0 z-40 flex items-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setTokenModalOpen(false)} />
          <div className="relative w-full bg-[#071018] rounded-t-2xl p-4 shadow-2xl max-h-[70vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold">Select token</div>
              <button onClick={() => setTokenModalOpen(false)} className="text-xs opacity-60">Close</button>
            </div>
            
            <div className="mb-2">
              <input
                autoFocus
                value={tokenSearchQuery}
                onChange={(e) => setTokenSearchQuery(e.target.value)}
                placeholder="Search token or paste address"
                className="w-full bg-[#0b1220] rounded-xl p-2 text-sm outline-none"
              />
            </div>

            <div className="flex-1 overflow-auto">
              {filteredTokens.map(tok => (
                <button
                  key={tok.address}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#071822] transition-colors"
                  onClick={() => pickToken(tok)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-base" style={{fontFamily: 'system-ui, sans-serif'}}>
                      {tok.icon || tok.symbol[0]}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium">{tok.symbol}</div>
                      <div className="text-xs opacity-60">{shortAddr(tok.address)}</div>
                    </div>
                  </div>
                  <div className="text-xs opacity-60">—</div>
                </button>
              ))}
              {filteredTokens.length === 0 && (
                <div className="text-center text-xs opacity-60 py-4">No tokens found</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------- Helper functions (replace with ethers.js utils in production) ----------------- */
function parseUnitsString(amountDecimal: string, decimals: number): string {
  const [whole, frac = ''] = (amountDecimal || '0').split('.');
  const padded = (whole + frac.padEnd(decimals, '0')).replace(/^0+(?=\d)/, '');
  return padded || '0';
}

function formatUnitsString(amountInt: string, decimals: number): string {
  if (!amountInt) return '0';
  const s = amountInt.toString().padStart(decimals + 1, '0');
  const i = s.slice(0, -decimals);
  const f = s.slice(-decimals).replace(/0+$/, '');
  return f ? `${i}.${f}` : `${i}`;
}
