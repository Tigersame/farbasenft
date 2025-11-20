# Share Extension Implementation Guide

Complete guide to implementing Farcaster share extensions in farbasenft, allowing users to share casts directly to your Mini App.

## Overview

**Farcaster Share Extensions** allow users to share any Farcaster cast to your Mini App via the native share sheet. When a user selects your app from the share menu, they're directed to a custom page in your app with full cast context.

**Implementation Status**: ✅ Complete

## How Share Extensions Work

### Flow
1. User opens share sheet on a Farcaster cast (Warpcast, Base app)
2. User selects "farbasenft" from share options
3. Mini App opens to `/share` route with URL parameters
4. SDK provides enriched cast data via context
5. App displays cast details and contextual actions

### Data Sources

Share extensions provide cast data through **two channels**:

#### 1. URL Parameters (Immediate, SSR-safe)
```typescript
?castHash=0x1234567890abcdef...
&castFid=12345
&viewerFid=67890  // Optional: who initiated share
```

#### 2. SDK Context (Enriched, after initialization)
```typescript
if (sdk.context.location.type === "cast_share") {
  const cast = sdk.context.location.cast;
  // cast.author, cast.text, cast.embeds, cast.channel, etc.
}
```

## Implementation Steps

### 1. Update Manifest Configuration

**File**: `minikit.config.ts`

Add `castShareUrl` to your Mini App configuration:

```typescript
export const ROOT_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const miniAppConfig = {
  name: "farbasenft",
  castShareUrl: `${ROOT_URL}/share`,  // ✨ Enable share extension
  webhookUrl: `${ROOT_URL}/api/webhook`,
  // ... other config
};
```

This tells Farcaster clients where to send users when they share a cast.

### 2. Create Type Definitions

**File**: `src/lib/castShare.ts`

Define TypeScript interfaces for type-safe cast handling:

```typescript
/**
 * Cast Share URL Parameters
 */
export interface CastShareParams {
  castHash?: string;
  castFid?: number;
  viewerFid?: number;
}

/**
 * Mini App User (from SDK)
 */
export interface MiniAppUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

/**
 * Mini App Cast (from SDK context.location)
 */
export interface MiniAppCast {
  hash: string;
  author: MiniAppUser;
  text: string;
  embeds?: Array<{ url?: string }>;
  channel?: {
    id: string;
    name: string;
    imageUrl?: string;
  };
  timestamp?: number;
}
```

### 3. Create Utility Functions

**File**: `src/lib/castShare.ts` (continued)

#### Parse URL Parameters
```typescript
export function parseCastShareParams(
  source: URLSearchParams | { castHash?: string; castFid?: string; viewerFid?: string }
): CastShareParams {
  if (source instanceof URLSearchParams) {
    return {
      castHash: source.get("castHash") || undefined,
      castFid: source.get("castFid") ? parseInt(source.get("castFid")!) : undefined,
      viewerFid: source.get("viewerFid") ? parseInt(source.get("viewerFid")!) : undefined,
    };
  }
  
  return {
    castHash: source.castHash,
    castFid: source.castFid ? parseInt(source.castFid) : undefined,
    viewerFid: source.viewerFid ? parseInt(source.viewerFid) : undefined,
  };
}
```

#### Check Cast Share Context
```typescript
export function isCastShareContext(sdk?: any): boolean {
  if (typeof window === "undefined") return false;
  if (!sdk?.context?.location) return false;
  return sdk.context.location.type === "cast_share";
}
```

#### Format Cast Text
```typescript
export function formatCastText(text: string, maxLength: number = 280): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}
```

#### Extract NFTs from Cast Embeds
```typescript
export function extractNFTsFromCast(cast?: MiniAppCast): string[] {
  if (!cast?.embeds) return [];
  
  const nftIds: string[] = [];
  const appDomain = process.env.NEXT_PUBLIC_APP_URL || "";
  
  for (const embed of cast.embeds) {
    if (embed.url?.startsWith(appDomain)) {
      const match = embed.url.match(/\/nft\/([^/?]+)/);
      if (match) nftIds.push(match[1]);
    }
  }
  
  return nftIds;
}
```

