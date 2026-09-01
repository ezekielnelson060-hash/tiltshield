import { createClient } from "@/lib/supabase/client";

/** Persist paid plan status on the user profile (Supabase). */
export async function setSubscriptionOnProfile(
  status: "lifetime" | "family" | "active"
): Promise<void> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("profiles")
      .upsert(
        { id: user.id, subscription_status: status },
        { onConflict: "id" }
      );
  } catch {
    /* offline or unauthenticated — local unlock still applies */
  }
}
