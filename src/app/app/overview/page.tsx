"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  loadSession,
  isPremium,
  daysSinceLastAssessment,
  type TiltSession,
} from "@/lib/session";
import { pickTodaysMove } from "@/lib/scoring";
import { computeBufferPlan } from "@/lib/buffer";
import {
  formatMoney,
  greetingForHour,
  resilienceLabel,
} from "@/lib/locale";
import { personalizeIntel } from "@/lib/intel";
import { getActiveMember } from "@/lib/family";
import { Button } from "@/components/ui/button";

export default function TodayPage() {
  const [session, setSession] = useState<TiltSession | null>(null);
  const [name, setName] = useState("there");
  const [daysSince, setDaysSince] = useState<number | null>(null);
  const [premium, setPrem] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    setSession(loadSession());
    setDaysSince(daysSinceLastAssessment());
    setPrem(isPremium());
    try {
      setName(getActiveMember().name);
    } catch {
      /* */
    }
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
      if (json.link) {
        window.location.href = json.link;
        return;
      }
      alert(
        json.error ||
          "Payment is not configured. Add FLUTTERWAVE_SECRET_KEY on Vercel."
      );
    } finally {
      setPaying(false);
    }
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-zinc-400">Complete your assessment to open Today.</p>
        <Button asChild className="mt-4">
          <Link href="/assessment">Get my resilience score</Link>
        </Button>
      </div>
    );
  }

  const { scores, vulnerabilities, answers } = session;
  const top = vulnerabilities[0];
  const move = pickTodaysMove(vulnerabilities);
  const plan = computeBufferPlan({
    monthlyIncome: answers.monthly_income || 0,
    monthlyExpenses: answers.monthly_expenses || 0,
    emergencyFundMonths: answers.emergency_fund_months || 0,
    targetMonths: 3,
  });
  const label = resilienceLabel(scores.overall);
  const intel = personalizeIntel({
    overall: scores.overall,
    topCategory: top?.category,
    hasAltPayment: answers.alt_payment_method,
    incomeSources: answers.income_sources,
  }).slice(0, 2);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 lg:px-8">
      <div>
        <p className="text-sm text-zinc-500">
          {greetingForHour()}, {name}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
          Here's your resilience overview for today
        </h1>
      </div>

      {daysSince != null && daysSince >= 28 && (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-3 text-sm text-zinc-300">
          Last assessment ~{daysSince} days ago.{" "}
          <Link href="/assessment" className="text-emerald-400 hover:underline">
            Retake →
          </Link>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Resilience score
          </p>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-5xl font-bold tracking-tight text-zinc-50">
              {scores.overall}
            </span>
            <span className="mb-1 text-zinc-600">/ 100</span>
          </div>
          <p className="mt-2 text-sm text-emerald-400">{label}</p>
          <p className="mt-1 text-xs text-zinc-500">
            Primary income · Essential expenses · {plan.runwayDays}-day runway
          </p>
          <Link
            href="/app/risk"
            className="mt-3 inline-block text-xs text-emerald-400 hover:underline"
          >
            All categories →
          </Link>
        </section>

        <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-medium uppercase tracking-wider text-red-400">
              Your biggest exposure
            </p>
            <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] text-red-300">
              High
            </span>
          </div>
          <h2 className="mt-3 text-lg font-semibold text-zinc-50">
            {top?.title || "Complete assessment"}
          </h2>
          <p className="mt-2 text-2xl font-bold text-zinc-100">
            {plan.runwayDays}{" "}
            <span className="text-sm font-normal text-zinc-500">days</span>
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Estimated essential-expense runway if primary income stops
          </p>
          <p className="mt-3 text-sm text-zinc-400">
            {top?.current_state || "See categories for details."}
          </p>
          <Button asChild size="sm" className="mt-4" variant="outline">
            <Link href="/app/prepare">Fix this first →</Link>
          </Button>
        </section>

        <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-500">
            Today's priority
          </p>
          <h2 className="mt-3 text-lg font-semibold text-zinc-50">{move.title}</h2>
          <p className="mt-2 text-xs text-zinc-500">
            {move.time_estimate} · {move.difficulty}
          </p>
          <p className="mt-3 text-sm text-zinc-400">{move.why}</p>
          <Button asChild size="sm" className="mt-4">
            <Link href="/app/prepare">Start now →</Link>
          </Button>
        </section>
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
          Financial runway
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <p className="text-[10px] text-zinc-600">Primary income</p>
            <p className="text-sm font-medium text-zinc-200">
              {plan.income > 0 ? `${formatMoney(plan.income)}/mo` : "—"}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-600">Essential expenses</p>
            <p className="text-sm font-medium text-zinc-200">
              {plan.expenses > 0 ? `${formatMoney(plan.expenses)}/mo` : "—"}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-600">Runway</p>
            <p className="text-sm font-medium text-zinc-200">{plan.runwayDays} days</p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-600">Weekly buffer tip</p>
            <p className="text-sm font-medium text-emerald-400">
              {plan.weeklyTransfer > 0 ? formatMoney(plan.weeklyTransfer) : "—"}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              Intel · may affect you
            </p>
            <Link href="/app/intel" className="text-xs text-emerald-400 hover:underline">
              View all →
            </Link>
          </div>
          <ul className="mt-3 space-y-3">
            {intel.map((i) => (
              <li key={i.id}>
                <p className="text-sm font-medium text-zinc-200">{i.title}</p>
                <p className="text-xs text-zinc-500">
                  Impact: {i.impact} · {i.category}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              Nearby resources
            </p>
            <Link href="/app/nearby" className="text-xs text-emerald-400 hover:underline">
              Explore →
            </Link>
          </div>
          <p className="mt-3 text-sm text-zinc-400">
            Food, pharmacy, banking, fuel, and emergency services near your location — same
            interface worldwide.
          </p>
          <Button asChild size="sm" variant="outline" className="mt-4">
            <Link href="/app/nearby">Open map search →</Link>
          </Button>
        </section>
      </div>

      {!premium && (
        <section className="rounded-2xl border border-zinc-800 p-6 text-center">
          <p className="text-sm text-zinc-300">
            Unlock full scenarios, history depth, and household tools.
          </p>
          <p className="mt-1 text-xs text-zinc-500">Founding lifetime — one payment</p>
          <Button className="mt-4" onClick={unlock} disabled={paying}>
            {paying ? "Opening…" : "Become a founding member"}
          </Button>
        </section>
      )}
    </div>
  );
}
