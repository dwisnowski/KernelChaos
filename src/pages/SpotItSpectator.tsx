import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  playCountdownTick,
  playRoundEnd,
  playSpotItHit,
  playWinner,
  unlockAudio,
} from "../audio/sfx.ts";
import { Layout } from "../components/Layout.tsx";
import { SpotItCard } from "../components/SpotItCard.tsx";
import { useSpotItRoom } from "../hooks/useSpotItRoom.ts";
import { SPOT_IT_MODE_LABELS, SPOT_IT_PACK_LABELS } from "../spotItTypes.ts";

export function SpotItSpectator() {
  const { code = "" } = useParams();
  const roomCode = code.toUpperCase();
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const lastTick = useRef<number | null>(null);
  const phaseRef = useRef<string | null>(null);
  const scoreSumRef = useRef(0);

  const { state, connected, spectate } = useSpotItRoom({
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

  useEffect(() => {
    if (!state || (state.phase !== "playing" && state.phase !== "between" && state.phase !== "quiz")) {
      scoreSumRef.current = 0;
      return;
    }
    const sum = state.players.reduce((a, p) => a + p.score, 0);
    if (sum > scoreSumRef.current) playSpotItHit();
    scoreSumRef.current = sum;
  }, [state]);

  const joinUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/spot-it/join?code=${roomCode}`;
  }, [roomCode]);

  const betweenLeft =
    state?.phase === "between" && state.countdownEndsAt
      ? Math.max(1, Math.ceil((state.countdownEndsAt - now) / 1000))
      : null;

  const sorted = state ? [...state.players].sort((a, b) => b.score - a.score) : [];
  const leader = sorted[0] ?? null;
  const sharedLike = state?.spotItMode === "shared" || state?.spotItMode === "learning";
  const inPlayPhases =
    state && (state.phase === "playing" || state.phase === "quiz" || state.phase === "between");

  return (
    <Layout title="KernelChaos · TV" playerRoom={{ code: roomCode, game: "spot-it" }}>
      <section className="spot-it-tv">
        {error ? <p className="error">{error}</p> : null}
        {!connected && !state ? <p className="muted">Connecting…</p> : null}

        {state?.phase === "lobby" ? (
          <div className="spot-it-tv-lobby">
            <div>
              <h1>Spot It</h1>
              <p className="lede">Scan to join the race</p>
              <p className="room-code">{state.code}</p>
              <p className="muted">
                {SPOT_IT_MODE_LABELS[state.spotItMode]} · First to {state.targetScore} ·{" "}
                {SPOT_IT_PACK_LABELS[state.packId]}
              </p>
              <ul className="spot-it-tv-players">
                {state.players.map((p) => (
                  <li key={p.id}>
                    {p.name}
                    {p.isHost ? " · host" : ""}
                  </li>
                ))}
                {state.players.length === 0 ? <li className="muted">Waiting for players…</li> : null}
              </ul>
              <Link className="btn" to={`/spot-it/room/${roomCode}`}>
                Open as player
              </Link>
            </div>
            <div className="qr-wrap">
              <QRCodeSVG value={joinUrl} size={280} level="M" includeMargin bgColor="#f2f5fa" fgColor="#0e1f35" />
            </div>
          </div>
        ) : null}

        {inPlayPhases ? (
          <div className="spot-it-tv-play">
            <aside className="spot-it-tv-board">
              <p className="spot-it-meta">
                {SPOT_IT_MODE_LABELS[state.spotItMode]} · First to {state.targetScore}
                {state.pileRemaining != null ? ` · Pile ${state.pileRemaining}` : ""}
              </p>
              {leader ? (
                <p className="spot-it-tv-leader">
                  Leader: <strong>{leader.name}</strong> ({leader.score})
                </p>
              ) : null}
              <ol className="spot-it-tv-scores">
                {sorted.map((p, i) => (
                  <li key={p.id}>
                    <span>
                      {i + 1}. {p.name}
                    </span>
                    <strong>
                      {p.score}/{state.targetScore}
                    </strong>
                  </li>
                ))}
              </ol>
            </aside>

            <div className="spot-it-tv-cards">
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
                </div>
              ) : state.phase === "quiz" ? (
                <div className="spot-it-quiz spot-it-quiz-tv" role="status">
                  {state.quizKana ? (
                    <p className="spot-it-quiz-kana spot-it-kana-glyph">{state.quizKana}</p>
                  ) : null}
                  <p className="muted">Waiting for English answer…</p>
                  <div className="spot-it-quiz-grid is-static">
                    {(state.quizChoices ?? []).map((choice) => (
                      <span key={choice} className="spot-it-quiz-choice is-static">
                        {choice}
                      </span>
                    ))}
                  </div>
                </div>
              ) : sharedLike ? (
                <div className="spot-it-board">
                  {state.cardA ? (
                    <SpotItCard card={state.cardA} packId={state.packId} label="Card A" />
                  ) : null}
                  {state.cardB ? (
                    <SpotItCard card={state.cardB} packId={state.packId} label="Card B" />
                  ) : null}
                </div>
              ) : (
                <div className="spot-it-board">
                  {state.centerCard ? (
                    <SpotItCard card={state.centerCard} packId={state.packId} label="Center" />
                  ) : null}
                  <p className="muted spot-it-tv-hands-note">
                    Players race their private hand vs the center
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {state?.phase === "results" ? (
          <div className="spot-it-tv-results">
            <h1>Results</h1>
            {state.winners.length > 0 ? (
              <p className="spot-it-winner">
                {state.winners
                  .map((id) => state.players.find((p) => p.id === id)?.name ?? "Player")
                  .join(" & ")}{" "}
                {state.winners.length > 1 ? "win!" : "wins!"}
              </p>
            ) : null}
            <ol className="spot-it-tv-scores">
              {sorted.map((p, i) => (
                <li key={p.id}>
                  <span>
                    {i + 1}. {p.name}
                  </span>
                  <strong>{p.score}</strong>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </section>
    </Layout>
  );
}
