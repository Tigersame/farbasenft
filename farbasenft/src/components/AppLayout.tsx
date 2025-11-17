"use client";

import { ReactNode } from "react";
import SidebarWithStore from "@/components/SidebarWithStore";
import { WalletControls } from "@/components/WalletControls";
import { BottomNavigation } from "@/components/BottomNavigation";
import { OnboardingFlow } from "@/components/OnboardingFlow";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar - hidden on mobile, visible on desktop */}
      <aside className="hidden lg:block">
        <SidebarWithStore />
      </aside>
      
      {/* Main content area */}
      <div className="flex min-h-screen w-full flex-1 flex-col">
        {/* Sticky header */}
        <header className="sticky top-0 z-40 border-b border-cyan-500/20 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900">
          <div className="mx-auto flex w-full max-w-7xl items-start justify-between gap-4 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <div className="flex-1 space-y-1.5 min-w-0">
              <h1 className="text-xl font-semibold leading-tight text-white sm:text-2xl lg:text-3xl">
                Create and share art that lives onchain
              </h1>
              <p className="hidden text-xs leading-relaxed text-slate-300 sm:block sm:text-sm lg:w-3/4">
                Curated NFT gallery, swap portal, and creator tools—all in one Base mini app.
              </p>
            </div>
            <div className="shrink-0">
              <WalletControls />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden pb-16 lg:pb-0">{children}</main>

        {/* Bottom Navigation - Mobile only */}
        <BottomNavigation />

        {/* Onboarding Flow */}
        <OnboardingFlow />

        {/* Footer */}
        <footer className="border-t border-white/5 bg-slate-950/90">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-10 lg:px-8">
            <div>
              <p className="text-base font-semibold text-white">farbasenft</p>
              <p className="mt-1 text-xs text-slate-500">Foundation-inspired gallery built for Base Mini Apps.</p>
            </div>
            <nav className="flex flex-wrap gap-4">
              <a
                href="https://warpcast.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white"
              >
                Warpcast
              </a>
              <a
                href="https://base.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white"
              >
                Base
              </a>
              <a
                href="https://github.com/coinbase/onchainkit"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white"
              >
                OnchainKit
              </a>
              <a
                href="https://docs.neynar.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white"
              >
                Neynar Docs
              </a>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}

