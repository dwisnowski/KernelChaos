import { DurableObject } from "cloudflare:workers";
import { generateBoard, type BoardSize } from "./boggle/dice.ts";
import { isDictionaryWord } from "./boggle/dictionary.ts";
import { isValidPath, pathToWord } from "./boggle/path.ts";
import {
  COUNTDOWN_MS,
  DEFAULT_ROUND_SECONDS,
  MIN_WORD_LEN,
  isRoundSeconds,
  type ClientMessage as BoggleClientMessage,
  type LengthCount,
  type Phase as BogglePhase,
  type PlayerPublic as BogglePlayerPublic,
  type PlayerResult as BogglePlayerResult,
  type RoundAward,
  type RoundSeconds,
  type RoomState as BoggleRoomState,
  type ServerMessage as BoggleServerMessage,
} from "./boggle/protocol.ts";
import {
  computePoints,
  coveragePoints,
  finalizeWordBonuses,
  rareLetterCount,
  scoreAtSubmit,
  type BonusId,
} from "./boggle/scoring.ts";
import { computeBoardCoverage } from "./boggle/solver.ts";
import { insertRoundStats, longestAcceptedWord } from "./boggle/stats.ts";
import { deleteActiveRoom, upsertActiveRoom } from "./activeRooms.ts";
import { isLetterDie, rollLetter } from "./scattergories/letter.ts";
import { HUNT_MAX_ANSWERS } from "./scattergories/hunt/scenes.ts";
import {
  DEFAULT_HUNT_PACK,
  isHuntPackId,
  packsCatalog,
  pickSceneFromPack,
  type HuntPackId,
} from "./scattergories/hunt/packs.ts";
import {
  huntFindKey,
  scoreHuntPeerFinds,
  scoreHuntPeerPlayer,
  type HuntPeerFindInput,
} from "./scattergories/hunt/peerScoring.ts";
import { normalizeAnswer, startsWithLetter } from "./scattergories/normalize.ts";
import type { HuntFindStatus, HuntMark } from "./scattergories/protocol.ts";
import { pickList } from "./scattergories/packs.ts";
import {
  CATEGORIES_PER_LIST,
  DEFAULT_SCATTER_PLAY_MODE,
  DEFAULT_SCATTER_ROUND_SECONDS,
  SCATTER_COUNTDOWN_MS,
  SCATTER_ROLL_TIMEOUT_MS,
  isPackTier,
  isScatterPlayMode,
  isScatterRoundSeconds,
  type PackTier,
  type ReviewVote,
  type ScatterClientMessage,
  type ScatterPhase,
  type ScatterPlayMode,
  type ScatterPlayerPublic,
  type ScatterPlayerResult,
  type ScatterRoomState,
  type ScatterRoundSeconds,
  type ScatterServerMessage,
} from "./scattergories/protocol.ts";
import { scoreCategory, scorePlayerAcrossCategories } from "./scattergories/scoring.ts";
import { dealOrbs, isOrbColor, resolveAttack, type OrbColor } from "./mmmms/orbs.ts";
import {
  DEFAULT_ORB_COUNT,
  isOrbCount,
  isValidOrbList,
  type MmmmsAttackResult,
  type MmmmsClientMessage,
  type MmmmsPhase,
  type MmmmsPlayerPublic,
  type MmmmsRoomState,
  type MmmmsServerMessage,
  type OrbCount,
} from "./mmmms/protocol.ts";
import { generatePuzzle } from "./spotdiff/generate.ts";
import { hitDifference } from "./spotdiff/hitTest.ts";
import {
  DEFAULT_SPOT_DIFF_COUNT,
  DEFAULT_SPOT_DIFFICULTY,
  DEFAULT_SPOT_MODE,
  DEFAULT_SPOT_ROUND_SECONDS,
  SPOT_COUNTDOWN_MS,
  SPOT_HINT_MS,
  SPOT_MISS_LOCK_MS,
  isSpotDiffCount,
  isSpotDifficulty,
  isSpotPlayMode,
  isSpotRoundSeconds,
  type SpotDiffCount,
  type SpotDifficulty,
  type SpotPlayMode,
  type SpotPuzzle,
  type SpotRoundSeconds,
  type SpotdiffClientMessage,
  type SpotdiffPhase,
  type SpotdiffPlayerPublic,
  type SpotdiffPlayerResult,
  type SpotdiffRoomState,
  type SpotdiffServerMessage,
} from "./spotdiff/protocol.ts";
import {
  advanceTowerAfterScore,
  dealSharedPair,
  dealTowerStart,
  towerMatchForPlayer,
  type TowerDeal,
} from "./spot-it/deal.ts";
import type { SpotItCardView } from "./spot-it/layout.ts";
import { buildQuizChoices, getSpotItPack } from "./spot-it/packs.ts";
import {
  DEFAULT_KANA_PACK,
  DEFAULT_SPOT_IT_MODE,
  DEFAULT_SPOT_IT_PACK,
  DEFAULT_SPOT_IT_TARGET,
  SPOT_IT_BETWEEN_MS,
  SPOT_IT_LEARNING_BETWEEN_MS,
  SPOT_IT_MISS_LOCK_MS,
  SPOT_IT_QUIZ_MISS_LOCK_MS,
  isKanaPack,
  isSpotItMode,
  isSpotItPackId,
  isSpotItTarget,
  type SpotItClientMessage,
  type SpotItMode,
  type SpotItPackId,
  type SpotItPhase,
  type SpotItPlayerPublic,
  type SpotItRoomState,
  type SpotItServerMessage,
  type SpotItTarget,
} from "./spot-it/protocol.ts";
import {
  countLetterInAnswer,
  isFullyRevealed,
  normalizeGuess,
  pickPuzzle,
  toPublicPuzzle,
  type WheelPuzzle,
} from "./wheel/puzzles.ts";
import {
  DEFAULT_WHEEL_ROUNDS,
  WHEEL_BETWEEN_MS,
  WHEEL_CHAOS_TAX,
  WHEEL_GUESS_MS,
  WHEEL_JACKPOT_TICK,
  WHEEL_MYSTERY_UNIT,
  WHEEL_PAY_EACH,
  WHEEL_STEAL,
  isConsonant,
  isVowel,
  isWheelRoundCount,
  type WheelClientMessage,
  type WheelLastOutcome,
  type WheelLastSpin,
  type WheelPhase,
  type WheelPlayerPublic,
  type WheelPlayerResult,
  type WheelRoomState,
  type WheelRoundCount,
  type WheelServerMessage,
  type WheelTurnPhase,
} from "./wheel/protocol.ts";
import { addConsonantWinnings, applyVowelPurchase, bankRoundIntoTotal, canBuyVowel } from "./wheel/scoring.ts";
import { WHEEL_WEDGES, pickSpin } from "./wheel/wheel.ts";
import { TriviaController, type TriviaPersisted } from "./trivia/triviaController.ts";
import {
  DEFAULT_TRIVIA_CHAOS_MODE,
  DEFAULT_TRIVIA_PACK,
  type TriviaClientMessage,
  type TriviaPhase,
  type TriviaRoomState,
  type TriviaServerMessage,
} from "./trivia/protocol.ts";

/** Per-category: voterId → (targetPlayerId → in|out). */
type ReviewBallotMaps = Array<Map<string, Record<string, ReviewVote>>>;
/** Persistable form of ReviewBallotMaps. */
type StoredReviewBallots = Array<Record<string, Record<string, ReviewVote>>>;

export type GameType = "boggle" | "scattergories" | "mmmms" | "spotdiff" | "spot-it" | "wheel" | "trivia";

type AnyPhase = BogglePhase | ScatterPhase | MmmmsPhase | SpotdiffPhase | SpotItPhase | WheelPhase | TriviaPhase;

/** Max wait for clients to finish explosion animation before advancing. */
const MMMMS_RESOLVE_TIMEOUT_MS = 15_000;

/** Brief window so a refresh does not destroy the room immediately. */
const EMPTY_GRACE_MS = 30_000;

function isJoinablePhase(phase: AnyPhase): boolean {
  return phase === "lobby" || phase === "results";
}

interface WordRecord {
  word: string;
  path: number[];
  submittedAt: number;
  base: number;
  bonuses: BonusId[];
  points: number;
}

interface PlayerRecord {
  id: string;
  name: string;
  isHost: boolean;
  words: Map<string, WordRecord>;
  roundAwards: RoundAward[];
  answers: string[];
  hostRejected: boolean[];
  /** Hunt pin positions parallel to answers. */
  findMarks: HuntMark[];
  /** M&Ms Smash: bottom→top stack (index 0 explodes first). */
  orbs: OrbColor[];
  mmmmsReady: boolean;
  /** Spot the Difference: private finds (race/solo). */
  foundDiffIds: string[];
  /** Spot It: rounds won this game. */
  spotItScore: number;
  missStreak: number;
  lockedUntil: number | null;
  /** Chaos Wheel banks. */
  wheelRoundBank: number;
  wheelTotalScore: number;
  wheelFreeSpins: number;
  wheelInsurance: boolean;
}

interface Attachment {
  playerId?: string;
  spectator?: boolean;
}

interface StoredWord {
  word: string;
  path: number[];
  submittedAt: number;
  base: number;
  bonuses: BonusId[];
  points: number;
}

interface StoredPlayer {
  id: string;
  name: string;
  isHost: boolean;
  words: StoredWord[] | [string, number][];
  roundAwards?: RoundAward[];
  answers?: string[];
  hostRejected?: boolean[];
  findMarks?: HuntMark[];
  orbs?: OrbColor[];
  mmmmsReady?: boolean;
  foundDiffIds?: string[];
  spotItScore?: number;
  missStreak?: number;
  lockedUntil?: number | null;
  wheelRoundBank?: number;
  wheelTotalScore?: number;
  wheelFreeSpins?: number;
  wheelInsurance?: boolean;
}

type ClientMessage =
  | BoggleClientMessage
  | ScatterClientMessage
  | MmmmsClientMessage
  | SpotdiffClientMessage
  | SpotItClientMessage
  | WheelClientMessage
  | TriviaClientMessage;
type ServerMessage =
  | BoggleServerMessage
  | ScatterServerMessage
  | MmmmsServerMessage
  | SpotdiffServerMessage
  | SpotItServerMessage
  | WheelServerMessage
  | TriviaServerMessage;

function emptyAnswers(): string[] {
  return Array.from({ length: CATEGORIES_PER_LIST }, () => "");
}

function emptyRejected(): boolean[] {
  return Array.from({ length: CATEGORIES_PER_LIST }, () => false);
}

function emptyReviewBallots(): ReviewBallotMaps {
  return Array.from({ length: CATEGORIES_PER_LIST }, () => new Map());
}

function serializeReviewBallots(ballots: ReviewBallotMaps): StoredReviewBallots {
  return ballots.map((m) => Object.fromEntries(m.entries()));
}

function loadReviewBallots(raw: unknown): ReviewBallotMaps {
  const out = emptyReviewBallots();
  if (!Array.isArray(raw)) return out;
  for (let i = 0; i < CATEGORIES_PER_LIST; i++) {
    const cat = raw[i];
    if (!cat || typeof cat !== "object") continue;
    const map = new Map<string, Record<string, ReviewVote>>();
    for (const [voterId, ballot] of Object.entries(cat as Record<string, unknown>)) {
      if (!ballot || typeof ballot !== "object") continue;
      const cleaned: Record<string, ReviewVote> = {};
      for (const [targetId, v] of Object.entries(ballot as Record<string, unknown>)) {
        if (v === "in" || v === "out") cleaned[targetId] = v;
      }
      map.set(voterId, cleaned);
    }
    out[i] = map;
  }
  return out;
}

function isBoardSize(n: unknown): n is BoardSize {
  return n === 4 || n === 5 || n === 6;
}

function isStoredWord(entry: unknown): entry is StoredWord {
  return (
    typeof entry === "object" &&
    entry !== null &&
    "word" in entry &&
    typeof (entry as StoredWord).word === "string" &&
    Array.isArray((entry as StoredWord).path)
  );
}

function loadWords(raw: StoredPlayer["words"]): Map<string, WordRecord> {
  const map = new Map<string, WordRecord>();
  for (const entry of raw) {
    if (isStoredWord(entry)) {
      map.set(entry.word, {
        word: entry.word,
        path: entry.path,
        submittedAt: entry.submittedAt,
        base: entry.base,
        bonuses: entry.bonuses,
        points: entry.points,
      });
    } else if (Array.isArray(entry) && entry.length === 2) {
      const [word, points] = entry as [string, number];
      map.set(word, {
        word,
        path: [],
        submittedAt: 0,
        base: points,
        bonuses: [],
        points,
      });
    }
  }
  return map;
}

function isGameType(v: unknown): v is GameType {
  return (
    v === "boggle" ||
    v === "scattergories" ||
    v === "mmmms" ||
    v === "spotdiff" ||
    v === "spot-it" ||
    v === "wheel" ||
    v === "trivia"
  );
}

function loadOrbs(raw: unknown): OrbColor[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(isOrbColor);
}

export class GameRoom extends DurableObject<Env> {
  private gameType: GameType = "boggle";
  private code = "";
  private phase: AnyPhase = "lobby";
  private boardSize: BoardSize = 4;
  private roundSeconds: RoundSeconds | ScatterRoundSeconds = DEFAULT_ROUND_SECONDS;
  private board: string[] | null = null;
  private countdownEndsAt: number | null = null;
  private endsAt: number | null = null;
  private round = 0;
  private players = new Map<string, PlayerRecord>();
  private globalAcceptCount = 0;
  private lastAccept: { playerId: string; word: string } | null = null;
  private scoresFinalized = false;
  private missedWords: string[] | null = null;
  private possibleWords: string[] | null = null;
  private possibleWordCount: number | null = null;
  private possibleByLength: LengthCount[] | null = null;

  // Scattergories
  private playMode: ScatterPlayMode = DEFAULT_SCATTER_PLAY_MODE;
  private packTier: PackTier = "family";
  private letter: string | null = null;
  private categories: string[] | null = null;
  private listId: string | null = null;
  private usedListIds: string[] = [];
  private huntPackId: HuntPackId = DEFAULT_HUNT_PACK;
  private sceneId: string | null = null;
  private sceneTitle: string | null = null;
  private sceneImageUrl: string | null = null;
  private usedSceneIds: string[] = [];
  private rollerId: string | null = null;
  private rollerName: string | null = null;
  private reviewIndex: number | null = null;
  private reviewBallots: ReviewBallotMaps = emptyReviewBallots();
  private rollEndsAt: number | null = null;
  private emptyGraceEndsAt: number | null = null;

  // M&Ms Smash
  private orbCount: OrbCount = DEFAULT_ORB_COUNT;
  private attackerId: string | null = null;
  private defenderId: string | null = null;
  private defenderGuess: OrbColor | null = null;
  private lastAttack: MmmmsAttackResult | null = null;
  private winnerId: string | null = null;
  private resolveAcks = new Set<string>();
  private resolveEndsAt: number | null = null;

  // Spot the Difference
  private spotMode: SpotPlayMode = DEFAULT_SPOT_MODE;
  private spotDiffCount: SpotDiffCount = DEFAULT_SPOT_DIFF_COUNT;
  private spotDifficulty: SpotDifficulty = DEFAULT_SPOT_DIFFICULTY;
  private spotPuzzle: SpotPuzzle | null = null;
  private spotSharedFound: string[] = [];
  private spotWinners: string[] = [];
  private spotHintDiffId: string | null = null;
  private spotHintUntil: number | null = null;
  private spotHintForPlayerId: string | null = null;

  // Spot It
  private spotItMode: SpotItMode = DEFAULT_SPOT_IT_MODE;
  private spotItTarget: SpotItTarget = DEFAULT_SPOT_IT_TARGET;
  private spotItPack: SpotItPackId = DEFAULT_SPOT_IT_PACK;
  private spotItCardA: SpotItCardView | null = null;
  private spotItCardB: SpotItCardView | null = null;
  private spotItCenter: SpotItCardView | null = null;
  private spotItHands = new Map<string, SpotItCardView>();
  /** Server-only: never include in a public snapshot. */
  private spotItMatchSymbol: number | null = null;
  private spotItUsedCards: number[] = [];
  private spotItPile: number[] = [];
  private spotItTowerOrder: number[] = [];
  private spotItLastScorerId: string | null = null;
  private spotItLastScorerName: string | null = null;
  private spotItWinners: string[] = [];
  private spotItQuizSymbolIndex: number | null = null;
  private spotItQuizChoices: string[] | null = null;
  private spotItQuizKana: string | null = null;
  private spotItQuizReading: string[] | null = null;
  private spotItLastMatchKana: string | null = null;
  private spotItLastMatchReading: string[] | null = null;
  private spotItLastMatchEnglish: string | null = null;

  // Chaos Wheel
  private wheelRoundCount: WheelRoundCount = DEFAULT_WHEEL_ROUNDS;
  private wheelRoundIndex = 0;
  private wheelTurnPhase: WheelTurnPhase | null = null;
  private wheelCurrentPlayerId: string | null = null;
  private wheelPuzzle: WheelPuzzle | null = null;
  private wheelRevealed = new Set<string>();
  private wheelUsedLetters: string[] = [];
  private wheelUsedPuzzleIds: string[] = [];
  private wheelLastSpin: WheelLastSpin | null = null;
  private wheelPendingCash: number | null = null;
  private wheelLastSolverId: string | null = null;
  private wheelLastSolverName: string | null = null;
  private wheelWinners: string[] = [];
  private wheelJackpot = 0;
  private wheelGuessEndsAt: number | null = null;
  private wheelVowelFree = false;
  private wheelLastOutcome: WheelLastOutcome = null;
  private wheelLastOutcomePlayerName: string | null = null;

  // Trivia
  private trivia = new TriviaController();

  private loaded = false;

