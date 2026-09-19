"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { loadSession, isPremium, type TiltSession } from "@/lib/session";
import { openUpgrade } from "@/lib/upgrade";
import { greetingForHour, resilienceLabel, formatDistance } from "@/lib/locale";
import { getActiveMember } from "@/lib/family";
import { Button } from "@/components/ui/button";
import { CATEGORY_ICONS } from "@/components/app/icons";
import { TodaysPriority } from "@/components/app/todays-priority";
import { yearPlanSummary } from "@/lib/plan-from-assessment";
import { buildExposureSnapshot } from "@/lib/break-point";
import { useTodayData } from "@/hooks/use-today-data";
import type { CategoryScores } from "@/types";
import { stockProgress, YEAR_STOCK } from "@/lib/year-stock";
import { loadJournal } from "@/lib/journal";
import { ScorePulseBanner } from "@/components/app/score-pulse-banner";
import { cn } from "@/lib/utils";

const NearbyMap = dynamic(
  () => import("@/components/map/nearby-map").then((m) => m.NearbyMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-40 items-center justify-center rounded-2xl bg-[#0a0f18] text-xs text-zinc-600">
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

function ScoreRing({ score, size = 96 }: { score: number; size?: number }) {
  const r = size * 0.37;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score)) / 100;
  const offset = c * (1 - pct);
  const mid = size / 2;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={mid} cy={mid} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
      <circle
        cx={mid}
        cy={mid}
        r={r}
        fill="none"
        stroke="url(#expGrad)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
      />
      <defs>
        <linearGradient id="expGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#2dd4bf" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function TodayScreen() {
  const [session, setSession] = useState<TiltSession | null>(null);
  const [name, setName] = useState("there");
  const [premium, setPrem] = useState(false);
  const [ready, setReady] = useState(false);
  const [stock, setStock] = useState({
    done: 0,
    total: YEAR_STOCK.length,
    pct: 0,
    remaining: YEAR_STOCK,
  });
  const [journalCount, setJournalCount] = useState(0);
  const {
    coords,
    places,
    placeLabel,
    daysSince,
    pipeline,
    assessedLabel,
    locStatus,
    requestLocation,
  } = useTodayData();

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
    function refreshSession() {
      try {
        setSession(loadSession());
        setPrem(isPremium());
      } catch {
        /* */
      }
      refreshProgress();
    }
    window.addEventListener("tiltshield:progress", refreshProgress);
    window.addEventListener("tiltshield:session-update", refreshSession);
    return () => {
      window.removeEventListener("tiltshield:progress", refreshProgress);
      window.removeEventListener("tiltshield:session-update", refreshSession);
    };
  }, []);

  if (!ready) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center text-sm text-zinc-500">
        Loading…
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-lg space-y-4 px-4 py-16 text-center">
        <p className="text-xl font-semibold tracking-tight text-zinc-50">
          Measure exposure first
        </p>
        <p className="text-sm text-zinc-500">
          Nine questions. Then Today shows your clocks and year plan.
        </p>
        <Button asChild className="mt-2">
          <Link href="/assessment">Get my score</Link>
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
  const finDays = financial?.days ?? runwayDays;
  const primaryValue = premium
    ? exposure?.primary?.value || `${runwayDays} days`
    : financial?.value || `${runwayDays} days`;
  const primaryMeaning = premium
    ? exposure?.primary?.meaning
    : financial?.meaning ||
      `If primary income stops, reserves cover about ${runwayDays} days.`;
  const otherClocks =
    exposure?.points
      .filter((bp) =>
        premium ? bp.id !== exposure.primary?.id : bp.id !== "financial"
      )
      .slice(0, 3) || [];

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 pb-28 pt-5 lg:px-8">
      <header className="space-y-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-500/80">
            Today
          </p>
          <h1 className="mt-1 text-[1.65rem] font-semibold tracking-tight text-zinc-50">
            {greetingForHour()}, {name}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => requestLocation()}
            className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] text-zinc-400 transition hover:border-emerald-500/30 hover:text-zinc-200"
          >
            {placeLabel
              ? placeLabel
              : locStatus === "locating"
                ? "Locating…"
                : locStatus === "denied"
                  ? "Enable location"
                  : "Your area"}
          </button>
          <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] text-zinc-500">
            {assessedLabel(daysSince)}
          </span>
          {!premium && (
            <span className="rounded-full border border-white/[0.06] px-3 py-1 text-[11px] text-zinc-600">
              Free
            </span>
          )}
        </div>
      </header>

      <ScorePulseBanner />

      <section className="overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-gradient-to-b from-white/[0.05] to-white/[0.015] shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]">
        <div className="flex items-center gap-5 px-5 pb-4 pt-5">
          <div className="relative shrink-0">
            <ScoreRing score={scores.overall || 0} size={100} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[1.65rem] font-bold tabular-nums leading-none text-zinc-50">
                {scores.overall || 0}
              </span>
              <span className="mt-0.5 text-[9px] font-medium tracking-wide text-zinc-600">
                / 100
              </span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-400/90">
              Exposure
            </p>
            <p className="mt-1 text-xl font-semibold tracking-tight text-zinc-50">
              {label}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
              {exposure
                ? `${exposure.significantDependencies} significant dependencies`
                : "Loading dependencies…"}
              {exposure?.primary && (
                <>
                  {" · "}
                  <span className="text-red-400/90">
                    Weakest ·{" "}
                    {exposure.primary.label.replace(" break point", "")}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "border-t border-white/[0.06] px-5 py-4",
            finDays < 30 && "bg-gradient-to-r from-red-500/[0.07] to-transparent"
          )}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-red-400/85">
            Break point
          </p>
          <p className="mt-1.5 text-3xl font-bold tracking-tight tabular-nums text-zinc-50">
            {primaryValue}
          </p>
          <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-zinc-400">
            {primaryMeaning}
          </p>
          <div className="mt-3">
            {premium ? (
              <Link
                href="/app/what-if"
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                Run the scenario →
              </Link>
            ) : (
              <button
                type="button"
                onClick={() =>
                  openUpgrade({
                    feature: "Break points",
                    title: "See every clock that is running",
                    body: "Free shows the financial break point. Pro unlocks payment, digital, food, and the rest.",
                  })
                }
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                See what else is timed →
              </button>
            )}
          </div>
        </div>
      </section>

      {premium && otherClocks.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {otherClocks.map((bp) => (
            <div
              key={bp.id}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.025] px-3 py-3"
            >
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
                {bp.label.replace(" break point", "")}
              </p>
              <p
                className={cn(
                  "mt-1.5 text-base font-bold tabular-nums",
                  bp.severity === "critical"
                    ? "text-red-400"
                    : bp.severity === "high"
                      ? "text-amber-400"
                      : "text-zinc-100"
                )}
              >
                {bp.value}
              </p>
            </div>
          ))}
        </div>
      )}
      {!premium && otherClocks.length > 0 && (
        <button
          type="button"
          onClick={() =>
            openUpgrade({
              feature: "Break points",
              title: "More clocks are still running",
              body: "Payment, digital, and food clocks stay hidden on free. Pro shows every number.",
            })
          }
          className="flex w-full items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3.5 text-left transition hover:border-emerald-500/25 active:scale-[0.99]"
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
              More break points
            </p>
            <p className="mt-1 text-sm text-zinc-300">Payment · Digital · Food</p>
          </div>
          <span className="rounded-full bg-emerald-500/12 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
            Pro
          </span>
        </button>
      )}

      <TodaysPriority answers={answers} vulnerabilities={vulnerabilities} />

      {premium && (
        <p className="text-xs leading-relaxed text-zinc-600">
          {yearPlanSummary(answers)}
        </p>
      )}

      <section className="relative overflow-hidden rounded-[1.35rem] border border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.09] via-white/[0.02] to-transparent p-5">
        <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400/90">
              Year plan
            </p>
            <p className="mt-0.5 text-sm font-semibold text-zinc-50">Progress this year</p>
          </div>
          <Link
            href="/app/prepare"
            className="rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold text-emerald-300 ring-1 ring-emerald-500/25"
          >
            Log move →
          </Link>
        </div>
        <div className="relative mt-5 flex items-end justify-between">
          <div>
            <p className="text-4xl font-bold tracking-tight tabular-nums text-zinc-50">
              {stock.done}
              <span className="text-lg font-medium text-zinc-600">/{stock.total}</span>
            </p>
            <p className="mt-1 text-[11px] text-zinc-500">stocked</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold tabular-nums text-emerald-400">{stock.pct}%</p>
            <p className="text-[10px] uppercase tracking-wide text-zinc-600">done</p>
          </div>
        </div>
        <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-black/40">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-300 transition-all duration-500"
            style={{
              width: `${Math.max(stock.pct, stock.pct > 0 ? 3 : 0)}%`,
            }}
          />
        </div>
        {stock.remaining.length > 0 && (
          <ul className="relative mt-4 space-y-2">
            {stock.remaining.slice(0, 3).map((item, i) => (
              <li key={item.id} className="flex items-center gap-2.5 text-xs text-zinc-400">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/10 text-[10px] text-zinc-600">
                  {i + 1}
                </span>
                {item.label}
              </li>
            ))}
          </ul>
        )}
        <p className="relative mt-3 text-[11px] text-zinc-600">
          {journalCount === 0
            ? "No journal yet — log one move in Prepare."
            : `${journalCount} journal ${journalCount === 1 ? "entry" : "entries"} on file.`}
        </p>
      </section>

      <section className="rounded-[1.35rem] border border-white/[0.07] bg-white/[0.02] p-5">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            What's changed
          </p>
          {premium ? (
            <Link href="/app/intel" className="text-xs font-medium text-emerald-400">
              All intel →
            </Link>
          ) : (
            <button
              type="button"
              onClick={() =>
                openUpgrade({
                  feature: "Intel",
                  title: "Full intel is Pro",
                  body: "Free shows one matched signal. Pro opens the full board.",
                })
              }
              className="text-xs font-medium text-emerald-400"
            >
              Full intel →
            </button>
          )}
        </div>
        {pipeline.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {(premium ? pipeline : pipeline.slice(0, 1)).map((link) => (
              <li
                key={link.eventId}
                className="rounded-xl border border-white/[0.05] bg-black/20 px-3.5 py-3"
              >
                <p className="text-[10px] uppercase tracking-wide text-zinc-600">
                  World → {link.exposureLabel}
                </p>
                <p className="mt-1 text-sm font-medium text-zinc-100">{link.eventTitle}</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                  {link.exposureReason}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-xs text-zinc-600">Signals appear when you're online.</p>
        )}
      </section>

      <section className="overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-white/[0.02]">
        <div className="flex items-center justify-between px-4 pt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Nearby
            </p>
            <p className="mt-0.5 text-xs text-zinc-600">
              {placeLabel ? placeLabel : coords ? "Near you" : "Tap area above to pin"}
            </p>
          </div>
          <Link href="/app/nearby?q=pharmacy" className="text-xs font-medium text-emerald-400">
            Open map →
          </Link>
        </div>
        <div className="mt-3">
          <NearbyMap
            places={places}
            selected={places[0] || null}
            user={coords}
            onSelect={() => {}}
            className="h-40 w-full"
          />
        </div>
        {places.length > 0 && (
          <ul className="divide-y divide-white/[0.04] px-4 py-1">
            {places.slice(0, 3).map((pl) => (
              <li
                key={pl.id}
                className="flex items-center justify-between py-2.5 text-sm"
              >
                <span className="truncate text-zinc-200">{pl.name}</span>
                <span className="shrink-0 pl-3 text-xs tabular-nums text-zinc-600">
                  {pl.distanceKm != null ? formatDistance(pl.distanceKm) : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
          Categories
        </p>
        <div className="grid grid-cols-4 gap-2">
          {CATEGORY_TILES.map((tile) => {
            const Icon = CATEGORY_ICONS[tile.key];
            const val = scores[tile.key] ?? 0;
            return (
              <Link
                key={tile.key}
                href={tile.href}
                className="flex flex-col items-center rounded-2xl border border-white/[0.06] bg-white/[0.02] px-1 py-3 transition hover:border-emerald-500/25"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                </span>
                <p className="mt-2 text-[10px] text-zinc-600">{tile.label}</p>
                <p className="text-sm font-semibold tabular-nums text-zinc-200">{val}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
