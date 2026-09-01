"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isPremium } from "@/lib/session";
import {
  getActiveMember,
  loadFamilyMembers,
  saveFamilyMembers,
} from "@/lib/family";
import { Button } from "@/components/ui/button";

const NAME_KEY = "tiltshield_display_name";

export default function SettingsPage() {
  const [premium, setPrem] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setPrem(isPremium());
    try {
      const stored = localStorage.getItem(NAME_KEY);
      if (stored) setDisplayName(stored);
      else setDisplayName(getActiveMember().name || "");
    } catch {
      /* */
    }
  }, []);

  function saveName() {
    const n = displayName.trim() || "You";
    try {
      localStorage.setItem(NAME_KEY, n);
      const members = loadFamilyMembers();
      const next = members.map((m) =>
        m.id === "self" ? { ...m, name: n } : m
      );
      saveFamilyMembers(next);
      window.dispatchEvent(new Event("tiltshield:member-change"));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      /* */
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
          Settings
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Profile, plan, and data on this device.
        </p>
      </div>

      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Profile
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Used for greetings on Today and your Family profile.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your first name"
            className="flex-1 rounded-xl border border-white/[0.08] bg-[#060a12] px-3 py-2.5 text-sm text-zinc-50 placeholder:text-zinc-600"
          />
          <Button type="button" size="sm" onClick={saveName}>
            {saved ? "Saved" : "Save"}
          </Button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/[0.08] divide-y divide-white/[0.06]">
        <div className="bg-white/[0.03] px-5 py-4">
          <p className="text-sm font-medium text-zinc-200">Subscription</p>
          <p className="mt-1 text-xs text-zinc-500">
            {premium
              ? "Lifetime access — full plan unlocked"
              : "Free tier — upgrade for full scenarios & family"}
          </p>
          {!premium && (
            <Button
              className="mt-3"
              size="sm"
              onClick={async () => {
                const res = await fetch("/api/flutterwave/initialize", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ product: "lifetime" }),
                });
                const json = await res.json();
                if (json.link) window.location.href = json.link;
                else alert(json.error || "Payment not configured");
              }}
            >
              Pay $29 — lifetime unlock
            </Button>
          )}
        </div>
        <div className="bg-white/[0.03] px-5 py-4">
          <p className="text-sm font-medium text-zinc-200">Assessment</p>
          <p className="mt-1 text-xs text-zinc-500">
            Stored on this device. Retake to refresh your plan.
          </p>
          <Link
            href="/assessment"
            className="mt-2 inline-block text-sm text-emerald-400 hover:text-emerald-300"
          >
            Retake assessment →
          </Link>
        </div>
        <div className="bg-white/[0.03] px-5 py-4">
          <p className="text-sm font-medium text-zinc-200">Family</p>
          <p className="mt-1 text-xs text-zinc-500">
            Household profiles and readiness.
          </p>
          <Link
            href="/app/family"
            className="mt-2 inline-block text-sm text-emerald-400 hover:text-emerald-300"
          >
            Manage family →
          </Link>
        </div>
        <div className="bg-white/[0.03] px-5 py-4">
          <p className="text-sm font-medium text-zinc-200">Privacy</p>
          <p className="mt-1 text-xs text-zinc-500">
            Answers stay on your device by default. Cloud sync only when signed
            in.
          </p>
        </div>
      </section>
    </div>
  );
}
