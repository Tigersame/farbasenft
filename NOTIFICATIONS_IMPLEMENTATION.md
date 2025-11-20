# Notifications Implementation Guide

## Overview

farbasenft implements Farcaster Mini App push notifications, allowing the app to send timely updates to users about NFT drops, auction results, XP rewards, and more.

Reference: https://miniapps.farcaster.xyz/docs/guides/notifications

## Implementation Status

✅ **Fully Implemented:**
- Webhook endpoint for receiving events
- Notification token storage (in-memory)
- Single user notifications
- Batch notifications (up to 100 users)
- Broadcast to all users
- Rate limit handling
- Invalid token cleanup
- UI components for opt-in

## How It Works

### 1. User Enables Notifications

When a user enables notifications:
1. User clicks "Enable Notifications" in app
2. `sdk.actions.addMiniApp()` shows native prompt
3. User adds app to their collection
4. Farcaster generates unique notification token
5. Token sent to our webhook endpoint
6. We store token in database

### 2. Sending Notifications

When app wants to notify a user:
1. Lookup user's notification token
2. Call Farcaster notification API
3. User receives push notification
4. Clicking opens app at specified URL

### 3. User Disables Notifications

When user disables:
1. Farcaster sends webhook event
2. We delete stored token
3. Future notification attempts fail gracefully

## Architecture

```
User Device → Farcaster Client (Warpcast)
                    ↓
              Generates Token
                    ↓
       POST /api/webhook (miniapp_added)
                    ↓
          Store token in database
                    ↓
     [Later] App sends notification
                    ↓
    POST to Farcaster Notification API
                    ↓
          User receives notification
                    ↓
     User clicks → Opens app at targetUrl
```

## Files Implemented

### 1. Webhook Handler
**File**: `src/app/api/webhook/route.ts`

Handles events:
- `miniapp_added` - User adds app
- `miniapp_removed` - User removes app
- `notifications_enabled` - User enables notifications
- `notifications_disabled` - User disables notifications

```typescript
// Already implemented - verifies signatures, stores tokens
await parseWebhookEvent(requestJson, verifyAppKeyWithNeynar);
```

### 2. Notification Library
**File**: `src/lib/notifications.ts`

Functions:
- `saveUserNotificationDetails()` - Store token
- `getUserNotificationDetails()` - Retrieve token
- `deleteUserNotificationDetails()` - Remove token
- `getAllNotificationTokens()` - Get all tokens
- `sendMiniAppNotification()` - Send to one user
- `sendBatchNotifications()` - Send to multiple users

### 3. UI Components
**File**: `src/components/NotificationPrompt.tsx`

Components:
- `<NotificationPrompt />` - Opt-in UI with button
- `<NotificationStatus />` - Shows enabled/disabled state

### 4. API Endpoint
**File**: `src/app/api/notifications/send/route.ts`

**POST** - Send notifications:
- Single user: `{ fid, appFid, title, body }`
- Broadcast: `{ broadcast: true, title, body }`
- Batch: `{ tokens: [...], title, body }`

**GET** - Get statistics:
- Total users with notifications
- Token status per user

## Usage Examples

### 1. Add Notification Prompt to Page

```tsx
import { NotificationPrompt } from "@/components/NotificationPrompt";

export default function Page() {
  return (
    <div>
      <NotificationPrompt />
    </div>
  );
}
```

### 2. Send Notification to Single User

```typescript
import { sendMiniAppNotification } from "@/lib/notifications";

await sendMiniAppNotification({
  fid: 12345,
  appFid: 309857, // Base app FID
  title: "New NFT Drop!",
  body: "Check out the latest collection by Artist Name",
  targetUrl: "https://y-six-dun.vercel.app/gallery",
  notificationId: "drop-2025-11-20", // Optional stable ID
});
```

### 3. Broadcast to All Users

