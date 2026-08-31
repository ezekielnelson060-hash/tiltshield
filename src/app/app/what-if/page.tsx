"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadSession, isPremium, setPremium, type TiltSession } from "@/lib/session";
import { runWhatIf } from "@/lib/scoring";
import type { WhatIfScenario, WhatIfResult } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SCENARIOS: {
  id: WhatIfScenario;
  label: string;
  prompt: string;
  free?: boolean;
}[] = [
  { id: "income_stops", label: "Income stops", prompt: "What if your income stopped today?", free: true },
  { id: "job_loss", label: "Job loss", prompt: "What if you lost your primary job?" },
  { id: "banking_down", label: "Banking down 72h", prompt: "What if cards and bank apps failed for 72 hours?" },
  { id: "digital_payments_only", label: "Digital-only payments", prompt: "What if everyday payments required a digital account?" },
  { id: "phone_lost", label: "Phone lost", prompt: "What if your phone was gone this afternoon?" },
  { id: "internet_outage", label: "Internet outage", prompt: "What if the internet was down for 48 hours?" },
  { id: "power_grid", label: "Power out 72h", prompt: "What if power was out for 72 hours?" },
  { id: "medical_emergency", label: "Medical shock", prompt: "What if a sudden medical bill hit this month?" },
  { id: "food_prices_double", label: "Food prices double", prompt: "What if grocery prices doubled overnight?" },
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
      if (window.confirm("Full scenarios unlock with the founding plan. Unlock for demo?")) {
        setPremium(true);
        setPrem(true);
      } else return;
    }
    setActive(id);
    setRunning(true);
    setResult(null);
    setTimeout(() => {
      setResult(runWhatIf(id, session.answers));
      setRunning(false);
    }, 700);
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-zinc-400">Complete your assessment first.</p>
        <Button asChild className="mt-4">
          <Link href="/assessment">Get my score</Link>
        </Button>
      </div>
    );
  }

  const a = session.answers;
  const runway = Math.round((a.emergency_fund_months || 0) * 30);

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">What If?</h1>
        <p className="mt-1 text-sm text-zinc-500">Built from your answers \u2014 not generic advice.</p>
        <p className="mt-3 text-xs text-zinc-600">
          Your baseline: ~{runway} day cash runway \u00b7 ${"(a.monthly_expenses || 0).toLocaleString()"}/mo essentials \u00b7{" "}
          {a.income_sources} income source{a.income_sources === 1 ? "" : "s"}
        </p>
      </div>

      {!active && (
        <div className="grid gap-3 sm:grid-cols-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => run(s.id, s.free)}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-left transition hover:border-zinc-600"
            >
              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                {s.label}
                {!s.free && !premium ? " \u00b7 Full plan" : ""}
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-100">{s.prompt}</p>
              <p className="mt-3 text-xs text-emerald-500">Run simulation \u2192</p>
            </button>
          ))}
        </div>
      )}

      {active && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => {
              setActive(null);
              setResult(null);
            }}
            className="text-xs text-zinc-500 hover:text-zinc-300"
          >
            \u2190 All scenarios
          </button>

          {running && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 text-center">
              <p className="text-sm text-zinc-400">Running against your data\u2026</p>
            </div>
          )}

          {result && !running && (
            <div className="space-y-4">
              <div
                className={cn(
                  "rounded-2xl border p-6",
                  result.severity === "critical" || result.severity === "high"
                    ? "border-red-500/25 bg-red-500/5"
                    : result.severity === "medium"
                      ? "border-amber-500/25 bg-amber-500/5"
                      : "border-emerald-500/25 bg-emerald-500/5"
                )}
              >
                <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">{result.title}</p>
                <p className="mt-3 text-xl font-semibold text-zinc-50">{result.summary}</p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{result.detail}</p>
                <p className="mt-4 text-[10px] uppercase tracking-wider text-zinc-600">Exposure \u00b7 {result.severity}</p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
                <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-500">What you should do</p>
                <p className="mt-2 text-sm text-zinc-200">{result.recommendation}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild size="sm">
                    <Link href="/app/actions">Open actions</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/app/risk">See my risk</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
