import { DurableObject } from "cloudflare:workers";
import { generateBoard, type BoardSize } from "./boggle/dice.ts";
import { isDictionaryWord } from "./boggle/dictionary.ts";
import { isValidPath, pathToWord } from "./boggle/path.ts";
import {
  COUNTDOWN_MS,
  DEFAULT_ROUND_SECONDS,
  MIN_WORD_LEN,
  isRoundSeconds,
  type ClientMessage,
  type Phase,
  type PlayerPublic,
  type PlayerResult,
  type RoundAward,
  type RoundSeconds,
  type RoomState,
  type ServerMessage,
} from "./boggle/protocol.ts";
import {
  computePoints,
  coveragePoints,
  finalizeWordBonuses,
  rareLetterCount,
  scoreAtSubmit,
  type BonusId,
} from "./boggle/scoring.ts";

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
}

interface Attachment {
  playerId: string;
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

export class GameRoom extends DurableObject<Env> {
  private code = "";
  private phase: Phase = "lobby";
  private boardSize: BoardSize = 4;
  private roundSeconds: RoundSeconds = DEFAULT_ROUND_SECONDS;
  private board: string[] | null = null;
  private countdownEndsAt: number | null = null;
  private endsAt: number | null = null;
  private round = 0;
  private players = new Map<string, PlayerRecord>();
  private globalAcceptCount = 0;
  private lastAccept: { playerId: string; word: string } | null = null;
  private scoresFinalized = false;
  private loaded = false;

  private async ensureLoaded(): Promise<void> {
    if (this.loaded) return;
    const stored = await this.ctx.storage.get<{
      code: string;
      phase: Phase;
      boardSize: BoardSize;
      roundSeconds?: RoundSeconds;
      board: string[] | null;
      countdownEndsAt: number | null;
      endsAt: number | null;
      round: number;
      players: StoredPlayer[];
      globalAcceptCount?: number;
      lastAccept?: { playerId: string; word: string } | null;
      scoresFinalized?: boolean;
    }>("room");
    if (stored) {
      this.code = stored.code;
      this.phase = stored.phase;
      this.boardSize = stored.boardSize;
      this.roundSeconds = isRoundSeconds(stored.roundSeconds)
        ? stored.roundSeconds
        : DEFAULT_ROUND_SECONDS;
      this.board = stored.board;
      this.countdownEndsAt = stored.countdownEndsAt;
      this.endsAt = stored.endsAt;
      this.round = stored.round;
      this.globalAcceptCount = stored.globalAcceptCount ?? 0;
      this.lastAccept = stored.lastAccept ?? null;
      this.scoresFinalized = stored.scoresFinalized ?? this.phase === "results";
      this.players = new Map(
        stored.players.map((p) => [
          p.id,
          {
            id: p.id,
            name: p.name,
            isHost: p.isHost,
            words: loadWords(p.words),
            roundAwards: p.roundAwards ?? [],
          },
        ]),
      );
    }
    this.loaded = true;
  }

  private async persist(): Promise<void> {
    await this.ctx.storage.put("room", {
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
      players: [...this.players.values()].map((p) => ({
        id: p.id,
        name: p.name,
        isHost: p.isHost,
        words: [...p.words.values()],
        roundAwards: p.roundAwards,
      })),
    });
  }

  async fetch(request: Request): Promise<Response> {
    await this.ensureLoaded();
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname.endsWith("/init")) {
      const body = (await request.json()) as { code?: string };
      if (!body.code || !/^[A-Z1-9]{4}$/.test(body.code)) {
        return Response.json({ error: "Invalid code" }, { status: 400 });
      }
      if (!this.code) {
        this.code = body.code;
        await this.persist();
        return Response.json({ code: this.code, created: true });
      }
      return Response.json({ error: "taken", code: this.code }, { status: 409 });
    }

    if (request.headers.get("Upgrade") !== "websocket") {
      return Response.json({ error: "Expected WebSocket" }, { status: 426 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);
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
        await this.handleJoin(ws, msg.name);
        break;
      case "setBoardSize":
        await this.handleSetBoardSize(attachment?.playerId, msg.boardSize);
        break;
      case "setRoundSeconds":
        await this.handleSetRoundSeconds(attachment?.playerId, msg.roundSeconds);
        break;
      case "start":
        await this.handleStart(attachment?.playerId);
        break;
      case "submitWord":
        await this.handleSubmit(ws, attachment?.playerId, msg.path);
        break;
      case "playAgain":
        await this.handlePlayAgain(attachment?.playerId);
        break;
      default:
        this.send(ws, { type: "error", message: "Unknown message" });
    }
  }

  async webSocketClose(ws: WebSocket, _code: number, _reason: string, _wasClean: boolean): Promise<void> {
    await this.ensureLoaded();
    const attachment = ws.deserializeAttachment() as Attachment | null;
    if (!attachment?.playerId) return;

    const player = this.players.get(attachment.playerId);
    if (!player) return;

    // Keep player in room during active round so scores remain; remove from lobby.
    if (this.phase === "lobby") {
      this.players.delete(attachment.playerId);
      if (player.isHost) {
        const next = this.players.values().next().value as PlayerRecord | undefined;
        if (next) next.isHost = true;
      }
      await this.persist();
      this.broadcastState();
    }
  }

  async alarm(): Promise<void> {
    await this.ensureLoaded();
    const now = Date.now();

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
      this.phase = "results";
      this.endsAt = null;
      this.finalizeScores();
      await this.persist();
      this.broadcastState();
    }
  }

