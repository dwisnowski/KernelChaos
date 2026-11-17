export type SpotdiffPhase = "lobby" | "countdown" | "playing" | "results";

export type SpotPlayMode = "race" | "coop" | "solo";

export type SpotRoundSeconds = 60 | 90 | 120;

export type SpotDiffCount = 3 | 5 | 7;

export type SpotTemplateId = "kitchen" | "toyshelf" | "park";

export type SpotShape = "rect" | "circle" | "ellipse" | "triangle" | "star";

export type SpotEditKind = "remove" | "recolor" | "flip" | "resize" | "swapShape";

export interface SpotBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface SpotProp {
  id: string;
  shape: SpotShape;
  /** Top-left in 0–100 viewBox space. */
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  stroke?: string;
  rotate?: number;
  flipX?: boolean;
}

export interface SpotDifference {
  id: string;
  box: SpotBox;
  kind: SpotEditKind;
}

export interface SpotPuzzle {
  templateId: SpotTemplateId;
  seed: number;
  title: string;
  panelA: SpotProp[];
  panelB: SpotProp[];
  differences: SpotDifference[];
}

export const SPOT_PLAY_MODES: SpotPlayMode[] = ["race", "coop", "solo"];
export const SPOT_ROUND_OPTIONS: SpotRoundSeconds[] = [60, 90, 120];
export const SPOT_DIFF_OPTIONS: SpotDiffCount[] = [3, 5, 7];

export const DEFAULT_SPOT_MODE: SpotPlayMode = "race";
export const DEFAULT_SPOT_ROUND_SECONDS: SpotRoundSeconds = 90;
export const DEFAULT_SPOT_DIFF_COUNT: SpotDiffCount = 5;

export const SPOT_COUNTDOWN_MS = 3000;
export const SPOT_MISS_LOCK_MS = 1500;
export const SPOT_HINT_MS = 2000;
export const SPOT_HIT_PADDING = 0.02;

export function isSpotPlayMode(v: unknown): v is SpotPlayMode {
  return v === "race" || v === "coop" || v === "solo";
}

export function isSpotRoundSeconds(n: unknown): n is SpotRoundSeconds {
  return n === 60 || n === 90 || n === 120;
}

export function isSpotDiffCount(n: unknown): n is SpotDiffCount {
  return n === 3 || n === 5 || n === 7;
}

export interface SpotdiffPlayerPublic {
  id: string;
  name: string;
  isHost: boolean;
  foundCount: number;
}

export interface SpotdiffPlayerResult {
  id: string;
  name: string;
  foundCount: number;
  foundDiffIds: string[];
}

export interface SpotdiffRoomState {
  game: "spotdiff";
  code: string;
  phase: SpotdiffPhase;
  spotMode: SpotPlayMode;
  roundSeconds: SpotRoundSeconds;
  diffCount: SpotDiffCount;
  countdownEndsAt: number | null;
  endsAt: number | null;
  players: SpotdiffPlayerPublic[];
  puzzle: SpotPuzzle | null;
  /** Coop shared finds (also mirrored at results). Empty during race/solo play. */
  foundDiffIds: string[];
  results: SpotdiffPlayerResult[];
  winners: string[];
  round: number;
  hintDiffId: string | null;
  hintUntil: number | null;
}

export type SpotdiffClientMessage =
  | { type: "join"; name: string; resumeId?: string }
  | { type: "spectate" }
  | { type: "setSpotMode"; spotMode: SpotPlayMode }
  | { type: "setSpotTimer"; roundSeconds: SpotRoundSeconds }
  | { type: "setSpotDiffCount"; diffCount: SpotDiffCount }
  | { type: "start" }
  | { type: "tapDiff"; x: number; y: number }
  | { type: "requestHint" }
  | { type: "playAgain" };

export type SpotdiffServerMessage =
  | {
      type: "welcome";
      playerId: string;
      state: SpotdiffRoomState;
      role?: "player" | "spectator";
      myFoundDiffIds?: string[];
      lockedUntil?: number | null;
    }
  | {
      type: "state";
      state: SpotdiffRoomState;
      myFoundDiffIds?: string[];
      lockedUntil?: number | null;
    }
  | {
      type: "tapResult";
      hit: boolean;
      diffId?: string;
      lockedUntil?: number | null;
    }
  | { type: "error"; message: string };
