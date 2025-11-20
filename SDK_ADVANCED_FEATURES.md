# Farcaster Mini App SDK - Advanced Features Implementation

Complete implementation of advanced Farcaster Mini App SDK features including capability detection, event handling, context detection, and compatibility management.

## Overview

This implementation covers four essential SDK features:

1. **Capability Detection** - Check which features are supported by the client
2. **isInMiniApp Detection** - Determine if running in Farcaster Mini App context
3. **Event System** - Listen to and handle Mini App lifecycle events
4. **Compatibility** - Manage SDK version compatibility and graceful degradation

## References

- [Detecting Capabilities](https://miniapps.farcaster.xyz/docs/sdk/detecting-capabilities)
- [isInMiniApp](https://miniapps.farcaster.xyz/docs/sdk/is-in-mini-app)
- [Events](https://miniapps.farcaster.xyz/docs/sdk/events)
- [Compatibility](https://miniapps.farcaster.xyz/docs/sdk/compatibility)

## Implementation Files

### Core Libraries

1. **`src/lib/miniAppCapabilities.ts`** - Capability detection system
2. **`src/lib/miniAppEvents.ts`** - Event emitter and listeners
3. **`src/lib/miniAppCompatibility.ts`** - Version compatibility utilities
4. **`src/hooks/useMiniAppSDK.ts`** - React hooks for all SDK features
5. **`src/lib/useMiniAppContext.ts`** - Enhanced context hook with events
6. **`src/components/SDKCapabilitiesDemo.tsx`** - Comprehensive demo UI
7. **`src/app/sdk-demo/page.tsx`** - Demo page

## Feature 1: Capability Detection

### Overview

Detect which features are supported by the current Farcaster client. Different clients (Warpcast, Base app) may support different capabilities.

### Supported Capabilities

```typescript
type MiniAppCapability =
  | "ethereum-provider"        // EIP-1193 provider access
  | "open-url"                 // Open external URLs
  | "close"                    // Close the Mini App
  | "share-url"                // Share URLs to Farcaster
  | "notifications"            // Push notifications
  | "qr-code"                  // QR code scanning
  | "clipboard"                // Clipboard access
  | "biometrics"               // Biometric authentication
  | "haptics"                  // Haptic feedback
  | "camera"                   // Camera access
  | "location"                 // Location services
  | "contacts"                 // Contact list access
  | "storage"                  // Persistent storage
  | "sign-typed-data"          // EIP-712 signing
  | "send-transaction";        // Send blockchain transactions
```

### Usage Examples

#### Check Single Capability

```typescript
import { hasCapability } from "@/lib/miniAppCapabilities";

const hasNotifications = await hasCapability("notifications");
if (hasNotifications) {
  // Show notification opt-in UI
  await sdk.actions.requestNotificationPermission();
}
```

#### Check Multiple Capabilities

```typescript
import { checkCapabilities } from "@/lib/miniAppCapabilities";

const capabilities = await checkCapabilities([
  "notifications",
  "ethereum-provider",
  "share-url"
]);

if (capabilities["ethereum-provider"]) {
  // Enable wallet features
}
```

#### Get All Supported Capabilities

```typescript
import { getSupportedCapabilities } from "@/lib/miniAppCapabilities";

const supported = await getSupportedCapabilities();
console.log("Supported features:", supported);
// ["ethereum-provider", "notifications", "open-url", ...]
```

#### React Hook Usage

```typescript
import { useCapability } from "@/hooks/useMiniAppSDK";

function NotificationButton() {
  const { supported, isLoading } = useCapability("notifications");
  
  if (isLoading) return <Spinner />;
  if (!supported) return <p>Notifications not supported</p>;
  
  return <button onClick={requestPermission}>Enable Notifications</button>;
}
```

#### Safe Feature Execution

```typescript
import { withCapability } from "@/lib/miniAppCapabilities";

await withCapability(
  "notifications",
  async () => {
    await sdk.actions.requestNotificationPermission();
  },
  async () => {
    alert("Notifications not supported in this client");
  }
);
```

## Feature 2: isInMiniApp Detection

### Overview

Determine if your app is running inside a Farcaster Mini App context or in a regular browser.

### Usage Examples

#### Direct SDK Call

```typescript
import { sdk } from "@farcaster/miniapp-sdk";

const inMiniApp = await sdk.isInMiniApp();

if (inMiniApp) {
  // Use Mini App features
  const context = await sdk.context;
  console.log("User FID:", context.user.fid);
} else {
  // Use browser fallbacks
  console.log("Running in browser mode");
}
```

#### React Hook Usage

```typescript
import { useMiniAppContext } from "@/lib/useMiniAppContext";

function MyComponent() {
  const { isInMiniApp, isLoading, context, user } = useMiniAppContext();
  
  if (isLoading) return <Spinner />;
  
  return (
    <div>
      {isInMiniApp ? (
        <p>Welcome, {user?.username}!</p>
      ) : (
        <p>Please open in Farcaster app</p>
      )}
    </div>
  );
}
```

#### Context Properties

When `isInMiniApp` is true, you have access to:

```typescript
context = {
  user: {
    fid: number;
    username: string;
    displayName: string;
    pfpUrl: string;
  },
  client: {
    name: string;      // "warpcast" | "base" | etc.
    version?: string;
    platform?: string; // "ios" | "android" | "web"
  },
  location: {
    type: string;
    // Additional location-specific data
  }
}
```

## Feature 3: Event System

### Overview

Listen to and handle Mini App lifecycle events like context updates, visibility changes, and theme changes.

### Event Types

```typescript
type MiniAppEventType =
  | "miniapp:ready"              // Mini App initialized
  | "miniapp:context:update"     // Context changed
  | "miniapp:location:changed"   // Navigation occurred
  | "miniapp:visibility:changed" // App became visible/hidden
  | "miniapp:theme:changed"      // Theme changed (light/dark)
  | "miniapp:notification"       // Notification received
  | "miniapp:wallet:connected"   // Wallet connected
  | "miniapp:wallet:disconnected" // Wallet disconnected
  | "miniapp:error";             // Error occurred
```

### Usage Examples

#### Subscribe to Events

```typescript
import { onMiniAppEvent } from "@/lib/miniAppEvents";

const subscription = onMiniAppEvent("miniapp:context:update", (data) => {
  console.log("Context updated:", data.context);
});

// Later: unsubscribe
subscription.unsubscribe();
```

#### One-Time Event Listener

```typescript
import { onceMiniAppEvent } from "@/lib/miniAppEvents";

onceMiniAppEvent("miniapp:wallet:connected", (data) => {
  console.log("Wallet connected:", data.address);
});
```

#### Wait for Event

```typescript
import { waitForEvent } from "@/lib/miniAppEvents";

try {
  const data = await waitForEvent("miniapp:wallet:connected", 5000);
  console.log("Wallet connected:", data.address);
} catch (error) {
  console.log("Timeout: wallet not connected within 5 seconds");
}
```

#### React Hook Usage

```typescript
import { useMiniAppEvent } from "@/hooks/useMiniAppSDK";

function ContextMonitor() {
  const [context, setContext] = useState(null);
  
  useMiniAppEvent("miniapp:context:update", (data) => {
    setContext(data.context);
  });
  
  return <pre>{JSON.stringify(context, null, 2)}</pre>;
}
```

#### Track Visibility

```typescript
import { useVisibility } from "@/hooks/useMiniAppSDK";

function VisibilityIndicator() {
  const isVisible = useVisibility();
  
  return (
    <div>
      App is {isVisible ? "visible" : "hidden"}
    </div>
  );
}
```

#### Error Handling

```typescript
import { onError, emitError } from "@/lib/miniAppEvents";

// Listen for errors
onError(({ error, context }) => {
  console.error("Mini App Error:", error, context);
  // Send to error tracking service
});

// Emit error
try {
  await riskyOperation();
} catch (error) {
  emitError(error, { operation: "riskyOperation" });
}
```

## Feature 4: Compatibility Management

### Overview

Handle SDK version compatibility and provide graceful degradation for unsupported features.

### Usage Examples

#### Get SDK Version

```typescript
import { getSDKVersionInfo } from "@/lib/miniAppCompatibility";

const versionInfo = await getSDKVersionInfo();
console.log(`SDK version: ${versionInfo.version}`);
console.log(`Compatible: ${versionInfo.isCompatible}`);
```

#### Check Minimum Version

```typescript
import { meetsMinimumVersion } from "@/lib/miniAppCompatibility";

if (await meetsMinimumVersion("1.2.0")) {
  // Use features from SDK 1.2.0+
  await sdk.actions.scanQRCode();
} else {
  // Fallback to older API
  alert("QR code scanning requires SDK 1.2.0+");
}
```

#### Check Feature Availability

```typescript
import { checkFeatureAvailability } from "@/lib/miniAppCompatibility";

const qrCode = await checkFeatureAvailability("qr-code");
if (qrCode.available) {
  // Use native QR code scanner
  await sdk.actions.scanQRCode();
} else if (qrCode.fallbackAvailable) {
  // Use browser-based fallback
  useWebQRScanner();
} else {
  console.log(qrCode.message);
  // "Feature qr-code requires SDK 0.2.0 or higher"
}
```

#### Safe SDK Calls with Fallback

```typescript
import { safeSDKCall } from "@/lib/miniAppCompatibility";

await safeSDKCall(
  "actions.openUrl",
  ["https://example.com"],
  async () => {
    // Fallback: use window.open
    window.open("https://example.com", "_blank");
  }
);
```

#### React Hook Usage

```typescript
import { useSDKVersion, useFeatureAvailability } from "@/hooks/useMiniAppSDK";

function SDKInfo() {
  const { version, isLoading, isCompatible } = useSDKVersion();
  const qrCode = useFeatureAvailability("qr-code");
  
  if (isLoading) return <Spinner />;
  
  return (
    <div>
      <p>SDK Version: {version.version}</p>
      {!isCompatible && <Warning>SDK version not compatible</Warning>}
      <p>QR Code: {qrCode.available ? "✅" : "❌"}</p>
    </div>
  );
}
```

#### Compatibility Report

```typescript
import { getCompatibilityReport, logCompatibilityReport } from "@/lib/miniAppCompatibility";

// Get detailed report
const report = await getCompatibilityReport();
console.log(report.sdkVersion);
console.log(report.features);
console.log(report.recommendations);

// Or log to console
await logCompatibilityReport();
```

#### Execute with Automatic Fallback

```typescript
import { withFallback } from "@/lib/miniAppCompatibility";

await withFallback(
  "haptics",
  async () => sdk.actions.hapticFeedback("light"),
  async () => navigator.vibrate?.(10)
);
```

## Integration Patterns

### 1. Feature-Gated UI

```typescript
function FeatureGatedButton() {
  const { supported } = useCapability("notifications");
  
  if (!supported) return null;
  
  return <button>Enable Notifications</button>;
}
```

### 2. Progressive Enhancement

```typescript
async function shareNFT(nftId: string) {
  const canShare = await hasCapability("share-url");
  
  if (canShare) {
    // Use native share
    await sdk.actions.shareUrl(`${appUrl}/nft/${nftId}`);
  } else {
    // Fallback to copy link
    await navigator.clipboard.writeText(`${appUrl}/nft/${nftId}`);
    alert("Link copied to clipboard!");
  }
}
```

### 3. Context-Aware Navigation

```typescript
function Navigation() {
  const { isInMiniApp } = useMiniAppContext();
  
  return (
    <nav>
      {isInMiniApp ? (
        // Mini App navigation
        <MiniAppNav />
      ) : (
        // Browser navigation
        <BrowserNav />
      )}
    </nav>
  );
}
```

### 4. Error Boundary with Events

```typescript
function ErrorBoundary({ children }) {
  const [error, setError] = useState(null);
  
  useMiniAppEvent("miniapp:error", ({ error }) => {
    setError(error);
  });
  
  if (error) {
    return <ErrorDisplay error={error} />;
  }
  
  return children;
}
```

## Testing

### Local Development

```bash
# Start dev server
npm run dev

# Visit demo page
http://localhost:3000/sdk-demo
```

### In Farcaster Client

1. Deploy to production
2. Open in Warpcast: `https://warpcast.com/~/miniapp?url=https://your-app.vercel.app/sdk-demo`
3. Test capabilities and events

### Test Checklist

- [ ] `isInMiniApp` returns true in Farcaster, false in browser
- [ ] Context provides user information when in Mini App
- [ ] Capabilities detection works correctly
- [ ] Events fire on context updates
- [ ] Visibility events fire on tab switching
- [ ] Version compatibility checks work
- [ ] Feature availability checks match actual support
- [ ] Fallbacks execute when features unavailable
- [ ] Safe SDK calls handle errors gracefully

## Demo Page

Visit `/sdk-demo` to see a comprehensive demonstration of all SDK features:

- **Context Tab**: Shows `isInMiniApp` status, user context, client info
- **Capabilities Tab**: Lists all supported capabilities
- **Events Tab**: Live event log showing fired events
- **Compatibility Tab**: SDK version and feature compatibility report

## Best Practices

### 1. Always Check Context

```typescript
const { isInMiniApp } = useMiniAppContext();

if (isInMiniApp) {
  // Use Mini App features
} else {
  // Provide browser fallback
}
```

### 2. Graceful Degradation

```typescript
const { supported } = useCapability("feature-name");

if (supported) {
  // Use native feature
} else {
  // Use fallback or hide feature
}
```

### 3. Version-Aware Code

```typescript
const compatible = await meetsMinimumVersion("1.2.0");

if (compatible) {
  // Use new API
} else {
  // Use legacy API
}
```

### 4. Event Cleanup

```typescript
useEffect(() => {
  const subscription = onMiniAppEvent("event-type", handler);
  
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

### 5. Error Handling

```typescript
try {
  await sdk.actions.someFeature();
} catch (error) {
  emitError(error, { feature: "someFeature" });
  // Fallback logic
}
```

## Troubleshooting

### isInMiniApp Returns False

- Verify you're opening in Farcaster client
- Check SDK is properly imported
- Ensure `sdk.isInMiniApp()` is awaited

### Capabilities Not Detected

- Ensure running in Mini App context
- Check SDK version compatibility
- Verify feature is actually supported by client

### Events Not Firing

- Check subscription is active
- Verify event name is correct
- Ensure not unsubscribing too early

### Version Mismatch

- Update SDK: `npm install @farcaster/miniapp-sdk@latest`
- Check compatibility report for details
- Use fallbacks for unsupported features

## Performance Considerations

1. **Cache Capability Checks**: Don't check capabilities on every render
2. **Debounce Events**: Handle high-frequency events carefully
3. **Lazy Load**: Import SDK utilities only when needed
4. **Minimize Subscriptions**: Unsubscribe from unused events

## Security Considerations

1. **Validate Context**: Don't trust context data without validation
2. **Sanitize Events**: Sanitize event data before displaying
3. **Permission Checks**: Always check capabilities before using features
4. **Error Exposure**: Don't expose sensitive data in error events

## Related Documentation

- [Quick Auth Implementation](./AUTH_IMPLEMENTATION.md)
- [Notifications Setup](./NOTIFICATIONS_IMPLEMENTATION.md)
- [Share Extensions](./SHARE_EXTENSION_IMPLEMENTATION.md)
- [Universal Links](./UNIVERSAL_LINKS_IMPLEMENTATION.md)

## Implementation Status

✅ **Complete**
- Capability detection system
- isInMiniApp detection and context
- Event emitter and listeners
- Version compatibility utilities
- React hooks for all features
- Comprehensive demo component
- Full documentation

🎯 **Production Ready**
- Deploy to Vercel
- Test in Farcaster clients
- Monitor capability usage
- Track compatibility issues
