"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { loadSession } from "@/lib/session";
import { syncLocalSessionToCloudIfNeeded } from "@/lib/persist";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const origin =
        typeof window !== "undefined" ? window.location.origin : "https://www.tiltshield.xyz";

      const { data, error: err } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${origin}/login?next=/app/overview`,
        },
      });
      if (err) {
        setError(err.message);
        return;
      }
      if (data.user) {
        await supabase.from("profiles").upsert(
          {
            id: data.user.id,
            display_name: data.user.email,
          },
          { onConflict: "id" }
        );
      }

      if (data.session) {
        await syncLocalSessionToCloudIfNeeded();
        const has = !!loadSession();
        router.push(has ? "/app/overview" : "/assessment");
        router.refresh();
        return;
      }

      const { data: signed, error: signErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (!signErr && signed.session) {
        await syncLocalSessionToCloudIfNeeded();
        const has = !!loadSession();
        router.push(has ? "/app/overview" : "/assessment");
        router.refresh();
        return;
      }

      setMessage(
        "Account created. If you are not signed in yet, open the confirmation email — or turn OFF Confirm email in Supabase → Authentication → Providers → Email so access is instant."
      );
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
          <h1 className="mt-4 text-2xl font-semibold text-zinc-50">Create account</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Save your exposure score — restore it on any device after login
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
            <label className="text-xs text-zinc-500">Password (min 6 characters)</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-50 focus:border-emerald-500 focus:outline-none"
              autoComplete="new-password"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {message && <p className="text-sm text-emerald-400">{message}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating…" : "Sign up"}
          </Button>
        </form>

        <p className="text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
