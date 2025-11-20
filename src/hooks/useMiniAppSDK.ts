/**
 * React hooks for Farcaster Mini App SDK features
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  hasCapability,
  checkCapabilities,
  getSupportedCapabilities,
  type MiniAppCapability,
} from "@/lib/miniAppCapabilities";
import {
  onMiniAppEvent,
  type MiniAppEventType,
  type MiniAppEventData,
  type EventSubscription,
} from "@/lib/miniAppEvents";
import {
  getSDKVersionInfo,
  checkFeatureAvailability,
  getCompatibilityReport,
  type SDKVersionInfo,
  type FeatureAvailability,
} from "@/lib/miniAppCompatibility";

/**
 * Hook to check if a capability is supported
 * 
 * @param capability - Capability to check
 * @returns Object with capability status and loading state
 * 
 * @example
 * ```tsx
 * function NotificationButton() {
 *   const { supported, isLoading } = useCapability("notifications");
 *   
 *   if (isLoading) return <Spinner />;
 *   if (!supported) return <p>Notifications not supported</p>;
 *   
 *   return <button onClick={requestPermission}>Enable Notifications</button>;
 * }
 * ```
 */
export function useCapability(capability: MiniAppCapability) {
  const [supported, setSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      try {
        const result = await hasCapability(capability);
        if (mounted) {
          setSupported(result);
        }
      } catch (error) {
        console.error(`Failed to check capability "${capability}":`, error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    check();

    return () => {
      mounted = false;
    };
  }, [capability]);

  return { supported, isLoading };
}

/**
 * Hook to check multiple capabilities at once
 * 
 * @param capabilities - Array of capabilities to check
 * @returns Object with capabilities map and loading state
 * 
 * @example
 * ```tsx
 * function FeatureList() {
 *   const { capabilities, isLoading } = useCapabilities([
 *     "notifications",
 *     "ethereum-provider",
 *     "share-url"
 *   ]);
 *   
 *   if (isLoading) return <Spinner />;
 *   
 *   return (
 *     <ul>
 *       {Object.entries(capabilities).map(([cap, supported]) => (
 *         <li key={cap}>{cap}: {supported ? "✅" : "❌"}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useCapabilities(capabilities: MiniAppCapability[]) {
  const [capabilitiesMap, setCapabilitiesMap] = useState<
    Record<MiniAppCapability, boolean>
  >({} as Record<MiniAppCapability, boolean>);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      try {
        const results = await checkCapabilities(capabilities);
        if (mounted) {
          setCapabilitiesMap(results);
        }
      } catch (error) {
        console.error("Failed to check capabilities:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    check();

    return () => {
      mounted = false;
    };
  }, [capabilities.join(",")]);

  return { capabilities: capabilitiesMap, isLoading };
}

/**
 * Hook to get all supported capabilities
 * 
 * @returns Object with supported capabilities array and loading state
 * 
 * @example
 * ```tsx
 * function SupportedFeatures() {
 *   const { supported, isLoading } = useSupportedCapabilities();
 *   
 *   if (isLoading) return <Spinner />;
 *   
 *   return (
 *     <div>
 *       <h3>Supported Features ({supported.length})</h3>
 *       <ul>
 *         {supported.map(cap => <li key={cap}>{cap}</li>)}
 *       </ul>
 *     </div>
 *   );
 * }
 * ```
 */
export function useSupportedCapabilities() {
  const [supported, setSupported] = useState<MiniAppCapability[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      try {
        const results = await getSupportedCapabilities();
        if (mounted) {
          setSupported(results);
        }
      } catch (error) {
        console.error("Failed to get supported capabilities:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    check();

    return () => {
      mounted = false;
    };
  }, []);

  return { supported, isLoading };
}

/**
 * Hook to listen to Mini App events
 * 
 * @param event - Event type to listen for
 * @param handler - Event handler function
 * 
 * @example
 * ```tsx
 * function ContextMonitor() {
 *   const [context, setContext] = useState(null);
 *   
 *   useMiniAppEvent("miniapp:context:update", (data) => {
 *     setContext(data.context);
 *   });
 *   
 *   return <pre>{JSON.stringify(context, null, 2)}</pre>;
 * }
 * ```
 */
export function useMiniAppEvent<T extends MiniAppEventType>(
  event: T,
  handler: (data: MiniAppEventData[T]) => void
) {
  const handlerRef = useRef(handler);

  // Update ref when handler changes
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const wrappedHandler = (data: MiniAppEventData[T]) => {
      handlerRef.current(data);
    };

    const subscription = onMiniAppEvent(event, wrappedHandler);

    return () => {
      subscription.unsubscribe();
    };
  }, [event]);
}

