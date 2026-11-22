import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loadResumeId, saveResumeId } from "../lib/playerResume.ts";
import type {
  WheelClientMessage,
  WheelPlayerPublic,
  WheelRoomState,
  WheelRoundCount,
  WheelServerMessage,
} from "../wheelTypes.ts";

interface Options {
  code: string | null;
  role?: "player" | "spectator";
  onError?: (message: string) => void;
}

export function useWheelRoom({ code, role = "player", onError }: Options) {
  const [state, setState] = useState<WheelRoomState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const pendingJoin = useRef<string | null>(null);
  const pendingSpectate = useRef(false);
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const send = useCallback((msg: WheelClientMessage) => {
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
        ws.send(JSON.stringify({ type: "spectate" } satisfies WheelClientMessage));
      } else if (pendingJoin.current) {
        const resumeId = loadResumeId(code) ?? undefined;
        ws.send(
          JSON.stringify({
            type: "join",
            name: pendingJoin.current,
            resumeId,
          } satisfies WheelClientMessage),
        );
        pendingJoin.current = null;
      }
    });

    ws.addEventListener("message", (ev) => {
      let msg: WheelServerMessage;
      try {
        msg = JSON.parse(String(ev.data)) as WheelServerMessage;
      } catch {
        return;
      }
      if (msg.type === "welcome") {
        if (!msg.state || msg.state.game !== "wheel") {
          onErrorRef.current?.("This room is not a Chaos Wheel game");
          return;
        }
        setPlayerId(msg.playerId || null);
        if (msg.playerId && code) saveResumeId(code, msg.playerId);
        setState(msg.state);
      } else if (msg.type === "state") {
        if (!msg.state || msg.state.game !== "wheel") {
          onErrorRef.current?.("This room is not a Chaos Wheel game");
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
      const resumeId = code ? loadResumeId(code) ?? undefined : undefined;
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        send({ type: "join", name, resumeId });
      } else {
        pendingJoin.current = name;
      }
    },
    [code, send],
  );

  const spectate = useCallback(() => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      send({ type: "spectate" });
    } else {
      pendingSpectate.current = true;
    }
  }, [send]);

  const setWheelRounds = useCallback(
    (roundCount: WheelRoundCount) => send({ type: "setWheelRounds", roundCount }),
    [send],
  );
  const start = useCallback(() => send({ type: "start" }), [send]);
  const spin = useCallback(() => send({ type: "spin" }), [send]);
  const guessLetter = useCallback(
    (letter: string) => send({ type: "guessLetter", letter }),
    [send],
  );
  const buyVowel = useCallback(() => send({ type: "buyVowel" }), [send]);
  const chooseSolve = useCallback(() => send({ type: "chooseSolve" }), [send]);
  const solve = useCallback((guess: string) => send({ type: "solve", guess }), [send]);
  const playAgain = useCallback(() => send({ type: "playAgain" }), [send]);

  const me: WheelPlayerPublic | null = useMemo(() => {
    if (!state || !playerId) return null;
    return state.players.find((p) => p.id === playerId) ?? null;
  }, [playerId, state]);

  return {
    state,
    playerId,
    me,
    connected,
    join,
    spectate,
    setWheelRounds,
    start,
    spin,
    guessLetter,
    buyVowel,
    chooseSolve,
    solve,
    playAgain,
  };
}
