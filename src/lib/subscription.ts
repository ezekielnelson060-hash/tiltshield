import { setPremium } from "@/lib/session";
import { setFamilyUnlocked } from "@/lib/family";

/** Persist paid plan status on the user profile (Supabase). */
export async function setSubscriptionOnProfile(
  status: "lifetime" | "family" | "active"
): Promise<void> {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return;
    }
    const { createClient } = await import("@/lib/supabase/client");
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
    /* offline or unauthenticated */
  }
}

/** On app open: pull subscription_status from profile and unlock local flags. */
export async function hydrateSubscriptionFromProfile(): Promise<
  "free" | "lifetime" | "family" | "active" | null
> {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return null;
    }
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from("profiles")
      .select("subscription_status")
      .eq("id", user.id)
      .maybeSingle();

    const status = String(data?.subscription_status || "free").toLowerCase();

    if (status === "family") {
      setFamilyUnlocked(true);
      setPremium(true);
      return "family";
    }
    if (status === "lifetime" || status === "active") {
      setPremium(true);
      return status === "active" ? "active" : "lifetime";
    }
    return "free";
  } catch {
    return null;
  }
}
