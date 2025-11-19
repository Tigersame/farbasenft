import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo (replace with database in production)
const userStats = new Map<string, any>();

/**
 * GET /api/dashboard/stats - Get user statistics
 * Query params: wallet, range (7d, 30d, 90d, all)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const wallet = searchParams.get('wallet');
    const range = searchParams.get('range') || '30d';

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Generate mock stats based on wallet
    const mockStats = {
      totalTrades: Math.floor(Math.random() * 50) + 5,
      totalVolume: (Math.random() * 20 + 2).toFixed(2),
      totalNFTsOwned: Math.floor(Math.random() * 30) + 1,
      successRate: Math.floor(Math.random() * 30) + 70,
      totalXP: Math.floor(Math.random() * 5000) + 1000,
      level: Math.floor(Math.random() * 15) + 1,
    };

    return NextResponse.json(mockStats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch stats',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
