/** Chaos Boggle scoring: length base, path multipliers, and flat bonuses. */

export type BonusId =
  | "straight"
  | "snake"
  | "unique"
  | "clutch10"
  | "ladder1"
  | "ladder2"
  | "ladder3"
  | "lastWord"
  | "rare"
  | "noVowel"
  | "center"
  | "span"
  | "thief"
  | "loneWolf"
  | "coverage";

export const BONUS_LABELS: Record<BonusId, string> = {
  straight: "Line",
  snake: "Snake",
  unique: "Solo",
  clutch10: "Clutch",
  ladder1: "First!",
  ladder2: "2nd",
  ladder3: "3rd",
  lastWord: "Last!",
  rare: "Rare",
  noVowel: "Odd",
  center: "Center",
  span: "Span",
  thief: "Thief",
  loneWolf: "Lone wolf",
  coverage: "Coverage",
};

const RARE = new Set(["q", "z", "x", "j"]);
const VOWELS = new Set(["a", "e", "i", "o", "u"]);

export function lengthPoints(word: string): number {
  const len = word.length;
  if (len < 3) return 0;
  if (len === 3) return 1;
  if (len === 4) return 2;
  if (len === 5) return 3;
  if (len === 6) return 4;
  if (len === 7) return 5;
  if (len === 8) return 6;
  if (len === 9) return 7;
  return 8;
}

/** @deprecated use lengthPoints — kept for any stray imports during transition */
export function scoreWord(word: string): number {
  return lengthPoints(word);
}

export function pathCoords(size: number, path: number[]): [number, number][] {
  return path.map((idx) => [Math.floor(idx / size), idx % size]);
}

/** Constant step direction (horizontal, vertical, or diagonal). */
export function isStraightPath(size: number, path: number[]): boolean {
  if (path.length <= 2) return true;
  const coords = pathCoords(size, path);
  const dr = coords[1]![0] - coords[0]![0];
  const dc = coords[1]![1] - coords[0]![1];
  for (let i = 2; i < coords.length; i++) {
    if (coords[i]![0] - coords[i - 1]![0] !== dr) return false;
    if (coords[i]![1] - coords[i - 1]![1] !== dc) return false;
  }
  return true;
}

/** Every cell lies in the inner ring (margin 1). */
export function isCenterPath(size: number, path: number[]): boolean {
  if (size < 3 || path.length === 0) return false;
  for (const idx of path) {
    const r = Math.floor(idx / size);
    const c = idx % size;
    if (r < 1 || r > size - 2 || c < 1 || c > size - 2) return false;
  }
  return true;
}

/** Opposite board corners in path, or path touches all four edges. */
export function isSpanPath(size: number, path: number[]): boolean {
  if (path.length === 0 || size < 2) return false;
  const set = new Set(path);
  const last = size - 1;
  const corners = [
    [0, size * size - 1],
    [last, size * (size - 1)],
  ] as const;
  for (const [a, b] of corners) {
    if (set.has(a) && set.has(b)) return true;
  }

  let top = false;
  let bottom = false;
  let left = false;
  let right = false;
  for (const idx of path) {
    const r = Math.floor(idx / size);
    const c = idx % size;
    if (r === 0) top = true;
    if (r === last) bottom = true;
    if (c === 0) left = true;
    if (c === last) right = true;
  }
  return top && bottom && left && right;
}

export function rareLetterCount(word: string): number {
  let n = 0;
  for (const ch of word.toLowerCase()) {
    if (RARE.has(ch)) n += 1;
  }
  return n;
}

export function hasNoVowels(word: string): boolean {
  for (const ch of word.toLowerCase()) {
    if (VOWELS.has(ch)) return false;
  }
  return word.length > 0;
}

export function flatBonusTotal(bonuses: BonusId[], rareCount = 0): number {
  let flat = 0;
  for (const id of bonuses) {
    switch (id) {
      case "snake":
      case "clutch10":
      case "noVowel":
      case "center":
        flat += 1;
        break;
      case "ladder1":
        flat += 3;
        break;
      case "ladder2":
        flat += 2;
        break;
      case "ladder3":
        flat += 1;
        break;
      case "lastWord":
        flat += 4;
        break;
      case "span":
      case "thief":
        flat += 2;
        break;
      case "rare":
        flat += rareCount;
        break;
      case "loneWolf":
        flat += 5;
        break;
      // straight / unique are multipliers; coverage is computed separately
      default:
        break;
    }
  }
  return flat;
}

export function computePoints(
  base: number,
  bonuses: BonusId[],
  rareCount: number,
): number {
  const lineMult = bonuses.includes("straight") ? 2 : 1;
  const uniqueMult = bonuses.includes("unique") ? 2 : 1;
  return base * lineMult * uniqueMult + flatBonusTotal(bonuses, rareCount);
}

export interface SubmitScoreContext {
  word: string;
  path: number[];
  boardSize: number;
  /** Seconds remaining when accepted (ceil). */
  secondsLeft: number;
  /** 1-based global accept index for this round. */
  globalAcceptIndex: number;
  /** Another player already has this word. */
  foundByOther: boolean;
}

export interface SubmitScoreResult {
  base: number;
  bonuses: BonusId[];
  points: number;
  rareCount: number;
}

/** Provisional score at submit time (no unique / lastWord / loneWolf / coverage). */
export function scoreAtSubmit(ctx: SubmitScoreContext): SubmitScoreResult {
  const base = lengthPoints(ctx.word);
  const bonuses: BonusId[] = [];
  const straight = isStraightPath(ctx.boardSize, ctx.path);
  if (straight) bonuses.push("straight");
  else bonuses.push("snake");

  if (ctx.secondsLeft <= 10) bonuses.push("clutch10");
  if (ctx.globalAcceptIndex === 1) bonuses.push("ladder1");
  else if (ctx.globalAcceptIndex === 2) bonuses.push("ladder2");
  else if (ctx.globalAcceptIndex === 3) bonuses.push("ladder3");

  const rareCount = rareLetterCount(ctx.word);
  if (rareCount > 0) bonuses.push("rare");
  if (hasNoVowels(ctx.word)) bonuses.push("noVowel");
  if (isCenterPath(ctx.boardSize, ctx.path)) bonuses.push("center");
  if (isSpanPath(ctx.boardSize, ctx.path)) bonuses.push("span");
  if (ctx.foundByOther && ctx.secondsLeft <= 15) bonuses.push("thief");

  return {
    base,
    bonuses,
    points: computePoints(base, bonuses, rareCount),
    rareCount,
  };
}

const RESULTS_ONLY = new Set<BonusId>(["unique", "lastWord"]);

/** Apply results-only word bonuses onto a submit-time bonus list. */
export function finalizeWordBonuses(
  submitBonuses: BonusId[],
  opts: { unique: boolean; isLastWord: boolean },
): BonusId[] {
  const next = submitBonuses.filter((b) => !RESULTS_ONLY.has(b));
  if (opts.unique) next.push("unique");
  if (opts.isLastWord) next.push("lastWord");
  return next;
}

export function coveragePoints(paths: number[][]): number {
  const cells = new Set<number>();
  for (const path of paths) {
    for (const idx of path) cells.add(idx);
  }
  return cells.size;
}
