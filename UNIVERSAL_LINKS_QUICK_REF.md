# Universal Links Quick Reference

Quick reference for generating and using Farcaster Universal Links in farbasenft.

## 📚 Full Documentation
See [UNIVERSAL_LINKS_IMPLEMENTATION.md](./UNIVERSAL_LINKS_IMPLEMENTATION.md) for complete implementation guide.

## 🎯 What are Universal Links?

Canonical URLs that open your Mini App with deep linking:
```
https://farcaster.xyz/miniapps/<app-id>/<app-slug>/<path>?<params>
```

**Example**:
```
https://farcaster.xyz/miniapps/12345/farbasenft/nft/abc123?view=detail
```

Opens: `https://y-six-dun.vercel.app/nft/abc123?view=detail`

## 🚀 Quick Start

### 1. Get Your App ID

**From Developers Page**:
1. Go to https://farcaster.xyz/~/developers
2. Find your app → Click ⋮ menu
3. Select "Copy link to mini app"
4. Extract ID from URL: `https://farcaster.xyz/miniapps/12345/...`

**Add to Environment**:
```bash
NEXT_PUBLIC_FARCASTER_APP_ID=12345
```

### 2. Generate Links

```typescript
import { getNFTUniversalLink } from "@/lib/universalLinks";

// Basic link
const link = getNFTUniversalLink("abc123");
// https://farcaster.xyz/miniapps/12345/farbasenft/nft/abc123

// With query params
const linkWithParams = getNFTUniversalLink("abc123", { 
  view: "detail", 
  ref: "share" 
});
// https://farcaster.xyz/miniapps/12345/farbasenft/nft/abc123?view=detail&ref=share
```

### 3. Use in Components

```tsx
import { getNFTUniversalLink } from "@/lib/universalLinks";

export function ShareButton({ nftId }: { nftId: string }) {
  const shareNFT = async () => {
    const link = getNFTUniversalLink(nftId, { ref: "share" });
    await navigator.clipboard.writeText(link);
  };
  
  return <button onClick={shareNFT}>Share</button>;
}
```

## 📋 Helper Functions

### NFT Links
```typescript
import { getNFTUniversalLink } from "@/lib/universalLinks";

// Basic NFT link
getNFTUniversalLink("abc123");

// With view mode
getNFTUniversalLink("abc123", { view: "detail" });

// With multiple params
getNFTUniversalLink("abc123", { 
  view: "detail", 
  tab: "properties",
  ref: "twitter" 
});
```

### Collection Links
```typescript
import { getCollectionUniversalLink } from "@/lib/universalLinks";

// Basic collection link
getCollectionUniversalLink("xyz789");

// With sorting
getCollectionUniversalLink("xyz789", { sort: "recent" });
```

### Gallery Links
```typescript
import { getGalleryUniversalLink } from "@/lib/universalLinks";

// Filtered gallery
getGalleryUniversalLink({ 
  category: "art", 
  price: "under-1-eth" 
});
```

### Leaderboard Links
```typescript
import { getLeaderboardUniversalLink } from "@/lib/universalLinks";

// Sorted leaderboard
getLeaderboardUniversalLink({ 
  sort: "xp", 
  timeframe: "week" 
});
```

### Home Links
```typescript
import { getHomeUniversalLink } from "@/lib/universalLinks";

// Home with campaign tracking
getHomeUniversalLink({ 
  ref: "twitter", 
  campaign: "nft-drop" 
});
```

### Current Page Link
```typescript
import { getCurrentUniversalLink } from "@/lib/universalLinks";

// Get Universal Link for current page
const currentLink = getCurrentUniversalLink();
```

## 🎨 Common Patterns

### Pattern 1: Copy to Clipboard
```tsx
"use client";

import { useState } from "react";
import { getNFTUniversalLink } from "@/lib/universalLinks";

export function CopyLink({ nftId }: { nftId: string }) {
  const [copied, setCopied] = useState(false);
  
  const copyLink = async () => {
    const link = getNFTUniversalLink(nftId);
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <button onClick={copyLink}>
      {copied ? "Copied!" : "Copy Link"}
    </button>
  );
}
```

### Pattern 2: Share with Farcaster
```tsx
import { FarcasterShare } from "@/components/FarcasterShare";
import { getNFTUniversalLink } from "@/lib/universalLinks";

export function NFTShare({ nft }: { nft: NFT }) {
  const universalLink = getNFTUniversalLink(nft.id, { ref: "farcaster" });
  
  return (
    <FarcasterShare
      url={universalLink}
      text={`Check out ${nft.name}!`}
      embedUrl={universalLink}
    />
  );
}
```

### Pattern 3: QR Code
```tsx
import QRCode from "qrcode.react";
import { getNFTUniversalLink } from "@/lib/universalLinks";

export function NFTQRCode({ nftId }: { nftId: string }) {
  const link = getNFTUniversalLink(nftId);
  
  return (
    <div>
      <QRCode value={link} size={256} />
      <p>{link}</p>
    </div>
  );
}
```

### Pattern 4: Open Another Mini App
```tsx
"use client";

import { sdk } from "@farcaster/miniapp-sdk";

export function OpenExternalApp() {
  const openOtherApp = async () => {
    const otherAppLink = "https://farcaster.xyz/miniapps/67890/other-app";
    await sdk.actions.openMiniApp({ url: otherAppLink });
    // Note: Current app closes
  };
  
  return <button onClick={openOtherApp}>Open App</button>;
}
```

