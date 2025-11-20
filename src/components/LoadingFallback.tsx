"use client";

/**
 * Loading fallback with skeleton state
 * Used during initial app load to prevent blank page
 * Follows Farcaster best practice: use skeleton states for smooth loading
 */
export function LoadingFallback() {
  return (
    <div className="min-h-screen bg-slate-950 p-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-6 animate-pulse">
        <div className="h-8 w-32 bg-slate-800 rounded"></div>
        <div className="h-10 w-40 bg-slate-800 rounded-full"></div>
      </div>

      {/* Main content skeleton */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero section skeleton */}
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-slate-800 rounded"></div>
          <div className="h-10 w-96 bg-slate-800 rounded"></div>
          <div className="h-4 w-64 bg-slate-800 rounded"></div>
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse space-y-3">
              <div className="aspect-square bg-slate-800 rounded-xl"></div>
              <div className="h-4 bg-slate-800 rounded"></div>
              <div className="h-3 w-2/3 bg-slate-800 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading indicator */}
      <div className="fixed bottom-4 right-4">
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-full px-4 py-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-500"></div>
          <span className="text-slate-400 text-sm">Loading...</span>
        </div>
      </div>
    </div>
  );
}

