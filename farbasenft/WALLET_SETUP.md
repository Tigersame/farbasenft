# Wallet Connection Setup

## Issue: Wallet Redirects to Website Instead of Modal

If wallet connection redirects to the wallet website instead of opening a modal, check the following:

### 1. WalletConnect Project ID (Required)

The `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` environment variable is **required** for WalletConnect to work properly. Without it, wallet connections may redirect instead of using the modal.

**To get a WalletConnect Project ID:**
1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Sign up or log in
3. Create a new project
4. Copy your Project ID
5. Add it to your `.env.local` file:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### 2. Coinbase Wallet Configuration

The Coinbase Wallet connector is configured with `preference: "all"` to allow both:
- **Extension wallets** (Coinbase Wallet browser extension) - opens in modal
- **Smart wallets** (Coinbase Smart Wallet) - may redirect to website for creation

If you want to force modal-only behavior, you can:
- Use only extension wallets by installing the Coinbase Wallet browser extension
- Or configure the connector to prefer extension wallets

### 3. Current Configuration

```typescript
// In RootProvider.tsx
coinbaseWallet({
  appName: "farbasenft",
  preference: "all", // Allows both extension and smart wallets
  version: "4",
})
```

```typescript
// OnchainKit config
wallet: {
  display: "modal", // Forces modal display
  preference: "all",
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  supportedWallets: {
    rabby: true,
    trust: true,
    frame: true,
    coinbase: true,
    metamask: true,
  },
}
```

### 4. Troubleshooting

**If wallet still redirects:**

1. **Check environment variables:**
   ```bash
   # Make sure this is set in .env.local
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   ```

2. **Clear browser cache and reload**

3. **Check browser console for errors**

4. **Try different wallets:**
   - MetaMask (should always use modal if extension is installed)
   - Coinbase Wallet extension (should use modal)
   - Other supported wallets

5. **Verify WalletConnect project is active:**
   - Check your WalletConnect Cloud dashboard
   - Ensure the project is not paused or expired

### 5. Expected Behavior

- **MetaMask**: Opens modal if extension is installed
- **Coinbase Wallet Extension**: Opens modal if extension is installed  
- **Coinbase Smart Wallet**: May redirect to website for first-time setup
- **WalletConnect QR**: Shows QR code in modal (requires Project ID)
- **Other wallets**: Should use modal if properly configured

### 6. Notes

- The `display: "modal"` setting in OnchainKit config should force modal display
- Some wallets (like Coinbase Smart Wallet creation) may still redirect for initial setup
- Once a wallet is connected, subsequent connections should use the modal
- The Farcaster Mini App connector always works within the Farcaster context

