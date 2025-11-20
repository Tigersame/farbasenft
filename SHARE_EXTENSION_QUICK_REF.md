# Share Extension Quick Reference

Quick reference for implementing Farcaster share extensions in farbasenft.

## Setup (3 Steps)

### 1. Add to Manifest
```typescript
// minikit.config.ts
castShareUrl: `${ROOT_URL}/share`
```

### 2. Create Hook
```typescript
// src/hooks/useCastShare.ts
const { isCastShare, params, cast } = useCastShare();
```

### 3. Create Page
```typescript
// src/app/share/page.tsx
export default function SharePage() {
  return <SharePageClient />;
}
```

## Data Access

### URL Parameters (Immediate)
```typescript
const params = parseCastShareParams(searchParams);
// params.castHash: string
// params.castFid: number
// params.viewerFid?: number
```

### SDK Context (Enriched)
```typescript
if (sdk.context.location.type === "cast_share") {
  const cast = sdk.context.location.cast;
  // cast.author: { fid, username, displayName, pfpUrl }
  // cast.text: string
  // cast.embeds: Array<{ url?: string }>
  // cast.channel: { id, name, imageUrl? }
}
```

## Common Patterns

### Display Cast Author
```typescript
<div className="flex items-center gap-3">
  {cast.author.pfpUrl ? (
    <img src={cast.author.pfpUrl} className="w-12 h-12 rounded-full" />
  ) : (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500">
      {cast.author.username?.[0]?.toUpperCase()}
    </div>
  )}
  <div>
    <p className="font-semibold">
      {cast.author.displayName || cast.author.username || `FID ${cast.author.fid}`}
    </p>
    <p className="text-sm text-slate-400">
      @{cast.author.username || cast.author.fid}
    </p>
  </div>
</div>
```

### Extract NFT References
```typescript
const nftIds = extractNFTsFromCast(cast);
// Returns: ["1", "42", "123"] - NFT IDs found in embeds

nftIds.forEach(id => {
  // Link to /nft/[id]
});
```

### Navigate Based on Cast
```typescript
// View author's NFTs
router.push(`/gallery?creator=${cast.author.fid}`);

// View specific NFT from cast
const nftIds = extractNFTsFromCast(cast);
if (nftIds.length > 0) {
  router.push(`/nft/${nftIds[0]}`);
}
```

### Format Cast Text
```typescript
const truncated = formatCastText(cast.text, 280);
// Adds "..." if text exceeds maxLength
```

## Testing URLs

### Development
```
http://localhost:3000/share?castHash=0x1234&castFid=12345&viewerFid=67890
```

### Production
```
https://y-six-dun.vercel.app/share?castHash=0xabcdef&castFid=99999
```

## Utilities

### parseCastShareParams()
```typescript
const params = parseCastShareParams(searchParams);
// Or from object:
const params = parseCastShareParams({ castHash: "0x123", castFid: "456" });
```

### isCastShareContext()
```typescript
if (isCastShareContext(sdk)) {
  // User opened via share sheet
}
```

### fetchCastData() (Optional)
```typescript
const cast = await fetchCastData(castHash);
// Requires NEYNAR_API_KEY
```

### extractNFTsFromCast()
```typescript
const nftIds = extractNFTsFromCast(cast);
// Finds NFT IDs in embeds matching your app domain
```

### formatCastText()
```typescript
const short = formatCastText(longText, 100);
// Truncates to maxLength, adds "..."
```

## File Checklist

- [x] `minikit.config.ts` - Add castShareUrl
- [x] `src/lib/castShare.ts` - Types and utilities
- [x] `src/hooks/useCastShare.ts` - React hook
- [x] `src/app/share/page.tsx` - Server component
- [x] `src/app/share/SharePageClient.tsx` - Client UI

## Environment Variables

```bash
# Required
NEXT_PUBLIC_APP_URL=https://y-six-dun.vercel.app

# Optional (for cast enrichment)
NEYNAR_API_KEY=your_key_here
```

## Production Testing

1. Deploy to Vercel
2. Verify manifest:
   ```
   https://y-six-dun.vercel.app/.well-known/farcaster.json
   ```
3. In Warpcast/Base app:
   - Open any cast
   - Tap share icon
   - Select "farbasenft"
   - Verify redirected to `/share`

## Key Points

✅ **Two data sources**: URL params (instant) + SDK context (enriched)  
✅ **SSR-safe**: URL params available during server render  
✅ **Graceful fallback**: Works even if SDK context missing  
✅ **Type-safe**: Full TypeScript support  
✅ **NFT extraction**: Automatically finds NFT references  
✅ **Contextual actions**: Navigate based on cast content  

## Links

- [Full Implementation Guide](./SHARE_EXTENSION_IMPLEMENTATION.md)
- [Official Docs](https://miniapps.farcaster.xyz/docs/guides/share-extension)
- [Universal Links Guide](./UNIVERSAL_LINKS_QUICK_REF.md)
