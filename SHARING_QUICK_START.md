# 🚀 Quick Start - Farcaster Sharing Feature

## What's New ✨

Your app now has **shareable pages with rich embeds for Farcaster feeds**:

### Three New Pages
1. **`/nft/[id]`** - Individual NFT listings with embed preview
2. **`/collection/[id]`** - Collection views with embed preview  
3. **`/leaderboard`** - XP rankings with embed preview

### Two New Components
- **`ShareButton`** - Integrated button + modal
- **`ShareModal`** - Standalone modal component

### One New Utility
- **`embedMetadata.ts`** - Embed generation & validation

## ⚡ 5-Minute Local Test

```bash
# 1. Start dev server (Terminal 1)
cd c:\Users\om\farbasenft(4)\farbasenft\farbasenft
npm run dev
# Server ready at http://localhost:3000

# 2. Create tunnel (Terminal 2)
cloudflared tunnel --url http://localhost:3000
# Copy the https://xxxxx.trycloudflare.com URL

# 3. Test in Warpcast
# - Go to https://warpcast.com
# - Create new cast
# - Paste: https://xxxxx.trycloudflare.com/nft/chromatic-dreams
# - Rich embed should appear automatically
# - Click to test that it launches your app
```

## 📋 File Reference

| Path | What | Use Case |
|------|------|----------|
| `src/lib/embedMetadata.ts` | Embed utility | Core functionality |
| `src/app/nft/[id]/page.tsx` | NFT page | Share individual NFTs |
| `src/app/collection/[id]/page.tsx` | Collection page | Share collections |
| `src/app/leaderboard/page.tsx` | Leaderboard | Share rankings |
| `src/components/ShareButton.tsx` | Share components | Add sharing to any page |

## 🎯 How It Works

### 1. User Finds NFT
User browses marketplace, finds cool NFT

### 2. User Clicks Share
User clicks share button → Modal appears

### 3. User Copies Link
User copies link or message template

### 4. User Pastes in Warpcast
User creates cast, pastes link

### 5. Embed Appears
Rich preview appears showing:
- NFT image (3:2 aspect ratio)
- Price
- "Open in FarcastMints" button

### 6. Friend Clicks
Friend sees embed in feed, clicks button

### 7. App Launches
Friend lands on NFT page, continues using app

## 💻 Code Examples

### Use ShareButton
```typescript
import { ShareButton } from '@/components/ShareButton';

// In your page/component
<ShareButton
  title="Share NFT"
  description="Let your friends discover this NFT"
  shareUrl={`https://farbasenft.xyz/nft/${nftId}`}
  message={`Check out: ${nftName}\n${nftPrice} ETH`}
  variant="primary"
/>
```

### Use ShareModal
```typescript
import { ShareModal } from '@/components/ShareButton';
import { useState } from 'react';

export default function MyPage() {
  const [showShare, setShowShare] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowShare(true)}>Share</button>
      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        title="Share This"
        description="..."
        shareUrl="https://..."
        stats={[
          { label: 'Price', value: '1.25 ETH' }
        ]}
      />
    </>
  );
}
```

### Generate Embeds Manually
```typescript
import { generateNFTEmbedMeta } from '@/lib/embedMetadata';

const embedJson = generateNFTEmbedMeta(
  'My NFT',                          // name
  'https://image.png',               // image (3:2 aspect)
  '1.25',                            // price
  'My Collection',                   // collection
  'https://farbasenft.xyz/nft/123'  // detail URL
);

// Use in meta tag
// <meta name="fc:miniapp" content={embedJson} />
```

## ✅ Verification

Run these checks:

```bash
# 1. Pages load
curl http://localhost:3000/nft/chromatic-dreams -I
# Should return 200

# 2. Meta tags present
curl http://localhost:3000/nft/chromatic-dreams | grep "fc:miniapp"
# Should see JSON embed in output

# 3. No console errors
# Open Chrome DevTools → Console
# Should see no red errors

# 4. Share modal works
# Click share button on NFT page
# Modal should open with link to copy
```

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `npm run dev -- -p 3001` |
| Cloudflared fails | Install from https://github.com/cloudflare/cloudflared/releases |
| Embed not showing | Make sure image URL is public (not localhost) |
| Button not clickable | Check action URL is valid and < 1024 chars |
| Tunnel disconnects | Kill other tunnels: `cloudflared tunnel stop` |

## 📚 Detailed Docs

For full details, see:
- **`FARCASTER_SHARING_FEATURE_SUMMARY.md`** - Complete feature breakdown
- **`FARCASTER_SHARING_DEPLOYMENT.md`** - Testing & production deployment

## 🎯 Next Steps

1. **Test locally** (5 min) - Follow "5-Minute Local Test" above
2. **Verify in Warpcast** (10 min) - Test share in actual Warpcast
3. **Deploy to production** - When ready, follow deployment guide
4. **Get signature** - Visit https://farcaster.xyz/~/developers/mini-apps/manifest
5. **Register manifest** - Submit to Farcaster team for approval

## 📊 What Gets Shared

When user shares, Warpcast shows:

```
┌─────────────────────────────┐
│   [NFT Image - 3:2 ratio]   │
├─────────────────────────────┤
│ 🎨 Chromatic Dreams         │
│ Price: 1.25 ETH             │
│ [Open in FarcastMints] →    │
└─────────────────────────────┘
```

Each page type shows relevant info:
- **NFT**: Image, name, price, "Open NFT"
- **Collection**: Image, name, floor price, "Browse Collection"
- **Leaderboard**: Standings image, title, "View Rankings"

## 💡 Pro Tips

✅ **For Engagement**:
- Use high-quality images (PNG recommended)
- Keep button text short (≤ 32 chars)
- Make CTAs clear and compelling

✅ **For Testing**:
- Use Warpcast Embed Tool: https://warpcast.com/~/developers/frames
- Test desktop AND mobile
- Verify all share buttons work

✅ **For Production**:
- Ensure HTTPS URLs (required for Farcaster)
- Cache embeds where possible
- Monitor share analytics

## 🆘 Need Help?

Check these resources:
- Farcaster Docs: https://miniapps.farcaster.xyz/docs
- Sharing Guide: https://miniapps.farcaster.xyz/docs/guides/sharing
- Embed Spec: https://miniapps.farcaster.xyz/docs/api/farcaster-embed
- Warpcast: https://warpcast.com/~/developers/frames

---

**Status**: ✅ Ready to test and deploy!

**Last Updated**: 2024
**Version**: 1.0 Complete
