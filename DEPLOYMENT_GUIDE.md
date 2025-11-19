# Farbase Deployment Guide

**Status:** ✅ **PRODUCTION READY**  
**Date:** November 19, 2025  
**Build:** Next.js 16.0.1 (Turbopack)

## Quick Start (5 minutes)

### Prerequisites
- Node.js v18+
- npm or yarn
- Git
- Deployment target (Vercel, AWS, Netlify, etc.)

### Local Build Verification

```bash
# Navigate to project
cd c:\Users\om\farbasenft(4)\farbasenft\farbasenft

# Install dependencies (if needed)
npm install

# Build for production
npm run build

# Test production build locally
npm run start
```

**Expected Output:**
```
✓ Static   prerendered as static content
╞Æ Dynamic  server-rendered on demand

✓ Ready on http://localhost:3000
```

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Vercel is the creator of Next.js and provides the smoothest experience.**

#### Setup Steps:

1. **Push to GitHub** (if not already done):
   ```bash
   cd c:\Users\om\farbasenft(4)\farbasenft\farbasenft
   git push origin main
   ```

2. **Connect to Vercel**:
   - Visit https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Select the `farbasenft/farbasenft` directory as root

3. **Configure Environment Variables**:
   In Vercel dashboard, add:
   ```env
   NEXT_PUBLIC_RPC_URL=https://sepolia.base.org
   NEXT_PUBLIC_SBT_CONTRACT_ADDRESS=0x_your_deployed_sbt_address
   NEXT_PUBLIC_MINIKIT_API_KEY=your_minikit_key
   ```

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy
   - Your app will be live in ~5 minutes

#### Benefits:
- ✅ Zero-config deployment
- ✅ Automatic HTTPS
- ✅ Edge caching
- ✅ Built-in analytics
- ✅ Preview deployments
- ✅ Free tier available

---

### Option 2: AWS Amplify

1. **Connect GitHub**:
   - Go to AWS Amplify console
   - Click "Create app"
   - Connect GitHub repository
   - Select `farbasenft/farbasenft` as source directory

2. **Build Settings**:
   - Framework: Next.js
   - Build command: `npm run build`
   - Output directory: `.next`

3. **Environment Variables**:
   ```env
   NEXT_PUBLIC_RPC_URL=https://sepolia.base.org
   NEXT_PUBLIC_SBT_CONTRACT_ADDRESS=0x_your_sbt_address
   NEXT_PUBLIC_MINIKIT_API_KEY=your_key
   ```

4. **Deploy**: Click "Save and deploy"

---

### Option 3: Netlify

1. **Push to GitHub** (required)

2. **Connect to Netlify**:
   - Go to https://netlify.com
   - Click "Add new site"
   - Choose "Import an existing project"
   - Select GitHub and authorize
   - Choose your repository

3. **Build Settings**:
   - Base directory: `farbasenft`
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18 or higher

4. **Environment Variables**:
   Add in Netlify dashboard

5. **Deploy**: Click "Deploy"

---

### Option 4: Self-Hosted (Docker/VPS)

#### Create Dockerfile:

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Runtime stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
RUN npm install --production

EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]
```

#### Deploy Commands:

```bash
# Build Docker image
docker build -t farbase:latest .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_RPC_URL=https://sepolia.base.org \
  -e NEXT_PUBLIC_SBT_CONTRACT_ADDRESS=0x_address \
  farbase:latest

# Push to Docker Hub (optional)
docker tag farbase:latest your-username/farbase:latest
docker push your-username/farbase:latest
```

#### Then deploy to:
- **AWS ECS**: Docker container orchestration
- **DigitalOcean App Platform**: Simple app deployment
- **Heroku**: Simple platform-as-a-service
- **Railway**: Modern deployment platform
- **Render**: Easy deployment service

---

## Environment Configuration

### Required Variables

```env
# Network Configuration
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org

# Smart Contracts
NEXT_PUBLIC_SBT_CONTRACT_ADDRESS=0x_your_sbt_contract_address

# Farcaster Integration
NEXT_PUBLIC_MINIKIT_API_KEY=your_minikit_api_key_here
```

### Optional Variables

```env
# Coinbase Wallet
NEXT_PUBLIC_COINBASE_API_KEY=your_coinbase_key

# Analytics (if added)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

---

## Pre-Deployment Checklist

