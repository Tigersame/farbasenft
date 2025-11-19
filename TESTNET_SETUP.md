# Farbase Testnet Setup Guide

## Environment Variables for Vercel (Base Sepolia)

Add these to your Vercel project:

```env
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org
NEXT_PUBLIC_SBT_CONTRACT_ADDRESS=0x_your_sbt_contract_address
NEXT_PUBLIC_MINIKIT_API_KEY=your_minikit_api_key_here
```

## Quick Setup Steps

### 1. Get Your SBT Contract Address

If you already deployed on Sepolia:
```bash
cd c:\Users\om\farbasenft(4)\farbasenft\farbasenft
npx hardhat run scripts/deploy-sbt.cjs --network baseSepolia
```

This will output the contract address like:
```
SBT deployed to: 0x...
```

Copy this address.

### 2. Set Environment Variables in Vercel

1. Go to: https://vercel.com/dashboard
2. Select your project: **devsminiapp**
3. Click **Settings** → **Environment Variables**
4. Add these three variables:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_RPC_URL` | `https://sepolia.base.org` |
| `NEXT_PUBLIC_SBT_CONTRACT_ADDRESS` | Your SBT contract address from step 1 |
| `NEXT_PUBLIC_MINIKIT_API_KEY` | Your Minikit API key |

### 3. Redeploy on Vercel

1. Go to **Deployments** tab
2. Click the latest deployment
3. Click **Redeploy**
4. Wait for build to complete (~2-3 minutes)

### 4. Test Your App

**Live URL:** https://y-osqcnd5dc-devsminiapp.vercel.app

**Test Checklist:**
- [ ] Page loads with Farbase banner
- [ ] Wallet connects (MetaMask, Coinbase Wallet, WalletConnect)
- [ ] Network shows Base Sepolia (chain ID: 84532)
- [ ] XP system displays daily login
- [ ] SBT claiming works
- [ ] NFT minting/gallery functional
- [ ] Swap portal accessible

## Network Configuration

**Base Sepolia Testnet Details:**
- **RPC URL:** https://sepolia.base.org
- **Chain ID:** 84532
- **Block Explorer:** https://sepolia.basescan.org
- **Faucet:** https://www.coinbase.com/faucets/base-ethereum-and-usdc-sepolia-testnet-faucet

## Testing Funds

Get testnet funds:
1. Go to: https://www.coinbase.com/faucets/base-ethereum-and-usdc-sepolia-testnet-faucet
2. Connect wallet
3. Claim 0.1 ETH (free, instant)
4. Use in your app

## Troubleshooting

**App shows "Network Error":**
- Check RPC URL is correct: `https://sepolia.base.org`
- Verify wallet is on Base Sepolia network
- Check Vercel environment variables are set

**SBT Claiming fails:**
- Verify contract address is correct
- Make sure you have testnet ETH for gas
- Check contract is deployed on Sepolia (not mainnet)

**Wallet won't connect:**
- Clear browser cache
- Try different wallet (MetaMask, Coinbase, WalletConnect)
- Ensure wallet is on Base Sepolia

## Need Help?

**Resources:**
- Base Documentation: https://docs.base.org
- Sepolia Testnet: https://sepolia.basescan.org
- Farcaster Docs: https://docs.farcaster.xyz
- Vercel Dashboard: https://vercel.com/dashboard

---

**Status:** ✅ Ready for testnet deployment
