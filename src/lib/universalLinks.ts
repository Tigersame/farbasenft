/**
 * Universal Links Helper
 * 
 * Generate Farcaster Universal Links for deep linking into farbasenft Mini App.
 * 
 * Universal Link Format:
 * https://farcaster.xyz/miniapps/<app-id>/<app-slug>/<sub-path>?<query-params>
 * 
 * @see https://miniapps.farcaster.xyz/docs/guides/urls
 */

const APP_SLUG = "farbasenft";
const FARCASTER_BASE = "https://farcaster.xyz/miniapps";

/**
 * Get the Farcaster App ID from environment variable
 * Falls back to placeholder if not set
 */
function getAppId(): string {
  const appId = process.env.NEXT_PUBLIC_FARCASTER_APP_ID;
  
  if (!appId) {
    console.warn(
      "NEXT_PUBLIC_FARCASTER_APP_ID not set. Universal Links will use placeholder. " +
      "Get your App ID from https://farcaster.xyz/~/developers"
    );
    return "YOUR_APP_ID";
  }
  
  return appId;
}

/**
 * Generate a Universal Link for the farbasenft Mini App
 * 
 * @param subPath - Optional path to append (e.g., "/nft/123")
 * @param queryParams - Optional query parameters as object
 * @returns Full Universal Link
 * 
 * @example
 * generateUniversalLink("/nft/abc123", { view: "detail" })
 * // Returns: https://farcaster.xyz/miniapps/12345/farbasenft/nft/abc123?view=detail
 */
export function generateUniversalLink(
  subPath?: string,
  queryParams?: Record<string, string | number | boolean>
): string {
  const appId = getAppId();
  let url = `${FARCASTER_BASE}/${appId}/${APP_SLUG}`;
  
  // Add sub-path if provided
  if (subPath) {
    // Ensure sub-path starts with /
    const normalizedPath = subPath.startsWith("/") ? subPath : `/${subPath}`;
    url += normalizedPath;
  }
  
  // Add query parameters if provided
  if (queryParams && Object.keys(queryParams).length > 0) {
    const params = new URLSearchParams();
    
    Object.entries(queryParams).forEach(([key, value]) => {
      params.append(key, String(value));
    });
    
    url += `?${params.toString()}`;
  }
  
  return url;
}

/**
 * Generate Universal Link for NFT detail page
 * 
 * @param nftId - NFT identifier
 * @param queryParams - Optional query parameters (view, tab, ref)
 * @returns Universal Link to NFT page
 * 
 * @example
 * getNFTUniversalLink("abc123", { view: "detail", ref: "share" })
 * // Returns: https://farcaster.xyz/miniapps/12345/farbasenft/nft/abc123?view=detail&ref=share
 */
export function getNFTUniversalLink(
  nftId: string,
  queryParams?: Record<string, string | number | boolean>
): string {
  return generateUniversalLink(`/nft/${nftId}`, queryParams);
}

/**
 * Generate Universal Link for collection page
 * 
 * @param collectionId - Collection identifier
 * @param queryParams - Optional query parameters (sort, view)
 * @returns Universal Link to collection page
 * 
 * @example
 * getCollectionUniversalLink("xyz789", { sort: "recent" })
 * // Returns: https://farcaster.xyz/miniapps/12345/farbasenft/collection/xyz789?sort=recent
 */
export function getCollectionUniversalLink(
  collectionId: string,
  queryParams?: Record<string, string | number | boolean>
): string {
  return generateUniversalLink(`/collection/${collectionId}`, queryParams);
}

/**
 * Generate Universal Link for gallery page
 * 
 * @param queryParams - Optional query parameters (category, price, sort)
 * @returns Universal Link to gallery page
 * 
 * @example
 * getGalleryUniversalLink({ category: "art", price: "under-1-eth" })
 * // Returns: https://farcaster.xyz/miniapps/12345/farbasenft/gallery?category=art&price=under-1-eth
 */
export function getGalleryUniversalLink(
  queryParams?: Record<string, string | number | boolean>
): string {
  return generateUniversalLink("/gallery", queryParams);
}

/**
 * Generate Universal Link for leaderboard page
 * 
 * @param queryParams - Optional query parameters (sort, filter, timeframe)
 * @returns Universal Link to leaderboard page
 * 
 * @example
 * getLeaderboardUniversalLink({ sort: "xp", timeframe: "week" })
 * // Returns: https://farcaster.xyz/miniapps/12345/farbasenft/leaderboard?sort=xp&timeframe=week
 */
export function getLeaderboardUniversalLink(
  queryParams?: Record<string, string | number | boolean>
): string {
  return generateUniversalLink("/leaderboard", queryParams);
}

/**
 * Generate Universal Link for mint page
 * 
 * @param queryParams - Optional query parameters
 * @returns Universal Link to mint page
 * 
 * @example
 * getMintUniversalLink({ ref: "campaign" })
 * // Returns: https://farcaster.xyz/miniapps/12345/farbasenft/mint?ref=campaign
 */
export function getMintUniversalLink(
  queryParams?: Record<string, string | number | boolean>
): string {
  return generateUniversalLink("/mint", queryParams);
}

/**
 * Generate Universal Link for wallet demo page
 * 
 * @param queryParams - Optional query parameters
 * @returns Universal Link to wallet demo page
 */
export function getWalletDemoUniversalLink(
  queryParams?: Record<string, string | number | boolean>
): string {
  return generateUniversalLink("/wallet-demo", queryParams);
}

/**
 * Generate Universal Link for home page
 * 
 * @param queryParams - Optional query parameters (ref, campaign)
 * @returns Universal Link to home page
 * 
 * @example
 * getHomeUniversalLink({ ref: "twitter", campaign: "launch" })
 * // Returns: https://farcaster.xyz/miniapps/12345/farbasenft?ref=twitter&campaign=launch
 */
export function getHomeUniversalLink(
  queryParams?: Record<string, string | number | boolean>
): string {
  return generateUniversalLink("", queryParams);
}

/**
 * Parse query parameters from current URL (client-side only)
 * 
 * @returns Object with query parameters
 * 
 * @example
 * // URL: /nft/123?view=detail&ref=share
 * const params = parseUniversalLinkParams();
 * // Returns: { view: "detail", ref: "share" }
 */
export function parseUniversalLinkParams(): Record<string, string> {
  if (typeof window === "undefined") {
    return {};
  }
  
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(window.location.search);
  
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}

/**
 * Get the current page's Universal Link (client-side only)
 * 
 * @returns Universal Link for current page
 * 
 * @example
 * // Current URL: https://y-six-dun.vercel.app/nft/abc123?view=detail
 * getCurrentUniversalLink()
 * // Returns: https://farcaster.xyz/miniapps/12345/farbasenft/nft/abc123?view=detail
 */
export function getCurrentUniversalLink(): string {
  if (typeof window === "undefined") {
    return generateUniversalLink();
  }
  
  const pathname = window.location.pathname;
  const search = window.location.search;
  const params: Record<string, string> = {};
  
  if (search) {
    const searchParams = new URLSearchParams(search);
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
  }
  
  return generateUniversalLink(pathname, params);
}

/**
 * Check if Farcaster App ID is configured
 * 
 * @returns true if App ID is set and not placeholder
 */
export function isAppIdConfigured(): boolean {
  const appId = process.env.NEXT_PUBLIC_FARCASTER_APP_ID;
  return !!appId && appId !== "YOUR_APP_ID";
}

/**
 * Get the configured App ID (or placeholder)
 * 
 * @returns App ID string
 */
export function getConfiguredAppId(): string {
  return getAppId();
}
