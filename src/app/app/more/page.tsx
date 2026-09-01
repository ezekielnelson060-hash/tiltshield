"use client";

import Link from "next/link";
import { isPremium } from "@/lib/session";
import { useEffect, useState } from "react";
import { getActiveMember } from "@/lib/family";
import { AppTopBar, PageHeader } from "@/components/app/page-header";

const LINKS = [
  { href: "/app/nearby", label: "Nearby", desc: "Map + agent — resources near you" },
  { href: "/app/family", label: "Family", desc: "Household profiles & readiness" },
  { href: "/app/history", label: "History", desc: "Score trend over time" },
  { href: "/app/calculators", label: "Calculators", desc: "Runway, buffer, exposure" },
  { href: "/app/vault", label: "Vault", desc: "Encrypted document storage" },
  { href: "/app/guides", label: "Guides", desc: "How to prepare" },
  { href: "/app/settings", label: "Settings", desc: "Profile, plan, privacy" },
];

export default function MorePage() {
  const [name, setName] = useState("You");
  const [premium, setPrem] = useState(false);

  useEffect(() => {
    try {
      const n =
        localStorage.getItem("tiltshield_display_name") ||
        getActiveMember().name;
      setName(n);
    } catch {
      /* */
    }
    setPrem(isPremium());
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <AppTopBar title="More" backHref="/app/overview" />
      <p className="-mt-3 text-sm text-zinc-500">
        {name}
        {premium ? " · Premium" : " · Free plan"}
      </p>

      <div className="overflow-hidden rounded-2xl border border-white/[0.08] divide-y divide-white/[0.06]">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex items-center justify-between gap-3 bg-white/[0.02] px-4 py-4 transition hover:bg-white/[0.04]"
          >
            <div>
              <p className="text-sm font-medium text-zinc-100">{l.label}</p>
              <p className="mt-0.5 text-xs text-zinc-500">{l.desc}</p>
            </div>
            <span className="text-zinc-600">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
