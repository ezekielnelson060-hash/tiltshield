"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  loadSession,
  CATEGORY_LABELS,
  categoryStatus,
  type TiltSession,
} from "@/lib/session";
import type { CategoryScores } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/page-header";
import { GlassCard } from "@/components/app/glass-card";
import { CATEGORY_ICONS } from "@/components/app/icons";

const KEYS: (keyof CategoryScores)[] = [
  "money",
  "digital",
  "food",
  "documents",
  "communication",
  "home",
  "skills",
  "emergency",
];

function statusLabel(s: ReturnType<typeof categoryStatus>) {
  if (s === "healthy") return "Strong";
  if (s === "attention") return "Watch";
  return "Critical";
}

function statusTone(s: ReturnType<typeof categoryStatus>) {
  if (s === "healthy") return "text-emerald-400";
  if (s === "attention") return "text-amber-400";
  return "text-red-400";
}

function RiskInner() {
  const searchParams = useSearchParams();
  const [session, setSession] = useState<TiltSession | null>(null);
  const focus = searchParams.get("cat");

  useEffect(() => {
    setSession(loadSession());
  }, []);

  if (!session) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-zinc-500">
        Complete your assessment to see exposures.
        <div className="mt-4">
          <Button asChild size="sm">
            <Link href="/assessment">Get my score</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { scores, vulnerabilities } = session;
  const focused = focus
    ? vulnerabilities.find((v) => v.category === focus)
    : null;
  const focusedScore = focus
    ? (scores[focus as keyof CategoryScores] as number)
    : null;

  if (focus && focusedScore != null) {
    const st = categoryStatus(focusedScore);
    const Icon = CATEGORY_ICONS[focus as keyof typeof CATEGORY_ICONS];
    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
        <PageHeader
          title={CATEGORY_LABELS[focus] || focus}
          subtitle="Your exposure in this area — with the next move."
          backHref="/app/risk"
          showBack
        />
        <GlassCard tone={st === "critical" ? "danger" : "default"}>
          <div className="flex items-center gap-3">
            {Icon && (
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] ring-1 ring-white/10">
                <Icon className="h-5 w-5 text-zinc-200" />
              </span>
            )}
            <div>
              <p className="text-3xl font-bold tabular-nums text-zinc-50">
                {focusedScore}{" "}
                <span className="text-sm font-normal text-zinc-500">/ 100</span>
              </p>
              <p className={cn("text-xs font-semibold uppercase", statusTone(st))}>
                {statusLabel(st)}
              </p>
            </div>
          </div>
          {focused && (
            <>
              <p className="mt-4 text-sm text-zinc-300">{focused.current_state}</p>
              <p className="mt-3 text-sm text-zinc-400">
                <span className="text-zinc-200">Next move:</span>{" "}
                {focused.next_action}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link href="/app/prepare">Open Prepare</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/app/what-if">Run What If</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/app/offline-value">Offline value paths</Link>
                </Button>
              </div>
            </>
          )}
        </GlassCard>
      </div>
    );
  }

  const top = vulnerabilities[0];

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <PageHeader
        title="My Risk"
        subtitle="Eight areas. One priority — strengthen the weakest first."
        backHref="/app/overview"
        showBack
      />

      {top && (
        <GlassCard tone="danger">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Top exposure
          </p>
          <p className="mt-2 text-lg font-semibold text-zinc-50">{top.title}</p>
          <p className="mt-1 text-sm text-zinc-400">{top.current_state}</p>
          <Link
            href={`/app/risk?cat=${top.category}`}
            className="mt-4 inline-flex rounded-xl bg-red-500/20 px-4 py-2 text-sm font-medium text-red-200"
          >
            Fix this first →
          </Link>
        </GlassCard>
      )}

      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.02] shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]">
        <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 border-b border-white/[0.06] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          <span>Area</span>
          <span>Status</span>
          <span className="text-right">Score</span>
        </div>
        {KEYS.map((key) => {
          const score = scores[key] as number;
          const st = categoryStatus(score);
          const Icon = CATEGORY_ICONS[key];
          return (
            <Link
              key={key}
              href={`/app/risk?cat=${key}`}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 border-b border-white/[0.05] px-4 py-3.5 transition last:border-0 hover:bg-white/[0.03]"
            >
              <span className="flex items-center gap-3 text-sm font-medium text-zinc-100">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] ring-1 ring-white/10">
                  {Icon ? <Icon className="h-3.5 w-3.5 text-zinc-300" /> : null}
                </span>
                {CATEGORY_LABELS[key]}
              </span>
              <span className={cn("text-xs font-semibold", statusTone(st))}>
                {statusLabel(st)}
              </span>
              <span className="text-right text-sm font-bold tabular-nums text-zinc-50">
                {score}
              </span>
            </Link>
          );
        })}
      </section>

      <section className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Ranked exposures
        </p>
        {vulnerabilities.slice(0, 6).map((v, i) => (
          <Link
            key={v.rank ?? i}
            href={`/app/risk?cat=${v.category}`}
            className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 transition hover:border-white/15"
          >
            <div>
              <p className="text-sm font-medium text-zinc-100">
                {v.rank ?? i + 1}. {v.title}
              </p>
              <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">
                {v.current_state}
              </p>
            </div>
            <span
              className={cn(
                "text-[10px] font-semibold uppercase",
                v.severity === "critical" || v.severity === "high"
                  ? "text-red-400"
                  : "text-amber-400"
              )}
            >
              {v.severity}
            </span>
          </Link>
        ))}
      </section>

      <GlassCard>
        <p className="text-sm font-medium text-zinc-100">
          What if cards and banks fail for a long stretch?
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Cash float, second rails, hardware wallets, metals dealers — educational paths with
          distance from you.
        </p>
        <Button asChild size="sm" className="mt-3">
          <Link href="/app/offline-value">Open offline value paths</Link>
        </Button>
      </GlassCard>
    </div>
  );
}

export default function RiskPage() {
  return (
    <Suspense fallback={<div className="p-8 text-zinc-500">Loading…</div>}>
      <RiskInner />
    </Suspense>
  );
}
