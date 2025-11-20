# Farcaster Authentication Implementation Guide

Complete implementation of [Farcaster Authentication](https://miniapps.farcaster.xyz/docs/guides/auth) using Quick Auth for seamless user sign-in.

## 🎯 Overview

Quick Auth provides the easiest way to authenticate Farcaster users in your Mini App. It uses Sign in with Farcaster (SIWF) under the hood and returns a standard JWT that can be verified on your server and used as a session token.

**Key Benefits**:
- ✅ **Seamless**: Automatic sign-in when user opens app in Farcaster
- ✅ **Secure**: JWT-based authentication with server-side verification
- ✅ **Fast**: Edge-deployed service for low latency worldwide
- ✅ **Simple**: No nonce management or complex SIWF verification

## 🏗️ Architecture

```
User opens Mini App
        ↓
Frontend: sdk.quickAuth.getToken()
        ↓
Farcaster Auth Server
(generates signed JWT with user FID)
        ↓
Frontend: Receives JWT token
        ↓
Backend: Verifies JWT with @farcaster/quick-auth
        ↓
Backend: Returns user info (FID, etc.)
        ↓
App: User is authenticated
```

## 📁 Implementation Files

### Frontend Components
- **`src/lib/useQuickAuth.ts`** - React hook for authentication
- **`src/components/FarcasterDebug.tsx`** - Debug component showing auth status
- **`src/lib/useMiniAppContext.ts`** - Context hook for SDK access

### Backend API
- **`src/app/api/auth/route.ts`** - Main auth verification endpoint
- **`src/app/api/auth/quick-auth/route.ts`** - Quick Auth-specific endpoint

### Configuration
- **`.env.local`** - Environment variables (domain, backend URL)

## 🚀 Usage Examples

### 1. Frontend: Using the Hook

**Basic Usage**:
```tsx
"use client";

import { useQuickAuth } from "@/lib/useQuickAuth";

export function UserProfile() {
  const { user, isLoading, isAuthenticated, signIn } = useQuickAuth();

  if (isLoading) {
    return <div>Authenticating...</div>;
  }

  if (!isAuthenticated) {
    return (
      <button onClick={signIn}>
        Sign in with Farcaster
      </button>
    );
  }

  return (
    <div>
      <p>Welcome, FID: {user?.fid}</p>
    </div>
  );
}
```

**With Error Handling**:
```tsx
"use client";

import { useQuickAuth } from "@/lib/useQuickAuth";
import { useEffect } from "react";

export function AuthenticatedContent() {
  const { 
    user, 
    isLoading, 
    isAuthenticated, 
    isAvailable,
    error, 
    signIn 
  } = useQuickAuth();

  useEffect(() => {
    // Auto sign-in when available
    if (isAvailable && !isAuthenticated && !isLoading) {
      signIn();
    }
  }, [isAvailable, isAuthenticated, isLoading, signIn]);

  if (!isAvailable) {
    return <div>Quick Auth not available. Please use Farcaster app.</div>;
  }

  if (error) {
    return <div>Authentication error: {error.message}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Auto sign-in will trigger
  }

  return (
    <div>
      <h2>Authenticated User</h2>
      <p>FID: {user?.fid}</p>
    </div>
  );
}
```

### 2. Frontend: Using sdk.quickAuth.fetch()

**Make Authenticated Requests**:
```tsx
"use client";

import { useState, useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

interface User {
  fid: number;
  username?: string;
  pfp?: string;
}

export function UserData() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        // Automatically adds Bearer token to Authorization header
        const res = await sdk.quickAuth.fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/me`
        );
        
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          // Call ready() after loading user data
          sdk.actions.ready();
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) return null; // Splash screen still showing

  return (
    <div>
      <h1>Hello, {user?.username || user?.fid}</h1>
    </div>
  );
}
```

### 3. Frontend: Getting Token Directly

**Use Token in Custom Requests**:
```tsx
"use client";

import { useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export function CustomApiCall() {
  const [data, setData] = useState(null);

  async function fetchWithAuth() {
    try {
      // Get the JWT token
      const { token } = await sdk.quickAuth.getToken();

      // Make authenticated request
      const response = await fetch("/api/custom-endpoint", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
  }

  return (
    <button onClick={fetchWithAuth}>
      Load Data
    </button>
  );
}
```

### 4. Backend: Verifying JWT Token

**Main Auth Endpoint** (`src/app/api/auth/route.ts`):
```typescript
import { createClient, Errors } from "@farcaster/quick-auth";
import { NextRequest, NextResponse } from "next/server";

const client = createClient();

export async function GET(request: NextRequest) {
  // Extract Bearer token
  const authorization = request.headers.get("Authorization");
  
  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing or invalid token" },
      { status: 401 }
    );
  }

  const token = authorization.split(" ")[1];
  
  // Get domain for verification
  const domain = process.env.FARCASTER_AUTH_DOMAIN || 
                 new URL(request.url).hostname;

  try {
    // Verify JWT
    const payload = await client.verifyJwt({ token, domain });

    // Return user info (FID is in 'sub' field)
    return NextResponse.json({
      fid: payload.sub,
      iat: payload.iat, // Issued at
      exp: payload.exp, // Expires at
    });
  } catch (error) {
    if (error instanceof Errors.InvalidTokenError) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }
    
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
```

**With Middleware** (Hono example):
```typescript
import { createClient, Errors } from "@farcaster/quick-auth";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

const client = createClient();

// Middleware to protect routes
const quickAuthMiddleware = createMiddleware<{
  Variables: {
    user: { fid: number; primaryAddress?: string }
  }
}>(async (c, next) => {
  const authorization = c.req.header("Authorization");
  
  if (!authorization?.startsWith("Bearer ")) {
    throw new HTTPException(401, { message: "Missing token" });
  }

  try {
    const payload = await client.verifyJwt({
      token: authorization.split(" ")[1],
      domain: c.env.HOSTNAME,
    });

    // Optionally resolve additional user info
    const user = await resolveUser(payload.sub);
    c.set("user", user);
  } catch (e) {
    if (e instanceof Errors.InvalidTokenError) {
      throw new HTTPException(401, { message: "Invalid token" });
    }
    throw e;
  }

  await next();
});

// Protected route
app.get("/me", quickAuthMiddleware, (c) => {
  return c.json(c.get("user"));
});
```

### 5. Backend: Resolving User Information

**Get Primary Address**:
```typescript
async function resolveUser(fid: number) {
  const res = await fetch(
    `https://api.farcaster.xyz/fc/primary-address?fid=${fid}&protocol=ethereum`
  );
  
  if (res.ok) {
    const { result } = await res.json();
    return {
      fid,
      primaryAddress: result.address.address,
    };
  }
  
  return { fid };
}
```

**Get Full Profile with Neynar**:
```typescript
async function getUserProfile(fid: number) {
  const neynarKey = process.env.NEYNAR_API_KEY;
  
  const res = await fetch(
    `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
    {
      headers: {
        "api_key": neynarKey!,
      },
    }
  );

  if (res.ok) {
    const data = await res.json();
    const user = data.users[0];
    
    return {
      fid: user.fid,
      username: user.username,
      displayName: user.display_name,
      pfp: user.pfp_url,
      bio: user.profile.bio.text,
      followerCount: user.follower_count,
      followingCount: user.following_count,
    };
  }
  
  return { fid };
}
```

## 🔑 Environment Variables

```bash
# Frontend (.env.local)
NEXT_PUBLIC_BACKEND_URL=https://y-six-dun.vercel.app
NEXT_PUBLIC_APP_URL=https://y-six-dun.vercel.app

# Backend (.env.local or Vercel)
FARCASTER_AUTH_DOMAIN=y-six-dun.vercel.app

# Optional: For user profile enrichment
NEYNAR_API_KEY=your_neynar_api_key
```

**Important**: 
- `FARCASTER_AUTH_DOMAIN` must match your production domain
- Domain mismatch will cause JWT verification to fail
- Use actual domain, not localhost in production

## ⚡ Performance Optimization

### Preconnect to Auth Server

Add to your root layout to speed up authentication:

**HTML**:
```html
<link rel="preconnect" href="https://auth.farcaster.xyz" />
```

**React**:
```tsx
import { preconnect } from "react-dom";

export default function RootLayout({ children }) {
  preconnect("https://auth.farcaster.xyz");
  
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

**Next.js Metadata** (already implemented in `src/app/layout.tsx`):
```tsx
export const metadata = {
  // ... other metadata
  other: {
    "preconnect": "https://auth.farcaster.xyz",
  },
};
```

## 🎯 Use Cases

### NFT Marketplace Authentication

```tsx
"use client";

import { useQuickAuth } from "@/lib/useQuickAuth";
import { useEffect } from "react";

export function NFTCreator() {
  const { user, isAuthenticated, signIn } = useQuickAuth();

  async function mintNFT() {
    if (!isAuthenticated) {
      await signIn();
      return;
    }

    // Mint NFT for authenticated user
    await fetch("/api/nft/mint", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${user?.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fid: user?.fid,
        // ... NFT data
      }),
    });
  }

  return (
    <button onClick={mintNFT}>
      Mint NFT
    </button>
  );
}
```

### XP System with Authentication

```tsx
"use client";

import { useQuickAuth } from "@/lib/useQuickAuth";
import { useXP } from "@/hooks/useXP";

export function XPDashboard() {
  const { user, isAuthenticated } = useQuickAuth();
  const { xp, level } = useXP(user?.fid);

  if (!isAuthenticated) {
    return <div>Sign in to view XP</div>;
  }

  return (
    <div>
      <h2>Level {level}</h2>
      <p>{xp} XP</p>
    </div>
  );
}
```

### Leaderboard with User Identity

```tsx
"use client";

import { useQuickAuth } from "@/lib/useQuickAuth";
import { useEffect, useState } from "react";

export function Leaderboard() {
  const { user } = useQuickAuth();
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();
      setLeaderboard(data);
    }
    fetchLeaderboard();
  }, []);

  return (
    <div>
      {leaderboard.map((entry, i) => (
        <div key={entry.fid}>
          {entry.fid === user?.fid && "👑 "} 
          #{i + 1} - FID {entry.fid} - {entry.xp} XP
        </div>
      ))}
    </div>
  );
}
```

## 🔒 Security Best Practices

### 1. Always Verify on Backend
```typescript
// ❌ WRONG: Trust token without verification
const token = request.headers.get("Authorization");
const fid = jwt.decode(token).sub; // INSECURE!

