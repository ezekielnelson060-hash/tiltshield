"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { loadSession, isPremium, type TiltSession } from "@/lib/session";
import { computeBufferPlan } from "@/lib/buffer";
import { greetingForHour, resilienceLabel, formatDistance } from "@/lib/locale";
import { getActiveMember } from "@/lib/family";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/app/glass-card";
import { CATEGORY_ICONS } from "@/components/app/icons";
import { TodaysPriority } from "@/components/app/todays-priority";
import { mapsSearchUrl } from "@/lib/nearby";
import { yearPlanSummary } from "@/lib/plan-from-assessment";
import { buildExposureSnapshot } from "@/lib/break-point";
import { useTodayData } from "@/hooks/use-today-data";
import type { CategoryScores } from "@/types";
import { UpgradeGate } from "@/components/app/upgrade-gate";
import { stockProgress, YEAR_STOCK } from "@/lib/year-stock";
import { loadJournal } from "@/lib/journal";

const NearbyMap = dynamic(
  () => import("@/components/map/nearby-map").then((m) => m.NearbyMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-44 items-center justify-center rounded-xl bg-[#080d16] text-xs text-zinc-600">
        Map…
      </div>
    ),
  }
);

const CATEGORY_TILES: { key: keyof CategoryScores; label: string; href: string }[] = [
  { key: "money", label: "Money", href: "/app/focus/money" },
  { key: "digital", label: "Digital", href: "/app/focus/digital" },
  { key: "food", label: "Essentials", href: "/app/focus/food" },
  { key: "home", label: "Home", href: "/app/focus/home" },
  { key: "communication", label: "Mobility", href: "/app/focus/communication" },
  { key: "skills", label: "Health", href: "/app/focus/skills" },
  { key: "documents", label: "Documents", href: "/app/focus/documents" },
  { key: "emergency", label: "Emergency", href: "/app/focus/emergency" },
];

function ScoreRing({ score }: { score: number }) {
  const r = 40;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score)) / 100;
  const offset = c * (1 - pct);
  return (
    <svg width="108" height="108" className="-rotate-90">
      <circle cx="54" cy="54" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
      <circle cx="54" cy="54" r={r} fill="none" stroke="#34d399" strokeWidth="8" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} />
    </svg>
  );
}

