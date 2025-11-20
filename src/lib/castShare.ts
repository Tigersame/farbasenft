/**
 * Cast Share Types
 * 
 * TypeScript types for Farcaster cast share extension functionality.
 * 
 * @see https://miniapps.farcaster.xyz/docs/guides/share-extension
 */

/**
 * URL parameters received when a cast is shared to the Mini App
 */
export interface CastShareParams {
  /** Hex-encoded hash of the shared cast */
  castHash: string;
  /** FID of the cast author */
  castFid: number;
  /** FID of the user sharing the cast (if logged in) */
  viewerFid?: number;
}

/**
 * Mini App user information
 */
export interface MiniAppUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

/**
 * Enriched cast data provided by SDK context
 */
export interface MiniAppCast {
  /** Author information */
  author: MiniAppUser;
  /** Cast hash */
  hash: string;
  /** Parent cast hash (if reply) */
  parentHash?: string;
  /** Parent cast author FID (if reply) */
  parentFid?: number;
  /** Unix timestamp of cast */
  timestamp?: number;
  /** Users mentioned in cast */
  mentions?: MiniAppUser[];
  /** Cast text content */
  text: string;
  /** Embedded URLs */
  embeds?: string[];
  /** Channel key (if posted in channel) */
  channelKey?: string;
}

/**
 * Cast share location context from SDK
 */
export interface CastShareLocation {
  type: "cast_share";
  cast: MiniAppCast;
}

/**
 * Parse cast share URL parameters from search params
 * 
 * @param searchParams - URLSearchParams or query object
 * @returns Parsed cast share parameters or null
 */
export function parseCastShareParams(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>
): CastShareParams | null {
  let castHash: string | undefined;
  let castFid: string | undefined;
  let viewerFid: string | undefined;

  if (searchParams instanceof URLSearchParams) {
    castHash = searchParams.get("castHash") || undefined;
    castFid = searchParams.get("castFid") || undefined;
    viewerFid = searchParams.get("viewerFid") || undefined;
  } else {
    castHash = Array.isArray(searchParams.castHash) 
      ? searchParams.castHash[0] 
      : searchParams.castHash;
    castFid = Array.isArray(searchParams.castFid)
      ? searchParams.castFid[0]
      : searchParams.castFid;
    viewerFid = Array.isArray(searchParams.viewerFid)
      ? searchParams.viewerFid[0]
      : searchParams.viewerFid;
  }

  if (!castHash || !castFid) {
    return null;
  }

  return {
    castHash,
    castFid: parseInt(castFid, 10),
    viewerFid: viewerFid ? parseInt(viewerFid, 10) : undefined,
  };
}

/**
 * Check if we're in a cast share context (client-side only)
 * 
 * @returns true if current context is cast share
 */
export function isCastShareContext(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const params = new URLSearchParams(window.location.search);
  return params.has("castHash") && params.has("castFid");
}

/**
 * Fetch cast data from Neynar API
 * 
 * @param castHash - Cast hash (with or without 0x prefix)
 * @returns Cast data from Neynar
 */
export async function fetchCastData(castHash: string): Promise<any> {
  const apiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY || process.env.NEYNAR_API_KEY;
  
  if (!apiKey) {
    console.warn("NEYNAR_API_KEY not set, cannot fetch cast data");
    return null;
  }

  // Ensure hash has 0x prefix
  const normalizedHash = castHash.startsWith("0x") ? castHash : `0x${castHash}`;

  try {
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/cast?identifier=${normalizedHash}&type=hash`,
      {
        headers: {
          api_key: apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch cast: ${response.statusText}`);
    }

    const data = await response.json();
    return data.cast;
  } catch (error) {
    console.error("Error fetching cast data:", error);
    return null;
  }
}

/**
 * Format cast text for display (truncate if needed)
 * 
 * @param text - Cast text
 * @param maxLength - Maximum length before truncation
 * @returns Formatted text
 */
export function formatCastText(text: string, maxLength: number = 280): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength - 3) + "...";
}

/**
 * Get NFT mentions from cast embeds
 * 
 * @param embeds - Cast embed URLs
 * @returns Array of NFT IDs mentioned
 */
export function extractNFTsFromCast(embeds?: string[]): string[] {
  if (!embeds) return [];
  
  const nftIds: string[] = [];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  
  for (const embed of embeds) {
    // Check if embed is from our app
    if (embed.includes(appUrl)) {
      // Extract NFT ID from URL like https://y-six-dun.vercel.app/nft/abc123
      const match = embed.match(/\/nft\/([a-zA-Z0-9-]+)/);
      if (match) {
        nftIds.push(match[1]);
      }
    }
  }
  
  return nftIds;
}
