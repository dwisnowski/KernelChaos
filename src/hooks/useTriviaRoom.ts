import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loadResumeId, saveResumeId } from "../lib/playerResume.ts";
import type {
  TriviaChaosMode,
  TriviaChaosPower,
  TriviaClientMessage,
  TriviaPackId,
  TriviaPlayerPublic,
  TriviaRoomState,
  TriviaServerMessage,
} from "../triviaTypes.ts";

interface Options {
  code: string | null;
  role?: "player" | "spectator";
  onError?: (message: string) => void;
}

export function useTriviaRoom({ code, role = "player", onError }: Options) {
  const [state, setState] = useState<TriviaRoomState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const pendingJoin = useRef<string | null>(null);
  const pendingSpectate = useRef(false);
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const send = useCallback((msg: TriviaClientMessage) => {
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
        ws.send(JSON.stringify({ type: "spectate" } satisfies TriviaClientMessage));
      } else if (pendingJoin.current) {
        const resumeId = loadResumeId(code) ?? undefined;
        ws.send(
          JSON.stringify({
            type: "join",
            name: pendingJoin.current,
            resumeId,
          } satisfies TriviaClientMessage),
        );
        pendingJoin.current = null;
      }
    });

    ws.addEventListener("message", (ev) => {
      let msg: TriviaServerMessage;
      try {
        msg = JSON.parse(String(ev.data)) as TriviaServerMessage;
      } catch {
        return;
      }
      if (msg.type === "welcome") {
        if (!msg.state || msg.state.game !== "trivia") {
          onErrorRef.current?.("This room is not a Trivia game");
          return;
        }
        setPlayerId(msg.playerId || null);
        if (msg.playerId && code) saveResumeId(code, msg.playerId);
        setState(msg.state);
      } else if (msg.type === "state") {
        if (!msg.state || msg.state.game !== "trivia") {
          onErrorRef.current?.("This room is not a Trivia game");
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

  const setTriviaPack = useCallback(
    (packId: TriviaPackId) => send({ type: "setTriviaPack", packId }),
    [send],
  );
  const setTriviaChaosMode = useCallback(
    (mode: TriviaChaosMode) => send({ type: "setTriviaChaosMode", mode }),
    [send],
  );
  const start = useCallback(() => send({ type: "start" }), [send]);
  const pickCell = useCallback(
    (categoryIndex: number, tier: number) => send({ type: "pickCell", categoryIndex, tier }),
    [send],
  );
  const buzz = useCallback(() => send({ type: "buzz" }), [send]);
  const answer = useCallback(
    (choiceIndex: number) => send({ type: "answer", choiceIndex }),
    [send],
  );
  const setDailyWager = useCallback(
    (amount: number) => send({ type: "setDailyWager", amount }),
    [send],
  );
  const setFinalWager = useCallback(
    (amount: number) => send({ type: "setFinalWager", amount }),
    [send],
  );
  const finalAnswer = useCallback(
    (choiceIndex: number) => send({ type: "finalAnswer", choiceIndex }),
    [send],
  );
  const solveChaos = useCallback(
    (choiceIndex: number) => send({ type: "solveChaos", choiceIndex }),
    [send],
  );
  const useChaos = useCallback(
    (power: TriviaChaosPower, targetPlayerId?: string) =>
      send({ type: "useChaos", power, targetPlayerId }),
    [send],
  );
  const cheer = useCallback((delta: 1 | -1) => send({ type: "cheer", delta }), [send]);
  const phoneFriendVote = useCallback(
    (choiceIndex: number) => send({ type: "phoneFriendVote", choiceIndex }),
    [send],
  );
  const challengeVote = useCallback(
    (tooEasy: boolean) => send({ type: "challengeVote", tooEasy }),
    [send],
  );
  const playAgain = useCallback(() => send({ type: "playAgain" }), [send]);

  const me: TriviaPlayerPublic | null = useMemo(() => {
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
    setTriviaPack,
    setTriviaChaosMode,
    start,
    pickCell,
    buzz,
    answer,
    setDailyWager,
    setFinalWager,
    finalAnswer,
    solveChaos,
    useChaos,
    cheer,
    phoneFriendVote,
    challengeVote,
    playAgain,
  };
}
