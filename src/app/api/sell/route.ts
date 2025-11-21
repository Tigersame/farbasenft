import { NextRequest, NextResponse } from 'next/server';

// POST /api/sell - Sell NFT (placeholder for blockchain integration)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tokenId } = body;

    if (!tokenId) {
      return NextResponse.json(
        { error: 'Missing tokenId' },
        { status: 400 }
      );
    }

    // TODO: Integrate with smart contract selling/listing logic
    // For now, simulate successful sell order
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: 'Sell order created',
      tokenId,
      txHash: `0x${Math.random().toString(16).slice(2)}`, // Mock transaction hash
    });
  } catch (error) {
    console.error('Sell error:', error);
    return NextResponse.json(
      { error: 'Sell failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
