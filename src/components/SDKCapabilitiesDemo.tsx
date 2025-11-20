"use client";

import { useState } from "react";
import {
  useCapability,
  useCapabilities,
  useSupportedCapabilities,
  useMiniAppEvent,
  useVisibility,
  useSDKVersion,
  useFeatureAvailability,
  useCompatibilityReport,
  useSafeSDKCall,
} from "@/hooks/useMiniAppSDK";
import { useMiniAppContext } from "@/lib/useMiniAppContext";

/**
 * SDK Capabilities Demo Component
 * 
 * Demonstrates:
 * - Capability detection
 * - Event handling
 * - Version compatibility
 * - isInMiniApp detection
 * 
 * Reference:
 * - https://miniapps.farcaster.xyz/docs/sdk/detecting-capabilities
 * - https://miniapps.farcaster.xyz/docs/sdk/is-in-mini-app
 * - https://miniapps.farcaster.xyz/docs/sdk/events
 * - https://miniapps.farcaster.xyz/docs/sdk/compatibility
 */
export function SDKCapabilitiesDemo() {
  const [activeTab, setActiveTab] = useState<"context" | "capabilities" | "events" | "compatibility">("context");

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-100">
            Farcaster Mini App SDK Demo
          </h1>
          <p className="text-slate-400">
            Comprehensive SDK feature detection and testing
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: "context", label: "Context & Detection" },
            { id: "capabilities", label: "Capabilities" },
            { id: "events", label: "Events" },
            { id: "compatibility", label: "Compatibility" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-cyan-500 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-slate-900 rounded-xl p-6">
          {activeTab === "context" && <ContextTab />}
          {activeTab === "capabilities" && <CapabilitiesTab />}
          {activeTab === "events" && <EventsTab />}
          {activeTab === "compatibility" && <CompatibilityTab />}
        </div>
      </div>
    </div>
  );
}

/**
 * Context & isInMiniApp Detection Tab
 */
function ContextTab() {
  const { sdk, isInMiniApp, isLoading, context, user, client, location } = useMiniAppContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-4">
          Mini App Context Detection
        </h2>
        <p className="text-slate-400 text-sm mb-4">
          Reference: <a href="https://miniapps.farcaster.xyz/docs/sdk/is-in-mini-app" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
            https://miniapps.farcaster.xyz/docs/sdk/is-in-mini-app
          </a>
        </p>
      </div>

      {/* isInMiniApp Status */}
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <span className={`text-2xl ${isInMiniApp ? "text-green-400" : "text-yellow-400"}`}>
            {isInMiniApp ? "✅" : "ℹ️"}
          </span>
          <div>
            <h3 className="text-lg font-semibold text-slate-100">
              {isInMiniApp ? "Running in Mini App" : "Running in Browser"}
            </h3>
            <p className="text-sm text-slate-400">
              {isInMiniApp 
                ? "Detected Farcaster Mini App environment"
                : "Not in Farcaster Mini App context"
              }
            </p>
          </div>
        </div>
        <code className="block text-xs text-slate-500 mt-2">
          sdk.isInMiniApp() → {isInMiniApp.toString()}
        </code>
      </div>

      {/* User Context */}
      {user && (
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-slate-100 mb-3">User Context</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3">
              {user.pfpUrl && (
                <img src={user.pfpUrl} alt="Profile" className="w-10 h-10 rounded-full" />
              )}
              <div>
                <p className="text-slate-100 font-medium">{user.displayName || user.username}</p>
                <p className="text-slate-400">@{user.username} • FID: {user.fid}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Client Info */}
      {client && (
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-slate-100 mb-3">Client Info</h3>
          <div className="space-y-1 text-sm">
            <p className="text-slate-300">Name: <span className="text-cyan-400">{(client as any).name || "Unknown"}</span></p>
            {(client as any).version && (
              <p className="text-slate-300">Version: <span className="text-cyan-400">{(client as any).version}</span></p>
            )}
            {(client as any).platform && (
              <p className="text-slate-300">Platform: <span className="text-cyan-400">{(client as any).platform}</span></p>
            )}
          </div>
        </div>
      )}

      {/* Location */}
      {location && (
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-slate-100 mb-3">Location Context</h3>
          <pre className="text-xs text-slate-300 overflow-auto">
            {JSON.stringify(location, null, 2)}
          </pre>
        </div>
      )}

      {/* Full Context (Debug) */}
      <details className="bg-slate-800 rounded-lg p-4">
        <summary className="text-slate-100 font-medium cursor-pointer">
          Full Context (Debug)
        </summary>
        <pre className="mt-3 text-xs text-slate-300 overflow-auto">
          {JSON.stringify(context, null, 2)}
        </pre>
      </details>
    </div>
  );
}

