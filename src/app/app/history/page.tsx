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
import { formatLongDate, resilienceLabel } from "@/lib/locale";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/app/glass-card";
import { cn } from "@/lib/utils";

function ScoreRing({ score }: { score: number }) {
  const r = 44;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score)) / 100;
  const offset = c * (1 - pct);
  return (
    <svg width="120" height="120" className="-rotate-90">
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
      <circle cx="60" cy="60" r={r} fill="none" stroke="#34d399" strokeWidth="9" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} />
    </svg>
  );
}

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
  const latestDate = history[0]?.date || history[0]?.at || null;
  const band = resilienceLabel(latest);

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <PageHeader
        title="Progress"
        subtitle="Your household readiness trail — how prepared you are over time."
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

      <GlassCard className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-8">
          <div className="relative shrink-0">
            <ScoreRing score={latest} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold tabular-nums text-zinc-50">{latest}</span>
              <span className="text-[10px] text-zinc-500">/ 100</span>
            </div>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Preparedness · {activeName}
            </p>
            <p className="mt-1 text-2xl font-semibold text-emerald-400">{band}</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-400">
              0–100 readiness across money, food, digital, home, and emergency.
              Higher means more buffer before systems tighten.
            </p>
            {latestDate && (
              <p className="mt-3 text-xs text-zinc-500">
                Assessed {formatLongDate(latestDate)}
                {daysSince != null && (
                  <span>
                    {" "}
                    ·{" "}
                    {daysSince === 0
                      ? "today"
                      : `${daysSince} day${daysSince === 1 ? "" : "s"} ago`}
                  </span>
                )}
              </p>
            )}
            {delta != null && (
              <p
                className={cn(
                  "mt-2 text-sm font-semibold",
                  delta > 0
                    ? "text-emerald-400"
                    : delta < 0
                      ? "text-amber-400"
                      : "text-zinc-500"
                )}
              >
                {delta > 0
                  ? `↑ ${delta} vs previous`
                  : delta < 0
                    ? `↓ ${Math.abs(delta)} vs previous`
                    : "No change vs previous"}
              </p>
            )}
          </div>
        </div>
      </GlassCard>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Assessment history
          </p>
          <span className="text-[11px] text-zinc-600">
            {history.length} check{history.length === 1 ? "" : "s"}
          </span>
        </div>

        {history.length === 0 && (
          <GlassCard>
            <p className="text-sm text-zinc-400">
              No saved checks yet for this profile. Take the assessment to start your trail.
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/assessment">Get my score</Link>
            </Button>
          </GlassCard>
        )}

        <div className="relative space-y-3 pl-2">
          {history.length > 1 && (
            <div className="absolute bottom-4 left-[19px] top-4 w-px bg-gradient-to-b from-emerald-500/40 via-white/10 to-transparent" />
          )}
          {history.map((h, i) => {
            const stamp = h.date || h.at;
            return (
              <div key={`${stamp}-${i}`} className="relative flex gap-3">
                <span
                  className={cn(
                    "relative z-10 mt-4 flex h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-[#0a1018]",
                    i === 0
                      ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]"
                      : "bg-zinc-600"
                  )}
                />
                <div
                  className={cn(
                    "flex flex-1 items-center justify-between rounded-2xl border px-4 py-3.5 transition",
                    i === 0
                      ? "border-emerald-500/25 bg-emerald-500/5"
                      : "border-white/[0.08] bg-white/[0.03]"
                  )}
                >
                  <div>
                    <p className="text-sm font-semibold text-zinc-100">
                      Score {h.overall}
                      <span className="font-normal text-zinc-500"> / 100</span>
                    </p>
                    <p className="mt-0.5 text-[11px] text-zinc-500">
                      {formatLongDate(stamp)}
                    </p>
                  </div>
                  {i === 0 && (
                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
                      Latest
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {!premium && history.length <= 1 && (
        <GlassCard tone="accent">
          <p className="text-sm text-zinc-300">
            Full history unlocks with Lifetime or Household. Re-take monthly to build a clear trail.
          </p>
        </GlassCard>
      )}

      <Button asChild className="w-full shadow-lg shadow-emerald-900/20">
        <Link href="/assessment">Retake assessment</Link>
      </Button>
    </div>
  );
}
