"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadSession, isPremium, setPremium, type TiltSession } from "@/lib/session";
import { pickTodaysMove } from "@/lib/scoring";
import { computeBufferPlan } from "@/lib/buffer";
import { Button } from "@/components/ui/button";

export default function OverviewPage() {
  const [session, setSession] = useState<TiltSession | null>(null);
  const [premium, setPrem] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    setSession(loadSession());
    setPrem(isPremium());
  }, []);

  async function unlock() {
    setPaying(true);
    try {
      const res = await fetch("/api/flutterwave/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      if (json.link) {
        window.location.href = json.link;
        return;
      }
      if (json.demo || res.status === 503) {
        if (window.confirm("Unlock full plan for demo?")) {
          setPremium(true);
          setPrem(true);
        }
      }
    } finally {
      setPaying(false);
    }
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-zinc-400">Complete your assessment to see your overview.</p>
        <Button asChild className="mt-4">
          <Link href="/assessment">Get my score</Link>
        </Button>
      </div>
    );
  }

  const { scores, vulnerabilities, answers } = session;
  const top = vulnerabilities[0];
  const move = pickTodaysMove(vulnerabilities);
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const plan = computeBufferPlan({
    monthlyIncome: answers.monthly_income || 0,
    monthlyExpenses: answers.monthly_expenses || 0,
    emergencyFundMonths: answers.emergency_fund_months || 0,
    targetMonths: 3,
  });

  const pantryDays = answers.food_buffer_days || 0;

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8 lg:px-8">
      <div>
        <p className="text-sm text-zinc-500">{greeting}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
          Ready for what might come next?
        </h1>
        {(plan.income > 0 || plan.expenses > 0) && (
          <p className="mt-2 text-xs text-zinc-500">
            {plan.income > 0 && <>Take-home ~${plan.income.toLocaleString()}/mo</>}
            {plan.income > 0 && plan.expenses > 0 && " · "}
            {plan.expenses > 0 && <>Essentials ~${plan.expenses.toLocaleString()}/mo</>}
            {" · "}~{plan.runwayDays} day runway
          </p>
        )}
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
          Readiness score
        </p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-5xl font-bold tracking-tight text-zinc-50">
            {scores.overall}
          </span>
          <span className="text-zinc-600">/ 100</span>
        </div>
        <p className="mt-2 text-sm text-zinc-400">
          {scores.overall >= 70
            ? `Strong baseline. Cash runway about ${plan.runwayDays} days.`
            : scores.overall >= 40
              ? `Mixed readiness. Runway ≈ ${plan.runwayDays} days. Biggest gap: ${top?.title ?? "see My Risk"}.`
              : `More dependent than you thought. Runway ≈ ${plan.runwayDays} days. Start with: ${top?.title ?? "your top exposure"}.`}
        </p>
        <Link href="/app/risk" className="mt-4 inline-block text-sm text-emerald-400 hover:underline">
          See all categories →
        </Link>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-500">
          Buffer plan · from your income
        </p>
        <h2 className="mt-2 text-lg font-semibold text-zinc-50">
          {plan.onTrack
            ? "You meet the 90-day cash target"
            : "Path to 90 days of essentials"}
        </h2>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-zinc-800 px-3 py-2">
            <dt className="text-[10px] uppercase tracking-wider text-zinc-500">Monthly surplus</dt>
            <dd className="mt-1 font-semibold text-zinc-100">
              {plan.surplus > 0
                ? `$${plan.surplus.toLocaleString()}`
                : plan.income > 0
                  ? "Tight or negative"
                  : "—"}
            </dd>
          </div>
          <div className="rounded-xl border border-zinc-800 px-3 py-2">
            <dt className="text-[10px] uppercase tracking-wider text-zinc-500">Savings rate</dt>
            <dd className="mt-1 font-semibold text-zinc-100">
              {plan.income > 0 ? `${plan.savingsRate}%` : "—"}
            </dd>
          </div>
          <div className="rounded-xl border border-zinc-800 px-3 py-2">
            <dt className="text-[10px] uppercase tracking-wider text-zinc-500">Now / 90-day target</dt>
            <dd className="mt-1 font-semibold text-zinc-100">
              ${plan.savings.toLocaleString()} / ${plan.targetSavings.toLocaleString()}
            </dd>
          </div>
          <div className="rounded-xl border border-zinc-800 px-3 py-2">
            <dt className="text-[10px] uppercase tracking-wider text-zinc-500">Gap</dt>
            <dd className="mt-1 font-semibold text-zinc-100">
              {plan.onTrack ? "None" : `$${plan.gap.toLocaleString()}`}
            </dd>
          </div>
        </dl>
        {!plan.onTrack && (
          <p className="mt-4 text-sm text-zinc-400">
            {plan.weeklyTransfer > 0 ? (
              <>
                Suggested transfer:{" "}
                <span className="font-medium text-emerald-400">
                  ${plan.weeklyTransfer.toLocaleString()}/week
                </span>
                {plan.weeksToTarget != null && (
                  <> — about {plan.weeksToTarget} weeks to the 90-day target if you stay consistent.</>
                )}
              </>
            ) : (
              <>
                Essentials are at or above income. Cut one non-essential line or add a small side
                inflow before a weekly buffer transfer is realistic.
              </>
            )}
          </p>
        )}
        {plan.onTrack && (
          <p className="mt-4 text-sm text-zinc-400">
            Maintain the buffer and review it when income or rent changes. Next focus: food stores
            and local options under Prepare.
          </p>
        )}
        <div className="mt-4">
          <Button asChild size="sm" variant="outline">
            <Link href="/app/calculators">Open runway calculator</Link>
          </Button>
        </div>
      </section>

      {top && (
        <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
          <p className="text-[10px] font-medium uppercase tracking-wider text-red-400">
            Your biggest exposure
          </p>
          <h2 className="mt-2 text-lg font-semibold text-zinc-50">{top.title}</h2>
          <p className="mt-2 text-sm text-zinc-400">{top.current_state}</p>
          <p className="mt-3 text-sm text-zinc-300">
            <span className="text-zinc-500">Next: </span>
            {top.next_action}
          </p>
          <div className="mt-4">
            <Button asChild size="sm">
              <Link href="/app/actions">Fix this first</Link>
            </Button>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
        <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-500">
          Today&apos;s move
        </p>
        <h2 className="mt-2 text-lg font-semibold text-zinc-50">{move.title}</h2>
        <p className="mt-1 text-xs text-zinc-500">
          {move.time_estimate} · {move.difficulty}
        </p>
        <p className="mt-3 text-sm text-zinc-400">{move.why}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/app/actions">Open actions</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/app/prepare">
              Prepare home{pantryDays > 0 ? ` · ${pantryDays}d food` : ""}
            </Link>
          </Button>
        </div>
      </section>

      {!premium && (
        <section className="rounded-2xl border border-zinc-800 p-6 text-center">
          <p className="text-sm text-zinc-300">
            Unlock full risk map, all What If scenarios, and history.
          </p>
          <p className="mt-1 text-xs text-zinc-500">$29 lifetime · founding member</p>
          <Button className="mt-4" onClick={unlock} disabled={paying}>
            {paying ? "Opening…" : "Become a founding member"}
          </Button>
        </section>
      )}
    </div>
  );
}
