import { useCallback, useEffect, useRef, useState } from "react";
import { loadResumeId, saveResumeId } from "../lib/playerResume.ts";
import type {
  DiePose,
  HuntFindResultMessage,
  HuntProgressMessage,
  PackTier,
  ScatterClientMessage,
  ScatterPlayMode,
  ScatterRoundSeconds,
  ScatterRoomState,
  ScatterServerMessage,
} from "../scatterTypes.ts";
import { CATEGORIES_PER_LIST, HUNT_MAX_ANSWERS } from "../scatterTypes.ts";

interface Options {
  code: string | null;
  role?: "player" | "spectator";
  onError?: (message: string) => void;
  onHuntFindResult?: (msg: HuntFindResultMessage) => void;
}

export function useScattergoriesRoom({
  code,
  role = "player",
  onError,
  onHuntFindResult,
}: Options) {
  const [state, setState] = useState<ScatterRoomState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [diePose, setDiePose] = useState<DiePose | null>(null);
  const [myAnswers, setMyAnswers] = useState<string[] | null>(null);
  const [huntProgress, setHuntProgress] = useState<HuntProgressMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pendingJoin = useRef<string | null>(null);
  const pendingSpectate = useRef(false);
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const onHuntFindResultRef = useRef(onHuntFindResult);
  onHuntFindResultRef.current = onHuntFindResult;

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
        const resumeId = loadResumeId(code) ?? undefined;
        ws.send(
          JSON.stringify({
            type: "join",
            name: pendingJoin.current,
            resumeId,
          } satisfies ScatterClientMessage),
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
        if (msg.playerId && code) saveResumeId(code, msg.playerId);
        setState(msg.state);
        if (msg.myAnswers) {
          if (msg.state.playMode === "hunt") {
            setMyAnswers(msg.myAnswers.slice(0, HUNT_MAX_ANSWERS));
          } else {
            const padded = Array.from(
              { length: CATEGORIES_PER_LIST },
              (_, i) => msg.myAnswers![i] ?? "",
            );
            setMyAnswers(padded);
          }
        } else if (msg.state.phase === "lobby" || msg.state.phase === "rolling" || msg.state.phase === "countdown") {
          setMyAnswers(null);
        }
        if (msg.state.phase === "lobby" || msg.state.phase === "rolling") {
          setHuntProgress(null);
        }
        if (msg.state.phase !== "rolling") setDiePose(null);
      } else if (msg.type === "state") {
        if (!msg.state || msg.state.game !== "scattergories") {
          onErrorRef.current?.("This room is not a Scattergories game");
          return;
        }
        setState(msg.state);
        if (msg.state.phase === "lobby" || msg.state.phase === "rolling" || msg.state.phase === "countdown") {
          setMyAnswers(null);
        }
        if (msg.state.phase === "lobby" || msg.state.phase === "rolling") {
          setHuntProgress(null);
        }
        if (msg.state.phase !== "rolling") setDiePose(null);
      } else if (msg.type === "diePose") {
        setDiePose({ qx: msg.qx, qy: msg.qy, qz: msg.qz, qw: msg.qw });
      } else if (msg.type === "huntFindResult") {
        setHuntProgress({
          type: "huntProgress",
          remaining: msg.remaining,
          matchedCount: msg.matchedCount,
          letterTotal: msg.letterTotal,
        });
        if (msg.ok && msg.word) {
          setMyAnswers((prev) => {
            const base = prev ?? [];
            if (base.includes(msg.word!)) return base;
            return [...base, msg.word!].slice(0, HUNT_MAX_ANSWERS);
          });
        }
        onHuntFindResultRef.current?.(msg);
      } else if (msg.type === "huntProgress") {
        setHuntProgress(msg);
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

  const setPackTier = useCallback(
    (packTier: PackTier) => send({ type: "setPackTier", packTier }),
    [send],
  );
  const setPlayMode = useCallback(
    (playMode: ScatterPlayMode) => send({ type: "setPlayMode", playMode }),
    [send],
  );
  const setPreferredScene = useCallback(
    (sceneId: string | null) => send({ type: "setPreferredScene", sceneId }),
    [send],
  );
  const setRoundSeconds = useCallback(
    (roundSeconds: ScatterRoundSeconds) => send({ type: "setRoundSeconds", roundSeconds }),
    [send],
  );
  const start = useCallback(() => send({ type: "start" }), [send]);
  const playAgain = useCallback(() => send({ type: "playAgain" }), [send]);
  const sendDiePose = useCallback(
    (pose: DiePose) => send({ type: "diePose", ...pose }),
    [send],
  );
  const submitLetterRoll = useCallback(
    (letter: string) => send({ type: "submitLetterRoll", letter }),
    [send],
  );
  const submitAnswers = useCallback(
    (answers: string[]) => send({ type: "submitAnswers", answers }),
    [send],
  );
  const submitHuntFind = useCallback(
    (word: string) => send({ type: "submitHuntFind", word }),
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
    diePose,
    myAnswers,
    huntProgress,
    join,
    spectate,
    setPackTier,
    setPlayMode,
    setPreferredScene,
    setRoundSeconds,
    start,
    playAgain,
    sendDiePose,
    submitLetterRoll,
    submitAnswers,
    submitHuntFind,
    reviewNext,
    reviewPrev,
    submitReviewVotes,
    finishReview,
  };
}
