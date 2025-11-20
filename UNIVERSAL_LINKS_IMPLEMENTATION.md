# Universal Links Implementation Guide

Complete implementation of [Farcaster Universal Links](https://miniapps.farcaster.xyz/docs/guides/urls) for deep linking and sharing.

## 🎯 Overview

Universal Links are canonical URLs that allow users to share and navigate to specific pages within your Mini App. They work across social media, web browsers, and Farcaster clients.

**Format**:
```
https://farcaster.xyz/miniapps/<app-id>/<app-slug>/<sub-path>?<query-params>
```

**Example**:
```
https://farcaster.xyz/miniapps/12345/farbasenft/nft/abc123?view=detail
```

## 📐 Architecture

### How Universal Links Work

```
User clicks Universal Link
        ↓
https://farcaster.xyz/miniapps/12345/farbasenft/nft/abc123?view=detail
        ↓
Farcaster client extracts:
  - app-id: 12345
  - app-slug: farbasenft
  - sub-path: /nft/abc123
  - query: ?view=detail
        ↓
Looks up homeUrl from manifest: https://y-six-dun.vercel.app
        ↓
Opens in WebView/iframe: https://y-six-dun.vercel.app/nft/abc123?view=detail
        ↓
Your app handles the route
```

### URL Components

| Component | Description | Example | Required |
|-----------|-------------|---------|----------|
| **app-id** | Unique ID assigned when published | `12345` | ✅ Yes |
| **app-slug** | Kebab-case of app name | `farbasenft` | ✅ Yes |
| **sub-path** | Path appended to homeUrl | `/nft/abc123` | ❌ Optional |
| **query-params** | Query string parameters | `?view=detail` | ❌ Optional |

## 🔍 Finding Your Universal Link

### Method 1: Developers Page
1. Go to [Farcaster Developers](https://farcaster.xyz/~/developers)
2. Find your Mini App card
3. Click kebab menu (⋮) → "Copy link to mini app"
4. Universal Link copied to clipboard

### Method 2: From Mini App
1. Open your Mini App in Farcaster
2. Click kebab menu (⋮) → "Copy link"
3. Universal Link copied to clipboard

### Method 3: Construct Manually
```typescript
// Format: https://farcaster.xyz/miniapps/<app-id>/<app-slug>
const universalLink = `https://farcaster.xyz/miniapps/${APP_ID}/farbasenft`;
```

## 🏗️ Implementation

### 1. Configure homeUrl in Manifest

Your `homeUrl` is the base URL that Farcaster appends paths to:

**File**: `minikit.config.ts`
```typescript
export const minikitConfig = {
  miniapp: {
    name: "farbasenft",
    homeUrl: "https://y-six-dun.vercel.app", // Base URL
    // ... other config
  },
};
```

**Important**: 
- Must be production domain (no ngrok/localhost)
- No trailing slash
- Must match your actual deployment URL

### 2. Create Deep Linkable Routes

farbasenft already has these routes implemented:

**NFT Detail Page**: `/nft/[id]`
```typescript
// src/app/nft/[id]/page.tsx
export default async function NFTPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const nft = getNFT(params.id);
  
  return <NFTDetailPage nft={nft} />;
}
```

**Collection Page**: `/collection/[id]`
```typescript
// src/app/collection/[id]/page.tsx
export default async function CollectionPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const collection = getCollection(params.id);
  
  return <CollectionView collection={collection} />;
}
```

**Leaderboard**: `/leaderboard`
```typescript
// src/app/leaderboard/page.tsx
export default function LeaderboardPage() {
  return <Leaderboard />;
}
```

### 3. Handle Query Parameters

Add query parameter support to existing routes:

**Example: NFT with View Mode**
```typescript
// src/app/nft/[id]/page.tsx
import { headers } from "next/headers";