// ✅ CORRECT: Verify with Quick Auth
const payload = await client.verifyJwt({ token, domain });
const fid = payload.sub; // SECURE
```

### 2. Domain Validation
```typescript
// ❌ WRONG: Skip domain verification
await client.verifyJwt({ token });

// ✅ CORRECT: Verify against your domain
await client.verifyJwt({ 
  token, 
  domain: process.env.FARCASTER_AUTH_DOMAIN 
});
```

### 3. Token Expiration
```typescript
// Check token expiration
const payload = await client.verifyJwt({ token, domain });

if (Date.now() / 1000 > payload.exp) {
  throw new Error("Token expired");
}
```

### 4. Rate Limiting
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

// Protect auth endpoint
const { success } = await ratelimit.limit(fid);
if (!success) {
  return new Response("Too many requests", { status: 429 });
}
```

## 🧪 Testing

### Development Testing
```bash
# Quick Auth only works in Farcaster Mini App context
# Test in Warpcast with production URL

# 1. Deploy to production
npm run build
git push

# 2. Test in Warpcast
# Open: https://warpcast.com/~/miniapp?url=https://y-six-dun.vercel.app

# 3. Check authentication flow
# - Should auto-sign in
# - User FID should be displayed
# - No manual sign-in required
```

### Testing Checklist
- [ ] Quick Auth available in Farcaster context
- [ ] Token retrieved successfully
- [ ] Backend verifies token correctly
- [ ] User FID returned and displayed
- [ ] Error handling works (invalid token)
- [ ] Auto sign-in on app open
- [ ] Token persists across page navigation
- [ ] Sign out clears token

