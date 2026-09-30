import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertCircle, Lock, Unlock } from "lucide-react";

interface PasswordModuleProps {
  roomIndex: number;
  onSuccess: () => void;
  onError: (attempt: string) => void;
  label?: string;
}

const PASSWORDS: Record<number, string> = {
  1: "OBSERVE",
  2: "CLARITY",
  3: "CONFIDENCE",
  4: "APRH",
  5: "USERFOUND",
};

export function PasswordModule({ roomIndex, onSuccess, onError, label }: PasswordModuleProps) {
  const [input, setInput] = useState("");
  const [errorState, setErrorState] = useState(false);
  const [successState, setSuccessState] = useState(false);
  const [locked, setLocked] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (locked) return;

    const normalized = input.trim().toUpperCase();
    if (normalized === PASSWORDS[roomIndex]) {
      setSuccessState(true);
      setLocked(true);
      setTimeout(() => onSuccess(), 650);
    } else {
      onError(input);
      setAttempts((a) => a + 1);
      setErrorState(true);
      setLocked(true);
      setTimeout(() => {
        setErrorState(false);
        setLocked(false);
      }, 1100);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-sm mx-auto">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <label className="font-type text-[10px] uppercase tracking-[0.28em] text-[var(--noir-gold)]">
          {label ?? "Recovered Keyword"}
        </label>
        {attempts > 0 && !successState && (
          <span className="font-type text-[9px] uppercase tracking-widest text-[var(--noir-thread)]/70">
            {attempts} wrong {attempts === 1 ? "attempt" : "attempts"}
          </span>
        )}
      </div>

      {/* Input + button row */}
      <div className="flex gap-2">
        {/* Lock icon */}
        <div className="flex shrink-0 items-center justify-center w-10 h-[48px] rounded border border-[var(--noir-line)] bg-[var(--noir-graphite)]">
          <AnimatePresence mode="wait">
            {successState ? (
              <motion.div key="unlock" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                <Unlock className="h-4 w-4 text-[var(--noir-gold)]" />
              </motion.div>
            ) : (
              <motion.div key="lock" animate={errorState ? { rotate: [-8, 8, -6, 6, 0] } : {}}>
                <Lock className={`h-4 w-4 ${errorState ? "text-red-400" : "text-[var(--noir-fog-dim)]"}`} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={locked}
          animate={errorState ? { x: [-10, 10, -8, 8, -4, 4, 0] } : successState ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: errorState ? 0.45 : 0.3 }}
          className={`flex-1 px-4 py-3 rounded border font-mono text-center tracking-[0.22em] uppercase outline-none text-[15px] transition-all duration-300 h-[48px] ${
            successState
              ? "bg-[var(--noir-gold)]/12 border-[var(--noir-gold)]/60 text-[var(--noir-gold)] shadow-[0_0_16px_rgba(217,178,106,0.2)]"
              : errorState
                ? "bg-red-950/30 border-red-500/70 text-red-400"
                : "bg-[var(--noir-paper)] text-[var(--noir-ink-text)] border-[var(--noir-ink-dim)] focus:border-[var(--noir-gold)] focus:shadow-[0_0_12px_rgba(217,178,106,0.15)]"
          }`}
          placeholder="ENTER PASSWORD"
        />

        <motion.button
          type="submit"
          disabled={locked || !input.trim()}
          whileHover={!locked && input.trim() ? { scale: 1.04 } : {}}
          whileTap={!locked && input.trim() ? { scale: 0.96 } : {}}
          className={`shrink-0 px-5 py-3 rounded font-type text-[11px] uppercase tracking-widest transition-all duration-300 h-[48px] ${
            successState
              ? "bg-[var(--noir-gold)] text-[var(--noir-ink)]"
              : "bg-[var(--noir-ink)] text-[var(--noir-paper)] hover:bg-[var(--noir-gold)] hover:text-[var(--noir-ink)] disabled:opacity-40 disabled:cursor-not-allowed"
          }`}
        >
          {successState ? <CheckCircle2 className="h-4 w-4" /> : "Submit"}
        </motion.button>
      </div>

      {/* Status message */}
      <AnimatePresence mode="wait">
        {errorState && (
          <motion.div
            key="err"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 font-type text-[10px] uppercase tracking-widest text-red-400"
          >
            <AlertCircle className="h-3 w-3 shrink-0" />
            Incorrect keyword — check your evidence
          </motion.div>
        )}
        {successState && (
          <motion.div
            key="ok"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 font-type text-[10px] uppercase tracking-widest text-[var(--noir-gold)]"
          >
            <CheckCircle2 className="h-3 w-3 shrink-0" />
            Keyword verified — lead secured
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
