'use client';

import React, { useEffect } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import {
  base,
  baseSepolia,
  mainnet,
  sepolia,
} from 'wagmi/chains';
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors';

// Create wagmi config with proper error handling
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

// Component to suppress wallet extension conflict warnings
function WalletInitializer() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const originalWarn = console.warn;
      console.warn = (...args: any[]) => {
        const message = args[0]?.toString() || '';
        // Suppress wallet extension conflict warnings
        if (
          message.includes('ethereum') ||
          message.includes('wallet') ||
          message.includes('Ethereum provider')
        ) {
          return;
        }
        originalWarn(...args);
      };
    }
  }, []);
  return null;
}

export function WalletProvider({ children }: WalletProviderProps) {
  return (
    <WagmiProvider config={config}>
      <WalletInitializer />
      {children}
    </WagmiProvider>
  );
}
