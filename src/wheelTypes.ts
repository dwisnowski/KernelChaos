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
  | "insurance";

export type WheelLastOutcome =
  | WheelWedgeKind
  | "payEachFail"
  | "guessTimeout"
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
  guessEndsAt: number | null;
  jackpot: number;
  lastOutcome: WheelLastOutcome;
  /** Name of the player who just landed the outcome (may differ from current seat). */
  lastOutcomePlayerName: string | null;
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
  bankrupt: "Went bankrupt!",
  freeSpin: "Earned a Free Spin!",
  payEach: "Paid each rival $50",
  payEachFail: "Couldn't pay — lost the turn!",
  double: "Doubled the bank!",
  flatBonus: "Picked up +500!",
  jackpot: "Claimed the jackpot!",
  half: "Halved the bank!",
  swapBanks: "Swapped banks!",
  steal: "Stole from a rival!",
  freeLetter: "Got a free letter!",
  wildVowel: "Got a free vowel!",
  mystery: "Hit a mystery letter!",
  passWheel: "Passed the wheel!",
  chaosTax: "Triggered chaos tax!",
  bankruptLite: "Half bankrupt!",
  insurance: "Got insurance!",
  guessTimeout: "Ran out of time!",
};

/** Short TV blurbs: what the landed tile did for the spinner (past tense). */
export const WHEEL_OUTCOME_BLURBS: Record<Exclude<WheelLastOutcome, null>, string> = {
  cash: "Called a consonant — each match paid that cash into the round bank.",
  bankrupt: "Round bank dropped to zero and the turn ended.",
  freeSpin: "Banked a Free Spin token to survive a future lost turn.",
  payEach: "Paid $50 to each rival from the round bank, then called a letter at $0.",
  payEachFail: "Not enough in the round bank to pay rivals — turn ended.",
  double: "Round bank doubled. Kept the turn.",
  flatBonus: "Added $500 to the round bank. Kept the turn.",
  jackpot: "Jackpot pot dumped into the round bank. Kept the turn.",
  half: "Round bank was cut in half. Kept the turn.",
  swapBanks: "Round bank swapped with a random rival. Kept the turn.",
  steal: "Took up to $250 from the richest rival’s round bank.",
  freeLetter: "A free consonant was revealed on the board.",
  wildVowel: "Picked a vowel for free (no $250 cost).",
  mystery: "A random hidden consonant was revealed for $100 each.",
  passWheel: "Wheel passed to the next player. Free Spin could not stop this.",
  chaosTax: "Everyone paid up to $100 into the jackpot. Spinner kept the turn.",
  bankruptLite: "Round bank was cut in half and the turn ended.",
  insurance: "Next Bankrupt won’t wipe the round bank (turn still ends).",
  guessTimeout: "10-second guess timer ran out — turn ended.",
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
