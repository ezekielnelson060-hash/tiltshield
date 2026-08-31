"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadSession, isPremium, setPremium, type TiltSession } from "@/lib/session";
import { pickTodaysMove } from "@/lib/scoring";
import { Button } from "@/components/ui/button";

export default function OverviewPage() {
  const [session, setSession] = useState<TiltSession | null>(null);
  const [premium, setPrem] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    setSession(loadSession());
    setPrem(isPremium());
  }, []);

  async function unlock() {
    setPaying(true);
    try {
      const res = await fetch("/api/flutterwave/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      if (json.link) {
        window.location.href = json.link;
        return;
      }
      if (json.demo || res.status === 503) {
        if (window.confirm("Unlock full plan for demo?")) {
          setPremium(true);
          setPrem(true);
        }
      }
    } finally {
      setPaying(false);
    }
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-zinc-400">Complete your assessment to see your overview.</p>
        <Button asChild className="mt-4">
          <Link href="/assessment">Get my score</Link>
        </Button>
      </div>
    );
  }

  const { scores, vulnerabilities, answers } = session;
  const top = vulnerabilities[0];
  const move = pickTodaysMove(vulnerabilities);
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const runwayDays = Math.round((answers.emergency_fund_months || 0) * 30);
  const expenses = answers.monthly_expenses || 0;

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8 lg:px-8">
      <div>
        <p className="text-sm text-zinc-500">{greeting}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
          How exposed are you?
        </h1>
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
          Resilience score
        </p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-5xl font-bold tracking-tight text-zinc-50">
            {scores.overall}
          </span>
          <span className="text-zinc-600">/ 100</span>
        </div>
        <p className="mt-2 text-sm text-zinc-400">
          {scores.overall >= 70
            ? `Strong baseline. Your cash runway is about ${runwayDays} days at $${expenses.toLocaleString()}/month essential spend.`
            : scores.overall >= 40
              ? `Mixed readiness. Cash runway ≈ ${runwayDays} days. Biggest gap: ${top?.title ?? "see My Risk"}.`
              : `More dependent than you thought. Runway ≈ ${runwayDays} days. Start with: ${top?.title ?? "your top exposure"}.`}
        </p>
        <Link
          href="/app/risk"
          className="mt-4 inline-block text-sm text-emerald-400 hover:underline"
        >
          See all categories →
        </Link>
      </section>

      {top && (
        <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
          <p className="text-[10px] font-medium uppercase tracking-wider text-red-400">
            Your biggest exposure
          </p>
          <h2 className="mt-2 text-lg font-semibold text-zinc-50">{top.title}</h2>
          <p className="mt-2 text-sm text-zinc-400">{top.current_state}</p>
          <p className="mt-3 text-sm text-zinc-300">
            <span className="text-zinc-500">Next: </span>
            {top.next_action}
          </p>
          <div className="mt-4">
            <Button asChild size="sm">
              <Link href="/app/actions">Fix this first</Link>
            </Button>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
        <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-500">
          Today&apos;s move
        </p>
        <h2 className="mt-2 text-lg font-semibold text-zinc-50">{move.title}</h2>
        <p className="mt-1 text-xs text-zinc-500">
          {move.time_estimate} · {move.difficulty}
        </p>
        <p className="mt-3 text-sm text-zinc-400">{move.why}</p>
        <div className="mt-4">
          <Button asChild size="sm" variant="outline">
            <Link href="/app/actions">Open actions</Link>
          </Button>
        </div>
      </section>

      {!premium && (
        <section className="rounded-2xl border border-zinc-800 p-6 text-center">
          <p className="text-sm text-zinc-300">
            Unlock full risk map, all What If scenarios, and history.
          </p>
          <p className="mt-1 text-xs text-zinc-500">$29 lifetime · founding member</p>
          <Button className="mt-4" onClick={unlock} disabled={paying}>
            {paying ? "Opening…" : "Become a founding member"}
          </Button>
        </section>
      )}
    </div>
  );
}
