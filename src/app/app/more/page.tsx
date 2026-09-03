"use client";

import Link from "next/link";
import { isPremium } from "@/lib/session";
import { useEffect, useState } from "react";
import { getActiveMember } from "@/lib/family";
import { PageHeader } from "@/components/app/page-header";
import { GlassCard } from "@/components/app/glass-card";
import {
  IconPin,
  IconCommunity,
  IconShield,
  IconWallet,
  IconDigital,
  IconHouse,
  IconTarget,
} from "@/components/app/icons";

const LINKS = [
  { href: "/app/nearby", label: "Nearby", desc: "What do you need? Map + places", Icon: IconPin },
  { href: "/app/network", label: "Your network", desc: "Trusted places you saved", Icon: IconCommunity },
  { href: "/app/family", label: "Household", desc: "Family scores & emergency plan", Icon: IconCommunity },
  { href: "/app/history", label: "Progress", desc: "Score now vs last check", Icon: IconTarget },
  { href: "/app/calculators", label: "Calculators", desc: "Runway, buffer, exposure", Icon: IconWallet },
  { href: "/app/vault", label: "Vault", desc: "Encrypted document storage", Icon: IconShield },
  { href: "/app/guides", label: "Guides", desc: "Simple year prep cards", Icon: IconHouse },
  { href: "/app/offline-value", label: "Offline value", desc: "Cash, metals, hardware paths", Icon: IconWallet },
  { href: "/app/settings", label: "Settings", desc: "Profile, plan, privacy", Icon: IconDigital },
];

export default function MorePage() {
  const [name, setName] = useState("You");
  const [premium, setPrem] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    try {
      const n =
        localStorage.getItem("tiltshield_display_name") ||
        getActiveMember().name;
      setName(n);
      setPhoto(localStorage.getItem("tiltshield_profile_photo"));
    } catch {
      /* */
    }
    setPrem(isPremium());
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => r.update());
      });
      if ("caches" in window) {
        caches.keys().then((keys) => {
          keys
            .filter((k) => k.startsWith("tiltshield-app-") && k !== "tiltshield-app-v4")
            .forEach((k) => caches.delete(k));
        });
      }
    }
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <PageHeader
        title="More"
        subtitle={`${name}${premium ? " · Premium" : " · Free plan"}`}
        backHref="/app/overview"
        showBack
      />

      <GlassCard className="flex items-center gap-4">
        <span className="flex h-14 w-14 overflow-hidden items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/30 to-teal-600/20 text-lg font-bold text-emerald-300 ring-2 ring-emerald-500/20">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" className="h-full w-full object-cover" />
          ) : (
            name.slice(0, 1).toUpperCase()
          )}
        </span>
        <div>
          <p className="text-sm font-medium text-zinc-100">{name}</p>
          <p className="text-xs text-zinc-500">
            Building toward a safer year at home
          </p>
          <Link href="/app/settings" className="mt-1 inline-block text-xs text-emerald-400">
            Edit profile →
          </Link>
        </div>
      </GlassCard>

      <div className="space-y-2">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 transition hover:border-emerald-500/25"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
              <l.Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-zinc-100">{l.label}</p>
              <p className="mt-0.5 text-xs text-zinc-500">{l.desc}</p>
            </div>
            <span className="text-zinc-600">→</span>
          </Link>
        ))}
      </div>

      <p className="pt-2 text-center text-[10px] text-zinc-600">
        App build · Sep 2026 · cache v4
      </p>
    </div>
  );
}
