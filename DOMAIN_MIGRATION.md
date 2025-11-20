# Domain Migration Guide

## Overview

This guide explains how to migrate your farbasenft Mini App to a new domain using Farcaster's `canonicalDomain` field.

Reference: https://miniapps.farcaster.xyz/docs/guides/domain-migration

## When to Use Domain Migration

- **Rebranding**: Moving to a new brand domain
- **Domain Expiration**: Switching before your current domain expires
- **Business Reasons**: Consolidating multiple apps under one domain
- **Custom Domain**: Moving from Vercel subdomain to your own domain

## How It Works

When users access your app through the old domain, Farcaster clients:

1. Check the manifest for `canonicalDomain` field
2. Recognize the app has moved
3. Update their references to the new domain
4. Redirect users to the new location

## Implementation Status

✅ **Already Implemented:**
- Manifest support for `canonicalDomain` field
- Automatic HTTP redirects via middleware
- Environment variable configuration
- Validation and error handling

## Migration Steps

### Step 1: Prepare New Domain

1. **Set up DNS** for your new domain
2. **Deploy app** to new domain or configure routing
3. **Verify deployment** works at new domain
4. **Test all functionality** on new domain

### Step 2: Configure Environment Variable

Add to Vercel (or your hosting platform):

```bash
NEXT_PUBLIC_CANONICAL_DOMAIN=your-new-domain.com
```

**Format Rules:**
- ✅ `new-domain.com` - Valid
- ✅ `app.new-domain.com` - Valid subdomain
- ❌ `https://new-domain.com` - No protocol
- ❌ `new-domain.com:3000` - No port
- ❌ `new-domain.com/app` - No path

### Step 3: Deploy with Canonical Domain

```bash
# Add environment variable in Vercel dashboard or CLI
vercel env add NEXT_PUBLIC_CANONICAL_DOMAIN production

# When prompted, enter your new domain (e.g., "new-domain.com")

# Redeploy
git push origin main
```

### Step 4: Verify Migration

**Check Old Domain Manifest:**
```bash
curl https://old-domain.com/.well-known/farcaster.json | jq '.miniapp.canonicalDomain'
# Should return: "new-domain.com"
```

**Check New Domain Manifest:**
```bash
curl https://new-domain.com/.well-known/farcaster.json | jq '.miniapp'
# Should show homeUrl pointing to new domain
```

**Test Redirects:**
```bash
curl -I https://old-domain.com
# Should return: HTTP/1.1 301 Moved Permanently
# Location: https://new-domain.com
```

### Step 5: Update External References

- **Farcaster Registry**: Re-register manifest at new domain
- **Documentation**: Update all docs with new domain
- **Social Media**: Update links in bios, pinned posts
- **Embedded Links**: Update any hardcoded URLs

### Step 6: Monitor Transition

**Week 1:**
- Monitor traffic on both domains
- Check for any redirect loops
- Verify Farcaster clients recognize new domain

**Week 2-4:**
- Traffic should shift to new domain
- Old domain still serves redirects
- User installations should update

**After 1 Month:**
- Consider removing canonical domain if migration complete
- Keep old domain redirecting for another 6 months minimum

## Current Configuration

### Environment Variables

Your current setup:
- `NEXT_PUBLIC_APP_URL`: `https://y-six-dun.vercel.app`
- `NEXT_PUBLIC_CANONICAL_DOMAIN`: Not set (no migration)

### Manifest Configuration

Location: `minikit.config.ts`

```typescript
// Reads from environment variable
const CANONICAL_DOMAIN = process.env.NEXT_PUBLIC_CANONICAL_DOMAIN;

// Conditionally adds to manifest
miniapp: {
  ...
  ...(CANONICAL_DOMAIN && { canonicalDomain: CANONICAL_DOMAIN }),
}
```

### Middleware Configuration

Location: `src/middleware.ts`

**Behavior:**
- Checks for `NEXT_PUBLIC_CANONICAL_DOMAIN`
- If set, redirects all traffic to canonical domain
- Skips: API routes, manifest, static assets
- Uses 301 Permanent Redirect

**Protected Routes (No Redirect):**
- `/api/*` - API endpoints keep working
- `/.well-known/*` - Manifest stays accessible
- `/_next/*` - Next.js assets
- `/static/*` - Static files
- Images and SVGs

## Testing Migration

### Test in Development

```bash
# Set canonical domain locally
echo "NEXT_PUBLIC_CANONICAL_DOMAIN=localhost:3001" >> .env.local

# Run dev server on default port
npm run dev

# Access on port 3000 - should redirect to 3001
# (Note: localhost redirects may not work exactly like production)
```

### Test in Staging

1. Deploy to staging environment
2. Set `NEXT_PUBLIC_CANONICAL_DOMAIN` to staging domain
3. Test redirects work correctly
4. Verify manifest shows canonical domain
5. Test in Farcaster clients

### Test in Production