/**
 * Hook to track Mini App visibility
 * 
 * @returns Boolean indicating if Mini App is currently visible
 * 
 * @example
 * ```tsx
 * function VisibilityIndicator() {
 *   const isVisible = useVisibility();
 *   
 *   return (
 *     <div>
 *       App is {isVisible ? "visible" : "hidden"}
 *     </div>
 *   );
 * }
 * ```
 */
export function useVisibility() {
  const [isVisible, setIsVisible] = useState(
    typeof document !== "undefined" ? document.visibilityState === "visible" : true
  );

  useMiniAppEvent("miniapp:visibility:changed", ({ visible }) => {
    setIsVisible(visible);
  });

  return isVisible;
}

/**
 * Hook to get SDK version information
 * 
 * @returns Object with SDK version info and loading state
 * 
 * @example
 * ```tsx
 * function SDKVersion() {
 *   const { version, isLoading, isCompatible } = useSDKVersion();
 *   
 *   if (isLoading) return <Spinner />;
 *   
 *   return (
 *     <div>
 *       SDK Version: {version.version}
 *       {!isCompatible && <Warning>SDK version not compatible</Warning>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useSDKVersion() {
  const [version, setVersion] = useState<SDKVersionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetch = async () => {
      try {
        const info = await getSDKVersionInfo();
        if (mounted) {
          setVersion(info);
        }
      } catch (error) {
        console.error("Failed to get SDK version:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetch();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    version,
    isLoading,
    isCompatible: version?.isCompatible ?? false,
  };
}

/**
 * Hook to check feature availability with version compatibility
 * 
 * @param feature - Feature name to check
 * @returns Object with feature availability info
 * 
 * @example
 * ```tsx
 * function QRCodeScanner() {
 *   const { available, fallbackAvailable, message } = useFeatureAvailability("qr-code");
 *   
 *   if (!available && !fallbackAvailable) {
 *     return <p>{message}</p>;
 *   }
 *   
 *   return <button onClick={scanQRCode}>Scan QR Code</button>;
 * }
 * ```
 */
export function useFeatureAvailability(feature: string) {
  const [availability, setAvailability] = useState<FeatureAvailability>({
    available: false,
    fallbackAvailable: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      try {
        const info = await checkFeatureAvailability(feature);
        if (mounted) {
          setAvailability(info);
        }
      } catch (error) {
        console.error(`Failed to check feature "${feature}":`, error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    check();

    return () => {
      mounted = false;
    };
  }, [feature]);

  return { ...availability, isLoading };
}

/**
 * Hook to get comprehensive compatibility report
 * 
 * @returns Object with compatibility report and loading state
 * 
 * @example
 * ```tsx
 * function CompatibilityReport() {
 *   const { report, isLoading } = useCompatibilityReport();
 *   
 *   if (isLoading) return <Spinner />;
 *   
 *   return (
 *     <div>
 *       <h3>SDK Version: {report.sdkVersion.version}</h3>
 *       <h4>Features</h4>
 *       {Object.entries(report.features).map(([name, info]) => (
 *         <div key={name}>
 *           {name}: {info.available ? "✅" : "❌"}
 *         </div>
 *       ))}
 *       {report.recommendations.length > 0 && (
 *         <>
 *           <h4>Recommendations</h4>
 *           <ul>
 *             {report.recommendations.map((rec, i) => (
 *               <li key={i}>{rec}</li>
 *             ))}
 *           </ul>
 *         </>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useCompatibilityReport() {
  const [report, setReport] = useState<Awaited<
    ReturnType<typeof getCompatibilityReport>
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetch = async () => {
      try {
        const reportData = await getCompatibilityReport();
        if (mounted) {
          setReport(reportData);
        }
      } catch (error) {
        console.error("Failed to get compatibility report:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetch();

    return () => {
      mounted = false;
    };
  }, []);

  return { report, isLoading };
}

/**
 * Hook for safe SDK method calls with automatic fallback
 * 
 * @returns Function to safely call SDK methods
 * 
 * @example
 * ```tsx
 * function OpenURLButton() {
 *   const safeCall = useSafeSDKCall();
 *   
 *   const handleClick = async () => {
 *     await safeCall(
 *       async () => sdk.actions.openUrl("https://example.com"),
 *       async () => window.open("https://example.com", "_blank")
 *     );
 *   };
 *   
 *   return <button onClick={handleClick}>Open URL</button>;
 * }
 * ```
 */
export function useSafeSDKCall() {
  return useCallback(
    async <T,>(
      action: () => Promise<T>,
      fallback?: () => Promise<T>
    ): Promise<T | null> => {
      try {
        return await action();
      } catch (error) {
        console.warn("SDK call failed:", error);
        if (fallback) {
          try {
            return await fallback();
          } catch (fallbackError) {
            console.error("Fallback also failed:", fallbackError);
          }
        }
        return null;
      }
    },
    []
  );
}
