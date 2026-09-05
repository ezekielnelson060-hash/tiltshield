"use client";

import Link from "next/link";
import { GlassCard } from "@/components/app/glass-card";
import { topThreeActions } from "@/lib/plan-from-assessment";
import type { AssessmentAnswers, Vulnerability } from "@/types";

export function TodaysPriority({
  answers,
  vulnerabilities: _vulnerabilities,
}: {
  answers: AssessmentAnswers;
  vulnerabilities: Vulnerability[];
}) {
  const actions = topThreeActions(answers);

  return (
    <GlassCard tone="success">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
        Fix the shortest clock first · 3 actions
      </p>
      <ol className="mt-4 space-y-3">
        {actions.map((a, i) => (
          <li
            key={a.id}
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-3"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-sm font-bold text-emerald-400">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-zinc-50">{a.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">{a.why}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-zinc-400">
                    {a.minutes}
                  </span>
                  <Link
                    href={a.href}
                    className="text-xs font-semibold text-emerald-400"
                  >
                    Start →
                  </Link>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </GlassCard>
  );
}
