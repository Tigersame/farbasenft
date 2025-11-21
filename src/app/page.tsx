'use client';

import { useState, useEffect, useCallback } from "react";
import { useXP } from "@/hooks/useXP";
import { useAccount } from "wagmi";

import { AppLayout } from "@/components/AppLayout";
import { XPDisplay } from "@/components/XPDisplay";
import { SBTClaim } from "@/components/SBTClaim";
import { UserProfile } from "@/components/UserProfile";
import { SIDEBAR_SECTION_EVENT } from "@/components/SidebarWithStore";
import Dashboard from "@/components/Dashboard";
import Leaderboard from "@/components/Leaderboard";
import Favorites from "@/components/Favorites";
import Portfolio from "@/components/Portfolio";
import SearchFilters from "@/components/SearchFilters";
import FarbaseMiniGallery from "@/components/FarbaseMiniGallery";

const categoryStyles: Record<string, string> = {
  auction: "bg-purple-500/10 text-purple-200 ring-1 ring-purple-400/40",
  reserve: "bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-400/40",
  "buy-now": "bg-sky-500/10 text-sky-200 ring-1 ring-sky-400/40",
};

function SectionHeading({ title, eyebrow, description }: { title: string; eyebrow?: string; description?: string }) {
  return (
    <div className="space-y-2">
      {eyebrow ? <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{eyebrow}</p> : null}
      <h2 className="text-3xl font-semibold text-white">{title}</h2>
      {description ? <p className="text-base text-slate-300">{description}</p> : null}
    </div>
  );
}

export default function Page() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showSearchFilters, setShowSearchFilters] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{ section: string }>;
      const section = customEvent.detail?.section;
      if (section) {
        setActiveSection(section);
      } else {
        setActiveSection(null);
      }
    };
    window.addEventListener(SIDEBAR_SECTION_EVENT, handler as EventListener);
    return () => {
      window.removeEventListener(SIDEBAR_SECTION_EVENT, handler as EventListener);
    };
  }, []);

  // Sync activeSection with URL hash changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove # prefix
      
      // Map hashes to section names
      const hashMap: Record<string, string | null> = {
        "dashboard": "dashboard",
        "": null,
        "gallery": "gallery",
        "farbasemint-gallery": "gallery",
        "mint": "mint",
        "nft-experience": "mint",
        "profile": "profile",
      };
      
      const section = hashMap[hash] || null;
      setActiveSection(section);
      
      // Scroll to section if it exists
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      }
    };
    
    // Call on initial load to sync with current hash
    handleHashChange();
    
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const { addXP } = useXP();

  // Determine what to show based on active section
  // Default (null) shows all sections except dashboard
  const showDashboard = activeSection === "dashboard";
  const showGallery = activeSection === null || activeSection === "gallery";
  const showNFTExperience = activeSection === null || activeSection === "nft-experience" || activeSection === "mint" || activeSection === "buy" || activeSection === "sell" || activeSection === "listings";
  const showProfile = activeSection === null || activeSection === "profile" || !showDashboard;
  const showLeaderboard = activeSection === "leaderboard";
  const showFavorites = activeSection === "favorites";
  const showPortfolio = activeSection === "portfolio";

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-7xl space-y-10 px-6 py-12 sm:px-8 lg:px-10">
        {/* Dashboard Section - Full page, hides other content */}
        {showDashboard && (
          <section id="dashboard" className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <Dashboard />
          </section>
        )}

        {/* All other content hidden when dashboard is active */}
        {!showDashboard && (
          <>
            {/* Gallery Section - FarbaseMiniGallery */}
            {showGallery && (
              <section id="gallery" className="space-y-4">
                <FarbaseMiniGallery />
              </section>
            )}

            {/* User Profile - Always visible when not on Dashboard */}
            {showProfile && (
              <section id="profile" className="space-y-4">
                <UserProfile />
              </section>
            )}

            {/* XP System Section - Always visible when not on Dashboard */}
            <section className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <XPDisplay />
                <SBTClaim />
              </div>
            </section>

            {/* Swap Portal removed for Mini App */}

            {/* NFT Experience section removed for Mini App */}

            {/* Leaderboard Section */}
            {showLeaderboard && (
              <section className="space-y-6" id="leaderboard">
                <Leaderboard />
              </section>
            )}

            {/* Favorites Section */}
            {showFavorites && (
              <section className="space-y-6" id="favorites">
                <Favorites />
              </section>
            )}

            {/* Portfolio Section */}
            {showPortfolio && (
              <section className="space-y-6" id="portfolio">
                <Portfolio />
              </section>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
