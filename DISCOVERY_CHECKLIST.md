# Farcaster Discovery - Deployment Checklist

## Pre-Deployment Verification

- [ ] All code changes committed to git
- [ ] Build passes locally (`npm run build`)
- [ ] Environment variables set in Vercel:
  - [ ] `NEXT_PUBLIC_APP_URL=https://y-six-dun.vercel.app`

## Deployment

- [ ] Push to GitHub main branch
- [ ] Verify Vercel deployment completes
- [ ] Check production URL is live

## Post-Deployment Verification

### 1. Test Manifest Endpoint

Visit in browser or curl:
```
https://y-six-dun.vercel.app/.well-known/farcaster.json
```

Should return JSON with:
- ✅ `name`: "farbasenft"
- ✅ `iconUrl`: Full URL to icon
- ✅ `homeUrl`: "https://y-six-dun.vercel.app"
- ✅ `description`: Detailed description
- ✅ `noindex`: false (or not present)

### 2. Test Image URLs

Check these URLs load correctly:
- [ ] https://y-six-dun.vercel.app/icon.svg
- [ ] https://y-six-dun.vercel.app/hero.svg
- [ ] https://y-six-dun.vercel.app/splash.svg
- [ ] https://y-six-dun.vercel.app/favicon.svg

All should:
- Return HTTP 200
- Have content-type: image/svg+xml
- Display actual image content

### 3. Test SEO Files

- [ ] https://y-six-dun.vercel.app/robots.txt
- [ ] https://y-six-dun.vercel.app/sitemap.xml

Both should return proper content.

### 4. Test Meta Tags

View page source at https://y-six-dun.vercel.app and verify:
- [ ] `<title>` tag present
- [ ] `<meta name="description">` present
- [ ] Open Graph tags present (`og:title`, `og:description`, `og:image`)
- [ ] Twitter card tags present
- [ ] `fc:miniapp` meta tag present

## Manifest Registration

### Step 1: Access Manifest Tool

Visit: https://farcaster.xyz/~/developers/mini-apps/manifest

### Step 2: Enter App URL

- [ ] Enter: `https://y-six-dun.vercel.app`
- [ ] Click "Load Manifest" or similar button

### Step 3: Verify Manifest Loads

Check that tool shows:
- [ ] App name displays correctly
- [ ] Icon image loads
- [ ] Description appears
- [ ] All required fields populated

### Step 4: Check Account Association

Look for:
- [ ] **Green checkbox** ✅ indicating account association verified
- [ ] Your Farcaster username shown as owner

If no green checkbox:
- Account association may need to be set up
- See: https://miniapps.farcaster.xyz/docs/guides/publishing

### Step 5: Submit Registration

- [ ] Click "Register" or "Submit" button
- [ ] Confirm any prompts
- [ ] Note any error messages

## Post-Registration

### Wait for Indexing

- [ ] Allow 24-48 hours for initial indexing
- [ ] Manifest refreshes daily automatically

### Verify in Search

After 24-48 hours:

1. Visit https://farcaster.xyz
2. Use search bar
3. Search for "farbasenft"
4. Check if app appears in results

### Monitor Developer Dashboard

- [ ] Visit https://farcaster.xyz/~/developers
- [ ] Check app appears in your apps list
- [ ] Review any status messages

## Troubleshooting

### App Not Indexing?

Check:
- [ ] Manifest endpoint returns valid JSON
- [ ] All image URLs work (200 status)
- [ ] Images return proper content-type headers
- [ ] Domain is production (not localhost/ngrok)
- [ ] `noindex` is false or not present
- [ ] Account association verified (green checkbox)

### Images Not Loading?

Check:
- [ ] Files exist in `public/` directory
- [ ] File names match URLs in manifest
- [ ] CORS headers allow access
- [ ] CDN/hosting serving files correctly

### Still Having Issues?

1. Re-check manifest at https://farcaster.xyz/~/developers/mini-apps/manifest
2. Verify all required fields present
3. Check browser console for errors
4. Wait full 24 hours for reindexing
5. Reach out to Farcaster support if needed

## Success Indicators

You'll know it worked when:

- ✅ App appears in search results
- ✅ Icon displays in search
- ✅ Description shows correctly
- ✅ Users can click to open app
- ✅ App appears in directory: https://farcaster.xyz/miniapps

## Optimization (After Indexing)

Once indexed, improve ranking by:

1. **Drive Engagement**
   - Share app on Farcaster
   - Post about features
   - Encourage usage

2. **Get Users to Add**
   - Ask users to add app to collection
   - This heavily impacts ranking

3. **Maintain Activity**
   - Keep users coming back
   - Daily login rewards help (already implemented)
   - Regular updates and new features

4. **Quality Experience**
   - Fix bugs quickly
   - Keep load times fast
   - Mobile-optimize everything

## Timeline

- **Day 0**: Deploy + Register manifest
- **Day 1**: Wait for indexing
- **Day 2**: Check search results
- **Week 1**: Monitor engagement
- **Week 2+**: Optimize based on metrics

## Resources

- Manifest Tool: https://farcaster.xyz/~/developers/mini-apps/manifest
- Directory: https://farcaster.xyz/miniapps
- Developer Dashboard: https://farcaster.xyz/~/developers
- Discovery Guide: https://miniapps.farcaster.xyz/docs/guides/discovery

## Status Tracking

Current Status: [ ] Not Deployed | [ ] Deployed | [ ] Registered | [ ] Indexed | [✅] Live in Search

Date Deployed: ___________
Date Registered: ___________
Date First Appeared in Search: ___________

Notes:
```
[Add any notes about the process here]
```
