import { useCallback, useEffect, useRef, useState } from "react";
import type {
  PackTier,
  ScatterClientMessage,
  ScatterRoundSeconds,
  ScatterRoomState,
  ScatterServerMessage,
} from "../scatterTypes.ts";

interface Options {
  code: string | null;
  role?: "player" | "spectator";
  onError?: (message: string) => void;
}

export function useScattergoriesRoom({ code, role = "player", onError }: Options) {
  const [state, setState] = useState<ScatterRoomState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const pendingJoin = useRef<string | null>(null);
  const pendingSpectate = useRef(false);
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const send = useCallback((msg: ScatterClientMessage) => {
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
        ws.send(JSON.stringify({ type: "spectate" } satisfies ScatterClientMessage));
      } else if (pendingJoin.current) {
        ws.send(
          JSON.stringify({ type: "join", name: pendingJoin.current } satisfies ScatterClientMessage),
        );
        pendingJoin.current = null;
      }
    });

    ws.addEventListener("message", (ev) => {
      let msg: ScatterServerMessage;
      try {
        msg = JSON.parse(String(ev.data)) as ScatterServerMessage;
      } catch {
        return;
      }
      if (msg.type === "welcome") {
        if (!msg.state || msg.state.game !== "scattergories") {
          onErrorRef.current?.("This room is not a Scattergories game");
          return;
        }
        setPlayerId(msg.playerId || null);
        setState(msg.state);
      } else if (msg.type === "state") {
        if (!msg.state || msg.state.game !== "scattergories") {
          onErrorRef.current?.("This room is not a Scattergories game");
          return;
        }
        setState(msg.state);
      } else if (msg.type === "error") {
        onErrorRef.current?.(msg.message);
      }
    });

    ws.addEventListener("close", () => setConnected(false));

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

  const setPackTier = useCallback(
    (packTier: PackTier) => send({ type: "setPackTier", packTier }),
    [send],
  );
  const setRoundSeconds = useCallback(
    (roundSeconds: ScatterRoundSeconds) => send({ type: "setRoundSeconds", roundSeconds }),
    [send],
  );
  const start = useCallback(() => send({ type: "start" }), [send]);
  const playAgain = useCallback(() => send({ type: "playAgain" }), [send]);
  const submitAnswers = useCallback(
    (answers: string[]) => send({ type: "submitAnswers", answers }),
    [send],
  );
  const reviewNext = useCallback(() => send({ type: "reviewNext" }), [send]);
  const reviewPrev = useCallback(() => send({ type: "reviewPrev" }), [send]);
  const submitReviewVotes = useCallback(
    (votes: Record<string, "in" | "out">) => send({ type: "submitReviewVotes", votes }),
    [send],
  );
  const finishReview = useCallback(() => send({ type: "finishReview" }), [send]);

  const me = state?.players.find((p) => p.id === playerId) ?? null;

  return {
    state,
    playerId,
    me,
    connected,
    join,
    spectate,
    setPackTier,
    setRoundSeconds,
    start,
    playAgain,
    submitAnswers,
    reviewNext,
    reviewPrev,
    submitReviewVotes,
    finishReview,
  };
}
