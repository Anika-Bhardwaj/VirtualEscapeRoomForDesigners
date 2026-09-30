import { useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { RotateCcw, Quote } from "lucide-react";
import { ROOMS, FINAL_VERDICT } from "./gameData";
import { Kicker, Stamp, Folder } from "./materials";
import { celebrate } from "./confetti";

const DEBRIEF_QUESTIONS = [
  "Which clue was most useful?",
  "Which room was most challenging?",
  "What assumption turned out to be wrong?",
  "What lesson will you take into your design work?",
];

/* ── Ripple canvas ───────────────────────────────────────────────── */
interface Ripple {
  x: number;
  y: number;
  r: number;
  born: number;
}

function RippleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripples = useRef<Ripple[]>([]);
  const rafRef = useRef<number>(0);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const spawn = useCallback((x: number, y: number) => {
    const last = lastPos.current;
    if (last) {
      const dx = x - last.x;
      const dy = y - last.y;
      if (dx * dx + dy * dy < 64) return; // throttle — min 8px movement
    }
    lastPos.current = { x, y };
    ripples.current.push({ x, y, r: 0, born: performance.now() });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMove = (e: MouseEvent) => spawn(e.clientX, e.clientY);
    window.addEventListener("mousemove", onMove);

    const DURATION = 1000; // ms
    const MAX_R = 72;

    function draw() {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = performance.now();
      ripples.current = ripples.current.filter((rp) => now - rp.born < DURATION);

      for (const rp of ripples.current) {
        const t = (now - rp.born) / DURATION; // 0 → 1
        const eased = 1 - Math.pow(1 - t, 3); // ease-out-cubic
        const r = eased * MAX_R;
        const alpha = (1 - t) * 0.45;

        ctx.beginPath();
        ctx.arc(rp.x, rp.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(217,178,106,${alpha})`;
        ctx.lineWidth = 1.5 * (1 - t);
        ctx.stroke();

        // Second inner ring offset in time
        if (t > 0.15) {
          const t2 = (t - 0.15) / 0.85;
          const r2 = t2 * MAX_R * 0.55;
          const a2 = (1 - t2) * 0.2;
          ctx.beginPath();
          ctx.arc(rp.x, rp.y, r2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(217,178,106,${a2})`;
          ctx.lineWidth = 1 * (1 - t2);
          ctx.stroke();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
    };
  }, [spawn]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5]"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}

/* ── Finale ──────────────────────────────────────────────────────── */
export function Finale({ onRestart }: { onRestart: () => void }) {
  useEffect(() => {
    celebrate();
    const t = setTimeout(celebrate, 600);
    const t2 = setTimeout(celebrate, 1400);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">

      {/* Ripple effect */}
      <RippleCanvas />

      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(217,178,106,0.06) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center">

        {/* Stamp */}
        <motion.div
          initial={{ opacity: 0, scale: 2.4, rotate: -8 }}
          animate={{ opacity: 0.9, scale: 1, rotate: -8 }}
          transition={{ type: "spring", stiffness: 320, damping: 18, duration: 0.45 }}
        >
          <Stamp label="CASE CLOSED" color="var(--noir-thread)" slam className="!text-3xl" />
        </motion.div>

        {/* USER FOUND badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, type: "spring", stiffness: 260, damping: 18 }}
          className="mt-5 rounded-full border border-[var(--noir-gold)]/40 bg-[var(--noir-gold)]/10 px-6 py-2"
        >
          <span className="font-type text-[13px] uppercase tracking-[0.3em] text-[var(--noir-gold)]">
            User Found
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="font-display mt-6 text-[clamp(2rem,4vw,3.4rem)] leading-[1.02] text-[var(--noir-paper)]"
          style={{ textShadow: "0 0 40px rgba(217,178,106,0.15)" }}
        >
          {FINAL_VERDICT.headline}
        </motion.h1>

        {/* Body */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--noir-fog)]/90"
        >
          {FINAL_VERDICT.body}
        </motion.p>

        {/* Decorative rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-[var(--noir-gold)]/40 to-transparent"
        />

        {/* Signoff quote */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="mt-6 flex flex-col items-center gap-2"
        >
          <Quote className="h-5 w-5 text-[var(--noir-gold)]/40 rotate-180" />
          <p className="font-display max-w-xl text-[1.15rem] leading-snug text-[var(--noir-gold)]">
            {FINAL_VERDICT.signoff}
          </p>
        </motion.div>

        {/* Recovered leads grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.5 }}
          className="mt-10 w-full"
        >
          <Kicker className="justify-center mb-4">All Leads Recovered</Kicker>
          <div className="grid gap-2 sm:grid-cols-2">
            {ROOMS.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.08 }}
                className="paper rounded-lg p-3 text-left"
              >
                <span className="font-type text-[9px] uppercase tracking-[0.2em] text-[var(--noir-thread)]">
                  {r.fileNo}
                </span>
                <p className="mt-1 text-[12px] leading-snug text-[var(--noir-ink-text)]/80">
                  "{r.lead}"
                </p>
                <span className="mt-2 inline-block rounded-full bg-[var(--noir-ink)]/8 px-2 py-0.5 font-type text-[9px] uppercase tracking-widest text-[var(--noir-ink-text)]/50">
                  {r.recovered}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Debrief */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-8 w-full"
        >
          <Folder className="border-[var(--noir-gold)]/25 bg-[var(--noir-graphite)]">
            <Kicker className="mb-5 !text-[var(--noir-gold)]">Team Debrief</Kicker>
            <ul className="space-y-3">
              {DEBRIEF_QUESTIONS.map((q, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-[var(--noir-gold)]/30 font-type text-[10px] text-[var(--noir-gold)]">
                    {i + 1}
                  </span>
                  <span className="font-type text-[12px] tracking-wider text-[var(--noir-fog)]/80 uppercase">
                    {q}
                  </span>
                </motion.li>
              ))}
            </ul>
          </Folder>
        </motion.div>

        {/* Restart button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0 }}
          className="mt-8"
        >
          <button
            onClick={onRestart}
            className="font-type inline-flex items-center gap-2 rounded-full border border-[var(--noir-line)] px-7 py-3.5 text-[13px] uppercase tracking-[0.18em] text-[var(--noir-fog)] transition-all hover:border-[var(--noir-paper)] hover:text-[var(--noir-paper)] hover:shadow-[0_0_20px_rgba(217,178,106,0.15)]"
          >
            <RotateCcw className="h-4 w-4" /> Reopen the case
          </button>
        </motion.div>
      </div>
    </div>
  );
}
