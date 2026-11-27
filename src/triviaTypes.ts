/** Client mirror of worker/trivia/protocol.ts (keep in sync). */
export type TriviaPhase =
  | "lobby"
  | "board"
  | "clue"
  | "dailyWager"
  | "buzzOpen"
  | "answering"
  | "reveal"
  | "between"
  | "finalCategory"
  | "finalWager"
  | "finalAnswer"
  | "results";

export type TriviaRound = "single" | "double";

export type TriviaClueStage = "highlight" | "reveal";

export type TriviaAudience = "kids" | "family" | "adult" | "spicy";

export type TriviaPackId =
  | "kids-thanksgiving"
  | "kids-christmas"
  | "kids-animals"
  | "kids-bluey"
  | "kids-dinosaurs"
  | "kids-superheroes"
  | "kids-space"
  | "kids-fairy-tales"
  | "kids-school"
  | "kids-under-the-sea"
  | "family-classics"
  | "family-movies"
  | "family-holidays"
  | "family-animals-plus"
  | "family-80s-90s"
  | "family-food"
  | "family-sports"
  | "family-world"
  | "family-songs"
  | "family-science"
  | "adult-movies"
  | "adult-music"
  | "adult-sports"
  | "adult-history"
  | "adult-food-drink"
  | "adult-tech"
  | "adult-2000s"
  | "adult-brands"
  | "adult-books"
  | "adult-cities"
  | "spicy-dating"
  | "spicy-crude"
  | "spicy-after-dark-tv"
  | "spicy-bars"
  | "spicy-tabloid"
  | "spicy-college"
  | "spicy-reality"
  | "spicy-dirty-mind"
  | "spicy-scandal"
  | "spicy-late-night"
  | "spicy-urban-dictionary";

export type TriviaChaosMode = "off" | "light" | "mayhem";

export type TriviaChaosPower =
  | "buzzJam"
  | "blindfold"
  | "partyTax"
  | "trapAnswer"
  | "stealBuzz"
  | "potSiphon"
  | "swapStakes"
  | "alliance"
  | "spotlightSteal"
  | "hintTax";

export const TRIVIA_AUDIENCES: TriviaAudience[] = ["kids", "family", "adult", "spicy"];

export const TRIVIA_AUDIENCE_LABELS: Record<TriviaAudience, string> = {
  kids: "Kids",
  family: "Family",
  adult: "Adult",
  spicy: "Spicy",
};

export const TRIVIA_PACK_IDS: TriviaPackId[] = [
  "kids-thanksgiving",
  "kids-christmas",
  "kids-animals",
  "kids-bluey",
  "kids-dinosaurs",
  "kids-superheroes",
  "kids-space",
  "kids-fairy-tales",
  "kids-school",
  "kids-under-the-sea",
  "family-classics",
  "family-movies",
  "family-holidays",
  "family-animals-plus",
  "family-80s-90s",
  "family-food",
  "family-sports",
  "family-world",
  "family-songs",
  "family-science",
  "adult-movies",
  "adult-music",
  "adult-sports",
  "adult-history",
  "adult-food-drink",
  "adult-tech",
  "adult-2000s",
  "adult-brands",
  "adult-books",
  "adult-cities",
  "spicy-dating",
  "spicy-crude",
  "spicy-after-dark-tv",
  "spicy-bars",
  "spicy-tabloid",
  "spicy-college",
  "spicy-reality",
  "spicy-dirty-mind",
  "spicy-scandal",
  "spicy-late-night",
  "spicy-urban-dictionary",
];

export const DEFAULT_TRIVIA_PACK: TriviaPackId = "family-classics";

