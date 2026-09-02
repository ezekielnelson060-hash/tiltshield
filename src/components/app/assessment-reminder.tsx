"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { daysSinceLastAssessment } from "@/lib/session";
import {
  assessmentDue,
  assessmentDueLabel,
  ASSESSMENT_INTERVAL_DAYS,
} from "@/lib/reminders";
import { GlassCard } from "@/components/app/glass-card";

/** Shows when a full re-assessment is due (~every 28 days). */
export function AssessmentReminder() {
  const [daysSince, setDaysSince] = useState<number | null>(null);

  useEffect(() => {
    setDaysSince(daysSinceLastAssessment());
  }, []);

  if (!assessmentDue(daysSince)) return null;

  return (
    <GlassCard tone="danger">
      <p className="text-sm font-medium text-zinc-100">Monthly resilience check</p>
      <p className="mt-1 text-xs text-zinc-400">
        {assessmentDueLabel(daysSince)} About every {ASSESSMENT_INTERVAL_DAYS} days
        keeps the plan honest.
      </p>
      <Link
        href="/assessment"
        className="mt-3 inline-flex rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950"
      >
        Retake assessment →
      </Link>
    </GlassCard>
  );
}
