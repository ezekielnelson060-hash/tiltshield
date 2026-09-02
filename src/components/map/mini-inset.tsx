"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = { className?: string };

/** Compact map for Today — OpenStreetMap tiles (no API key). */
export function MiniMapInset({ className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "denied">("loading");

  useEffect(() => {
    let map: import("leaflet").Map | null = null;
    let cancelled = false;

    async function boot(lat: number, lng: number) {
      if (!ref.current || cancelled) return;
      const L = (await import("leaflet")).default;
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
      map = L.map(ref.current, {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
      }).setView([lat, lng], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OSM",
      }).addTo(map);

      const icon = L.divIcon({
        className: "",
        html: `<div style="width:14px;height:14px;border-radius:999px;background:#34d399;border:2px solid #0a1018;box-shadow:0 0 12px rgba(52,211,153,.6)"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });
      L.marker([lat, lng], { icon }).addTo(map);
      setStatus("ready");
      setTimeout(() => map?.invalidateSize(), 80);
    }

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => void boot(pos.coords.latitude, pos.coords.longitude),
        () => {
          void boot(20, 0);
          setStatus("denied");
        },
        { timeout: 8000 }
      );
    } else {
      void boot(20, 0);
      setStatus("denied");
    }

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, []);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080d16]",
        className
      )}
    >
      <div ref={ref} className="h-[140px] w-full" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#060a12] via-[#060a12]/70 to-transparent p-3 pt-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Your area
        </p>
        <p className="text-xs text-zinc-400">
          {status === "loading"
            ? "Locating…"
            : status === "denied"
              ? "Enable location for pins near you"
              : "Pharmacy · grocery · cash access"}
        </p>
      </div>
      <Link
        href="/app/nearby"
        className="absolute right-2 top-2 rounded-lg border border-white/10 bg-[#0a1018]/90 px-2 py-1 text-[10px] font-semibold text-emerald-400 backdrop-blur"
      >
        Open map →
      </Link>
    </div>
  );
}