## 📊 URL Patterns

| Page | Helper Function | Example Output |
|------|----------------|----------------|
| Home | `getHomeUniversalLink()` | `.../farbasenft` |
| NFT | `getNFTUniversalLink("id")` | `.../farbasenft/nft/id` |
| Collection | `getCollectionUniversalLink("id")` | `.../farbasenft/collection/id` |
| Gallery | `getGalleryUniversalLink()` | `.../farbasenft/gallery` |
| Leaderboard | `getLeaderboardUniversalLink()` | `.../farbasenft/leaderboard` |
| Mint | `getMintUniversalLink()` | `.../farbasenft/mint` |

## 🔧 Query Parameters

### NFT Page (`/nft/[id]`)
```typescript
getNFTUniversalLink("abc123", {
  view: "detail" | "full" | "compact",
  tab: "overview" | "properties" | "history",
  ref: "share" | "twitter" | "direct"
});
```

### Gallery (`/gallery`)
```typescript
getGalleryUniversalLink({
  category: "art" | "collectibles" | "all",
  price: "under-1-eth" | "1-5-eth" | "over-5-eth",
  sort: "recent" | "popular" | "price-low" | "price-high"
});
```

### Leaderboard (`/leaderboard`)
```typescript
getLeaderboardUniversalLink({
  sort: "xp" | "level" | "nfts",
  filter: "all" | "verified" | "top-100",
  timeframe: "day" | "week" | "month" | "all"
});
```

### Collection (`/collection/[id]`)
```typescript
getCollectionUniversalLink("xyz789", {
  sort: "recent" | "popular" | "rare",
  view: "grid" | "list"
});
```

## 🧪 Testing

### Check if App ID is Set
```typescript
import { isAppIdConfigured, getConfiguredAppId } from "@/lib/universalLinks";

if (!isAppIdConfigured()) {
  console.warn("App ID not configured!");
}

console.log("App ID:", getConfiguredAppId());
```

### Test Links in Console
```typescript
import * as links from "@/lib/universalLinks";

console.log("NFT Link:", links.getNFTUniversalLink("test123"));
console.log("Gallery:", links.getGalleryUniversalLink({ category: "art" }));
console.log("Current:", links.getCurrentUniversalLink());
```

### Verify in Production
1. Generate link in app
2. Copy to clipboard
3. Paste in Farcaster chat
4. Click link → Should open app

## ⚙️ Configuration

### Environment Variable
```bash
# .env.local
NEXT_PUBLIC_FARCASTER_APP_ID=12345
```

### Manifest Configuration
```typescript
// minikit.config.ts
export const minikitConfig = {
  miniapp: {
    name: "farbasenft", // Used in URL slug
    homeUrl: "https://y-six-dun.vercel.app", // Base URL for routing
    // ...
  },
};
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Links show "YOUR_APP_ID" | Set `NEXT_PUBLIC_FARCASTER_APP_ID` in `.env.local` |
| Link doesn't open app | Must be logged into Farcaster |
| Wrong path loaded | Check `homeUrl` has no trailing slash |
| Params not working | Ensure page reads `searchParams` |

### Get App ID
```bash
# From Developers page
https://farcaster.xyz/~/developers

# Or from existing Universal Link
https://farcaster.xyz/miniapps/12345/farbasenft
#                                ^^^^^ This is your App ID
```

### Debug Links
```typescript
// Log all parts of Universal Link
const link = getNFTUniversalLink("test");
console.log("Full link:", link);
console.log("App ID configured:", isAppIdConfigured());
```

## 📖 API Reference

### generateUniversalLink(subPath?, queryParams?)
Base function for generating Universal Links.

**Parameters**:
- `subPath` - Optional path (e.g., "/nft/123")
- `queryParams` - Optional query object

**Returns**: Full Universal Link string

### parseUniversalLinkParams()
Parse query parameters from current URL (client-side).

**Returns**: Object with query parameters

### getCurrentUniversalLink()
Get Universal Link for current page (client-side).

**Returns**: Universal Link for current page

## 🔗 Resources

- [Full Implementation Guide](./UNIVERSAL_LINKS_IMPLEMENTATION.md)
- [Official Docs](https://miniapps.farcaster.xyz/docs/guides/urls)
- [Farcaster Developers](https://farcaster.xyz/~/developers)
- [Publishing Guide](https://miniapps.farcaster.xyz/docs/guides/publishing)

## ✅ Quick Checklist

- [ ] Get App ID from Developers page
- [ ] Add `NEXT_PUBLIC_FARCASTER_APP_ID` to `.env.local`
- [ ] Import helper functions: `import { getNFTUniversalLink } from "@/lib/universalLinks"`
- [ ] Generate links: `getNFTUniversalLink(nftId)`
- [ ] Test in production Farcaster client
- [ ] Verify links open correct pages
- [ ] Add query parameters as needed
- [ ] Update share buttons to use Universal Links

---

**Helper File**: `src/lib/universalLinks.ts`  
**Production URL**: https://y-six-dun.vercel.app  
**Universal Link Format**: `https://farcaster.xyz/miniapps/<APP_ID>/farbasenft/<path>`
