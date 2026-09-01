"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { loadSession, type TiltSession } from "@/lib/session";
import { getActiveMember } from "@/lib/family";
import type { CategoryScores } from "@/types";

const NAV = [
  { href: "/app/overview", label: "Today", icon: "home" },
  { href: "/app/prepare", label: "Prepare", icon: "list" },
  { href: "/app/intel", label: "Intel", icon: "shield" },
  { href: "/app/what-if", label: "What If?", icon: "pulse" },
  { href: "/app/nearby", label: "Nearby", icon: "pin" },
  { href: "/app/family", label: "Family", icon: "users" },
];

const MOBILE_NAV = [
  { href: "/app/overview", label: "Today", icon: "home" },
  { href: "/app/prepare", label: "Prepare", icon: "list" },
  { href: "/app/intel", label: "Intel", icon: "shield" },
  { href: "/app/what-if", label: "What If", icon: "pulse" },
  { href: "/app/family", label: "More", icon: "more" },
];

const RESILIENCE_META: {
  key: keyof CategoryScores;
  label: string;
  color: string;
}[] = [
  { key: "money", label: "Money", color: "bg-red-500" },
  { key: "digital", label: "Digital", color: "bg-amber-400" },
  { key: "food", label: "Essentials", color: "bg-emerald-400" },
  { key: "home", label: "Home", color: "bg-lime-400" },
  { key: "communication", label: "Mobility", color: "bg-cyan-400" },
  { key: "skills", label: "Health", color: "bg-teal-400" },
  { key: "documents", label: "Community", color: "bg-violet-400" },
  { key: "emergency", label: "Emergency", color: "bg-orange-400" },
];

function NavIcon({ name, className }: { name: string; className?: string }) {
  const c = cn("h-4 w-4", className);
  switch (name) {
    case "home":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z" />
        </svg>
      );
    case "list":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01" />
        </svg>
      );
    case "shield":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 4 6v5c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-3z" />
        </svg>
      );
    case "pulse":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3l2-5 4 10 2-5h5" />
        </svg>
      );
    case "pin":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case "users":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    default:
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <circle cx="6" cy="12" r="1.5" fill="currentColor" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <circle cx="18" cy="12" r="1.5" fill="currentColor" />
        </svg>
      );
  }
}

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
      <div className="flex min-h-screen items-center justify-center bg-[#060a12] text-zinc-500">
        Loading…
      </div>
    );
  }

  const scores = session.scores;

  return (
    <div className="flex min-h-screen bg-[#060a12] text-zinc-100">
      <aside className="hidden w-[240px] shrink-0 flex-col border-r border-white/[0.06] bg-[#080d16] lg:flex">
        <div className="px-5 py-5">
          <Link href="/app/overview" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/20 to-teal-500/10 ring-1 ring-emerald-500/30">
              <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 4 6v5c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-3z" />
              </svg>
            </span>
            <div>
              <p className="text-[13px] font-bold tracking-wide text-zinc-50">TILTSHIELD</p>
              <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                Personal Resilience Intelligence
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition",
                  active
                    ? "bg-emerald-500/15 font-semibold text-emerald-400 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)]"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                )}
              >
                <NavIcon
                  name={item.icon}
                  className={active ? "text-emerald-400" : "text-zinc-500"}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-2 px-4 pb-2">
          <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
            My Resilience
          </p>
          <div className="space-y-0.5">
            {RESILIENCE_META.map((m) => {
              const val = Number(scores[m.key] ?? 0);
              return (
                <Link
                  key={m.key}
                  href={`/app/risk?cat=${m.key}`}
                  className="flex items-center justify-between rounded-lg px-2 py-1.5 text-xs transition hover:bg-white/[0.04]"
                >
                  <span className="flex items-center gap-2 text-zinc-400">
                    <span className={cn("h-1.5 w-1.5 rounded-full", m.color)} />
                    {m.label}
                  </span>
                  <span className="tabular-nums text-zinc-300">{val}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-auto space-y-3 border-t border-white/[0.06] p-4">
          <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent p-3.5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              Resilience Score
            </p>
            <div className="mt-1 flex items-end gap-1">
              <span className="text-2xl font-bold tabular-nums text-zinc-50">
                {scores.overall}
              </span>
              <span className="mb-0.5 text-sm text-zinc-600">/ 100</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                style={{ width: `${Math.min(100, scores.overall)}%` }}
              />
            </div>
          </div>

          <Link
            href="/app/settings"
            className="flex items-center gap-3 rounded-xl px-1 py-1.5 hover:bg-white/[0.03]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/30 to-teal-600/20 text-xs font-bold text-emerald-300 ring-1 ring-emerald-500/20">
              {memberName.slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-200">{memberName}</p>
              <p className="text-[10px] text-zinc-500">Settings</p>
            </div>
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 overflow-y-auto pb-24 lg:pb-10">{children}</main>

        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.06] bg-[#080d16]/95 backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-lg items-stretch justify-around px-1 pb-[env(safe-area-inset-bottom)]">
            {MOBILE_NAV.map((item) => {
              const active =
                item.href === "/app/family"
                  ? pathname === item.href ||
                    pathname?.startsWith("/app/nearby") ||
                    pathname?.startsWith("/app/settings") ||
                    pathname?.startsWith("/app/family")
                  : pathname === item.href ||
                    pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium",
                    active ? "text-emerald-400" : "text-zinc-500"
                  )}
                >
                  <NavIcon name={item.icon} className="h-[18px] w-[18px]" />
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
