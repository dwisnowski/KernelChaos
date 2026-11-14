import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loadResumeId, saveResumeId } from "../lib/playerResume.ts";
import type {
  MmmmsClientMessage,
  MmmmsPlayerPublic,
  MmmmsRoomState,
  MmmmsServerMessage,
  OrbColor,
  OrbCount,
} from "../mmmmsTypes.ts";

interface Options {
  code: string | null;
  role?: "player" | "spectator";
  onError?: (message: string) => void;
}

export function useMmmmsRoom({ code, role = "player", onError }: Options) {
  const [state, setState] = useState<MmmmsRoomState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [myOrbs, setMyOrbs] = useState<OrbColor[] | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pendingJoin = useRef<string | null>(null);
  const pendingSpectate = useRef(false);
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const send = useCallback((msg: MmmmsClientMessage) => {
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
        ws.send(JSON.stringify({ type: "spectate" } satisfies MmmmsClientMessage));
      } else if (pendingJoin.current) {
        const resumeId = loadResumeId(code) ?? undefined;
        ws.send(
          JSON.stringify({
            type: "join",
            name: pendingJoin.current,
            resumeId,
          } satisfies MmmmsClientMessage),
        );
        pendingJoin.current = null;
      }
    });

    ws.addEventListener("message", (ev) => {
      let msg: MmmmsServerMessage;
      try {
        msg = JSON.parse(String(ev.data)) as MmmmsServerMessage;
      } catch {
        return;
      }
      if (msg.type === "welcome") {
        if (!msg.state || msg.state.game !== "mmmms") {
          onErrorRef.current?.("This room is not an M&Ms Smash game");
          return;
        }
        setPlayerId(msg.playerId || null);
        if (msg.playerId && code) saveResumeId(code, msg.playerId);
        setState(msg.state);
        if (msg.myOrbs) setMyOrbs([...msg.myOrbs]);
        else if (msg.state.phase === "lobby") setMyOrbs(null);
      } else if (msg.type === "state") {
        if (!msg.state || msg.state.game !== "mmmms") {
          onErrorRef.current?.("This room is not an M&Ms Smash game");
          return;
        }
        setState(msg.state);
        if (msg.myOrbs) setMyOrbs([...msg.myOrbs]);
        else if (msg.state.phase === "lobby") setMyOrbs(null);
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

  const setOrbCount = useCallback(
    (orbCount: OrbCount) => send({ type: "setOrbCount", orbCount }),
    [send],
  );
  const start = useCallback(() => send({ type: "start" }), [send]);
  const reorder = useCallback((orbs: OrbColor[]) => send({ type: "reorder", orbs }), [send]);
  const submitOrder = useCallback(() => send({ type: "submitOrder" }), [send]);
  const guessColor = useCallback((color: OrbColor) => send({ type: "guessColor", color }), [send]);
  const attackColor = useCallback((color: OrbColor) => send({ type: "attackColor", color }), [send]);
  const resolveDone = useCallback(() => send({ type: "resolveDone" }), [send]);
  const playAgain = useCallback(() => send({ type: "playAgain" }), [send]);

  const me: MmmmsPlayerPublic | null = useMemo(() => {
    if (!state || !playerId) return null;
    return state.players.find((p) => p.id === playerId) ?? null;
  }, [playerId, state]);

  return {
    state,
    playerId,
    me,
    connected,
    myOrbs,
    setMyOrbs,
    join,
    spectate,
    setOrbCount,
    start,
    reorder,
    submitOrder,
    guessColor,
    attackColor,
    resolveDone,
    playAgain,
  };
}
