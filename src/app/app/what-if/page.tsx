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
  free?: boolean;
}[] = [
  {
    id: "income_stops",
    label: "Income stops",
    prompt: "What if your income stopped today?",
    group: "Money",
    free: true,
  },
  {
    id: "job_loss",
    label: "Job loss",
    prompt: "What if you lost your primary job?",
    group: "Money",
  },
  {
    id: "banking_down",
    label: "Bank / cards unavailable",
    prompt: "What if cards and bank apps failed for 72 hours?",
    group: "Money",
  },
  {
    id: "digital_payments_only",
    label: "Payment network stress",
    prompt: "What if everyday payments required a digital account?",
    group: "Money",
  },
  {
    id: "phone_lost",
    label: "Phone lost",
    prompt: "What if your phone was gone this afternoon?",
    group: "Digital",
  },
  {
    id: "internet_outage",
    label: "Internet outage",
    prompt: "What if the internet was down for 48 hours?",
    group: "Digital",
  },
  {
    id: "power_grid",
    label: "Power out 72h",
    prompt: "What if power was out for 72 hours?",
    group: "Essentials",
  },
  {
    id: "medical_emergency",
    label: "Medical shock",
    prompt: "What if a sudden medical bill hit this month?",
    group: "Essentials",
  },
  {
    id: "food_prices_double",
    label: "Food prices double",
    prompt: "What if grocery prices doubled overnight?",
    group: "Essentials",
  },
];

const GROUPS: Group[] = ["Money", "Digital", "Essentials"];

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
      alert(
        "Full scenarios unlock with the founding plan. Pay from Overview or Settings."
      );
      return;
    }
    setActive(id);
    setRunning(true);
    setResult(null);
    setTimeout(() => {
      setResult(runWhatIf(id, session.answers));
      setRunning(false);
    }, 500);
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-zinc-400">Complete your assessment first.</p>
        <Button asChild className="mt-4">
          <Link href="/assessment">Get my resilience score</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-50">What If?</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Stress-test your life against system disruptions — using your real
          numbers. Not a prediction. An exposure check.
        </p>
      </div>

      {GROUPS.map((group) => (
        <section key={group} className="space-y-2">
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            {group}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {SCENARIOS.filter((s) => s.group === group).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => run(s.id, s.free)}
                className={cn(
                  "rounded-xl border px-4 py-3 text-left transition",
                  active === s.id
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-600"
                )}
              >
                <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                  {s.label}
                  {!s.free && !premium ? " · Full plan" : ""}
                </p>
                <p className="mt-1 text-sm text-zinc-200">{s.prompt}</p>
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
              "rounded-2xl border p-5",
              result.severity === "critical" || result.severity === "high"
                ? "border-red-500/25 bg-red-500/5"
                : result.severity === "medium"
                  ? "border-amber-500/25 bg-amber-500/5"
                  : "border-emerald-500/25 bg-emerald-500/5"
            )}
          >
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              {result.title}
            </p>
            <p className="mt-3 text-xl font-semibold text-zinc-50">
              {result.summary}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              {result.detail}
            </p>
            <p className="mt-4 text-[10px] uppercase tracking-wider text-zinc-600">
              Exposure · {result.severity}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-500">
              What you should do
            </p>
            <p className="mt-2 text-sm text-zinc-200">{result.recommendation}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link href="/app/prepare">Open Prepare</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/app/risk">See my risk</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
