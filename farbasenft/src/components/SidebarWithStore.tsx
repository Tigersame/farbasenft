"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type StoredItem = {
  id: number;
  label: string;
  url: string;
  icon: string;
};

type StaticLink =
  | {
      id: string;
      label: string;
      href: string;
      icon: React.ReactElement;
      panel?: never;
      section?: never;
    }
  | {
      id: string;
      label: string;
      href?: string;
      icon: React.ReactElement;
      panel: string;
      section?: never;
    }
  | {
      id: string;
      label: string;
      href?: string;
      icon: React.ReactElement;
      section: string;
      panel?: never;
    };

function IconShell({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-5 w-5 flex-none items-center justify-center rounded-xl bg-white/10 text-[10px] text-slate-200 transition group-hover:bg-white/15 group-hover:text-white">
      {children}
    </span>
  );
}

function GalleryIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m3 14 3-3 3 3 4-4 5 5" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M16.862 3.487a2.1 2.1 0 0 1 2.97 2.97L9.38 16.909l-3.887.917.917-3.887 10.452-10.452Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 8.25 15.75 4.5" />
    </svg>
  );
}

function BuyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 4.5h-3l1.5 9h12l1.5-6h-11" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    </svg>
  );
}

function SellIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15.75 3h2.25A2.25 2.25 0 0 1 20.25 5.25v2.25m-6-4.5H8.25A2.25 2.25 0 0 0 6 5.25v10.5A2.25 2.25 0 0 0 8.25 18h2.25m9.75-10.5v10.5A2.25 2.25 0 0 1 18 20.25H11.25m9-12-9 12m0 0H15"
      />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 6h15M4.5 12h15M4.5 18h9" />
    </svg>
  );
}

function SwapIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 7.5h11.25l-3-3M19.5 16.5H8.25l3 3" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="m21 21-3.5-3.5m1-4.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
      />
    </svg>
  );
}

function NetworkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M5.25 6.75a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm10.5 10.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM6.75 6.75 12 12l-2.25 2.25M12 12l5.25-3M12 12v6"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 5v14M5 12h14" />
    </svg>
  );
}

export const SIDEBAR_PANEL_EVENT = "farbasenft-sidebar-panel";
export const SIDEBAR_SECTION_EVENT = "farbasenft-sidebar-section";
const STORAGE_KEY = "sidebar-items";

