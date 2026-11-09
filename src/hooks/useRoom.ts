import { useCallback, useEffect, useRef, useState } from "react";
import type {
  BoardSize,
  BonusId,
  ClientMessage,
  RoundSeconds,
  RoomState,
  ServerMessage,
} from "../types.ts";

export interface FoundWord {
  word: string;
  points: number;
  bonuses: BonusId[];
}

export interface BadgeFeedItem {
  id: string;
  bonuses: BonusId[];
  at: number;
}

interface UseRoomOptions {
  code: string | null;
  /** Default `player` — spectator joins without a name and never submits words. */
  role?: "player" | "spectator";
  onWordResult?: (
    ok: boolean,
    word?: string,
    points?: number,
    reason?: string,
    bonuses?: BonusId[],
  ) => void;
  onBadgeEvent?: (bonuses: BonusId[], at: number) => void;
  onError?: (message: string) => void;
}

const MAX_BADGE_FEED = 16;

export function useRoom({
  code,
  role = "player",
  onWordResult,
  onBadgeEvent,
  onError,
}: UseRoomOptions) {
  const [state, setState] = useState<RoomState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [myWords, setMyWords] = useState<FoundWord[]>([]);
  const [badgeFeed, setBadgeFeed] = useState<BadgeFeedItem[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const pendingJoin = useRef<string | null>(null);
  const pendingSpectate = useRef(false);
  const playerIdRef = useRef<string | null>(null);
  const onWordResultRef = useRef(onWordResult);
  const onBadgeEventRef = useRef(onBadgeEvent);
  const onErrorRef = useRef(onError);
  const badgeSeq = useRef(0);
  onWordResultRef.current = onWordResult;
  onBadgeEventRef.current = onBadgeEvent;
  onErrorRef.current = onError;
  playerIdRef.current = playerId;

  const send = useCallback((msg: ClientMessage) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg));
    }
  }, []);

  useEffect(() => {
    if (!code) return;

    const protocol = location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${location.host}/api/room/${code}`);
    wsRef.current = ws;

    ws.addEventListener("open", () => {
      setConnected(true);
      if (role === "spectator" || pendingSpectate.current) {
        pendingSpectate.current = false;
        ws.send(JSON.stringify({ type: "spectate" } satisfies ClientMessage));
      } else if (pendingJoin.current) {
        ws.send(JSON.stringify({ type: "join", name: pendingJoin.current } satisfies ClientMessage));
        pendingJoin.current = null;
      }
    });

    ws.addEventListener("message", (ev) => {
      let msg: ServerMessage;
      try {
        msg = JSON.parse(String(ev.data)) as ServerMessage;
      } catch {
        return;
      }
      if (msg.type === "welcome") {
        setPlayerId(msg.playerId || null);
        playerIdRef.current = msg.playerId || null;
        setState(msg.state);
        setMyWords([]);
        if (msg.state.phase === "lobby" || msg.state.phase === "countdown") {
          setBadgeFeed([]);
        }
      } else if (msg.type === "state") {
        setState(msg.state);
        if (msg.state.phase === "lobby" || msg.state.phase === "countdown") {
          setMyWords([]);
          setBadgeFeed([]);
        } else if (msg.state.phase === "results" && msg.state.results) {
          const id = playerIdRef.current;
          const mine = id ? msg.state.results.find((r) => r.id === id) : null;
          if (mine) {
            setMyWords(
              mine.words.map((w) => ({
                word: w.word,
                points: w.points,
                bonuses: w.bonuses,
              })),
            );
          }
        }
      } else if (msg.type === "wordResult") {
        if (msg.ok && msg.word && msg.points != null) {
          const bonuses = msg.bonuses ?? [];
          setMyWords((prev) =>
            prev.some((w) => w.word === msg.word)
              ? prev
              : [...prev, { word: msg.word!, points: msg.points!, bonuses }],
          );
        }
        onWordResultRef.current?.(msg.ok, msg.word, msg.points, msg.reason, msg.bonuses);
      } else if (msg.type === "badgeEvent") {
        badgeSeq.current += 1;
        const item: BadgeFeedItem = {
          id: `${msg.at}-${badgeSeq.current}`,
          bonuses: msg.bonuses,
          at: msg.at,
        };
        setBadgeFeed((prev) => [item, ...prev].slice(0, MAX_BADGE_FEED));
        onBadgeEventRef.current?.(msg.bonuses, msg.at);
      } else if (msg.type === "error") {
        onErrorRef.current?.(msg.message);
      }
    });

    ws.addEventListener("close", () => {
      setConnected(false);
    });

    return () => {
      ws.close();
      wsRef.current = null;
      setConnected(false);
    };
  }, [code, role]);

  const join = useCallback(
    (name: string) => {
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        send({ type: "join", name });
      } else {
        pendingJoin.current = name;
      }
    },
    [send],
  );

  const spectate = useCallback(() => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      send({ type: "spectate" });
    } else {
      pendingSpectate.current = true;
    }
  }, [send]);

  const setBoardSize = useCallback(
    (boardSize: BoardSize) => send({ type: "setBoardSize", boardSize }),
    [send],
  );

  const setRoundSeconds = useCallback(
    (roundSeconds: RoundSeconds) => send({ type: "setRoundSeconds", roundSeconds }),
    [send],
  );

  const start = useCallback(() => send({ type: "start" }), [send]);
  const playAgain = useCallback(() => send({ type: "playAgain" }), [send]);
  const submitWord = useCallback(
    (path: number[]) => send({ type: "submitWord", path }),
    [send],
  );

  const me = state?.players.find((p) => p.id === playerId) ?? null;

  return {
    state,
    playerId,
    me,
    connected,
    myWords,
    badgeFeed,
    join,
    spectate,
    setBoardSize,
    setRoundSeconds,
    start,
    playAgain,
    submitWord,
  };
}