  private async ensureLoaded(): Promise<void> {
    if (this.loaded) return;
    const stored = await this.ctx.storage.get<{
      gameType?: GameType;
      code: string;
      phase: AnyPhase;
      boardSize: BoardSize;
      roundSeconds?: RoundSeconds | ScatterRoundSeconds;
      board: string[] | null;
      countdownEndsAt: number | null;
      endsAt: number | null;
      round: number;
      players: StoredPlayer[];
      globalAcceptCount?: number;
      lastAccept?: { playerId: string; word: string } | null;
      scoresFinalized?: boolean;
      missedWords?: string[] | null;
      possibleWords?: string[] | null;
      possibleWordCount?: number | null;
      possibleByLength?: LengthCount[] | null;
      playMode?: ScatterPlayMode;
      packTier?: PackTier;
      letter?: string | null;
      categories?: string[] | null;
      listId?: string | null;
      usedListIds?: string[];
      huntPackId?: string | null;
      /** @deprecated Prefer huntPackId (ADR 0042). */
      preferredSceneId?: string | null;
      sceneId?: string | null;
      sceneTitle?: string | null;
      sceneImageUrl?: string | null;
      usedSceneIds?: string[];
      rollerId?: string | null;
      rollerName?: string | null;
      reviewIndex?: number | null;
      reviewBallots?: StoredReviewBallots;
      rollEndsAt?: number | null;
      emptyGraceEndsAt?: number | null;
      orbCount?: OrbCount;
      attackerId?: string | null;
      defenderId?: string | null;
      defenderGuess?: OrbColor | null;
      lastAttack?: MmmmsAttackResult | null;
      winnerId?: string | null;
      resolveAcks?: string[];
      resolveEndsAt?: number | null;
      spotMode?: SpotPlayMode;
      spotDiffCount?: SpotDiffCount;
      spotDifficulty?: SpotDifficulty;
      spotPuzzle?: SpotPuzzle | null;
      spotSharedFound?: string[];
      spotWinners?: string[];
      spotHintDiffId?: string | null;
      spotHintUntil?: number | null;
      spotHintForPlayerId?: string | null;
      spotItMode?: SpotItMode;
      spotItTarget?: SpotItTarget;
      spotItPack?: SpotItPackId;
      spotItCardA?: SpotItCardView | null;
      spotItCardB?: SpotItCardView | null;
      spotItCenter?: SpotItCardView | null;
      spotItHands?: Record<string, SpotItCardView>;
      spotItMatchSymbol?: number | null;
      spotItUsedCards?: number[];
      spotItPile?: number[];
      spotItTowerOrder?: number[];
      spotItLastScorerId?: string | null;
      spotItLastScorerName?: string | null;
      spotItWinners?: string[];
      spotItQuizSymbolIndex?: number | null;
      spotItQuizChoices?: string[] | null;
      spotItQuizKana?: string | null;
      spotItQuizReading?: string[] | null;
      spotItLastMatchKana?: string | null;
      spotItLastMatchReading?: string[] | null;
      spotItLastMatchEnglish?: string | null;
      wheelRoundCount?: WheelRoundCount;
      wheelRoundIndex?: number;
      wheelTurnPhase?: WheelTurnPhase | null;
      wheelCurrentPlayerId?: string | null;
      wheelPuzzle?: WheelPuzzle | null;
      wheelRevealed?: string[];
      wheelUsedLetters?: string[];
      wheelUsedPuzzleIds?: string[];
      wheelLastSpin?: WheelLastSpin | null;
      wheelPendingCash?: number | null;
      wheelLastSolverId?: string | null;
      wheelLastSolverName?: string | null;
      wheelWinners?: string[];
      wheelJackpot?: number;
      wheelGuessEndsAt?: number | null;
      /** @deprecated persisted as wheelGuessEndsAt */
      wheelSpeedEndsAt?: number | null;
      wheelVowelFree?: boolean;
      wheelLastOutcome?: WheelLastOutcome;
      wheelLastOutcomePlayerName?: string | null;
      trivia?: TriviaPersisted;
    }>("room");
    if (stored) {
      this.gameType = isGameType(stored.gameType) ? stored.gameType : "boggle";
      this.code = stored.code;
      this.phase = stored.phase;
      this.boardSize = stored.boardSize;
      if (this.gameType === "scattergories") {
        this.roundSeconds = isScatterRoundSeconds(stored.roundSeconds)
          ? stored.roundSeconds
          : DEFAULT_SCATTER_ROUND_SECONDS;
      } else if (this.gameType === "mmmms") {
        this.roundSeconds = DEFAULT_ROUND_SECONDS;
      } else if (this.gameType === "spotdiff") {
        this.roundSeconds = isSpotRoundSeconds(stored.roundSeconds)
          ? stored.roundSeconds
          : DEFAULT_SPOT_ROUND_SECONDS;
      } else {
        this.roundSeconds = isRoundSeconds(stored.roundSeconds)
          ? stored.roundSeconds
          : DEFAULT_ROUND_SECONDS;
      }
      this.board = stored.board;
      this.countdownEndsAt = stored.countdownEndsAt;
      this.endsAt = stored.endsAt;
      this.round = stored.round;
      this.globalAcceptCount = stored.globalAcceptCount ?? 0;
      this.lastAccept = stored.lastAccept ?? null;
      this.scoresFinalized = stored.scoresFinalized ?? this.phase === "results";
      this.missedWords = stored.missedWords ?? null;
      this.possibleWords = stored.possibleWords ?? null;
      this.possibleWordCount = stored.possibleWordCount ?? null;
      this.possibleByLength = stored.possibleByLength ?? null;
      this.playMode = isScatterPlayMode(stored.playMode) ? stored.playMode : DEFAULT_SCATTER_PLAY_MODE;
      this.packTier = isPackTier(stored.packTier) ? stored.packTier : "family";
      this.letter = stored.letter ?? null;
      this.categories = stored.categories ?? null;
      this.listId = stored.listId ?? null;
      this.usedListIds = stored.usedListIds ?? [];
      this.huntPackId = isHuntPackId(stored.huntPackId) ? stored.huntPackId : DEFAULT_HUNT_PACK;
      this.sceneId = stored.sceneId ?? null;
      this.sceneTitle = stored.sceneTitle ?? null;
      this.sceneImageUrl = stored.sceneImageUrl ?? null;
      this.usedSceneIds = stored.usedSceneIds ?? [];
      this.rollerId = stored.rollerId ?? null;
      this.rollerName = stored.rollerName ?? null;
      this.reviewIndex = stored.reviewIndex ?? null;
      this.reviewBallots = loadReviewBallots(stored.reviewBallots);
      this.rollEndsAt = stored.rollEndsAt ?? null;
      this.emptyGraceEndsAt = stored.emptyGraceEndsAt ?? null;
      this.orbCount = isOrbCount(stored.orbCount) ? stored.orbCount : DEFAULT_ORB_COUNT;
      this.attackerId = stored.attackerId ?? null;
      this.defenderId = stored.defenderId ?? null;
      this.defenderGuess = stored.defenderGuess && isOrbColor(stored.defenderGuess) ? stored.defenderGuess : null;
      this.lastAttack = stored.lastAttack ?? null;
      this.winnerId = stored.winnerId ?? null;
      this.resolveAcks = new Set(stored.resolveAcks ?? []);
      this.resolveEndsAt = stored.resolveEndsAt ?? null;
      this.spotMode = isSpotPlayMode(stored.spotMode) ? stored.spotMode : DEFAULT_SPOT_MODE;
      this.spotDiffCount = isSpotDiffCount(stored.spotDiffCount)
        ? stored.spotDiffCount
        : DEFAULT_SPOT_DIFF_COUNT;
      this.spotDifficulty = isSpotDifficulty(stored.spotDifficulty)
        ? stored.spotDifficulty
        : DEFAULT_SPOT_DIFFICULTY;
      this.spotPuzzle = stored.spotPuzzle ?? null;
      this.spotSharedFound = Array.isArray(stored.spotSharedFound) ? stored.spotSharedFound : [];
      this.spotWinners = Array.isArray(stored.spotWinners) ? stored.spotWinners : [];
      this.spotHintDiffId = stored.spotHintDiffId ?? null;
      this.spotHintUntil = stored.spotHintUntil ?? null;
      this.spotHintForPlayerId = stored.spotHintForPlayerId ?? null;
      this.spotItMode = isSpotItMode(stored.spotItMode) ? stored.spotItMode : DEFAULT_SPOT_IT_MODE;
      this.spotItTarget = isSpotItTarget(stored.spotItTarget)
        ? stored.spotItTarget
        : DEFAULT_SPOT_IT_TARGET;
      this.spotItPack = isSpotItPackId(stored.spotItPack) ? stored.spotItPack : DEFAULT_SPOT_IT_PACK;
      this.spotItCardA = stored.spotItCardA ?? null;
      this.spotItCardB = stored.spotItCardB ?? null;
      this.spotItCenter = stored.spotItCenter ?? null;
      this.spotItHands = new Map(
        stored.spotItHands && typeof stored.spotItHands === "object"
          ? Object.entries(stored.spotItHands)
          : [],
      );
      this.spotItMatchSymbol =
        typeof stored.spotItMatchSymbol === "number" ? stored.spotItMatchSymbol : null;
      this.spotItUsedCards = Array.isArray(stored.spotItUsedCards) ? stored.spotItUsedCards : [];
      this.spotItPile = Array.isArray(stored.spotItPile) ? stored.spotItPile : [];
      this.spotItTowerOrder = Array.isArray(stored.spotItTowerOrder) ? stored.spotItTowerOrder : [];
      this.spotItLastScorerId = stored.spotItLastScorerId ?? null;
      this.spotItLastScorerName = stored.spotItLastScorerName ?? null;
      this.spotItWinners = Array.isArray(stored.spotItWinners) ? stored.spotItWinners : [];
      this.spotItQuizSymbolIndex =
        typeof stored.spotItQuizSymbolIndex === "number" ? stored.spotItQuizSymbolIndex : null;
      this.spotItQuizChoices = Array.isArray(stored.spotItQuizChoices)
        ? stored.spotItQuizChoices
        : null;
      this.spotItQuizKana = stored.spotItQuizKana ?? null;
      this.spotItQuizReading = Array.isArray(stored.spotItQuizReading)
        ? stored.spotItQuizReading
        : null;
      this.spotItLastMatchKana = stored.spotItLastMatchKana ?? null;
      this.spotItLastMatchReading = Array.isArray(stored.spotItLastMatchReading)
        ? stored.spotItLastMatchReading
        : null;
      this.spotItLastMatchEnglish = stored.spotItLastMatchEnglish ?? null;
      this.wheelRoundCount = isWheelRoundCount(stored.wheelRoundCount)
        ? stored.wheelRoundCount
        : DEFAULT_WHEEL_ROUNDS;
      this.wheelRoundIndex = typeof stored.wheelRoundIndex === "number" ? stored.wheelRoundIndex : 0;
      this.wheelTurnPhase = stored.wheelTurnPhase ?? null;
      this.wheelCurrentPlayerId = stored.wheelCurrentPlayerId ?? null;
      this.wheelPuzzle = stored.wheelPuzzle ?? null;
      this.wheelRevealed = new Set(
        Array.isArray(stored.wheelRevealed)
          ? stored.wheelRevealed.filter((ch) => typeof ch === "string")
          : [],
      );
      this.wheelUsedLetters = Array.isArray(stored.wheelUsedLetters)
        ? stored.wheelUsedLetters.filter((ch) => typeof ch === "string")
        : [];
      this.wheelUsedPuzzleIds = Array.isArray(stored.wheelUsedPuzzleIds)
        ? stored.wheelUsedPuzzleIds.filter((id) => typeof id === "string")
        : [];
      this.wheelLastSpin = stored.wheelLastSpin ?? null;
      this.wheelPendingCash =
        typeof stored.wheelPendingCash === "number" ? stored.wheelPendingCash : null;
      this.wheelLastSolverId = stored.wheelLastSolverId ?? null;
      this.wheelLastSolverName = stored.wheelLastSolverName ?? null;
      this.wheelWinners = Array.isArray(stored.wheelWinners) ? stored.wheelWinners : [];
      this.wheelJackpot = typeof stored.wheelJackpot === "number" ? stored.wheelJackpot : 0;
      this.wheelGuessEndsAt =
        typeof stored.wheelGuessEndsAt === "number"
          ? stored.wheelGuessEndsAt
          : typeof stored.wheelSpeedEndsAt === "number"
            ? stored.wheelSpeedEndsAt
            : null;
      this.wheelVowelFree = Boolean(stored.wheelVowelFree);
      this.wheelLastOutcome = stored.wheelLastOutcome ?? null;
      this.wheelLastOutcomePlayerName = stored.wheelLastOutcomePlayerName ?? null;
      this.trivia.loadPersisted(stored.trivia);
      this.players = new Map(
        stored.players.map((p) => [
          p.id,
          {
            id: p.id,
            name: p.name,
            isHost: p.isHost,
            words: loadWords(p.words),
            roundAwards: p.roundAwards ?? [],
            answers: padAnswers(p.answers, this.playMode),
            hostRejected:
              this.playMode === "hunt"
                ? padHuntRejected(p.hostRejected, padAnswers(p.answers, "hunt").length)
                : padRejected(p.hostRejected),
            findMarks: padFindMarks(p.findMarks, padAnswers(p.answers, this.playMode).length),
            orbs: loadOrbs(p.orbs),
            mmmmsReady: Boolean(p.mmmmsReady),
            foundDiffIds: Array.isArray(p.foundDiffIds) ? p.foundDiffIds.filter((id) => typeof id === "string") : [],
            spotItScore: typeof p.spotItScore === "number" ? p.spotItScore : 0,
            missStreak: typeof p.missStreak === "number" ? p.missStreak : 0,
            lockedUntil: typeof p.lockedUntil === "number" ? p.lockedUntil : null,
            wheelRoundBank: typeof p.wheelRoundBank === "number" ? p.wheelRoundBank : 0,
            wheelTotalScore: typeof p.wheelTotalScore === "number" ? p.wheelTotalScore : 0,
            wheelFreeSpins: typeof p.wheelFreeSpins === "number" ? p.wheelFreeSpins : 0,
            wheelInsurance: Boolean(p.wheelInsurance),
          },
        ]),
      );
    }
    this.loaded = true;
  }

  private async persist(): Promise<void> {
    await this.ctx.storage.put("room", {
      gameType: this.gameType,
      code: this.code,
      phase: this.phase,
      boardSize: this.boardSize,
      roundSeconds: this.roundSeconds,
      board: this.board,
      countdownEndsAt: this.countdownEndsAt,
      endsAt: this.endsAt,
      round: this.round,
      globalAcceptCount: this.globalAcceptCount,
      lastAccept: this.lastAccept,
      scoresFinalized: this.scoresFinalized,
      missedWords: this.missedWords,
      possibleWords: this.possibleWords,
      possibleWordCount: this.possibleWordCount,
      possibleByLength: this.possibleByLength,
      playMode: this.playMode,
      packTier: this.packTier,
      letter: this.letter,
      categories: this.categories,
      listId: this.listId,
      usedListIds: this.usedListIds,
      huntPackId: this.huntPackId,
      sceneId: this.sceneId,
      sceneTitle: this.sceneTitle,
      sceneImageUrl: this.sceneImageUrl,
      usedSceneIds: this.usedSceneIds,
      rollerId: this.rollerId,
      rollerName: this.rollerName,
      reviewIndex: this.reviewIndex,
      reviewBallots: serializeReviewBallots(this.reviewBallots),
      rollEndsAt: this.rollEndsAt,
      emptyGraceEndsAt: this.emptyGraceEndsAt,
      orbCount: this.orbCount,
      attackerId: this.attackerId,
      defenderId: this.defenderId,
      defenderGuess: this.defenderGuess,
      lastAttack: this.lastAttack,
      winnerId: this.winnerId,
      resolveAcks: [...this.resolveAcks],
      resolveEndsAt: this.resolveEndsAt,
      spotMode: this.spotMode,
      spotDiffCount: this.spotDiffCount,
      spotDifficulty: this.spotDifficulty,
      spotPuzzle: this.spotPuzzle,
      spotSharedFound: this.spotSharedFound,
      spotWinners: this.spotWinners,
      spotHintDiffId: this.spotHintDiffId,
      spotHintUntil: this.spotHintUntil,
      spotHintForPlayerId: this.spotHintForPlayerId,
      spotItMode: this.spotItMode,
      spotItTarget: this.spotItTarget,
      spotItPack: this.spotItPack,
      spotItCardA: this.spotItCardA,
      spotItCardB: this.spotItCardB,
      spotItCenter: this.spotItCenter,
      spotItHands: Object.fromEntries(this.spotItHands.entries()),
      spotItMatchSymbol: this.spotItMatchSymbol,
      spotItUsedCards: this.spotItUsedCards,
      spotItPile: this.spotItPile,
      spotItTowerOrder: this.spotItTowerOrder,
      spotItLastScorerId: this.spotItLastScorerId,
      spotItLastScorerName: this.spotItLastScorerName,
      spotItWinners: this.spotItWinners,
      spotItQuizSymbolIndex: this.spotItQuizSymbolIndex,
      spotItQuizChoices: this.spotItQuizChoices,
      spotItQuizKana: this.spotItQuizKana,
      spotItQuizReading: this.spotItQuizReading,
      spotItLastMatchKana: this.spotItLastMatchKana,
      spotItLastMatchReading: this.spotItLastMatchReading,
      spotItLastMatchEnglish: this.spotItLastMatchEnglish,
      wheelRoundCount: this.wheelRoundCount,
      wheelRoundIndex: this.wheelRoundIndex,
      wheelTurnPhase: this.wheelTurnPhase,
      wheelCurrentPlayerId: this.wheelCurrentPlayerId,
      wheelPuzzle: this.wheelPuzzle,
      wheelRevealed: [...this.wheelRevealed],
      wheelUsedLetters: this.wheelUsedLetters,
      wheelUsedPuzzleIds: this.wheelUsedPuzzleIds,
      wheelLastSpin: this.wheelLastSpin,
      wheelPendingCash: this.wheelPendingCash,
      wheelLastSolverId: this.wheelLastSolverId,
      wheelLastSolverName: this.wheelLastSolverName,
      wheelWinners: this.wheelWinners,
      wheelJackpot: this.wheelJackpot,
      wheelGuessEndsAt: this.wheelGuessEndsAt,
      wheelVowelFree: this.wheelVowelFree,
      wheelLastOutcome: this.wheelLastOutcome,
      wheelLastOutcomePlayerName: this.wheelLastOutcomePlayerName,
      trivia: this.trivia.toPersisted(),
      players: [...this.players.values()].map((p) => ({
        id: p.id,
        name: p.name,
        isHost: p.isHost,
        words: [...p.words.values()],
        roundAwards: p.roundAwards,
        answers: p.answers,
        hostRejected: p.hostRejected,
        findMarks: p.findMarks,
        orbs: p.orbs,
        mmmmsReady: p.mmmmsReady,
        foundDiffIds: p.foundDiffIds,
        spotItScore: p.spotItScore,
        missStreak: p.missStreak,
        lockedUntil: p.lockedUntil,
        wheelRoundBank: p.wheelRoundBank,
        wheelTotalScore: p.wheelTotalScore,
        wheelFreeSpins: p.wheelFreeSpins,
        wheelInsurance: p.wheelInsurance,
      })),
    });
    await this.syncActiveDirectory();
  }

  private hostName(): string | null {
    for (const p of this.players.values()) {
      if (p.isHost) return p.name;
    }
    const first = this.players.values().next().value as PlayerRecord | undefined;
    return first?.name ?? null;
  }

  private hasPresence(): boolean {
    // Live sockets only — seats left after mid-round disconnect must not keep
    // an empty room in the public directory.
    return this.ctx.getWebSockets().length > 0;
  }

  private async syncActiveDirectory(): Promise<void> {
    if (!this.code) return;
    try {
      if (isJoinablePhase(this.phase) && this.hasPresence()) {
        await upsertActiveRoom(this.env.STATS_DB, {
          code: this.code,
          game: this.gameType,
          phase: this.phase,
          playerCount: this.players.size,
          hostName: this.hostName(),
          updatedAt: Date.now(),
        });
      } else {
        await deleteActiveRoom(this.env.STATS_DB, this.code);
      }
    } catch (err) {
      console.error("syncActiveDirectory failed", err);
    }
  }

  private async scheduleEmptyGrace(): Promise<void> {
    const endsAt = Date.now() + EMPTY_GRACE_MS;
    this.emptyGraceEndsAt = endsAt;
    await this.ctx.storage.setAlarm(endsAt);
    await this.persist();
  }

  private async cancelEmptyGrace(): Promise<void> {
    if (this.emptyGraceEndsAt == null) return;
    this.emptyGraceEndsAt = null;
    await this.restorePhaseAlarm();
    await this.persist();
  }

  private async restorePhaseAlarm(): Promise<void> {
    const candidates: number[] = [];
    if (this.phase === "countdown" && this.countdownEndsAt != null) {
      candidates.push(this.countdownEndsAt);
    }
    if (this.phase === "playing" && this.endsAt != null) {
      candidates.push(this.endsAt);
    }
    if (
      this.phase === "playing" &&
      this.gameType === "wheel" &&
      this.wheelTurnPhase === "spinning" &&
      this.wheelLastSpin != null
    ) {
      candidates.push(this.wheelLastSpin.endsAt);
    }
    if (
      this.phase === "playing" &&
      this.gameType === "wheel" &&
      (this.wheelTurnPhase === "consonant" ||
        this.wheelTurnPhase === "vowel" ||
        this.wheelTurnPhase === "solve") &&
      this.wheelGuessEndsAt != null
    ) {
      candidates.push(this.wheelGuessEndsAt);
    }
    if (this.phase === "rolling" && this.rollEndsAt != null) {
      candidates.push(this.rollEndsAt);
    }
    if (this.phase === "resolving" && this.resolveEndsAt != null) {
      candidates.push(this.resolveEndsAt);
    }
    if (this.phase === "between" && this.countdownEndsAt != null) {
      candidates.push(this.countdownEndsAt);
    }
    if (this.gameType === "trivia" && this.trivia.endsAt != null) {
      candidates.push(this.trivia.endsAt);
    }
    if (candidates.length === 0) {
      await this.ctx.storage.deleteAlarm();
      return;
    }
    const next = Math.min(...candidates);
    if (next <= Date.now()) {
      await this.ctx.storage.setAlarm(Date.now());
      return;
    }
    await this.ctx.storage.setAlarm(next);
  }

