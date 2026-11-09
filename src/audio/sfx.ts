const MUTE_KEY = "kernelchaos.mute";

let ctx: AudioContext | null = null;
let muted = localStorage.getItem(MUTE_KEY) === "1";

function getCtx(): AudioContext | null {
  if (muted) return null;
  if (!ctx) {
    ctx = new AudioContext();
  }
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  return ctx;
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(value: boolean): void {
  muted = value;
  localStorage.setItem(MUTE_KEY, value ? "1" : "0");
}

export function unlockAudio(): void {
  const c = getCtx();
  if (c?.state === "suspended") void c.resume();
}

function tone(
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType = "sine",
  gain = 0.08,
): void {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, start);
  g.gain.exponentialRampToValueAtTime(0.001, start + dur);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(start);
  osc.stop(start + dur);
}

export function playWordFound(wordLength: number): void {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  if (wordLength <= 4) {
    tone(523, t, 0.12, "triangle", 0.07);
  } else if (wordLength === 5) {
    tone(523, t, 0.1, "triangle", 0.07);
    tone(659, t + 0.08, 0.12, "triangle", 0.07);
  } else if (wordLength <= 7) {
    tone(523, t, 0.09, "sine", 0.08);
    tone(659, t + 0.07, 0.09, "sine", 0.08);
    tone(784, t + 0.14, 0.14, "sine", 0.09);
  } else {
    tone(523, t, 0.1, "sine", 0.09);
    tone(659, t + 0.08, 0.1, "sine", 0.09);
    tone(784, t + 0.16, 0.1, "sine", 0.1);
    tone(1046, t + 0.26, 0.22, "triangle", 0.11);
  }
}

export function playReject(): void {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  tone(180, t, 0.15, "square", 0.04);
}

export function playCountdownTick(): void {
  const c = getCtx();
  if (!c) return;
  tone(880, c.currentTime, 0.08, "sine", 0.06);
}

export function playLastSeconds(secondsLeft: number): void {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  const freq = 440 + (5 - secondsLeft) * 80;
  tone(freq, t, 0.1, "square", 0.05);
}

export function playRoundEnd(): void {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  tone(392, t, 0.15, "triangle", 0.08);
  tone(349, t + 0.12, 0.2, "triangle", 0.08);
}

export function playWinner(): void {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  tone(523, t, 0.12, "sine", 0.09);
  tone(659, t + 0.1, 0.12, "sine", 0.09);
  tone(784, t + 0.2, 0.12, "sine", 0.09);
  tone(1046, t + 0.32, 0.28, "triangle", 0.1);
}
