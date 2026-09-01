"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setPremium } from "@/lib/session";
import { setFamilyUnlocked } from "@/lib/family";
import { setSubscriptionOnProfile } from "@/lib/persist";
import Link from "next/link";

function ResultsInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState("Opening your plan…");

  useEffect(() => {
    const payment = params.get("payment");
    const product = params.get("product") || "lifetime";
    const txId =
      params.get("transaction_id") ||
      params.get("transactionId") ||
      params.get("id");

    async function run() {
      if (payment === "flutterwave" && txId) {
        setStatus("Verifying payment…");
        try {
          const res = await fetch(
            `/api/flutterwave/verify?transaction_id=${encodeURIComponent(txId)}`
          );
          const json = await res.json();
          if (json.paid) {
            const p = json.product || product;
            if (p === "family") {
              setFamilyUnlocked(true);
              setPremium(true);
              await setSubscriptionOnProfile("family");
              setStatus("Family plan unlocked. Redirecting…");
            } else {
              setPremium(true);
              setFamilyUnlocked(true);
              await setSubscriptionOnProfile("lifetime");
              setStatus("Lifetime plan unlocked. Redirecting…");
            }
            setTimeout(() => router.replace("/app/overview"), 1200);
            return;
          }
          setStatus("Payment not confirmed. You can retry from Settings.");
          return;
        } catch {
          setStatus("Verification failed. Contact support with your receipt.");
          return;
        }
      }
      router.replace("/app/overview");
    }

    void run();
  }, [params, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 px-4 text-center text-zinc-400">
      <p>{status}</p>
      <Link href="/app/overview" className="text-sm text-emerald-400">
        Continue to app
      </Link>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-500">
          Loading…
        </main>
      }
    >
      <ResultsInner />
    </Suspense>
  );
}
