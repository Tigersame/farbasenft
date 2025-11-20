/**
 * Farcaster Mini App SDK Compatibility Utilities
 * 
 * Reference: https://miniapps.farcaster.xyz/docs/sdk/compatibility
 * 
 * Handle SDK version compatibility and graceful degradation.
 */

import { sdk } from "@farcaster/miniapp-sdk";

/**
 * SDK version information
 */
export interface SDKVersionInfo {
  version: string;
  major: number;
  minor: number;
  patch: number;
  isCompatible: boolean;
}

/**
 * Minimum required SDK version
 */
const MIN_SDK_VERSION = {
  major: 0,
  minor: 1,
  patch: 0,
};

/**
 * Parse semantic version string
 * 
 * @param version - Version string (e.g., "1.2.3")
 * @returns Parsed version components
 */
function parseVersion(version: string): {
  major: number;
  minor: number;
  patch: number;
} {
  const parts = version.replace(/^v/, "").split(".");
  return {
    major: parseInt(parts[0] || "0", 10),
    minor: parseInt(parts[1] || "0", 10),
    patch: parseInt(parts[2] || "0", 10),
  };
}

/**
 * Compare two semantic versions
 * 
 * @param v1 - First version
 * @param v2 - Second version
 * @returns -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
function compareVersions(
  v1: { major: number; minor: number; patch: number },
  v2: { major: number; minor: number; patch: number }
): number {
  if (v1.major !== v2.major) return v1.major - v2.major;
  if (v1.minor !== v2.minor) return v1.minor - v2.minor;
  return v1.patch - v2.patch;
}

/**
 * Get SDK version information
 * 
 * @returns Promise resolving to SDK version details
 * 
 * @example
 * ```typescript
 * const versionInfo = await getSDKVersionInfo();
 * console.log(`SDK version: ${versionInfo.version}`);
 * console.log(`Compatible: ${versionInfo.isCompatible}`);
 * ```
 */
export async function getSDKVersionInfo(): Promise<SDKVersionInfo> {
  try {
    // Try to get version from SDK
    let version = "0.1.0"; // Default fallback

    if ((sdk as any).version) {
      version = (sdk as any).version;
    } else {
      // Try to get from package.json
      try {
        const packageJson = await import("@farcaster/miniapp-sdk/package.json");
        if ((packageJson as any).version) {
          version = (packageJson as any).version;
        }
      } catch {
        // Fallback version
      }
    }

    const parsed = parseVersion(version);
    const isCompatible = compareVersions(parsed, MIN_SDK_VERSION) >= 0;

    return {
      version,
      ...parsed,
      isCompatible,
    };
  } catch (error) {
    console.warn("Failed to get SDK version:", error);
    return {
      version: "unknown",
      major: 0,
      minor: 0,
      patch: 0,
      isCompatible: false,
    };
  }
}

/**
 * Check if SDK meets minimum version requirement
 * 
 * @param minVersion - Minimum required version (e.g., "1.2.0")
 * @returns Promise resolving to whether requirement is met
 * 
 * @example
 * ```typescript
 * if (await meetsMinimumVersion("1.2.0")) {
 *   // Use features from SDK 1.2.0+
 * } else {
 *   // Fallback to older API
 * }
 * ```
 */
export async function meetsMinimumVersion(minVersion: string): Promise<boolean> {
  try {
    const current = await getSDKVersionInfo();
    const required = parseVersion(minVersion);
    return compareVersions(current, required) >= 0;
  } catch {
    return false;
  }
}

/**
 * Feature availability based on SDK version
 */
export interface FeatureAvailability {
  available: boolean;
  minVersion?: string;
  fallbackAvailable: boolean;
  message?: string;
}

/**
 * Known feature version requirements
 */
const FEATURE_REQUIREMENTS: Record<string, string> = {
  "notifications": "0.1.0",
  "wallet-ethereum-provider": "0.1.0",
  "share-url": "0.1.0",
  "open-url": "0.1.0",
  "close": "0.1.0",
  "qr-code": "0.2.0",
  "clipboard": "0.2.0",
  "biometrics": "0.3.0",
  "haptics": "0.2.0",
  "sign-typed-data": "0.1.0",
  "send-transaction": "0.1.0",
};

/**
 * Check if a feature is available in current SDK version
 * 
 * @param feature - Feature name
 * @returns Promise resolving to feature availability info
 * 
 * @example
 * ```typescript
 * const qrCode = await checkFeatureAvailability("qr-code");
 * if (qrCode.available) {
 *   // Use QR code scanner
 * } else if (qrCode.fallbackAvailable) {
 *   // Use browser-based fallback
 * } else {
 *   console.log(qrCode.message);
 * }
 * ```
 */
export async function checkFeatureAvailability(
  feature: string
): Promise<FeatureAvailability> {
  const minVersion = FEATURE_REQUIREMENTS[feature];

  if (!minVersion) {
    return {
      available: false,
      fallbackAvailable: false,
      message: `Unknown feature: ${feature}`,
    };
  }

  const isAvailable = await meetsMinimumVersion(minVersion);

  return {
    available: isAvailable,
    minVersion,
    fallbackAvailable: hasBrowserFallback(feature),
    message: isAvailable
      ? `Feature "${feature}" is available`
      : `Feature "${feature}" requires SDK ${minVersion} or higher`,
  };
}

/**
 * Check if feature has browser-based fallback
 * 
 * @param feature - Feature name
 * @returns Whether browser fallback exists
 */
function hasBrowserFallback(feature: string): boolean {
  const fallbackFeatures = new Set([
    "clipboard",
    "qr-code",
    "open-url",
    "share-url",
  ]);
  return fallbackFeatures.has(feature);
}

