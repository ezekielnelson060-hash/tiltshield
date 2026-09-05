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
import {
  buildExposureSnapshot,
  shareBreakPoint,
} from "@/lib/break-point";
import { topThreeActions } from "@/lib/plan-from-assessment";
import Link from "next/link";

function AssessmentInner() {
  const router = useRouter();
  const params = useSearchParams();
  const mode = params.get("mode") || "core";
  const [phase, setPhase] = useState<"quiz" | "shock">("quiz");
  const [coreAnswers, setCoreAnswers] = useState<AssessmentAnswers | null>(null);
  const [shareNote, setShareNote] = useState<string | null>(null);

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
    const session = { answers, scores, vulnerabilities, memberId };
    saveSession(session);
    updateMemberScore(memberId, scores.overall);
    void persistAssessmentToCloud(session);

    if (mode === "core") {
      setCoreAnswers(answers);
      setPhase("shock");
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

  if (phase === "shock" && mode === "core" && coreAnswers) {
    const scores = calculateCategoryScores(coreAnswers);
    const snap = buildExposureSnapshot(coreAnswers, scores);
    const actions = topThreeActions(coreAnswers);
    const shortest = snap?.primary;

    return (
      <main className="min-h-screen bg-zinc-950 px-4 py-10">
        <div className="mx-auto max-w-lg space-y-6">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-400/90">
            Exposure revealed
          </p>

          <div className="rounded-2xl border border-red-500/25 bg-red-500/[0.06] p-6 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-400/90">
              Your shortest clock
            </p>
            <p className="mt-3 text-5xl font-bold tabular-nums tracking-tight text-zinc-50">
              {shortest?.value || "—"}
            </p>
            <p className="mt-2 text-lg font-semibold text-zinc-100">
              {shortest?.label || "Break point"}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              {shortest?.meaning}
            </p>
            <p className="mt-4 text-xs text-zinc-500">
              Once you see it, you can&apos;t unsee it. Fix this clock first.
            </p>
          </div>

          {snap && (
            <div className="grid grid-cols-2 gap-2">
              {snap.clocks.slice(0, 4).map((bp) => (
                <div
                  key={bp.id}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5"
                >
                  <p className="text-[10px] uppercase tracking-wide text-zinc-500">
                    {bp.label.replace(" break point", "")}
                  </p>
                  <p
                    className={
                      bp.severity === "critical"
                        ? "mt-0.5 text-lg font-bold tabular-nums text-red-400"
                        : bp.severity === "high"
                          ? "mt-0.5 text-lg font-bold tabular-nums text-amber-400"
                          : "mt-0.5 text-lg font-bold tabular-nums text-zinc-100"
                    }
                  >
                    {bp.value}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              What happens next · 3 actions
            </p>
            <ol className="mt-3 space-y-3">
              {actions.map((a, i) => (
                <li
                  key={a.id}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-3"
                >
                  <div className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-sm font-bold text-emerald-400">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-zinc-50">{a.title}</p>
                      <p className="mt-1 text-xs text-zinc-500">{a.why}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push("/app/overview")}
              className="flex-1 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950"
            >
              Open Today · start action 1 →
            </button>
            <button
              type="button"
              onClick={async () => {
                if (!snap) return;
                const ok = await shareBreakPoint(snap);
                setShareNote(ok ? "Shared / copied" : "Could not share");
              }}
              className="flex-1 rounded-xl border border-white/15 px-5 py-3 text-sm font-medium text-zinc-200"
            >
              Share my break point
            </button>
          </div>
          {shareNote && (
            <p className="text-center text-xs text-emerald-400">{shareNote}</p>
          )}

          <button
            type="button"
            onClick={() => {
              setPhase("quiz");
              router.replace("/assessment?mode=deep");
            }}
            className="w-full text-center text-xs text-zinc-500 underline-offset-2 hover:text-zinc-300 hover:underline"
          >
            Optional: sharpen with {DEEP_QUESTIONS.length} more questions
          </button>
        </div>
      </main>
    );
  }

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
          <Link href="/" className="text-sm font-semibold tracking-tight text-zinc-50">
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
