/**
 * Utilities for generating fc:miniapp embeds for Farcaster sharing
 * 
 * Reference: https://miniapps.farcaster.xyz/docs/guides/sharing
 * 
 * Creates rich cards that users can share in Farcaster feeds
 */

export interface MiniAppEmbedAction {
  type: "launch_miniapp" | "launch_frame";
  url?: string;
  name?: string;
  splashImageUrl?: string;
  splashBackgroundColor?: string;
}

export interface MiniAppEmbedButton {
  title: string;
  action: MiniAppEmbedAction;
}

export interface MiniAppEmbed {
  version: "1";
  imageUrl: string;
  button: MiniAppEmbedButton;
}

/**
 * Validate embed data
 */
function validateEmbed(embed: MiniAppEmbed): boolean {
  // Check version
  if (embed.version !== "1") return false;

  // Check imageUrl
  if (!embed.imageUrl || typeof embed.imageUrl !== "string") return false;
  if (embed.imageUrl.length > 1024) return false;

  // Check button title
  if (!embed.button?.title || typeof embed.button.title !== "string") return false;
  if (embed.button.title.length > 32) return false;

  // Check action type
  if (
    !embed.button.action?.type ||
    (embed.button.action.type !== "launch_miniapp" &&
      embed.button.action.type !== "launch_frame")
  ) {
    return false;
  }

  // Check optional URL if provided
  if (embed.button.action.url && embed.button.action.url.length > 1024) {
    return false;
  }

  return true;
}

/**
 * Generate fc:miniapp embed for Farcaster sharing
 * 
 * @param imageUrl - 3:2 aspect ratio image (600x400 minimum, PNG recommended)
 * @param buttonTitle - CTA text (max 32 chars)
 * @param appName - Application name (defaults to FarcastMints)
 * @param actionUrl - URL to open when button clicked (optional, defaults to current URL)
 * @param splashImageUrl - Splash screen image (optional, defaults to manifest value)
 * @param splashBg - Splash background color hex (optional, defaults to #030712)
 * 
 * @returns Stringified JSON for meta tag content
 */
export function generateMiniAppEmbed(
  imageUrl: string,
  buttonTitle: string,
  appName: string = "FarcastMints",
  actionUrl?: string,
  splashImageUrl?: string,
  splashBg?: string
): string {
  const embed: MiniAppEmbed = {
    version: "1",
    imageUrl,
    button: {
      title: buttonTitle,
      action: {
        type: "launch_miniapp",
        ...(actionUrl && { url: actionUrl }),
        ...(appName && { name: appName }),
        ...(splashImageUrl && { splashImageUrl }),
        ...(splashBg && { splashBackgroundColor: splashBg }),
      },
    },
  };

  if (!validateEmbed(embed)) {
    console.error("Invalid embed configuration:", embed);
    throw new Error("Invalid MiniApp embed configuration");
  }

  return JSON.stringify(embed);
}

/**
 * Generate embed for NFT listing
 */
export function generateNFTEmbedMeta(
  nftName: string,
  nftImage: string,
  nftPrice: string,
  collectionName: string,
  detailUrl: string
): string {
  const buttonTitle = `View ${nftName || "NFT"}`;
  const appName = `FarcastMints - ${collectionName}`;

  return generateMiniAppEmbed(
    nftImage,
    buttonTitle,
    appName,
    detailUrl,
    "https://farbasenft.xyz/splash.svg",
    "#030712"
  );
}

/**
 * Generate embed for collection
 */
export function generateCollectionEmbedMeta(
  collectionName: string,
  collectionImage: string,
  floorPrice: string,
  collectionUrl: string
): string {
  const buttonTitle = `Explore ${collectionName}`;

  return generateMiniAppEmbed(
    collectionImage,
    buttonTitle,
    `FarcastMints - ${collectionName}`,
    collectionUrl,
    "https://farbasenft.xyz/splash.svg",
    "#030712"
  );
}

/**
 * Generate embed for leaderboard
 */
export function generateLeaderboardEmbedMeta(
  title: string,
  imageUrl: string,
  leaderboardUrl: string
): string {
  return generateMiniAppEmbed(
    imageUrl,
    "View Rankings",
    `FarcastMints - ${title}`,
    leaderboardUrl,
    "https://farbasenft.xyz/splash.svg",
    "#030712"
  );
}

/**
 * For backward compatibility with Frames v1
 * Generates launch_frame type instead of launch_miniapp
 */
export function generateFrameEmbed(
  imageUrl: string,
  buttonTitle: string,
  appName: string = "FarcastMints",
  actionUrl?: string,
  splashImageUrl?: string,
  splashBg?: string
): string {
  const embed: MiniAppEmbed = {
    version: "1",
    imageUrl,
    button: {
      title: buttonTitle,
      action: {
        type: "launch_frame",
        ...(actionUrl && { url: actionUrl }),
        ...(appName && { name: appName }),
        ...(splashImageUrl && { splashImageUrl }),
        ...(splashBg && { splashBackgroundColor: splashBg }),
      },
    },
  };

  return JSON.stringify(embed);
}
