
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RootProvider } from "@/providers/RootProvider";
import { WalletIslandLauncher } from "@/components/WalletIslandLauncher";
import { ConsoleErrorFilter } from "@/components/ConsoleErrorFilter";
import { MiniAppSDK } from "@/components/MiniAppSDK";
import { FarcasterDebug } from "@/components/FarcasterDebug";
import { ProviderErrorBoundary } from "@/components/ProviderErrorBoundary";
import { minikitConfig } from "@/lib/minikit.config";
import { Suspense } from "react";
import { LoadingFallback } from "@/components/LoadingFallback";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const miniapp = minikitConfig.miniapp;

// SEO-optimized metadata for Farcaster discovery and search engines
export const metadata: Metadata = {
  // Primary title - appears in browser tabs and search results
  title: {
    default: "farbasenft - NFT Marketplace on Base",
    template: "%s | farbasenft",
  },
  
  // Detailed description for search engines (150-160 chars optimal)
  description:
    "Create, discover, and trade NFTs on Base blockchain. Earn XP rewards, unlock achievements, and build your digital art collection with Farcaster integration.",
  
  // Keywords for SEO
  keywords: [
    "NFT marketplace",
    "Base blockchain",
    "Farcaster",
    "digital art",
    "NFT trading",
    "crypto collectibles",
    "Web3",
    "soulbound tokens",
    "XP rewards",
    "onchain",
  ],
  
  // App metadata
  applicationName: "farbasenft",
  authors: [{ name: "farbasenft" }],
  creator: "farbasenft",
  publisher: "farbasenft",
  
  icons: {
    icon: "/favicon.svg",
    apple: "/icon.svg",
  },
  
  metadataBase:
    process.env.NEXT_PUBLIC_APP_URL !== undefined
      ? new URL(process.env.NEXT_PUBLIC_APP_URL)
      : undefined,
  
  // Enhanced Open Graph for social sharing
  openGraph: {
    type: "website",
    locale: "en_US",
    title: miniapp.ogTitle,
    description: miniapp.ogDescription,
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "farbasenft",
    images: [
      {
        url: "/hero.svg",
        width: 1200,
        height: 630,
        alt: "farbasenft - NFT Marketplace on Base blockchain",
        type: "image/svg+xml",
      },
    ],
  },
  
  // Twitter card optimization
  twitter: {
    card: "summary_large_image",
    title: miniapp.ogTitle,
    description: miniapp.ogDescription,
    images: ["/hero.svg"],
    creator: "@farbasenft",
  },
  
  // Mobile app capabilities
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  
  // Theme colors
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  // Robots - allow indexing for discovery
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Additional metadata
  other: {
    // Farcaster Mini App embed metadata (v1 format)
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: miniapp.heroImageUrl,
      button: {
        title: `🎨 Open ${miniapp.name}`,
        action: {
          type: "launch_miniapp",
          name: miniapp.name,
          url: miniapp.homeUrl,
          splashImageUrl: miniapp.splashImageUrl,
          splashBackgroundColor: miniapp.splashBackgroundColor,
        },
      },
    }),
    // Backward compatibility with older Farcaster clients
    "fc:frame": JSON.stringify({
      version: "1",
      imageUrl: miniapp.heroImageUrl,
      button: {
        title: `🎨 Open ${miniapp.name}`,
        action: {
          type: "launch_frame",
          name: miniapp.name,
          url: miniapp.homeUrl,
          splashImageUrl: miniapp.splashImageUrl,
          splashBackgroundColor: miniapp.splashBackgroundColor,
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <ProviderErrorBoundary>
          <ConsoleErrorFilter />
          <MiniAppSDK />
          <Suspense fallback={<LoadingFallback />}>
            <RootProvider>
              <WalletIslandLauncher />
              {children}
              <FarcasterDebug />
            </RootProvider>
          </Suspense>
        </ProviderErrorBoundary>
      </body>
    </html>
  );
}