export const TRIVIA_PACK_LABELS: Record<TriviaPackId, string> = {
  "kids-thanksgiving": "Thanksgiving",
  "kids-christmas": "Christmas",
  "kids-animals": "Animals",
  "kids-bluey": "Bluey",
  "kids-dinosaurs": "Dinosaurs",
  "kids-superheroes": "Superheroes",
  "kids-space": "Space Explorers",
  "kids-fairy-tales": "Fairy Tales",
  "kids-school": "School Days",
  "kids-under-the-sea": "Under the Sea",
  "family-classics": "Classics",
  "family-movies": "Family Movies",
  "family-holidays": "Holidays",
  "family-animals-plus": "Animals Plus",
  "family-80s-90s": "80s & 90s",
  "family-food": "Food & Kitchen",
  "family-sports": "Sports Night",
  "family-world": "World Traveler",
  "family-songs": "Hit Songs",
  "family-science": "Science Lab",
  "adult-movies": "Movies & TV",
  "adult-music": "Music Charts",
  "adult-sports": "Sports Deep Cuts",
  "adult-history": "History Buff",
  "adult-food-drink": "Food & Drink",
  "adult-tech": "Tech & Internet",
  "adult-2000s": "2000s Nostalgia",
  "adult-brands": "Brands & Ads",
  "adult-books": "Books & Quotes",
  "adult-cities": "Cities & Travel",
  "spicy-dating": "Dating Disasters",
  "spicy-crude": "Crude Humor",
  "spicy-after-dark-tv": "After Dark TV",
  "spicy-bars": "Bars & Booze",
  "spicy-tabloid": "Tabloid Chaos",
  "spicy-college": "College Party",
  "spicy-reality": "Reality Drama",
  "spicy-dirty-mind": "Dirty Mind",
  "spicy-scandal": "Scandal Timeline",
  "spicy-late-night": "Late Night Bits",
  "spicy-urban-dictionary": "Urban Dictionary",
};

/** Packs that need a host warning + confirm before lobby selection (NSFW). */
export const TRIVIA_EXPLICIT_PACK_IDS: readonly TriviaPackId[] = ["spicy-urban-dictionary"];

export const TRIVIA_PACK_AUDIENCE: Record<TriviaPackId, TriviaAudience> = {
  "kids-thanksgiving": "kids",
  "kids-christmas": "kids",
  "kids-animals": "kids",
  "kids-bluey": "kids",
  "kids-dinosaurs": "kids",
  "kids-superheroes": "kids",
  "kids-space": "kids",
  "kids-fairy-tales": "kids",
  "kids-school": "kids",
  "kids-under-the-sea": "kids",
  "family-classics": "family",
  "family-movies": "family",
  "family-holidays": "family",
  "family-animals-plus": "family",
  "family-80s-90s": "family",
  "family-food": "family",
  "family-sports": "family",
  "family-world": "family",
  "family-songs": "family",
  "family-science": "family",
  "adult-movies": "adult",
  "adult-music": "adult",
  "adult-sports": "adult",
  "adult-history": "adult",
  "adult-food-drink": "adult",
  "adult-tech": "adult",
  "adult-2000s": "adult",
  "adult-brands": "adult",
  "adult-books": "adult",
  "adult-cities": "adult",
  "spicy-dating": "spicy",
  "spicy-crude": "spicy",
  "spicy-after-dark-tv": "spicy",
  "spicy-bars": "spicy",
  "spicy-tabloid": "spicy",
  "spicy-college": "spicy",
  "spicy-reality": "spicy",
  "spicy-dirty-mind": "spicy",
  "spicy-scandal": "spicy",
  "spicy-late-night": "spicy",
  "spicy-urban-dictionary": "spicy",
};
export const DEFAULT_TRIVIA_CHAOS_MODE: TriviaChaosMode = "light";

export const TRIVIA_SINGLE_VALUES = [200, 400, 600, 800, 1000] as const;
export const TRIVIA_DOUBLE_VALUES = [400, 800, 1200, 1600, 2000] as const;
export const TRIVIA_CATEGORIES = 6;
export const TRIVIA_TIERS = 5;

