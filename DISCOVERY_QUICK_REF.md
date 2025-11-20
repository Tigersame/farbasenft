# Farcaster Discovery - Quick Reference

## 🚀 Deploy & Register in 5 Steps

### 1. Deploy Code
```bash
git add .
git commit -m "feat: Farcaster discovery optimization"
git push origin main
```
Wait for Vercel deployment to complete.

### 2. Test Manifest
```bash
curl https://y-six-dun.vercel.app/.well-known/farcaster.json
```
Should return valid JSON with name, iconUrl, homeUrl, description.

### 3. Register Manifest
- Visit: https://farcaster.xyz/~/developers/mini-apps/manifest
- Enter: `https://y-six-dun.vercel.app`
- Look for green checkbox ✅
- Submit

### 4. Wait for Indexing
- Allow 24-48 hours
- Manifest refreshes daily

### 5. Verify in Search
- Visit: https://farcaster.xyz
- Search: "farbasenft"
- App should appear with icon

---

## ✅ What Was Implemented

### Manifest (`minikit.config.ts`)
- ✅ Detailed description (explains what app does)
- ✅ Better tags: marketplace, blockchain, base, collectibles
- ✅ `noindex: false` (allows indexing)
- ✅ SEO-optimized OG tags

### SEO (`layout.tsx`)
- ✅ Title template
- ✅ Meta description (150-160 chars)
- ✅ Keywords array
- ✅ Enhanced Open Graph
- ✅ Twitter Cards
- ✅ Robots meta

### New Routes
- ✅ `/robots.txt` - SEO robots file
- ✅ `/sitemap.xml` - XML sitemap

---

## 📋 Required Fields (All Present)

| Field | Value | Status |
|-------|-------|--------|
| `name` | farbasenft | ✅ |
| `iconUrl` | /icon.svg | ✅ |
| `homeUrl` | y-six-dun.vercel.app | ✅ |
| `description` | Detailed explanation | ✅ |
| `noindex` | false | ✅ |

---

## 🔍 Search Ranking Factors

1. **Opens** - Users who opened app
2. **Adds** - Users who added to collection (HIGH IMPACT)
3. **Trending** - Recent engagement
4. **Quality** - Working images, complete manifest

---

## 🎯 Boost Your Ranking

### Immediate Actions
- Share app on Farcaster
- Post about features
- Ask users to add app

### Retention Features (Already Implemented)
- ✅ Daily login XP
- ✅ Gamification
- ✅ Leaderboards
- ✅ Rewards system

### Quality Checks
- ✅ Fast load times
- ✅ Mobile-optimized
- ✅ Working images
- ✅ Production domain

---

## ⚠️ Common Issues

### Not Showing in Search?
- Check `noindex: false` in manifest
- Verify all images load (HTTP 200)
- Confirm production domain (not localhost)
- Wait full 24 hours

### Images Not Loading?
- Test URLs directly in browser
- Check content-type headers
- Verify files in `public/` directory

### Low Ranking?
- Encourage "add to collection"
- Maintain daily usage
- Keep manifest updated

---

## 📊 Success Metrics

After 1 week, check:
- [ ] App appears in search
- [ ] Icon displays correctly
- [ ] Users can open app
- [ ] Appears in directory

Track:
- Opens per day
- Adds to collection
- User retention
- Search ranking

---

## 🔗 Quick Links

- **Manifest Tool**: https://farcaster.xyz/~/developers/mini-apps/manifest
- **Directory**: https://farcaster.xyz/miniapps
- **Dashboard**: https://farcaster.xyz/~/developers
- **Your App**: https://y-six-dun.vercel.app

---

## 📖 Full Documentation

- `DISCOVERY_IMPLEMENTATION.md` - Technical details
- `DISCOVERY_CHECKLIST.md` - Step-by-step guide
- `DISCOVERY_COMPLETE.md` - Full summary

---

**Status**: ✅ Ready to Deploy
**Next Step**: Push to GitHub → Register Manifest → Wait 24h
