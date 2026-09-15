"use client";

import { useCallback, useEffect, useState } from "react";
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

const COORDS_KEY = "tiltshield_last_coords";
const LABEL_KEY = "tiltshield_last_place_label";

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

function readCachedCoords(): { lat: number; lng: number } | null {
  try {
    const raw = localStorage.getItem(COORDS_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as { lat: number; lng: number; at?: number };
    if (!Number.isFinite(o.lat) || !Number.isFinite(o.lng)) return null;
    if (o.at && Date.now() - o.at > 7 * 24 * 60 * 60 * 1000) return null;
    return { lat: o.lat, lng: o.lng };
  } catch {
    return null;
  }
}

function writeCachedCoords(c: { lat: number; lng: number }) {
  try {
    localStorage.setItem(
      COORDS_KEY,
      JSON.stringify({ ...c, at: Date.now() })
    );
  } catch {
    /* */
  }
}

function readCachedLabel(): string | null {
  try {
    return localStorage.getItem(LABEL_KEY);
  } catch {
    return null;
  }
}

function writeCachedLabel(label: string) {
  try {
    localStorage.setItem(LABEL_KEY, label);
  } catch {
    /* */
  }
}

async function loadPlacesNear(c: { lat: number; lng: number }) {
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
  merged.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
  return merged.slice(0, 8);
}

export function useTodayData() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [intel, setIntel] = useState<TodayIntel[]>([]);
  const [placeLabel, setPlaceLabel] = useState<string | null>(null);
  const [daysSince, setDaysSince] = useState<number | null>(null);
  const [pipeline, setPipeline] = useState<PipelineLink[]>([]);
  const [locStatus, setLocStatus] = useState<
    "idle" | "locating" | "ready" | "denied" | "error"
  >("idle");

  const applyCoords = useCallback(async (c: { lat: number; lng: number }) => {
    setCoords(c);
    writeCachedCoords(c);
    setLocStatus("ready");
    try {
      const merged = await loadPlacesNear(c);
      setPlaces(merged);
    } catch {
      setPlaces([]);
    }
    try {
      const p = await reverseGeocode(c.lat, c.lng);
      if (p?.label) {
        setPlaceLabel(p.label);
        writeCachedLabel(p.label);
      }
    } catch {
      /* keep cached label */
    }
  }, []);

  const requestLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocStatus("error");
      return;
    }
    setLocStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void applyCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        if (err.code === 1) setLocStatus("denied");
        else setLocStatus("error");
      },
      { timeout: 20000, enableHighAccuracy: true, maximumAge: 60_000 }
    );
  }, [applyCoords]);

  useEffect(() => {
    setDaysSince(daysSinceLastAssessment());

    const cached = readCachedCoords();
    const cachedLabel = readCachedLabel();
    if (cachedLabel) setPlaceLabel(cachedLabel);
    if (cached) {
      setCoords(cached);
      setLocStatus("ready");
      void loadPlacesNear(cached)
        .then(setPlaces)
        .catch(() => setPlaces([]));
    }

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      setLocStatus((s) => (s === "idle" ? "locating" : s));
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          void applyCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          setLocStatus((s) => (s === "ready" ? s : "denied"));
        },
        { timeout: 20000, enableHighAccuracy: true, maximumAge: 60_000 }
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
  }, [applyCoords]);

  return {
    coords,
    places,
    intel,
    placeLabel,
    daysSince,
    pipeline,
    assessedLabel,
    locStatus,
    requestLocation,
  };
}
