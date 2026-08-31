"use client";

import { useRouter } from "next/navigation";
import { AssessmentWizard } from "@/components/assessment/wizard";
import type { AssessmentAnswers } from "@/types";
import {
  calculateCategoryScores,
  calculateVulnerabilities,
} from "@/lib/scoring";
import Link from "next/link";

export default function AssessmentPage() {
  const router = useRouter();

  function handleComplete(answers: AssessmentAnswers) {
    const scores = calculateCategoryScores(answers);
    const vulnerabilities = calculateVulnerabilities(answers, scores);

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "tiltshield_session",
        JSON.stringify({ answers, scores, vulnerabilities })
      );
    }
    router.push("/results");
  }

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
          <span className="text-xs text-zinc-500">About 2 minutes</span>
        </div>
      </header>
      <AssessmentWizard onComplete={handleComplete} />
    </main>
  );
}
