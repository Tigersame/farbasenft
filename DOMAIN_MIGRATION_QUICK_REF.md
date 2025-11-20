# Domain Migration - Quick Reference

## ✅ Implementation Status

Domain migration support is **fully implemented and ready to use**.

Currently: **NOT migrating** (no canonical domain set)

---

## 🚀 How to Migrate to a New Domain

### Step 1: Set Environment Variable

In Vercel dashboard or CLI:
```bash
vercel env add NEXT_PUBLIC_CANONICAL_DOMAIN production
# Enter: new-domain.com (no https://, no port, no path)
```

### Step 2: Deploy
```bash
git push origin main
```

### Step 3: Verify
```bash
# Check manifest shows canonical domain
curl https://y-six-dun.vercel.app/.well-known/farcaster.json | jq '.miniapp.canonicalDomain'

# Test redirect works
curl -I https://y-six-dun.vercel.app
# Should show: 301 Moved Permanently
```

---

## 📋 Format Rules

✅ **Valid:**
- `new-domain.com`
- `app.new-domain.com`
- `miniapp.example.com`

❌ **Invalid:**
- `https://new-domain.com` (no protocol)
- `new-domain.com:3000` (no port)
- `new-domain.com/app` (no path)

---

## 🔧 What's Implemented

### 1. Manifest Configuration (`minikit.config.ts`)
- Reads `NEXT_PUBLIC_CANONICAL_DOMAIN` env var
- Adds `canonicalDomain` field to manifest when set
- Farcaster clients recognize and redirect

### 2. Automatic Redirects (`src/middleware.ts`)
- Redirects all traffic to canonical domain
- 301 Permanent Redirect (SEO-friendly)
- Skips API routes, manifest, static assets

### 3. Protected Routes
No redirect for:
- `/api/*` - API endpoints
- `/.well-known/*` - Manifest
- `/_next/*` - Next.js assets
- `/static/*` - Static files
- Images (svg, png, jpg, etc.)

---

## 🎯 Use Cases

### Moving to Custom Domain
```bash
# Current: y-six-dun.vercel.app
# New: farbasenft.com
NEXT_PUBLIC_CANONICAL_DOMAIN=farbasenft.com
```

### Rebranding
```bash
# Current: oldname.com
# New: newname.com
NEXT_PUBLIC_CANONICAL_DOMAIN=newname.com
```

### Subdomain Change
```bash
# Current: app.example.com
# New: miniapp.example.com
NEXT_PUBLIC_CANONICAL_DOMAIN=miniapp.example.com
```

---

## ⏮️ Rollback

To cancel migration:
```bash
vercel env rm NEXT_PUBLIC_CANONICAL_DOMAIN production
git push origin main
```

---

## 📊 Monitoring

### Check if migrating:
```bash
curl https://y-six-dun.vercel.app/.well-known/farcaster.json | jq '.miniapp.canonicalDomain'
# Returns: null (not migrating) or "new-domain.com" (migrating)
```

### Test redirects:
```bash
curl -I https://y-six-dun.vercel.app
# If migrating: HTTP/1.1 301 Moved Permanently
# If not: HTTP/1.1 200 OK
```

---

## ⚠️ Important Notes

1. **Keep old domain active** for 6+ months during transition
2. **Both domains need valid SSL** certificates
3. **Re-register manifest** with Farcaster after migration
4. **Wait 24-48 hours** for clients to recognize change
5. **Monitor traffic** on both domains during transition

---

## 📖 Full Documentation

- `DOMAIN_MIGRATION.md` - Complete migration guide
- `DISCOVERY_IMPLEMENTATION.md` - Discovery & SEO setup

---

## 🔗 Resources

- Farcaster Guide: https://miniapps.farcaster.xyz/docs/guides/domain-migration
- Manifest Tool: https://farcaster.xyz/~/developers/mini-apps/manifest

---

**Current Status**: Ready for migration when needed
**Action Required**: None (unless you want to migrate domains)
