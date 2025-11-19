# How to Get Your Minikit API Key

## Step 1: Go to Minikit Dashboard

Visit: https://minikit.farcaster.xyz

## Step 2: Sign In or Create Account

- Click **"Sign In"** or **"Get Started"**
- Connect with your GitHub account (or email)
- Verify your identity

## Step 3: Create/View Your API Key

### If you already have a project:
1. Go to **Dashboard** or **Projects**
2. Select your project
3. Look for **"API Keys"** or **"Settings"**
4. Copy your API key

### If you don't have a project yet:
1. Click **"Create New Project"**
2. Enter project name: `Farbase`
3. Select **"NFT Marketplace"** or **"General"** as category
4. Click **"Create"**
5. Your API key will be displayed
6. Copy it (it starts with something like `pk_` or `sk_`)

## Step 4: Add to Vercel

Copy your API key and add to Vercel:

1. Go to: https://vercel.com/dashboard
2. Select **devsminiapp** project
3. **Settings** → **Environment Variables**
4. Click **"Add New"**
5. Fill in:
   - **Name:** `NEXT_PUBLIC_MINIKIT_API_KEY`
   - **Value:** `[paste your API key here]`
6. Click **"Save"**

## Step 5: Redeploy

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click **"Redeploy"**

## If You Can't Find It

**Alternative: Check your email**
- Minikit sends API key via email when you create a project
- Check spam/promotions folder

**Or create a new one:**
1. Go to Minikit Dashboard
2. Settings → API Keys
3. Click **"Generate New Key"**
4. Select **"Production"** or **"Development"**
5. Copy the new key

## Testing Your API Key

After setting it in Vercel, visit your app and check:
- Browser Console (F12 → Console tab)
- Should NOT show "Invalid API Key" errors
- App should load without 401/403 errors

---

**Need Help?**
- Minikit Docs: https://minikit.farcaster.xyz/docs
- Support: Check Minikit docs for contact info

---

## Quick Summary

1. Go to https://minikit.farcaster.xyz
2. Sign in or create account
3. Copy your API key
4. Add to Vercel as `NEXT_PUBLIC_MINIKIT_API_KEY`
5. Redeploy
6. Done! ✅
