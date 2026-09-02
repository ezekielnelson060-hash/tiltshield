import type { AssessmentAnswers } from "@/types";
import type { FamilyMember } from "@/lib/family";

export type HouseholdDependency = {
  id: string;
  severity: "high" | "medium" | "low";
  title: string;
  detail: string;
  fixHref: string;
  fixLabel: string;
};

export function detectHouseholdDependencies(input: {
  members: FamilyMember[];
  answers: AssessmentAnswers;
}): HouseholdDependency[] {
  const { members, answers } = input;
  const n = Math.max(1, members.length);
  const deps: HouseholdDependency[] = [];

  if (answers.income_sources <= 1 && n >= 2) {
    deps.push({
      id: "single-income",
      severity: "high",
      title: `${n} household members depend on one income path`,
      detail:
        "If that income stops, the whole household feels it at once. Map a second path or extend runway.",
      fixHref: "/app/what-if",
      fixLabel: "Simulate income stop",
    });
  }

  if (!answers.alt_payment_method) {
    deps.push({
      id: "single-payment",
      severity: answers.digital_payment_dependency >= 4 ? "high" : "medium",
      title:
        n > 1
          ? "Household shares one primary payment rail"
          : "No tested alternative payment method",
      detail:
        "Bank/app outages block food, fuel, and meds for everyone on that rail.",
      fixHref: "/app/prepare",
      fixLabel: "Add backup payment",
    });
  }

  if (!answers.phone_backup_plan) {
    deps.push({
      id: "phone-single",
      severity: "high",
      title:
        n > 1
          ? "Critical accounts likely tied to one device"
          : "No phone backup plan on file",
      detail:
        "Lost phone can lock banking, 2FA, and family coordination at the same time.",
      fixHref: "/app/what-if",
      fixLabel: "Run phone-lost scenario",
    });
  }

  if ((answers.cloud_dependency || 0) >= 4 && !answers.has_offline_docs) {
    deps.push({
      id: "cloud-docs",
      severity: "medium",
      title:
        n > 1
          ? "Household documents live mainly in the cloud"
          : "Critical docs are cloud-only",
      detail: "Offline copies in Vault reduce shared lockout during outages.",
      fixHref: "/app/vault",
      fixLabel: "Open Vault",
    });
  }

  if (!answers.offline_contacts && n >= 2) {
    deps.push({
      id: "comms",
      severity: "medium",
      title: "No offline household contact plan",
      detail:
        "When apps fail, written numbers and a meetup point keep the household coordinated.",
      fixHref: "/app/prepare",
      fixLabel: "Add to Prepare network",
    });
  }

  if ((answers.food_buffer_days || 0) < 7 && n >= 2) {
    deps.push({
      id: "food-thin",
      severity: "medium",
      title: `Food buffer under a week for ${n} people`,
      detail:
        "Shared kitchens empty faster. Stretch toward 14–30 days of meals you already eat.",
      fixHref: "/app/prepare",
      fixLabel: "Open 1-year stock",
    });
  }

  if (!answers.has_local_vendors) {
    deps.push({
      id: "vendors",
      severity: "low",
      title: "Few offline-capable local vendors on file",
      detail: "Pin pharmacy, food, and cash access near you before you need them.",
      fixHref: "/app/nearby",
      fixLabel: "Search Nearby",
    });
  }

  const order = { high: 0, medium: 1, low: 2 };
  return deps.sort((a, b) => order[a.severity] - order[b.severity]);
}
