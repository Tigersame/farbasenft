"use client";

/**
 * Client-side sharing utilities for Farcaster
 * 
 * Provides easy-to-use functions for sharing content to Farcaster
 */

/**
 * Share URL to Farcaster
 * Opens Warpcast composer with pre-filled URL
 */
export function shareToFarcaster(url: string, text?: string) {
  const castText = text ? encodeURIComponent(text) : '';
  const castUrl = encodeURIComponent(url);
  
  // Warpcast composer URL
  const composerUrl = `https://warpcast.com/~/compose?text=${castText}&embeds[]=${castUrl}`;
  
  // Open in new window
  window.open(composerUrl, '_blank', 'width=600,height=800');
}

/**
 * Copy URL to clipboard for sharing
 */
export async function copyToClipboard(url: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Use native share API if available
 */
export async function nativeShare(data: ShareData): Promise<boolean> {
  if (!navigator.share) {
    return false;
  }
  
  try {
    await navigator.share(data);
    return true;
  } catch (error) {
    // User cancelled or error occurred
    console.log('Share cancelled or failed:', error);
    return false;
  }
}

/**
 * Share with fallback strategy
 * 1. Try native share
 * 2. Try Farcaster compose
 * 3. Copy to clipboard
 */
export async function shareWithFallback(
  url: string,
  title: string,
  text?: string
): Promise<'native' | 'farcaster' | 'clipboard' | 'failed'> {
  // Try native share first
  const nativeSuccess = await nativeShare({ url, title, text });
  if (nativeSuccess) return 'native';
  
  // Check if we're in Farcaster context
  const isFarcaster = typeof window !== 'undefined' && 
    (window.location.href.includes('warpcast.com') || 
     window.location.href.includes('farcaster.xyz'));
  
  if (isFarcaster) {
    shareToFarcaster(url, text);
    return 'farcaster';
  }
  
  // Fallback to clipboard
  const clipboardSuccess = await copyToClipboard(url);
  return clipboardSuccess ? 'clipboard' : 'failed';
}
