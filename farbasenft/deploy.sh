#!/bin/bash
# Quick deployment script for Base Sepolia testnet

echo "🚀 FarbaseNFT Deployment Script"
echo "================================"
echo ""

# Check if private key is set
if grep -q "DEPLOYER_PRIVATE_KEY=your_private_key_here" .env.local; then
    echo "❌ Error: Please set your DEPLOYER_PRIVATE_KEY in .env.local"
    echo ""
    echo "Steps:"
    echo "1. Get testnet ETH from: https://faucet.quicknode.com/base/sepolia"
    echo "2. Get your private key from MetaMask (Account Details → Show Private Key)"
    echo "3. Add it to .env.local: DEPLOYER_PRIVATE_KEY=your_key"
    echo ""
    exit 1
fi

echo "✓ Environment configured"
echo ""
echo "Deploying to Base Sepolia..."
npm run deploy:testnet
