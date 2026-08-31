"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type VaultItem = {
  id: string;
  name: string;
  note: string;
  addedAt: string;
};

const KEY = "tiltshield_vault_meta";

export default function VaultPage() {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem(KEY) || "[]"));
    } catch {
      /* */
    }
  }, []);

  function save(next: VaultItem[]) {
    setItems(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  function add() {
    if (!name.trim()) return;
    const item: VaultItem = {
      id: crypto.randomUUID(),
      name: name.trim(),
      note: note.trim(),
      addedAt: new Date().toISOString(),
    };
    save([item, ...items]);
    setName("");
    setNote("");
  }

  function remove(id: string) {
    save(items.filter((i) => i.id !== id));
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-50">Document vault</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Labels and notes stay on this device. Store actual files offline (encrypted
          drive or paper). Tiltshield does not upload your documents.
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Label (e.g. Passport scan \u2014 offline USB)"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
        />
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Where it lives (drawer, hardware wallet seed paper, USB\u2026)"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
        />
        <Button type="button" size="sm" onClick={add}>
          Add entry
        </Button>
      </div>

      <ul className="space-y-2">
        {items.map((i) => (
          <li
            key={i.id}
            className="flex items-start justify-between gap-3 rounded-xl border border-zinc-800 px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-zinc-100">{i.name}</p>
              {i.note && <p className="mt-0.5 text-xs text-zinc-500">{i.note}</p>}
            </div>
            <button
              type="button"
              onClick={() => remove(i.id)}
              className="text-xs text-zinc-600 hover:text-red-400"
            >
              Remove
            </button>
          </li>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-zinc-500">No entries yet. Start with IDs and recovery codes.</p>
        )}
      </ul>
    </div>
  );
}
