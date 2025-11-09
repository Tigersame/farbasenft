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
    description: "A lightning study of motion blur captured on volumetric film.",
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
  {
    id: "prism-rhapsody",
    title: "Prism Rhapsody",
    artist: "HexaMuse",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    category: "auction",
    reserve: "0.92 ETH",
    currentBid: "0.61 ETH",
    endsIn: "1h 14m",
    description: "Iridescent shards forming a constantly shifting light field.",
  },
  {
    id: "lunar-waves",
    title: "Lunar Waves",
    artist: "Selene Roche",
    image:
      "https://images.unsplash.com/photo-1511295742361-04b3b4ee84b5?auto=format&fit=crop&w=900&q=80",
    category: "reserve",
    reserve: "0.68 ETH",
    currentBid: "0.40 ETH",
    endsIn: "2h 02m",
    description: "Moonlit tides rendered as volumetric noise simulations.",
  },
  {
    id: "neon-mirage",
    title: "Neon Mirage",
    artist: "Circuit Bloom",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=80",
    category: "buy-now",
    reserve: "0.29 ETH",
    currentBid: "List",
    endsIn: "Limited edition",
    description: "Glowing cityscapes diffused through glitch tinted lenses.",
  },
  {
    id: "ether-bloom",
    title: "Ether Bloom",
    artist: "Mara Field",
    image:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80",
    category: "auction",
    reserve: "1.45 ETH",
    currentBid: "1.12 ETH",
    endsIn: "38m",
    description: "Fractal florals evolving in sync with onchain price feeds.",
  },
  {
    id: "spectral-horizon",
    title: "Spectral Horizon",
    artist: "Orbit Vale",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    category: "reserve",
    reserve: "0.88 ETH",
    currentBid: "0.57 ETH",
    endsIn: "1h 48m",
    description: "Horizons refracted through atmospheric spectral scans.",
  },
  {
    id: "velvet-shards",
    title: "Velvet Shards",
    artist: "Dusk Atelier",
    image:
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=900&q=80",
    category: "auction",
    reserve: "0.64 ETH",
    currentBid: "0.44 ETH",
    endsIn: "3h 03m",
    description: "Soft gradients overlaid on crystalline subdivisions.",
  },
  {
    id: "starlit-arcade",
    title: "Starlit Arcade",
    artist: "Pixel Nomad",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    category: "buy-now",
    reserve: "0.47 ETH",
    currentBid: "List",
    endsIn: "Claim anytime",
    description: "Retro game cabinets reimagined as nebula powered portals.",
  },
  {
    id: "cascade-signal",
    title: "Cascade Signal",
    artist: "Vera Nix",
    image:
      "https://images.unsplash.com/photo-1468413253725-0d5181091126?auto=format&fit=crop&w=900&q=80",
    category: "reserve",
    reserve: "0.51 ETH",
    currentBid: "0.33 ETH",
    endsIn: "5h 10m",
    description: "Layered signal interference stabilized into fluid canvases.",
  },
  {
    id: "chroma-odyssey",
    title: "Chroma Odyssey",
    artist: "Atlas Quinn",
    image:
      "https://images.unsplash.com/photo-1487412720507-209d3a3c7cff?auto=format&fit=crop&w=900&q=80",
    category: "auction",
    reserve: "1.05 ETH",
    currentBid: "0.89 ETH",
    endsIn: "22m",
    description: "Travelogues captured via color shifting satellite payloads.",
  },
  {
    id: "kinetic-veil",
    title: "Kinetic Veil",
    artist: "Flux Weaver",
    image:
      "https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=900&q=80",
    category: "reserve",
    reserve: "0.62 ETH",
    currentBid: "0.36 ETH",
    endsIn: "Reserve unbroken",
    description: "Motion captured fabrics decoded into particle illusions.",
  },
  {
    id: "twilight-synthesis",
    title: "Twilight Synthesis",
    artist: "Noir Cycle",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80",
    category: "auction",
    reserve: "1.22 ETH",
    currentBid: "0.98 ETH",
    endsIn: "1h 07m",
    description: "Day night gradients fused via generative adversarial skylines.",
  },
  {
    id: "polygon-waltz",
    title: "Polygon Waltz",
    artist: "Polyphonic",
    image:
      "https://images.unsplash.com/photo-1447433819943-74a20887a81e?auto=format&fit=crop&w=900&q=80",
    category: "buy-now",
    reserve: "0.41 ETH",
    currentBid: "List",
    endsIn: "Edition of 99",
    description: "Tessellated choreography mapped to onchain tempo signals.",
  },
  {
    id: "radiant-echo",
    title: "Radiant Echo",
    artist: "Orbit Sun",
    image:
      "https://images.unsplash.com/photo-1468276311594-df7cb65d8df6?auto=format&fit=crop&w=900&q=80",
    category: "reserve",
    reserve: "0.58 ETH",
    currentBid: "0.29 ETH",
    endsIn: "6h 18m",
    description: "Echo location data transformed into luminous shockwaves.",
  },
  {
    id: "glitch-serenade",
    title: "Glitch Serenade",
    artist: "Null Poet",
    image:
      "https://images.unsplash.com/photo-1526481280695-3c46975f15f5?auto=format&fit=crop&w=900&q=80",
    category: "auction",
    reserve: "0.73 ETH",
    currentBid: "0.51 ETH",
    endsIn: "49m",
    description: "Broken codecs singing in symphonic error states.",
  },
  {
    id: "crystalline-thread",
    title: "Crystalline Thread",
    artist: "Opal Ren",
    image:
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=900&q=80",
    category: "reserve",
    reserve: "0.46 ETH",
    currentBid: "0.27 ETH",
    endsIn: "3h 55m",
    description: "Glasslike filaments weaving through zero gravity looms.",
  },
  {
    id: "astral-voyager",
    title: "Astral Voyager",
    artist: "Rhea Sol",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    category: "auction",
    reserve: "1.60 ETH",
    currentBid: "1.28 ETH",
    endsIn: "12m",
    description: "Deep space telemetry reinterpreted as cosmic oil paintings.",
  },
  {
    id: "ember-portrait",
    title: "Ember Portrait",
    artist: "Coal Vis",
    image:
      "https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=900&q=80",
    category: "buy-now",
    reserve: "0.34 ETH",
    currentBid: "List",
    endsIn: "Flash sale",
    description: "Charcoal rendered avatars lit by ember glow shaders.",
  },
  {
    id: "sonic-mosaic",
    title: "Sonic Mosaic",
    artist: "Echo Grid",
    image:
      "https://images.unsplash.com/photo-1487412720507-209d3a3c7cff?auto=format&fit=crop&w=900&q=80",
    category: "reserve",
    reserve: "0.69 ETH",
    currentBid: "0.43 ETH",
    endsIn: "2h 27m",
    description: "Audio waveforms tessellated into shifting mosaic murals.",
  },
  {
    id: "luminous-reverie",
    title: "Luminous Reverie",
    artist: "Halo Drift",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80",
    category: "auction",
    reserve: "0.99 ETH",
    currentBid: "0.74 ETH",
    endsIn: "1h 36m",
    description: "Dreamscapes rendered in bioluminescent watercolor fields.",
  },
  {
    id: "vapor-cascade",
    title: "Vapor Cascade",
    artist: "Nimbus Rae",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80",
    category: "reserve",
    reserve: "0.52 ETH",
    currentBid: "0.28 ETH",
    endsIn: "7h 05m",
    description: "Condensed vapor trails sequenced into cascading palettes.",
  },
  {
    id: "circuit-bloom",
    title: "Circuit Bloom",
    artist: "Byte Garden",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    category: "buy-now",
    reserve: "0.45 ETH",
    currentBid: "List",
    endsIn: "Open access",
    description: "Printed circuit boards blossoming into neon flora.",
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
    body: "farbasenft mini app is optimized for the Base app—post a cast with any drop URL to generate rich embeds and invite live bidding.",
  },
];


