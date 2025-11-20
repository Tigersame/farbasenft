
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

export const metadata: Metadata = {
  title: "Farbase - NFT Marketplace on Base with Farcaster",
  description:
    "An NFT marketplace on Base powered by Farcaster integration. Discover, mint, swap, and collect NFTs seamlessly.",
  icons: {
    icon: "/favicon.svg",
  },
  metadataBase:
    process.env.NEXT_PUBLIC_APP_URL !== undefined
      ? new URL(process.env.NEXT_PUBLIC_APP_URL)
      : undefined,
  openGraph: {
    title: "FarcastMints",
    description:
      "An NFT marketplace on Base with Farcaster integration. Mint, swap, and collect on-chain.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "FarcastMints",
    images: [
      {
        url: "/hero.svg",
        width: 1200,
        height: 630,
        alt: "farbasenft hero artwork",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FarcastMints",
    description:
      "Discover and collect NFTs on Base. Farcaster-native marketplace with seamless wallet integration.",
    images: ["/hero.svg"],
  },
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
