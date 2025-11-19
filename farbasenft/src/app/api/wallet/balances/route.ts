import { NextRequest, NextResponse } from 'next/server';

interface WalletBalance {
  token: string;
  symbol: string;
  balance: string;
  usdValue: string;
  decimals: number;
}

/**
 * GET /api/wallet/balances - Get wallet token balances
 * Query params: address
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    // Validate Ethereum address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum address' },
        { status: 400 }
      );
    }

    // Mock balances - in production, use actual RPC calls or services like Alchemy
    const mockBalances: WalletBalance[] = [
      {
        token: 'ethereum',
        symbol: 'ETH',
        balance: '2.5',
        usdValue: '5000.00',
        decimals: 18,
      },
      {
        token: 'usdc',
        symbol: 'USDC',
        balance: '1500.00',
        decimals: 6,
        usdValue: '1500.00',
      },
      {
        token: 'degen',
        symbol: 'DEGEN',
        balance: '5000.00',
        decimals: 18,
        usdValue: '250.00',
      },
    ];

    const totalUsd = mockBalances.reduce(
      (sum, b) => sum + parseFloat(b.usdValue),
      0
    );

    return NextResponse.json({
      address: address.toLowerCase(),
      balances: mockBalances,
      totalUsd: totalUsd.toFixed(2),
      chain: 'base',
    });
  } catch (error) {
    console.error('Balance fetch error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch balances',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
