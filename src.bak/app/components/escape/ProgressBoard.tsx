import { motion } from "motion/react";
import { ArrowRight, MapPin, CheckCircle2, Circle } from "lucide-react";
import { ROOMS } from "./gameData";
import { Kicker } from "./materials";

/* The detective board — recovered leads pinned and joined by red string.
   Shown after each solve as the payoff + orientation for what's next. */
export function ProgressBoard({
  solvedCount,
  onContinue,
  lastFile,
}: {
  solvedCount: number;
  onContinue: () => void;
  lastFile: boolean;
}) {
  const pct = Math.round((solvedCount / ROOMS.length) * 100);

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-14">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <Kicker className="justify-center">Investigation Board</Kicker>
        <h2 className="font-display mt-3 text-center text-[clamp(1.6rem,4vw,2.4rem)] text-[var(--noir-paper)]">
          {solvedCount} of {ROOMS.length} leads recovered
        </h2>

        {/* Progress bar */}
        <div className="mx-auto mt-4 h-1 w-48 overflow-hidden rounded-full bg-[var(--noir-line)]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="h-full rounded-full bg-gradient-to-r from-[var(--noir-gold-dim)] to-[var(--noir-gold)]"
          />
        </div>
        <p className="font-type mt-1.5 text-[10px] uppercase tracking-widest text-[var(--noir-fog-dim)]">
          {pct}% complete
        </p>
      </motion.div>

      {/* Evidence cards with red string spine */}
      <div className="relative mt-10 w-full max-w-xl">

        {/* The red thread line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          className="absolute left-5 top-6 bottom-6 w-[2px] origin-top thread-line"
        />

        <div className="space-y-3 pl-14">
          {ROOMS.map((r, i) => {
            const found = i < solvedCount;
            const isNew = i === solvedCount - 1;
            const upcoming = i === solvedCount;

            return (
              <motion.div
                key={r.id}
                initial={isNew ? { opacity: 0, x: -20 } : false}
                animate={{
                  opacity: found ? 1 : upcoming ? 0.5 : 0.22,
                  x: 0,
                }}
                transition={{ duration: 0.5, delay: isNew ? 0.15 : 0 }}
                className="relative"
              >
                {/* Pin on the thread */}
                <div className={`absolute -left-[2.35rem] top-4 flex h-5 w-5 items-center justify-center ${found ? "" : "opacity-40 grayscale"}`}>
                  {found ? (
                    <motion.div
                      initial={isNew ? { scale: 0 } : false}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.3 }}
                    >
                      <CheckCircle2 className="h-4 w-4 text-[var(--noir-gold)]" />
                    </motion.div>
                  ) : (
                    <Circle className="h-4 w-4 text-[var(--noir-fog-dim)]" />
                  )}
                </div>

                {/* Card */}
                <motion.div
                  animate={isNew ? {
                    boxShadow: [
                      "0 0 0 0 rgba(217,178,106,0)",
                      "0 0 0 4px rgba(217,178,106,0.3)",
                      "0 0 0 2px rgba(217,178,106,0.15)",
                    ]
                  } : {}}
                  transition={{ duration: 1.5, delay: 0.4, repeat: isNew ? 2 : 0 }}
                  className={`paper rounded-lg p-4 ${
                    isNew
                      ? "ring-2 ring-[var(--noir-gold)]/60 ring-offset-2 ring-offset-transparent"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <span className="font-type text-[10px] uppercase tracking-[0.2em] text-[var(--noir-thread)]">
                        {r.fileNo}
                      </span>
                      <p className="mt-1 text-[14px] leading-snug text-[var(--noir-ink-text)]">
                        {found ? `"${r.lead}"` : <span className="italic text-[var(--noir-ink-text)]/40">Evidence still scattered…</span>}
                      </p>
                    </div>
                    {found && (
                      <motion.div
                        initial={isNew ? { opacity: 0, scale: 0.7 } : false}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="shrink-0 rounded-full bg-[var(--noir-gold)]/15 px-2.5 py-1 font-type text-[9px] uppercase tracking-widest text-[var(--noir-gold)]"
                      >
                        {r.recovered}
                      </motion.div>
                    )}
                  </div>
                  {upcoming && (
                    <p className="mt-2 font-type text-[9px] uppercase tracking-widest text-[var(--noir-fog-dim)]/60">
                      Next case file →
                    </p>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CTA button */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.04, boxShadow: "0 20px 50px -18px rgba(217,178,106,0.5)" }}
        whileTap={{ scale: 0.97 }}
        onClick={onContinue}
        className="font-type mt-10 inline-flex items-center gap-2.5 rounded-full bg-[var(--noir-paper)] px-8 py-4 text-[13px] uppercase tracking-[0.2em] text-[var(--noir-ink)] shadow-[0_16px_40px_-16px_rgba(217,178,106,0.4)] transition-all"
      >
        {lastFile ? (
          <>Name the missing user <MapPin className="h-4 w-4" /></>
        ) : (
          <>Open next case file <ArrowRight className="h-4 w-4" /></>
        )}
      </motion.button>
    </div>
  );
}