```typescript
import { getAllNotificationTokens, sendBatchNotifications } from "@/lib/notifications";

const allTokens = await getAllNotificationTokens();

await sendBatchNotifications({
  notificationId: "daily-reminder-2025-11-20",
  title: "Daily Login Bonus!",
  body: "Claim your 50 XP daily reward",
  targetUrl: "https://y-six-dun.vercel.app",
  tokens: allTokens.map(t => ({
    token: t.details.token,
    url: t.details.url,
    fid: t.fid,
    appFid: t.appFid,
  })),
});
```

### 4. Via API Endpoint

```bash
# Send to single user
curl -X POST https://y-six-dun.vercel.app/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "fid": 12345,
    "appFid": 309857,
    "title": "New Achievement!",
    "body": "You unlocked the Collector badge"
  }'

# Broadcast to all users
curl -X POST https://y-six-dun.vercel.app/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "broadcast": true,
    "title": "System Update",
    "body": "New features available now",
    "notificationId": "update-2025-11-20"
  }'
```

## Notification Use Cases

### NFT Related
1. **New Drop**: "Artist X just dropped new collection"
2. **Auction Won**: "Congratulations! You won the auction"
3. **Auction Outbid**: "You've been outbid on NFT #123"
4. **Listing Sold**: "Your NFT sold for 0.5 ETH"
5. **Price Change**: "NFT you're watching dropped 20%"

### XP & Rewards
1. **Daily Login**: "Claim your 50 XP daily bonus"
2. **Level Up**: "You reached Level 5!"
3. **Achievement**: "New badge unlocked: Master Collector"
4. **SBT Available**: "You can now claim your SBT"
5. **Leaderboard**: "You're now in the top 10!"

### Social
1. **New Follower**: "User X started following you"
2. **Comment**: "New comment on your NFT"
3. **Mention**: "You were mentioned in a cast"
4. **Share**: "Your NFT was shared 10 times"

### System
1. **Maintenance**: "App will be down for 10 minutes"
2. **New Features**: "Swap portal now live"
3. **Security**: "New login detected"

## Constraints & Limits

### Character Limits
- `notificationId`: Max 128 characters
- `title`: Max 32 characters
- `body`: Max 128 characters
- `targetUrl`: Max 1024 characters

### Rate Limits (per user/token)
- **1 notification per 30 seconds**
- **100 notifications per day**

### Batch Limits
- Max 100 tokens per request
- Can send multiple batches

### Domain Restrictions
- `targetUrl` must be on same domain as Mini App
- Example: If app is `y-six-dun.vercel.app`, targetUrl must start with that

## Deduplication

Use stable `notificationId` to prevent duplicate notifications within 24 hours:

```typescript
// Same ID = deduplicated within 24h
notificationId: "daily-reminder-2025-11-20"

// Different IDs = both sent
notificationId: crypto.randomUUID()
```

## Error Handling

### No Token Available
```typescript
const result = await sendMiniAppNotification({...});
if (result.state === "no_token") {
  console.log("User hasn't enabled notifications");
}
```

### Rate Limited
```typescript
if (result.state === "rate_limit") {
  console.log("Too many notifications, try again later");
}
```

### Invalid Token
- Automatically deleted from storage
- User needs to re-enable notifications

## Testing

### 1. Test in Development

```bash
# Webhook endpoint accepts events
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"event": "miniapp_added", ...}'
```

Note: Signature verification will fail in dev. For testing, temporarily comment out verification.

### 2. Test in Production

1. Deploy app to production
2. Open in Farcaster (Warpcast)
3. Click "Enable Notifications"
4. Check server logs for webhook event
5. Send test notification via API

### 3. Test Notification Content

Before sending to users, test content:
- Title fits in 32 chars
- Body is clear in 128 chars
- targetUrl is correct
- Opens right page in app

## Storage

### Current: In-Memory
**Pros**: Simple, fast
**Cons**: Lost on restart

```typescript
const notificationStore = new Map<string, NotificationDetails>();
```

### Production: Database Required

Replace in-memory storage with:

