# Base Mini App Notifications Setup

This guide explains how to set up and use notifications for your Base Mini App.

## Overview

Notifications allow you to re-engage users by sending in-app notifications through the Base app. When a user enables notifications, the Base app generates a unique notification `token` and `url` which is sent to your server via webhook.

## Prerequisites

1. **Neynar API Key**: Get a free API key from [Neynar](https://dev.neynar.com/)
2. **Webhook URL**: Your webhook endpoint must be publicly accessible (use a service like ngrok for local development)

## Setup Steps

### 1. Install Dependencies

The required package is already installed:
```bash
npm install @farcaster/miniapp-node
```

### 2. Configure Environment Variables

Add the following to your `.env.local` file:

```env
# Neynar API Key for webhook verification
NEYNAR_API_KEY=your_neynar_api_key_here

# Your app URL (used for notification target URLs)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 3. Webhook Endpoint

The webhook endpoint is already configured at `/api/webhook`. It handles:
- `miniapp_added`: When user adds the Mini App
- `miniapp_removed`: When user removes the Mini App
- `notifications_enabled`: When user enables notifications
- `notifications_disabled`: When user disables notifications

### 4. Manifest Configuration

The webhook URL is already configured in `minikit.config.ts`:
```typescript
webhookUrl: `${ROOT_URL}/api/webhook`
```

Make sure your manifest file (served at `/.well-known/farcaster.json`) includes the `webhookUrl`.

## Usage

### Prompt Users to Add Mini App

Use the `useNotifications` hook to prompt users to add your Mini App:

```tsx
import { useNotifications } from "@/lib/useNotifications";

function MyComponent() {
  const { addMiniApp } = useNotifications();

  const handleAdd = async () => {
    const result = await addMiniApp();
    if (result.success) {
      console.log(result.message);
    }
  };

  return <button onClick={handleAdd}>Add Mini App</button>;
}
```

### Send Notifications

Send notifications from your server using the `sendMiniAppNotification` function:

```typescript
import { sendMiniAppNotification } from "@/lib/notifications";

// Send a notification
const result = await sendMiniAppNotification({
  fid: 12345, // User's FID
  appFid: 309857, // Base app FID
  title: "New NFT Listed",
  body: "Check out the latest drop!",
  targetUrl: "https://your-app.com/nft/123", // Optional
});

if (result.state === "success") {
  console.log("Notification sent!");
}
```

## Notification Limits

- **Title**: Maximum 32 characters
- **Body**: Maximum 128 characters
- **Target URL**: Maximum 1024 characters (must be on same domain as Mini App)
- **Tokens per request**: Maximum 100 tokens

## Webhook Response Timing

⚠️ **Important**: Webhooks must respond within 10 seconds to avoid timeouts from the Base app.

If you encounter a "Failed to add mini app" error, your webhook may be taking too long to respond. Consider:
- Processing webhook events asynchronously
- Returning a quick success response first
- Processing heavy operations in the background

## Client App Behavior

Different client apps handle webhook responses differently:

- **Farcaster app**: Activates notification tokens immediately without waiting for a webhook success response
- **Base app**: Waits for a successful webhook response before activating tokens

## Storage

Currently, notification tokens are stored in-memory. For production, you should:

1. Replace the in-memory storage in `src/lib/notifications.ts` with a database (PostgreSQL, MongoDB, etc.)
2. Store tokens securely with proper encryption
3. Implement token expiration and cleanup

## Testing

### Local Development

For local development, use a service like [ngrok](https://ngrok.com/) to expose your local server:

```bash
ngrok http 3000
```

Then update your `.env.local`:
```env
NEXT_PUBLIC_APP_URL=https://your-ngrok-url.ngrok.io
```

And update the webhook URL in your manifest to use the ngrok URL.

### Testing Notifications

1. Add the Mini App using `sdk.actions.addMiniApp()`
2. Enable notifications when prompted
3. Check your server logs for webhook events
4. Send a test notification using the `sendMiniAppNotification` function

## Event Types

### `miniapp_added`
Sent when the user adds the Mini App. Includes `notificationDetails` if notifications are enabled.

### `miniapp_removed`
Sent when a user removes the Mini App. Delete any stored notification tokens.

### `notifications_enabled`
Sent when a user enables notifications. Includes new `notificationDetails` with token and URL.

### `notifications_disabled`
Sent when a user disables notifications. Delete the stored notification token.

## Troubleshooting

### "Failed to add mini app" Error
- Check that your webhook responds within 10 seconds
- Verify your webhook URL is publicly accessible
- Check server logs for errors

### Notifications Not Working
- Verify `NEYNAR_API_KEY` is set correctly
- Check that notification tokens are being saved
- Verify the notification URL and token are valid
- Check for rate limiting errors

### Webhook Verification Fails
- Ensure `NEYNAR_API_KEY` is correct
- Check that the webhook payload is not being modified
- Verify the signature verification is working

## Documentation

- [Base Mini Apps Notifications](https://docs.base.org/mini-apps/core-concepts/notifications)
- [Neynar API](https://dev.neynar.com/)

