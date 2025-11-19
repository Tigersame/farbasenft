# XP System Documentation

## Overview

The farbasenft XP (Experience Points) system rewards users for engaging with the platform. Users can earn XP through various actions and claim a Soulbound Token (SBT) as a special reward.

## XP Rewards

| Action | XP Amount | Description |
|--------|----------|-------------|
| Daily Login | 100 XP | Claim once per day when you visit the app |
| Swap | 100 XP | Complete a token swap (ETH, USDC, DEGEN) |
| NFT Create | 100 XP | Upload and create an NFT |
| NFT Sell | 100 XP | List an NFT for sale |
| NFT Buy | 100 XP | Purchase an NFT from marketplace |
| SBT Claim | 1,000 XP | Claim your Soulbound Token (one-time) |

## Level System

Levels are calculated using the formula: `level = floor(sqrt(totalXP / 100))`

- **Level 0**: 0-99 XP
- **Level 1**: 100-399 XP
- **Level 2**: 400-899 XP
- **Level 3**: 900-1,599 XP
- And so on...

## SBT Collection

### Details
- **Total Supply**: 20,000 SBTs
- **Network**: Base Chain
- **Type**: Soulbound Token (non-transferable)
- **Reward**: 1,000 XP + Unique SBT NFT
- **Limit**: 1 SBT per wallet (one-time claim)

### Smart Contract
- Location: `contracts/SBT.sol`
- Features:
  - Non-transferable (soulbound)
  - One claim per wallet enforced on-chain
  - 20,000 supply limit
  - OpenZeppelin security standards

## API Endpoints

### Get User XP
```
GET /api/xp?wallet=0x...
```
Returns user XP data including total XP, level, and transaction history.

### Add XP
```
POST /api/xp
Body: { wallet: string, action: XPAction, metadata?: object }
```
Awards XP for a specific action.

### Daily Login
```
POST /api/xp/daily-login
Body: { wallet: string }
```
Claims daily login bonus (100 XP).

### SBT Claim Status
```
GET /api/xp/sbt/claim?wallet=0x...
```
Checks if wallet can claim SBT.

### Claim SBT
```
POST /api/xp/sbt/claim
Body: { wallet: string }
```
Claims SBT and awards 1,000 XP.

## Components

### XPDisplay
Shows user's current XP, level, and progress to next level. Includes daily login claim button.

### SBTClaim
Allows users to claim their SBT. Shows remaining supply and claim status.

## Integration Points

### Automatic XP Tracking
- **Daily Login**: Auto-claimed when user visits (if not already claimed today)
- **Swap**: Tracked via swap completion events
- **NFT Create**: Awarded after successful IPFS upload
- **NFT Sell**: Awarded after successful listing transaction
- **NFT Buy**: Awarded after successful purchase transaction

### Manual XP Tracking
- **SBT Claim**: User must click "Claim SBT" button

## Environment Variables

```env
# SBT Contract Address (after deployment)
NEXT_PUBLIC_SBT_CONTRACT_ADDRESS=0x...
```

## Deployment Steps

1. **Deploy SBT Contract**
   ```bash
   npx hardhat run scripts/deploy-sbt.js --network base
   ```

2. **Update Environment**
   ```env
   NEXT_PUBLIC_SBT_CONTRACT_ADDRESS=<deployed_address>
   ```

3. **Test XP System**
   - Connect wallet
   - Perform actions (swap, create NFT, etc.)
   - Check XP updates
   - Claim SBT

## Database (Production)

**Note**: Current implementation uses in-memory storage. For production, replace with:
- PostgreSQL/MongoDB for XP data
- Redis for daily login tracking
- Database for SBT claim tracking

## Future Enhancements

- Leaderboards
- XP multipliers for special events
- Badges and achievements
- Referral bonuses
- Staking rewards

