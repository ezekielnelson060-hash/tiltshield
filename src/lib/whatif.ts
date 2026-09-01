import type { AssessmentAnswers, WhatIfResult, WhatIfScenario } from "@/types";
import { formatMoney } from "@/lib/locale";

export function runWhatIf(
  scenario: WhatIfScenario,
  answers: AssessmentAnswers
): WhatIfResult {
  const expenses = Math.max(0, answers.monthly_expenses || 0);
  const months = Math.max(0, answers.emergency_fund_months || 0);
  const savings = months * expenses;
  const runwayDays = Math.round(months * 30);
  const digiPay = answers.digital_payment_dependency || 3;
  const offlineVal = answers.offline_value_store || 0;

  switch (scenario) {
    case "income_stops": {
      const severity =
        runwayDays < 14
          ? "critical"
          : runwayDays < 45
            ? "high"
            : runwayDays < 90
              ? "medium"
              : "low";
      const incomeNote =
        answers.income_sources <= 1
          ? " You depend on a single income source, so this hits harder."
          : answers.income_sources === 2
            ? " Two income sources may cushion a partial loss, but a full stop still drains the buffer."
            : " Multiple sources help, but a simultaneous stop still tests cash runway.";
      return {
        scenario,
        title: "What if your income stopped today?",
        summary:
          runwayDays === 0
            ? "You have effectively no cash runway at your current expense level."
            : `You can operate for about ${runwayDays} days on savings alone.`,
        detail:
          expenses > 0
            ? `At ${formatMoney(expenses)}/month essential spend and ~${formatMoney(Math.round(savings))} accessible savings.${incomeNote}`
            : `Add monthly expenses for a precise runway.${incomeNote}`,
        severity,
        recommendation:
          runwayDays < 90
            ? `Target 90 days (~${formatMoney(Math.round(expenses * 3))}). Automate a weekly buffer transfer.`
            : "Maintain at least 90 days of expenses and review quarterly.",
      };
    }
    case "job_loss": {
      const severity =
        runwayDays < 30 ? "critical" : runwayDays < 90 ? "high" : "medium";
      return {
        scenario,
        title: "What if you lost your primary job?",
        summary: `Job loss lasts longer than a short disruption. Your liquid runway is about ${runwayDays} days.`,
        detail:
          answers.income_sources <= 1
            ? "With one income source, job loss is a full stop until you replace it."
            : "Other sources may reduce the hit, but primary-job loss still cuts most households sharply.",
        severity,
        recommendation:
          "Build runway toward 90 days and map one backup income path you could start within 30 days.",
      };
    }
    case "banking_down": {
      const hasAlt = !!answers.alt_payment_method;
      const severity = !hasAlt
        ? digiPay >= 4
          ? "critical"
          : "high"
        : offlineVal > 0
          ? "medium"
          : "high";
      return {
        scenario,
        title: "What if banks and cards failed for 72 hours?",
        summary: hasAlt
          ? "You have a backup payment path — test that it still works under stress."
          : "You have no alternative payment method on record.",
        detail:
          offlineVal > 0
            ? "Offline value (cash or self-custody) reduces total dependence on bank apps."
            : "Without cash or a tested second rail, essentials become hard within hours.",
        severity,
        recommendation: hasAlt
          ? "Refresh a modest cash reserve and test your backup quarterly."
          : "Set a small cash float and activate one non-primary payment option this week.",
      };
    }
    case "digital_payments_only": {
      const severity =
        digiPay >= 4 && offlineVal === 0 && !answers.alt_payment_method
          ? "critical"
          : digiPay >= 4
            ? "high"
            : "medium";
      return {
        scenario,
        title: "What if everyday payments required a digital account?",
        summary:
          digiPay >= 4
            ? "Your day-to-day life is highly dependent on digital payment rails."
            : "You already use non-digital options sometimes — that reduces exposure.",
        detail:
          "Payment networks, app outages, or account freezes can block grocery and transport when dependency is high.",
        severity,
        recommendation:
          "Keep a tested secondary method and a small cash float for essentials. Practice one cash-based purchase this month.",
      };
    }
    case "phone_lost": {
      const severity =
        !answers.phone_backup_plan && !answers.offline_contacts
          ? "critical"
          : !answers.phone_backup_plan
            ? "high"
            : "medium";
      return {
        scenario,
        title: "What if your phone was gone this afternoon?",
        summary: answers.phone_backup_plan
          ? "You report a recovery path for critical accounts."
          : "Critical accounts may be hard to open without this device.",
        detail: answers.offline_contacts
          ? "Offline contacts help you reach people without the phone’s address book."
          : "Without offline contacts, even calling for help depends on memory or other devices.",
        severity,
        recommendation:
          "Print recovery codes for top accounts and keep one offline contact sheet.",
      };
    }
    case "internet_outage": {
      const severity =
        (answers.cloud_dependency || 3) >= 4 ? "high" : "medium";
      return {
        scenario,
        title: "What if the internet was down for 48 hours?",
        summary:
          (answers.cloud_dependency || 3) >= 4
            ? "High cloud dependence means many workflows pause offline."
            : "Lower cloud dependence limits how much freezes offline.",
        detail: answers.has_offline_docs
          ? "Offline documents reduce identity and recovery friction during an outage."
          : "Important records only in the cloud are harder to use offline.",
        severity,
        recommendation:
          "Download offline copies of IDs, insurance, and recovery codes. Test one offline workflow.",
      };
    }
    case "power_grid": {
      return {
        scenario,
        title: "What if power was out for 72 hours?",
        summary: "Lighting, charging, refrigeration, and some payments become constrained.",
        detail: answers.has_med_kit
          ? "A basic kit helps with minor injuries when services are slow."
          : "Without a kit, small issues force unnecessary trips during an outage.",
        severity: "high",
        recommendation:
          "Charge a power bank, set flashlights, and plan 72 hours of food that does not need continuous power.",
      };
    }
    case "medical_emergency": {
      const severity =
        runwayDays < 30 ? "critical" : runwayDays < 60 ? "high" : "medium";
      return {
        scenario,
        title: "What if a sudden medical bill hit this month?",
        summary: `Your liquid buffer is about ${runwayDays} days of essential spend (~${formatMoney(Math.round(savings))}).`,
        detail:
          "Unexpected medical costs compete directly with rent and food unless a separate buffer exists.",
        severity,
        recommendation:
          "Separate a medical contingency from everyday spending and know your local clinic path offline.",
      };
    }
    case "food_prices_double": {
      const foodShare = expenses * 0.25;
      const extra = Math.round(foodShare);
      const severity =
        (answers.food_buffer_days || 0) < 7
          ? "high"
          : (answers.food_buffer_days || 0) < 14
            ? "medium"
            : "low";
      return {
        scenario,
        title: "What if grocery prices doubled overnight?",
        summary:
          expenses > 0
            ? `Food cost pressure rises by about ${formatMoney(extra)}/month (≈25% of essentials).`
            : "Add expenses to quantify food price shock.",
        detail:
          (answers.food_buffer_days || 0) >= 14
            ? "A longer pantry buffer slows the need to buy at peak prices."
            : "A thin pantry forces you into the market immediately at the new price.",
        severity,
        recommendation:
          "Stock staples you already eat. Aim for 14–30 pantry days before chasing bulk you will not use.",
      };
    }
    default:
      return {
        scenario,
        title: "Scenario",
        summary: "Complete your assessment for a personalized result.",
        detail: "",
        severity: "medium",
        recommendation: "Retake the assessment with full income and expense data.",
      };
  }
}
