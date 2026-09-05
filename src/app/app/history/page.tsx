"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  loadHistory,
  loadSession,
  daysSinceLastAssessment,
  isPremium,
  type HistoryEntry,
  type TiltSession,
} from "@/lib/session";
import { loadHistoryFromCloud } from "@/lib/persist";
import {
  getActiveMemberId,
  loadFamilyMembers,
  setActiveMemberId,
  type FamilyMember,
} from "@/lib/family";
import { formatLongDate, resilienceLabel } from "@/lib/locale";
import { buildExposureSnapshot } from "@/lib/break-point";
import { loadJournal, type JournalEntry } from "@/lib/journal";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/app/glass-card";
import { cn } from "@/lib/utils";

const STOCK_KEY = "tiltshield_year_stock";
const STOCK_TOTAL = 11;

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

function whereYouNeedToBe(session: TiltSession | null): string[] {
  if (!session?.answers) {
    return [
      "Finish the exposure assessment so targets are personal, not generic.",
      "Aim for a full year of food you already eat, dated and rotated.",
      "Hold labeled cash for weeks of essentials and a tested second payment rail.",
      "Keep ID and critical docs reachable offline.",
    ];
  }
  const a = session.answers;
  const targets: string[] = [];
  const fundDays = Math.round((a.emergency_fund_months || 0) * 30);
  const food = a.food_buffer_days || 0;

  if (fundDays < 90) {
    targets.push(
      `Financial: grow runway past ~${fundDays || 0} days toward 90+ days of essentials cash if income stops.`
    );
  } else {
    targets.push(
      "Financial: hold the 90+ day runway and keep it labeled — not mixed into everyday spend."
    );
  }
  if (food < 90) {
    targets.push(
      `Food: move from ~${food} days toward 90, then layer toward a full year of meals you already eat.`
    );
  } else if (food < 365) {
    targets.push(
      `Food: you are past 90 days (~${food}). Keep stacking toward a full year with rotation dates.`
    );
  } else {
    targets.push("Food: year depth on file — maintain rotation so nothing expires unused.");
  }
  if (!a.alt_payment_method) {
    targets.push(
      "Payment: add and test a second rail so one outage does not stop food and fuel."
    );
  }
  if (!a.has_offline_docs) {
    targets.push(
      "Digital: offline copies of ID and critical accounts — digital break point should not be 0 days."
    );
  }
  if (!a.has_local_vendors) {
    targets.push(
      "Places: three city/nation contacts that still work when apps lag."
    );
  }
  return targets;
}

