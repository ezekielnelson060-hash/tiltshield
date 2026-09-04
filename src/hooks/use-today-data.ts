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

function cleanTitle(s: string): string {
  if (!s) return "";
  return s
    .replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, " ")
    .replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, " ")
    .replace(/<a\b[^>]*/gi, " ")
    .replace(/<\/?[a-zA-Z][^>]*>/g, " ")
    .replace(/<[^>]*/g, " ")
    .replace(/\bhref\s*=\s*["'][^"']*/gi, " ")
    .replace(/\bhref\s*=/gi, " ")
    .replace(/[<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

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
          // Mix of essentials — not pharmacy-only
          void (async () => {
            try {
              const batches = await Promise.all([
                searchNearbyPlaces("pharmacy", c, { limit: 4 }),
                searchNearbyPlaces("supermarket", c, { limit: 3 }),
                searchNearbyPlaces("ATM", c, { limit: 2 }),
              ]);
              const seen = new Set<string>();
              const merged: NearbyPlace[] = [];
              for (const batch of batches) {
                for (const p of batch) {
                  if (seen.has(p.id)) continue;
                  seen.add(p.id);
                  merged.push(p);
                }
              }
              merged.sort(
                (a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999)
              );
              setPlaces(merged.slice(0, 8));
            } catch {
              setPlaces([]);
            }
          })();
          void reverseGeocode(c.lat, c.lng).then((p) => {
            if (p) setPlaceLabel(p.label);
          });
        },
        () => {
          // No location — do not dump national/world places
          setPlaces([]);
        },
        { timeout: 10000, enableHighAccuracy: false, maximumAge: 60000 }
      );
    }
    void (async () => {
      try {
        const res = await fetch("/api/intel/live");
        if (!res.ok) return;
        const data = await res.json();
        const list: TodayIntel[] = (data.headlines || data.items || [])
          .slice(0, 6)
          .map((h: Record<string, unknown>, i: number) => ({
            id: String(h.id || `live-${i}`),
            title: cleanTitle(String(h.title || "Update")).slice(0, 120),
            category: h.category ? String(h.category) : undefined,
            url: h.url || h.link ? String(h.url || h.link) : undefined,
            impact: h.impact ? String(h.impact) : undefined,
            relevanceKeys: Array.isArray(h.relevanceKeys)
              ? (h.relevanceKeys as string[])
              : [],
          }))
          .filter((h: TodayIntel) => h.title && h.title.length > 3);
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

  return {
    coords,
    places,
    intel,
    placeLabel,
    daysSince,
    pipeline,
    assessedLabel,
  };
}
