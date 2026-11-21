/** Finite projective plane of order 7 → Spot It deck (57 cards × 8 symbols). */

export const SPOT_IT_ORDER = 7;
export const SPOT_IT_SYMBOLS_PER_CARD = SPOT_IT_ORDER + 1; // 8
export const SPOT_IT_CARD_COUNT = SPOT_IT_ORDER * SPOT_IT_ORDER + SPOT_IT_ORDER + 1; // 57

/** Build cards as arrays of symbol indices 0..56. */
export function generateSpotItDeck(order = SPOT_IT_ORDER): number[][] {
  if (order < 2 || !Number.isInteger(order)) {
    throw new Error(`Spot It order must be an integer ≥ 2, got ${order}`);
  }
  const p = order;
  const cards: number[][] = [];

  // Card 0: line at infinity — symbols 0..p
  cards.push(Array.from({ length: p + 1 }, (_, i) => i));

  // Affine lines y = mx + b
  for (let m = 0; m < p; m++) {
    for (let b = 0; b < p; b++) {
      const card = [m + 1];
      for (let x = 0; x < p; x++) {
        const y = (m * x + b) % p;
        card.push(p + 1 + x * p + y);
      }
      cards.push(card);
    }
  }

  // Vertical lines x = c
  for (let c = 0; c < p; c++) {
    const card = [0];
    for (let y = 0; y < p; y++) {
      card.push(p + 1 + c * p + y);
    }
    cards.push(card);
  }

  return cards;
}

export function sharedSymbolIndex(a: number[], b: number[]): number | null {
  const setB = new Set(b);
  for (const s of a) {
    if (setB.has(s)) return s;
  }
  return null;
}

/** Dev/assert helper: every pair of cards shares exactly one symbol. */
export function verifySpotItDeck(cards: number[][]): { ok: boolean; detail?: string } {
  if (cards.length !== SPOT_IT_CARD_COUNT) {
    return { ok: false, detail: `expected ${SPOT_IT_CARD_COUNT} cards, got ${cards.length}` };
  }
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].length !== SPOT_IT_SYMBOLS_PER_CARD) {
      return { ok: false, detail: `card ${i} has ${cards[i].length} symbols` };
    }
    if (new Set(cards[i]).size !== cards[i].length) {
      return { ok: false, detail: `card ${i} has duplicate symbols` };
    }
  }
  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      const setJ = new Set(cards[j]);
      let shared = 0;
      for (const s of cards[i]) {
        if (setJ.has(s)) shared++;
      }
      if (shared !== 1) {
        return { ok: false, detail: `cards ${i} & ${j} share ${shared}` };
      }
    }
  }
  return { ok: true };
}

const CACHED = generateSpotItDeck();

export function getSpotItDeck(): number[][] {
  return CACHED.map((c) => [...c]);
}
