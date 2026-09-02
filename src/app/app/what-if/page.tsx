"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadSession, isPremium, type TiltSession } from "@/lib/session";
import { runWhatIf } from "@/lib/scoring";
import type { WhatIfScenario, WhatIfResult } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/app/page-header";
import { GlassCard, IconBadge } from "@/components/app/glass-card";
import {
  IconWallet,
  IconBolt,
  IconPhone,
  IconBank,
  IconBriefcase,
  IconEmergency,
  IconFood,
} from "@/components/app/icons";

type Group = "Money" | "Digital" | "Essentials";

const SCENARIOS: {
  id: WhatIfScenario;
  label: string;
  prompt: string;
  group: Group;
  free?: boolean;
  Icon: (p: { className?: string }) => JSX.Element;
  tone: "red" | "amber" | "emerald" | "sky" | "violet";
}[] = [
  { id: "income_stops", label: "Income stops", prompt: "What if your income stopped today?", group: "Money", free: true, Icon: IconWallet, tone: "red" },
  { id: "job_loss", label: "Job loss", prompt: "What if you lost your primary job?", group: "Money", Icon: IconBriefcase, tone: "amber" },
  { id: "banking_down", label: "Banking unavailable", prompt: "What if banks and cards were down?", group: "Money", Icon: IconBank, tone: "sky" },
  { id: "digital_payments_only", label: "Payment network issue", prompt: "What if digital payments stopped working?", group: "Money", Icon: IconPhone, tone: "violet" },
  { id: "phone_lost", label: "Phone lost", prompt: "What if your phone was gone this afternoon?", group: "Digital", Icon: IconPhone, tone: "amber" },
  { id: "internet_outage", label: "Internet outage", prompt: "What if the internet was down for 48 hours?", group: "Digital", Icon: IconBolt, tone: "sky" },
  { id: "power_grid", label: "Power outage", prompt: "What if you lost power in your area?", group: "Essentials", Icon: IconBolt, tone: "amber" },
  { id: "medical_emergency", label: "Medical shock", prompt: "What if a sudden medical bill hit this month?", group: "Essentials", Icon: IconEmergency, tone: "red" },
  { id: "food_prices_double", label: "Fuel / food shock", prompt: "What if grocery prices doubled overnight?", group: "Essentials", Icon: IconFood, tone: "emerald" },
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
      <PageHeader
        title="What If?"
        subtitle="Stress-test your life against real disruptions."
        backHref="/app/overview"
        showBack
      />

      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Your baseline
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "days runway", value: String(runway) },
            { label: "income source", value: String(session.answers.income_sources || 1) },
            { label: "backup payments", value: session.answers.alt_payment_method ? "1" : "0" },
          ].map((b) => (
            <GlassCard key={b.label} className="!p-3.5 text-center">
              <p className="text-2xl font-bold tabular-nums text-zinc-50">{b.value}</p>
              <p className="mt-1 text-[10px] text-zinc-500">{b.label}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      {result && active && (
        <GlassCard
          tone={
            result.severity === "critical" || result.severity === "high"
              ? "danger"
              : "success"
          }
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Scenario result · {result.severity}
          </p>
          <p className="mt-2 text-lg font-semibold text-zinc-50">{result.title}</p>
          <p className="mt-2 text-2xl font-bold leading-snug text-zinc-50">{result.summary}</p>
          <p className="mt-2 text-sm text-zinc-400">{result.detail}</p>
          <p className="mt-3 text-sm text-emerald-400/90">{result.recommendation}</p>
          <Link
            href="/app/prepare"
            className="mt-4 inline-flex rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950"
          >
            See how to improve →
          </Link>
          <button
            type="button"
            className="mt-3 block text-xs text-zinc-500 hover:text-zinc-300"
            onClick={() => {
              setResult(null);
              setActive(null);
            }}
          >
            Clear result
          </button>
        </GlassCard>
      )}

      {GROUPS.map((group) => (
        <section key={group.id} className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            {group.label}
          </p>
          <div className="space-y-2">
            {SCENARIOS.filter((s) => s.group === group.id).map((s) => {
              const locked = !s.free && !premium;
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => run(s.id, s.free)}
                  disabled={running}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition",
                    isActive
                      ? "border-emerald-500/40 bg-emerald-500/10"
                      : "border-white/[0.08] bg-white/[0.03] hover:border-white/15",
                    locked && "opacity-70"
                  )}
                >
                  <IconBadge tone={s.tone}>
                    <s.Icon className="h-4 w-4" />
                  </IconBadge>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-100">
                      {s.label}
                      {locked && (
                        <span className="ml-2 text-[10px] font-normal text-zinc-500">Premium</span>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">{s.prompt}</p>
                  </div>
                  <span className="text-zinc-600">→</span>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
