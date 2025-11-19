import { NextRequest, NextResponse } from 'next/server';

interface BaseNameInfo {
  name: string;
  address: string;
  avatar?: string;
  bio?: string;
}

/**
 * GET /api/wallet/basename - Resolve Base name information
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

    // Try to fetch from Base name service
    // In production, use real Base Namesystem API
    // For now, return mock data
    const baseNameInfo: BaseNameInfo = {
      name: `user.base`,
      address: address.toLowerCase(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${address}`,
      bio: 'NFT collector and Base enthusiast',
    };

    return NextResponse.json(baseNameInfo);
  } catch (error) {
    console.error('Basename resolution error:', error);
    return NextResponse.json(
      {
        error: 'Failed to resolve basename',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
