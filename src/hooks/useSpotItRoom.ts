import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loadResumeId, saveResumeId } from "../lib/playerResume.ts";
import type {
  SpotItCardView,
  SpotItClientMessage,
  SpotItMode,
  SpotItPackId,
  SpotItPlayerPublic,
  SpotItRoomState,
  SpotItServerMessage,
  SpotItTarget,
} from "../spotItTypes.ts";

interface Options {
  code: string | null;
  role?: "player" | "spectator";
  onError?: (message: string) => void;
  onTapResult?: (hit: boolean) => void;
}

export function useSpotItRoom({ code, role = "player", onError, onTapResult }: Options) {
  const [state, setState] = useState<SpotItRoomState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [myCard, setMyCard] = useState<SpotItCardView | null>(null);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pendingJoin = useRef<string | null>(null);
  const pendingSpectate = useRef(false);
  const onErrorRef = useRef(onError);
  const onTapResultRef = useRef(onTapResult);
  onErrorRef.current = onError;
  onTapResultRef.current = onTapResult;

  const send = useCallback((msg: SpotItClientMessage) => {
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
        ws.send(JSON.stringify({ type: "spectate" } satisfies SpotItClientMessage));
      } else if (pendingJoin.current) {
        const resumeId = loadResumeId(code) ?? undefined;
        ws.send(
          JSON.stringify({
            type: "join",
            name: pendingJoin.current,
            resumeId,
          } satisfies SpotItClientMessage),
        );
        pendingJoin.current = null;
      }
    });

    ws.addEventListener("message", (ev) => {
      let msg: SpotItServerMessage;
      try {
        msg = JSON.parse(String(ev.data)) as SpotItServerMessage;
      } catch {
        return;
      }
      if (msg.type === "welcome") {
        if (!msg.state || msg.state.game !== "spot-it") {
          onErrorRef.current?.("This room is not a Spot It game");
          return;
        }
        setPlayerId(msg.playerId || null);
        if (msg.playerId && code) saveResumeId(code, msg.playerId);
        setState(msg.state);
        setMyCard(msg.myCard ?? null);
        setLockedUntil(msg.lockedUntil ?? null);
      } else if (msg.type === "state") {
        if (!msg.state || msg.state.game !== "spot-it") {
          onErrorRef.current?.("This room is not a Spot It game");
          return;
        }
        setState(msg.state);
        if (msg.myCard !== undefined) setMyCard(msg.myCard);
        if (msg.state.phase === "lobby") setMyCard(null);
        if (msg.lockedUntil !== undefined) setLockedUntil(msg.lockedUntil);
      } else if (msg.type === "tapResult") {
        if (msg.lockedUntil !== undefined) setLockedUntil(msg.lockedUntil);
        onTapResultRef.current?.(msg.hit);
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

  const setSpotItMode = useCallback(
    (spotItMode: SpotItMode) => send({ type: "setSpotItMode", spotItMode }),
    [send],
  );
  const setSpotItTarget = useCallback(
    (targetScore: SpotItTarget) => send({ type: "setSpotItTarget", targetScore }),
    [send],
  );
  const setSpotItPack = useCallback(
    (packId: SpotItPackId) => send({ type: "setSpotItPack", packId }),
    [send],
  );
  const start = useCallback(() => send({ type: "start" }), [send]);
  const tapSymbol = useCallback(
    (symbolIndex: number) => send({ type: "tapSymbol", symbolIndex }),
    [send],
  );
  const playAgain = useCallback(() => send({ type: "playAgain" }), [send]);

  const me: SpotItPlayerPublic | null = useMemo(() => {
    if (!state || !playerId) return null;
    return state.players.find((p) => p.id === playerId) ?? null;
  }, [playerId, state]);

  return {
    state,
    playerId,
    me,
    connected,
    myCard,
    lockedUntil,
    join,
    spectate,
    setSpotItMode,
    setSpotItTarget,
    setSpotItPack,
    start,
    tapSymbol,
    playAgain,
  };
}
