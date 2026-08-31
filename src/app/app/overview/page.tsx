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

  if (!session) return null;

  const { scores, vulnerabilities, answers } = session;
  const top = vulnerabilities[0];
  const move = pickTodaysMove(vulnerabilities);
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

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
            ? "You're more prepared than most — keep closing the remaining gaps."
            : scores.overall >= 40
              ? "Prepared for some disruptions. Exposed to others."
              : "More dependent than you thought. That's useful data."}
        </p>
        <Link
          href="/app/risk"
          className="mt-4 inline-block text-sm text-emerald-400 hover:text-emerald-300"
        >
          View score breakdown →
        </Link>
      </section>

      {top && (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Your biggest exposure
          </p>
          <div className="mt-3">
            <h2 className="text-lg font-semibold text-zinc-50">{top.title}</h2>
            <p className="mt-1 text-xs uppercase tracking-wide text-red-400">
              {top.severity}
            </p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            {top.current_state}
          </p>
          {top.category === "money" && (
            <p className="mt-4 text-3xl font-bold tabular-nums text-zinc-50">
              {Math.round(answers.emergency_fund_months * 30)}{" "}
              <span className="text-base font-normal text-zinc-500">
                days of essential expenses covered
              </span>
            </p>
          )}
          <div className="mt-5">
            <Button asChild size="sm">
              <Link href="/app/actions">Fix this first →</Link>
            </Button>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-500">
          Today&apos;s move
        </p>
        <h2 className="mt-2 text-lg font-semibold text-zinc-50">{move.title}</h2>
        <p className="mt-1 text-xs text-zinc-500">
          {move.time_estimate} · {move.difficulty} · High impact
        </p>
        <p className="mt-3 text-sm text-zinc-400">{move.why}</p>
        <div className="mt-5">
          <Button asChild>
            <Link href="/app/actions">Start action</Link>
          </Button>
        </div>
      </section>

      {!premium && (
        <section className="rounded-2xl border border-dashed border-zinc-700 p-5 text-center">
          <p className="text-sm text-zinc-400">
            Unlock the full plan for every vulnerability, scenario, and action.
          </p>
          <Button onClick={unlock} className="mt-4" size="sm" disabled={paying}>
            {paying ? "Opening…" : "Unlock — $29 lifetime"}
          </Button>
        </section>
      )}
    </div>
  );
}
