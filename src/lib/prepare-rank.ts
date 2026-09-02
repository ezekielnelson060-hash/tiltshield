import type { AssessmentAnswers } from "@/types";

export function stockPriority(id: string, answers: AssessmentAnswers): number {
  let p = 0;
  const food = answers.food_buffer_days || 0;
  const digi = answers.digital_payment_dependency || 3;
  const fund = answers.emergency_fund_months || 0;

  switch (id) {
    case "water_plan":
      p = 40;
      break;
    case "food_90":
      p = food < 14 ? 95 : food < 30 ? 70 : 40;
      break;
    case "food_rotate":
      p = food >= 14 ? 55 : 25;
      break;
    case "cash_float":
      p = fund < 1 ? 90 : fund < 3 ? 65 : 35;
      break;
    case "alt_pay":
      p = answers.alt_payment_method ? 20 : digi >= 4 ? 92 : 75;
      break;
    case "meds_30":
      p = answers.has_med_kit ? 30 : 80;
      break;
    case "first_aid":
      p = answers.has_med_kit ? 25 : 70;
      break;
    case "light_power":
      p = (answers.cloud_dependency || 0) >= 3 ? 60 : 45;
      break;
    case "docs_offline":
      p = answers.has_offline_docs ? 15 : 85;
      break;
    case "vendor_3":
      p = answers.has_local_vendors ? 20 : 72;
      break;
    case "family_plan":
      p = answers.offline_contacts ? 25 : 68;
      break;
    default:
      p = 30;
  }
  return p;
}

export function sortStockIds<T extends { id: string }>(
  items: T[],
  answers: AssessmentAnswers
): T[] {
  return [...items].sort(
    (a, b) => stockPriority(b.id, answers) - stockPriority(a.id, answers)
  );
}
