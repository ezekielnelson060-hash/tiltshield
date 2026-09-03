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
import { getActiveMember } from "@/lib/family";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/app/glass-card";
import { CATEGORY_ICONS } from "@/components/app/icons";
import { TodaysPriority } from "@/components/app/todays-priority";
import { AssessmentReminder } from "@/components/app/assessment-reminder";
import type { CategoryScores } from "@/types";

const CATEGORY_TILES: {
  key: keyof CategoryScores;
  label: string;
  href: string;
}[] = [
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
      <circle
        cx="54"
        cy="54"
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="8"
      />
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
  const [ready, setReady] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    try {
      const s = loadSession();
      setSession(s);
      setPrem(isPremium());
      setDaysSince(daysSinceLastAssessment());
      setName(
        localStorage.getItem("tiltshield_display_name") ||
          getActiveMember().name ||
          "there"
      );
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
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-zinc-500">
        Loading your day…
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-lg font-semibold text-zinc-50">Start here</p>
        <p className="mt-2 text-sm text-zinc-400">
          Answer 9 short questions so Today can show your score, priority, and
          next move.
        </p>
        <Button asChild className="mt-6">
          <Link href="/assessment">Get my resilience score</Link>
        </Button>
      </div>
    );
  }

  const scores = session.scores;
  const answers = session.answers;
  const vulnerabilities = session.vulnerabilities || [];
  const top = vulnerabilities[0];
  const label = resilienceLabel(scores.overall || 0);

  let runwayDays = 0;
  let bufferGap = 0;
  try {
    const plan = computeBufferPlan({
      monthlyIncome: answers.monthly_income || 0,
      monthlyExpenses: answers.monthly_expenses || 0,
      emergencyFundMonths: answers.emergency_fund_months || 0,
      targetMonths: 3,
    });
    runwayDays = Math.round((answers.emergency_fund_months || 0) * 30);
    bufferGap = plan.gapAmount || 0;
  } catch {
    runwayDays = Math.round((answers.emergency_fund_months || 0) * 30);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
          {greetingForHour()}, {name}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Your command center for the next 24 hours. Read your score, fix the
          top gap, then take one move.
        </p>
        {daysSince !== null && (
          <p className="mt-2 text-xs text-zinc-600">
            Last check {daysSince === 0 ? "today" : `${daysSince} days ago`}
          </p>
        )}
      </div>

      <AssessmentReminder />

      <GlassCard tone="accent">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Your resilience
        </p>
        <div className="mt-3 flex items-center gap-4">
          <div className="relative">
            <ScoreRing score={scores.overall || 0} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold tabular-nums text-zinc-50">
                {scores.overall || 0}
              </span>
              <span className="text-[10px] text-zinc-500">/ 100</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-400">{label}</p>
            <p className="mt-1 text-xs text-zinc-500">
              About {runwayDays} days of essentials runway on file
            </p>
            {bufferGap > 0 && (
              <p className="mt-1 text-xs text-zinc-500">
                Gap to a 3-month buffer: {formatMoney(bufferGap)}
              </p>
            )}
          </div>
        </div>
      </GlassCard>

      <GlassCard tone={top ? "danger" : "success"}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Your priority
        </p>
        <p className="mt-2 text-lg font-semibold text-zinc-50">
          {top?.title || "No critical gap flagged"}
        </p>
        <p className="mt-2 text-sm text-zinc-400">
          {top?.description ||
            "Keep stacking food, cash access, and offline backups."}
        </p>
        <Link
          href="/app/risk"
          className="mt-3 inline-block text-xs font-medium text-emerald-400"
        >
          See full risk picture →
        </Link>
      </GlassCard>

      <TodaysPriority
        answers={answers}
        vulnerabilities={vulnerabilities}
      />

      <section>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Open a focus area
        </p>
        <p className="mb-3 text-xs text-zinc-500">
          Tap a tile to see what to do next for that system.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CATEGORY_TILES.map((t) => {
            const Icon = CATEGORY_ICONS[t.key] || CATEGORY_ICONS.money;
            const val = scores[t.key] ?? 0;
            return (
              <Link
                key={t.key}
                href={t.href}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3 py-3 transition hover:border-emerald-500/25"
              >
                <Icon className="h-4 w-4 text-emerald-400" />
                <p className="mt-2 text-xs font-medium text-zinc-200">{t.label}</p>
                <p className="text-lg font-bold tabular-nums text-zinc-50">{val}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="grid gap-2 sm:grid-cols-2">
        <Link
          href="/app/what-if"
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-sm text-zinc-200"
        >
          Test a What If scenario →
        </Link>
        <Link
          href="/app/prepare"
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-sm text-zinc-200"
        >
          Work your year plan →
        </Link>
        <Link
          href="/app/nearby"
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-sm text-zinc-200"
        >
          Find places near you →
        </Link>
        <Link
          href="/app/intel"
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-sm text-zinc-200"
        >
          Read live Intel →
        </Link>
      </div>

      {!premium && (
        <GlassCard>
          <p className="text-sm font-medium text-zinc-100">Unlock full tools</p>
          <p className="mt-1 text-xs text-zinc-500">
            Lifetime $29: full simulators, vault, history. Household $49: all of
            that plus family profiles (buy under Household).
          </p>
          <Button
            size="sm"
            className="mt-3"
            disabled={paying}
            onClick={() => void unlock()}
          >
            {paying ? "Opening…" : "Lifetime · $29"}
          </Button>
        </GlassCard>
      )}
    </div>
  );
}
