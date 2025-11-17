# Testing Farcaster Mini App

## Current Status: Browser Mode

If you see all ❌ indicators in the debug panel, you're running the app in a **regular browser**. This is normal! Farcaster Mini Apps only work fully when opened inside a Farcaster client.

## How to Test in Farcaster

### Option 1: Warpcast (Recommended)

1. **Open Warpcast**
   - Web: https://warpcast.com
   - Mobile: Download Warpcast app

2. **Create a Cast with your app URL**
   - In Warpcast, create a new cast
   - Include your app URL: `http://localhost:3000` (for local testing)
   - Or your deployed URL for production

3. **Click the Mini App Button**
   - Warpcast will detect the mini app metadata
   - Click the button to open your app
   - All Farcaster features will now work!

### Option 2: Farcaster Mobile App

1. Open the Farcaster mobile app
2. Create a cast with your app URL
3. Tap the mini app button to launch

### Option 3: Developer Mode (Warpcast Desktop)

1. Enable Developer Mode in Warpcast:
   - Go to: https://farcaster.xyz/~/settings/developer-tools
   - Toggle "Developer Mode" ON

2. Use the Developer Tools:
   - Preview your mini app
   - Test with different contexts
   - View analytics

## What Works in Browser vs Farcaster Client

### Browser Mode (Current)
- ✅ App loads and displays
- ✅ Wallet connections work
- ✅ NFT viewing works
- ❌ Farcaster authentication
- ❌ Casting/sharing
- ❌ User context

### Farcaster Client Mode
- ✅ Everything above
- ✅ Farcaster authentication
- ✅ Casting/sharing
- ✅ User context (FID, username)
- ✅ Quick Auth
- ✅ MiniKit integration

## Local Development Setup

For local testing in Warpcast:

1. **Make sure your app is accessible**
   - Use `localhost:3000` (Warpcast can access localhost)
   - Or use a tunnel service like ngrok:
     ```bash
     ngrok http 3000
     ```

2. **Update your manifest** (if needed)
   - Check `.well-known/farcaster.json`
   - Ensure URLs point to your accessible endpoint

3. **Test the flow**
   - Open Warpcast
   - Create cast with your URL
   - Launch mini app
   - Check debug panel - should show ✅

## Production Deployment

When deploying to production:

1. Update `NEXT_PUBLIC_APP_URL` in `.env.local`
2. Update manifest URLs in `minikit.config.ts`
3. Deploy to Vercel/Netlify/etc
4. Test in Warpcast with production URL

## Troubleshooting

### Still seeing ❌ after opening in Warpcast?

1. **Check console logs** - Look for SDK errors
2. **Verify manifest** - Check `.well-known/farcaster.json` is accessible
3. **Clear cache** - Try hard refresh in Warpcast
4. **Check URL** - Make sure you're using the correct URL in the cast

### Quick Auth not working?

1. Ensure you're in a Farcaster client (not browser)
2. Check `FARCASTER_AUTH_DOMAIN` is set correctly
3. Verify `/api/auth` endpoint is working
4. Check browser console for errors

## Next Steps

Once you see ✅ indicators:
- You can test Farcaster sharing
- User context will be available
- All Mini App features will work

Happy testing! 🚀

