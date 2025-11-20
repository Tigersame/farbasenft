# Farcaster Authentication Quick Reference

Quick reference for implementing and using Farcaster Quick Auth authentication.

## 📚 Full Documentation
See [AUTH_IMPLEMENTATION.md](./AUTH_IMPLEMENTATION.md) for complete implementation details.

## 🎯 Overview
- **Quick Auth**: JWT-based authentication using Sign in with Farcaster
- **Automatic**: Seamless sign-in when user opens app
- **Secure**: Server-side JWT verification
- **Fast**: Edge-deployed auth service worldwide

## 🚀 Quick Start

### 1. Frontend: Use the Hook
```tsx
import { useQuickAuth } from "@/lib/useQuickAuth";

export function MyComponent() {
  const { user, isAuthenticated, signIn } = useQuickAuth();

  if (!isAuthenticated) {
    return <button onClick={signIn}>Sign In</button>;
  }

  return <div>Welcome, FID: {user?.fid}</div>;
}
```

### 2. Frontend: Auto-Fetch with Authentication
```tsx
import { sdk } from "@farcaster/miniapp-sdk";
import { useEffect, useState } from "react";

export function UserData() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      // Automatically adds Bearer token
      const res = await sdk.quickAuth.fetch("/api/me");
      if (res.ok) {
        setUser(await res.json());
        sdk.actions.ready(); // Dismiss splash screen
      }
    }
    fetchUser();
  }, []);

  return user ? <div>Hello, {user.fid}</div> : null;
}
```

### 3. Frontend: Get Token Directly
```tsx
import { sdk } from "@farcaster/miniapp-sdk";

async function makeAuthRequest() {
  // Get JWT token
  const { token } = await sdk.quickAuth.getToken();

  // Use in custom request
  const res = await fetch("/api/custom", {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
}
```

### 4. Backend: Verify Token
```typescript
import { createClient, Errors } from "@farcaster/quick-auth";
import { NextRequest, NextResponse } from "next/server";

const client = createClient();

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("Authorization");
  
  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authorization.split(" ")[1];
  const domain = process.env.FARCASTER_AUTH_DOMAIN || "localhost";

  try {
    const payload = await client.verifyJwt({ token, domain });
    
    return NextResponse.json({
      fid: payload.sub, // User's Farcaster ID
      iat: payload.iat,
      exp: payload.exp,
    });
  } catch (error) {
    if (error instanceof Errors.InvalidTokenError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json({ error: "Auth failed" }, { status: 500 });
  }
}
```

## 🔑 Environment Variables

```bash
# Frontend
NEXT_PUBLIC_BACKEND_URL=https://y-six-dun.vercel.app
NEXT_PUBLIC_APP_URL=https://y-six-dun.vercel.app

# Backend
FARCASTER_AUTH_DOMAIN=y-six-dun.vercel.app

# Optional: User profile enrichment
NEYNAR_API_KEY=your_neynar_api_key
```

**Important**: Domain must match production domain exactly!

## 📊 API Endpoints

### GET /api/auth
Verify JWT token and return user info.

**Request**:
```bash
curl -X GET https://y-six-dun.vercel.app/api/auth \
  -H "Authorization: Bearer <jwt_token>"
```

**Response** (Success):
```json
{
  "fid": 12345,
  "iat": 1700000000,
  "exp": 1700003600
}
```

**Response** (Error):
```json
{
  "error": "Invalid token"
}
```

### POST /api/auth/quick-auth
Alternative endpoint with additional validation.

**Request**:
```bash
curl -X POST https://y-six-dun.vercel.app/api/auth/quick-auth \
  -H "Authorization: Bearer <jwt_token>"
```

## 🎨 Common Patterns

### Pattern 1: Protected Component
```tsx
import { useQuickAuth } from "@/lib/useQuickAuth";

export function ProtectedContent() {
  const { user, isAuthenticated, isLoading } = useQuickAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please sign in</div>;

  return <div>Protected content for FID {user?.fid}</div>;
}
```

### Pattern 2: Auto Sign-In
```tsx
import { useQuickAuth } from "@/lib/useQuickAuth";
import { useEffect } from "react";

export function AutoAuth() {
  const { isAvailable, isAuthenticated, signIn } = useQuickAuth();

  useEffect(() => {
    if (isAvailable && !isAuthenticated) {
      signIn();
    }
  }, [isAvailable, isAuthenticated, signIn]);

  return <div>Authenticating...</div>;
}
```

### Pattern 3: Conditional Rendering
```tsx
import { useQuickAuth } from "@/lib/useQuickAuth";

export function UserMenu() {
  const { user, isAuthenticated, signIn, signOut } = useQuickAuth();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <span>FID: {user?.fid}</span>
          <button onClick={signOut}>Sign Out</button>
        </>
      ) : (
        <button onClick={signIn}>Sign In</button>
      )}
    </div>
  );
}
```

### Pattern 4: Backend Middleware
```typescript
import { createClient, Errors } from "@farcaster/quick-auth";

const client = createClient();

export async function authMiddleware(request: Request) {
  const authorization = request.headers.get("Authorization");
  
  if (!authorization?.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authorization.split(" ")[1];
  const payload = await client.verifyJwt({
    token,
    domain: process.env.FARCASTER_AUTH_DOMAIN!,
  });

  return { fid: payload.sub };
}

// Usage in route
export async function POST(request: Request) {
  const user = await authMiddleware(request);
  // user.fid is verified
}
```

## ⚡ Performance Optimization

### Add Preconnect
```tsx
// In app/layout.tsx
import { preconnect } from "react-dom";

export default function RootLayout({ children }) {
  preconnect("https://auth.farcaster.xyz");
  return <html><body>{children}</body></html>;
}
```

