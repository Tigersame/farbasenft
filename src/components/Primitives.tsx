"use client";

import type { ReactNode } from "react";

export function Danger({ children }: { children: ReactNode }) {
  return (
    <div className="my-4 flex gap-3 overflow-hidden rounded-2xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-sm text-red-100">
      <div className="mt-0.5 h-4 w-4 text-red-400">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden className="h-4 w-4">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7 1.3C10.14 1.3 12.7 3.86 12.7 7C12.7 10.14 10.14 12.7 7 12.7C5.48908 12.6974 4.0408 12.096 2.97241 11.0276C1.90403 9.9592 1.30264 8.51092 1.3 7C1.3 3.86 3.86 1.3 7 1.3ZM7 0C3.14 0 0 3.14 0 7C0 10.86 3.14 14 7 14C10.86 14 14 10.86 14 7C14 3.14 10.86 0 7 0ZM8 3H6V8H8V3ZM8 9H6V11H8V9Z"
          />
        </svg>
      </div>
      <div className="min-w-0 text-sm text-red-100">{children}</div>
    </div>
  );
}

export function Tip({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`my-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-100 ${className}`}
    >
      {children}
    </div>
  );
}

export function Warning({ children }: { children: ReactNode }) {
  return (
    <div className="my-4 rounded-2xl border border-amber-400/40 bg-amber-500/10 px-5 py-4 text-sm text-amber-100">
      {children}
    </div>
  );
}

export function Info({ children }: { children: ReactNode }) {
  return (
    <div className="my-4 rounded-2xl border border-sky-400/30 bg-sky-500/10 px-5 py-4 text-sm text-sky-100">
      {children}
    </div>
  );
}
