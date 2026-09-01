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
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function FamilyPage() {
  const router = useRouter();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [active, setActive] = useState("self");
  const [unlocked, setUnlocked] = useState(false);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState<FamilyRelation>("spouse");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    await loadFamilyFromCloud();
    setMembers(loadFamilyMembers());
    setActive(getActiveMemberId());
    setUnlocked(isFamilyUnlocked());
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

  async function payFamily() {
    setPaying(true);
    setError(null);
    try {
      let email = "";
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        email = user?.email || "";
      } catch {
        /* */
      }
      const res = await fetch("/api/flutterwave/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "family", email }),
      });
      const json = await res.json();
      if (json.link) {
        window.location.href = json.link;
        return;
      }
      setError(
        json.error ||
          "Payment could not start. Set FLUTTERWAVE_SECRET_KEY on Vercel."
      );
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
          Family
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Separate readiness profiles for your household. Each person gets their
          own assessment, score, and plan.
        </p>
      </div>

      {!unlocked && (
        <section className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-6">
          <p className="text-sm font-medium text-zinc-100">Family plan</p>
          <p className="mt-2 text-sm text-zinc-400">
            Unlock multi-profile tracking. Lifetime founding members include
            family access after a verified lifetime payment.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" onClick={payFamily} disabled={paying}>
              {paying ? "Opening payment…" : "Pay — unlock family"}
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/app/settings">Lifetime / settings</Link>
            </Button>
          </div>
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </section>
      )}

      <section className="space-y-2">
        <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
          Profiles
        </p>
        <ul className="space-y-2">
          {members.map((m) => {
            const session = loadSession(m.id);
            const score = m.readinessScore ?? session?.scores.overall ?? null;
            const isActive = active === m.id;
            return (
              <li
                key={m.id}
                className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
                  isActive
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : "border-zinc-800 bg-zinc-900/40"
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-zinc-100">
                    {m.name}{" "}
                    <span className="text-xs font-normal text-zinc-500">
                      · {RELATION_LABELS[m.relationship]}
                    </span>
                  </p>
                  <p className="text-xs text-zinc-500">
                    {score != null ? `Score ${score}` : "No assessment yet"}
                    {isActive && " · active"}
                    {m.cloudId && " · synced"}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {!isActive && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => switchTo(m.id)}
                    >
                      Switch
                    </Button>
                  )}
                  <Button asChild size="sm">
                    <Link href="/assessment">Assess</Link>
                  </Button>
                  {m.id !== "self" && unlocked && (
                    <button
                      type="button"
                      className="text-xs text-zinc-600 hover:text-red-400"
                      onClick={() => {
                        removeFamilyMember(m.id);
                        void refresh();
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {unlocked && (
        <section className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <h2 className="text-sm font-medium text-zinc-200">Add profile</h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
          />
          <select
            value={relation}
            onChange={(e) => setRelation(e.target.value as FamilyRelation)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
          >
            <option value="spouse">Spouse / partner</option>
            <option value="child">Child</option>
            <option value="other">Other</option>
          </select>
          <Button size="sm" onClick={onAdd}>
            Add family member
          </Button>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </section>
      )}
    </div>
  );
}
