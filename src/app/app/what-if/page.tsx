"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadSession, isPremium, type TiltSession } from "@/lib/session";
import { runWhatIf } from "@/lib/scoring";
import type { WhatIfScenario, WhatIfResult } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/app/page-header";
import { GlassCard } from "@/components/app/glass-card";
import {
  IllusWallet,
  IllusBolt,
  IllusPhone,
  IllusBank,
  IllusBriefcase,
  IllusShield,
  IllusFood,
} from "@/components/illustrations";

type Group =
  | "Money"
  | "Digital"
  | "Essentials"
  | "Mobility"
  | "Information"
  | "Personal";

const SCENARIOS: {
  id: WhatIfScenario;
  label: string;
  prompt: string;
  group: Group;
  free?: boolean;
  Icon: (p: { size?: number }) => JSX.Element;
  nearbyQuery?: string;
}[] = [
  { id: "income_stops", label: "Income stops", prompt: "What if money in stopped today?", group: "Money", free: true, Icon: IllusWallet, nearbyQuery: "ATM" },
  { id: "banking_down", label: "Bank closed", prompt: "What if bank apps and cards failed?", group: "Money", Icon: IllusBank, nearbyQuery: "ATM" },
  { id: "digital_payments_only", label: "Payments break", prompt: "What if card and app pay stopped?", group: "Money", Icon: IllusPhone, nearbyQuery: "ATM" },
  { id: "job_loss", label: "Job loss", prompt: "What if your main job ended?", group: "Money", Icon: IllusBriefcase },
  { id: "major_expense", label: "Big bill", prompt: "What if a large bill hit this month?", group: "Money", Icon: IllusWallet },
  { id: "currency_volatility", label: "Money buys less", prompt: "What if prices jumped?", group: "Money", Icon: IllusWallet },
  { id: "phone_lost", label: "Phone gone", prompt: "What if your phone was lost today?", group: "Digital", Icon: IllusPhone },
  { id: "internet_outage", label: "No internet", prompt: "What if the internet was down for days?", group: "Digital", Icon: IllusBolt },
  { id: "email_compromised", label: "Email locked", prompt: "What if your main email was taken over?", group: "Digital", Icon: IllusPhone },
  { id: "cloud_down", label: "Cloud down", prompt: "What if cloud files were unreachable?", group: "Digital", Icon: IllusBolt },
  { id: "two_factor_down", label: "No 2FA codes", prompt: "What if login text codes stopped?", group: "Digital", Icon: IllusPhone },
  { id: "food_prices_double", label: "Food costs jump", prompt: "What if food cost a lot more?", group: "Essentials", Icon: IllusFood, nearbyQuery: "supermarket" },
  { id: "store_unavailable", label: "Store closed", prompt: "What if your usual store was closed?", group: "Essentials", Icon: IllusFood, nearbyQuery: "supermarket" },
  { id: "fuel_scarce", label: "Hard to get fuel", prompt: "What if fuel was hard to buy?", group: "Essentials", Icon: IllusBolt, nearbyQuery: "fuel" },
  { id: "power_grid", label: "Power out", prompt: "What if the lights went out?", group: "Essentials", Icon: IllusBolt, nearbyQuery: "hardware" },
  { id: "water_disruption", label: "Water issues", prompt: "What if tap water was uncertain?", group: "Essentials", Icon: IllusFood, nearbyQuery: "bottled water" },
  { id: "transit_down", label: "No public transit", prompt: "What if buses or trains stopped?", group: "Mobility", Icon: IllusBolt, nearbyQuery: "bus station" },
  { id: "vehicle_unavailable", label: "No vehicle", prompt: "What if you could not use your vehicle?", group: "Mobility", Icon: IllusBolt },
  { id: "travel_disruption", label: "Travel blocked", prompt: "What if a major trip became impossible?", group: "Mobility", Icon: IllusBriefcase },
  { id: "comms_outage", label: "Calls fail", prompt: "What if phone service failed?", group: "Information", Icon: IllusPhone },
  { id: "platforms_down", label: "Apps offline", prompt: "What if big social apps went dark?", group: "Information", Icon: IllusPhone },
  { id: "info_unreliable", label: "Unclear news", prompt: "What if online news could not be trusted?", group: "Information", Icon: IllusBolt },
  { id: "medical_emergency", label: "Medical cost", prompt: "What if a sudden medical bill hit?", group: "Personal", Icon: IllusShield, nearbyQuery: "pharmacy" },
  { id: "relocation", label: "Must move", prompt: "What if you had to leave home quickly?", group: "Personal", Icon: IllusBriefcase },
  { id: "family_emergency", label: "Family emergency", prompt: "What if a family emergency hit this week?", group: "Personal", Icon: IllusShield },
];

const GROUPS: { id: Group; label: string }[] = [
  { id: "Money", label: "Money" },
  { id: "Digital", label: "Digital" },
  { id: "Essentials", label: "Essentials" },
  { id: "Mobility", label: "Mobility" },
  { id: "Information", label: "Information" },
  { id: "Personal", label: "Personal" },
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
      alert("More scenarios unlock with the plan.");
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
        <p className="text-zinc-400">Finish your assessment first.</p>
        <Button asChild className="mt-4">
          <Link href="/assessment">Get my score</Link>
        </Button>
      </div>
    );
  }

  const runway = Math.round((session.answers.emergency_fund_months || 0) * 30);
  const activeMeta = SCENARIOS.find((s) => s.id === active);

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <PageHeader
        title="What If?"
        subtitle="Test systems — money, digital, food, mobility — not one country."
        backHref="/app/overview"
        showBack
      />

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "days runway", value: String(runway) },
          { label: "income sources", value: String(session.answers.income_sources || 1) },
          { label: "backup pay", value: session.answers.alt_payment_method ? "yes" : "no" },
        ].map((b) => (
          <GlassCard key={b.label} className="!p-3.5 text-center">
            <p className="text-2xl font-bold tabular-nums text-zinc-50">{b.value}</p>
            <p className="mt-1 text-[10px] text-zinc-500">{b.label}</p>
          </GlassCard>
        ))}
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
            Result · {result.severity}
          </p>
          <p className="mt-2 text-lg font-semibold text-zinc-50">{result.title}</p>
          <p className="mt-2 text-xl font-bold leading-snug text-zinc-50">{result.summary}</p>
          <p className="mt-2 text-sm text-zinc-400">{result.detail}</p>
          <p className="mt-3 text-sm text-emerald-400/90">{result.recommendation}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/app/prepare"
              className="inline-flex rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950"
            >
              What to do next →
            </Link>
            {activeMeta?.nearbyQuery && (
              <Link
                href="/app/nearby"
                className="inline-flex rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-zinc-200"
              >
                Find places near you →
              </Link>
            )}
          </div>
          <button
            type="button"
            className="mt-3 block text-xs text-zinc-500"
            onClick={() => {
              setResult(null);
              setActive(null);
            }}
          >
            Clear
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
                  <s.Icon size={44} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-100">
                      {s.label}
                      {locked && (
                        <span className="ml-2 text-[10px] text-zinc-500">Plan</span>
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
