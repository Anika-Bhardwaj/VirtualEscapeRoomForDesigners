import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Square } from "lucide-react";
import { RoomShell } from "../RoomShell";
import { ROOMS } from "../gameData";
import { PasswordModule } from "../PasswordModule";

interface Props {
  onComplete: () => void;
}

/* ── Audio synthesis ─────────────────────────────────────────────── */
let _ac: AudioContext | null = null;
function getAC() {
  if (!_ac) _ac = new AudioContext();
  if (_ac.state === "suspended") _ac.resume();
  return _ac;
}

function playPianoNote(freq: number, gain = 0.55) {
  try {
    const ac = getAC();
    const now = ac.currentTime;
    const master = ac.createGain();
    master.gain.setValueAtTime(0.001, now);
    master.gain.linearRampToValueAtTime(gain, now + 0.008);
    master.gain.exponentialRampToValueAtTime(gain * 0.42, now + 0.18);
    master.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
    master.connect(ac.destination);
    (
      [
        [1, 0.55],
        [2, 0.18],
        [3, 0.10],
        [4, 0.05],
        [6, 0.02],
      ] as [number, number][]
    ).forEach(([h, g]) => {
      const osc = ac.createOscillator();
      const hg = ac.createGain();
      osc.type = "sine";
      osc.frequency.value = freq * h;
      hg.gain.value = g;
      osc.connect(hg);
      hg.connect(master);
      osc.start(now);
      osc.stop(now + 2.1);
    });
  } catch {
    /* silent fail */
  }
}

/* ── Piano data ──────────────────────────────────────────────────── */
// B and G# intentionally share the same frequency — they are the "same note" in this puzzle
const SHARED_FREQ = 493.88;

const WHITE_KEYS = [
  { note: "C",  label: "Do",  freq: 261.63 },
  { note: "D",  label: "Re",  freq: 293.66 },
  { note: "E",  label: "Mi",  freq: 329.63 },
  { note: "F",  label: "Fa",  freq: 349.23 },
  { note: "G",  label: "Sol", freq: 392.00 },
  { note: "A",  label: "La",  freq: 440.00 },
  { note: "B",  label: "Si",  freq: SHARED_FREQ },
  { note: "C5", label: "Do",  freq: 523.25 },
];

const BLACK_KEYS = [
  { note: "C#", label: "Do#", leftPct: 9.0,  freq: 277.18 },
  { note: "D#", label: "Re#", leftPct: 21.5, freq: 311.13 },
  { note: "F#", label: "Fa#", leftPct: 46.5, freq: 369.99 },
  { note: "G#", label: "Sol#",leftPct: 59.0, freq: SHARED_FREQ },
  { note: "A#", label: "La#", leftPct: 71.5, freq: 466.16 },
];

// All keys in chromatic order, each played once
const SEQUENCE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C5"];

const INITIAL_TILES = ["Y", "R", "I", "L", "A", "C", "T"]; // scrambled CLARITY

/* ── Pre-entry overlay ───────────────────────────────────────────── */
function PreEntryScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--noir-ink)]/96 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-6 w-full max-w-sm rounded-2xl border border-[var(--noir-line)] bg-[var(--noir-graphite)] p-10 text-center shadow-2xl"
      >
        {/* Top accent line */}
        <div className="absolute inset-x-0 -top-px h-px rounded-t-2xl bg-gradient-to-r from-transparent via-[var(--noir-gold)]/50 to-transparent" />

        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--noir-gold)]/25 bg-[var(--noir-ink)]">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-[var(--noir-gold)]">
            <rect x="3" y="10" width="3" height="12" rx="1.5" fill="currentColor" opacity="0.9"/>
            <rect x="8.5" y="6" width="3" height="16" rx="1.5" fill="currentColor" opacity="0.75"/>
            <rect x="14" y="3" width="3" height="19" rx="1.5" fill="currentColor"/>
            <rect x="19.5" y="7" width="3" height="15" rx="1.5" fill="currentColor" opacity="0.75"/>
            <rect x="25" y="11" width="2.5" height="11" rx="1.25" fill="currentColor" opacity="0.6"/>
          </svg>
        </div>

        <p className="font-type text-[9px] uppercase tracking-[0.28em] text-[var(--noir-thread)]">
          Case 02-MA · Music Archive
        </p>
        <h1 className="mt-2 font-display text-[28px] leading-none text-[var(--noir-paper)]">
          AUDIO REQUIRED
        </h1>

        <div className="my-6 h-px bg-[var(--noir-line)]" />

        <p className="font-type text-[11px] leading-[1.9] tracking-wide text-[var(--noir-fog)]">
          This investigation contains piano notes.
          <br />Please turn your volume on.
          <br />Listen carefully.
          <br /><br />
          One note was recorded twice.
          <br />Find the duplicate to unlock the next clue.
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onEnter}
          className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-lg bg-[var(--noir-gold)] px-6 py-3 font-type text-[11px] uppercase tracking-[0.22em] text-[var(--noir-ink)] shadow-lg"
        >
          <Play className="h-3 w-3 fill-current" />
          Begin Analysis
        </motion.button>
      </motion.div>
    </div>
  );
}

