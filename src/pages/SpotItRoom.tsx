import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  playCountdownTick,
  playRoundEnd,
  playSpotItHit,
  playSpotItMiss,
  playWinner,
  unlockAudio,
} from "../audio/sfx.ts";
import { Layout } from "../components/Layout.tsx";
import { SpotItCard } from "../components/SpotItCard.tsx";
import { SpotItLobby } from "../components/SpotItLobby.tsx";
import { useSpotItRoom } from "../hooks/useSpotItRoom.ts";
import { SPOT_IT_MODE_LABELS } from "../spotItTypes.ts";

export function SpotItRoom() {
  const { code = "" } = useParams();
  const roomCode = code.toUpperCase();
  const location = useLocation();
  const navName =
    typeof (location.state as { name?: string } | null)?.name === "string"
      ? (location.state as { name: string }).name
      : (localStorage.getItem("kernelchaos.name") ?? "");

  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const lastTick = useRef<number | null>(null);
  const phaseRef = useRef<string | null>(null);

  const {
    state,
    me,
    connected,
    myCard,
    lockedUntil,
    join,
    setSpotItMode,
    setSpotItTarget,
    setSpotItPack,
    start,
    tapSymbol,
    playAgain,
  } = useSpotItRoom({
    code: roomCode,
    onError: (message) => setError(message),
    onTapResult: (hit) => {
      if (hit) playSpotItHit();
      else playSpotItMiss();
    },
  });

  useEffect(() => {
    if (joined || !navName.trim()) return;
    join(navName.trim());
    setJoined(true);
  }, [joined, join, navName]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!state) return;
    unlockAudio();
    if (state.phase === "between" && state.countdownEndsAt) {
      const left = Math.ceil((state.countdownEndsAt - now) / 1000);
      if (left >= 1 && left <= 3 && lastTick.current !== left) {
        lastTick.current = left;
        playCountdownTick();
      }
    } else {
      lastTick.current = null;
    }
    if (phaseRef.current && phaseRef.current !== "results" && state.phase === "results") {
      playRoundEnd();
      if (state.winners.length > 0) playWinner();
    }
    phaseRef.current = state.phase;
  }, [state, now]);

  const joinUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/spot-it/join?code=${roomCode}`;
  }, [roomCode]);

  const locked = lockedUntil != null && now < lockedUntil;
  const betweenLeft =
    state?.phase === "between" && state.countdownEndsAt
      ? Math.max(1, Math.ceil((state.countdownEndsAt - now) / 1000))
      : null;

  if (!connected && !state) {
    return (
      <Layout title="KernelChaos · Spot It">
        <p className="muted">Connecting…</p>
      </Layout>
    );
  }

  if (error && !state) {
    return (
      <Layout title="KernelChaos · Spot It">
        <p className="error">{error}</p>
        <Link className="btn" to="/spot-it">
          Back
        </Link>
      </Layout>
    );
  }

  if (!state) {
    return (
      <Layout title="KernelChaos · Spot It">
        <p className="muted">Joining room…</p>
      </Layout>
    );
  }

  const sorted = [...state.players].sort((a, b) => b.score - a.score);

  return (
    <Layout
      title="KernelChaos · Spot It"
      playerRoom={{
        code: roomCode,
        game: "spot-it",
      }}
    >
      <section className="spot-it-room">
        {error ? <p className="error">{error}</p> : null}

        {state.phase === "lobby" ? (
          <SpotItLobby
            state={state}
            me={me}
            joinUrl={joinUrl}
            onSetMode={setSpotItMode}
            onSetTarget={setSpotItTarget}
            onSetPack={setSpotItPack}
            onStart={start}
          />
        ) : null}

        {state.phase === "playing" || state.phase === "between" ? (
          <div className="spot-it-play">
            <header className="spot-it-play-head">
              <p className="spot-it-meta">
                {SPOT_IT_MODE_LABELS[state.spotItMode]} · First to {state.targetScore}
              </p>
              <ul className="spot-it-scores" aria-label="Scores">
                {sorted.map((p) => (
                  <li key={p.id} className={p.id === me?.id ? "is-me" : undefined}>
                    <span>{p.name}</span>
                    <strong>
                      {p.score}/{state.targetScore}
                    </strong>
                  </li>
                ))}
              </ul>
            </header>

            {state.phase === "between" ? (
              <div className="spot-it-between" role="status">
                <p className="spot-it-between-who">
                  {state.lastScorerName ? `${state.lastScorerName} scored!` : "Match found!"}
                </p>
                <p className="spot-it-between-count">{betweenLeft}</p>
                <p className="muted">Next cards in…</p>
              </div>
            ) : (
              <div className={`spot-it-board${locked ? " is-locked" : ""}`}>
                {state.spotItMode === "shared" ? (
                  <>
                    {state.cardA ? (
                      <SpotItCard
                        card={state.cardA}
                        packId={state.packId}
                        label="Card A"
                        interactive
                        disabled={locked}
                        onTapSymbol={tapSymbol}
                      />
                    ) : null}
                    {state.cardB ? (
                      <SpotItCard
                        card={state.cardB}
                        packId={state.packId}
                        label="Card B"
                        interactive
                        disabled={locked}
                        onTapSymbol={tapSymbol}
                      />
                    ) : null}
                  </>
                ) : (
                  <>
                    {state.centerCard ? (
                      <SpotItCard
                        card={state.centerCard}
                        packId={state.packId}
                        label="Center"
                        interactive
                        disabled={locked}
                        onTapSymbol={tapSymbol}
                      />
                    ) : null}
                    {myCard ? (
                      <SpotItCard
                        card={myCard}
                        packId={state.packId}
                        label="Your card"
                        interactive
                        disabled={locked}
                        onTapSymbol={tapSymbol}
                      />
                    ) : (
                      <p className="muted">Waiting for your card…</p>
                    )}
                  </>
                )}
              </div>
            )}
            {locked ? <p className="spot-it-lock muted">Miss lock — try again shortly</p> : null}
          </div>
        ) : null}

        {state.phase === "results" ? (
          <div className="spot-it-results">
            <h2>Results</h2>
            {state.winners.length > 0 ? (
              <p className="spot-it-winner">
                {state.winners
                  .map((id) => state.players.find((p) => p.id === id)?.name ?? "Player")
                  .join(" & ")}{" "}
                {state.winners.length > 1 ? "win!" : "wins!"}
              </p>
            ) : null}
            <ol className="spot-it-results-list">
              {sorted.map((p) => (
                <li key={p.id}>
                  <span>{p.name}</span>
                  <strong>{p.score}</strong>
                </li>
              ))}
            </ol>
            {me?.isHost ? (
              <button className="btn primary" type="button" onClick={playAgain}>
                Play again
              </button>
            ) : (
              <p className="muted">Waiting for host…</p>
            )}
            <Link className="btn" to="/spot-it">
              Leave
            </Link>
          </div>
        ) : null}
      </section>
    </Layout>
  );
}
