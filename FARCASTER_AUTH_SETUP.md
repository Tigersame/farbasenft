# Farcaster Quick Auth Integration

This app integrates Farcaster authentication using Quick Auth, which provides secure JWT-based authentication for Farcaster users.

## Features

- ✅ Quick Auth sign-in flow using `@farcaster/miniapp-sdk`
- ✅ Backend JWT verification using `@farcaster/quick-auth`
- ✅ Automatic authentication detection in Farcaster context
- ✅ Fallback to wallet connection for non-Farcaster environments
- ✅ User FID (Farcaster ID) verification and display

## Setup

### 1. Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Backend URL (optional, defaults to request origin)
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000

# Farcaster Auth Domain (optional, defaults to request hostname)
# Set this to your production domain for JWT verification
FARCASTER_AUTH_DOMAIN=your-domain.com
```

### 2. How It Works

#### Frontend (`useQuickAuth` hook)

1. **Token Retrieval**: Uses `sdk.quickAuth.getToken()` to get a JWT token from Farcaster
2. **Backend Verification**: Sends the token to `/api/auth` endpoint for verification
3. **User Data**: Receives verified user FID from backend

#### Backend (`/api/auth` route)

1. **JWT Verification**: Uses `@farcaster/quick-auth` to verify the JWT token
2. **Domain Validation**: Verifies token against your domain
3. **User Return**: Returns user FID (subject of JWT)

### 3. Usage

The `FarcasterShare` component automatically uses Quick Auth when available:

```tsx
import { FarcasterShare } from "@/components/FarcasterShare";

// In your component
<FarcasterShare 
  nftTitle="My NFT"
  nftImage="https://example.com/nft.jpg"
  customText="Check out this amazing NFT!"
/>
```

### 4. Authentication Flow

1. **User clicks "Sign In with Farcaster (Quick Auth)"**
2. **SDK requests token** from Farcaster
3. **Token sent to backend** for verification
4. **Backend verifies JWT** and returns user FID
5. **User is authenticated** and can share NFTs

### 5. JWT Payload Structure

The JWT token contains:
```json
{
  "iat": 1747764819,
  "iss": "https://auth.farcaster.xyz",
  "exp": 1747768419,
  "sub": 6841,  // User's FID
  "aud": "your-domain.com"
}
```

## API Endpoints

### GET/POST `/api/auth`

Verifies Farcaster Quick Auth JWT token.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "fid": 6841,
  "iat": 1747764819,
  "exp": 1747768419,
  "iss": "https://auth.farcaster.xyz"
}
```

**Error (401):**
```json
{
  "error": "Invalid token",
  "message": "The provided token is invalid or expired"
}
```

## Testing

1. **In Farcaster Context**: Open the app in Warpcast or Farcaster client
2. **Click "Sign In with Farcaster (Quick Auth)"**
3. **Verify**: You should see your FID displayed with a "✓ Quick Auth" badge

## Troubleshooting

### Token verification fails

- Check that `FARCASTER_AUTH_DOMAIN` matches your domain
- Ensure the token hasn't expired (tokens expire after 1 hour)
- Verify the backend endpoint is accessible

### Quick Auth not available

- Ensure you're running in a Farcaster context (Warpcast, Farcaster client)
- Check browser console for SDK errors
- Fallback to wallet connection will be used automatically

## References

- [Farcaster Mini App SDK Docs](https://docs.farcaster.xyz/miniapps)
- [Quick Auth Documentation](https://docs.farcaster.xyz/miniapps/quick-auth)
- [@farcaster/miniapp-sdk](https://www.npmjs.com/package/@farcaster/miniapp-sdk)
- [@farcaster/quick-auth](https://www.npmjs.com/package/@farcaster/quick-auth)

