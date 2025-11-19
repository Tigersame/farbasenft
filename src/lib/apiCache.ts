/**
 * API Response Caching Utility
 * Adds proper cache headers to API responses to reduce rate limiting
 */

export function getCacheHeaders(maxAge: number = 300) {
  return {
    'Cache-Control': `public, max-age=${maxAge}, s-maxage=${maxAge}`,
    'CDN-Cache-Control': `max-age=${maxAge}`,
  };
}

export function getNoCacheHeaders() {
  return {
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  };
}

/**
 * Short cache: 1 minute (prices, balances)
 */
export const CACHE_1MIN = getCacheHeaders(60);

/**
 * Medium cache: 5 minutes (NFT metadata, user stats)
 */
export const CACHE_5MIN = getCacheHeaders(300);

/**
 * Long cache: 1 hour (static data)
 */
export const CACHE_1HR = getCacheHeaders(3600);

/**
 * No cache: For sensitive operations (transactions, auth)
 */
export const CACHE_NONE = getNoCacheHeaders();
