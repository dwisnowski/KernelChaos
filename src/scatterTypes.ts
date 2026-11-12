export type PackTier = "family" | "kids" | "adult";
export type ScatterRoundSeconds = 120 | 150 | 180;
export type ScatterPhase = "lobby" | "countdown" | "playing" | "review" | "results";

export type AnswerStatus = "unique" | "duplicate" | "invalidLetter" | "empty" | "rejected";

export interface ScatterPlayerPublic {
  id: string;
  name: string;
  isHost: boolean;
  answerCount: number;
  score: number;
}

export interface CategoryAnswerView {
  playerId: string;
  playerName: string;
  raw: string;
  normalized: string;
  status: AnswerStatus;
  points: number;
  hostRejected: boolean;
}

export interface ScatterPlayerResult extends ScatterPlayerPublic {
  answers: string[];
  categoryPoints: number[];
}

export interface ScatterRoomState {
  game: "scattergories";
  code: string;
  phase: ScatterPhase;
  packTier: PackTier;
  roundSeconds: ScatterRoundSeconds;
  letter: string | null;
  categories: string[] | null;
  listId: string | null;
  countdownEndsAt: number | null;
  endsAt: number | null;
  players: ScatterPlayerPublic[];
  reviewIndex: number | null;
  reviewAnswers: CategoryAnswerView[] | null;
  results: ScatterPlayerResult[] | null;
  winners: string[] | null;
  round: number;
}

export type ScatterClientMessage =
  | { type: "join"; name: string }
  | { type: "spectate" }
  | { type: "setPackTier"; packTier: PackTier }
  | { type: "setRoundSeconds"; roundSeconds: ScatterRoundSeconds }
  | { type: "start" }
  | { type: "submitAnswers"; answers: string[] }
  | { type: "reviewNext" }
  | { type: "reviewPrev" }
  | { type: "toggleAnswerInvalid"; playerId: string }
  | { type: "finishReview" }
  | { type: "playAgain" };

export type ScatterServerMessage =
  | {
      type: "welcome";
      playerId: string;
      state: ScatterRoomState;
      role?: "player" | "spectator";
    }
  | { type: "state"; state: ScatterRoomState }
  | { type: "error"; message: string };

export const CATEGORIES_PER_LIST = 12;
export const SCATTER_ROUND_SECONDS_OPTIONS: ScatterRoundSeconds[] = [120, 150, 180];
export const PACK_TIERS: PackTier[] = ["family", "kids", "adult"];

export const PACK_TIER_LABELS: Record<PackTier, string> = {
  family: "Family",
  kids: "Kids",
  adult: "Adult",
};

export const ANSWER_STATUS_LABELS: Record<AnswerStatus, string> = {
  unique: "Unique",
  duplicate: "Duplicate",
  invalidLetter: "Wrong letter",
  empty: "Blank",
  rejected: "Out",
};
