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
    id: "contact_card",
    label: "Offline contact list for the household",
    group: "Docs & people",
    patterns: [/contact|phone list|offline numbers|family numbers/i],
  },
];

export function loadStockChecks(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STOCK_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, boolean>;
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
  const items = typeof window !== "undefined" ? allStockItems() : YEAR_STOCK;
  const done = items.filter((i) => c[i.id]).length;
  const total = items.length;
  return {
    done,
    total,
    pct: total ? Math.round((done / total) * 100) : 0,
    remaining: items.filter((i) => !c[i.id]),
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
  const fromCore = YEAR_STOCK.find((i) => i.id === id)?.label;
  if (fromCore) return fromCore;
  if (typeof window !== "undefined") {
    const custom = loadCustomStock().find((i) => i.id === id)?.label;
    if (custom) return custom;
  }
  return id;
}

/** 12-month plan phases — what “done” looks like by horizon */
export const YEAR_PHASES = [
  {
    id: "foundation",
    label: "Foundation",
    months: "Months 1–3",
    ids: ["water_plan", "food_90", "cash_float", "docs_offline"],
  },
  {
    id: "buffers",
    label: "Buffers",
    months: "Months 4–6",
    ids: ["food_rotate", "alt_pay", "meds_30", "first_aid"],
  },
  {
    id: "network",
    label: "Network",
    months: "Months 7–9",
    ids: ["light_power", "vendor_3", "contact_card"],
  },
  {
    id: "depth",
    label: "Depth",
    months: "Months 10–12",
    ids: ["food_90", "cash_float", "alt_pay"],
  },
] as const;

export function phaseProgress(checks?: Record<string, boolean>) {
  const c = checks || loadStockChecks();
  return YEAR_PHASES.map((ph) => {
    const done = ph.ids.filter((id) => c[id]).length;
    const total = ph.ids.length;
    return {
      ...ph,
      done,
      total,
      pct: total ? Math.round((done / total) * 100) : 0,
    };
  });
}

/** User-added stock / plan lines (local) */
export const CUSTOM_STOCK_KEY = "tiltshield_custom_stock";

export type CustomStockItem = {
  id: string;
  label: string;
  group: string;
  hint?: string;
};

export function loadCustomStock(): CustomStockItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_STOCK_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as CustomStockItem[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveCustomStock(items: CustomStockItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CUSTOM_STOCK_KEY, JSON.stringify(items));
}

export function addCustomStockItem(label: string, group = "Your plan"): CustomStockItem {
  const item: CustomStockItem = {
    id: `custom_${Date.now()}`,
    label: label.trim(),
    group,
    hint: "You added this",
  };
  const next = [...loadCustomStock(), item];
  saveCustomStock(next);
  return item;
}

export function removeCustomStockItem(id: string) {
  saveCustomStock(loadCustomStock().filter((x) => x.id !== id));
}

/** Built-in + custom as YearStockItem-compatible list */
export function allStockItems(): YearStockItem[] {
  const custom = loadCustomStock().map((c) => ({
    id: c.id,
    label: c.label,
    group: c.group,
    hint: c.hint,
    patterns: [] as RegExp[],
  }));
  return [...YEAR_STOCK, ...custom];
}
