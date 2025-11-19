import { NextRequest, NextResponse } from 'next/server';
import { CACHE_1MIN } from '@/lib/apiCache';

// Mock NFT data - replace with real database queries
const mockNFTs = [
  {
    tokenId: '1',
    id: '1',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&h=600&fit=crop',
    name: 'Cosmic Dreams #001',
    title: 'Cosmic Dreams #001',
    collection: 'Cosmic Collection',
    collectionAvatar: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=100&h=100&fit=crop',
    collectionBanner: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1200&h=200&fit=crop',
    creator: 'ArtistDAO',
    price: '0.05',
    likes: 142,
    category: 'trending',
    rarity: 'Rare',
  },
  {
    tokenId: '2',
    id: '2',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&h=600&fit=crop',
    name: 'Neural Network',
    title: 'Neural Network',
    collection: 'AI Art',
    creator: 'CryptoCreator',
    price: '0.08',
    likes: 89,
    category: 'hot',
    rarity: 'Epic',
  },
  {
    tokenId: '3',
    id: '3',
    image: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=800&h=600&fit=crop',
    name: 'Base Vibes',
    title: 'Base Vibes',
    collection: 'Base Originals',
    creator: 'BaseBuilder',
    price: '0.03',
    likes: 256,
    category: 'trending',
  },
  {
    tokenId: '4',
    id: '4',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop',
    name: 'Farcaster Frame',
    title: 'Farcaster Frame',
    collection: 'Frame Art',
    creator: 'FrameMaker',
    price: '0.12',
    likes: 178,
    category: 'new',
    rarity: 'Legendary',
  },
  {
    tokenId: '5',
    id: '5',
    image: 'https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=800&h=600&fit=crop',
    name: 'Onchain Summer',
    title: 'Onchain Summer',
    collection: 'Summer Vibes',
    creator: 'SummerDAO',
    price: '0.06',
    likes: 312,
    category: 'hot',
  },
  {
    tokenId: '6',
    id: '6',
    image: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=800&h=600&fit=crop',
    name: 'Meta Mint',
    title: 'Meta Mint',
    collection: 'Meta Series',
    creator: 'MetaArtist',
    price: '0.15',
    likes: 95,
    category: 'live',
  },
  {
    tokenId: '7',
    id: '7',
    image: 'https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=800&h=600&fit=crop',
    name: 'Digital Horizon',
    title: 'Digital Horizon',
    collection: 'Horizon Collection',
    creator: 'HorizonDAO',
    price: '0.07',
    likes: 201,
    category: 'trending',
  },
  {
    tokenId: '8',
    id: '8',
    image: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=800&h=600&fit=crop',
    name: 'Pixel Paradise',
    title: 'Pixel Paradise',
    collection: 'Pixel Art',
    creator: 'PixelMaster',
    price: '0.04',
    likes: 167,
    category: 'new',
  },
  {
    tokenId: '9',
    id: '9',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&h=600&fit=crop',
    name: 'Quantum Leap',
    title: 'Quantum Leap',
    collection: 'Quantum Series',
    creator: 'QuantumLab',
    price: '0.20',
    likes: 423,
    category: 'hot',
    rarity: 'Legendary',
  },
  {
    tokenId: '10',
    id: '10',
    image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&h=600&fit=crop',
    name: 'Blockchain Bliss',
    title: 'Blockchain Bliss',
    collection: 'Bliss Collection',
    creator: 'BlissCreator',
    price: '0.09',
    likes: 134,
    category: 'live',
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tab = searchParams.get('tab') || 'trending';

    // Filter by category
    let filteredNFTs = mockNFTs;
    if (tab !== 'trending') {
      filteredNFTs = mockNFTs.filter((nft) => nft.category === tab);
    }

    // Sort by likes for trending
    if (tab === 'trending') {
      filteredNFTs = [...mockNFTs].sort((a, b) => b.likes - a.likes);
    }

    // Use 10-minute cache to prevent rate limiting
    const cacheHeaders = {
      'Cache-Control': 'public, max-age=600, s-maxage=600', // 10 minutes
      'CDN-Cache-Control': 'max-age=600',
    };

    return NextResponse.json({
      items: filteredNFTs,
      success: true,
    }, { headers: cacheHeaders });
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NFTs', success: false },
      { status: 500 }
    );
  }
}
