import { NextResponse } from "next/server";
import { minikitConfig } from "@/lib/minikit.config";

export async function GET() {
  const manifest: {
    accountAssociation?: {
      header: string;
      payload: string;
      signature: string;
    };
    baseBuilder?: {
      ownerAddress: string;
    };
    miniapp: {
      version: string;
      name: string;
      homeUrl: string;
      iconUrl: string;
      splashImageUrl: string;
      splashBackgroundColor: string;
      webhookUrl?: string;
      subtitle?: string;
      description?: string;
      screenshotUrls?: string[];
      primaryCategory: string;
      tags: string[];
      heroImageUrl?: string;
      tagline?: string;
      ogTitle?: string;
      ogDescription?: string;
      ogImageUrl?: string;
      noindex?: boolean;
      castShareUrl?: string;
      canonicalDomain?: string;
    };
  } = {
    // Account association is optional for testing
    ...(process.env.FARCASTER_PAYLOAD && process.env.FARCASTER_SIGNATURE
      ? {
          accountAssociation: {
            header: process.env.FARCASTER_HEADER || "farcaster-miniapp",
            payload: process.env.FARCASTER_PAYLOAD,
            signature: process.env.FARCASTER_SIGNATURE,
          },
        }
      : {}),
    ...(process.env.BASE_BUILDER_OWNER_ADDRESS
      ? {
          baseBuilder: {
            ownerAddress: process.env.BASE_BUILDER_OWNER_ADDRESS,
          },
        }
      : {}),
    miniapp: {
      version: minikitConfig.miniapp.version || "1",
      name: minikitConfig.miniapp.name,
      homeUrl: minikitConfig.miniapp.homeUrl,
      iconUrl: minikitConfig.miniapp.iconUrl,
      splashImageUrl: minikitConfig.miniapp.splashImageUrl,
      splashBackgroundColor: minikitConfig.miniapp.splashBackgroundColor,
      webhookUrl: process.env.FARCASTER_WEBHOOK_URL || `${minikitConfig.miniapp.homeUrl}/api/webhook`,
      subtitle: minikitConfig.miniapp.subtitle || "Foundation-inspired NFT gallery",
      description: minikitConfig.miniapp.description,
      screenshotUrls: minikitConfig.miniapp.screenshotUrls ? [...minikitConfig.miniapp.screenshotUrls] : [],
      primaryCategory: minikitConfig.miniapp.primaryCategory || "art",
      tags: minikitConfig.miniapp.tags ? [...minikitConfig.miniapp.tags] : ["nft", "art", "auctions", "base"],
      heroImageUrl: minikitConfig.miniapp.heroImageUrl,
      tagline: minikitConfig.miniapp.tagline || "Where onchain curators meet collectors.",
      ogTitle: minikitConfig.miniapp.name,
      ogDescription: minikitConfig.miniapp.description,
      ogImageUrl: minikitConfig.miniapp.heroImageUrl,
      noindex: process.env.NODE_ENV !== "production",
    },
  };

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

