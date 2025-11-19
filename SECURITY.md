# Security Guidelines

## 🔐 Critical Security Rules

### NEVER Commit These Files:
- `.env.local` - Contains ALL your secrets
- `.env.development.local`
- `.env.production.local`
- Any file with `_private_key` or `_api_key` in the name

### Files Already Protected by .gitignore:
✅ `.env.local` - Your credentials are safe
✅ `cache/` - Hardhat compilation cache
✅ `artifacts/` - Smart contract artifacts
✅ `.cache/` - Application cache with sensitive data

## 🔑 Your Private Key is Secure

Your `DEPLOYER_PRIVATE_KEY` in `.env.local` is:
- ✅ Already in `.gitignore`
- ✅ NOT tracked by git
- ✅ NOT committed to repository
- ✅ Only stored locally on your machine

## 🛡️ Backend Security

### Environment Variables:
All API routes use `process.env` which:
- Only loads from `.env.local` on server
- Never exposed to client/browser
- Only accessible in API routes and server components

### Protected Routes:
- `/api/upload/pinata` - Uses `PINATA_JWT` (server-only)
- `/api/upload/infura` - Uses `INFURA_PROJECT_SECRET` (server-only)
- `/api/upload/filebase` - Uses `FILEBASE_KEY` (server-only)

### Client-Safe Variables:
Only these are exposed to browser (prefixed with `NEXT_PUBLIC_`):
- `NEXT_PUBLIC_BASE_RPC_URL` - Public RPC endpoint
- `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` - Public contract address
- `NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL` - Public testnet RPC

## ✅ Security Checklist

Before deploying to production:

1. **Never share your private key**
   - ❌ Don't paste in chat
   - ❌ Don't email
   - ❌ Don't commit to git
   - ✅ Only store in `.env.local`

2. **Check git status before committing:**
   ```bash
   git status
   # Ensure .env.local is NOT listed
   ```

3. **Verify .gitignore:**
   ```bash
   git check-ignore .env.local
   # Should output: .env.local
   ```

4. **Production deployment:**
   - Use environment variables in hosting platform (Vercel, Railway, etc.)
   - Never hardcode secrets in code
   - Rotate API keys regularly

## 🚨 If Private Key is Exposed

If you accidentally commit your private key:

1. **Immediately transfer all funds** to a new wallet
2. **Generate new wallet** and update `.env.local`
3. **Rotate all API keys** (Pinata, Infura, etc.)
4. **Remove from git history:**
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env.local" \
     --prune-empty --tag-name-filter cat -- --all
   ```

## 📝 Best Practices

1. **Use separate wallets:**
   - Development wallet (testnet only)
   - Production wallet (mainnet, minimal funds)
   - Treasury wallet (cold storage)

2. **API Key Management:**
   - Use scoped/restricted keys when possible
   - Set rate limits
   - Monitor usage
   - Rotate quarterly

3. **Code Review:**
   - Never hardcode secrets
   - Use environment variables
   - Prefix public vars with `NEXT_PUBLIC_`
   - Validate all inputs in API routes
