"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCastShare } from "@/hooks/useCastShare";
import { fetchCastData, extractNFTsFromCast, formatCastText } from "@/lib/castShare";
import Link from "next/link";

/**
 * Share Page Client Component
 * 
 * Handles cast share extension functionality
 * Shows cast details and provides relevant actions
 */
export function SharePageClient() {
  const router = useRouter();
  const { isCastShare, params, cast, isLoading, error } = useCastShare();
  const [castData, setCastData] = useState<any>(null);
  const [fetchingCast, setFetchingCast] = useState(false);

  // Fetch additional cast data from Neynar if needed
  useEffect(() => {
    async function loadCastData() {
      if (params && !cast && !fetchingCast) {
        setFetchingCast(true);
        const data = await fetchCastData(params.castHash);
        setCastData(data);
        setFetchingCast(false);
      }
    }

    loadCastData();
  }, [params, cast, fetchingCast]);

  // Loading state
  if (isLoading || fetchingCast) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
          <p className="text-slate-400">Loading shared cast...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="max-w-md text-center">
          <div className="mb-4 text-6xl">⚠️</div>
          <h1 className="mb-2 text-2xl font-bold text-white">Error Loading Cast</h1>
          <p className="mb-6 text-slate-400">{error.message}</p>
          <button
            onClick={() => router.push("/")}
            className="rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-white hover:bg-cyan-400"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Not a cast share context
  if (!isCastShare || (!params && !cast)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="max-w-md text-center">
          <div className="mb-4 text-6xl">📋</div>
          <h1 className="mb-2 text-2xl font-bold text-white">No Cast Shared</h1>
          <p className="mb-6 text-slate-400">
            This page is for viewing casts shared from Farcaster. Share a cast to farbasenft to see it here!
          </p>
          <button
            onClick={() => router.push("/")}
            className="rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-white hover:bg-cyan-400"
          >
            Browse Gallery
          </button>
        </div>
      </div>
    );
  }

  // Use SDK cast data or fetched data
  const displayCast = cast || castData;
  const authorFid = cast?.author.fid || params?.castFid;
  const authorUsername = cast?.author.username || castData?.author?.username;
  const authorPfp = cast?.author.pfpUrl || castData?.author?.pfp_url;
  const castText = cast?.text || castData?.text || "";
  const castEmbeds = cast?.embeds || castData?.embeds?.map((e: any) => e.url) || [];
  const channelKey = cast?.channelKey || castData?.channel?.id;

  // Extract NFT IDs from embeds
  const nftIds = extractNFTsFromCast(castEmbeds);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="mb-4 inline-flex items-center text-cyan-400 hover:text-cyan-300"
          >
            ← Back to Gallery
          </Link>
          <h1 className="text-3xl font-bold text-white">Shared Cast</h1>
          <p className="mt-2 text-slate-400">Cast shared via Farcaster</p>
        </div>

        {/* Cast Card */}
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
          {/* Author */}
          <div className="mb-4 flex items-center gap-3">
            {authorPfp ? (
              <img
                src={authorPfp}
                alt={authorUsername || `User ${authorFid}`}
                className="h-12 w-12 rounded-full"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 text-xl font-bold text-white">
                {authorUsername?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            <div>
              <div className="font-semibold text-white">
                {authorUsername ? `@${authorUsername}` : `FID ${authorFid}`}
              </div>
              {channelKey && (
                <div className="text-sm text-slate-400">
                  Posted in /{channelKey}
                </div>
              )}
            </div>
          </div>

          {/* Cast Text */}
          <div className="mb-4 whitespace-pre-wrap text-slate-200">
            {formatCastText(castText)}
          </div>

          {/* Cast Info */}
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <div>Cast Hash: {params?.castHash.substring(0, 10)}...</div>
            {params?.viewerFid && <div>Shared by FID {params.viewerFid}</div>}
          </div>
        </div>

        {/* NFT References */}
        {nftIds.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-4 text-xl font-bold text-white">Referenced NFTs</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {nftIds.map((nftId) => (
                <Link
                  key={nftId}
                  href={`/nft/${nftId}`}
                  className="rounded-lg border border-slate-800 bg-slate-900 p-4 transition-colors hover:border-cyan-500"
                >
                  <div className="text-cyan-400">View NFT</div>
                  <div className="mt-1 text-sm text-slate-400">ID: {nftId}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={() => {
              // Navigate to author's profile or collection
              if (authorUsername) {
                router.push(`/gallery?author=${authorUsername}`);
              } else {
                router.push("/gallery");
              }
            }}
            className="flex-1 rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-white hover:bg-cyan-400"
          >
            {authorUsername ? `View ${authorUsername}'s NFTs` : "Browse Gallery"}
          </button>

          <button
            onClick={() => router.push("/mint")}
            className="flex-1 rounded-lg border border-cyan-500 px-6 py-3 font-semibold text-cyan-400 hover:bg-cyan-500/10"
          >
            Mint NFT
          </button>
        </div>

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === "development" && (
          <details className="mt-8 rounded-lg border border-slate-800 bg-slate-900 p-4">
            <summary className="cursor-pointer font-semibold text-white">
              Debug Info
            </summary>
            <pre className="mt-4 overflow-x-auto text-xs text-slate-400">
              {JSON.stringify(
                {
                  isCastShare,
                  params,
                  cast,
                  castData,
                  nftIds,
                },
                null,
                2
              )}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
