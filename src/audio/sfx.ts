import type { BonusId } from "../types.ts";

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

/** Higher = more exciting; play at most top N so stacks do not mush. */
export const BONUS_SFX_PRIORITY: BonusId[] = [
  "ladder1",
  "lastWord",
  "loneWolf",
  "thief",
  "unique",
  "span",
  "straight",
  "ladder2",
  "ladder3",
  "clutch10",
  "coverage",
  "rare",
  "center",
  "noVowel",
  "snake",
];

function playBonusTone(id: BonusId, at: number): number {
  const c = getCtx();
  if (!c) return 0;
  switch (id) {
    case "straight":
      tone(880, at, 0.08, "triangle", 0.07);
      tone(1175, at + 0.07, 0.1, "triangle", 0.07);
      return 0.2;
    case "snake":
      tone(330, at, 0.06, "sawtooth", 0.035);
      tone(392, at + 0.05, 0.06, "sawtooth", 0.035);
      tone(349, at + 0.1, 0.08, "sawtooth", 0.03);
      return 0.22;
    case "unique":
      tone(784, at, 0.12, "sine", 0.08);
      tone(988, at + 0.1, 0.18, "sine", 0.09);
      return 0.3;
    case "clutch10":
      tone(660, at, 0.05, "square", 0.045);
      tone(880, at + 0.06, 0.08, "square", 0.05);
      return 0.18;
    case "ladder1":
      tone(523, at, 0.1, "triangle", 0.09);
      tone(659, at + 0.09, 0.1, "triangle", 0.09);
      tone(784, at + 0.18, 0.1, "triangle", 0.1);
      tone(1046, at + 0.28, 0.22, "sine", 0.11);
      return 0.52;
    case "ladder2":
      tone(523, at, 0.09, "triangle", 0.08);
      tone(698, at + 0.09, 0.14, "triangle", 0.09);
      return 0.26;
    case "ladder3":
      tone(587, at, 0.12, "triangle", 0.07);
      return 0.14;
    case "lastWord":
      tone(196, at, 0.12, "square", 0.06);
      tone(147, at + 0.1, 0.22, "triangle", 0.08);
      return 0.35;
    case "rare":
      tone(1480, at, 0.05, "sine", 0.05);
      tone(1760, at + 0.04, 0.08, "triangle", 0.055);
      return 0.14;
    case "noVowel":
      tone(277, at, 0.05, "square", 0.035);
      tone(311, at + 0.05, 0.08, "triangle", 0.04);
      return 0.16;
    case "center":
      tone(740, at, 0.06, "sine", 0.06);
      tone(740, at + 0.08, 0.08, "sine", 0.05);
      return 0.18;
    case "span":
      tone(220, at, 0.08, "sine", 0.06);
      tone(440, at + 0.08, 0.1, "sine", 0.07);
      tone(880, at + 0.18, 0.14, "triangle", 0.08);
      return 0.36;
    case "thief":
      tone(415, at, 0.06, "sawtooth", 0.04);
      tone(220, at + 0.07, 0.12, "square", 0.045);
      return 0.22;
    case "loneWolf":
      tone(294, at, 0.15, "sine", 0.07);
      tone(440, at + 0.14, 0.22, "sine", 0.08);
      return 0.4;
    case "coverage":
      tone(523, at, 0.05, "triangle", 0.04);
      tone(587, at + 0.05, 0.05, "triangle", 0.04);
      tone(659, at + 0.1, 0.05, "triangle", 0.04);
      tone(698, at + 0.15, 0.1, "triangle", 0.05);
      return 0.28;
    default:
      return 0;
  }
}

/** Play up to `max` highest-priority bonus cues in sequence. */
export function playBonusAwards(bonuses: BonusId[], max = 3): void {
  if (!bonuses.length) return;
  const c = getCtx();
  if (!c) return;
  const ranked = BONUS_SFX_PRIORITY.filter((id) => bonuses.includes(id)).slice(0, max);
  let t = c.currentTime;
  for (const id of ranked) {
    const dur = playBonusTone(id, t);
    t += Math.max(dur * 0.55, 0.08);
  }
}

/** Scattergories: letter revealed / countdown flair. */
export function playLetterRoll(): void {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  tone(392, t, 0.08, "triangle", 0.07);
  tone(523, t + 0.08, 0.1, "triangle", 0.08);
  tone(784, t + 0.18, 0.16, "sine", 0.09);
}

/** Scattergories: host advances review category. */
export function playReviewAdvance(): void {
  const c = getCtx();
  if (!c) return;
  tone(660, c.currentTime, 0.09, "sine", 0.06);
}

/** Scattergories: duplicate cancel cue on reveal. */
export function playDupeCancel(): void {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  tone(220, t, 0.08, "square", 0.035);
  tone(180, t + 0.07, 0.12, "square", 0.03);
}

/** Scattergories: host toggles invalid. */
export function playInvalidToggle(): void {
  const c = getCtx();
  if (!c) return;
  tone(311, c.currentTime, 0.1, "triangle", 0.05);
}

/** M&Ms Smash: stacks dealt / enter organize. */
export function playMmmmsDeal(): void {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  tone(330, t, 0.06, "triangle", 0.05);
  tone(392, t + 0.05, 0.06, "triangle", 0.055);
  tone(494, t + 0.1, 0.06, "triangle", 0.06);
  tone(587, t + 0.15, 0.1, "sine", 0.07);
}

/** M&Ms Smash: player locks stack order. */
export function playMmmmsLock(): void {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  tone(440, t, 0.08, "triangle", 0.06);
  tone(554, t + 0.07, 0.12, "sine", 0.07);
}

/** M&Ms Smash: defender commits guess color. */
export function playMmmmsGuess(): void {
  const c = getCtx();
  if (!c) return;
  tone(698, c.currentTime, 0.1, "sine", 0.06);
}

/** M&Ms Smash: attack resolve begins (smash sting). */
export function playMmmmsSmash(): void {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  tone(196, t, 0.1, "square", 0.05);
  tone(147, t + 0.06, 0.14, "sawtooth", 0.04);
  tone(98, t + 0.12, 0.18, "triangle", 0.06);
}

/** M&Ms Smash: one orb explodes; pitch rises slightly along the chain. */
export function playMmmmsExplode(stepIndex: number): void {
  const c = getCtx();
  if (!c) return;
  const freq = 320 + Math.min(stepIndex, 12) * 28;
  tone(freq, c.currentTime, 0.09, "square", 0.045);
}

/** M&Ms Smash: correct-guess survive-and-halt. */
export function playMmmmsHalt(): void {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  tone(880, t, 0.06, "triangle", 0.07);
  tone(1175, t + 0.05, 0.12, "sine", 0.08);
}

/** M&Ms Smash: local player lost the duel. */
export function playMmmmsDefeat(): void {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  tone(349, t, 0.14, "triangle", 0.07);
  tone(277, t + 0.12, 0.18, "sine", 0.08);
  tone(220, t + 0.28, 0.24, "triangle", 0.07);
}