export default async function NFTPage(
  props: { 
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  const nft = getNFT(params.id);
  const view = searchParams.view || "detail"; // Default to detail
  const tab = searchParams.tab || "overview";
  
  return <NFTDetailPage nft={nft} defaultView={view} defaultTab={tab} />;
}
```

**Example: Leaderboard with Sorting**
```typescript
// src/app/leaderboard/page.tsx
export default async function LeaderboardPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const sort = (searchParams.sort as string) || "xp";
  const filter = (searchParams.filter as string) || "all";
  
  return <Leaderboard defaultSort={sort} defaultFilter={filter} />;
}
```

### 4. Generate Universal Links

Create helper functions to generate Universal Links:

**File**: `src/lib/universalLinks.ts`
```typescript
/**
 * Generate Universal Link for farbasenft Mini App
 * 
 * @param subPath - Optional path to append (e.g., "/nft/123")
 * @param queryParams - Optional query parameters
 * @returns Full Universal Link
 */
export function generateUniversalLink(
  subPath?: string,
  queryParams?: Record<string, string>
): string {
  const APP_ID = process.env.NEXT_PUBLIC_FARCASTER_APP_ID;
  const APP_SLUG = "farbasenft";
  
  if (!APP_ID) {
    console.warn("NEXT_PUBLIC_FARCASTER_APP_ID not set, using placeholder");
  }
  
  let url = `https://farcaster.xyz/miniapps/${APP_ID || "YOUR_APP_ID"}/${APP_SLUG}`;
  
  if (subPath) {
    // Ensure subPath starts with /
    const normalizedPath = subPath.startsWith("/") ? subPath : `/${subPath}`;
    url += normalizedPath;
  }
  
  if (queryParams && Object.keys(queryParams).length > 0) {
    const queryString = new URLSearchParams(queryParams).toString();
    url += `?${queryString}`;
  }
  
  return url;
}

/**
 * Generate Universal Link for NFT detail page
 */
export function getNFTUniversalLink(nftId: string, queryParams?: Record<string, string>): string {
  return generateUniversalLink(`/nft/${nftId}`, queryParams);
}

/**
 * Generate Universal Link for collection page
 */
export function getCollectionUniversalLink(
  collectionId: string,
  queryParams?: Record<string, string>
): string {
  return generateUniversalLink(`/collection/${collectionId}`, queryParams);
}

/**
 * Generate Universal Link for leaderboard
 */
export function getLeaderboardUniversalLink(queryParams?: Record<string, string>): string {
  return generateUniversalLink("/leaderboard", queryParams);
}

/**
 * Generate Universal Link for gallery
 */
export function getGalleryUniversalLink(queryParams?: Record<string, string>): string {
  return generateUniversalLink("/gallery", queryParams);
}

/**
 * Generate Universal Link for home page
 */
export function getHomeUniversalLink(queryParams?: Record<string, string>): string {
  return generateUniversalLink("", queryParams);
}
```

### 5. Use Universal Links in Share Components

Update sharing to use Universal Links:

**NFT Share with Universal Link**:
```tsx
import { getNFTUniversalLink } from "@/lib/universalLinks";
import { FarcasterShare } from "@/components/FarcasterShare";

export function NFTShareButton({ nftId }: { nftId: string }) {
  const universalLink = getNFTUniversalLink(nftId, { view: "detail" });
  
  return (
    <FarcasterShare
      url={universalLink}
      text="Check out this NFT!"
      embedUrl={universalLink}
    />
  );
}
```

**Collection Share**:
```tsx
import { getCollectionUniversalLink } from "@/lib/universalLinks";

export function CollectionShare({ collectionId }: { collectionId: string }) {
  const universalLink = getCollectionUniversalLink(collectionId);
  
  return (
    <button onClick={() => navigator.clipboard.writeText(universalLink)}>
      Copy Link
    </button>
  );
}
```

### 6. Configure OpenGraph for Universal Links

Ensure all pages have proper OpenGraph meta tags (already implemented in layout):

**File**: `src/app/nft/[id]/page.tsx`
```typescript
export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const nft = getNFT(params.id);
  const universalLink = getNFTUniversalLink(params.id);
  
  return {
    title: `${nft.name} - farbasenft`,
    description: nft.description,
    openGraph: {
      title: nft.name,
      description: nft.description,
      url: universalLink,
      images: [nft.image],
      type: "website",
    },
    other: {
      "fc:frame": "vNext",
      "fc:frame:image": nft.image,
      "fc:miniapp:domain": "y-six-dun.vercel.app",
    },
  };
}
```

## 🎨 Usage Examples

### Example 1: Share NFT with Universal Link

```tsx
"use client";

