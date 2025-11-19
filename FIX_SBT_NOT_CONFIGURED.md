# Fix: SBT Contract Not Configured

## Problem
Your app shows: **"SBT contract not configured"**

This means the environment variables haven't been applied yet.

---

## Solution: Redeploy on Vercel

### Step 1: Verify Environment Variables Are Set

Go to: https://vercel.com/dashboard

1. Click **devsminiapp** project
2. Click **Settings** tab
3. Select **Environment Variables** from left menu
4. You should see these three variables:

```
NEXT_PUBLIC_RPC_URL = https://sepolia.base.org
NEXT_PUBLIC_SBT_CONTRACT_ADDRESS = 0x4653cf1E6272D9f87C42ae6F441D7Fc546705C9f
NEXT_PUBLIC_MINIKIT_API_KEY = A2FB36E9-3C4E-48AA-8018-BC03613CB5CD
```

✅ **If all three are there, proceed to Step 2**

❌ **If missing, add them now** (see bottom of this document)

---

### Step 2: Redeploy

1. In Vercel dashboard, click **Deployments** tab (top menu)
2. Find the latest deployment (usually at top)
3. Click on it to open details
4. Click the **Redeploy** button (top right)
5. Vercel will rebuild with the environment variables
6. Wait 2-3 minutes for deployment to complete
7. You'll see a green checkmark when done

---

### Step 3: Test

1. Go to your app: https://y-osqcnd5dc-devsminiapp.vercel.app
2. Hard refresh (Ctrl+Shift+R)
3. Connect your wallet
4. Navigate to the SBT claiming section
5. You should see: **"Claim Your SBT"** button (NOT the error)

---

## If Still Not Working

**Try these:**

1. **Hard refresh the page:**
   - Windows/Linux: Ctrl+Shift+R
   - Mac: Cmd+Shift+R

2. **Clear browser cache:**
   - Press F12 (Developer Tools)
   - Right-click refresh button
   - Select "Empty Cache and Hard Refresh"

3. **Check deployment status:**
   - Go to Vercel dashboard
   - Click Deployments
   - Verify latest deployment has green checkmark (success)
   - Check the "Redeploy" tab for any build errors

4. **Verify environment variables in browser:**
   - Go to your app
   - Press F12 (Developer Tools)
   - Go to Console tab
   - Paste this and press Enter:
   ```javascript
   console.log({
     rpc: process.env.NEXT_PUBLIC_RPC_URL,
     sbtAddress: process.env.NEXT_PUBLIC_SBT_CONTRACT_ADDRESS,
     minikitKey: process.env.NEXT_PUBLIC_MINIKIT_API_KEY
   })
   ```
   - You should see all three variables logged with their values

---

## Need to Add Environment Variables?

If you don't see the three variables in Vercel:

1. Go to: https://vercel.com/dashboard
2. Select **devsminiapp** project
3. Click **Settings**
4. Select **Environment Variables** (left menu)
5. Click **Add New** for each:

**Variable 1:**
- Name: `NEXT_PUBLIC_RPC_URL`
- Value: `https://sepolia.base.org`
- Click Save

**Variable 2:**
- Name: `NEXT_PUBLIC_SBT_CONTRACT_ADDRESS`
- Value: `0x4653cf1E6272D9f87C42ae6F441D7Fc546705C9f`
- Click Save

**Variable 3:**
- Name: `NEXT_PUBLIC_MINIKIT_API_KEY`
- Value: `A2FB36E9-3C4E-48AA-8018-BC03613CB5CD`
- Click Save

Then go back to **Deployments** and click **Redeploy** on latest deployment.

---

## Summary

| Step | Action |
|------|--------|
| 1 | Verify 3 env vars in Vercel Settings |
| 2 | Click Deployments → Latest → Redeploy |
| 3 | Wait for build to finish (green checkmark) |
| 4 | Hard refresh your app (Ctrl+Shift+R) |
| 5 | SBT should now be configured! ✅ |

---

**Your app URL:** https://y-osqcnd5dc-devsminiapp.vercel.app

**Vercel Dashboard:** https://vercel.com/dashboard

Let me know when the redeploy finishes and SBT is working! 🚀
