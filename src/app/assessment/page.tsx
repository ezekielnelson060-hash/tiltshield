"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AssessmentWizard } from "@/components/assessment/wizard";
import type { AssessmentAnswers } from "@/types";
import {
  calculateCategoryScores,
  calculateVulnerabilities,
} from "@/lib/scoring";
import { saveSession, loadSession } from "@/lib/session";
import { getActiveMemberId, updateMemberScore } from "@/lib/family";
import { persistAssessmentToCloud } from "@/lib/persist";
import {
  CORE_QUESTIONS,
  DEEP_QUESTIONS,
  MEMBER_PULSE_QUESTIONS,
  ANSWER_DEFAULTS,
} from "@/lib/questions";
import Link from "next/link";

function AssessmentInner() {
  const router = useRouter();
  const params = useSearchParams();
  const mode = params.get("mode") || "core"; // core | deep | member
  const [phase, setPhase] = useState<"quiz" | "offer_deep">("quiz");
  const [coreAnswers, setCoreAnswers] = useState<AssessmentAnswers | null>(
    null
  );

  const questions =
    mode === "member"
      ? MEMBER_PULSE_QUESTIONS
      : mode === "deep"
        ? DEEP_QUESTIONS
        : CORE_QUESTIONS;

  const titleHint =
    mode === "member"
      ? "Member pulse"
      : mode === "deep"
        ? "Sharpen"
        : "Quick check";

  async function finish(answers: AssessmentAnswers) {
    const scores = calculateCategoryScores(answers);
    const vulnerabilities = calculateVulnerabilities(answers, scores);
    const memberId = getActiveMemberId();
    const session = {
      answers,
      scores,
      vulnerabilities,
      memberId,
    };
    saveSession(session);
    updateMemberScore(memberId, scores.overall);
    void persistAssessmentToCloud(session);

    if (mode === "core") {
      setCoreAnswers(answers);
      setPhase("offer_deep");
      return;
    }
    router.push("/app/overview");
  }

  function onCoreComplete(partial: AssessmentAnswers) {
    void finish(partial);
  }

  function onDeepComplete(deepPartial: AssessmentAnswers) {
    const merged = {
      ...ANSWER_DEFAULTS,
      ...(coreAnswers || loadSession()?.answers || {}),
      ...deepPartial,
    };
    void finish(merged).then(() => router.push("/app/overview"));
  }

  if (phase === "offer_deep" && mode === "core") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 px-4 text-center">
        <p className="text-lg font-semibold text-zinc-50">Score ready</p>
        <p className="max-w-sm text-sm text-zinc-400">
          You answered {CORE_QUESTIONS.length} key questions. Optional: sharpen
          with {DEEP_QUESTIONS.length} more for a fuller picture (~1 min).
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/app/overview")}
            className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950"
          >
            Go to Today →
          </button>
          <button
            type="button"
            onClick={() => {
              setPhase("quiz");
              router.replace("/assessment?mode=deep");
            }}
            className="rounded-xl border border-white/15 px-5 py-2.5 text-sm text-zinc-200"
          >
            Sharpen score
          </button>
        </div>
      </main>
    );
  }

  // deep mode after navigation loses coreAnswers state — merge from session
  const initial =
    mode === "deep"
      ? loadSession()?.answers || coreAnswers || undefined
      : mode === "member"
        ? ANSWER_DEFAULTS
        : undefined;

  return (
    <main className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-900 px-4 py-3.5">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-zinc-50"
          >
            Tiltshield
          </Link>
          <span className="text-xs text-zinc-500">
            {mode === "member"
              ? "~1 min · member"
              : mode === "deep"
                ? "~1 min · optional"
                : "~90 sec · core"}
          </span>
        </div>
      </header>
      <AssessmentWizard
        key={mode}
        questions={questions}
        initialAnswers={initial || undefined}
        titleHint={titleHint}
        onComplete={mode === "deep" ? onDeepComplete : onCoreComplete}
      />
    </main>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-500">
          Loading…
        </main>
      }
    >
      <AssessmentInner />
    </Suspense>
  );
}