**PostgreSQL**:
```sql
CREATE TABLE notification_tokens (
  fid INTEGER NOT NULL,
  app_fid INTEGER NOT NULL,
  token TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (fid, app_fid)
);
```

**MongoDB**:
```javascript
{
  fid: Number,
  appFid: Number,
  token: String,
  url: String,
  createdAt: Date
}
```

**Redis**:
```
SET notif:${fid}:${appFid} ${JSON.stringify({token, url})}
```

## Monitoring

### Track Metrics

1. **Opt-in Rate**: % of users enabling notifications
2. **Delivery Success**: % of notifications delivered
3. **Click-through Rate**: % of users clicking notifications
4. **Opt-out Rate**: % of users disabling

### Log Important Events

```typescript
console.log("[Notifications] User ${fid} enabled notifications");
console.log("[Notifications] Sent ${count} notifications");
console.log("[Notifications] ${invalidCount} tokens invalidated");
console.log("[Notifications] ${rateLimitCount} rate limited");
```

## Best Practices

### 1. Be Respectful
- Don't spam users
- Send valuable notifications only
- Respect rate limits
- Allow easy opt-out

### 2. Timing
- Consider user timezones
- Avoid late night notifications
- Batch related notifications
- Use stable IDs for daily notifications

### 3. Content
- Clear, concise titles
- Action-oriented body text
- Relevant targetUrl
- Test before sending to all

### 4. Handling Failures
- Gracefully handle no token
- Retry rate-limited notifications
- Clean up invalid tokens
- Log errors for debugging

## Security

### Webhook Verification

Always verify webhook signatures:

```typescript
// Uses @farcaster/miniapp-node
const data = await parseWebhookEvent(
  requestJson, 
  verifyAppKeyWithNeynar
);
```

### Token Storage

- Never expose tokens to client
- Store securely server-side
- Encrypt at rest in production
- Use HTTPS for all requests

### API Authentication

Consider adding authentication to `/api/notifications/send`:

```typescript
// Check API key or admin session
if (request.headers.get("Authorization") !== `Bearer ${process.env.ADMIN_API_KEY}`) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

## Troubleshooting

### Notifications Not Sending

**Check**:
1. User has added app (check webhook logs)
2. Token exists in storage
3. targetUrl is on correct domain
4. Not rate limited
5. Notification format is valid

### Webhook Not Receiving Events

**Check**:
1. `webhookUrl` in manifest is correct
2. Endpoint returns 200 status
3. SSL certificate is valid
4. Signature verification working
5. Server accessible from internet

### Users Not Getting Prompted

**Check**:
1. `sdk.actions.addMiniApp()` only works in production
2. User is in Farcaster Mini App context
3. App manifest is properly registered
4. Using correct production domain

## Next Steps

### Phase 1: Current (Complete)
- ✅ Basic notification infrastructure
- ✅ Webhook handling
- ✅ Single & batch sending
- ✅ UI components

### Phase 2: Enhancements
- [ ] Migrate to persistent database
- [ ] Add notification templates
- [ ] Schedule notifications
- [ ] A/B test notification content

### Phase 3: Advanced
- [ ] User notification preferences
- [ ] Notification categories
- [ ] Analytics dashboard
- [ ] Smart send timing

## Environment Variables

Required:
```bash
NEXT_PUBLIC_APP_URL=https://y-six-dun.vercel.app
NEYNAR_API_KEY=your_neynar_api_key
```

Optional:
```bash
ADMIN_API_KEY=your_secret_key  # For API authentication
```

## Resources

- **Farcaster Guide**: https://miniapps.farcaster.xyz/docs/guides/notifications
- **Webhook Events**: https://miniapps.farcaster.xyz/docs/specification#webhooks
- **Demo App**: https://github.com/farcasterxyz/frames-v2-demo
- **Neynar Docs**: https://docs.neynar.com/docs/send-notifications-to-mini-app-users

## Status

✅ **Implementation Complete**

All core notification features implemented and ready to use in production.

**Current State**: Using in-memory storage (okay for MVP)
**Production**: Migrate to persistent database before scale
