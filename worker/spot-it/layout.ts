import { SPOT_IT_SYMBOLS_PER_CARD } from "./deck.ts";

export interface SpotItPlacement {
  symbolIndex: number;
  /** Center x in 0–1 card space. */
  x: number;
  /** Center y in 0–1 card space. */
  y: number;
  rotateDeg: number;
  scale: number;
}

export interface SpotItCardView {
  cardIndex: number;
  symbolIndices: number[];
  placements: SpotItPlacement[];
  seed: number;
}

/** Mulberry32 — small seeded PRNG. */
function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Place 8 symbols on a circular card with mild jitter, rotation, and scale.
 * Positions are roughly on a ring + one near center so they stay readable.
 */
export function layoutCard(
  cardIndex: number,
  symbolIndices: number[],
  seed: number,
): SpotItCardView {
  const rand = mulberry32((seed ^ (cardIndex * 2654435761)) >>> 0);
  const n = Math.min(symbolIndices.length, SPOT_IT_SYMBOLS_PER_CARD);
  const placements: SpotItPlacement[] = [];

  // One near center
  if (n > 0) {
    placements.push({
      symbolIndex: symbolIndices[0],
      x: 0.5 + (rand() - 0.5) * 0.12,
      y: 0.5 + (rand() - 0.5) * 0.12,
      rotateDeg: (rand() - 0.5) * 50,
      scale: 0.88 + rand() * 0.28,
    });
  }

  // Remaining on a ring
  const ring = n - 1;
  for (let i = 0; i < ring; i++) {
    const base = (i / ring) * Math.PI * 2 + rand() * 0.25;
    const radius = 0.28 + rand() * 0.08;
    placements.push({
      symbolIndex: symbolIndices[i + 1],
      x: 0.5 + Math.cos(base) * radius,
      y: 0.5 + Math.sin(base) * radius,
      rotateDeg: (rand() - 0.5) * 70,
      scale: 0.78 + rand() * 0.36,
    });
  }

  // Shuffle placement order so the “center” symbol isn’t always first visually predictable by index
  for (let i = placements.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = placements[i];
    placements[i] = placements[j];
    placements[j] = tmp;
  }

  return {
    cardIndex,
    symbolIndices: [...symbolIndices],
    placements,
    seed,
  };
}
