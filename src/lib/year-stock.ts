/**
 * Shared 12-month / year stock checklist + journal → progress mapping.
 * Single source of truth for Prepare, Today, and History.
 */

export type YearStockItem = {
  id: string;
  label: string;
  group: string;
  hint?: string;
  /** Keywords that journal text can auto-tick */
  patterns: RegExp[];
};

export const STOCK_KEY = "tiltshield_year_stock";

export const YEAR_STOCK: YearStockItem[] = [
  {
    id: "water_plan",
    label: "Water you can reach at home",
    group: "Year foundation",
    hint: "Store + a simple purify method",
    patterns: [/water|filter|purify|jerrycan|borehole/i],
  },
  {
    id: "food_90",
    label: "90 days on the way to a full year of food you already eat",
    group: "Year foundation",
    hint: "Same meals, deeper shelves — then layer toward 365",
    patterns: [/food|pantry|rice|beans|stocked|grocery|provisions|garri|yam|pasta|flour/i],
  },
  {
    id: "food_rotate",
    label: "Dates on every package",
    group: "Year foundation",
    hint: "Oldest first so nothing is wasted",
    patterns: [/rotate|dated|expiry|fifo|oldest first/i],
  },
  {
    id: "cash_float",
    label: "Cash for 2 to 4 weeks of essentials",
    group: "Money & access",
    patterns: [/cash|withdraw|atm|float|naira|notes|bills in hand/i],
  },
  {
    id: "alt_pay",
    label: "A second way to pay (tested)",
    group: "Money & access",
    patterns: [/backup pay|second (card|pay|bank)|alt(ernate)? pay|another bank|ussd|pos/i],
  },
  {
    id: "meds_30",
    label: "Extra critical meds (if safe)",
    group: "Health",
    patterns: [/med|prescription|pharmacy|drugs|refill/i],
  },
  {
    id: "first_aid",
    label: "First-aid kit ready",
    group: "Health",
    patterns: [/first.?aid|bandage|plaster|kit/i],
  },
  {
    id: "light_power",
    label: "Lights and charged power banks",
    group: "Home",
    patterns: [/power bank|battery|solar|generator|inverter|torch|flashlight|light/i],
  },
  {
    id: "docs_offline",
    label: "ID copies you can reach offline",
    group: "Docs & people",
    patterns: [/doc(ument)?s?|passport|id card|offline copy|nin|driver.?s? licen[cs]e/i],
  },
  {
    id: "vendor_3",
    label: "Three places nearby that work offline",
    group: "Docs & people",
    patterns: [/vendor|market|shop nearby|trusted place|offline store/i],
  },
  {
    id: "family_plan",
    label: "Household meetup plan",
    group: "Docs & people",
    patterns: [/family|contact tree|rally|meetup|household plan/i],
  },
];

export function loadStockChecks(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STOCK_KEY);
    if (!raw) return {};
    const o = JSON.parse(raw) as Record<string, boolean>;
    return o && typeof o === "object" ? o : {};
  } catch {
    return {};
  }
}

export function saveStockChecks(checks: Record<string, boolean>) {
  try {
    localStorage.setItem(STOCK_KEY, JSON.stringify(checks));
  } catch {
    /* */
  }
}

export function stockProgress(checks?: Record<string, boolean>) {
  const c = checks || loadStockChecks();
  const done = YEAR_STOCK.filter((i) => c[i.id]).length;
  const total = YEAR_STOCK.length;
  return {
    done,
    total,
    pct: total ? Math.round((done / total) * 100) : 0,
    remaining: YEAR_STOCK.filter((i) => !c[i.id]),
  };
}

/**
 * Apply journal text → tick matching year-stock items.
 * Returns ids newly completed.
 */
export function applyJournalToStock(text: string): string[] {
  const lower = text.toLowerCase();
  const checks = loadStockChecks();
  const newly: string[] = [];
  for (const item of YEAR_STOCK) {
    if (checks[item.id]) continue;
    if (item.patterns.some((re) => re.test(lower))) {
      checks[item.id] = true;
      newly.push(item.id);
    }
  }
  if (newly.length) {
    saveStockChecks(checks);
    try {
      localStorage.setItem(
        "tiltshield_progress_pulse",
        JSON.stringify({
          at: new Date().toISOString(),
          source: "journal",
          stockIds: newly,
        })
      );
      window.dispatchEvent(new Event("tiltshield:progress"));
    } catch {
      /* */
    }
  }
  return newly;
}

export function labelForStockId(id: string): string {
  return YEAR_STOCK.find((i) => i.id === id)?.label || id;
}
