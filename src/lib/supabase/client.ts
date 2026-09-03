import { createBrowserClient } from "@supabase/ssr";

/** Safe browser client — never throws if env is missing. */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!url || !key) {
    // Return a minimal stub shape so callers can no-op instead of crashing
    return createBrowserClient(
      url || "https://placeholder.supabase.co",
      key || "public-anon-key"
    );
  }
  return createBrowserClient(url, key);
}
