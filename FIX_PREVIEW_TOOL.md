# Fix Preview Tool Issues

## Problem
Your app is not loading in the Warpcast/Farcaster Mini App preview tool.

## Solutions

### 1. Check Your Deployment URL

Your app is deployed at: **https://y-osqcnd5dc-devsminiapp.vercel.app**

Visit this URL in a browser to verify it's working:
```
https://y-osqcnd5dc-devsminiapp.vercel.app
```

### 2. Update Environment Variables on Vercel

Go to: https://vercel.com/dashboard/devsminiapp

Set this environment variable:
```env
NEXT_PUBLIC_APP_URL=https://y-osqcnd5dc-devsminiapp.vercel.app
```

**Important:** After adding/updating, click **"Redeploy"** to apply changes!

### 3. Verify Manifest Endpoint

Check if your manifest is accessible:
```
https://y-osqcnd5dc-devsminiapp.vercel.app/.well-known/farcaster.json
```

This should return JSON with your app details.

### 4. Test in Warpcast Preview Tool

1. Go to Warpcast Developer Settings:
   - https://farcaster.xyz/~/settings/developer-tools
   - Enable "Developer Mode"

2. Open Mini App Debug Tool (left sidebar in Warpcast desktop)

3. Enter your URL:
   ```
   https://y-osqcnd5dc-devsminiapp.vercel.app
   ```

4. Click "Preview"

### 5. Common Issues & Fixes

#### Issue: "Failed to load manifest"
**Fix:** Ensure `NEXT_PUBLIC_APP_URL` is set on Vercel and redeploy

#### Issue: "Images not loading"
**Fix:** Check that these files exist and are accessible:
- `/icon.svg` (1024x1024)
- `/splash.svg` (200x200)
- `/hero.svg` (1200x630)

#### Issue: "Splash screen stuck"
**Fix:** Verify `MiniAppSDK.tsx` calls `sdk.actions.ready()` after DOM loads

#### Issue: "App loads but features don't work"
**Fix:** Check browser console for errors, ensure all API keys are set

### 6. Quick Test Commands

Test your manifest locally:
```bash
curl http://localhost:3000/.well-known/farcaster.json
```

Test your deployed manifest:
```bash
curl https://y-osqcnd5dc-devsminiapp.vercel.app/.well-known/farcaster.json
```

### 7. Verify Required Environment Variables

On Vercel, you MUST have these set:
```env
# REQUIRED
NEXT_PUBLIC_APP_URL=https://y-osqcnd5dc-devsminiapp.vercel.app
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_key

# OPTIONAL (but recommended)
NEYNAR_API_KEY=your_neynar_key
PINATA_JWT=your_pinata_jwt
```

### 8. Debug Checklist

- [ ] App URL loads in browser
- [ ] Manifest endpoint returns valid JSON
- [ ] All image URLs (icon, splash, hero) are accessible
- [ ] `NEXT_PUBLIC_APP_URL` is set on Vercel
- [ ] Recent deployment after env var changes
- [ ] Developer mode enabled in Warpcast
- [ ] Using correct URL in preview tool

## Expected Manifest Structure

Your manifest should look like this:
```json
{
  "miniapp": {
    "version": "1",
    "name": "farbasenft",
    "homeUrl": "https://y-osqcnd5dc-devsminiapp.vercel.app",
    "iconUrl": "https://y-osqcnd5dc-devsminiapp.vercel.app/icon.svg",
    "splashImageUrl": "https://y-osqcnd5dc-devsminiapp.vercel.app/splash.svg",
    "splashBackgroundColor": "#030712",
    "webhookUrl": "https://y-osqcnd5dc-devsminiapp.vercel.app/api/webhook",
    "subtitle": "Digital art reimagined",
    "description": "Curated NFT showcases, timed auctions, and artist-first storytelling inspired by Foundation.",
    "screenshotUrls": [
      "https://y-osqcnd5dc-devsminiapp.vercel.app/splash.svg",
      "https://placehold.co/1080x1920/png?text=Farbasenft+Preview"
    ],
    "primaryCategory": "art",
    "tags": ["nft", "auctions", "art", "foundation-clone"],
    "heroImageUrl": "https://y-osqcnd5dc-devsminiapp.vercel.app/hero.svg",
    "tagline": "Curators meet collectors"
  }
}
```

## Next Steps

1. **Set `NEXT_PUBLIC_APP_URL` on Vercel**
2. **Redeploy** your app
3. **Wait 2-3 minutes** for deployment to complete
4. **Test manifest** at `https://y-osqcnd5dc-devsminiapp.vercel.app/.well-known/farcaster.json`
5. **Try preview tool** again

## Still Not Working?

Check these:
1. Browser console errors
2. Network tab in DevTools (check for failed requests)
3. Vercel deployment logs
4. Make sure you're using HTTPS (not HTTP)
