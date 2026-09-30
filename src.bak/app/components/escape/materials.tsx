import { motion } from "motion/react";
import type { ReactNode } from "react";

/* ── Reusable "case file" materials for the noir investigation board ── */

export function Pin({ className = "" }: { className?: string }) {
  return <span className={`pin absolute left-1/2 -top-2 -translate-x-1/2 ${className}`} />;
}

export function Tape({ className = "" }: { className?: string }) {
  return <span className={`tape ${className}`} />;
}

export function StickyNote({
  children,
  tone = "yellow",
  rotate = 0,
  className = "",
  onClick,
  active,
  dim,
}: {
  children: ReactNode;
  tone?: "yellow" | "mint" | "blush";
  rotate?: number;
  className?: string;
  onClick?: () => void;
  active?: boolean;
  dim?: boolean;
}) {
  const bg =
    tone === "mint" ? "var(--noir-note-2)" : tone === "blush" ? "var(--noir-note-3)" : "var(--noir-note)";
  return (
    <motion.button
      type={onClick ? "button" : undefined}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05, rotate: rotate * 0.3, y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.97 } : undefined}
      animate={{ opacity: dim ? 0.28 : 1, filter: dim ? "grayscale(0.6)" : "none" }}
      style={{ background: bg, rotate: `${rotate}deg` }}
      className={`relative px-4 py-3 text-left text-[var(--noir-ink-text)] shadow-[0_14px_32px_-12px_rgba(0,0,0,0.75)] transition-shadow ${
        active ? "ring-4 ring-[var(--noir-thread)] ring-offset-2 ring-offset-transparent shadow-[0_18px_36px_-12px_rgba(0,0,0,0.85)]" : ""
      } ${className}`}
    >
      {/* Tape strip at top */}
      <span
        aria-hidden
        className="absolute left-1/2 -top-2 h-3.5 w-16 -translate-x-1/2 rounded-sm bg-[rgba(226,214,180,0.65)] shadow-sm"
      />
      {children}
    </motion.button>
  );
}

export function Polaroid({
  caption,
  children,
  rotate = 0,
  className = "",
}: {
  caption?: string;
  children: ReactNode;
  rotate?: number;
  className?: string;
}) {
  return (
    <div
      style={{ rotate: `${rotate}deg` }}
      className={`paper relative w-fit rounded-[3px] p-3 pb-9 shadow-[0_22px_44px_-18px_rgba(0,0,0,0.85),0_2px_0_rgba(0,0,0,0.15)] ${className}`}
    >
      <div className="overflow-hidden bg-[var(--noir-ink)]">{children}</div>
      {caption && (
        <div className="font-type absolute bottom-2 left-0 right-0 text-center text-[10px] text-[var(--noir-ink-text)]/60 tracking-wider">
          {caption}
        </div>
      )}
    </div>
  );
}

export function Stamp({
  label,
  color = "var(--noir-thread)",
  className = "",
  slam = false,
}: {
  label: string;
  color?: string;
  className?: string;
  slam?: boolean;
}) {
  return (
    <span
      style={{ color, borderColor: color }}
      className={`stamp inline-block px-3 py-1.5 text-[13px] uppercase font-bold tracking-[0.14em] ${slam ? "stamp-slam" : ""} ${className}`}
    >
      {label}
    </span>
  );
}

/** A hanging file folder / evidence card on the graphite board */
export function Folder({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-xl border border-[var(--noir-line)] bg-[var(--noir-graphite)] p-5 text-[var(--noir-ink-text)] shadow-[0_24px_56px_-24px_rgba(0,0,0,0.85)] ${className}`}
    >
      {/* Tab nub at top left */}
      <div className="absolute -top-px left-5 h-px w-12 bg-gradient-to-r from-[var(--noir-gold)]/40 via-[var(--noir-gold)]/20 to-transparent" />
      {children}
    </div>
  );
}

/** Kicker label in typewriter font */
export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`font-type inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.3em] text-[var(--noir-gold)] ${className}`}
    >
      <span className="h-px w-5 bg-[var(--noir-gold)]/40 shrink-0" />
      {children}
    </span>
  );
}
