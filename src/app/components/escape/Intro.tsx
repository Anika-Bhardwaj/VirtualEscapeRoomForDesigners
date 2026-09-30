import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Fingerprint, ArrowRight, Lock, Play, Square, FastForward } from "lucide-react";
import { Kicker, Stamp, Polaroid } from "./materials";
import { bgMusic } from "../../bgMusic";
import { Button } from "@mui/material";
import { palette } from "../../theme";

import voiceoverSrc from "@/imports/voiceover-intro.mp3";

const voiceoverAudio = new Audio(voiceoverSrc);
voiceoverAudio.preload = "auto";
voiceoverAudio.volume = 0.9;

function useVoiceover() {
  const [playing, setPlaying] = useState(false);

  function play() {
    voiceoverAudio.currentTime = 0;
    voiceoverAudio.playbackRate = 1;
    voiceoverAudio.play().then(() => {
      setPlaying(true);
      bgMusic.duck();
    }).catch(() => {});
  }

  function stop() {
    if (!voiceoverAudio.paused) bgMusic.unduck();
    voiceoverAudio.pause();
    voiceoverAudio.currentTime = 0;
    setPlaying(false);
  }

  useEffect(() => {
    const onEnd = () => {
      setPlaying(false);
      bgMusic.unduck();
    };
    voiceoverAudio.addEventListener("ended", onEnd);
    return () => {
      voiceoverAudio.removeEventListener("ended", onEnd);
      if (!voiceoverAudio.paused) bgMusic.unduck();
      voiceoverAudio.pause();
    };
  }, []);

  return { playing, play, stop, toggle: () => (playing ? stop() : play()) };
}

/* ── Typewriter — follows the voiceover when it plays, else a steady pace ── */
function useTypewriter(text: string, speed: number, startDelay: number, syncToVoice: boolean) {
  const [count, setCount] = useState(0);
  const syncRef = useRef(syncToVoice);
  syncRef.current = syncToVoice;

  useEffect(() => {
    let id: ReturnType<typeof setInterval>;
    const delay = setTimeout(() => {
      id = setInterval(() => {
        setCount((c) => {
          if (c >= text.length) return c;
          const d = voiceoverAudio.duration;
          if (syncRef.current && d && isFinite(d)) {
            return Math.max(c, Math.min(text.length, Math.ceil((voiceoverAudio.currentTime / d) * text.length * 1.05)));
          }
          return c + 1;
        });
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(delay);
      clearInterval(id);
    };
  }, [text, speed, startDelay]);

  return {
    displayed: text.slice(0, count),
    done: count >= text.length,
    skip: () => setCount(text.length),
  };
}

/* ── Floating particle ───────────────────────────────────────────── */
function Particle({ delay, x, size }: { delay: number; x: number; size: number }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute rounded-full bg-[var(--noir-gold)]"
      style={{ width: size, height: size, left: `${x}%`, bottom: "-10px", opacity: 0 }}
      animate={{
        y: [0, -420 - Math.random() * 200],
        opacity: [0, 0.35, 0.18, 0],
        x: [(Math.random() - 0.5) * 60],
      }}
      transition={{
        duration: 7 + Math.random() * 6,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 8,
        ease: "easeOut",
      }}
    />
  );
}

const PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  delay: i * 0.7 + Math.random() * 2,
  x: 5 + Math.random() * 90,
  size: 1.5 + Math.random() * 2.5,
}));