  private async destroyRoom(): Promise<void> {
    const code = this.code;
    try {
      await this.ctx.storage.deleteAlarm();
    } catch {
      /* ignore */
    }
    if (code) {
      try {
        await deleteActiveRoom(this.env.STATS_DB, code);
      } catch (err) {
        console.error("deleteActiveRoom on destroy failed", err);
      }
    }
    for (const socket of this.ctx.getWebSockets()) {
      try {
        socket.close(1000, "Room closed");
      } catch {
        /* ignore */
      }
    }
    await this.ctx.storage.deleteAll();
    this.gameType = "boggle";
    this.code = "";
    this.phase = "lobby";
    this.boardSize = 4;
    this.roundSeconds = DEFAULT_ROUND_SECONDS;
    this.board = null;
    this.countdownEndsAt = null;
    this.endsAt = null;
    this.round = 0;
    this.players = new Map();
    this.globalAcceptCount = 0;
    this.lastAccept = null;
    this.scoresFinalized = false;
    this.missedWords = null;
    this.possibleWords = null;
    this.possibleWordCount = null;
    this.possibleByLength = null;
    this.playMode = DEFAULT_SCATTER_PLAY_MODE;
    this.packTier = "family";
    this.letter = null;
    this.categories = null;
    this.listId = null;
    this.usedListIds = [];
    this.huntPackId = DEFAULT_HUNT_PACK;
    this.sceneId = null;
    this.sceneTitle = null;
    this.sceneImageUrl = null;
    this.usedSceneIds = [];
    this.rollerId = null;
    this.rollerName = null;
    this.reviewIndex = null;
    this.reviewBallots = emptyReviewBallots();
    this.rollEndsAt = null;
    this.emptyGraceEndsAt = null;
    this.orbCount = DEFAULT_ORB_COUNT;
    this.attackerId = null;
    this.defenderId = null;
    this.defenderGuess = null;
    this.lastAttack = null;
    this.winnerId = null;
    this.resolveAcks = new Set();
    this.resolveEndsAt = null;
    this.spotMode = DEFAULT_SPOT_MODE;
    this.spotDiffCount = DEFAULT_SPOT_DIFF_COUNT;
    this.spotDifficulty = DEFAULT_SPOT_DIFFICULTY;
    this.spotPuzzle = null;
    this.spotSharedFound = [];
    this.spotWinners = [];
    this.spotHintDiffId = null;
    this.spotHintUntil = null;
    this.spotHintForPlayerId = null;
    this.resetSpotItFields();
    this.spotItMode = DEFAULT_SPOT_IT_MODE;
    this.spotItTarget = DEFAULT_SPOT_IT_TARGET;
    this.spotItPack = DEFAULT_SPOT_IT_PACK;
    this.resetWheelFields();
    this.wheelRoundCount = DEFAULT_WHEEL_ROUNDS;
    this.trivia = new TriviaController();
    this.loaded = true;
  }

  /** Clear per-game Chaos Wheel state (keeps roundCount). */
  private resetWheelFields(): void {
    this.wheelRoundIndex = 0;
    this.wheelTurnPhase = null;
    this.wheelCurrentPlayerId = null;
    this.wheelPuzzle = null;
    this.wheelRevealed = new Set();
    this.wheelUsedLetters = [];
    this.wheelUsedPuzzleIds = [];
    this.wheelLastSpin = null;
    this.wheelPendingCash = null;
    this.wheelLastSolverId = null;
    this.wheelLastSolverName = null;
    this.wheelWinners = [];
    this.wheelJackpot = 0;
    this.wheelGuessEndsAt = null;
    this.wheelVowelFree = false;
    this.wheelLastOutcome = null;
    this.wheelLastOutcomePlayerName = null;
  }

  /** Clear per-game Spot It state (keeps mode / target / pack). */
  private resetSpotItFields(): void {
    this.spotItCardA = null;
    this.spotItCardB = null;
    this.spotItCenter = null;
    this.spotItHands = new Map();
    this.spotItMatchSymbol = null;
    this.spotItUsedCards = [];
    this.spotItPile = [];
    this.spotItTowerOrder = [];
    this.spotItLastScorerId = null;
    this.spotItLastScorerName = null;
    this.spotItWinners = [];
    this.clearSpotItQuizFields();
    this.clearSpotItBetweenTeach();
  }

  private clearSpotItQuizFields(): void {
    this.spotItQuizSymbolIndex = null;
    this.spotItQuizChoices = null;
    this.spotItQuizKana = null;
    this.spotItQuizReading = null;
  }

  private clearSpotItBetweenTeach(): void {
    this.spotItLastMatchKana = null;
    this.spotItLastMatchReading = null;
    this.spotItLastMatchEnglish = null;
  }

  private syncSpotItPackForMode(mode: SpotItMode): void {
    if (mode === "learning") {
      if (!isKanaPack(this.spotItPack)) this.spotItPack = DEFAULT_KANA_PACK;
    } else if (isKanaPack(this.spotItPack)) {
      this.spotItPack = DEFAULT_SPOT_IT_PACK;
    }
  }

  async fetch(request: Request): Promise<Response> {
    await this.ensureLoaded();
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname.endsWith("/init")) {
      const body = (await request.json()) as { code?: string; game?: string };
      if (!body.code || !/^[A-Z1-9]{4}$/.test(body.code)) {
        return Response.json({ error: "Invalid code" }, { status: 400 });
      }
      if (!this.code) {
        this.code = body.code;
        this.gameType = isGameType(body.game) ? body.game : "boggle";
        if (this.gameType === "scattergories") {
          this.roundSeconds = DEFAULT_SCATTER_ROUND_SECONDS;
        } else if (this.gameType === "mmmms") {
          this.orbCount = DEFAULT_ORB_COUNT;
        } else if (this.gameType === "spotdiff") {
          this.roundSeconds = DEFAULT_SPOT_ROUND_SECONDS;
          this.spotMode = DEFAULT_SPOT_MODE;
          this.spotDiffCount = DEFAULT_SPOT_DIFF_COUNT;
          this.spotDifficulty = DEFAULT_SPOT_DIFFICULTY;
        } else if (this.gameType === "spot-it") {
          this.spotItMode = DEFAULT_SPOT_IT_MODE;
          this.spotItTarget = DEFAULT_SPOT_IT_TARGET;
          this.spotItPack = DEFAULT_SPOT_IT_PACK;
        } else if (this.gameType === "wheel") {
          this.wheelRoundCount = DEFAULT_WHEEL_ROUNDS;
        } else if (this.gameType === "trivia") {
          this.trivia = new TriviaController();
          this.trivia.packId = DEFAULT_TRIVIA_PACK;
          this.trivia.chaosMode = DEFAULT_TRIVIA_CHAOS_MODE;
        }
        await this.persist();
        return Response.json({ code: this.code, game: this.gameType, created: true });
      }
      return Response.json({ error: "taken", code: this.code }, { status: 409 });
    }

