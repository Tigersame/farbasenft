import type { Metadata } from 'next';
import { generateCollectionEmbedMeta } from '@/lib/embedMetadata';
import CollectionPageClient from './client';

interface CollectionPageProps {
  params: Promise<{ id: string }>;
}

// Server component - handles metadata only
export async function generateMetadata(
  props: CollectionPageProps
): Promise<Metadata> {
  const params = await props.params;
  const collectionId = params.id;

  const mockNFTs = [
    { id: 'chromatic-dreams', name: 'Chromatic Dreams', collection: 'Lumen Flow', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop', price: '1.25' },
    { id: 'aurora-veil', name: 'Aurora Veil', collection: 'Lumen Flow', image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&h=600&fit=crop', price: '0.75' },
    { id: 'silk-echoes', name: 'Silk Echoes', collection: 'Nova Reyes', image: 'https://images.unsplash.com/photo-1517816428104-797678c7cf0c?w=800&h=600&fit=crop', price: '1.10' },
    { id: 'digital-bloom', name: 'Digital Bloom', collection: 'Nova Reyes', image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop', price: '0.85' },
  ];

  const collectionNFTs = mockNFTs.filter((n) => n.collection === collectionId);

  if (collectionNFTs.length === 0) {
    return {
      title: 'Collection Not Found',
      description: 'This collection does not exist',
    };
  }

  const collectionUrl = `https://farbasenft.xyz/collection/${collectionId}`;
  const firstNFT = collectionNFTs[0];
  const floorPrice = Math.min(...collectionNFTs.map((n) => parseFloat(n.price)));

  const embedJson = generateCollectionEmbedMeta(
    collectionId,
    firstNFT.image,
    floorPrice.toString(),
    collectionUrl
  );

  return {
    title: `${collectionId} Collection`,
    description: `${collectionNFTs.length} items • Floor: ${floorPrice} ETH`,
    openGraph: {
      title: `${collectionId} NFT Collection`,
      description: `${collectionNFTs.length} items • Floor: ${floorPrice} ETH`,
      images: [{ url: firstNFT.image, width: 800, height: 600 }],
      type: 'website',
    },
    other: {
      'fc:miniapp': embedJson,
      'fc:frame': embedJson.replace('launch_miniapp', 'launch_frame'),
    },
  };
}

export default function CollectionPage(props: CollectionPageProps) {
  const params = props.params as unknown as { id: string };
  return <CollectionPageClient collectionId={params.id} />;
}
