import bgSrc from "@/imports/bg-music.mp3";

/* Singleton audio — survives across phase changes */
const audio = new Audio(bgSrc);
audio.loop = true;
audio.volume = 0.4;

export const bgMusic = {
  play() {
    if (audio.paused) audio.play().catch(() => {});
  },
  pause() {
    audio.pause();
  },
  setVolume(v: number) {
    audio.volume = Math.max(0, Math.min(1, v));
  },
  getVolume() {
    return audio.volume;
  },
  isPaused() {
    return audio.paused;
  },
};
