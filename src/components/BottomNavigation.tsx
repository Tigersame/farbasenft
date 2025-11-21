"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Bottom Navigation Bar
 * 
 * Follows Base Mini App design guidelines:
 * - Bottom navigation for mobile
 * - Labels under icons
 * - Touch targets at least 44px
 * - Clear primary actions
 */
const navItems = [
  {
    id: "gallery",
    label: "Gallery",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    href: "/#gallery",
  },
  {
    id: "swap",
    label: "Swap",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    href: "/#swap-portal",
  },
  {
    id: "profile",
    label: "Profile",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    href: "/#profile",
  },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const handleClick = (itemId: string, href: string) => {
    setActiveItem(itemId);
    if (href.startsWith("/#")) {
      // Handle hash navigation - remove leading /
      const hash = href.substring(1);
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-slate-950/95 backdrop-blur-sm lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = activeItem === item.id || pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => handleClick(item.id, item.href)}
              className={`flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-colors ${
                isActive
                  ? "text-cyan-400"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className={isActive ? "text-cyan-400" : "text-slate-400"}>
                {item.icon}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

