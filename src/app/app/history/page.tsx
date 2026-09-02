"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  loadSession,
  loadHistory,
  daysSinceLastAssessment,
  isPremium,
  type HistoryEntry,
} from "@/lib/session";
import { loadHistoryFromCloud } from "@/lib/persist";
import { getActiveMemberId } from "@/lib/family";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/app/glass-card";

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [daysSince, setDaysSince] = useState<number | null>(null);
  const [overall, setOverall] = useState(0);
  const [premium, setPrem] = useState(false);

  useEffect(() => {
    const mid = getActiveMemberId();
    const s = loadSession(mid);
    setOverall(s?.scores.overall ?? 0);
    setHistory(loadHistory(mid));
    setDaysSince(daysSinceLastAssessment(mid));
    setPrem(isPremium());
    void (async () => {
      const cloud = await loadHistoryFromCloud();
      if (cloud.length) setHistory(loadHistory(mid));
    })();
  }, []);

  const latest = history[0]?.overall ?? overall;
  const prev = history[1]?.overall;
  const delta =
    prev != null ? latest - prev : null;

  if (!premium && history.length === 0) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
        <PageHeader
          title="Progress"
          subtitle="See how your score moves — not just a chart."
          backHref="/app/more"
          showBack
        />
        <GlassCard>
          <p className="text-sm text-zinc-300">
            Progress unlocks with Lifetime or Household. You still see today's score below.
          </p>
          <p className="mt-4 text-3xl font-bold text-zinc-50">{overall} / 100</p>
          <Button asChild size="sm" className="mt-4">
            <Link href="/app/overview">Back to Today</Link>
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <PageHeader
        title="Progress"
        subtitle="What changed — and what to do next."
        backHref="/app/more"
        showBack
      />

      <GlassCard tone="accent">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Now
        </p>
        <p className="mt-2 text-4xl font-bold tabular-nums text-zinc-50">
          {latest}{" "}
          <span className="text-sm font-normal text-zinc-500">/ 100</span>
        </p>
        {delta != null && (
          <p
            className={
              delta >= 0
                ? "mt-1 text-sm font-medium text-emerald-400"
                : "mt-1 text-sm font-medium text-red-400"
            }
          >
            {delta >= 0 ? "+" : ""}
            {delta} vs last check
          </p>
        )}
        <p className="mt-2 text-xs text-zinc-500">
          {daysSince == null
            ? "Take an assessment to start the trail."
            : daysSince === 0
              ? "Checked today."
              : `Last check ${daysSince} days ago.`}
        </p>
        <Link
          href="/app/actions"
          className="mt-4 inline-flex rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950"
        >
          What should I do now? →
        </Link>
      </GlassCard>

      <section className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Trail
        </p>
        {history.length === 0 && (
          <p className="text-sm text-zinc-500">No past checks yet.</p>
        )}
        {history.map((h, i) => (
          <div
            key={h.at || i}
            className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-zinc-100">{h.overall} / 100</p>
              <p className="text-[11px] text-zinc-500">
                {h.at ? new Date(h.at).toLocaleDateString() : "Earlier"}
              </p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
