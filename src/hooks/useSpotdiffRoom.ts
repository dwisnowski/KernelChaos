import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loadResumeId, saveResumeId } from "../lib/playerResume.ts";
import type {
  SpotDiffCount,
  SpotDifficulty,
  SpotPlayMode,
  SpotRoundSeconds,
  SpotdiffClientMessage,
  SpotdiffPlayerPublic,
  SpotdiffRoomState,
  SpotdiffServerMessage,
} from "../spotdiffTypes.ts";

interface Options {
  code: string | null;
  role?: "player" | "spectator";
  onError?: (message: string) => void;
  onTapResult?: (hit: boolean) => void;
}

export function useSpotdiffRoom({ code, role = "player", onError, onTapResult }: Options) {
  const [state, setState] = useState<SpotdiffRoomState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [myFoundDiffIds, setMyFoundDiffIds] = useState<string[]>([]);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pendingJoin = useRef<string | null>(null);
  const pendingSpectate = useRef(false);
  const onErrorRef = useRef(onError);
  const onTapResultRef = useRef(onTapResult);
  onErrorRef.current = onError;
  onTapResultRef.current = onTapResult;

  const send = useCallback((msg: SpotdiffClientMessage) => {
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
        ws.send(JSON.stringify({ type: "spectate" } satisfies SpotdiffClientMessage));
      } else if (pendingJoin.current) {
        const resumeId = loadResumeId(code) ?? undefined;
        ws.send(
          JSON.stringify({
            type: "join",
            name: pendingJoin.current,
            resumeId,
          } satisfies SpotdiffClientMessage),
        );
        pendingJoin.current = null;
      }
    });

    ws.addEventListener("message", (ev) => {
      let msg: SpotdiffServerMessage;
      try {
        msg = JSON.parse(String(ev.data)) as SpotdiffServerMessage;
      } catch {
        return;
      }
      if (msg.type === "welcome") {
        if (!msg.state || msg.state.game !== "spotdiff") {
          onErrorRef.current?.("This room is not a Spot the Difference game");
          return;
        }
        setPlayerId(msg.playerId || null);
        if (msg.playerId && code) saveResumeId(code, msg.playerId);
        setState(msg.state);
        setMyFoundDiffIds(msg.myFoundDiffIds ? [...msg.myFoundDiffIds] : []);
        setLockedUntil(msg.lockedUntil ?? null);
      } else if (msg.type === "state") {
        if (!msg.state || msg.state.game !== "spotdiff") {
          onErrorRef.current?.("This room is not a Spot the Difference game");
          return;
        }
        setState(msg.state);
        if (msg.myFoundDiffIds) setMyFoundDiffIds([...msg.myFoundDiffIds]);
        else if (msg.state.phase === "lobby") setMyFoundDiffIds([]);
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

  const setSpotMode = useCallback(
    (spotMode: SpotPlayMode) => send({ type: "setSpotMode", spotMode }),
    [send],
  );
  const setSpotTimer = useCallback(
    (roundSeconds: SpotRoundSeconds) => send({ type: "setSpotTimer", roundSeconds }),
    [send],
  );
  const setSpotDiffCount = useCallback(
    (diffCount: SpotDiffCount) => send({ type: "setSpotDiffCount", diffCount }),
    [send],
  );
  const setSpotDifficulty = useCallback(
    (difficulty: SpotDifficulty) => send({ type: "setSpotDifficulty", difficulty }),
    [send],
  );
  const start = useCallback(() => send({ type: "start" }), [send]);
  const tapDiff = useCallback((x: number, y: number) => send({ type: "tapDiff", x, y }), [send]);
  const requestHint = useCallback(() => send({ type: "requestHint" }), [send]);
  const playAgain = useCallback(() => send({ type: "playAgain" }), [send]);

  const me: SpotdiffPlayerPublic | null = useMemo(() => {
    if (!state || !playerId) return null;
    return state.players.find((p) => p.id === playerId) ?? null;
  }, [playerId, state]);

  return {
    state,
    playerId,
    me,
    connected,
    myFoundDiffIds,
    lockedUntil,
    join,
    spectate,
    setSpotMode,
    setSpotTimer,
    setSpotDiffCount,
    setSpotDifficulty,
    start,
    tapDiff,
    requestHint,
    playAgain,
  };
}
