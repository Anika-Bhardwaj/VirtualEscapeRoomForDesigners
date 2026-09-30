import { motion, AnimatePresence } from "motion/react";
import type { ReactNode } from "react";
import { useEffect, useState, useRef } from "react";
import { ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import type { RoomMeta } from "./gameData";
import { ROOMS } from "./gameData";
import { Kicker, Stamp } from "./materials";

/* ── Live timer ──────────────────────────────────────────────────── */
function useTimer(running: boolean) {
  const [seconds, setSeconds] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (ref.current) {
      clearInterval(ref.current);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);

  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

/* ── Room progress dots ──────────────────────────────────────────── */
function RoomDots({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2">
      {ROOMS.map((r, i) => (
        <div key={r.id} className="flex items-center gap-2">
          <motion.div
            animate={{
              backgroundColor: i < current
                ? "var(--noir-gold)"
                : i === current
                  ? "var(--noir-paper)"
                  : "rgba(255,255,255,0.12)",
              scale: i === current ? 1.15 : 1,
            }}
            transition={{ duration: 0.4 }}
            className="h-2 w-2 rounded-full"
            title={r.title}
          />
          {i < ROOMS.length - 1 && (
            <motion.div
              animate={{ backgroundColor: i < current ? "rgba(217,178,106,0.5)" : "rgba(255,255,255,0.08)" }}
              className="h-px w-4"
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* Frame that every case-file board shares. Keeps the player oriented. */
export function RoomShell({
  meta,
  hint,
  children,
  solved,
  onAdvance,
}: {
  meta: RoomMeta;
  hint: string;
  children: ReactNode;
  solved: boolean;
  onAdvance: () => void;
}) {
  const time = useTimer(!solved);

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-8 md:px-8">

      {/* ── Top bar ── */}
      <div className="noir-in mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <Kicker>{meta.fileNo}</Kicker>
            <RoomDots current={meta.index} />
          </div>
          <h1 className="font-display mt-2 text-[clamp(1.6rem,3.5vw,2.6rem)] leading-[1.05] text-[var(--noir-paper)]">
            {meta.title}
          </h1>
          <p className="font-type mt-1 text-[12px] uppercase tracking-[0.22em] text-[var(--noir-fog-dim)]">
            {meta.location}
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          {/* Timer */}
          <div className="flex items-center gap-2 rounded-lg border border-[var(--noir-line)] bg-[var(--noir-graphite)]/70 px-3 py-1.5">
            <Clock className="h-3 w-3 text-[var(--noir-fog-dim)]" />
            <span className="font-mono text-[13px] tabular-nums text-[var(--noir-fog)]">
              {time}
            </span>
          </div>

          {/* Hint */}
          <p className="max-w-[220px] text-right text-[12px] leading-relaxed text-[var(--noir-fog)]/75">
            <span className="text-[var(--noir-gold)]">›</span> {hint}
          </p>
        </div>
      </div>

      {/* ── Main content surface ── */}
      <div className="surface relative flex-1 overflow-hidden rounded-2xl p-5 md:p-8">
        {/* Corkboard subtle glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 0%, rgba(217,178,106,0.06), transparent 70%)",
          }}
        />
        <div className="relative">{children}</div>
      </div>

      {/* ── Solved overlay ── */}
      <AnimatePresence>
        {solved && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 solved-backdrop"
          >
            {/* Radial gold spotlight behind the card */}
            <motion.div
              aria-hidden
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="pointer-events-none absolute h-[500px] w-[500px] rounded-full"
              style={{
                background: "radial-gradient(ellipse, rgba(217,178,106,0.12) 0%, transparent 70%)",
              }}
            />

            <motion.div
              initial={{ y: 40, scale: 0.9, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 22, delay: 0.08 }}
              className="paper relative w-full max-w-lg rounded-xl p-8 text-center shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]"
            >
              {/* Gold top accent */}
              <div className="absolute inset-x-0 -top-px h-0.5 rounded-t-xl bg-gradient-to-r from-transparent via-[var(--noir-gold)]/70 to-transparent" />

              {/* Stamp */}
              <div className="absolute -top-5 right-6">
                <Stamp label="Lead Recovered" slam />
              </div>

              {/* Check icon */}
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.2 }}
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--noir-gold)]/15"
              >
                <CheckCircle2 className="h-7 w-7 text-[var(--noir-gold)]" />
              </motion.div>

              <Kicker className="justify-center !text-[var(--noir-thread)]">
                {meta.fileNo} · Solved
              </Kicker>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display mt-4 text-[1.4rem] leading-snug text-[var(--noir-ink-text)]"
              >
                "{meta.lead}"
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-3 flex items-center justify-center gap-2"
              >
                <span className="font-type text-[10px] uppercase tracking-[0.22em] text-[var(--noir-ink-text)]/50">
                  Recovered:
                </span>
                <span className="rounded-full bg-[var(--noir-ink)]/10 px-3 py-0.5 font-type text-[10px] uppercase tracking-widest text-[var(--noir-ink-text)]/70">
                  {meta.recovered}
                </span>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.03, gap: "0.75rem" }}
                whileTap={{ scale: 0.97 }}
                onClick={onAdvance}
                className="font-type mt-7 inline-flex items-center gap-2.5 rounded-full bg-[var(--noir-ink)] px-7 py-3.5 text-[13px] uppercase tracking-[0.18em] text-[var(--noir-paper)] transition-all hover:bg-[var(--noir-gold)] hover:text-[var(--noir-ink)] shadow-lg"
              >
                Follow the lead <ArrowRight className="h-4 w-4" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