export const TRIVIA_CELL_HIGHLIGHT_MS = 1500;
export const TRIVIA_CLUE_READ_MS = 2500;
export const TRIVIA_ANSWER_MS = 12000;
export const TRIVIA_REVEAL_MS = 3500;
export const TRIVIA_BETWEEN_MS = 4000;
export const TRIVIA_DD_REVEAL_MS = 2200;
export const TRIVIA_FINAL_CATEGORY_MS = 4000;
export const TRIVIA_FINAL_WAGER_MS = 20000;
export const TRIVIA_FINAL_ANSWER_MS = 15000;
export const TRIVIA_DAILY_WAGER_MIN = 5;
export const TRIVIA_BUZZ_JAM_MS = 1000;
/** Grace after wrong-answer reopen so all phones arm on the same wall clock. */
export const TRIVIA_BUZZ_SYNC_MS = 500;
export const TRIVIA_BLINDFOLD_MS = 3000;
export const TRIVIA_CHAOS_DASH_LOCK_MS = 500;
/** Fraction of a correct clue's payout diverted to the pot when party tax is active. */
export const TRIVIA_PARTY_TAX_RATE = 0.3;
export const TRIVIA_HINT_TAX = 50;

export const LIGHT_CHAOS_POWERS: TriviaChaosPower[] = [
  "buzzJam",
  "blindfold",
  "partyTax",
];

export const MAYHEM_CHAOS_POWERS: TriviaChaosPower[] = [
  ...LIGHT_CHAOS_POWERS,
  "trapAnswer",
  "stealBuzz",
  "potSiphon",
  "swapStakes",
  "alliance",
  "spotlightSteal",
  "hintTax",
];

export function chaosChargeCap(mode: TriviaChaosMode): number {
  if (mode === "mayhem") return 2;
  if (mode === "light") return 1;
  return 0;
}

export function powersForMode(mode: TriviaChaosMode): TriviaChaosPower[] {
  if (mode === "mayhem") return MAYHEM_CHAOS_POWERS;
  if (mode === "light") return LIGHT_CHAOS_POWERS;
  return [];
}

export function isTriviaPackId(v: unknown): v is TriviaPackId {
  return typeof v === "string" && (TRIVIA_PACK_IDS as string[]).includes(v);
}

export function isTriviaAudience(v: unknown): v is TriviaAudience {
  return v === "kids" || v === "family" || v === "adult" || v === "spicy";
}

export function normalizeTriviaPackId(v: unknown): TriviaPackId {
  if (v === "family") return "family-classics";
  if (isTriviaPackId(v)) return v;
  return DEFAULT_TRIVIA_PACK;
}

export function packsForAudience(audience: TriviaAudience): TriviaPackId[] {
  return TRIVIA_PACK_IDS.filter((id) => TRIVIA_PACK_AUDIENCE[id] === audience);
}

export function audienceForPack(packId: TriviaPackId): TriviaAudience {
  return TRIVIA_PACK_AUDIENCE[packId];
}

export function isTriviaChaosMode(v: unknown): v is TriviaChaosMode {
  return v === "off" || v === "light" || v === "mayhem";
}

export function isTriviaChaosPower(v: unknown): v is TriviaChaosPower {
  return (
    typeof v === "string" &&
    (MAYHEM_CHAOS_POWERS as string[]).includes(v)
  );
}

export function valueForTier(round: TriviaRound, tier: number): number {
  const table = round === "single" ? TRIVIA_SINGLE_VALUES : TRIVIA_DOUBLE_VALUES;
  return table[Math.max(0, Math.min(TRIVIA_TIERS - 1, tier))] ?? table[0];
}

export interface TriviaClueDef {
  id: string;
  prompt: string;
  /** Length 8; correct answer at correctIndex before shuffle. */
  choices: string[];
  correctIndex: number;
}

export interface TriviaCategoryDef {
  title: string;
  clues: TriviaClueDef[]; // length 5, tiers 0..4
}

export interface TriviaFinalDef {
  category: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
}

export interface TriviaPack {
  id: TriviaPackId;
  audience: TriviaAudience;
  title: string;
  tagline: string;
  single: TriviaCategoryDef[];
  double: TriviaCategoryDef[];
  final: TriviaFinalDef;
}

