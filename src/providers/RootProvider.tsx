"use client";

import { ReactNode, useMemo, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  WagmiProvider,
  createConfig,
  createStorage,
  cookieStorage,
  http,
  useAccount,
} from "wagmi";
import { base, baseSepolia } from "viem/chains";
import { coinbaseWallet } from "wagmi/connectors";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
import { OnchainKitProvider } from "@coinbase/onchainkit";

// Lazy config creation to avoid SSR issues
let wagmiConfig: any = null;

const getWagmiConfig = () => {
  if (wagmiConfig) return wagmiConfig;
  
  const baseRpcUrl =
    process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://mainnet.base.org";
  const baseSepoliaRpcUrl =
    process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org";

  // Build connectors - Farcaster Mini App first for auto-detection, then Coinbase wallet
  const connectors = [
    farcasterMiniApp(),
    coinbaseWallet({
      appName: "farbase",
      version: "4",
    }),
  ];

  wagmiConfig = createConfig({
    chains: [base, baseSepolia],
    connectors,
    storage: createStorage({ storage: cookieStorage }),
    ssr: true,
    transports: {
      [base.id]: http(baseRpcUrl),
      [baseSepolia.id]: http(baseSepoliaRpcUrl),
    },
  });

  return wagmiConfig;
};

export function RootProvider({ children }: { children: ReactNode }) {
  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }), []);
  const config = useMemo(() => getWagmiConfig(), []);
  const [currentChain, setCurrentChain] = useState(base);

  // Validate API key on mount
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;
    if (!apiKey || apiKey === 'demo-key') {
      console.warn('⚠️ Using demo OnchainKit key. Get yours at: https://portal.cdp.coinbase.com/');
    }
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ChainDetector onChainChange={setCurrentChain} />
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || 'demo-key'}
          chain={currentChain}
          miniKit={{ enabled: true, autoConnect: true }}
          config={{
            appearance: {
              name: "farbase",
              mode: "dark",
              theme: "base",
            },
            wallet: {
              display: "modal",
              supportedWallets: {
                rabby: true,
                trust: true,
                frame: true,
              },
            },
          }}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// Sub-component to detect and report chain changes
function ChainDetector({ onChainChange }: { onChainChange: (chain: any) => void }) {
  const { chainId } = useAccount();

  useEffect(() => {
    if (chainId === 84532) {
      onChainChange(baseSepolia);
    } else {
      onChainChange(base);
    }
  }, [chainId, onChainChange]);

  return null;
}
