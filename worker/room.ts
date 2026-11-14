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
import { pickList } from "./scattergories/packs.ts";
import {
  CATEGORIES_PER_LIST,
  DEFAULT_SCATTER_ROUND_SECONDS,
  SCATTER_COUNTDOWN_MS,
  SCATTER_ROLL_TIMEOUT_MS,
  isPackTier,
  isScatterRoundSeconds,
  type PackTier,
  type ReviewVote,
  type ScatterClientMessage,
  type ScatterPhase,
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

/** Per-category: voterId → (targetPlayerId → in|out). */
type ReviewBallotMaps = Array<Map<string, Record<string, ReviewVote>>>;
/** Persistable form of ReviewBallotMaps. */
type StoredReviewBallots = Array<Record<string, Record<string, ReviewVote>>>;

export type GameType = "boggle" | "scattergories" | "mmmms";

type AnyPhase = BogglePhase | ScatterPhase | MmmmsPhase;

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
  /** Mmmms: bottom→top stack (index 0 explodes first). */
  orbs: OrbColor[];
  mmmmsReady: boolean;
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
  orbs?: OrbColor[];
  mmmmsReady?: boolean;
}

type ClientMessage = BoggleClientMessage | ScatterClientMessage | MmmmsClientMessage;
type ServerMessage = BoggleServerMessage | ScatterServerMessage | MmmmsServerMessage;

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
  return v === "boggle" || v === "scattergories" || v === "mmmms";
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
  private possibleWordCount: number | null = null;
  private possibleByLength: LengthCount[] | null = null;

  // Scattergories
  private packTier: PackTier = "family";
  private letter: string | null = null;
  private categories: string[] | null = null;
  private listId: string | null = null;
  private usedListIds: string[] = [];
  private rollerId: string | null = null;
  private rollerName: string | null = null;
  private reviewIndex: number | null = null;
  private reviewBallots: ReviewBallotMaps = emptyReviewBallots();
  private rollEndsAt: number | null = null;
  private emptyGraceEndsAt: number | null = null;

  // Mmmms
  private orbCount: OrbCount = DEFAULT_ORB_COUNT;
  private attackerId: string | null = null;
  private defenderId: string | null = null;
  private defenderGuess: OrbColor | null = null;
  private lastAttack: MmmmsAttackResult | null = null;
  private winnerId: string | null = null;
  private resolveAcks = new Set<string>();
  private resolveEndsAt: number | null = null;

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
      possibleWordCount?: number | null;
      possibleByLength?: LengthCount[] | null;
      packTier?: PackTier;
      letter?: string | null;
      categories?: string[] | null;
      listId?: string | null;
      usedListIds?: string[];
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
      this.possibleWordCount = stored.possibleWordCount ?? null;
      this.possibleByLength = stored.possibleByLength ?? null;
      this.packTier = isPackTier(stored.packTier) ? stored.packTier : "family";
      this.letter = stored.letter ?? null;
      this.categories = stored.categories ?? null;
      this.listId = stored.listId ?? null;
      this.usedListIds = stored.usedListIds ?? [];
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
      this.players = new Map(
        stored.players.map((p) => [
          p.id,
          {
            id: p.id,
            name: p.name,
            isHost: p.isHost,
            words: loadWords(p.words),
            roundAwards: p.roundAwards ?? [],
            answers: padAnswers(p.answers),
            hostRejected: padRejected(p.hostRejected),
            orbs: loadOrbs(p.orbs),
            mmmmsReady: Boolean(p.mmmmsReady),
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
      possibleWordCount: this.possibleWordCount,
      possibleByLength: this.possibleByLength,
      packTier: this.packTier,
      letter: this.letter,
      categories: this.categories,
      listId: this.listId,
      usedListIds: this.usedListIds,
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
      players: [...this.players.values()].map((p) => ({
        id: p.id,
        name: p.name,
        isHost: p.isHost,
        words: [...p.words.values()],
        roundAwards: p.roundAwards,
        answers: p.answers,
        hostRejected: p.hostRejected,
        orbs: p.orbs,
        mmmmsReady: p.mmmmsReady,
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
    if (this.phase === "rolling" && this.rollEndsAt != null) {
      candidates.push(this.rollEndsAt);
    }
    if (this.phase === "resolving" && this.resolveEndsAt != null) {
      candidates.push(this.resolveEndsAt);
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
    this.possibleWordCount = null;
    this.possibleByLength = null;
    this.packTier = "family";
    this.letter = null;
    this.categories = null;
    this.listId = null;
    this.usedListIds = [];
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
    this.loaded = true;
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
          p.hostRejected = emptyRejected();
        }
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
      this.send(ws, { type: "error", message: "Mmmms is full (2 players)" });
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
      answers: emptyAnswers(),
      hostRejected: emptyRejected(),
      orbs: [],
      mmmmsReady: false,
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
      } as ServerMessage);
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
    if (!isPackTier(packTier)) return;
    this.packTier = packTier;
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
    } else if (this.players.size < 1) {
      return;
    }

    for (const p of this.players.values()) {
      p.words = new Map();
      p.roundAwards = [];
      p.answers = emptyAnswers();
      p.hostRejected = emptyRejected();
      p.orbs = [];
      p.mmmmsReady = false;
    }
    this.reviewBallots = emptyReviewBallots();

    this.round += 1;
    this.endsAt = null;
    this.scoresFinalized = false;
    this.reviewIndex = null;
    this.winnerId = null;
    this.lastAttack = null;
    this.defenderGuess = null;
    this.resolveAcks = new Set();
    this.resolveEndsAt = null;

    if (this.gameType === "mmmms") {
      this.board = null;
      this.missedWords = null;
      this.possibleWordCount = null;
      this.possibleByLength = null;
      this.letter = null;
      this.categories = null;
      this.listId = null;
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
      this.possibleWordCount = null;
      this.possibleByLength = null;
      this.letter = null;
      this.categories = null;
      this.listId = null;
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
    this.possibleWordCount = null;
    this.possibleByLength = null;
    this.letter = null;
    this.categories = null;
    this.listId = null;
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
    const used = new Set(this.usedListIds);
    const list = pickList(this.packTier, used);
    this.listId = list.id;
    this.categories = list.categories;
    this.letter = letter.toUpperCase();
    this.usedListIds = [...this.usedListIds, list.id];
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
    this.possibleWordCount = null;
    this.possibleByLength = null;
    this.letter = null;
    this.categories = null;
    this.listId = null;
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
    for (const p of this.players.values()) {
      p.words = new Map();
      p.roundAwards = [];
      p.answers = emptyAnswers();
      p.hostRejected = emptyRejected();
      p.orbs = [];
      p.mmmmsReady = false;
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

    const next = emptyAnswers();
    for (let i = 0; i < CATEGORIES_PER_LIST; i++) {
      const raw = answers[i];
      next[i] = typeof raw === "string" ? raw.slice(0, 80) : "";
    }
    player.answers = next;
    await this.persist();
    this.broadcastState();
  }

  private async handleReviewNext(playerId: string | undefined): Promise<void> {
    if (!playerId || !this.isHost(playerId) || this.phase !== "review") return;
    const idx = this.reviewIndex ?? 0;
    if (!this.isReviewVotingComplete(idx)) return;
    if (idx >= CATEGORIES_PER_LIST - 1) return;
    this.reviewIndex = idx + 1;
    await this.persist();
    this.broadcastState();
  }

  private async handleReviewPrev(playerId: string | undefined): Promise<void> {
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

    const validTargets = new Set(
      [...this.players.values()]
        .filter((p) => (p.answers[idx] ?? "").trim().length > 0)
        .map((p) => p.id),
    );

    const cleaned: Record<string, ReviewVote> = {};
    for (const targetId of validTargets) {
      cleaned[targetId] = votes[targetId] === "out" ? "out" : "in";
    }

    const map = this.reviewBallots[idx] ?? new Map();
    map.set(playerId, cleaned);
    this.reviewBallots[idx] = map;

    if (this.isReviewVotingComplete(idx)) {
      this.applyReviewMajority(idx);
    }

    await this.persist();
    this.broadcastState();
  }

  private async handleFinishReview(playerId: string | undefined): Promise<void> {
    if (!playerId || !this.isHost(playerId) || this.phase !== "review") return;
    const idx = this.reviewIndex;
    if (idx == null || !this.isReviewVotingComplete(idx)) return;
    this.phase = "results";
    this.reviewIndex = null;
    this.scoresFinalized = true;
    await this.persist();
    this.broadcastState();
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

  private reviewVoteTallies(idx: number, targetId: string): { votesIn: number; votesOut: number } {
    if (!this.isReviewVotingComplete(idx)) return { votesIn: 0, votesOut: 0 };
    const ballots = this.reviewBallots[idx];
    if (!ballots) return { votesIn: 0, votesOut: 0 };
    let votesIn = 0;
    let votesOut = 0;
    for (const ballot of ballots.values()) {
      const v = ballot[targetId];
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
      this.possibleWordCount = coverage.possibleWordCount;
      this.possibleByLength = coverage.possibleByLength;
    } else {
      this.missedWords = [];
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

      // Until ballots are complete, do not apply reject flags to live scores.
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

    let results: ScatterPlayerResult[] | null = null;
    let winners: string[] | null = null;

    if (this.phase === "results" && this.letter) {
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
      results.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
      const top = results[0]?.score ?? 0;
      winners = results.filter((r) => r.score === top && top > 0).map((r) => r.id);
      if (winners.length === 0 && results.length > 0) {
        winners = results.map((r) => r.id);
      }
    }

    const hideRoundSetup = this.phase === "lobby" || this.phase === "rolling";

    return {
      game: "scattergories",
      code: this.code,
      phase: this.phase as ScatterPhase,
      packTier: this.packTier,
      roundSeconds: this.roundSeconds as ScatterRoundSeconds,
      letter: hideRoundSetup ? null : this.letter,
      categories: hideRoundSetup ? null : this.categories,
      listId: hideRoundSetup ? null : this.listId,
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
    let possibleWordCount: number | null = null;
    let possibleByLength: LengthCount[] | null = null;

    if (this.phase === "results") {
      if (
        (this.missedWords == null || this.possibleWordCount == null || this.possibleByLength == null) &&
        this.board
      ) {
        const found = [...this.players.values()].flatMap((p) => [...p.words.keys()]);
        const coverage = computeBoardCoverage(this.board, this.boardSize, found);
        this.missedWords = coverage.missedWords;
        this.possibleWordCount = coverage.possibleWordCount;
        this.possibleByLength = coverage.possibleByLength;
      }
      missedWords = this.missedWords ?? [];
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

  private publicState(): BoggleRoomState | ScatterRoomState | MmmmsRoomState {
    if (this.gameType === "scattergories") return this.scatterSnapshot();
    if (this.gameType === "mmmms") return this.mmmmsSnapshot();
    return this.boggleSnapshot();
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

function padAnswers(raw: string[] | undefined): string[] {
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
