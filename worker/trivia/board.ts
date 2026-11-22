import {
  TRIVIA_CATEGORIES,
  TRIVIA_TIERS,
  type TriviaBoardCellPublic,
  type TriviaBoardPublic,
  type TriviaClueDef,
  type TriviaPack,
  type TriviaRound,
  valueForTier,
} from "./protocol.ts";

export interface TriviaLiveBoard {
  round: TriviaRound;
  categories: string[];
  /** clue defs parallel to cells */
  clues: TriviaClueDef[];
  cleared: boolean[];
  dailyDoubleIndex: number;
}

export function buildLiveBoard(pack: TriviaPack, round: TriviaRound): TriviaLiveBoard {
  const cats = round === "single" ? pack.single : pack.double;
  const categories = cats.map((c) => c.title);
  const clues: TriviaClueDef[] = [];
  const cleared: boolean[] = [];
  for (let c = 0; c < TRIVIA_CATEGORIES; c++) {
    const cat = cats[c]!;
    for (let t = 0; t < TRIVIA_TIERS; t++) {
      clues.push(cat.clues[t]!);
      cleared.push(false);
    }
  }
  const open = clues.map((_, i) => i);
  const dailyDoubleIndex = open[Math.floor(Math.random() * open.length)] ?? 0;
  return { round, categories, clues, cleared, dailyDoubleIndex };
}

export function cellIndex(categoryIndex: number, tier: number): number {
  return categoryIndex * TRIVIA_TIERS + tier;
}

export function toPublicBoard(live: TriviaLiveBoard): TriviaBoardPublic {
  const cells: TriviaBoardCellPublic[] = [];
  for (let c = 0; c < TRIVIA_CATEGORIES; c++) {
    for (let t = 0; t < TRIVIA_TIERS; t++) {
      const i = cellIndex(c, t);
      cells.push({
        categoryIndex: c,
        tier: t,
        value: valueForTier(live.round, t),
        cleared: live.cleared[i] ?? true,
      });
    }
  }
  return { round: live.round, categories: live.categories, cells };
}

export function remainingCellCount(live: TriviaLiveBoard): number {
  return live.cleared.filter((x) => !x).length;
}

export function shuffleChoices(clue: TriviaClueDef): {
  choices: string[];
  correctIndex: number;
} {
  const indexed = clue.choices.map((text, i) => ({ text, i }));
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = indexed[i]!;
    indexed[i] = indexed[j]!;
    indexed[j] = tmp;
  }
  const choices = indexed.map((x) => x.text);
  const correctIndex = indexed.findIndex((x) => x.i === clue.correctIndex);
  return { choices, correctIndex: correctIndex < 0 ? 0 : correctIndex };
}

export function dailyWagerMax(score: number, cellValue: number): number {
  return Math.max(score, cellValue);
}
