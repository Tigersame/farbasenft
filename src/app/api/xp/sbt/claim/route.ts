import { NextRequest, NextResponse } from "next/server";
import { XP_REWARDS } from "@/lib/xp";

// Track SBT claims (replace with database in production)
const sbtClaims = new Set<string>();
const MAX_SBT_CLAIMS = 20000;

/**
 * POST /api/xp/sbt/claim
 * Claim SBT and bonus XP
 * Body: { wallet: string, signature?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet } = body;

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    const walletAddress = wallet.toLowerCase();

    // Check if already claimed
    if (sbtClaims.has(walletAddress)) {
      return NextResponse.json(
        { error: "SBT already claimed for this wallet" },
        { status: 400 }
      );
    }

    // Check if we've reached the limit
    if (sbtClaims.size >= MAX_SBT_CLAIMS) {
      return NextResponse.json(
        { error: "SBT claim limit reached (20,000 users)" },
        { status: 400 }
      );
    }

    // Add to claims
    sbtClaims.add(walletAddress);

    // Award SBT claim XP
    // This will be handled by the main XP route
    const xpResponse = await fetch(`${request.nextUrl.origin}/api/xp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wallet: walletAddress,
        action: "SBT_CLAIM",
        metadata: {
          claimNumber: sbtClaims.size,
          timestamp: Date.now(),
        },
      }),
    });

    const xpData = await xpResponse.json();

    return NextResponse.json({
      success: true,
      sbtClaimed: true,
      claimNumber: sbtClaims.size,
      xpEarned: XP_REWARDS.SBT_CLAIM,
      userXP: xpData.userXP,
      message: "SBT claimed successfully! You earned 1000 XP.",
    });
  } catch (error) {
    console.error("SBT claim error:", error);
    return NextResponse.json(
      { error: "Failed to claim SBT" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/xp/sbt/claim?wallet=0x...
 * Check if wallet can claim SBT
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const wallet = searchParams.get("wallet");

  if (!wallet) {
    return NextResponse.json(
      { error: "Wallet address is required" },
      { status: 400 }
    );
  }

  const walletAddress = wallet.toLowerCase();
  const claimed = sbtClaims.has(walletAddress);
  const available = sbtClaims.size < MAX_SBT_CLAIMS;

  return NextResponse.json({
    canClaim: !claimed && available,
    alreadyClaimed: claimed,
    limitReached: !available,
    remaining: Math.max(0, MAX_SBT_CLAIMS - sbtClaims.size),
    totalClaimed: sbtClaims.size,
  });
}

