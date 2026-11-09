import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { playBonusAwards, unlockAudio } from "../audio/sfx.ts";
import { BoggleBoard } from "../components/BoggleBoard.tsx";
import { BonusBadges } from "../components/BonusBadges.tsx";
import { Layout } from "../components/Layout.tsx";
import { useRoom } from "../hooks/useRoom.ts";

export function BoggleSpectator() {
  const { code = "" } = useParams();
  const roomCode = code.toUpperCase();
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [joined, setJoined] = useState(false);

  const { state, connected, badgeFeed, spectate } = useRoom({
    code: roomCode,
    role: "spectator",
    onBadgeEvent: (bonuses) => {
      unlockAudio();
      playBonusAwards(bonuses, 3);
    },
    onError: (message) => setError(message),
  });

  useEffect(() => {
    if (joined) return;
    spectate();
    setJoined(true);
  }, [joined, spectate]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, []);

  const joinUrl = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/boggle/join?code=${roomCode}`;
  }, [roomCode]);

  const countdownLeft =
    state?.countdownEndsAt != null
      ? Math.max(0, Math.ceil((state.countdownEndsAt - now) / 1000))
      : 0;
  const playLeft =
    state?.endsAt != null ? Math.max(0, Math.ceil((state.endsAt - now) / 1000)) : 0;

  const playersByWords = useMemo(() => {
    if (!state) return [];
    return [...state.players].sort(
      (a, b) => b.wordCount - a.wordCount || a.name.localeCompare(b.name),
    );
  }, [state]);

  return (
    <Layout title="KernelChaos · TV">
      <section className="spectator-screen">
        {!connected ? <p className="muted connecting">Connecting…</p> : null}
        {error ? <p className="error">{error}</p> : null}

        {!state ? (
          <p className="muted">Opening room {roomCode}…</p>
        ) : state.phase === "lobby" || (state.phase === "results" && !state.board) ? (
          <div className="spectator-lobby">
            <div className="spectator-lobby-main">
              <p className="lobby-label">Room code</p>
              <p className="room-code" aria-label={`Room code ${state.code}`}>
                {state.code}
              </p>
              <p className="spectator-tag">TV spectator · word counts only</p>
              <div className="qr-wrap">
                <QRCodeSVG
                  value={joinUrl}
                  size={240}
                  level="M"
                  includeMargin
                  bgColor="#f4f7f2"
                  fgColor="#0e2a24"
                />
              </div>
              <p className="muted qr-hint">Players scan to join on their phones</p>
            </div>
            <ul className="spectator-roster" aria-label="Players">
              {state.players.map((p) => (
                <li key={p.id}>
                  <span>{p.name}</span>
                  {p.isHost ? <em>host</em> : null}
                </li>
              ))}
              {state.players.length === 0 ? <li className="muted">Waiting for players…</li> : null}
            </ul>
          </div>
        ) : null}

        {state?.phase === "countdown" ? (
          <div className="countdown-screen" aria-live="assertive">
            <p className="countdown-label">Get ready</p>
            <p className="countdown-num">{countdownLeft || "Go"}</p>
          </div>
        ) : null}

        {state?.phase === "playing" && state.board ? (
          <div className="spectator-play">
            <aside className="spectator-side">
              <div className={`timer${playLeft <= 5 ? " is-urgent" : ""}`}>
                {formatTime(playLeft)}
              </div>
              <p className="spectator-tag">Round {state.round} · words found</p>
              <ul className="spectator-counts" aria-label="Word counts">
                {playersByWords.map((p) => (
                  <li key={p.id}>
                    <span className="spectator-name">{p.name}</span>
                    <strong className="spectator-count">{p.wordCount}</strong>
                  </li>
                ))}
              </ul>
              <p className="muted spectator-hint">Scores stay hidden until phones show results</p>
            </aside>

            <div className="spectator-board">
              <BoggleBoard
                board={state.board}
                size={state.boardSize}
                disabled
                onSubmitPath={() => undefined}
              />
            </div>

            <aside className="spectator-badges" aria-live="polite" aria-label="Chaos badges">
              <h2>Chaos hits</h2>
              <p className="muted spectator-hint">Who earned them? Nobody knows.</p>
              <ul className="spectator-badge-feed">
                {badgeFeed.map((item) => (
                  <li key={item.id} className="spectator-badge-row">
                    <BonusBadges bonuses={item.bonuses} className="spectator-badge-pills" />
                  </li>
                ))}
                {badgeFeed.length === 0 ? (
                  <li className="muted">Badges appear here as they land…</li>
                ) : null}
              </ul>
            </aside>
          </div>
        ) : null}

        {state?.phase === "results" && state.results ? (
          <div className="spectator-results">
            <h1 className="results-title">Round {state.round} — phones have the scores</h1>
            <p className="winner-banner spectator-results-banner">
              Word chase over. Check your phone for the winner.
            </p>
            <ul className="spectator-counts is-results" aria-label="Final word counts">
              {playersByWords.map((p) => (
                <li key={p.id}>
                  <span className="spectator-name">{p.name}</span>
                  <strong className="spectator-count">{p.wordCount} words</strong>
                </li>
              ))}
            </ul>
            {badgeFeed.length > 0 ? (
              <div className="spectator-badges is-inline">
                <h2>Round badges</h2>
                <ul className="spectator-badge-feed">
                  {badgeFeed.map((item) => (
                    <li key={item.id} className="spectator-badge-row">
                      <BonusBadges bonuses={item.bonuses} className="spectator-badge-pills" />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <p className="muted">
              Host starts the next round from their phone.{" "}
              <Link to={`/boggle/room/${roomCode}`}>Open player view</Link>
            </p>
          </div>
        ) : null}
      </section>
    </Layout>
  );
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
