# Git Repository Setup Guide

## ✅ What's Already Done

- ✅ Git repository initialized
- ✅ All code committed (64 files)
- ✅ `.env.local` and sensitive files excluded via `.gitignore`
- ✅ `.env.example` template created (safe to commit)
- ✅ Comprehensive README added

## 🔒 Security Check

**Verified**: No sensitive files were committed:
- ❌ `.env.local` - **NOT in repository** ✅
- ❌ Private keys - **NOT in repository** ✅
- ❌ API keys - **NOT in repository** ✅
- ✅ `.env.example` - Template only (safe) ✅

## 📦 Create GitHub Repository

### Option 1: Using GitHub CLI (if installed)

```bash
cd farbasenft
gh repo create farbasenft --public --source=. --remote=origin --push
```

### Option 2: Using GitHub Website

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **+** icon in the top right → **New repository**
3. Repository name: `farbasenft`
4. Description: "Foundation-inspired NFT marketplace built as a Base Mini App"
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **Create repository**

### Option 3: Manual Setup

After creating the repository on GitHub, run:

```bash
cd farbasenft

# Remove existing placeholder remote (if any)
git remote remove origin

# Add your new repository
git remote add origin https://github.com/YOUR_USERNAME/farbasenft.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🚀 Push Your Code

Once the remote is set up:

```bash
cd farbasenft
git push -u origin main
```

If your default branch is `master` instead of `main`:

```bash
git branch -M main
git push -u origin main
```

## 🔐 Environment Variables for Deployment

When deploying to Vercel, Netlify, or other platforms, add these environment variables in the platform's dashboard:

### Required:
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- `PINATA_JWT`
- `PINATA_API_KEY`
- `PINATA_SECRET_KEY`
- `NEXT_PUBLIC_ONCHAINKIT_API_KEY`
- `NEXT_PUBLIC_BASE_RPC_URL`

### Optional:
- `TATUM_API_KEY`
- `NEYNAR_API_KEY`
- `NEYNAR_WEBHOOK_URL`
- `NEXT_PUBLIC_SBT_CONTRACT_ADDRESS`
- `FARCASTER_HEADER`
- `FARCASTER_PAYLOAD`
- `FARCASTER_SIGNATURE`
- `BASE_BUILDER_OWNER_ADDRESS`

**Never add these in the repository!** Only in the deployment platform's environment variables section.

## ✅ Verification Checklist

Before pushing, verify:

- [x] `.env.local` is in `.gitignore`
- [x] No API keys in committed files
- [x] No private keys in committed files
- [x] `.env.example` is committed (template only)
- [x] `node_modules/` is ignored
- [x] `.next/` build folder is ignored
- [x] All sensitive files excluded

## 🛡️ Security Best Practices

1. **Never commit**:
   - `.env.local` or any `.env*` files (except `.env.example`)
   - Private keys (`.key`, `.pem` files)
   - API keys or secrets
   - Database credentials

2. **Always use**:
   - `.env.example` as a template
   - Environment variables in deployment platforms
   - Secrets management services for production

3. **If you accidentally committed sensitive data**:
   ```bash
   # Remove from git history (use with caution!)
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env.local" \
     --prune-empty --tag-name-filter cat -- --all
   ```

## 📝 Next Steps

1. Create the GitHub repository
2. Push your code
3. Set up deployment (Vercel recommended)
4. Add environment variables in deployment platform
5. Deploy and test!

## 🆘 Troubleshooting

### "Repository not found"
- Check that the repository exists on GitHub
- Verify your GitHub username is correct
- Ensure you have push access

### "Permission denied"
- Use SSH keys or Personal Access Token
- For HTTPS: `git remote set-url origin https://YOUR_TOKEN@github.com/USERNAME/farbasenft.git`

### "Branch protection"
- Some repositories require main branch
- Use: `git branch -M main` before pushing

