"use client";

import { useState } from "react";
import { ASSESSMENT_QUESTIONS } from "@/lib/questions";
import type { AssessmentAnswers } from "@/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const defaults: AssessmentAnswers = {
  emergency_fund_months: 1,
  income_sources: 1,
  monthly_expenses: 2000,
  has_offline_docs: false,
  cloud_dependency: 4,
  emergency_supply_weeks: 0.5,
  offline_contacts: false,
  phone_backup_plan: false,
  alt_payment_method: false,
  food_buffer_days: 3,
};

interface Props {
  onComplete: (answers: AssessmentAnswers) => void;
}

export function AssessmentWizard({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>(defaults);
  const q = ASSESSMENT_QUESTIONS[step];
  const progress = ((step + 1) / ASSESSMENT_QUESTIONS.length) * 100;

  function setValue(value: number | boolean) {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
  }

  function next() {
    if (step < ASSESSMENT_QUESTIONS.length - 1) {
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
            Question {step + 1} of {ASSESSMENT_QUESTIONS.length}
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
              step={q.step}
              value={Number(current)}
              onChange={(e) => setValue(parseFloat(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="text-center text-3xl font-bold text-emerald-400">
              {Number(current)}
              {q.unit ? ` ${q.unit}` : ""}
            </div>
          </div>
        )}

        {q.type === "number" && (
          <input
            type="number"
            min={q.min}
            step={q.step}
            value={Number(current)}
            onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-lg text-zinc-50 focus:border-emerald-500 focus:outline-none"
          />
        )}

        {q.type === "boolean" && (
          <div className="grid grid-cols-2 gap-3">
            {[true, false].map((val) => (
              <button
                key={String(val)}
                type="button"
                onClick={() => setValue(val)}
                className={cn(
                  "rounded-lg border px-4 py-4 text-center font-medium transition",
                  current === val
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500"
                )}
              >
                {val ? "Yes" : "No"}
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
                onClick={() => setValue(c.value as number)}
                className={cn(
                  "w-full rounded-lg border px-4 py-3 text-left transition",
                  current === c.value
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500"
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
          variant="outline"
          onClick={back}
          disabled={step === 0}
          className="flex-1"
        >
          Back
        </Button>
        <Button onClick={next} className="flex-1">
          {step === ASSESSMENT_QUESTIONS.length - 1 ? "Show my results" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
