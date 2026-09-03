"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  loadHistory,
  loadSession,
  daysSinceLastAssessment,
  isPremium,
  type HistoryEntry,
} from "@/lib/session";
import { loadHistoryFromCloud } from "@/lib/persist";
import {
  getActiveMemberId,
  loadFamilyMembers,
  setActiveMemberId,
  type FamilyMember,
} from "@/lib/family";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/app/glass-card";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [daysSince, setDaysSince] = useState<number | null>(null);
  const [overall, setOverall] = useState(0);
  const [premium, setPrem] = useState(false);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [memberId, setMemberId] = useState("self");

  function loadFor(mid: string) {
    const s = loadSession(mid);
    setOverall(s?.scores.overall ?? 0);
    setHistory(loadHistory(mid));
    setDaysSince(daysSinceLastAssessment(mid));
  }

  useEffect(() => {
    const mid = getActiveMemberId();
    setMemberId(mid);
    setMembers(loadFamilyMembers());
    setPrem(isPremium());
    loadFor(mid);
    void (async () => {
      await loadHistoryFromCloud();
      loadFor(getActiveMemberId());
    })();
  }, []);

  function selectMember(id: string) {
    setActiveMemberId(id);
    setMemberId(id);
    loadFor(id);
  }

  const latest = history[0]?.overall ?? overall;
  const prev = history[1]?.overall;
  const delta = prev != null ? latest - prev : null;
  const activeName =
    members.find((m) => m.id === memberId)?.name ||
    (memberId === "self" ? "You" : "Member");

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <PageHeader
        title="Progress"
        subtitle="Scores over time — pick a household member."
        backHref="/app/more"
        showBack
      />

      {members.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {members.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => selectMember(m.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition",
                memberId === m.id
                  ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                  : "border-white/10 bg-white/[0.04] text-zinc-400"
              )}
            >
              {m.name}
            </button>
          ))}
        </div>
      )}

      <GlassCard tone="accent">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          {activeName} · now
        </p>
        <p className="mt-2 text-4xl font-bold tabular-nums text-zinc-50">
          {latest}{" "}
          <span className="text-sm font-normal text-zinc-500">/ 100</span>
        </p>
        {delta != null && (
          <p
            className={cn(
              "mt-1 text-sm font-medium",
              delta > 0
                ? "text-emerald-400"
                : delta < 0
                  ? "text-amber-400"
                  : "text-zinc-500"
            )}
          >
            {delta > 0 ? `↑ ${delta}` : delta < 0 ? `↓ ${Math.abs(delta)}` : "—"}{" "}
            vs last check
          </p>
        )}
        {daysSince != null && (
          <p className="mt-1 text-xs text-zinc-500">
            Last assessment {daysSince === 0 ? "today" : `${daysSince}d ago`}
          </p>
        )}
      </GlassCard>

      {!premium && history.length <= 1 && (
        <GlassCard>
          <p className="text-sm text-zinc-300">
            Full history unlocks with Lifetime or Household. Re-take the check
            monthly to build a trail.
          </p>
          <Button asChild size="sm" className="mt-4">
            <Link href="/assessment">Retake core check</Link>
          </Button>
        </GlassCard>
      )}

      <section className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          History · {activeName}
        </p>
        {history.length === 0 && (
          <p className="text-sm text-zinc-500">
            No saved checks yet for this profile.
          </p>
        )}
        {history.map((h, i) => (
          <div
            key={`${h.at}-${i}`}
            className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-zinc-100">
                {h.overall} / 100
              </p>
              <p className="text-[11px] text-zinc-500">
                {h.at ? new Date(h.at).toLocaleDateString() : "—"}
              </p>
            </div>
            {i === 0 && (
              <span className="text-[10px] font-semibold uppercase text-emerald-400">
                Latest
              </span>
            )}
          </div>
        ))}
      </section>

      <Button asChild size="sm" className="w-full">
        <Link href="/assessment">Retake assessment</Link>
      </Button>
    </div>
  );
}
