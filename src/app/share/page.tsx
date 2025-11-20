import { Suspense } from "react";
import { Metadata } from "next";
import { SharePageClient } from "./SharePageClient";

export const metadata: Metadata = {
  title: "Shared Cast - farbasenft",
  description: "View shared Farcaster cast on farbasenft NFT marketplace",
  openGraph: {
    title: "Shared Cast - farbasenft",
    description: "View shared Farcaster cast",
    type: "website",
  },
  other: {
    "fc:frame": "vNext",
    "fc:miniapp:domain": process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, "") || "localhost:3000",
  },
};

/**
 * Share Extension Page
 * 
 * Receives casts shared via Farcaster share sheet
 * URL format: /share?castHash=0x...&castFid=123&viewerFid=456
 * 
 * @see https://miniapps.farcaster.xyz/docs/guides/share-extension
 */
export default function SharePage() {
  return (
    <Suspense fallback={<SharePageLoading />}>
      <SharePageClient />
    </Suspense>
  );
}

function SharePageLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
        <p className="text-slate-400">Loading shared cast...</p>
      </div>
    </div>
  );
}
