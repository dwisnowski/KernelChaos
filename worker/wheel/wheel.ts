import type { WheelLastSpin, WheelWedge } from "./protocol.ts";
import { WHEEL_SPIN_MS } from "./protocol.ts";

/** Classic-feeling family wheel: cash plus Bankrupt, Lose a Turn, Free Spin. */
export const WHEEL_WEDGES: WheelWedge[] = [
  { kind: "cash", value: 500, label: "500" },
  { kind: "cash", value: 600, label: "600" },
  { kind: "cash", value: 700, label: "700" },
  { kind: "bankrupt", label: "BANKRUPT" },
  { kind: "cash", value: 800, label: "800" },
  { kind: "cash", value: 900, label: "900" },
  { kind: "cash", value: 500, label: "500" },
  { kind: "loseTurn", label: "LOSE TURN" },
  { kind: "cash", value: 650, label: "650" },
  { kind: "cash", value: 700, label: "700" },
  { kind: "cash", value: 800, label: "800" },
  { kind: "freeSpin", label: "FREE SPIN" },
  { kind: "cash", value: 550, label: "550" },
  { kind: "cash", value: 2500, label: "2500" },
  { kind: "bankrupt", label: "BANKRUPT" },
  { kind: "cash", value: 300, label: "300" },
  { kind: "cash", value: 400, label: "400" },
  { kind: "cash", value: 500, label: "500" },
  { kind: "loseTurn", label: "LOSE TURN" },
  { kind: "cash", value: 600, label: "600" },
  { kind: "cash", value: 700, label: "700" },
  { kind: "cash", value: 900, label: "900" },
  { kind: "cash", value: 650, label: "650" },
  { kind: "cash", value: 800, label: "800" },
];

const TAU = Math.PI * 2;

/** Pointer sits at the top (-π/2). Returns angle so wedge center lands under the pointer. */
export function angleForWedge(wedgeIndex: number, wedgeCount: number, extraTurns = 4): number {
  const slice = TAU / wedgeCount;
  // Wedge i occupies [i*slice, (i+1)*slice) in wheel-local space starting at +x.
  // Canvas draw typically starts at -π/2 for first wedge; match that: wedge 0 centered at -π/2 + slice/2.
  const centerLocal = -Math.PI / 2 + wedgeIndex * slice + slice / 2;
  // We rotate the wheel by `angle`; pointer is fixed at top (-π/2).
  // After rotation, local angle `centerLocal` maps to `centerLocal + angle` (mod TAU).
  // Want centerLocal + angle ≡ -π/2 (mod TAU) → angle ≡ -π/2 - centerLocal.
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
