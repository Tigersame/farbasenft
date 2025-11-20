import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

/**
 * Dynamic OG Image Generator for NFT Sharing
 * 
 * Following Farcaster best practices:
 * - 3:2 aspect ratio (1200x800)
 * - PNG format via ImageResponse
 * - Cache-Control headers with max-age
 * 
 * Usage: /api/og/nft?name=Art&price=1.5&collection=Gallery
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const name = searchParams.get('name') || 'NFT';
    const price = searchParams.get('price') || '0.0';
    const collection = searchParams.get('collection') || 'Collection';
    const artist = searchParams.get('artist') || '';
    const image = searchParams.get('image');

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#030712',
            backgroundImage: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            position: 'relative',
          }}
        >
          {/* Background gradient overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 30% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 60%)',
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '90%',
              padding: '60px',
              gap: '60px',
            }}
          >
            {/* NFT Image Section */}
            {image && (
              <div
                style={{
                  display: 'flex',
                  width: '400px',
                  height: '400px',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: '2px solid rgba(6, 182, 212, 0.3)',
                  boxShadow: '0 20px 60px rgba(6, 182, 212, 0.2)',
                }}
              >
                <img
                  src={image}
                  alt={name}
                  width="400"
                  height="400"
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </div>
            )}

            {/* Info Section */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
                gap: '20px',
              }}
            >
              {/* Collection Badge */}
              <div
                style={{
                  display: 'flex',
                  padding: '12px 24px',
                  backgroundColor: 'rgba(6, 182, 212, 0.1)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '999px',
                  fontSize: '24px',
                  color: '#06b6d4',
                  fontWeight: '600',
                  width: 'fit-content',
                }}
              >
                {collection}
              </div>

              {/* NFT Name */}
              <div
                style={{
                  display: 'flex',
                  fontSize: '64px',
                  fontWeight: '700',
                  color: '#f1f5f9',
                  lineHeight: 1.2,
                }}
              >
                {name}
              </div>

              {/* Artist */}
              {artist && (
                <div
                  style={{
                    display: 'flex',
                    fontSize: '28px',
                    color: '#94a3b8',
                    fontWeight: '500',
                  }}
                >
                  by {artist}
                </div>
              )}

              {/* Price */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginTop: '20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: '56px',
                    fontWeight: '800',
                    color: '#06b6d4',
                  }}
                >
                  {price} ETH
                </div>
              </div>

              {/* Branding */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginTop: '40px',
                  fontSize: '24px',
                  color: '#64748b',
                }}
              >
                <span>🎨</span>
                <span>farbasenft</span>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 800,
        headers: {
          // Cache for 1 hour - reasonable freshness for NFT listings
          'Cache-Control': 'public, immutable, no-transform, max-age=3600',
        },
      }
    );
  } catch (error) {
    console.error('OG Image generation error:', error);
    
    // Return fallback with short cache to prevent caching error images
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#030712',
          }}
        >
          <div style={{ fontSize: '48px', color: '#f1f5f9' }}>
            🎨 farbasenft
          </div>
          <div style={{ fontSize: '24px', color: '#64748b', marginTop: '20px' }}>
            NFT Marketplace on Base
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 800,
        headers: {
          // Very short cache for error fallback
          'Cache-Control': 'public, no-transform, max-age=60',
        },
      }
    );
  }
}
