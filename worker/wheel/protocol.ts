export type WheelPhase = "lobby" | "playing" | "between" | "results";

export type WheelTurnPhase =
  | "spin"
  | "spinning"
  | "consonant"
  | "action"
  | "vowel"
  | "solve";

export type WheelRoundCount = 3 | 5 | 7;

export type WheelWedgeKind = "cash" | "bankrupt" | "loseTurn" | "freeSpin";

export interface WheelWedge {
  kind: WheelWedgeKind;
  /** Present when kind === "cash". */
  value?: number;
  label: string;
}

export interface WheelLastSpin {
  wedgeIndex: number;
  targetAngle: number;
  startedAt: number;
  endsAt: number;
}

export interface WheelPuzzlePublic {
  category: string;
  /** Same length as answer; letters shown when revealed, spaces as " ". */
  display: string[];
  /** Indices that are spaces (always visible). */
  spaceIndices: number[];
}

export interface WheelPlayerPublic {
  id: string;
  name: string;
  isHost: boolean;
  roundBank: number;
  totalScore: number;
  freeSpins: number;
}

export interface WheelPlayerResult {
  id: string;
  name: string;
  totalScore: number;
}

export interface WheelRoomState {
  game: "wheel";
  code: string;
  phase: WheelPhase;
  turnPhase: WheelTurnPhase | null;
  roundCount: WheelRoundCount;
  roundIndex: number;
  players: WheelPlayerPublic[];
  currentPlayerId: string | null;
  puzzle: WheelPuzzlePublic | null;
  usedLetters: string[];
  wedges: WheelWedge[];
  lastSpin: WheelLastSpin | null;
  /** Cash value from the landed wedge; set during consonant phase. */
  pendingCash: number | null;
  betweenEndsAt: number | null;
  lastSolverId: string | null;
  lastSolverName: string | null;
  results: WheelPlayerResult[];
  winners: string[];
}

export const WHEEL_ROUND_OPTIONS: WheelRoundCount[] = [3, 5, 7];
export const DEFAULT_WHEEL_ROUNDS: WheelRoundCount = 3;
export const WHEEL_VOWEL_COST = 250;
export const WHEEL_SPIN_MS = 4500;
export const WHEEL_BETWEEN_MS = 4000;

export const VOWELS = new Set(["A", "E", "I", "O", "U"]);

export function isWheelRoundCount(n: unknown): n is WheelRoundCount {
  return n === 3 || n === 5 || n === 7;
}

export function isWheelTurnPhase(v: unknown): v is WheelTurnPhase {
  return (
    v === "spin" ||
    v === "spinning" ||
    v === "consonant" ||
    v === "action" ||
    v === "vowel" ||
    v === "solve"
  );
}

export function isVowel(letter: string): boolean {
  return VOWELS.has(letter.toUpperCase());
}

export function isConsonant(letter: string): boolean {
  const L = letter.toUpperCase();
  return /^[A-Z]$/.test(L) && !VOWELS.has(L);
}

export type WheelClientMessage =
  | { type: "join"; name: string; resumeId?: string }
  | { type: "spectate" }
  | { type: "setWheelRounds"; roundCount: WheelRoundCount }
  | { type: "start" }
  | { type: "spin" }
  | { type: "guessLetter"; letter: string }
  | { type: "buyVowel" }
  | { type: "chooseSolve" }
  | { type: "solve"; guess: string }
  | { type: "playAgain" };

export type WheelServerMessage =
  | {
      type: "welcome";
      playerId: string;
      state: WheelRoomState;
      role?: "player" | "spectator";
    }
  | { type: "state"; state: WheelRoomState }
  | { type: "error"; message: string };
