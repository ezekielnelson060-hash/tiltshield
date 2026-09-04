"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PRODUCT_ITEMS = [
  {
    href: "/app/overview",
    title: "Overview",
    desc: "Your personal resilience command center",
  },
  {
    href: "/app/risk",
    title: "My Risk",
    desc: "See where you're exposed",
  },
  {
    href: "/app/what-if",
    title: "What If?",
    desc: "Stress-test your life against scenarios",
  },
  {
    href: "/app/prepare",
    title: "Actions",
    desc: "Know exactly what to fix next",
  },
  {
    href: "/app/history",
    title: "History",
    desc: "Track your resilience over time",
  },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="text-sm font-semibold tracking-tight text-zinc-50">
          Tiltshield
        </Link>

        <nav className="hidden items-center gap-1 text-sm text-zinc-400 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg px-3 py-2 hover:text-zinc-100"
              onClick={() => setOpen((v) => !v)}
            >
              Product
              <span className="text-[10px] opacity-70">▾</span>
            </button>
            {open && (
              <div className="absolute left-0 top-full z-50 w-80 rounded-2xl border border-zinc-800 bg-zinc-950 p-3 shadow-2xl shadow-black/50">
                <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  Product
                </p>
                {PRODUCT_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-xl px-3 py-2.5 transition hover:bg-white/[0.04]"
                    onClick={() => setOpen(false)}
                  >
                    <p className="text-sm font-medium text-zinc-100">{item.title}</p>
                    <p className="text-xs text-zinc-500">{item.desc}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <a href="#what-if" className="rounded-lg px-3 py-2 hover:text-zinc-100">
            What If?
          </a>
          <a href="#how" className="rounded-lg px-3 py-2 hover:text-zinc-100">
            How it works
          </a>
          <a href="#pricing" className="rounded-lg px-3 py-2 hover:text-zinc-100">
            Pricing
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="rounded-lg px-2 py-1.5 text-sm text-zinc-400 hover:text-zinc-100 lg:hidden"
            onClick={() => setMobile((v) => !v)}
          >
            Menu
          </button>
          <Link
            href="/login"
            className="hidden text-sm text-zinc-400 hover:text-zinc-100 sm:inline"
          >
            Log in
          </Link>
          <Button asChild size="sm" className="shadow-lg shadow-emerald-900/20">
            <Link href="/assessment">Get my score →</Link>
          </Button>
        </div>
      </div>

      {mobile && (
        <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-3 lg:hidden">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Product
          </p>
          {PRODUCT_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2 text-sm text-zinc-300"
              onClick={() => setMobile(false)}
            >
              {item.title}
            </Link>
          ))}
          <div className="mt-2 space-y-1 border-t border-zinc-800 pt-2">
            <a href="#what-if" className="block py-2 text-sm text-zinc-300">What If?</a>
            <a href="#how" className="block py-2 text-sm text-zinc-300">How it works</a>
            <a href="#pricing" className="block py-2 text-sm text-zinc-300">Pricing</a>
            <Link href="/login" className="block py-2 text-sm text-zinc-300">Log in</Link>
          </div>
        </div>
      )}
    </header>
  );
}
