import Image from "next/image";
import Link from "next/link";

import { curatorNotes, heroDrop, trendingDrops } from "@/data/nfts";

const categoryStyles: Record<string, string> = {
  auction: "bg-purple-500/10 text-purple-300 ring-1 ring-purple-400/30",
  reserve: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/30",
  "buy-now": "bg-sky-500/10 text-sky-300 ring-1 ring-sky-400/30",
};

const buildChecklist = [
  {
    title: "Register for Base Build",
    copy:
      "Base Build unlocks Builder Rewards, featuring opportunities, analytics, and the Preview tool for debugging your app.",
    cta: {
      label: "Register for Base Build",
      href: "https://base.dev",
    },
  },
  {
    title: "Authentication",
    copy:
      "Keep sign in optional until it delivers clear value so users can act immediately when onchain interactions are required.",
    cta: {
      label: "Authentication",
      href: "/mini-apps/core-concepts/authentication",
    },
  },
  {
    title: "Manifest",
    copy:
      "Complete every manifest field, ship valid assets, and set noindex: true while testing so discovery stays predictable.",
    cta: {
      label: "Sign Your Manifest",
      href: "/mini-apps/core-concepts/manifest",
    },
  },
  {
    title: "Embeds & Previews",
    copy:
      "Compelling preview images with a clear launch action convert feed impressions into launches.",
    cta: {
      label: "Embeds & Previews",
      href: "/mini-apps/core-concepts/embeds-and-previews",
    },
  },
  {
    title: "Search & Discovery",
    copy:
      "Pick the right category, share once to index, and keep assets fresh so search surfaces your app.",
    cta: {
      label: "Search & Discovery",
      href: "/mini-apps/troubleshooting/how-search-works",
    },
  },
  {
    title: "Sharing & Social Graph",
    copy:
      "Lean into social flows that turn solo moments into threads and returning cohorts.",
    cta: {
      label: "Sharing & Social Graph",
      href: "/mini-apps/technical-guides/sharing-and-social-graph",
    },
  },
  {
    title: "Notifications",
    copy:
      "Re-engage saved users with timely, rate-limited notifications to highlight big moments.",
    cta: {
      label: "Notifications",
      href: "/mini-apps/core-concepts/notifications",
    },
  },
];

const buildChecklistCardGroups = [
  {
    title: "UX Best Practices",
    cards: [
      {
        label: "Design patterns",
        href: "/mini-apps/featured-guidelines/design-guidelines",
      },
      {
        label: "OnchainKit",
        href: "/mini-apps/featured-guidelines/product-guidelines/foundations",
      },
    ],
  },
  {
    title: "Build for Growth",
    cards: [
      {
        label: "Optimize Onboarding",
        href: "/mini-apps/growth/optimize-onboarding",
      },
      {
        label: "Build Viral Mini Apps",
        href: "/mini-apps/growth/build-viral-mini-apps",
      },
    ],
  },
];

const baseAppSteps = [
  {
    title: "Ask yourself",
    points: [
      "What is the one thing my app does really well?",
      "Why would someone use it every day?",
      "Why and when would someone share it with a friend?",
    ],
  },
  {
    title: "Audience fit",
    points: [
      "Base users are social, onchain-native, and interested in creating, earning, trading, and connecting.",
    ],
  },
  {
    title: "Successful apps",
    points: [
      "Help people earn, create, or have fun.",
      "Stay simple, easy, and satisfying to use.",
      "Offer low-friction onboarding without collecting personal info or requiring upfront deposits.",
    ],
  },
  {
    title: "Group chat focus",
    points: [
      "Group chats shine with games, pooled tools, or split payments; build experiences that make conversations richer together.",
    ],
  },
];

const featuredGuidelines = [
  {
    label: "Product Guidelines",
    href: "/mini-apps/featured-guidelines/product-guidelines",
    description:
      "Follow Base featured guidelines to stay eligible for spotlight placements and deliver polished experiences.",
  },
  {
    label: "Design Guidelines",
    href: "/mini-apps/featured-guidelines/design-guidelines",
    description: "",
  },
  {
    label: "Technical Guidelines",
    href: "/mini-apps/featured-guidelines/technical-guidelines",
    description: "",
  },
  {
    label: "Notification Guidelines",
    href: "/mini-apps/featured-guidelines/notification-guidelines",
    description: "",
  },
];

const featuredChecklist = [
  {
    title: "Authentication",
    points: [
      "In-app authentication stays within the Base app (no external redirects).",
      "Wallet connection is automatic.",
      "No email or phone verification required inside the experience.",
    ],
  },
  {
    title: "Onboarding Flow",
    points: [
      "Explain the purpose of the app with clear instructions on day one.",
      "Request only essential personal information with context.",
      "Show the user's avatar and username (avoid raw 0x addresses).",
    ],
  },
  {
    title: "Base Compatibility",
    points: [
      "Stay client-agnostic—no hard-coded Farcaster copy or Warpcast links.",
      "Sponsor transactions so the experience feels gasless.",
    ],
  },
  {
    title: "Layout",
    points: [
      "Place the primary call to action in the center of the viewport.",
      "Include bottom navigation or a side menu for core flows.",
      "Keep buttons fully visible with descriptive labels.",
    ],
  },
  {
    title: "Load Time",
    points: [
      "Aim for sub-3-second initial load times.",
      "Complete in-app actions within one second whenever possible.",
      "Display spinners or progress indicators during longer operations.",
    ],
  },
  {
    title: "Usability",
    points: [
      "Support both light and dark modes consistently.",
      "Respect minimum 44px touch targets for all interactive elements.",
    ],
  },
  {
    title: "App Metadata",
    points: [
      "Write a concise, user-focused description.",
      "Provide a 1024x1024 PNG icon with no transparency and strong legibility.",
      "Use a high-quality cover image that avoids Base logos or team photos.",
    ],
  },
];

const manifestImplementationSteps = [
  "Create `/public/.well-known/farcaster.json` so it resolves at `https://your-domain.com/.well-known/farcaster.json`.",
  "Fill the required fields in `accountAssociation`, `baseBuilder`, and `miniapp` with production URLs and assets.",
  "Deploy your changes so the manifest is live before verification.",
  "Open the Base Build Account Association tool and submit your deployed domain.",
  "Verify the manifest, sign with the wallet you use for Base Build, and copy the generated `accountAssociation` values.",
  "Paste the new header, payload, and signature into your manifest and redeploy to publish the update.",
];

const manifestSchemaSections = [
  {
    title: "accountAssociation",
    description: "Proves Mini App domain ownership.",
    fields: [
      {
        name: "header",
        detail: "Encoded header for the association payload (required).",
      },
      {
        name: "payload",
        detail: "Encoded payload containing your domain (required).",
      },
      {
        name: "signature",
        detail: "Signature over the payload (required).",
      },
    ],
  },
  {
    title: "baseBuilder",
    description:
      "Connects the manifest to your Base Build account using the wallet you register with.",
    fields: [
      {
        name: "ownerAddress",
        detail: "Wallet address that manages your Base Build listing (required).",
      },
    ],
  },
  {
    title: "Identity & Launch",
    description: "Defines core Mini App identity and landing page.",
    fields: [
      { name: "version", detail: "Manifest version; must be '1'." },
      { name: "name", detail: "Mini App name (≤ 32 chars)." },
      { name: "homeUrl", detail: "Launch URL (HTTPS, ≤ 1024 chars)." },
      {
        name: "iconUrl",
        detail: "1024×1024 PNG hosted on HTTPS; avoid transparent backgrounds.",
      },
    ],
  },
  {
    title: "Loading Experience",
    description: "Controls splash visuals shown during load.",
    fields: [
      {
        name: "splashImageUrl",
        detail: "HTTPS image, recommended 200×200 px.",
      },
      {
        name: "splashBackgroundColor",
        detail: "Hex color, e.g. #000000.",
      },
    ],
  },
  {
    title: "Discovery & Search",
    description: "Optimizes how Base surfaces and indexes your Mini App.",
    fields: [
      {
        name: "primaryCategory",
        detail:
          "One of games, social, finance, utility, productivity, health-fitness, news-media, music, shopping, education, developer-tools, entertainment, art-creativity.",
      },
      {
        name: "tags",
        detail: "Up to 5 lowercase tags (≤ 20 chars, no spaces/special chars).",
      },
      {
        name: "noindex",
        detail: "Boolean to exclude from Base search; use true for staging.",
      },
    ],
  },
  {
    title: "Display Information",
    description: "Describes promotional content for embeds and profile views.",
    fields: [
      { name: "subtitle", detail: "Short description (≤ 30 chars)." },
      { name: "description", detail: "Promo copy (≤ 170 chars)." },
      { name: "tagline", detail: "Marketing tagline (≤ 30 chars)." },
      {
        name: "heroImageUrl",
        detail: "1200×630 px PNG/JPG promotional image.",
      },
      {
        name: "screenshotUrls",
        detail: "Up to 3 portrait screenshots (recommend 1284×2778 px).",
      },
    ],
  },
  {
    title: "Notifications",
    description: "Endpoint for Base-delivered notifications.",
    fields: [
      {
        name: "webhookUrl",
        detail: "HTTPS POST endpoint, required when using notifications.",
      },
    ],
  },
  {
    title: "Embeds & Social Sharing",
    description: "Controls Open Graph preview content across feeds.",
    fields: [
      { name: "ogTitle", detail: "OG title (≤ 30 chars)." },
      { name: "ogDescription", detail: "OG description (≤ 100 chars)." },
      {
        name: "ogImageUrl",
        detail: "1200×630 px OG image hosted over HTTPS.",
      },
    ],
  },
];