    if (request.headers.get("Upgrade") !== "websocket") {
      return Response.json({ error: "Expected WebSocket" }, { status: 426 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);
    // Accept first so presence is live before canceling empty-grace teardown.
    if (this.emptyGraceEndsAt != null) {
      await this.cancelEmptyGrace();
    } else if (this.code) {
      await this.syncActiveDirectory();
    }
    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
    await this.ensureLoaded();
    let msg: ClientMessage;
    try {
      msg = JSON.parse(typeof message === "string" ? message : new TextDecoder().decode(message)) as ClientMessage;
    } catch {
      this.send(ws, { type: "error", message: "Invalid message" });
      return;
    }

    const attachment = ws.deserializeAttachment() as Attachment | null;

    switch (msg.type) {
      case "join":
        await this.handleJoin(ws, msg.name, "resumeId" in msg ? msg.resumeId : undefined);
        break;
      case "spectate":
        await this.handleSpectate(ws);
        break;
      case "setBoardSize":
        if (this.gameType !== "boggle") break;
        await this.handleSetBoardSize(attachment?.playerId, msg.boardSize);
        break;
      case "setPackTier":
        if (this.gameType !== "scattergories") break;
        await this.handleSetPackTier(attachment?.playerId, msg.packTier);
        break;
      case "setPlayMode":
        if (this.gameType !== "scattergories") break;
        await this.handleSetPlayMode(attachment?.playerId, msg.playMode);
        break;
      case "setHuntPack":
        if (this.gameType !== "scattergories") break;
        await this.handleSetHuntPack(attachment?.playerId, msg.packId);
        break;
      case "setRoundSeconds":
        await this.handleSetRoundSeconds(attachment?.playerId, msg.roundSeconds);
        break;
      case "start":
        await this.handleStart(attachment?.playerId);
        break;
      case "diePose":
        if (this.gameType !== "scattergories") break;
        this.handleDiePose(attachment?.playerId, msg.qx, msg.qy, msg.qz, msg.qw);
        break;
      case "submitLetterRoll":
        if (this.gameType !== "scattergories") break;
        await this.handleSubmitLetterRoll(attachment?.playerId, msg.letter);
        break;
      case "submitWord":
        if (this.gameType !== "boggle") break;
        await this.handleSubmit(ws, attachment?.playerId, msg.path);
        break;
      case "submitAnswers":
        if (this.gameType !== "scattergories") break;
        await this.handleSubmitAnswers(attachment?.playerId, msg.answers);
        break;
      case "submitHuntFind":
        if (this.gameType !== "scattergories") break;
        await this.handleSubmitHuntFind(
          ws,
          attachment?.playerId,
          msg.word,
          msg.x,
          msg.y,
        );
        break;
      case "reviewNext":
        if (this.gameType !== "scattergories") break;
        await this.handleReviewNext(attachment?.playerId);
        break;
      case "reviewPrev":
        if (this.gameType !== "scattergories") break;
        await this.handleReviewPrev(attachment?.playerId);
        break;
      case "submitReviewVotes":
        if (this.gameType !== "scattergories") break;
        await this.handleSubmitReviewVotes(attachment?.playerId, msg.votes);
        break;
      case "skipReviewVoter":
        if (this.gameType !== "scattergories") break;
        await this.handleSkipReviewVoter(attachment?.playerId, msg.voterId);
        break;
      case "finishReview":
        if (this.gameType !== "scattergories") break;
        await this.handleFinishReview(attachment?.playerId);
        break;
      case "playAgain":
        await this.handlePlayAgain(attachment?.playerId);
        break;
      case "setOrbCount":
        if (this.gameType !== "mmmms") break;
        await this.handleSetOrbCount(attachment?.playerId, msg.orbCount);
        break;
      case "reorder":
        if (this.gameType !== "mmmms") break;
        await this.handleMmmmsReorder(attachment?.playerId, msg.orbs);
        break;
      case "submitOrder":
        if (this.gameType !== "mmmms") break;
        await this.handleMmmmsSubmitOrder(attachment?.playerId);
        break;
      case "guessColor":
        if (this.gameType !== "mmmms") break;
        await this.handleMmmmsGuess(attachment?.playerId, msg.color);
        break;
      case "attackColor":
        if (this.gameType !== "mmmms") break;
        await this.handleMmmmsAttack(attachment?.playerId, msg.color);
        break;
      case "resolveDone":
        if (this.gameType !== "mmmms") break;
        await this.handleMmmmsResolveDone(attachment?.playerId);
        break;
      case "setSpotMode":
        if (this.gameType !== "spotdiff") break;
        await this.handleSetSpotMode(attachment?.playerId, msg.spotMode);
        break;
      case "setSpotTimer":
        if (this.gameType !== "spotdiff") break;
        await this.handleSetSpotTimer(attachment?.playerId, msg.roundSeconds);
        break;
      case "setSpotDiffCount":
        if (this.gameType !== "spotdiff") break;
        await this.handleSetSpotDiffCount(attachment?.playerId, msg.diffCount);
        break;
      case "setSpotDifficulty":
        if (this.gameType !== "spotdiff") break;
        await this.handleSetSpotDifficulty(attachment?.playerId, msg.difficulty);
        break;
      case "tapDiff":
        if (this.gameType !== "spotdiff") break;
        await this.handleTapDiff(ws, attachment?.playerId, msg.x, msg.y);
        break;
      case "requestHint":
        if (this.gameType !== "spotdiff") break;
        await this.handleRequestHint(attachment?.playerId);
        break;
      case "setSpotItMode":
        if (this.gameType !== "spot-it") break;
        await this.handleSetSpotItMode(attachment?.playerId, msg.spotItMode);
        break;
      case "setSpotItTarget":
        if (this.gameType !== "spot-it") break;
        await this.handleSetSpotItTarget(attachment?.playerId, msg.targetScore);
        break;
      case "setSpotItPack":
        if (this.gameType !== "spot-it") break;
        await this.handleSetSpotItPack(attachment?.playerId, msg.packId);
        break;
      case "tapSymbol":
        if (this.gameType !== "spot-it") break;
        await this.handleTapSpotItSymbol(ws, attachment?.playerId, msg.symbolIndex);
        break;
      case "tapQuizChoice":
        if (this.gameType !== "spot-it") break;
        await this.handleTapSpotItQuizChoice(ws, attachment?.playerId, msg.english);
        break;
      case "setWheelRounds":
        if (this.gameType !== "wheel") break;
        await this.handleSetWheelRounds(attachment?.playerId, msg.roundCount);
        break;
      case "spin":
        if (this.gameType !== "wheel") break;
        await this.handleWheelSpin(attachment?.playerId);
        break;
      case "guessLetter":
        if (this.gameType !== "wheel") break;
        await this.handleWheelGuessLetter(attachment?.playerId, msg.letter);
        break;
      case "buyVowel":
        if (this.gameType !== "wheel") break;
        await this.handleWheelBuyVowel(attachment?.playerId);
        break;
      case "chooseSolve":
        if (this.gameType !== "wheel") break;
        await this.handleWheelChooseSolve(attachment?.playerId);
        break;
      case "solve":
        if (this.gameType !== "wheel") break;
        await this.handleWheelSolve(attachment?.playerId, msg.guess);
        break;
      case "setTriviaPack":
        if (this.gameType !== "trivia") break;
        await this.handleSetTriviaPack(attachment?.playerId, msg.packId);
        break;
      case "setTriviaChaosMode":
        if (this.gameType !== "trivia") break;
        await this.handleSetTriviaChaosMode(attachment?.playerId, msg.mode);
        break;
      case "pickCell":
        if (this.gameType !== "trivia") break;
        await this.handleTriviaPickCell(attachment?.playerId, msg.categoryIndex, msg.tier);
        break;
      case "buzz":
        if (this.gameType !== "trivia") break;
        await this.handleTriviaBuzz(attachment?.playerId);
        break;
      case "answer":
        if (this.gameType !== "trivia") break;
        await this.handleTriviaAnswer(attachment?.playerId, msg.choiceIndex);
        break;
      case "setDailyWager":
        if (this.gameType !== "trivia") break;
        await this.handleTriviaDailyWager(attachment?.playerId, msg.amount);
        break;
      case "setFinalWager":
        if (this.gameType !== "trivia") break;
        await this.handleTriviaFinalWager(attachment?.playerId, msg.amount);
        break;
      case "finalAnswer":
        if (this.gameType !== "trivia") break;
        await this.handleTriviaFinalAnswer(attachment?.playerId, msg.choiceIndex);
        break;
      case "solveChaos":
        if (this.gameType !== "trivia") break;
        await this.handleTriviaSolveChaos(attachment?.playerId, msg.choiceIndex);
        break;
      case "useChaos":
        if (this.gameType !== "trivia") break;
        await this.handleTriviaUseChaos(attachment?.playerId, msg.power, msg.targetPlayerId);
        break;
      case "cheer":
        if (this.gameType !== "trivia") break;
        await this.handleTriviaCheer(attachment?.playerId, msg.delta);
        break;
      case "phoneFriendVote":
        if (this.gameType !== "trivia") break;
        await this.handleTriviaPhoneFriendVote(attachment?.playerId, msg.choiceIndex);
        break;
      case "challengeVote":
        if (this.gameType !== "trivia") break;
        await this.handleTriviaChallengeVote(attachment?.playerId, msg.tooEasy);
        break;
      default:
        this.send(ws, { type: "error", message: "Unknown message" });
    }
  }

  async webSocketClose(ws: WebSocket, _code: number, _reason: string, _wasClean: boolean): Promise<void> {
    await this.ensureLoaded();
    const attachment = ws.deserializeAttachment() as Attachment | null;

    if (attachment?.playerId && !attachment.spectator) {
      const player = this.players.get(attachment.playerId);
      if (player && this.phase === "lobby") {
        this.players.delete(attachment.playerId);
        if (player.isHost) {
          const next = this.players.values().next().value as PlayerRecord | undefined;
          if (next) next.isHost = true;
        }
        await this.persist();
        this.broadcastState();
      }
    }

    // Closing socket is already gone from getWebSockets(); schedule teardown if empty.
    if (this.ctx.getWebSockets().length === 0 && this.code) {
      await this.scheduleEmptyGrace();
    }
  }

  async alarm(): Promise<void> {
    await this.ensureLoaded();
    const now = Date.now();

    if (this.emptyGraceEndsAt != null && now >= this.emptyGraceEndsAt) {
      if (this.ctx.getWebSockets().length === 0) {
        await this.destroyRoom();
        return;
      }
      this.emptyGraceEndsAt = null;
      await this.restorePhaseAlarm();
      await this.persist();
      return;
    }

    if (this.emptyGraceEndsAt != null && now < this.emptyGraceEndsAt) {
      // Spurious / early alarm while grace is pending — reschedule grace.
      await this.ctx.storage.setAlarm(this.emptyGraceEndsAt);
      return;
    }

    if (this.phase === "rolling" && this.gameType === "scattergories") {
      await this.beginScatterCountdown(rollLetter());
      return;
    }

    if (this.phase === "between" && this.gameType === "spot-it") {
      if (this.countdownEndsAt != null && this.countdownEndsAt > now) {
        await this.ctx.storage.setAlarm(this.countdownEndsAt);
        return;
      }
      await this.advanceSpotItRound();
      return;
    }

    if (this.phase === "between" && this.gameType === "wheel") {
      if (this.countdownEndsAt != null && this.countdownEndsAt > now) {
        await this.ctx.storage.setAlarm(this.countdownEndsAt);
        return;
      }
      await this.advanceWheelAfterBetween();
      return;
    }

    if (this.gameType === "trivia" && this.trivia.endsAt != null) {
      if (this.trivia.endsAt > now) {
        await this.ctx.storage.setAlarm(this.trivia.endsAt);
        return;
      }
      const { alarmAt } = this.trivia.onAlarm(now);
      this.phase = this.trivia.phase;
      this.endsAt = this.trivia.endsAt;
      await this.persist();
      this.broadcastState();
      if (alarmAt != null) await this.ctx.storage.setAlarm(alarmAt);
      return;
    }

    if (
      this.phase === "playing" &&
      this.gameType === "wheel" &&
      this.wheelTurnPhase === "spinning" &&
      this.wheelLastSpin != null
    ) {
      if (this.wheelLastSpin.endsAt > now) {
        await this.ctx.storage.setAlarm(this.wheelLastSpin.endsAt);
        return;
      }
      await this.resolveWheelSpin();
      return;
    }

    if (
      this.phase === "playing" &&
      this.gameType === "wheel" &&
      (this.wheelTurnPhase === "consonant" ||
        this.wheelTurnPhase === "vowel" ||
        this.wheelTurnPhase === "solve") &&
      this.wheelGuessEndsAt != null
    ) {
      if (this.wheelGuessEndsAt > now) {
        await this.ctx.storage.setAlarm(this.wheelGuessEndsAt);
        return;
      }
      this.wheelGuessEndsAt = null;
      this.wheelLastOutcome = "guessTimeout";
      const player = this.wheelCurrentPlayerId
        ? this.players.get(this.wheelCurrentPlayerId)
        : undefined;
      this.wheelLastOutcomePlayerName = player?.name ?? null;
      this.consumeFreeSpinOrAdvance(player);
      await this.persist();
      this.broadcastState();
      return;
    }

    if (this.phase === "countdown" && this.countdownEndsAt != null && now >= this.countdownEndsAt) {
      this.phase = "playing";
      this.countdownEndsAt = null;
      this.endsAt = now + this.roundSeconds * 1000;
      await this.ctx.storage.setAlarm(this.endsAt);
      await this.persist();
      this.broadcastState();
      return;
    }

    if (this.phase === "playing" && this.endsAt != null && now >= this.endsAt) {
      this.endsAt = null;
      if (this.gameType === "scattergories") {
        this.phase = "review";
        this.reviewIndex = 0;
        this.reviewBallots = emptyReviewBallots();
        for (const p of this.players.values()) {
          if (this.playMode === "hunt") {
            p.hostRejected = p.answers.map(() => false);
            while (p.findMarks.length < p.answers.length) {
              p.findMarks.push({ x: 0.5, y: 0.5 });
            }
            p.findMarks = p.findMarks.slice(0, p.answers.length);
          } else {
            p.hostRejected = emptyRejected();
          }
        }
        await this.persist();
        this.broadcastState();
        return;
      }
      if (this.gameType === "spotdiff") {
        this.finishSpotdiffRound();
        await this.persist();
        this.broadcastState();
        return;
      }
      this.phase = "results";
      const endBadges = this.finalizeScores();
      await this.recordRoundStats(now);
      await this.persist();
      this.broadcastState();
      for (const bonuses of endBadges) {
        this.broadcastBadgeEvent(bonuses);
      }
      return;
    }

    if (
      this.phase === "resolving" &&
      this.gameType === "mmmms" &&
      this.resolveEndsAt != null &&
      now >= this.resolveEndsAt
    ) {
      await this.advanceMmmmsAfterResolve();
    }
  }

  private async recordRoundStats(completedAt: number): Promise<void> {
    if (this.gameType !== "boggle") return;
    if (!this.code || this.round < 1) return;
    try {
      await insertRoundStats(this.env.STATS_DB, {
        roomCode: this.code,
        round: this.round,
        completedAt,
        players: [...this.players.values()].map((p) => {
          const longest = longestAcceptedWord(p.words.keys());
          return {
            id: p.id,
            name: p.name,
            score: this.bogglePlayerScore(p),
            wordCount: p.words.size,
            longestWord: longest.word,
            longestLen: longest.len,
          };
        }),
      });
    } catch (err) {
      console.error("recordRoundStats failed", err);
    }
  }

  private async handleSpectate(ws: WebSocket): Promise<void> {
    if (!this.code) {
      this.send(ws, { type: "error", message: "Room not ready" });
      return;
    }
    const existing = ws.deserializeAttachment() as Attachment | null;
    if (existing?.playerId && this.players.has(existing.playerId)) {
      this.welcomePlayer(ws, existing.playerId);
      return;
    }
    ws.serializeAttachment({ spectator: true } satisfies Attachment);
    this.send(ws, {
      type: "welcome",
      playerId: "",
      role: "spectator",
      state: this.publicState(),
    } as ServerMessage);
  }

  private async handleJoin(
    ws: WebSocket,
    rawName: string,
    resumeId?: string,
  ): Promise<void> {
    const name = rawName.trim().slice(0, 20);
    if (!name) {
      this.send(ws, { type: "error", message: "Enter a name" });
      return;
    }
    if (!this.code) {
      this.send(ws, { type: "error", message: "Room not ready" });
      return;
    }

    const existing = ws.deserializeAttachment() as Attachment | null;
    if (existing?.playerId && this.players.has(existing.playerId)) {
      this.welcomePlayer(ws, existing.playerId);
      return;
    }

    // Reclaim a prior seat (spectator → player, refresh, second tab).
    if (resumeId && this.players.has(resumeId)) {
      this.takeOverPlayerSeat(ws, resumeId);
      this.welcomePlayer(ws, resumeId);
      return;
    }

    if (this.phase !== "lobby" && this.phase !== "results") {
      this.send(ws, { type: "error", message: "Game already in progress" });
      return;
    }

    if (this.gameType === "mmmms" && this.players.size >= 2) {
      this.send(ws, { type: "error", message: "M&Ms Smash is full (2 players)" });
      return;
    }

    const id = crypto.randomUUID();
    const isHost = this.players.size === 0;
    this.players.set(id, {
      id,
      name,
      isHost,
      words: new Map(),
      roundAwards: [],
      answers:
        this.gameType === "scattergories" && this.playMode === "hunt"
          ? []
          : emptyAnswers(),
      hostRejected: emptyRejected(),
      findMarks: [],
      orbs: [],
      mmmmsReady: false,
      foundDiffIds: [],
      spotItScore: 0,
      missStreak: 0,
      lockedUntil: null,
      wheelRoundBank: 0,
      wheelTotalScore: 0,
      wheelFreeSpins: 0,
      wheelInsurance: false,
    });
    ws.serializeAttachment({ playerId: id } satisfies Attachment);
    await this.persist();
    this.welcomePlayer(ws, id);
    this.broadcastState(ws);
  }

  /** Move a seat onto this socket; demote any other live sockets holding it. */
  private takeOverPlayerSeat(ws: WebSocket, playerId: string): void {
    for (const other of this.ctx.getWebSockets()) {
      if (other === ws) continue;
      const att = other.deserializeAttachment() as Attachment | null;
      if (att?.playerId === playerId && !att.spectator) {
        other.serializeAttachment({ spectator: true } satisfies Attachment);
      }
    }
    ws.serializeAttachment({ playerId } satisfies Attachment);
  }

  private welcomePlayer(ws: WebSocket, playerId: string): void {
    const player = this.players.get(playerId);
    if (!player) return;
    if (this.gameType === "scattergories") {
      this.send(ws, {
        type: "welcome",
        playerId,
        role: "player",
        state: this.publicState(),
        myAnswers: [...player.answers],
        myFindMarks: [...player.findMarks],
      } as ServerMessage);
      this.sendHuntProgress(ws, playerId);
      return;
    }
    if (this.gameType === "mmmms") {
      this.send(ws, {
        type: "welcome",
        playerId,
        role: "player",
        state: this.publicState(),
        myOrbs: [...player.orbs],
      } as ServerMessage);
      return;
    }
    if (this.gameType === "spotdiff") {
      this.send(ws, {
        type: "welcome",
        playerId,
        role: "player",
        state: this.publicState(),
        myFoundDiffIds: [...player.foundDiffIds],
        lockedUntil: player.lockedUntil,
      } as ServerMessage);
      return;
    }
    if (this.gameType === "spot-it") {
      this.send(ws, {
        type: "welcome",
        playerId,
        role: "player",
        state: this.spotItSnapshot(),
        myCard: this.spotItMyCard(playerId),
        lockedUntil: player.lockedUntil,
      } satisfies SpotItServerMessage);
      return;
    }
    if (this.gameType === "wheel") {
      this.send(ws, {
        type: "welcome",
        playerId,
        role: "player",
        state: this.wheelSnapshot(),
      } satisfies WheelServerMessage);
      return;
    }
    if (this.gameType === "trivia") {
      this.trivia.syncSeatsFrom(this.players.values());
      this.send(ws, {
        type: "welcome",
        playerId,
        role: "player",
        state: this.triviaSnapshot(),
      } satisfies TriviaServerMessage);
      return;
    }
    this.send(ws, {
      type: "welcome",
      playerId,
      role: "player",
      state: this.publicState(),
      myWords: [...player.words.values()].map((w) => ({
        word: w.word,
        points: w.points,
        bonuses: w.bonuses,
      })),
    } as ServerMessage);
  }

  private async handleSetBoardSize(playerId: string | undefined, boardSize: BoardSize): Promise<void> {
    if (!playerId || !this.isHost(playerId)) return;
    if (this.phase !== "lobby" && this.phase !== "results") return;
    if (!isBoardSize(boardSize)) return;
    this.boardSize = boardSize;
    await this.persist();
    this.broadcastState();
  }

  private async handleSetPackTier(playerId: string | undefined, packTier: PackTier): Promise<void> {
    if (!playerId || !this.isHost(playerId)) return;
    if (this.phase !== "lobby" && this.phase !== "results") return;
    if (this.playMode === "hunt") return;
    if (!isPackTier(packTier)) return;
    this.packTier = packTier;
    await this.persist();
    this.broadcastState();
  }

  private async handleSetPlayMode(
    playerId: string | undefined,
    playMode: ScatterPlayMode,
  ): Promise<void> {
    if (!playerId || !this.isHost(playerId)) return;
    if (this.phase !== "lobby" && this.phase !== "results") return;
    if (!isScatterPlayMode(playMode)) return;
    this.playMode = playMode;
    if (playMode === "categories") {
      this.sceneId = null;
      this.sceneTitle = null;
      this.sceneImageUrl = null;
    }
    await this.persist();
    this.broadcastState();
  }

  private async handleSetHuntPack(
    playerId: string | undefined,
    packId: string,
  ): Promise<void> {
    if (!playerId || !this.isHost(playerId)) return;
    if (this.phase !== "lobby" && this.phase !== "results") return;
    if (this.playMode !== "hunt") return;
    if (!isHuntPackId(packId)) return;
    this.huntPackId = packId;
    await this.persist();
    this.broadcastState();
  }

  private async handleSetRoundSeconds(
    playerId: string | undefined,
    roundSeconds: RoundSeconds | ScatterRoundSeconds,
  ): Promise<void> {
    if (!playerId || !this.isHost(playerId)) return;
    if (this.phase !== "lobby" && this.phase !== "results") return;
    if (this.gameType === "scattergories") {
      if (!isScatterRoundSeconds(roundSeconds)) return;
    } else if (!isRoundSeconds(roundSeconds)) {
      return;
    }
    this.roundSeconds = roundSeconds;
    await this.persist();
    this.broadcastState();
  }

  private async handleStart(playerId: string | undefined): Promise<void> {
    if (!playerId || !this.isHost(playerId)) return;
    if (this.phase !== "lobby" && this.phase !== "results") return;
    if (this.gameType === "mmmms") {
      if (this.players.size !== 2) return;
    } else if (this.gameType === "wheel" || this.gameType === "trivia") {
      if (this.players.size < 2) return;
    } else if (this.players.size < 1) {
      return;
    }

    for (const p of this.players.values()) {
      p.words = new Map();
      p.roundAwards = [];
      p.answers = this.gameType === "scattergories" && this.playMode === "hunt" ? [] : emptyAnswers();
      p.hostRejected = emptyRejected();
      p.findMarks = [];
      p.orbs = [];
      p.mmmmsReady = false;
      p.foundDiffIds = [];
      p.spotItScore = 0;
      p.missStreak = 0;
      p.lockedUntil = null;
      p.wheelRoundBank = 0;
      p.wheelTotalScore = 0;
      p.wheelFreeSpins = 0;
      p.wheelInsurance = false;
    }
    this.reviewBallots = emptyReviewBallots();
    this.resetSpotItFields();
    this.resetWheelFields();

    this.round += 1;
    this.endsAt = null;
    this.scoresFinalized = false;
    this.reviewIndex = null;
    this.winnerId = null;
    this.lastAttack = null;
    this.defenderGuess = null;
    this.resolveAcks = new Set();
    this.resolveEndsAt = null;
    this.spotSharedFound = [];
    this.spotWinners = [];
    this.spotHintDiffId = null;
    this.spotHintUntil = null;
    this.spotHintForPlayerId = null;

    if (this.gameType === "spot-it") {
      this.board = null;
      this.missedWords = null;
      this.possibleWords = null;
      this.possibleWordCount = null;
      this.possibleByLength = null;
      this.letter = null;
      this.categories = null;
      this.listId = null;
      this.sceneId = null;
      this.sceneTitle = null;
      this.sceneImageUrl = null;
      this.rollerId = null;
      this.rollerName = null;
      this.spotPuzzle = null;
      this.countdownEndsAt = null;
      this.endsAt = null;
      this.syncSpotItPackForMode(this.spotItMode);
      const seed = randomSeed();
      try {
        if (this.spotItMode === "shared" || this.spotItMode === "learning") {
          const used = new Set<number>();
          const deal = dealSharedPair(seed, used);
          this.spotItCardA = deal.cardA;
          this.spotItCardB = deal.cardB;
          this.spotItMatchSymbol = deal.matchSymbolIndex;
          this.spotItUsedCards = [...used];
        } else {
          const deal = dealTowerStart(seed, [...this.players.keys()]);
          this.applyTowerDeal(deal);
        }
      } catch (err) {
        console.error("spot-it deal failed", err);
        this.resetSpotItFields();
        this.round -= 1;
        return;
      }
      this.phase = "playing";
      await this.ctx.storage.deleteAlarm();
      await this.persist();
      this.broadcastState();
      return;
    }

    if (this.gameType === "wheel") {
      this.board = null;
      this.missedWords = null;
      this.possibleWords = null;
      this.possibleWordCount = null;
      this.possibleByLength = null;
      this.letter = null;
      this.categories = null;
      this.listId = null;
      this.sceneId = null;
      this.sceneTitle = null;
      this.sceneImageUrl = null;
      this.rollerId = null;
      this.rollerName = null;
      this.spotPuzzle = null;
      this.countdownEndsAt = null;
      this.endsAt = null;
      this.beginWheelRound(0);
      this.phase = "playing";
      await this.ctx.storage.deleteAlarm();
      await this.persist();
      this.broadcastState();
      return;
    }

    if (this.gameType === "trivia") {
      this.board = null;
      this.missedWords = null;
      this.possibleWords = null;
      this.possibleWordCount = null;
      this.possibleByLength = null;
      this.letter = null;
      this.categories = null;
      this.listId = null;
      this.sceneId = null;
      this.sceneTitle = null;
      this.sceneImageUrl = null;
      this.rollerId = null;
      this.rollerName = null;
      this.spotPuzzle = null;
      this.countdownEndsAt = null;
      this.endsAt = null;
      this.trivia.syncSeatsFrom(this.players.values());
      const started = this.trivia.start([...this.players.keys()]);
      if (!started.ok) {
        this.round -= 1;
        return;
      }
      this.phase = this.trivia.phase;
      await this.ctx.storage.deleteAlarm();
      await this.persist();
      this.broadcastState();
      return;
    }

    if (this.gameType === "spotdiff") {
      this.board = null;
      this.missedWords = null;
      this.possibleWords = null;
      this.possibleWordCount = null;
      this.possibleByLength = null;
      this.letter = null;
      this.categories = null;
      this.listId = null;
      this.sceneId = null;
      this.sceneTitle = null;
      this.sceneImageUrl = null;
      this.rollerId = null;
      this.rollerName = null;
      this.spotPuzzle = generatePuzzle({
        diffCount: this.spotDiffCount,
        difficulty: this.spotDifficulty,
      });
      this.countdownEndsAt = Date.now() + SPOT_COUNTDOWN_MS;
      this.phase = "countdown";
      await this.ctx.storage.setAlarm(this.countdownEndsAt);
      await this.persist();
      this.broadcastState();
      return;
    }

    if (this.gameType === "mmmms") {
      this.board = null;
      this.missedWords = null;
      this.possibleWords = null;
      this.possibleWordCount = null;
      this.possibleByLength = null;
      this.letter = null;
      this.categories = null;
      this.listId = null;
      this.sceneId = null;
      this.sceneTitle = null;
      this.sceneImageUrl = null;
      this.countdownEndsAt = null;
      this.rollerId = null;
      this.rollerName = null;
      for (const p of this.players.values()) {
        p.orbs = dealOrbs(this.orbCount);
        p.mmmmsReady = false;
      }
      const ids = [...this.players.keys()];
      const pick = crypto.getRandomValues(new Uint8Array(1))[0]! % ids.length;
      this.attackerId = ids[pick]!;
      this.defenderId = ids.find((id) => id !== this.attackerId) ?? null;
      this.phase = "organize";
      await this.ctx.storage.deleteAlarm();
      await this.persist();
      this.broadcastState();
      return;
    }

    if (this.gameType === "scattergories") {
      this.board = null;
      this.missedWords = null;
      this.possibleWords = null;
      this.possibleWordCount = null;
      this.possibleByLength = null;
      this.letter = null;
      this.categories = null;
      this.listId = null;
      this.sceneId = null;
      this.sceneTitle = null;
      this.sceneImageUrl = null;
      this.countdownEndsAt = null;

      const ids = [...this.players.keys()];
      const pick = crypto.getRandomValues(new Uint8Array(1))[0]! % ids.length;
      const roller = this.players.get(ids[pick]!)!;
      this.rollerId = roller.id;
      this.rollerName = roller.name;
      this.phase = "rolling";
      this.rollEndsAt = Date.now() + SCATTER_ROLL_TIMEOUT_MS;
      await this.ctx.storage.setAlarm(this.rollEndsAt);
      await this.persist();
      this.broadcastState();
      return;
    }

    this.board = generateBoard(this.boardSize);
    this.globalAcceptCount = 0;
    this.lastAccept = null;
    this.missedWords = null;
    this.possibleWords = null;
    this.possibleWordCount = null;
    this.possibleByLength = null;
    this.letter = null;
    this.categories = null;
    this.listId = null;
    this.sceneId = null;
    this.sceneTitle = null;
    this.sceneImageUrl = null;
    this.rollerId = null;
    this.rollerName = null;
    this.countdownEndsAt = Date.now() + COUNTDOWN_MS;
    this.phase = "countdown";
    await this.ctx.storage.setAlarm(this.countdownEndsAt);
    await this.persist();
    this.broadcastState();
  }

  private handleDiePose(
    playerId: string | undefined,
    qx: number,
    qy: number,
    qz: number,
    qw: number,
  ): void {
    if (!playerId || this.phase !== "rolling" || playerId !== this.rollerId) return;
    if (![qx, qy, qz, qw].every((n) => typeof n === "number" && Number.isFinite(n))) return;
    const mag = Math.hypot(qx, qy, qz, qw);
    if (mag < 1e-6) return;
    const payload = JSON.stringify({
      type: "diePose",
      rollerId: playerId,
      qx: qx / mag,
      qy: qy / mag,
      qz: qz / mag,
      qw: qw / mag,
    } satisfies ScatterServerMessage);
    for (const socket of this.ctx.getWebSockets()) {
      try {
        socket.send(payload);
      } catch {
        /* ignore */
      }
    }
  }

  private async handleSubmitLetterRoll(
    playerId: string | undefined,
    letter: string,
  ): Promise<void> {
    if (!playerId || this.phase !== "rolling" || playerId !== this.rollerId) return;
    if (typeof letter !== "string" || !isLetterDie(letter)) return;
    await this.beginScatterCountdown(letter.toUpperCase());
  }

  private async beginScatterCountdown(letter: string): Promise<void> {
    if (this.phase !== "rolling") return;
    this.letter = letter.toUpperCase();
    if (this.playMode === "hunt") {
      const scene = pickSceneFromPack(this.huntPackId, new Set(this.usedSceneIds));
      this.sceneId = scene.id;
      this.sceneTitle = scene.title;
      this.sceneImageUrl = scene.imageUrl;
      this.usedSceneIds = [...this.usedSceneIds, scene.id];
      this.listId = null;
      this.categories = null;
    } else {
      const list = pickList(this.packTier, new Set(this.usedListIds));
      this.listId = list.id;
      this.categories = list.categories;
      this.usedListIds = [...this.usedListIds, list.id];
      this.sceneId = null;
      this.sceneTitle = null;
      this.sceneImageUrl = null;
    }
    this.rollerId = null;
    this.rollerName = null;
    this.rollEndsAt = null;
    this.countdownEndsAt = Date.now() + SCATTER_COUNTDOWN_MS;
    this.phase = "countdown";
    await this.ctx.storage.setAlarm(this.countdownEndsAt);
    await this.persist();
    this.broadcastState();
  }

  private async handlePlayAgain(playerId: string | undefined): Promise<void> {
    if (!playerId || !this.isHost(playerId)) return;
    if (this.phase !== "results") return;
    this.phase = "lobby";
    this.board = null;
    this.countdownEndsAt = null;
    this.endsAt = null;
    this.globalAcceptCount = 0;
    this.lastAccept = null;
    this.scoresFinalized = false;
    this.missedWords = null;
    this.possibleWords = null;
    this.possibleWordCount = null;
    this.possibleByLength = null;
    this.letter = null;
    this.categories = null;
    this.listId = null;
    this.sceneId = null;
    this.sceneTitle = null;
    this.sceneImageUrl = null;
    this.rollerId = null;
    this.rollerName = null;
    this.reviewIndex = null;
    this.reviewBallots = emptyReviewBallots();
    this.attackerId = null;
    this.defenderId = null;
    this.defenderGuess = null;
    this.lastAttack = null;
    this.winnerId = null;
    this.resolveAcks = new Set();
    this.resolveEndsAt = null;
    this.spotPuzzle = null;
    this.spotSharedFound = [];
    this.spotWinners = [];
    this.spotHintDiffId = null;
    this.spotHintUntil = null;
    this.spotHintForPlayerId = null;
    this.resetSpotItFields();
    this.resetWheelFields();
    if (this.gameType === "trivia") {
      this.trivia.syncSeatsFrom(this.players.values());
      this.trivia.resetLobbyKeepSeats();
    }
    for (const p of this.players.values()) {
      p.words = new Map();
      p.roundAwards = [];
      p.answers = this.gameType === "scattergories" && this.playMode === "hunt" ? [] : emptyAnswers();
      p.hostRejected = emptyRejected();
      p.findMarks = [];
      p.orbs = [];
      p.mmmmsReady = false;
      p.foundDiffIds = [];
      p.spotItScore = 0;
      p.missStreak = 0;
      p.lockedUntil = null;
      p.wheelRoundBank = 0;
      p.wheelTotalScore = 0;
      p.wheelFreeSpins = 0;
      p.wheelInsurance = false;
    }
    await this.ctx.storage.deleteAlarm();
    await this.persist();
    this.broadcastState();
  }

  private async handleSetOrbCount(playerId: string | undefined, orbCount: OrbCount): Promise<void> {
    if (!playerId || !this.isHost(playerId)) return;
    if (this.phase !== "lobby" && this.phase !== "results") return;
    if (!isOrbCount(orbCount)) return;
    this.orbCount = orbCount;
    await this.persist();
    this.broadcastState();
  }

  private async handleSetSpotMode(playerId: string | undefined, spotMode: SpotPlayMode): Promise<void> {
    if (!playerId || !this.isHost(playerId)) return;
    if (this.phase !== "lobby" && this.phase !== "results") return;
    if (!isSpotPlayMode(spotMode)) return;
    this.spotMode = spotMode;
    await this.persist();
    this.broadcastState();
  }

  private async handleSetSpotTimer(
    playerId: string | undefined,
    roundSeconds: SpotRoundSeconds,
  ): Promise<void> {
    if (!playerId || !this.isHost(playerId)) return;
    if (this.phase !== "lobby" && this.phase !== "results") return;
    if (!isSpotRoundSeconds(roundSeconds)) return;
    this.roundSeconds = roundSeconds;
    await this.persist();
    this.broadcastState();
  }

  private async handleSetSpotDiffCount(
    playerId: string | undefined,
    diffCount: SpotDiffCount,
  ): Promise<void> {
    if (!playerId || !this.isHost(playerId)) return;
    if (this.phase !== "lobby" && this.phase !== "results") return;
    if (!isSpotDiffCount(diffCount)) return;
    this.spotDiffCount = diffCount;
    await this.persist();
    this.broadcastState();
  }

  private async handleSetSpotDifficulty(
    playerId: string | undefined,
    difficulty: SpotDifficulty,
  ): Promise<void> {
    if (!playerId || !this.isHost(playerId)) return;
    if (this.phase !== "lobby" && this.phase !== "results") return;
    if (!isSpotDifficulty(difficulty)) return;
    this.spotDifficulty = difficulty;
    await this.persist();
    this.broadcastState();
  }

  private clearExpiredSpotHint(now: number): void {
    if (this.spotHintUntil != null && now >= this.spotHintUntil) {
      this.spotHintDiffId = null;
      this.spotHintUntil = null;
      this.spotHintForPlayerId = null;
    }
  }

  private finishSpotdiffRound(): void {
    this.phase = "results";
    this.endsAt = null;
    this.spotHintDiffId = null;
    this.spotHintUntil = null;
    this.spotHintForPlayerId = null;
    const total = this.spotPuzzle?.differences.length ?? 0;
    if (this.spotMode === "coop") {
      this.spotWinners =
        this.spotSharedFound.length >= total && total > 0
          ? [...this.players.keys()]
          : [];
      return;
    }
    let best = -1;
    const winners: string[] = [];
    for (const p of this.players.values()) {
      const n = p.foundDiffIds.length;
      if (n > best) {
        best = n;
        winners.length = 0;
        winners.push(p.id);
      } else if (n === best && n > 0) {
        winners.push(p.id);
      }
    }
    this.spotWinners = winners;
  }

  private async handleTapDiff(
    ws: WebSocket,
    playerId: string | undefined,
    x: number,
    y: number,
  ): Promise<void> {
    if (!playerId || this.phase !== "playing" || !this.spotPuzzle) return;
    const player = this.players.get(playerId);
    if (!player) return;
    const now = Date.now();
    this.clearExpiredSpotHint(now);
    if (player.lockedUntil != null && now < player.lockedUntil) {
      this.send(ws, {
        type: "tapResult",
        hit: false,
        lockedUntil: player.lockedUntil,
      } satisfies SpotdiffServerMessage);
      return;
    }

    const foundSet =
      this.spotMode === "coop"
        ? new Set(this.spotSharedFound)
        : new Set(player.foundDiffIds);
    const hit = hitDifference(x, y, this.spotPuzzle.differences, foundSet);
    if (!hit) {
      player.missStreak += 1;
      let lockedUntil: number | null = player.lockedUntil;
      if (player.missStreak >= 3) {
        player.missStreak = 0;
        lockedUntil = now + SPOT_MISS_LOCK_MS;
        player.lockedUntil = lockedUntil;
      }
      await this.persist();
      this.send(ws, {
        type: "tapResult",
        hit: false,
        lockedUntil,
      } satisfies SpotdiffServerMessage);
      this.broadcastState();
      return;
    }

    player.missStreak = 0;
    if (this.spotMode === "coop") {
      if (!this.spotSharedFound.includes(hit.id)) {
        this.spotSharedFound = [...this.spotSharedFound, hit.id];
      }
    } else if (!player.foundDiffIds.includes(hit.id)) {
      player.foundDiffIds = [...player.foundDiffIds, hit.id];
    }

    this.send(ws, {
      type: "tapResult",
      hit: true,
      diffId: hit.id,
      lockedUntil: player.lockedUntil,
    } satisfies SpotdiffServerMessage);

    const total = this.spotPuzzle.differences.length;
    const cleared =
      this.spotMode === "coop"
        ? this.spotSharedFound.length >= total
        : player.foundDiffIds.length >= total;

    if (cleared) {
      if (this.spotMode === "race" || this.spotMode === "solo") {
        this.spotWinners = [playerId];
      }
      this.finishSpotdiffRound();
      if (this.spotMode === "race" || this.spotMode === "solo") {
        this.spotWinners = [playerId];
      }
      await this.ctx.storage.deleteAlarm();
      await this.persist();
      this.broadcastState();
      return;
    }

    await this.persist();
    this.broadcastState();
  }

  private async handleRequestHint(playerId: string | undefined): Promise<void> {
    if (!playerId || this.phase !== "playing" || !this.spotPuzzle) return;
    if (!this.players.has(playerId)) return;
    const now = Date.now();
    this.clearExpiredSpotHint(now);
    const foundSet =
      this.spotMode === "coop"
        ? new Set(this.spotSharedFound)
        : new Set(this.players.get(playerId)!.foundDiffIds);
    const remaining = this.spotPuzzle.differences.filter((d) => !foundSet.has(d.id));
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)]!;
    this.spotHintDiffId = pick.id;
    this.spotHintUntil = now + SPOT_HINT_MS;
    this.spotHintForPlayerId = this.spotMode === "coop" ? null : playerId;
    await this.persist();
    this.broadcastState();
  }

  private async handleSetSpotItMode(playerId: string | undefined, mode: SpotItMode): Promise<void> {
    if (!playerId || !this.isHost(playerId)) return;
    if (this.phase !== "lobby") return;
    if (!isSpotItMode(mode)) return;
    this.spotItMode = mode;
    this.syncSpotItPackForMode(mode);
    await this.persist();
    this.broadcastState();
  }

  private async handleSetSpotItTarget(
    playerId: string | undefined,
    target: SpotItTarget,
  ): Promise<void> {
    if (!playerId || !this.isHost(playerId)) return;
    if (this.phase !== "lobby") return;
    if (!isSpotItTarget(target)) return;
    this.spotItTarget = target;
    await this.persist();
    this.broadcastState();
  }

  private async handleSetSpotItPack(playerId: string | undefined, packId: SpotItPackId): Promise<void> {
    if (!playerId || !this.isHost(playerId)) return;
    if (this.phase !== "lobby") return;
    if (!isSpotItPackId(packId)) return;
    if (this.spotItMode === "learning") {
      if (!isKanaPack(packId)) return;
    } else if (isKanaPack(packId)) {
      return;
    }
    this.spotItPack = packId;
    await this.persist();
    this.broadcastState();
  }

  private applyTowerDeal(deal: TowerDeal): void {
    this.spotItCenter = deal.center;
    this.spotItHands = deal.hands;
    this.spotItPile = deal.pile;
    this.spotItTowerOrder = deal.order;
  }

  private currentTowerDeal(): TowerDeal | null {
    if (!this.spotItCenter) return null;
    return {
      mode: "tower",
      center: this.spotItCenter,
      hands: new Map(this.spotItHands),
      pile: [...this.spotItPile],
      order: [...this.spotItTowerOrder],
    };
  }

  private spotItMyCard(playerId: string | null | undefined): SpotItCardView | null {
    if (this.spotItMode !== "tower" || !playerId) return null;
    return this.spotItHands.get(playerId) ?? null;
  }

  private finishSpotIt(winners: string[]): void {
    this.phase = "results";
    this.countdownEndsAt = null;
    this.endsAt = null;
    this.spotItWinners = winners;
    this.clearSpotItQuizFields();
  }

  private finishSpotItByHighScore(): void {
    let best = -1;
    const winners: string[] = [];
    for (const p of this.players.values()) {
      if (p.spotItScore > best) {
        best = p.spotItScore;
        winners.length = 0;
        winners.push(p.id);
      } else if (p.spotItScore === best) {
        winners.push(p.id);
      }
    }
    this.finishSpotIt(winners);
  }

  private enterSpotItQuiz(symbolIndex: number): void {
    const pack = getSpotItPack(this.spotItPack);
    const meta = pack.symbols[symbolIndex];
    this.spotItQuizSymbolIndex = symbolIndex;
    this.spotItQuizKana = meta?.kana ?? null;
    this.spotItQuizReading = meta?.reading ? [...meta.reading] : null;
    this.spotItQuizChoices = buildQuizChoices(this.spotItPack, symbolIndex, randomSeed());
    this.clearSpotItBetweenTeach();
    this.phase = "quiz";
    this.countdownEndsAt = null;
  }

  private async advanceSpotItRound(): Promise<void> {
    this.countdownEndsAt = null;
    this.clearSpotItQuizFields();
    this.clearSpotItBetweenTeach();
    const seed = randomSeed();
    if (this.spotItMode === "shared" || this.spotItMode === "learning") {
      try {
        const used = new Set(this.spotItUsedCards);
        const deal = dealSharedPair(seed, used);
        this.spotItCardA = deal.cardA;
        this.spotItCardB = deal.cardB;
        this.spotItMatchSymbol = deal.matchSymbolIndex;
        this.spotItUsedCards = [...used];
      } catch (err) {
        console.error("spot-it advance failed", err);
        this.finishSpotItByHighScore();
        await this.ctx.storage.deleteAlarm();
        await this.persist();
        this.broadcastState();
        return;
      }
    } else {
      const current = this.currentTowerDeal();
      const next =
        current && this.spotItLastScorerId
          ? advanceTowerAfterScore(current, this.spotItLastScorerId, seed)
          : null;
      if (!next) {
        this.finishSpotItByHighScore();
        await this.ctx.storage.deleteAlarm();
        await this.persist();
        this.broadcastState();
        return;
      }
      this.applyTowerDeal(next);
    }
    this.phase = "playing";
    await this.ctx.storage.deleteAlarm();
    await this.persist();
    this.broadcastState();
  }

  private async handleTapSpotItSymbol(
    ws: WebSocket,
    playerId: string | undefined,
    symbolIndex: number,
  ): Promise<void> {
    if (!playerId || this.phase !== "playing") return;
    const player = this.players.get(playerId);
    if (!player) return;
    if (typeof symbolIndex !== "number" || !Number.isInteger(symbolIndex)) return;
    const now = Date.now();
    if (player.lockedUntil != null && now < player.lockedUntil) {
      this.send(ws, {
        type: "tapResult",
        hit: false,
        lockedUntil: player.lockedUntil,
      } satisfies SpotItServerMessage);
      return;
    }

    let expected: number | null;
    if (this.spotItMode === "shared" || this.spotItMode === "learning") {
      expected = this.spotItMatchSymbol;
    } else {
      const hand = this.spotItHands.get(playerId);
      expected = this.spotItCenter && hand ? towerMatchForPlayer(this.spotItCenter, hand) : null;
    }

    if (expected == null || symbolIndex !== expected) {
      player.missStreak += 1;
      if (player.missStreak >= 2) {
        player.missStreak = 0;
        player.lockedUntil = now + SPOT_IT_MISS_LOCK_MS;
      }
      await this.persist();
      this.send(ws, {
        type: "tapResult",
        hit: false,
        lockedUntil: player.lockedUntil,
      } satisfies SpotItServerMessage);
      return;
    }

    // Hit: first only. Phase flips synchronously so later taps are ignored.
    player.missStreak = 0;

    if (this.spotItMode === "learning") {
      this.enterSpotItQuiz(symbolIndex);
      this.send(ws, {
        type: "tapResult",
        hit: true,
        lockedUntil: player.lockedUntil,
      } satisfies SpotItServerMessage);
      await this.ctx.storage.deleteAlarm();
      await this.persist();
      this.broadcastState();
      return;
    }

    player.spotItScore += 1;
    this.spotItLastScorerId = playerId;
    this.spotItLastScorerName = player.name;

    if (player.spotItScore >= this.spotItTarget) {
      this.finishSpotIt([playerId]);
      this.send(ws, {
        type: "tapResult",
        hit: true,
        lockedUntil: player.lockedUntil,
      } satisfies SpotItServerMessage);
      await this.ctx.storage.deleteAlarm();
      await this.persist();
      this.broadcastState();
      return;
    }

    this.phase = "between";
    this.countdownEndsAt = now + SPOT_IT_BETWEEN_MS;
    this.send(ws, {
      type: "tapResult",
      hit: true,
      lockedUntil: player.lockedUntil,
    } satisfies SpotItServerMessage);
    await this.ctx.storage.setAlarm(this.countdownEndsAt);
    await this.persist();
    this.broadcastState();
  }

  private async handleTapSpotItQuizChoice(
    ws: WebSocket,
    playerId: string | undefined,
    english: string,
  ): Promise<void> {
    if (!playerId || this.phase !== "quiz") return;
    if (this.spotItMode !== "learning") return;
    const player = this.players.get(playerId);
    if (!player) return;
    if (typeof english !== "string" || !english) return;
    const now = Date.now();
    if (player.lockedUntil != null && now < player.lockedUntil) {
      this.send(ws, {
        type: "tapResult",
        hit: false,
        lockedUntil: player.lockedUntil,
      } satisfies SpotItServerMessage);
      return;
    }

    const symbolIndex = this.spotItQuizSymbolIndex;
    if (symbolIndex == null) return;
    const correct = getSpotItPack(this.spotItPack).symbols[symbolIndex]?.label;
    if (!correct) return;

    if (english !== correct) {
      player.lockedUntil = now + SPOT_IT_QUIZ_MISS_LOCK_MS;
      await this.persist();
      this.send(ws, {
        type: "tapResult",
        hit: false,
        lockedUntil: player.lockedUntil,
      } satisfies SpotItServerMessage);
      // Broadcast so other clients see lock state if needed via private lockedUntil only —
      // miss is personal; still persist for resume.
      return;
    }

    // Correct English: score and teach.
    player.missStreak = 0;
    player.spotItScore += 1;
    this.spotItLastScorerId = playerId;
    this.spotItLastScorerName = player.name;
    this.spotItLastMatchKana = this.spotItQuizKana;
    this.spotItLastMatchReading = this.spotItQuizReading ? [...this.spotItQuizReading] : null;
    this.spotItLastMatchEnglish = correct;
    this.clearSpotItQuizFields();

    this.send(ws, {
      type: "tapResult",
      hit: true,
      lockedUntil: player.lockedUntil,
    } satisfies SpotItServerMessage);

    if (player.spotItScore >= this.spotItTarget) {
      this.finishSpotIt([playerId]);
      await this.ctx.storage.deleteAlarm();
      await this.persist();
      this.broadcastState();
      return;
    }

    this.phase = "between";
    this.countdownEndsAt = now + SPOT_IT_LEARNING_BETWEEN_MS;
    await this.ctx.storage.setAlarm(this.countdownEndsAt);
    await this.persist();
    this.broadcastState();
  }

  private async handleMmmmsReorder(playerId: string | undefined, orbs: OrbColor[]): Promise<void> {
    if (!playerId || this.phase !== "organize") return;
    const player = this.players.get(playerId);
    if (!player || player.mmmmsReady) return;
    if (!isValidOrbList(orbs, player.orbs.length)) return;
    // Must be a permutation of the dealt multiset.
    const sortedCurrent = [...player.orbs].sort().join(",");
    const sortedNext = [...orbs].sort().join(",");
    if (sortedCurrent !== sortedNext) return;
    player.orbs = [...orbs];
    await this.persist();
    this.broadcastState();
  }

  private async handleMmmmsSubmitOrder(playerId: string | undefined): Promise<void> {
    if (!playerId || this.phase !== "organize") return;
    const player = this.players.get(playerId);
    if (!player || player.mmmmsReady) return;
    if (player.orbs.length === 0) return;
    player.mmmmsReady = true;
    const allReady = [...this.players.values()].every((p) => p.mmmmsReady);
    if (allReady) {
      this.defenderGuess = null;
      this.phase = "guess";
    }
    await this.persist();
    this.broadcastState();
  }

  private async handleMmmmsGuess(playerId: string | undefined, color: OrbColor): Promise<void> {
    if (!playerId || this.phase !== "guess") return;
    if (playerId !== this.defenderId) return;
    if (!isOrbColor(color)) return;
    if (this.defenderGuess != null) return;
    this.defenderGuess = color;
    this.phase = "attack";
    await this.persist();
    this.broadcastState();
  }

  private async handleMmmmsAttack(playerId: string | undefined, color: OrbColor): Promise<void> {
    if (!playerId || this.phase !== "attack") return;
    if (playerId !== this.attackerId) return;
    if (!isOrbColor(color)) return;
    if (this.defenderGuess == null || !this.defenderId) return;
    const defender = this.players.get(this.defenderId);
    if (!defender) return;

    const guessCorrect = this.defenderGuess === color;
    const resolution = resolveAttack(defender.orbs, color, guessCorrect);
    defender.orbs = resolution.remaining;

    this.lastAttack = {
      attackerId: playerId,
      defenderId: this.defenderId,
      attackColor: color,
      guessCorrect,
      explodedCount: resolution.explodedCount,
      steps: resolution.steps,
      colorInStack: resolution.colorInStack,
    };

    if (defender.orbs.length === 0) {
      this.winnerId = playerId;
    }

    this.resolveAcks = new Set();
    this.phase = "resolving";
    this.resolveEndsAt = Date.now() + MMMMS_RESOLVE_TIMEOUT_MS;
    await this.ctx.storage.setAlarm(this.resolveEndsAt);
    await this.persist();
    this.broadcastState();
  }

  private async handleMmmmsResolveDone(playerId: string | undefined): Promise<void> {
    if (!playerId || this.phase !== "resolving") return;
    if (!this.players.has(playerId)) return;
    this.resolveAcks.add(playerId);
    if (this.resolveAcks.size < this.players.size) {
      await this.persist();
      return;
    }
    await this.advanceMmmmsAfterResolve();
  }

  private async advanceMmmmsAfterResolve(): Promise<void> {
    if (this.phase !== "resolving") return;
    this.resolveEndsAt = null;
    this.resolveAcks = new Set();

    if (this.winnerId) {
      this.phase = "results";
      this.attackerId = null;
      this.defenderId = null;
      this.defenderGuess = null;
      await this.ctx.storage.deleteAlarm();
      await this.persist();
      this.broadcastState();
      return;
    }

    // Swap roles for the next turn.
    const prevAttacker = this.attackerId;
    this.attackerId = this.defenderId;
    this.defenderId = prevAttacker;
    this.defenderGuess = null;
    this.phase = "guess";
    await this.ctx.storage.deleteAlarm();
    await this.persist();
    this.broadcastState();
  }

  private async handleSubmitAnswers(playerId: string | undefined, answers: string[]): Promise<void> {
    if (!playerId || this.phase !== "playing") return;
    if (this.endsAt != null && Date.now() >= this.endsAt) return;
    const player = this.players.get(playerId);
    if (!player) return;
    if (!Array.isArray(answers)) return;

    if (this.playMode === "hunt") {
      // Hunt finds go through submitHuntFind for validation; ignore bulk replace.
      return;
    }
    const next = emptyAnswers();
    for (let i = 0; i < CATEGORIES_PER_LIST; i++) {
      const raw = answers[i];
      next[i] = typeof raw === "string" ? raw.slice(0, 80) : "";
    }
    player.answers = next;
    await this.persist();
    this.broadcastState();
  }

  private huntLetterTotal(): number {
    return this.playMode === "hunt" ? HUNT_MAX_ANSWERS : 0;
  }

  private sendHuntProgress(ws: WebSocket, playerId: string): void {
    if (this.gameType !== "scattergories" || this.playMode !== "hunt") return;
    if (this.phase !== "playing" && this.phase !== "countdown") return;
    const player = this.players.get(playerId);
    if (!player) return;
    const letterTotal = HUNT_MAX_ANSWERS;
    const matchedCount = player.answers.length;
    this.send(ws, {
      type: "huntProgress",
      letterTotal,
      matchedCount,
      remaining: Math.max(0, letterTotal - matchedCount),
    } satisfies ScatterServerMessage);
  }

  private collectHuntPeerFinds(applyRejects: boolean): HuntPeerFindInput[] {
    const finds: HuntPeerFindInput[] = [];
    for (const p of this.players.values()) {
      for (let i = 0; i < p.answers.length; i++) {
        const raw = p.answers[i] ?? "";
        if (!raw.trim()) continue;
        const mark = p.findMarks[i] ?? { x: 0.5, y: 0.5 };
        finds.push({
          findKey: huntFindKey(p.id, i),
          playerId: p.id,
          playerName: p.name,
          raw,
          x: mark.x,
          y: mark.y,
          hostRejected: applyRejects ? Boolean(p.hostRejected[i]) : false,
        });
      }
    }
    return finds;
  }

  private async handleSubmitHuntFind(
    ws: WebSocket,
    playerId: string | undefined,
    word: unknown,
    xRaw: unknown,
    yRaw: unknown,
  ): Promise<void> {
    if (!playerId || this.phase !== "playing" || this.playMode !== "hunt") return;
    if (this.endsAt != null && Date.now() >= this.endsAt) return;
    const player = this.players.get(playerId);
    if (!player || !this.letter) return;

    const letterTotal = HUNT_MAX_ANSWERS;
    const matchedCount = player.answers.length;
    const remaining = Math.max(0, letterTotal - matchedCount);
    const raw = typeof word === "string" ? word.slice(0, 80).trim() : "";
    const normalized = normalizeAnswer(raw);
    const x = clamp01(typeof xRaw === "number" ? xRaw : Number(xRaw));
    const y = clamp01(typeof yRaw === "number" ? yRaw : Number(yRaw));

    const fail = (status: HuntFindStatus) => {
      this.send(ws, {
        type: "huntFindResult",
        ok: false,
        status,
        remaining,
        matchedCount,
        letterTotal,
      } satisfies ScatterServerMessage);
    };

    if (!normalized) {
      fail("empty");
      return;
    }
    if (!startsWithLetter(normalized, this.letter)) {
      fail("invalidLetter");
      return;
    }
    if (player.answers.length >= HUNT_MAX_ANSWERS) {
      fail("unknown");
      return;
    }

    player.answers = [...player.answers, raw];
    player.findMarks = [...player.findMarks, { x, y }];
    player.hostRejected = [...player.hostRejected, false];
    const nextCount = player.answers.length;
    await this.persist();
    this.broadcastState();
    this.send(ws, {
      type: "huntFindResult",
      ok: true,
      status: "unique" satisfies HuntFindStatus,
      remaining: Math.max(0, letterTotal - nextCount),
      matchedCount: nextCount,
      letterTotal,
      word: raw,
      x,
      y,
    } satisfies ScatterServerMessage);
  }

  private async handleReviewNext(playerId: string | undefined): Promise<void> {
    if (this.playMode === "hunt") return;
    if (!playerId || !this.isHost(playerId) || this.phase !== "review") return;
    const idx = this.reviewIndex ?? 0;
    if (!this.isReviewVotingComplete(idx)) return;
    if (idx >= CATEGORIES_PER_LIST - 1) return;
    this.reviewIndex = idx + 1;
    await this.persist();
    this.broadcastState();
  }

  private async handleReviewPrev(playerId: string | undefined): Promise<void> {
    if (this.playMode === "hunt") return;
    if (!playerId || !this.isHost(playerId) || this.phase !== "review") return;
    const idx = this.reviewIndex ?? 0;
    if (idx <= 0) return;
    this.reviewIndex = idx - 1;
    await this.persist();
    this.broadcastState();
  }

  private async handleSubmitReviewVotes(
    playerId: string | undefined,
    votes: Record<string, ReviewVote>,
  ): Promise<void> {
    if (!playerId || this.phase !== "review") return;
    if (!this.players.has(playerId)) return;
    const idx = this.reviewIndex;
    if (idx == null || idx < 0 || idx >= CATEGORIES_PER_LIST) return;
    if (this.isReviewVotingComplete(idx)) return;
    if (!votes || typeof votes !== "object") return;

    const cleaned: Record<string, ReviewVote> = {};
    if (this.playMode === "hunt") {
      if (idx !== 0) return;
      const validTargets = new Set(
        this.collectHuntPeerFinds(false).map((f) => f.findKey),
      );
      for (const key of validTargets) {
        cleaned[key] = votes[key] === "out" ? "out" : "in";
      }
    } else {
      const validTargets = new Set(
        [...this.players.values()]
          .filter((p) => (p.answers[idx] ?? "").trim().length > 0)
          .map((p) => p.id),
      );
      for (const targetId of validTargets) {
        cleaned[targetId] = votes[targetId] === "out" ? "out" : "in";
      }
    }

    const map = this.reviewBallots[idx] ?? new Map();
    map.set(playerId, cleaned);
    this.reviewBallots[idx] = map;

    if (this.isReviewVotingComplete(idx)) {
      if (this.playMode === "hunt") this.applyHuntReviewMajority();
      else this.applyReviewMajority(idx);
    }

    await this.persist();
    this.broadcastState();
  }

  /** Host marks an AFK voter as submitted with an empty ballot (no in/out tallies). */
  private async handleSkipReviewVoter(
    hostId: string | undefined,
    voterId: string,
  ): Promise<void> {
    if (!hostId || !this.isHost(hostId) || this.phase !== "review") return;
    if (!voterId || !this.players.has(voterId)) return;
    const idx = this.reviewIndex;
    if (idx == null || idx < 0 || idx >= CATEGORIES_PER_LIST) return;
    if (this.playMode === "hunt" && idx !== 0) return;
    if (this.isReviewVotingComplete(idx)) return;

    const map = this.reviewBallots[idx] ?? new Map();
    if (map.has(voterId)) return;

    map.set(voterId, {});
    this.reviewBallots[idx] = map;

    if (this.isReviewVotingComplete(idx)) {
      if (this.playMode === "hunt") this.applyHuntReviewMajority();
      else this.applyReviewMajority(idx);
    }

    await this.persist();
    this.broadcastState();
  }

  private async handleFinishReview(playerId: string | undefined): Promise<void> {
    if (!playerId || !this.isHost(playerId) || this.phase !== "review") return;
    const idx = this.reviewIndex;
    if (idx == null || !this.isReviewVotingComplete(idx)) return;
    if (this.playMode === "hunt" && idx !== 0) return;
    if (this.playMode === "categories" && idx !== CATEGORIES_PER_LIST - 1) {
      // Categories still finishes only from last category via UI, but allow if complete
    }
    this.phase = "results";
    this.reviewIndex = null;
    this.scoresFinalized = true;
    await this.persist();
    this.broadcastState();
  }

  private applyHuntReviewMajority(): void {
    const ballots = this.reviewBallots[0];
    if (!ballots) return;
    for (const p of this.players.values()) {
      p.hostRejected = p.answers.map(() => false);
      for (let i = 0; i < p.answers.length; i++) {
        if (!(p.answers[i] ?? "").trim()) continue;
        const key = huntFindKey(p.id, i);
        let votesIn = 0;
        let votesOut = 0;
        for (const ballot of ballots.values()) {
          const v = ballot[key];
          if (v === "in") votesIn += 1;
          else if (v === "out") votesOut += 1;
        }
        p.hostRejected[i] = votesOut > votesIn;
      }
    }
  }

  private isReviewVotingComplete(idx: number): boolean {
    if (this.players.size === 0) return true;
    const ballots = this.reviewBallots[idx];
    if (!ballots) return false;
    for (const p of this.players.values()) {
      if (!ballots.has(p.id)) return false;
    }
    return true;
  }

  private applyReviewMajority(idx: number): void {
    const ballots = this.reviewBallots[idx];
    if (!ballots) return;

    for (const target of this.players.values()) {
      const raw = (target.answers[idx] ?? "").trim();
      if (!raw) {
        target.hostRejected[idx] = false;
        continue;
      }
      let votesIn = 0;
      let votesOut = 0;
      for (const ballot of ballots.values()) {
        const v = ballot[target.id];
        if (v === "in") votesIn += 1;
        else if (v === "out") votesOut += 1;
      }
      target.hostRejected[idx] = votesOut > votesIn;
    }
  }

  private reviewVoteTallies(idx: number, targetKey: string): { votesIn: number; votesOut: number } {
    if (!this.isReviewVotingComplete(idx)) return { votesIn: 0, votesOut: 0 };
    const ballots = this.reviewBallots[idx];
    if (!ballots) return { votesIn: 0, votesOut: 0 };
    let votesIn = 0;
    let votesOut = 0;
    for (const ballot of ballots.values()) {
      const v = ballot[targetKey];
      if (v === "in") votesIn += 1;
      else if (v === "out") votesOut += 1;
    }
    return { votesIn, votesOut };
  }

  private async handleSubmit(
    ws: WebSocket,
    playerId: string | undefined,
    path: number[],
  ): Promise<void> {
    if (!playerId || this.phase !== "playing" || !this.board) {
      this.send(ws, { type: "wordResult", ok: false, reason: "not-playing" });
      return;
    }
    if (this.endsAt != null && Date.now() >= this.endsAt) {
      this.send(ws, { type: "wordResult", ok: false, reason: "time-up" });
      return;
    }

    const player = this.players.get(playerId);
    if (!player) {
      this.send(ws, { type: "wordResult", ok: false, reason: "unknown-player" });
      return;
    }

    if (!Array.isArray(path) || !isValidPath(this.boardSize, path)) {
      this.send(ws, { type: "wordResult", ok: false, reason: "bad-path" });
      return;
    }

    const word = pathToWord(this.board, path);
    if (!word || word.length < MIN_WORD_LEN) {
      this.send(ws, { type: "wordResult", ok: false, reason: "too-short" });
      return;
    }

    if (!isDictionaryWord(word)) {
      this.send(ws, { type: "wordResult", ok: false, reason: "not-a-word", word });
      return;
    }

    if (player.words.has(word)) {
      this.send(ws, { type: "wordResult", ok: false, reason: "duplicate", word });
      return;
    }

    const now = Date.now();
    const secondsLeft =
      this.endsAt != null ? Math.max(0, Math.ceil((this.endsAt - now) / 1000)) : 0;

    let foundByOther = false;
    for (const other of this.players.values()) {
      if (other.id === playerId) continue;
      if (other.words.has(word)) {
        foundByOther = true;
        break;
      }
    }

    this.globalAcceptCount += 1;
    const scored = scoreAtSubmit({
      word,
      path,
      boardSize: this.boardSize,
      secondsLeft,
      globalAcceptIndex: this.globalAcceptCount,
      foundByOther,
    });

    const record: WordRecord = {
      word,
      path: [...path],
      submittedAt: now,
      base: scored.base,
      bonuses: scored.bonuses,
      points: scored.points,
    };
    player.words.set(word, record);
    this.lastAccept = { playerId, word };
    await this.persist();
    this.send(ws, {
      type: "wordResult",
      ok: true,
      word,
      points: scored.points,
      bonuses: scored.bonuses,
    });
    this.broadcastState();
    if (scored.bonuses.length > 0) {
      this.broadcastBadgeEvent(scored.bonuses);
    }
  }

  private finalizeScores(): BonusId[][] {
    if (this.scoresFinalized) return [];
    this.scoresFinalized = true;

    if (this.board) {
      const found = [...this.players.values()].flatMap((p) => [...p.words.keys()]);
      const coverage = computeBoardCoverage(this.board, this.boardSize, found);
      this.missedWords = coverage.missedWords;
      this.possibleWords = coverage.possibleWords;
      this.possibleWordCount = coverage.possibleWordCount;
      this.possibleByLength = coverage.possibleByLength;
    } else {
      this.missedWords = [];
      this.possibleWords = [];
      this.possibleWordCount = 0;
      this.possibleByLength = [];
    }

    const finders = new Map<string, string[]>();
    for (const p of this.players.values()) {
      for (const word of p.words.keys()) {
        const list = finders.get(word) ?? [];
        list.push(p.id);
        finders.set(word, list);
      }
    }

    const last = this.lastAccept;
    const anonymousBatches: BonusId[][] = [];

    for (const p of this.players.values()) {
      for (const rec of p.words.values()) {
        const unique = (finders.get(rec.word)?.length ?? 0) === 1;
        const isLastWord = last != null && last.playerId === p.id && last.word === rec.word;
        const before = new Set(rec.bonuses);
        const bonuses = finalizeWordBonuses(rec.bonuses, { unique, isLastWord });
        const rareCount = rareLetterCount(rec.word);
        rec.bonuses = bonuses;
        rec.points = computePoints(rec.base, bonuses, rareCount);
        const added = bonuses.filter((b) => !before.has(b));
        if (added.length > 0) anonymousBatches.push(added);
      }
    }

    const longFinders = [...this.players.values()].filter((p) =>
      [...p.words.keys()].some((w) => w.length >= 6),
    );
    const loneWolfId = longFinders.length === 1 ? longFinders[0]!.id : null;

    for (const p of this.players.values()) {
      const awards: RoundAward[] = [];
      if (loneWolfId === p.id) {
        awards.push({ id: "loneWolf", points: 5 });
        anonymousBatches.push(["loneWolf"]);
      }
      const cov = coveragePoints([...p.words.values()].map((w) => w.path));
      if (cov > 0) {
        awards.push({ id: "coverage", points: cov });
        anonymousBatches.push(["coverage"]);
      }
      p.roundAwards = awards;
    }

    return anonymousBatches;
  }

  private bogglePlayerScore(p: PlayerRecord): number {
    const wordPts = [...p.words.values()].reduce((a, w) => a + w.points, 0);
    const awardPts = p.roundAwards.reduce((a, r) => a + r.points, 0);
    return wordPts + awardPts;
  }

  private scatterPlayerScore(p: PlayerRecord): number {
    if (!this.letter) return 0;
    if (this.playMode === "hunt") {
      const applyRejects =
        this.phase === "results" ||
        (this.phase === "review" && this.isReviewVotingComplete(0));
      return scoreHuntPeerPlayer(
        p.id,
        this.letter,
        this.collectHuntPeerFinds(applyRejects),
      ).total;
    }
    const all = [...this.players.values()].map((x) => ({
      id: x.id,
      name: x.name,
      answers: x.answers,
      hostRejected: x.hostRejected,
    }));
    return scorePlayerAcrossCategories(p.id, this.letter, all).total;
  }

  private isHost(playerId: string): boolean {
    return this.players.get(playerId)?.isHost === true;
  }

  private scatterSnapshot(): ScatterRoomState {
    const players: ScatterPlayerPublic[] = [...this.players.values()].map((p) => ({
      id: p.id,
      name: p.name,
      isHost: p.isHost,
      answerCount: p.answers.filter((a) => a.trim().length > 0).length,
      score: this.scatterPlayerScore(p),
    }));

    let reviewAnswers: ScatterRoomState["reviewAnswers"] = null;
    let reviewSubmittedBy: string[] = [];
    let reviewPendingVoters: ScatterRoomState["reviewPendingVoters"] = [];
    let reviewVotingComplete = false;

    if (this.phase === "review" && this.letter != null && this.reviewIndex != null) {
      const idx = this.reviewIndex;
      reviewVotingComplete = this.isReviewVotingComplete(idx);
      const ballots = this.reviewBallots[idx];
      reviewSubmittedBy = ballots ? [...ballots.keys()] : [];
      reviewPendingVoters = [...this.players.values()]
        .filter((p) => !ballots?.has(p.id))
        .map((p) => ({ id: p.id, name: p.name }));

      if (this.playMode === "hunt") {
        reviewAnswers = scoreHuntPeerFinds(
          this.letter,
          this.collectHuntPeerFinds(reviewVotingComplete),
        ).map((view) => {
          const key = view.findKey ?? view.playerId;
          const tallies = this.reviewVoteTallies(0, key);
          return { ...view, votesIn: tallies.votesIn, votesOut: tallies.votesOut };
        });
      } else {
        reviewAnswers = scoreCategory(
          this.letter,
          [...this.players.values()].map((p) => ({
            playerId: p.id,
            playerName: p.name,
            raw: p.answers[idx] ?? "",
            hostRejected: reviewVotingComplete ? (p.hostRejected[idx] ?? false) : false,
          })),
        ).map((view) => {
          const tallies = this.reviewVoteTallies(idx, view.playerId);
          return { ...view, votesIn: tallies.votesIn, votesOut: tallies.votesOut };
        });
      }
    }

    let results: ScatterPlayerResult[] | null = null;
    let winners: string[] | null = null;

    if (this.phase === "results" && this.letter) {
      if (this.playMode === "hunt") {
        const finds = this.collectHuntPeerFinds(true);
        results = [...this.players.values()].map((p) => {
          const scored = scoreHuntPeerPlayer(p.id, this.letter!, finds);
          return {
            id: p.id,
            name: p.name,
            isHost: p.isHost,
            answerCount: p.answers.filter((a) => a.trim().length > 0).length,
            score: scored.total,
            answers: [...p.answers],
            categoryPoints: scored.findPoints,
            findMarks: [...p.findMarks],
          };
        });
      } else {
        const all = [...this.players.values()].map((x) => ({
          id: x.id,
          name: x.name,
          answers: x.answers,
          hostRejected: x.hostRejected,
        }));
        results = [...this.players.values()].map((p) => {
          const scored = scorePlayerAcrossCategories(p.id, this.letter!, all);
          return {
            id: p.id,
            name: p.name,
            isHost: p.isHost,
            answerCount: p.answers.filter((a) => a.trim().length > 0).length,
            score: scored.total,
            answers: [...p.answers],
            categoryPoints: scored.categoryPoints,
          };
        });
      }
      results.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
      const top = results[0]?.score ?? 0;
      winners = results.filter((r) => r.score === top && top > 0).map((r) => r.id);
      if (winners.length === 0 && results.length > 0) {
        winners = results.map((r) => r.id);
      }
    }

    const hideRoundSetup = this.phase === "lobby" || this.phase === "rolling";
    const huntPacks = packsCatalog().map((p) => ({
      id: p.id,
      title: p.title,
      tagline: p.tagline,
      sceneCount: p.sceneIds.length,
    }));

    return {
      game: "scattergories",
      code: this.code,
      phase: this.phase as ScatterPhase,
      playMode: this.playMode,
      packTier: this.packTier,
      roundSeconds: this.roundSeconds as ScatterRoundSeconds,
      letter: hideRoundSetup ? null : this.letter,
      categories: hideRoundSetup || this.playMode === "hunt" ? null : this.categories,
      listId: hideRoundSetup || this.playMode === "hunt" ? null : this.listId,
      huntPackId: this.huntPackId,
      sceneId: hideRoundSetup || this.playMode !== "hunt" ? null : this.sceneId,
      sceneTitle: hideRoundSetup || this.playMode !== "hunt" ? null : this.sceneTitle,
      sceneImageUrl: hideRoundSetup || this.playMode !== "hunt" ? null : this.sceneImageUrl,
      huntPacks,
      huntLetterTotal:
        this.playMode === "hunt" && !hideRoundSetup ? this.huntLetterTotal() : 0,
      countdownEndsAt: this.countdownEndsAt,
      endsAt: this.endsAt,
      players,
      rollerId: this.phase === "rolling" ? this.rollerId : null,
      rollerName: this.phase === "rolling" ? this.rollerName : null,
      reviewIndex: this.phase === "review" ? this.reviewIndex : null,
      reviewAnswers,
      reviewSubmittedBy,
      reviewPendingVoters,
      reviewVotingComplete,
      results,
      winners,
      round: this.round,
    };
  }

  private boggleSnapshot(): BoggleRoomState {
    if (this.phase === "results" && !this.scoresFinalized) {
      this.finalizeScores();
    }

    const players: BogglePlayerPublic[] = [...this.players.values()].map((p) => ({
      id: p.id,
      name: p.name,
      isHost: p.isHost,
      wordCount: p.words.size,
      score: this.bogglePlayerScore(p),
    }));

    let results: BogglePlayerResult[] | null = null;
    let winners: string[] | null = null;
    let missedWords: string[] | null = null;
    let possibleWords: string[] | null = null;
    let possibleWordCount: number | null = null;
    let possibleByLength: LengthCount[] | null = null;

    if (this.phase === "results") {
      if (
        (this.missedWords == null ||
          this.possibleWords == null ||
          this.possibleWordCount == null ||
          this.possibleByLength == null) &&
        this.board
      ) {
        const found = [...this.players.values()].flatMap((p) => [...p.words.keys()]);
        const coverage = computeBoardCoverage(this.board, this.boardSize, found);
        this.missedWords = coverage.missedWords;
        this.possibleWords = coverage.possibleWords;
        this.possibleWordCount = coverage.possibleWordCount;
        this.possibleByLength = coverage.possibleByLength;
      }
      missedWords = this.missedWords ?? [];
      possibleWords = this.possibleWords ?? [];
      possibleWordCount = this.possibleWordCount ?? 0;
      possibleByLength = this.possibleByLength ?? [];
      results = [...this.players.values()].map((p) => ({
        id: p.id,
        name: p.name,
        isHost: p.isHost,
        wordCount: p.words.size,
        score: this.bogglePlayerScore(p),
        words: [...p.words.values()]
          .map((w) => ({
            word: w.word,
            points: w.points,
            bonuses: w.bonuses,
          }))
          .sort((a, b) => b.points - a.points || a.word.localeCompare(b.word)),
        roundAwards: p.roundAwards,
      }));
      results.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
      const top = results[0]?.score ?? 0;
      winners = results.filter((r) => r.score === top && top > 0).map((r) => r.id);
      if (winners.length === 0 && results.length > 0) {
        winners = results.map((r) => r.id);
      }
    }

    return {
      code: this.code,
      phase: this.phase as BogglePhase,
      boardSize: this.boardSize,
      roundSeconds: this.roundSeconds as RoundSeconds,
      board: this.phase === "lobby" ? null : this.board,
      countdownEndsAt: this.countdownEndsAt,
      endsAt: this.endsAt,
      players,
      results,
      winners,
      missedWords,
      possibleWords,
      possibleWordCount,
      possibleByLength,
      round: this.round,
    };
  }

  private mmmmsSnapshot(): MmmmsRoomState {
    const players: MmmmsPlayerPublic[] = [...this.players.values()].map((p) => ({
      id: p.id,
      name: p.name,
      isHost: p.isHost,
      remainingCount: p.orbs.length,
      ready: p.mmmmsReady,
    }));

    let winnerName: string | null = null;
    if (this.winnerId) {
      winnerName = this.players.get(this.winnerId)?.name ?? null;
    }

    return {
      game: "mmmms",
      code: this.code,
      phase: this.phase as MmmmsPhase,
      orbCount: this.orbCount,
      players,
      attackerId: this.attackerId,
      defenderId: this.defenderId,
      defenderHasGuessed: this.defenderGuess != null,
      lastAttack: this.lastAttack,
      winnerId: this.winnerId,
      winnerName,
      round: this.round,
    };
  }

  private spotdiffSnapshot(forPlayerId?: string | null): SpotdiffRoomState {
    this.clearExpiredSpotHint(Date.now());
    const players: SpotdiffPlayerPublic[] = [...this.players.values()].map((p) => ({
      id: p.id,
      name: p.name,
      isHost: p.isHost,
      foundCount:
        this.spotMode === "coop" ? this.spotSharedFound.length : p.foundDiffIds.length,
    }));

    const results: SpotdiffPlayerResult[] =
      this.phase === "results"
        ? [...this.players.values()].map((p) => ({
            id: p.id,
            name: p.name,
            foundCount:
              this.spotMode === "coop" ? this.spotSharedFound.length : p.foundDiffIds.length,
            foundDiffIds:
              this.spotMode === "coop" ? [...this.spotSharedFound] : [...p.foundDiffIds],
          }))
        : [];

    let hintDiffId: string | null = null;
    if (this.spotHintDiffId && this.spotHintUntil != null && Date.now() < this.spotHintUntil) {
      if (
        this.spotHintForPlayerId == null ||
        (forPlayerId != null && forPlayerId === this.spotHintForPlayerId)
      ) {
        hintDiffId = this.spotHintDiffId;
      }
    }

    const foundDiffIds =
      this.spotMode === "coop" || this.phase === "results"
        ? [...this.spotSharedFound]
        : [];

    return {
      game: "spotdiff",
      code: this.code,
      phase: this.phase as SpotdiffPhase,
      spotMode: this.spotMode,
      roundSeconds: this.roundSeconds as SpotRoundSeconds,
      diffCount: this.spotDiffCount,
      difficulty: this.spotDifficulty,
      countdownEndsAt: this.countdownEndsAt,
      endsAt: this.endsAt,
      players,
      puzzle: this.phase === "lobby" ? null : this.spotPuzzle,
      foundDiffIds,
      results,
      winners: this.phase === "results" ? [...this.spotWinners] : [],
      round: this.round,
      hintDiffId,
      hintUntil: hintDiffId ? this.spotHintUntil : null,
    };
  }

  private spotItSnapshot(): SpotItRoomState {
    const tower = this.spotItMode === "tower";
    const players: SpotItPlayerPublic[] = [...this.players.values()].map((p) => ({
      id: p.id,
      name: p.name,
      isHost: p.isHost,
      score: p.spotItScore,
    }));
    const inGame = this.phase !== "lobby";
    const inQuiz = this.phase === "quiz";
    const inBetween = this.phase === "between";
    return {
      game: "spot-it",
      code: this.code,
      phase: this.phase as SpotItPhase,
      spotItMode: this.spotItMode,
      targetScore: this.spotItTarget,
      packId: this.spotItPack,
      countdownEndsAt: this.countdownEndsAt,
      players,
      cardA: inGame ? (tower ? this.spotItCenter : this.spotItCardA) : null,
      cardB: inGame && !tower ? this.spotItCardB : null,
      centerCard: inGame && tower ? this.spotItCenter : null,
      lastScorerId: this.spotItLastScorerId,
      lastScorerName: this.spotItLastScorerName,
      winners: this.phase === "results" ? [...this.spotItWinners] : [],
      round: this.round,
      pileRemaining: tower && inGame ? this.spotItPile.length : null,
      quizSymbolIndex: inQuiz ? this.spotItQuizSymbolIndex : null,
      quizChoices: inQuiz && this.spotItQuizChoices ? [...this.spotItQuizChoices] : null,
      quizKana: inQuiz ? this.spotItQuizKana : null,
      quizReading: inQuiz && this.spotItQuizReading ? [...this.spotItQuizReading] : null,
      lastMatchKana: inBetween ? this.spotItLastMatchKana : null,
      lastMatchReading:
        inBetween && this.spotItLastMatchReading ? [...this.spotItLastMatchReading] : null,
      lastMatchEnglish: inBetween ? this.spotItLastMatchEnglish : null,
    };
  }

  private async handleSetTriviaPack(playerId: string | undefined, packId: string): Promise<void> {
    if (!playerId || !this.isHost(playerId)) return;
    if (this.phase !== "lobby" && this.phase !== "results") return;
    if (!this.trivia.setPack(packId)) return;
    await this.persist();
    this.broadcastState();
  }

  private async handleSetTriviaChaosMode(playerId: string | undefined, mode: string): Promise<void> {
    if (!playerId || !this.isHost(playerId)) return;
    if (this.phase !== "lobby" && this.phase !== "results") return;
    if (!this.trivia.setChaosMode(mode)) return;
    await this.persist();
    this.broadcastState();
  }

  private async applyTriviaAlarm(alarmAt: number | null | undefined): Promise<void> {
    this.phase = this.trivia.phase;
    this.endsAt = this.trivia.endsAt;
    await this.persist();
    this.broadcastState();
    if (alarmAt != null) {
      await this.ctx.storage.setAlarm(alarmAt);
    } else if (this.trivia.endsAt == null) {
      await this.ctx.storage.deleteAlarm();
    }
  }

  private async handleTriviaPickCell(
    playerId: string | undefined,
    categoryIndex: number,
    tier: number,
  ): Promise<void> {
    if (!playerId) return;
    this.trivia.syncSeatsFrom(this.players.values());
    const result = this.trivia.pickCell(playerId, categoryIndex, tier);
    if (!result.ok) return;
    await this.applyTriviaAlarm(result.alarmAt);
  }

  private async handleTriviaBuzz(playerId: string | undefined): Promise<void> {
    if (!playerId) return;
    this.trivia.syncSeatsFrom(this.players.values());
    const result = this.trivia.buzz(playerId);
    if (!result.ok) return;
    await this.applyTriviaAlarm(result.alarmAt);
  }

  private async handleTriviaAnswer(playerId: string | undefined, choiceIndex: number): Promise<void> {
    if (!playerId) return;
    this.trivia.syncSeatsFrom(this.players.values());
    const result = this.trivia.answer(playerId, choiceIndex);
    if (!result.ok) return;
    await this.applyTriviaAlarm(result.alarmAt);
  }

  private async handleTriviaDailyWager(playerId: string | undefined, amount: number): Promise<void> {
    if (!playerId) return;
    this.trivia.syncSeatsFrom(this.players.values());
    const result = this.trivia.setDailyWager(playerId, amount);
    if (!result.ok) return;
    await this.applyTriviaAlarm(result.alarmAt);
  }

  private async handleTriviaFinalWager(playerId: string | undefined, amount: number): Promise<void> {
    if (!playerId) return;
    this.trivia.syncSeatsFrom(this.players.values());
    const result = this.trivia.setFinalWager(playerId, amount);
    if (!result.ok) return;
    await this.applyTriviaAlarm(result.alarmAt);
  }

  private async handleTriviaFinalAnswer(
    playerId: string | undefined,
    choiceIndex: number,
  ): Promise<void> {
    if (!playerId) return;
    this.trivia.syncSeatsFrom(this.players.values());
    const result = this.trivia.finalAnswer(playerId, choiceIndex);
    if (!result.ok) return;
    await this.applyTriviaAlarm(result.alarmAt);
  }

  private async handleTriviaSolveChaos(
    playerId: string | undefined,
    choiceIndex: number,
  ): Promise<void> {
    if (!playerId) return;
    this.trivia.syncSeatsFrom(this.players.values());
    this.trivia.solveChaos(playerId, choiceIndex);
    await this.persist();
    this.broadcastState();
  }

  private async handleTriviaUseChaos(
    playerId: string | undefined,
    power: string,
    targetPlayerId?: string,
  ): Promise<void> {
    if (!playerId) return;
    this.trivia.syncSeatsFrom(this.players.values());
    const result = this.trivia.useChaos(playerId, power, targetPlayerId);
    if (!result.ok) return;
    await this.persist();
    this.broadcastState();
  }

  private async handleTriviaCheer(playerId: string | undefined, delta: 1 | -1): Promise<void> {
    if (!playerId) return;
    this.trivia.cheer(playerId, delta);
    await this.persist();
    this.broadcastState();
  }

  private async handleTriviaPhoneFriendVote(
    playerId: string | undefined,
    choiceIndex: number,
  ): Promise<void> {
    if (!playerId) return;
    this.trivia.phoneFriendVote(playerId, choiceIndex);
    await this.persist();
    this.broadcastState();
  }

  private async handleTriviaChallengeVote(
    playerId: string | undefined,
    tooEasy: boolean,
  ): Promise<void> {
    if (!playerId) return;
    this.trivia.challengeVote(playerId, tooEasy);
    await this.persist();
    this.broadcastState();
  }

  private async handleSetWheelRounds(
    playerId: string | undefined,
    roundCount: WheelRoundCount,
  ): Promise<void> {
    if (!playerId || !this.isHost(playerId)) return;
    if (this.phase !== "lobby" && this.phase !== "results") return;
    if (!isWheelRoundCount(roundCount)) return;
    this.wheelRoundCount = roundCount;
    await this.persist();
    this.broadcastState();
  }

  private beginWheelRound(roundIndex: number): void {
    this.wheelRoundIndex = roundIndex;
    const puzzle = pickPuzzle(this.wheelUsedPuzzleIds);
    this.wheelPuzzle = puzzle;
    this.wheelUsedPuzzleIds = [...this.wheelUsedPuzzleIds, puzzle.id];
    this.wheelRevealed = new Set();
    this.wheelUsedLetters = [];
    this.wheelLastSpin = null;
    this.wheelPendingCash = null;
    this.wheelLastSolverId = null;
    this.wheelLastSolverName = null;
    this.wheelGuessEndsAt = null;
    this.wheelVowelFree = false;
    this.wheelLastOutcome = null;
    this.wheelLastOutcomePlayerName = null;
    for (const p of this.players.values()) {
      p.wheelRoundBank = 0;
    }
    const seats = [...this.players.keys()];
    this.wheelCurrentPlayerId = seats[roundIndex % seats.length] ?? seats[0] ?? null;
    this.wheelTurnPhase = "spin";
  }

  private wheelSeatOrder(): string[] {
    return [...this.players.keys()];
  }

  private advanceWheelSeat(): void {
    const seats = this.wheelSeatOrder();
    if (seats.length === 0) {
      this.wheelCurrentPlayerId = null;
      return;
    }
    const cur = this.wheelCurrentPlayerId;
    const idx = cur ? seats.indexOf(cur) : -1;
    const next = seats[(idx + 1) % seats.length]!;
    this.wheelCurrentPlayerId = next;
    this.wheelTurnPhase = "spin";
    this.wheelPendingCash = null;
    this.wheelLastSpin = null;
    this.wheelGuessEndsAt = null;
    this.wheelVowelFree = false;
  }

  private consumeFreeSpinOrAdvance(player: PlayerRecord | undefined): void {
    if (player && player.wheelFreeSpins > 0) {
      player.wheelFreeSpins -= 1;
      this.wheelTurnPhase = "spin";
      this.wheelPendingCash = null;
      this.wheelGuessEndsAt = null;
      this.wheelVowelFree = false;
      return;
    }
    this.advanceWheelSeat();
  }

  private armWheelGuessTimer(): void {
    this.wheelGuessEndsAt = Date.now() + WHEEL_GUESS_MS;
  }

  /** Returns true when insurance absorbed the bankrupt (bank unchanged). */
  private applyBankrupt(player: PlayerRecord): boolean {
    if (player.wheelInsurance) {
      player.wheelInsurance = false;
      return true;
    }
    this.wheelJackpot += player.wheelRoundBank;
    player.wheelRoundBank = 0;
    return false;
  }

  private richestRival(exceptId: string): PlayerRecord | null {
    let best: PlayerRecord | null = null;
    for (const p of this.players.values()) {
      if (p.id === exceptId) continue;
      if (!best || p.wheelRoundBank > best.wheelRoundBank) best = p;
    }
    return best;
  }

  private randomOther(exceptId: string): PlayerRecord | null {
    const others = [...this.players.values()].filter((p) => p.id !== exceptId);
    if (others.length === 0) return null;
    return others[Math.floor(Math.random() * others.length)]!;
  }

  /** Reveal a letter that still appears in the answer. Returns count or 0. */
  private revealLetterInPuzzle(letter: string, awardPer: number, player: PlayerRecord): number {
    if (this.wheelUsedLetters.includes(letter)) return 0;
    if (!this.wheelPuzzle) return 0;
    const count = countLetterInAnswer(this.wheelPuzzle.answer, letter);
    this.wheelUsedLetters = [...this.wheelUsedLetters, letter];
    if (count > 0) {
      this.wheelRevealed.add(letter);
      if (awardPer > 0) {
        player.wheelRoundBank = addConsonantWinnings(player.wheelRoundBank, awardPer, count);
      }
    }
    return count;
  }

  private pickUnrevealedLetter(consonantOnly: boolean): string | null {
    if (!this.wheelPuzzle) return null;
    const letters = new Set<string>();
    for (const ch of this.wheelPuzzle.answer) {
      if (ch === " ") continue;
      if (this.wheelRevealed.has(ch)) continue;
      if (consonantOnly && !isConsonant(ch)) continue;
      letters.add(ch);
    }
    if (letters.size === 0 && consonantOnly) {
      return this.pickUnrevealedLetter(false);
    }
    const arr = [...letters];
    if (arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)]!;
  }

  private goAction(): void {
    this.wheelTurnPhase = "action";
    this.wheelPendingCash = null;
    this.wheelGuessEndsAt = null;
  }

  private goConsonant(cash: number): void {
    this.wheelPendingCash = cash;
    this.wheelTurnPhase = "consonant";
    this.armWheelGuessTimer();
  }

  private goVowel(free: boolean): void {
    this.wheelVowelFree = free;
    this.wheelTurnPhase = "vowel";
    this.wheelPendingCash = null;
    this.armWheelGuessTimer();
  }

  private goSolve(): void {
    this.wheelTurnPhase = "solve";
    this.armWheelGuessTimer();
  }

  private async handleWheelSpin(playerId: string | undefined): Promise<void> {
    if (!playerId || playerId !== this.wheelCurrentPlayerId) return;
    if (this.phase !== "playing") return;
    if (this.wheelTurnPhase !== "spin" && this.wheelTurnPhase !== "action") return;
    const { lastSpin } = pickSpin();
    this.wheelLastSpin = lastSpin;
    this.wheelTurnPhase = "spinning";
    this.wheelPendingCash = null;
    this.wheelGuessEndsAt = null;
    await this.ctx.storage.setAlarm(lastSpin.endsAt);
    await this.persist();
    this.broadcastState();
  }

  private async resolveWheelSpin(): Promise<void> {
    if (this.gameType !== "wheel" || this.phase !== "playing") return;
    if (this.wheelTurnPhase !== "spinning" || !this.wheelLastSpin) return;
    const wedge = WHEEL_WEDGES[this.wheelLastSpin.wedgeIndex];
    if (!wedge) {
      this.wheelTurnPhase = "spin";
      await this.persist();
      this.broadcastState();
      return;
    }
    const player = this.wheelCurrentPlayerId
      ? this.players.get(this.wheelCurrentPlayerId)
      : undefined;

    this.wheelJackpot += WHEEL_JACKPOT_TICK;
    this.wheelLastOutcome = wedge.kind;
    this.wheelLastOutcomePlayerName = player?.name ?? null;
    this.wheelVowelFree = false;
    this.wheelGuessEndsAt = null;

    switch (wedge.kind) {
      case "bankrupt": {
        if (player && this.applyBankrupt(player)) {
          this.wheelLastOutcome = "insurance";
        }
        this.advanceWheelSeat();
        break;
      }
      case "freeSpin": {
        if (player) player.wheelFreeSpins += 1;
        this.goAction();
        break;
      }
      case "payEach": {
        const others = [...this.players.values()].filter((p) => p.id !== player?.id);
        const cost = WHEEL_PAY_EACH * others.length;
        if (!player || player.wheelRoundBank < cost) {
          this.wheelLastOutcome = "payEachFail";
          this.consumeFreeSpinOrAdvance(player);
        } else {
          player.wheelRoundBank -= cost;
          for (const o of others) o.wheelRoundBank += WHEEL_PAY_EACH;
          this.goConsonant(0);
        }
        break;
      }
      case "double": {
        if (player) player.wheelRoundBank *= 2;
        this.goAction();
        break;
      }
      case "flatBonus": {
        if (player) player.wheelRoundBank += wedge.value ?? 500;
        this.goAction();
        break;
      }
      case "jackpot": {
        if (player) {
          player.wheelRoundBank += this.wheelJackpot;
          this.wheelJackpot = 0;
        }
        this.goAction();
        break;
      }
      case "half": {
        if (player) player.wheelRoundBank = Math.floor(player.wheelRoundBank / 2);
        this.goAction();
        break;
      }
      case "swapBanks": {
        if (player) {
          const other = this.randomOther(player.id);
          if (other) {
            const tmp = player.wheelRoundBank;
            player.wheelRoundBank = other.wheelRoundBank;
            other.wheelRoundBank = tmp;
          }
        }
        this.goAction();
        break;
      }
      case "steal": {
        if (player) {
          const rival = this.richestRival(player.id);
          if (rival) {
            const take = Math.min(WHEEL_STEAL, rival.wheelRoundBank);
            rival.wheelRoundBank -= take;
            player.wheelRoundBank += take;
          }
        }
        this.goAction();
        break;
      }
      case "freeLetter": {
        if (player) {
          const letter = this.pickUnrevealedLetter(true);
          if (letter) {
            this.revealLetterInPuzzle(letter, 0, player);
            if (isFullyRevealed(this.wheelPuzzle!.answer, this.wheelRevealed)) {
              await this.completeWheelSolve(player);
              return;
            }
          }
        }
        this.goAction();
        break;
      }
      case "wildVowel": {
        this.goVowel(true);
        break;
      }
      case "mystery": {
        if (player && this.wheelPuzzle) {
          const consonants = new Set<string>();
          for (const ch of this.wheelPuzzle.answer) {
            if (ch !== " " && !this.wheelRevealed.has(ch) && isConsonant(ch)) consonants.add(ch);
          }
          const arr = [...consonants];
          if (arr.length > 0) {
            const letter = arr[Math.floor(Math.random() * arr.length)]!;
            this.revealLetterInPuzzle(letter, WHEEL_MYSTERY_UNIT, player);
            if (isFullyRevealed(this.wheelPuzzle.answer, this.wheelRevealed)) {
              await this.completeWheelSolve(player);
              return;
            }
          }
        }
        this.goAction();
        break;
      }
      case "passWheel": {
        this.advanceWheelSeat();
        break;
      }
      case "chaosTax": {
        for (const p of this.players.values()) {
          const tax = Math.min(WHEEL_CHAOS_TAX, p.wheelRoundBank);
          p.wheelRoundBank -= tax;
          this.wheelJackpot += tax;
        }
        this.goAction();
        break;
      }
      case "bankruptLite": {
        if (player) player.wheelRoundBank = Math.floor(player.wheelRoundBank / 2);
        this.consumeFreeSpinOrAdvance(player);
        break;
      }
      case "insurance": {
        if (player) player.wheelInsurance = true;
        this.goAction();
        break;
      }
      case "cash":
      default: {
        const cash = wedge.value ?? 0;
        this.goConsonant(cash);
        break;
      }
    }

    if (this.wheelGuessEndsAt != null) {
      await this.ctx.storage.setAlarm(this.wheelGuessEndsAt);
    }
    await this.persist();
    this.broadcastState();
  }

  private async handleWheelGuessLetter(
    playerId: string | undefined,
    letterRaw: string,
  ): Promise<void> {
    if (!playerId || playerId !== this.wheelCurrentPlayerId) return;
    if (this.phase !== "playing" || !this.wheelPuzzle) return;
    const letter = letterRaw.trim().toUpperCase();
    if (!/^[A-Z]$/.test(letter)) return;
    if (this.wheelUsedLetters.includes(letter)) return;

    const player = this.players.get(playerId);
    if (!player) return;

    if (this.wheelTurnPhase === "consonant") {
      if (!isConsonant(letter)) return;
      this.wheelGuessEndsAt = null;
      this.wheelUsedLetters = [...this.wheelUsedLetters, letter];
      const count = countLetterInAnswer(this.wheelPuzzle.answer, letter);
      if (count > 0) {
        this.wheelRevealed.add(letter);
        player.wheelRoundBank = addConsonantWinnings(
          player.wheelRoundBank,
          this.wheelPendingCash ?? 0,
          count,
        );
        this.wheelPendingCash = null;
        if (isFullyRevealed(this.wheelPuzzle.answer, this.wheelRevealed)) {
          await this.completeWheelSolve(player);
          return;
        }
        this.wheelTurnPhase = "action";
      } else {
        this.advanceWheelSeat();
      }
      await this.persist();
      this.broadcastState();
      return;
    }

    if (this.wheelTurnPhase === "vowel") {
      if (!isVowel(letter)) return;
      const free = this.wheelVowelFree;
      if (!free && !canBuyVowel(player.wheelRoundBank)) {
        this.goAction();
        await this.persist();
        this.broadcastState();
        return;
      }
      this.wheelGuessEndsAt = null;
      this.wheelUsedLetters = [...this.wheelUsedLetters, letter];
      if (!free) player.wheelRoundBank = applyVowelPurchase(player.wheelRoundBank);
      this.wheelVowelFree = false;
      const count = countLetterInAnswer(this.wheelPuzzle.answer, letter);
      if (count > 0) {
        this.wheelRevealed.add(letter);
        if (isFullyRevealed(this.wheelPuzzle.answer, this.wheelRevealed)) {
          await this.completeWheelSolve(player);
          return;
        }
      }
      this.goAction();
      await this.persist();
      this.broadcastState();
    }
  }

  private async handleWheelBuyVowel(playerId: string | undefined): Promise<void> {
    if (!playerId || playerId !== this.wheelCurrentPlayerId) return;
    if (this.phase !== "playing" || this.wheelTurnPhase !== "action") return;
    const player = this.players.get(playerId);
    if (!player || !canBuyVowel(player.wheelRoundBank)) return;
    this.goVowel(false);
    if (this.wheelGuessEndsAt != null) {
      await this.ctx.storage.setAlarm(this.wheelGuessEndsAt);
    }
    await this.persist();
    this.broadcastState();
  }

  private async handleWheelChooseSolve(playerId: string | undefined): Promise<void> {
    if (!playerId || playerId !== this.wheelCurrentPlayerId) return;
    if (this.phase !== "playing" || this.wheelTurnPhase !== "action") return;
    this.goSolve();
    if (this.wheelGuessEndsAt != null) {
      await this.ctx.storage.setAlarm(this.wheelGuessEndsAt);
    }
    await this.persist();
    this.broadcastState();
  }

  private async handleWheelSolve(playerId: string | undefined, guessRaw: string): Promise<void> {
    if (!playerId || playerId !== this.wheelCurrentPlayerId) return;
    if (this.phase !== "playing" || this.wheelTurnPhase !== "solve") return;
    if (!this.wheelPuzzle) return;
    const player = this.players.get(playerId);
    if (!player) return;
    const guess = normalizeGuess(guessRaw);
    if (!guess) return;
    this.wheelGuessEndsAt = null;
    if (guess === this.wheelPuzzle.answer) {
      await this.completeWheelSolve(player);
      return;
    }
    this.advanceWheelSeat();
    await this.persist();
    this.broadcastState();
  }

  private async completeWheelSolve(player: PlayerRecord): Promise<void> {
    if (!this.wheelPuzzle) return;
    for (const ch of this.wheelPuzzle.answer) {
      if (ch !== " ") this.wheelRevealed.add(ch);
    }
    const banked = bankRoundIntoTotal(player.wheelTotalScore, player.wheelRoundBank);
    player.wheelTotalScore = banked.totalScore;
    player.wheelRoundBank = banked.roundBank;
    this.wheelLastSolverId = player.id;
    this.wheelLastSolverName = player.name;
    this.wheelTurnPhase = null;
    this.wheelPendingCash = null;
    this.wheelGuessEndsAt = null;
    this.wheelVowelFree = false;
    this.phase = "between";
    this.countdownEndsAt = Date.now() + WHEEL_BETWEEN_MS;
    await this.ctx.storage.setAlarm(this.countdownEndsAt);
    await this.persist();
    this.broadcastState();
  }

  private async advanceWheelAfterBetween(): Promise<void> {
    this.countdownEndsAt = null;
    const nextIndex = this.wheelRoundIndex + 1;
    if (nextIndex >= this.wheelRoundCount) {
      this.finishWheelGame();
      await this.persist();
      this.broadcastState();
      return;
    }
    this.beginWheelRound(nextIndex);
    this.phase = "playing";
    await this.ctx.storage.deleteAlarm();
    await this.persist();
    this.broadcastState();
  }

  private finishWheelGame(): void {
    this.phase = "results";
    this.wheelTurnPhase = null;
    this.wheelCurrentPlayerId = null;
    this.wheelPendingCash = null;
    this.wheelLastSpin = null;
    let best = -1;
    const winners: string[] = [];
    for (const p of this.players.values()) {
      if (p.wheelTotalScore > best) {
        best = p.wheelTotalScore;
        winners.length = 0;
        winners.push(p.id);
      } else if (p.wheelTotalScore === best) {
        winners.push(p.id);
      }
    }
    this.wheelWinners = winners;
  }

  private wheelSnapshot(): WheelRoomState {
    const players: WheelPlayerPublic[] = [...this.players.values()].map((p) => ({
      id: p.id,
      name: p.name,
      isHost: p.isHost,
      roundBank: p.wheelRoundBank,
      totalScore: p.wheelTotalScore,
      freeSpins: p.wheelFreeSpins,
      insurance: p.wheelInsurance,
    }));
    const results: WheelPlayerResult[] =
      this.phase === "results"
        ? [...this.players.values()]
            .map((p) => ({
              id: p.id,
              name: p.name,
              totalScore: p.wheelTotalScore,
            }))
            .sort((a, b) => b.totalScore - a.totalScore)
        : [];
    const revealAll = this.phase === "between" || this.phase === "results";
    const revealed = revealAll && this.wheelPuzzle
      ? new Set(
          [...this.wheelPuzzle.answer].filter((ch) => ch !== " "),
        )
      : this.wheelRevealed;
    return {
      game: "wheel",
      code: this.code,
      phase: this.phase as WheelPhase,
      turnPhase: this.phase === "playing" ? this.wheelTurnPhase : null,
      roundCount: this.wheelRoundCount,
      roundIndex: this.wheelRoundIndex,
      players,
      currentPlayerId: this.wheelCurrentPlayerId,
      puzzle: this.wheelPuzzle ? toPublicPuzzle(this.wheelPuzzle, revealed) : null,
      usedLetters: [...this.wheelUsedLetters],
      wedges: WHEEL_WEDGES,
      lastSpin: this.wheelLastSpin,
      pendingCash: this.wheelPendingCash,
      betweenEndsAt: this.phase === "between" ? this.countdownEndsAt : null,
      guessEndsAt: this.phase === "playing" ? this.wheelGuessEndsAt : null,
      jackpot: this.wheelJackpot,
      lastOutcome: this.wheelLastOutcome,
      lastOutcomePlayerName: this.wheelLastOutcomePlayerName,
      lastSolverId: this.wheelLastSolverId,
      lastSolverName: this.wheelLastSolverName,
      results,
      winners: this.phase === "results" ? [...this.wheelWinners] : [],
    };
  }

  private publicState():
    | BoggleRoomState
    | ScatterRoomState
    | MmmmsRoomState
    | SpotdiffRoomState
    | SpotItRoomState
    | WheelRoomState
    | TriviaRoomState {
    if (this.gameType === "scattergories") return this.scatterSnapshot();
    if (this.gameType === "mmmms") return this.mmmmsSnapshot();
    if (this.gameType === "spotdiff") return this.spotdiffSnapshot(null);
    if (this.gameType === "spot-it") return this.spotItSnapshot();
    if (this.gameType === "wheel") return this.wheelSnapshot();
    if (this.gameType === "trivia") return this.triviaSnapshot();
    return this.boggleSnapshot();
  }

  private triviaSnapshot(): TriviaRoomState {
    this.trivia.syncSeatsFrom(this.players.values());
    return this.trivia.snapshot(this.code);
  }

  private send(ws: WebSocket, msg: ServerMessage): void {
    try {
      ws.send(JSON.stringify(msg));
    } catch {
      /* socket gone */
    }
  }

  private broadcastBadgeEvent(bonuses: BonusId[]): void {
    if (bonuses.length === 0) return;
    const payload = JSON.stringify({
      type: "badgeEvent",
      bonuses,
      at: Date.now(),
    } satisfies BoggleServerMessage);
    for (const socket of this.ctx.getWebSockets()) {
      try {
        socket.send(payload);
      } catch {
        /* ignore */
      }
    }
  }

  private broadcastState(except?: WebSocket): void {
    if (this.gameType === "mmmms") {
      const state = this.mmmmsSnapshot();
      for (const socket of this.ctx.getWebSockets()) {
        if (except && socket === except) continue;
        try {
          const att = socket.deserializeAttachment() as Attachment | null;
          const player = att?.playerId ? this.players.get(att.playerId) : undefined;
          const payload = JSON.stringify({
            type: "state",
            state,
            myOrbs: player ? [...player.orbs] : undefined,
          } satisfies MmmmsServerMessage);
          socket.send(payload);
        } catch {
          /* ignore */
        }
      }
      return;
    }

    if (this.gameType === "spotdiff") {
      for (const socket of this.ctx.getWebSockets()) {
        if (except && socket === except) continue;
        try {
          const att = socket.deserializeAttachment() as Attachment | null;
          const player = att?.playerId && !att.spectator ? this.players.get(att.playerId) : undefined;
          const payload = JSON.stringify({
            type: "state",
            state: this.spotdiffSnapshot(att?.playerId ?? null),
            myFoundDiffIds: player ? [...player.foundDiffIds] : undefined,
            lockedUntil: player?.lockedUntil ?? null,
          } satisfies SpotdiffServerMessage);
          socket.send(payload);
        } catch {
          /* ignore */
        }
      }
      return;
    }

    if (this.gameType === "spot-it") {
      const state = this.spotItSnapshot();
      for (const socket of this.ctx.getWebSockets()) {
        if (except && socket === except) continue;
        try {
          const att = socket.deserializeAttachment() as Attachment | null;
          const player = att?.playerId && !att.spectator ? this.players.get(att.playerId) : undefined;
          const payload = JSON.stringify({
            type: "state",
            state,
            myCard: player ? this.spotItMyCard(player.id) : null,
            lockedUntil: player?.lockedUntil ?? null,
          } satisfies SpotItServerMessage);
          socket.send(payload);
        } catch {
          /* ignore */
        }
      }
      return;
    }

    if (this.gameType === "wheel") {
      const state = this.wheelSnapshot();
      const payload = JSON.stringify({ type: "state", state } satisfies WheelServerMessage);
      for (const socket of this.ctx.getWebSockets()) {
        if (except && socket === except) continue;
        try {
          socket.send(payload);
        } catch {
          /* ignore */
        }
      }
      return;
    }

    if (this.gameType === "trivia") {
      const state = this.triviaSnapshot();
      const payload = JSON.stringify({ type: "state", state } satisfies TriviaServerMessage);
      for (const socket of this.ctx.getWebSockets()) {
        if (except && socket === except) continue;
        try {
          socket.send(payload);
        } catch {
          /* ignore */
        }
      }
      return;
    }

    const state = this.publicState();
    const payload = JSON.stringify({ type: "state", state });
    for (const socket of this.ctx.getWebSockets()) {
      if (except && socket === except) continue;
      try {
        socket.send(payload);
      } catch {
        /* ignore */
      }
    }
  }
}

