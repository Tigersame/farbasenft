import { createClient, Errors } from "@farcaster/quick-auth";
import { NextRequest, NextResponse } from "next/server";

// Get domain from environment variable or use the request origin
const getDomain = (request: NextRequest): string => {
  const envDomain = process.env.FARCASTER_AUTH_DOMAIN;
  if (envDomain) {
    return envDomain;
  }

  // Fallback to request origin
  const origin = request.headers.get("origin") || request.url;
  try {
    const url = new URL(origin);
    return url.hostname;
  } catch {
    // Default fallback
    return "localhost";
  }
};

const client = createClient();

/**
 * GET /api/auth
 * Verifies Farcaster Quick Auth JWT token
 * Returns user FID if token is valid
 */
export async function GET(request: NextRequest) {
  const authorization = request.headers.get("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Unauthorized", message: "Missing or invalid Authorization header" },
      { status: 401 }
    );
  }

  const token = authorization.split(" ")[1];
  const domain = getDomain(request);

  try {
    // Verify the JWT token
    const payload = await client.verifyJwt({ token, domain });

    // Return user FID (subject of the JWT)
    return NextResponse.json({
      fid: payload.sub,
      iat: payload.iat,
      exp: payload.exp,
      iss: payload.iss,
    });
  } catch (error) {
    if (error instanceof Errors.InvalidTokenError) {
      return NextResponse.json(
        { error: "Invalid token", message: "The provided token is invalid or expired" },
        { status: 401 }
      );
    }

    console.error("Auth verification error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: "Failed to verify authentication" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/auth
 * Alternative endpoint for POST requests (some clients prefer POST)
 */
export async function POST(request: NextRequest) {
  return GET(request);
}

