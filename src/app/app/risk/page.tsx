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

const KEYS: (keyof CategoryScores)[] = [
  "money", "digital", "food", "documents", "communication", "home", "skills", "emergency",
];

function statusLabel(s: ReturnType<typeof categoryStatus>) {
  if (s === "healthy") return "Strong";
  if (s === "attention") return "Needs attention";
  return "Critical";
}

function RiskInner() {
  const searchParams = useSearchParams();
  const [session, setSession] = useState<TiltSession | null>(null);
  const focus = searchParams.get("cat");

  useEffect(() => {
    setSession(loadSession());
  }, []);

  if (!session) return null;

  const { scores, vulnerabilities } = session;
  const focused = focus
    ? vulnerabilities.find((v) => v.category === focus)
    : null;
  const focusedScore = focus ? (scores[focus as keyof CategoryScores] as number) : null;

  if (focus && focusedScore != null) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-8 lg:px-8">
        <Link href="/app/risk" className="text-sm text-zinc-500 hover:text-zinc-300">
          ← My Risk
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">
            {CATEGORY_LABELS[focus] || focus}
          </h1>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-zinc-50">{focusedScore}</span>
            <span className="text-zinc-600">/ 100</span>
          </div>
        </div>
        {focused && (
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              Your exposure
            </p>
            <p className="mt-2 text-sm text-zinc-300">{focused.current_state}</p>
            <p className="mt-4 text-sm text-zinc-400">
              <span className="text-zinc-200">Recommended move:</span>{" "}
              {focused.next_action}
            </p>
            <div className="mt-5">
              <Button asChild size="sm">
                <Link href="/app/actions">Start →</Link>
              </Button>
            </div>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">My Risk</h1>
        <p className="mt-1 text-sm text-zinc-500">Eight areas. One priority.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-800">
        <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 border-b border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
          <span>Area</span>
          <span>Status</span>
          <span className="text-right">Score</span>
        </div>
        {KEYS.map((key) => {
          const score = scores[key] as number;
          const st = categoryStatus(score);
          return (
            <Link
              key={key}
              href={`/app/risk?cat=${key}`}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 border-b border-zinc-900 px-4 py-3.5 transition hover:bg-zinc-900/40 last:border-0"
            >
              <span className="text-sm font-medium text-zinc-200">{CATEGORY_LABELS[key]}</span>
              <span
                className={cn(
                  "text-xs",
                  st === "healthy" && "text-emerald-400",
                  st === "attention" && "text-amber-400",
                  st === "critical" && "text-red-400"
                )}
              >
                {statusLabel(st)}
              </span>
              <span className="text-right text-sm tabular-nums text-zinc-400">{score}</span>
            </Link>
          );
        })}
      </div>

      <section className="space-y-3">
        <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
          Ranked exposures
        </p>
        {vulnerabilities.map((v) => (
          <div key={v.rank} className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-100">
                {v.rank}. {v.title}
              </p>
              <span className="text-xs uppercase text-zinc-500">{v.severity}</span>
            </div>
            <p className="mt-1 text-xs text-zinc-500">{v.current_state}</p>
          </div>
        ))}
      </section>
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
