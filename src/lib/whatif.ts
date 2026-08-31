import type { AssessmentAnswers, WhatIfResult, WhatIfScenario } from "@/types";

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
        runwayDays < 14 ? "critical" : runwayDays < 45 ? "high" : runwayDays < 90 ? "medium" : "low";
      const incomeNote =
        answers.income_sources <= 1
          ? " You depend on a single income source, so this scenario hits harder."
          : answers.income_sources === 2
            ? " Two income sources may cushion a partial loss, but a full stop still drains your buffer."
            : " Multiple income sources help, but a simultaneous stop still tests your cash runway.";
      return {
        scenario,
        title: "What if your income stopped today?",
        summary:
          runwayDays === 0
            ? "You have effectively no cash runway at your current expense level."
            : `You can operate for about ${runwayDays} days on savings alone.`,
        detail:
          expenses > 0
            ? `At $${expenses.toLocaleString()}/month essential spend and ~$${Math.round(savings).toLocaleString()} accessible savings.${incomeNote}`
            : `Add monthly expenses for a precise runway.${incomeNote}`,
        severity,
        recommendation:
          runwayDays < 90
            ? `Target 90 days (~$${Math.round(expenses * 3).toLocaleString()}). Automate a weekly buffer transfer.`
            : "Maintain at least 90 days of expenses and review quarterly.",
      };
    }
    case "job_loss": {
      const severity =
        runwayDays < 30 ? "critical" : runwayDays < 90 ? "high" : "medium";
      return {
        scenario,
        title: "What if you lost your primary job?",
        summary: `Job loss is longer than a short disruption. Your liquid runway is about ${runwayDays} days.`,
        detail:
          answers.income_sources <= 1
            ? "With one income source, job loss is a full stop until you replace it."
            : `You report ${answers.income_sources} income sources \u2014 secondary income may soften the hit, but primary job loss still changes the math.`,
        severity,
        recommendation:
          "Map a 30-day job-search budget, cut non-essentials, and list skills you can monetize within two weeks.",
      };
    }
    case "banking_down": {
      const hasAlt = answers.alt_payment_method || offlineVal >= 1;
      return {
        scenario,
        title: "What if banking is down for 72 hours?",
        summary: hasAlt
          ? "You have some path to pay outside your primary bank app."
          : "You have no clear alternative if cards and bank apps fail.",
        detail: hasAlt
          ? "Cash, secondary card, or offline value helps short outages. Confirm it still works this month."
          : "For 72 hours, transport and food get hard without a tested backup.",
        severity: hasAlt ? "low" : "critical",
        recommendation: hasAlt
          ? "Refresh a modest cash reserve and test your backup quarterly."
          : "Withdraw cash you can store safely and activate one non-primary payment option today.",
      };
    }
    case "digital_payments_only": {
      const severity =
        digiPay >= 4 && offlineVal === 0 && !answers.alt_payment_method
          ? "critical"
          : digiPay >= 4
            ? "high"
            : digiPay >= 3
              ? "medium"
              : "low";
      return {
        scenario,
        title: "What if everyday payments required a digital account?",
        summary:
          digiPay >= 4
            ? "Your day-to-day life already leans hard on digital payment rails."
            : "You still mix in non-digital options some of the time.",
        detail:
          offlineVal >= 2
            ? "Self-custody or hardware-held value gives you an option outside pure bank apps \u2014 only useful if you can still spend or convert when needed."
            : offlineVal === 1
              ? "Cash helps for local commerce. Larger digital-only corridors still need a plan."
              : "If cards, apps, or account access tighten, you currently have little held outside those systems.",
        severity,
        recommendation:
          offlineVal === 0
            ? "Build a cash float for local needs and learn one self-custody option (e.g. hardware wallet) with small amounts first \u2014 practice recovery before you need it."
            : "Document recovery seeds offline, test restore on a spare device, and keep a cash float for 7\u201314 days of local spend.",
      };
    }
    case "phone_lost": {
      const recovery = [
        answers.phone_backup_plan ? "account recovery" : null,
        answers.offline_contacts ? "offline contacts" : null,
        answers.has_offline_docs ? "offline documents" : null,
      ].filter(Boolean) as string[];
      const missing = [
        !answers.phone_backup_plan ? "2FA / account recovery" : null,
        !answers.offline_contacts ? "offline contact list" : null,
        !answers.has_offline_docs ? "offline document copies" : null,
      ].filter(Boolean) as string[];
      const ok = recovery.length === 3;
      return {
        scenario,
        title: "What if your phone was lost today?",
        summary: ok
          ? "You have recovery paths for accounts, contacts, and documents."
          : recovery.length
            ? `Partial \u2014 you have ${recovery.join(", ")}. Missing: ${missing.join(", ")}.`
            : "Critical accounts and contacts still depend on this one device.",
        detail:
          "Phone loss is common. Banking apps, 2FA, and contacts often live on one handset.",
        severity: ok ? "low" : recovery.length ? "high" : "critical",
        recommendation: missing.length
          ? `Next: fix ${missing[0]}. Export recovery codes and keep offline copies of IDs.`
          : "Re-test recovery from a second device every six months.",
      };
    }
    case "internet_outage": {
      const offlineOk =
        answers.has_offline_docs &&
        answers.offline_contacts &&
        (answers.alt_payment_method || offlineVal >= 1);
      return {
        scenario,
        title: "What if the internet was down for 48 hours?",
        summary: offlineOk
          ? "You can operate basic life offline for a short stretch."
          : "Many of your critical paths still assume connectivity.",
        detail: `Cloud dependency you reported: ${answers.cloud_dependency}/5. Offline docs: ${answers.has_offline_docs ? "yes" : "no"}. Offline contacts: ${answers.offline_contacts ? "yes" : "no"}.`,
        severity: offlineOk ? "low" : answers.cloud_dependency >= 4 ? "critical" : "high",
        recommendation:
          "Download offline maps, keep paper contacts, and ensure payment/food plans work without live apps.",
      };
    }
    case "power_grid": {
      const weeks = answers.emergency_supply_weeks || 0;
      return {
        scenario,
        title: "What if power was out for 72 hours?",
        summary:
          weeks >= 1
            ? `You have about ${weeks} week(s) of emergency stores to lean on.`
            : "You have little dedicated store for a multi-day power outage.",
        detail:
          "Light, water, refrigerated food, and device charging fail together. Cash and offline plans matter when POS terminals are down.",
        severity: weeks >= 2 ? "medium" : weeks >= 0.5 ? "high" : "critical",
        recommendation:
          "Assemble a 72-hour kit: water, light, power bank, shelf-stable food, cash, and any critical medicine.",
      };
    }
    case "medical_emergency": {
      return {
        scenario,
        title: "What if a sudden medical bill hit this month?",
        summary: `Your liquid buffer is about ${runwayDays} days of essential spend (~$${Math.round(savings).toLocaleString()}).`,
        detail:
          "Medical shocks often arrive with transport, time off work, and upfront costs \u2014 not only insurance paperwork.",
        severity: runwayDays < 30 ? "high" : runwayDays < 90 ? "medium" : "low",
        recommendation:
          "Keep a labeled medical buffer, list of meds/allergies offline, and know the nearest urgent care route without relying only on your phone.",
      };
    }
    case "food_prices_double": {
      const monthlyFood = Math.round(expenses * 0.25);
      const extra = monthlyFood;
      const monthsCovered = extra > 0 ? Math.floor(savings / extra) : 99;
      const pantryDays = Math.max(0, answers.food_buffer_days || 0);
      const supplyWeeks = Math.max(0, answers.emergency_supply_weeks || 0);
      return {
        scenario,
        title: "What if food prices doubled?",
        summary:
          expenses > 0
            ? `Food cost pressure rises by about $${extra.toLocaleString()}/month (\u224825% of essentials).`
            : "Add monthly expenses to size food exposure in dollars.",
        detail: `Pantry ~${pantryDays} days \u00b7 emergency stores ~${supplyWeeks} weeks \u00b7 buffer covers ~${monthsCovered} month(s) of that extra food cost. ${
          answers.food_source_diversity
            ? "You already diversify food sources, which helps when one channel spikes."
            : "A single supermarket chain means price shocks hit you in one place."
        }`,
        severity:
          monthsCovered >= 6 && pantryDays >= 14
            ? "low"
            : monthsCovered >= 3 || pantryDays >= 7
              ? "medium"
              : "high",
        recommendation:
          pantryDays < 14
            ? `Build 14+ days of food you already eat, then expand stores. Diversify suppliers where you can.`
            : "Rotate stock and treat food reserves as part of your emergency fund.",
      };
    }
    default:
      return {
        scenario,
        title: "Scenario",
        summary: "Unavailable",
        detail: "",
        severity: "medium",
        recommendation: "Re-run your assessment.",
      };
  }
}
