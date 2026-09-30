import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FolderClosed, FolderOpen, CheckCircle2 } from "lucide-react";
import { RoomShell } from "../RoomShell";
import { ROOMS } from "../gameData";
import { PasswordModule } from "../PasswordModule";

interface Props {
  onComplete: () => void;
}

/* ── Board dimensions ───────────────────────────────────────────── */
const BW = 860;
const BH = 680;
const PW = 114;
const PH = 52;
const CW = 140;
const CH = 48;
const DW = 120;
const DH = 42;

interface NodeCard {
  id: string;
  label: string;
  subLabel?: string;
  type: "parent" | "child" | "distractor";
  parentId?: string;
  x: number;
  y: number;
  rotate: number;
  w: number;
  h: number;
}

/* ── Parents stay fixed on the left ── */
const PARENT_CARDS: NodeCard[] = [
  { id: "account",  label: "ACCOUNT",  subLabel: "My Account",  type: "parent", x: 18, y: 58,  rotate: 0, w: PW, h: PH },
  { id: "plan",     label: "PLAN",     subLabel: "My Plan",     type: "parent", x: 18, y: 205, rotate: 0, w: PW, h: PH },
  { id: "requests", label: "REQUESTS", subLabel: "My Requests", type: "parent", x: 18, y: 362, rotate: 0, w: PW, h: PH },
  { id: "help",     label: "HELP",     subLabel: "Get Help",    type: "parent", x: 18, y: 512, rotate: 0, w: PW, h: PH },
];

/* ── Child cards — deliberately jumbled positions, NOT grouped by parent ── */
const CHILD_CARDS: NodeCard[] = [
  { id: "my-profile",       label: "My Profile",         type: "child", parentId: "account",  x: 440, y: 540, rotate: -2, w: CW, h: CH },
  { id: "personal-details", label: "Personal Details",   type: "child", parentId: "account",  x: 260, y: 370, rotate:  1, w: CW, h: CH },
  { id: "login-security",   label: "Login & Security",   type: "child", parentId: "account",  x: 460, y: 290, rotate: -1, w: CW, h: CH },
  { id: "coverage",         label: "Coverage",           type: "child", parentId: "plan",     x: 250, y: 600, rotate:  2, w: CW, h: CH },
  { id: "benefits",         label: "Benefits",           type: "child", parentId: "plan",     x: 450, y: 75,  rotate: -2, w: CW, h: CH },
  { id: "compare-plans",    label: "Compare Plans",      type: "child", parentId: "plan",     x: 265, y: 180, rotate:  1, w: CW, h: CH },
  { id: "claims",           label: "Claims",             type: "child", parentId: "requests", x: 455, y: 430, rotate: -1, w: CW, h: CH },
  { id: "prior-auth",       label: "Prior Authorization",type: "child", parentId: "requests", x: 260, y: 78,  rotate:  2, w: CW, h: CH },
  { id: "track-requests",   label: "Track Requests",     type: "child", parentId: "requests", x: 268, y: 490, rotate: -2, w: CW, h: CH },
  { id: "support",          label: "Support",            type: "child", parentId: "help",     x: 455, y: 180, rotate:  1, w: CW, h: CH },
  { id: "contact-us",       label: "Contact Us",         type: "child", parentId: "help",     x: 260, y: 280, rotate: -1, w: CW, h: CH },
  { id: "faqs",             label: "FAQs",               type: "child", parentId: "help",     x: 460, y: 600, rotate:  2, w: CW, h: CH },
];

/* ── Distractors — right column ── */
const DISTRACTOR_CARDS: NodeCard[] = [
];

const CARDS: NodeCard[] = [...PARENT_CARDS, ...CHILD_CARDS, ...DISTRACTOR_CARDS];

const CHILD_IDS = CHILD_CARDS.map((c) => c.id);
const CORRECT_KEYS = CHILD_CARDS.map((c) => `${c.parentId}→${c.id}`);

const HINTS = [
  "Think in categories, not individual pages. What are the major sections of a healthcare platform?",
  "How would a healthcare member naturally organise these items? Think about what they need to do.",
  "Drag from the → dot on a section card and drop it onto a page that belongs to it.",
];

