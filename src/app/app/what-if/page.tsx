"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadSession, isPremium, type TiltSession } from "@/lib/session";
import { runWhatIf } from "@/lib/scoring";
import type { WhatIfScenario, WhatIfResult } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Group = "Money" | "Digital" | "Essentials";

const SCENARIOS: {
  id: WhatIfScenario;
  label: string;
  prompt: string;
  group: Group;
  icon: string;
  free?: boolean;
}[] = [
  {
    id: "income_stops",
    label: "Income stops",
    prompt: "What if your income stopped today?",
    group: "Money",
    icon: "💸",
    free: true,
  },
  {
    id: "job_loss",
    label: "Job loss",
    prompt: "What if you lost your primary job?",
    group: "Money",
    icon: "💼",
  },
  {
    id: "banking_down",
    label: "Banking unavailable",
    prompt: "What if banks and cards were down?",
    group: "Money",
    icon: "🏦",
  },
  {
    id: "digital_payments_only",
    label: "Payment network issue",
    prompt: "What if digital payments stopped working?",
    group: "Money",
    icon: "📱",
  },
  {
    id: "phone_lost",
    label: "Phone lost",
    prompt: "What if your phone was gone this afternoon?",
    group: "Digital",
    icon: "📵",
  },
  {
    id: "internet_outage",
    label: "Internet outage",
    prompt: "What if the internet was down for 48 hours?",
    group: "Digital",
    icon: "📡",
  },
  {
    id: "power_grid",
    label: "Power outage",
    prompt: "What if you lost power in your area?",
    group: "Essentials",
    icon: "⚡",
  },
  {
    id: "medical_emergency",
    label: "Medical shock",
    prompt: "What if a sudden medical bill hit this month?",
    group: "Essentials",
    icon: "🏥",
  },
  {
    id: "food_prices_double",
    label: "Fuel / food shock",
    prompt: "What if grocery prices doubled overnight?",
    group: "Essentials",
    icon: "⛽",
  },
];

const GROUPS: { id: Group; label: string }[] = [
  { id: "Money", label: "Financial" },
  { id: "Digital", label: "Digital" },
  { id: "Essentials", label: "Essentials" },
];

export default function WhatIfPage() {
  const [session, setSession] = useState<TiltSession | null>(null);
  const [premium, setPrem] = useState(false);
  const [active, setActive] = useState<WhatIfScenario | null>(null);
  const [result, setResult] = useState<WhatIfResult | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setSession(loadSession());
    setPrem(isPremium());
  }, []);

  function run(id: WhatIfScenario, free?: boolean) {
    if (!session) return;
    if (!free && !premium) {
      alert("Full scenarios unlock with the founding plan.");
      return;
    }
    setActive(id);
    setRunning(true);
    setResult(null);
    setTimeout(() => {
      setResult(runWhatIf(id, session.answers));
      setRunning(false);
    }, 400);
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-zinc-400">Complete your assessment first.</p>
        <Button asChild className="mt-4">
          <Link href="/assessment">Get my readiness score</Link>
        </Button>
      </div>
    );
  }

  const runway = Math.round((session.answers.emergency_fund_months || 0) * 30);

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">What If?</h1>
        <p className="mt-1 text-sm text-zinc-500">Stress-test your life.</p>
      </div>

      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Your baseline
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "days runway", value: String(runway) },
            {
              label: "income source",
              value: String(session.answers.income_sources || 1),
            },
            {
              label: "backup payments",
              value: session.answers.alt_payment_method ? "1" : "0",
            },
          ].map((b) => (
            <div
              key={b.label}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3 py-3.5 text-center"
            >
              <p className="text-2xl font-bold tabular-nums text-zinc-50">{b.value}</p>
              <p className="mt-1 text-[10px] text-zinc-500">{b.label}</p>
            </div>
          ))}
        </div>
      </div>

      {GROUPS.map((group) => (
        <section key={group.id} className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            {group.label}
          </p>
          <div className="space-y-2">
            {SCENARIOS.filter((s) => s.group === group.id).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => run(s.id, s.free)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition",
                  active === s.id
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : "border-white/[0.08] bg-white/[0.03] hover:border-white/15"
                )}
              >
                <span className="text-xl leading-none">{s.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-100">{s.label}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{s.prompt}</p>
                </div>
                <span className="text-xs text-zinc-600">
                  {!s.free && !premium ? "Full" : "→"}
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}

      {running && (
        <p className="text-center text-sm text-zinc-500">Running simulation…</p>
      )}

      {result && !running && (
        <div className="space-y-4">
          <div
            className={cn(
              "rounded-2xl border p-6",
              result.severity === "critical" || result.severity === "high"
                ? "border-red-500/30 bg-red-500/10"
                : result.severity === "medium"
                  ? "border-amber-500/30 bg-amber-500/10"
                  : "border-emerald-500/30 bg-emerald-500/10"
            )}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              {result.title}
            </p>
            <p className="mt-4 text-4xl font-bold tabular-nums tracking-tight text-zinc-50">
              {result.summary.match(/\d+/)?.[0] || "—"}
              <span className="ml-2 text-base font-normal text-zinc-400">
                {result.summary.toLowerCase().includes("day") ? "days" : ""}
              </span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">{result.summary}</p>
            <p className="mt-2 text-sm text-zinc-500">{result.detail}</p>
            <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
              Your exposure · {result.severity}
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
              What you should do
            </p>
            <p className="mt-2 text-sm text-zinc-200">{result.recommendation}</p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/app/prepare">See how to improve</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