1. Create new domain deployment
2. Set canonical domain on OLD domain
3. Test old domain redirects to new
4. Verify Farcaster clients recognize migration
5. Monitor analytics

## Troubleshooting

### Redirect Loop

**Symptom**: Browser shows "Too many redirects"

**Solutions:**
- Ensure canonical domain matches exactly (case-sensitive)
- Check middleware isn't running on canonical domain itself
- Verify no conflicting redirects in Vercel config

### Manifest Not Updating

**Symptom**: Old domain manifest doesn't show canonicalDomain

**Solutions:**
- Verify environment variable is set correctly
- Redeploy application
- Check manifest endpoint directly: `/.well-known/farcaster.json`
- Clear CDN cache if using one

### Users Still on Old Domain

**This is normal!** Some users may take time to migrate:
- Clients cache manifest data
- Users may have bookmarks
- Browser caching
- DNS propagation

**Solution**: Keep old domain active with redirects for at least 6 months.

### Farcaster Not Recognizing New Domain

**Solutions:**
- Verify `canonicalDomain` format (no protocol/port/path)
- Re-register manifest with Farcaster
- Check account association matches on both domains
- Wait up to 24 hours for indexing

## Best Practices

### Before Migration

- ✅ Choose stable domain from the start
- ✅ Use neutral domain that survives rebrands
- ✅ Test thoroughly in staging
- ✅ Plan communication strategy

### During Migration

- ✅ Keep both domains active
- ✅ Monitor traffic and errors
- ✅ Communicate with users via casts
- ✅ Update all documentation
- ✅ Track successful redirects

### After Migration

- ✅ Keep old domain redirecting (6+ months)
- ✅ Monitor analytics for old domain traffic
- ✅ Eventually remove canonical domain setting
- ✅ Update all external references

## Example Migration Scenarios

### Scenario 1: Vercel Subdomain → Custom Domain

**Current**: `y-six-dun.vercel.app`
**New**: `farbasenft.com`

```bash
# In Vercel Dashboard:
# 1. Add custom domain farbasenft.com
# 2. Configure DNS
# 3. Set environment variable:
NEXT_PUBLIC_CANONICAL_DOMAIN=farbasenft.com

# 4. Redeploy
git push origin main
```

Both domains will work, with old domain redirecting to new.

### Scenario 2: Rebrand

**Current**: `oldname.com`
**New**: `newname.com`

```bash
# On OLD domain deployment:
NEXT_PUBLIC_CANONICAL_DOMAIN=newname.com

# On NEW domain deployment:
NEXT_PUBLIC_APP_URL=https://newname.com
# Don't set canonical domain on new domain
```

### Scenario 3: Subdomain Change

**Current**: `app.example.com`
**New**: `miniapp.example.com`

```bash
NEXT_PUBLIC_CANONICAL_DOMAIN=miniapp.example.com
```

## Rollback Procedure

If you need to rollback:

1. **Remove environment variable:**
   ```bash
   vercel env rm NEXT_PUBLIC_CANONICAL_DOMAIN production
   ```

2. **Redeploy:**
   ```bash
   git push origin main
   ```

3. **Verify:** Check manifest no longer shows canonicalDomain

4. **Communicate:** Let users know you're staying on current domain

## Monitoring Commands

### Check Canonical Domain Setting

```bash
curl https://y-six-dun.vercel.app/.well-known/farcaster.json | jq '.miniapp.canonicalDomain'
```

### Test Redirect

```bash
curl -L https://y-six-dun.vercel.app
# -L follows redirects
# Should eventually reach canonical domain
```

### Check Headers

```bash
curl -I https://y-six-dun.vercel.app
# Look for: Location: https://new-domain.com
# And: HTTP/1.1 301 Moved Permanently
```

## Environment Variable Reference

| Variable | Required | Example | Purpose |
|----------|----------|---------|---------|
| `NEXT_PUBLIC_APP_URL` | Yes | `https://y-six-dun.vercel.app` | Current domain |
| `NEXT_PUBLIC_CANONICAL_DOMAIN` | Optional | `farbasenft.com` | Migration target |

## Files Modified

- ✅ `minikit.config.ts` - Canonical domain support
- ✅ `src/middleware.ts` - Automatic redirects
- ✅ `DOMAIN_MIGRATION.md` - This guide

## Status

✅ **Implementation Complete**

Ready for domain migration when needed. Currently not migrating (no canonical domain set).

To migrate:
1. Set `NEXT_PUBLIC_CANONICAL_DOMAIN` environment variable
2. Deploy
3. Follow verification steps above

## Resources

- **Farcaster Guide**: https://miniapps.farcaster.xyz/docs/guides/domain-migration
- **Vercel Custom Domains**: https://vercel.com/docs/projects/domains
- **DNS Configuration**: https://vercel.com/docs/projects/domains/working-with-domains

---

**Note**: Domain migration is optional. Only use when you need to change domains. Your current domain `y-six-dun.vercel.app` works perfectly fine for Farcaster Mini Apps.
