import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Check, X, Ban, MousePointerClick } from "lucide-react";
import { RoomShell } from "../RoomShell";
import { ROOMS } from "../gameData";
import { celebrate } from "../confetti";

/* CASE FILE 04 · Interaction Feedback
   The button she pressed never answered. Wire each moment to a reply
   so the action finally speaks back. */

type ChipId = "spinner" | "check" | "error" | "silence";

const CHIPS: { id: ChipId; label: string; icon: typeof Check }[] = [
  { id: "spinner", label: "Spinner", icon: Loader2 },
  { id: "check", label: "Success ✓", icon: Check },
  { id: "error", label: "Error ✕", icon: X },
  { id: "silence", label: "Nothing", icon: Ban },
];

const SLOTS: { id: string; label: string; answer: ChipId }[] = [
  { id: "sending", label: "While it sends", answer: "spinner" },
  { id: "ok", label: "When it works", answer: "check" },
  { id: "fail", label: "When it fails", answer: "error" },
];

export function RoomFeedback({ onComplete }: { onComplete: () => void }) {
  const meta = ROOMS[3];
  const [selected, setSelected] = useState<ChipId | null>(null);
  const [wired, setWired] = useState<Record<string, ChipId>>({});
  const [poked, setPoked] = useState(false);
  const [solved, setSolved] = useState(false);

  const usedChips = Object.values(wired);

  function place(slotId: string) {
    if (!selected || solved) return;
    const next = { ...wired };
    // remove selected chip from any prior slot
    for (const k of Object.keys(next)) if (next[k] === selected) delete next[k];
    next[slotId] = selected;
    setWired(next);
    setSelected(null);
    if (SLOTS.every((s) => next[s.id] === s.answer)) {
      setSolved(true);
      celebrate();
    }
  }

  return (
    <RoomShell
      meta={meta}
      hint="Press the button — notice it says nothing back. Give each moment a reply, then it will speak."
      solved={solved}
      onAdvance={onComplete}
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
        {/* the dead prototype */}
        <div className="rounded-xl border border-[var(--noir-line)] bg-[var(--noir-graphite-2)] p-6">
          <span className="font-type text-[12px] uppercase tracking-[0.2em] text-[var(--noir-gold)]">
            The Prototype
          </span>
          <div className="mt-5 rounded-lg bg-[var(--noir-paper)] p-6">
            <div className="mb-4 h-2.5 w-2/3 rounded bg-black/10" />
            <div className="mb-6 h-2.5 w-1/2 rounded bg-black/10" />
            <button
              onClick={() => setPoked(true)}
              className="w-full rounded-md bg-[var(--noir-ink)] py-3 text-[var(--noir-paper)]"
            >
              <span className="inline-flex items-center gap-2">
                <MousePointerClick className="h-4 w-4" /> Submit
              </span>
            </button>
            <div className="mt-3 h-6 text-center">
              <AnimatePresence mode="wait">
                {poked && !solved && (
                  <motion.span
                    key="dead"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-type text-[12px] text-[var(--noir-thread)]"
                  >
                    …nothing happens. no reply at all.
                  </motion.span>
                )}
                {solved && (
                  <motion.span
                    key="alive"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-type inline-flex items-center gap-1.5 text-[13px] text-green-700"
                  >
                    <Check className="h-4 w-4" /> Sent — we heard you.
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* wiring the responses */}
        <div>
          <div className="space-y-3">
            {SLOTS.map((s) => {
              const chip = wired[s.id] ? CHIPS.find((c) => c.id === wired[s.id])! : null;
              const Icon = chip?.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => place(s.id)}
                  disabled={solved}
                  className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition ${
                    selected && !solved
                      ? "border-[var(--noir-gold)] bg-[var(--noir-gold)]/5"
                      : "border-[var(--noir-line)]"
                  }`}
                >
                  <span className="font-type text-[13px] uppercase tracking-[0.14em] text-[var(--noir-fog)]">
                    {s.label}
                  </span>
                  {chip && Icon ? (
                    <span className="font-type inline-flex items-center gap-1.5 rounded-full bg-[var(--noir-gold)]/20 px-3 py-1 text-[12px] text-[var(--noir-gold)]">
                      <Icon className="h-3.5 w-3.5" /> {chip.label}
                    </span>
                  ) : (
                    <span className="font-type text-[12px] text-[var(--noir-fog-dim)]">
                      empty — no reply
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {CHIPS.map((c) => {
              const Icon = c.icon;
              const used = usedChips.includes(c.id);
              return (
                <motion.button
                  key={c.id}
                  onClick={() => !solved && setSelected(selected === c.id ? null : c.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`font-type inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] transition ${
                    selected === c.id
                      ? "border-[var(--noir-thread)] bg-[var(--noir-thread)]/15 text-[var(--noir-paper)]"
                      : used
                        ? "border-[var(--noir-line)] text-[var(--noir-fog-dim)] opacity-60"
                        : "border-[var(--noir-line)] text-[var(--noir-fog)] hover:border-[var(--noir-gold)]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" /> {c.label}
                </motion.button>
              );
            })}
          </div>
          <p className="font-type mt-4 text-[12px] uppercase tracking-[0.16em] text-[var(--noir-fog-dim)]">
            Pick a reply, then the moment it belongs to.
          </p>
        </div>
      </div>
    </RoomShell>
  );
}
