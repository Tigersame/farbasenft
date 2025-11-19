import type { Metadata } from 'next';
import { generateLeaderboardEmbedMeta } from '@/lib/embedMetadata';
import LeaderboardPageClient from './client';

/**
 * Shareable Leaderboard Page
 * 
 * Server-side component for generating Warpcast embed metadata
 * All interactive UI is handled in client.tsx
 * 
 * Reference: https://miniapps.farcaster.xyz/docs/guides/sharing
 */

// Generate metadata including fc:miniapp embed
export async function generateMetadata(): Promise<Metadata> {
  const leaderboardUrl = 'https://farbasenft.xyz/leaderboard';

  const embedJson = generateLeaderboardEmbedMeta(
    '🏆 XP Leaderboard',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    leaderboardUrl
  );

  return {
    title: 'XP Leaderboard - FarcastMints',
    description: 'Check the top XP earners on FarcastMints and climb the ranks',
    openGraph: {
      title: 'XP Leaderboard - FarcastMints',
      description: 'Top earners competing for XP rewards and recognition',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
          width: 800,
          height: 600,
        },
      ],
      type: 'website',
    },
    other: {
      'fc:miniapp': embedJson,
      'fc:frame': embedJson.replace('launch_miniapp', 'launch_frame'),
    },
  };
}

export default function LeaderboardPage() {
  return <LeaderboardPageClient />;
}
