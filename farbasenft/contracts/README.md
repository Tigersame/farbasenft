# SBT Smart Contract

## FarcasterNFT SBT Collection

Soulbound Token (SBT) contract for the first 20,000 users of farbasenft.

## Features

- **Non-transferable**: Once minted, SBTs cannot be transferred (soulbound)
- **One per wallet**: Each wallet can only claim one SBT
- **Limited supply**: Maximum of 20,000 SBTs
- **Base chain**: Deployed on Base network

## Deployment

### Prerequisites

- Hardhat or Foundry
- Node.js 18+
- Base network RPC access

### Deploy Script

```bash
# Install dependencies
npm install @openzeppelin/contracts

# Compile
npx hardhat compile

# Deploy to Base
npx hardhat run scripts/deploy-sbt.js --network base
```

### Environment Variables

```env
PRIVATE_KEY=your_deployer_private_key
BASE_RPC_URL=https://mainnet.base.org
```

## Contract Functions

### `claim()`
Claim your SBT. Can only be called once per wallet.

### `canClaim(address account)`
Check if an address can claim an SBT.

### `remainingClaims()`
Get the number of remaining claims.

### `totalClaimed()`
Get the total number of SBTs claimed.

## Integration

After deployment, update your `.env.local`:

```env
NEXT_PUBLIC_SBT_CONTRACT_ADDRESS=0x...
```

The frontend will automatically use this address for SBT claims.

## Security

- Uses OpenZeppelin contracts (battle-tested)
- ReentrancyGuard protection
- Non-transferable (soulbound)
- One claim per wallet enforced

