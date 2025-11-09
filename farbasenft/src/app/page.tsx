
import Image from "next/image";
import Link from "next/link";

import { curatorNotes, heroDrop, trendingDrops } from "@/data/nfts";

const categoryStyles: Record<string, string> = {
  auction: "bg-purple-500/10 text-purple-300 ring-1 ring-purple-400/30",
  reserve: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/30",
  "buy-now": "bg-sky-500/10 text-sky-300 ring-1 ring-sky-400/30",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative isolate overflow-hidden">
        <Image
          src="/hero.svg"
          alt="farbasenft hero"
          fill
          priority
          className="object-cover opacity-40 mix-blend-screen"
        />
        <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 sm:px-8 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/icon.svg" alt="farbasenft icon" width={36} height={36} />
            <span className="text-lg font-semibold tracking-wide text-slate-100">
              farbasenft
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex">
            <a className="transition hover:text-white" href="#drops">
              Drops
            </a>
            <a className="transition hover:text-white" href="#curation">
              Curation
            </a>
            <a className="transition hover:text-white" href="#collect">
              Collect
            </a>
          </nav>
          <button className="rounded-full bg-slate-100 px-6 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white">
            Connect Wallet
          </button>
        </header>
        <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-20 pt-12 sm:px-8 lg:flex-row lg:items-end lg:px-10 lg:pt-20">
          <div className="max-w-xl space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Featured Auction
            </p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Curate the future of digital art.
            </h1>
            <p className="text-lg text-slate-300">
              farbasenft showcases hand-selected releases inspired by the Foundation aesthetic - complete with reserve mechanics, live bidding, and collector storytelling ready for the Base mini app ecosystem.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="#drops"
                className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-purple-500/30 transition hover:shadow-xl"
              >
                Explore Drops
              </Link>
              <a
                href="https://docs.base.org/mini-apps/quickstart/create-new-miniapp"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-slate-500 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-300 hover:text-white"
              >
                Mini App Playbook
              </a>
            </div>
            <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur">
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${categoryStyles[heroDrop.category]}`}
                >
                  {heroDrop.category}
                </span>
                <span className="text-xs text-slate-400">Ends in {heroDrop.endsIn}</span>
              </div>
              <h2 className="text-2xl font-semibold">{heroDrop.title}</h2>
              <p className="text-sm text-slate-300">by {heroDrop.artist}</p>
              <p className="text-sm text-slate-400">{heroDrop.description}</p>
              <div className="flex items-center gap-6 pt-2 text-sm">
                <div>
                  <p className="text-xs uppercase text-slate-400">Current Bid</p>
                  <p className="text-base font-semibold text-white">{heroDrop.currentBid}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-400">Reserve</p>
                  <p className="text-base font-semibold text-white">{heroDrop.reserve}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex-1">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 shadow-2xl shadow-purple-500/20 backdrop-blur">
              <Image
                src={heroDrop.image}
                alt={heroDrop.title}
                width={800}
                height={1000}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </section>
      </div>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16 sm:px-8 lg:px-10">
        <section id="drops" className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                Trending this week
              </p>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                Live auctions & reserve drops
              </h2>
            </div>
            <button className="w-full rounded-full border border-slate-600 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-white hover:text-white sm:w-auto">
              Create Artist Profile
            </button>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {trendingDrops.map((nft) => (
              <article
                key={nft.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-slate-900/60 transition hover:-translate-y-1 hover:border-white/20"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={nft.image}
                    alt={nft.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${categoryStyles[nft.category]}`}
                    >
                      {nft.category}
                    </span>
                    <span className="text-xs text-slate-400">{nft.endsIn}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{nft.title}</h3>
                    <p className="text-sm text-slate-400">by {nft.artist}</p>
                  </div>
                  <p className="text-sm text-slate-300 line-clamp-3">{nft.description}</p>
                  <div className="mt-auto flex items-center justify-between rounded-2xl bg-slate-950/60 px-4 py-3 text-sm">
                    <div>
                      <p className="text-xs uppercase text-slate-500">Current</p>
                      <p className="font-semibold text-white">{nft.currentBid}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase text-slate-500">Reserve</p>
                      <p className="font-semibold text-white">{nft.reserve}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section
          id="curation"
          className="grid gap-6 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 p-10 md:grid-cols-[2fr,3fr]"
        >
          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Curation Studio
            </p>
            <h2 className="text-3xl font-semibold text-white">
              Gallery-tier storytelling built in.
            </h2>
            <p className="text-base text-slate-300">
              Drop pages go beyond the jpeg with process journals, artist notes, and live bid history. Use the Base mini app post composer to generate capsule embeds directly in Farcaster.
            </p>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-purple-400" />
                Mint with reserve pricing, timed auctions, and collector splits.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-teal-400" />
                Schedule unveil moments and unlock content for top bidders.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-sky-400" />
                Trigger notifications through Base App when reserves get met.
              </li>
            </ul>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {curatorNotes.map((note) => (
              <div
                key={note.title}
                className="rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-purple-900/20 p-6 backdrop-blur"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {note.title}
                </p>
                <p className="mt-3 text-sm text-slate-200">{note.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="collect"
          className="overflow-hidden rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-950/90 p-10"
        >
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-200">
                Base Mini App Ready
              </p>
              <h2 className="text-3xl font-semibold text-white">
                Launch to the Base App audience in minutes.
              </h2>
              <p className="text-base text-slate-100/80">
                Follow the Base mini app quickstart to host on Vercel, sign your manifest, and ship farbasenft to collectors directly within the Base app.
              </p>
              <div className="grid gap-3 text-sm text-slate-200">
                <div className="rounded-2xl border border-indigo-400/30 bg-slate-950/60 p-4">
                  <p className="font-semibold text-white">1. Configure manifest</p>
                  <p className="text-slate-300">
                    Update `minikit.config.ts` with your signed Base account association.
                  </p>
                </div>
                <div className="rounded-2xl border border-purple-400/30 bg-slate-950/60 p-4">
                  <p className="font-semibold text-white">2. Verify on Base</p>
                  <p className="text-slate-300">
                    Push to Vercel, then use the Base account association tool to verify.
                  </p>
                </div>
                <div className="rounded-2xl border border-teal-400/30 bg-slate-950/60 p-4">
                  <p className="font-semibold text-white">3. Cast your launch</p>
                  <p className="text-slate-300">
                    Share your drop URL in Farcaster to activate rich mini app embeds.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70">
              <Image
                src="/splash.svg"
                alt="farbasenft splash art"
                width={1080}
                height={1920}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-slate-950/70 px-6 py-4 backdrop-blur">
                <div>
                  <p className="text-xs uppercase text-slate-400">Base Mini App</p>
                  <p className="text-sm font-semibold text-white">farbasenft</p>
                </div>
                <button className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900">
                  Preview
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-slate-950/90 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <div>
            <p className="text-sm font-semibold text-slate-100">farbasenft</p>
            <p className="text-xs text-slate-500">
              Crafted as a Foundation-inspired Base mini app experience.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-slate-400">
            <a
              href="https://docs.base.org/mini-apps/quickstart/create-new-miniapp"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              Base mini app quickstart
            </a>
            <a
              href="https://foundation.app"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              Reference inspiration
            </a>
            <a
              href="https://docs.base.org/mini-apps/core-concepts/manifest"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              Manifest guide
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
