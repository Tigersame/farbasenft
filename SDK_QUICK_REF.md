# SDK Advanced Features - Quick Reference

Quick reference for Farcaster Mini App SDK advanced features.

## Capability Detection

### Check Single Capability
```typescript
import { hasCapability } from "@/lib/miniAppCapabilities";

const supported = await hasCapability("notifications");
```

### Check Multiple Capabilities
```typescript
import { checkCapabilities } from "@/lib/miniAppCapabilities";

const caps = await checkCapabilities(["notifications", "share-url"]);
// { notifications: true, "share-url": true }
```

### React Hook
```typescript
import { useCapability } from "@/hooks/useMiniAppSDK";

const { supported, isLoading } = useCapability("notifications");
```

## isInMiniApp Detection

### Direct Check
```typescript
import { sdk } from "@farcaster/miniapp-sdk";

const inMiniApp = await sdk.isInMiniApp();
```

### React Hook
```typescript
import { useMiniAppContext } from "@/lib/useMiniAppContext";

const { isInMiniApp, context, user, client } = useMiniAppContext();
```

### Context Structure
```typescript
{
  user: { fid, username, displayName, pfpUrl },
  client: { name, version, platform },
  location: { type, ... }
}
```

## Event System

### Subscribe to Event
```typescript
import { onMiniAppEvent } from "@/lib/miniAppEvents";

const sub = onMiniAppEvent("miniapp:context:update", (data) => {
  console.log(data.context);
});

// Cleanup
sub.unsubscribe();
```

### React Hook
```typescript
import { useMiniAppEvent } from "@/hooks/useMiniAppSDK";

useMiniAppEvent("miniapp:visibility:changed", ({ visible }) => {
  console.log("Visible:", visible);
});
```

### Available Events
- `miniapp:ready` - App initialized
- `miniapp:context:update` - Context changed
- `miniapp:visibility:changed` - Visibility changed
- `miniapp:theme:changed` - Theme changed
- `miniapp:error` - Error occurred

## Compatibility

### Check SDK Version
```typescript
import { getSDKVersionInfo } from "@/lib/miniAppCompatibility";

const { version, isCompatible } = await getSDKVersionInfo();
```

### Check Feature Availability
```typescript
import { checkFeatureAvailability } from "@/lib/miniAppCompatibility";

const { available, fallbackAvailable } = await checkFeatureAvailability("qr-code");
```

### React Hook
```typescript
import { useSDKVersion } from "@/hooks/useMiniAppSDK";

const { version, isCompatible } = useSDKVersion();
```

### Safe SDK Call
```typescript
import { safeSDKCall } from "@/lib/miniAppCompatibility";

await safeSDKCall(
  "actions.openUrl",
  ["https://example.com"],
  () => window.open("https://example.com")
);
```

## Common Patterns

### Feature-Gated UI
```typescript
function Feature() {
  const { supported } = useCapability("feature-name");
  if (!supported) return null;
  return <FeatureUI />;
}
```

### Progressive Enhancement
```typescript
const canShare = await hasCapability("share-url");

if (canShare) {
  await sdk.actions.shareUrl(url);
} else {
  await navigator.clipboard.writeText(url);
}
```

### Context-Aware Logic
```typescript
const { isInMiniApp, user } = useMiniAppContext();

if (isInMiniApp && user) {
  // Mini App logic
} else {
  // Browser logic
}
```

### Error Handling
```typescript
import { onError, emitError } from "@/lib/miniAppEvents";

onError(({ error }) => {
  // Handle error
});

try {
  await riskyOp();
} catch (error) {
  emitError(error, { context: "riskyOp" });
}
```

## All Available Capabilities

✅ Core Features:
- `ethereum-provider` - Wallet access
- `open-url` - Open URLs
- `close` - Close app
- `share-url` - Share to Farcaster
- `notifications` - Push notifications

🔧 Advanced Features:
- `qr-code` - QR scanning
- `clipboard` - Clipboard access
- `biometrics` - Biometric auth
- `haptics` - Haptic feedback
- `sign-typed-data` - EIP-712 signing
- `send-transaction` - Send transactions

🚧 Future Features:
- `camera` - Camera access
- `location` - Location services
- `contacts` - Contact access
- `storage` - Persistent storage

## React Hooks Summary

| Hook | Purpose | Returns |
|------|---------|---------|
| `useCapability(cap)` | Check single capability | `{ supported, isLoading }` |
| `useCapabilities(caps)` | Check multiple capabilities | `{ capabilities, isLoading }` |
| `useMiniAppContext()` | Get Mini App context | `{ isInMiniApp, context, user }` |
| `useMiniAppEvent(event, handler)` | Subscribe to event | `void` |
| `useVisibility()` | Track visibility | `boolean` |
| `useSDKVersion()` | Get SDK version | `{ version, isCompatible }` |
| `useFeatureAvailability(feature)` | Check feature | `{ available, fallbackAvailable }` |
| `useSafeSDKCall()` | Safe SDK calls | `(action, fallback) => Promise` |

## Demo Page

Visit `/sdk-demo` to test all features interactively.

## Quick Tests

### Test isInMiniApp
```typescript
const { isInMiniApp } = useMiniAppContext();
console.log("In Mini App:", isInMiniApp);
```

### Test Capabilities
```typescript
const caps = await checkCapabilities([
  "notifications",
  "ethereum-provider",
  "share-url"
]);
console.log("Supported:", caps);
```

### Test Events
```typescript
useMiniAppEvent("miniapp:visibility:changed", console.log);
// Switch tabs to trigger event
```

### Test Compatibility
```typescript
const { version, isCompatible } = await getSDKVersionInfo();
console.log(`SDK ${version} - Compatible: ${isCompatible}`);
```

## Links

- [Full Documentation](./SDK_ADVANCED_FEATURES.md)
- [Official Capability Docs](https://miniapps.farcaster.xyz/docs/sdk/detecting-capabilities)
- [Official isInMiniApp Docs](https://miniapps.farcaster.xyz/docs/sdk/is-in-mini-app)
- [Official Events Docs](https://miniapps.farcaster.xyz/docs/sdk/events)
- [Official Compatibility Docs](https://miniapps.farcaster.xyz/docs/sdk/compatibility)
