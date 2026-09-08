"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/landing/site-nav";
import { Button } from "@/components/ui/button";

export default function EmergencyFundGuidePage() {
  const [expenses, setExpenses] = useState(3000);
  const [savings, setSavings] = useState(12000);
  const [sources, setSources] = useState(1);

  const days = useMemo(() => {
    if (expenses <= 0) return 0;
    return Math.max(0, Math.round((savings / expenses) * 30));
  }, [expenses, savings]);

  const months = useMemo(() => {
    if (expenses <= 0) return 0;
    return Math.round((savings / expenses) * 10) / 10;
  }, [expenses, savings]);

  const tone =
    days < 30 ? "text-red-400" : days < 90 ? "text-amber-400" : "text-emerald-400";

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteNav />
      <article className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Guide · Break Point
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          How Long Could Your Emergency Fund Actually Last?
        </h1>
        <p className="mt-5 text-base leading-relaxed text-zinc-400">
          Most people know how much money they have saved. Far fewer know how long that money
          would actually keep their life running. That's the more useful number.
        </p>
        <p className="mt-4 text-base leading-relaxed text-zinc-400">
          If your income stopped tomorrow, your emergency fund wouldn't be worth
          &ldquo;$10,000.&rdquo; It would be worth X days of continued life. That is your{" "}
          <Link href="/break-point" className="text-emerald-400 hover:text-emerald-300">
            financial break point
          </Link>
          .
        </p>

        <h2 className="mt-10 text-xl font-semibold text-zinc-50">
          What is a financial break point?
        </h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">
          Your financial break point is the point at which your available financial reserves can
          no longer cover your essential expenses. A simple calculation is: available emergency
          reserves ÷ essential monthly expenses.
        </p>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">
          Example: $12,000 savings and $3,000 essential monthly expenses → about 4 months. That
          is not four comfortable months — it is approximately how long before reserves are
          exhausted, before unexpected costs.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-zinc-50">
          Don't calculate against your normal lifestyle
        </h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">
          Use what you must continue paying: housing, utilities, food, transportation, insurance,
          debt, essential healthcare, communication, taxes. Separate that from spending you could
          temporarily cut. Someone spending $4,000 a month might discover essential burn is
          $2,700 — which changes the break point significantly.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-zinc-50">
          Your emergency fund is a clock
        </h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">
          Don't ask whether you have enough savings. Ask: if income disappeared tomorrow,
          how long would current reserves buy you? Improve the number by increasing reserves,
          reducing essentials, adding income sources, reducing high-risk dependencies, or
          improving access if your primary provider is unavailable.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-zinc-50">
          The hidden problem: access
        </h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">
          Having money and usable access are not the same. Bank apps fail, cards block, phones
          are lost. Resilience depends on how many ways you can access what you need. See{" "}
          <Link href="/guides/bank-outage" className="text-emerald-400 hover:text-emerald-300">
            bank outage
          </Link>{" "}
          and{" "}
          <Link href="/guides/phone-lost" className="text-emerald-400 hover:text-emerald-300">
            phone loss
          </Link>
          .
        </p>

        <h2 className="mt-10 text-xl font-semibold text-zinc-50">Calculate yours</h2>
        <div className="mt-4 space-y-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-5">
          <label className="block text-xs text-zinc-400">
            Essential monthly expenses
            <input
              type="number"
              min={0}
              value={expenses}
              onChange={(e) => setExpenses(Number(e.target.value) || 0)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-zinc-100"
            />
          </label>
          <label className="block text-xs text-zinc-400">
            Liquid emergency reserves
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
            <p className="mt-1 text-sm text-zinc-500">≈ {months} months</p>
            <p className="mt-2 text-xs text-zinc-500">
              {sources <= 1
                ? "Single income — this clock is the whole story."
                : "Multiple sources noted — still stress-test the primary."}
            </p>
          </div>
        </div>

        <p className="mt-6 text-base leading-relaxed text-zinc-400">
          TiltShield turns your situation into an exposure profile — what money needs to support,
          how long reserves last, and where dependencies concentrate. Know your break point
          before you are forced to discover it.
        </p>

        <Button asChild size="lg" className="mt-6">
          <Link href="/assessment">Calculate your exposure →</Link>
        </Button>

        <div className="mt-14 border-t border-white/10 pt-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Related guides
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/guides/income-loss" className="text-emerald-400 hover:text-emerald-300">
                What happens if you lose your income tomorrow?
              </Link>
            </li>
            <li>
              <Link href="/guides/bank-outage" className="text-emerald-400 hover:text-emerald-300">
                What happens if your bank goes down for 72 hours?
              </Link>
            </li>
            <li>
              <Link href="/break-point" className="text-emerald-400 hover:text-emerald-300">
                What is a break point?
              </Link>
            </li>
          </ul>
        </div>
      </article>
    </main>
  );
}
