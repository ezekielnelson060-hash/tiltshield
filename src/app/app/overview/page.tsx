"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  loadSession,
  isPremium,
  daysSinceLastAssessment,
  type TiltSession,
} from "@/lib/session";
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
import { CATEGORY_ICONS } from "@/components/app/icons";
import { ScoreBackdrop } from "@/components/illustrations";
import {
  buildExposurePipeline,
  regionalResilienceHint,
} from "@/lib/pipeline";
import { MiniMapInset } from "@/components/map/mini-inset";
import { AssessmentReminder } from "@/components/app/assessment-reminder";
import { TodaysPriority } from "@/components/app/todays-priority";
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

export default function OverviewPage() {
  const [session, setSession] = useState<TiltSession | null>(null);
  const [name, setName] = useState("there");
  const [premium, setPrem] = useState(false);
  const [daysSince, setDaysSince] = useState<number | null>(null);
  const [place, setPlace] = useState<string | null>(null);
  const [weather, setWeather] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const s = loadSession();
    setSession(s);
    setPrem(isPremium());
    setDaysSince(daysSinceLastAssessment());
    try {
      setName(
        localStorage.getItem("tiltshield_display_name") ||
          getActiveMember().name ||
          "there"
      );
    } catch {
      /* */
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const r = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`,
              { headers: { "Accept-Language": "en" } }
            );
            const j = await r.json();
            const city =
              j.address?.city ||
              j.address?.town ||
              j.address?.village ||
              j.address?.state;
            if (city) setPlace(city);
          } catch {
            /* */
          }
        },
        () => {},
        { timeout: 6000 }
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
      if (json.link) window.location.href = json.link;
    } finally {
      setPaying(false);
    }
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-zinc-400">Complete your assessment to open Today.</p>
        <Button asChild className="mt-4">
          <Link href="/assessment">Get my resilience score</Link>
        </Button>
      </div>
    );
  }

  const { scores, vulnerabilities, answers } = session;
  const top = vulnerabilities[0];
  const plan = computeBufferPlan({
    monthlyIncome: answers.monthly_income || 0,
    monthlyExpenses: answers.monthly_expenses || 0,
    emergencyFundMonths: answers.emergency_fund_months || 0,
    targetMonths: 3,
  });
  const label = resilienceLabel(scores.overall);
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
  const region = regionalResilienceHint(scores.overall);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 lg:px-8 lg:py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
            {greetingForHour()}, {name}
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
            <div className="relative">
              <ScoreRing score={scores.overall} />
              <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
                <span className="text-2xl font-bold tabular-nums text-zinc-50">
                  {scores.overall}
                </span>
                <span className="text-[10px] text-zinc-500">/ 100</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-400">{label}</p>
              <p className="mt-1 text-xs text-zinc-500">{region}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Top exposure
          </p>
          <p className="mt-3 text-lg font-semibold text-zinc-50">
            {top?.title || "No critical gaps flagged"}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-zinc-500">
            {top?.description ||
              "Keep building layers — food, cash, people, and offline access."}
          </p>
          <Link
            href="/app/risk"
            className="mt-4 inline-block text-xs font-medium text-emerald-400"
          >
            See full risk →
          </Link>
        </GlassCard>

        <TodaysPriority answers={answers} vulnerabilities={vulnerabilities} />
      </div>

      <AssessmentReminder />

      {topPipe && (
        <GlassCard className="border-emerald-500/15">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            What changed · world → you
          </p>
          <p className="mt-2 text-sm font-medium text-zinc-100">{topPipe.title}</p>
          <p className="mt-1 text-xs text-zinc-500">{topPipe.detail}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href="/app/what-if" className="text-xs font-medium text-emerald-400">
              Run What If →
            </Link>
            <Link href="/app/prepare" className="text-xs font-medium text-zinc-400">
              Prepare
            </Link>
          </div>
        </GlassCard>
      )}

      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Focus areas
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CATEGORY_TILES.map((c) => {
            const Icon = CATEGORY_ICONS[c.key];
            return (
              <Link
                key={c.key}
                href={`/app/focus/${c.key}`}
                className={cn(
                  "rounded-2xl border border-white/[0.08] bg-gradient-to-b p-3 text-center transition hover:border-emerald-500/25",
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
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Nearby
          </p>
          <p className="mt-2 text-sm text-zinc-300">
            Find cash, food, pharmacy, and more near you.
          </p>
          <div className="mt-3 overflow-hidden rounded-xl">
            <MiniMapInset />
          </div>
          <Link
            href="/app/nearby"
            className="mt-3 inline-block text-xs font-medium text-emerald-400"
          >
            Open map →
          </Link>
        </GlassCard>

        <GlassCard>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Cash runway
          </p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-zinc-50">
            {plan.runwayDays} days
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Target 90 days · gap {formatMoney(plan.gap)}
            {plan.weeklyTransfer > 0
              ? ` · suggest ${formatMoney(plan.weeklyTransfer)}/week`
              : ""}
          </p>
          <div className="mt-4 flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/app/what-if">Run What If</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/app/prepare">Open Prepare</Link>
            </Button>
          </div>
        </GlassCard>
      </div>

      {!premium && (
        <GlassCard tone="success">
          <p className="text-sm font-medium text-zinc-100">
            Unlock the full resilience system
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Lifetime $29 · Household $49 (up to 6 profiles).
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