/* ── Letter tile drag-to-sort ────────────────────────────────────── */
function LetterTiles() {
  const [order, setOrder] = useState(INITIAL_TILES);
  const dragSrc = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const swap = (a: number, b: number) => {
    if (a === b) return;
    setOrder((prev) => {
      const n = [...prev];
      [n[a], n[b]] = [n[b], n[a]];
      return n;
    });
  };

  return (
    <div>
      <p className="mb-3 font-type text-[10px] uppercase tracking-[0.22em] text-[var(--noir-gold)]">
        Recovered Letter Fragments
      </p>
      <p className="mb-4 font-type text-[9px] uppercase tracking-widest text-[var(--noir-fog-dim)]">
        Drag tiles to rearrange · assemble the hidden word
      </p>

      <div className="flex gap-2">
        {order.map((letter, i) => {
          const isOver = dragOver === i;
          return (
            <div
              key={`${i}`}
              draggable
              onDragStart={() => { dragSrc.current = i; }}
              onDragEnd={() => { dragSrc.current = null; setDragOver(null); }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(i); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => {
                e.preventDefault();
                if (dragSrc.current !== null) { swap(dragSrc.current, i); dragSrc.current = null; }
                setDragOver(null);
              }}
              className={`flex h-10 w-10 cursor-grab select-none items-center justify-center rounded border-2 font-mono text-[15px] font-bold shadow-sm transition-all active:cursor-grabbing active:scale-110 ${
                isOver
                  ? "scale-105 border-[var(--noir-gold)] bg-[var(--noir-gold)]/15 text-[var(--noir-ink-text)]"
                  : "border-[var(--noir-gold)]/40 bg-[var(--noir-paper)] text-[var(--noir-ink-text)] hover:border-[var(--noir-gold)] hover:shadow-md"
              }`}
            >
              {letter}
            </div>
          );
        })}
      </div>
      <p className="mt-3 font-type text-[9px] uppercase tracking-widest text-[var(--noir-fog-dim)]/60">
        Enter the assembled word below
      </p>
    </div>
  );
}

