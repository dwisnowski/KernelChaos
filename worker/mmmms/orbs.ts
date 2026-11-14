export const ORB_COLORS = [
  "red",
  "orange",
  "yellow",
  "green",
  "brown",
  "indigo",
  "violet",
] as const;

export type OrbColor = (typeof ORB_COLORS)[number];

export function isOrbColor(v: unknown): v is OrbColor {
  return typeof v === "string" && (ORB_COLORS as readonly string[]).includes(v);
}

/** Index 0 = bottom of the stack (explodes first). */
export function dealOrbs(count: number, rng: () => number = Math.random): OrbColor[] {
  const out: OrbColor[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(rng() * ORB_COLORS.length);
    out.push(ORB_COLORS[idx]!);
  }
  return out;
}

export type AttackStep =
  | { kind: "explode"; color: OrbColor }
  | { kind: "halt"; color: OrbColor };

export interface AttackResolution {
  /** Stack after removing exploded orbs (halts stay). */
  remaining: OrbColor[];
  steps: AttackStep[];
  explodedCount: number;
  /** False when the attack color was absent from the defender stack (go fish). */
  colorInStack: boolean;
}

/**
 * Explode from bottom (index 0) through and including the first orb matching
 * `attackColor`. If the color is absent, the entire stack is in the path.
 * When `guessCorrect`, each orb independently has 50% chance to survive and
 * halt the chain (orb stays); otherwise it explodes and the chain continues.
 */
export function resolveAttack(
  stack: OrbColor[],
  attackColor: OrbColor,
  guessCorrect: boolean,
  rng: () => number = Math.random,
): AttackResolution {
  const matchIdx = stack.findIndex((c) => c === attackColor);
  const colorInStack = matchIdx !== -1;
  const pathEnd = colorInStack ? matchIdx : stack.length - 1;

  const steps: AttackStep[] = [];
  const remaining: OrbColor[] = [];
  let halted = false;
  let explodedCount = 0;

  for (let i = 0; i < stack.length; i++) {
    const color = stack[i]!;
    if (halted || i > pathEnd) {
      remaining.push(color);
      continue;
    }
    if (guessCorrect && rng() < 0.5) {
      steps.push({ kind: "halt", color });
      remaining.push(color);
      halted = true;
      continue;
    }
    steps.push({ kind: "explode", color });
    explodedCount += 1;
  }

  return { remaining, steps, explodedCount, colorInStack };
}
