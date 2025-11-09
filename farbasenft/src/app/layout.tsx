
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
