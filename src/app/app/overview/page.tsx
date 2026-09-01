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
import { cn } from "@/lib/utils";
import type { CategoryScores } from "@/types";

const CATEGORY_TILES: {
  key: keyof CategoryScores;
  label: string;
  tint: string;
}[] = [
  { key: "money", label: "Money", tint: "from-red-500/20 to-red-500/5" },
  { key: "digital", label: "Digital", tint: "from-amber-500/20 to-amber-500/5" },
  { key: "food", label: "Essentials", tint: "from-emerald-500/20 to-emerald-500/5" },
  { key: "home", label: "Home", tint: "from-lime-500/20 to-lime-500/5" },
  { key: "communication", label: "Mobility", tint: "from-cyan-500/20 to-cyan-500/5" },
  { key: "skills", label: "Health", tint: "from-teal-500/20 to-teal-500/5" },
  { key: "documents", label: "Community", tint: "from-violet-500/20 to-violet-500/5" },
  { key: "emergency", label: "Emergency", tint: "from-orange-500/20 to-orange-500/5" },
];

function Sparkline() {
  const pts = "0,28 20,22 40,24 60,14 80,16 100,8";
  return (
    <svg viewBox="0 0 100 32" className="mt-2 h-8 w-full max-w-[120px] text-emerald-400/80">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
      />
    </svg>
  );
}