export function TodayScreen() {
  const [session, setSession] = useState<TiltSession | null>(null);
  const [name, setName] = useState("there");
  const [premium, setPrem] = useState(false);
  const [ready, setReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [stock, setStock] = useState({
    done: 0,
    total: YEAR_STOCK.length,
    pct: 0,
    remaining: YEAR_STOCK,
  });
  const [journalCount, setJournalCount] = useState(0);
  const { coords, places, intel, placeLabel, daysSince, pipeline, assessedLabel } = useTodayData();

  useEffect(() => {
    function refreshProgress() {
      setStock(stockProgress());
      setJournalCount(loadJournal().length);
    }
    try {
      const s = loadSession();
      setSession(s);
      setPrem(isPremium());
      setName(
        localStorage.getItem("tiltshield_display_name") ||
          getActiveMember().name ||
          "there"
      );
    } catch {
      setSession(null);
    }
    refreshProgress();
    setReady(true);
    window.addEventListener("tiltshield:progress", refreshProgress);
    return () => window.removeEventListener("tiltshield:progress", refreshProgress);
  }, []);

  async function unlock() {
    setPaying(true);
    try {
      const res = await fetch("/api/flutterwave/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "pro_monthly" }),
      });
      const json = await res.json();
      if (json.link) window.location.href = json.link;
    } finally {
      setPaying(false);
    }
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-zinc-500">
        Loading your day…
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-lg font-semibold text-zinc-50">Start here</p>
        <p className="mt-2 text-sm text-zinc-400">
          Nine short questions so Today can show your exposure and financial break point.
        </p>
        <Button asChild className="mt-6">
          <Link href="/assessment">Measure your exposure</Link>
        </Button>
      </div>
    );
  }

  const scores = session.scores;
  const answers = session.answers;
  const vulnerabilities = session.vulnerabilities || [];
  const label = resilienceLabel(scores.overall || 0);
  const runwayDays = Math.round((answers.emergency_fund_months || 0) * 30);
  const exposure = buildExposureSnapshot(answers, scores);
  const financial = exposure?.points.find((p) => p.id === "financial");
  try {
    computeBufferPlan({
      monthlyIncome: answers.monthly_income || 0,
      monthlyExpenses: answers.monthly_expenses || 0,
      emergencyFundMonths: answers.emergency_fund_months || 0,
      targetMonths: 3,
    });
  } catch {
    /* */
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5 px-4 py-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
          {greetingForHour()}, {name}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">
            {placeLabel || "Your area"}
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">
            {assessedLabel(daysSince)}
          </span>
          {premium ? (
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-emerald-400/90">
              Live intel on
            </span>
          ) : (
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-zinc-500">
              Free plan
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_1.1fr]">
        <GlassCard className="flex items-center gap-4">
          <div className="relative shrink-0">
            <ScoreRing score={scores.overall || 0} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold tabular-nums text-zinc-50">
                {scores.overall || 0}
              </span>
              <span className="text-[10px] text-zinc-500">/ 100</span>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-400/90">
              Exposure
            </p>
            <p className="mt-1 text-lg font-semibold text-zinc-50">{label}</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
              {exposure
                ? `You have ${exposure.significantDependencies} significant dependencies.`
                : "Dependencies still loading."}
            </p>
          </div>
        </GlassCard>
        <GlassCard
          tone={
            ((premium ? exposure?.primary.days : financial?.days) ?? 99) < 30
              ? "danger"
              : "default"
          }
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-red-400/90">
            {premium ? "Shortest clock" : "Financial break point"}
          </p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-zinc-50">
            {premium
              ? exposure?.primary.value || `${runwayDays} days`
              : financial?.value ||
                exposure?.primary.value ||
                `${runwayDays} days`}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            {premium
              ? exposure?.primary.meaning ||
                `If primary income stops, reserves cover about ${runwayDays} days.`
              : financial?.meaning ||
                exposure?.primary.meaning ||
                `If primary income stops, reserves cover about ${runwayDays} days.`}
          </p>
          {premium ? (
            <Link
              href="/app/what-if"
              className="mt-3 inline-block text-xs font-semibold text-emerald-400"
            >
              Run the scenario →
            </Link>
          ) : (
            <Link
              href="/#pricing"
              className="mt-3 inline-block text-xs font-semibold text-emerald-400"
            >
              Unlock all clocks · Pro →
            </Link>
          )}
        </GlassCard>
      </div>

      {exposure && (
        <div className="grid gap-2 sm:grid-cols-3">
          {exposure.points.slice(1, 4).map((bp) => {
            const locked = !premium && bp.id !== "financial";
            return (
              <div
                key={bp.id}
                className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3 py-3"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  {bp.label}
                </p>
                {locked ? (
                  <>
                    <p className="mt-1 select-none text-lg font-bold tabular-nums text-zinc-600 blur-[2px]">
                      ••
                    </p>
                    <span className="absolute right-2 top-2 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400">
                      Pro
                    </span>
                  </>
                ) : (
                  <p
                    className={
                      bp.severity === "critical"
                        ? "mt-1 text-lg font-bold tabular-nums text-red-400"
                        : bp.severity === "high"
                          ? "mt-1 text-lg font-bold tabular-nums text-amber-400"
                          : "mt-1 text-lg font-bold tabular-nums text-zinc-100"
                    }
                  >
                    {bp.value}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!premium && (
        <UpgradeGate
          title="Your other clocks are locked"
          body="Free includes your score and financial break point. Pro unlocks digital, payment, food, What If?, live intel, and the year tracker."
        />
      )}

      {/* Year plan — journal + stock feed progress */}
      <GlassCard>
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Year plan · where you are
          </p>
          <Link
            href="/app/prepare"
            className="text-xs font-medium text-emerald-400"
          >
            Log move →
          </Link>
        </div>
        <div className="mt-3 flex items-end gap-3">
          <p className="text-3xl font-bold tabular-nums text-zinc-50">
            {stock.done}
            <span className="text-base font-medium text-zinc-500">/{stock.total}</span>
          </p>
          <p className="mb-1 text-xs text-zinc-500">{stock.pct}% of year checklist</p>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
            style={{ width: `${stock.pct}%` }}
          />
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Where you need to be
          </p>
          {stock.remaining.slice(0, 3).map((item) => (
            <p key={item.id} className="text-xs text-zinc-300">
              <span className="text-zinc-600">○</span> {item.label}
            </p>
          ))}
          {stock.remaining.length === 0 && (
            <p className="text-xs text-emerald-400/90">
              Checklist complete — re-verify quarterly.
            </p>
          )}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-zinc-500">
          {journalCount === 0
            ? "Why: Progress needs evidence. Log cash, food, meds, or power in Prepare → Journal — keywords tick the year checklist."
            : `Why: ${journalCount} journal ${journalCount === 1 ? "entry" : "entries"} on file. Real moves close exposure on your shortest clocks.`}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/app/prepare"
            className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] text-zinc-300 hover:border-emerald-500/30"
          >
            Year stock
          </Link>
          <Link
            href="/app/history"
            className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] text-zinc-300 hover:border-emerald-500/30"
          >
            Full progress
          </Link>
        </div>
      </GlassCard>

      {premium ? (
        <>
          <TodaysPriority answers={answers} vulnerabilities={vulnerabilities} />
          <p className="text-xs leading-relaxed text-zinc-500">
            {yearPlanSummary(answers)}
          </p>
        </>
      ) : (
        <UpgradeGate
          variant="inline"
          title="Full action plan and 12-month tracker need Pro"
        />
      )}

      {premium && pipeline.length > 0 ? (
        <GlassCard>
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              What's changed · for you
            </p>
            <Link href="/app/intel" className="text-xs font-medium text-emerald-400">
              All intel →
            </Link>
          </div>
          <ul className="mt-3 space-y-3">
            {pipeline.map((link) => (
              <li
                key={link.eventId}
                className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-3"
              >
                <p className="text-[10px] uppercase tracking-wide text-zinc-600">
                  World → {link.exposureLabel}
                </p>
                <p className="mt-1 text-sm font-medium text-zinc-100">{link.eventTitle}</p>
                <p className="mt-1 text-xs text-zinc-500">{link.exposureReason}</p>
                <Link
                  href={link.actionHref}
                  className="mt-2 inline-flex text-xs font-semibold text-emerald-400"
                >
                  {link.actionTitle} · {link.actionMinutes} min →
                </Link>
              </li>
            ))}
          </ul>
        </GlassCard>
      ) : null}

      {premium && (
        <GlassCard className="!p-0 overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Nearby
              </p>
              <p className="text-xs text-zinc-500">
                {placeLabel
                  ? `Pharmacies near ${placeLabel}`
                  : "Pharmacies and essentials near you"}
              </p>
            </div>
            <Link
              href="/app/nearby?q=pharmacy"
              className="text-xs font-medium text-emerald-400"
            >
              Open map →
            </Link>
          </div>
          <div className="mt-3 border-t border-white/[0.06]">
            <NearbyMap
              places={places}
              selected={places[0] || null}
              user={coords}
              onSelect={() => {}}
              className="h-44 w-full"
            />
          </div>
        </GlassCard>
      )}

      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Exposure at a glance
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CATEGORY_TILES.map((t) => {
            const Icon = CATEGORY_ICONS[t.key];
            const val = scores[t.key] ?? 0;
            return (
              <Link
                key={t.key}
                href={t.href}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 transition hover:border-emerald-500/30"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  {Icon ? <Icon className="h-4 w-4" /> : null}
                </span>
                <p className="mt-2 text-xs text-zinc-500">{t.label}</p>
                <p className="text-lg font-semibold tabular-nums text-zinc-100">{val}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {!premium && (
        <GlassCard tone="accent">
          <p className="text-sm font-medium text-zinc-100">Unlock full tools</p>
          <p className="mt-1 text-xs text-zinc-500">
            Pro · $15/mo — all four break points, What If?, vault, year tracker.
          </p>
          <Button
            size="sm"
            className="mt-3"
            disabled={paying}
            onClick={() => void unlock()}
          >
            {paying ? "Opening…" : "Unlock Pro · $15/mo"}
          </Button>
        </GlassCard>
      )}
    </div>
  );
}
