import { NextRequest, NextResponse } from "next/server";
import { XP_REWARDS, type XPAction, type UserXP, type XPTransaction } from "@/lib/xp";
import { CACHE_5MIN, CACHE_NONE } from "@/lib/apiCache";

// In-memory storage (replace with database in production)
const xpStorage = new Map<string, UserXP>();
// Track recent XP transactions to prevent duplicates (wallet -> action -> timestamp)
const recentTransactions = new Map<string, Map<XPAction, number>>();
const DUPLICATE_PREVENT_WINDOW = 5000; // 5 seconds

/**
 * GET /api/xp?wallet=0x...
 * Get user XP data
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const walletAddress = searchParams.get("wallet");

  if (!walletAddress) {
    return NextResponse.json(
      { error: "Wallet address is required" },
      { status: 400 }
    );
  }

  const userXP = xpStorage.get(walletAddress.toLowerCase()) || {
    walletAddress: walletAddress.toLowerCase(),
    totalXP: 0,
    level: 0,
    sbtClaimed: false,
    transactions: [],
  };

  // Use 10-minute cache for XP data to prevent rate limiting
  const cacheHeaders = {
    'Cache-Control': 'public, max-age=600, s-maxage=600', // 10 minutes
    'CDN-Cache-Control': 'max-age=600',
  };

  return NextResponse.json(userXP, { headers: cacheHeaders });
}

/**
 * POST /api/xp
 * Add XP for an action
 * Body: { wallet: string, action: XPAction, metadata?: object }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet, action, metadata } = body;

    if (!wallet || !action) {
      return NextResponse.json(
        { error: "Wallet and action are required" },
        { status: 400 }
      );
    }

    const walletAddress = wallet.toLowerCase();
    const xpAmount = XP_REWARDS[action as XPAction];

    if (!xpAmount) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    console.log(`[XP API] Processing ${action} for wallet ${walletAddress}`);

    // Check for duplicate transactions (same action within 5 seconds)
    const walletTransactions = recentTransactions.get(walletAddress);
    if (walletTransactions) {
      const lastActionTime = walletTransactions.get(action as XPAction);
      if (lastActionTime && Date.now() - lastActionTime < DUPLICATE_PREVENT_WINDOW) {
        console.log(`[XP API] Duplicate request prevented for ${action}`);
        // Return existing user data without adding XP
        const userXP = xpStorage.get(walletAddress);
        return NextResponse.json({
          success: false,
          message: "Duplicate request - XP already claimed",
          userXP: userXP || {
            walletAddress,
            totalXP: 0,
            level: 0,
            sbtClaimed: false,
            transactions: [],
          },
        }, { status: 429 });
      }
    }

    // Track this transaction attempt
    if (!recentTransactions.has(walletAddress)) {
      recentTransactions.set(walletAddress, new Map());
    }
    recentTransactions.get(walletAddress)!.set(action as XPAction, Date.now());

    // Get or create user XP
    let userXP: UserXP = xpStorage.get(walletAddress) || {
      walletAddress,
      totalXP: 0,
      level: 0,
      sbtClaimed: false,
      lastLoginDate: undefined,
      transactions: [] as XPTransaction[],
    };

    // Check daily login - only award once per day
    if (action === "DAILY_LOGIN") {
      const today = new Date().toISOString().split("T")[0];
      if (userXP.lastLoginDate === today) {
        return NextResponse.json({
          success: false,
          message: "Daily login already claimed today",
          userXP,
        });
      }
      userXP.lastLoginDate = today;
    }

    // Prevent duplicate SBT claims
    if (action === "SBT_CLAIM" && userXP.sbtClaimed) {
      return NextResponse.json({
        success: false,
        message: "SBT already claimed for this wallet",
        userXP,
      }, { status: 400 });
    }

    // For SWAP action, require transaction hash verification
    if (action === "SWAP") {
      if (!metadata?.transactionHash) {
        return NextResponse.json({
          success: false,
          message: "Swap action requires verified transaction hash. Only on-chain swaps are rewarded.",
          userXP,
        }, { status: 400 });
      }
    }

    // Mark SBT as claimed when SBT_CLAIM action is processed
    if (action === "SBT_CLAIM") {
      userXP.sbtClaimed = true;
    }

    // Create transaction
    const transaction: XPTransaction = {
      id: `${Date.now()}-${Math.random()}`,
      walletAddress,
      action: action as XPAction,
      xpAmount,
      timestamp: Date.now(),
      metadata,
    };

    // Update user XP
    userXP.totalXP += xpAmount;
    userXP.level = Math.floor(Math.sqrt(userXP.totalXP / 100));
    userXP.transactions.push(transaction);

    console.log(`[XP API] ✓ Award ${xpAmount} XP for ${action}. New total: ${userXP.totalXP} XP, Level: ${userXP.level}`);

    // Keep only last 100 transactions
    if (userXP.transactions.length > 100) {
      userXP.transactions = userXP.transactions.slice(-100);
    }

    // Save
    xpStorage.set(walletAddress, userXP);

    return NextResponse.json({
      success: true,
      xpEarned: xpAmount,
      userXP,
    });
  } catch (error) {
    console.error("XP API error:", error);
    return NextResponse.json(
      { error: "Failed to process XP" },
      { status: 500 }
    );
  }
}