#### Fetch Enriched Cast Data (Optional)
```typescript
export async function fetchCastData(castHash: string): Promise<MiniAppCast | null> {
  const apiKey = process.env.NEYNAR_API_KEY;
  if (!apiKey) return null;
  
  try {
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/cast?identifier=${castHash}&type=hash`,
      { headers: { api_key: apiKey } }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const cast = data.cast;
    
    return {
      hash: cast.hash,
      author: {
        fid: cast.author.fid,
        username: cast.author.username,
        displayName: cast.author.display_name,
        pfpUrl: cast.author.pfp_url,
      },
      text: cast.text,
      embeds: cast.embeds,
      channel: cast.channel,
      timestamp: new Date(cast.timestamp).getTime(),
    };
  } catch (error) {
    console.error("Failed to fetch cast data:", error);
    return null;
  }
}
```

### 4. Create React Hook

**File**: `src/hooks/useCastShare.ts`

Build a hook to manage cast share state:

```typescript
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMiniAppContext } from "./useMiniAppContext";
import {
  parseCastShareParams,
  isCastShareContext,
  type CastShareParams,
  type MiniAppCast,
} from "@/lib/castShare";

export function useCastShare() {
  const searchParams = useSearchParams();
  const { sdk, isLoading: sdkLoading } = useMiniAppContext();
  
  const [cast, setCast] = useState<MiniAppCast | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  // Parse URL params immediately (SSR-safe)
  const params = parseCastShareParams(searchParams);
  const isCastShare = !!(params.castHash || params.castFid);
  
  useEffect(() => {
    if (sdkLoading || !sdk) return;
    
    try {
      // Check SDK context for enriched cast data
      if (isCastShareContext(sdk)) {
        const castData = sdk.context.location.cast;
        if (castData) {
          setCast(castData);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load cast"));
    }
  }, [sdk, sdkLoading]);
  
  return {
    isCastShare,
    params,
    cast,
    isLoading: sdkLoading,
    error,
  };
}
```

### 5. Create Share Page (Server Component)

**File**: `src/app/share/page.tsx`

```typescript
import { Suspense } from "react";
import { Metadata } from "next";
import SharePageClient from "./SharePageClient";

export const metadata: Metadata = {
  title: "Shared Cast | farbasenft",
  description: "View shared Farcaster cast on farbasenft NFT marketplace",
  openGraph: {
    title: "Shared Cast | farbasenft",
    description: "Explore NFTs from this Farcaster cast",
    images: ["/og-image.png"],
  },
  other: {
    "fc:frame": "vNext",
  },
};

function SharePageLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500" />
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={<SharePageLoading />}>
      <SharePageClient />
    </Suspense>
  );
}
```

### 6. Create Share Page Client Component

**File**: `src/app/share/SharePageClient.tsx`

```typescript
"use client";

import { useCastShare } from "@/hooks/useCastShare";
import { extractNFTsFromCast, formatCastText } from "@/lib/castShare";
import { useRouter } from "next/navigation";

