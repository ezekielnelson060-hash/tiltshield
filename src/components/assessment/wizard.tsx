"use client";

import { useState } from "react";
import {
  ASSESSMENT_QUESTIONS,
  ANSWER_DEFAULTS,
  type Question,
} from "@/lib/questions";
import type { AssessmentAnswers } from "@/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Props {
  onComplete: (answers: AssessmentAnswers) => void;
  /** Defaults to core (~9). Pass deep or member pulse lists as needed. */
  questions?: Question[];
  /** Merge into starting answers (e.g. previous core before deep). */
  initialAnswers?: Partial<AssessmentAnswers>;
  titleHint?: string;
}

export function AssessmentWizard({
  onComplete,
  questions = ASSESSMENT_QUESTIONS,
  initialAnswers,
  titleHint,
}: Props) {
  const list = questions.length ? questions : ASSESSMENT_QUESTIONS;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>({
    ...ANSWER_DEFAULTS,
    ...initialAnswers,
  });
  const q = list[step];
  const progress = ((step + 1) / list.length) * 100;

  function setValue(value: number | boolean) {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
  }

  function next() {
    if (step < list.length - 1) {
      setStep((s) => s + 1);
    } else {
      onComplete(answers);
    }
  }

  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  const current = answers[q.id];

  return (
    <div className="mx-auto max-w-lg space-y-7 px-4 py-8">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-zinc-400">
          <span>
            {titleHint ? `${titleHint} · ` : ""}
            {step + 1} of {list.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} />
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">
          {q.title}
        </h2>
        {q.help && <p className="text-sm text-zinc-400">{q.help}</p>}
      </div>

      <div className="min-h-[140px]">
        {q.type === "slider" && (
          <div className="space-y-4">
            <input
              type="range"
              min={q.min}
              max={q.max}
              step={q.step ?? 1}
              value={Number(current) || 0}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <p className="text-center text-3xl font-bold tabular-nums text-zinc-50">
              {Number(current) || 0}
              {q.unit ? (
                <span className="ml-1 text-base font-normal text-zinc-500">
                  {q.unit}
                </span>
              ) : null}
            </p>
          </div>
        )}

        {q.type === "number" && (
          <input
            type="number"
            min={q.min}
            step={q.step}
            value={Number(current) || ""}
            onChange={(e) => setValue(Number(e.target.value) || 0)}
            className="w-full rounded-xl border border-white/10 bg-[#080d16] px-4 py-3 text-lg text-zinc-50"
            placeholder="0"
          />
        )}

        {q.type === "boolean" && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ].map((opt) => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => setValue(opt.value)}
                className={cn(
                  "rounded-xl border px-4 py-4 text-sm font-medium transition",
                  current === opt.value
                    ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
                    : "border-white/10 bg-white/[0.03] text-zinc-300"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {q.type === "choice" && q.choices && (
          <div className="space-y-2">
            {q.choices.map((c) => (
              <button
                key={String(c.value)}
                type="button"
                onClick={() => setValue(c.value)}
                className={cn(
                  "w-full rounded-xl border px-4 py-3 text-left text-sm transition",
                  current === c.value
                    ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-200"
                    : "border-white/10 bg-white/[0.03] text-zinc-300"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={step === 0}
          onClick={back}
          className="flex-1"
        >
          Back
        </Button>
        <Button type="button" onClick={next} className="flex-1">
          {step === list.length - 1 ? "See my score" : "Next"}
        </Button>
      </div>
    </div>
  );
}