function randomSeed(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0]!;
}

function padAnswers(raw: string[] | undefined, playMode: ScatterPlayMode = "categories"): string[] {
  if (playMode === "hunt") {
    if (!raw) return [];
    return raw
      .slice(0, HUNT_MAX_ANSWERS)
      .map((a) => (typeof a === "string" ? a : ""));
  }
  const out = emptyAnswers();
  if (!raw) return out;
  for (let i = 0; i < CATEGORIES_PER_LIST; i++) {
    out[i] = typeof raw[i] === "string" ? raw[i]! : "";
  }
  return out;
}

function padRejected(raw: boolean[] | undefined): boolean[] {
  const out = emptyRejected();
  if (!raw) return out;
  for (let i = 0; i < CATEGORIES_PER_LIST; i++) {
    out[i] = Boolean(raw[i]);
  }
  return out;
}

function padHuntRejected(raw: boolean[] | undefined, answerLen: number): boolean[] {
  return Array.from({ length: answerLen }, (_, i) => Boolean(raw?.[i]));
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0.5;
  return Math.min(1, Math.max(0, n));
}

function padFindMarks(raw: HuntMark[] | undefined, answerLen: number): HuntMark[] {
  return Array.from({ length: answerLen }, (_, i) => {
    const m = raw?.[i];
    if (m && typeof m.x === "number" && typeof m.y === "number") {
      return { x: clamp01(m.x), y: clamp01(m.y) };
    }
    return { x: 0.5, y: 0.5 };
  });
}
