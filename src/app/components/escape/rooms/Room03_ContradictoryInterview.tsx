import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FolderClosed, FolderOpen, CheckCircle2, Lock } from "lucide-react";
import { RoomShell } from "../RoomShell";
import { ROOMS } from "../gameData";
import { PasswordModule } from "../PasswordModule";
import { CaseBrief, HintFolder, LockedCaseCard, NoteCard } from "../ui";
import { Stack, Typography } from "@mui/material";

interface Props {
  onComplete: () => void;
}

type CardType = "insight" | "assumption";
type Zone = "insights" | "assumptions";

interface EvidenceCard {
  id: string;
  letter?: string;
  title: string;
  text: string;
  type: CardType;
  rotate: number;
  tag: string;
}

const INSIGHT_CARDS: EvidenceCard[] = [
  { id: "i1", letter: "C", title: "Comparison Behaviour",   text: "Users compare multiple healthcare plans before making a decision.", type: "insight", rotate: -2, tag: "Behavioural Finding" },
  { id: "i2", letter: "O", title: "Option Confusion",        text: "Users struggle to understand differences between similar plans.",   type: "insight", rotate:  1, tag: "Usability Observation" },
  { id: "i3", letter: "N", title: "Need For Guidance",       text: "Users actively look for recommendations before choosing.",          type: "insight", rotate: -1, tag: "User Motivation" },
  { id: "i4", letter: "F", title: "Fear Of Mistakes",        text: "Users worry about selecting the wrong coverage.",                   type: "insight", rotate:  2, tag: "Emotional Pattern" },
  { id: "i5", letter: "I", title: "Information Overload",    text: "Too many details make plan selection difficult.",                   type: "insight", rotate: -2, tag: "Cognitive Load" },
  { id: "i6", letter: "D", title: "Decision Hesitation",     text: "Users pause before committing to a final plan.",                   type: "insight", rotate:  1, tag: "Behavioural Finding" },
  { id: "i7", letter: "E", title: "Enrollment Anxiety",      text: "Users seek reassurance before enrolling.",                         type: "insight", rotate: -1, tag: "Emotional Pattern" },
  { id: "i8", letter: "N", title: "Need For Reassurance",    text: "Users want confidence before pressing submit.",                    type: "insight", rotate:  2, tag: "User Motivation" },
  { id: "i9", letter: "C", title: "Coverage Uncertainty",    text: "Users revisit coverage information several times.",                type: "insight", rotate: -2, tag: "Usability Observation" },
  { id: "i10",letter: "E", title: "Example Seeking",         text: "Users complete enrollment faster when examples are shown.",        type: "insight", rotate:  1, tag: "Behavioural Finding" },
];

const ASSUMPTION_CARDS: EvidenceCard[] = [
  { id: "a1", title: "Speed Is Everything",  text: "Users only care about speed.",                      type: "assumption", rotate: -1, tag: "Stakeholder View" },
  { id: "a2", title: "More Is Better",       text: "More plans increase confidence.",                   type: "assumption", rotate:  2, tag: "Stakeholder View" },
  { id: "a3", title: "Interface Clarity",    text: "The interface is already clear.",                   type: "assumption", rotate: -2, tag: "Stakeholder View" },
  { id: "a4", title: "Low Detail Interest",  text: "Users rarely read plan details.",                   type: "assumption", rotate:  1, tag: "Stakeholder View" },
  { id: "a5", title: "Visual Fix",           text: "Visual redesign alone will solve the issue.",        type: "assumption", rotate: -1, tag: "Stakeholder View" },
];

// All 15 cards scrambled — assumptions buried among insights, no discernible pattern
const ALL_CARDS: EvidenceCard[] = [
  ASSUMPTION_CARDS[2], // Interface Clarity      ← assumption hidden near top
  INSIGHT_CARDS[3],    // Fear Of Mistakes
  INSIGHT_CARDS[0],    // Comparison Behaviour
  ASSUMPTION_CARDS[0], // Speed Is Everything    ← assumption in position 4
  INSIGHT_CARDS[6],    // Enrollment Anxiety
  INSIGHT_CARDS[1],    // Option Confusion
  ASSUMPTION_CARDS[3], // Low Detail Interest    ← assumption in position 7
  INSIGHT_CARDS[8],    // Coverage Uncertainty
  ASSUMPTION_CARDS[1], // More Is Better         ← assumption in position 9
  INSIGHT_CARDS[5],    // Decision Hesitation
  INSIGHT_CARDS[2],    // Need For Guidance
  ASSUMPTION_CARDS[4], // Visual Fix             ← assumption in position 12
  INSIGHT_CARDS[7],    // Need For Reassurance
  INSIGHT_CARDS[4],    // Information Overload
  INSIGHT_CARDS[9],    // Example Seeking
];

