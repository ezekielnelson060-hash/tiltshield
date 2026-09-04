"use client";

import { useEffect, useState } from "react";
import { loadSession, daysSinceLastAssessment } from "@/lib/session";
import { searchNearbyPlaces, type NearbyPlace } from "@/lib/nearby";
import { reverseGeocode, assessedLabel } from "@/lib/place";
import { buildExposurePipeline, type PipelineLink } from "@/lib/pipeline";
import type { IntelItem } from "@/lib/intel";

export type TodayIntel = {
  id?: string;
  title: string;
  category?: string;
  url?: string;
  impact?: string;
  relevanceKeys?: string[];
};

export function useTodayData() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [intel, setIntel] = useState<TodayIntel[]>([]);
  const [placeLabel, setPlaceLabel] = useState<string | null>(null);
  const [daysSince, setDaysSince] = useState<number | null>(null);
  const [pipeline, setPipeline] = useState<PipelineLink[]>([]);

  useEffect(() => {
    setDaysSince(daysSinceLastAssessment());
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCoords(c);
          void searchNearbyPlaces("pharmacy", c, { limit: 6 }).then(setPlaces).catch(() => setPlaces([]));
          void reverseGeocode(c.lat, c.lng).then((p) => {
            if (p) setPlaceLabel(p.label);
          });
        },
        () => {
          void searchNearbyPlaces("pharmacy", null, { national: true, limit: 6 })
            .then(setPlaces)
            .catch(() => setPlaces([]));
        },
        { timeout: 8000 }
      );
    }
    void (async () => {
      try {
        const res = await fetch("/api/intel/live");
        if (!res.ok) return;
        const data = await res.json();
        const list: TodayIntel[] = (data.headlines || data.items || []).slice(0, 6).map(
          (h: Record<string, unknown>, i: number) => ({
            id: String(h.id || `live-${i}`),
            title: String(h.title || "Update").slice(0, 120),
            category: h.category ? String(h.category) : undefined,
            url: h.url || h.link ? String(h.url || h.link) : undefined,
            impact: h.impact ? String(h.impact) : undefined,
            relevanceKeys: Array.isArray(h.relevanceKeys)
              ? (h.relevanceKeys as string[])
              : [],
          })
        );
        setIntel(list);
        const s = loadSession();
        if (s && list.length) {
          const asIntel: IntelItem[] = list.map((h, i) => ({
            id: h.id || `live-${i}`,
            scope: "global",
            title: h.title,
            summary: "",
            category: h.category || "Watch",
            impact: (h.impact as "low" | "medium" | "high") || "medium",
            hoursAgo: 2 + i,
            relevanceKeys: h.relevanceKeys || [],
          }));
          setPipeline(
            buildExposurePipeline({
              intel: asIntel,
              scores: s.scores,
              answers: s.answers,
            }).slice(0, 3)
          );
        }
      } catch {
        setIntel([]);
      }
    })();
  }, []);

  return { coords, places, intel, placeLabel, daysSince, pipeline, assessedLabel };
}
