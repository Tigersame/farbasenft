# Wallet Integration with Base Name Services

## Overview

This wallet integration provides a professional, user-friendly interface for connecting to Web3 wallets with Base name services support. It includes:

- **Connect Wallet Modal**: Beautiful, responsive modal with wallet options
- **Multi-Wallet Support**: MetaMask, Coinbase Wallet, and WalletConnect
- **Base Name Resolution**: Automatically resolve and display user's Base domain name
- **Wallet Balance Display**: Show ETH, USDC, and other token balances
- **Avatar Support**: Display user avatars from Base name services
- **Base L2 Optimization**: Configured for Base blockchain RPC endpoints

## Components

### 1. `WalletIntegration.tsx`

Main component that provides connect/disconnect functionality with Base name resolution.

**Features:**
- Connect/Disconnect button states
- Modal with available wallet connectors
- Automatic Base name resolution
- ENS fallback support
- Loading states for name resolution
- Responsive design with glass morphism effects

**Usage:**
```tsx
import { WalletIntegration } from '@/components/WalletIntegration';

export function MyComponent() {
  return <WalletIntegration />;
}
```

**Connected State Display:**
- Shows connected wallet address/name
- Displays Base domain name if available
- Shows avatar from Base name service
- Disconnect button for easy logout

### 2. `WalletBalance.tsx`

Display wallet token balances and portfolio value.

**Features:**
- Fetches balances from `/api/wallet/balances` endpoint
- Shows total portfolio value in USD
- Individual token balances with USD conversion
- Loading skeleton animation
- Responsive grid layout

**Usage:**
```tsx
import { WalletBalance } from '@/components/WalletBalance';

export function Dashboard() {
  return <WalletBalance />;
}
```

**Displayed Information:**
- Total portfolio USD value
- Individual asset balances:
  - ETH
  - USDC
  - DEGEN
  - Other tokens

### 3. `WalletPanel.tsx`

Composite component combining wallet connection and balance display.

**Usage:**
```tsx
import { WalletPanel } from '@/components/WalletPanel';

export default function Page() {
  return <WalletPanel />;
}
```

## API Endpoints

### GET `/api/wallet/basename`

Resolve Base name information for an address.

**Query Parameters:**
- `address` (required): Ethereum address (0x...)

**Response:**
```json
{
  "name": "user.base",
  "address": "0x...",
  "avatar": "https://...",
  "bio": "NFT collector and Base enthusiast"
}
```

**Example:**
```bash
curl "http://localhost:3000/api/wallet/basename?address=0x742d35Cc6634C0532925a3b844Bc9e7595f42438"
```

### GET `/api/wallet/balances`

Get wallet token balances for an address.

**Query Parameters:**
- `address` (required): Ethereum address (0x...)

**Response:**
```json
{
  "address": "0x...",
  "chain": "base",
  "totalUsd": "6750.00",
  "balances": [
    {
      "token": "ethereum",
      "symbol": "ETH",
      "balance": "2.5",
      "usdValue": "5000.00",
      "decimals": 18
    },
    {
      "token": "usdc",
      "symbol": "USDC",
      "balance": "1500.00",
      "usdValue": "1500.00",
      "decimals": 6
    },
    {
      "token": "degen",
      "symbol": "DEGEN",
      "balance": "5000.00",
      "usdValue": "250.00",
      "decimals": 18
    }
  ]
}
```

## Setup & Configuration

### 1. Install Dependencies

```bash
npm install wagmi viem @tanstack/react-query
```

### 2. Environment Variables

Add to `.env.local`:

```env
# Base RPC Endpoints
NEXT_PUBLIC_BASE_RPC_URL=https://api.developer.coinbase.com/rpc/v1/base/YOUR_API_KEY
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://api.developer.coinbase.com/rpc/v1/base-sepolia/YOUR_API_KEY

# WalletConnect (Optional)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### 3. Wrap Application with Provider

Update your root layout (`src/app/layout.tsx`):

```tsx
'use client';

import { WalletProvider } from '@/providers/WalletProvider';
import { RootProvider } from '@/providers/RootProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <RootProvider>
            {children}
          </RootProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
```

## Supported Wallets

1. **MetaMask** - Browser extension, mobile app
2. **Coinbase Wallet** - Coinbase's official wallet
3. **WalletConnect** - Multi-chain wallet connection protocol

## Base Name Services Integration

### What are Base Names?

Base Names (formerly Basenames) are human-readable identities on the Base network. Instead of long hex addresses, users can have names like `vitalik.base`.

### Features

- **Name Resolution**: Automatically resolve addresses to Base names
- **Avatar Support**: Display custom avatars associated with Base names
- **Bio Display**: Show user bio information
- **Fallback**: If no Base name exists, falls back to ENS or address abbreviation

### API Integration

The `basename` API endpoint (`/api/wallet/basename`) handles name resolution:

```typescript
// Frontend
const response = await fetch(`/api/wallet/basename?address=${address}`);
const { name, avatar, bio } = await response.json();

