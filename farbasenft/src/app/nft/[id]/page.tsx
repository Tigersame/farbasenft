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
    { id: 'chromatic-dreams', name: 'Chromatic Dreams', collection: 'Lumen Flow', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop', price: '1.25' },
    { id: 'aurora-veil', name: 'Aurora Veil', collection: 'Nova Reyes', image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&h=600&fit=crop', price: '0.75' },
    { id: 'silk-echoes', name: 'Silk Echoes', collection: 'Atari Bloom', image: 'https://images.unsplash.com/photo-1517816428104-797678c7cf0c?w=800&h=600&fit=crop', price: '1.10' },
  ];
  const nft = mockNFTs.find((n) => n.id === params.id);

  if (!nft) {
    return { title: 'NFT Not Found', description: 'This NFT does not exist' };
  }

  const detailUrl = `https://farbasenft.xyz/nft/${params.id}`;
  const embedJson = generateNFTEmbedMeta(nft.name, nft.image, nft.price, nft.collection, detailUrl);

  return {
    title: `${nft.name} - ${nft.collection}`,
    description: `${nft.collection} • ${nft.price} ETH`,
    openGraph: {
      title: nft.name,
      description: `${nft.collection} • ${nft.price} ETH`,
      images: [{ url: nft.image, width: 800, height: 600 }],
      type: 'website',
    },
    other: {
      'fc:miniapp': embedJson,
      'fc:frame': embedJson.replace('launch_miniapp', 'launch_frame'),
    },
  };
}

export default function NFTDetailPage(props: NFTDetailPageProps) {
  return <NFTDetailPageClient params={props.params} />;
}
