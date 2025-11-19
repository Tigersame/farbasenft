import { NextRequest, NextResponse } from "next/server";
import { createClient, Errors } from "@farcaster/quick-auth";

const client = createClient();

/**
 * Quick Auth API endpoint for validating JWT tokens
 * Implements the Quick Auth verification flow from Farcaster Mini Apps SDK
 * 
 * Reference: https://miniapps.farcaster.xyz/docs/sdk/quick-auth
 */

/**
 * GET /api/auth/quick-auth/me
 * Validates a Quick Auth JWT token and returns user information
 * 
 * The token is expected in the Authorization header: Bearer <token>
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid Authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7); // Remove "Bearer " prefix

    // Get the domain from the request
    const domain = request.headers.get("host") || "farbasenft.xyz";

    try {
      // Verify the JWT token using Farcaster Quick Auth
      const payload = await client.verifyJwt({
        token,
        domain,
      });

      // payload.sub contains the FID of the authenticated user
      const fid = payload.sub;

      // Return user information
      return NextResponse.json({
        success: true,
        user: {
          fid,
          isAuthenticated: true,
        },
      });
    } catch (verifyError) {
      if (verifyError instanceof Errors.InvalidTokenError) {
        return NextResponse.json(
          { error: "Invalid or expired token" },
          { status: 401 }
        );
      }

      throw verifyError;
    }
  } catch (error) {
    console.error("Quick Auth verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify authentication" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/auth/quick-auth/logout
 * Handles logout by clearing authentication state on the client
 * (actual logout is handled client-side)
 */
export async function POST(request: NextRequest) {
  try {
    // Simply return success - logout is handled client-side
    // by clearing the stored token from memory
    return NextResponse.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Failed to logout" },
      { status: 500 }
    );
  }
}
