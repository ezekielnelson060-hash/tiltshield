"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { loadSession } from "@/lib/session";
import { applyAnswerPatch } from "@/lib/update-situation";
import { Button } from "@/components/ui/button";
import {
  calcRunway,
  calcFood,
  calcDigitalExposure,
  calcJobLoss,
} from "@/lib/calculators";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/app/page-header";

type Tab = "runway" | "job" | "food" | "digital";

const TABS: { id: Tab; label: string; blurb: string }[] = [
  { id: "runway", label: "Cash runway", blurb: "Days you can operate if income stops" },
  { id: "job", label: "Job loss", blurb: "Primary job gone — longer than a short outage" },
  { id: "food", label: "Food buffer", blurb: "Pantry days + price-spike pressure" },
  { id: "digital", label: "Digital rails", blurb: "How hard digital-only payments would hit" },
];

function severityClass(s: string) {
  if (s === "critical" || s === "high") return "border-red-500/25 bg-red-500/5";
  if (s === "medium") return "border-amber-500/25 bg-amber-500/5";
  return "border-emerald-500/25 bg-emerald-500/5";
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-zinc-400">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/[0.08] bg-[#060a12] px-3 py-2.5 text-sm text-zinc-50 focus:border-emerald-500/50 focus:outline-none";

export default function CalculatorsPage() {
  const [tab, setTab] = useState<Tab>("runway");
  const [hydrated, setHydrated] = useState(false);
  const [applied, setApplied] = useState(false);
  const [monthlyExpenses, setMonthlyExpenses] = useState("");
  const [liquidSavings, setLiquidSavings] = useState("");
  const [incomeSources, setIncomeSources] = useState(1);
  const [pantryDays, setPantryDays] = useState("");
  const [emergencyWeeks, setEmergencyWeeks] = useState("");
  const [diverseSources, setDiverseSources] = useState(false);
  const [digitalDep, setDigitalDep] = useState(4);
  const [hasAlt, setHasAlt] = useState(false);
  const [offlineValue, setOfflineValue] = useState(0);

  const num = (s: string) => {
    if (s === "" || s === undefined || s === null) return 0;
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  };

  useEffect(() => {
    try {
      const cached = localStorage.getItem("tiltshield_calc_inputs");
      if (cached) {
        const c = JSON.parse(cached) as Record<string, unknown>;
        if (c.monthlyExpenses != null) setMonthlyExpenses(String(c.monthlyExpenses));
        if (c.liquidSavings != null) setLiquidSavings(String(c.liquidSavings));
        if (c.incomeSources != null) setIncomeSources(Number(c.incomeSources) || 1);
        if (c.pantryDays != null) setPantryDays(String(c.pantryDays));
        if (c.emergencyWeeks != null) setEmergencyWeeks(String(c.emergencyWeeks));
        if (c.diverseSources != null) setDiverseSources(!!c.diverseSources);
        if (c.digitalDep != null) setDigitalDep(Number(c.digitalDep) || 4);
        if (c.hasAlt != null) setHasAlt(!!c.hasAlt);
        if (c.offlineValue != null) setOfflineValue(Number(c.offlineValue) || 0);
        setHydrated(true);
        return;
      }
    } catch {
      /* */
    }
    const s = loadSession();
    if (s?.answers) {
      const a = s.answers;
      const expenses = a.monthly_expenses;
      const months = a.emergency_fund_months;
      if (expenses != null && expenses !== 0) setMonthlyExpenses(String(expenses));
      if (months != null && expenses)
        setLiquidSavings(String(Math.round(months * expenses)));
      setIncomeSources(a.income_sources || 1);
      if (a.food_buffer_days) setPantryDays(String(a.food_buffer_days));
      if (a.emergency_supply_weeks) setEmergencyWeeks(String(a.emergency_supply_weeks));
      setDiverseSources(!!a.food_source_diversity);
      setDigitalDep(a.digital_payment_dependency || 4);
      setHasAlt(!!a.alt_payment_method);
      setOfflineValue(a.offline_value_store || 0);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        "tiltshield_calc_inputs",
        JSON.stringify({
          monthlyExpenses,
          liquidSavings,
          incomeSources,
          pantryDays,
          emergencyWeeks,
          diverseSources,
          digitalDep,
          hasAlt,
          offlineValue,
        })
      );
    } catch {
      /* */
    }
  }, [
    hydrated,
    monthlyExpenses,
    liquidSavings,
    incomeSources,
    pantryDays,
    emergencyWeeks,
    diverseSources,
    digitalDep,
    hasAlt,
    offlineValue,
  ]);

  const me = num(monthlyExpenses);
  const ls = num(liquidSavings);
  const pd = num(pantryDays);
  const ew = num(emergencyWeeks);

  const runway = useMemo(
    () => calcRunway({ monthlyExpenses: me, liquidSavings: ls, incomeSources }),
    [me, ls, incomeSources]
  );
  const job = useMemo(
    () => calcJobLoss({ monthlyExpenses: me, liquidSavings: ls, incomeSources }),
    [me, ls, incomeSources]
  );
  const food = useMemo(
    () =>
      calcFood({
        monthlyExpenses: me,
        pantryDays: pd,
        emergencyWeeks: ew,
        liquidSavings: ls,
        diverseSources,
      }),
    [me, pd, ew, ls, diverseSources]
  );
  const digital = useMemo(
    () =>
      calcDigitalExposure({
        digitalDependency: digitalDep,
        hasAltPayment: hasAlt,
        offlineValue,
      }),
    [digitalDep, hasAlt, offlineValue]
  );

  function applyToScore() {
    const expenses = me;
    const months =
      expenses > 0 ? Math.round((ls / expenses) * 100) / 100 : 0;
    const updated = applyAnswerPatch(
      {
        monthly_expenses: expenses || undefined,
        emergency_fund_months: months || undefined,
        food_buffer_days: pd || undefined,
        emergency_supply_weeks: ew || undefined,
        income_sources: incomeSources,
        alt_payment_method: hasAlt,
        offline_value_store: offlineValue,
        digital_payment_dependency: digitalDep,
        food_source_diversity: diverseSources,
      },
      "situation"
    );
    if (updated) {
      setApplied(true);
      setTimeout(() => setApplied(false), 2500);
    }
  }

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-zinc-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <PageHeader
        title="Calculators"
        subtitle="Model a number. Apply it to your score when it is true."
        backHref="/app/more"
        showBack
      />

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition",
              tab === t.id
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                : "border-white/[0.1] text-zinc-400 hover:border-white/20 hover:text-zinc-200"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-zinc-500">{TABS.find((t) => t.id === tab)?.blurb}</p>

      <div className="space-y-4 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]">
        {(tab === "runway" || tab === "job" || tab === "food") && (
          <>
            <Field label="Essential monthly expenses ($)">
              <input
                type="number"
                min={0}
                step={50}
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Liquid savings you could access in days ($)">
              <input
                type="number"
                min={0}
                step={100}
                value={liquidSavings}
                onChange={(e) => setLiquidSavings(e.target.value)}
                className={inputCls}
              />
            </Field>
          </>
        )}

        {(tab === "runway" || tab === "job") && (
          <Field label="Independent income sources">
            <select
              value={incomeSources}
              onChange={(e) => setIncomeSources(Number(e.target.value))}
              className={inputCls}
            >
              <option value={1}>1 — single source</option>
              <option value={2}>2 — two sources</option>
              <option value={3}>3 or more</option>
            </select>
          </Field>
        )}

        {tab === "food" && (
          <>
            <Field label="Days you could eat without shopping">
              <input
                type="number"
                min={0}
                max={90}
                value={pantryDays}
                onChange={(e) => setPantryDays(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Weeks of dedicated emergency food stores">
              <input
                type="number"
                min={0}
                max={12}
                step={0.5}
                value={emergencyWeeks}
                onChange={(e) => setEmergencyWeeks(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="More than one food source?">
              <select
                value={diverseSources ? "yes" : "no"}
                onChange={(e) => setDiverseSources(e.target.value === "yes")}
                className={inputCls}
              >
                <option value="no">No — mostly one supermarket</option>
                <option value="yes">Yes — market, co-op, grow, etc.</option>
              </select>
            </Field>
          </>
        )}

        {tab === "digital" && (
          <>
            <Field label="Digital payment dependence (1–5)">
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={digitalDep}
                onChange={(e) => setDigitalDep(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <p className="text-center text-lg font-semibold text-emerald-400">{digitalDep}</p>
            </Field>
            <Field label="Alternative if main bank/card fails?">
              <select
                value={hasAlt ? "yes" : "no"}
                onChange={(e) => setHasAlt(e.target.value === "yes")}
                className={inputCls}
              >
                <option value="no">No tested alternative</option>
                <option value="yes">Yes — cash, second card, etc.</option>
              </select>
            </Field>
            <Field label="Value outside bank apps">
              <select
                value={offlineValue}
                onChange={(e) => setOfflineValue(Number(e.target.value))}
                className={inputCls}
              >
                <option value={0}>None — banks/apps only</option>
                <option value={1}>Cash reserve</option>
                <option value={2}>Hardware wallet / self-custody</option>
                <option value={3}>Both cash and self-custody</option>
              </select>
            </Field>
          </>
        )}
      </div>

      {tab === "runway" && (
        <ResultCard
          severity={runway.severity}
          headline={runway.days === 0 ? "No runway" : `${runway.days} days`}
          sub={runway.summary}
          rows={[
            { k: "Daily burn", v: `$${runway.dailyBurn.toLocaleString()}` },
            { k: "Months of expenses", v: `${runway.months}` },
            { k: "90-day target", v: `$${runway.targetSavings90.toLocaleString()}` },
            {
              k: "Gap to 90 days",
              v: runway.gapTo90 > 0 ? `$${runway.gapTo90.toLocaleString()}` : "On target",
            },
          ]}
        />
      )}

      {tab === "job" && (
        <ResultCard
          severity={job.severity}
          headline={`${job.days} days liquid`}
          sub={job.summary}
          rows={[
            { k: "Essential monthly", v: `$${me.toLocaleString()}` },
            { k: "Accessible savings", v: `$${ls.toLocaleString()}` },
            { k: "Income sources", v: String(incomeSources) },
            {
              k: "Gap to 90-day buffer",
              v: job.gapTo90 > 0 ? `$${job.gapTo90.toLocaleString()}` : "Covered",
            },
          ]}
        />
      )}

      {tab === "food" && (
        <ResultCard
          severity={food.severity}
          headline={`~${food.totalFoodDaysApprox} food days`}
          sub={food.summary}
          rows={[
            {
              k: "Est. monthly food (25% of essentials)",
              v: `$${food.monthlyFoodEstimate.toLocaleString()}`,
            },
            {
              k: "Extra if prices double",
              v: `+$${food.doublePriceExtra.toLocaleString()}/mo`,
            },
            {
              k: "Months of extra cost cash can cover",
              v: String(food.monthsExtraCovered),
            },
          ]}
        />
      )}

      {tab === "digital" && (
        <ResultCard
          severity={digital.severity}
          headline={`${digital.score}/100 exposure`}
          sub={digital.summary}
          rows={[
            { k: "Digital dependence", v: `${digitalDep} / 5` },
            { k: "Alt payment", v: hasAlt ? "Yes" : "No" },
            {
              k: "Offline value",
              v:
                offlineValue === 0
                  ? "None"
                  : offlineValue === 1
                    ? "Cash"
                    : offlineValue === 2
                      ? "Self-custody"
                      : "Cash + self-custody",
            },
          ]}
        />
      )}

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-4">
        <p className="text-sm font-medium text-zinc-100">Apply to your score</p>
        <p className="mt-1 text-xs leading-relaxed text-zinc-500">
          Writes these numbers into your profile. Exposure and break points update — no
          re-assessment.
        </p>
        <Button className="mt-3 w-full" onClick={applyToScore}>
          {applied ? "Applied — score updated" : "Apply to my score"}
        </Button>
      </div>
    </div>
  );
}

function ResultCard({
  severity,
  headline,
  sub,
  rows,
}: {
  severity: string;
  headline: string;
  sub: string;
  rows: { k: string; v: string }[];
}) {
  return (
    <div className={cn("space-y-4 rounded-2xl border p-6", severityClass(severity))}>
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
          Result · {severity}
        </p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">{headline}</p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">{sub}</p>
      </div>
      <dl className="space-y-2 border-t border-white/[0.08] pt-4">
        {rows.map((r) => (
          <div key={r.k} className="flex justify-between gap-4 text-sm">
            <dt className="text-zinc-500">{r.k}</dt>
            <dd className="font-medium text-zinc-200">{r.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
