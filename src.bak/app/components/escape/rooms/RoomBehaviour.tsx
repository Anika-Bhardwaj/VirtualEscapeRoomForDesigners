import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, FolderClosed, FolderOpen, AlertCircle } from "lucide-react";
import { RoomShell } from "../RoomShell";
import { ROOMS } from "../gameData";
import { PasswordModule } from "../PasswordModule";

interface Props {
  onComplete: () => void;
}

type ChainSlot = "trigger" | "behaviour" | "outcome";

interface Evidence {
  id: string;
  num: string;
  tag: string;
  title: string;
  text: string;
  correctSlot?: ChainSlot;
}

const EVIDENCE: Evidence[] = [
  {
    id: "e_heatmap",
    num: "001",
    tag: "Heatmap · Upload Screen",
    title: "Cursor Confusion Around Instructions",
    text: "High cursor density around the upload format note. Users repeatedly hover over the file requirement text as if re-reading it, then pause before abandoning.",
  },
  {
    id: "e_memo",
    num: "002",
    tag: "Stakeholder Memo · Submitted",
    title: "\"The Form Is Too Long\"",
    text: "Stakeholder assumption: \"We need to reduce the number of fields in the enrollment form. Users are clearly overwhelmed by the length of the form.\"",
  },
  {
    id: "e_format",
    num: "003",
    tag: "Error Log · Upload Step",
    title: "Unsupported Format Errors",
    text: "File format rejection errors spike 340% at the document upload step. PNG, BMP, and HEIC files are rejected silently with no user-facing explanation.",
    correctSlot: "trigger",
  },
  {
    id: "e_interview",
    num: "004",
    tag: "User Interview · Participant 04",
    title: "Plan Name Confusion",
    text: "\"I wasn't sure which plan was right for me — the names all sounded the same. But once I picked one, everything was straightforward until the upload.\"",
  },
  {
    id: "e_attempts",
    num: "005",
    tag: "Session Replay Analysis",
    title: "Repeated Upload Attempts",
    text: "Users make 3–5 repeated attempts in the upload area before abandoning. Median time stuck at upload: 4 minutes 12 seconds.",
    correctSlot: "behaviour",
  },
  {
    id: "e_replay",
    num: "006",
    tag: "Session Recording #2291",
    title: "User Navigates Back",
    text: "User hesitates 45 seconds at the upload field, navigates back to the previous screen, returns, attempts once, then closes the browser entirely.",
  },
  {
    id: "e_mobile",
    num: "007",
    tag: "Device Analytics · Mobile",
    title: "78% Mobile Bounce at Upload",
    text: "Mobile users bounce at 78% on the upload screen. Upload format instructions are positioned below the fold, invisible without scrolling.",
  },
  {
    id: "e_funnel",
    num: "008",
    tag: "Conversion Funnel · Week 12",
    title: "61% Drop-off at Upload Step",
    text: "Upload Documents is the single highest abandonment point in the flow. Users who pass it complete enrollment at 89%. Those who do not — never return.",
    correctSlot: "outcome",
  },
];

const CORRECT_CHAIN: Record<ChainSlot, string> = {
  trigger: "e_format",
  behaviour: "e_attempts",
  outcome: "e_funnel",
};

const CHAIN_META: Record<ChainSlot, { num: string; label: string; sub: string }> = {
  trigger:   { num: "01", label: "Root Trigger",   sub: "What first caused the friction?" },
  behaviour: { num: "02", label: "User Behaviour", sub: "How did users respond to it?" },
  outcome:   { num: "03", label: "Final Outcome",  sub: "What was the measurable result?" },
};

interface Suspect {
  id: string;
  label: string;
  description: string;
  evidenceCount: number;
  correct: boolean;
}

