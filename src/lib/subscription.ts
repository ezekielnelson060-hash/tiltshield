import { setPremium, unlockFromProduct } from "@/lib/session";
import { setFamilyUnlocked } from "@/lib/family";

export type ProfileSubStatus = "free" | "lifetime" | "family" | "active" | "pro";

/** Map checkout product → profile subscription_status */
export function profileStatusFromProduct(product: string): ProfileSubStatus {
  const p = product.toLowerCase();
  if (p.includes("family")) return "family";
  if (p.includes("lifetime") || p.includes("founding")) return "lifetime";
  if (p.includes("pro") || p.includes("monthly") || p.includes("annual"))
    return "active";
  return "active";
}

/** Persist paid plan status on the user profile (Supabase). */
export async function setSubscriptionOnProfile(
  status: ProfileSubStatus | "lifetime" | "family" | "active"
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
        {
          id: user.id,
          subscription_status: status,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
  } catch {
    /* offline or unauthenticated */
  }
}

/** After checkout: local unlock + cloud profile when signed in. */
export async function unlockAndSync(product: string): Promise<void> {
  unlockFromProduct(product);
  const status = profileStatusFromProduct(product);
  await setSubscriptionOnProfile(status);
}

/** On app open / login: pull subscription_status from profile and unlock local flags. */
export async function hydrateSubscriptionFromProfile(): Promise<
  ProfileSubStatus | null
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
      try {
        localStorage.setItem("tiltshield_premium_tier", "family");
      } catch {
        /* */
      }
      return "family";
    }
    if (status === "lifetime" || status === "active" || status === "pro") {
      setPremium(true);
      try {
        localStorage.setItem("tiltshield_premium_tier", "pro");
      } catch {
        /* */
      }
      return status === "lifetime" ? "lifetime" : "active";
    }
    return "free";
  } catch {
    return null;
  }
}

export async function getAuthUser(): Promise<{
  id: string;
  email?: string;
} | null> {
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
    return { id: user.id, email: user.email };
  } catch {
    return null;
  }
}

export async function signOut(): Promise<void> {
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch {
    /* */
  }
}
