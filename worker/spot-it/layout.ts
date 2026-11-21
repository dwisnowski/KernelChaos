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

function dist(ax: number, ay: number, bx: number, by: number): number {
  const dx = ax - bx;
  const dy = ay - by;
  return Math.hypot(dx, dy);
}

/** Scale roughly [0.50, 1.45] — wide zoom variance between symbols. */
function randomScale(rand: () => number): number {
  return 0.5 + rand() * 0.95;
}

/**
 * Place 8 symbols with strong separation, full 360° rotation, and wide scale range.
 * One near center; the rest scatter on an outer band with min-distance packing.
 */
export function layoutCard(
  cardIndex: number,
  symbolIndices: number[],
  seed: number,
): SpotItCardView {
  const rand = mulberry32((seed ^ (cardIndex * 2654435761)) >>> 0);
  const n = Math.min(symbolIndices.length, SPOT_IT_SYMBOLS_PER_CARD);
  const placements: SpotItPlacement[] = [];
  const used: { x: number; y: number }[] = [];

  // Keep glyph centers inside the card; leave room for large scales (~26% base × 1.45).
  const margin = 0.17;
  const minDist = 0.26;

  const push = (symbolIndex: number, x: number, y: number) => {
    placements.push({
      symbolIndex,
      x,
      y,
      rotateDeg: rand() * 360,
      scale: randomScale(rand),
    });
    used.push({ x, y });
  };

  // First symbol near center (small jitter so it does not sit on the ring).
  if (n > 0) {
    push(
      symbolIndices[0],
      0.5 + (rand() - 0.5) * 0.1,
      0.5 + (rand() - 0.5) * 0.1,
    );
  }

  // Remaining: outer band with angular slots + rejection for separation.
  const ring = n - 1;
  for (let i = 0; i < ring; i++) {
    const slot = (i / ring) * Math.PI * 2;
    let placed = false;

    for (let attempt = 0; attempt < 48; attempt++) {
      const angle = slot + (rand() - 0.5) * 0.9;
      // Spread farther from center: radius roughly [0.30, 0.42]
      const radius = 0.3 + rand() * 0.12;
      let x = 0.5 + Math.cos(angle) * radius;
      let y = 0.5 + Math.sin(angle) * radius;
      x = Math.min(1 - margin, Math.max(margin, x));
      y = Math.min(1 - margin, Math.max(margin, y));

      if (used.every((p) => dist(p.x, p.y, x, y) >= minDist)) {
        push(symbolIndices[i + 1], x, y);
        placed = true;
        break;
      }
    }

    if (!placed) {
      // Fallback: push out along the slot even if a bit closer than ideal.
      const angle = slot + (rand() - 0.5) * 0.35;
      const radius = 0.34 + rand() * 0.08;
      push(
        symbolIndices[i + 1],
        Math.min(1 - margin, Math.max(margin, 0.5 + Math.cos(angle) * radius)),
        Math.min(1 - margin, Math.max(margin, 0.5 + Math.sin(angle) * radius)),
      );
    }
  }

  // Shuffle so the “center” symbol isn’t always first in DOM / paint order.
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
