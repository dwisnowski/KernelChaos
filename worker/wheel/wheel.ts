import type { WheelLastSpin, WheelWedge } from "./protocol.ts";
import { WHEEL_SPIN_MS } from "./protocol.ts";

/** ~30 slices: cash mix + full special set (one LOSE TURN, two FREE SPIN). */
export const WHEEL_WEDGES: WheelWedge[] = [
  { kind: "cash", value: 500, label: "500" },
  { kind: "cash", value: 600, label: "600" },
  { kind: "payEach", label: "PAY $50" },
  { kind: "cash", value: 700, label: "700" },
  { kind: "bankrupt", label: "BANKRUPT" },
  { kind: "cash", value: 800, label: "800" },
  { kind: "double", label: "DOUBLE" },
  { kind: "cash", value: 900, label: "900" },
  { kind: "flatBonus", value: 500, label: "+500" },
  { kind: "cash", value: 550, label: "550" },
  { kind: "jackpot", label: "JACKPOT" },
  { kind: "cash", value: 650, label: "650" },
  { kind: "half", label: "HALF" },
  { kind: "freeSpin", label: "FREE SPIN" },
  { kind: "cash", value: 700, label: "700" },
  { kind: "swapBanks", label: "SWAP" },
  { kind: "cash", value: 800, label: "800" },
  { kind: "steal", label: "STEAL" },
  { kind: "cash", value: 2500, label: "2500" },
  { kind: "freeLetter", label: "FREE LTR" },
  { kind: "cash", value: 400, label: "400" },
  { kind: "wildVowel", label: "FREE VOWEL" },
  { kind: "loseTurn", label: "LOSE TURN" },
  { kind: "mystery", label: "MYSTERY" },
  { kind: "cash", value: 600, label: "600" },
  { kind: "passWheel", label: "PASS" },
  { kind: "chaosTax", label: "CHAOS TAX" },
  { kind: "bankruptLite", label: "½ BANKRUPT" },
  { kind: "mirror", label: "MIRROR" },
  { kind: "speed", label: "SPEED" },
  { kind: "insurance", label: "INSURE" },
  { kind: "freeSpin", label: "FREE SPIN" },
  { kind: "cash", value: 300, label: "300" },
  { kind: "bankrupt", label: "BANKRUPT" },
];

const TAU = Math.PI * 2;

/** Pointer sits at the top (-π/2). Returns angle so wedge center lands under the pointer. */
export function angleForWedge(wedgeIndex: number, wedgeCount: number, extraTurns = 4): number {
  const slice = TAU / wedgeCount;
  const centerLocal = -Math.PI / 2 + wedgeIndex * slice + slice / 2;
  let target = -Math.PI / 2 - centerLocal;
  target = ((target % TAU) + TAU) % TAU;
  return target + extraTurns * TAU;
}

export function pickSpin(now = Date.now()): {
  wedgeIndex: number;
  wedge: WheelWedge;
  lastSpin: WheelLastSpin;
} {
  const wedgeIndex = Math.floor(Math.random() * WHEEL_WEDGES.length);
  const wedge = WHEEL_WEDGES[wedgeIndex]!;
  const extraTurns = 4 + Math.floor(Math.random() * 3);
  const targetAngle = angleForWedge(wedgeIndex, WHEEL_WEDGES.length, extraTurns);
  return {
    wedgeIndex,
    wedge,
    lastSpin: {
      wedgeIndex,
      targetAngle,
      startedAt: now,
      endsAt: now + WHEEL_SPIN_MS,
    },
  };
}
