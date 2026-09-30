/* Web Audio API sound synthesizer for Room 02 — The Silent Playback.
   Each sound represents a distinct interaction feedback archetype.
   All synthesis is in-browser; no external files required. */

let _ctx: AudioContext | null = null;

function ctx(): AudioContext {
  if (!_ctx) _ctx = new AudioContext();
  if (_ctx.state === "suspended") _ctx.resume();
  return _ctx;
}

function gain(ac: AudioContext, value: number, startTime: number, endTime: number) {
  const g = ac.createGain();
  g.gain.setValueAtTime(value, startTime);
  g.gain.linearRampToValueAtTime(0, endTime);
  g.connect(ac.destination);
  return g;
}

function tone(ac: AudioContext, freq: number, startTime: number, duration: number, volume = 0.18) {
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, startTime);
  g.gain.setValueAtTime(volume, startTime);
  g.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.01);
}

/* ── Individual sound designs ─────────────────────────────────────── */

function singleBeep(ac: AudioContext) {
  tone(ac, 880, ac.currentTime, 0.12);
}

function doubleBeep(ac: AudioContext) {
  const t = ac.currentTime;
  tone(ac, 880, t, 0.09);
  tone(ac, 880, t + 0.14, 0.09);
}

function risingTone(ac: AudioContext) {
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(300, t);
  osc.frequency.linearRampToValueAtTime(1200, t + 0.34);
  g.gain.setValueAtTime(0.16, t);
  g.gain.linearRampToValueAtTime(0, t + 0.38);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start(t);
  osc.stop(t + 0.4);
}

function errorBuzz(ac: AudioContext) {
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(130, t);
  osc.frequency.setValueAtTime(110, t + 0.06);
  osc.frequency.setValueAtTime(130, t + 0.12);
  const lp = ac.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 900;
  g.gain.setValueAtTime(0.14, t);
  g.gain.linearRampToValueAtTime(0, t + 0.22);
  osc.connect(lp);
  lp.connect(g);
  g.connect(ac.destination);
  osc.start(t);
  osc.stop(t + 0.25);
}

function successChime(ac: AudioContext) {
  const t = ac.currentTime;
  // C5 → E5 → G5 ascending arpeggio
  tone(ac, 523.25, t + 0.00, 0.32, 0.15);
  tone(ac, 659.25, t + 0.10, 0.32, 0.15);
  tone(ac, 783.99, t + 0.20, 0.45, 0.15);
}

function softTap(ac: AudioContext) {
  const t = ac.currentTime;
  const buf = ac.createBuffer(1, ac.sampleRate * 0.05, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = ac.createBufferSource();
  const filter = ac.createBiquadFilter();
  const g = ac.createGain();
  filter.type = "bandpass";
  filter.frequency.value = 2000;
  filter.Q.value = 0.5;
  g.gain.setValueAtTime(0.2, t);
  g.gain.linearRampToValueAtTime(0, t + 0.05);
  src.buffer = buf;
  src.connect(filter);
  filter.connect(g);
  g.connect(ac.destination);
  src.start(t);
}

function longHum(ac: AudioContext) {
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(220, t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.13, t + 0.12);
  g.gain.setValueAtTime(0.13, t + 0.5);
  g.gain.linearRampToValueAtTime(0, t + 0.7);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start(t);
  osc.stop(t + 0.75);
}

/* ── Public API ───────────────────────────────────────────────────── */

const SOUND_MAP: Record<string, (ac: AudioContext) => void> = {
  "Single Beep": singleBeep,
  "Double Beep": doubleBeep,
  "Rising Tone": risingTone,
  "Error Buzz": errorBuzz,
  "Success Chime": successChime,
  "Soft Tap": softTap,
  "Long Hum": longHum,
};

export function playStripSound(soundName: string) {
  try {
    const fn = SOUND_MAP[soundName];
    if (fn) fn(ctx());
  } catch {
    // AudioContext blocked or unavailable — silent fail
  }
}

export function playSuccess() {
  try {
    successChime(ctx());
  } catch {
    // silent fail
  }
}

export function playError() {
  try {
    errorBuzz(ctx());
  } catch {
    // silent fail
  }
}
