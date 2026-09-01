"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { isPremium } from "@/lib/session";
import {
  getActiveMember,
  loadFamilyMembers,
  saveFamilyMembers,
} from "@/lib/family";
import { AppTopBar } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";

const NAME_KEY = "tiltshield_display_name";
const PHOTO_KEY = "tiltshield_profile_photo";

export default function SettingsPage() {
  const [premium, setPrem] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
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
    if (file.size > 1.5 * 1024 * 1024) {
      alert("Use a photo under 1.5 MB.");
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

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <AppTopBar title="Settings" backHref="/app/more" />
      <p className="-mt-2 text-sm text-zinc-500">
        Profile, plan, and data on this device.
      </p>

      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Profile
        </p>
        <div className="mt-4 flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-emerald-500/30"
          >
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-400/30 to-teal-600/20 text-lg font-bold text-emerald-300">
                {(displayName || "Y").slice(0, 1).toUpperCase()}
              </span>
            )}
          </button>
          <div>
            <p className="text-sm font-medium text-zinc-100">Profile photo</p>
            <p className="mt-0.5 text-xs text-zinc-500">Stored only on this device.</p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-1 text-xs font-medium text-emerald-400"
            >
              {photo ? "Change photo" : "Add photo"}
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onPhoto(e.target.files?.[0] || null)}
          />
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
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
          <Link href="/assessment" className="mt-2 inline-block text-sm text-emerald-400">
            Retake assessment →
          </Link>
        </div>
        <div className="bg-white/[0.03] px-5 py-4">
          <p className="text-sm font-medium text-zinc-200">Family</p>
          <Link href="/app/family" className="mt-2 inline-block text-sm text-emerald-400">
            Manage family →
          </Link>
        </div>
        <div className="bg-white/[0.03] px-5 py-4">
          <p className="text-sm font-medium text-zinc-200">Privacy</p>
          <p className="mt-1 text-xs text-zinc-500">
            Answers and vault stay on your device by default.
          </p>
        </div>
      </section>
    </div>
  );
}
