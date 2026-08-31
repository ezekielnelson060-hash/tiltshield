"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { AssessmentAnswers, CategoryScores, Vulnerability } from "@/types";
import { VulnerabilityCard } from "@/components/dashboard/vulnerability-card";
import { WhatIfSimulator } from "@/components/what-if/simulator";
import { pickTodaysMove } from "@/lib/scoring";
import { Button } from "@/components/ui/button";

interface SessionData {
  answers: AssessmentAnswers;
  scores: CategoryScores;
  vulnerabilities: Vulnerability[];
}

function ResultsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<SessionData | null>(null);
  const [premium, setPremium] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("tiltshield_session");
    if (!raw) {
      router.replace("/assessment");
      return;
    }
    try {
      setData(JSON.parse(raw));
    } catch {
      router.replace("/assessment");
    }
    setPremium(localStorage.getItem("tiltshield_lifetime") === "1");
  }, [router]);

  useEffect(() => {
    const payment = searchParams.get("payment");
    const status = searchParams.get("status");
    const transactionId =
      searchParams.get("transaction_id") || searchParams.get("transactionId");
    if (payment !== "flutterwave") return;
    if (status === "successful" || status === "completed") {
      if (transactionId) {
        fetch(`/api/flutterwave/verify?transaction_id=${transactionId}`)
          .then((r) => r.json())
          .then((j) => {
            if (j.paid) {
              localStorage.setItem("tiltshield_lifetime", "1");
              setPremium(true);
            }
          })
          .catch(() => {
            localStorage.setItem("tiltshield_lifetime", "1");
            setPremium(true);
          });
      } else {
        localStorage.setItem("tiltshield_lifetime", "1");
        setPremium(true);
      }
    }
  }, [searchParams]);

  async function unlock() {
    setPayError(null);
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
        const ok = window.confirm(
          "Flutterwave is not configured yet.\n\nUnlock full plan for demo?"
        );
        if (ok) {
          localStorage.setItem("tiltshield_lifetime", "1");
          setPremium(true);
        }
        return;
      }
      setPayError(json.error || "Could not start payment");
    } catch {
      setPayError("Network error. Try again.");
    } finally {
      setPaying(false);
    }
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center text-zinc-400">
        Loading your plan…
      </main>
    );
  }

  const { answers, scores, vulnerabilities } = data;
  const move = pickTodaysMove(vulnerabilities);
  const top = vulnerabilities[0];
  const lockedCount = Math.max(0, vulnerabilities.length - 1);

  return (
    <main className="min-h-screen pb-20">
      <header className="border-b border-zinc-800/80 px-4 py-4">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-tight text-zinc-50">
            Tiltshield
          </Link>
          <div className="flex items-center gap-3 text-sm">
            {premium ? (
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                Lifetime
              </span>
            ) : (
              <Button size="sm" onClick={unlock} disabled={paying}>
                {paying ? "Opening…" : "Unlock $29"}
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-lg space-y-10 px-4 py-8">
        <section className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">
            How exposed are you?
          </p>
          <div className="mt-4 flex items-baseline justify-center gap-2">
            <span className="text-6xl font-bold tracking-tight text-zinc-50">
              {scores.overall}
            </span>
            <span className="text-lg text-zinc-600">/ 100</span>
          </div>
          <p className="mt-3 text-sm text-zinc-400">
            {scores.overall >= 70
              ? "You're more prepared than most — and still have gaps worth closing."
              : scores.overall >= 40
                ? "You're prepared for some disruptions. You're exposed to others."
                : "You're more dependent than you thought. That's useful to know."}
          </p>
        </section>

        {top && (
          <section>
            <VulnerabilityCard v={top} locked={false} />
            {!premium && lockedCount > 0 && (
              <p className="mt-3 text-center text-xs text-zinc-500">
                + {lockedCount} more vulnerabilit{lockedCount === 1 ? "y" : "ies"} in the full plan
              </p>
            )}
          </section>
        )}

        <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-emerald-500">
            One move
          </p>
          <h2 className="mt-2 text-lg font-semibold text-zinc-50">{move.title}</h2>
          <p className="mt-1 text-xs text-zinc-500">
            {move.time_estimate} · {move.difficulty} · High impact
          </p>
          <p className="mt-3 text-sm text-zinc-400">{move.why}</p>
          <ul className="mt-4 space-y-2">
            {move.steps.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-zinc-300">
                <span className="text-emerald-500">□</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <WhatIfSimulator
            answers={answers}
            isPremium={premium}
            onUnlock={unlock}
          />
        </section>

        {(premium || showAll) && (
          <section className="space-y-4">
            <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
              All vulnerabilities
            </h2>
            {vulnerabilities.map((v, i) => (
              <VulnerabilityCard key={v.rank} v={v} locked={!premium && i > 0} />
            ))}
          </section>
        )}

        {!premium && (
          <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-center">
            <p className="text-sm text-zinc-300">
              You just found where you&apos;re most exposed.
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Unlock the full plan to see every gap and every fix.
            </p>
            <Button onClick={unlock} className="mt-5 w-full" size="lg" disabled={paying}>
              {paying ? "Opening payment…" : "Unlock full plan — $29 lifetime"}
            </Button>
            {payError && <p className="mt-2 text-sm text-red-400">{payError}</p>}
            <p className="mt-3 text-xs text-zinc-600">One-time · Founding price · No subscription</p>
            {!showAll && (
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="mt-4 text-xs text-zinc-500 underline-offset-2 hover:underline"
              >
                Preview locked items
              </button>
            )}
          </section>
        )}

        <section className="text-center">
          <Button asChild variant="outline" size="sm">
            <Link href="/assessment">Retake assessment</Link>
          </Button>
        </section>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center text-zinc-400">
          Loading…
        </main>
      }
    >
      <ResultsInner />
    </Suspense>
  );
}
