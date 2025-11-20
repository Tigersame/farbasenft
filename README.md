# farbasenft

A Foundation-inspired NFT marketplace built as a Base Mini App with Farcaster integration, XP system, and Soulbound Tokens (SBT).

## Features

- 🎨 **NFT Marketplace**: Create, buy, and sell NFTs on Base
- 🏆 **XP System**: Earn experience points through daily logins, swaps, and NFT activities
- 🎖️ **Soulbound Tokens**: Claim exclusive SBTs for early adopters
- 🔗 **Farcaster Integration**: Share NFTs and interact with the Farcaster community
- 📱 **Base Mini App**: Optimized for Base app and Warpcast
- 🔔 **Notifications**: Base Mini App notification support
- 🖼️ **IPFS Storage**: Pinata integration for decentralized NFT storage
- 🔄 **Token Swaps**: Built-in swap functionality with OnchainKit

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Blockchain**: Base (Ethereum L2)
- **Wallet**: Wagmi + OnchainKit
- **Farcaster**: Mini App SDK + Quick Auth
- **Storage**: Pinata (IPFS)
- **Styling**: Tailwind CSS 4

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Wallet (Coinbase Wallet, MetaMask, etc.)
- API keys (see `.env.example`)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd farbasenft
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables template:
```bash
cp .env.example .env.local
```

4. Fill in your API keys in `.env.local`:
   - WalletConnect Project ID
   - Pinata JWT, API Key, and Secret
   - OnchainKit API Key
   - Tatum API Key (optional)
   - Neynar API Key and Webhook URL
   - Base RPC URL

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

See `.env.example` for all required environment variables. **Never commit `.env.local` to git!**

## Project Structure

```
farbasenft/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── lib/              # Utilities and hooks
│   └── providers/        # Context providers
├── contracts/            # Solidity smart contracts
├── public/               # Static assets
└── .env.example          # Environment variables template
```

## Documentation

### Setup Guides
- [Farcaster Auth Setup](./FARCASTER_AUTH_SETUP.md)
- [Wallet Setup](./WALLET_SETUP.md)
- [Pinata Setup](./PINATA_SETUP.md)
- [XP System](./XP_SYSTEM.md)

### Implementation Guides
- [Authentication Implementation](./AUTH_IMPLEMENTATION.md) - Quick Auth integration
- [Authentication Quick Reference](./AUTH_QUICK_REF.md) - Quick auth guide
- [Wallet Interaction Guide](./WALLET_INTERACTION_GUIDE.md) - Complete wallet integration
- [Discovery Implementation](./DISCOVERY_IMPLEMENTATION.md) - SEO & Farcaster discovery
- [Discovery Checklist](./DISCOVERY_CHECKLIST.md) - Deployment steps
- [Domain Migration](./DOMAIN_MIGRATION.md) - Change domains smoothly
- [Notifications Implementation](./NOTIFICATIONS_IMPLEMENTATION.md) - Push notification system
- [Notifications Quick Reference](./NOTIFICATIONS_QUICK_REF.md) - Quick notification guide
- [Universal Links Implementation](./UNIVERSAL_LINKS_IMPLEMENTATION.md) - Deep linking guide
- [Universal Links Quick Reference](./UNIVERSAL_LINKS_QUICK_REF.md) - Quick links guide
- [Share Extension Implementation](./SHARE_EXTENSION_IMPLEMENTATION.md) - Cast sharing guide
- [Share Extension Quick Reference](./SHARE_EXTENSION_QUICK_REF.md) - Quick share guide
- [SDK Advanced Features](./SDK_ADVANCED_FEATURES.md) - Capabilities, events, compatibility
- [SDK Quick Reference](./SDK_QUICK_REF.md) - Quick SDK feature guide

### Farcaster Integration
- [Sharing Feature](./FARCASTER_SHARING_FEATURE_SUMMARY.md)
- [Mini App Guidelines](./BASE_GUIDELINES_COMPLIANCE.md)
- [Testing in Farcaster](./TESTING_IN_FARCASTER.md)

## Smart Contracts

The SBT (Soulbound Token) contract is located in `contracts/SBT.sol`. Deploy it to Base to enable SBT claiming.

## Demo Pages

- **`/wallet-demo`** - Complete wallet interaction demonstration
  - Wallet connection flow
  - Transaction sending example
  - Implementation reference

- **`/sdk-demo`** - SDK capabilities and features demo
  - Capability detection testing
  - isInMiniApp context display
  - Live event monitoring
  - Compatibility report
  - Implementation reference

## Deployment

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- Your own server

## Security

⚠️ **Important**: Never commit sensitive information to git:
- `.env.local` files
- Private keys
- API keys
- Secrets

All sensitive files are excluded via `.gitignore`.

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Support

For issues and questions, please open an issue on GitHub.
