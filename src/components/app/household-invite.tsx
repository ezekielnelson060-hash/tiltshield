"use client";

import { useEffect, useState } from "react";
import { getOrCreateHouseholdCode, setHouseholdCode } from "@/lib/invite";
import { GlassCard } from "@/components/app/glass-card";
import { Button } from "@/components/ui/button";

export function HouseholdInvite() {
  const [code, setCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const local = getOrCreateHouseholdCode();
    setCode(local);
    void (async () => {
      try {
        const res = await fetch("/api/household/code");
        if (res.ok) {
          const json = await res.json();
          if (json.code) {
            setCode(json.code);
            setHouseholdCode(json.code);
          }
        }
      } catch {
        /* keep local */
      }
    })();
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

  async function registerCloud() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/household/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const json = await res.json();
      if (json.code) {
        setCode(json.code);
        setHouseholdCode(json.code);
        setMsg("Code saved to your account.");
      } else {
        setMsg(json.error || "Sign in to publish your code.");
      }
    } catch {
      setMsg("Could not reach server.");
    } finally {
      setBusy(false);
    }
  }

  async function join() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/household/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: joinCode }),
      });
      const json = await res.json();
      if (json.ok) {
        setMsg(
          json.already
            ? "Already on that household."
            : `Joined ${json.ownerName || "household"}.`
        );
        setJoinCode("");
      } else {
        setMsg(json.error || "Join failed.");
      }
    } catch {
      setMsg("Could not join.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <GlassCard>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Your household code
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Share with adults at home. They sign in, enter the code, and join.
        </p>
        <p className="mt-3 text-center text-2xl font-bold tracking-[0.3em] text-emerald-400">
          {code || "······"}
        </p>
        <div className="mt-3 flex gap-2">
          <Button size="sm" className="flex-1" onClick={() => void copy()}>
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            disabled={busy}
            onClick={() => void registerCloud()}
          >
            Publish
          </Button>
        </div>
      </GlassCard>

      <GlassCard>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Join a household
        </p>
        <div className="mt-3 flex gap-2">
          <input
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="CODE"
            maxLength={8}
            className="flex-1 rounded-xl border border-white/10 bg-[#080d16] px-3 py-2 text-center text-sm tracking-widest text-zinc-100"
          />
          <Button
            size="sm"
            disabled={busy || joinCode.length < 4}
            onClick={() => void join()}
          >
            Join
          </Button>
        </div>
        {msg && <p className="mt-2 text-xs text-zinc-400">{msg}</p>}
      </GlassCard>
    </div>
  );
}
