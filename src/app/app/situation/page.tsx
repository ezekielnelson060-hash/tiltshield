"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { loadSession } from "@/lib/session";
import { applyAnswerPatch } from "@/lib/update-situation";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-xl border border-white/[0.08] bg-[#060a12] px-3 py-2.5 text-sm text-zinc-50 focus:border-emerald-500/50 focus:outline-none";

export default function SituationPage() {
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);
  const [overall, setOverall] = useState(0);

  const [monthlyExpenses, setMonthlyExpenses] = useState("");
  const [liquidMonths, setLiquidMonths] = useState("");
  const [foodDays, setFoodDays] = useState("");
  const [supplyWeeks, setSupplyWeeks] = useState("");
  const [incomeSources, setIncomeSources] = useState(1);
  const [altPay, setAltPay] = useState(false);
  const [offlineDocs, setOfflineDocs] = useState(false);
  const [offlineValue, setOfflineValue] = useState(0);
  const [phoneBackup, setPhoneBackup] = useState(false);
  const [offlineContacts, setOfflineContacts] = useState(false);

  useEffect(() => {
    const s = loadSession();
    if (s?.answers) {
      const a = s.answers;
      setMonthlyExpenses(a.monthly_expenses ? String(a.monthly_expenses) : "");
      setLiquidMonths(
        a.emergency_fund_months != null ? String(a.emergency_fund_months) : ""
      );
      setFoodDays(a.food_buffer_days ? String(a.food_buffer_days) : "");
      setSupplyWeeks(
        a.emergency_supply_weeks ? String(a.emergency_supply_weeks) : ""
      );
      setIncomeSources(a.income_sources || 1);
      setAltPay(!!a.alt_payment_method);
      setOfflineDocs(!!a.has_offline_docs);
      setOfflineValue(a.offline_value_store || 0);
      setPhoneBackup(!!a.phone_backup_plan);
      setOfflineContacts(!!a.offline_contacts);
      setOverall(s.scores?.overall ?? 0);
    }
    setReady(true);
  }, []);

  function n(s: string) {
    if (s === "") return 0;
    const v = Number(s);
    return Number.isFinite(v) ? v : 0;
  }

  function save() {
    const updated = applyAnswerPatch(
      {
        monthly_expenses: n(monthlyExpenses),
        emergency_fund_months: n(liquidMonths),
        food_buffer_days: n(foodDays),
        emergency_supply_weeks: n(supplyWeeks),
        income_sources: incomeSources,
        alt_payment_method: altPay,
        has_offline_docs: offlineDocs,
        offline_value_store: offlineValue,
        phone_backup_plan: phoneBackup,
        offline_contacts: offlineContacts,
      },
      "situation"
    );
    if (updated) {
      setOverall(updated.scores.overall);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  if (!ready) {
    return (
      <div className="px-4 py-16 text-center text-sm text-zinc-500">Loading…</div>
    );
  }

  const session = typeof window !== "undefined" ? loadSession() : null;
  if (!session?.answers) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-10 text-center">
        <p className="text-zinc-400">
          Finish your assessment once so we have a baseline.
        </p>
        <Link
          href="/assessment"
          className="inline-block text-sm font-medium text-emerald-400"
        >
          Measure exposure →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 pb-24 lg:px-8">
      <PageHeader
        title="Update my situation"
        subtitle="Change what is true now. Your score moves without redoing the full assessment."
        backHref="/app/more"
        showBack
      />

      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-400">
          Current score
        </p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-zinc-50">
          {overall}
          <span className="text-sm font-medium text-zinc-500"> / 100</span>
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Edits below recalculate exposure and break points immediately.
        </p>
      </div>

      <section className="space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Money
        </p>
        <Field label="Essential monthly expenses ($)">
          <input
            type="number"
            min={0}
            value={monthlyExpenses}
            onChange={(e) => setMonthlyExpenses(e.target.value)}
            className={inputCls}
            placeholder="e.g. 400"
          />
        </Field>
        <Field label="Liquid reserves (months of expenses)">
          <input
            type="number"
            min={0}
            step={0.1}
            value={liquidMonths}
            onChange={(e) => setLiquidMonths(e.target.value)}
            className={inputCls}
            placeholder="e.g. 1.5"
          />
        </Field>
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
        <Toggle label="Tested second way to pay" on={altPay} set={setAltPay} />
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
      </section>

      <section className="space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Food & home
        </p>
        <Field label="Days you could eat without shopping">
          <input
            type="number"
            min={0}
            value={foodDays}
            onChange={(e) => setFoodDays(e.target.value)}
            className={inputCls}
            placeholder="e.g. 14"
          />
        </Field>
        <Field label="Weeks of dedicated emergency stores">
          <input
            type="number"
            min={0}
            step={0.5}
            value={supplyWeeks}
            onChange={(e) => setSupplyWeeks(e.target.value)}
            className={inputCls}
            placeholder="e.g. 4"
          />
        </Field>
      </section>

      <section className="space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Digital & people
        </p>
        <Toggle
          label="ID / critical docs reachable offline"
          on={offlineDocs}
          set={setOfflineDocs}
        />
        <Toggle label="Plan if phone is gone" on={phoneBackup} set={setPhoneBackup} />
        <Toggle
          label="Offline contact list for the household"
          on={offlineContacts}
          set={setOfflineContacts}
        />
      </section>

      <Button className="w-full" onClick={save}>
        {saved ? "Saved — score updated" : "Save and update score"}
      </Button>

      <p className="text-center text-xs text-zinc-600">
        Stock ticks and journal entries can also move these numbers automatically.
      </p>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-zinc-400">{label}</span>
      {children}
    </label>
  );
}

function Toggle({
  label,
  on,
  set,
}: {
  label: string;
  on: boolean;
  set: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => set(!on)}
      className={cn(
        "flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left text-sm",
        on
          ? "border-emerald-500/30 bg-emerald-500/10 text-zinc-100"
          : "border-white/[0.08] bg-white/[0.03] text-zinc-300"
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "text-[11px] font-semibold uppercase",
          on ? "text-emerald-400" : "text-zinc-600"
        )}
      >
        {on ? "Yes" : "No"}
      </span>
    </button>
  );
}