function ScoreRing({ score }: { score: number }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score)) / 100;
  const offset = c * (1 - pct);
  return (
    <svg width="96" height="96" className="-rotate-90">
      <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
      <circle
        cx="48"
        cy="48"
        r={r}
        fill="none"
        stroke="url(#ringGrad)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
      />
      <defs>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#2dd4bf" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function TodayPage() {
  const [session, setSession] = useState<TiltSession | null>(null);
  const [name, setName] = useState("there");
  const [daysSince, setDaysSince] = useState<number | null>(null);
  const [premium, setPrem] = useState(false);
  const [paying, setPaying] = useState(false);
  const [place, setPlace] = useState<string | null>(null);
  const [weather, setWeather] = useState<string | null>(null);

  useEffect(() => {
    setSession(loadSession());
    setDaysSince(daysSinceLastAssessment());
    setPrem(isPremium());
    try {
      const stored = localStorage.getItem("tiltshield_display_name");
      setName((stored || getActiveMember().name || "there").split(" ")[0]);
    } catch {
      /* */
    }
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude: lat, longitude: lon } = pos.coords;
          try {
            const w = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`
            );
            const j = await w.json();
            const temp = j?.current?.temperature_2m;
            if (typeof temp === "number") setWeather(`${Math.round(temp)}°`);
          } catch {
            /* */
          }
          try {
            const g = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
              { headers: { "Accept-Language": "en" } }
            );
            const gj = await g.json();
            const city =
              gj?.address?.city ||
              gj?.address?.town ||
              gj?.address?.village ||
              gj?.address?.state;
            if (city) setPlace(String(city));
          } catch {
            /* */
          }
        },
        () => {},
        { timeout: 8000 }
      );
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
  }).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 lg:px-8 lg:py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
            {greetingForHour()}, {name}{" "}
            <span className="inline-block">👋</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Here's your resilience overview for today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          {place && (
            <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1">
              {place}
            </span>
          )}
          {weather && (
            <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1">
              {weather}
            </span>
          )}
          {daysSince !== null && (
            <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1">
              Assessed {daysSince === 0 ? "today" : `${daysSince}d ago`}
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent p-5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Resilience Score
          </p>
          <div className="mt-3 flex items-center gap-4">
            <div className="relative shrink-0">
              <ScoreRing score={scores.overall} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold tabular-nums text-zinc-50">
                  {scores.overall}
                </span>
                <span className="text-[10px] text-zinc-600">/ 100</span>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-emerald-400">{label}</p>
              <p className="mt-1 text-xs text-zinc-500">Based on your latest assessment</p>
              <Sparkline />
              <Link href="/app/history" className="mt-1 inline-block text-xs text-emerald-500 hover:underline">
                View trend →
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-red-500/20 bg-gradient-to-b from-red-500/10 to-transparent p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              Your Biggest Exposure
            </p>
            <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-red-400">
              {top?.severity || "High"}
            </span>
          </div>
          <p className="mt-3 text-lg font-semibold text-zinc-50">
            {top?.title || "Complete assessment"}
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            {top?.current_state || "Your life may rely heavily on a single weak point."}
          </p>
          <p className="mt-4 text-3xl font-bold tabular-nums text-zinc-50">
            {plan.runwayDays}{" "}
            <span className="text-sm font-normal text-zinc-500">days</span>
          </p>
          <p className="text-xs text-zinc-500">estimated runway if income stops</p>
          <Link
            href="/app/risk"
            className="mt-4 inline-flex rounded-xl bg-red-500/20 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/30"
          >
            Fix this first →
          </Link>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/10 to-transparent p-5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Today's Priority
          </p>
          <p className="mt-3 text-lg font-semibold text-zinc-50">
            {move?.title || "Review your buffer plan"}
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-zinc-500">
            <span className="rounded-full border border-white/[0.08] px-2 py-0.5">
              {move?.time_estimate || "12 min"}
            </span>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-400">
              High impact
            </span>
          </div>
          <p className="mt-3 text-sm text-zinc-400">
            {move?.description || "Build a small cash cushion for unexpected disruptions."}
          </p>
          <Link
            href="/app/prepare"
            className="mt-4 inline-flex rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
          >
            Start now →
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 lg:col-span-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              Intel · things worth knowing
            </p>
            <Link href="/app/intel" className="text-xs text-emerald-500 hover:underline">
              View all →
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {intel.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-white/[0.06] bg-[#0a0f18] p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                    {item.category}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-medium capitalize",
                      item.impact === "high"
                        ? "text-red-400"
                        : item.impact === "medium"
                          ? "text-amber-400"
                          : "text-zinc-500"
                    )}
                  >
                    {item.impact}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium leading-snug text-zinc-200">{item.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{item.summary}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              Nearby Resources
            </p>
            <Link href="/app/nearby" className="text-xs text-emerald-500 hover:underline">
              See all
            </Link>
          </div>
          <div className="mt-3 space-y-2 text-sm text-zinc-300">
            {["Pharmacy", "Grocery Store", "ATM", "Medical Clinic"].map((label) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-[#0a0f18] px-3 py-2"
              >
                <span>{label}</span>
                <span className="text-xs text-zinc-500">Near you</span>
              </div>
            ))}
          </div>
          <Link
            href="/app/nearby"
            className="mt-4 flex items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-2.5 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/20"
          >
            Open map →
          </Link>
        </div>
      </div>

      <div>
        <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
          Your Resilience at a Glance
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
          {CATEGORY_TILES.map((c) => (
            <Link
              key={c.key}
              href={`/app/risk?cat=${c.key}`}
              className={cn(
                "rounded-xl border border-white/[0.06] bg-gradient-to-b p-3 text-center transition hover:border-white/10",
                c.tint
              )}
            >
              <p className="text-[10px] text-zinc-400">{c.label}</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-zinc-50">{scores[c.key]}</p>
              <p className="text-[10px] text-zinc-600">/ 100</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              Cash runway
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-zinc-50">
              {plan.runwayDays} days
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Target 90 days · gap {formatMoney(plan.gap)}
              {plan.weeklyTransfer > 0
                ? ` · suggest ${formatMoney(plan.weeklyTransfer)}/week`
                : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/app/what-if">Run What If</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/app/prepare">Open Prepare</Link>
            </Button>
          </div>
        </div>
      </div>

      {!premium && (
        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5">
          <p className="text-sm font-medium text-zinc-100">
            Unlock the full resilience system
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            All What If scenarios, family profiles, history, and vault — $29 lifetime.
          </p>
          <Button className="mt-4" size="sm" onClick={() => void unlock()} disabled={paying}>
            {paying ? "Opening checkout…" : "Become a founding member"}
          </Button>
        </div>
      )}
    </div>
  );
}
