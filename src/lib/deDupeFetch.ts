/**
 * Request Deduplication Utility
 * Prevents duplicate requests from being made simultaneously
 */

type RequestPromise = Promise<Response>;
const requestCache = new Map<string, RequestPromise>();

/**
 * Deduplicated fetch - prevents multiple identical requests in flight
 */
export async function deDuplicatedFetch(
  url: string,
  options?: RequestInit & { dedupeKey?: string }
): Promise<Response> {
  const dedupeKey = options?.dedupeKey || url;

  // If a request for this key is already in flight, wait for it
  if (requestCache.has(dedupeKey)) {
    return requestCache.get(dedupeKey)!;
  }

  // Make the request and cache the promise
  const promise = fetch(url, options).finally(() => {
    // Remove from cache after request completes
    requestCache.delete(dedupeKey);
  });

  requestCache.set(dedupeKey, promise);
  return promise;
}

/**
 * Clear all cached requests
 */
export function clearRequestCache() {
  requestCache.clear();
}
