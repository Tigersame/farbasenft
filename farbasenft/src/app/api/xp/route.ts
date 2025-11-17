import { NextRequest, NextResponse } from "next/server";
import { XP_REWARDS, type XPAction, type UserXP, type XPTransaction } from "@/lib/xp";

// In-memory storage (replace with database in production)
const xpStorage = new Map<string, UserXP>();

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

  return NextResponse.json(userXP);
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

