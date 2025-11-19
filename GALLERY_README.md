# FarbaseMint NFT Gallery

## Overview
Advanced virtualized NFT gallery with optimistic UI updates, SWR data fetching, and Farcaster Mini App integration.

## Features
- **Virtual Scrolling**: Efficient rendering of large NFT collections using `@tanstack/react-virtual`
- **SWR Data Fetching**: Optimized caching and revalidation for NFT metadata
- **Optimistic UI**: Instant feedback for like interactions
- **Tab Navigation**: Filter by Live, Trending, Hot, New
- **IPFS Support**: Proxy IPFS images through configurable CDN
- **Farcaster Integration**: Ready for Farcaster Mini App SDK

## Installation
Dependencies are already installed:
```bash
npm install swr @tanstack/react-virtual
```

## Files Created
1. **Component**: `src/components/FarbaseMintGallery.tsx`
   - Main gallery component with virtual scrolling
   - Optimistic like updates
   - Responsive 2-column grid

2. **API Routes**:
   - `src/app/api/nfts/route.ts` - Fetch NFT data by tab
   - `src/app/api/nfts/like/route.ts` - Handle like interactions

3. **Page**: `src/app/gallery/page.tsx`
   - Dedicated gallery route at `/gallery`

## Environment Variables
Added to `.env.local`:
```env
NEXT_PUBLIC_IMAGE_CDN=https://ipfs.io/ipfs
NEXT_PUBLIC_METADATA_PROXY=https://cloudflare-ipfs.com/ipfs
```

## Usage

### Access the Gallery
- **Sidebar**: Click "FarbaseMint Gallery" in the sidebar
- **Direct URL**: Navigate to `/gallery`

### Customization

#### Update IPFS Gateway
Edit `.env.local`:
```env
NEXT_PUBLIC_IMAGE_CDN=https://your-ipfs-gateway.com/ipfs
```

#### Add Real Data
Replace mock data in `src/app/api/nfts/route.ts` with database queries:

```typescript
// Example with Prisma
const nfts = await prisma.nft.findMany({
  where: { category: tab },
  orderBy: { likes: 'desc' },
});
```

#### Customize Tabs
Modify tab types in `FarbaseMintGallery.tsx`:

```typescript
type TabType = 'live' | 'trending' | 'hot' | 'new' | 'custom';
```

## Architecture

### Virtual Scrolling
- Renders only visible items for performance
- 2-column grid with ~400px estimated row height
- Overscan of 3 rows for smooth scrolling

### Optimistic UI Pattern
```typescript
// Immediate UI update
setOptimisticLikes(prev => ({ ...prev, [itemId]: newLikes }));

// API call + revalidation
await fetch('/api/nfts/like', { ... });
mutate();

// Rollback on error
catch { /* restore previous state */ }
```

### SWR Configuration
```typescript
useSWR('/api/nfts?tab=trending', fetcher, {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 5000,
});
```

## Integration

### Mint Flow
Clicking "Mint Now" redirects to `/mint?id={itemId}`. Integrate with your minting contract:

```typescript
const handleMint = async (itemId: string) => {
  // Call your contract
  const contract = new Contract(address, abi, signer);
  await contract.mint(itemId);
};
```

### Farcaster Mini App
Component checks `useMiniAppContext()` for SDK readiness:

```typescript
if (isReady) {
  await sdk.actions.ready();
}
```

## Performance
- **Initial Load**: Only renders visible rows
- **Scroll**: Overscan ensures smooth experience
- **Data Fetching**: SWR caches responses, reduces API calls
- **Optimistic Updates**: Instant UI feedback

## Next Steps
1. Connect to real NFT contract
2. Implement backend database for likes
3. Add filters (price, creator, rarity)
4. Implement search functionality
5. Add wallet-based features (owned NFTs, bids)

## Troubleshooting

### Images not loading
- Check `NEXT_PUBLIC_IMAGE_CDN` configuration
- Verify IPFS URLs are properly formatted
- Try alternative gateways (cloudflare-ipfs.com, pinata.cloud)

### Virtual scrolling issues
- Adjust `estimateSize` if items have different heights
- Increase `overscan` for smoother scrolling
- Check `parentRef` is attached to scrollable container

### SWR not updating
- Check API endpoint returns correct format: `{ items: [...] }`
- Verify `dedupingInterval` isn't too long
- Call `mutate()` manually to force revalidation
