# Neynar Webhook Configuration

## Overview

You have two webhook URLs to configure:

1. **Your Server Webhook** (`/api/webhook`) - Where Neynar/Base sends events TO your server
2. **Neynar App Webhook** - Your Neynar app's webhook endpoint URL

## Your Server Webhook

This is the URL that should be in your `farcaster.json` manifest:

```
webhookUrl: "https://your-domain.com/api/webhook"
```

This is where Neynar/Base will send mini app events (miniapp_added, notifications_enabled, etc.).

## Neynar App Webhook

The URL you provided:
```
https://api.neynar.com/f/app/bc1764c2-379a-4239-8c63-e38f6175db58/event
```

This is your Neynar app's webhook endpoint. This URL is typically used for:

1. **Registering in Neynar Dashboard**: You may need to configure this in your Neynar app settings
2. **Forwarding Events**: If you need to forward events from your server to Neynar
3. **App-Specific Events**: Some Neynar-specific events may use this endpoint

## Configuration

### Environment Variables

Your `.env.local` now includes:
```env
NEYNAR_API_KEY=A2FB36E9-3C4E-48AA-8018-BC03613CB5CD
NEYNAR_WEBHOOK_URL=https://api.neynar.com/f/app/bc1764c2-379a-4239-8c63-e38f6175db58/event
```

### Manifest Configuration

Your `farcaster.json` manifest should have:
```json
{
  "miniapp": {
    "webhookUrl": "https://your-domain.com/api/webhook"
  }
}
```

**Important**: The `webhookUrl` in your manifest should point to YOUR server, not the Neynar URL.

## How It Works

1. User adds your Mini App in Base/Farcaster
2. Base/Farcaster sends an event to YOUR webhook (`/api/webhook`)
3. Your server verifies the event using `NEYNAR_API_KEY`
4. Your server processes the event and saves notification tokens
5. You can send notifications using the saved tokens

## Testing

### Local Development

For local testing, use ngrok to expose your local server:

```bash
ngrok http 3000
```

Then update your manifest's `webhookUrl` to the ngrok URL:
```json
{
  "miniapp": {
    "webhookUrl": "https://your-ngrok-url.ngrok.io/api/webhook"
  }
}
```

### Verifying Webhook

Test your webhook endpoint:
```bash
curl https://your-domain.com/api/webhook
```

Should return:
```json
{
  "ok": true,
  "message": "farbasenft webhook endpoint ready"
}
```

## Troubleshooting

### Events Not Received

1. Verify `webhookUrl` in manifest points to your server
2. Ensure your server is publicly accessible
3. Check that `NEYNAR_API_KEY` is set correctly
4. Verify webhook signature verification is working

### Neynar App Webhook

The Neynar webhook URL (`NEYNAR_WEBHOOK_URL`) may be used for:
- App-specific configuration in Neynar dashboard
- Forwarding events if needed
- Neynar-specific integrations

If you're unsure how to use it, check your Neynar app dashboard settings.

## References

- [Base Mini Apps Notifications](https://docs.base.org/mini-apps/core-concepts/notifications)
- [Neynar Documentation](https://docs.neynar.com/)

