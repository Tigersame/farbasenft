import { NextRequest, NextResponse } from 'next/server';

/**
 * Domain Migration Middleware
 * 
 * Handles automatic redirects when migrating to a new domain.
 * Set NEXT_PUBLIC_CANONICAL_DOMAIN environment variable to enable.
 * 
 * Reference: https://miniapps.farcaster.xyz/docs/guides/domain-migration
 */

export function middleware(request: NextRequest) {
  const canonicalDomain = process.env.NEXT_PUBLIC_CANONICAL_DOMAIN;
  
  // Skip if no canonical domain is set (no migration in progress)
  if (!canonicalDomain) {
    return NextResponse.next();
  }
  
  // Get current request hostname
  const currentHost = request.headers.get('host') || '';
  const currentHostname = currentHost.split(':')[0]; // Remove port if present
  
  // Skip if already on canonical domain
  if (currentHostname === canonicalDomain) {
    return NextResponse.next();
  }
  
  // Skip redirects for:
  // - API routes (let them work on old domain during transition)
  // - Manifest endpoint (needs to stay accessible with canonicalDomain field)
  // - Static assets
  const pathname = request.nextUrl.pathname;
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/.well-known/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/')
  ) {
    return NextResponse.next();
  }
  
  // Build new URL with canonical domain
  const newUrl = new URL(request.url);
  newUrl.hostname = canonicalDomain;
  newUrl.port = ''; // Remove port for production domains
  
  // 301 Permanent Redirect to new domain
  console.log(`[Domain Migration] Redirecting ${request.url} -> ${newUrl.toString()}`);
  return NextResponse.redirect(newUrl, { status: 301 });
}

/**
 * Configure which routes the middleware should run on
 * Run on all routes except static files and images
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)',
  ],
};
