import { NextRequest, NextResponse } from "next/server";
import { XP_REWARDS, type XPAction, type UserXP, type XPTransaction } from "@/lib/xp";
import { canClaimDailyLogin } from "@/lib/xp";

// In-memory storage (replace with database in production)
const xpStorage = new Map<string, UserXP>();

/**
 * POST /api/xp/daily-login
 * Claim daily login bonus
 * Body: { wallet: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { wallet } = await request.json();

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    const walletAddress = wallet.toLowerCase();
    let userXP: UserXP = xpStorage.get(walletAddress) || {
      walletAddress,
      totalXP: 0,
      level: 0,
      sbtClaimed: false,
      lastLoginDate: undefined,
      transactions: [] as XPTransaction[],
    };

    // Check if daily login can be claimed
    if (!canClaimDailyLogin(userXP.lastLoginDate)) {
      return NextResponse.json({
        success: false,
        message: "Daily login already claimed today",
        userXP,
      });
    }

    // Award daily login XP
    const xpAmount = XP_REWARDS.DAILY_LOGIN;
    const today = new Date().toISOString().split("T")[0];

    // Create transaction
    const transaction: XPTransaction = {
      id: `${Date.now()}-${Math.random()}`,
      walletAddress,
      action: "DAILY_LOGIN" as XPAction,
      xpAmount,
      timestamp: Date.now(),
    };

    // Update user XP
    userXP.totalXP += xpAmount;
    userXP.level = Math.floor(Math.sqrt(userXP.totalXP / 100));
    userXP.lastLoginDate = today;
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
      totalXP: userXP.totalXP,
      userXP,
    });
  } catch (error) {
    console.error("Daily login error:", error);
    return NextResponse.json(
      { error: "Failed to process daily login" },
      { status: 500 }
    );
  }
}