function whyFromGaps(
  session: TiltSession | null,
  stockDone: number,
  journalCount: number
): string[] {
  const why: string[] = [];
  if (!session?.answers) {
    why.push(
      "Without an assessment, Progress cannot map intel to your household — only generic risk."
    );
    return why;
  }
  const snap = buildExposureSnapshot(session.answers, session.scores);
  if (!snap) {
    why.push("Complete an assessment so Progress can name your weakest clock.");
    return why;
  }
  const weak = snap.weakest;
  if (weak) {
    why.push(
      `Weakest category on file: ${weak.label} (${weak.score}/100). That is the first clock Progress prioritizes.`
    );
  }
  if (snap.primary) {
    why.push(
      `Primary break point: ${snap.primary.label} at ${snap.primary.value}. ${snap.primary.meaning}`
    );
  }
  if (stockDone < STOCK_TOTAL) {
    why.push(
      `Year stock ${stockDone}/${STOCK_TOTAL}. Unticked items are open exposure — not optional polish.`
    );
  } else {
    why.push("Year stock checklist complete on file. Re-verify quarterly; conditions change.");
  }
  if (journalCount === 0) {
    why.push(
      "No journal entries yet. Log real moves in Prepare → Journal so Progress has evidence, not just scores."
    );
  } else {
    why.push(
      `${journalCount} journal entries on file. Recent logs are how Progress knows preparation is active, not theoretical.`
    );
  }
  why.push(
    "Live intel on Today maps world events to your gaps. When a headline hits money, food, or rails, close the shortest break point first."
  );
  return why;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [daysSince, setDaysSince] = useState<number | null>(null);
  const [overall, setOverall] = useState(0);
  const [premium, setPrem] = useState(false);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [memberId, setMemberId] = useState("self");
  const [session, setSession] = useState<TiltSession | null>(null);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [stockDone, setStockDone] = useState(0);

  function loadFor(mid: string) {
    const s = loadSession(mid);
    setSession(s);
    setOverall(s?.scores.overall ?? 0);
    setHistory(loadHistory(mid));
    setDaysSince(daysSinceLastAssessment(mid));
    setJournal(loadJournal());
    try {
      const raw = localStorage.getItem(STOCK_KEY);
      const checks = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
      setStockDone(Object.values(checks).filter(Boolean).length);
    } catch {
      setStockDone(0);
    }
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
  const targets = whereYouNeedToBe(session);
  const why = whyFromGaps(session, stockDone, journal.length);
  const stockPct = Math.round((stockDone / STOCK_TOTAL) * 100);

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <PageHeader
        title="Progress"
        subtitle="Where you are. Where you need to be. Why it matters — from your plan and intel."
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
              Exposure · {activeName}
            </p>
            <p className="mt-1 text-2xl font-semibold text-emerald-400">{band}</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-400">
              Not a wellness badge. How long systems can fail before your household feels it.
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
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
          Where you are
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
            <p className="text-[10px] uppercase tracking-wide text-zinc-500">Year stock</p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-zinc-50">
              {stockDone}
              <span className="text-sm font-normal text-zinc-500">/{STOCK_TOTAL}</span>
            </p>
            <p className="mt-0.5 text-[11px] text-emerald-400/90">{stockPct}%</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
            <p className="text-[10px] uppercase tracking-wide text-zinc-500">Journal</p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-zinc-50">{journal.length}</p>
            <p className="mt-0.5 text-[11px] text-zinc-500">entries logged</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
            <p className="text-[10px] uppercase tracking-wide text-zinc-500">Checks</p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-zinc-50">{history.length}</p>
            <p className="mt-0.5 text-[11px] text-zinc-500">assessments</p>
          </div>
        </div>
        {journal.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] text-zinc-500">Latest journal</p>
            {journal.slice(0, 3).map((e) => (
              <div
                key={e.id}
                className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.04] px-3 py-2.5"
              >
                <p className="text-[10px] text-zinc-500">{formatLongDate(e.at)}</p>
                <p className="mt-1 line-clamp-3 text-sm text-zinc-300">{e.text}</p>
              </div>
            ))}
            <Link href="/app/prepare" className="block text-center text-xs font-medium text-emerald-400">
              Open Prepare → Journal
            </Link>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
          Where you need to be
        </p>
        <div className="space-y-2">
          {targets.map((t, i) => (
            <div
              key={i}
              className="flex gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3"
            >
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
              <p className="text-sm leading-relaxed text-zinc-300">{t}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
          Why — from your gaps & intel
        </p>
        <div className="space-y-2">
          {why.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl border border-amber-500/15 bg-amber-500/[0.04] px-4 py-3"
            >
              <p className="text-sm leading-relaxed text-zinc-300">{t}</p>
            </div>
          ))}
        </div>
        <Link href="/app/intel" className="block text-center text-xs font-medium text-emerald-400">
          Open live intel →
        </Link>
      </section>

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
              <Link href="/assessment">Measure exposure</Link>
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
                    <p className="mt-0.5 text-[11px] text-zinc-500">{formatLongDate(stamp)}</p>
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
            Full history unlocks with Lifetime or Household. Re-take monthly and keep the journal so Progress stays honest.
          </p>
        </GlassCard>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        <Button asChild variant="outline" className="w-full">
          <Link href="/app/prepare">Prepare · Journal</Link>
        </Button>
        <Button asChild className="w-full shadow-lg shadow-emerald-900/20">
          <Link href="/assessment">Retake assessment</Link>
        </Button>
      </div>
    </div>
  );
}