- [x] **Build**: `npm run build` completes successfully
- [x] **Tests**: All routes respond with 200 status
- [x] **Environment**: Required variables configured
- [x] **Features**:
  - [x] Wallet connection working
  - [x] NFT operations functional
  - [x] XP system active
  - [x] SBT claiming enabled
  - [x] Swap portal accessible
  - [x] Leaderboard displaying
- [x] **Branding**: Farbase banner and favicon set
- [x] **Security**: TypeScript strict mode enabled
- [x] **Performance**: Turbopack compilation fast
- [x] **Mobile**: Responsive design verified

---

## Post-Deployment Steps

### 1. Verify Deployment

```bash
# Test deployed URL
curl https://your-deployed-url.com

# Should return HTML with:
# - Farbase banner visible
# - Farcaster favicon loaded
# - All routes responsive
```

### 2. Set Up Domain (if using custom domain)

**For Vercel:**
- Go to Project Settings → Domains
- Add custom domain
- Update DNS records (provided by Vercel)

**For AWS/Netlify:**
- Similar process in respective dashboards

### 3. Enable HTTPS (Automatic on all platforms)

All major deployment platforms provide automatic HTTPS. No additional setup needed.

### 4. Configure Analytics (Optional)

Add to track usage:
- Vercel Analytics (built-in)
- Google Analytics
- Mixpanel
- Sentry (for error tracking)

### 5. Monitor Deployment

- Check build logs
- Monitor application performance
- Set up error alerts
- Review user metrics

---

## Rollback Plan

If issues occur after deployment:

**Vercel:**
1. Go to "Deployments" tab
2. Click previous successful deployment
3. Click "Redeploy"

**AWS/Netlify:**
1. Go to deployment history
2. Select previous working version
3. Click "Restore"

**Self-Hosted:**
```bash
docker rollback previous-version
# or
git revert <commit-hash>
npm run build
npm run start
```

---

## Performance Optimization

### Already Implemented:
- ✅ Next.js 16 with Turbopack
- ✅ Image optimization
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Minification

### To Enable on Vercel:
1. Analytics enabled by default
2. Edge caching automatic
3. Web Vitals monitoring included

### To Enable on Other Platforms:
```next.config.ts
// Already configured for optimal performance
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  productionBrowserSourceMaps: false,
};
```

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next
npm install
npm run build
```

### Deployment Environment Variables Not Loading
- Verify variable names exactly match
- No spaces around `=`
- Restart deployment after adding variables

### Application Slow After Deploy
- Check network waterfall in DevTools
- Verify RPC endpoint is responsive
- Monitor server logs for errors

### Wallet Connection Not Working
- Verify `NEXT_PUBLIC_RPC_URL` is correct
- Check network matches wallet config
- Clear browser cache and localStorage

---

## Scaling & Maintenance

### As Traffic Grows:

**Vercel:**
- Automatic scaling included
- Monitor usage in dashboard
- Upgrade if needed

**AWS/Docker:**
- Set up load balancing
- Enable auto-scaling groups
- Configure database if needed

### Regular Maintenance:

```bash
# Weekly: Check for dependency updates
npm outdated

# Monthly: Update dependencies (test first)
npm update

# Quarterly: Major version updates (caution)
npm audit
npm audit fix
```

---

## Success Metrics

After deployment, verify:

✅ **Uptime**: Should be 99.5%+ with Vercel  
✅ **Load Time**: Home page < 2 seconds  
✅ **API Response**: < 500ms for API calls  
✅ **User Experience**: All features accessible  
✅ **Mobile**: Works on iOS and Android  
✅ **Browsers**: Chrome, Firefox, Safari, Edge  

---

## Support & Resources

**Next.js Documentation:**
- https://nextjs.org/docs

**Deployment Guides:**
- Vercel: https://vercel.com/docs
- AWS Amplify: https://docs.aws.amazon.com/amplify/
- Netlify: https://docs.netlify.com

**Base Network:**
- https://docs.base.org
- RPC: https://base.org/rpc

**Farcaster Integration:**
- https://docs.farcaster.xyz
- Minikit Docs: https://minikit.farcaster.xyz

---

## Summary

Your Farbase NFT marketplace is **production-ready**. Choose your deployment platform and follow the steps above. Most deployments take **5-15 minutes** from start to live.

**Recommended:** Use **Vercel** for fastest, easiest deployment with built-in Next.js optimization.

---

**Questions?** Check the platform-specific documentation or review logs for detailed error messages.

**Ready to deploy?** Choose your platform and follow the steps above! 🚀
