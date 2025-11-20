const ROOT_URL =
  (process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "").trim()) ?? "http://localhost:3000";

// Domain migration support
// Set NEXT_PUBLIC_CANONICAL_DOMAIN to migrate to a new domain
// Example: "new-domain.com" (no protocol, port, or path)
const CANONICAL_DOMAIN = process.env.NEXT_PUBLIC_CANONICAL_DOMAIN;

export const minikitConfig = {
  // Account association is optional for testing
  // For production, generate using: npx @farcaster/miniapp-cli setup
  accountAssociation: process.env.FARCASTER_PAYLOAD && process.env.FARCASTER_SIGNATURE
    ? {
        header: process.env.FARCASTER_HEADER || "farcaster-miniapp",
        payload: process.env.FARCASTER_PAYLOAD,
        signature: process.env.FARCASTER_SIGNATURE,
      }
    : undefined,
  miniapp: {
    version: "1",
    // REQUIRED: Clear, descriptive app name for discovery
    name: "farbasenft",
    subtitle: "Digital art reimagined",
    
    // REQUIRED: Detailed description for search indexing
    // Must be clear about what the app does for users
    description:
      "Discover and collect unique NFTs on Base blockchain. Create digital art, trade in curated marketplaces, earn XP rewards, and claim exclusive soulbound tokens. Foundation-inspired design with seamless Farcaster integration.",
    
    screenshotUrls: [
      `${ROOT_URL}/splash.svg`,
      "https://placehold.co/1080x1920/png?text=Farbasenft+Preview",
    ],
    
    // REQUIRED: Working image URL that returns image/* content-type
    iconUrl: `${ROOT_URL}/icon.svg`,
    splashImageUrl: `${ROOT_URL}/splash.svg`,
    splashBackgroundColor: "#030712",
    
    // REQUIRED: Production domain (not ngrok/replit/localtunnel)
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    
    // Share Extension - Allow users to share casts to the app
    castShareUrl: `${ROOT_URL}/share`,
    
    // Categorization for directory listing
    primaryCategory: "art",
    tags: ["nft", "marketplace", "art", "blockchain", "base", "collectibles"],
    
    heroImageUrl: `${ROOT_URL}/hero.svg`,
    tagline: "Curators meet collectors",
    
    // SEO optimization fields
    ogTitle: "farbasenft - NFT Marketplace on Base",
    ogDescription:
      "Create, discover, and trade NFTs on Base. Earn XP, unlock achievements, and build your collection with Farcaster-native marketplace.",
    ogImageUrl: `${ROOT_URL}/hero.svg`,
    
    // Discovery optimization - ensure indexing enabled
    noindex: false, // Allow search engine indexing
    
    // Domain migration support
    // If migrating to a new domain, set NEXT_PUBLIC_CANONICAL_DOMAIN
    // Format: "new-domain.com" (no protocol, port, or path)
    ...(CANONICAL_DOMAIN && { canonicalDomain: CANONICAL_DOMAIN }),
  },
} as const;

export type MiniKitConfig = typeof minikitConfig;

export const getMiniAppManifest = () => {
  const {
    accountAssociation,
    miniapp: { screenshotUrls, ...miniapp },
  } = minikitConfig;

  return {
    ...miniapp,
    screenshot_urls: screenshotUrls,
    accountAssociation,
  };
};