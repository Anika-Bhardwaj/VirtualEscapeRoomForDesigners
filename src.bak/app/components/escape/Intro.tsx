import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Fingerprint, ArrowRight, Lock, Volume2, VolumeX } from "lucide-react";
import { Kicker, Stamp, Polaroid } from "./materials";

import voiceoverSrc from "@/imports/voiceover-intro.mp3";

/* ── Shared audio instance so Intro can trigger it ──────────────── */
const voiceoverAudio = new Audio(voiceoverSrc);
voiceoverAudio.playbackRate = 1.5;

function useVoiceover() {
  const [playing, setPlaying] = useState(false);

  function play() {
    voiceoverAudio.currentTime = 0;
    voiceoverAudio.playbackRate = 1.5;
    voiceoverAudio.play().catch(() => {});
    setPlaying(true);
  }

  function stop() {
    voiceoverAudio.pause();
    voiceoverAudio.currentTime = 0;
    setPlaying(false);
  }

  function toggle() { playing ? stop() : play(); }

  useEffect(() => {
    const onEnd = () => setPlaying(false);
    voiceoverAudio.addEventListener("ended", onEnd);
    return () => {
      voiceoverAudio.removeEventListener("ended", onEnd);
      voiceoverAudio.pause();
    };
  }, []);

  return { playing, play, stop, toggle };
}

/* ── Typewriter hook ─────────────────────────────────────────────── */
function useTypewriter(text: string, speed = 38, startDelay = 900) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayed("");
    setDone(false);
    const delay = setTimeout(() => {
      const id = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(id);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(id);
    }, startDelay);
    return () => clearTimeout(delay);
  }, [text, speed, startDelay]);

  return { displayed, done };
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

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  delay: i * 0.7 + Math.random() * 2,
  x: 5 + Math.random() * 90,
  size: 1.5 + Math.random() * 2.5,
}));

export function Intro({ onBegin }: { onBegin: () => void }) {
  const body =
    "The launch is set. The roadmap is signed off. Confidence runs high — perhaps too high. Somewhere between the first interview and the final decision, the voice that mattered most fell silent. Four case files. One trail. All of it waiting to be recovered.";
  const { displayed, done } = useTypewriter(body, 55, 1400);
  const [btnVisible, setBtnVisible] = useState(false);
  const [typingStarted, setTypingStarted] = useState(false);
  const { playing, play, toggle } = useVoiceover();

  // Show voiceover button + auto-play when typewriter starts
  useEffect(() => {
    const t = setTimeout(() => {
      setTypingStarted(true);
      play();
    }, 1400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => setBtnVisible(true), 400);
      return () => clearTimeout(t);
    }
  }, [done]);

  return (
    <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">

      {/* Fixed top-left voiceover button — appears when typing starts */}
      <AnimatePresence>
        {typingStarted && (
          <motion.button
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.35 }}
            onClick={toggle}
            title={playing ? "Stop voiceover" : "Play voiceover"}
            className="fixed top-5 left-5 z-50 inline-flex items-center gap-2 rounded-full border border-[var(--noir-gold)]/30 bg-[var(--noir-ink)]/90 px-3 py-1.5 text-[10px] font-type uppercase tracking-widest text-[var(--noir-gold)]/70 shadow-lg backdrop-blur-sm transition-all hover:border-[var(--noir-gold)]/60 hover:text-[var(--noir-gold)]"
          >
            {playing ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
            {playing ? "stop" : "listen"}
          </motion.button>
        )}
      </AnimatePresence>

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
            className="text-[var(--noir-gold)]"
            style={{ textShadow: "0 0 60px rgba(217,178,106,0.35)" }}
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
          <p className="min-h-[110px] text-[15px] leading-[1.85] text-[var(--noir-fog)]/90 font-mono">
            {displayed}
            {!done && <span className="caret" />}
          </p>
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
        {btnVisible && (
          <motion.button
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.04, boxShadow: "0 24px 60px -20px rgba(217,178,106,0.7)" }}
            whileTap={{ scale: 0.97 }}
            onClick={onBegin}
            className="relative z-10 font-type mt-10 inline-flex items-center gap-3 rounded-full bg-[var(--noir-paper)] px-9 py-4 text-[13px] uppercase tracking-[0.22em] text-[var(--noir-ink)] shadow-[0_20px_50px_-20px_rgba(217,178,106,0.55)] transition-all"
          >
            Open the case
            <ArrowRight className="h-4 w-4" />
          </motion.button>
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