### Debug Component
Use `FarcasterDebug` component to check auth status:

```tsx
import { FarcasterDebug } from "@/components/FarcasterDebug";

export default function Page() {
  return (
    <div>
      <FarcasterDebug />
      {/* Your content */}
    </div>
  );
}
```

## 🐛 Troubleshooting

### "Quick Auth not available"
- **Cause**: Not running in Farcaster Mini App context
- **Solution**: Test in Warpcast at production URL
- **Check**: `sdk.isInMiniApp()` returns `true`

### "Invalid token" error
- **Cause**: Domain mismatch between frontend and backend
- **Solution**: Verify `FARCASTER_AUTH_DOMAIN` matches production domain
- **Check**: Domain in JWT matches verification domain

### Token not persisting
- **Cause**: Token stored in memory, cleared on refresh
- **Solution**: Implement token caching in localStorage/sessionStorage
- **Check**: `useQuickAuth` hook stores token in state

### "Missing Authorization header"
- **Cause**: Token not sent to backend
- **Solution**: Use `sdk.quickAuth.fetch()` or manually add Bearer token
- **Check**: Request includes `Authorization: Bearer <token>`

### Authentication slow
- **Cause**: No preconnect to auth server
- **Solution**: Add preconnect hint (see Performance Optimization)
- **Check**: Network waterfall shows early connection to auth.farcaster.xyz

## 📊 Quick Auth vs Sign In with Farcaster

| Feature | Quick Auth | SIWF |
|---------|-----------|------|
| **Ease of use** | ✅ Very simple | ⚠️ More complex |
| **Setup** | One SDK call | Manual nonce generation |
| **Token format** | JWT | Custom message |
| **Verification** | Asymmetric signing | Message signature |
| **Performance** | ⚡ Edge-deployed | 🐢 Custom implementation |
| **Session management** | Built-in | Manual |
| **Best for** | Most apps | Advanced custom needs |

**Recommendation**: Use Quick Auth unless you have specific requirements for custom SIWF implementation.

## 🔗 Related Documentation

- [Quick Auth Setup Guide](./FARCASTER_AUTH_SETUP.md) - Original setup documentation
- [Testing in Farcaster](./TESTING_IN_FARCASTER.md) - Testing authentication flow
- [Wallet Integration](./WALLET_INTERACTION_GUIDE.md) - Wallet as fallback auth
- [Official Quick Auth Docs](https://miniapps.farcaster.xyz/docs/sdk/quick-auth)
- [Sign In with Farcaster](https://docs.farcaster.xyz/developers/siwf/)

## 📚 Additional Resources

- [Farcaster Auth GitHub](https://github.com/farcasterxyz/auth-monorepo)
- [Quick Auth Protocol Discussion](https://github.com/farcasterxyz/protocol/discussions/231)
- [Auth Address Standard](https://github.com/farcasterxyz/protocol/discussions/225)
- [Example Implementation](https://github.com/farcasterxyz/miniapps/tree/main/examples)

---

## ✅ Implementation Checklist

- [x] Install `@farcaster/quick-auth` package
- [x] Create `useQuickAuth` hook for frontend
- [x] Implement `/api/auth` verification endpoint
- [x] Add `FARCASTER_AUTH_DOMAIN` environment variable
- [x] Add preconnect hint for performance
- [x] Test in production Farcaster context
- [x] Handle error cases (invalid token, not available)
- [x] Display user FID after authentication
- [x] Documentation created

**Status**: ✅ **Fully Implemented and Production Ready**

**Production URL**: https://y-six-dun.vercel.app  
**Test in Warpcast**: https://warpcast.com/~/miniapp?url=https://y-six-dun.vercel.app

---

**Last Updated**: November 2024  
**Guide Reference**: https://miniapps.farcaster.xyz/docs/guides/auth
