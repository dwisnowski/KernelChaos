export type SpotdiffPhase = "lobby" | "countdown" | "playing" | "results";

export type SpotPlayMode = "race" | "coop" | "solo";

export type SpotRoundSeconds = 60 | 90 | 120;

export type SpotDiffCount = 3 | 5 | 7;

export type SpotDifficulty = "easy" | "medium" | "hard";

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
export const SPOT_DIFFICULTIES: SpotDifficulty[] = ["easy", "medium", "hard"];

export const SPOT_MODE_LABELS: Record<SpotPlayMode, string> = {
  race: "Race",
  coop: "Co-op",
  solo: "Solo",
};

export const SPOT_DIFFICULTY_LABELS: Record<SpotDifficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

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
  difficulty: SpotDifficulty;
  countdownEndsAt: number | null;
  endsAt: number | null;
  players: SpotdiffPlayerPublic[];
  puzzle: SpotPuzzle | null;
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
  | { type: "setSpotDifficulty"; difficulty: SpotDifficulty }
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
