import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/landing/site-nav";

export const metadata: Metadata = {
  title: "What If? — TiltShield",
  description:
    "Stress-test income loss, bank outage, phone loss, and supply disruption before they happen.",
};

const SCENARIOS = [
  { t: "Income stops tomorrow", d: "How many days of essential spend remain?" },
  { t: "Bank unavailable 72 hours", d: "Cards, transfers, deposits — what still works?" },
  { t: "Phone is gone", d: "2FA, banking apps, contacts, travel — access key or liability?" },
  { t: "Local food disruption", d: "Days of food you already eat, on the shelf." },
];

export default function WhatIfPublicPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteNav />
      <article className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
          What If?
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          Stress-test your life before the world does.
        </h1>
        <p className="mt-5 text-base leading-relaxed text-zinc-400">
          Scenarios are not fear. They are rehearsal. TiltShield runs them against your actual
          dependencies — not generic advice.
        </p>

        <ul className="mt-8 space-y-3">
          {SCENARIOS.map((s) => (
            <li key={s.t} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <p className="text-sm font-semibold text-zinc-100">{s.t}</p>
              <p className="mt-1 text-sm text-zinc-500">{s.d}</p>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-zinc-400">
          Free assessment reveals your score and financial break point. Pro unlocks the full
          scenario board.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/assessment">Find your exposure →</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/app/what-if">Open simulator</Link>
          </Button>
        </div>
      </article>
    </main>
  );
}