Or in HTML:
```html
<link rel="preconnect" href="https://auth.farcaster.xyz" />
```

## 🎯 Use Cases

### NFT Minting with Auth
```tsx
async function mintNFT() {
  const { token } = await sdk.quickAuth.getToken();
  
  await fetch("/api/nft/mint", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tokenId: 123 }),
  });
}
```

### XP Tracking with User
```tsx
import { useQuickAuth } from "@/lib/useQuickAuth";

export function XPDisplay() {
  const { user } = useQuickAuth();
  const [xp, setXP] = useState(0);

  useEffect(() => {
    if (user?.fid) {
      fetch(`/api/xp?fid=${user.fid}`)
        .then(res => res.json())
        .then(data => setXP(data.xp));
    }
  }, [user]);

  return <div>{xp} XP</div>;
}
```

### Leaderboard with Highlight
```tsx
import { useQuickAuth } from "@/lib/useQuickAuth";

export function Leaderboard({ entries }) {
  const { user } = useQuickAuth();

  return (
    <div>
      {entries.map(entry => (
        <div 
          key={entry.fid}
          className={entry.fid === user?.fid ? "highlight" : ""}
        >
          FID {entry.fid}: {entry.score}
        </div>
      ))}
    </div>
  );
}
```

## 🔒 Security Best Practices

### ✅ DO
- Verify tokens on backend with `client.verifyJwt()`
- Check domain matches your production domain
- Handle token expiration (check `payload.exp`)
- Use HTTPS in production
- Rate limit auth endpoints

### ❌ DON'T
- Trust tokens without verification
- Skip domain validation
- Store tokens in localStorage (use memory)
- Expose auth logic in frontend
- Accept tokens from wrong domain

## 🧪 Testing

### Development
```bash
# Quick Auth only works in production Farcaster context
# Cannot test with localhost or ngrok

# 1. Deploy to production
npm run build
git push

# 2. Test in Warpcast
# Open: https://warpcast.com/~/miniapp?url=https://y-six-dun.vercel.app
```

### Testing Checklist
- [ ] Quick Auth available in Farcaster app
- [ ] Token retrieved successfully
- [ ] Backend verifies token
- [ ] User FID displayed
- [ ] Error handling works
- [ ] Auto sign-in on app open
- [ ] Preconnect hint added

### Debug Component
```tsx
import { FarcasterDebug } from "@/components/FarcasterDebug";

// Shows auth status, context, user info
<FarcasterDebug />
```

## 🐛 Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| "Quick Auth not available" | Not in Farcaster context | Test in Warpcast with production URL |
| "Invalid token" | Domain mismatch | Check `FARCASTER_AUTH_DOMAIN` matches domain |
| Token not persisting | Memory-only storage | Expected behavior, re-auth on refresh |
| "Missing Authorization header" | Token not sent | Use `sdk.quickAuth.fetch()` or add manually |
| Slow authentication | No preconnect | Add preconnect to auth.farcaster.xyz |

### Quick Fixes

**Domain Mismatch**:
```bash
# Check domain in Vercel
vercel env ls

# Set correct domain
echo "y-six-dun.vercel.app" | vercel env add FARCASTER_AUTH_DOMAIN production
```

**Token Not Working**:
```typescript
// Check token expiration
const payload = await client.verifyJwt({ token, domain });
console.log("Token expires:", new Date(payload.exp * 1000));
```

**Not Auto-Signing In**:
```tsx
// Add auto sign-in effect
useEffect(() => {
  if (isAvailable && !isAuthenticated && !isLoading) {
    signIn();
  }
}, [isAvailable, isAuthenticated, isLoading, signIn]);
```

## 📊 Hook API Reference

### useQuickAuth()
```typescript
interface UseQuickAuthReturn {
  user: { fid: number; token?: string } | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAvailable: boolean;
  signIn: () => Promise<void>;
  signOut: () => void;
  error: Error | null;
}
```

**Properties**:
- `user` - User object with FID
- `token` - JWT token string
- `isLoading` - Authentication in progress
- `isAuthenticated` - User is authenticated
- `isAvailable` - Quick Auth available in context
- `signIn` - Trigger sign-in flow
- `signOut` - Clear authentication
- `error` - Authentication error if any

## 📁 Key Files

- **Hook**: `src/lib/useQuickAuth.ts`
- **API**: `src/app/api/auth/route.ts`
- **Debug**: `src/components/FarcasterDebug.tsx`
- **Docs**: `AUTH_IMPLEMENTATION.md`

## 🔗 Resources

- [Auth Implementation Guide](./AUTH_IMPLEMENTATION.md) - Complete guide
- [Farcaster Auth Setup](./FARCASTER_AUTH_SETUP.md) - Original setup docs
- [Testing in Farcaster](./TESTING_IN_FARCASTER.md) - Testing guide
- [Official Quick Auth Docs](https://miniapps.farcaster.xyz/docs/sdk/quick-auth)
- [Sign In with Farcaster](https://docs.farcaster.xyz/developers/siwf/)

## 🚀 Production Checklist

- [x] `@farcaster/quick-auth` installed
- [x] `useQuickAuth` hook implemented
- [x] `/api/auth` endpoint created
- [x] `FARCASTER_AUTH_DOMAIN` environment variable set
- [x] Preconnect hint added to layout
- [x] Error handling implemented
- [x] Testing in production Farcaster context
- [x] Documentation complete

**Status**: ✅ **Production Ready**

---

**Production URL**: https://y-six-dun.vercel.app  
**Test URL**: https://warpcast.com/~/miniapp?url=https://y-six-dun.vercel.app

**Need more details?** See [AUTH_IMPLEMENTATION.md](./AUTH_IMPLEMENTATION.md) for comprehensive implementation guide.