const SUSPECTS: Suspect[] = [
  { id: "plan",   label: "Plan Confusion",    description: "Users unable to distinguish between available healthcare plan options.", evidenceCount: 1, correct: false },
  { id: "visual", label: "Visual Complexity", description: "Interface overwhelms users with too much information simultaneously.", evidenceCount: 1, correct: false },
  { id: "fields", label: "Too Many Fields",   description: "Form requires excessive data entry before users can proceed to submit.", evidenceCount: 1, correct: false },
  { id: "upload", label: "Document Upload",   description: "Document submission step blocks completion due to format restrictions and zero user guidance.", evidenceCount: 5, correct: true },
];

const HINTS = [
  "Look for the biggest drop in the user journey — where exactly do users leave?",
  "Repeated behaviour is a signal. What were users doing over and over?",
  "The evidence chain moves from cause to behaviour to consequence. Build it in that order.",
];

/* ─── Evidence card (archive) ───────────────────────────────── */
function EvidenceCard({
  ev,
  placed,
  onDragStart,
}: {
  ev: Evidence;
  placed: boolean;
  onDragStart: (id: string) => void;
}) {
  const isChainPiece = !!ev.correctSlot;

  return (
    <motion.div
      layout
      draggable={!placed}
      onDragStart={() => onDragStart(ev.id)}
      animate={placed ? { opacity: 0.3, scale: 0.97 } : { opacity: 1, scale: 1 }}
      className={`relative flex-shrink-0 w-64 rounded-sm border border-black/12 bg-[var(--noir-paper)] p-4 shadow-md transition-shadow ${
        placed ? "cursor-default" : isChainPiece ? "cursor-grab active:cursor-grabbing hover:shadow-lg" : "cursor-grab active:cursor-grabbing"
      }`}
      style={{ rotate: `${ev.id === "e_memo" ? 1 : ev.id === "e_interview" ? -1 : 0}deg` }}
    >
      {/* Top tape strip */}
      <div className="absolute -top-1.5 left-1/2 h-3 w-10 -translate-x-1/2 rounded-sm bg-[#d4b87a]/35" />

      {/* Evidence number + chain indicator */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-mono text-[9px] font-bold text-[var(--noir-ink-text)]/30">
          EVD-{ev.num}
        </span>
        {isChainPiece && !placed && (
          <span className="rounded bg-[var(--noir-gold)]/15 px-1.5 py-0.5 font-type text-[7px] uppercase tracking-widest text-[var(--noir-gold)]">
            Chain Evidence
          </span>
        )}
        {placed && (
          <span className="font-type text-[7px] uppercase tracking-widest text-[var(--noir-ink-text)]/30">
            Filed
          </span>
        )}
      </div>

      {/* Tag */}
      <p className="mb-1.5 font-type text-[8px] uppercase tracking-[0.18em] text-[var(--noir-ink-text)]/50">
        {ev.tag}
      </p>

      {/* Title */}
      <p className="mb-2 font-display text-[13px] font-semibold leading-tight text-[var(--noir-ink-text)]">
        {ev.title}
      </p>

      {/* Text */}
      <p className="font-type text-[10px] leading-relaxed tracking-wide text-[var(--noir-ink-text)]/65">
        {ev.text}
      </p>
    </motion.div>
  );
}

/* ─── Chain slot ─────────────────────────────────────────────── */
function ChainSlotEl({
  slot,
  placedId,
  wrong,
  chainComplete,
  onDrop,
  onReturn,
}: {
  slot: ChainSlot;
  placedId: string | null;
  wrong: boolean;
  chainComplete: boolean;
  onDrop: (slot: ChainSlot, e: React.DragEvent) => void;
  onReturn: (slot: ChainSlot) => void;
}) {
  const [over, setOver] = useState(false);
  const meta = CHAIN_META[slot];
  const placedEv = placedId ? EVIDENCE.find((e) => e.id === placedId) : null;
  const isCorrect = placedId === CORRECT_CHAIN[slot];

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { setOver(false); onDrop(slot, e); }}
      className={`relative flex flex-col rounded-xl border-2 transition-all duration-200 ${
        wrong
          ? "border-[var(--noir-thread)]/70 bg-[var(--noir-thread)]/8"
          : over
            ? "border-[var(--noir-gold)]/60 bg-[var(--noir-gold)]/8"
            : isCorrect && chainComplete
              ? "border-[var(--noir-gold)] bg-[var(--noir-gold)]/5 shadow-lg shadow-[var(--noir-gold)]/10"
              : isCorrect
                ? "border-[var(--noir-gold)]/50 bg-[var(--noir-gold)]/5"
                : "border-dashed border-[var(--noir-line)] bg-black/20"
      }`}
    >
      {/* Slot header */}
      <div className="flex items-center gap-2.5 border-b border-[var(--noir-line)]/40 px-4 py-2.5">
        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded font-mono text-[10px] font-black ${
          isCorrect ? "bg-[var(--noir-gold)] text-[var(--noir-ink)]" : "bg-[var(--noir-line)] text-[var(--noir-fog-dim)]"
        }`}>
          {meta.num}
        </span>
        <div>
          <p className={`font-type text-[10px] font-bold uppercase tracking-[0.18em] ${isCorrect ? "text-[var(--noir-gold)]" : "text-[var(--noir-fog-dim)]"}`}>
            {meta.label}
          </p>
          <p className="font-type text-[7px] uppercase tracking-widest text-[var(--noir-fog-dim)]/50">
            {meta.sub}
          </p>
        </div>
        {isCorrect && <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-[var(--noir-gold)]" />}
        {wrong && <AlertCircle className="ml-auto h-4 w-4 shrink-0 text-[var(--noir-thread)]" />}
      </div>

      {/* Content area */}
      <div className="flex min-h-[120px] flex-col justify-center p-4">
        {placedEv ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <p className="mb-0.5 font-type text-[8px] uppercase tracking-widest text-[var(--noir-ink-text)]/40">
              {placedEv.tag}
            </p>
            <p className="font-display text-[13px] font-semibold leading-tight text-[var(--noir-ink-text)]">
              {placedEv.title}
            </p>
            <p className="mt-1.5 font-type text-[10px] leading-relaxed text-[var(--noir-ink-text)]/60">
              {placedEv.text}
            </p>
            <button
              onClick={() => onReturn(slot)}
              className="mt-3 font-type text-[8px] uppercase tracking-widest text-[var(--noir-ink-text)]/30 hover:text-[var(--noir-thread)] transition-colors"
            >
              × Remove
            </button>
          </motion.div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-2 h-8 w-8 rounded-full border-2 border-dashed border-[var(--noir-line)] flex items-center justify-center">
              <span className="text-[var(--noir-fog-dim)] text-lg leading-none">+</span>
            </div>
            <p className="font-type text-[9px] uppercase tracking-widest text-[var(--noir-fog-dim)]/50">
              {over ? "Release to file" : "Drag evidence here"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Room ──────────────────────────────────────────────── */
export function RoomBehaviour({ onComplete }: Props) {
  const [chain, setChain] = useState<Record<ChainSlot, string | null>>({
    trigger: null,
    behaviour: null,
    outcome: null,
  });
  const [wrongSlot, setWrongSlot] = useState<ChainSlot | null>(null);
  const [wrongSuspect, setWrongSuspect] = useState<string | null>(null);
  const [confirmedSuspect, setConfirmedSuspect] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const dragging = useRef<string | null>(null);

  const placedIds = Object.values(chain).filter(Boolean) as string[];

  const chainComplete = (["trigger", "behaviour", "outcome"] as ChainSlot[]).every(
    (s) => chain[s] === CORRECT_CHAIN[s],
  );

  const handleDragStart = (id: string) => {
    dragging.current = id;
  };

  const handleSlotDrop = (slot: ChainSlot, e: React.DragEvent) => {
    e.preventDefault();
    const id = dragging.current;
    if (!id) return;
    dragging.current = null;

    const ev = EVIDENCE.find((ev) => ev.id === id);
    if (!ev) return;

    if (ev.correctSlot === slot) {
      setChain((prev) => ({ ...prev, [slot]: id }));
    } else {
      setWrongSlot(slot);
      setTimeout(() => setWrongSlot(null), 750);
    }
  };

  const handleReturn = (slot: ChainSlot) => {
    setChain((prev) => ({ ...prev, [slot]: null }));
  };

  const handleSuspectClick = (suspect: Suspect) => {
    if (!chainComplete) return;
    if (suspect.correct) {
      setConfirmedSuspect(suspect.id);
    } else {
      setWrongSuspect(suspect.id);
      setTimeout(() => setWrongSuspect(null), 750);
    }
  };

  const handlePasswordSuccess = () => {
    setSolved(true);
    setTimeout(onComplete, 2200);
  };

  return (
    <RoomShell
      meta={ROOMS[4]}
      hint="Build the evidence chain from root cause to outcome. Then identify the responsible suspect."
      solved={solved}
      onAdvance={onComplete}
    >
      <div className="flex flex-col gap-6 pb-28">

        {/* ── 1. Case Brief ── */}
        <section className="paper paper-edge relative shrink-0 rounded-lg border border-black/10 px-5 py-4 shadow-xl">
          <div className="absolute -top-3 left-8 h-7 w-20 rotate-[-2deg] bg-[#d7c69b]/60 shadow" />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-type text-[10px] uppercase tracking-[0.24em] text-[var(--noir-thread)]">
                Case 05-BT · Behaviour Trail · Final Archive
              </p>
              <p className="mt-2 max-w-xl font-display text-lg leading-snug text-[var(--noir-ink-text)]">
                Eight pieces of recovered evidence. One true cause. Build the chain.
                Identify the suspect. Close the case.
              </p>
            </div>
            <div className="w-36 shrink-0 rotate-[1.5deg] bg-[var(--noir-note-3)] p-3 shadow-md" aria-hidden>
              <p className="font-type text-[8px] uppercase tracking-[0.14em] text-black/40">Lead investigator</p>
              <p className="mt-1 font-display text-[10px] leading-snug text-[var(--noir-ink-text)]">"The evidence always tells the truth."</p>
              <p className="mt-0.5 font-display text-[10px] leading-snug text-[var(--noir-ink-text)]">"Assumptions do not."</p>
            </div>
          </div>
        </section>

        {/* ── 2. Evidence Archive ── */}
        <section className="shrink-0">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-type text-[11px] uppercase tracking-[0.2em] text-[var(--noir-gold)]">
                Evidence Archive
              </h2>
              <p className="font-type text-[8px] uppercase tracking-widest text-[var(--noir-fog-dim)]">
                {EVIDENCE.length} recovered items · drag chain evidence onto the investigation board below
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[var(--noir-gold)]" />
              <span className="font-type text-[8px] uppercase tracking-widest text-[var(--noir-gold)]">Chain Evidence</span>
              <div className="ml-3 h-2 w-2 rounded-full bg-[var(--noir-fog-dim)]/40" />
              <span className="font-type text-[8px] uppercase tracking-widest text-[var(--noir-fog-dim)]">Context</span>
            </div>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="flex gap-4" style={{ minWidth: "max-content" }}>
              {EVIDENCE.map((ev) => (
                <EvidenceCard
                  key={ev.id}
                  ev={ev}
                  placed={placedIds.includes(ev.id)}
                  onDragStart={handleDragStart}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. Investigation Board ── */}
        <section
          className="shrink-0 rounded-2xl border border-[var(--noir-line)] shadow-2xl overflow-hidden"
          style={{ background: "linear-gradient(160deg,#131008 0%,#0d0a05 100%)" }}
        >
          <div className="flex items-center justify-between border-b border-[var(--noir-line)]/40 px-5 py-3">
            <div>
              <h2 className="font-type text-[11px] uppercase tracking-[0.2em] text-[var(--noir-gold)]">
                Investigation Board
              </h2>
              <p className="font-type text-[8px] uppercase tracking-widest text-[var(--noir-fog-dim)]">
                Build the causal chain · trigger → behaviour → outcome
              </p>
            </div>
            <div className="flex gap-1.5">
              {(["trigger", "behaviour", "outcome"] as ChainSlot[]).map((slot) => (
                <div
                  key={slot}
                  className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                    chain[slot] === CORRECT_CHAIN[slot]
                      ? "bg-[var(--noir-gold)]"
                      : "bg-[var(--noir-line)]"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="p-5">
            {/* Chain — 3 slots with SVG strings between them */}
            <div className="relative">
              {/* SVG connections */}
              <svg
                className="pointer-events-none absolute inset-0 w-full"
                style={{ height: "100%" }}
                preserveAspectRatio="none"
              >
                {/* Placeholder dashed lines (before complete) */}
                {!chainComplete && (
                  <>
                    <line x1="33.5%" y1="50%" x2="66.5%" y2="50%" stroke="#d9b26a" strokeWidth="1.5" strokeDasharray="6 4" strokeOpacity="0.2" />
                  </>
                )}
                {/* Gold connecting threads (chain complete) */}
                {chainComplete && (
                  <>
                    <defs>
                      <filter id="threadglow">
                        <feGaussianBlur stdDeviation="2.5" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                    </defs>
                    <line x1="33.5%" y1="50%" x2="66.5%" y2="50%" stroke="#d9b26a" strokeWidth="2" strokeOpacity="0.9" filter="url(#threadglow)" />
                    <circle cx="33.5%" cy="50%" r="4" fill="#d9b26a" opacity="0.9" />
                    <circle cx="50%" cy="50%" r="3" fill="#d9b26a" opacity="0.6" />
                    <circle cx="66.5%" cy="50%" r="4" fill="#d9b26a" opacity="0.9" />
                  </>
                )}
              </svg>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {(["trigger", "behaviour", "outcome"] as ChainSlot[]).map((slot) => (
                  <ChainSlotEl
                    key={slot}
                    slot={slot}
                    placedId={chain[slot]}
                    wrong={wrongSlot === slot}
                    chainComplete={chainComplete}
                    onDrop={handleSlotDrop}
                    onReturn={handleReturn}
                  />
                ))}
              </div>
            </div>

            {/* Chain status */}
            <AnimatePresence>
              {chainComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center gap-2.5 rounded-lg border border-[var(--noir-gold)]/30 bg-[var(--noir-gold)]/6 px-4 py-2.5"
                >
                  <CheckCircle2 className="h-4 w-4 text-[var(--noir-gold)]" />
                  <p className="font-type text-[10px] uppercase tracking-[0.18em] text-[var(--noir-gold)]">
                    Evidence chain confirmed · identify the suspect below
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ── 4. Suspect Board ── */}
        <section className="shrink-0">
          <div className="mb-3">
            <h2 className={`font-type text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${
              chainComplete ? "text-[var(--noir-gold)]" : "text-[var(--noir-fog-dim)]"
            }`}>
              Suspect Board
            </h2>
            <p className="font-type text-[8px] uppercase tracking-widest text-[var(--noir-fog-dim)]">
              {chainComplete
                ? "Chain established · select the suspect responsible for this friction"
                : "Complete the evidence chain above to unlock suspects"}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SUSPECTS.map((suspect) => {
              const isConfirmed = confirmedSuspect === suspect.id;
              const isWrong = wrongSuspect === suspect.id;
              const isDisabled = !chainComplete;

              return (
                <motion.button
                  key={suspect.id}
                  onClick={() => handleSuspectClick(suspect)}
                  disabled={isDisabled}
                  animate={isWrong ? { x: [-6, 6, -5, 5, -3, 3, 0] } : {}}
                  transition={{ duration: 0.35 }}
                  className={`relative flex flex-col rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                    isDisabled
                      ? "cursor-not-allowed border-[var(--noir-line)]/30 bg-black/10 opacity-40"
                      : isConfirmed
                        ? "border-[var(--noir-gold)] bg-[var(--noir-gold)]/8 shadow-lg shadow-[var(--noir-gold)]/15 cursor-default"
                        : isWrong
                          ? "border-[var(--noir-thread)]/60 bg-[var(--noir-thread)]/5"
                          : "cursor-pointer border-[var(--noir-line)] bg-black/20 hover:border-[var(--noir-gold)]/40 hover:bg-[var(--noir-gold)]/4"
                  }`}
                >
                  {/* Evidence indicator */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex gap-1">
                      {Array.from({ length: suspect.evidenceCount }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 w-1.5 rounded-full ${
                            isConfirmed ? "bg-[var(--noir-gold)]" : "bg-[var(--noir-fog-dim)]/50"
                          }`}
                        />
                      ))}
                    </div>
                    {isConfirmed && <CheckCircle2 className="h-4 w-4 text-[var(--noir-gold)]" />}
                    {isWrong && <AlertCircle className="h-4 w-4 text-[var(--noir-thread)]" />}
                  </div>

                  <p className={`mb-1.5 font-display text-[14px] font-semibold leading-tight ${
                    isDisabled ? "text-[var(--noir-fog-dim)]" : isConfirmed ? "text-[var(--noir-gold)]" : "text-[var(--noir-paper)]"
                  }`}>
                    {suspect.label}
                  </p>
                  <p className={`font-type text-[9px] leading-relaxed tracking-wide ${
                    isDisabled ? "text-[var(--noir-fog-dim)]/40" : "text-[var(--noir-fog-dim)]"
                  }`}>
                    {suspect.description}
                  </p>

                  {isConfirmed && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-3 rounded border border-[var(--noir-gold)]/40 bg-[var(--noir-gold)]/10 px-2 py-1 text-center font-type text-[8px] uppercase tracking-[0.2em] text-[var(--noir-gold)]"
                    >
                      Confirmed Suspect
                    </motion.div>
                  )}
                  {isWrong && (
                    <div className="mt-3 rounded border border-[var(--noir-thread)]/40 bg-[var(--noir-thread)]/8 px-2 py-1 text-center font-type text-[8px] uppercase tracking-[0.2em] text-[var(--noir-thread)]">
                      Insufficient evidence
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* ── Hint folder ── */}
        <section className="paper shrink-0 rounded-xl border border-black/10 p-4 text-[var(--noir-ink-text)]">
          <button
            onClick={() => setHintLevel((l) => Math.min(3, l + 1))}
            className="flex w-full items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5">
              {hintLevel === 0
                ? <FolderClosed className="h-4 w-4 text-[var(--noir-ink-text)]/60" />
                : <FolderOpen className="h-4 w-4 text-[var(--noir-ink-text)]/60" />
              }
              <div className="text-left">
                <p className="font-type text-[11px] uppercase tracking-[0.18em] text-[var(--noir-ink-text)]/80">
                  Investigation File · Open Only If Needed
                </p>
                <p className="font-type text-[8px] uppercase tracking-widest text-[var(--noir-ink-text)]/40">
                  {hintLevel === 0 ? "Sealed" : `Hint ${hintLevel} of 3 revealed`}
                </p>
              </div>
            </div>
            {hintLevel < 3 && (
              <span className="shrink-0 rounded border border-black/20 px-3 py-1 font-type text-[9px] uppercase tracking-widest text-[var(--noir-ink-text)]/60 hover:bg-black/5">
                Open Hint {hintLevel + 1}
              </span>
            )}
          </button>

          <AnimatePresence>
            {hintLevel > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 flex flex-col gap-2 border-t border-black/10 pt-3">
                  {HINTS.slice(0, hintLevel).map((hint, i) => (
                    <div key={i} className="flex gap-2.5">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--noir-ink)]/8 font-mono text-[8px] text-[var(--noir-ink-text)]/50">
                        {i + 1}
                      </span>
                      <p className="font-type text-[11px] leading-relaxed text-[var(--noir-ink-text)]/70">{hint}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── 5. Final Locked Case File ── */}
        <AnimatePresence>
          {confirmedSuspect && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="shrink-0 overflow-hidden rounded-xl border border-[var(--noir-gold)]/30 bg-[var(--noir-graphite)] shadow-xl"
            >
              <div className="flex items-center gap-3 border-b border-[var(--noir-line)] px-5 py-3">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-[var(--noir-gold)]/15">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[var(--noir-gold)]" />
                </div>
                <div>
                  <p className="font-type text-[11px] uppercase tracking-[0.2em] text-[var(--noir-gold)]">
                    Case Solved — Final Evidence Recovered
                  </p>
                  <p className="font-type text-[8px] uppercase tracking-widest text-[var(--noir-fog-dim)]">
                    Suspect confirmed · Document Upload · User perspective restored
                  </p>
                </div>
                <div className="ml-auto rotate-[-3deg] rounded border-2 border-[var(--noir-gold)]/50 px-2 py-0.5 font-type text-[8px] uppercase text-[var(--noir-gold)]/70">
                  Case Closed
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-2">
                {/* Lead quote */}
                <div className="paper rounded-lg border border-black/10 p-5 shadow-md">
                  <p className="font-type text-[8px] uppercase tracking-[0.2em] text-[var(--noir-thread)]">
                    Recovered · Researcher's Closing Note
                  </p>
                  <p className="mt-3 font-display text-base leading-relaxed text-[var(--noir-ink-text)]">
                    "The user perspective was hidden beneath assumptions.
                  </p>
                  <p className="mt-2 font-display text-base leading-relaxed text-[var(--noir-ink-text)]">
                    It was not that users were confused by the plan.
                  </p>
                  <p className="mt-2 font-display text-base leading-relaxed text-[var(--noir-ink-text)]">
                    It was that the system rejected their documents and never told them why."
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="h-px flex-1 bg-black/10" />
                    <span className="font-type text-[8px] uppercase tracking-widest text-[var(--noir-ink-text)]/40">
                      Archive Ref: BT-05-FINAL
                    </span>
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col justify-center">
                  <p className="mb-2 font-type text-[10px] uppercase tracking-[0.22em] text-[var(--noir-gold)]">
                    Final Archive Code
                  </p>
                  <p className="mb-5 font-type text-[8px] uppercase tracking-widest text-[var(--noir-fog-dim)]">
                    Enter the recovered keyword to close this investigation
                  </p>
                  <PasswordModule
                    roomIndex={5}
                    onSuccess={handlePasswordSuccess}
                    onError={() => undefined}
                    label="Write as it is: UserFound"
                  />
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Locked preview (before suspect confirmed) */}
        {!confirmedSuspect && (
          <div className="paper shrink-0 relative rounded-xl p-5 text-[var(--noir-ink-text)] opacity-60">
            <div className="absolute right-4 top-3 rotate-[5deg] rounded border-2 border-[var(--noir-thread)] px-2 py-0.5 font-type text-[9px] uppercase text-[var(--noir-thread)]">
              Locked
            </div>
            <p className="font-type text-[9px] uppercase tracking-[0.2em] text-black/45">Final Case File</p>
            <p className="mt-1.5 font-display text-lg">Behaviour Trail · Resolution</p>
            <p className="mt-0.5 text-[11px] text-black/45">
              Build the evidence chain and confirm the suspect to unlock.
            </p>
          </div>
        )}

      </div>
    </RoomShell>
  );
}
