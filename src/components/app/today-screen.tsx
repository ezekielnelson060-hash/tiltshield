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
  const { coords, places, intel, placeLabel, daysSince, pipeline, assessedLabel } = useTodayData();

  useEffect(() => {
    try {
      const s = loadSession();
      setSession(s);
      setPrem(isPremium());
      setName(localStorage.getItem("tiltshield_display_name") || getActiveMember().name || "there");
    } catch {
      setSession(null);
    }
    setReady(true);
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

  if (!ready) {
    return <div className="mx-auto max-w-lg px-4 py-16 text-center text-zinc-500">Loading your day…</div>;
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-lg font-semibold text-zinc-50">Start here</p>
        <p className="mt-2 text-sm text-zinc-400">Nine short questions so Today can show your exposure, break points, map, and next move.</p>
        <Button asChild className="mt-6"><Link href="/assessment">Measure your exposure</Link></Button>
      </div>
    );
  }

  const scores = session.scores;
  const answers = session.answers;
  const vulnerabilities = session.vulnerabilities || [];
  const label = resilienceLabel(scores.overall || 0);
  const runwayDays = Math.round((answers.emergency_fund_months || 0) * 30);
  const exposure = buildExposureSnapshot(answers, scores);
  try {
    computeBufferPlan({
      monthlyIncome: answers.monthly_income || 0,
      monthlyExpenses: answers.monthly_expenses || 0,
      emergencyFundMonths: answers.emergency_fund_months || 0,
      targetMonths: 3,
    });
  } catch { /* */ }

  return (
    <div className="mx-auto max-w-2xl space-y-5 px-4 py-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
          {greetingForHour()}, {name} <span className="inline-block" aria-hidden>👋</span>
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">{placeLabel || "Your area"}</span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">{assessedLabel(daysSince)}</span>
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-emerald-400/90">Live intel on</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_1.1fr]">
        <GlassCard className="flex items-center gap-4">
          <div className="relative shrink-0">
            <ScoreRing score={scores.overall || 0} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold tabular-nums text-zinc-50">{scores.overall || 0}</span>
              <span className="text-[10px] text-zinc-500">/ 100</span>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-400/90">Exposure</p>
            <p className="mt-1 text-lg font-semibold text-zinc-50">{label}</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
              {exposure
                ? `You have ${exposure.significantDependencies} significant dependencies.`
                : "Dependencies still loading."}
            </p>
            {exposure?.weakest && (
              <p className="mt-1 text-xs text-zinc-400">
                Weakest point · <span className="font-semibold text-red-400">{exposure.weakest.label}</span>
              </p>
            )}
          </div>
        </GlassCard>
        <GlassCard tone={exposure && exposure.primary.days < 30 ? "danger" : "default"}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-red-400/90">Break point</p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-zinc-50">
            {exposure?.primary.value || `${runwayDays} days`}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            {exposure?.primary.meaning ||
              `If primary income stops, reserves cover about ${runwayDays} days.`}
          </p>
          <Link href="/app/what-if" className="mt-3 inline-block text-xs font-semibold text-emerald-400">
            Run the scenario →
          </Link>
        </GlassCard>
      </div>

      {exposure && (
        <div className="grid gap-2 sm:grid-cols-3">
          {exposure.points.slice(1, 4).map((bp) => (
            <div
              key={bp.id}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3 py-3"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                {bp.label}
              </p>
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
            </div>
          ))}
        </div>
      )}

      <TodaysPriority answers={answers} vulnerabilities={vulnerabilities} />
      <p className="text-xs leading-relaxed text-zinc-500">{yearPlanSummary(answers)}</p>

      {pipeline.length > 0 ? (
        <GlassCard>
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">What&apos;s changed · for you</p>
            <Link href="/app/intel" className="text-xs font-medium text-emerald-400">All intel →</Link>
          </div>
          <ul className="mt-3 space-y-3">
            {pipeline.map((link) => (
              <li key={link.eventId} className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-3">
                <p className="text-[10px] uppercase tracking-wide text-zinc-600">World → {link.exposureLabel}</p>
                <p className="mt-1 text-sm font-medium text-zinc-100">{link.eventTitle}</p>
                <p className="mt-1 text-xs text-zinc-500">{link.exposureReason}</p>
                <Link href={link.actionHref} className="mt-2 inline-flex text-xs font-semibold text-emerald-400">
                  {link.actionTitle} · {link.actionMinutes} min →
                </Link>
              </li>
            ))}
          </ul>
        </GlassCard>
      ) : (
        <GlassCard>
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Intel · what changed</p>
            <Link href="/app/intel" className="text-xs font-medium text-emerald-400">All intel →</Link>
          </div>
          {intel.length === 0 ? (
            <p className="mt-3 text-xs text-zinc-500">Live feed loading or quiet right now. Open Intel for the full board.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {intel.slice(0, 4).map((item, i) => (
                <li key={i}>
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 hover:border-emerald-500/25">
                      <span className="text-[10px] uppercase text-zinc-600">{item.category || "Watch"}</span>
                      <span className="mt-0.5 block text-sm text-zinc-200">{item.title}</span>
                    </a>
                  ) : (
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
                      <span className="text-sm text-zinc-200">{item.title}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      )}

      <GlassCard className="!p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 pt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Nearby</p>
            <p className="text-xs text-zinc-500">{placeLabel ? `Pharmacies near ${placeLabel}` : "Pharmacies and essentials near you"}</p>
          </div>
          <Link href="/app/nearby?q=pharmacy" className="text-xs font-medium text-emerald-400">Open map →</Link>
        </div>
        <div className="mt-3 border-t border-white/[0.06]">
          <NearbyMap places={places} selected={places[0] || null} user={coords} onSelect={() => {}} className="h-44 w-full" />
        </div>
        {places.length > 0 && (
          <ul className="space-y-1 px-3 py-3">
            {places.slice(0, 3).map((p) => (
              <li key={p.id}>
                <a href={mapsSearchUrl(p.name, p.lat, p.lon)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm text-zinc-300 hover:bg-white/[0.04]">
                  <span className="truncate">{p.name}</span>
                  <span className="shrink-0 text-[11px] text-zinc-500">{p.distanceKm != null ? formatDistance(p.distanceKm) : "Map"}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>

      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Exposure at a glance</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CATEGORY_TILES.map((t) => {
            const Icon = CATEGORY_ICONS[t.key];
            const val = scores[t.key] ?? 0;
            return (
              <Link key={t.key} href={t.href} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 transition hover:border-emerald-500/30">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">{Icon ? <Icon className="h-4 w-4" /> : null}</span>
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
          <p className="mt-1 text-xs text-zinc-500">Lifetime plan — deeper What If, vault, progress history.</p>
          <Button size="sm" className="mt-3" disabled={paying} onClick={() => void unlock()}>{paying ? "Opening…" : "Unlock · $29"}</Button>
        </GlassCard>
      )}
    </div>
  );
}
