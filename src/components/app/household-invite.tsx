"use client";

import { useEffect, useState } from "react";
import { getOrCreateHouseholdCode } from "@/lib/invite";
import { GlassCard } from "@/components/app/glass-card";
import { Button } from "@/components/ui/button";

/** Shareable code for household (same account / future join API). */
export function HouseholdInvite() {
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCode(getOrCreateHouseholdCode());
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* */
    }
  }

  return (
    <GlassCard>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        Household code
      </p>
      <p className="mt-1 text-xs text-zinc-500">
        Share with adults in your home so they can open the same household on
        their device (join flow expands with cloud invite next).
      </p>
      <p className="mt-3 text-center text-2xl font-bold tracking-[0.3em] text-emerald-400">
        {code || "······"}
      </p>
      <Button size="sm" className="mt-3 w-full" onClick={() => void copy()}>
        {copied ? "Copied" : "Copy code"}
      </Button>
    </GlassCard>
  );
}