import { useState } from "react";
import { getNFTUniversalLink } from "@/lib/universalLinks";

export function NFTCard({ nft }: { nft: NFT }) {
  const [copied, setCopied] = useState(false);
  
  const shareNFT = async () => {
    const universalLink = getNFTUniversalLink(nft.id, {
      view: "detail",
      ref: "share",
    });
    
    await navigator.clipboard.writeText(universalLink);
    setCopied(true);
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div>
      <h3>{nft.name}</h3>
      <button onClick={shareNFT}>
        {copied ? "Copied!" : "Share"}
      </button>
    </div>
  );
}
```

### Example 2: Leaderboard with Sort Parameter

```tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { getLeaderboardUniversalLink } from "@/lib/universalLinks";

export function LeaderboardControls() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "xp";
  
  const changeSort = (sort: string) => {
    router.push(`/leaderboard?sort=${sort}`);
  };
  
  const shareLeaderboard = () => {
    const universalLink = getLeaderboardUniversalLink({ sort: currentSort });
    navigator.clipboard.writeText(universalLink);
  };
  
  return (
    <div>
      <select value={currentSort} onChange={(e) => changeSort(e.target.value)}>
        <option value="xp">XP</option>
        <option value="level">Level</option>
        <option value="nfts">NFTs</option>
      </select>
      <button onClick={shareLeaderboard}>Share</button>
    </div>
  );
}
```

### Example 3: Gallery with Filter

```tsx
// Universal Link: https://farcaster.xyz/miniapps/12345/farbasenft/gallery?category=art&price=under-1-eth

"use client";

import { useSearchParams } from "next/navigation";

export function GalleryPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "all";
  const priceFilter = searchParams.get("price") || "all";
  
  const filteredNFTs = filterNFTs(allNFTs, { category, priceFilter });
  
  return (
    <div>
      <h1>Gallery</h1>
      <p>Showing: {category} / {priceFilter}</p>
      <NFTGrid nfts={filteredNFTs} />
    </div>
  );
}
```

### Example 4: Open Another Mini App

Use `sdk.actions.openMiniApp()` to navigate to another Mini App:

```tsx
"use client";

import { sdk } from "@farcaster/miniapp-sdk";

export function ExternalMiniAppLink() {
  const openAnotherApp = async () => {
    try {
      // Universal Link for another Mini App
      const otherAppLink = "https://farcaster.xyz/miniapps/67890/other-app";
      
      await sdk.actions.openMiniApp({ url: otherAppLink });
      // Note: Current app closes when new app opens
    } catch (error) {
      console.error("Failed to open Mini App:", error);
    }
  };
  
  return (
    <button onClick={openAnotherApp}>
      Open Another App
    </button>
  );
}
```

## 🔗 URL Patterns in farbasenft

### Current Routes

| Route | Universal Link Example | Use Case |
|-------|------------------------|----------|
| Home | `https://farcaster.xyz/miniapps/12345/farbasenft` | App landing page |
| NFT Detail | `https://farcaster.xyz/miniapps/12345/farbasenft/nft/abc123` | Share specific NFT |
| Collection | `https://farcaster.xyz/miniapps/12345/farbasenft/collection/xyz789` | Share collection |
| Gallery | `https://farcaster.xyz/miniapps/12345/farbasenft/gallery?category=art` | Filtered gallery view |
| Leaderboard | `https://farcaster.xyz/miniapps/12345/farbasenft/leaderboard?sort=xp` | Sorted leaderboard |
| Mint | `https://farcaster.xyz/miniapps/12345/farbasenft/mint` | Direct to minting |

