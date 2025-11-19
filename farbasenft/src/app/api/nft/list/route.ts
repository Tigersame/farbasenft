import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo (replace with database in production)
const listings = new Map<string, Listing>();

interface Listing {
  tokenId: string;
  seller: string;
  price: string;
  currency: 'ETH' | 'USDC';
  duration: number;
  listingType: 'fixed' | 'auction';
  reservePrice?: string;
  createdAt: string;
  expiresAt: string;
  status: 'active' | 'sold' | 'cancelled' | 'expired';
  highestBid?: {
    bidder: string;
    amount: string;
    timestamp: string;
  };
}

/**
 * POST /api/nft/list - Create a new NFT listing
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tokenId, price, currency, duration, listingType, reservePrice, seller } = body;

    // Validation
    if (!tokenId || !price || !currency || !duration || !listingType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (parseFloat(price) <= 0) {
      return NextResponse.json(
        { error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    if (listingType === 'auction' && reservePrice && parseFloat(reservePrice) <= 0) {
      return NextResponse.json(
        { error: 'Reserve price must be greater than 0' },
        { status: 400 }
      );
    }

    // Create listing
    const createdAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString();

    const listing: Listing = {
      tokenId,
      seller: seller || '0x0000000000000000000000000000000000000000', // Replace with actual wallet address
      price,
      currency,
      duration,
      listingType,
      reservePrice,
      createdAt,
      expiresAt,
      status: 'active',
    };

    listings.set(tokenId, listing);

    return NextResponse.json({
      success: true,
      listing,
      message: 'NFT listed successfully',
    });
  } catch (error) {
    console.error('NFT listing error:', error);
    return NextResponse.json(
      {
        error: 'Failed to list NFT',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/nft/list?tokenId=123 - Get listing details
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tokenId = searchParams.get('tokenId');

    if (!tokenId) {
      // Return all active listings
      const allListings = Array.from(listings.values())
        .filter(listing => listing.status === 'active')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return NextResponse.json({
        listings: allListings,
        count: allListings.length,
      });
    }

    // Return specific listing
    const listing = listings.get(tokenId);

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Check if listing has expired
    if (new Date(listing.expiresAt) < new Date() && listing.status === 'active') {
      listing.status = 'expired';
      listings.set(tokenId, listing);
    }

    return NextResponse.json({ listing });
  } catch (error) {
    console.error('Get listing error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch listing',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/nft/list?tokenId=123 - Cancel a listing
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tokenId = searchParams.get('tokenId');

    if (!tokenId) {
      return NextResponse.json(
        { error: 'Token ID is required' },
        { status: 400 }
      );
    }

    const listing = listings.get(tokenId);

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    if (listing.status !== 'active') {
      return NextResponse.json(
        { error: 'Listing is not active' },
        { status: 400 }
      );
    }

    listing.status = 'cancelled';
    listings.set(tokenId, listing);

    return NextResponse.json({
      success: true,
      message: 'Listing cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel listing error:', error);
    return NextResponse.json(
      {
        error: 'Failed to cancel listing',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
