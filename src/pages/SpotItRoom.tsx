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
  const [flash, setFlash] = useState<"ok" | "bad" | null>(null);
  const lastTick = useRef<number | null>(null);
  const phaseRef = useRef<string | null>(null);
  const flashTimer = useRef<number | null>(null);

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
    tapQuizChoice,
    playAgain,
  } = useSpotItRoom({
    code: roomCode,
    onError: (message) => setError(message),
    onTapResult: (hit) => {
      if (hit) playSpotItHit();
      else playSpotItMiss();
      if (flashTimer.current != null) window.clearTimeout(flashTimer.current);
      setFlash(hit ? "ok" : "bad");
      flashTimer.current = window.setTimeout(() => {
        setFlash(null);
        flashTimer.current = null;
      }, 420);
    },
  });

  useEffect(() => {
    return () => {
      if (flashTimer.current != null) window.clearTimeout(flashTimer.current);
    };
  }, []);

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
  const sharedLike = state.spotItMode === "shared" || state.spotItMode === "learning";
  const inPlayPhases =
    state.phase === "playing" || state.phase === "quiz" || state.phase === "between";

  return (
    <Layout
      title="KernelChaos · Spot It"
      tvRoom={{
        code: roomCode,
        game: "spot-it",
        roundActive: inPlayPhases,
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

        {inPlayPhases ? (
          <div
            className={`spot-it-play${
              flash === "ok" ? " spot-it-flash-ok" : flash === "bad" ? " spot-it-flash-bad" : ""
            }`}
          >
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
                {state.lastMatchKana ? (
                  <div className="spot-it-teach">
                    <p className="spot-it-teach-kana spot-it-kana-glyph">{state.lastMatchKana}</p>
                    {state.lastMatchReading && state.lastMatchReading.length > 0 ? (
                      <ul className="spot-it-reading-chips" aria-label="Reading">
                        {state.lastMatchReading.map((syllable, i) => (
                          <li key={`${syllable}-${i}`}>{syllable}</li>
                        ))}
                      </ul>
                    ) : null}
                    {state.lastMatchEnglish ? (
                      <p className="spot-it-teach-english">{state.lastMatchEnglish}</p>
                    ) : null}
                  </div>
                ) : null}
                <p className="spot-it-between-count">{betweenLeft}</p>
                <p className="muted">Next cards in…</p>
              </div>
            ) : state.phase === "quiz" ? (
              <div className="spot-it-quiz" role="group" aria-label="Pick the English meaning">
                {state.quizKana ? (
                  <p className="spot-it-quiz-kana spot-it-kana-glyph">{state.quizKana}</p>
                ) : null}
                <p className="muted">What does it mean?</p>
                <div className={`spot-it-quiz-grid${locked ? " is-locked" : ""}`}>
                  {(state.quizChoices ?? []).map((choice) => (
                    <button
                      key={choice}
                      type="button"
                      className="spot-it-quiz-choice"
                      disabled={locked}
                      onClick={() => tapQuizChoice(choice)}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
                {locked ? <p className="spot-it-lock muted">Wrong — try again in a moment</p> : null}
              </div>
            ) : (
              <div className={`spot-it-board${locked ? " is-locked" : ""}`}>
                {sharedLike ? (
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
            {state.phase === "playing" && locked ? (
              <p className="spot-it-lock muted">Miss lock — try again shortly</p>
            ) : null}
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
