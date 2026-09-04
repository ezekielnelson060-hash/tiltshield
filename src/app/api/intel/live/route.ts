import { NextResponse } from "next/server";

export type LiveIntelHit = {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string | null;
  category: string;
  impact: "low" | "medium" | "high";
  relevanceKeys: string[];
};

const FEEDS: {
  url: string;
  source: string;
  category: string;
  keys: string[];
  impact: "low" | "medium" | "high";
}[] = [
  {
    url: "https://news.google.com/rss/search?q=energy+grid+outage+OR+blackout&hl=en-US&gl=US&ceid=US:en",
    source: "Google News",
    category: "Energy",
    keys: ["home", "emergency", "food"],
    impact: "medium",
  },
  {
    url: "https://news.google.com/rss/search?q=food+prices+OR+grocery+inflation+OR+organic+food+supply&hl=en-US&gl=US&ceid=US:en",
    source: "Google News",
    category: "Essentials",
    keys: ["food", "home"],
    impact: "medium",
  },
  {
    url: "https://news.google.com/rss/search?q=central+bank+digital+currency+OR+cashless+OR+payment+outage&hl=en-US&gl=US&ceid=US:en",
    source: "Google News",
    category: "Financial",
    keys: ["money", "digital", "alt_payment"],
    impact: "high",
  },
  {
    url: "https://news.google.com/rss/search?q=pharmacy+shortage+OR+medicine+supply+OR+prescription+delay&hl=en-US&gl=US&ceid=US:en",
    source: "Google News",
    category: "Health",
    keys: ["emergency", "skills"],
    impact: "high",
  },
];

function stripTags(s: string): string {
  if (!s) return "";
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, " ")
    .replace(/<a\b[^>]*/gi, " ")
    .replace(/<\/?[a-zA-Z][^>]*>/g, " ")
    .replace(/<[^>]*/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#\d+;/g, " ")
    .replace(/\bhref\s*=\s*["'][^"']*/gi, " ")
    .replace(/\bhref\s*=/gi, " ")
    .replace(/https?:\/\/\S+/gi, " ")
    .replace(/[<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseItems(xml: string, meta: (typeof FEEDS)[0]): LiveIntelHit[] {
  const items: LiveIntelHit[] = [];
  const blocks = xml.split(/<item[\s>]/i).slice(1);
  for (const block of blocks.slice(0, 5)) {
    const title = stripTags(
      (block.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || ""
    );
    const link = stripTags(
      (block.match(/<link[^>]*>([\s\S]*?)<\/link>/i) || [])[1] ||
        (block.match(/<guid[^>]*>([\s\S]*?)<\/guid>/i) || [])[1] ||
        ""
    );
    const desc = stripTags(
      (block.match(/<description[^>]*>([\s\S]*?)<\/description>/i) || [])[1] ||
        ""
    );
    const pub = stripTags(
      (block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i) || [])[1] || ""
    );
    if (!title) continue;
    items.push({
      id: `live-${meta.category}-${Buffer.from(title).toString("base64").slice(0, 16)}`,
      title: title.slice(0, 140),
      summary: (desc || title).slice(0, 220),
      source: meta.source,
      url: link.startsWith("http") ? link : "",
      publishedAt: pub || null,
      category: meta.category,
      impact: meta.impact,
      relevanceKeys: meta.keys,
    });
  }
  return items;
}

export async function GET() {
  const results: LiveIntelHit[] = [];
  await Promise.all(
    FEEDS.map(async (feed) => {
      try {
        const res = await fetch(feed.url, {
          headers: {
            "User-Agent": "TiltshieldIntel/1.0",
            Accept: "application/rss+xml, application/xml, text/xml, */*",
          },
          next: { revalidate: 1800 },
        });
        if (!res.ok) return;
        const xml = await res.text();
        results.push(...parseItems(xml, feed));
      } catch {
        /* feed optional */
      }
    })
  );

  const seen = new Set<string>();
  const unique = results.filter((r) => {
    const k = r.title.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  return NextResponse.json({
    ok: true,
    fetchedAt: new Date().toISOString(),
    items: unique.slice(0, 24),
  });
}
