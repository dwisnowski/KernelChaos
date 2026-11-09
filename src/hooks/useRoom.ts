import { useCallback, useEffect, useRef, useState } from "react";
import type { BoardSize, ClientMessage, RoomState, ServerMessage } from "../types.ts";

export interface FoundWord {
  word: string;
  points: number;
}

interface UseRoomOptions {
  code: string | null;
  onWordResult?: (ok: boolean, word?: string, points?: number, reason?: string) => void;
  onError?: (message: string) => void;
}

export function useRoom({ code, onWordResult, onError }: UseRoomOptions) {
  const [state, setState] = useState<RoomState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [myWords, setMyWords] = useState<FoundWord[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const pendingJoin = useRef<string | null>(null);
  const onWordResultRef = useRef(onWordResult);
  const onErrorRef = useRef(onError);
  onWordResultRef.current = onWordResult;
  onErrorRef.current = onError;

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
      if (pendingJoin.current) {
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
        setPlayerId(msg.playerId);
        setState(msg.state);
        setMyWords([]);
      } else if (msg.type === "state") {
        setState(msg.state);
        if (msg.state.phase === "lobby" || msg.state.phase === "countdown") {
          setMyWords([]);
        }
      } else if (msg.type === "wordResult") {
        if (msg.ok && msg.word && msg.points != null) {
          setMyWords((prev) =>
            prev.some((w) => w.word === msg.word)
              ? prev
              : [...prev, { word: msg.word!, points: msg.points! }],
          );
        }
        onWordResultRef.current?.(msg.ok, msg.word, msg.points, msg.reason);
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
  }, [code]);

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

  const setBoardSize = useCallback(
    (boardSize: BoardSize) => send({ type: "setBoardSize", boardSize }),
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
    join,
    setBoardSize,
    start,
    playAgain,
    submitWord,
  };
}
