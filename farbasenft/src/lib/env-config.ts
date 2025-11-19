/**
 * Environment configuration with validation and warnings
 * Ensures all required environment variables are properly set
 */

export const envConfig = {
  // OnchainKit API Key (Required for Swap feature)
  onchainKitApiKey: process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || '',
  
  // Smart Contract Addresses
  sbtContractAddress: (process.env.NEXT_PUBLIC_SBT_CONTRACT_ADDRESS ||
    '0x4653cf1E6272D9f87C42ae6F441D7Fc546705C9f') as `0x${string}`,
  
  // RPC URLs
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.base.org',
  baseRpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org',
  baseSepolia: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
  
  // Minikit API Key
  minikitApiKey: process.env.NEXT_PUBLIC_MINIKIT_API_KEY || '',
  
  // WalletConnect Project ID
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
};

/**
 * Validate and warn about missing environment variables
 * Call this function early in app initialization
 */
export function validateEnvConfig() {
  if (typeof window === 'undefined') return; // Skip on server side
  
  const warnings: string[] = [];
  
  // Check required variables for production features
  if (!envConfig.onchainKitApiKey) {
    warnings.push(
      '⚠️ NEXT_PUBLIC_ONCHAINKIT_API_KEY is not set. Swap feature may not work. Get one at: https://portal.cdp.coinbase.com/'
    );
  }
  
  if (!envConfig.minikitApiKey) {
    warnings.push(
      '⚠️ NEXT_PUBLIC_MINIKIT_API_KEY is not set. Minikit features may be limited.'
    );
  }
  
  // Log warnings (only once)
  if (warnings.length > 0 && !window.__envWarningsLogged) {
    warnings.forEach(warning => console.warn(warning));
    window.__envWarningsLogged = true;
  }
}

// Extend Window type to track if we've logged warnings
declare global {
  interface Window {
    __envWarningsLogged?: boolean;
  }
}

// Auto-validate on import in browser
if (typeof window !== 'undefined') {
  // Delay validation to avoid hydration issues
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', validateEnvConfig);
  } else {
    setTimeout(validateEnvConfig, 100);
  }
}
