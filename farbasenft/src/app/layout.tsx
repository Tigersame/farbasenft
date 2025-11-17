
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RootProvider } from "@/providers/RootProvider";
import { WalletIslandLauncher } from "@/components/WalletIslandLauncher";
import { ConsoleErrorFilter } from "@/components/ConsoleErrorFilter";
import { MiniAppSDK } from "@/components/MiniAppSDK";
import { FarcasterDebug } from "@/components/FarcasterDebug";
import { minikitConfig } from "@/lib/minikit.config";

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
  title: "farbasenft - Foundation-inspired Base mini app",
  description:
    "Curate digital art auctions, reserve drops, and mini app embeds inspired by Foundation and powered by Base.",
  metadataBase:
    process.env.NEXT_PUBLIC_APP_URL !== undefined
      ? new URL(process.env.NEXT_PUBLIC_APP_URL)
      : undefined,
  openGraph: {
    title: "farbasenft",
    description:
      "A Foundation-style NFT gallery tailored for Base mini apps and Farcaster embeds.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "farbasenft",
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
    title: "farbasenft",
    description:
      "Discover curated NFT auctions designed for the Base mini app ecosystem.",
    images: ["/hero.svg"],
  },
  other: {
    "fc:miniapp": JSON.stringify({
      version: "next",
      imageUrl: miniapp.heroImageUrl,
      button: {
        title: `Open ${miniapp.name}`,
        action: {
          type: "launch_frame",
          name: `Launch ${miniapp.name}`,
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ConsoleErrorFilter />
        <MiniAppSDK />
        <RootProvider>
          <WalletIslandLauncher />
        {children}
        <FarcasterDebug />
        </RootProvider>
      </body>
    </html>
  );
}
