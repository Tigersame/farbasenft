'use client';

import React from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import {
  base,
  baseSepolia,
  mainnet,
  sepolia,
} from 'wagmi/chains';
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors';

// Create wagmi config
export const config = createConfig({
  chains: [base, baseSepolia, mainnet, sepolia],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Farbase' }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
    }),
  ],
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  return (
    <WagmiProvider config={config}>
      {children}
    </WagmiProvider>
  );
}
