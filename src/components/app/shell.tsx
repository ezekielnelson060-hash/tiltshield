"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  loadSession,
  type TiltSession,
} from "@/lib/session";
import { getActiveMember } from "@/lib/family";
import type { CategoryScores } from "@/types";

const NAV = [
  { href: "/app/overview", label: "Today", icon: "⌂" },
  { href: "/app/prepare", label: "Prepare", icon: "☑" },
  { href: "/app/intel", label: "Intel", icon: "🛡" },
  { href: "/app/what-if", label: "What If?", icon: "◎" },
  { href: "/app/nearby", label: "Nearby", icon: "⌖" },
  { href: "/app/family", label: "Family", icon: "⌂" },
];

const MOBILE_NAV = [
  { href: "/app/overview", label: "Today", icon: "⌂" },
  { href: "/app/prepare", label: "Prepare", icon: "☑" },
  { href: "/app/intel", label: "Intel", icon: "🛡" },
  { href: "/app/what-if", label: "What If", icon: "◎" },
  { href: "/app/nearby", label: "More", icon: "⋯" },
];

const RESILIENCE_META: {
  key: keyof CategoryScores;
  label: string;
  color: string;
}[] = [
  { key: "money", label: "Money", color: "text-red-400" },
  { key: "digital", label: "Digital", color: "text-amber-400" },
  { key: "food", label: "Essentials", color: "text-emerald-400" },
  { key: "home", label: "Home", color: "text-lime-400" },
  { key: "communication", label: "Mobility", color: "text-cyan-400" },
  { key: "skills", label: "Health", color: "text-teal-400" },
  { key: "documents", label: "Community", color: "text-violet-400" },
  { key: "emergency", label: "Emergency", color: "text-orange-400" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<TiltSession | null>(null);
  const [memberName, setMemberName] = useState("You");

  useEffect(() => {
    function load() {
      const s = loadSession();
      if (!s) {
        router.replace("/assessment");
        return;
      }
      setSession(s);
      try {
        setMemberName(getActiveMember().name);
      } catch {
        /* */
      }
    }
    load();
    const onMember = () => load();
    window.addEventListener("tiltshield:member-change", onMember);
    return () =>
      window.removeEventListener("tiltshield:member-change", onMember);
  }, [router, pathname]);

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b12] text-zinc-500">
        Loading…
      </div>
    );
  }

  const scores = session.scores;

  return (
    <div className="flex min-h-screen bg-[#070b12] text-zinc-100">
      <aside className="hidden w-[220px] shrink-0 flex-col border-r border-white/[0.06] bg-[#0a0f18] lg:flex">
        <div className="px-5 py-5">
          <Link href="/app/overview" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-sm text-emerald-400">
              ◆
            </span>
            <div>
              <p className="text-sm font-semibold tracking-tight text-zinc-50">
                TILTSHIELD
              </p>
              <p className="text-[9px] uppercase tracking-[0.14em] text-zinc-600">
                Resilience Intelligence
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-0.5 px-3">
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-emerald-500/15 font-medium text-emerald-400"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                )}
              >
                <span className="w-4 text-center text-xs opacity-70">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 pb-2">
          <p className="mb-2 px-1 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
            My Resilience
          </p>
          <div className="space-y-0.5">
            {RESILIENCE_META.map((m) => (
              <Link
                key={m.key}
                href={`/app/risk?cat=${m.key}`}
                className="flex items-center justify-between rounded-lg px-2 py-1.5 text-xs text-zinc-500 transition hover:bg-white/[0.03] hover:text-zinc-300"
              >
                <span className="flex items-center gap-2">
                  <span className={cn("text-[10px]", m.color)}>●</span>
                  {m.label}
                </span>
                <span className="tabular-nums text-zinc-400">{scores[m.key]}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-auto border-t border-white/[0.06] p-4">
          <div className="mb-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <p className="text-[10px] uppercase tracking-wider text-zinc-600">
              Resilience Score
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-zinc-50">
              {scores.overall}
              <span className="text-sm font-normal text-zinc-600"> / 100</span>
            </p>
          </div>
          <Link
            href="/app/settings"
            className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-white/[0.03]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-semibold text-emerald-400">
              {memberName.slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-200">
                {memberName}
              </p>
              <p className="text-[10px] text-zinc-600">Settings</p>
            </div>
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 overflow-y-auto pb-24 lg:pb-8">{children}</main>

        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.06] bg-[#0a0f18]/95 backdrop-blur-lg lg:hidden">
          <div className="mx-auto flex max-w-lg items-stretch justify-around px-1 pb-[env(safe-area-inset-bottom)]">
            {MOBILE_NAV.map((item) => {
              const active =
                item.href === "/app/nearby"
                  ? pathname === item.href ||
                    pathname?.startsWith("/app/family") ||
                    pathname?.startsWith("/app/settings")
                  : pathname === item.href ||
                    pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px]",
                    active ? "text-emerald-400" : "text-zinc-500"
                  )}
                >
                  <span className="text-base leading-none">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
