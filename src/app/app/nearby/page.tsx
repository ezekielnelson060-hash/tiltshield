"use client";

import { useEffect, useMemo, useState } from "react";
import {
  NEARBY_CATEGORIES,
  googleMapsSearchUrl,
  mapsSearchUrl,
  type NearbyCategory,
} from "@/lib/nearby";
import { formatDistance } from "@/lib/locale";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AgentMsg = { role: "user" | "agent"; text: string };

function parseAgentIntent(input: string): {
  category?: NearbyCategory;
  query: string;
  reply: string;
} {
  const q = input.trim().toLowerCase();
  const map: {
    keys: string[];
    id: NearbyCategory;
    query: string;
    reply: string;
  }[] = [
    {
      keys: ["pharm", "medicine", "drug", "prescription", "chemist"],
      id: "pharmacy",
      query: "pharmacy",
      reply: "Looking for pharmacies near you.",
    },
    {
      keys: ["food", "groc", "supermarket", "market", "eat"],
      id: "food",
      query: "grocery store",
      reply: "Searching grocery and food sources near you.",
    },
    {
      keys: ["atm", "bank", "cash", "money"],
      id: "banking",
      query: "bank ATM",
      reply: "Finding banks and ATMs near you.",
    },
    {
      keys: ["fuel", "gas", "petrol", "diesel"],
      id: "fuel",
      query: "gas station fuel",
      reply: "Locating fuel stations near you.",
    },
    {
      keys: ["hospital", "clinic", "doctor", "medical", "urgent"],
      id: "medical",
      query: "hospital clinic",
      reply: "Searching medical facilities near you.",
    },
    {
      keys: ["bus", "train", "transit", "metro", "transport"],
      id: "transport",
      query: "transit station",
      reply: "Looking up transit hubs nearby.",
    },
    {
      keys: ["hardware", "tool", "repair"],
      id: "hardware",
      query: "hardware store",
      reply: "Finding hardware and repair suppliers.",
    },
    {
      keys: ["emergency", "police", "fire"],
      id: "emergency",
      query: "emergency services",
      reply: "Emergency services near you.",
    },
    {
      keys: ["hotel", "shelter", "stay"],
      id: "shelter",
      query: "hotel shelter",
      reply: "Searching short-stay options.",
    },
  ];

  for (const row of map) {
    if (row.keys.some((k) => q.includes(k))) {
      return { category: row.id, query: row.query, reply: row.reply };
    }
  }
  return {
    query: input.trim() || "pharmacy",
    reply: `Searching the map for “${input.trim()}” near you.`,
  };
}

export default function NearbyPage() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<NearbyCategory | null>("pharmacy");
  const [query, setQuery] = useState("");
  const [agentInput, setAgentInput] = useState("");
  const [messages, setMessages] = useState<AgentMsg[]>([
    {
      role: "agent",
      text: "Tell me what you need — pharmacy, cash, fuel, food — and I’ll open the best map search near you.",
    },
  ]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Location not available. Category search still works.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setError("Location permission denied. Search still works."),
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, []);

  const selected = NEARBY_CATEGORIES.find((c) => c.id === active);
  const searchQ = query.trim() || selected?.query || "pharmacy";

  const osmEmbed = useMemo(() => {
    if (!coords) return null;
    const d = 0.02;
    const bbox = [
      coords.lng - d,
      coords.lat - d,
      coords.lng + d,
      coords.lat + d,
    ].join("%2C");
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`;
  }, [coords]);

  function runAgent(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const parsed = parseAgentIntent(trimmed);
    setMessages((m) => [
      ...m,
      { role: "user", text: trimmed },
      { role: "agent", text: parsed.reply },
    ]);
    setQuery(parsed.query);
    if (parsed.category) setActive(parsed.category);
    setAgentInput("");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">Nearby</h1>
        <p className="mt-1 text-sm text-zinc-500">Find what you need, close to you.</p>
      </div>

      <div className="relative">
        <input
          value={agentInput}
          onChange={(e) => setAgentInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              runAgent(agentInput);
            }
          }}
          placeholder="Search for anything…"
          className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] py-3.5 pl-4 pr-24 text-sm text-zinc-50 placeholder:text-zinc-600"
        />
        <Button
          type="button"
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2"
          onClick={() => runAgent(agentInput)}
        >
          Ask
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {NEARBY_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setActive(c.id);
              setQuery(c.query);
            }}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition",
              active === c.id
                ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30"
                : "bg-white/[0.04] text-zinc-500 hover:text-zinc-300"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a1018]">
        {osmEmbed ? (
          <iframe
            title="Nearby map"
            src={osmEmbed}
            className="h-56 w-full border-0 sm:h-72"
            loading="lazy"
          />
        ) : (
          <div className="relative flex h-56 items-center justify-center sm:h-72">
            <div
              className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage:
                  "linear-gradient(#3f3f46 1px, transparent 1px), linear-gradient(90deg, #3f3f46 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <p className="relative text-xs text-zinc-500">
              {error || "Locating you for map tiles…"}
            </p>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-3">
          <div>
            <p className="text-sm font-medium text-zinc-200">
              {selected?.label || "Search"}
            </p>
            <p className="text-[11px] text-zinc-500">
              {coords
                ? `Near you · ~${formatDistance(0.8)} radius`
                : "Enable location for precise results"}
            </p>
          </div>
          <Button asChild size="sm">
            <a
              href={googleMapsSearchUrl(searchQ, coords?.lat, coords?.lng)}
              target="_blank"
              rel="noreferrer"
            >
              Directions
            </a>
          </Button>
        </div>
      </div>

      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.03]">
        <div className="border-b border-white/[0.06] px-4 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
            Agent
          </p>
        </div>
        <div className="max-h-36 space-y-2 overflow-y-auto px-4 py-3">
          {messages.map((m, i) => (
            <p
              key={i}
              className={cn(
                "text-sm",
                m.role === "user" ? "text-zinc-200" : "text-zinc-400"
              )}
            >
              <span className="text-[10px] uppercase tracking-wider text-zinc-600">
                {m.role === "user" ? "You" : "Tiltshield"} ·{" "}
              </span>
              {m.text}
            </p>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm" variant="outline">
          <a
            href={mapsSearchUrl(searchQ, coords?.lat, coords?.lng)}
            target="_blank"
            rel="noreferrer"
          >
            OpenStreetMap
          </a>
        </Button>
        <Button asChild size="sm" variant="outline">
          <a
            href={googleMapsSearchUrl(searchQ, coords?.lat, coords?.lng)}
            target="_blank"
            rel="noreferrer"
          >
            Google Maps
          </a>
        </Button>
      </div>
    </div>
  );
}
