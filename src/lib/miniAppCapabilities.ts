/**
 * Farcaster Mini App SDK Capabilities Detection
 * 
 * Reference: https://miniapps.farcaster.xyz/docs/sdk/detecting-capabilities
 * 
 * Detects which features are supported by the current Farcaster client.
 * Different clients (Warpcast, Base app) may support different capabilities.
 */

import { sdk } from "@farcaster/miniapp-sdk";

/**
 * All possible Mini App capabilities
 */
export type MiniAppCapability =
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

/**
 * Capability check result
 */
export interface CapabilityCheckResult {
  supported: boolean;
  capability: MiniAppCapability;
  version?: string;
  error?: string;
}

/**
 * Check if a specific capability is supported
 * 
 * @param capability - The capability to check
 * @returns Promise resolving to whether the capability is supported
 * 
 * @example
 * ```typescript
 * const hasNotifications = await hasCapability("notifications");
 * if (hasNotifications) {
 *   // Show notification opt-in UI
 * }
 * ```
 */
export async function hasCapability(
  capability: MiniAppCapability
): Promise<boolean> {
  try {
    // Check if we're in a Mini App first
    const inMiniApp = await sdk.isInMiniApp().catch(() => false);
    if (!inMiniApp) {
      return false;
    }

    // Use SDK's capability detection if available
    if (typeof (sdk as any).hasCapability === "function") {
      return await (sdk as any).hasCapability(capability);
    }

    // Fallback: Check for specific SDK methods/properties
    return await checkCapabilityFallback(capability);
  } catch (error) {
    console.warn(`Failed to check capability "${capability}":`, error);
    return false;
  }
}

/**
 * Check multiple capabilities at once
 * 
 * @param capabilities - Array of capabilities to check
 * @returns Promise resolving to map of capability -> supported status
 * 
 * @example
 * ```typescript
 * const capabilities = await checkCapabilities([
 *   "notifications",
 *   "ethereum-provider",
 *   "share-url"
 * ]);
 * 
 * if (capabilities["notifications"]) {
 *   // Enable notifications
 * }
 * ```
 */
export async function checkCapabilities(
  capabilities: MiniAppCapability[]
): Promise<Record<MiniAppCapability, boolean>> {
  const results = await Promise.all(
    capabilities.map(async (cap) => ({
      capability: cap,
      supported: await hasCapability(cap),
    }))
  );

  return results.reduce(
    (acc, { capability, supported }) => {
      acc[capability] = supported;
      return acc;
    },
    {} as Record<MiniAppCapability, boolean>
  );
}

/**
 * Get detailed information about a capability
 * 
 * @param capability - The capability to check
 * @returns Promise resolving to detailed capability information
 */
