"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  loadSession,
  isPremium,
  daysSinceLastAssessment,
  type TiltSession,
} from "@/lib/session";
import { pickTodaysMove } from "@/lib/scoring";
import { computeBufferPlan } from "@/lib/buffer";
import {
  formatMoney,
  greetingForHour,
  resilienceLabel,
} from "@/lib/locale";
import { personalizeIntel } from "@/lib/intel";
import { getActiveMember } from "@/lib/family";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/app/glass-card";
import {
  CATEGORY_ICONS,
  IconBolt,
  IconPin,
  IconShield,
} from "@/components/app/icons";
import {
  IllusWallet,
  IllusTarget,
  ScoreBackdrop,
} from "@/components/illustrations";
import {
  buildExposurePipeline,
  regionalResilienceHint,
} from "@/lib/pipeline";
import { MiniMapInset } from "@/components/map/mini-inset";
import { AssessmentReminder } from "@/components/app/assessment-reminder";
import type { CategoryScores } from "@/types";

const CATEGORY_TILES: {
  key: keyof CategoryScores;
  label: string;
  tint: string;
}[] = [
  { key: "money", label: "Money", tint: "from-red-500/25 to-red-500/5" },
  { key: "digital", label: "Digital", tint: "from-amber-500/25 to-amber-500/5" },
  { key: "food", label: "Essentials", tint: "from-emerald-500/25 to-emerald-500/5" },
  { key: "home", label: "Home", tint: "from-lime-500/20 to-lime-500/5" },
  { key: "communication", label: "Mobility", tint: "from-cyan-500/25 to-cyan-500/5" },
  { key: "skills", label: "Health", tint: "from-teal-500/25 to-teal-500/5" },
  { key: "documents", label: "Community", tint: "from-violet-500/25 to-violet-500/5" },
  { key: "emergency", label: "Emergency", tint: "from-orange-500/25 to-orange-500/5" },
];

function Sparkline() {
  const pts = "0,28 20,22 40,24 60,14 80,16 100,8";
  return (
    <svg viewBox="0 0 100 32" className="mt-2 h-8 w-full max-w-[120px] text-emerald-400/90">
      <polyline fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  );
}

