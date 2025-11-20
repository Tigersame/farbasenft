# Wallet Integration Guide

## Overview
farbasenft implements proper Farcaster Mini App wallet integration following the official guidelines at https://miniapps.farcaster.xyz/docs/guides/wallets

## Architecture

### Connector Configuration
Located in: `src/providers/RootProvider.tsx`

```typescript
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";

const connectors = [
  farcasterMiniApp(), // MUST be first for auto-detection
  coinbaseWallet({ appName: "farbase", version: "4" }),
];
```

**Critical**: `farcasterMiniApp()` must be first in the array for proper auto-detection in Farcaster context.

### Auto-Connect Logic
Located in: `src/components/WalletControls.tsx`

```typescript
useEffect(() => {
  if (!isConnected && connectors.length > 0) {
    const isFarcaster = 
      window.location.href.includes('warpcast.com') || 
      window.location.href.includes('farcaster.xyz');
    
    if (isFarcaster) {
      const farcasterConnector = connectors.find(
        c => c.id === 'farcasterMiniApp'
      );
      if (farcasterConnector) {
        connect({ connector: farcasterConnector });
      }
    }
  }
}, [isConnected, connectors, connect]);
```

This automatically connects the user's wallet when inside Farcaster, removing friction.

## Transaction Patterns

### Simple Transactions
Use `useSendTransaction` from Wagmi for basic ETH transfers:

```typescript
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";

const { sendTransaction, data: hash } = useSendTransaction();
const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

// Send ETH
sendTransaction({
  to: "0x...",
  value: parseEther("0.01"),
});
```

### Contract Interactions
For NFT minting, buying, selling:

```typescript
import { useWriteContract } from "wagmi";

const { writeContract, isPending } = useWriteContract();

// Mint NFT
writeContract({
  address: NFT_CONTRACT_ADDRESS,
  abi: FarbaseNFTABI,
  functionName: "mintNFT",
  args: [tokenURI],
  value: parseEther("0.001"),
});
```

### Batch Transactions (Future Enhancement)
EIP-5792 support for approve+swap in single confirmation:

```typescript
import { useSendCalls } from "wagmi";
import { encodeFunctionData } from "viem";

const { sendCalls } = useSendCalls();

// Approve token and swap in one confirmation
sendCalls({
  calls: [
    {
      to: TOKEN_ADDRESS,
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: [SPENDER_ADDRESS, amount],
      }),
    },
    {
      to: SWAP_CONTRACT_ADDRESS,
      data: encodeFunctionData({
        abi: swapAbi,
        functionName: "swap",
        args: [tokenIn, tokenOut, amount],
      }),
    },
  ],
});
```

**Note**: Batch transactions not yet implemented but documented for future use.

## Components

### WalletConnection
`src/components/WalletInteraction.tsx`

Visual component showing connection status with:
- Green success state when connected
- Address display (toggleable)
- Simple connect button
- Loading states

### SendTransactionExample
`src/components/WalletInteraction.tsx`

Demonstrates:
- Input validation
- Transaction submission
- Hash display
- Success/error states
- Proper loading indicators

### Demo Page
`src/app/wallet-demo/page.tsx`

Full example page showing:
1. Wallet connection flow
2. Transaction sending
3. Implementation notes
4. External resources

## Best Practices

### 1. Context Detection
Always check if you're in Farcaster context before assuming Mini App features:

```typescript
const isFarcaster = 
  window.location.href.includes('warpcast.com') || 
  window.location.href.includes('farcaster.xyz');
```

### 2. Connector Priority
Order matters in connectors array:
1. `farcasterMiniApp()` - First for Farcaster users
2. `coinbaseWallet()` - Fallback for web users
3. Other connectors as needed

### 3. Loading States
Always show clear feedback:
- "Confirming..." - User approving in wallet
- "Processing..." - Transaction mining
- "Success!" - Transaction confirmed
- Error messages with details

### 4. Mobile Optimization
- Touch targets ≥44px height
- Large text for readability
- Clear status indicators
- Responsive layouts

### 5. Error Handling
```typescript
{error && (
  <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
    <p className="text-sm text-red-200">{error.message}</p>
  </div>
)}
```

## XP Integration
All transactions can award XP:

```typescript
import { useXP } from "@/hooks/useXP";

const { addXP } = useXP();

// After successful transaction
if (isSuccess) {
  await addXP("NFT_BUY", { 
    tokenId: nft.id,
    price: nft.price 
  });
}
```

Available actions:
- `DAILY_LOGIN` - 50 XP
- `SWAP` - 20 XP
- `NFT_CREATE` - 100 XP
- `NFT_BUY` - 75 XP
- `NFT_SELL` - 50 XP
- `SBT_CLAIM` - 1000 XP

## Testing

### In Farcaster
1. Deploy to Vercel
2. Open in Warpcast: `https://warpcast.com/~/composer?embeds[]=YOUR_APP_URL`
3. Wallet should auto-connect
4. Test transactions

### In Browser
1. Run `npm run dev`
2. Visit `http://localhost:3000/wallet-demo`
3. Connect wallet manually
4. Test transactions

## Environment Variables
Required:
```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key
NEXT_PUBLIC_APP_URL=https://y-six-dun.vercel.app
```

## Resources

### Official Documentation
- [Farcaster Wallet Guide](https://miniapps.farcaster.xyz/docs/guides/wallets)
- [Wagmi Documentation](https://wagmi.sh)
- [OnchainKit Docs](https://onchainkit.xyz)

### Related Files
- `src/providers/RootProvider.tsx` - Wagmi configuration
- `src/components/WalletControls.tsx` - Auto-connect logic
- `src/components/WalletInteraction.tsx` - Example components
- `src/app/wallet-demo/page.tsx` - Demo page
- `src/hooks/useXP.ts` - XP rewards system

### Standards
- [EIP-5792: Wallet Call API](https://eips.ethereum.org/EIPS/eip-5792)
- [EIP-1193: Ethereum Provider API](https://eips.ethereum.org/EIPS/eip-1193)

## Troubleshooting

### Wallet Not Auto-Connecting
1. Check connector order in `RootProvider.tsx`
2. Verify `farcasterMiniApp()` imported correctly
3. Check browser console for errors
4. Confirm OnchainKit `miniKit.autoConnect: true`

### Transactions Failing
1. Check user has sufficient ETH
2. Verify contract addresses correct
3. Check gas limits not too low
4. Review transaction parameters

### Connector Not Found
1. Install: `npm install @farcaster/miniapp-wagmi-connector`
2. Import: `import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector"`
3. Restart dev server

## Status

✅ **Implemented:**
- farcasterMiniApp connector configuration
- Auto-connect logic
- Simple transactions
- Contract interactions
- Demo components
- XP integration
- Error handling
- Loading states

⏳ **Future Enhancements:**
- Batch transactions (useSendCalls)
- Sign message examples
- Multi-chain support
- Advanced error recovery