export default function SidebarWithStore() {
  const [items, setItems] = useState<StoredItem[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored) as StoredItem[]);
      }
    } catch {
      // no-op
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // no-op
    }
  }, [items]);

  const staticLinks: StaticLink[] = useMemo(
    () => [
      { id: "nft", label: "NFT Gallery", section: "gallery", icon: <GalleryIcon /> },
      { id: "nft-mint", label: "Mint NFT", section: "mint", icon: <PenIcon /> },
      { id: "nft-buy", label: "Buy NFT", section: "buy", icon: <BuyIcon /> },
      { id: "nft-sell", label: "Sell NFT", section: "sell", icon: <SellIcon /> },
      { id: "nft-list", label: "Listings", section: "listings", icon: <ListIcon /> },
      { id: "nft-swap", label: "Swap", section: "swap", icon: <SwapIcon /> },
      { id: "nft-search", label: "Search", section: "marketplace", icon: <SearchIcon /> },
    ],
    [],
  );

  function handlePanelSelect(panel: string, fallbackHref?: string) {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent<{ panel: string }>(SIDEBAR_PANEL_EVENT, {
        detail: { panel },
      }),
    );
    if (fallbackHref) {
      window.location.hash = fallbackHref.replace("#", "") || "nft-experience";
    } else {
      window.location.hash = "nft-experience";
    }
  }

  function handleSectionSelect(section: string) {
    if (typeof window === "undefined") return;
    // Dispatch section event for page-level filtering
    window.dispatchEvent(
      new CustomEvent<{ section: string }>(SIDEBAR_SECTION_EVENT, {
        detail: { section },
      }),
    );
    
    // Also dispatch panel event for NFT actions that need panel switching
    if (section === "mint" || section === "buy" || section === "sell" || section === "listings") {
      const panelMap: Record<string, string> = {
        mint: "mint",
        buy: "buy",
        sell: "list",
        listings: "list",
      };
      window.dispatchEvent(
        new CustomEvent<{ panel: string }>(SIDEBAR_PANEL_EVENT, {
          detail: { panel: panelMap[section] },
        }),
      );
      window.location.hash = "nft-experience";
    } else if (section === "swap") {
      window.location.hash = "swap-portal";
    } else if (section === "marketplace") {
      window.location.hash = "marketplace";
    } else if (section === "gallery") {
      window.location.hash = "";
    }
  }

  function handleAdd() {
    if (typeof window === "undefined") return;
    const labelPrompt = window.prompt("Label for quick link?");
    const cleanLabel = labelPrompt?.trim();
    if (!cleanLabel) {
      return;
    }
    const urlPrompt = window.prompt("URL or hash (optional)?", "#");
    const cleanUrl = urlPrompt?.trim() ?? "#";
    setItems((prev) => [
      {
        id: Date.now(),
        label: cleanLabel,
        url: cleanUrl,
        icon: cleanLabel.charAt(0).toUpperCase(),
      },
      ...prev.slice(0, 8),
    ]);
  }

  function handleRemove(id: number) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col justify-between border-r border-white/10 bg-slate-950/90 px-5 pb-6 pt-6 backdrop-blur">
      <div className="flex flex-col gap-6">
        <button
          type="button"
          onClick={() => handleSectionSelect("gallery")}
          className="group flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-slate-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          title="farbasenft"
        >
          <span className="flex h-5 w-5 flex-none items-center justify-center rounded-xl bg-white/10 text-[8px] font-semibold group-hover:bg-white/15 group-hover:text-white leading-none">
            FB
          </span>
          <span className="truncate tracking-[0.2em]">farbasenft</span>
        </button>
        <nav className="flex flex-col gap-2">
          <p className="px-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Primary</p>
          {staticLinks.map((link) => {
            const sharedClasses =
              "group flex w-full items-center gap-3 rounded-3xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-slate-900/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";
            if (link.section) {
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleSectionSelect(link.section)}
                  className={sharedClasses}
                  aria-label={link.label}
                >
                  <IconShell>{link.icon}</IconShell>
                  <span className="truncate">{link.label}</span>
                </button>
              );
            }
            if (link.panel) {
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handlePanelSelect(link.panel, link.href)}
                  className={sharedClasses}
                  aria-label={link.label}
                >
                  <IconShell>{link.icon}</IconShell>
                  <span className="truncate">{link.label}</span>
                </button>
              );
            }
            return (
              <Link key={link.id} href={link.href || "#"} className={sharedClasses} aria-label={link.label}>
                <IconShell>{link.icon}</IconShell>
                <span className="truncate">{link.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="h-px w-full bg-white/10" />
        <nav className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-2 text-xs uppercase tracking-[0.3em] text-slate-500">
            <span>Quick Links</span>
            <span className="text-[10px] font-semibold text-slate-600">Right-click to remove</span>
          </div>
          {items.length === 0 ? (
            <p className="px-4 py-3 text-xs text-slate-500">
              Add shortcuts for contracts, dashboards, or reference docs. They stay saved locally.
            </p>
          ) : (
            items.map((item) => (
              <a
                key={item.id}
                href={item.url || "#"}
                className="group flex w-full items-center gap-3 rounded-3xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-slate-900/70 hover:text-white"
                onContextMenu={(event) => {
                  event.preventDefault();
                  handleRemove(item.id);
                }}
                target={item.url?.startsWith("http") ? "_blank" : undefined}
                rel={item.url?.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                <span className="flex h-5 w-5 flex-none items-center justify-center rounded-xl border border-white/15 bg-white/5 text-[10px] font-semibold text-slate-200 group-hover:border-white/30 group-hover:bg-white/15 group-hover:text-white">
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <p className="truncate">{item.label}</p>
                  <p className="truncate text-xs font-normal text-slate-400">{item.url || "#nft-experience"}</p>
                </div>
              </a>
            ))
          )}
        </nav>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="flex w-full items-center justify-center gap-2 rounded-3xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/60 hover:bg-cyan-400/10 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-xl bg-white/10 text-[10px] text-slate-200">
          <PlusIcon />
        </span>
        <span>Add quick link</span>
      </button>
    </aside>
  );
}

