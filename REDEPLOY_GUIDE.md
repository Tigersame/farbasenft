# Redeploy to Vercel - Quick Guide

## Your build is working! ✅
The app builds successfully, so the issue is with the Vercel deployment.

## Option 1: Deploy New Project (Recommended)

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** → Y
- **Which scope?** → Select your account
- **Link to existing project?** → N
- **Project name?** → farbasenft (or your choice)
- **Directory?** → ./ (default)
- **Override settings?** → N

### Step 4: Add Environment Variables
After initial deploy, add these:

```bash
vercel env add NEXT_PUBLIC_APP_URL
# Enter your deployment URL when prompted
# Example: https://farbasenft.vercel.app

vercel env add NEXT_PUBLIC_ONCHAINKIT_API_KEY
# Enter your OnchainKit API key

vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
# Enter your WalletConnect project ID
```

### Step 5: Redeploy with Environment Variables
```bash
vercel --prod
```

## Option 2: Deploy via Vercel Dashboard

1. **Go to:** https://vercel.com/new

2. **Import Git Repository:**
   - Connect your GitHub account if not connected
   - Select your repository: `Tigersame/farbasenft`
   - Click "Import"

3. **Configure Project:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)

4. **Add Environment Variables:**
   Click "Environment Variables" and add:
   ```
   NEXT_PUBLIC_APP_URL = (leave blank for now, will update after deploy)
   NEXT_PUBLIC_ONCHAINKIT_API_KEY = your_key_here
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID = your_project_id
   NEXT_PUBLIC_SBT_CONTRACT_ADDRESS = 0x4653cf1E6272D9f87C42ae6F441D7Fc546705C9f
   NEYNAR_API_KEY = your_neynar_key (optional)
   PINATA_JWT = your_pinata_jwt (optional)
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes

6. **Update NEXT_PUBLIC_APP_URL:**
   - After deployment, copy your new URL (e.g., `https://farbasenft.vercel.app`)
   - Go to: Project Settings → Environment Variables
   - Update `NEXT_PUBLIC_APP_URL` with your new URL
   - Click "Redeploy" in Deployments tab

## Option 3: Use Existing Deployment

If you want to keep the old URL, check:
1. Go to: https://vercel.com/dashboard
2. Find your project in the list
3. If it exists, go to Settings → Domains
4. If not, the project was deleted - use Option 1 or 2

## After Deployment

### Test Your App
1. Visit your deployment URL in a browser
2. Check the manifest: `https://your-app.vercel.app/.well-known/farcaster.json`
3. Verify it returns valid JSON

### Test in Warpcast Preview Tool
1. Enable Developer Mode: https://farcaster.xyz/~/settings/developer-tools
2. Open "Mini App Debug Tool"
3. Enter your new URL: `https://your-app.vercel.app`
4. Click "Preview"

## Required Environment Variables

### Minimum (to run):
```env
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key
```

### Optional (for full features):
```env
NEYNAR_API_KEY=your_neynar_key
PINATA_JWT=your_pinata_jwt
NEXT_PUBLIC_SBT_CONTRACT_ADDRESS=0x4653cf1E6272D9f87C42ae6F441D7Fc546705C9f
```

## Troubleshooting

### "Refused to connect"
- Deployment was deleted or failed
- Domain doesn't exist
- Solution: Deploy fresh using Option 1 or 2

### "Blank page"
- Missing environment variables
- Check browser console for errors
- Solution: Add all required env vars and redeploy

### "Manifest not found"
- `NEXT_PUBLIC_APP_URL` not set correctly
- Solution: Update env var and redeploy

## Quick Deploy Command

If you have Vercel CLI installed:
```bash
# One command to deploy
vercel --prod

# Then add your deployment URL as env var:
vercel env add NEXT_PUBLIC_APP_URL production
# Enter your deployment URL when prompted

# Redeploy with new env var:
vercel --prod
```

## Your App is Ready! 🚀

Once deployed, you'll have:
- ✅ Working NFT marketplace
- ✅ Mobile-optimized UI
- ✅ Farcaster Mini App compatible
- ✅ Swap portal
- ✅ XP system
- ✅ SBT claiming

Just need to deploy it! Choose Option 1 (CLI) or Option 2 (Dashboard) above.
