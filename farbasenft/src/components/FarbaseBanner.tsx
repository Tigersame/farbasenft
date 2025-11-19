'use client';

import { useState } from 'react';

export function FarbaseBanner() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="w-full bg-linear-to-r from-blue-950 via-blue-900 to-blue-950 border-b border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 relative">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-cyan-400/60 hover:text-cyan-300 transition"
          title="Close banner"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Banner content */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          {/* Farbase logo icon */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-cyan-400 flex items-center justify-center bg-cyan-900/30 shadow-lg shadow-cyan-500/30">
              <span className="text-cyan-300 font-bold text-2xl sm:text-3xl">f</span>
            </div>
          </div>

          {/* Banner text */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-300 mb-2">
              Welcome to Farbase
            </h2>
            <p className="text-cyan-200/80 text-sm sm:text-base md:text-lg max-w-2xl">
              Mint NFTs, earn XP, claim Soulbound Tokens, and trade on Base. Join the community and start your Web3 journey today.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex-shrink-0">
            <button className="px-6 sm:px-8 py-2 sm:py-3 bg-linear-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 text-blue-950 font-bold rounded-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition whitespace-nowrap">
              Get Started
            </button>
          </div>
        </div>

        {/* Decorative gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-cyan-500/50 to-transparent" />
      </div>
    </div>
  );
}
