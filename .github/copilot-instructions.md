# AI Coding Agent Instructions for farbasenft

## Project Overview
A Foundation-inspired NFT marketplace built as a **Base Mini App** with deep Farcaster integration. The app runs within the Farcaster ecosystem (Base app/Warpcast) and emphasizes onchain actions, gamification via an XP system, and soulbound tokens (SBTs).

## Architecture & Critical Patterns

### Dual-Context Operation
The app must work in **two environments**:
1. **Mini App context** - Inside Farcaster/Base app with `@farcaster/miniapp-sdk` available
2. **Browser context** - Regular web browser without Mini App features

Check context with `sdk.isInMiniApp()`. Components like `MiniAppSDK.tsx`, `useQuickAuth.ts`, and `FarcasterShare.tsx` demonstrate proper context detection. Never assume Mini App features are available.

### Provider Hierarchy (src/providers/RootProvider.tsx)
```tsx
WagmiProvider → QueryClientProvider → OnchainKitProvider
```
- **WagmiProvider**: Uses `farcasterMiniApp()` connector first, then `coinbaseWallet()`, then `metaMask()`
- **OnchainKitProvider**: Configured with `miniKit: { enabled: true, autoConnect: true }`
- All blockchain interactions flow through this hierarchy

### Mini App Initialization (src/components/MiniAppSDK.tsx)
**CRITICAL**: Must call `sdk.actions.ready()` to hide splash screen. Wait for DOM load before calling to prevent UI jitter. This is the first thing to check if splash screen hangs.

### XP System Architecture
- **In-memory storage** in `/api/xp/route.ts` (Map-based, no database)
- XP rewards defined in `src/lib/xp.ts` as constants: `XP_REWARDS`
- Level calculation: `level = floor(sqrt(totalXP / 100))`
- Daily login uses date-based checks (`lastLoginDate` field)
- SBT claims tracked both in XP system and smart contract
- Components auto-award XP via `useXP` hook (see `NFTActions.tsx`, `SwapWithXP.tsx`)

### Authentication Flows
1. **Quick Auth** (Farcaster native): JWT-based, verified in `/api/auth/route.ts` using `@farcaster/quick-auth`
2. **Wallet Connection** (fallback): Standard wagmi/OnchainKit flow
3. Never show 0x addresses directly—use Farcaster username, ENS, or truncated format

## API Route Patterns

### XP Endpoints
- `GET /api/xp?wallet=0x...` - Fetch user XP data
- `POST /api/xp` - Award XP (body: `{ wallet, action, metadata }`)
- `POST /api/xp/daily-login` - Claim daily bonus
- `POST /api/xp/sbt/claim` - Claim SBT + 1000 XP

### Webhook Handling (/api/webhook/route.ts)
Processes Base Mini App lifecycle events: `miniapp_added`, `miniapp_removed`, `notifications_enabled`, `notifications_disabled`. Uses `@farcaster/miniapp-node` for signature verification. Always verify with `parseWebhookEvent()` + `verifyAppKeyWithNeynar`.

### IPFS Upload (/api/ipfs/upload/route.ts)
Uses Pinata SDK. Requires `PINATA_JWT`. See `src/lib/pinata.ts` for upload helpers (`uploadJSONToPinata`, `uploadFileToPinata`).

## Component Conventions

### Layout Structure (AppLayout.tsx)
- **Mobile-first**: Bottom navigation (44px+ touch targets) visible on mobile, sidebar hidden
- **Desktop**: Sidebar visible, bottom nav hidden (CSS: `hidden lg:block`)
- Sticky header with `WalletControls` in top-right
- Footer with Base/Farcaster links

### State Management
No Redux/Zustand. Use:
- **React Query** (via `@tanstack/react-query`) for API data
- **Custom hooks** (`useXP`, `useQuickAuth`, `useMiniAppContext`, etc.) for shared logic
- **Wagmi hooks** for blockchain state (`useAccount`, `useWriteContract`, etc.)

### UI Patterns
- **Primary color**: Cyan (`cyan-500`, `cyan-400`) for CTAs
- **Secondary**: Purple/Emerald for accents
- **Dark theme default**: `bg-slate-950`, `text-slate-100`
- **Spacing**: 8px base unit (Tailwind's default scale)
- **Typography**: Geist Sans (loaded in `layout.tsx`)
- All buttons/links ≥44px height for thumb reach

## Smart Contract Integration

### SBT Contract (contracts/SBT.sol)
- **Non-transferable**: Override `_update()` to block transfers (soulbound)
- **One per wallet**: `hasClaimed` mapping enforced on-chain
- **20,000 supply limit**: `MAX_SUPPLY` constant
- Deployed address stored in `NEXT_PUBLIC_SBT_CONTRACT_ADDRESS`
- Frontend claims via `SBTClaim.tsx` component

## Environment Variables
**Never commit `.env.local`**. All required vars in `.env.example`:
- Wallet: `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`, `NEXT_PUBLIC_ONCHAINKIT_API_KEY`
- IPFS: `PINATA_JWT`, `PINATA_API_KEY`, `PINATA_SECRET_API_KEY`
- Farcaster: `NEYNAR_API_KEY`, account association keys
- App: `NEXT_PUBLIC_APP_URL` (required for manifest generation)

## Base Mini App Compliance

### Manifest (minikit.config.ts → /.well-known/farcaster.json)
- Generated dynamically from `src/lib/minikit.config.ts`
- **Character limits**: name (32), subtitle (30), tagline (30), description (170)
- **Images**: icon (1024×1024), hero (1200×630), splash (200×200), screenshots (portrait)
- Account association (header/payload/signature) required for featured status

### Performance Requirements
- Load time: <3 seconds
- Action completion: <1 second
- Show loading indicators for all async actions (see `mintUploading`, `listingLoading` in `NFTActions.tsx`)

### UX Principles from BASE_GUIDELINES_COMPLIANCE.md
- Max 3 onboarding screens with skip option
- User profile visible with avatar/username (never raw 0x addresses)
- Bottom nav for mobile with labels
- All touch targets ≥44px

## Development Workflow

### Commands
- `npm run dev` - Start dev server (localhost:3000)
- `npm run build` - Production build
- `npm run lint` - ESLint check

### Testing in Farcaster
See `TESTING_IN_FARCASTER.md` and `PREVIEW_IN_WARPCAST.md` for Warpcast embed testing flow.

## Common Gotchas

1. **Splash screen stuck**: Check if `sdk.actions.ready()` is called in `MiniAppSDK.tsx`
2. **XP not persisting**: In-memory storage clears on server restart—expected behavior
3. **Quick Auth fails**: Only works in Farcaster context; check `isQuickAuthAvailable()`
4. **NFT images not loading**: Verify Pinata gateway URL format in `pinata.ts`
5. **Wallet not connecting**: Check `farcasterMiniApp()` connector is first in array (`RootProvider.tsx`)
6. **Manifest validation errors**: Character limits on tagline/description, image dimensions

## Key Files Reference
- `src/app/layout.tsx` - Root layout with providers and metadata
- `src/providers/RootProvider.tsx` - Wagmi/OnchainKit config
- `src/lib/xp.ts` - XP system constants and helpers
- `src/lib/minikit.config.ts` - Mini App manifest config
- `src/components/AppLayout.tsx` - Main layout with responsive nav
- `contracts/SBT.sol` - Soulbound token contract
