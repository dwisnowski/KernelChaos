import type { BoardSize } from "./dice.ts";
import type { BonusId } from "./scoring.ts";

export type Phase = "lobby" | "countdown" | "playing" | "results";

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

/** Host-selectable round lengths (seconds). */
export type RoundSeconds = 60 | 90 | 120;

export interface RoomState {
  code: string;
  phase: Phase;
  boardSize: BoardSize;
  roundSeconds: RoundSeconds;
  board: string[] | null;
  countdownEndsAt: number | null;
  endsAt: number | null;
  players: PlayerPublic[];
  /** Present in results phase */
  results: PlayerResult[] | null;
  winners: string[] | null;
  round: number;
}

export type ClientMessage =
  | { type: "join"; name: string }
  | { type: "spectate" }
  | { type: "setBoardSize"; boardSize: BoardSize }
  | { type: "setRoundSeconds"; roundSeconds: RoundSeconds }
  | { type: "start" }
  | { type: "submitWord"; path: number[] }
  | { type: "playAgain" };

export type ServerMessage =
  | { type: "welcome"; playerId: string; state: RoomState; role?: "player" | "spectator" }
  | { type: "state"; state: RoomState }
  | {
      type: "wordResult";
      ok: boolean;
      word?: string;
      points?: number;
      bonuses?: BonusId[];
      reason?: string;
    }
  /** Anonymous badge pop for TV spectator — never includes player identity. */
  | { type: "badgeEvent"; bonuses: BonusId[]; at: number }
  | { type: "error"; message: string };

export const CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
export const ROUND_SECONDS_OPTIONS: RoundSeconds[] = [60, 90, 120];
export const DEFAULT_ROUND_SECONDS: RoundSeconds = 90;
export const COUNTDOWN_MS = 3000;
export const MIN_WORD_LEN = 3;

export function isRoundSeconds(n: unknown): n is RoundSeconds {
  return n === 60 || n === 90 || n === 120;
}

export type { BonusId };
