import { getSpotItDeck, sharedSymbolIndex } from "./deck.ts";
import { layoutCard, type SpotItCardView } from "./layout.ts";

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleInPlace<T>(arr: T[], rand: () => number): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
}

export interface SharedDeal {
  mode: "shared";
  cardA: SpotItCardView;
  cardB: SpotItCardView;
  /** Authoritative match (server-only; do not put on public state). */
  matchSymbolIndex: number;
}

export interface TowerDeal {
  mode: "tower";
  center: SpotItCardView;
  /** playerId → hand card */
  hands: Map<string, SpotItCardView>;
  /** Remaining center pile (card indices into deck). */
  pile: number[];
  /** Full shuffled deck card indices used for this game. */
  order: number[];
}

export function dealSharedPair(seed: number, usedCardIndices: Set<number>): SharedDeal {
  const deck = getSpotItDeck();
  const rand = mulberry32(seed);
  const available = deck.map((_, i) => i).filter((i) => !usedCardIndices.has(i));
  if (available.length < 2) {
    usedCardIndices.clear();
    available.length = 0;
    for (let i = 0; i < deck.length; i++) available.push(i);
  }
  shuffleInPlace(available, rand);
  const iA = available[0];
  const iB = available[1];
  usedCardIndices.add(iA);
  usedCardIndices.add(iB);
  const match = sharedSymbolIndex(deck[iA], deck[iB]);
  if (match === null) throw new Error("Invalid Spot It deck: no shared symbol");
  return {
    mode: "shared",
    cardA: layoutCard(iA, deck[iA], seed),
    cardB: layoutCard(iB, deck[iB], seed + 1),
    matchSymbolIndex: match,
  };
}

export function dealTowerStart(seed: number, playerIds: string[]): TowerDeal {
  const deck = getSpotItDeck();
  const rand = mulberry32(seed);
  const order = deck.map((_, i) => i);
  shuffleInPlace(order, rand);
  if (playerIds.length + 1 > order.length) {
    throw new Error("Too many players for Spot It tower deck");
  }
  const hands = new Map<string, SpotItCardView>();
  let cursor = 0;
  for (const pid of playerIds) {
    const ci = order[cursor++];
    hands.set(pid, layoutCard(ci, deck[ci], seed ^ cursor));
  }
  const centerIdx = order[cursor++];
  const pile = order.slice(cursor);
  return {
    mode: "tower",
    center: layoutCard(centerIdx, deck[centerIdx], seed + 99),
    hands,
    pile,
    order,
  };
}

/** After a tower score: winner takes center; next pile card becomes center. */
export function advanceTowerAfterScore(
  state: TowerDeal,
  winnerId: string,
  layoutSeed: number,
): TowerDeal | null {
  const deck = getSpotItDeck();
  const won = state.center;
  const hands = new Map(state.hands);
  hands.set(winnerId, won);
  if (state.pile.length === 0) return null;
  const nextIdx = state.pile[0];
  const pile = state.pile.slice(1);
  return {
    mode: "tower",
    center: layoutCard(nextIdx, deck[nextIdx], layoutSeed),
    hands,
    pile,
    order: state.order,
  };
}

export function towerMatchForPlayer(
  center: SpotItCardView,
  hand: SpotItCardView,
): number | null {
  return sharedSymbolIndex(center.symbolIndices, hand.symbolIndices);
}