// CONFIDENCE scrambled
const INITIAL_LETTERS = ["N", "C", "E", "I", "D", "O", "F", "E", "C", "N"];

const HINTS = [
  "Focus on statements backed by observed user behaviour — not opinions about users.",
  "Assumptions express certainty without evidence. Insights describe a pattern of struggle.",
  "Take the first letter of each verified insight, in order, to form the next keyword.",
];

/* ─────────────────────────────────────────────────────────────── */
/* Letter tile strip                                               */
/* ─────────────────────────────────────────────────────────────── */
function LetterStrip({ letters, onChange }: { letters: string[]; onChange: (next: string[]) => void }) {
  const dragSrc = useRef<number | null>(null);
  const [over, setOver] = useState<number | null>(null);

  const swap = (a: number, b: number) => {
    if (a === b) return;
    const n = [...letters];
    [n[a], n[b]] = [n[b], n[a]];
    onChange(n);
  };

  const word = letters.join("");
  const correct = word === "CONFIDENCE";

  return (
    <div>
      <p className="mb-3 font-type text-[9px] uppercase tracking-[0.22em] text-[var(--noir-gold)]">
        Drag tiles · assemble the keyword
      </p>
      <div className="flex flex-wrap gap-1.5">
        {letters.map((ch, i) => (
          <div
            key={i}
            draggable
            onDragStart={() => { dragSrc.current = i; }}
            onDragEnd={() => { dragSrc.current = null; setOver(null); }}
            onDragOver={(e) => { e.preventDefault(); setOver(i); }}
            onDragLeave={() => setOver(null)}
            onDrop={(e) => {
              e.preventDefault();
              if (dragSrc.current !== null) swap(dragSrc.current, i);
              setOver(null);
            }}
            className={`flex h-10 w-10 cursor-grab select-none items-center justify-center rounded border-2 font-mono text-[15px] font-bold shadow-sm transition-all active:cursor-grabbing active:scale-110 ${
              correct
                ? "border-[var(--noir-gold)] bg-[var(--noir-gold)] text-[var(--noir-ink)]"
                : over === i
                  ? "scale-105 border-[var(--noir-gold)] bg-[var(--noir-gold)]/15 text-[var(--noir-ink-text)]"
                  : "border-[var(--noir-gold)]/40 bg-[var(--noir-paper)] text-[var(--noir-ink-text)] hover:border-[var(--noir-gold)]"
            }`}
          >
            {ch}
          </div>
        ))}
      </div>
      {correct && (
        <p className="mt-3 font-type text-[10px] uppercase tracking-widest text-[var(--noir-gold)]">
          Keyword assembled — enter it below to close this case.
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* Evidence card                                                   */
/* ─────────────────────────────────────────────────────────────── */
function Card({ card, flash, onDragStart }: { card: EvidenceCard; flash: boolean; onDragStart: () => void }) {
  return (
    <motion.div
      layout
      key={card.id}
      exit={{ scale: 0.8, opacity: 0 }}
      animate={flash ? { x: [-6, 6, -4, 4, 0], backgroundColor: ["#f8d0d0", "#fef2f2", "#f8d0d0"] } : {}}
      transition={{ duration: 0.35 }}
      draggable
      onDragStart={onDragStart}
      style={{ rotate: `${card.rotate}deg` }}
      className="relative cursor-grab select-none rounded-sm border border-black/10 bg-[var(--noir-paper)] p-3 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.7)] active:cursor-grabbing active:shadow-xl"
    >
      {/* Top tape strip */}
      <div className="absolute -top-1.5 left-1/2 h-3 w-8 -translate-x-1/2 rounded-sm bg-[#d4b87a]/40" />

      {/* Tag */}
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className="rounded-sm bg-[var(--noir-ink)]/8 px-1.5 py-0.5 font-type text-[7px] uppercase tracking-[0.18em] text-[var(--noir-ink-text)]/50">
          {card.tag}
        </span>
      </div>

      {/* Title */}
      <p className="font-display text-[11px] font-semibold leading-tight text-[var(--noir-ink-text)]">
        {card.title}
      </p>

      {/* Body */}
      <p className="mt-1 font-type text-[9px] leading-relaxed tracking-wide text-[var(--noir-ink-text)]/70">
        {card.text}
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* Placed card (stamped)                                           */
/* ─────────────────────────────────────────────────────────────── */
function PlacedCard({ card, onReturn }: { card: EvidenceCard; onReturn: () => void }) {
  const isInsight = card.type === "insight";
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="relative cursor-pointer rounded-sm border border-black/10 bg-[var(--noir-paper)] p-2.5 shadow-md"
      onClick={onReturn}
      title="Click to return to pool"
    >
      {/* Stamp */}
      <div className={`absolute -right-1 -top-1 z-10 rotate-[8deg] rounded border-2 px-1.5 py-0.5 font-mono text-[7px] font-bold uppercase tracking-widest ${
        isInsight
          ? "border-emerald-600/70 text-emerald-700 bg-emerald-50"
          : "border-[var(--noir-thread)]/60 text-[var(--noir-thread)] bg-red-50 line-through"
      }`}>
        {isInsight ? "VERIFIED" : "REMOVED"}
      </div>

      <p className="font-display text-[10px] font-semibold leading-tight text-[var(--noir-ink-text)]">
        {card.title}
      </p>
      {isInsight && card.letter && (
        <span className="mt-1 block font-mono text-[18px] font-bold leading-none text-[var(--noir-gold)]">
          {card.letter}
        </span>
      )}
      <p className="mt-1 font-type text-[8px] leading-snug text-[var(--noir-ink-text)]/55">
        {card.text}
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* Main room                                                       */
/* ─────────────────────────────────────────────────────────────── */
export function Room03_ContradictoryInterview({ onComplete }: Props) {
  const [zone, setZone] = useState<Record<string, Zone>>({});
  const [flashId, setFlashId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<Zone | null>(null);
  const [letters, setLetters] = useState(INITIAL_LETTERS);
  const [hintLevel, setHintLevel] = useState(0);
  const [solved, setSolved] = useState(false);
  const dragging = useRef<string | null>(null);

  const pool = ALL_CARDS.filter((c) => !zone[c.id]);
  const insightZone = ALL_CARDS.filter((c) => zone[c.id] === "insights");
  const assumptionZone = ALL_CARDS.filter((c) => zone[c.id] === "assumptions");

  const allSorted = useMemo(
    () => ALL_CARDS.every((c) => zone[c.id] === (c.type === "insight" ? "insights" : "assumptions")),
    [zone],
  );

  const handleDrop = (target: Zone) => {
    const id = dragging.current;
    if (!id) return;
    dragging.current = null;
    setDragOver(null);

    const card = ALL_CARDS.find((c) => c.id === id);
    if (!card) return;

    const correct = (card.type === "insight" && target === "insights") || (card.type === "assumption" && target === "assumptions");

    if (correct) {
      setZone((prev) => ({ ...prev, [id]: target }));
    } else {
      setFlashId(id);
      setTimeout(() => setFlashId(null), 500);
    }
  };

  const returnCard = (id: string) => {
    if (solved) return;
    setZone((prev) => {
      const n = { ...prev };
      delete n[id];
      return n;
    });
  };

  const handlePasswordSuccess = () => {
    setSolved(true);
    setTimeout(onComplete, 2200);
  };

  const wordCorrect = letters.join("") === "CONFIDENCE";

  return (
    <RoomShell
      meta={ROOMS[2]}
      hint="Separate what users said from what stakeholders assumed. Assumptions belong in quarantine."
      solved={solved}
      onAdvance={onComplete}
    >
      <div className="flex flex-col gap-5 pb-28">

        {/* ── Case Brief ── */}
        <CaseBrief kicker="Case 03-CI · Research Interview Archive" notes={["Evidence over assumptions.", "Sort carefully.", "Truth is in the pattern."]}>
          The interview archive has been mixed together. Some statements came from users.
          Others came from stakeholder assumptions. Separate fact from assumption to uncover the next clue.
        </CaseBrief>

        {/* ── Progress bar ── */}
        <div className="shrink-0 flex items-center gap-3 px-1">
          <span className="font-type text-[9px] uppercase tracking-widest text-[var(--noir-fog-dim)]">
            {ALL_CARDS.length - pool.length}/{ALL_CARDS.length} sorted
          </span>
          <div className="flex-1 h-1 rounded-full bg-[var(--noir-line)]">
            <motion.div
              className="h-full rounded-full bg-[var(--noir-gold)]"
              animate={{ width: `${((ALL_CARDS.length - pool.length) / ALL_CARDS.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          {allSorted && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-type text-[9px] uppercase tracking-widest text-emerald-500">
              Archive sorted ✓
            </motion.span>
          )}
        </div>

        {/* ── Main 3-column board ── */}
        <div className="grid shrink-0 grid-cols-1 gap-4 lg:grid-cols-3">

          {/* LEFT: Evidence Pool */}
          <section
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              // returning a placed card to pool via drop (drag from zone back)
              const id = e.dataTransfer.getData("text/plain");
              if (id) returnCard(id);
            }}
            className="flex flex-col rounded-xl border border-[var(--noir-line)] bg-black/25 shadow-inner"
          >
            <div className="flex items-center justify-between border-b border-[var(--noir-line)] px-4 py-3">
              <div>
                <h2 className="font-type text-[11px] uppercase tracking-[0.2em] text-[var(--noir-gold)]">Evidence Pool</h2>
                <p className="font-type text-[8px] uppercase tracking-widest text-[var(--noir-fog-dim)]">
                  {pool.length} card{pool.length !== 1 ? "s" : ""} remaining · drag to sort
                </p>
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--noir-gold)]/30 bg-[var(--noir-gold)]/8">
                <span className="font-mono text-[11px] font-bold text-[var(--noir-gold)]">{pool.length}</span>
              </div>
            </div>

            <div className="min-h-[220px] overflow-y-auto p-3">
              <div className="grid grid-cols-2 gap-3">
                <AnimatePresence>
                  {pool.map((card) => (
                    <Card
                      key={card.id}
                      card={card}
                      flash={flashId === card.id}
                      onDragStart={() => { dragging.current = card.id; }}
                    />
                  ))}
                </AnimatePresence>
                {pool.length === 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full py-10 text-center font-type text-[10px] uppercase tracking-widest text-[var(--noir-fog-dim)]"
                  >
                    Pool cleared.
                  </motion.p>
                )}
              </div>
            </div>
          </section>

          {/* CENTER: Verified Insights */}
          <section
            onDragOver={(e) => { e.preventDefault(); setDragOver("insights"); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={(e) => { e.preventDefault(); dragging.current = e.dataTransfer.getData("text/plain") || dragging.current; handleDrop("insights"); }}
            className={`flex flex-col rounded-xl border-2 transition-colors duration-200 ${
              dragOver === "insights"
                ? "border-emerald-500/60 bg-emerald-950/30"
                : insightZone.length > 0 && insightZone.every((c) => c.type === "insight")
                  ? "border-emerald-600/40 bg-emerald-950/15"
                  : "border-dashed border-[var(--noir-line)] bg-black/15"
            }`}
          >
            <div className="flex items-center justify-between border-b border-[var(--noir-line)]/60 px-4 py-3">
              <div>
                <h2 className="font-type text-[11px] uppercase tracking-[0.2em] text-emerald-400">Verified Insights</h2>
                <p className="font-type text-[8px] uppercase tracking-widest text-[var(--noir-fog-dim)]">
                  User-backed research findings
                </p>
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/8">
                <span className="font-mono text-[11px] font-bold text-emerald-400">{insightZone.length}</span>
              </div>
            </div>

            <div className="min-h-[220px] overflow-y-auto p-3">
              {insightZone.length === 0 ? (
                <div className="flex h-full min-h-[160px] items-center justify-center">
                  <p className="text-center font-type text-[9px] uppercase tracking-widest text-[var(--noir-fog-dim)]/60">
                    Drop user research<br />findings here
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <AnimatePresence>
                    {insightZone.map((card) => (
                      <PlacedCard key={card.id} card={card} onReturn={() => returnCard(card.id)} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </section>

          {/* RIGHT: Quarantined Assumptions */}
          <section
            onDragOver={(e) => { e.preventDefault(); setDragOver("assumptions"); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={(e) => { e.preventDefault(); dragging.current = e.dataTransfer.getData("text/plain") || dragging.current; handleDrop("assumptions"); }}
            className={`flex flex-col rounded-xl border-2 transition-colors duration-200 ${
              dragOver === "assumptions"
                ? "border-[var(--noir-thread)]/60 bg-red-950/30"
                : assumptionZone.length > 0
                  ? "border-[var(--noir-thread)]/40 bg-red-950/15"
                  : "border-dashed border-[var(--noir-line)] bg-black/15"
            }`}
          >
            <div className="flex items-center justify-between border-b border-[var(--noir-line)]/60 px-4 py-3">
              <div>
                <h2 className="font-type text-[11px] uppercase tracking-[0.2em] text-[var(--noir-thread)]">Quarantined Assumptions</h2>
                <p className="font-type text-[8px] uppercase tracking-widest text-[var(--noir-fog-dim)]">
                  Stakeholder opinions, not evidence
                </p>
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--noir-thread)]/30 bg-[var(--noir-thread)]/8">
                <span className="font-mono text-[11px] font-bold text-[var(--noir-thread)]">{assumptionZone.length}</span>
              </div>
            </div>

            <div className="min-h-[220px] overflow-y-auto p-3">
              {assumptionZone.length === 0 ? (
                <div className="flex h-full min-h-[160px] items-center justify-center">
                  <p className="text-center font-type text-[9px] uppercase tracking-widest text-[var(--noir-fog-dim)]/60">
                    Drop stakeholder<br />assumptions here
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  <AnimatePresence>
                    {assumptionZone.map((card) => (
                      <PlacedCard key={card.id} card={card} onReturn={() => returnCard(card.id)} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ── Researcher Note + Letter Assembly (revealed on completion) ── */}
        <AnimatePresence>
          {allSorted && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="shrink-0 overflow-hidden rounded-xl border border-[var(--noir-gold)]/30 bg-[var(--noir-graphite)] shadow-xl"
            >
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-[var(--noir-line)] px-5 py-3">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-[var(--noir-gold)]/15">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[var(--noir-gold)]" />
                </div>
                <div>
                  <p className="font-type text-[11px] uppercase tracking-[0.2em] text-[var(--noir-gold)]">
                    Research Archive Restored — Hidden Note Recovered
                  </p>
                  <p className="font-type text-[8px] uppercase tracking-widest text-[var(--noir-fog-dim)]">
                    All evidence verified · All assumptions quarantined
                  </p>
                </div>
                <div className="ml-auto rotate-[-3deg] rounded border-2 border-[var(--noir-gold)]/50 px-2 py-0.5 font-type text-[8px] uppercase text-[var(--noir-gold)]/70">
                  Classified
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-2">
                {/* Researcher note */}
                <NoteCard kicker="Recovered · Researcher's final note">
                  <p>&ldquo;Good research reveals patterns.</p>
                  <p>Take the <span className="underline decoration-[#d4f36b] underline-offset-2">first letter</span> of every verified insight.</p>
                  <p>The letters form your next archive keyword.&rdquo;</p>
                </NoteCard>

                {/* Letter assembly */}
                <div>
                  <p className="mb-3 font-type text-[10px] uppercase tracking-[0.22em] text-[var(--noir-gold)]">
                    Scrambled Recovery Tiles
                  </p>
                  <p className="mb-4 font-type text-[8px] uppercase tracking-widest text-[var(--noir-fog-dim)]">
                    Arrange the letters into the correct keyword order
                  </p>
                  <LetterStrip letters={letters} onChange={setLetters} />
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── Hint folder ── */}
        <HintFolder
          title="Research folder"
          hints={HINTS}
          level={hintLevel}
          onReveal={() => setHintLevel((l) => Math.min(HINTS.length, l + 1))}
          footer={
            !allSorted && (
              <Stack direction="row" alignItems="center" gap={1}>
                <Lock size={12} />
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {pool.length} card{pool.length !== 1 ? "s" : ""} unsorted
                </Typography>
              </Stack>
            )
          }
        />

        {/* ── Password area ── */}
        <section className={`shrink-0 rounded-xl border p-5 transition-all duration-500 ${
          wordCorrect ? "border-[var(--noir-line)] bg-black/20" : "border-[var(--noir-line)]/40 bg-black/10"
        }`}>
          <div className={`transition-all duration-500 ${!wordCorrect ? "pointer-events-none opacity-35 blur-[1.5px]" : ""}`}>
            <PasswordModule
              roomIndex={3}
              onSuccess={handlePasswordSuccess}
              onError={() => undefined}
              label="Recovered Archive Keyword"
            />
          </div>
          {!wordCorrect && (
            <p className="mt-2 text-center font-type text-[9px] uppercase tracking-widest text-[var(--noir-fog-dim)]/50">
              {!allSorted ? "Sort all evidence to unlock" : "Arrange the keyword tiles to unlock"}
            </p>
          )}
        </section>

        {/* ── Next case preview ── */}
        <LockedCaseCard label="Case File 04" title="The Lost Navigation Blueprint" requirement="Requires research archive recovery." />

      </div>
    </RoomShell>
  );
}
