import Link from "next/link";

const GUIDES = [
  {
    title: "How to store 30 days of food",
    blurb: "Meals you already eat, rotation, and water \u2014 without panic buying.",
  },
  {
    title: "Cash float without paranoia",
    blurb: "Size a 7\u201314 day local spend reserve and where to keep it.",
  },
  {
    title: "Hardware wallet \u2014 start small",
    blurb: "Practice recovery with a tiny amount before anything that matters.",
  },
  {
    title: "72-hour home kit",
    blurb: "Light, water, power bank, meds, cash when POS is down.",
  },
  {
    title: "Offline document set",
    blurb: "IDs, insurance, recovery codes \u2014 not only in email.",
  },
];

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-50">Guides</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Practical checklists. Not financial advice. Affiliate links may appear later.
        </p>
      </div>
      <div className="space-y-3">
        {GUIDES.map((g) => (
          <div
            key={g.title}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5"
          >
            <h2 className="font-medium text-zinc-100">{g.title}</h2>
            <p className="mt-1 text-sm text-zinc-500">{g.blurb}</p>
            <p className="mt-3 text-xs text-zinc-600">Full guide \u2014 coming in the next content drop</p>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-zinc-500">
        <Link href="/app/actions" className="text-emerald-400 hover:underline">
          Prefer a single next action \u2192
        </Link>
      </p>
    </div>
  );
}
