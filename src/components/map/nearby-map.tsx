"use client";

import { useEffect, useState } from "react";
import type { NearbyPlace } from "@/lib/nearby";

type Props = {
  places: NearbyPlace[];
  selected: NearbyPlace | null;
  user?: { lat: number; lng: number } | null;
  onSelect?: (p: NearbyPlace) => void;
  className?: string;
  /** city/nation = local pins; global = show all results worldwide */
  scope?: "city" | "nation" | "global";
};

/**
 * Multi-pin map (Leaflet). Loaded client-only to keep SSR clean.
 */
export function NearbyMap({
  places,
  selected,
  user,
  onSelect,
  className,
  scope = "city",
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
      const maxKm =
        scope === "global" ? 20000 : scope === "nation" ? 900 : 120;
      const localPlaces =
        scope === "global"
          ? places
          : places.filter((p) => {
              if (p.distanceKm == null) return true;
              return p.distanceKm <= maxKm;
            });
      const focus =
        selected && localPlaces.some((p) => p.id === selected.id)
          ? selected
          : localPlaces[0] || null;
      const center: [number, number] = user
        ? [user.lat, user.lng]
        : focus
          ? [focus.lat, focus.lon]
          : [6.45, 3.4];
      const zoom =
        scope === "global"
          ? focus
            ? 4
            : 2
          : user
            ? 12
            : focus
              ? 12
              : 11;

      map = L.map(el, {
        zoomControl: true,
        attributionControl: true,
      }).setView(center, zoom);

      const streets = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        { attribution: "&copy; OpenStreetMap", maxZoom: 19 }
      );
      const satellite = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Esri", maxZoom: 19 }
      );
      streets.addTo(map);
      L.control
        .layers(
          { Streets: streets, Satellite: satellite },
          {},
          { position: "topright", collapsed: false }
        )
        .addTo(map);

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

      const pins = localPlaces.length ? localPlaces : focus ? [focus] : [];
      pins.forEach((p) => {
        const m = L.marker([p.lat, p.lon], {
          icon: selected?.id === p.id ? selectedIcon : icon,
        }).addTo(map!);
        m.bindTooltip(p.name);
        m.on("click", () => onSelect?.(p));
      });

      if (pins.length > 1) {
        const bounds = L.latLngBounds(
          pins.map((p) => [p.lat, p.lon] as [number, number])
        );
        if (user && scope !== "global") bounds.extend([user.lat, user.lng]);
        map.fitBounds(bounds.pad(0.2), {
          maxZoom: scope === "global" ? 6 : 14,
        });
      } else if (pins.length === 1) {
        map.setView(
          [pins[0].lat, pins[0].lon],
          scope === "global" ? 5 : 14
        );
      } else if (user) {
        map.setView([user.lat, user.lng], 12);
      }
      if (scope !== "global" && map.getZoom() < 10) map.setZoom(11);

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
  }, [places, selected?.id, user?.lat, user?.lng, onSelect, scope]);

  return (
    <div
      className={
        className || "tilt-map-chrome relative h-56 w-full sm:h-72"
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
