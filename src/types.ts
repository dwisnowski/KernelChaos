export type BoardSize = 4 | 5 | 6;
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
