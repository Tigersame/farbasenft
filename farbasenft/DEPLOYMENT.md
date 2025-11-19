# Deployment Guide - Base Sepolia Testnet

## Prerequisites

1. **Get Base Sepolia ETH**
   - Visit [Base Sepolia Faucet](https://faucet.quicknode.com/base/sepolia)
   - Or [Coinbase Faucet](https://portal.cdp.coinbase.com/products/faucet)
   - You'll need ~0.01 ETH for deployment

**2. Get Your Private Key:**
- Open MetaMask
- Click 3 dots → Account Details → Show Private Key
- Copy it (NEVER share this with anyone!)

**3. Add to `.env.local`:**
```env
DEPLOYER_PRIVATE_KEY=0xYourPrivateKeyHere
```
⚠️ **CRITICAL**: This file is already in `.gitignore` and will NOT be committed to git

### 3. Deploy to Base Sepolia
```bash
npm run deploy:testnet
```

This will:
- Deploy the FarbaseNFT contract
- Show you the contract address
- You'll see output like:
  ```
  FarbaseNFT deployed to: 0xAbC123...
  ```

### 4. Update .env.local
Copy the contract address and add to `.env.local`:
```
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0xYourContractAddress
```

### 5. Verify on Basescan (Optional)
Get a free API key from [Basescan](https://basescan.org/myapikey), add to `.env.local`:
```
BASESCAN_API_KEY=your_api_key
```

Then verify:
```bash
npm run verify:testnet 0xYourContractAddress
```

### 6. Test Your Mint Page
Restart the dev server:
```bash
npm run dev
```

Visit `http://localhost:3000/mint` and try minting!

## Network Details

- **Network Name**: Base Sepolia
- **Chain ID**: 84532
- **RPC URL**: https://sepolia.base.org
- **Block Explorer**: https://sepolia.basescan.org

## Troubleshooting

- **"insufficient funds"**: Get more testnet ETH from faucet
- **"nonce too high"**: Reset account in MetaMask (Settings → Advanced → Clear activity)
- **"cannot estimate gas"**: Check RPC URL is correct in hardhat.config.ts