const manifestRelatedLinks = [
  {
    label: "Mini App Assets Generator",
    href: "https://www.miniappassets.com/",
    description:
      "Generate correctly sized icons, splash screens, and hero images for Base and Farcaster mini apps.",
  },
  {
    label: "Embeds and Previews",
    href: "/mini-apps/core-concepts/embeds-and-previews",
    description:
      "Understand how your manifest powers rich preview experiences across feeds and social surfaces.",
  },
];

const embedHtmlSnippet = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>farbasenft</title>
    <meta
      name="fc:miniapp"
      content='{
        "version": "next",
        "imageUrl": "https://your-domain.vercel.app/hero.svg",
        "button": {
          "title": "Open farbasenft",
          "action": {
            "type": "launch_frame",
            "url": "https://your-domain.vercel.app"
          }
        }
      }'
    />
  </head>
  <body>
    <!-- App content -->
  </body>
</html>`;

const embedNextSnippet = `import type { Metadata } from "next";
import { minikitConfig } from "@/../minikit.config";

export const metadata: Metadata = {
  title: minikitConfig.miniapp.name,
  description: minikitConfig.miniapp.description,
  other: {
    "fc:miniapp": JSON.stringify({
      version: "next",
      imageUrl: minikitConfig.miniapp.heroImageUrl,
      button: {
        title: \`Join the \${minikitConfig.miniapp.name}\`,
        action: {
          type: "launch_frame",
          name: \`Launch \${minikitConfig.miniapp.name}\`,
          url: minikitConfig.miniapp.homeUrl,
          splashImageUrl: minikitConfig.miniapp.splashImageUrl,
          splashBackgroundColor: minikitConfig.miniapp.splashBackgroundColor,
        },
      },
    }),
  },
};`;

const embedImplementationSteps = [
  "Add `fc:miniapp` metadata to every page you expect Base to embed (start with your `homeUrl`).",
  "Use a 3:2 aspect ratio image (up to 10 MB) hosted at a stable HTTPS URL.",
  "Ensure the button action launches your production Mini App URL and matches the manifest configuration.",
];

const embedSchemaSections = [
  {
    title: "Embed",
    description: "Core metadata for rendering the preview.",
    fields: [
      { name: "version", detail: "'1' or 'next'." },
      {
        name: "imageUrl",
        detail: "3:2 image (PNG/JPG/WebP) ≤ 10 MB, ≤ 1024 characters.",
      },
      { name: "button", detail: "Button configuration object." },
    ],
  },
  {
    title: "Button",
    description: "Defines the visible call to action.",
    fields: [
      { name: "button.title", detail: "Label ≤ 32 characters." },
      { name: "button.action", detail: "Action object describing what to launch." },
    ],
  },
  {
    title: "Action",
    description: "Controls launch behavior when the button is pressed.",
    fields: [
      { name: "button.action.type", detail: "Must be 'launch_frame'." },
      {
        name: "button.action.url",
        detail: "Optional override of the launch URL (defaults to current page).",
      },
      {
        name: "button.action.name",
        detail: "Optional app name override (≤ 32 characters).",
      },
      {
        name: "button.action.splashImageUrl",
        detail: "Optional 200x200 image overriding manifest splash art.",
      },
      {
        name: "button.action.splashBackgroundColor",
        detail: "Optional hex color overriding manifest splash background.",
      },
    ],
  },
];

const embedRelatedLinks = [
  {
    label: "Search and Discovery",
    href: "/mini-apps/technical-guides/search-and-discovery",
    description: "See how metadata feeds Base search ranking and categories.",
  },
  {
    label: "Sharing and Social Graph",
    href: "/mini-apps/technical-guides/sharing-and-social-graph",
    description: "Design for viral loops and native sharing flows in Base.",
  },
];

const baseAccountHighlights = [
  "Universal sign-on with passkeys across every Base-enabled app.",
  "One-tap USDC payments for low-friction checkout experiences.",
  "Gasless transactions when you sponsor fees for collectors.",
  "Batch multiple operations into a single confirmation screen.",
];

const baseAccountWagmiSnippet = `"use client";

import { createConfig, http, WagmiProvider } from "wagmi";
import { base, optimism } from "wagmi/chains";
import { baseAccount } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
import type { ReactNode } from "react";
import { METADATA } from "../lib/utils";

export const config = createConfig({
  chains: [base, optimism],
  transports: {
    [base.id]: http(),
    [optimism.id]: http(),
  },
  connectors: [
    farcasterMiniApp(),
    baseAccount({
      appName: METADATA.name,
      appLogoUrl: METADATA.iconImageUrl,
    }),
  ],
});

const queryClient = new QueryClient();

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}`;

const baseAccountBatchSnippet = `import { parseEther } from "viem";
import { sendCalls, getCapabilities } from "@wagmi/core";
import { config } from "../providers/Provider";

export async function sendBatchTransaction() {
  const [account] = await config.getClient().getAddresses();

  const capabilities = await getCapabilities(config, { account });
  const baseCapabilities = capabilities[8453];
  const supportsPaymaster = baseCapabilities?.paymasterService?.supported;

  const calls = [
    {
      to: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
      value: parseEther("0.01"),
    },
    {
      to: "0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC",
      value: parseEther("0.01"),
    },
  ];

  const id = await sendCalls(config, {
    account,
    calls,
    chainId: 8453,
    capabilities: supportsPaymaster
      ? {
          paymasterService: {
            url: "https://api.developer.coinbase.com/rpc/v1/base/YOUR_KEY",
          },
        }
      : undefined,
  });

  console.log("Transaction batch ID:", id);
}`;

const baseAccountBatchCards = [
  {
    label: "Batch Transactions Guide",
    href: "/base-account/improve-ux/batch-transactions",
    description: "Learn how to compose atomic sequences with Base Account.",
  },
  {
    label: "Sponsor Gas Guide",
    href: "/base-account/improve-ux/sponsor-gas/paymasters",
    description: "Configure paymasters to cover fees on behalf of collectors.",
  },
];

const baseAccountUnsupported = [
  {
    feature: "Sign in with Base",
    capability: "wallet_connect",
  },
  {
    feature: "Sub accounts",
    capability: "wallet_getSubAccounts, wallet_addSubAccount",
  },
  {
    feature: "Spend permissions",
    capability: "coinbase_fetchPermissions, coinbase_fetchPermission",
  },
  {
    feature: "Profiles",
    capability: "datacallback",
  },
  {
    feature: "Signing typed data",
    capability: "signTypedData",
  },
  {
    feature: "Signing messages",
    capability: "wallet_sign",
  },
];

const baseAccountResources = [
  {
    label: "What is Base Account?",
    href: "/base-account/overview/what-is-base-account",
    description: "Deep dive into the smart wallet experience and value prop.",
  },
  {
    label: "Base Account Reference",
    href: "/base-account/reference/core/createBaseAccount",
    description: "Explore every method available in the SDK.",
  },
  {
    label: "Get Support",
    href: "https://discord.com/invite/buildonbase",
    description: "Chat with the Base team and builders for help.",
  },
];

const basePayInstallSnippets = {
  npm: "npm install @base-org/account",
  pnpm: "pnpm add @base-org/account",
  yarn: "yarn add @base-org/account",
  bun: "bun add @base-org/account",
};

const basePayHandlerSnippet = `import { pay, getPaymentStatus } from "@base-org/account";

export async function handlePayment() {
  try {
    const payment = await pay({
      amount: "5.00",
      to: "0xRecipient",
      testnet: true,
    });

    console.log("Payment sent! ID:", payment.id);

    const { status } = await getPaymentStatus({
      id: payment.id,
      testnet: true,
    });

    if (status === "completed") {
      console.log("Payment confirmed!");
    }
  } catch (error) {
    console.error("Payment failed:", error instanceof Error ? error.message : error);
  }
}`;

const basePayButtonSnippet = `import { BasePayButton } from "@base-org/account-ui/react";
import { pay } from "@base-org/account";

export function Checkout() {
  const handlePayment = async () => {
    try {
      const payment = await pay({ amount: "5.00", to: "0xRecipient" });
      console.log("Payment sent! Transaction ID:", payment.id);
    } catch (error) {
      console.error("Payment failed:", error instanceof Error ? error.message : error);
    }
  };

  return <BasePayButton colorScheme="light" onClick={handlePayment} />;
}`;

const authenticationFrontendSnippet = `import { useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export function App() {
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<{ fid: number } | null>(null);

  async function signIn() {
    try {
      const { token } = await sdk.quickAuth.getToken();
      setToken(token);

      const response = await sdk.quickAuth.fetch(\`\${process.env.NEXT_PUBLIC_BACKEND_URL}/auth\`, {
        headers: { Authorization: \`Bearer \${token}\` },
      });

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  }

  function signOut() {
    setToken(null);
    setUserData(null);
  }

  if (!token) {
    return <button onClick={signIn}>Sign In</button>;
  }

  return (
    <div>
      <p>Authenticated as FID: {userData?.fid}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}`;

const authenticationBackendSnippet = `// app/api/auth/route.ts
import { createClient, Errors } from "@farcaster/quick-auth";
import { NextRequest, NextResponse } from "next/server";

const domain = "your-domain.com";
const client = createClient();

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authorization.split(" ")[1];

  try {
    const payload = await client.verifyJwt({ token, domain });
    return NextResponse.json({ fid: payload.sub });
  } catch (error) {
    if (error instanceof Errors.InvalidTokenError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    throw error;
  }
}`;

const jwtPayloadExample = `{
  "iat": 1747764819,
  "iss": "https://auth.farcaster.xyz",
  "exp": 1747768419,
  "sub": 6841,
  "aud": "your-domain.com"
}`;

const navigationPromptMarkdown = `# Mini App Navigation Pattern Migration

## Context
I am building a Farcaster Mini App on Base. Mini Apps must use official SDK functions for all navigation and external interactions to ensure cross-client compatibility.

## Task
Review this file and refactor any incorrect navigation patterns to use the correct SDK actions.

## Incorrect Patterns to Replace
- Direct HTML links: <a href="">, <Link href="">
- window.open calls
- Static Farcaster URLs or deeplinks
- Client-specific URLs (Warpcast, etc.)
- Composer intent URLs such as https://farcaster.com/~/compose?text=...
- Direct cast URLs for viewing

## Correct SDK Actions
- sdk.actions.openUrl for external sites
- sdk.actions.composeCast for posting
- sdk.actions.viewCast for opening casts
- MiniKit equivalents: useOpenUrl, useComposeCast, useViewCast
`;

const navigationExamples = [
  {
    title: "Open external site",
    snippet: `import { sdk } from "@farcaster/miniapp-sdk";

export function ExternalLink() {
  return (
    <button onClick={() => sdk.actions.openUrl("https://base.org")}>
      Visit Base.org
    </button>
  );
}`,
  },
  {
    title: "Share via composeCast",
    snippet: `import { sdk } from "@farcaster/miniapp-sdk";

export function ShareCast() {
  return (
    <button
      onClick={() =>
        sdk.actions.composeCast({
          text: "Check out farbasenft!",
          embeds: [window.location.href],
        })
      }
    >
      Share This App
    </button>
  );
}`,
  },
  {
    title: "View a cast",
    snippet: `import { sdk } from "@farcaster/miniapp-sdk";

export function ViewCastButton() {
  return (
    <button
      onClick={() =>
        sdk.actions.viewCast(
          "https://base.app/post/0xffdec7c879aad726b5400d22ec8a89aaff6e0737",
        )
      }
    >
      View Cast
    </button>
  );
}`,
  },
];

const notificationsWebhookSnippet = `import {
  parseWebhookEvent,
  verifyAppKeyWithNeynar,
} from "@farcaster/miniapp-node";

export async function POST(request: Request) {
  const requestJson = await request.json();

  let data;
  try {
    data = await parseWebhookEvent(requestJson, verifyAppKeyWithNeynar);
  } catch (error) {
    console.error("Verification failed", error);
    return new Response("Invalid signature", { status: 401 });
  }

  const fid = data.fid;
  const appFid = data.appFid;
  const event = data.event;

  switch (event.event) {
    case "miniapp_added":
    case "notifications_enabled":
      if (event.notificationDetails) {
        await saveNotificationDetails(fid, appFid, event.notificationDetails);
        await sendMiniAppNotification({
          fid,
          appFid,
          title: "Notifications enabled",
          body: "You will hear from farbasenft soon.",
        });
      }
      break;
    case "notifications_disabled":
    case "miniapp_removed":
      await deleteNotificationDetails(fid, appFid);
      break;
    default:
      break;
  }

  return new Response("ok");
}`;

const notificationsSendSnippet = `export async function sendMiniAppNotification({
  fid,
  appFid,
  title,
  body,
}: {
  fid: number;
  appFid: number;
  title: string;
  body: string;
}) {
  const notificationDetails = await getNotificationDetails(fid, appFid);
  if (!notificationDetails) {
    return { state: "no_token" };
  }

  const response = await fetch(notificationDetails.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      notificationId: crypto.randomUUID(),
      title,
      body,
      targetUrl: process.env.NEXT_PUBLIC_APP_URL,
      tokens: [notificationDetails.token],
    }),
  });

  if (response.ok) {
    return { state: "success" };
  }

  const error = await response.json();
  return { state: "error", error };
}`;

const notificationEventExamples = {
  added: `{
  "event": "miniapp_added",
  "notificationDetails": {
    "url": "https://api.farcaster.xyz/v1/frame-notifications",
    "token": "a05059ef2415c67b08ecceb539201cbc6"
  }
}`,
  enabled: `{
  "event": "notifications_enabled",
  "notificationDetails": {
    "url": "https://api.farcaster.xyz/v1/frame-notifications",
    "token": "a05059ef2415c67b08ecceb539201cbc6"
  }
}`,
  removed: `{
  "event": "miniapp_removed"
}`,
  disabled: `{
  "event": "notifications_disabled"
}`,
};

const notificationRequestSchema = `{
  "notificationId": "string (<=128 chars)",
  "title": "string (<=32 chars)",
  "body": "string (<=128 chars)",
  "targetUrl": "https://your-domain.com/path",
  "tokens": ["token-1", "token-2"]
}`;

const notificationResponseSchema = `{
  "result": {
    "successfulTokens": ["token-1"],
    "invalidTokens": [],
    "rateLimitedTokens": []
  }
}`;

const neynarSendFunctionSnippet = `import { NeynarAPIClient } from "@neynar/nodejs-sdk";

const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY ?? "");

export async function sendNotification(targetFids, filters, notification) {
  try {
    const response = await client.publishFrameNotifications({
      targetFids,
      filters,
      notification,
    });
    return { success: true, data: response };
  } catch (error) {
    console.error("Failed to send notification:", error);
    return { success: false, error: error.message };
  }
}`;

const neynarSendExampleSnippet = `import { sendNotification } from "./lib/sendNotification";

const targetFids = [];
const filters = {
  exclude_fids: [420, 69],
  following_fid: 3,
  minimum_user_score: 0.5,
  near_location: {
    latitude: 34.052235,
    longitude: -118.243683,
    radius: 50000,
  },
};

const notification = {
  title: "Farbasenft drop live",
  body: "Discover tonight's reserve pieces.",
  target_url: "https://your-miniapp-domain.com/drop",
};

const result = await sendNotification(targetFids, filters, notification);
console.log(result);`;

const neynarAddMiniAppSnippet = `import { useMiniApp } from "@neynar/react";

export default function AddMiniAppButton() {
  const { isSDKLoaded, addMiniApp } = useMiniApp();

  const handleAddMiniApp = async () => {
    if (!isSDKLoaded) return;
    const result = await addMiniApp();
    if (result.added && result.notificationDetails) {
      console.log("Notification token:", result.notificationDetails.token);
    }
  };

  return <button onClick={handleAddMiniApp}>Add Mini App</button>;
}`;

const manifestSigningSteps = [
  {
    title: "Base Build Preview Tool",
    steps: [
      "Visit base.dev and sign in with your Base account.",
      "Open Preview → Account Association and submit your Mini App URL.",
      "Click Verify → Sign, sign the message in your wallet, then copy the generated accountAssociation object.",
      "Paste the object into your farcaster.json file and redeploy.",
    ],
    image:
      "https://mintcdn.com/base-a060aa97/dO8XY3SZV1MJpLBm/images/base-build/basedev-manifest-success.png?fit=max&auto=format&n=dO8XY3SZV1MJpLBm&q=85&s=79f16d818f9a11025249e2a383b89362",
  },
  {
    title: "Farcaster Manifest Tool",
    steps: [
      "Log in to farcaster.xyz and open Developers → Manifest Tool.",
      "Enter your domain, refresh, then generate the account association.",
      "Copy the object into farcaster.json and redeploy.",
    ],
    image:
      "https://mintcdn.com/base-a060aa97/dO8XY3SZV1MJpLBm/images/base-build/farcaster-manifest-success.png?fit=max&auto=format&n=dO8XY3SZV1MJpLBm&q=85&s=68843136fbb46678ca087467c646285f",
  },
];

const manifestExampleSnippet = `{
  "accountAssociation": {
    "header": "<generated-header>",
    "payload": "<generated-payload>",
    "signature": "<generated-signature>"
  },
  "miniapp": {
    "version": "1",
    "name": "Basecamp 2025",
    "description": "Access and manage your experience @ Basecamp",
    "iconUrl": "https://basecamp25.app/icon.png",
    "homeUrl": "https://basecamp25.app",
    "canonicalDomain": "basecamp25.app",
    "requiredChains": ["eip155:8453"],
    "tags": ["basecamp", "miniapp"],
    "requiredCapabilities": ["actions.ready", "actions.signIn"]
  }
}`;

const dynamicOgSnippet = `import { ImageResponse } from "next/og";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: "black",
          height: "100%",
          width: "100%",
          display: "flex",
          color: "white",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        Hello {username}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}`;

const dynamicSharePageSnippet = `import { minikitConfig } from "../../../minikit.config";
import type { Metadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ username: string }> },
): Promise<Metadata> {
  const { username } = await params;

  return {
    title: minikitConfig.miniapp.name,
    description: minikitConfig.miniapp.description,
    other: {
      "fc:miniapp": JSON.stringify({
        version: minikitConfig.miniapp.version,
        imageUrl: \`\${minikitConfig.miniapp.homeUrl}/api/og/\${username}\`,
        button: {
          title: \`Join the \${minikitConfig.miniapp.name} Waitlist\`,
          action: {
            name: \`Launch \${minikitConfig.miniapp.name}\`,
            type: "launch_frame",
            url: minikitConfig.miniapp.homeUrl,
          },
        },
      }),
    },
  };
}

export default async function SharePage(
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  return <h1>Share Page - {username}</h1>;
}`;

const dynamicComposeSnippet = `import { useMiniKit, useComposeCast } from "@coinbase/onchainkit/minikit";
import { minikitConfig } from "@/../minikit.config";

export function ShareButton() {
  const { context } = useMiniKit();
  const { composeCast } = useComposeCast();

  const handleShare = () => {
    const displayName = context?.user?.displayName ?? "collector";
    composeCast({
      text: \`Check out \${minikitConfig.miniapp.name}!\`,
      embeds: [\`\${window.location.origin}/share/\${displayName}\`],
    });
  };

  return <button onClick={handleShare}>Share Mini App</button>;
}`;

const miniAppContextTypeSnippet = `export type MiniAppPlatformType = 'web' | 'mobile';

type SafeAreaInsets = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

type MiniAppNotificationDetails = {
  url: string;
  token: string;
};

type MiniAppLocationContext = {
  type: string;
};

export type MiniAppContext = {
  user: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  };
  location?: MiniAppLocationContext;
  client: {
    platformType?: MiniAppPlatformType;
    clientFid: number;
    added: boolean;
    safeAreaInsets?: SafeAreaInsets;
    notificationDetails?: MiniAppNotificationDetails;
  };
  features?: {
    haptics: boolean;
    cameraAndMicrophoneAccess?: boolean;
  };
};`;

const miniAppContextImplementationSteps = [
  "Install and import `@farcaster/miniapp-sdk` in your Next.js client components.",
  "Detect whether the experience is running inside a Mini App with `sdk.isInMiniApp()`.",
  "When true, read `sdk.context` to tailor UI to the user, launch location, and client capabilities.",
];

const miniAppContextComponentSnippet = `"use client";

import { sdk } from "@farcaster/miniapp-sdk";
import { useEffect, useState } from "react";

type MiniAppUser = Awaited<typeof sdk.context>["user"];

export default function Profile() {
  const [user, setUser] = useState<MiniAppUser | null>(null);
  const [isInMiniApp, setIsInMiniApp] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const miniApp = await sdk.isInMiniApp();
        setIsInMiniApp(miniApp);
        if (miniApp) {
          const context = await sdk.context;
          setUser(context.user);
        }
      } catch (error) {
        console.error("Error loading mini app context", error);
      }
    };

    loadUser();
  }, []);

  if (!isInMiniApp) {
    return <p>Open farbasenft inside a Base or Farcaster client to see contextual data.</p>;
  }

  if (!user) {
    return <p>Loading profile...</p>;
  }

  const fallbackName = user.username ? "@" + user.username : "Collector " + user.fid;

  return (
    <article>
      <h2>Welcome, {user.displayName ?? fallbackName}!</h2>
      <p>FID: {user.fid}</p>
      {user.username && <p>@{user.username}</p>}
      {user.pfpUrl ? (
        <img
          src={user.pfpUrl}
          alt="Profile"
          width={64}
          height={64}
          style={{ borderRadius: "50%" }}
        />
      ) : null}
    </article>
  );
}`;

const miniAppContextLocationTypes = [
  {
    type: "cast_embed",
    description: "Launched from a cast where your Mini App is embedded.",
  },
  {
    type: "cast_share",
    description: "Triggered when someone shares a cast to your Mini App.",
  },
  {
    type: "notification",
    description: "Opened from a notification you sent via Base.",
  },
  {
    type: "launcher",
    description: "Opened directly from the Base client mini app catalog.",
  },
  {
    type: "channel",
    description: "Launched from within a Farcaster channel.",
  },
  {
    type: "open_miniapp",
    description: "Opened from another Mini App flow.",
  },
];

const miniAppContextSchemas = [
  {
    title: "User",
    description: "Surface profile data to personalize galleries without treating it as authentication.",
    fields: [
      { name: "fid", detail: "Unique Farcaster identifier (required)." },
      { name: "username", detail: "Handle without the @ symbol." },
      { name: "displayName", detail: "Preferred display name." },
      { name: "pfpUrl", detail: "Profile picture URL." },
      { name: "bio", detail: "Short biography text." },
      { name: "location.placeId", detail: "Google Places ID when available." },
      { name: "location.description", detail: "Human readable location label." },
    ],
  },
  {
    title: "Location",
    description: "Understand how users discovered the Mini App to adapt flows.",
    fields: [
      { name: "type", detail: "Context type such as cast_embed or channel." },
      { name: "cast", detail: "Cast details when launched from a cast." },
      { name: "notification", detail: "Notification metadata for notification launches." },
      { name: "channel", detail: "Channel object when opened inside a Farcaster channel." },
      { name: "referrerDomain", detail: "Domain of the Mini App that opened the current experience." },
    ],
  },
  {
    title: "Client",
    description: "Host client and device details reported by the Base or Farcaster app.",
    fields: [
      { name: "platformType", detail: "'web' or 'mobile'." },
      { name: "clientFid", detail: "Client identifier such as 9152 for Warpcast." },
      { name: "added", detail: "Whether the user saved your Mini App." },
      { name: "safeAreaInsets", detail: "Device safe area insets for responsive layout." },
      { name: "notificationDetails", detail: "Webhook configuration if notifications are enabled." },
    ],
  },
  {
    title: "Features",
    description: "Check capability availability before invoking SDK APIs.",
    fields: [
      { name: "haptics", detail: "Boolean indicating haptic support." },
      {
        name: "cameraAndMicrophoneAccess",
        detail: "True when the client has stored permissions for camera and microphone.",
      },
    ],
  },
];

const miniAppContextExamples = {
  user: `{
  "fid": 6841,
  "username": "deodad",
  "displayName": "Tony D'Addeo",
  "pfpUrl": "https://i.imgur.com/dMoIan7.jpg",
  "bio": "Building @warpcast and @farcaster",
  "location": {
    "placeId": "ChIJLwPMoJm1RIYRetVp1EtGm10",
    "description": "Austin, TX, USA"
  }
}`,
  castEmbed: `{
  "type": "cast_embed",
  "embed": "https://myapp.example.com",
  "cast": {
    "author": {
      "fid": 3621,
      "username": "alice",
      "displayName": "Alice",
      "pfpUrl": "https://example.com/alice.jpg"
    },
    "hash": "0xa2fbef8c8e4d00d8f84ff45f9763b8bae2c5c544",
    "timestamp": 1749160866000,
    "text": "Check out this awesome mini app!",
    "embeds": ["https://myapp.example.com"],
    "channelKey": "farcaster"
  }
}`,
  notification: `{
  "type": "notification",
  "notification": {
    "notificationId": "f7e9ebaf-92f0-43b9-a410-ad8c24f3333b",
    "title": "Yoinked!",
    "body": "horsefacts captured the flag from you."
  }
}`,
  client: `{
  "platformType": "mobile",
  "clientFid": 9152,
  "added": true,
  "safeAreaInsets": {
    "top": 0,
    "bottom": 20,
    "left": 0,
    "right": 0
  },
  "notificationDetails": {
    "url": "https://api.farcaster.xyz/v1/frame-notifications",
    "token": "a05059ef2415c67b08ecceb539201cbc6"
  }
}`,
  features: `{
  "haptics": true,
  "cameraAndMicrophoneAccess": true
}`,
};

const miniAppContextNote =
  "For deeper capability detection beyond these booleans, call `sdk.getCapabilities()` to discover which host features are available.";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative isolate overflow-hidden">
        <Image
          src="/hero.svg"
          alt="farbasenft hero"
          fill
          priority
          className="object-cover opacity-40 mix-blend-screen"
        />
        <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 sm:px-8 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/icon.svg" alt="farbasenft icon" width={36} height={36} />
            <span className="text-lg font-semibold tracking-wide text-slate-100">
              farbasenft
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex">
            <a className="transition hover:text-white" href="#drops">
              Drops
            </a>
            <a className="transition hover:text-white" href="#curation">
              Curation
            </a>
            <a className="transition hover:text-white" href="#collect">
              Collect
            </a>
          </nav>
          <button className="rounded-full bg-slate-100 px-6 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white">
            Connect Wallet
          </button>
        </header>

        <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-20 pt-12 sm:px-8 lg:flex-row lg:items-end lg:px-10 lg:pt-20">
          <div className="max-w-xl space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Featured Auction
            </p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Curate the future of digital art.
            </h1>
            <p className="text-lg text-slate-300">
              farbasenft showcases hand-selected releases inspired by the Foundation
              aesthetic—complete with reserve mechanics, live bidding, and collector
              storytelling ready for the Base mini app ecosystem.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="#drops"
                className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-purple-500/30 transition hover:shadow-xl"
              >
                Explore Drops
              </Link>
              <a
                href="https://docs.base.org/mini-apps/quickstart/create-new-miniapp"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-slate-500 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-300 hover:text-white"
              >
                Mini App Playbook
              </a>
            </div>
            <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur">
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${categoryStyles[heroDrop.category]}`}
                >
                  {heroDrop.category}
                </span>
                <span className="text-xs text-slate-400">Ends in {heroDrop.endsIn}</span>
              </div>
              <h2 className="text-2xl font-semibold">{heroDrop.title}</h2>
              <p className="text-sm text-slate-300">by {heroDrop.artist}</p>
              <p className="text-sm text-slate-400">{heroDrop.description}</p>
              <div className="flex items-center gap-6 pt-2 text-sm">
                <div>
                  <p className="text-xs uppercase text-slate-400">Current Bid</p>
                  <p className="text-base font-semibold text-white">{heroDrop.currentBid}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-400">Reserve</p>
                  <p className="text-base font-semibold text-white">{heroDrop.reserve}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex-1">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 shadow-2xl shadow-purple-500/20 backdrop-blur">
              <Image
                src={heroDrop.image}
                alt={heroDrop.title}
                width={800}
                height={1000}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </section>
      </div>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16 sm:px-8 lg:px-10">
        <section id="drops" className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                Trending this week
              </p>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                Live auctions & reserve drops
              </h2>
            </div>
            <button className="w-full rounded-full border border-slate-600 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-white hover:text-white sm:w-auto">
              Create Artist Profile
            </button>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {trendingDrops.map((nft) => (
              <article
                key={nft.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-slate-900/60 transition hover:-translate-y-1 hover:border-white/20"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={nft.image}
                    alt={nft.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${categoryStyles[nft.category]}`}
                    >
                      {nft.category}
                    </span>
                    <span className="text-xs text-slate-400">{nft.endsIn}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{nft.title}</h3>
                    <p className="text-sm text-slate-400">by {nft.artist}</p>
                  </div>
                  <p className="text-sm text-slate-300 line-clamp-3">{nft.description}</p>
                  <div className="mt-auto flex items-center justify-between rounded-2xl bg-slate-950/60 px-4 py-3 text-sm">
                    <div>
                      <p className="text-xs uppercase text-slate-500">Current</p>
                      <p className="font-semibold text-white">{nft.currentBid}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase text-slate-500">Reserve</p>
                      <p className="font-semibold text-white">{nft.reserve}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="curation"
          className="grid gap-6 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 p-10 md:grid-cols-[2fr,3fr]"
        >
          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Curation Studio
            </p>
            <h2 className="text-3xl font-semibold text-white">
              Gallery-tier storytelling built in.
            </h2>
            <p className="text-base text-slate-300">
              Drop pages go beyond the jpeg with process journals, artist notes, and
              live bid history. Use the Base mini app post composer to generate capsule
              embeds directly in Farcaster.
            </p>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-purple-400" />
                Mint with reserve pricing, timed auctions, and collector splits.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-teal-400" />
                Schedule unveil moments and unlock content for top bidders.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-sky-400" />
                Trigger notifications through Base App when reserves get met.
              </li>
            </ul>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {curatorNotes.map((note) => (
              <div
                key={note.title}
                className="rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-purple-900/20 p-6 backdrop-blur"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {note.title}
                </p>
                <p className="mt-3 text-sm text-slate-200">{note.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="collect"
          className="overflow-hidden rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-950/90 p-10"
        >
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-200">
                Base Mini App Ready
              </p>
              <h2 className="text-3xl font-semibold text-white">
                Launch to the Base App audience in minutes.
              </h2>
              <p className="text-base text-slate-100/80">
                Follow the Base mini app quickstart to host on Vercel, sign your
                manifest, and ship farbasenft to collectors directly within the Base
                app.
              </p>
              <div className="grid gap-3 text-sm text-slate-200">
                <div className="rounded-2xl border border-indigo-400/30 bg-slate-950/60 p-4">
                  <p className="font-semibold text-white">1. Configure manifest</p>
                  <p className="text-slate-300">
                    Update `minikit.config.ts` with your signed Base account association.
                  </p>
                </div>
                <div className="rounded-2xl border border-purple-400/30 bg-slate-950/60 p-4">
                  <p className="font-semibold text-white">2. Verify on Base</p>
                  <p className="text-slate-300">
                    Push to Vercel, then use the Base account association tool to verify.
                  </p>
                </div>
                <div className="rounded-2xl border border-teal-400/30 bg-slate-950/60 p-4">
                  <p className="font-semibold text-white">3. Cast your launch</p>
                  <p className="text-slate-300">
                    Share your drop URL in Farcaster to activate rich mini app embeds.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70">
              <Image
                src="/splash.svg"
                alt="farbasenft splash art"
                width={1080}
                height={1920}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-slate-950/70 px-6 py-4 backdrop-blur">
                <div>
                  <p className="text-xs uppercase text-slate-400">Base Mini App</p>
                  <p className="text-sm font-semibold text-white">farbasenft</p>
                </div>
                <button className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900">
                  Preview
                </button>
              </div>
            </div>
          </div>
        </section>

        <section
          id="build-checklist"
          className="space-y-10 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-10"
        >
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Build Checklist
            </p>
            <h2 className="text-3xl font-semibold text-white">
              Key steps to ship a successful Base mini app
            </h2>
            <p className="text-base text-slate-300">
              Ground your launch in the official Base guidance so discovery, distribution, and retention work from day one.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {buildChecklist.map((item) => (
              <div
                key={item.title}
                className="flex h-full flex-col gap-4 rounded-2xl border border-white/5 bg-slate-950/70 p-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{item.copy}</p>
                </div>
                <div className="mt-auto">
                  <a
                    href={item.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-teal-300 transition hover:text-white"
                  >
                    {item.cta.label}
                    <span aria-hidden>→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {buildChecklistCardGroups.map((group) => (
              <div
                key={group.title}
                className="space-y-4 rounded-2xl border border-white/5 bg-slate-950/70 p-6"
              >
                <h3 className="text-lg font-semibold text-white">{group.title}</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {group.cards.map((card) => (
                    <a
                      key={card.label}
                      href={card.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-white hover:text-white"
                    >
                      {card.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="embeds-previews"
          className="space-y-10 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-10"
        >
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Embeds & Previews</p>
            <h2 className="text-3xl font-semibold text-white">
              Craft rich previews that invite collectors to launch farbasenft
            </h2>
            <p className="text-base text-slate-300">
              Base reads `fc:miniapp` metadata to render an image and launch button anywhere your link is shared. Ship consistent embeds so casts, channels, and notifications open the full gallery experience.
            </p>
          </div>
          <div className="flex flex-col gap-6 rounded-2xl border border-white/5 bg-slate-950/70 p-6 md:flex-row md:items-center">
            <div className="md:max-w-md">
              <Image
                src="https://mintcdn.com/base-a060aa97/gS084HRa38b8UMsN/images/minikit/feed_mini.jpg?fit=max&auto=format&n=gS084HRa38b8UMsN&q=85&s=0bff73fdce8aef932cb9245a833eb506"
                alt="Mini app embed preview"
                width={1014}
                height={1000}
                className="w-full rounded-xl border border-slate-800"
                priority={false}
              />
            </div>
            <div className="md:flex-1">
              <h3 className="text-lg font-semibold text-white">Implementation overview</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                {embedImplementationSteps.map((step) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-teal-400" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-2xl border border-teal-500/40 bg-teal-500/10 p-4 text-sm text-teal-100">
                <p className="font-semibold text-teal-200">Tip</p>
                <p className="mt-2 text-teal-100">
                  The manifest `homeUrl` must serve embed metadata. Keep previews up to date in staging and production so Base can index and launch your app reliably.
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
              <h3 className="text-lg font-semibold text-white">Static HTML example</h3>
              <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{embedHtmlSnippet}
              </pre>
            </div>
            <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
              <h3 className="text-lg font-semibold text-white">Next.js metadata example</h3>
              <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{embedNextSnippet}
              </pre>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {embedSchemaSections.map((section) => (
              <div
                key={section.title}
                className="flex h-full flex-col gap-4 rounded-2xl border border-white/5 bg-slate-950/70 p-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{section.description}</p>
                </div>
                <ul className="space-y-2 text-sm text-slate-200">
                  {section.fields.map((field) => (
                    <li key={`${section.title}-${field.name}`}>
                      <span className="font-medium text-white">{field.name}</span>
                      <span className="block text-slate-300">{field.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {embedRelatedLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-white/5 bg-slate-950/70 p-6 text-sm text-slate-200 transition hover:border-white hover:text-white"
              >
                <p className="text-base font-semibold text-white">{link.label}</p>
                <p className="mt-2 text-sm text-slate-300">{link.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section
          id="dynamic-embeds"
          className="space-y-10 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-10"
        >
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Dynamic Embed Images
            </p>
            <h2 className="text-3xl font-semibold text-white">
              Generate personalized preview art on the fly
            </h2>
            <p className="text-base text-slate-300">
              Turn every share into a unique story. Dynamic `fc:miniapp` metadata lets farbasenft
              render tailored preview art using simple API routes and compose hooks.
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
            <Image
              src="https://mintcdn.com/base-a060aa97/gS084HRa38b8UMsN/images/minikit/Diagram.png?fit=max&auto=format&n=gS084HRa38b8UMsN&q=85&s=6d670bcba887f0f5b919ef8f98f8081a"
              alt="Flow from mini app URL to embed generation"
              width={1920}
              height={1477}
              className="w-full rounded-xl border border-slate-800"
            />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
              <h3 className="text-lg font-semibold text-white">Image generation endpoint</h3>
              <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{dynamicOgSnippet}
              </pre>
            </div>
            <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
              <h3 className="text-lg font-semibold text-white">Share page metadata</h3>
              <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{dynamicSharePageSnippet}
              </pre>
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
            <h3 className="text-lg font-semibold text-white">Compose button with personalized link</h3>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{dynamicComposeSnippet}
            </pre>
          </div>
        </section>

        <section
          id="manifest"
          className="space-y-10 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-10"
        >
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Manifest</p>
            <h2 className="text-3xl font-semibold text-white">
              Shape how farbasenft appears across Base search and embeds
            </h2>
            <p className="text-base text-slate-300">
              A complete manifest unlocks discovery, rich previews, and verification. Use this template as you prepare to sign and publish.
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-white">Example `farcaster.json`</h3>
              <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Development tip: set noindex to true until production launch
              </span>
            </div>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{`{
  "accountAssociation": {
    "header": "...",
    "payload": "...",
    "signature": "..."
  },
  "baseBuilder": {
    "ownerAddress": "0x..."
  },
  "miniapp": {
    "version": "1",
    "name": "farbasenft",
    "homeUrl": "https://your-domain.vercel.app",
    "iconUrl": "https://your-domain.vercel.app/icon.svg",
    "splashImageUrl": "https://your-domain.vercel.app/splash.svg",
    "splashBackgroundColor": "#030712",
    "webhookUrl": "https://your-domain.vercel.app/api/webhook",
    "subtitle": "Discover digital art reimagined",
    "description": "Curated NFT showcases, auctions, and artist storytelling.",
    "screenshotUrls": [
      "https://your-domain.vercel.app/splash.svg"
    ],
    "primaryCategory": "art-creativity",
    "tags": ["nft", "art", "auctions"],
    "heroImageUrl": "https://your-domain.vercel.app/hero.svg",
    "tagline": "Where onchain curators meet collectors.",
    "ogTitle": "farbasenft",
    "ogDescription": "A boutique NFT marketplace experience crafted for Base mini apps.",
    "ogImageUrl": "https://your-domain.vercel.app/hero.svg",
    "noindex": true
  }
}`}
            </pre>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {manifestSigningSteps.map((option) => (
              <div
                key={option.title}
                className="space-y-4 rounded-2xl border border-white/5 bg-slate-950/70 p-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white">{option.title}</h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-200">
                    {option.steps.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-purple-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Image
                  src={option.image}
                  alt={`${option.title} confirmation`}
                  width={1200}
                  height={760}
                  className="w-full rounded-xl border border-slate-800"
                />
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
            <h3 className="text-lg font-semibold text-white">Sample manifest structure</h3>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{manifestExampleSnippet}
            </pre>
          </div>
          <div className="grid gap-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-sm text-amber-100">
            <p className="font-semibold text-amber-200">
              Warning
            </p>
            <p>
              Manifest updates take effect after you redeploy and repost the Mini App. Base re-indexes your configuration to refresh search, discovery, and embeds.
            </p>
          </div>
          <div className="grid gap-6 rounded-2xl border border-white/5 bg-slate-950/70 p-6">
            <h3 className="text-lg font-semibold text-white">Implementation steps</h3>
            <ul className="space-y-3 text-sm text-slate-200">
              {manifestImplementationSteps.map((step) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-indigo-400" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {manifestSchemaSections.map((section) => (
              <div
                key={section.title}
                className="flex h-full flex-col gap-4 rounded-2xl border border-white/5 bg-slate-950/70 p-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{section.description}</p>
                </div>
                <ul className="space-y-2 text-sm text-slate-200">
                  {section.fields.map((field) => (
                    <li key={`${section.title}-${field.name}`}>
                      <span className="font-medium text-white">{field.name}</span>
                      <span className="block text-slate-300">{field.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="grid gap-4 rounded-2xl border border-teal-500/40 bg-teal-500/10 p-6 text-sm text-teal-100">
            <p className="font-semibold text-teal-200">Tip</p>
            <p>
              Use the <a className="font-semibold text-white transition hover:underline" href="https://www.miniappassets.com/" target="_blank" rel="noopener noreferrer">Mini App Assets Generator</a> to export perfectly sized icons, splash images, and hero art for Base and Farcaster.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {manifestRelatedLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-white/5 bg-slate-950/70 p-6 text-sm text-slate-200 transition hover:border-white hover:text-white"
              >
                <p className="text-base font-semibold text-white">{link.label}</p>
                <p className="mt-2 text-sm text-slate-300">{link.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section
          id="base-account"
          className="space-y-10 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-10"
        >
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Base Account
            </p>
            <h2 className="text-3xl font-semibold text-white">
              Unlock powerful Base features with Base Account
            </h2>
            <p className="text-base text-slate-300">
              Base Account provides a secure, user-friendly way to interact with Base's decentralized infrastructure.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {baseAccountHighlights.map((highlight) => (
              <div
                key={highlight}
                className="rounded-2xl border border-white/5 bg-slate-950/70 p-6"
              >
                <p className="text-lg font-semibold text-white">{highlight}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
            <h3 className="text-lg font-semibold text-white">Wagmi Provider</h3>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{baseAccountWagmiSnippet}
            </pre>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
            <h3 className="text-lg font-semibold text-white">Batch Transactions</h3>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{baseAccountBatchSnippet}
            </pre>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
            <h3 className="text-lg font-semibold text-white">Resources</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {baseAccountBatchCards.map((card) => (
                <a
                  key={card.label}
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-white hover:text-white"
                >
                  <p className="text-base font-semibold text-white">{card.label}</p>
                  <p className="mt-2 text-sm text-slate-300">{card.description}</p>
                </a>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
            <h3 className="text-lg font-semibold text-white">Unsupported Features</h3>
            <p className="mt-3 text-sm text-slate-300">
              While Base Account provides a robust foundation, some features are not yet supported.
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              {baseAccountUnsupported.map((entry) => (
                <li key={entry.feature} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-red-400" />
                  <span>
                    <span className="font-semibold text-white">{entry.feature}</span>
                    <span className="block text-slate-300">Requires capability: {entry.capability}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
            <h3 className="text-lg font-semibold text-white">Additional Resources</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {baseAccountResources.map((resource) => (
                <a
                  key={resource.label}
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-white hover:text-white"
                >
                  <p className="text-base font-semibold text-white">{resource.label}</p>
                  <p className="mt-2 text-sm text-slate-300">{resource.description}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section
          id="mini-app-context"
          className="space-y-10 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-10"
        >
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Mini App Context</p>
            <h2 className="text-3xl font-semibold text-white">
              Tailor farbasenft instantly using Base mini app context data
            </h2>
            <p className="text-base text-slate-300">
              When farbasenft opens as a Mini App, `sdk.context` returns user, location, client, and feature metadata. Use it to personalize galleries, adapt layouts, and gate capability-dependent flows.
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
            <h3 className="text-lg font-semibold text-white">Type definitions</h3>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{miniAppContextTypeSnippet}
            </pre>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
            <h3 className="text-lg font-semibold text-white">Client-side usage example</h3>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{miniAppContextComponentSnippet}
            </pre>
          </div>
          <div className="grid gap-6 rounded-2xl border border-white/5 bg-slate-950/70 p-6">
            <h3 className="text-lg font-semibold text-white">Implementation steps</h3>
            <ul className="space-y-3 text-sm text-slate-200">
              {miniAppContextImplementationSteps.map((step) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-purple-400" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
            <h3 className="text-lg font-semibold text-white">Location types</h3>
            <p className="mt-2 text-sm text-slate-300">
              Use the launch location to tee up relevant CTAs (for example, showing a share modal when launched via `cast_share`).
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              {miniAppContextLocationTypes.map((entry) => (
                <li key={entry.type} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-indigo-400" />
                  <span>
                    <span className="font-semibold text-white">{entry.type}</span>
                    <span className="block text-slate-300">{entry.description}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {miniAppContextSchemas.map((section) => (
              <div
                key={section.title}
                className="flex h-full flex-col gap-4 rounded-2xl border border-white/5 bg-slate-950/70 p-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{section.description}</p>
                </div>
                <ul className="space-y-2 text-sm text-slate-200">
                  {section.fields.map((field) => (
                    <li key={`${section.title}-${field.name}`}>
                      <span className="font-medium text-white">{field.name}</span>
                      <span className="block text-slate-300">{field.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
              <h3 className="text-lg font-semibold text-white">User context example</h3>
              <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{miniAppContextExamples.user}
              </pre>
            </div>
            <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
              <h3 className="text-lg font-semibold text-white">Cast embed launch</h3>
              <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{miniAppContextExamples.castEmbed}
              </pre>
            </div>
            <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
              <h3 className="text-lg font-semibold text-white">Notification launch</h3>
              <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{miniAppContextExamples.notification}
              </pre>
            </div>
            <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
              <h3 className="text-lg font-semibold text-white">Client metadata</h3>
              <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{miniAppContextExamples.client}
              </pre>
            </div>
            <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
              <h3 className="text-lg font-semibold text-white">Feature flags</h3>
              <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{miniAppContextExamples.features}
              </pre>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-500/40 bg-slate-900/80 p-6 text-sm text-slate-200">
            <p className="font-semibold text-white">Note</p>
            <p className="mt-2 text-slate-300">{miniAppContextNote}</p>
          </div>
        </section>

        <section
          id="base-account"
          className="space-y-10 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-10"
        >
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Base Account</p>
            <h2 className="text-3xl font-semibold text-white">
              Ship passkey login, gasless UX, and batch transactions out of the box
            </h2>
            <p className="text-base text-slate-300">
              When farbasenft runs inside the Base app, users already have a smart-wallet powered Base Account.
              Wire it up through Wagmi to unlock payments, split transactions, and sponsored gas with a few lines of code.
            </p>
          </div>
          <ul className="grid gap-3 rounded-2xl border border-white/5 bg-slate-950/70 p-6 text-sm text-slate-200 sm:grid-cols-2">
            {baseAccountHighlights.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-indigo-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
              <h3 className="text-lg font-semibold text-white">Wagmi provider setup</h3>
              <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{baseAccountWagmiSnippet}
              </pre>
            </div>
            <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
              <h3 className="text-lg font-semibold text-white">Batch transactions with paymasters</h3>
              <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{baseAccountBatchSnippet}
              </pre>
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
            <h3 className="text-lg font-semibold text-white">Upcoming Mini App limitations</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2 text-sm text-slate-200">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                    <th className="px-2 py-1">Feature</th>
                    <th className="px-2 py-1">Unsupported methods</th>
                  </tr>
                </thead>
                <tbody>
                  {baseAccountUnsupported.map((row) => (
                    <tr key={row.feature} className="rounded-xl border border-white/5 bg-slate-950/80">
                      <td className="px-3 py-2 font-medium text-white">{row.feature}</td>
                      <td className="px-3 py-2 text-slate-300">{row.capability}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              This list evolves as new capabilities roll out. Check the Base Account reference for the latest status.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {baseAccountBatchCards.map((card) => (
              <a
                key={card.label}
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-white/5 bg-slate-950/70 p-6 text-sm text-slate-200 transition hover:border-white hover:text-white"
              >
                <p className="text-base font-semibold text-white">{card.label}</p>
                <p className="mt-2 text-sm text-slate-300">{card.description}</p>
              </a>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {baseAccountResources.map((card) => (
              <a
                key={card.label}
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-white/5 bg-slate-950/70 p-6 text-sm text-slate-200 transition hover:border-white hover:text-white"
              >
                <p className="text-base font-semibold text-white">{card.label}</p>
                <p className="mt-2 text-sm text-slate-300">{card.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section
          id="authentication"
          className="space-y-10 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-10"
        >
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Authentication</p>
            <h2 className="text-3xl font-semibold text-white">
              Verify collectors with Quick Auth when you need trusted data
            </h2>
            <p className="text-base text-slate-300">
              Context delivers instant profile data for UI personalization, while Quick Auth issues a verifiable JWT for sensitive flows like bidding, payouts, or gated drops.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
              <h3 className="text-lg font-semibold text-white">Frontend sign-in and fetch</h3>
              <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{authenticationFrontendSnippet}
              </pre>
            </div>
            <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
              <h3 className="text-lg font-semibold text-white">Backend verification endpoint</h3>
              <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{authenticationBackendSnippet}
              </pre>
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
            <h3 className="text-lg font-semibold text-white">JWT payload structure</h3>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{jwtPayloadExample}
            </pre>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <a
              href="/onchainkit/latest/components/minikit/hooks/useAuthenticate"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-white/5 bg-slate-950/70 p-6 text-sm text-slate-200 transition hover:border-white hover:text-white"
            >
              <p className="text-base font-semibold text-white">useAuthenticate</p>
              <p className="mt-2 text-sm text-slate-300">Minikit hook for triggering Quick Auth flows.</p>
            </a>
            <a
              href="/mini-apps/core-concepts/context"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-white/5 bg-slate-950/70 p-6 text-sm text-slate-200 transition hover:border-white hover:text-white"
            >
              <p className="text-base font-semibold text-white">Context API</p>
              <p className="mt-2 text-sm text-slate-300">Understand the difference between context and authenticated data.</p>
            </a>
          </div>
        </section>

        <section
          id="navigation"
          className="space-y-10 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-10"
        >
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Navigation</p>
            <h2 className="text-3xl font-semibold text-white">
              Use official SDK actions for cross-client safe navigation
            </h2>
            <p className="text-base text-slate-300">
              Farcaster clients enforce navigation rules so every Mini App behaves consistently. Swap legacy `window.open` or raw anchors for `sdk.actions` (or MiniKit hooks) to stay compliant.
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
            <h3 className="text-lg font-semibold text-white">Prompt to refactor legacy links</h3>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{navigationPromptMarkdown}
            </pre>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {navigationExamples.map((example) => (
              <div
                key={example.title}
                className="rounded-2xl border border-white/5 bg-slate-950/70 p-6"
              >
                <h3 className="text-lg font-semibold text-white">{example.title}</h3>
                <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{example.snippet}
                </pre>
              </div>
            ))}
          </div>
        </section>

        <section
          id="notifications"
          className="space-y-10 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-10"
        >
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Notifications</p>
            <h2 className="text-3xl font-semibold text-white">
              Re-engage collectors with Base-delivered notifications
            </h2>
            <p className="text-base text-slate-300">
              Webhooks from Base (or Farcaster) tell you when users add farbasenft, toggle notifications, or remove the Mini App. Store tokens by client FID and use them to send targeted alerts.
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
            <Image
              src="https://mintcdn.com/base-a060aa97/uEmvHrTbmfeJo9n_/images/minikit/notifications-sample.png?fit=max&auto=format&n=uEmvHrTbmfeJo9n_&q=85&s=52a08c64b48c40d8118d2b32ee4ba3c9"
              alt="Notification preview on mobile"
              width={1163}
              height={1033}
              className="w-full rounded-xl border border-slate-800"
            />
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
            <h3 className="text-lg font-semibold text-white">Webhook handler</h3>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{notificationsWebhookSnippet}
            </pre>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
            <h3 className="text-lg font-semibold text-white">Send notification helper</h3>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{notificationsSendSnippet}
            </pre>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
              <h3 className="text-lg font-semibold text-white">Request schema</h3>
              <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{notificationRequestSchema}
              </pre>
            </div>
            <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
              <h3 className="text-lg font-semibold text-white">Response schema</h3>
              <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{notificationResponseSchema}
              </pre>
            </div>
            <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
              <h3 className="text-lg font-semibold text-white">Event payload</h3>
              <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{notificationEventExamples.added}
              </pre>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <pre className="rounded-2xl border border-white/5 bg-slate-950/70 p-6 text-xs leading-6 text-slate-200">
{notificationEventExamples.enabled}
            </pre>
            <pre className="rounded-2xl border border-white/5 bg-slate-950/70 p-6 text-xs leading-6 text-slate-200">
{notificationEventExamples.disabled}
            </pre>
            <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-sm text-amber-100">
              <p className="font-semibold text-amber-200">Webhook timing</p>
              <p className="mt-2 text-amber-100">
                Respond within 10 seconds. Base waits for a successful 200 response before activating tokens, so queue long-running work asynchronously.
              </p>
            </div>
          </div>
        </section>

        <section
          id="notifications-neynar"
          className="space-y-10 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-10"
        >
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Notifications (Neynar)</p>
            <h2 className="text-3xl font-semibold text-white">
              Use Neynar to manage tokens, segmentation, and broadcasts
            </h2>
            <p className="text-base text-slate-300">
              Prefer a hosted option? Neynar stores tokens, handles batching, and gives you UI controls for broadcasting notifications—no custom server required.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
              <Image
                src="https://mintcdn.com/base-a060aa97/7Lsdarakb-9Agcjf/images/miniapps/neynar-notification-webhook.png?fit=max&auto=format&n=7Lsdarakb-9Agcjf&q=85&s=c23e17eac0255b752581673a06025398"
                alt="Neynar webhook configuration"
                width={1342}
                height={726}
                className="w-full rounded-xl border border-slate-800"
              />
              <p className="mt-3 text-sm text-slate-300">
                Copy the mini app notifications webhook into your manifest `webhookUrl` field.
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
              <h3 className="text-lg font-semibold text-white">Prompt users to add farbasenft</h3>
              <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{neynarAddMiniAppSnippet}
              </pre>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
              <h3 className="text-lg font-semibold text-white">Neynar send function</h3>
              <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{neynarSendFunctionSnippet}
              </pre>
            </div>
            <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
              <h3 className="text-lg font-semibold text-white">Advanced targeting example</h3>
              <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{neynarSendExampleSnippet}
              </pre>
            </div>
          </div>
        </section>

        <section
          id="base-app"
          className="space-y-10 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-10"
        >
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Building for the Base App
            </p>
            <h2 className="text-3xl font-semibold text-white">
              Focus on one core need and make it exceptional
            </h2>
            <p className="text-base text-slate-300">
              Base users crave simple, social, and onchain-native experiences. Use these prompts to keep farbasenft laser focused on daily value.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {baseAppSteps.map((step) => (
              <div
                key={step.title}
                className="rounded-2xl border border-white/5 bg-slate-950/70 p-6"
              >
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-200">
                  {step.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-teal-400" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
            <h3 className="text-lg font-semibold text-white">Featured Guidelines</h3>
            <p className="mt-3 text-sm text-slate-300">
              Follow Base featured guidelines to stay eligible for spotlight placements and deliver polished experiences.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {featuredGuidelines.map((guide) => (
                <a
                  key={guide.label}
                  href={guide.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-white hover:text-white"
                >
                  {guide.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        <section
          id="accept-payments"
          className="space-y-10 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-10"
        >
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Accept Payments</p>
            <h2 className="text-3xl font-semibold text-white">
              Enable one-tap USDC checkout with Base Pay
            </h2>
            <p className="text-base text-slate-300">
              Base Pay lets collectors pay in USDC with sponsored gas and smart wallet guarantees. Install the helper, call `pay()`, and optionally drop in the branded button for a native feel.
            </p>
          </div>
          <div className="grid gap-4 rounded-2xl border border-white/5 bg-slate-950/70 p-6 text-sm text-slate-200 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="font-semibold text-white">npm</p>
              <p className="mt-2 select-all rounded-xl bg-slate-900 px-3 py-2 font-mono text-xs text-slate-300">
                {basePayInstallSnippets.npm}
              </p>
            </div>
            <div>
              <p className="font-semibold text-white">pnpm</p>
              <p className="mt-2 select-all rounded-xl bg-slate-900 px-3 py-2 font-mono text-xs text-slate-300">
                {basePayInstallSnippets.pnpm}
              </p>
            </div>
            <div>
              <p className="font-semibold text-white">yarn</p>
              <p className="mt-2 select-all rounded-xl bg-slate-900 px-3 py-2 font-mono text-xs text-slate-300">
                {basePayInstallSnippets.yarn}
              </p>
            </div>
            <div>
              <p className="font-semibold text-white">bun</p>
              <p className="mt-2 select-all rounded-xl bg-slate-900 px-3 py-2 font-mono text-xs text-slate-300">
                {basePayInstallSnippets.bun}
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
            <h3 className="text-lg font-semibold text-white">Programmatic payment helper</h3>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{basePayHandlerSnippet}
            </pre>
            <div className="mt-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100">
              <p className="font-semibold text-amber-200">Warning</p>
              <p className="mt-2">
                Collecting payer email, phone, or shipping address via `payerInfo` is not yet supported inside Mini Apps. Keep flows lean until Base enables it.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-950/70 p-6">
            <h3 className="text-lg font-semibold text-white">Base Pay button component</h3>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
{basePayButtonSnippet}
            </pre>
            <div className="mt-4 rounded-2xl border border-teal-500/40 bg-teal-500/10 p-4 text-sm text-teal-100">
              <p className="font-semibold text-teal-200">Tip</p>
              <p className="mt-2">
                Follow the official Base Pay brand guidelines or reuse the `BasePayButton` component to keep checkout UI consistent across apps.
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <a
              href="/base-account/reference/base-pay/pay"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-white/5 bg-slate-950/70 p-6 text-sm text-slate-200 transition hover:border-white hover:text-white"
            >
              <p className="text-base font-semibold text-white">Base Pay Reference</p>
              <p className="mt-2 text-sm text-slate-300">
                Full API documentation for the helper function.
              </p>
            </a>
            <a
              href="/base-account/reference/ui-elements/base-pay-button"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-white/5 bg-slate-950/70 p-6 text-sm text-slate-200 transition hover:border-white hover:text-white"
            >
              <p className="text-base font-semibold text-white">Base Pay Button Reference</p>
              <p className="mt-2 text-sm text-slate-300">
                Explore customization options for the official button.
              </p>
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-slate-950/90 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <div>
            <p className="text-sm font-semibold text-slate-100">farbasenft</p>
            <p className="text-xs text-slate-500">
              Crafted as a Foundation-inspired Base mini app experience.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-slate-400">
            <a
              href="https://docs.base.org/mini-apps/quickstart/create-new-miniapp"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              Base mini app quickstart
            </a>
            <a
              href="https://foundation.app"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              Reference inspiration
            </a>
            <a
              href="https://docs.base.org/mini-apps/core-concepts/manifest"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              Manifest guide
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
