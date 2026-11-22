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
  display: string[];
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
export const WHEEL_VOWEL_COST = 250;

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
