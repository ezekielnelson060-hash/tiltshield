"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

const PRODUCT_ITEMS = [
  {
    href: "/assessment",
    title: "Find your exposure",
    desc: "Free score + financial break point",
  },
  {
    href: "/break-point",
    title: "Break Point",
    desc: "Savings measured in days, not dollars",
  },
  {
    href: "/what-if",
    title: "What If?",
    desc: "Stress-test income, bank, phone, food",
  },
  {
    href: "/guides",
    title: "Guides",
    desc: "Calculators and scenario checklists",
  },
  {
    href: "/pricing",
    title: "Pricing",
    desc: "Free · Pro · Family · Founding",
  },
  {
    href: "/app/overview",
    title: "Open app",
    desc: "Today, Prepare, Intel — after assessment",
  },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-zinc-50"
        >
          <BrandLogo className="h-8 w-8 rounded-lg object-cover" />
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
          <Link href="/guides" className="rounded-lg px-3 py-2 hover:text-zinc-100">
            Guides
          </Link>
          <Link href="/pricing" className="rounded-lg px-3 py-2 hover:text-zinc-100">
            Pricing
          </Link>
          <Link href="/login" className="rounded-lg px-3 py-2 hover:text-zinc-100">
            Log in
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/assessment"
            className="hidden rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-zinc-950 sm:inline-flex"
          >
            Find your exposure
          </Link>
          <button
            type="button"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-200 hover:text-zinc-50 lg:hidden"
            onClick={() => setMobile((v) => !v)}
          >
            Menu
            <span className="ml-1 text-[10px] opacity-70">▾</span>
          </button>
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
            <Link
              href="/assessment"
              className="block py-2 text-sm font-semibold text-emerald-400"
              onClick={() => setMobile(false)}
            >
              Find your exposure →
            </Link>
            <Link
              href="/login"
              className="block py-2 text-sm text-zinc-300"
              onClick={() => setMobile(false)}
            >
              Log in
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
