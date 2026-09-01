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
      reply:
        "Looking for pharmacies near you. Open the map to pick the closest one.",
    },
    {
      keys: ["food", "groc", "supermarket", "market", "eat"],
      id: "food",
      query: "grocery store",
      reply: "Searching grocery and food sources near your location.",
    },
    {
      keys: ["atm", "bank", "cash", "money"],
      id: "banking",
      query: "bank ATM",
      reply:
        "Finding banks and ATMs so you can access cash or counter service.",
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
      reply: "Searching medical facilities near your position.",
    },
    {
      keys: ["bus", "train", "transit", "metro", "transport"],
      id: "transport",
      query: "transit station",
      reply: "Looking up transit and transport hubs nearby.",
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
      reply: "Emergency services near you — open the map for directions.",
    },
    {
      keys: ["hotel", "shelter", "stay"],
      id: "shelter",
      query: "hotel shelter",
      reply: "Searching short-stay and shelter options.",
    },
  ];

  for (const row of map) {
    if (row.keys.some((k) => q.includes(k))) {
      return { category: row.id, query: row.query, reply: row.reply };
    }
  }

  return {
    query: input.trim() || "pharmacy",
    reply: `I'll search the map for “${input.trim()}” near you. Refine with a category chip if needed.`,
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
      setError("Location not available. Search still works by category.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () =>
        setError("Location permission denied. Category search still works."),
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }, []);

  const selected = NEARBY_CATEGORIES.find((c) => c.id === active);
  const searchQ = query.trim() || selected?.query || "pharmacy";

  const pins = useMemo(
    () =>
      NEARBY_CATEGORIES.slice(0, 6).map((c, i) => ({
        ...c,
        x: 18 + ((i * 17) % 64),
        y: 22 + ((i * 23) % 48),
      })),
    []
  );

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
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-50">Nearby</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Map + agent. Ask for what you need — we resolve it to places around
          your location, worldwide.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <div
          className="relative h-56 w-full sm:h-72"
          style={{
            backgroundImage: `
              linear-gradient(rgba(24,24,27,0.75), rgba(24,24,27,0.9)),
              radial-gradient(circle at 30% 40%, rgba(16,185,129,0.15), transparent 50%),
              radial-gradient(circle at 70% 60%, rgba(39,39,42,0.8), transparent 40%)
            `,
            backgroundColor: "#18181b",
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "linear-gradient(#3f3f46 1px, transparent 1px), linear-gradient(90deg, #3f3f46 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          {pins.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setActive(p.id);
                setQuery(p.query);
              }}
              className={cn(
                "absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center",
                active === p.id && "z-10"
              )}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border text-[10px] font-bold shadow-lg",
                  active === p.id
                    ? "border-emerald-400 bg-emerald-500 text-zinc-950"
                    : "border-zinc-600 bg-zinc-800 text-zinc-300"
                )}
              >
                {p.label.slice(0, 1)}
              </span>
              <span className="mt-1 rounded bg-zinc-950/80 px-1.5 py-0.5 text-[9px] text-zinc-400">
                {p.label}
              </span>
            </button>
          ))}
          <div className="absolute bottom-3 left-3 rounded-lg border border-zinc-700 bg-zinc-950/90 px-2.5 py-1.5 text-[10px] text-zinc-400">
            {coords
              ? `Located · ~${formatDistance(0.8)} search radius`
              : "Enable location for precise results"}
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-amber-500/90">{error}</p>}

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50">
        <div className="border-b border-zinc-800 px-4 py-2.5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-500">
            Agent
          </p>
        </div>
        <div className="max-h-40 space-y-2 overflow-y-auto px-4 py-3">
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
        <form
          className="flex gap-2 border-t border-zinc-800 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            runAgent(agentInput);
          }}
        >
          <input
            value={agentInput}
            onChange={(e) => setAgentInput(e.target.value)}
            placeholder="e.g. nearest pharmacy, ATM, fuel…"
            className="flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-50 placeholder:text-zinc-600"
          />
          <Button type="submit" size="sm">
            Ask
          </Button>
        </form>
      </section>

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
              "rounded-full px-3 py-1.5 text-xs font-medium transition",
              active === c.id
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-zinc-900 text-zinc-500 hover:text-zinc-300"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <p className="text-sm text-zinc-300">
          Active search:{" "}
          <span className="font-medium text-zinc-50">{searchQ}</span>
        </p>
        <p className="mt-2 text-xs text-zinc-500">
          Opens your map app with local results — no hard-coded chains.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild size="sm">
            <a
              href={googleMapsSearchUrl(searchQ, coords?.lat, coords?.lng)}
              target="_blank"
              rel="noreferrer"
            >
              Open in Google Maps
            </a>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a
              href={mapsSearchUrl(searchQ, coords?.lat, coords?.lng)}
              target="_blank"
              rel="noreferrer"
            >
              OpenStreetMap
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