function ScoreRing({ score }: { score: number }) {
  const r = 40;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score)) / 100;
  const offset = c * (1 - pct);
  return (
    <svg width="108" height="108" className="-rotate-90">
      <circle cx="54" cy="54" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
      <circle
        cx="54"
        cy="54"
        r={r}
        fill="none"
        stroke="url(#ringGradToday)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
      />
      <defs>
        <linearGradient id="ringGradToday" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#2dd4bf" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function TodayPage() {
  const [session, setSession] = useState<TiltSession | null>(null);
  const [name, setName] = useState("there");
  const [daysSince, setDaysSince] = useState<number | null>(null);
  const [premium, setPrem] = useState(false);
  const [paying, setPaying] = useState(false);
  const [place, setPlace] = useState<string | null>(null);
  const [weather, setWeather] = useState<string | null>(null);

  useEffect(() => {
    setSession(loadSession());
    setDaysSince(daysSinceLastAssessment());
    setPrem(isPremium());
    try {
      const stored = localStorage.getItem("tiltshield_display_name");
      setName((stored || getActiveMember().name || "there").split(" ")[0]);
    } catch {
      /* */
    }
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude: lat, longitude: lon } = pos.coords;
          try {
            const w = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`
            );
            const j = await w.json();
            const temp = j?.current?.temperature_2m;
            if (typeof temp === "number") setWeather(`${Math.round(temp)}°`);
          } catch {
            /* */
          }
          try {
            const g = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
              { headers: { "Accept-Language": "en" } }
            );
            const gj = await g.json();
            const city =
              gj?.address?.city ||
              gj?.address?.town ||
              gj?.address?.village ||
              gj?.address?.state;
            if (city) setPlace(String(city));
          } catch {
            /* */
          }
        },
        () => {},
        { timeout: 8000 }
      );
    }
  }, []);

  async function unlock() {
    setPaying(true);
    try {
      const res = await fetch("/api/flutterwave/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "lifetime" }),
      });
      const json = await res.json();
      if (json.link) {
        window.location.href = json.link;
        return;
      }
      alert(json.error || "Payment is not configured.");
    } finally {
      setPaying(false);
    }
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-zinc-400">Complete your assessment to open Today.</p>
        <Button asChild className="mt-4">
          <Link href="/assessment">Get my resilience score</Link>
        </Button>
      </div>
    );
  }

  const { scores, vulnerabilities, answers } = session;
  const top = vulnerabilities[0];
  const move = pickTodaysMove(vulnerabilities);
  const plan = computeBufferPlan({
    monthlyIncome: answers.monthly_income || 0,
    monthlyExpenses: answers.monthly_expenses || 0,
    emergencyFundMonths: answers.emergency_fund_months || 0,
    targetMonths: 3,
  });
  const label = resilienceLabel(scores.overall);
  const intel = personalizeIntel({
    overall: scores.overall,
    topCategory: top?.category,
    hasAltPayment: answers.alt_payment_method,
    incomeSources: answers.income_sources,
  }).slice(0, 3);
  const region = regionalResilienceHint(scores.overall);
  const topPipe = buildExposurePipeline({
    intel: personalizeIntel({
      overall: scores.overall,
      topCategory: top?.category,
      hasAltPayment: answers.alt_payment_method,
      incomeSources: answers.income_sources,
    }),
    scores,
    answers,
  })[0];

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 lg:px-8 lg:py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
            {greetingForHour()}, {name} <span className="inline-block">👋</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Building toward a year of household resilience — here&apos;s today&apos;s picture.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {place && <span className="tilt-chip">📍 {place}</span>}
          {weather && <span className="tilt-chip">🌤 {weather}</span>}
          {daysSince !== null && (
            <span className="tilt-chip">
              Assessed {daysSince === 0 ? "today" : `${daysSince}d ago`}
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard tone="accent">
          <ScoreBackdrop />
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Resilience score
          </p>
          <div className="mt-3 flex items-center gap-4">
            <div className="relative shrink-0">
              <ScoreRing score={scores.overall} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold tabular-nums text-zinc-50">
                  {scores.overall}
                </span>
                <span className="text-[10px] text-zinc-600">/ 100</span>
              </div>
            </div>
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-400">
                <IconShield className="h-3.5 w-3.5" />
                {label}
              </p>
              <p className="mt-1 text-xs text-zinc-500">{region.label}</p>
              <Sparkline />
              <Link
                href="/app/history"
                className="mt-1 inline-block text-xs text-emerald-500 hover:underline"
              >
                View progress →
              </Link>
            </div>
          </div>
        </GlassCard>

        <GlassCard tone="danger">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Your biggest exposure
            </p>
            <span className="rounded-full bg-red-500/25 px-2 py-0.5 text-[10px] font-semibold uppercase text-red-300">
              {top?.severity || "High"}
            </span>
          </div>
          <div className="mt-3 flex items-start gap-3">
            <IllusWallet size={52} />
            <div className="min-w-0">
              <p className="text-lg font-semibold text-zinc-50">
                {top?.title || "Financial dependency"}
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                {top?.current_state ||
                  "Your life may rely heavily on a single income or payment rail."}
              </p>
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold tabular-nums text-zinc-50">
            {plan.runwayDays}{" "}
            <span className="text-sm font-normal text-zinc-500">days</span>
          </p>
          <p className="text-xs text-zinc-500">estimated runway if primary income stops</p>
          <Link
            href="/app/focus/money"
            className="mt-4 inline-flex rounded-xl bg-red-500/25 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/35"
          >
            Fix this first →
          </Link>
        </GlassCard>

        <GlassCard tone="success">
          <div className="flex items-start justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Today&apos;s priority
            </p>
            <IllusTarget size={52} />
          </div>
          <p className="mt-3 text-lg font-semibold text-zinc-50">
            {move?.title || "Review your buffer plan"}
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
            <span className="tilt-chip">{move?.time_estimate || "12 min"}</span>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] text-emerald-400">
              High impact
            </span>
          </div>
          <p className="mt-3 text-sm text-zinc-400">
            {move?.description ||
              "Build a small cash cushion for unexpected disruptions."}
          </p>
          <Link
            href="/app/prepare"
            className="mt-4 inline-flex rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
          >
            Start now →
          </Link>
        </GlassCard>
      </div>

      <AssessmentReminder />

      {topPipe && (
        <GlassCard className="border-emerald-500/15">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            What changed · for you
          </p>
          <p className="mt-2 text-sm font-medium text-zinc-100">{topPipe.eventTitle}</p>
          <p className="mt-1 text-xs text-zinc-500">
            <span className="text-amber-400/90">{topPipe.exposureLabel}</span>
            {" · "}
            {topPipe.exposureReason}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={topPipe.actionHref}
              className="inline-flex rounded-xl bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/25"
            >
              {topPipe.actionTitle} → ({topPipe.actionMinutes} min)
            </Link>
            <Link
              href="/app/nearby"
              className="inline-flex rounded-xl border border-white/15 px-3 py-2 text-xs font-medium text-zinc-200"
            >
              Places near you →
            </Link>
          </div>
        </GlassCard>
      )}

      <div className="grid gap-4 lg:grid-cols-5">
        <GlassCard className="lg:col-span-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Intel · things worth knowing
            </p>
            <Link href="/app/intel" className="text-xs text-emerald-500 hover:underline">
              View all →
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {intel.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-white/[0.06] bg-[#080d16] p-3.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                    <IconBolt className="h-3 w-3 text-amber-400/80" />
                    {item.category}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-medium capitalize",
                      item.impact === "high"
                        ? "text-red-400"
                        : item.impact === "medium"
                          ? "text-amber-400"
                          : "text-zinc-500"
                    )}
                  >
                    {item.impact}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium leading-snug text-zinc-200">
                  {item.title}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{item.summary}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Nearby resources
            </p>
            <Link href="/app/nearby" className="text-xs text-emerald-500 hover:underline">
              See all
            </Link>
          </div>
          <div className="mt-3">
            <MiniMapInset />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              { label: "Pharmacy", icon: "💊" },
              { label: "Grocery", icon: "🛒" },
              { label: "ATM", icon: "🏦" },
              { label: "Clinic", icon: "🏥" },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center gap-2 rounded-xl border border-white/[0.05] bg-[#080d16] px-2.5 py-2 text-xs text-zinc-300"
              >
                <span>{row.icon}</span>
                {row.label}
              </div>
            ))}
          </div>
          <Link
            href="/app/nearby"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-2.5 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/20"
          >
            <IconPin className="h-4 w-4" /> Open map →
          </Link>
        </GlassCard>
      </div>

      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Your resilience at a glance
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
          {CATEGORY_TILES.map((c) => {
            const Icon = CATEGORY_ICONS[c.key];
            return (
              <Link
                key={c.key}
                href={`/app/focus/${c.key}`}
                className={cn(
                  "group rounded-2xl border border-white/[0.08] bg-gradient-to-b p-3 text-center transition hover:border-white/15 hover:shadow-[0_0_24px_-8px_rgba(16,185,129,0.25)]",
                  c.tint
                )}
              >
                <span className="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-black/20 text-zinc-200 ring-1 ring-white/10">
                  {Icon ? <Icon className="h-4 w-4" /> : null}
                </span>
                <p className="text-[10px] text-zinc-400">{c.label}</p>
                <p className="mt-0.5 text-lg font-bold tabular-nums text-zinc-50">
                  {scores[c.key]}
                </p>
                <p className="text-[10px] text-zinc-600">/ 100</p>
              </Link>
            );
          })}
        </div>
      </div>

      <GlassCard>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Cash runway
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-zinc-50">
              {plan.runwayDays} days
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Target 90 days · gap {formatMoney(plan.gap)}
              {plan.weeklyTransfer > 0
                ? ` · suggest ${formatMoney(plan.weeklyTransfer)}/week`
                : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/app/what-if">Run What If</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/app/prepare">Open Prepare</Link>
            </Button>
          </div>
        </div>
      </GlassCard>

      {!premium && (
        <GlassCard tone="success">
          <p className="text-sm font-medium text-zinc-100">
            Unlock the full resilience system
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Lifetime $29: tools, vault, history, advanced What If. Household $49: all of that + up to 6 profiles.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => void unlock()} disabled={paying}>
              {paying ? "Opening checkout…" : "Lifetime · $29"}
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/app/family">Household · $49</Link>
            </Button>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
