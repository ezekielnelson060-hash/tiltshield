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
          ? " One income means this hits harder."
          : " Extra income helps, but a full stop still drains the buffer.";
      return {
        scenario,
        title: "What if money in stopped today?",
        summary:
          runwayDays === 0
            ? "You have almost no cash runway right now."
            : `You can run about ${runwayDays} days on savings alone.`,
        detail:
          expenses > 0
            ? `About ${formatMoney(expenses)}/month essentials and ~${formatMoney(Math.round(savings))} saved.${incomeNote}`
            : `Add your monthly spend for a clearer number.${incomeNote}`,
        severity,
        recommendation:
          runwayDays < 90
            ? "Aim for 90 days of essentials. Start a small weekly transfer."
            : "Keep at least 90 days and check every few months.",
      };
    }
    case "job_loss": {
      const severity =
        runwayDays < 30 ? "critical" : runwayDays < 90 ? "high" : "medium";
      return {
        scenario,
        title: "What if your main job ended?",
        summary: `Job loss lasts. Your liquid runway is about ${runwayDays} days.`,
        detail:
          answers.income_sources <= 1
            ? "With one income, this is a full stop until you replace it."
            : "Other income may help, but the main job still matters a lot.",
        severity,
        recommendation:
          "Build toward 90 days and name one backup way to earn within 30 days.",
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
          ? "You have a backup pay path — test it works."
          : "No backup payment method on file.",
        detail:
          offlineVal > 0
            ? "Cash or offline value reduces total dependence on bank apps."
            : "Without cash or a second rail, basics get hard fast.",
        severity,
        recommendation: hasAlt
          ? "Keep a small cash float. Test the backup every few months."
          : "Set a small cash float and turn on one non-primary pay option this week.",
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
        title: "What if card and app pay stopped working?",
        summary:
          digiPay >= 4
            ? "Daily life leans hard on digital pay rails."
            : "You sometimes use other ways — that helps.",
        detail:
          "Network or account freezes can block food and travel when dependency is high.",
        severity,
        recommendation:
          "Keep a second method and a small cash float. Practice one cash purchase this month.",
      };
    }
    case "major_expense":
    case "currency_volatility": {
      const hit = Math.round(expenses * (scenario === "currency_volatility" ? 0.25 : 1));
      return {
        scenario,
        title:
          scenario === "currency_volatility"
            ? "What if money bought less?"
            : "What if a large bill hit this month?",
        summary: `A shock near ${formatMoney(hit)} tests your ~${runwayDays}-day buffer.`,
        detail: "Cost shocks are system stress too — not only outages.",
        severity: runwayDays < 30 ? "high" : "medium",
        recommendation: "Grow a labeled buffer and list one offline pay path.",
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
        title: "What if your phone was gone today?",
        summary: answers.phone_backup_plan
          ? "You have a recovery path for key accounts."
          : "Key accounts may be hard without this device.",
        detail: answers.offline_contacts
          ? "Offline contacts help you reach people without the phone book."
          : "Without offline contacts, help depends on memory or other devices.",
        severity,
        recommendation:
          "Print recovery codes. Keep one paper contact list.",
      };
    }
    case "internet_outage": {
      const severity =
        (answers.cloud_dependency || 3) >= 4 ? "high" : "medium";
      return {
        scenario,
        title: "What if the internet was down for days?",
        summary:
          (answers.cloud_dependency || 3) >= 4
            ? "High cloud use means many tasks pause offline."
            : "Lower cloud use limits what freezes offline.",
        detail: answers.has_offline_docs
          ? "Offline documents help with ID and recovery."
          : "Records only in the cloud are hard to use offline.",
        severity,
        recommendation:
          "Save offline copies of IDs and recovery codes. Test one offline workflow.",
      };
    }
    case "email_compromised":
    case "cloud_down":
    case "two_factor_down": {
      return {
        scenario,
        title: "What if your digital login path broke?",
        summary:
          "Email, cloud, or 2FA failure can lock banking and family contact together.",
        detail: answers.phone_backup_plan
          ? "You noted a phone backup plan — practice it once."
          : "No phone backup plan on file — shared lockout risk.",
        severity: answers.phone_backup_plan ? "medium" : "high",
        recommendation:
          "Print recovery codes. Store ID copies in Vault. Test login without your main phone.",
      };
    }
    case "power_grid": {
      return {
        scenario,
        title: "What if power was out for 72 hours?",
        summary: "Light, charging, cold food, and some payments get hard.",
        detail: answers.has_med_kit
          ? "A basic kit helps with small injuries when help is slow."
          : "Without a kit, small problems force trips during an outage.",
        severity: "high",
        recommendation:
          "Charge a power bank. Set flashlights. Plan 72 hours of food that needs no power.",
      };
    }
    case "medical_emergency": {
      const severity =
        runwayDays < 30 ? "critical" : runwayDays < 60 ? "high" : "medium";
      return {
        scenario,
        title: "What if a sudden medical bill hit?",
        summary: `Liquid buffer is about ${runwayDays} days (~${formatMoney(Math.round(savings))}).`,
        detail:
          "Medical costs compete with rent and food unless a separate buffer exists.",
        severity,
        recommendation:
          "Separate a medical cushion. Know a clinic path offline.",
      };
    }
    case "food_prices_double":
    case "store_unavailable":
    case "fuel_scarce":
    case "water_disruption": {
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
        title: "What if a basic essential was hard to get?",
        summary:
          expenses > 0 && scenario === "food_prices_double"
            ? `Food pressure rises by about ${formatMoney(extra)}/month.`
            : `Food on file: about ${answers.food_buffer_days || 0} days.`,
        detail:
          "Local gaps matter. Pin a second store and a water plan.",
        severity,
        recommendation:
          "Use Finder for a second grocery, pharmacy, and water option.",
      };
    }
    case "transit_down":
    case "vehicle_unavailable":
    case "travel_disruption": {
      return {
        scenario,
        title: "What if your usual travel path stopped?",
        summary: "Mobility stress hits work, food runs, and family meetups.",
        detail: "Write a backup route and a meetup that does not need live maps.",
        severity: "medium",
        recommendation:
          "Save one transit or fuel pin in Finder. Share the meetup in Family.",
      };
    }
    case "comms_outage":
    case "platforms_down":
    case "info_unreliable": {
      return {
        scenario,
        title: "What if normal information channels went quiet?",
        summary: "When feeds fail, paper contacts and trusted people matter.",
        detail: "Keep three offline numbers and one meeting place written down.",
        severity: "medium",
        recommendation:
          "Open Family plan. Write contacts on paper. Pin a community place nearby.",
      };
    }
    case "relocation":
    case "family_emergency": {
      return {
        scenario,
        title: "What if life forced a sudden household shift?",
        summary: `Cash runway about ${runwayDays} days. Keep docs offline in Vault.`,
        detail: "Moves and family emergencies mix money, docs, and people.",
        severity: runwayDays < 30 ? "high" : "medium",
        recommendation:
          "Vault critical docs. Name a backup contact. Keep a small go list in Prepare.",
      };
    }
    default:
      return {
        scenario,
        title: "Scenario",
        summary: "Complete your assessment for a personal result.",
        detail: "",
        severity: "medium",
        recommendation: "Retake the assessment with full income and spend data.",
      };
  }
}
