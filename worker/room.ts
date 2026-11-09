import { DurableObject } from "cloudflare:workers";
import { generateBoard, type BoardSize } from "./boggle/dice.ts";
import { isDictionaryWord } from "./boggle/dictionary.ts";
import { isValidPath, pathToWord } from "./boggle/path.ts";
import {
  COUNTDOWN_MS,
  MIN_WORD_LEN,
  ROUND_MS,
  type ClientMessage,
  type Phase,
  type PlayerPublic,
  type PlayerResult,
  type RoomState,
  type ServerMessage,
} from "./boggle/protocol.ts";
import { scoreWord } from "./boggle/scoring.ts";

interface PlayerRecord {
  id: string;
  name: string;
  isHost: boolean;
  words: Map<string, number>;
}

interface Attachment {
  playerId: string;
}

function isBoardSize(n: unknown): n is BoardSize {
  return n === 4 || n === 5 || n === 6;
}

export class GameRoom extends DurableObject<Env> {
  private code = "";
  private phase: Phase = "lobby";
  private boardSize: BoardSize = 4;
  private board: string[] | null = null;
  private countdownEndsAt: number | null = null;
  private endsAt: number | null = null;
  private round = 0;
  private players = new Map<string, PlayerRecord>();
  private loaded = false;

  private async ensureLoaded(): Promise<void> {
    if (this.loaded) return;
    const stored = await this.ctx.storage.get<{
      code: string;
      phase: Phase;
      boardSize: BoardSize;
      board: string[] | null;
      countdownEndsAt: number | null;
      endsAt: number | null;
      round: number;
      players: {
        id: string;
        name: string;
        isHost: boolean;
        words: [string, number][];
      }[];
    }>("room");
    if (stored) {
      this.code = stored.code;
      this.phase = stored.phase;
      this.boardSize = stored.boardSize;
      this.board = stored.board;
      this.countdownEndsAt = stored.countdownEndsAt;
      this.endsAt = stored.endsAt;
      this.round = stored.round;
      this.players = new Map(
        stored.players.map((p) => [
          p.id,
          {
            id: p.id,
            name: p.name,
            isHost: p.isHost,
            words: new Map(p.words),
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
      board: this.board,
      countdownEndsAt: this.countdownEndsAt,
      endsAt: this.endsAt,
      round: this.round,
      players: [...this.players.values()].map((p) => ({
        id: p.id,
        name: p.name,
        isHost: p.isHost,
        words: [...p.words.entries()],
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
      this.endsAt = now + ROUND_MS;
      await this.ctx.storage.setAlarm(this.endsAt);
      await this.persist();
      this.broadcastState();
      return;
    }

    if (this.phase === "playing" && this.endsAt != null && now >= this.endsAt) {
      this.phase = "results";
      this.endsAt = null;
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

  private async handleStart(playerId: string | undefined): Promise<void> {
    if (!playerId || !this.isHost(playerId)) return;
    if (this.phase !== "lobby" && this.phase !== "results") return;
    if (this.players.size < 1) return;

    for (const p of this.players.values()) {
      p.words = new Map();
    }

    this.round += 1;
    this.board = generateBoard(this.boardSize);
    this.phase = "countdown";
    this.countdownEndsAt = Date.now() + COUNTDOWN_MS;
    this.endsAt = null;
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
    for (const p of this.players.values()) {
      p.words = new Map();
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

    const points = scoreWord(word);
    player.words.set(word, points);
    await this.persist();
    this.send(ws, { type: "wordResult", ok: true, word, points });
    this.broadcastState();
  }

  private isHost(playerId: string): boolean {
    return this.players.get(playerId)?.isHost === true;
  }

  private publicState(): RoomState {
    const players: PlayerPublic[] = [...this.players.values()].map((p) => ({
      id: p.id,
      name: p.name,
      isHost: p.isHost,
      wordCount: p.words.size,
      score: [...p.words.values()].reduce((a, b) => a + b, 0),
    }));

    let results: PlayerResult[] | null = null;
    let winners: string[] | null = null;

    if (this.phase === "results") {
      results = [...this.players.values()].map((p) => ({
        id: p.id,
        name: p.name,
        isHost: p.isHost,
        wordCount: p.words.size,
        score: [...p.words.values()].reduce((a, b) => a + b, 0),
        words: [...p.words.entries()]
          .map(([word, points]) => ({ word, points }))
          .sort((a, b) => b.points - a.points || a.word.localeCompare(b.word)),
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
