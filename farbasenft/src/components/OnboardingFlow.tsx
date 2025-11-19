"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

/**
 * Onboarding Flow Component
 * 
 * Follows Base Mini App product guidelines:
 * - Maximum 3 screens
 * - Succinct language and images
 * - Brief, informative explanation
 */
const onboardingScreens = [
  {
    id: 1,
    title: "Welcome to farbasenft",
    description: "Discover curated NFT drops, create your own art, and trade on Base.",
    image: "/splash.svg",
    cta: "Next",
  },
  {
    id: 2,
    title: "Trade & Collect",
    description: "List NFTs for sale and swap tokens—all in one place.",
    image: "/splash.svg",
    cta: "Next",
  },
  {
    id: 3,
    title: "Earn XP & Rewards",
    description: "Get rewarded for daily logins, trades, and NFT activity. Claim your Soulbound Token!",
    image: "/splash.svg",
    cta: "Get Started",
  },
];

export function OnboardingFlow() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { context } = useMiniKit();

  useEffect(() => {
    // Check if user has seen onboarding before
    const hasSeenOnboarding = localStorage.getItem("farbasenft_onboarding_seen");
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleNext = () => {
    if (currentScreen < onboardingScreens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      // Mark onboarding as seen
      localStorage.setItem("farbasenft_onboarding_seen", "true");
      setShowOnboarding(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("farbasenft_onboarding_seen", "true");
    setShowOnboarding(false);
  };

  if (!showOnboarding) {
    return null;
  }

  const screen = onboardingScreens[currentScreen];
  const isLastScreen = currentScreen === onboardingScreens.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 p-4">
      <div className="flex max-w-md flex-col items-center space-y-6 text-center">
        {/* Image placeholder - replace with actual onboarding images */}
        <div className="relative h-64 w-64 overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-cyan-500/20 to-purple-500/20">
          {screen.image && (
            <Image
              src={screen.image}
              alt={screen.title}
              fill
              className="object-cover"
            />
          )}
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">{screen.title}</h2>
          <p className="text-base text-slate-300">{screen.description}</p>
        </div>

        {/* Progress indicators */}
        <div className="flex gap-2">
          {onboardingScreens.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentScreen
                  ? "w-8 bg-cyan-400"
                  : "w-2 bg-slate-700"
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex w-full gap-3">
          <button
            onClick={handleSkip}
            className="flex-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            className="flex-1 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400"
          >
            {screen.cta}
          </button>
        </div>
      </div>
    </div>
  );
}

