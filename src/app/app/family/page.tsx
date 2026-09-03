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
import { PageHeader } from "@/components/app/page-header";
import { detectHouseholdDependencies } from "@/lib/household";
import { createClient } from "@/lib/supabase/client";
import { HouseholdPlanCard } from "@/components/app/household-plan-card";
import { HouseholdInvite } from "@/components/app/household-invite";

export default function FamilyPage() {
  const router = useRouter();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [active, setActive] = useState("self");
  const [unlocked, setUnlocked] = useState(false);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState<FamilyRelation>("partner");
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
      setError("Household plan supports up to 6 profiles.");
      return;
    }
    addFamilyMember(name, relation);
    setName("");
    await syncFamilyToCloud();
    await refresh();
  }

  async function unlockFamily() {
    setPaying(true);
    setError(null);
    try {
      let email: string | undefined;
      let displayName: string | undefined;
      let userId: string | undefined;
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          userId = user.id;
          email = user.email || undefined;
          displayName =
            (user.user_metadata?.full_name as string) ||
            (user.user_metadata?.name as string) ||
            undefined;
        }
      } catch {
        /* */
      }
      const res = await fetch("/api/flutterwave/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: "family",
          email,
          name: displayName,
          userId,
        }),
      });
      const json = await res.json();
      if (json.link) {
        window.location.href = json.link;
        return;
      }
      setError(json.error || "Payment is not configured.");
    } finally {
      setPaying(false);
    }
  }

  const session = typeof window !== "undefined" ? loadSession() : null;
  const deps =
    session
      ? detectHouseholdDependencies({
          members,
          answers: session.answers,
        }).slice(0, 6)
      : [];

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <PageHeader
        title="Household"
        subtitle="Scores for everyone under one roof — then the shared plan."
        backHref="/app/more"
        showBack
      />

      <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.02] px-5 py-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Household resilience
        </p>
        <p className="mt-2 text-4xl font-bold tabular-nums text-zinc-50">
          {householdScore}{" "}
          <span className="text-sm font-normal text-zinc-500">/ 100</span>
        </p>
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
                    : "border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.02]"
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

      {unlocked && (
        <Link
          href="/assessment?mode=member"
          className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-zinc-300"
        >
          <span>Run short pulse for active member (~5 questions)</span>
          <span className="text-emerald-400">→</span>
        </Link>
      )}

      {unlocked ? (
        <section className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-5">
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
              <option value="partner">Partner</option>
              <option value="child">Children</option>
              <option value="parent">Parents</option>
              <option value="roommate">Roommates</option>
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
          <p className="text-sm font-medium text-zinc-100">
            Unlock household profiles
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Household plan $49 lifetime — premium tools plus up to 6 profiles.
            Individual lifetime does not include family seats.
          </p>
          <Button
            className="mt-4"
            size="sm"
            disabled={paying}
            onClick={() => void unlockFamily()}
          >
            {paying ? "Opening checkout…" : "Unlock household · $49"}
          </Button>
          {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
        </section>
      )}

      {deps.length > 0 && (
        <section className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Shared dependencies
          </p>
          {deps.map((d) => (
            <div
              key={d.id}
              className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.02] px-4 py-3.5"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-zinc-100">{d.title}</p>
                <span
                  className={
                    d.severity === "high"
                      ? "text-[10px] font-semibold uppercase text-red-400"
                      : d.severity === "medium"
                        ? "text-[10px] font-semibold uppercase text-amber-400"
                        : "text-[10px] font-semibold uppercase text-zinc-500"
                  }
                >
                  {d.severity}
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">{d.detail}</p>
              <Link
                href={d.fixHref}
                className="mt-2 inline-block text-xs font-medium text-emerald-400"
              >
                {d.fixLabel} →
              </Link>
            </div>
          ))}
        </section>
      )}

      {unlocked && (
        <>
          <HouseholdPlanCard />
          <HouseholdInvite />
        </>
      )}

      <Link
        href="/app/prepare"
        className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.02] px-4 py-3 text-sm text-zinc-300 transition hover:border-white/15"
      >
        <span>Open full Prepare tools</span>
        <span className="text-emerald-400">→</span>
      </Link>
    </div>
  );
}
