import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  playCountdownTick,
  playLastSeconds,
  playRoundEnd,
  playSpotClear,
  playSpotFound,
  playWinner,
  unlockAudio,
} from "../audio/sfx.ts";
import { Layout } from "../components/Layout.tsx";
import { SpotDiffPanels } from "../components/SpotDiffPanels.tsx";
import { useSpotdiffRoom } from "../hooks/useSpotdiffRoom.ts";
import { SPOT_DIFFICULTY_LABELS, SPOT_MODE_LABELS } from "../spotdiffTypes.ts";

export function SpotdiffSpectator() {
  const { code = "" } = useParams();
  const roomCode = code.toUpperCase();
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const lastTick = useRef<number | null>(null);
  const lastUrgent = useRef<number | null>(null);
  const phaseRef = useRef<string | null>(null);
  const foundCountRef = useRef(0);

  const { state, connected, spectate } = useSpotdiffRoom({
    code: roomCode,
    role: "spectator",
    onError: (message) => setError(message),
  });

  useEffect(() => {
    if (joined) return;
    spectate();
    setJoined(true);
  }, [joined, spectate]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!state) return;
    unlockAudio();
    if (state.phase === "countdown" && state.countdownEndsAt) {
      const left = Math.ceil((state.countdownEndsAt - now) / 1000);
      if (left >= 1 && left <= 3 && lastTick.current !== left) {
        lastTick.current = left;
        playCountdownTick();
      }
    }
    if (state.phase === "playing" && state.endsAt) {
      const left = Math.ceil((state.endsAt - now) / 1000);
      if (left >= 1 && left <= 5 && lastUrgent.current !== left) {
        lastUrgent.current = left;
        playLastSeconds(left);
      }
    }
    if (phaseRef.current && phaseRef.current !== "results" && state.phase === "results") {
      playRoundEnd();
      if (state.winners.length > 0) {
        if (state.spotMode === "coop") playSpotClear();
        else playWinner();
      }
    }
    phaseRef.current = state.phase;
  }, [state, now]);

  useEffect(() => {
    if (!state || state.phase !== "playing") {
      foundCountRef.current = 0;
      return;
    }
    const n =
      state.spotMode === "coop"
        ? state.foundDiffIds.length
        : Math.max(0, ...state.players.map((p) => p.foundCount));
    if (n > foundCountRef.current) playSpotFound();
    foundCountRef.current = n;
  }, [state]);

  const joinUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/spotdiff/join?code=${roomCode}`;
  }, [roomCode]);

  const total = state?.puzzle?.differences.length ?? state?.diffCount ?? 0;
  const markIds =
    state?.spotMode === "coop" || state?.phase === "results" ? (state?.foundDiffIds ?? []) : [];

  const hintBox =
    state?.puzzle && state.hintDiffId && state.hintUntil && now < state.hintUntil
      ? (state.puzzle.differences.find((d) => d.id === state.hintDiffId)?.box ?? null)
      : null;

  return (
    <Layout title="KernelChaos · TV" playerRoom={{ code: roomCode, game: "spotdiff" }}>
      <section className="spotdiff-tv">
        {!connected ? <p className="muted">Connecting…</p> : null}
        {error ? <p className="error">{error}</p> : null}

        {state?.phase === "lobby" ? (
          <div className="tv-lobby">
            <h1>Spot the Difference</h1>
            <p className="room-code">{state.code}</p>
            <div className="qr-wrap">
              <QRCodeSVG value={joinUrl} size={260} level="M" includeMargin bgColor="#f2f5fa" fgColor="#0e1f35" />
            </div>
            <p className="muted">
              {SPOT_MODE_LABELS[state.spotMode]} · {SPOT_DIFFICULTY_LABELS[state.difficulty]} ·{" "}
              {state.diffCount} diffs · {state.roundSeconds}s
            </p>
            <ul className="tv-player-list">
              {state.players.map((p) => (
                <li key={p.id}>
                  {p.name}
                  {p.isHost ? " · host" : ""}
                </li>
              ))}
            </ul>
            <Link className="btn" to={`/spotdiff/room/${roomCode}`}>
              Open as player
            </Link>
          </div>
        ) : null}

        {state && state.phase !== "lobby" && state.puzzle ? (
          <div className="spot-tv-play">
            <header className="spot-hud spot-hud-tv">
              <div>
                <p className="spot-hud-title">{state.puzzle.title}</p>
                <p className="muted">{SPOT_MODE_LABELS[state.spotMode]}</p>
              </div>
              <div className="spot-hud-timer">
                {state.phase === "countdown" && state.countdownEndsAt
                  ? Math.max(1, Math.ceil((state.countdownEndsAt - now) / 1000))
                  : state.phase === "playing" && state.endsAt
                    ? Math.max(0, Math.ceil((state.endsAt - now) / 1000))
                    : state.phase === "results"
                      ? "Done"
                      : "—"}
              </div>
            </header>

            <SpotDiffPanels
              puzzle={state.puzzle}
              foundDiffIds={markIds}
              hintBox={state.spotMode === "coop" ? hintBox : null}
              showAllDiffs={state.phase === "results"}
              className="spot-panels-tv"
            />

            <ul className="spot-progress spot-progress-tv">
              {state.phase === "results"
                ? state.results.map((r) => (
                    <li key={r.id} className={state.winners.includes(r.id) ? "is-winner" : ""}>
                      <span>{r.name}</span>
                      <strong>
                        {r.foundCount}/{total}
                      </strong>
                    </li>
                  ))
                : state.players.map((p) => (
                    <li key={p.id}>
                      <span>{p.name}</span>
                      <strong>
                        {state.spotMode === "coop"
                          ? `${state.foundDiffIds.length}/${total}`
                          : `${p.foundCount}/${total}`}
                      </strong>
                    </li>
                  ))}
            </ul>
          </div>
        ) : null}
      </section>
    </Layout>
  );
}
