"use client";

import { useRouter } from "next/navigation";
import { AssessmentWizard } from "@/components/assessment/wizard";
import type { AssessmentAnswers } from "@/types";
import {
  calculateCategoryScores,
  calculateVulnerabilities,
} from "@/lib/scoring";
import { saveSession } from "@/lib/session";
import { getActiveMemberId } from "@/lib/family";
import { persistAssessmentToCloud } from "@/lib/persist";
import Link from "next/link";

export default function AssessmentPage() {
  const router = useRouter();

  async function handleComplete(answers: AssessmentAnswers) {
    const scores = calculateCategoryScores(answers);
    const vulnerabilities = calculateVulnerabilities(answers, scores);
    const session = {
      answers,
      scores,
      vulnerabilities,
      memberId: getActiveMemberId(),
    };
    saveSession(session);
    void persistAssessmentToCloud(session);
    router.push("/app/overview");
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
