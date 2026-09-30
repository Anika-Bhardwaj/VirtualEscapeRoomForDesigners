import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { VolumeX, Volume2, Search } from "lucide-react";
import { RoomShell } from "../RoomShell";
import { ROOMS } from "../gameData";
import { celebrate } from "../confetti";

/* CASE FILE 01 · Visual Hierarchy
   Every flyer shouts at the same volume. Mute the noise so the one
   quiet, honest note can finally be seen. */

interface Flyer {
  id: string;
  text: string;
  loud: boolean; // loud flyers are noise and must be muted
  rotate: number;
}

const FLYERS: Flyer[] = [
  { id: "a", text: "MEGA LAUNCH SALE!!!", loud: true, rotate: -3 },
  { id: "b", text: "BUY NOW — DON'T MISS OUT", loud: true, rotate: 2 },
  { id: "c", text: "what mattered most to her?", loud: false, rotate: -1 },
  { id: "d", text: "★★★★★ #1 PRODUCT EVER ★★★★★", loud: true, rotate: 3 },
  { id: "e", text: "LIMITED TIME!! ACT FAST!!", loud: true, rotate: -2 },
  { id: "f", text: "🔥 HUGE DISCOUNT · CLICK CLICK 🔥", loud: true, rotate: 1 },
];

export function RoomHierarchy({ onComplete }: { onComplete: () => void }) {
  const meta = ROOMS[0];
  const [muted, setMuted] = useState<Record<string, boolean>>({});
  const [solved, setSolved] = useState(false);

  const solvedNow = useMemo(() => {
    // correct when every loud flyer is muted and the quiet one is not
    return FLYERS.every((f) => (f.loud ? muted[f.id] : !muted[f.id]));
  }, [muted]);

  function toggle(id: string) {
    if (solved) return;
    const next = { ...muted, [id]: !muted[id] };
    setMuted(next);
    const done = FLYERS.every((f) => (f.loud ? next[f.id] : !next[f.id]));
    if (done) {
      setSolved(true);
      celebrate();
    }
  }

  const quietRevealed = FLYERS.filter((f) => f.loud).every((f) => muted[f.id]);

  return (
    <RoomShell
      meta={meta}
      hint="Six flyers, all screaming. Silence the noise — tap the ones adding nothing — until the signal is impossible to miss."
      solved={solved}
      onAdvance={onComplete}
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {FLYERS.map((f) => {
          const isMuted = !!muted[f.id];
          const isSignal = !f.loud && quietRevealed;
          return (
            <motion.button
              key={f.id}
              type="button"
              onClick={() => toggle(f.id)}
              style={{ rotate: `${f.rotate}deg` }}
              animate={{
                opacity: isMuted ? 0.22 : 1,
                filter: isMuted ? "grayscale(1) blur(0.4px)" : "none",
                scale: isSignal ? 1.06 : 1,
              }}
              whileHover={{ scale: isMuted ? 1 : 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`group relative min-h-[104px] rounded-md p-4 text-center shadow-[0_16px_34px_-18px_rgba(0,0,0,0.8)] ${
                f.loud
                  ? "bg-[var(--noir-note-3)] text-[#7c221c]"
                  : "bg-[var(--noir-paper)] text-[var(--noir-ink-text)]"
              } ${isSignal ? "ring-4 ring-[var(--noir-gold)]" : ""}`}
            >
              <span
                aria-hidden
                className="absolute left-1/2 -top-1.5 h-3 w-14 -translate-x-1/2 bg-[rgba(226,214,180,0.6)]"
              />
              <span
                className={`block ${
                  f.loud ? "font-display text-lg uppercase tracking-wide" : "font-type text-[15px]"
                }`}
              >
                {f.text}
              </span>
              <span className="absolute bottom-1.5 right-2 text-[var(--noir-ink-text)]/40">
                {f.loud ? (
                  isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />
                ) : isSignal ? (
                  <Search className="h-4 w-4 text-[var(--noir-gold-dim)]" />
                ) : null}
              </span>
            </motion.button>
          );
        })}
      </div>

      {!solvedNow && (
        <p className="font-type mt-6 text-center text-[13px] uppercase tracking-[0.2em] text-[var(--noir-fog-dim)]">
          {quietRevealed
            ? "One note remains. That's the one that was speaking all along."
            : `${FLYERS.filter((f) => f.loud && muted[f.id]).length} of ${
                FLYERS.filter((f) => f.loud).length
              } distractions silenced`}
        </p>
      )}
    </RoomShell>
  );
}