  private async handleJoin(ws: WebSocket, rawName: string): Promise<void> {
    const name = rawName.trim().slice(0, 20);
    if (!name) {
      this.send(ws, { type: "error", message: "Enter a name" });
      return;
    }
    if (!this.code) {
      this.send(ws, { type: "error", message: "Room not ready" });
      return;
    }
    if (this.phase !== "lobby" && this.phase !== "results") {
      this.send(ws, { type: "error", message: "Game already in progress" });
      return;
    }

    const existing = ws.deserializeAttachment() as Attachment | null;
    if (existing?.playerId && this.players.has(existing.playerId)) {
      this.send(ws, {
        type: "welcome",
        playerId: existing.playerId,
        state: this.publicState(),
      });
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
    });
    ws.serializeAttachment({ playerId: id } satisfies Attachment);
    await this.persist();
    this.send(ws, { type: "welcome", playerId: id, state: this.publicState() });
    this.broadcastState(ws);
  }

  private async handleSetBoardSize(playerId: string | undefined, boardSize: BoardSize): Promise<void> {
    if (!playerId || !this.isHost(playerId)) {
      return;
    }
    if (this.phase !== "lobby" && this.phase !== "results") return;
    if (!isBoardSize(boardSize)) return;
    this.boardSize = boardSize;
    await this.persist();
    this.broadcastState();
  }

  private async handleSetRoundSeconds(
    playerId: string | undefined,
    roundSeconds: RoundSeconds,
  ): Promise<void> {
    if (!playerId || !this.isHost(playerId)) return;
    if (this.phase !== "lobby" && this.phase !== "results") return;
    if (!isRoundSeconds(roundSeconds)) return;
    this.roundSeconds = roundSeconds;
    await this.persist();
    this.broadcastState();
  }

  private async handleStart(playerId: string | undefined): Promise<void> {
    if (!playerId || !this.isHost(playerId)) return;
    if (this.phase !== "lobby" && this.phase !== "results") return;
    if (this.players.size < 1) return;

    for (const p of this.players.values()) {
      p.words = new Map();
      p.roundAwards = [];
    }

    this.round += 1;
    this.board = generateBoard(this.boardSize);
    this.phase = "countdown";
    this.countdownEndsAt = Date.now() + COUNTDOWN_MS;
    this.endsAt = null;
    this.globalAcceptCount = 0;
    this.lastAccept = null;
    this.scoresFinalized = false;
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
    for (const p of this.players.values()) {
      p.words = new Map();
      p.roundAwards = [];
    }
    await this.ctx.storage.deleteAlarm();
    await this.persist();
    this.broadcastState();
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
  }

  /** Apply unique / last-word / lone-wolf / coverage once when entering results. */
  private finalizeScores(): void {
    if (this.scoresFinalized) return;
    this.scoresFinalized = true;

    const finders = new Map<string, string[]>();
    for (const p of this.players.values()) {
      for (const word of p.words.keys()) {
        const list = finders.get(word) ?? [];
        list.push(p.id);
        finders.set(word, list);
      }
    }

    const last = this.lastAccept;

    for (const p of this.players.values()) {
      for (const rec of p.words.values()) {
        const unique = (finders.get(rec.word)?.length ?? 0) === 1;
        const isLastWord = last != null && last.playerId === p.id && last.word === rec.word;
        const bonuses = finalizeWordBonuses(rec.bonuses, { unique, isLastWord });
        const rareCount = rareLetterCount(rec.word);
        rec.bonuses = bonuses;
        rec.points = computePoints(rec.base, bonuses, rareCount);
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
      }
      const cov = coveragePoints([...p.words.values()].map((w) => w.path));
      if (cov > 0) {
        awards.push({ id: "coverage", points: cov });
      }
      p.roundAwards = awards;
    }
  }

  private playerScore(p: PlayerRecord): number {
    const wordPts = [...p.words.values()].reduce((a, w) => a + w.points, 0);
    const awardPts = p.roundAwards.reduce((a, r) => a + r.points, 0);
    return wordPts + awardPts;
  }

  private isHost(playerId: string): boolean {
    return this.players.get(playerId)?.isHost === true;
  }

  private publicState(): RoomState {
    if (this.phase === "results" && !this.scoresFinalized) {
      this.finalizeScores();
    }

    const players: PlayerPublic[] = [...this.players.values()].map((p) => ({
      id: p.id,
      name: p.name,
      isHost: p.isHost,
      wordCount: p.words.size,
      score: this.playerScore(p),
    }));

    let results: PlayerResult[] | null = null;
    let winners: string[] | null = null;

    if (this.phase === "results") {
      results = [...this.players.values()].map((p) => ({
        id: p.id,
        name: p.name,
        isHost: p.isHost,
        wordCount: p.words.size,
        score: this.playerScore(p),
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
      phase: this.phase,
      boardSize: this.boardSize,
      roundSeconds: this.roundSeconds,
      board: this.phase === "lobby" ? null : this.board,
      countdownEndsAt: this.countdownEndsAt,
      endsAt: this.endsAt,
      players,
      results,
      winners,
      round: this.round,
    };
  }

  private send(ws: WebSocket, msg: ServerMessage): void {
    try {
      ws.send(JSON.stringify(msg));
    } catch {
      /* socket gone */
    }
  }

  private broadcastState(except?: WebSocket): void {
    const payload = JSON.stringify({ type: "state", state: this.publicState() } satisfies ServerMessage);
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