### Query Parameter Support

**NFT Detail** (`/nft/[id]`):
- `view` - View mode (detail, full, compact)
- `tab` - Active tab (overview, properties, history)
- `ref` - Referral tracking (share, social, direct)

**Gallery** (`/gallery`):
- `category` - Filter by category (art, collectibles, all)
- `price` - Price filter (under-1-eth, 1-5-eth, over-5-eth)
- `sort` - Sort order (recent, popular, price-low, price-high)

**Leaderboard** (`/leaderboard`):
- `sort` - Sort by field (xp, level, nfts)
- `filter` - Filter users (all, verified, top-100)
- `timeframe` - Time period (day, week, month, all)

**Collection** (`/collection/[id]`):
- `sort` - Sort items (recent, popular, rare)
- `view` - Display mode (grid, list)

## 🔑 Environment Variables

Add your Farcaster App ID:

```bash
# .env.local
NEXT_PUBLIC_FARCASTER_APP_ID=12345

# Get this from:
# 1. Farcaster Developers page (https://farcaster.xyz/~/developers)
# 2. Copy Universal Link and extract the ID
# Example: https://farcaster.xyz/miniapps/12345/farbasenft
#                                            ^^^^^ This is your App ID
```

## 🎯 Best Practices

### 1. Always Include fc:frame Meta Tag
```tsx
// In page metadata
export const metadata = {
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": nft.image,
    "fc:miniapp:domain": "y-six-dun.vercel.app",
  },
};
```

### 2. Use Descriptive Query Parameters
```typescript
// ❌ BAD: Generic parameters
const url = getNFTUniversalLink(nftId, { a: "1", b: "detail" });

// ✅ GOOD: Clear, descriptive parameters
const url = getNFTUniversalLink(nftId, { view: "detail", ref: "share" });
```

### 3. Handle Missing Parameters Gracefully
```typescript
export default async function NFTPage(props) {
  const searchParams = await props.searchParams;
  
  // Provide defaults
  const view = searchParams.view || "detail";
  const tab = searchParams.tab || "overview";
  
  return <NFTDetailPage view={view} tab={tab} />;
}
```

### 4. Validate Route Parameters
```typescript
export default async function NFTPage(props) {
  const params = await props.params;
  const nft = getNFT(params.id);
  
  // Handle invalid IDs
  if (!nft) {
    notFound(); // Show 404 page
  }
  
  return <NFTDetailPage nft={nft} />;
}
```

### 5. Track Universal Link Usage
```typescript
export function useUniversalLinkTracking() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    
    if (ref) {
      // Track referral source
      analytics.track("universal_link_opened", {
        referrer: ref,
        path: window.location.pathname,
      });
    }
  }, []);
}
```

## 🧪 Testing

### Test Universal Links

1. **Get Your App ID**:
   ```bash
   # From Developers page or existing Universal Link
   # Example: https://farcaster.xyz/miniapps/12345/farbasenft
   ```

2. **Test in Browser**:
   ```bash
   # Click Universal Link while logged into Farcaster
   # Should open Mini App in drawer (web) or app (mobile)
   ```

3. **Test Sub-Paths**:
   ```
   https://farcaster.xyz/miniapps/12345/farbasenft/nft/abc123
   # Should load: https://y-six-dun.vercel.app/nft/abc123
   ```

4. **Test Query Parameters**:
   ```
   https://farcaster.xyz/miniapps/12345/farbasenft/leaderboard?sort=level
   # Should load: https://y-six-dun.vercel.app/leaderboard?sort=level
   ```

### Testing Checklist

- [ ] Base Universal Link opens app
- [ ] Sub-paths append correctly to homeUrl
- [ ] Query parameters pass through
- [ ] Invalid routes show 404
- [ ] OpenGraph meta tags render
- [ ] Universal Links work on mobile
- [ ] Universal Links work on web
- [ ] Share buttons copy correct URLs
- [ ] openMiniApp() navigates to other apps

