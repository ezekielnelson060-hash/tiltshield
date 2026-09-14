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
import { yearPlanSummary } from "@/lib/plan-from-assessment";
import { buildExposureSnapshot } from "@/lib/break-point";
import { useTodayData } from "@/hooks/use-today-data";
import type { CategoryScores } from "@/types";
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
      <circle
        cx="54"
        cy="54"
        r={r}
        fill="none"
        stroke="#34d399"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
      />
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
  const { coords, places, placeLabel, daysSince, pipeline, assessedLabel } =
    useTodayData();

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

  const finDays = financial?.days ?? runwayDays;
  const upgradeWhy =
    finDays <= 7
      ? `Your financial break point is ${financial?.value || finDays + " days"}. Free leaves digital, payment, and food clocks blind — that is how people get surprised.`
      : `Free shows one clock. The other three are still running whether you see them or not.`;

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
              Free · financial only
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
            {exposure?.primary && (
              <p className="mt-1 text-xs text-zinc-500">
                Weakest point ·{" "}
                <span className="font-medium text-red-400">
                  {exposure.primary.label.replace(" break point", "")}
                </span>
              </p>
            )}
          </div>
        </GlassCard>

        <GlassCard tone={finDays < 30 ? "danger" : "default"}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-red-400/90">
            Break point
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-zinc-50">
            {premium
              ? exposure?.primary.value || `${runwayDays} days`
              : financial?.value || `${runwayDays} days`}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            {premium
              ? exposure?.primary.meaning
              : financial?.meaning ||
                `If primary income stops, reserves cover about ${runwayDays} days.`}
          </p>
          <Link
            href={premium ? "/app/what-if" : "/pricing"}
            className="mt-3 inline-block text-xs font-semibold text-emerald-400"
          >
            {premium ? "Run the scenario →" : "See what else is timed →"}
          </Link>
        </GlassCard>
      </div>

      {exposure && (
        <div className="grid gap-2 sm:grid-cols-3">
          {exposure.points
            .filter((bp) => {
              if (premium) return bp.id !== exposure.primary?.id;
              return bp.id !== "financial";
            })
            .slice(0, 3)
            .map((bp) => {
              const locked = !premium;
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
                      <p className="mt-1 text-lg font-bold tabular-nums text-zinc-500">
                        Locked
                      </p>
                      <p className="mt-1 text-[11px] leading-snug text-zinc-600">
                        Still running. Pro shows the number.
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
        <GlassCard tone="accent">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-400/90">
            Why upgrade
          </p>
          <p className="mt-2 text-sm font-medium text-zinc-50">{upgradeWhy}</p>
          <p className="mt-2 text-xs leading-relaxed text-zinc-500">
            Pro unlocks digital, payment, and food clocks, What If?, live intel matched to your
            gaps, and the full 12-month tracker. $15/mo or $79/yr.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" disabled={paying} onClick={() => void unlock()}>
              {paying ? "Opening…" : "Unlock Pro · $15/mo"}
            </Button>
            <Link
              href="/pricing"
              className="inline-flex items-center rounded-lg border border-white/15 px-3 py-2 text-xs font-medium text-zinc-300"
            >
              See plans
            </Link>
          </div>
        </GlassCard>
      )}

      <TodaysPriority answers={answers} vulnerabilities={vulnerabilities} />
      {premium && (
        <p className="text-xs leading-relaxed text-zinc-500">
          {yearPlanSummary(answers)}
        </p>
      )}

      <GlassCard>
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Year plan · where you are
          </p>
          <Link href="/app/prepare" className="text-xs font-medium text-emerald-400">
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
            ? "Why: Progress needs evidence. Log cash, food, meds, or power in Prepare → Journal."
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

      <GlassCard>
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            What's changed · for you
          </p>
          <Link
            href={premium ? "/app/intel" : "/pricing"}
            className="text-xs font-medium text-emerald-400"
          >
            {premium ? "All intel →" : "Unlock intel →"}
          </Link>
        </div>
        {pipeline.length > 0 ? (
          <ul className="mt-3 space-y-3">
            {(premium ? pipeline : pipeline.slice(0, 1)).map((link) => (
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
                  href={premium ? link.actionHref : "/pricing"}
                  className="mt-2 inline-flex text-xs font-semibold text-emerald-400"
                >
                  {premium
                    ? `${link.actionTitle} · ${link.actionMinutes} min →`
                    : "Pro matches this to your clocks →"}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-xs text-zinc-500">
            Intel loads when you are online. Cached items still show after a prior sync.
          </p>
        )}
        {!premium && pipeline.length > 1 && (
          <p className="mt-3 text-[11px] text-zinc-600">
            +{pipeline.length - 1} more signals locked — they already map to your gaps.
          </p>
        )}
      </GlassCard>

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
        {places.length > 0 && (
          <ul className="space-y-0 border-t border-white/[0.06] px-4 py-2">
            {places.slice(0, 3).map((pl) => (
              <li
                key={pl.id}
                className="flex items-center justify-between border-b border-white/[0.04] py-2 text-sm last:border-0"
              >
                <span className="text-zinc-200">{pl.name}</span>
                <span className="text-xs text-zinc-500">
                  {pl.distanceKm != null ? formatDistance(pl.distanceKm) : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>

      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Exposure at a glance
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CATEGORY_TILES.map((tile) => {
            const Icon = CATEGORY_ICONS[tile.key];
            const val = scores[tile.key] ?? 0;
            return (
              <Link
                key={tile.key}
                href={tile.href}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 transition hover:border-emerald-500/30"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  {Icon ? <Icon className="h-4 w-4" /> : null}
                </span>
                <p className="mt-2 text-xs text-zinc-500">{tile.label}</p>
                <p className="text-lg font-semibold tabular-nums text-zinc-100">{val}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {!premium && (
        <GlassCard tone="accent">
          <p className="text-sm font-medium text-zinc-100">Stop flying half-blind</p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500">
            You already know financial is weak. Digital, payment, and food clocks are not optional
            — they are just hidden on Free. Pro · $15/mo or $79/yr.
          </p>
          <Button size="sm" className="mt-3" disabled={paying} onClick={() => void unlock()}>
            {paying ? "Opening…" : "Unlock Pro · $15/mo"}
          </Button>
        </GlassCard>
      )}
    </div>
  );
}
