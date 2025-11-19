#!/bin/bash
# Verify SBT Configuration

echo "🔍 Checking SBT Contract Configuration..."
echo ""

# Check if contract address is set
if [ -z "$NEXT_PUBLIC_SBT_CONTRACT_ADDRESS" ]; then
  echo "❌ NEXT_PUBLIC_SBT_CONTRACT_ADDRESS is NOT set"
  echo ""
  echo "To fix this:"
  echo "1. Go to: https://vercel.com/dashboard"
  echo "2. Select 'devsminiapp' project"
  echo "3. Settings → Environment Variables"
  echo "4. Add or update:"
  echo "   Name: NEXT_PUBLIC_SBT_CONTRACT_ADDRESS"
  echo "   Value: 0x4653cf1E6272D9f87C42ae6F441D7Fc546705C9f"
  echo "5. Click Save"
  echo "6. Go to Deployments tab"
  echo "7. Click latest deployment"
  echo "8. Click 'Redeploy' button"
  exit 1
else
  echo "✅ NEXT_PUBLIC_SBT_CONTRACT_ADDRESS is set:"
  echo "   Value: $NEXT_PUBLIC_SBT_CONTRACT_ADDRESS"
fi

echo ""
if [ -z "$NEXT_PUBLIC_RPC_URL" ]; then
  echo "❌ NEXT_PUBLIC_RPC_URL is NOT set"
  exit 1
else
  echo "✅ NEXT_PUBLIC_RPC_URL is set:"
  echo "   Value: $NEXT_PUBLIC_RPC_URL"
fi

echo ""
if [ -z "$NEXT_PUBLIC_MINIKIT_API_KEY" ]; then
  echo "❌ NEXT_PUBLIC_MINIKIT_API_KEY is NOT set"
  exit 1
else
  echo "✅ NEXT_PUBLIC_MINIKIT_API_KEY is set (hidden for security)"
fi

echo ""
echo "✅ All configurations are correct!"