### Debug Universal Links

```typescript
// Add to page component
export default function DebugPage() {
  useEffect(() => {
    console.log("Full URL:", window.location.href);
    console.log("Pathname:", window.location.pathname);
    console.log("Search:", window.location.search);
    console.log("Hash:", window.location.hash);
  }, []);
  
  return <div>Check console for URL details</div>;
}
```

## 🐛 Troubleshooting

### Issue: Universal Link doesn't open app
- **Cause**: Not logged into Farcaster
- **Solution**: Log in at [farcaster.xyz](https://farcaster.xyz)

### Issue: Sub-path not appending
- **Cause**: homeUrl has trailing slash
- **Solution**: Remove trailing slash from homeUrl in `minikit.config.ts`

### Issue: Query params not working
- **Cause**: Not reading searchParams in page component
- **Solution**: Add searchParams prop and await it

### Issue: Wrong domain in iframe
- **Cause**: homeUrl doesn't match deployment URL
- **Solution**: Update homeUrl in manifest to match Vercel URL

### Issue: Can't find App ID
- **Cause**: App not published yet
- **Solution**: Publish app first, then get ID from Developers page

### Issue: openMiniApp doesn't work
- **Cause**: Invalid Universal Link format
- **Solution**: Use proper format: `https://farcaster.xyz/miniapps/<id>/<slug>`

## 📊 URL Strategy

### For Sharing
Use Universal Links for external sharing (social media, messaging):
```typescript
const shareUrl = getNFTUniversalLink(nftId);
// https://farcaster.xyz/miniapps/12345/farbasenft/nft/abc123
```

### For Internal Navigation
Use regular paths for in-app navigation:
```typescript
import { useRouter } from "next/navigation";

const router = useRouter();
router.push(`/nft/${nftId}`); // Internal navigation
```

### For External Links
Include referral tracking:
```typescript
const externalUrl = getNFTUniversalLink(nftId, { 
  ref: "twitter",
  campaign: "nft-drop-2025",
});
```

## 🔗 Related Documentation

- [Universal Links Setup](./FARCASTER_AUTH_SETUP.md) - Basic setup guide
- [Sharing Implementation](./FARCASTER_SHARING_FEATURE_SUMMARY.md) - Share feature integration
- [Discovery Implementation](./DISCOVERY_IMPLEMENTATION.md) - OpenGraph optimization
- [Official Guide](https://miniapps.farcaster.xyz/docs/guides/urls)

## 📚 Additional Resources

- [Farcaster Developers](https://farcaster.xyz/~/developers)
- [Mini Apps Directory](https://farcaster.xyz/miniapps)
- [SDK Actions](https://miniapps.farcaster.xyz/docs/sdk/actions)
- [Publishing Guide](https://miniapps.farcaster.xyz/docs/guides/publishing)

---

## ✅ Implementation Checklist

- [x] homeUrl configured in minikit.config.ts
- [x] Dynamic routes for NFTs and collections
- [x] OpenGraph meta tags on all pages
- [x] fc:frame meta tags for Universal Links
- [ ] Add NEXT_PUBLIC_FARCASTER_APP_ID environment variable
- [ ] Create universalLinks.ts helper file
- [ ] Update share buttons to use Universal Links
- [ ] Add query parameter support to routes
- [ ] Test Universal Links in production
- [ ] Add referral tracking
- [ ] Document app-specific URL patterns

**Status**: ⚠️ **Partially Implemented** (routes exist, need Universal Link helpers)

**Next Steps**:
1. Get App ID from Farcaster Developers page
2. Add App ID to environment variables
3. Create Universal Link helper functions
4. Update share components to use Universal Links
5. Test in production Farcaster client

---

**Production URL**: https://y-six-dun.vercel.app  
**Universal Link Format**: `https://farcaster.xyz/miniapps/<YOUR_APP_ID>/farbasenft/<path>`

**Last Updated**: November 2024  
**Guide Reference**: https://miniapps.farcaster.xyz/docs/guides/urls
