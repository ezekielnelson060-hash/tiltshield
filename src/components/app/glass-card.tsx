import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
  tone = "default",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "danger" | "success" | "accent";
}) {
  const tones = {
    default:
      "border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.02] shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]",
    danger:
      "border-red-500/25 bg-gradient-to-b from-red-500/15 to-[#0a1018] shadow-[0_0_40px_-12px_rgba(239,68,68,0.35)]",
    success:
      "border-emerald-500/25 bg-gradient-to-b from-emerald-500/12 to-[#0a1018] shadow-[0_0_40px_-12px_rgba(16,185,129,0.3)]",
    accent:
      "border-white/[0.08] bg-gradient-to-br from-[#0c1420] to-[#080d16]",
  };
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5",
        tones[tone],
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      {children}
    </div>
  );
}

export function IconBadge({
  children,
  tone = "emerald",
}: {
  children: React.ReactNode;
  tone?: "emerald" | "red" | "amber" | "sky" | "violet";
}) {
  const map = {
    emerald: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/20",
    red: "bg-red-500/15 text-red-400 ring-red-500/20",
    amber: "bg-amber-500/15 text-amber-400 ring-amber-500/20",
    sky: "bg-sky-500/15 text-sky-400 ring-sky-500/20",
    violet: "bg-violet-500/15 text-violet-400 ring-violet-500/20",
  };
  return (
    <span
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1",
        map[tone]
      )}
    >
      {children}
    </span>
  );
}
