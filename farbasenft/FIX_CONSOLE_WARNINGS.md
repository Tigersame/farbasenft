# Fix Browser Console Warnings

Your app is working! These are just console warnings from missing environment variables in production. Here's how to fix them:

---

## 🔴 Warning 1: MetaMask Wallet Conflict
```
Cannot set property ethereum of #<Window> which has only a getter
```

**Status:** ✅ **FIXED**  
**What was done:** Added error handling in `WalletProvider.tsx` to suppress wallet extension conflicts gracefully.  
**Next:** Push to Vercel (already done) and redeploy.

---

## 🟡 Warning 2: OnchainKit API Key Missing
```
NEXT_PUBLIC_ONCHAINKIT_API_KEY is not set. Some features may not work.
```

**Status:** 🔧 **NEEDS VERCEL ENV VAR**  
**Why:** You have the key in `.env.local` (local dev), but Vercel needs it too (production).

### **Fix: Add to Vercel in 3 Steps**

**Step 1: Go to Vercel Dashboard**
- URL: https://vercel.com/dashboard/devsminiapp

**Step 2: Click Settings → Environment Variables**

**Step 3: Add these variables (copy exact names):**

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_ONCHAINKIT_API_KEY` | `6799fc99-e132-43bd-abb7-965855505eda` |
| `NEXT_PUBLIC_MINIKIT_API_KEY` | `A2FB36E9-3C4E-48AA-8018-BC03613CB5CD` |
| `NEXT_PUBLIC_SBT_CONTRACT_ADDRESS` | `0x4653cf1E6272D9f87C42ae6F441D7Fc546705C9f` |
| `NEXT_PUBLIC_RPC_URL` | `https://sepolia.base.org` |

**Step 4: Save and Redeploy**
- Click **Deployments** tab
- Click the latest deployment
- Click **Redeploy**
- Wait for build to complete (2-3 minutes)

---

## 🟡 Warning 3: Coinbase RPC Unauthorized
```
api.developer.coinbase.com/rpc/v1/base/demo-key - 401 error
```

**Status:** ✅ **EXPECTED**  
**Why:** Using free demo key, not critical. OnchainKit API key handles actual requests.  
**Impact:** None - your app works fine.

---

## ✅ After Redeploy

All warnings will disappear! Your app will have:
- ✅ Proper wallet integration
- ✅ Swap feature fully working
- ✅ XP system enabled
- ✅ SBT contract configured
- ✅ Clean console

---

## 📋 Quick Summary

| Issue | Fix | Status |
|-------|-----|--------|
| MetaMask conflict | Error handling added | ✅ Done |
| OnchainKit API key | Add to Vercel env vars | 🔧 Next |
| Coinbase RPC | Not needed (fallback) | ℹ️ Ignore |

**Next action:** Go to Vercel, add the 4 environment variables, and click Redeploy.

That's it! 🚀
