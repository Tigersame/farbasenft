# Farcaster Notifications Quick Reference

Quick reference for implementing and using push notifications in farbasenft Mini App.

## 📚 Full Documentation
See [NOTIFICATIONS_IMPLEMENTATION.md](./NOTIFICATIONS_IMPLEMENTATION.md) for complete implementation details.

## 🎯 Overview
- **When enabled**: Users add your Mini App → Farcaster stores notification token
- **Rate limits**: 1 notification per 30 seconds, 100 per day per user
- **Batch limit**: Up to 100 tokens per API request
- **Character limits**: Title (32), Body (128), Notification ID (128)

## 🚀 Quick Start

### 1. Add UI Component for Opt-In
```tsx
import { NotificationPrompt, NotificationStatus } from "@/components/NotificationPrompt";

export default function Page() {
  return (
    <div>
      <NotificationStatus />
      <NotificationPrompt />
    </div>
  );
}
```

### 2. Send Notification (Server-Side)
```typescript
import { sendMiniAppNotification } from "@/lib/notifications";

// Send to single user
await sendMiniAppNotification({
  fid: 12345,
  appFid: 67890,
  notificationId: "nft-drop-2025-11-20", // Optional: prevents duplicates
  title: "New NFT Drop!",
  body: "Check out the latest collection",
  targetUrl: "https://y-six-dun.vercel.app/gallery",
});
```

### 3. Batch Send via API
```bash
# Send to specific users
curl -X POST https://y-six-dun.vercel.app/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "tokens": [
      {"token": "...", "url": "https://...", "fid": 123, "appFid": 456},
      {"token": "...", "url": "https://...", "fid": 789, "appFid": 456}
    ],
    "notificationId": "daily-bonus-2025-11-20",
    "title": "Daily Bonus!",
    "body": "Claim your 50 XP reward",
    "targetUrl": "https://y-six-dun.vercel.app"
  }'

# Broadcast to all users
curl -X POST https://y-six-dun.vercel.app/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "broadcast": true,
    "notificationId": "auction-ending-soon",
    "title": "Auction Ending!",
    "body": "Your auction ends in 5 minutes",
    "targetUrl": "https://y-six-dun.vercel.app/gallery"
  }'
```

## 📊 API Endpoints

### POST /api/notifications/send
Send notifications to users.

**Single User:**
```json
{
  "fid": 12345,
  "appFid": 67890,
  "title": "Hello!",
  "body": "This is a notification",
  "targetUrl": "https://y-six-dun.vercel.app",
  "notificationId": "optional-stable-id"
}
```

**Batch (Specific Users):**
```json
{
  "tokens": [
    {"token": "...", "url": "...", "fid": 123, "appFid": 456}
  ],
  "title": "Hello All!",
  "body": "Batch notification",
  "targetUrl": "https://y-six-dun.vercel.app",
  "notificationId": "batch-2025-11-20"
}
```

**Broadcast (All Users):**
```json
{
  "broadcast": true,
  "title": "Announcement",
  "body": "System maintenance in 1 hour",
  "targetUrl": "https://y-six-dun.vercel.app",
  "notificationId": "maintenance-2025-11-20"
}
```

### GET /api/notifications/send
Get notification statistics.

**Response:**
```json
{
  "totalUsers": 42,
  "tokens": [
    {"fid": 123, "appFid": 456, "hasToken": true},
    {"fid": 789, "appFid": 456, "hasToken": false}
  ]
}
```

## 🎨 Use Cases

### NFT Drop Notifications
```typescript
// When new NFT is minted
await sendMiniAppNotification({
  fid: creatorFid,
  appFid: process.env.NEXT_PUBLIC_APP_FID!,
  notificationId: `nft-drop-${tokenId}`,
  title: "NFT Minted!",
  body: "Your NFT is now live",
  targetUrl: `https://y-six-dun.vercel.app/nft/${tokenId}`,
});
```

### XP Milestones
```typescript
// When user reaches level milestone
const level = Math.floor(Math.sqrt(totalXP / 100));
if (level % 5 === 0) { // Every 5 levels
  await sendMiniAppNotification({
    fid: userFid,
    appFid: process.env.NEXT_PUBLIC_APP_FID!,
    notificationId: `level-${level}-${userFid}`,
    title: `Level ${level} Reached!`,
    body: `You've unlocked new perks`,
    targetUrl: "https://y-six-dun.vercel.app/leaderboard",
  });
}
```

### Daily Login Reminder
```typescript
// Broadcast to all users
await fetch("https://y-six-dun.vercel.app/api/notifications/send", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    broadcast: true,
    notificationId: `daily-${new Date().toISOString().split('T')[0]}`,
    title: "Daily Login Bonus!",
    body: "Claim your 50 XP reward",
    targetUrl: "https://y-six-dun.vercel.app",
  }),
});
```

## 🔧 Server Functions

### sendMiniAppNotification()
Send to single user.

```typescript
import { sendMiniAppNotification } from "@/lib/notifications";

const result = await sendMiniAppNotification({
  fid: 12345,
  appFid: 67890,
  notificationId: "optional-id", // Optional: prevents duplicates for 24h
  title: "Hello!",
  body: "This is a message",
  targetUrl: "https://y-six-dun.vercel.app",
});

