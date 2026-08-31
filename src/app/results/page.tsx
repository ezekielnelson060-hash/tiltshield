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
    const paid = localStorage.getItem("tiltshield_lifetime") === "1";
    setPremium(paid);
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
          "Flutterwave is not configured yet.\n\nUnlock full plan for demo? (Add FLUTTERWAVE_SECRET_KEY for real payments.)"
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

  return (
    <main className="min-h-screen pb-16">
      <header className="border-b border-zinc-800 px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" className="font-semibold text-zinc-50">
            Tiltshield
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="rounded-full bg-zinc-900 px-3 py-1 text-zinc-300">
              Score {scores.overall}/100
            </span>
            {!premium && (
              <Button size="sm" onClick={unlock} disabled={paying}>
                {paying ? "Opening…" : "Unlock"}
              </Button>
            )}
            {premium && (
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                Lifetime
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl space-y-10 px-4 py-8">
        <section>
          <h1 className="text-2xl font-bold text-zinc-50">
            Your top vulnerabilities
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Ranked by impact × gap. Fix the highest first.
          </p>
          <div className="mt-6 space-y-4">
            {vulnerabilities.map((v, i) => (
              <VulnerabilityCard
                key={v.rank}
                v={v}
                locked={!premium && i > 0}
              />
            ))}
          </div>
          {!premium && (
            <div className="mt-4">
              <Button
                onClick={unlock}
                className="w-full"
                size="lg"
                disabled={paying}
              >
                {paying ? "Opening payment…" : "Unlock full plan — founding price"}
              </Button>
              {payError && (
                <p className="mt-2 text-center text-sm text-red-400">{payError}</p>
              )}
              <p className="mt-2 text-center text-xs text-zinc-500">
                One-time payment via Flutterwave. No subscription.
              </p>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-500">
            Today&apos;s move
          </p>
          <h2 className="mt-2 text-lg font-semibold text-zinc-50">
            {move.title}
          </h2>
          <p className="mt-1 text-sm text-zinc-400">{move.why}</p>
          <p className="mt-3 text-xs text-zinc-500">
            Time: {move.time_estimate} · {move.difficulty}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-zinc-300">
            {move.steps.map((s, i) => (
              <li key={i} className="flex gap-2">
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

        <section className="rounded-xl border border-dashed border-zinc-700 p-5 text-center text-sm text-zinc-400">
          <p>
            Re-take the assessment anytime. Your plan updates from your latest
            answers.
          </p>
          <div className="mt-4">
            <Button asChild variant="outline">
              <Link href="/assessment">Retake assessment</Link>
            </Button>
          </div>
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
