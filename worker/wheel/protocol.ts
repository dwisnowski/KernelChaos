export type WheelPhase = "lobby" | "playing" | "between" | "results";

export type WheelTurnPhase =
  | "spin"
  | "spinning"
  | "consonant"
  | "action"
  | "vowel"
  | "solve";

export type WheelRoundCount = 3 | 5 | 7;

export type WheelWedgeKind =
  | "cash"
  | "bankrupt"
  | "loseTurn"
  | "freeSpin"
  | "payEach"
  | "double"
  | "flatBonus"
  | "jackpot"
  | "half"
  | "swapBanks"
  | "steal"
  | "freeLetter"
  | "wildVowel"
  | "mystery"
  | "passWheel"
  | "chaosTax"
  | "bankruptLite"
  | "mirror"
  | "speed"
  | "insurance";

export type WheelLastOutcome =
  | WheelWedgeKind
  | "payEachFail"
  | "speedTimeout"
  | null;

export interface WheelWedge {
  kind: WheelWedgeKind;
  /** Present for cash / flatBonus. */
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
  insurance: boolean;
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
  speedEndsAt: number | null;
  jackpot: number;
  lastOutcome: WheelLastOutcome;
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
export const WHEEL_PAY_EACH = 50;
export const WHEEL_STEAL = 250;
export const WHEEL_CHAOS_TAX = 100;
export const WHEEL_JACKPOT_TICK = 50;
export const WHEEL_SPEED_MS = 8000;
export const WHEEL_MYSTERY_UNIT = 100;
export const WHEEL_SPEED_CASH = 500;
export const WHEEL_MIRROR_DEFAULT = 500;

export const VOWELS = new Set(["A", "E", "I", "O", "U"]);

export const WHEEL_OUTCOME_LABELS: Record<Exclude<WheelLastOutcome, null>, string> = {
  cash: "Cash!",
  bankrupt: "Bankrupt!",
  loseTurn: "Lose a turn!",
  freeSpin: "Free Spin!",
  payEach: "Paid each rival $50",
  payEachFail: "Couldn't pay — lose turn!",
  double: "Doubled!",
  flatBonus: "+500!",
  jackpot: "Jackpot!",
  half: "Half bank",
  swapBanks: "Banks swapped!",
  steal: "Stolen!",
  freeLetter: "Free letter!",
  wildVowel: "Free vowel!",
  mystery: "Mystery letter!",
  passWheel: "Pass the wheel",
  chaosTax: "Chaos tax!",
  bankruptLite: "Half bankrupt!",
  mirror: "Mirror cash!",
  speed: "Speed call!",
  insurance: "Insured!",
  speedTimeout: "Too slow!",
};

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
