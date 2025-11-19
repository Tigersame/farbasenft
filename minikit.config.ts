const ROOT_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const minikitConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: "",
  },
  miniapp: {
    version: "1",
    name: "farbasenft",
    subtitle: "Digital art reimagined",
    description:
      "Curated NFT showcases, timed auctions, and artist-first storytelling inspired by Foundation.",
    screenshotUrls: [
      `${ROOT_URL}/splash.svg`,
      "https://placehold.co/1080x1920/png?text=Farbasenft+Preview",
    ],
    iconUrl: `${ROOT_URL}/icon.svg`,
    splashImageUrl: `${ROOT_URL}/splash.svg`,
    splashBackgroundColor: "#030712",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "art",
    tags: ["nft", "auctions", "art", "foundation-clone"],
    heroImageUrl: `${ROOT_URL}/hero.svg`,
    tagline: "Curators meet collectors",
    ogTitle: "farbasenft",
    ogDescription:
      "A boutique NFT marketplace experience crafted for Base mini apps.",
    ogImageUrl: `${ROOT_URL}/hero.svg`,
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