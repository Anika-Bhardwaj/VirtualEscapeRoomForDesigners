# UX Escape Room: The Case of the Missing User
## Game Architecture Document — v1.0

---

## TABLE OF CONTENTS

1. [File Structure](#1-file-structure)
2. [Frame Structure](#2-frame-structure)
3. [Variable System](#3-variable-system)
4. [Password Logic](#4-password-logic)
5. [Unlock Progression](#5-unlock-progression)
6. [Multiplayer Presence Logic](#6-multiplayer-presence-logic)
7. [Component Architecture](#7-component-architecture)
8. [Room State System](#8-room-state-system)
9. [Win Conditions](#9-win-conditions)
10. [Prototype Flow](#10-prototype-flow)
11. [Room Registry](#11-room-registry)
12. [Facilitator Guide Architecture](#12-facilitator-guide-architecture)

---

## 1. FILE STRUCTURE

```
src/
├── app/
│   ├── App.tsx                          ← root state machine
│   └── components/
│       └── escape/
│           ├── gameData.ts              ← room registry, passwords, win conditions
│           ├── gameState.ts             ← central state store (all variables)
│           ├── gameConstants.ts         ← enum values, timing, config
│           │
│           ├── materials.tsx            ← Pin, Tape, StickyNote, Polaroid, Stamp, Folder, Kicker
│           ├── confetti.ts              ← celebration utility
│           │
│           ├── screens/
│           │   ├── Landing.tsx          ← 00 — pre-intro title card
│           │   ├── Intro.tsx            ← 00 — case briefing
│           │   ├── ProgressBoard.tsx    ← between-room red-string board
│           │   └── Finale.tsx           ← 06 — Final Resolution
│           │
│           ├── shell/
│           │   ├── RoomShell.tsx        ← shared room frame (header + layout)
│           │   ├── PasswordModule.tsx   ← reusable password entry + validation
│           │   ├── HintModule.tsx       ← reusable hint drawer
│           │   ├── ProgressTracker.tsx  ← 5-dot progress indicator
│           │   ├── SuccessOverlay.tsx   ← shown after correct password
│           │   ├── ErrorState.tsx       ← shown after wrong password
│           │   └── LockedFile.tsx       ← locked state UI for a room
│           │
│           ├── presence/
│           │   └── CursorPresence.tsx   ← real cursor broadcast (no names/avatars)
│           │
│           ├── rooms/
│           │   ├── Room01_VisualEvidence.tsx
│           │   ├── Room02_SilentPlayback.tsx
│           │   ├── Room03_ResearchWall.tsx
│           │   ├── Room04_NavigationBlueprint.tsx
│           │   └── Room05_BehaviourTrail.tsx
│           │
│           └── facilitator/
│               └── FacilitatorGuide.tsx ← password cheat-sheet + room hints
│
├── styles/
│   ├── index.css
│   ├── fonts.css
│   ├── theme.css
│   ├── globals.css
│   └── noir.css                         ← noir design tokens + keyframes
```

### File Responsibilities

| File | Responsibility |
|---|---|
| `gameData.ts` | Room registry, passwords, room metadata, hint strings |
| `gameState.ts` | All runtime variables, reducer logic, localStorage persistence |
| `gameConstants.ts` | Enum: RoomState, Phase; timing constants; config flags |
| `App.tsx` | Top-level phase switch; mounts correct screen |
| `RoomShell.tsx` | Layout wrapper every room uses; injects header, hint, progress, password |
| `PasswordModule.tsx` | Input + validation + error display; emits onSuccess/onError |

---

## 2. FRAME STRUCTURE

Every room renders inside one **focused investigation board** — no infinite canvas, no scrolling exploration. Everything the player needs is visible within a single viewport.

### Canonical Room Layout (720px+ screens)

```
┌─────────────────────────────────────────────────────────────────┐
│  ROOM HEADER                                                    │ ← 72px
│  [Case File XX]  [Room Title]  [Location]     [Progress ●●○○○] │
├─────────────────────────────────────────────────────────────────┤
│  BRIEFING STRIP                                                 │ ← 48px
│  One-line mission prompt. What to investigate.                  │
├────────────────────────────────────────┬────────────────────────┤
│                                        │                        │
│  MAIN INTERACTION AREA                 │  WORKING AREA          │
│  (60% width)                           │  (38% width)           │
│                                        │                        │
│  The primary puzzle surface.           │  Scratch space.        │
│  Evidence cards, sticky notes,         │  Drag targets.         │
│  interactive elements.                 │  Notes. Connections.   │
│                                        │                        │
│                                        │                        │
├────────────────────────────────────────┴────────────────────────┤
│  PASSWORD AREA                             [HINT ▾]             │ ← 80px
│  ┌──────────────────────────┐  [SUBMIT]                         │
│  │  Enter the keyword       │                                   │
│  └──────────────────────────┘                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (< 720px)

```
┌─────────────────────────────┐
│  ROOM HEADER                │ ← stacked: file no + title
│  [Progress ●●○○○]           │
├─────────────────────────────┤
│  BRIEFING STRIP             │
├─────────────────────────────┤
│                             │
│  MAIN INTERACTION AREA      │ ← full width, scrollable within
│  (stacked cards/notes)      │
│                             │
├─────────────────────────────┤
│  WORKING AREA               │ ← collapses to compact strip
├─────────────────────────────┤
│  PASSWORD AREA  [HINT ▾]    │
└─────────────────────────────┘
```

### Area Definitions

| Zone | Purpose | Constraints |
|---|---|---|
| **Room Header** | Case file ID, title, location, progress dots | Always visible; never scrolls away |
| **Briefing Strip** | One-sentence mission prompt | ≤ 20 words. No instructions. Just the framing. |
| **Main Interaction Area** | Primary puzzle elements | All required elements visible without scroll |
| **Working Area** | Player scratch space, drag targets | May be empty for simpler puzzles |
| **Password Area** | Keyword entry + submit | Pinned to bottom; always accessible |
| **Hint Area** | Toggleable hint drawer | Collapsed by default; tap to reveal |
| **Progress Indicator** | 5 dots (one per room) | Dots fill as rooms complete |

---

## 3. VARIABLE SYSTEM

### 3a. Complete Variable Table

#### Room Progress

| Variable | Type | Default | Description |
|---|---|---|---|
| `currentRoom` | `number` | `0` | Active room index (0 = intro, 1–5 = rooms, 6 = finale) |
| `room01Solved` | `boolean` | `false` | Room 01 puzzle interaction completed |
| `room02Solved` | `boolean` | `false` | Room 02 puzzle interaction completed |
| `room03Solved` | `boolean` | `false` | Room 03 puzzle interaction completed |
| `room04Solved` | `boolean` | `false` | Room 04 puzzle interaction completed |
| `room05Solved` | `boolean` | `false` | Room 05 puzzle interaction completed |

#### Room Lock State

| Variable | Type | Default | Description |
|---|---|---|---|
| `room01State` | `RoomState` | `"available"` | State machine value for room 01 |
| `room02State` | `RoomState` | `"locked"` | State machine value for room 02 |
| `room03State` | `RoomState` | `"locked"` | State machine value for room 03 |
| `room04State` | `RoomState` | `"locked"` | State machine value for room 04 |
| `room05State` | `RoomState` | `"locked"` | State machine value for room 05 |

#### Password Validation

| Variable | Type | Default | Description |
|---|---|---|---|
| `room01Unlocked` | `boolean` | `true` | Room 01 accessible (first room, always open) |
| `room02Unlocked` | `boolean` | `false` | FOCUS accepted → room 02 unlocked |
| `room03Unlocked` | `boolean` | `false` | CLARITY accepted → room 03 unlocked |
| `room04Unlocked` | `boolean` | `false` | CONFIDENCE accepted → room 04 unlocked |
| `room05Unlocked` | `boolean` | `false` | APRH accepted → room 05 unlocked |
| `finaleUnlocked` | `boolean` | `false` | USERFOUND accepted → finale unlocked |
| `lastPasswordAttempt` | `string` | `""` | Most recent raw input for error display |
| `passwordError` | `boolean` | `false` | True when last attempt was wrong |

#### Hint System

| Variable | Type | Default | Description |
|---|---|---|---|
| `hintCount` | `number` | `0` | Total hints revealed across all rooms |
| `room01HintUsed` | `boolean` | `false` | Hint revealed in room 01 |
| `room02HintUsed` | `boolean` | `false` | Hint revealed in room 02 |
| `room03HintUsed` | `boolean` | `false` | Hint revealed in room 03 |
| `room04HintUsed` | `boolean` | `false` | Hint revealed in room 04 |
| `room05HintUsed` | `boolean` | `false` | Hint revealed in room 05 |

#### Game Progress

| Variable | Type | Default | Description |
|---|---|---|---|
| `gamePhase` | `Phase` | `"landing"` | Top-level phase: landing → intro → room → board → finale |
| `solvedCount` | `number` | `0` | Total rooms solved (derived from room01–05Solved) |
| `caseClosed` | `boolean` | `false` | True when finale reached |
| `gameStartedAt` | `number \| null` | `null` | Unix timestamp when intro dismissed |
| `gameFinishedAt` | `number \| null` | `null` | Unix timestamp when finale reached |

#### Timer

| Variable | Type | Default | Description |
|---|---|---|---|
| `timerRunning` | `boolean` | `false` | Whether the countdown is active |
| `timerDurationMs` | `number` | `1200000` | 20 minutes in ms |
| `timerElapsedMs` | `number` | `0` | Accumulated elapsed time |
| `timerExpired` | `boolean` | `false` | True if time limit exceeded |

#### Multiplayer Presence

| Variable | Type | Default | Description |
|---|---|---|---|
| `presenceEnabled` | `boolean` | `false` | Feature flag; off until WS connection confirmed |
| `activeCursors` | `Record<string, CursorPos>` | `{}` | Map of userId → {x, y, roomIndex} |
| `localUserId` | `string` | `uuid()` | Session-scoped anonymous ID |

### 3b. TypeScript Types

```typescript
// gameConstants.ts

export type RoomState =
  | "locked"          // Not yet reachable
  | "available"       // Reachable, not started
  | "investigating"   // Player is actively inside
  | "solved"          // Puzzle interaction completed
  | "completed";      // Password accepted, room fully closed

export type Phase =
  | "landing"
  | "intro"
  | { kind: "room"; index: number }
  | { kind: "board"; solved: number }
  | "finale";

export type CursorPos = { x: number; y: number; roomIndex: number };

export const ROOM_COUNT = 5;
export const TIMER_DURATION_MS = 20 * 60 * 1000;
export const MAX_HINTS = 5; // one per room, never resets mid-session
```

### 3c. Naming Conventions

| Pattern | Used For | Example |
|---|---|---|
| `roomXXVerb` | Room-scoped boolean state | `room01Solved`, `room03HintUsed` |
| `roomXXState` | Room state machine value | `room02State` |
| `roomXXUnlocked` | Password-gate boolean | `room04Unlocked` |
| `camelCase` | All variables | `timerRunning`, `caseClosed` |
| `SCREAMING_SNAKE` | Constants / enum values | `ROOM_COUNT`, `TIMER_DURATION_MS` |
| `PascalCase` | Types and interfaces | `RoomState`, `Phase`, `CursorPos` |

---

## 4. PASSWORD LOGIC

### 4a. Password Registry

```typescript
// gameData.ts

export const PASSWORDS: Record<number, string> = {
  1: "FOCUS",
  2: "CLARITY",
  3: "CONFIDENCE",
  4: "APRH",
  5: "USERFOUND",
};
```

### 4b. Validation Rules

- Input is **uppercased and trimmed** before comparison (players need not type capitals)
- Comparison is **exact string match** — no partial credit
- Wrong answer triggers: `passwordError = true`, shake animation, 1-second lockout before re-entry
- Correct answer triggers: `roomXXState → "completed"`, `roomXXUnlocked+1 = true`, SuccessOverlay mounts
- SuccessOverlay holds for **2 seconds** then auto-advances to ProgressBoard

### 4c. Validation Function

```typescript
// PasswordModule.tsx — validation logic

function validate(input: string, roomIndex: number): boolean {
  const normalized = input.trim().toUpperCase();
  return normalized === PASSWORDS[roomIndex];
}

// On submit:
if (validate(input, currentRoom)) {
  dispatch({ type: "ROOM_COMPLETED", roomIndex: currentRoom });
} else {
  dispatch({ type: "PASSWORD_ERROR", attempt: input });
}
```

### 4d. Password → Unlock Chain

```
Player types "FOCUS"
    ↓  validate(input, 1) === true
dispatch ROOM_COMPLETED(1)
    ↓
room01State    → "completed"
room01Solved   → true
room02Unlocked → true
room02State    → "available"
solvedCount    → 1
    ↓
SuccessOverlay (2s) → ProgressBoard (solved=1)
    ↓
Player continues → Room 02 (CLARITY)
```

### 4e. Error Recovery

```
Player types wrong answer
    ↓  validate(input, N) === false
dispatch PASSWORD_ERROR
    ↓
passwordError      → true
lastPasswordAttempt → input
    ↓
Input shakes (400ms CSS animation)
Input disabled (1000ms lockout)
    ↓
passwordError reset → false
Input re-enabled
Player retries
```

---

## 5. UNLOCK PROGRESSION

### 5a. Sequential Gate Chain

```
START
  │
  ▼
[00 Landing]
  │  Player clicks "Open the Case"
  ▼
[00 Intro]
  │  Player clicks "Begin Investigation"
  ▼
[Room 01 — Visual Evidence]          room01State: available → investigating → solved
  │  Puzzle solved → player types "FOCUS"
  ▼
[ProgressBoard — 1 lead pinned]
  │  Player clicks "Open Next File"
  ▼
[Room 02 — Silent Playback]          room02State: locked → available → investigating → solved
  │  Puzzle solved → player types "CLARITY"
  ▼
[ProgressBoard — 2 leads pinned]
  │
  ▼
[Room 03 — Research Wall]            room03State: locked → available → investigating → solved
  │  Puzzle solved → player types "CONFIDENCE"
  ▼
[ProgressBoard — 3 leads pinned]
  │
  ▼
[Room 04 — Navigation Blueprint]     room04State: locked → available → investigating → solved
  │  Puzzle solved → player types "APRH"
  ▼
[ProgressBoard — 4 leads pinned]
  │
  ▼
[Room 05 — Behaviour Trail]          room05State: locked → available → investigating → solved
  │  Puzzle solved → player types "USERFOUND"
  ▼
[ProgressBoard — 5 leads pinned]
  │  Player clicks "Name the Missing User"
  ▼
[06 Final Resolution]                caseClosed: true
```

### 5b. Lock State Rules

| Room | Initial State | Unlocked By |
|---|---|---|
| Room 01 | `available` | Always open (no prerequisite) |
| Room 02 | `locked` | Password "FOCUS" accepted |
| Room 03 | `locked` | Password "CLARITY" accepted |
| Room 04 | `locked` | Password "CONFIDENCE" accepted |
| Room 05 | `locked` | Password "APRH" accepted |
| Finale | `locked` | Password "USERFOUND" accepted |

### 5c. Locked State Rendering

When a room's state is `"locked"`, the ProgressBoard renders it as:

- File sealed with wax stamp overlay
- Lead text: `"Evidence still scattered…"`
- No entry affordance (non-interactive)

---

## 6. MULTIPLAYER PRESENCE LOGIC

### 6a. Core Principles

- **No simulated users.** Only cursors from real, currently-connected sessions appear.
- **No identity display.** Names, avatars, handles, and labels are never rendered.
- **Cursor-only presence.** Each remote user is represented by a coloured cursor pointer only.
- **If only one player exists,** nothing extra renders — experience is identical to solo play.
- **Presence is additive** — it enriches but never changes the puzzle logic.

### 6b. Cursor Data Shape

```typescript
interface RemoteCursor {
  userId: string;          // anonymous session UUID, never displayed
  x: number;               // viewport-relative X %
  y: number;               // viewport-relative Y %
  roomIndex: number;       // only render if matches local currentRoom
  color: string;           // deterministic from userId hash; warm palette only
}
```

### 6c. Cursor Color Assignment

Colors assigned deterministically from `userId` hash so the same person gets the same colour throughout the session. Palette is drawn from noir warm tones: gold, parchment, thread-red, sage — never bright or distracting.

```typescript
const CURSOR_COLORS = ["#d9b26a", "#b5372e", "#8fad7c", "#c2a87e", "#a87e6b"];

function cursorColor(userId: string): string {
  const hash = userId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return CURSOR_COLORS[hash % CURSOR_COLORS.length];
}
```

### 6d. Presence Rendering Rules

```
Remote cursor received
  │
  ├─ cursor.roomIndex !== localCurrentRoom  →  discard (do not render)
  │
  └─ cursor.roomIndex === localCurrentRoom
       ↓
    Render <CursorPointer x={x} y={y} color={color} />
    No label. No name. No avatar.
    Smooth lerp animation (60fps, 80ms lag).
    Disappears after 3s of inactivity.
```

### 6e. Transport Architecture (future-ready)

The presence layer is built as a feature-flagged module so it works offline (solo) today and can be wired to a transport (e.g. Supabase Realtime) without changing any room code.

```typescript
// presence/CursorPresence.tsx

interface PresenceProvider {
  broadcast(pos: { x: number; y: number }): void;
  subscribe(handler: (cursors: RemoteCursor[]) => void): () => void;
}

// Default: no-op provider (single player)
// Swappable: SupabasePresenceProvider, PartyKitProvider, etc.
```

---

## 7. COMPONENT ARCHITECTURE

### 7a. Component Registry

#### Shell Components (shared across all rooms)

| Component | File | Props | Responsibility |
|---|---|---|---|
| `RoomShell` | `shell/RoomShell.tsx` | `meta, hint, children, solved, onAdvance` | Layout frame: header + briefing + progress |
| `PasswordModule` | `shell/PasswordModule.tsx` | `roomIndex, onSuccess, onError` | Input + validation + submit |
| `HintModule` | `shell/HintModule.tsx` | `roomIndex, hint, onReveal` | Collapsed hint drawer; one per room |
| `ProgressTracker` | `shell/ProgressTracker.tsx` | `solvedCount, total` | 5-dot progress indicator |
| `SuccessOverlay` | `shell/SuccessOverlay.tsx` | `meta, lead, onContinue` | Full-screen success stamp + lead reveal |
| `ErrorState` | `shell/ErrorState.tsx` | `attempt, onDismiss` | Wrong-password shake + message |
| `LockedFile` | `shell/LockedFile.tsx` | `fileNo` | Sealed-folder locked state |

#### Material Components (design system primitives)

| Component | File | Props | Responsibility |
|---|---|---|---|
| `StickyNote` | `materials.tsx` | `tone, rotate, children, onClick, active, dim` | Sticky note (yellow/mint/blush) |
| `Polaroid` | `materials.tsx` | `caption, rotate, children` | White-bordered photo frame |
| `Stamp` | `materials.tsx` | `label, color, slam` | Investigation rubber stamp |
| `Folder` | `materials.tsx` | `children` | Evidence folder surface |
| `Kicker` | `materials.tsx` | `children` | Typewriter eyebrow label |
| `Pin` | `materials.tsx` | `className` | Corkboard push-pin |
| `Tape` | `materials.tsx` | `className` | Masking tape strip |

#### Composite Investigation Components

| Component | File | Props | Responsibility |
|---|---|---|---|
| `EvidenceCard` | `components/EvidenceCard.tsx` | `title, body, tag, solved` | A single evidence item card |
| `EvidenceEnvelope` | `components/EvidenceEnvelope.tsx` | `fileNo, sealed, onOpen` | Sealed envelope; openable |
| `CaseFile` | `components/CaseFile.tsx` | `meta, state` | Full case-file container (folder + stamp + status) |
| `Notebook` | `components/Notebook.tsx` | `lines, editable` | Lined notebook page for deductions |
| `InvestigationStamp` | `components/InvestigationStamp.tsx` | `label, slam` | Alias for Stamp with slam=true |
| `WinState` | `components/WinState.tsx` | `onContinue` | Full-screen case-closed reveal |

### 7b. Naming Conventions

| Pattern | Applied To | Example |
|---|---|---|
| `PascalCase` | All React components | `PasswordModule`, `EvidenceCard` |
| `kebab-case` | File names | `evidence-card.tsx`, `room-shell.tsx` |
| `camelCase` | Props | `roomIndex`, `onSuccess`, `fileNo` |
| `CAPS_UNDERSCORE` | Enum values | `"LOCKED"`, `"INVESTIGATING"` |
| Verb prefix on handlers | Event props | `onSuccess`, `onError`, `onReveal`, `onAdvance` |

### 7c. PasswordModule Interface

```typescript
interface PasswordModuleProps {
  roomIndex: number;           // 1–5; used to look up correct password
  disabled?: boolean;          // true when puzzle interaction not yet complete
  onSuccess: () => void;       // fires after correct password + 400ms
  onError: (attempt: string) => void;
}
```

**Key behaviour:** The PasswordModule renders in a **disabled** state until `room0XSolved === true`. The player must complete the puzzle interaction first, then the input activates. This prevents brute-force skipping of puzzle mechanics.

### 7d. HintModule Interface

```typescript
interface HintModuleProps {
  roomIndex: number;
  hint: string;
  onReveal: () => void;        // fires once, increments hintCount
}
```

---

## 8. ROOM STATE SYSTEM

### 8a. State Enum

```
LOCKED          → Room is not yet reachable. Renders LockedFile.
     ↓  previous room completed
AVAILABLE       → Room is reachable. Player can enter.
     ↓  player navigates to room
INVESTIGATING   → Player is actively inside the room.
     ↓  player completes puzzle interaction
SOLVED          → Puzzle is solved. Password input activates.
     ↓  correct password entered
COMPLETED       → Password accepted. Room fully closed.
```

### 8b. State Transition Logic

```typescript
// Transitions triggered by dispatch actions

type Action =
  | { type: "ENTER_ROOM";       roomIndex: number }
  | { type: "PUZZLE_SOLVED";    roomIndex: number }
  | { type: "ROOM_COMPLETED";   roomIndex: number }
  | { type: "PASSWORD_ERROR";   attempt: string }
  | { type: "HINT_USED";        roomIndex: number }
  | { type: "GAME_RESET" };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "ENTER_ROOM":
      return setRoomState(state, action.roomIndex, "investigating");

    case "PUZZLE_SOLVED":
      return {
        ...setRoomState(state, action.roomIndex, "solved"),
        [`room0${action.roomIndex}Solved`]: true,
      };

    case "ROOM_COMPLETED":
      const next = {
        ...setRoomState(state, action.roomIndex, "completed"),
        [`room0${action.roomIndex + 1}Unlocked`]: true,
        solvedCount: state.solvedCount + 1,
      };
      if (action.roomIndex < 5) {
        return setRoomState(next, action.roomIndex + 1, "available");
      }
      return { ...next, caseClosed: true };

    case "PASSWORD_ERROR":
      return { ...state, passwordError: true, lastPasswordAttempt: action.attempt };

    // ... etc.
  }
}
```

### 8c. State Visual Rendering Map

| State | Header Badge | Folder Appearance | Password Input |
|---|---|---|---|
| `locked` | — | Sealed; wax stamp | Hidden |
| `available` | `OPEN` | Clean folder; pin visible | Hidden |
| `investigating` | `ACTIVE` | Open folder; evidence exposed | Disabled (greyed) |
| `solved` | `SOLVED ✓` | Evidence highlighted in gold | **Active** |
| `completed` | `CASE CLOSED` | Stamp slammed; folder closed | Hidden |

---

## 9. WIN CONDITIONS

### 9a. Per-Room Win Conditions

| Room | Puzzle Win Condition | Then Enables |
|---|---|---|
| Room 01 — Visual Evidence | Player correctly identifies the single signal element | Password input unlocks |
| Room 02 — Silent Playback | Player maps all feedback states to the correct moments | Password input unlocks |
| Room 03 — Research Wall | Player clusters all quotes into correct themes with 0 errors | Password input unlocks |
| Room 04 — Navigation Blueprint | Player repairs the broken navigation path in correct order | Password input unlocks |
| Room 05 — Behaviour Trail | Player identifies the correct drop-off transition | Password input unlocks |

### 9b. Password Win Conditions

| Room | Required Input | Unlocks |
|---|---|---|
| Room 01 | `FOCUS` | Room 02 |
| Room 02 | `CLARITY` | Room 03 |
| Room 03 | `CONFIDENCE` | Room 04 |
| Room 04 | `APRH` | Room 05 |
| Room 05 | `USERFOUND` | Final Resolution |

### 9c. Global Win Condition

```
caseClosed = true

Requires ALL of:
  - room01Solved = true  AND  room02Unlocked = true
  - room02Solved = true  AND  room03Unlocked = true
  - room03Solved = true  AND  room04Unlocked = true
  - room04Solved = true  AND  room05Unlocked = true
  - room05Solved = true  AND  finaleUnlocked = true
```

### 9d. Partial State Recovery

If a player refreshes mid-session, `GameState` is persisted to `localStorage` under the key `"ux-escape:state"`. On mount, the app rehydrates from storage and restores the player to the last active room.

```typescript
// gameState.ts
const STORAGE_KEY = "ux-escape:state";

function loadState(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveState(state: GameState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
```

---

## 10. PROTOTYPE FLOW

### 10a. Complete Navigation Map

```
[Landing Screen]
    │  "Open the Case" button
    ▼
[Intro — Case Briefing]
    │  "Begin Investigation" button
    ▼
[Room 01 — Visual Evidence]
    │  Puzzle interaction → roomState: investigating → solved
    │  Password area activates
    │  Player types "FOCUS" → SuccessOverlay (2s)
    ▼
[ProgressBoard — 1/5 leads pinned]
    │  "Open Next File" button
    ▼
[Room 02 — Silent Playback]
    │  Puzzle interaction → solved
    │  Player types "CLARITY" → SuccessOverlay (2s)
    ▼
[ProgressBoard — 2/5 leads pinned]
    │  "Open Next File" button
    ▼
[Room 03 — Research Wall]
    │  Puzzle interaction → solved
    │  Player types "CONFIDENCE" → SuccessOverlay (2s)
    ▼
[ProgressBoard — 3/5 leads pinned]
    │  "Open Next File" button
    ▼
[Room 04 — Navigation Blueprint]
    │  Puzzle interaction → solved
    │  Player types "APRH" → SuccessOverlay (2s)
    ▼
[ProgressBoard — 4/5 leads pinned]
    │  "Open Next File" button
    ▼
[Room 05 — Behaviour Trail]
    │  Puzzle interaction → solved
    │  Player types "USERFOUND" → SuccessOverlay (2s)
    ▼
[ProgressBoard — 5/5 leads pinned]
    │  "Name the Missing User" button
    ▼
[Final Resolution — caseClosed]
    │  "Reopen the Case" button (resets all state)
    ▼
[Landing Screen]  ← loop
```

### 10b. Overlay Flow

```
WITHIN ANY ROOM:

[Active Room]
    │  [HINT ▾] tapped
    ▼
[HintModule — expanded]      ← inline drawer, not a modal
    │  Tap anywhere outside / close button
    ▼
[Active Room — resumed]

[Active Room]
    │  Wrong password submitted
    ▼
[ErrorState — shake + message]   ← inline, no navigation
    │  1000ms lockout expires
    ▼
[Active Room — input re-enabled]

[Active Room — solved]
    │  Correct password submitted
    ▼
[SuccessOverlay — full screen]   ← mounts over room
    │  2-second auto-advance OR "Follow the Lead" button
    ▼
[ProgressBoard]
```

### 10c. Interaction → State Events

| Interaction | Action Dispatched | State Change |
|---|---|---|
| "Open the Case" clicked | `ENTER_INTRO` | phase: landing → intro |
| "Begin Investigation" clicked | `ENTER_ROOM(1)` | room01State: available → investigating |
| Puzzle element correctly interacted | `PUZZLE_SOLVED(N)` | roomNNSolved: true, state → solved |
| Correct password submitted | `ROOM_COMPLETED(N)` | state → completed, next room unlocked |
| Wrong password submitted | `PASSWORD_ERROR` | passwordError: true |
| "Open Next File" clicked | `ENTER_ROOM(N+1)` | next roomState: available → investigating |
| "Name the Missing User" clicked | `ENTER_FINALE` | phase → finale, caseClosed: true |
| "Reopen the Case" clicked | `GAME_RESET` | all state → default |
| [HINT ▾] revealed | `HINT_USED(N)` | roomNNHintUsed: true, hintCount++ |

---

## 11. ROOM REGISTRY

Complete room metadata used across `gameData.ts`.

```typescript
export const ROOMS: RoomMeta[] = [
  {
    index: 1,
    id: "visual-evidence",
    fileNo: "CASE FILE 01",
    title: "Visual Evidence",
    location: "The Design Archive",
    password: "FOCUS",
    timeTarget: 180,        // seconds
    uxConcept: "Visual Hierarchy",
    hint: "Not everything deserves the same volume. Find what's actually speaking.",
    lead: "She kept asking what mattered most — but no one had cleared the noise to show her.",
  },
  {
    index: 2,
    id: "silent-playback",
    fileNo: "CASE FILE 02",
    title: "Silent Playback",
    location: "The Prototype Lab",
    password: "CLARITY",
    timeTarget: 180,
    uxConcept: "Interaction Feedback",
    hint: "Every action deserves a reply. Match each moment to its answer.",
    lead: "The interface never spoke back. She pressed the button into silence.",
  },
  {
    index: 3,
    id: "research-wall",
    fileNo: "CASE FILE 03",
    title: "Research Wall",
    location: "The Research Room",
    password: "CONFIDENCE",
    timeTarget: 240,
    uxConcept: "Research Synthesis",
    hint: "The quotes disagree on the surface. Underneath, they cluster by feeling.",
    lead: "Every interview pointed here: she never trusted the final step.",
  },
  {
    index: 4,
    id: "navigation-blueprint",
    fileNo: "CASE FILE 04",
    title: "Lost Navigation Blueprint",
    location: "The Information Vault",
    password: "APRH",
    timeTarget: 180,
    uxConcept: "Information Architecture",
    hint: "The path exists — the order is scrambled. Restore the route.",
    lead: "The map was broken. She reached a dead end where the path should have been clear.",
  },
  {
    index: 5,
    id: "behaviour-trail",
    fileNo: "CASE FILE 05",
    title: "Behaviour Trail",
    location: "The Analytics Vault",
    password: "USERFOUND",
    timeTarget: 240,
    uxConcept: "User Behaviour Analysis",
    hint: "Follow the numbers. Find where the crowd disappears.",
    lead: "The trail went cold at Checkout — she reached the edge, then disappeared.",
  },
];
```

---

## 12. FACILITATOR GUIDE ARCHITECTURE

The Facilitator Guide is a separate, hidden route accessible only via a secret URL path (`/facilitator`) or keyboard shortcut. It is never visible to players.

### Content

| Section | Content |
|---|---|
| **Password Cheat Sheet** | All 5 passwords in order, large and readable |
| **Hint Answers** | Correct answer for each puzzle, step by step |
| **Time Check** | Per-room target times; green/amber/red guidance |
| **Pace Interventions** | If a group is stuck > 3 min: suggested nudges (not answers) |
| **Debrief Guide** | Post-game: reveal the UX concept behind each room |
| **Reset Button** | Single button that calls `GAME_RESET` and clears localStorage |

### Facilitator Password Table

```
┌──────────────────────────────────────────────────────────┐
│  FACILITATOR REFERENCE — DO NOT SHARE WITH PLAYERS       │
├─────────────────┬────────────────┬────────────────────── │
│  CASE FILE      │  PASSWORD      │  UX CONCEPT           │
├─────────────────┼────────────────┼────────────────────── │
│  01             │  FOCUS         │  Visual Hierarchy     │
│  02             │  CLARITY       │  Interaction Feedback │
│  03             │  CONFIDENCE    │  Research Synthesis   │
│  04             │  APRH          │  Information Arch.    │
│  05             │  USERFOUND     │  User Behaviour       │
└─────────────────┴────────────────┴───────────────────────┘
```

### Access

```typescript
// App.tsx — facilitator route guard
const isFacilitator = window.location.pathname === "/facilitator"
  || window.location.hash === "#facilitator";

if (isFacilitator) return <FacilitatorGuide />;
```

---

## SUMMARY CHECKLIST

### Architecture is complete when:

- [ ] `gameData.ts` — 5 room objects, passwords, hints, leads
- [ ] `gameState.ts` — all variables from §3a, reducer, localStorage persistence
- [ ] `gameConstants.ts` — RoomState enum, Phase type, timing constants
- [ ] `RoomShell.tsx` — canonical layout (header / briefing / main / working / password / hint)
- [ ] `PasswordModule.tsx` — validate, error shake, success dispatch
- [ ] `HintModule.tsx` — collapsed by default, one reveal per room
- [ ] `SuccessOverlay.tsx` — stamp slam + lead text + auto-advance
- [ ] `ProgressTracker.tsx` — 5 dots, filled by solvedCount
- [ ] `ProgressBoard.tsx` — red-string leads board between rooms
- [ ] `CursorPresence.tsx` — no-op provider wired, cursor-only render
- [ ] `FacilitatorGuide.tsx` — password table + reset
- [ ] 5 room puzzle components stubbed with correct interface
- [ ] `App.tsx` — phase switch updated for 5-room flow

---

*Document version: 1.0 | Architecture only — no puzzle visuals or final layouts*