/**
 * Safely call SDK method with fallback
 * 
 * Attempts to call an SDK method, falling back to alternative if unavailable.
 * 
 * @param method - Method name
 * @param args - Method arguments
 * @param fallback - Fallback function
 * @returns Promise resolving to method result or fallback result
 * 
 * @example
 * ```typescript
 * await safeSDKCall(
 *   "actions.openUrl",
 *   ["https://example.com"],
 *   async () => {
 *     window.open("https://example.com", "_blank");
 *   }
 * );
 * ```
 */
export async function safeSDKCall<T>(
  method: string,
  args: any[] = [],
  fallback?: () => Promise<T> | T
): Promise<T | null> {
  try {
    // Navigate to SDK method
    const parts = method.split(".");
    let current: any = sdk;

    for (const part of parts) {
      if (!current || typeof current[part] === "undefined") {
        throw new Error(`Method ${method} not found`);
      }
      current = current[part];
    }

    if (typeof current !== "function") {
      throw new Error(`${method} is not a function`);
    }

    return await current(...args);
  } catch (error) {
    console.warn(`SDK method ${method} failed:`, error);

    if (fallback) {
      try {
        return await fallback();
      } catch (fallbackError) {
        console.error(`Fallback for ${method} also failed:`, fallbackError);
      }
    }

    return null;
  }
}

/**
 * Feature polyfill registry
 */
const polyfills = new Map<string, () => Promise<boolean>>();

/**
 * Register feature polyfill
 * 
 * @param feature - Feature name
 * @param polyfill - Polyfill function
 * 
 * @example
 * ```typescript
 * registerPolyfill("haptics", async () => {
 *   // Implement haptics using Web Vibration API
 *   if (navigator.vibrate) {
 *     navigator.vibrate(10);
 *     return true;
 *   }
 *   return false;
 * });
 * ```
 */
export function registerPolyfill(
  feature: string,
  polyfill: () => Promise<boolean>
): void {
  polyfills.set(feature, polyfill);
}

/**
 * Try to use polyfill for a feature
 * 
 * @param feature - Feature name
 * @returns Promise resolving to whether polyfill succeeded
 */
export async function tryPolyfill(feature: string): Promise<boolean> {
  const polyfill = polyfills.get(feature);
  if (!polyfill) return false;

  try {
    return await polyfill();
  } catch (error) {
    console.warn(`Polyfill for ${feature} failed:`, error);
    return false;
  }
}

/**
 * Execute feature with automatic fallback/polyfill
 * 
 * @param feature - Feature name
 * @param action - Primary action using SDK
 * @param fallback - Fallback action
 * @returns Promise resolving to action result
 * 
 * @example
 * ```typescript
 * await withFallback(
 *   "haptics",
 *   async () => sdk.actions.hapticFeedback("light"),
 *   async () => navigator.vibrate?.(10)
 * );
 * ```
 */
export async function withFallback<T>(
  feature: string,
  action: () => Promise<T>,
  fallback?: () => Promise<T>
): Promise<T | null> {
  // Check if feature is available
  const availability = await checkFeatureAvailability(feature);

  if (availability.available) {
    try {
      return await action();
    } catch (error) {
      console.warn(`Feature ${feature} failed:`, error);
    }
  }

  // Try polyfill
  const polyfillSuccess = await tryPolyfill(feature);
  if (polyfillSuccess) {
    return null;
  }

  // Try fallback
  if (fallback) {
    try {
      return await fallback();
    } catch (error) {
      console.error(`Fallback for ${feature} failed:`, error);
    }
  }

  return null;
}

/**
 * Get compatibility report
 * 
 * @returns Promise resolving to comprehensive compatibility information
 */
export async function getCompatibilityReport(): Promise<{
  sdkVersion: SDKVersionInfo;
  features: Record<string, FeatureAvailability>;
  recommendations: string[];
}> {
  const sdkVersion = await getSDKVersionInfo();
  const featureNames = Object.keys(FEATURE_REQUIREMENTS);

  const features: Record<string, FeatureAvailability> = {};
  for (const feature of featureNames) {
    features[feature] = await checkFeatureAvailability(feature);
  }

  const recommendations: string[] = [];

  if (!sdkVersion.isCompatible) {
    recommendations.push(
      `SDK version ${sdkVersion.version} is below minimum required version`
    );
  }

  const unavailableFeatures = Object.entries(features)
    .filter(([_, info]) => !info.available && !info.fallbackAvailable)
    .map(([name]) => name);

  if (unavailableFeatures.length > 0) {
    recommendations.push(
      `Consider upgrading SDK for: ${unavailableFeatures.join(", ")}`
    );
  }

  return {
    sdkVersion,
    features,
    recommendations,
  };
}

/**
 * Log compatibility report to console
 */
export async function logCompatibilityReport(): Promise<void> {
  const report = await getCompatibilityReport();

  console.group("🔍 Mini App SDK Compatibility Report");
  console.log(`SDK Version: ${report.sdkVersion.version}`);
  console.log(`Compatible: ${report.sdkVersion.isCompatible ? "✅" : "❌"}`);

  console.group("Features:");
  for (const [feature, info] of Object.entries(report.features)) {
    const status = info.available ? "✅" : info.fallbackAvailable ? "⚠️" : "❌";
    console.log(`${status} ${feature}${info.minVersion ? ` (${info.minVersion}+)` : ""}`);
  }
  console.groupEnd();

  if (report.recommendations.length > 0) {
    console.group("Recommendations:");
    report.recommendations.forEach((rec) => console.log(`• ${rec}`));
    console.groupEnd();
  }

  console.groupEnd();
}