export interface TriviaBoardCellPublic {
  categoryIndex: number;
  tier: number;
  value: number;
  cleared: boolean;
}

export interface TriviaBoardPublic {
  round: TriviaRound;
  categories: string[];
  cells: TriviaBoardCellPublic[]; // 30
}

export interface TriviaActiveCluePublic {
  categoryIndex: number;
  tier: number;
  value: number;
  categoryTitle: string;
  prompt: string;
  isDailyDouble: boolean;
  choices: string[] | null;
  /** Set during reveal / final results. */
  correctChoiceIndex: number | null;
  selectedChoiceIndex: number | null;
}

export interface TriviaPlayerPublic {
  id: string;
  name: string;
  isHost: boolean;
  score: number;
  chaosCharges: number;
  finalWager: number | null;
  finalAnswered: boolean;
}

export interface TriviaPlayerResult {
  id: string;
  name: string;
  score: number;
}

export interface TriviaChaosDashPublic {
  kind: string;
  prompt: string;
  choices: string[];
  winnerId: string | null;
  winnerName: string | null;
}

export type TriviaLastOutcome =
  | "correct"
  | "wrong"
  | "timeout"
  | "dailyDouble"
  | "boardClear"
  | "chaosWin"
  | TriviaChaosPower
  | null;

export interface TriviaRoomState {
  game: "trivia";
  code: string;
  phase: TriviaPhase;
  packId: TriviaPackId;
  chaosMode: TriviaChaosMode;
  round: TriviaRound | null;
  board: TriviaBoardPublic | null;
  controllerId: string | null;
  clueStage: TriviaClueStage | null;
  activeClue: TriviaActiveCluePublic | null;
  buzzedPlayerId: string | null;
  buzzLockSeq: number;
  /** Wall-clock ms when buzz becomes accepted; clients arm the button at this time. */
  buzzOpenAt: number | null;
  lockedOutIds: string[];
  players: TriviaPlayerPublic[];
  endsAt: number | null;
  dailyWager: number | null;
  dailyWagerMax: number | null;
  finalCategory: string | null;
  finalPrompt: string | null;
  finalChoices: string[] | null;
  finalCorrectIndex: number | null;
  pot: number;
  chaosDash: TriviaChaosDashPublic | null;
  chaosWinSeq: number;
  lastOutcome: TriviaLastOutcome;
  lastOutcomePlayerId: string | null;
  lastOutcomePlayerName: string | null;
  /** Transient FX flags for clients. */
  blindfoldUntil: number | null;
  spotlightPlayerId: string | null;
  buzzJamUntil: Record<string, number>;
  hintExcluded: number[];
  trapChoiceIndex: number | null;
  allianceIds: string[] | null;
  lastScoreDelta: number | null;
  results: TriviaPlayerResult[];
  winners: string[];
}

export type TriviaClientMessage =
  | { type: "join"; name: string; resumeId?: string }
  | { type: "spectate" }
  | { type: "setTriviaPack"; packId: TriviaPackId }
  | { type: "setTriviaChaosMode"; mode: TriviaChaosMode }
  | { type: "start" }
  | { type: "pickCell"; categoryIndex: number; tier: number }
  | { type: "buzz" }
  | { type: "answer"; choiceIndex: number }
  | { type: "setDailyWager"; amount: number }
  | { type: "setFinalWager"; amount: number }
  | { type: "finalAnswer"; choiceIndex: number }
  | { type: "solveChaos"; choiceIndex: number }
  | { type: "useChaos"; power: TriviaChaosPower; targetPlayerId?: string }
  | { type: "playAgain" };

export type TriviaServerMessage =
  | {
      type: "welcome";
      playerId: string;
      state: TriviaRoomState;
      role?: "player" | "spectator";
    }
  | { type: "state"; state: TriviaRoomState }
  | { type: "error"; message: string };
