"use client";

import { useEffect } from "react";
import { hydrateSubscriptionFromProfile } from "@/lib/subscription";
import { loadSession } from "@/lib/session";
import {
  loadLatestAssessmentFromCloud,
  syncLocalSessionToCloudIfNeeded,
} from "@/lib/persist";

/**
 * On every app open:
 * - restore paid plan from Supabase
 * - if no local assessment, pull latest from cloud
 * - if local assessment exists and user is signed in, push to cloud
 */
export function SubscriptionHydrator() {
  useEffect(() => {
    void (async () => {
      await hydrateSubscriptionFromProfile();
      const local = loadSession();
      if (!local) {
        await loadLatestAssessmentFromCloud();
      } else {
        await syncLocalSessionToCloudIfNeeded();
      }
    })();
  }, []);
  return null;
}
