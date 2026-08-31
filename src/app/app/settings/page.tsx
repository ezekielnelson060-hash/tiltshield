"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isPremium, setPremium } from "@/lib/session";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [premium, setPrem] = useState(false);

  useEffect(() => {
    setPrem(isPremium());
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">Settings</h1>
      </div>

      <section className="space-y-1 overflow-hidden rounded-2xl border border-zinc-800 divide-y divide-zinc-800">
        <div className="bg-zinc-900/40 px-5 py-4">
          <p className="text-sm font-medium text-zinc-200">Subscription</p>
          <p className="mt-1 text-xs text-zinc-500">
            {premium
              ? "Lifetime access — full plan unlocked"
              : "Free tier — upgrade for full vulnerabilities & scenarios"}
          </p>
          {!premium && (
            <Button
              className="mt-3"
              size="sm"
              onClick={() => {
                setPremium(true);
                setPrem(true);
              }}
            >
              Unlock $29 lifetime
            </Button>
          )}
        </div>
        <div className="bg-zinc-900/40 px-5 py-4">
          <p className="text-sm font-medium text-zinc-200">Assessment data</p>
          <p className="mt-1 text-xs text-zinc-500">
            Stored on this device. Retake anytime to refresh your plan.
          </p>
          <Link
            href="/assessment"
            className="mt-2 inline-block text-sm text-emerald-400 hover:text-emerald-300"
          >
            Retake assessment →
          </Link>
        </div>
        <div className="bg-zinc-900/40 px-5 py-4">
          <p className="text-sm font-medium text-zinc-200">Privacy</p>
          <p className="mt-1 text-xs text-zinc-500">
            Your answers stay on your device in this MVP. No account required.
          </p>
        </div>
      </section>

      <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300">
        ← Back to website
      </Link>
    </div>
  );
}