/**
 * Capabilities Detection Tab
 */
function CapabilitiesTab() {
  const { supported, isLoading } = useSupportedCapabilities();
  const { capabilities: coreCapabilities } = useCapabilities([
    "ethereum-provider",
    "notifications",
    "share-url",
    "open-url",
  ]);
  const { isInMiniApp } = useMiniAppContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-4">
          Capability Detection
        </h2>
        <p className="text-slate-400 text-sm mb-4">
          Reference: <a href="https://miniapps.farcaster.xyz/docs/sdk/detecting-capabilities" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
            https://miniapps.farcaster.xyz/docs/sdk/detecting-capabilities
          </a>
        </p>
      </div>

      {/* Browser Mode Warning */}
      {!isInMiniApp && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                Running in Browser Mode
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                You're currently viewing this app in a web browser, not in a Farcaster Mini App context.
                All capabilities will show as unsupported because Mini App features are only available
                when running inside Warpcast or the Base app.
              </p>
              <p className="text-sm text-slate-400">
                <strong>To test capabilities:</strong> Deploy this app and open it in Warpcast using:
                <code className="block mt-2 px-3 py-2 bg-slate-900 rounded text-cyan-400 text-xs">
                  https://warpcast.com/~/miniapp?url=https://your-app.vercel.app/sdk-demo
                </code>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Core Capabilities */}
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-slate-100 mb-3">Core Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(coreCapabilities).map(([capability, isSupported]) => (
            <CapabilityCard key={capability} capability={capability} supported={isSupported} />
          ))}
        </div>
      </div>

      {/* All Supported Capabilities */}
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-slate-100 mb-3">
          All Supported Capabilities ({supported.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {supported.map((cap) => (
            <span
              key={cap}
              className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium"
            >
              {cap}
            </span>
          ))}
        </div>
        {supported.length === 0 && (
          <div className="space-y-2">
            <p className="text-slate-400 text-sm">No capabilities detected</p>
            {!isInMiniApp && (
              <p className="text-slate-500 text-xs">
                Capabilities are only available in Farcaster Mini App context
              </p>
            )}
          </div>
        )}
      </div>

      {/* Version Requirements Info */}
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-slate-100 mb-3">Feature Version Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Basic Features</span>
            <span className="text-cyan-400">SDK 0.1.0+</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">• ethereum-provider</span>
            <span className="text-slate-500">0.1.0+</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">• notifications</span>
            <span className="text-slate-500">0.1.0+</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">• share-url</span>
            <span className="text-slate-500">0.1.0+</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">• open-url</span>
            <span className="text-slate-500">0.1.0+</span>
          </div>
          
          <div className="flex justify-between col-span-full mt-2">
            <span className="text-slate-400">Advanced Features</span>
            <span className="text-cyan-400">SDK 0.2.0+</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">• qr-code</span>
            <span className="text-slate-500">0.2.0+</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">• clipboard</span>
            <span className="text-slate-500">0.2.0+</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">• haptics</span>
            <span className="text-slate-500">0.2.0+</span>
          </div>
          
          <div className="flex justify-between col-span-full mt-2">
            <span className="text-slate-400">Future Features</span>
            <span className="text-cyan-400">SDK 0.3.0+</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">• biometrics</span>
            <span className="text-yellow-400">0.3.0+</span>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Note: Even if your SDK version supports a feature, it may not be available in all Farcaster clients.
        </p>
      </div>
    </div>
  );
}

/**
 * Capability Card Component
 */
function CapabilityCard({ capability, supported }: { capability: string; supported: boolean }) {
  return (
    <div className={`p-3 rounded-lg ${supported ? "bg-green-500/10" : "bg-slate-700/50"}`}>
      <div className="flex items-center gap-2">
        <span className={supported ? "text-green-400" : "text-slate-500"}>
          {supported ? "✅" : "❌"}
        </span>
        <span className={`text-sm font-medium ${supported ? "text-slate-100" : "text-slate-400"}`}>
          {capability}
        </span>
      </div>
    </div>
  );
}

