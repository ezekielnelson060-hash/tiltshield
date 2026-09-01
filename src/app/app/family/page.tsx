"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  loadFamilyMembers,
  addFamilyMember,
  removeFamilyMember,
  setActiveMemberId,
  getActiveMemberId,
  isFamilyUnlocked,
  RELATION_LABELS,
  type FamilyMember,
  type FamilyRelation,
} from "@/lib/family";
import { loadSession } from "@/lib/session";
import { syncFamilyToCloud, loadFamilyFromCloud } from "@/lib/persist";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function FamilyPage() {
  const router = useRouter();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [active, setActive] = useState("self");
  const [unlocked, setUnlocked] = useState(false);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState<FamilyRelation>("spouse");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [householdScore, setHouseholdScore] = useState(0);

  async function refresh() {
    await loadFamilyFromCloud();
    const list = loadFamilyMembers();
    setMembers(list);
    setActive(getActiveMemberId());
    setUnlocked(isFamilyUnlocked());
    const scores = list.map((m) => m.readinessScore ?? 0);
    const avg =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : loadSession()?.scores.overall ?? 0;
    setHouseholdScore(avg);
  }

  useEffect(() => {
    void refresh();
  }, []);

  function switchTo(id: string) {
    setActiveMemberId(id);
    setActive(id);
    router.push("/app/overview");
    router.refresh();
  }

  async function onAdd() {
    setError(null);
    if (!unlocked) return;
    if (!name.trim()) return;
    if (members.length >= 6) {
      setError("Family plan supports up to 6 profiles.");
      return;
    }
    addFamilyMember(name, relation);
    setName("");
    await syncFamilyToCloud();
    await refresh();
  }

  async function unlockFamily() {
    setPaying(true);
    try {
      const res = await fetch("/api/flutterwave/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "family" }),
      });
      const json = await res.json();
      if (json.link) {
        window.location.href = json.link;
        return;
      }
      setError(json.error || "Payment not configured.");
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">Family</h1>
        <p className="mt-1 text-sm text-zinc-500">Household resilience overview.</p>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Household score
        </p>
        <div className="mt-3 flex items-end gap-3">
          <span className="text-4xl font-bold tabular-nums text-zinc-50">{householdScore}</span>
          <span className="mb-1 text-sm text-zinc-500">/ 100</span>
          <span className="mb-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
            Stable
          </span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
            style={{ width: `${Math.min(100, householdScore)}%` }}
          />
        </div>
      </div>

      <section>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Members
        </p>
        <div className="space-y-2">
          {members.map((m) => {
            const isActive = m.id === active;
            return (
              <div
                key={m.id}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 transition",
                  isActive
                    ? "border-emerald-500/30 bg-emerald-500/10"
                    : "border-white/[0.08] bg-white/[0.03]"
                )}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/25 to-teal-600/15 text-sm font-bold text-emerald-300">
                  {m.name.slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-100">
                    {m.name}
                    {m.id === "self" ? " · You" : ""}
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    {RELATION_LABELS[m.relationship] || m.relationship}
                  </p>
                </div>
                <span className="text-sm font-semibold tabular-nums text-zinc-300">
                  {m.readinessScore ?? loadSession()?.scores.overall ?? "—"}
                </span>
                <button
                  type="button"
                  onClick={() => switchTo(m.id)}
                  className="text-xs font-medium text-emerald-400 hover:text-emerald-300"
                >
                  Open
                </button>
                {m.id !== "self" && unlocked && (
                  <button
                    type="button"
                    onClick={async () => {
                      removeFamilyMember(m.id);
                      await syncFamilyToCloud();
                      await refresh();
                    }}
                    className="text-xs text-zinc-600 hover:text-red-400"
                  >
                    Remove
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {unlocked ? (
        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Add member
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="flex-1 rounded-xl border border-white/[0.08] bg-[#060a12] px-3 py-2.5 text-sm text-zinc-50 placeholder:text-zinc-600"
            />
            <select
              value={relation}
              onChange={(e) => setRelation(e.target.value as FamilyRelation)}
              className="rounded-xl border border-white/[0.08] bg-[#060a12] px-3 py-2.5 text-sm text-zinc-300"
            >
              <option value="spouse">Partner</option>
              <option value="child">Child</option>
              <option value="other">Other</option>
            </select>
            <Button type="button" size="sm" onClick={() => void onAdd()}>
              Add
            </Button>
          </div>
          {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
        </section>
      ) : (
        <section className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5">
          <p className="text-sm font-medium text-zinc-100">Unlock household profiles</p>
          <p className="mt-1 text-xs text-zinc-500">
            Track readiness for partner and kids — family tier.
          </p>
          <Button
            className="mt-4"
            size="sm"
            disabled={paying}
            onClick={() => void unlockFamily()}
          >
            {paying ? "Opening checkout…" : "Unlock family plan"}
          </Button>
          {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
        </section>
      )}

      <Link
        href="/app/prepare"
        className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-zinc-300 transition hover:border-white/15"
      >
        <span>Household plan</span>
        <span className="text-emerald-400">View →</span>
      </Link>
    </div>
  );
}
