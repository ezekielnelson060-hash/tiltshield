/** Everyday prep journal — evidence toward the 12-month plan. */

export type JournalKind = "got" | "did" | "checked" | "note";

export type JournalEntry = {
  id: string;
  at: string; // ISO
  text: string;
  kind?: JournalKind;
  /** Linked year-stock item ids */
  stockIds?: string[];
  tags?: string[];
};

const JOURNAL_KEY = "tiltshield_prep_journal";

export function loadJournal(): JournalEntry[] {
  try {
    const raw = localStorage.getItem(JOURNAL_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as JournalEntry[];
    return Array.isArray(list)
      ? list.sort((a, b) => (a.at < b.at ? 1 : -1))
      : [];
  } catch {
    return [];
  }
}

export function saveJournal(entries: JournalEntry[]) {
  try {
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries.slice(0, 300)));
  } catch {
    /* quota */
  }
}

export function addJournalEntry(
  text: string,
  opts?: { stockIds?: string[]; tags?: string[]; kind?: JournalKind }
): JournalEntry {
  const entry: JournalEntry = {
    id: `j_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    at: new Date().toISOString(),
    text: text.trim(),
    kind: opts?.kind || "note",
    stockIds: opts?.stockIds?.length ? opts.stockIds : undefined,
    tags: opts?.tags,
  };
  const next = [entry, ...loadJournal()];
  saveJournal(next);
  return entry;
}

export function deleteJournalEntry(id: string) {
  saveJournal(loadJournal().filter((e) => e.id !== id));
}

export function journalLast7Days(entries?: JournalEntry[]): JournalEntry[] {
  const list = entries || loadJournal();
  const cut = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return list.filter((e) => new Date(e.at).getTime() >= cut);
}

/** Rough progress signal from journal volume + stock ticks */
export function journalSignal(
  entries: JournalEntry[],
  stockDone: number,
  stockTotal: number
) {
  const recent = entries.filter((e) => {
    const d = Date.now() - new Date(e.at).getTime();
    return d < 30 * 24 * 60 * 60 * 1000;
  }).length;
  const week = journalLast7Days(entries).length;
  const stockPct = stockTotal ? Math.round((stockDone / stockTotal) * 100) : 0;
  return {
    recentEntries: recent,
    weekEntries: week,
    stockPct,
    active: recent > 0 || stockDone > 0,
  };
}

export function kindLabel(k?: JournalKind): string {
  switch (k) {
    case "got":
      return "Got";
    case "did":
      return "Did";
    case "checked":
      return "Checked";
    default:
      return "Note";
  }
}
