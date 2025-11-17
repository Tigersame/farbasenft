"use client";

import { ReactNode, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  WagmiProvider,
  createConfig,
  createStorage,
  cookieStorage,
  http,
} from "wagmi";
import { base, baseSepolia } from "viem/chains";
import { coinbaseWallet, metaMask } from "wagmi/connectors";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
import { OnchainKitProvider } from "@coinbase/onchainkit";

const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    farcasterMiniApp(),
        coinbaseWallet({
          appName: "farbasenft",
          version: "4",
        }),
    metaMask(),
  ],
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || undefined),
    [baseSepolia.id]: http(),
  },
});

export function RootProvider({ children }: { children: ReactNode }) {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          projectId={process.env.NEXT_PUBLIC_CDP_PROJECT_ID || process.env.NEXT_PUBLIC_COINBASE_PROJECT_ID}
          chain={base}
          miniKit={{ enabled: true, autoConnect: true }}
          config={{
            appearance: {
              name: "farbasenft",
              mode: "dark",
              theme: "base", // 'default' | 'base' | 'cyberpunk' | 'hacker'
            },
                wallet: {
                  display: "modal",
              termsUrl: process.env.NEXT_PUBLIC_TERMS_URL,
              privacyUrl: process.env.NEXT_PUBLIC_PRIVACY_URL,
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
