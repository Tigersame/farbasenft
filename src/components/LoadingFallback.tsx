"use client";

export function LoadingFallback() {
  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-50">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
        <p className="text-slate-400 text-sm">Loading farbasenft...</p>
      </div>
    </div>
  );
}
