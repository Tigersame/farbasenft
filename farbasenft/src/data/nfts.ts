export type NFT = {
  id: string;
  title: string;
  artist: string;
  image: string;
  category: "auction" | "buy-now" | "reserve";
  reserve: string;
  currentBid: string;
  endsIn: string;
  description: string;
};

export const heroDrop: NFT = {
  id: "chromatic-dreams",
  title: "Chromatic Dreams",
  artist: "LumenFlow",
  image:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  category: "auction",
  reserve: "1.25 ETH",
  currentBid: "0.88 ETH",
  endsIn: "2h 12m",
  description:
    "A meditation on light, motion, and collective memory rendered as a living gradient sculpture.",
};

export const trendingDrops: NFT[] = [
  {
    id: "aurora-veil",
    title: "Aurora Veil",
    artist: "Nova Reyes",
    image:
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=900&q=80",
    category: "reserve",
    reserve: "0.75 ETH",
    currentBid: "0.42 ETH",
    endsIn: "Reserve met",
    description: "Iridescent fragments stitched into a cosmic tapestry.",
  },
  {
    id: "silk-echoes",
    title: "Silk Echoes",
    artist: "Atari Bloom",
    image:
      "https://images.unsplash.com/photo-1517816428104-797678c7cf0c?auto=format&fit=crop&w=900&q=80",
    category: "auction",
    reserve: "1.10 ETH",
    currentBid: "0.95 ETH",
    endsIn: "58m",
    description: "Audio-reactive drapery translating ambient sound into light.",
  },
  {
    id: "fractured-pulse",
    title: "Fractured Pulse",
    artist: "Koda",
    image:
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=900&q=80",
    category: "buy-now",
    reserve: "0.38 ETH",
    currentBid: "List",
    endsIn: "Open edition",
    description: "A lightning study of motion-blur captured on volumetric film.",
  },
  {
    id: "coral-sonata",
    title: "Coral Sonata",
    artist: "Marian Tide",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80",
    category: "reserve",
    reserve: "0.55 ETH",
    currentBid: "0.31 ETH",
    endsIn: "4h 21m",
    description:
      "Organic simulations of reef ecosystems bursting with synthetic color.",
  },
];

export const curatorNotes = [
  {
    title: "Collector Briefing",
    body: "Reserve-triggered auctions reactivate once bids surpass the artist's target. Keep a watchlist to receive Base notifications when drops go live.",
  },
  {
    title: "Behind the Scenes",
    body: "Each featured drop includes backstage interviews, process videos, and studio stills to bring collectors closer to the artists they back.",
  },
  {
    title: "Farcaster Native",
    body: "farbasenft mini app is optimized for the Base app - post a cast with any drop URL to generate rich embeds and invite live bidding.",
  },
];