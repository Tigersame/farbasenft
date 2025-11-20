import type { Metadata } from 'next';
import { generateNFTEmbedMeta } from '@/lib/embedMetadata';
import NFTDetailPageClient from './client';

interface NFTDetailPageProps {
  params: Promise<{ id: string }>;
}

// Server component - handles metadata only
export async function generateMetadata(
  props: NFTDetailPageProps
): Promise<Metadata> {
  const params = await props.params;
  const mockNFTs = [
    { id: 'chromatic-dreams', name: 'Chromatic Dreams', collection: 'Lumen Flow', artist: 'Alex Chen', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop', price: '1.25' },
    { id: 'aurora-veil', name: 'Aurora Veil', collection: 'Nova Reyes', artist: 'Maya Singh', image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&h=600&fit=crop', price: '0.75' },
    { id: 'silk-echoes', name: 'Silk Echoes', collection: 'Atari Bloom', artist: 'Jordan Lee', image: 'https://images.unsplash.com/photo-1517816428104-797678c7cf0c?w=800&h=600&fit=crop', price: '1.10' },
  ];
  const nft = mockNFTs.find((n) => n.id === params.id);

  if (!nft) {
    return { title: 'NFT Not Found', description: 'This NFT does not exist' };
  }

  const ROOT_URL = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
  const detailUrl = `${ROOT_URL}/nft/${params.id}`;
  
  // Use dynamic OG image API for better sharing
  const ogImageUrl = `${ROOT_URL}/api/og/nft?name=${encodeURIComponent(nft.name)}&price=${nft.price}&collection=${encodeURIComponent(nft.collection)}&artist=${encodeURIComponent(nft.artist || '')}&image=${encodeURIComponent(nft.image)}`;
  
  // Generate Farcaster embed metadata
  const embedJson = generateNFTEmbedMeta(nft.name, ogImageUrl, nft.price, nft.collection, detailUrl);

  return {
    title: `${nft.name} - ${nft.collection}`,
    description: `${nft.collection} • ${nft.price} ETH`,
    openGraph: {
      title: nft.name,
      description: `${nft.collection} • ${nft.price} ETH`,
      images: [{ url: ogImageUrl, width: 1200, height: 800 }],
      type: 'website',
    },
    other: {
      // Farcaster Mini App embed (v1 format)
      'fc:miniapp': embedJson,
      // Backward compatibility with older clients
      'fc:frame': embedJson.replace('"launch_miniapp"', '"launch_frame"'),
    },
  };
}

export default function NFTDetailPage(props: NFTDetailPageProps) {
  return <NFTDetailPageClient params={props.params} />;
}