/**
 * Events Tab
 */
function EventsTab() {
  const [events, setEvents] = useState<Array<{ type: string; data: any; timestamp: number }>>([]);
  const isVisible = useVisibility();

  // Listen to multiple events
  useMiniAppEvent("miniapp:context:update", (data) => {
    setEvents((prev) => [...prev, { type: "context:update", data, timestamp: Date.now() }]);
  });

  useMiniAppEvent("miniapp:visibility:changed", (data) => {
    setEvents((prev) => [...prev, { type: "visibility:changed", data, timestamp: Date.now() }]);
  });

  useMiniAppEvent("miniapp:theme:changed", (data) => {
    setEvents((prev) => [...prev, { type: "theme:changed", data, timestamp: Date.now() }]);
  });

  useMiniAppEvent("miniapp:error", (data) => {
    setEvents((prev) => [...prev, { type: "error", data, timestamp: Date.now() }]);
  });

  const clearEvents = () => setEvents([]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-4">
          Event System
        </h2>
        <p className="text-slate-400 text-sm mb-4">
          Reference: <a href="https://miniapps.farcaster.xyz/docs/sdk/events" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
            https://miniapps.farcaster.xyz/docs/sdk/events
          </a>
        </p>
      </div>

      {/* Visibility Status */}
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-slate-100 mb-2">Current State</h3>
        <p className="text-sm text-slate-300">
          Visibility: <span className={isVisible ? "text-green-400" : "text-yellow-400"}>
            {isVisible ? "Visible ✅" : "Hidden 👁️"}
          </span>
        </p>
      </div>

      {/* Event Log */}
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-100">
            Event Log ({events.length})
          </h3>
          <button
            onClick={clearEvents}
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-sm"
          >
            Clear
          </button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {events.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">
              No events captured yet. Try switching tabs or minimizing the app.
            </p>
          ) : (
            events.map((event, i) => (
              <div key={i} className="bg-slate-900 rounded p-3 text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-cyan-400">{event.type}</span>
                  <span className="text-xs text-slate-500">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <pre className="text-xs text-slate-400 overflow-auto">
                  {JSON.stringify(event.data, null, 2)}
                </pre>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Compatibility Tab
 */
function CompatibilityTab() {
  const { version, isLoading: versionLoading, isCompatible } = useSDKVersion();
  const { report, isLoading: reportLoading } = useCompatibilityReport();

  if (versionLoading || reportLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-4">
          SDK Compatibility
        </h2>
        <p className="text-slate-400 text-sm mb-4">
          Reference: <a href="https://miniapps.farcaster.xyz/docs/sdk/compatibility" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
            https://miniapps.farcaster.xyz/docs/sdk/compatibility
          </a>
        </p>
      </div>

      {/* SDK Version */}
      {version && (
        <div className={`rounded-lg p-4 ${isCompatible ? "bg-green-500/10" : "bg-yellow-500/10"}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{isCompatible ? "✅" : "⚠️"}</span>
            <div>
              <h3 className="text-lg font-semibold text-slate-100">
                SDK Version {version.version}
              </h3>
              <p className="text-sm text-slate-400">
                {isCompatible ? "Compatible with farbasenft" : "May have limited functionality"}
              </p>
            </div>
          </div>
          <div className="mt-3 text-sm text-slate-300">
            <p>Major: {version.major} • Minor: {version.minor} • Patch: {version.patch}</p>
          </div>
        </div>
      )}

      {/* Feature Compatibility */}
      {report && (
        <>
          <div className="bg-slate-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-100 mb-3">Feature Compatibility</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(report.features).map(([feature, info]) => (
                <div key={feature} className="flex items-center gap-2 text-sm">
                  <span className={info.available ? "text-green-400" : info.fallbackAvailable ? "text-yellow-400" : "text-slate-500"}>
                    {info.available ? "✅" : info.fallbackAvailable ? "⚠️" : "❌"}
                  </span>
                  <span className="text-slate-300">{feature}</span>
                  {info.minVersion && (
                    <span className="text-xs text-slate-500">({info.minVersion}+)</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {report.recommendations.length > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-400 mb-3">Recommendations</h3>
              <ul className="space-y-2">
                {report.recommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SDKCapabilitiesDemo;
