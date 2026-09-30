import bgSrc from "@/imports/bg-music.mp3";

/* Singleton audio — survives across phase changes */
const STORAGE_KEY = "escape-room:music";
const DEFAULT_VOLUME = 0.12;
const DUCK_RATIO = 0.25;

function loadSettings(): { volume: number; muted: boolean } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (typeof s.volume === "number") return { volume: s.volume, muted: !!s.muted };
    }
  } catch {
    // ignore corrupt storage
  }
  return { volume: DEFAULT_VOLUME, muted: false };
}

const audio = new Audio(bgSrc);
audio.loop = true;
audio.volume = 0;

let { volume, muted } = loadSettings();
let duckCount = 0;
let fadeId: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ volume, muted }));
  } catch {
    // storage unavailable
  }
}

function target() {
  if (muted) return 0;
  return duckCount > 0 ? volume * DUCK_RATIO : volume;
}

function fadeTo(to: number, ms: number, onDone?: () => void) {
  if (fadeId) clearInterval(fadeId);
  const from = audio.volume;
  const steps = Math.max(1, Math.round(ms / 30));
  let i = 0;
  fadeId = setInterval(() => {
    i++;
    audio.volume = Math.max(0, Math.min(1, from + (to - from) * (i / steps)));
    if (i >= steps) {
      clearInterval(fadeId!);
      fadeId = null;
      onDone?.();
    }
  }, 30);
}

function notify() {
  listeners.forEach((l) => l());
}

export const bgMusic = {
  play() {
    if (!audio.paused) return;
    audio.volume = 0;
    audio.play().catch(() => {});
    fadeTo(target(), 2500);
  },
  pause() {
    fadeTo(0, 600, () => audio.pause());
  },
  setVolume(v: number) {
    volume = Math.max(0, Math.min(1, v));
    muted = volume === 0;
    fadeTo(target(), 120);
    save();
    notify();
  },
  setMuted(m: boolean) {
    muted = m;
    if (!m && volume === 0) volume = DEFAULT_VOLUME;
    fadeTo(target(), 300);
    save();
    notify();
  },
  duck() {
    duckCount++;
    fadeTo(target(), 500);
  },
  unduck() {
    duckCount = Math.max(0, duckCount - 1);
    fadeTo(target(), 900);
  },
  getVolume() {
    return volume;
  },
  isMuted() {
    return muted;
  },
  isPaused() {
    return audio.paused;
  },
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};
