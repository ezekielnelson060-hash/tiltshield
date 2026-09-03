"use client";

import Link from "next/link";
import { GlassCard } from "@/components/app/glass-card";
import { IllusTarget } from "@/components/illustrations";
import { planMovesFromAssessment } from "@/lib/plan-from-assessment";
import { pickTodaysMove } from "@/lib/scoring";
import type { AssessmentAnswers, Vulnerability } from "@/types";

export function TodaysPriority({
  answers,
  vulnerabilities,
}: {
  answers: AssessmentAnswers;
  vulnerabilities: Vulnerability[];
}) {
  const topPlan = planMovesFromAssessment(answers)[0];
  const move = pickTodaysMove(vulnerabilities);

  return (
    <GlassCard tone="success">
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
          Today&apos;s priority
        </p>
        <IllusTarget size={52} />
      </div>
      <p className="mt-3 text-lg font-semibold text-zinc-50">
        {topPlan?.title || move?.title || "Review your buffer plan"}
      </p>
      <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
        <span className="tilt-chip">
          {topPlan?.minutes || move?.time_estimate || "12 min"}
        </span>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] text-emerald-400">
          High impact
        </span>
      </div>
      <p className="mt-3 text-sm text-zinc-400">
        {topPlan?.why ||
          move?.description ||
          "Build a small cash cushion for unexpected disruptions."}
      </p>
      <Link
        href={topPlan?.href || "/app/prepare"}
        className="mt-4 inline-flex rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
      >
        Start now →
      </Link>
    </GlassCard>
  );
}
