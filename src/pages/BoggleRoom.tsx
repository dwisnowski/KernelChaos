import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  playCountdownTick,
  playLastSeconds,
  playReject,
  playRoundEnd,
  playWinner,
  playWordFound,
  unlockAudio,
} from "../audio/sfx.ts";
import { BoggleBoard } from "../components/BoggleBoard.tsx";
import { Layout } from "../components/Layout.tsx";
import { Lobby } from "../components/Lobby.tsx";
import { useRoom } from "../hooks/useRoom.ts";

export function BoggleRoom() {
  const { code = "" } = useParams();
  const location = useLocation();
  const navName = (location.state as { name?: string } | null)?.name;
  const [name] = useState(
    () => navName || localStorage.getItem("kernelchaos.name") || "",
  );
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [wordOutcome, setWordOutcome] = useState<{ ok: boolean; seq: number } | null>(null);
  const lastTick = useRef<number | null>(null);
  const lastUrgent = useRef<number | null>(null);
  const phaseRef = useRef<string | null>(null);
  const outcomeSeq = useRef(0);

  const roomCode = code.toUpperCase();

  const { state, me, connected, myWords, join, setBoardSize, start, playAgain, submitWord } =
    useRoom({
      code: roomCode,
      onWordResult: (ok, word, _points, reason) => {
        outcomeSeq.current += 1;
        setWordOutcome({ ok, seq: outcomeSeq.current });
        if (ok && word) playWordFound(word.length);
        else if (reason === "duplicate" || reason === "not-a-word" || reason === "bad-path") {
          playReject();
        } else if (!ok) {
          playReject();
        }
      },
      onError: (message) => setError(message),
    });

  useEffect(() => {
    if (!name || joined) return;
    join(name);
    setJoined(true);
  }, [join, joined, name]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!state) return;
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
      if (state.winners?.length) {
        window.setTimeout(() => playWinner(), 280);
      }
    }
    if (state.phase !== "countdown") lastTick.current = null;
    if (state.phase !== "playing") lastUrgent.current = null;
    phaseRef.current = state.phase;
  }, [now, state]);

  const joinUrl = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/boggle/join?code=${roomCode}`;
  }, [roomCode]);

  if (!name) {
    return (
      <Layout title="KernelChaos · Boggle">
        <section className="entry">
          <p>Enter a name to join this room.</p>
          <Link className="btn primary" to={`/boggle/join?code=${roomCode}`}>
            Continue
          </Link>
        </section>
      </Layout>
    );
  }

  const countdownLeft =
    state?.countdownEndsAt != null
      ? Math.max(0, Math.ceil((state.countdownEndsAt - now) / 1000))
      : 0;
  const playLeft =
    state?.endsAt != null ? Math.max(0, Math.ceil((state.endsAt - now) / 1000)) : 0;

  return (
    <Layout title="KernelChaos · Boggle">
      {!connected ? <p className="muted connecting">Connecting…</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {state?.phase === "lobby" || (state?.phase === "results" && !state.board) ? (
        <Lobby
          state={state}
          me={me}
          joinUrl={joinUrl}
          onSetBoardSize={(size) => {
            unlockAudio();
            setBoardSize(size);
          }}
          onStart={() => {
            unlockAudio();
            start();
          }}
        />
      ) : null}

      {state?.phase === "countdown" ? (
        <section className="countdown-screen" aria-live="assertive">
          <p className="countdown-label">Get ready</p>
          <p className="countdown-num">{countdownLeft || "Go"}</p>
        </section>
      ) : null}

      {state?.phase === "playing" && state.board ? (
        <section className="play-screen">
          <div className="play-meta">
            <div className={`timer${playLeft <= 5 ? " is-urgent" : ""}`}>
              {formatTime(playLeft)}
            </div>
            <div className="play-stats">
              <span>{me?.name}</span>
              <span>
                {myWords.length} words · {myWords.reduce((a, w) => a + w.points, 0)} pts
              </span>
            </div>
            <ul className="player-activity" aria-label="Players">
              {state.players.map((p) => (
                <li key={p.id}>
                  {p.name}: {p.wordCount}
                </li>
              ))}
            </ul>
          </div>
          <BoggleBoard
            board={state.board}
            size={state.boardSize}
            wordOutcome={wordOutcome}
            onSubmitPath={submitWord}
            onInvalid={() => playReject()}
          />
          <ul className="word-chips">
            {[...myWords].reverse().map((w) => (
              <li key={w.word}>
                {w.word} <em>+{w.points}</em>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {state?.phase === "results" && state.results ? (
        <section className="results-screen">
          <h1 className="results-title">Round {state.round} results</h1>
          {state.winners && state.winners.length > 0 ? (
            <p className="winner-banner">
              {state.winners.length > 1 ? "Tie! " : "Winner: "}
              {state.results
                .filter((r) => state.winners!.includes(r.id))
                .map((r) => r.name)
                .join(" & ")}
            </p>
          ) : (
            <p className="winner-banner">No scoring words this round</p>
          )}
          <div className="results-grid">
            {state.results.map((r) => (
              <article
                key={r.id}
                className={`result-card${state.winners?.includes(r.id) ? " is-winner" : ""}`}
              >
                <header>
                  <h2>{r.name}</h2>
                  <strong>{r.score} pts</strong>
                </header>
                <ul>
                  {r.words.map((w) => (
                    <li key={w.word}>
                      {w.word} <em>+{w.points}</em>
                    </li>
                  ))}
                  {r.words.length === 0 ? <li className="muted">No words</li> : null}
                </ul>
              </article>
            ))}
          </div>
          <div className="results-actions">
            {me?.isHost ? (
              <>
                <div className="board-size">
                  <h2>Next board</h2>
                  <div className="size-pills" role="group" aria-label="Board size">
                    {([4, 5, 6] as const).map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={`size-pill${state.boardSize === n ? " is-active" : ""}`}
                        onClick={() => {
                          unlockAudio();
                          setBoardSize(n);
                        }}
                      >
                        {n}×{n}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => {
                    unlockAudio();
                    start();
                  }}
                >
                  Play again
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    unlockAudio();
                    playAgain();
                  }}
                >
                  Back to lobby
                </button>
              </>
            ) : (
              <p className="waiting">Waiting for host…</p>
            )}
          </div>
        </section>
      ) : null}
    </Layout>
  );
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
