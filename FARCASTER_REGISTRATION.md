# Register farbasenft Mini App in Farcaster

## Your Mini App Details

**Permanent URL**: `https://y-devsminiapp.vercel.app`  
**Manifest URL**: `https://y-devsminiapp.vercel.app/.well-known/farcaster.json`  
**Current Version**: 1.2

---

## Registration Methods

### Method 1: Using Warpcast Mobile App (Easiest)

1. **Open Warpcast** on your mobile device
2. **Tap Profile** (bottom right)
3. **Go to Settings** ⚙️
4. Scroll to **"Developer"** or **"Apps"** section
5. **Tap "Add Mini App"** or "Register Mini App"
6. **Enter URL**: `https://y-devsminiapp.vercel.app`
7. **Submit** and wait for validation
8. Your app should appear in Mini Apps list

### Method 2: Using Farcaster Developer Portal (Web)

1. **Visit**: https://warpcast.com/~/developers (or equivalent)
2. **Sign in** with your Farcaster account
3. **Navigate to "Mini Apps"** section
4. **Click "Add New Mini App"**
5. **Fill in details**:
   - **URL**: `https://y-devsminiapp.vercel.app`
   - **Name**: farbasenft
   - **Description**: NFT Gallery & Swap Portal on Base
6. **Submit** for review/activation

### Method 3: Cast a Mini App Link (Quick Test)

1. **Create a new cast** in Warpcast
2. **Include the URL**: `https://y-devsminiapp.vercel.app`
3. Warpcast should detect it as a Mini App and show preview
4. **Cast it** and click to open

### Method 4: Direct Frame Link

Try opening this URL in Warpcast mobile browser:
```
https://y-devsminiapp.vercel.app
```

The app will detect if it's running in Farcaster context and enable Mini App features.

---

## Verification

After registration, verify your manifest is accessible:

**Test URL**: https://y-devsminiapp.vercel.app/.well-known/farcaster.json

Should return JSON with:
- `version: "1.2"`
- `name: "farbasenft"`
- `subtitle: "NFT Gallery & Swap Portal"`

---

## Features to Test After Registration

1. **Gallery Tab**: Browse NFTs with virtualized scrolling
2. **Swap Tab**: 
   - Connect wallet (Farcaster native or external)
   - Select tokens (ETH, USDC, WETH, DAI, DEGEN)
   - View real-time balances
   - Get quotes from 0x API
   - See token icons: ⟠ 💵 ◈ 🎩
3. **Profile Tab**: View your XP and claim SBT

---

## Troubleshooting

**If app doesn't appear after registration:**
- Wait 5-10 minutes for Farcaster cache to update
- Force close and reopen Warpcast
- Try accessing via direct URL cast
- Check manifest is publicly accessible (no auth required)

**If features don't work:**
- Make sure you're on Base network (Chain ID: 8453)
- Connect wallet through Farcaster Mini App SDK first
- Check browser console for errors

---

## Support Links

- **Live App**: https://y-devsminiapp.vercel.app
- **GitHub**: https://github.com/Tigersame/farbasenft
- **Manifest**: https://y-devsminiapp.vercel.app/.well-known/farcaster.json

---

## Important Notes

- ✅ Vercel Authentication is DISABLED (manifest is public)
- ✅ Using permanent URL (won't change between deployments)
- ✅ Version 1.2 with latest features
- ✅ Swap Portal with 0x API integration
- ✅ Real balance fetching from Base chain
- ✅ Token icons and improved UX

**Last Updated**: November 21, 2025