/* ── Geometry helpers ─────────────────────────────────────────── */
function srcPt(c: NodeCard) { return { x: c.x + c.w, y: c.y + c.h / 2 }; }
function tgtPt(c: NodeCard) { return { x: c.x,       y: c.y + c.h / 2 }; }
function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cp = Math.abs(x2 - x1) * 0.42;
  return `M ${x1} ${y1} C ${x1 + cp} ${y1}, ${x2 - cp} ${y2}, ${x2} ${y2}`;
}

/* ── Individual card element ─────────────────────────────────── */
interface CardElProps {
  card: NodeCard;
  draggingFrom: string | null;
  connections: Set<string>;
  wrongFlash: boolean;
  allConnected: boolean;
  onDragStartParent: (id: string, e: React.MouseEvent) => void;
  onChildDrop: (card: NodeCard) => void;
  onChildClick: (card: NodeCard) => void;
}

function CardEl({
  card, draggingFrom, connections, wrongFlash, allConnected,
  onDragStartParent, onChildDrop, onChildClick,
}: CardElProps) {
  const isParent = card.type === "parent";
  const isChild = card.type === "child";
  const isDistractor = card.type === "distractor";

  const isArmed = draggingFrom === card.id;
  const connKey = isChild ? `${card.parentId}→${card.id}` : null;
  const isConnected = connKey ? connections.has(connKey) : false;
  const parentComplete = isParent
    ? CHILD_CARDS.filter((c) => c.parentId === card.id).every((c) => connections.has(`${card.id}→${c.id}`))
    : false;

  const style: React.CSSProperties = {
    position: "absolute",
    left: card.x,
    top: card.y,
    width: card.w,
    height: card.h,
    transform: `rotate(${card.rotate}deg)`,
    zIndex: isArmed ? 20 : isParent ? 10 : wrongFlash ? 30 : 5,
  };

  /* ── Parent card ── */
  if (isParent) {
    return (
      <div style={style} className="pointer-events-none">
        <motion.div
          animate={allConnected
            ? { boxShadow: ["0 0 0 2px #d9b26a40","0 0 0 6px #d9b26a80","0 0 0 2px #d9b26a40"] }
            : {}}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className={`relative flex h-full w-full select-none items-center gap-2 rounded-lg border px-3 shadow-xl transition-all duration-200 ${
            isArmed
              ? "border-[var(--noir-gold)] bg-[var(--noir-gold)]/15"
              : parentComplete
                ? "border-[var(--noir-gold)]/60 bg-[var(--noir-graphite)]"
                : "border-[var(--noir-gold)]/20 bg-[var(--noir-graphite)]"
          }`}
          style={{ pointerEvents: "auto" }}
        >
          <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded font-mono text-[13px] font-black transition-all duration-300 ${
            allConnected ? "bg-[var(--noir-gold)] text-[var(--noir-ink)]" : "bg-[var(--noir-gold)]/15 text-[var(--noir-gold)]"
          }`}>
            {card.label[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-type text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--noir-gold)] leading-none">{card.label}</p>
            <p className="font-type text-[7px] uppercase tracking-widest text-[var(--noir-fog-dim)] leading-none mt-0.5">{card.subLabel}</p>
          </div>
          {parentComplete && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[var(--noir-gold)]" />}

          {/* Drag handle — dragging from here pulls a connection wire */}
          <div
            onMouseDown={(e) => { e.stopPropagation(); onDragStartParent(card.id, e); }}
            className={`pointer-events-auto absolute -right-3 top-1/2 z-30 flex h-6 w-6 -translate-y-1/2 cursor-grab items-center justify-center rounded-full border-2 shadow-lg transition-all duration-150 active:cursor-grabbing ${
              isArmed
                ? "border-[var(--noir-gold)] bg-[var(--noir-gold)] scale-125"
                : "border-[var(--noir-gold)]/50 bg-[var(--noir-graphite)] hover:border-[var(--noir-gold)] hover:scale-110"
            }`}
            title="Drag to connect to a page"
          >
            <span className={`text-[9px] leading-none ${isArmed ? "text-[var(--noir-ink)]" : "text-[var(--noir-gold)]"}`}>
              {isArmed ? "·" : "→"}
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── Child card — drop target ── */
  if (isChild) {
    return (
      <motion.div
        style={style}
        animate={wrongFlash ? { x: [-6, 6, -5, 5, -3, 3, 0] } : {}}
        transition={{ duration: 0.35 }}
        onMouseUp={() => onChildDrop(card)}
        onClick={() => onChildClick(card)}
        className={`flex cursor-pointer select-none flex-col justify-center rounded-sm border px-3 py-2 shadow-md transition-all duration-200 ${
          wrongFlash
            ? "border-red-400/60 bg-red-50"
            : isConnected
              ? "border-[var(--noir-gold)]/50 bg-[var(--noir-paper)]"
              : draggingFrom
                ? "border-[var(--noir-fog-dim)]/30 bg-[var(--noir-paper)] hover:border-[var(--noir-gold)]/40 hover:bg-[var(--noir-gold)]/5"
                : "border-black/10 bg-[var(--noir-paper)] hover:border-[var(--noir-gold)]/30"
        }`}
      >
        {/* Only show a subtle connected marker — no text hint about which parent */}
        {isConnected && (
          <div className="absolute right-2 top-1.5">
            <CheckCircle2 className="h-3 w-3 text-[var(--noir-gold)]/60" />
          </div>
        )}
        <p className={`font-display text-[12px] font-semibold leading-tight ${wrongFlash ? "text-red-500" : "text-[var(--noir-ink-text)]"}`}>
          {card.label}
        </p>
      </motion.div>
    );
  }

  /* ── Distractor card ── */
  return (
    <motion.div
      style={style}
      animate={wrongFlash ? { x: [-6, 6, -5, 5, -3, 3, 0] } : {}}
      transition={{ duration: 0.35 }}
      onMouseUp={() => onChildDrop(card)}
      onClick={() => onChildClick(card)}
      className={`flex cursor-pointer select-none flex-col justify-center rounded-sm border px-3 py-2 shadow-sm transition-all duration-200 ${
        wrongFlash ? "border-red-400/60 bg-red-50" : "border-black/8 bg-[#eef1f5] hover:border-black/20"
      }`}
    >
      <p className={`font-display text-[11px] leading-tight ${wrongFlash ? "text-red-500" : "text-[var(--noir-ink-text)]/60"}`}>
        {card.label}
      </p>
    </motion.div>
  );
}

/* ── Main Room ───────────────────────────────────────────────── */
export function Room04_LostNavigationBlueprint({ onComplete }: Props) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [connections, setConnections] = useState<Set<string>>(new Set());
  const [draggingFrom, setDraggingFrom] = useState<string | null>(null);
  const [mouse, setMouse] = useState({ x: BW / 2, y: BH / 2 });
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [solved, setSolved] = useState(false);

  const allConnected = CORRECT_KEYS.every((k) => connections.has(k));
  const connectedCount = CHILD_IDS.filter((id) => {
    const card = CARDS.find((c) => c.id === id)!;
    return connections.has(`${card.parentId}→${id}`);
  }).length;

  /* Cancel drag on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setDraggingFrom(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Track mouse while dragging */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingFrom || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, [draggingFrom]);

  /* Cancel drag if released on empty board */
  const handleBoardMouseUp = () => { setDraggingFrom(null); };
  const handleBoardClick = () => { if (draggingFrom) setDraggingFrom(null); };

  /* Start drag from parent arrow handle */
  const handleDragStartParent = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setDraggingFrom((prev) => (prev === id ? null : id));
  }, []);

  /* Drop wire onto a child or distractor */
  const handleChildDrop = useCallback((card: NodeCard) => {
    if (!draggingFrom) return;

    if (card.type === "child" && card.parentId === draggingFrom) {
      const key = `${draggingFrom}→${card.id}`;
      setConnections((prev) => new Set([...prev, key]));
    } else {
      setWrongFlash(card.id);
      setTimeout(() => setWrongFlash(null), 650);
    }
    setDraggingFrom(null);
  }, [draggingFrom]);

  /* Click a connected child to remove its connection */
  const handleChildClick = useCallback((card: NodeCard) => {
    if (draggingFrom) return; // let drop handle it
    if (card.type === "child") {
      const key = `${card.parentId}→${card.id}`;
      if (connections.has(key)) {
        setConnections((prev) => { const n = new Set(prev); n.delete(key); return n; });
      }
    }
  }, [draggingFrom, connections]);

  const handlePasswordSuccess = () => { setSolved(true); setTimeout(onComplete, 2200); };

  /* Build SVG lines */
  const lines = [...connections].map((key) => {
    const [fromId, toId] = key.split("→");
    const from = CARDS.find((c) => c.id === fromId);
    const to   = CARDS.find((c) => c.id === toId);
    return from && to ? { key, from, to } : null;
  }).filter(Boolean) as { key: string; from: NodeCard; to: NodeCard }[];

  const pendingCard = CARDS.find((c) => c.id === draggingFrom) ?? null;

  return (
    <RoomShell
      meta={ROOMS[3]}
      hint="Think like a healthcare member. Drag each section's arrow to connect its pages."
      solved={solved}
      onAdvance={onComplete}
    >
      <div className="flex flex-col gap-5 pb-28">

        {/* ── Case Brief ── */}
        <section className="paper paper-edge relative shrink-0 rounded-lg border border-black/10 px-5 py-4 shadow-xl">
          <div className="absolute -top-3 left-8 h-7 w-20 rotate-[-2deg] bg-[#d7c69b]/60 shadow" />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-type text-[10px] uppercase tracking-[0.24em] text-[var(--noir-thread)]">
                Case 04-IA · Recovered Architecture Evidence
              </p>
              <p className="mt-2 max-w-xl font-display text-lg leading-snug text-[var(--noir-ink-text)]">
                The recovered architecture map is incomplete. The pages remain.
                The relationships are gone. Reconnect the system the way a healthcare member would naturally think.
              </p>
            </div>
            <div className="w-32 shrink-0 rotate-[2deg] bg-[var(--noir-note-3)] p-3 shadow-md" aria-hidden>
              <p className="font-type text-[8px] uppercase tracking-[0.14em] text-black/40">How to use</p>
              <p className="mt-1 font-display text-[10px] leading-snug text-[var(--noir-ink-text)]">"Drag the → dot"</p>
              <p className="mt-0.5 font-display text-[10px] leading-snug text-[var(--noir-ink-text)]">"Drop on a page"</p>
              <p className="mt-0.5 font-display text-[10px] leading-snug text-[var(--noir-ink-text)]">"Click ✓ to undo"</p>
            </div>
          </div>
        </section>

        {/* ── Progress ── */}
        <div className="shrink-0 flex items-center gap-3 px-1">
          <span className="font-type text-[9px] uppercase tracking-widest text-[var(--noir-fog-dim)]">
            {connectedCount}/{CHILD_IDS.length} pages connected
          </span>
          <div className="flex-1 h-1 rounded-full bg-[var(--noir-line)]">
            <motion.div
              className="h-full rounded-full bg-[var(--noir-gold)]"
              animate={{ width: `${(connectedCount / CHILD_IDS.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          {draggingFrom && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="font-type text-[9px] uppercase tracking-widest text-[var(--noir-gold)]"
            >
              Connecting {CARDS.find((c) => c.id === draggingFrom)?.label} · drop on a page · Esc to cancel
            </motion.span>
          )}
          {allConnected && !draggingFrom && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="font-type text-[9px] uppercase tracking-widest text-emerald-400"
            >
              Architecture rebuilt ✓
            </motion.span>
          )}
        </div>

        {/* ── Board ── */}
        <div
          className="shrink-0 overflow-auto rounded-2xl border border-[var(--noir-line)] shadow-2xl"
          style={{ background: "linear-gradient(160deg,#131008 0%,#0d0a05 100%)" }}
        >
          <div className="flex items-center gap-4 border-b border-[var(--noir-line)]/40 px-5 py-2.5">
            <p className="font-type text-[9px] uppercase tracking-[0.2em] text-[var(--noir-gold)]">
              The Broken Information Architecture
            </p>
            <div className="h-px flex-1 bg-[var(--noir-line)]/40" />
            <p className="font-type text-[8px] uppercase tracking-widest text-[var(--noir-fog-dim)]/60">
              Drag → to wire a section · release on a page · click a linked page to unlink
            </p>
          </div>

          <div
            ref={boardRef}
            className={`relative select-none ${draggingFrom ? "cursor-crosshair" : "cursor-default"}`}
            style={{ width: BW, height: BH }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleBoardMouseUp}
            onClick={handleBoardClick}
          >
            {/* Dot grid */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage: "radial-gradient(circle, #d9b26a 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />

            {/* Vertical section dividers */}
            {[148, 620].map((x) => (
              <div key={x} className="pointer-events-none absolute inset-y-0 w-px bg-[var(--noir-line)]/20" style={{ left: x }} />
            ))}

            {/* Section labels */}
            {[
              { x: 155, label: "Navigation Sections" },
              { x: 280, label: "Pages — unclassified" },
              { x: 628, label: "Distractors" },
            ].map(({ x, label }) => (
              <div key={label}
                className="pointer-events-none absolute top-4 font-type text-[8px] uppercase tracking-[0.22em] text-[var(--noir-fog-dim)]/30"
                style={{ left: x }}
              >
                {label}
              </div>
            ))}

            {/* SVG wire overlay */}
            <svg className="pointer-events-none absolute inset-0" style={{ width: BW, height: BH }}>
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Established connections */}
              {lines.map(({ key, from, to }) => {
                const s = srcPt(from);
                const t = tgtPt(to);
                return (
                  <path key={key} d={bezier(s.x, s.y, t.x, t.y)}
                    fill="none" stroke="#d9b26a"
                    strokeWidth={allConnected ? 2 : 1.5}
                    strokeOpacity={allConnected ? 1 : 0.65}
                    filter={allConnected ? "url(#glow)" : undefined}
                  />
                );
              })}
              {lines.map(({ key, from }) => {
                const s = srcPt(from);
                return <circle key={`dot-${key}`} cx={s.x} cy={s.y} r={3} fill="#d9b26a" opacity={allConnected ? 1 : 0.65} />;
              })}

              {/* Live drag preview */}
              {pendingCard && (
                <>
                  <path
                    d={bezier(srcPt(pendingCard).x, srcPt(pendingCard).y, mouse.x, mouse.y)}
                    fill="none" stroke="#d9b26a" strokeWidth={1.5} strokeDasharray="7 4" strokeOpacity={0.6}
                  />
                  <circle cx={srcPt(pendingCard).x} cy={srcPt(pendingCard).y} r={4} fill="#d9b26a" opacity={0.85} />
                  <circle cx={mouse.x} cy={mouse.y} r={5} fill="none" stroke="#d9b26a" strokeWidth={1.5} opacity={0.55} />
                  <circle cx={mouse.x} cy={mouse.y} r={2} fill="#d9b26a" opacity={0.7} />
                </>
              )}
            </svg>

            {/* Cards */}
            {CARDS.map((card) => (
              <CardEl
                key={card.id}
                card={card}
                draggingFrom={draggingFrom}
                connections={connections}
                wrongFlash={wrongFlash === card.id}
                allConnected={allConnected}
                onDragStartParent={handleDragStartParent}
                onChildDrop={handleChildDrop}
                onChildClick={handleChildClick}
              />
            ))}
          </div>
        </div>

        {/* ── Researcher note (revealed when complete) ── */}
        <AnimatePresence>
          {allConnected && (
            <motion.section
              initial={{ opacity: 0, y: 14 }}
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
                    Architecture Reconstructed — Hidden Note Recovered
                  </p>
                  <p className="font-type text-[8px] uppercase tracking-widest text-[var(--noir-fog-dim)]">
                    Member journey restored · Navigation evidence verified
                  </p>
                </div>
                <div className="ml-auto rotate-[-3deg] rounded border-2 border-[var(--noir-gold)]/50 px-2 py-0.5 font-type text-[8px] uppercase text-[var(--noir-gold)]/70">
                  Classified
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-2">
                <div className="paper rounded-lg border border-black/10 p-5 shadow-md">
                  <p className="font-type text-[8px] uppercase tracking-[0.2em] text-[var(--noir-thread)]">
                    Recovered · Researcher's Final Note
                  </p>
                  <p className="mt-3 font-display text-base leading-relaxed text-[var(--noir-ink-text)]">
                    "Good architecture matches how users think.
                  </p>
                  <p className="mt-2 font-display text-base leading-relaxed text-[var(--noir-ink-text)]">
                    The <span className="underline decoration-[var(--noir-gold)] underline-offset-2">primary navigation sections</span> contain the next archive code."
                  </p>
                </div>

                <div className="flex flex-col justify-center">
                  <p className="mb-3 font-type text-[10px] uppercase tracking-[0.22em] text-[var(--noir-gold)]">
                    Primary Navigation Sections
                  </p>
                  <p className="mb-4 font-type text-[8px] uppercase tracking-widest text-[var(--noir-fog-dim)]">
                    The first letter of each section forms the archive code
                  </p>
                  <div className="flex gap-3">
                    {["account", "plan", "requests", "help"].map((id, i) => {
                      const card = CARDS.find((c) => c.id === id)!;
                      return (
                        <motion.div key={id}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: i * 0.12 }}
                          className="flex flex-col items-center gap-1.5"
                        >
                          <div className="flex h-14 w-14 items-center justify-center rounded-lg border-2 border-[var(--noir-gold)] bg-[var(--noir-gold)] shadow-lg shadow-[var(--noir-gold)]/30">
                            <span className="font-mono text-[22px] font-black text-[var(--noir-ink)]">{card.label[0]}</span>
                          </div>
                          <span className="font-type text-[7px] uppercase tracking-widest text-[var(--noir-fog-dim)]">{card.label}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                  <p className="mt-4 font-type text-[9px] uppercase tracking-[0.18em] text-[var(--noir-gold)]/70">
                    A · P · R · H → enter below to close this case
                  </p>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── Hint folder ── */}
        <section className="paper shrink-0 rounded-xl border border-black/10 p-4 text-[var(--noir-ink-text)]">
          <button
            onClick={() => setHintLevel((l) => Math.min(3, l + 1))}
            className="flex w-full items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5">
              {hintLevel === 0
                ? <FolderClosed className="h-4 w-4 text-[var(--noir-ink-text)]/60" />
                : <FolderOpen   className="h-4 w-4 text-[var(--noir-ink-text)]/60" />}
              <div className="text-left">
                <p className="font-type text-[11px] uppercase tracking-[0.18em] text-[var(--noir-ink-text)]/80">
                  Investigation Folder · Open Only If Needed
                </p>
                <p className="font-type text-[8px] uppercase tracking-widest text-[var(--noir-ink-text)]/40">
                  {hintLevel === 0 ? "Sealed" : `Hint ${hintLevel} of 3 open`}
                </p>
              </div>
            </div>
            {hintLevel < 3 && (
              <span className="shrink-0 rounded border border-black/20 px-3 py-1 font-type text-[9px] uppercase tracking-widest text-[var(--noir-ink-text)]/60 transition hover:bg-black/5">
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

        {/* ── Password area ── */}
        <section className={`shrink-0 rounded-xl border p-5 transition-all duration-500 ${
          allConnected ? "border-[var(--noir-line)] bg-black/20" : "border-[var(--noir-line)]/40 bg-black/10"
        }`}>
          <div className={`transition-all duration-500 ${!allConnected ? "pointer-events-none opacity-35 blur-[1.5px]" : ""}`}>
            <PasswordModule
              roomIndex={4}
              onSuccess={handlePasswordSuccess}
              onError={() => undefined}
              label="Recovered Navigation Code"
            />
          </div>
          {!allConnected && (
            <p className="mt-2 text-center font-type text-[9px] uppercase tracking-widest text-[var(--noir-fog-dim)]/50">
              Rebuild the architecture to unlock
            </p>
          )}
        </section>

        {/* ── Next case preview ── */}
        <div className="paper shrink-0 relative rounded-xl p-5 text-[var(--noir-ink-text)] opacity-75">
          <div className="absolute right-4 top-3 rotate-[5deg] rounded border-2 border-[var(--noir-thread)] px-2 py-0.5 font-type text-[9px] uppercase text-[var(--noir-thread)]">
            Locked
          </div>
          <p className="font-type text-[9px] uppercase tracking-[0.2em] text-black/45">Case File 05</p>
          <p className="mt-1.5 font-display text-lg">The Behaviour Trail</p>
          <p className="mt-0.5 text-[11px] text-black/45">Requires navigation architecture recovery.</p>
        </div>

      </div>
    </RoomShell>
  );
}
