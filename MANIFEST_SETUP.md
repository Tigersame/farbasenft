# Base Mini App Manifest Setup Guide

## Overview

Your manifest file is served at `/.well-known/farcaster.json` and defines how your mini app appears in Base app search, discovery, and embeds.

## Current Configuration

Your manifest is dynamically generated from `minikit.config.ts` and served via the API route at `/api/.well-known/farcaster.json`.

## Required Fields

### ✅ Identity & Launch
- `version`: "1" ✅
- `name`: "farbasenft" (9 chars, max 32) ✅
- `homeUrl`: Configured ✅
- `iconUrl`: Configured ✅

### ✅ Loading Experience
- `splashImageUrl`: Configured ✅
- `splashBackgroundColor`: "#030712" ✅

### ✅ Discovery & Search
- `primaryCategory`: "art" ✅
- `tags`: ["nft", "auctions", "art", "foundation-clone"] ✅
- `noindex`: Set based on NODE_ENV ✅

### ⚠️ Account Association
- `header`: Needs to be generated via Base Build tool
- `payload`: Needs to be generated via Base Build tool
- `signature`: Needs to be generated via Base Build tool

### 📝 Optional Fields
- `subtitle`: "Discover digital art reimagined" (30 chars) ✅
- `description`: Current length needs verification
- `tagline`: "Where onchain curators meet collectors." (38 chars - needs to be ≤ 30)
- `heroImageUrl`: Configured ✅
- `screenshotUrls`: Configured ✅
- `webhookUrl`: Configured ✅
- `ogTitle`: "farbasenft" (9 chars, max 30) ✅
- `ogDescription`: Needs verification (max 100 chars)
- `ogImageUrl`: Configured ✅

## Field Requirements

### Character Limits
- `name`: Max 32 chars ✅
- `subtitle`: Max 30 chars ✅
- `description`: Max 170 chars
- `tagline`: Max 30 chars ⚠️ (currently 38)
- `ogTitle`: Max 30 chars ✅
- `ogDescription`: Max 100 chars
- `tags`: Max 5 tags, each max 20 chars, lowercase, no spaces ✅

### Image Requirements
- `iconUrl`: 1024×1024px PNG, no transparency
- `splashImageUrl`: Recommended 200×200px
- `heroImageUrl`: 1200×630px (1.91:1)
- `screenshotUrls`: Max 3, portrait 1284×2778px recommended
- `ogImageUrl`: 1200×630px (1.91:1)

## Setup Steps

### 1. Generate Account Association

1. Navigate to [Base Build Account Association Tool](https://www.base.dev/preview?tab=account)
2. Paste your domain in the App URL field
3. Click "Submit"
4. Click "Verify" and sign with your wallet
5. Copy the generated `accountAssociation` fields
6. Add them to your `.env.local`:
   ```env
   FARCASTER_PAYLOAD=your_payload_here
   FARCASTER_SIGNATURE=your_signature_here
   ```

### 2. Add baseBuilder (Optional)

If you're using Base Build, add your owner address:
```json
{
  "baseBuilder": {
    "ownerAddress": "0x..."
  }
}
```

### 3. Verify Field Lengths

Check all text fields meet character limits:
- `tagline`: Currently 38 chars, needs to be ≤ 30
- `description`: Verify ≤ 170 chars
- `ogDescription`: Verify ≤ 100 chars

### 4. Deploy and Verify

1. Deploy your app
2. Verify manifest is accessible at: `https://your-domain.com/.well-known/farcaster.json`
3. Test in Base app

## Current Status

### ✅ Fixed
1. ✅ `tagline`: "Curators meet collectors" (25 chars, max 30)
2. ✅ `description`: 103 chars (max 170)
3. ✅ `ogDescription`: 70 chars (max 100)
4. ✅ `subtitle`: 30 chars (max 30)
5. ✅ `name`: 9 chars (max 32)
6. ✅ `ogTitle`: 9 chars (max 30)
7. ✅ `tags`: All lowercase, no spaces, valid format

### ⚠️ Still Needed
1. ⚠️ `accountAssociation` fields need to be generated via Base Build tool
2. ⚠️ `baseBuilder.ownerAddress` (optional) - add if using Base Build

## References

- [Base Mini App Manifest Documentation](https://docs.base.org/mini-apps/core-concepts/manifest)
- [Base Build Account Association Tool](https://www.base.dev/preview?tab=account)
- [Mini App Assets Generator](https://www.miniappassets.com/)