// Display to user
<div>
  <img src={avatar} alt={name} />
  <p>{name}</p>
  <p>{bio}</p>
</div>
```

## Advanced Usage

### Custom Styling

Modify Tailwind classes in components to match your theme:

```tsx
// WalletIntegration.tsx - Change button gradient
className="bg-linear-to-r from-blue-500 to-purple-500"

// WalletBalance.tsx - Change border color
className="border border-blue-500/30"
```

### Extending with Additional Chains

Update `src/providers/WalletProvider.tsx`:

```typescript
import { arbitrum, optimism } from 'wagmi/chains';

export const config = createConfig({
  chains: [base, baseSepolia, mainnet, sepolia, arbitrum, optimism],
  // ... rest of config
});
```

### Adding Custom Wallet Connectors

```typescript
import { CustomConnector } from 'wagmi/connectors';

const customConnector = new CustomConnector({
  // configuration
});

export const config = createConfig({
  connectors: [
    // ... existing connectors
    customConnector,
  ],
});
```

## Mock Data

For development, the API endpoints return mock data:

**Basenames:**
- Returns a generic `user.base` name with DiceBear avatar

**Balances:**
- ETH: 2.5 (≈$5000)
- USDC: 1500 (≈$1500)
- DEGEN: 5000 (≈$250)

### Replacing with Real Data

1. **For Base Names**: Integrate with actual Base Name Service API
   ```typescript
   // /api/wallet/basename
   const response = await fetch(`https://basenames-api.example.com/resolve/${address}`);
   ```

2. **For Balances**: Use Alchemy or The Graph
   ```typescript
   // /api/wallet/balances
   const alchemy = new Alchemy({
     apiKey: process.env.ALCHEMY_API_KEY,
     network: Network.BASE_MAINNET,
   });
   const balances = await alchemy.core.getTokenBalances(address);
   ```

## Error Handling

All endpoints include error handling:

```json
{
  "error": "Invalid Ethereum address",
  "message": "Address must be 0x followed by 40 hex characters"
}
```

## Performance Optimization

- **Caching**: Balances cache for 60 seconds to reduce API calls
- **Virtual Scrolling**: For large token lists (future enhancement)
- **Lazy Loading**: Components load on demand

## Security Considerations

- ✅ Address validation on all endpoints
- ✅ No private keys handled in frontend
- ✅ All wallet operations use wagmi best practices
- ✅ HTTPS for all external API calls
- ✅ No sensitive data stored in localStorage

## Troubleshooting

### Wallet Won't Connect

1. Ensure wallet extension is installed
2. Check browser console for MetaMask errors
3. Verify RPC endpoints are correct in `.env.local`

### Base Names Not Resolving

1. Check address format (must be 0x...)
2. Ensure Base name exists for address
3. Check network connectivity to name service API

### Balance Display Shows "No assets"

1. Ensure address has funds on Base network
2. Verify RPC endpoint is working
3. Check API response in Network tab

## Future Enhancements

- [ ] Real Base Name Service integration
- [ ] Token swap within wallet UI
- [ ] Transaction history display
- [ ] NFT gallery integration
- [ ] Advanced portfolio analytics
- [ ] Multi-signature wallet support
- [ ] Hardware wallet integration (Ledger, Trezor)

## Related Components

- `Dashboard.tsx` - Analytics dashboard (integrates with wallet balances)
- `UserProfile.tsx` - User profile display (uses wallet info)
- `NFTActions.tsx` - NFT operations (requires wallet)
- `SidebarWithStore.tsx` - Navigation menu (shows wallet status)

## Contributing

To enhance the wallet integration:

1. Update `src/components/WalletIntegration.tsx` for UI changes
2. Update `src/app/api/wallet/*` endpoints for API changes
3. Update `src/providers/WalletProvider.tsx` for config changes
4. Test across MetaMask, Coinbase, and WalletConnect
5. Verify Base network functionality

## References

- [Wagmi Documentation](https://wagmi.sh)
- [Base Documentation](https://docs.base.org)
- [Base Names (Basenames)](https://www.basenames.eth.limo)
- [Coinbase OnchainKit](https://onchainkit.or.xyz)
- [WalletConnect](https://walletconnect.com)
