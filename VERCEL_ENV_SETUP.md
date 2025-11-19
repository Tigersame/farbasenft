# Vercel Environment Variables Configuration

Your app is deployed but needs environment variables configured in Vercel for production.

## ✅ Required Environment Variables

Add these to Vercel:

1. Go to: https://vercel.com/dashboard/devsminiapp
2. Click **Settings** → **Environment Variables**
3. Add each variable below (Production environment)

### **Smart Contracts**
```
NEXT_PUBLIC_SBT_CONTRACT_ADDRESS = 0x4653cf1E6272D9f87C42ae6F441D7Fc546705C9f
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS = 0x39aFB48017BA4b1c94172918052EA865dE022BFe
```

### **APIs & Keys**
```
NEXT_PUBLIC_ONCHAINKIT_API_KEY = 6799fc99-e132-43bd-abb7-965855505eda
NEXT_PUBLIC_MINIKIT_API_KEY = A2FB36E9-3C4E-48AA-8018-BC03613CB5CD
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID = your_walletconnect_project_id
```

### **RPC URLs**
```
NEXT_PUBLIC_RPC_URL = https://sepolia.base.org
NEXT_PUBLIC_BASE_RPC_URL = https://mainnet.base.org
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL = https://sepolia.base.org
```

### **IPFS / Storage**
```
PINATA_JWT = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1OTFkNDM0MS1mNzM1LTQ5ZDUtOGQ1ZC1mZGMzZGNlNmVhYTEiLCJlbWFpbCI6Imt1bWFycmF2aXNzdEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMjhhYTQwNGQ5ZjBhMzU5NmI0MDYiLCJzY29wZWRLZXlTZWNyZXQiOiJiNjEyNDQxNmExZmM2OGFmYzJjNmJkZTdkN2Y1ZDMzZjY5ODJmYWEzNDAxNzc1MGE2MjUwMWI0NzUyZTc1NGViIiwiZXhwIjoxNzk0OTg2OTk1fQ.SB9jezLfDRqxlFCeu6yDcaC8MPPYovJXRdpoelXl2a0
PINATA_API_KEY = 28aa404d9f0a3596b406
PINATA_SECRET_API_KEY = b6124416a1fc68afc2c6bde7d7f5d33f6982faa34017750a62501b4752e754eb
```

### **App Configuration**
```
NEXT_PUBLIC_APP_URL = https://y-osqcnd5dc-devsminiapp.vercel.app
```

---

## 📋 Quick Steps

1. **Go to Vercel Dashboard**
   - URL: https://vercel.com/dashboard/devsminiapp

2. **Open Settings**
   - Click your project
   - Click **Settings** tab
   - Click **Environment Variables** in left sidebar

3. **Add Variables**
   - For each variable above, click **Add New**
   - Enter Name and Value
   - Select **Production** (or all environments)
   - Click **Save**

4. **Redeploy**
   - Go to **Deployments** tab
   - Click latest deployment
   - Click **Redeploy**
   - Wait 2-3 minutes for build

---

## ✨ What Each Variable Does

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SBT_CONTRACT_ADDRESS` | Soulbound token contract on Base Sepolia |
| `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` | NFT contract for minting/trading |
| `NEXT_PUBLIC_ONCHAINKIT_API_KEY` | Enables Swap feature via Coinbase |
| `NEXT_PUBLIC_MINIKIT_API_KEY` | Farcaster Mini App integration |
| `NEXT_PUBLIC_RPC_URL` | Base Sepolia network endpoint |
| `PINATA_JWT` | IPFS storage for NFT metadata |

---

## 🚀 After Adding Variables

Your app will have:
- ✅ SBT claiming functionality
- ✅ NFT minting and trading
- ✅ Swap portal (Coinbase)
- ✅ XP system and leaderboards
- ✅ IPFS storage for metadata
- ✅ Farcaster integration

---

**Status:** App deployed but needs env vars for full functionality.
**Next:** Add variables to Vercel and redeploy.
