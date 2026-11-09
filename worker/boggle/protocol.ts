import type { BoardSize } from "./dice.ts";

export type Phase = "lobby" | "countdown" | "playing" | "results";

export interface PlayerPublic {
  id: string;
  name: string;
  isHost: boolean;
  wordCount: number;
  score: number;
}

export interface PlayerResult extends PlayerPublic {
  words: { word: string; points: number }[];
}

export interface RoomState {
  code: string;
  phase: Phase;
  boardSize: BoardSize;
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
  | { type: "setBoardSize"; boardSize: BoardSize }
  | { type: "start" }
  | { type: "submitWord"; path: number[] }
  | { type: "playAgain" };

export type ServerMessage =
  | { type: "welcome"; playerId: string; state: RoomState }
  | { type: "state"; state: RoomState }
  | { type: "wordResult"; ok: boolean; word?: string; points?: number; reason?: string }
  | { type: "error"; message: string };

export const CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
export const ROUND_MS = 3 * 60 * 1000;
export const COUNTDOWN_MS = 3000;
export const MIN_WORD_LEN = 3;
