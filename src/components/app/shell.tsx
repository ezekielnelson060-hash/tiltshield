"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { loadSession, categoryStatus, CATEGORY_LABELS, type TiltSession } from "@/lib/session";
import type { CategoryScores } from "@/types";

const NAV = [
  { href: "/app/overview", label: "Overview", icon: "\u25c9" },
  { href: "/app/risk", label: "My Risk", icon: "\u25c7" },
  { href: "/app/what-if", label: "What If?", icon: "\u25c7" },
  { href: "/app/actions", label: "Actions", icon: "\u25c7" },
  { href: "/app/history", label: "History", icon: "\u25c7" },
];

const MOBILE_NAV = [
  { href: "/app/overview", label: "Home" },
  { href: "/app/risk", label: "Risk" },
  { href: "/app/what-if", label: "What If" },
  { href: "/app/actions", label: "Actions" },
  { href: "/app/history", label: "More" },
];

const RESILIENCE_KEYS: (keyof CategoryScores)[] = [
  "money", "digital", "food", "documents", "communication", "home", "skills", "emergency",
];

function StatusDot({ score }: { score: number }) {
  const s = categoryStatus(score);
  return (
    <span
      className={cn(
        "inline-block h-1.5 w-1.5 rounded-full",
        s === "healthy" && "bg-emerald-500",
        s === "attention" && "bg-amber-500",
        s === "critical" && "bg-red-500"
      )}
    />
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<TiltSession | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);

  useEffect(() => {
    const s = loadSession();
    if (!s) {
      router.replace("/assessment");
      return;
    }
    setSession(s);
  }, [router]);

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-500">
        Loading…
      </div>
    );
  }

  const scores = session.scores;

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-zinc-900 bg-zinc-950 lg:flex">
        <div className="flex h-14 items-center px-5">
          <Link href="/app/overview" className="text-sm font-semibold tracking-tight">
            Tiltshield
          </Link>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 py-2">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition",
                  active
                    ? "bg-zinc-900 text-zinc-50"
                    : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
                )}
              >
                <span className="text-[10px] opacity-60">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}

          <div className="my-4 border-t border-zinc-900" />

          <p className="px-3 pb-2 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
            Your resilience
          </p>
          <div className="space-y-0.5">
            {RESILIENCE_KEYS.map((key) => {
              const score = scores[key] as number;
              return (
                <Link
                  key={key}
                  href={`/app/risk?cat=${key}`}
                  className="flex items-center justify-between rounded-lg px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"
                >
                  <span className="flex items-center gap-2">
                    <StatusDot score={score} />
                    {CATEGORY_LABELS[key]}
                  </span>
                  <span className="tabular-nums text-zinc-500">{score}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="space-y-0.5 border-t border-zinc-900 p-3">
          <Link
            href="/app/settings"
            className="block rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
          >
            Settings
          </Link>
          <Link
            href="/"
            className="block rounded-lg px-3 py-2 text-sm text-zinc-500 hover:text-zinc-300"
          >
            Sign out
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-900 px-4 lg:px-6">
          <p className="text-sm font-medium text-zinc-300 lg:hidden">Tiltshield</p>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setBellOpen((v) => !v);
                setHelpOpen(false);
                setMenuOpen(false);
              }}
              className="relative rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              aria-label="Notifications"
            >
              <span className="text-sm">\ud83d\udd14</span>
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </button>
            <button
              type="button"
              onClick={() => {
                setHelpOpen((v) => !v);
                setBellOpen(false);
                setMenuOpen(false);
              }}
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              aria-label="Help"
            >
              <span className="text-sm font-medium">?</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen((v) => !v);
                setBellOpen(false);
                setHelpOpen(false);
              }}
              className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs font-medium text-zinc-200 hover:bg-zinc-700"
            >
              TS
            </button>
          </div>
        </header>

        {bellOpen && (
          <div className="absolute right-4 top-14 z-50 w-72 rounded-xl border border-zinc-800 bg-zinc-900 p-3 shadow-xl">
            <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
              Notifications
            </p>
            <div className="space-y-1">
              <div className="rounded-lg px-2 py-2.5 hover:bg-zinc-800/50">
                <p className="text-sm text-zinc-200">Your next move is ready</p>
                <p className="text-xs text-zinc-500">One high-impact action waiting</p>
              </div>
              <div className="rounded-lg px-2 py-2.5 hover:bg-zinc-800/50">
                <p className="text-sm text-zinc-200">Assessment complete</p>
                <p className="text-xs text-zinc-500">Score {scores.overall}/100</p>
              </div>
            </div>
          </div>
        )}
        {helpOpen && (
          <div className="absolute right-4 top-14 z-50 w-72 rounded-xl border border-zinc-800 bg-zinc-900 p-3 shadow-xl">
            <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">Help</p>
            <div className="space-y-1 text-sm text-zinc-300">
              <p className="rounded-lg px-2 py-2 hover:bg-zinc-800/50">How Tiltshield works</p>
              <p className="rounded-lg px-2 py-2 hover:bg-zinc-800/50">Understanding your score</p>
              <p className="rounded-lg px-2 py-2 hover:bg-zinc-800/50">What counts as a vulnerability?</p>
            </div>
          </div>
        )}
        {menuOpen && (
          <div className="absolute right-4 top-14 z-50 w-52 rounded-xl border border-zinc-800 bg-zinc-900 p-2 shadow-xl">
            <p className="px-2 py-1.5 text-xs text-zinc-500">Account</p>
            <Link href="/app/settings" className="block rounded-lg px-2 py-2 text-sm text-zinc-200 hover:bg-zinc-800" onClick={() => setMenuOpen(false)}>Settings</Link>
            <Link href="/assessment" className="block rounded-lg px-2 py-2 text-sm text-zinc-200 hover:bg-zinc-800" onClick={() => setMenuOpen(false)}>Retake assessment</Link>
            <div className="my-1 border-t border-zinc-800" />
            <Link href="/" className="block rounded-lg px-2 py-2 text-sm text-zinc-400 hover:bg-zinc-800">Sign out</Link>
          </div>
        )}

        <main className="flex-1 overflow-y-auto pb-20 lg:pb-8">{children}</main>

        <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-zinc-900 bg-zinc-950/95 backdrop-blur lg:hidden">
          {MOBILE_NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px]",
                  active ? "text-emerald-400" : "text-zinc-500"
                )}
              >
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
