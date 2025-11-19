# SBT (Soulbound Token) Setup Guide

The SBT Claim feature allows users to mint a Soulbound Token (non-transferable NFT) and earn 1,000 XP as early adopters. This guide explains how to deploy and configure the SBT contract.

## Overview

- **Contract**: `FarcasterNFTSBT` - ERC721 non-transferable token
- **Network**: Base (Mainnet or Sepolia)
- **Max Supply**: 20,000 tokens
- **Reward**: 1,000 XP per claim
- **Claim Limit**: One per wallet

## Prerequisites

1. **Base Network Setup**
   - MetaMask or other Web3 wallet
   - Some ETH on Base for gas fees (small amount, ~0.01 ETH)
   - RPC URL: <https://base-rpc.publicnode.com>

2. **Development Tools**
   - Node.js v18+
   - Hardhat (already in project)
   - Etherscan API Key (optional, for verification)

## Deployment Steps

### Option 1: Using Hardhat (Recommended)

1. **Compile the contract**:

   ```bash
   npx hardhat compile
   ```

2. **Deploy to Base Sepolia (testnet)**:

   ```bash
   npx hardhat run scripts/deploy-sbt.ts --network baseSepolia
   ```

3. **Deploy to Base Mainnet** (when ready):

   ```bash
   npx hardhat run scripts/deploy-sbt.ts --network base
   ```

4. **Copy the contract address** from the output

### Option 2: Using Remix IDE

1. Go to <https://remix.ethereum.org>
2. Create new file: `FarcasterNFTSBT.sol`
3. Copy contents from `contracts/SBT.sol`
4. Compile (Solidity 0.8.20)
5. Deploy using:
   - Network: Base
   - Constructor args: `(deployer_address, "ipfs://QmYourBaseURI")`
6. Copy the deployed address

### Option 3: Using OpenZeppelin Defender

1. Connect wallet to <https://defender.openzeppelin.com>
2. Upload SBT.sol contract
3. Deploy with Base network
4. Copy deployed address

## Configuration

After deployment, add the contract address to your environment:

1. **Update `.env.local`**:

   ```env
   NEXT_PUBLIC_SBT_CONTRACT_ADDRESS=0x_your_deployed_contract_address_here
   ```

2. **Reload the app**:

   ```bash
   npm run dev
   ```

3. **Test the claim**:
   - Connect your wallet
   - Navigate to the SBT section
   - Click "Claim SBT + 1,000 XP"

## Verification (Optional but Recommended)

### Using Hardhat

```bash
npx hardhat verify --network base 0xYourContractAddress
```

### Using Etherscan UI

1. Go to Base Etherscan (<https://basescan.org>)
2. Find your contract address
3. Click "Contract" tab
4. Click "Verify and Publish"
5. Paste flattened contract code from Remix
6. Set compiler version to 0.8.20

## Contract Functions

### User Functions

- `claim()` - Claim one SBT (1000 XP reward)
- `hasClaimed(address)` - Check if address has claimed

### Admin Functions

- `setBaseURI(string)` - Update metadata base URI (owner only)
- `pause()` / `unpause()` - Pause/resume claiming (owner only)

## Metadata Setup

The SBT uses a metadata URI for NFT display. Set it via:

```bash
# Update metadata after deployment
npx hardhat run scripts/set-sbt-metadata.ts --network base
```

Or manually call the contract:

```solidity
setBaseURI("ipfs://QmYourMetadataHash")
```

## Troubleshooting

### "Contract address not configured"

- ✅ Deploy contract (see steps above)
- ✅ Add address to .env.local
- ✅ Restart dev server

### "User already claimed"

- The wallet has already claimed an SBT
- Each wallet can only claim once

### "Claim limit reached"

- The 20,000 limit has been reached
- No more SBTs can be claimed

### Gas estimation error

- Ensure you have ETH for gas fees
- Minimum ~0.01 ETH on Base

### Transaction fails

- Check network (must be Base Mainnet or Sepolia)
- Verify contract address is correct
- Ensure wallet has sufficient balance

## Deployment Costs

| Network | Est. Cost | Notes |
|---------|-----------|-------|
| Base Sepolia | ~0.001 ETH | Testnet, free faucet available |
| Base Mainnet | ~0.002-0.005 ETH | Production, actual costs vary |

## Security Notes

⚠️ **Before Mainnet Deployment**:

1. **Audit**: Consider a security audit for production
2. **Metadata**: Host metadata on permanent IPFS storage
3. **Owner**: Store owner address safely (multi-sig recommended)
4. **Limits**: Adjust MAX_SUPPLY if needed (currently 20,000)

## Post-Deployment

After deploying:

1. ✅ Test claiming in testnet first
2. ✅ Verify metadata displays correctly in wallets
3. ✅ Update .env.local with mainnet address
4. ✅ Announce SBT claim feature to users
5. ✅ Monitor claims via contract on Etherscan

## Support

For issues:

- Check Hardhat documentation: <https://hardhat.org/docs>
- Base network docs: <https://docs.base.org>
- OpenZeppelin contracts: <https://docs.openzeppelin.com/contracts/>

## Next Steps

- [ ] Deploy SBT contract to Base Sepolia
- [ ] Test claim functionality
- [ ] Deploy to Base Mainnet
- [ ] Update .env.local with contract address
- [ ] Test SBT claim with real users
- [ ] Monitor XP rewards system

---

**Questions?** Check the main README.md for more information about the FarcasterNFT mini app.
