/**
 * Farcaster Mini App SDK Event Handling
 * 
 * Reference: https://miniapps.farcaster.xyz/docs/sdk/events
 * 
 * Listen to and handle Mini App lifecycle events.
 */

import { sdk } from "@farcaster/miniapp-sdk";

/**
 * Mini App event types
 */
export type MiniAppEventType =
  | "miniapp:ready"              // Mini App initialized
  | "miniapp:context:update"     // Context changed (user switched accounts, etc.)
  | "miniapp:location:changed"   // Navigation within Mini App
  | "miniapp:visibility:changed" // App became visible/hidden
  | "miniapp:theme:changed"      // Theme changed (light/dark)
  | "miniapp:notification"       // Notification received
  | "miniapp:wallet:connected"   // Wallet connected
  | "miniapp:wallet:disconnected" // Wallet disconnected
  | "miniapp:error";             // Error occurred

/**
 * Event listener callback type
 */
export type MiniAppEventListener<T = any> = (data: T) => void;

/**
 * Event subscription
 */
export interface EventSubscription {
  unsubscribe: () => void;
}

/**
 * Event data types for each event
 */
export interface MiniAppEventData {
  "miniapp:ready": { timestamp: number };
  "miniapp:context:update": { context: Awaited<typeof sdk.context> };
  "miniapp:location:changed": { location: any };
  "miniapp:visibility:changed": { visible: boolean };
  "miniapp:theme:changed": { theme: "light" | "dark" };
  "miniapp:notification": { notification: any };
  "miniapp:wallet:connected": { address: string };
  "miniapp:wallet:disconnected": { address?: string };
  "miniapp:error": { error: Error; context?: any };
}

/**
 * Event emitter for Mini App events
 */
