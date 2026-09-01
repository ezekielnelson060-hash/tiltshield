"use client";

import { useEffect, useState } from "react";
import type { NearbyPlace } from "@/lib/nearby";

type Props = {
  places: NearbyPlace[];
  selected: NearbyPlace | null;
  user?: { lat: number; lng: number } | null;
  onSelect?: (p: NearbyPlace) => void;
  className?: string;
};

export function NearbyMap({
  places,
  selected,
  user,
  onSelect,
  className,
}: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let map: import("leaflet").Map | null = null;

    async function boot() {
      const L = (await import("leaflet")).default;
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      const el = document.getElementById("tiltshield-nearby-map");
      if (!el || cancelled) return;
      el.innerHTML = "";

      const center: [number, number] = selected
        ? [selected.lat, selected.lon]
        : user
          ? [user.lat, user.lng]
          : places[0]
            ? [places[0].lat, places[0].lon]
            : [0, 0];

      map = L.map(el, {
        zoomControl: true,
        attributionControl: true,
      }).setView(center, selected || places.length ? 14 : 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        className: "",
        html: `<div style="width:14px;height:14px;border-radius:50%;background:#34d399;border:2px solid #fff;box-shadow:0 0 0 2px rgba(16,185,129,.4)"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const selectedIcon = L.divIcon({
        className: "",
        html: `<div style="width:18px;height:18px;border-radius:50%;background:#10b981;border:3px solid #fff;box-shadow:0 0 0 3px rgba(16,185,129,.5)"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      if (user) {
        L.circleMarker([user.lat, user.lng], {
          radius: 6,
          color: "#38bdf8",
          fillColor: "#0ea5e9",
          fillOpacity: 0.9,
        })
          .addTo(map)
          .bindTooltip("You");
      }

      places.forEach((p) => {
        const m = L.marker([p.lat, p.lon], {
          icon: selected?.id === p.id ? selectedIcon : icon,
        }).addTo(map!);
        m.bindTooltip(p.name);
        m.on("click", () => onSelect?.(p));
      });

      if (places.length > 1) {
        const bounds = L.latLngBounds(
          places.map((p) => [p.lat, p.lon] as [number, number])
        );
        if (user) bounds.extend([user.lat, user.lng]);
        map.fitBounds(bounds.pad(0.15));
      } else if (selected) {
        map.setView([selected.lat, selected.lon], 15);
      }

      setReady(true);
      setTimeout(() => map?.invalidateSize(), 100);
    }

    void boot();
    return () => {
      cancelled = true;
      if (map) {
        map.remove();
        map = null;
      }
    };
  }, [places, selected?.id, user?.lat, user?.lng, onSelect]);

  return (
    <div
      className={
        className ||
        "relative h-56 w-full overflow-hidden rounded-2xl border border-white/[0.08] sm:h-72"
      }
    >
      <div id="tiltshield-nearby-map" className="h-full w-full bg-[#0a1018]" />
      {!ready && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-zinc-500">
          Loading map…
        </div>
      )}
    </div>
  );
}
