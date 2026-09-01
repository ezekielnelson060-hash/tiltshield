"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  loadSession,
  categoryStatus,
  CATEGORY_LABELS,
  type TiltSession,
} from "@/lib/session";
import { getActiveMember } from "@/lib/family";
import { resilienceLabel } from "@/lib/locale";
import type { CategoryScores } from "@/types";

const NAV = [
  { href: "/app/overview", label: "Today" },
  { href: "/app/prepare", label: "Prepare" },
  { href: "/app/intel", label: "Intel" },
  { href: "/app/what-if", label: "What If?" },
  { href: "/app/nearby", label: "Nearby" },
  { href: "/app/family", label: "Family" },
];

const MOBILE_NAV = [
  { href: "/app/overview", label: "Today" },
  { href: "/app/prepare", label: "Prepare" },
  { href: "/app/intel", label: "Intel" },
  { href: "/app/what-if", label: "What If" },
  { href: "/app/nearby", label: "Nearby" },
];

const RESILIENCE_KEYS: (keyof CategoryScores)[] = [
  "money",
  "digital",
  "food",
  "documents",
  "communication",
  "home",
  "skills",
  "emergency",
];

function StatusDot({ score }: { score: number }) {
  const s = categoryStatus(score);
  return (
    <span
      className={cn(
        "inline-block h-1.5 w-1.5 rounded-full",
        s === "healthy" && "bg-emerald-500",
        s === "attention" && "bg-amber-400",
        s === "critical" && "bg-red-500"
      )}
    />
  );
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
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-500">
        Loading…
      </div>
    );
  }

  const scores = session.scores;
  const label = resilienceLabel(scores.overall);

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-zinc-900 bg-zinc-950 lg:flex">
        <div className="border-b border-zinc-900 px-4 py-4">
          <Link
            href="/app/overview"
            className="text-sm font-semibold tracking-tight text-zinc-50"
          >
            Tiltshield
          </Link>
          <p className="mt-0.5 text-[10px] uppercase tracking-wider text-zinc-600">
            Personal Resilience Intelligence
          </p>
          <p className="mt-2 text-xs text-zinc-500">{memberName}</p>
        </div>
        <nav className="flex-1 space-y-0.5 p-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm transition",
                pathname === item.href || pathname?.startsWith(item.href + "/")
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-zinc-900 p-3">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
            My resilience
          </p>
          <div className="space-y-1.5">
            {RESILIENCE_KEYS.map((key) => (
              <Link
                key={key}
                href={`/app/risk?cat=${key}`}
                className="flex items-center justify-between text-xs text-zinc-500 hover:text-zinc-300"
              >
                <span className="flex items-center gap-2">
                  <StatusDot score={scores[key]} />
                  {CATEGORY_LABELS[key]}
                </span>
                <span className="tabular-nums">{scores[key]}</span>
              </Link>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-zinc-800 px-3 py-2">
            <p className="text-[10px] text-zinc-600">Resilience score</p>
            <p className="text-lg font-semibold text-zinc-50">
              {scores.overall}
              <span className="text-sm text-zinc-600"> / 100</span>
            </p>
            <p className="text-[10px] text-emerald-500/80">{label}</p>
          </div>
          <Link
            href="/app/settings"
            className="mt-3 block text-xs text-zinc-600 hover:text-zinc-400"
          >
            Settings
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 items-center justify-between border-b border-zinc-900 px-4 lg:px-8">
          <p className="text-xs text-zinc-500 lg:hidden">
            Tiltshield · {memberName}
          </p>
          <p className="hidden text-xs text-zinc-500 lg:block">
            {memberName} · {scores.overall}/100 · {label}
          </p>
          <div className="flex items-center gap-3 text-xs">
            <Link href="/app/family" className="text-zinc-500 hover:text-zinc-300">
              Household
            </Link>
            <Link
              href="/assessment"
              className="text-emerald-500 hover:text-emerald-400"
            >
              Re-assess
            </Link>
          </div>
        </header>
        <main className="flex-1 pb-20 lg:pb-0">{children}</main>
        <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-zinc-900 bg-zinc-950/95 backdrop-blur lg:hidden">
          {MOBILE_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 py-3 text-center text-[11px]",
                pathname === item.href || pathname?.startsWith(item.href + "/")
                  ? "text-emerald-400"
                  : "text-zinc-500"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
