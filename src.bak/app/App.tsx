import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Intro } from "./components/escape/Intro";
import { ProgressBoard } from "./components/escape/ProgressBoard";
import { Finale } from "./components/escape/Finale";
import { Room01_VisualEvidence } from "./components/escape/rooms/Room01_VisualEvidence";
import { Room02_SilentPlayback } from "./components/escape/rooms/Room02_SilentPlayback";
import { Room03_ContradictoryInterview } from "./components/escape/rooms/Room03_ContradictoryInterview";
import { Room04_LostNavigationBlueprint } from "./components/escape/rooms/Room04_LostNavigationBlueprint";
import { RoomBehaviour } from "./components/escape/rooms/RoomBehaviour";
import { ROOMS } from "./components/escape/gameData";
import { MusicWidget } from "./components/MusicWidget";
import { bgMusic } from "./bgMusic";

type Phase =
  | { kind: "intro" }
  | { kind: "room"; index: number }
  | { kind: "board"; solved: number }
  | { kind: "finale" };

const ROOM_COMPONENTS = [Room01_VisualEvidence, Room02_SilentPlayback, Room03_ContradictoryInterview, Room04_LostNavigationBlueprint, RoomBehaviour];

export default function App() {
  const [phase, setPhase] = useState<Phase>({ kind: "intro" });
  const showMusic = phase.kind !== "intro";

  function startGame() {
    bgMusic.play();
    setPhase({ kind: "room", index: 0 });
  }

  function renderPhase() {
    switch (phase.kind) {
      case "intro":
        return <Intro key="intro" onBegin={startGame} />;
      case "room": {
        const Room = ROOM_COMPONENTS[phase.index];
        return (
          <Room
            key={`room-${phase.index}`}
            onComplete={() => setPhase({ kind: "board", solved: phase.index + 1 })}
          />
        );
      }
      case "board":
        return (
          <ProgressBoard
            key={`board-${phase.solved}`}
            solvedCount={phase.solved}
            lastFile={phase.solved >= ROOMS.length}
            onContinue={() =>
              phase.solved >= ROOMS.length
                ? setPhase({ kind: "finale" })
                : setPhase({ kind: "room", index: phase.solved })
            }
          />
        );
      case "finale":
        return <Finale key="finale" onRestart={() => setPhase({ kind: "intro" })} />;
    }
  }

  return (
    <div className="noir-root noir-grain noir-vignette size-full overflow-x-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={
            phase.kind === "room"
              ? `room-${phase.index}`
              : phase.kind === "board"
                ? `board-${phase.solved}`
                : phase.kind
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {renderPhase()}
        </motion.div>
      </AnimatePresence>

      {/* Persistent music control — hidden on intro */}
      <AnimatePresence>
        {showMusic && (
          <motion.div
            key="music-widget"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <MusicWidget />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
