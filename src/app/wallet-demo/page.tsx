import { WalletConnection, SendTransactionExample } from "@/components/WalletInteraction";
import Link from "next/link";

/**
 * Wallet Demo Page
 * 
 * Demonstrates Farcaster Mini App wallet integration following official guidelines:
 * https://miniapps.farcaster.xyz/docs/guides/wallets
 * 
 * Features:
 * - Auto-connects to user's wallet in Farcaster context
 * - Simple transaction sending
 * - Proper error handling and loading states
 * - Mobile-optimized UI
 */
export default function WalletDemoPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Wallet Demo</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Farcaster Mini App wallet integration
              </p>
            </div>
            <Link
              href="/"
              className="text-sm text-cyan-400 hover:text-cyan-300 transition"
            >
              ← Back
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="space-y-6">
          {/* Info Banner */}
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-blue-200">
                  Farcaster Wallet Integration
                </p>
                <p className="text-xs text-blue-300/80 leading-relaxed">
                  In Farcaster Mini Apps, the wallet is automatically connected. No need for
                  wallet selection dialogs - just connect and start transacting!
                </p>
              </div>
            </div>
          </div>

          {/* Wallet Connection Section */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
            <h2 className="text-lg font-bold text-white mb-4">
              1. Connect Your Wallet
            </h2>
            <WalletConnection />
          </div>

          {/* Transaction Section */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white">
                2. Send a Transaction
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Simple ETH transfer to any address
              </p>
            </div>
            <SendTransactionExample />
          </div>

          {/* Implementation Notes */}
          <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
            <h3 className="text-sm font-bold text-white mb-3">
              Implementation Notes
            </h3>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <span className="text-cyan-400">✓</span>
                <span>
                  <span className="font-semibold">Auto-connect:</span> Wallet automatically connects in Farcaster context via <code className="text-cyan-400 bg-slate-800 px-1 py-0.5 rounded">useEffect</code> in WalletControls
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400">✓</span>
                <span>
                  <span className="font-semibold">Connector priority:</span> <code className="text-cyan-400 bg-slate-800 px-1 py-0.5 rounded">farcasterMiniApp()</code> is first in connectors array
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400">✓</span>
                <span>
                  <span className="font-semibold">Transaction hooks:</span> Using <code className="text-cyan-400 bg-slate-800 px-1 py-0.5 rounded">useSendTransaction</code> and <code className="text-cyan-400 bg-slate-800 px-1 py-0.5 rounded">useWaitForTransactionReceipt</code> from Wagmi
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-400">⚠</span>
                <span>
                  <span className="font-semibold">Batch transactions:</span> EIP-5792 <code className="text-cyan-400 bg-slate-800 px-1 py-0.5 rounded">useSendCalls</code> available for approve+swap in single confirmation (not yet implemented)
                </span>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
            <h3 className="text-sm font-bold text-white mb-3">
              Resources
            </h3>
            <div className="space-y-2">
              <a
                href="https://miniapps.farcaster.xyz/docs/guides/wallets"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-cyan-400 hover:text-cyan-300 transition"
              >
                → Farcaster Wallet Guide
              </a>
              <a
                href="https://wagmi.sh/react/hooks/useSendTransaction"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-cyan-400 hover:text-cyan-300 transition"
              >
                → Wagmi useSendTransaction
              </a>
              <a
                href="https://eips.ethereum.org/EIPS/eip-5792"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-cyan-400 hover:text-cyan-300 transition"
              >
                → EIP-5792 Batch Transactions
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
