import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Music2, Volume1, Volume2, VolumeX } from "lucide-react";
import { bgMusic } from "../bgMusic";

export function MusicWidget() {
  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState(bgMusic.getVolume());
  const [muted, setMuted] = useState(false);
  const prevVolRef = useRef(volume);
  const panelRef = useRef<HTMLDivElement>(null);

  /* Close panel on outside click */
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  function handleVolume(v: number) {
    setVolume(v);
    setMuted(v === 0);
    bgMusic.setVolume(v);
  }

  function toggleMute() {
    if (muted || volume === 0) {
      const restore = prevVolRef.current > 0 ? prevVolRef.current : 0.4;
      handleVolume(restore);
      setMuted(false);
    } else {
      prevVolRef.current = volume;
      handleVolume(0);
      setMuted(true);
    }
  }

  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const pct = Math.round((muted ? 0 : volume) * 100);

  return (
    <div ref={panelRef} className="fixed top-4 right-4 z-[200] flex flex-col items-end gap-2">

      {/* Expanded panel — drops downward from top */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full mt-2 right-0 w-64 overflow-hidden rounded-2xl border border-[var(--noir-gold)]/30 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.85),0_0_0_1px_rgba(217,178,106,0.08)]"
            style={{ background: "linear-gradient(160deg,#1a140d 0%,#0e0b07 100%)" }}
          >
            {/* Gold accent line at top */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--noir-gold)]/60 to-transparent" />

            <div className="p-5">
              {/* Header */}
              <div className="mb-4 flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--noir-gold)]/30 bg-[var(--noir-gold)]/10">
                  <Music2 className="h-3.5 w-3.5 text-[var(--noir-gold)]" />
                </div>
                <div>
                  <p className="font-type text-[10px] uppercase tracking-[0.28em] text-[var(--noir-gold)]">
                    Background Music
                  </p>
                  <p className="font-type text-[8px] uppercase tracking-widest text-[var(--noir-fog-dim)]/60">
                    Ambient Investigation Score
                  </p>
                </div>
              </div>

              <div className="h-px bg-[var(--noir-line)] mb-4" />

              {/* Slider row */}
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleMute}
                  className="shrink-0 text-[var(--noir-fog-dim)] transition-colors hover:text-[var(--noir-gold)]"
                >
                  <VolumeIcon className="h-4 w-4" />
                </button>

                <div className="relative flex-1">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={muted ? 0 : volume}
                    onChange={(e) => handleVolume(parseFloat(e.target.value))}
                    className="music-slider w-full"
                  />
                </div>

                <span className="w-9 shrink-0 text-right font-mono text-[11px] font-bold text-[var(--noir-gold)]">
                  {pct}%
                </span>
              </div>
            </div>

            {/* Bottom accent */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--noir-gold)]/20 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger button — prominent pill */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        title="Background music"
        className={`group flex items-center gap-2.5 rounded-full border px-4 py-2 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all ${
          open
            ? "border-[var(--noir-gold)]/60 bg-[var(--noir-gold)]/15 text-[var(--noir-gold)] shadow-[0_8px_32px_-8px_rgba(217,178,106,0.35)]"
            : "border-[var(--noir-gold)]/30 bg-[var(--noir-graphite)]/90 text-[var(--noir-gold)]/70 hover:border-[var(--noir-gold)]/60 hover:text-[var(--noir-gold)] hover:shadow-[0_8px_32px_-8px_rgba(217,178,106,0.25)]"
        }`}
      >
        {/* Animated equaliser bars */}
        <span className="flex items-end gap-[2px] h-4">
          {[0.5, 1, 0.7, 0.9, 0.6].map((h, i) => (
            <motion.span
              key={i}
              className="w-[3px] rounded-full bg-current"
              animate={
                !muted && volume > 0
                  ? { scaleY: [h, 1, h * 0.6, 1, h] }
                  : { scaleY: 0.2 }
              }
              transition={{
                duration: 1.1 + i * 0.15,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.12,
              }}
              style={{ height: "100%", transformOrigin: "bottom" }}
            />
          ))}
        </span>

        <span className="font-type text-[10px] uppercase tracking-[0.22em]">
          Music
        </span>

        <span className="font-mono text-[10px] opacity-60">
          {pct}%
        </span>
      </motion.button>
    </div>
  );
}
