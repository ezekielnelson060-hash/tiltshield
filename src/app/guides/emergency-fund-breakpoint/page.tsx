"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/landing/site-nav";
import { Button } from "@/components/ui/button";

export default function EmergencyFundGuidePage() {
  const [expenses, setExpenses] = useState(1500);
  const [savings, setSavings] = useState(3000);
  const [sources, setSources] = useState(1);

  const days = useMemo(() => {
    if (expenses <= 0) return 0;
    return Math.max(0, Math.round((savings / expenses) * 30));
  }, [expenses, savings]);

  const tone =
    days < 14 ? "text-red-400" : days < 60 ? "text-amber-400" : "text-emerald-400";

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteNav />
      <article className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Money · Break point
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          Your emergency fund isn&apos;t measured in dollars.
          <span className="mt-2 block text-zinc-300">It&apos;s measured in time.</span>
        </h1>
        <p className="mt-5 text-base leading-relaxed text-zinc-400">
          If your income disappeared tomorrow, how many days would your money actually buy?
        </p>

        <div className="mt-8 space-y-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-5">
          <label className="block text-xs text-zinc-400">
            Monthly essential expenses
            <input
              type="number"
              min={0}
              value={expenses}
              onChange={(e) => setExpenses(Number(e.target.value) || 0)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-zinc-100"
            />
          </label>
          <label className="block text-xs text-zinc-400">
            Liquid savings (accessible in days, not months)
            <input
              type="number"
              min={0}
              value={savings}
              onChange={(e) => setSavings(Number(e.target.value) || 0)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-zinc-100"
            />
          </label>
          <label className="block text-xs text-zinc-400">
            Number of income sources
            <input
              type="number"
              min={1}
              max={5}
              value={sources}
              onChange={(e) => setSources(Number(e.target.value) || 1)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-zinc-100"
            />
          </label>

          <div className="rounded-xl border border-white/10 bg-zinc-950/80 p-4 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Financial break point
            </p>
            <p className={`mt-2 text-4xl font-bold tabular-nums ${tone}`}>{days} days</p>
            <p className="mt-2 text-xs text-zinc-500">
              {sources <= 1
                ? "Single income — this clock is the whole story."
                : "Multiple sources noted — still stress-test the primary."}
            </p>
          </div>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-zinc-400">
          This is one clock. Digital, payment, and food break points can be shorter. The full
          assessment measures all four.
        </p>

        <Button asChild size="lg" className="mt-6">
          <Link href="/assessment">Run your full exposure assessment →</Link>
        </Button>
      </article>
    </main>
  );
}
