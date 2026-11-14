export type GameType = "boggle" | "scattergories";

export type PackTier = "family" | "kids" | "adult";

/** Categories = classic lists; hunt = Picture Hunt synonym-key scenes. */
export type ScatterPlayMode = "categories" | "hunt";

export type ScatterPhase =
  | "lobby"
  | "rolling"
  | "countdown"
  | "playing"
  | "review"
  | "results";

/** Host-selectable round lengths (seconds) for Scattergories. */
export type ScatterRoundSeconds = 120 | 150 | 180;

export const SCATTER_ROUND_SECONDS_OPTIONS: ScatterRoundSeconds[] = [120, 150, 180];
export const DEFAULT_SCATTER_ROUND_SECONDS: ScatterRoundSeconds = 150;
export const SCATTER_COUNTDOWN_MS = 3000;
/** Max wait for the chosen roller to submit a letter before server rolls. */
export const SCATTER_ROLL_TIMEOUT_MS = 30_000;
export const CATEGORIES_PER_LIST = 12;
export const DEFAULT_SCATTER_PLAY_MODE: ScatterPlayMode = "categories";

export function isScatterRoundSeconds(n: unknown): n is ScatterRoundSeconds {
  return n === 120 || n === 150 || n === 180;
}

export function isPackTier(v: unknown): v is PackTier {
  return v === "family" || v === "kids" || v === "adult";
}

export function isScatterPlayMode(v: unknown): v is ScatterPlayMode {
  return v === "categories" || v === "hunt";
}

export interface ScatterPlayerPublic {
  id: string;
  name: string;
  isHost: boolean;
  /** Categories filled (non-empty) during play — progress only. */
  answerCount: number;
  score: number;
}

export type AnswerStatus =
  | "unique"
  | "duplicate"
  | "invalidLetter"
  | "empty"
  | "rejected"
  | "unknown";

export type ReviewVote = "in" | "out";

export interface CategoryAnswerView {
  playerId: string;
  playerName: string;
  raw: string;
  normalized: string;
  status: AnswerStatus;
  points: number;
  /** Majority voted out (or legacy host reject). */
  hostRejected: boolean;
  /** Ballot tallies; 0 while voting is still open. */
  votesIn: number;
  votesOut: number;
}

export interface ReviewPendingVoter {
  id: string;
  name: string;
}

export interface ScatterPlayerResult extends ScatterPlayerPublic {
  answers: string[];
  categoryPoints: number[];
}

export interface HuntScenePublic {
  id: string;
  title: string;
}

export interface ScatterRoomState {
  game: "scattergories";
  code: string;
  phase: ScatterPhase;
  playMode: ScatterPlayMode;
  packTier: PackTier;
  roundSeconds: ScatterRoundSeconds;
  letter: string | null;
  categories: string[] | null;
  listId: string | null;
  /** Lobby preference; null = random unused scene. */
  preferredSceneId: string | null;
  /** Active hunt scene for the round (null in categories mode / before pick). */
  sceneId: string | null;
  sceneTitle: string | null;
  sceneImageUrl: string | null;
  /** Catalog for lobby scene picker. */
  huntScenes: HuntScenePublic[];
  countdownEndsAt: number | null;
  endsAt: number | null;
  players: ScatterPlayerPublic[];
  /** Player chosen to flick the letter die during `rolling`. */
  rollerId: string | null;
  rollerName: string | null;
  /** Index of category being revealed in review (0–11). */
  reviewIndex: number | null;
  /** Present in review/results — answers for current review category when in review. */
  reviewAnswers: CategoryAnswerView[] | null;
  /** Voter ids who submitted a ballot for the current review category. */
  reviewSubmittedBy: string[];
  /** Seated players who have not yet submitted for the current category. */
  reviewPendingVoters: ReviewPendingVoter[];
  /** True when every seated player has balloted the current category. */
  reviewVotingComplete: boolean;
  results: ScatterPlayerResult[] | null;
  winners: string[] | null;
  round: number;
}

export type DiePose = { qx: number; qy: number; qz: number; qw: number };

export type ScatterClientMessage =
  | { type: "join"; name: string; resumeId?: string }
  | { type: "spectate" }
  | { type: "setPackTier"; packTier: PackTier }
  | { type: "setPlayMode"; playMode: ScatterPlayMode }
  | { type: "setPreferredScene"; sceneId: string | null }
  | { type: "setRoundSeconds"; roundSeconds: ScatterRoundSeconds }
  | { type: "start" }
  | { type: "diePose"; qx: number; qy: number; qz: number; qw: number }
  | { type: "submitLetterRoll"; letter: string }
  | { type: "submitAnswers"; answers: string[] }
  | { type: "reviewNext" }
  | { type: "reviewPrev" }
  | { type: "submitReviewVotes"; votes: Record<string, ReviewVote> }
  | { type: "finishReview" }
  | { type: "playAgain" };

export type ScatterServerMessage =
  | {
      type: "welcome";
      playerId: string;
      state: ScatterRoomState;
      role?: "player" | "spectator";
      /** Private answers for this seat — present when rejoining/resuming as a player. */
      myAnswers?: string[];
    }
  | { type: "state"; state: ScatterRoomState }
  | { type: "diePose"; rollerId: string; qx: number; qy: number; qz: number; qw: number }
  | { type: "error"; message: string };