// Returns: { success: true, error?: "rate_limit" | "no_token" | string }
```

### sendBatchNotifications()
Send to multiple users (up to 100 per request).

```typescript
import { sendBatchNotifications } from "@/lib/notifications";

const result = await sendBatchNotifications({
  notificationId: "batch-2025-11-20",
  title: "Group Message",
  body: "Hello everyone!",
  targetUrl: "https://y-six-dun.vercel.app",
  tokens: [
    { token: "...", url: "...", fid: 123, appFid: 456 },
    { token: "...", url: "...", fid: 789, appFid: 456 },
  ],
});

// Returns: { successful: 2, failed: 0, rateLimited: 0, invalidated: 0 }
```

### getAllNotificationTokens()
Get all registered tokens.

```typescript
import { getAllNotificationTokens } from "@/lib/notifications";

const tokens = getAllNotificationTokens();
// Returns: Array<{ fid, appFid, details: { token, url } }>
```

## ⚠️ Constraints

| Limit | Value | Notes |
|-------|-------|-------|
| **Rate per user** | 1 per 30 seconds | Per notification token |
| **Daily limit** | 100 per day | Per user token |
| **Batch size** | 100 tokens | Per API request |
| **Notification ID** | 128 characters | Optional stable ID |
| **Title** | 32 characters | Auto-truncated with "..." |
| **Body** | 128 characters | Auto-truncated with "..." |
| **Target URL** | 1024 characters | Deep link destination |

## 🧪 Testing

### Development
```bash
# Webhook signature verification bypassed in dev mode
# Test in Warpcast using production deployment
```

### Production Testing
1. Open app in Warpcast: `https://warpcast.com/~/miniapp?url=https://y-six-dun.vercel.app`
2. Click "Add Mini App" button in NotificationPrompt component
3. Verify webhook receives `miniapp_added` and `notifications_enabled` events
4. Send test notification via API or server function
5. Check notification appears in Farcaster feed

### Quick Test Notification
```bash
# Get your FID and APP_FID first
curl -X POST https://y-six-dun.vercel.app/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "fid": YOUR_FID,
    "appFid": YOUR_APP_FID,
    "title": "Test",
    "body": "Testing notifications",
    "targetUrl": "https://y-six-dun.vercel.app"
  }'
```

## 🔑 Environment Variables

```bash
# Required for webhook signature verification
NEYNAR_API_KEY=your_neynar_api_key

# Required for manifest generation
NEXT_PUBLIC_APP_URL=https://y-six-dun.vercel.app
NEXT_PUBLIC_APP_FID=your_app_fid
```

## 📁 Key Files

- **Components**: `src/components/NotificationPrompt.tsx` - UI for opt-in
- **Server Logic**: `src/lib/notifications.ts` - Send and store tokens
- **API**: `src/app/api/notifications/send/route.ts` - HTTP endpoint
- **Webhook**: `src/app/api/webhook/route.ts` - Receives token events
- **Config**: `minikit.config.ts` - Webhook URL in manifest

## 🐛 Troubleshooting

### "Feature only works in Farcaster Mini Apps"
- Only works in production domain (not ngrok/dev tunnels)
- Test at: `https://warpcast.com/~/miniapp?url=https://y-six-dun.vercel.app`

### Notification not received
1. Check user has added the Mini App (`NotificationStatus` shows enabled)
2. Verify rate limits not exceeded (1 per 30s, 100 per day)
3. Check webhook logs for `notifications_enabled` event
4. Verify `NEYNAR_API_KEY` is set in environment
5. Use stable `notificationId` to prevent duplicates

### Webhook signature verification failed
- Ensure `NEYNAR_API_KEY` is set correctly
- Check webhook URL matches manifest: `https://y-six-dun.vercel.app/api/webhook`
- Verify payload is parsed correctly with `parseWebhookEvent()`

### Invalid token error
- Token automatically removed from storage
- User needs to add Mini App again
- Check `notificationStore` has entries: `GET /api/notifications/send`

## 🚀 Production Checklist

- [ ] `NEYNAR_API_KEY` set in Vercel environment
- [ ] Webhook URL in manifest: `https://y-six-dun.vercel.app/api/webhook`
- [ ] NotificationPrompt component added to UI
- [ ] Test notification sending in production
- [ ] Rate limiting respected (1/30s, 100/day)
- [ ] Character limits enforced (title 32, body 128)
- [ ] Stable notification IDs for deduplication
- [ ] Error handling for `no_token` and `rate_limit`
- [ ] Consider database migration for scale (see NOTIFICATIONS_IMPLEMENTATION.md)

## 📖 Resources

- [Official Guide](https://miniapps.farcaster.xyz/docs/guides/notifications)
- [Full Implementation](./NOTIFICATIONS_IMPLEMENTATION.md)
- [API Reference](https://miniapps.farcaster.xyz/docs/api/send-notification)
- [Webhook Events](https://miniapps.farcaster.xyz/docs/api/webhook-events)

---

**Need more details?** See [NOTIFICATIONS_IMPLEMENTATION.md](./NOTIFICATIONS_IMPLEMENTATION.md) for complete architecture, database migration guides, and advanced patterns.
