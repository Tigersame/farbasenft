import { NextRequest, NextResponse } from 'next/server';

// Mock like storage - replace with real database
const likesStore: Record<string, number> = {};

export async function POST(request: NextRequest) {
  try {
    const { itemId } = await request.json();

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required', success: false },
        { status: 400 }
      );
    }

    // Increment like count
    likesStore[itemId] = (likesStore[itemId] || 0) + 1;

    return NextResponse.json({
      itemId,
      likes: likesStore[itemId],
      success: true,
    });
  } catch (error) {
    console.error('Error liking NFT:', error);
    return NextResponse.json(
      { error: 'Failed to like NFT', success: false },
      { status: 500 }
    );
  }
}
