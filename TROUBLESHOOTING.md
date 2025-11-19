# Troubleshooting Deployed App

## Quick Diagnostic Steps

### Step 1: Check Console for Errors

1. Go to your app: https://y-osqcnd5dc-devsminiapp.vercel.app
2. Press **F12** (open Developer Tools)
3. Click **Console** tab
4. Look for red error messages
5. **Share the error message** with me

Common errors look like:
```
Error: Cannot read property 'contract' of undefined
Error: Network request failed
Error: Invalid RPC URL
```

---

### Step 2: Test Wallet Connection

1. Look for wallet icon (top right)
2. Try to connect wallet (MetaMask, Coinbase, etc.)
3. **Did it connect?** (Show wallet address in top right)
4. **Is network correct?** (Should show "Base Sepolia")

---

### Step 3: Check Network

1. If wallet is connected, check the network dropdown
2. **Should show:** Base Sepolia (Chain ID: 84532)
3. **If wrong:** Manually switch network in wallet to Base Sepolia

---

### Step 4: Verify Environment Variables

In browser console, paste and run:
```javascript
console.log('SBT Address:', window.location.pathname);
fetch('/api/xp').then(r => r.json()).then(console.log);
```

This will test if API routes are working.

---

## Common Issues & Fixes

### Issue 1: "SBT contract not configured"
**Fix:** You need to redeploy
1. Go to Vercel dashboard
2. Click Deployments
3. Click latest deployment
4. Click Redeploy button
5. Wait for green checkmark
6. Hard refresh app (Ctrl+Shift+R)

### Issue 2: "Network error" or "RPC URL error"
**Fix:** Check RPC endpoint
- In console, paste:
```javascript
fetch('https://sepolia.base.org', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({jsonrpc:'2.0',method:'eth_chainId',params:[],id:1})
}).then(r => r.json()).then(console.log)
```
- Should return `0x14a51` (Sepolia chain ID)

### Issue 3: Wallet won't connect
**Fix:** 
- Clear browser cache (Ctrl+Shift+Delete)
- Try different wallet (MetaMask → Coinbase)
- Ensure wallet is on Base Sepolia network

### Issue 4: Page shows blank/white
**Fix:**
- Hard refresh (Ctrl+Shift+R)
- Check console for errors (F12)
- Check Vercel deployment logs:
  - Dashboard → Deployments → Latest → Logs tab

---

## What to Tell Me

When you reach out, please provide:

1. **What you're trying to do:**
   - "I tried to claim SBT"
   - "I tried to connect wallet"
   - "I tried to mint NFT"
   - etc.

2. **What happened:**
   - Error message? (Exact text)
   - Page behavior? (Blank, frozen, etc.)
   - What you see on screen

3. **Console errors (F12 → Console):**
   - Any red errors? Share them

4. **Network info:**
   - Can you connect wallet?
   - Which wallet? (MetaMask, Coinbase, etc.)
   - What network shows? (Base Sepolia?)

5. **Browser info:**
   - Chrome, Firefox, Safari?
   - Did you hard refresh? (Ctrl+Shift+R)

---

## Example Troubleshooting Report

**Good:** "I connected my wallet (MetaMask on Base Sepolia). When I click 'Claim SBT', I get error: `Error: Contract reverted with reason 'Not eligible'`. Console shows no red errors."

**Bad:** "It doesn't work" (too vague)

---

## Emergency: Start Fresh

If nothing else works:

1. **Clear all cache:**
   - F12 → Application → Storage → Clear All
   - Or use Ctrl+Shift+Delete

2. **Close browser completely**

3. **Reopen fresh browser window**

4. **Visit app again:**
   - https://y-osqcnd5dc-devsminiapp.vercel.app

5. **Connect wallet fresh**

6. **Report what happens**

---

## Deployment Status Check

To verify your Vercel deployment is actually live:

1. Go to: https://vercel.com/dashboard
2. Select **devsminiapp** project
3. Look at **Deployments** tab
4. Find the latest one
5. Check it has:
   - ✅ Green checkmark (success)
   - ✅ Timestamp (recent, within last hour)
   - ✅ Status shows "Ready"

If it says "Building" or "Failed", wait or click Redeploy again.

---

## Next: Tell Me What's Wrong

Once you've done these steps, describe:
- What feature is broken?
- What error do you see?
- Any red messages in console?

Then I can fix it! 🚀
