export type BoardSize = 4 | 5 | 6;
export type RoundSeconds = 60 | 90 | 120;
export type Phase = "lobby" | "countdown" | "playing" | "results";

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

export interface PlayerPublic {
  id: string;
  name: string;
  isHost: boolean;
  wordCount: number;
  score: number;
}

export interface WordResultEntry {
  word: string;
  points: number;
  bonuses: BonusId[];
}

export interface RoundAward {
  id: BonusId;
  points: number;
}

export interface PlayerResult extends PlayerPublic {
  words: WordResultEntry[];
  roundAwards: RoundAward[];
}

export interface RoomState {
  code: string;
  phase: Phase;
  boardSize: BoardSize;
  roundSeconds: RoundSeconds;
  board: string[] | null;
  countdownEndsAt: number | null;
  endsAt: number | null;
  players: PlayerPublic[];
  results: PlayerResult[] | null;
  winners: string[] | null;
  round: number;
}

export type ClientMessage =
  | { type: "join"; name: string }
  | { type: "setBoardSize"; boardSize: BoardSize }
  | { type: "setRoundSeconds"; roundSeconds: RoundSeconds }
  | { type: "start" }
  | { type: "submitWord"; path: number[] }
  | { type: "playAgain" };

export type ServerMessage =
  | { type: "welcome"; playerId: string; state: RoomState }
  | { type: "state"; state: RoomState }
  | {
      type: "wordResult";
      ok: boolean;
      word?: string;
      points?: number;
      bonuses?: BonusId[];
      reason?: string;
    }
  | { type: "error"; message: string };

export const ROUND_SECONDS_OPTIONS: RoundSeconds[] = [60, 90, 120];
