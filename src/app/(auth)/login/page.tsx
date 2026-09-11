"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { hydrateSubscriptionFromProfile } from "@/lib/subscription";
import { loadSession } from "@/lib/session";
import { loadLatestAssessmentFromCloud } from "@/lib/persist";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/app/overview";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (err) {
        setError(err.message);
        return;
      }
      await hydrateSubscriptionFromProfile();
      if (!loadSession()) {
        await loadLatestAssessmentFromCloud();
      }
      router.push(next.startsWith("/") ? next : "/app/overview");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link href="/" className="text-sm font-semibold text-zinc-50">
            Tiltshield
          </Link>
          <h1 className="mt-4 text-2xl font-semibold text-zinc-50">Log in</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Restore Pro and your assessment on any device.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-zinc-500">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-50 focus:border-emerald-500 focus:outline-none"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-50 focus:border-emerald-500 focus:outline-none"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Log in"}
          </Button>
        </form>

        <p className="text-center text-sm text-zinc-500">
          No account?{" "}
          <Link href="/signup" className="text-emerald-400 hover:underline">
            Sign up
          </Link>
        </p>
        <p className="text-center text-xs text-zinc-600">
          <Link href="/assessment" className="hover:text-zinc-400">
            Or continue without an account →
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-500">
          Loading…
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