export function Intro({ onBegin }: { onBegin: () => void }) {
  const body =
    "The launch is set. The roadmap is signed off. Confidence runs high — perhaps too high. Somewhere between the first interview and the final decision, the voice that mattered most fell silent. Four case files. One trail. All of it waiting to be recovered.";
  const { playing, stop, toggle } = useVoiceover();
  const { displayed, done, skip } = useTypewriter(body, 28, 900, playing);

  function begin() {
    stop();
    onBegin();
  }

  return (
    <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">

      {/* Ambient glow behind headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full ambient-drift"
        style={{
          background: "radial-gradient(ellipse, rgba(217,178,106,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Floating particles */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {PARTICLES.map((p) => (
          <Particle key={p.id} delay={p.delay} x={p.x} size={p.size} />
        ))}
      </div>

      {/* Header kicker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10"
      >
        <Kicker className="justify-center !text-[var(--noir-gold)] gap-3">
          <Lock className="h-3 w-3" />
          Restricted · UX Research Division
          <Lock className="h-3 w-3" />
        </Kicker>

        <h1 className="font-display mt-5 text-[clamp(2.6rem,7vw,5rem)] font-medium leading-[0.95] text-[var(--noir-paper)]">
          When the Evidence
          <br />
          <span
            style={{ color: palette.lime, textShadow: "0 0 60px rgba(212,243,107,0.3)" }}
          >
            Went Dark
          </span>
        </h1>

        {/* Decorative rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
          className="mx-auto mt-4 h-px w-32 origin-center bg-gradient-to-r from-transparent via-[var(--noir-gold)]/50 to-transparent"
        />
      </motion.div>

      {/* Stamp */}
      <motion.div
        initial={{ opacity: 0, rotate: -20, scale: 0.6 }}
        animate={{ opacity: 1, rotate: -8, scale: 1 }}
        transition={{ delay: 0.55, type: "spring", stiffness: 280, damping: 18 }}
        className="mt-6 z-10"
      >
        <Stamp label="Launch — Tomorrow" color="var(--noir-thread)" />
      </motion.div>

      {/* Polaroid + typewriter body */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="relative z-10 mt-8 grid max-w-2xl gap-6 md:grid-cols-[auto_1fr] md:items-center md:text-left"
      >
        <div className="mx-auto md:mx-0">
          <Polaroid caption="last seen: research archive" rotate={-4}>
            <div className="flex h-28 w-28 items-center justify-center bg-[var(--noir-ink)]">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <Fingerprint className="h-14 w-14 text-[var(--noir-gold)]/70" />
              </motion.div>
            </div>
          </Polaroid>
        </div>

        <div>
          <p className="min-h-[110px] text-[15px] leading-[1.85] text-[var(--noir-fog)]/90 font-mono" aria-live="polite">
            {displayed}
            {!done && <span className="caret" />}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <Button
              variant="outlined"
              size="small"
              color={playing ? "secondary" : "inherit"}
              onClick={toggle}
              startIcon={playing ? <Square size={12} /> : <Play size={12} />}
              aria-label={playing ? "Stop briefing audio" : "Play briefing audio"}
            >
              {playing ? "Stop briefing" : "Play briefing"}
            </Button>
            {!done && (
              <Button variant="text" size="small" color="inherit" onClick={skip} startIcon={<FastForward size={12} />} sx={{ color: "text.secondary" }}>
                Skip
              </Button>
            )}
          </div>
          {done && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-3 text-[15px] leading-relaxed text-[var(--noir-fog)]/90"
            >
              Every lead is a clue. Every clue narrows the gap.{" "}
              <span className="text-[var(--noir-paper)] font-semibold">The evidence doesn&apos;t lie — if you know how to read it.</span>
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* CTA button */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mt-10"
          >
            <Button variant="contained" size="large" onClick={begin} autoFocus endIcon={<ArrowRight size={16} />}>
              Open the case
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corner classification marks */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="pointer-events-none absolute bottom-6 left-6 font-type text-[9px] uppercase tracking-[0.28em] text-[var(--noir-fog-dim)]/50"
      >
        DOC-INV-2024 · INTERNAL USE ONLY
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="pointer-events-none absolute bottom-6 right-6 font-type text-[9px] uppercase tracking-[0.28em] text-[var(--noir-fog-dim)]/50"
      >
        CLASSIFICATION: RESTRICTED
      </motion.div>
    </div>
  );
}