/* ── Main Room ───────────────────────────────────────────────────── */
export function Room02_SilentPlayback({ onComplete }: Props) {
  const [showPreEntry, setShowPreEntry] = useState(true);
  const [solved, setSolved] = useState(false);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingSeqIndex, setPlayingSeqIndex] = useState<number | null>(null);
  const [flashKey, setFlashKey] = useState<string | null>(null); // for re-triggering same key
  const playTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Marker state
  const [markerPlaced, setMarkerPlaced] = useState(false);
  const [wrongKey, setWrongKey] = useState<string | null>(null);
  const [wrongAttempt, setWrongAttempt] = useState(0); // bumped on each wrong drop to remount marker at origin
  const markerDragRef = useRef<HTMLDivElement>(null);

  // Post-solve
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Hint — revealed by typing "HINT" in the hint input below the evidence marker
  const [hintMode, setHintMode] = useState(false);
  const [hintExpanded, setHintExpanded] = useState(false);
  const [hintInput, setHintInput] = useState("");
  const [hintError, setHintError] = useState(false);

  const duplicateSolved = markerPlaced;

  const playingNote =
    playingSeqIndex !== null ? SEQUENCE[playingSeqIndex] : null;

  /* Play sequence */
  const handlePlaySequence = useCallback(() => {
    if (isPlaying) {
      playTimersRef.current.forEach(clearTimeout);
      playTimersRef.current = [];
      setIsPlaying(false);
      setPlayingSeqIndex(null);
      setFlashKey(null);
      return;
    }
    setIsPlaying(true);
    const timers: ReturnType<typeof setTimeout>[] = [];
    SEQUENCE.forEach((note, i) => {
      const t = setTimeout(() => {
        setPlayingSeqIndex(i);
        setFlashKey(`${note}-${i}`);
        const wKey = WHITE_KEYS.find((k) => k.note === note);
        const bKey = BLACK_KEYS.find((k) => k.note === note);
        const freq = wKey?.freq ?? bKey?.freq;
        if (freq) playPianoNote(freq);
        if (i === SEQUENCE.length - 1) {
          setTimeout(() => {
            setIsPlaying(false);
            setPlayingSeqIndex(null);
          }, 1200);
        }
      }, i * 1000);
      timers.push(t);
    });
    playTimersRef.current = timers;
  }, [isPlaying]);

  useEffect(() => () => { playTimersRef.current.forEach(clearTimeout); }, []);

  /* Key click */
  const handleKeyClick = (note: string, freq: number) => {
    playPianoNote(freq);
  };

  /* Marker drop detection — elementsFromPoint avoids the floating marker blocking the hit */
  const handleMarkerDragEnd = (_e: unknown, info: { point: { x: number; y: number } }) => {
    const els = document.elementsFromPoint(info.point.x, info.point.y);
    const keyEl = els.find((el) => el.hasAttribute("data-piano-key"));
    const note = keyEl?.getAttribute("data-piano-key");
    if (!note) return;
    if (note === "B" || note === "G#") {
      setMarkerPlaced(true);
      setTimeout(() => setDrawerOpen(true), 600);
    } else {
      setWrongKey(note);
      setWrongAttempt((n) => n + 1); // force marker to remount at origin
      setTimeout(() => setWrongKey(null), 1400);
    }
  };

  /* Hint submission */
  const handleHintSubmit = () => {
    if (hintInput.trim().toUpperCase() === "HINT") {
      setHintMode(true);
      setHintExpanded(false);
      setHintInput("");
      setHintError(false);
    } else {
      setHintError(true);
      setTimeout(() => setHintError(false), 1200);
    }
  };

  /* Password logic */
  const handlePasswordSuccess = () => {
    setSolved(true);
    setTimeout(onComplete, 2200);
  };
  const handlePasswordError = (_attempt: string) => { /* no-op */ };

  return (
    <>
      <AnimatePresence>
        {showPreEntry && (
          <motion.div key="preentry" exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.3 }}>
            <PreEntryScreen onEnter={() => setShowPreEntry(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <RoomShell
        meta={ROOMS[1]}
        hint="One piano note echoes from the past. Listen for the repeat."
        solved={solved}
        onAdvance={onComplete}
      >
        <div className="flex flex-col gap-6 overflow-y-auto pb-28">

          {/* ── Case Brief ── */}
          <section className="paper paper-edge relative shrink-0 rounded-lg border border-black/10 px-5 py-4 shadow-xl">
            <div className="absolute -top-3 left-8 h-7 w-20 rotate-[-2.5deg] bg-[#d7c69b]/60 shadow" />
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-type text-[10px] uppercase tracking-[0.24em] text-[var(--noir-thread)]">
                  Case 02-MA · Recovered Musical Evidence
                </p>
                <p className="mt-2 max-w-xl font-display text-lg leading-snug text-[var(--noir-ink-text)]">
                  The recovered recording contains a repeated note.
                  Analyze the sequence. Identify the duplicate.
                  Recover the hidden message.
                </p>
              </div>
              <div className="w-32 shrink-0 rotate-[2deg] bg-[var(--noir-note-3)] p-3 shadow-md" aria-hidden>
                <p className="font-type text-[8px] uppercase tracking-[0.14em] text-black/40">Researcher note</p>
                <p className="mt-1 font-display text-[10px] leading-snug text-[var(--noir-ink-text)]">"Listen twice."</p>
                <p className="mt-0.5 font-display text-[10px] leading-snug text-[var(--noir-ink-text)]">"One note hides."</p>
                <p className="mt-0.5 font-display text-[10px] leading-snug text-[var(--noir-ink-text)]">"Mark it."</p>
              </div>
            </div>
          </section>

          {/* ── Piano + Playback ── */}
          <section className="shrink-0 rounded-2xl border border-[var(--noir-line)] shadow-2xl overflow-hidden"
            style={{ background: "linear-gradient(180deg,#1a130c 0%,#0e0b07 100%)" }}
          >
            {/* Stage lighting */}
            <div className="pointer-events-none h-2 w-full" style={{
              background: "radial-gradient(ellipse 60% 100% at 50% 0%,rgba(217,178,106,0.12) 0%,transparent 100%)"
            }} />

            {/* Hint mode: note sequence above keyboard */}
            <AnimatePresence>
              {hintMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden border-b border-[var(--noir-line)] bg-[var(--noir-ink)]/60 px-6 py-3"
                >
                  <p className="mb-2 font-type text-[8px] uppercase tracking-widest text-[var(--noir-fog-dim)]">
                    Recovered sequence · Investigation Assistance Mode
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {SEQUENCE.map((note, i) => {
                      const wk = WHITE_KEYS.find((k) => k.note === note);
                      const bk = BLACK_KEYS.find((k) => k.note === note);
                      const sol = wk?.label ?? bk?.label ?? note;
                      const isDup = note === "G#" || note === "B";
                      return (
                        <span
                          key={i}
                          className={`rounded px-2.5 py-1 font-mono text-[11px] font-bold ${
                            isDup
                              ? "bg-[var(--noir-thread)]/20 text-[var(--noir-thread)] ring-1 ring-[var(--noir-thread)]/40"
                              : "bg-[var(--noir-graphite-2)] text-[var(--noir-fog)]"
                          }`}
                        >
                          {sol}
                        </span>
                      );
                    })}
                  </div>
                  <p className="mt-2 font-type text-[8px] uppercase tracking-widest text-[var(--noir-thread)]/70">
                    Two notes share the same pitch — one repeats
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Piano header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <div>
                <p className="font-type text-[11px] uppercase tracking-[0.24em] text-[var(--noir-gold)]">
                  The Music Archive
                </p>
                <p className="font-type text-[8px] uppercase tracking-widest text-[var(--noir-fog-dim)]/60">
                  Recovered piano sequence · Single octave
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handlePlaySequence}
                className={`flex items-center gap-2 rounded-full border px-5 py-2 font-type text-[10px] uppercase tracking-widest transition-colors ${
                  isPlaying
                    ? "border-[var(--noir-thread)]/50 bg-[var(--noir-thread)]/12 text-[var(--noir-thread)]"
                    : "border-[var(--noir-gold)]/40 bg-[var(--noir-gold)]/8 text-[var(--noir-gold)] hover:bg-[var(--noir-gold)]/16"
                }`}
              >
                {isPlaying ? <Square className="h-3 w-3 fill-current" /> : <Play className="h-3 w-3 fill-current" />}
                {isPlaying ? "Stop" : "▶ Play Recording"}
              </motion.button>
            </div>

            {/* Piano keyboard */}
            <div className="relative mx-4 mb-0 px-2">
              {/* Piano body shadow at top */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-3 z-10"
                style={{ background: "linear-gradient(180deg,rgba(0,0,0,0.5) 0%,transparent 100%)" }}
              />

              {/* White + black keys container */}
              <div className="relative" style={{ height: 190 }}>
                {/* White keys */}
                <div className="absolute inset-0 flex gap-px">
                  {WHITE_KEYS.map((key) => {
                    const isActive = playingNote === key.note;
                    const isMarked = markerPlaced && key.note === "B";
                    const isWrong = wrongKey === key.note;
                    const isDupHint = hintMode && key.note === "B";
                    return (
                      <motion.button
                        key={key.note}
                        data-piano-key={key.note}
                        onClick={() => handleKeyClick(key.note, key.freq)}
                        animate={
                          flashKey?.startsWith(key.note)
                            ? { scaleY: [1, 0.94, 1], backgroundColor: ["#ede6d6","#d4b87a","#ede6d6"] }
                            : {}
                        }
                        transition={{ duration: 0.28, ease: "easeOut" }}
                        className="relative flex-1 rounded-b-lg border border-black/20 shadow-md transition-all duration-100 active:translate-y-0.5 flex flex-col justify-end items-center pb-2"
                        style={{
                          background: isWrong
                            ? "linear-gradient(180deg,#f0d0d0 0%,#c8a0a0 100%)"
                            : isDupHint
                              ? "linear-gradient(180deg,#f5e8c8 0%,#f0d87e 100%)"
                              : isMarked
                                ? "linear-gradient(180deg,#f5e0d5 0%,#e8c4b0 100%)"
                                : isActive
                                  ? "linear-gradient(180deg,#f5e8c8 0%,#d4b87a 100%)"
                                  : "linear-gradient(180deg,#f2ece0 0%,#ddd5c4 100%)",
                          boxShadow: isActive
                            ? "0 4px 20px rgba(217,178,106,0.5), inset 0 -2px 4px rgba(0,0,0,0.08)"
                            : isMarked
                              ? "0 4px 16px rgba(181,55,46,0.35), inset 0 -2px 4px rgba(0,0,0,0.08)"
                              : "0 4px 8px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(0,0,0,0.06)",
                          originY: 0,
                        }}
                      >
                        {isMarked && (
                          <div className="absolute inset-x-0 top-2 flex justify-center">
                            <div className="h-4 w-4 rounded-full bg-[var(--noir-thread)] shadow-lg shadow-[var(--noir-thread)]/50" />
                          </div>
                        )}
                        {/* Always-visible solfège label */}
                        <span className="pointer-events-none select-none font-type text-[9px] leading-none text-black/40">
                          {key.label}
                        </span>
                        {/* Chromatic name in hint mode */}
                        {hintMode && (
                          <span className={`pointer-events-none select-none font-mono text-[8px] leading-none mt-0.5 ${isDupHint ? "text-[#8b5e00] font-bold" : "text-black/30"}`}>
                            {key.note === "C5" ? "C" : key.note}
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Black keys */}
                {BLACK_KEYS.map((bk) => {
                  const isActive = playingNote === bk.note;
                  const isDupHint = hintMode && bk.note === "G#";
                  return (
                    <div
                      key={bk.note}
                      className="absolute top-0 z-10 flex flex-col"
                      style={{ left: `${bk.leftPct}%`, width: "7.5%" }}
                    >
                      <motion.button
                        data-piano-key={bk.note}
                        onClick={() => playPianoNote(bk.freq, 0.42)}
                        animate={isActive ? { scaleY: [1, 0.93, 1] } : {}}
                        transition={{ duration: 0.22 }}
                        className="w-full rounded-b-md border border-black/60 transition-all active:translate-y-0.5 flex flex-col justify-end items-center pb-1.5"
                        style={{
                          height: 110,
                          background: isDupHint
                            ? "linear-gradient(180deg,#4a3a10 0%,#2f2308 100%)"
                            : isActive
                              ? "linear-gradient(180deg,#3d3020 0%,#2a2010 100%)"
                              : "linear-gradient(180deg,#1c1510 0%,#0d0a06 100%)",
                          boxShadow: isActive
                            ? "0 4px 12px rgba(217,178,106,0.3), 2px 6px 0 rgba(0,0,0,0.7)"
                            : "2px 6px 0 rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
                          originY: 0,
                        }}
                      >
                        {hintMode && (
                          <span className={`pointer-events-none select-none font-type leading-none text-center ${isDupHint ? "text-[#d4b87a] font-bold text-[7px]" : "text-white/30 text-[7px]"}`}>
                            {bk.label}
                          </span>
                        )}
                      </motion.button>
                    </div>
                  );
                })}
              </div>

              <div className="pb-3" />
            </div>
          </section>

          {/* ── Investigation Marker ── */}
          <AnimatePresence mode="wait">
            {!duplicateSolved ? (
              <motion.section
                key="marker-zone"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="shrink-0 rounded-xl border border-[var(--noir-line)] bg-black/20 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-type text-[12px] uppercase tracking-[0.2em] text-[var(--noir-gold)]">
                      Evidence Marker
                    </h3>
                    <p className="mt-1 font-type text-[9px] uppercase tracking-widest text-[var(--noir-fog-dim)]">
                      Drag the marker · place it on the duplicate key
                    </p>
                  </div>

                  {/* Draggable marker — key resets position to origin on each wrong attempt */}
                  {!duplicateSolved && (
                    <motion.div
                      key={wrongAttempt}
                      ref={markerDragRef}
                      drag
                      dragMomentum={false}
                      dragElastic={0.1}
                      whileDrag={{ scale: 1.15, zIndex: 60 }}
                      onDragEnd={handleMarkerDragEnd}
                      className="relative cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex flex-col items-center gap-1.5">
                        {/* Pin body */}
                        <div className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--noir-thread)] bg-[var(--noir-thread)] shadow-xl shadow-[var(--noir-thread)]/40">
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <circle cx="9" cy="9" r="3.5" stroke="white" strokeWidth="1.5"/>
                            <path d="M9 1v3M9 14v3M1 9h3M14 9h3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                          {/* Shine */}
                          <div className="absolute top-1.5 left-1.5 h-2 w-2 rounded-full bg-white/30" />
                        </div>
                        <span className="font-type text-[7px] uppercase tracking-wider text-[var(--noir-fog-dim)]">
                          Evidence
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {wrongKey && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 font-type text-[9px] uppercase tracking-widest text-[var(--noir-thread)]"
                  >
                    {wrongKey} is not the duplicate — listen again
                  </motion.p>
                )}
              </motion.section>
            ) : (
              <motion.div
                key="marker-confirmed"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="shrink-0 flex items-center gap-3 rounded-xl border border-[var(--noir-gold)]/40 bg-[var(--noir-gold)]/6 px-5 py-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--noir-gold)]">
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path d="M1 5L4.5 8.5L11 1.5" stroke="#12100e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="font-type text-[11px] uppercase tracking-widest text-[var(--noir-gold)]">
                    Duplicate isolated — B / G♯ (same note · Si)
                  </p>
                  <p className="font-type text-[8px] uppercase tracking-widest text-[var(--noir-fog-dim)]">
                    Archive drawer unlocked
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Hint unlock (below evidence marker) ── */}
          {!hintMode && (
            <div className="shrink-0 rounded-xl border border-[var(--noir-line)]/50 bg-black/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  {/* Hint icon */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--noir-gold)]/30 bg-[var(--noir-gold)]/8">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[var(--noir-gold)]">
                      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M7 4.5c-.8 0-1.5.6-1.5 1.4 0 .3.2.6.5.6s.5-.3.5-.6c0-.2.2-.4.5-.4s.5.2.5.5c0 .6-.7 1-1 1.5V8h1v-.3c.4-.5 1-1 1-1.8C8.5 5.1 7.8 4.5 7 4.5z" fill="currentColor"/>
                      <circle cx="7" cy="9.5" r=".6" fill="currentColor"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-type text-[11px] uppercase tracking-[0.18em] text-[var(--noir-gold)]">
                      Need a Hint?
                    </p>
                    <p className="font-type text-[8px] uppercase tracking-widest text-[var(--noir-fog-dim)]">
                      Enter the hint password to reveal piano notes
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setHintExpanded((v) => !v)}
                  className="shrink-0 rounded border border-[var(--noir-gold)]/30 bg-[var(--noir-gold)]/8 px-3 py-1.5 font-type text-[9px] uppercase tracking-widest text-[var(--noir-gold)] transition-colors hover:bg-[var(--noir-gold)]/16"
                >
                  {hintExpanded ? "Close" : "Unlock"}
                </button>
              </div>

              <AnimatePresence>
                {hintExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 flex gap-2 border-t border-[var(--noir-line)]/40 pt-3">
                      <input
                        type="text"
                        value={hintInput}
                        onChange={(e) => setHintInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleHintSubmit()}
                        placeholder="Hint password…"
                        className={`flex-1 rounded border bg-black/20 px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-[var(--noir-fog)] outline-none transition-colors placeholder:text-[var(--noir-fog-dim)]/40 focus:border-[var(--noir-gold)]/50 ${
                          hintError
                            ? "border-[var(--noir-thread)]/60 text-[var(--noir-thread)]"
                            : "border-[var(--noir-line)]"
                        }`}
                      />
                      <button
                        onClick={handleHintSubmit}
                        className="rounded border border-[var(--noir-gold)]/40 bg-[var(--noir-gold)]/10 px-4 py-2 font-type text-[9px] uppercase tracking-widest text-[var(--noir-gold)] transition-colors hover:bg-[var(--noir-gold)]/20"
                      >
                        Submit
                      </button>
                    </div>
                    {hintError && (
                      <p className="mt-1.5 font-type text-[8px] uppercase tracking-widest text-[var(--noir-thread)]">
                        Incorrect — try again
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ── Secret Archive Drawer ── */}
          <AnimatePresence>
            {drawerOpen && (
              <motion.section
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="shrink-0 overflow-hidden rounded-xl border border-[var(--noir-gold)]/30 bg-[var(--noir-graphite)] shadow-xl"
              >
                <div className="p-5">
                  {/* File folder tab */}
                  <div className="mb-4 flex items-center gap-3 border-b border-[var(--noir-line)] pb-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-[var(--noir-gold)]/15">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M1 3h4l1.5 1.5H11v6H1V3z" stroke="var(--noir-gold)" strokeWidth="1" fill="none" opacity="0.7"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-type text-[11px] uppercase tracking-[0.2em] text-[var(--noir-gold)]">
                        Secret Archive — Unlocked
                      </p>
                      <p className="font-type text-[8px] uppercase tracking-widest text-[var(--noir-fog-dim)]">
                        Hidden compartment revealed · Musical Evidence Recovered
                      </p>
                    </div>
                    <div className="ml-auto rotate-[-4deg] rounded border-2 border-[var(--noir-gold)]/50 px-2 py-0.5 font-type text-[8px] uppercase text-[var(--noir-gold)]/70">
                      Classified
                    </div>
                  </div>

                  <LetterTiles />
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* ── Password Area ── */}
          <section className={`shrink-0 rounded-xl border p-5 transition-all duration-500 ${
            duplicateSolved
              ? "border-[var(--noir-line)] bg-black/20"
              : "border-[var(--noir-line)]/40 bg-black/10"
          }`}>
            <div className={`transition-all duration-500 ${!duplicateSolved ? "pointer-events-none opacity-35 blur-[1.5px]" : ""}`}>
              <PasswordModule
                roomIndex={2}
                onSuccess={handlePasswordSuccess}
                onError={handlePasswordError}
                label="Recovered Archive Word"
              />
            </div>
            {!duplicateSolved && (
              <p className="mt-2 text-center font-type text-[9px] uppercase tracking-widest text-[var(--noir-fog-dim)]/50">
                Unlocks after duplicate note is identified
              </p>
            )}
          </section>

          {/* ── Locked Case File 03 ── */}
          <div className="paper shrink-0 relative rounded-xl p-5 text-[var(--noir-ink-text)] opacity-75">
            <div className="absolute right-4 top-3 rotate-[5deg] rounded border-2 border-[var(--noir-thread)] px-2 py-0.5 font-type text-[9px] uppercase text-[var(--noir-thread)]">
              Locked
            </div>
            <p className="font-type text-[9px] uppercase tracking-[0.2em] text-black/45">Case File 03</p>
            <p className="mt-1.5 font-display text-lg">The Contradictory Interview</p>
            <p className="mt-0.5 text-[11px] text-black/45">Requires musical evidence recovery.</p>
          </div>

        </div>
      </RoomShell>
    </>
  );
}
