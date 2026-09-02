"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { isPremium } from "@/lib/session";
import {
  getActiveMember,
  loadFamilyMembers,
  saveFamilyMembers,
} from "@/lib/family";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";

const NAME_KEY = "tiltshield_display_name";
const PHOTO_KEY = "tiltshield_profile_photo";

export default function SettingsPage() {
  const [premium, setPrem] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [paying, setPaying] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPrem(isPremium());
    try {
      const stored = localStorage.getItem(NAME_KEY);
      if (stored) setDisplayName(stored);
      else setDisplayName(getActiveMember().name || "");
      setPhoto(localStorage.getItem(PHOTO_KEY));
    } catch {
      /* */
    }
  }, []);

  function saveName() {
    const n = displayName.trim() || "You";
    try {
      localStorage.setItem(NAME_KEY, n);
      const members = loadFamilyMembers();
      saveFamilyMembers(
        members.map((m) => (m.id === "self" ? { ...m, name: n } : m))
      );
      window.dispatchEvent(new Event("tiltshield:member-change"));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      /* */
    }
  }

  function onPhoto(file: File | null) {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Max 2 MB photo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const data = String(reader.result || "");
      try {
        localStorage.setItem(PHOTO_KEY, data);
        setPhoto(data);
        window.dispatchEvent(new Event("tiltshield:member-change"));
      } catch {
        alert("Could not save photo on this device.");
      }
    };
    reader.readAsDataURL(file);
  }

  async function unlock() {
    setPaying(true);
    try {
      const res = await fetch("/api/flutterwave/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "lifetime" }),
      });
      const json = await res.json();
      if (json.link) {
        window.location.href = json.link;
        return;
      }
      alert(json.error || "Payment not configured.");
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <PageHeader
        title="Settings"
        subtitle="Profile, plan, and privacy — data stays under your control."
        backHref="/app/more"
        showBack
      />

      <section className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Profile
        </p>
        <div className="mt-4 flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative flex h-16 w-16 overflow-hidden items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/30 to-teal-600/20 text-xl font-bold text-emerald-300 ring-2 ring-emerald-500/25"
            aria-label="Change photo"
          >
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="" className="h-full w-full object-cover" />
            ) : (
              (displayName || "Y").slice(0, 1).toUpperCase()
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onPhoto(e.target.files?.[0] || null)}
          />
          <div className="min-w-0 flex-1">
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Display name"
              className="w-full rounded-xl border border-white/[0.08] bg-[#060a12] px-3 py-2.5 text-sm text-zinc-50"
            />
            <div className="mt-2 flex gap-2">
              <Button type="button" size="sm" onClick={saveName}>
                {saved ? "Saved" : "Save name"}
              </Button>
              <button
                type="button"
                className="text-xs text-zinc-500 hover:text-zinc-300"
                onClick={() => fileRef.current?.click()}
              >
                Change photo
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Plan
        </p>
        <p className="mt-2 text-sm text-zinc-200">
          {premium ? "Founding / Premium — full What If, family, vault." : "Free plan — core assessment & limited scenarios."}
        </p>
        {!premium && (
          <Button className="mt-3" size="sm" disabled={paying} onClick={() => void unlock()}>
            {paying ? "Opening…" : "Unlock $29 lifetime"}
          </Button>
        )}
      </section>

      <section className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Shortcuts
        </p>
        {[
          { href: "/app/family", label: "Family profiles" },
          { href: "/app/vault", label: "Document vault" },
          { href: "/app/history", label: "Score history" },
          { href: "/assessment", label: "Retake assessment" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-zinc-200 transition hover:border-emerald-500/25"
          >
            {l.label}
            <span className="text-zinc-600">→</span>
          </Link>
        ))}
      </section>

      <p className="text-center text-[11px] text-zinc-600">
        Assessment & vault data stay on this device unless you sync with your account.
      </p>
    </div>
  );
}