export async function getCapabilityInfo(
  capability: MiniAppCapability
): Promise<CapabilityCheckResult> {
  try {
    const supported = await hasCapability(capability);
    return {
      supported,
      capability,
      version: supported ? await getSDKVersion() : undefined,
    };
  } catch (error) {
    return {
      supported: false,
      capability,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get all supported capabilities in the current environment
 * 
 * @returns Promise resolving to array of supported capabilities
 * 
 * @example
 * ```typescript
 * const supported = await getSupportedCapabilities();
 * console.log("Supported features:", supported);
 * // ["ethereum-provider", "notifications", "open-url", ...]
 * ```
 */
export async function getSupportedCapabilities(): Promise<MiniAppCapability[]> {
  const allCapabilities: MiniAppCapability[] = [
    "ethereum-provider",
    "open-url",
    "close",
    "share-url",
    "notifications",
    "qr-code",
    "clipboard",
    "biometrics",
    "haptics",
    "camera",
    "location",
    "contacts",
    "storage",
    "sign-typed-data",
    "send-transaction",
  ];

  const results = await checkCapabilities(allCapabilities);
  return allCapabilities.filter((cap) => results[cap]);
}

/**
 * Fallback capability detection when SDK doesn't provide native check
 * 
 * @param capability - The capability to check
 * @returns Promise resolving to whether the capability is supported
 */
async function checkCapabilityFallback(
  capability: MiniAppCapability
): Promise<boolean> {
  try {
    const sdkAny = sdk as any;
    
    switch (capability) {
      case "ethereum-provider":
        return !!(sdkAny.wallet?.ethProvider || sdkAny.actions?.openUrl);

      case "open-url":
        return typeof sdkAny.actions?.openUrl === "function";

      case "close":
        return typeof sdkAny.actions?.close === "function";

      case "share-url":
        return typeof sdkAny.actions?.shareUrl === "function";

      case "notifications":
        return typeof sdkAny.actions?.requestNotificationPermission === "function";

      case "qr-code":
        return typeof sdkAny.actions?.scanQRCode === "function";

      case "clipboard":
        return typeof sdkAny.actions?.copyToClipboard === "function";

      case "biometrics":
        return typeof sdkAny.actions?.authenticateBiometric === "function";

      case "haptics":
        return typeof sdkAny.actions?.hapticFeedback === "function";

      case "sign-typed-data":
        return typeof sdkAny.wallet?.signTypedData === "function";

      case "send-transaction":
        return typeof sdkAny.wallet?.sendTransaction === "function";

      // Capabilities that need feature detection or always return false for now
      case "camera":
      case "location":
      case "contacts":
      case "storage":
        return false;

      default:
        return false;
    }
  } catch {
    return false;
  }
}

/**
 * Get SDK version information
 * 
 * @returns Promise resolving to SDK version string
 */
export async function getSDKVersion(): Promise<string> {
  try {
    // Try to get version from SDK
    if ((sdk as any).version) {
      return (sdk as any).version;
    }

    // Try to get from package.json
    const packageJson = await import("@farcaster/miniapp-sdk/package.json");
    return (packageJson as any).version || "unknown";
  } catch {
    return "unknown";
  }
}

/**
 * Check if running in a specific Farcaster client
 * 
 * @param client - Client name to check ("warpcast" | "base" | "other")
 * @returns Promise resolving to whether running in specified client
 */
export async function isClient(
  client: "warpcast" | "base" | "other"
): Promise<boolean> {
  try {
    const inMiniApp = await sdk.isInMiniApp().catch(() => false);
    if (!inMiniApp) return false;

    const context = await sdk.context;
    const clientName = ((context?.client as any)?.name?.toLowerCase() || "");

    switch (client) {
      case "warpcast":
        return clientName.includes("warpcast");
      case "base":
        return clientName.includes("base");
      case "other":
        return !clientName.includes("warpcast") && !clientName.includes("base");
      default:
        return false;
    }
  } catch {
    return false;
  }
}

/**
 * Get client information
 * 
 * @returns Promise resolving to client details
 */
export async function getClientInfo(): Promise<{
  name: string;
  version?: string;
  platform?: string;
}> {
  try {
    const context = await sdk.context;
    const clientAny = context?.client as any;
    return {
      name: clientAny?.name || "unknown",
      version: clientAny?.version,
      platform: clientAny?.platform,
    };
  } catch {
    return { name: "unknown" };
  }
}

/**
 * Safe capability-based feature execution
 * 
 * Executes a function only if the required capability is available,
 * otherwise executes a fallback function.
 * 
 * @param capability - Required capability
 * @param action - Function to execute if capability is available
 * @param fallback - Function to execute if capability is not available
 * @returns Promise resolving to result of action or fallback
 * 
 * @example
 * ```typescript
 * await withCapability(
 *   "notifications",
 *   async () => {
 *     await sdk.actions.requestNotificationPermission();
 *   },
 *   async () => {
 *     alert("Notifications not supported in this client");
 *   }
 * );
 * ```
 */
export async function withCapability<T>(
  capability: MiniAppCapability,
  action: () => Promise<T>,
  fallback?: () => Promise<T>
): Promise<T | null> {
  const supported = await hasCapability(capability);

  if (supported) {
    return await action();
  } else if (fallback) {
    return await fallback();
  }

  return null;
}
