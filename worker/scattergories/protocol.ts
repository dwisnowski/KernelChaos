export type GameType = "boggle" | "scattergories";

export type PackTier = "family" | "kids" | "adult";

export type ScatterPhase = "lobby" | "countdown" | "playing" | "review" | "results";

/** Host-selectable round lengths (seconds) for Scattergories. */
export type ScatterRoundSeconds = 120 | 150 | 180;

export const SCATTER_ROUND_SECONDS_OPTIONS: ScatterRoundSeconds[] = [120, 150, 180];
export const DEFAULT_SCATTER_ROUND_SECONDS: ScatterRoundSeconds = 150;
export const SCATTER_COUNTDOWN_MS = 3000;
export const CATEGORIES_PER_LIST = 12;

export function isScatterRoundSeconds(n: unknown): n is ScatterRoundSeconds {
  return n === 120 || n === 150 || n === 180;
}

export function isPackTier(v: unknown): v is PackTier {
  return v === "family" || v === "kids" || v === "adult";
}

export interface ScatterPlayerPublic {
  id: string;
  name: string;
  isHost: boolean;
  /** Categories filled (non-empty) during play — progress only. */
  answerCount: number;
  score: number;
}

export type AnswerStatus = "unique" | "duplicate" | "invalidLetter" | "empty" | "rejected";

export interface CategoryAnswerView {
  playerId: string;
  playerName: string;
  raw: string;
  normalized: string;
  status: AnswerStatus;
  points: number;
  /** Host marked invalid after debate. */
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
  /** Index of category being revealed in review (0–11). */
  reviewIndex: number | null;
  /** Present in review/results — answers for current review category when in review. */
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