export default function SharePageClient() {
  const { isCastShare, params, cast, isLoading, error } = useCastShare();
  const router = useRouter();
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500" />
        <p className="text-slate-400">Loading shared cast...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
        <div className="text-red-400 text-6xl">⚠️</div>
        <h1 className="text-2xl font-bold text-slate-100">Error Loading Cast</h1>
        <p className="text-slate-400 text-center">{error.message}</p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg"
        >
          Go Home
        </button>
      </div>
    );
  }
  
  if (!isCastShare) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
        <div className="text-cyan-400 text-6xl">ℹ️</div>
        <h1 className="text-2xl font-bold text-slate-100">Share Extension</h1>
        <p className="text-slate-400 text-center max-w-md">
          Share a Farcaster cast to farbasenft to view it here with NFT context.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg"
        >
          Go Home
        </button>
      </div>
    );
  }
  
  // Extract NFT references from cast embeds
  const nftIds = extractNFTsFromCast(cast || undefined);
  
  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-100">Shared Cast</h1>
          <button
            onClick={() => router.push("/")}
            className="text-slate-400 hover:text-slate-100"
          >
            ✕
          </button>
        </div>
        
        {/* Cast Display */}
        {cast && (
          <div className="bg-slate-900 rounded-xl p-6 space-y-4">
            {/* Author */}
            <div className="flex items-center gap-3">
              {cast.author.pfpUrl ? (
                <img
                  src={cast.author.pfpUrl}
                  alt={cast.author.displayName || `FID ${cast.author.fid}`}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-white font-bold">
                  {cast.author.username?.[0]?.toUpperCase() || "?"}
                </div>
              )}
              <div>
                <p className="font-semibold text-slate-100">
                  {cast.author.displayName || cast.author.username || `FID ${cast.author.fid}`}
                </p>
                <p className="text-sm text-slate-400">
                  @{cast.author.username || cast.author.fid}
                </p>
              </div>
            </div>
            
            {/* Cast Text */}
            <p className="text-slate-200 whitespace-pre-wrap">
              {formatCastText(cast.text, 280)}
            </p>
            
            {/* Channel */}
            {cast.channel && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                {cast.channel.imageUrl && (
                  <img
                    src={cast.channel.imageUrl}
                    alt={cast.channel.name}
                    className="w-5 h-5 rounded"
                  />
                )}
                <span>/{cast.channel.id}</span>
              </div>
            )}
            
            {/* Cast Info */}
            <div className="text-xs text-slate-500 space-y-1">
              <p>Cast Hash: {cast.hash.substring(0, 10)}...</p>
              {params.viewerFid && <p>Shared by FID: {params.viewerFid}</p>}
            </div>
          </div>
        )}
        
        {/* NFT References */}
        {nftIds.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-100">
              Referenced NFTs ({nftIds.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {nftIds.map((nftId) => (
                <button
                  key={nftId}
                  onClick={() => router.push(`/nft/${nftId}`)}
                  className="bg-slate-900 hover:bg-slate-800 rounded-lg p-4 text-center transition-colors"
                >
                  <p className="text-cyan-400 font-medium">NFT #{nftId}</p>
                  <p className="text-xs text-slate-500">View Details</p>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {cast?.author && (
            <button
              onClick={() => router.push(`/gallery?creator=${cast.author.fid}`)}
              className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg transition-colors"
            >
              View {cast.author.username || "Creator"}'s NFTs
            </button>
          )}
          <button
            onClick={() => router.push("/mint")}
            className="flex-1 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
          >
            Mint NFT
          </button>
        </div>
        
        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === "development" && (
          <details className="bg-slate-900 rounded-lg p-4">
            <summary className="cursor-pointer text-slate-400 text-sm">
              Debug Info
            </summary>
            <pre className="mt-2 text-xs text-slate-500 overflow-auto">
              {JSON.stringify({ params, cast, nftIds }, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
```

## Testing Share Extensions

### In Development
1. Start dev server: `npm run dev`
2. Manually construct share URL:
   ```
   http://localhost:3000/share?castHash=0x1234&castFid=12345&viewerFid=67890
   ```
3. Verify page loads and displays parameters

### In Farcaster Client
1. Deploy to production (Vercel)
2. Wait for manifest to update (can take hours)
3. In Warpcast or Base app:
   - Open any cast
   - Tap share icon
   - Look for "farbasenft" in share options
   - Select it
   - Verify redirected to `/share` with cast context

### Testing Checklist
- [ ] URL parameters parse correctly
- [ ] SDK context provides enriched cast data
- [ ] Author information displays (pfp, username)
- [ ] Cast text renders properly
- [ ] Channel information shows (if available)
- [ ] NFT references extracted from embeds
- [ ] Actions navigate to correct pages
- [ ] Loading states show during data fetch
- [ ] Error states handle missing data gracefully
- [ ] Works in both Mini App and browser contexts

## Integration Patterns

### 1. View Author's NFTs
```typescript
// Navigate to gallery filtered by cast author
if (cast?.author) {
  router.push(`/gallery?creator=${cast.author.fid}`);
}
```

### 2. Extract App-Specific Content
```typescript
// Find NFT references in cast embeds
const nftIds = extractNFTsFromCast(cast);
nftIds.forEach(id => {
  console.log(`Cast references NFT #${id}`);
});
```

### 3. Fetch Additional Context
```typescript
// Enrich cast data with Neynar API (optional)
if (params.castHash && !cast) {
  const enrichedCast = await fetchCastData(params.castHash);
  setCast(enrichedCast);
}
```

### 4. Track Share Analytics
```typescript
// Award XP for sharing to your app
useEffect(() => {
  if (isCastShare && params.viewerFid) {
    fetch("/api/xp", {
      method: "POST",
      body: JSON.stringify({
        wallet: `fid:${params.viewerFid}`,
        action: "cast_shared",
        metadata: { castHash: params.castHash },
      }),
    });
  }
}, [isCastShare, params]);
```

## Best Practices

### 1. Dual Data Sources
Always handle both URL params and SDK context:
```typescript
// URL params are immediate (SSR-safe)
const params = parseCastShareParams(searchParams);

// SDK context is enriched (client-side only)
if (isCastShareContext(sdk)) {
  const cast = sdk.context.location.cast;
}
```

### 2. Graceful Degradation
Not all cast fields are guaranteed:
```typescript
{cast?.author?.pfpUrl ? (
  <img src={cast.author.pfpUrl} />
) : (
  <div className="avatar-placeholder" />
)}
```

### 3. Performance
Optimize for instant load:
- Parse URL params during SSR
- Show skeleton UI while loading SDK
- Fetch enriched data only if needed

### 4. Error Handling
Handle missing or malformed data:
```typescript
if (!cast && !params.castHash) {
  return <ErrorState message="No cast data available" />;
}
```

### 5. Deep Linking
Create contextual actions based on cast content:
```typescript
const nftIds = extractNFTsFromCast(cast);
if (nftIds.length > 0) {
  // Show "View Referenced NFTs" action
}
```

## Environment Variables

Required for full functionality:

```bash
# App URL (required for manifest)
NEXT_PUBLIC_APP_URL=https://y-six-dun.vercel.app

# Neynar API (optional, for enriched cast data)
NEYNAR_API_KEY=your_neynar_api_key
```

## Troubleshooting

### Share Option Not Appearing
- **Issue**: App doesn't show in Farcaster share sheet
- **Solution**: 
  - Verify `castShareUrl` in manifest
  - Check manifest deployed at `/.well-known/farcaster.json`
  - Wait up to 24 hours for Farcaster to cache manifest
  - Ensure app domain matches production URL

### Cast Data Missing
- **Issue**: No cast data available on share page
- **Solution**:
  - Check URL parameters in address bar
  - Verify SDK initialization completed
  - Check browser console for errors
  - Try fetching from Neynar API as fallback

### URL Parameters Not Parsed
- **Issue**: `params.castHash` is undefined
- **Solution**:
  - Use `useSearchParams()` not `window.location.search`
  - Ensure parsing handles both URLSearchParams and object formats
  - Check for typos in parameter names

### SDK Context Unavailable
- **Issue**: `sdk.context.location.type` is not "cast_share"
- **Solution**:
  - Only available when opened via share sheet
  - Not available in browser or other contexts
  - Use URL params as fallback
  - Check `isInMiniApp()` before accessing SDK

## Related Documentation

- [Official Farcaster Share Extension Guide](https://miniapps.farcaster.xyz/docs/guides/share-extension)
- [Universal Links Implementation](./UNIVERSAL_LINKS_IMPLEMENTATION.md)
- [Notifications Setup](./NOTIFICATIONS_SETUP.md)
- [Authentication Guide](./FARCASTER_AUTH_SETUP.md)

## Implementation Status

✅ **Complete**
- Manifest configuration with castShareUrl
- Type-safe utilities for cast handling
- React hook for share state management
- Server component with proper metadata
- Client component with full UI
- NFT extraction from embeds
- Contextual actions based on cast content
- Error handling and loading states
- Development and production testing

🎯 **Production Ready**
- Deploy to Vercel
- Verify manifest at `/.well-known/farcaster.json`
- Test in Warpcast/Base app
- Monitor analytics for share conversions
