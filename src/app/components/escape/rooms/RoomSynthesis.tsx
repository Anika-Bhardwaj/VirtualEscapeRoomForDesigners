import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RoomShell } from "../RoomShell";
import { ROOMS } from "../gameData";
import { celebrate } from "../confetti";

/* CASE FILE 02 · Research Synthesis
   Loose interview quotes. Cluster each under the feeling it reveals.
   When sorted, one theme towers over the rest. */

type Theme = "speed" | "delight" | "distrust";

interface Quote {
  id: string;
  text: string;
  theme: Theme;
  tone: "yellow" | "mint" | "blush";
  rotate: number;
}

const QUOTES: Quote[] = [
  { id: "q1", text: "“Is my payment actually safe here?”", theme: "distrust", tone: "blush", rotate: -3 },
  { id: "q2", text: "“Loading the page felt instant.”", theme: "speed", tone: "mint", rotate: 2 },
  { id: "q3", text: "“I loved the little confetti moment.”", theme: "delight", tone: "yellow", rotate: -2 },
  { id: "q4", text: "“I hesitated before hitting confirm.”", theme: "distrust", tone: "blush", rotate: 3 },
  { id: "q5", text: "“Checkout was so quick, wow.”", theme: "speed", tone: "mint", rotate: -1 },
  { id: "q6", text: "“Why do you need all this info?”", theme: "distrust", tone: "blush", rotate: 1 },
];

const THEMES: { id: Theme; label: string }[] = [
  { id: "speed", label: "Speed" },
  { id: "delight", label: "Delight" },
  { id: "distrust", label: "Distrust" },
];

export function RoomSynthesis({ onComplete }: { onComplete: () => void }) {
  const meta = ROOMS[1];
  const [placed, setPlaced] = useState<Record<string, Theme>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);

  const unplaced = QUOTES.filter((q) => !placed[q.id]);

  function assign(theme: Theme) {
    if (!selected || solved) return;
    const next = { ...placed, [selected]: theme };
    setPlaced(next);
    setSelected(null);
    if (QUOTES.every((q) => next[q.id] === q.theme)) {
      setSolved(true);
      celebrate();
    }
  }

  const misplaced = useMemo(
    () => QUOTES.filter((q) => placed[q.id] && placed[q.id] !== q.theme).length,
    [placed],
  );
  const allPlaced = unplaced.length === 0;

  return (
    <RoomShell
      meta={meta}
      hint="Six overheard quotes. Pin each under the feeling it betrays. Pick a quote, then choose its board."
      solved={solved}
      onAdvance={onComplete}
    >
      {/* the loose pile */}
      <div className="mb-6 min-h-[92px] rounded-xl border border-dashed border-[var(--noir-line)] bg-black/15 p-3">
        <div className="flex flex-wrap gap-3">
          <AnimatePresence>
            {unplaced.map((q) => (
              <motion.button
                key={q.id}
                layout
                exit={{ scale: 0.6, opacity: 0 }}
                onClick={() => setSelected(selected === q.id ? null : q.id)}
                style={{
                  rotate: `${q.rotate}deg`,
                  background:
                    q.tone === "mint"
                      ? "var(--noir-note-2)"
                      : q.tone === "blush"
                        ? "var(--noir-note-3)"
                        : "var(--noir-note)",
                }}
                whileHover={{ scale: 1.05 }}
                className={`font-type max-w-[220px] rounded-sm px-3 py-2 text-left text-[13px] text-[var(--noir-ink-text)] shadow-[0_10px_22px_-12px_rgba(0,0,0,0.8)] ${
                  selected === q.id ? "ring-4 ring-[var(--noir-thread)]" : ""
                }`}
              >
                {q.text}
              </motion.button>
            ))}
          </AnimatePresence>
          {allPlaced && (
            <span className="font-type px-2 py-2 text-[13px] text-[var(--noir-fog-dim)]">
              Pile cleared.
            </span>
          )}
        </div>
      </div>

      {/* the three theme boards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {THEMES.map((t) => {
          const notes = QUOTES.filter((q) => placed[q.id] === t.id);
          return (
            <button
              key={t.id}
              onClick={() => assign(t.id)}
              disabled={!selected || solved}
              className={`min-h-[150px] rounded-lg border border-[var(--noir-line)] bg-[var(--noir-graphite-2)] p-3 text-left transition ${
                selected && !solved
                  ? "cursor-pointer ring-2 ring-[var(--noir-gold)]/40 hover:ring-[var(--noir-gold)]"
                  : "cursor-default"
              }`}
            >
              <span className="font-type text-[12px] uppercase tracking-[0.2em] text-[var(--noir-gold)]">
                {t.label}
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {notes.map((q) => (
                  <motion.span
                    layout
                    key={q.id}
                    style={{
                      background:
                        q.tone === "mint"
                          ? "var(--noir-note-2)"
                          : q.tone === "blush"
                            ? "var(--noir-note-3)"
                            : "var(--noir-note)",
                    }}
                    className="font-type block w-full rounded-sm px-2 py-1.5 text-[12px] text-[var(--noir-ink-text)]"
                  >
                    {q.text}
                  </motion.span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {!solved && allPlaced && misplaced > 0 && (
        <p className="font-type mt-5 text-center text-[13px] uppercase tracking-[0.2em] text-[var(--noir-thread)]">
          {misplaced} quote{misplaced > 1 ? "s" : ""} feel misfiled — look again at the wording.
        </p>
      )}
    </RoomShell>
  );
}
