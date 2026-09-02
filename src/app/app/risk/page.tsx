"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  const router = useRouter();
  const [session, setSession] = useState<TiltSession | null>(null);
  const focus = searchParams.get("cat");

  useEffect(() => {
    setSession(loadSession());
  }, []);

  // Legacy deep links /app/risk?cat=money → Focus action pages
  useEffect(() => {
    if (focus && KEYS.includes(focus as keyof CategoryScores)) {
      router.replace(`/app/focus/${focus}`);
    }
  }, [focus, router]);

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

  if (focus) {
    return (
      <div className="p-8 text-center text-zinc-500">Opening action page…</div>
    );
  }

  const { scores, vulnerabilities } = session;
  const top = vulnerabilities[0];

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <PageHeader
        title="My Risk"
        subtitle="Eight areas. One priority — open any row for moves and places."
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
            href={`/app/focus/${top.category}`}
            className="mt-4 inline-flex rounded-xl bg-red-500/20 px-4 py-2 text-sm font-medium text-red-200"
          >
            Open action page →
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
              href={`/app/focus/${key}`}
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

      <GlassCard>
        <p className="text-sm font-medium text-zinc-100">
          What if cards and banks fail for a long stretch?
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Cash float, second rails, hardware wallets, metals — educational paths.
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
