import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = { className?: string; size?: number };

function Frame({
  className,
  size = 56,
  children,
  tone = "emerald",
}: {
  className?: string;
  size?: number;
  children: ReactNode;
  tone?: "emerald" | "red" | "amber" | "sky" | "violet";
}) {
  const glow = {
    emerald: "from-emerald-500/25 via-teal-500/10 to-transparent",
    red: "from-red-500/30 via-rose-500/10 to-transparent",
    amber: "from-amber-500/30 via-orange-500/10 to-transparent",
    sky: "from-sky-500/25 via-cyan-500/10 to-transparent",
    violet: "from-violet-500/30 via-purple-500/10 to-transparent",
  }[tone];
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl",
        className
      )}
      style={{ width: size, height: size }}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br", glow)} />
      <div className="absolute inset-[1px] rounded-[14px] bg-[#0a1018]/80 ring-1 ring-white/10" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function IllusWallet({ className, size = 56 }: Props) {
  return (
    <Frame className={className} size={size} tone="red">
      <svg width={size * 0.48} height={size * 0.48} viewBox="0 0 24 24" fill="none">
        <rect x="2" y="7" width="20" height="13" rx="2.5" stroke="#f87171" strokeWidth="1.6" />
        <path d="M2 10h20" stroke="#f87171" strokeWidth="1.6" opacity="0.5" />
        <path d="M2 7l2.2-2.8h15.6L22 7" stroke="#fca5a5" strokeWidth="1.4" />
        <circle cx="17" cy="14.5" r="1.4" fill="#f87171" />
      </svg>
    </Frame>
  );
}

export function IllusShield({ className, size = 56 }: Props) {
  return (
    <Frame className={className} size={size} tone="emerald">
      <svg width={size * 0.48} height={size * 0.48} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3 4.5 6v5.2c0 4.8 3.2 8.2 7.5 9.8 4.3-1.6 7.5-5 7.5-9.8V6L12 3z"
          stroke="#34d399"
          strokeWidth="1.6"
          fill="rgba(52,211,153,0.12)"
        />
        <path d="M9 12.2l2 2 4-4.2" stroke="#6ee7b7" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Frame>
  );
}

export function IllusTarget({ className, size = 56 }: Props) {
  return (
    <Frame className={className} size={size} tone="emerald">
      <svg width={size * 0.48} height={size * 0.48} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#34d399" strokeWidth="1.5" opacity="0.4" />
        <circle cx="12" cy="12" r="5.5" stroke="#34d399" strokeWidth="1.5" opacity="0.7" />
        <circle cx="12" cy="12" r="2.2" fill="#34d399" />
        <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22" stroke="#6ee7b7" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </Frame>
  );
}

export function IllusBolt({ className, size = 56 }: Props) {
  return (
    <Frame className={className} size={size} tone="amber">
      <svg width={size * 0.42} height={size * 0.42} viewBox="0 0 24 24" fill="none">
        <path
          d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"
          stroke="#fbbf24"
          strokeWidth="1.6"
          strokeLinejoin="round"
          fill="rgba(251,191,36,0.15)"
        />
      </svg>
    </Frame>
  );
}

export function IllusMapPin({ className, size = 56 }: Props) {
  return (
    <Frame className={className} size={size} tone="sky">
      <svg width={size * 0.45} height={size * 0.45} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z"
          stroke="#38bdf8"
          strokeWidth="1.6"
          fill="rgba(56,189,248,0.12)"
        />
        <circle cx="12" cy="10" r="2.4" fill="#38bdf8" />
      </svg>
    </Frame>
  );
}

export function IllusFood({ className, size = 48 }: Props) {
  return (
    <Frame className={className} size={size} tone="emerald">
      <svg width={size * 0.45} height={size * 0.45} viewBox="0 0 24 24" fill="none">
        <path d="M4 11h16M7 11V7.5a2.5 2.5 0 0 1 5 0V11M14 11V6.5a2 2 0 1 1 4 0V11" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M6 11v8M18 11v8M9 19h6" stroke="#6ee7b7" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </Frame>
  );
}

export function IllusPhone({ className, size = 48 }: Props) {
  return (
    <Frame className={className} size={size} tone="violet">
      <svg width={size * 0.4} height={size * 0.4} viewBox="0 0 24 24" fill="none">
        <rect x="7" y="2" width="10" height="20" rx="2.5" stroke="#a78bfa" strokeWidth="1.6" fill="rgba(167,139,250,0.12)" />
        <path d="M11 18h2" stroke="#c4b5fd" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </Frame>
  );
}

export function IllusBank({ className, size = 48 }: Props) {
  return (
    <Frame className={className} size={size} tone="sky">
      <svg width={size * 0.48} height={size * 0.48} viewBox="0 0 24 24" fill="none">
        <path d="M3 10h18M5 10v7M9 10v7M15 10v7M19 10v7M4 17h16" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 3l9 6H3l9-6z" stroke="#7dd3fc" strokeWidth="1.5" strokeLinejoin="round" fill="rgba(56,189,248,0.12)" />
      </svg>
    </Frame>
  );
}

export function IllusBriefcase({ className, size = 48 }: Props) {
  return (
    <Frame className={className} size={size} tone="amber">
      <svg width={size * 0.45} height={size * 0.45} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="7" width="18" height="13" rx="2" stroke="#fbbf24" strokeWidth="1.6" fill="rgba(251,191,36,0.1)" />
        <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" stroke="#fcd34d" strokeWidth="1.5" />
      </svg>
    </Frame>
  );
}

export function IllusEmptyVault({ className }: { className?: string }) {
  return (
    <div className={cn("mx-auto flex flex-col items-center gap-3 py-6", className)}>
      <IllusShield size={72} />
      <p className="text-center text-sm text-zinc-500">Encrypted docs live only on this device</p>
    </div>
  );
}

export function IllusEmptyMap({ className }: { className?: string }) {
  return (
    <div className={cn("mx-auto flex flex-col items-center gap-3 py-8", className)}>
      <IllusMapPin size={72} />
      <p className="text-center text-sm text-zinc-500">Search to drop pins near you</p>
    </div>
  );
}

export function ScoreBackdrop({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl",
        className
      )}
    />
  );
}
