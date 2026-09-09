"use client";

import { useEffect } from "react";
import { hydrateSubscriptionFromProfile } from "@/lib/subscription";

/** Runs in the app shell to restore paid plan from Supabase on every device. */
export function SubscriptionHydrator() {
  useEffect(() => {
    void hydrateSubscriptionFromProfile();
  }, []);
  return null;
}
