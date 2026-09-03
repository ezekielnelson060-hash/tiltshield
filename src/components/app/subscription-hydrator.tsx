"use client";

import { useEffect } from "react";
import { hydrateSubscriptionFromProfile } from "@/lib/subscription";

/** Runs once in the app shell to restore paid plan from Supabase. */
export function SubscriptionHydrator() {
  useEffect(() => {
    void hydrateSubscriptionFromProfile();
  }, []);
  return null;
}