class MiniAppEventEmitter {
  private listeners: Map<MiniAppEventType, Set<MiniAppEventListener>> = new Map();
  private initialized = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.initialize();
    }
  }

  private initialize() {
    if (this.initialized) return;
    this.initialized = true;

    // Listen for SDK-level events if available
    this.setupSDKListeners();
  }

  private async setupSDKListeners() {
    try {
      const inMiniApp = await sdk.isInMiniApp().catch(() => false);
      if (!inMiniApp) return;

      // Set up context change listener
      this.setupContextListener();

      // Set up visibility change listener
      this.setupVisibilityListener();

      // Set up theme change listener
      this.setupThemeListener();
    } catch (error) {
      console.warn("Failed to set up SDK listeners:", error);
    }
  }

  private setupContextListener() {
    // Listen for context updates from SDK
    // Note: SDK events may vary by version
    try {
      if (typeof (sdk as any).on === "function") {
        (sdk as any).on("context:update", (context: any) => {
          this.emit("miniapp:context:update", { context });
        });
      }
    } catch (error) {
      console.warn("Failed to set up context listener:", error);
    }
  }

  private setupVisibilityListener() {
    // Listen for visibility changes
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", () => {
        const visible = document.visibilityState === "visible";
        this.emit("miniapp:visibility:changed", { visible });
      });
    }
  }

  private setupThemeListener() {
    // Listen for theme changes
    if (typeof window !== "undefined" && window.matchMedia) {
      const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
      darkModeQuery.addEventListener("change", (e) => {
        this.emit("miniapp:theme:changed", {
          theme: e.matches ? "dark" : "light",
        });
      });
    }
  }

  /**
   * Add event listener
   */
  on<T extends MiniAppEventType>(
    event: T,
    listener: MiniAppEventListener<MiniAppEventData[T]>
  ): EventSubscription {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(listener);

    return {
      unsubscribe: () => this.off(event, listener),
    };
  }

  /**
   * Remove event listener
   */
  off<T extends MiniAppEventType>(
    event: T,
    listener: MiniAppEventListener<MiniAppEventData[T]>
  ): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(listener);
    }
  }

  /**
   * Add one-time event listener
   */
  once<T extends MiniAppEventType>(
    event: T,
    listener: MiniAppEventListener<MiniAppEventData[T]>
  ): EventSubscription {
    const wrappedListener: MiniAppEventListener<MiniAppEventData[T]> = (data) => {
      listener(data);
      this.off(event, wrappedListener);
    };

    return this.on(event, wrappedListener);
  }

  /**
   * Emit event to all listeners
   */
  emit<T extends MiniAppEventType>(event: T, data: MiniAppEventData[T]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((listener) => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in event listener for "${event}":`, error);
        }
      });
    }
  }

  /**
   * Remove all listeners for an event
   */
  removeAllListeners(event?: MiniAppEventType): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Get listener count for an event
   */
  listenerCount(event: MiniAppEventType): number {
    return this.listeners.get(event)?.size || 0;
  }
}

/**
 * Global event emitter instance
 */
export const miniAppEvents = new MiniAppEventEmitter();

/**
 * Subscribe to Mini App events
 * 
 * @param event - Event type to listen for
 * @param listener - Callback function
 * @returns Subscription object with unsubscribe method
 * 
 * @example
 * ```typescript
 * const subscription = onMiniAppEvent("miniapp:context:update", (data) => {
 *   console.log("Context updated:", data.context);
 * });
 * 
 * // Later: unsubscribe
 * subscription.unsubscribe();
 * ```
 */
export function onMiniAppEvent<T extends MiniAppEventType>(
  event: T,
  listener: MiniAppEventListener<MiniAppEventData[T]>
): EventSubscription {
  return miniAppEvents.on(event, listener);
}

/**
 * Subscribe to Mini App event once
 * 
 * @param event - Event type to listen for
 * @param listener - Callback function (called only once)
 * @returns Subscription object
 */
export function onceMiniAppEvent<T extends MiniAppEventType>(
  event: T,
  listener: MiniAppEventListener<MiniAppEventData[T]>
): EventSubscription {
  return miniAppEvents.once(event, listener);
}

/**
 * Emit Mini App event
 * 
 * @param event - Event type to emit
 * @param data - Event data
 */
export function emitMiniAppEvent<T extends MiniAppEventType>(
  event: T,
  data: MiniAppEventData[T]
): void {
  miniAppEvents.emit(event, data);
}

/**
 * Remove event listener
 * 
 * @param event - Event type
 * @param listener - Listener to remove
 */
export function offMiniAppEvent<T extends MiniAppEventType>(
  event: T,
  listener: MiniAppEventListener<MiniAppEventData[T]>
): void {
  miniAppEvents.off(event, listener);
}

/**
 * Wait for an event to occur
 * 
 * @param event - Event type to wait for
 * @param timeout - Optional timeout in milliseconds
 * @returns Promise resolving to event data
 * 
 * @example
 * ```typescript
 * try {
 *   const data = await waitForEvent("miniapp:wallet:connected", 5000);
 *   console.log("Wallet connected:", data.address);
 * } catch (error) {
 *   console.log("Timeout: wallet not connected within 5 seconds");
 * }
 * ```
 */
export function waitForEvent<T extends MiniAppEventType>(
  event: T,
  timeout?: number
): Promise<MiniAppEventData[T]> {
  return new Promise((resolve, reject) => {
    let subscription: EventSubscription;
    let timeoutId: NodeJS.Timeout;

    const cleanup = () => {
      if (subscription) subscription.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };

    subscription = onceMiniAppEvent(event, (data) => {
      cleanup();
      resolve(data);
    });

    if (timeout) {
      timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error(`Timeout waiting for event "${event}"`));
      }, timeout);
    }
  });
}

/**
 * Emit error event with context
 * 
 * @param error - Error object
 * @param context - Optional context information
 */
export function emitError(error: Error, context?: any): void {
  emitMiniAppEvent("miniapp:error", { error, context });
  console.error("Mini App Error:", error, context);
}

/**
 * Listen for errors
 * 
 * @param listener - Error handler
 * @returns Subscription object
 */
export function onError(
  listener: (data: { error: Error; context?: any }) => void
): EventSubscription {
  return onMiniAppEvent("miniapp:error", listener);
}
