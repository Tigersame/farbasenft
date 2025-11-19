import { NextRequest, NextResponse } from 'next/server';

interface Trade {
  id: string;
  type: 'buy' | 'sell' | 'list' | 'mint';
  nftName: string;
  price: string;
  currency: 'ETH' | 'USDC';
  timestamp: string;
  status: 'completed' | 'pending' | 'cancelled';
}

// In-memory storage for demo (replace with database in production)
const mockTrades: Trade[] = [
  {
    id: '1',
    type: 'buy',
    nftName: 'Chromatic Dreams #123',
    price: '2.5',
    currency: 'ETH',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
  },
  {
    id: '2',
    type: 'sell',
    nftName: 'Aurora Veil #456',
    price: '1.8',
    currency: 'ETH',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
  },
  {
    id: '3',
    type: 'list',
    nftName: 'Silk Echoes #789',
    price: '3000',
    currency: 'USDC',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
  },
  {
    id: '4',
    type: 'mint',
    nftName: 'Neon Dreams #001',
    price: '0.5',
    currency: 'ETH',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
  },
  {
    id: '5',
    type: 'buy',
    nftName: 'Digital Canvas #234',
    price: '1.2',
    currency: 'ETH',
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
  },
  {
    id: '6',
    type: 'sell',
    nftName: 'Pixel Art #567',
    price: '800',
    currency: 'USDC',
    timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
  },
];

/**
 * GET /api/dashboard/trades - Get user trading history
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

    // Filter trades by date range
    const now = new Date();
    let daysBack = 30;

    if (range === '7d') daysBack = 7;
    else if (range === '90d') daysBack = 90;
    else if (range === 'all') daysBack = 999999;

    const cutoffDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

    const filteredTrades = mockTrades.filter(
      (trade) => new Date(trade.timestamp) >= cutoffDate
    );

    return NextResponse.json(filteredTrades);
  } catch (error) {
    console.error('Dashboard trades error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch trades',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
