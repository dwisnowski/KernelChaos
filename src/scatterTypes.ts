export type PackTier = "family" | "kids" | "adult";
export type ScatterPlayMode = "categories" | "hunt";
export type ScatterRoundSeconds = 120 | 150 | 180;
export type ScatterPhase =
  | "lobby"
  | "rolling"
  | "countdown"
  | "playing"
  | "review"
  | "results";

export type AnswerStatus =
  | "unique"
  | "duplicate"
  | "invalidLetter"
  | "empty"
  | "rejected"
  | "unknown";
export type ReviewVote = "in" | "out";

export type HuntFindStatus =
  | "unique"
  | "duplicate"
  | "invalidLetter"
  | "empty"
  | "unknown";

export interface HuntBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface HuntFindLocation {
  objectId: string;
  raw: string;
  box: HuntBox | null;
}

/** Classic Scattergories letter die — mirrors worker/scattergories/letter.ts */
export const LETTER_DIE = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "R",
  "S",
  "T",
  "W",
] as const;

export type LetterDieFace = (typeof LETTER_DIE)[number];

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
  findLocations?: HuntFindLocation[];
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
  preferredSceneId: string | null;
  sceneId: string | null;
  sceneTitle: string | null;
  sceneImageUrl: string | null;
  huntScenes: HuntScenePublic[];
  huntLetterTotal: number;
  countdownEndsAt: number | null;
  endsAt: number | null;
  players: ScatterPlayerPublic[];
  rollerId: string | null;
  rollerName: string | null;
  reviewIndex: number | null;
  reviewAnswers: CategoryAnswerView[] | null;
  reviewSubmittedBy: string[];
  reviewPendingVoters: ReviewPendingVoter[];
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
  | { type: "submitHuntFind"; word: string }
  | { type: "reviewNext" }
  | { type: "reviewPrev" }
  | { type: "submitReviewVotes"; votes: Record<string, ReviewVote> }
  | { type: "finishReview" }
  | { type: "playAgain" };

export type HuntFindResultMessage = {
  type: "huntFindResult";
  ok: boolean;
  status: HuntFindStatus;
  remaining: number;
  matchedCount: number;
  letterTotal: number;
  word?: string;
};

export type HuntProgressMessage = {
  type: "huntProgress";
  remaining: number;
  matchedCount: number;
  letterTotal: number;
};

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
  | HuntFindResultMessage
  | HuntProgressMessage
  | { type: "error"; message: string };

export const CATEGORIES_PER_LIST = 12;
export const HUNT_MAX_ANSWERS = 40;
export const SCATTER_ROUND_SECONDS_OPTIONS: ScatterRoundSeconds[] = [120, 150, 180];
export const PACK_TIERS: PackTier[] = ["family", "kids", "adult"];
export const SCATTER_PLAY_MODES: ScatterPlayMode[] = ["categories", "hunt"];

export const PACK_TIER_LABELS: Record<PackTier, string> = {
  family: "Family",
  kids: "Kids",
  adult: "Adult",
};

export const PLAY_MODE_LABELS: Record<ScatterPlayMode, string> = {
  categories: "Categories",
  hunt: "Picture hunt",
};

export const ANSWER_STATUS_LABELS: Record<AnswerStatus, string> = {
  unique: "Unique",
  duplicate: "Duplicate",
  invalidLetter: "Wrong letter",
  empty: "Blank",
  rejected: "Out",
  unknown: "Not in picture",
};
