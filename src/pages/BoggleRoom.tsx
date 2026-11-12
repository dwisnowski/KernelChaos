import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  playBonusAwards,
  playCountdownTick,
  playLastSeconds,
  playReject,
  playRoundEnd,
  playWinner,
  playWordFound,
  unlockAudio,
} from "../audio/sfx.ts";
import { BoggleBoard } from "../components/BoggleBoard.tsx";
import { BonusBadges } from "../components/BonusBadges.tsx";
import { Layout } from "../components/Layout.tsx";
import { Lobby } from "../components/Lobby.tsx";
import { WordLengthCoverageBars } from "../components/WordLengthCoverageBars.tsx";
import { useRoom } from "../hooks/useRoom.ts";
import { BONUS_LABELS, type BonusId } from "../types.ts";

const END_ROUND_BONUSES: BonusId[] = ["unique", "lastWord", "loneWolf", "coverage"];

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

  const {
    state,
    me,
    playerId,
    connected,
    myWords,
    join,
    setBoardSize,
    setRoundSeconds,
    start,
    playAgain,
    submitWord,
  } = useRoom({
      code: roomCode,
      onWordResult: (ok, word, _points, reason, bonuses) => {
        outcomeSeq.current += 1;
        setWordOutcome({ ok, seq: outcomeSeq.current });
        if (ok && word) {
          playWordFound(word.length);
          if (bonuses?.length) {
            window.setTimeout(() => playBonusAwards(bonuses, 3), 90);
          }
        } else if (reason === "duplicate" || reason === "not-a-word" || reason === "bad-path") {
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
      const mine = state.results?.find((r) => r.id === playerId);
      if (mine) {
        const endBonuses: BonusId[] = [
          ...mine.words.flatMap((w) => w.bonuses.filter((b) => END_ROUND_BONUSES.includes(b))),
          ...mine.roundAwards.map((a) => a.id),
        ];
        const uniqueEnd = [...new Set(endBonuses)];
        if (uniqueEnd.length) {
          window.setTimeout(() => playBonusAwards(uniqueEnd, 3), 520);
        }
      }
    }
    if (state.phase !== "countdown") lastTick.current = null;
    if (state.phase !== "playing") lastUrgent.current = null;
    phaseRef.current = state.phase;
  }, [now, state, playerId]);

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
          onSetRoundSeconds={(seconds) => {
            unlockAudio();
            setRoundSeconds(seconds);
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
                <span className="word-chip-main">
                  {w.word} <em>+{w.points}</em>
                </span>
                <BonusBadges bonuses={w.bonuses} />
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
          <p className="results-legend muted">
            Line = 2× path · Solo = 2× unique · flats stack after multipliers
          </p>
          <div className="results-grid">
            {state.results.map((r) => (
              <article
                key={r.id}
                className={`result-card${state.winners?.includes(r.id) ? " is-winner" : ""}`}
              >
                <header>
                  <h2>{r.name}</h2>
                  <div className="result-card-meta">
                    <em>
                      {r.wordCount} / {state.possibleWordCount ?? "?"} words
                    </em>
                    <strong>{r.score} pts</strong>
                  </div>
                </header>
                {r.roundAwards.length > 0 ? (
                  <ul className="round-awards">
                    {r.roundAwards.map((a) => (
                      <li key={a.id}>
                        <span className={`bonus-badge bonus-${a.id}`}>{BONUS_LABELS[a.id]}</span>
                        <em>+{a.points}</em>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <WordLengthCoverageBars
                  words={r.words.map((w) => w.word)}
                  possibleByLength={state.possibleByLength ?? []}
                  label={`${r.name} words found by length`}
                />
                <ul>
                  {r.words.map((w) => (
                    <li key={w.word}>
                      <span className="word-chip-main">
                        {w.word} <em>+{w.points}</em>
                      </span>
                      <BonusBadges bonuses={w.bonuses} />
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
                <div className="round-time">
                  <div className="round-time-header">
                    <h2>Round time</h2>
                    <strong>
                      {state.roundSeconds === 60
                        ? "1:00"
                        : state.roundSeconds === 90
                          ? "1:30"
                          : "2:00"}
                    </strong>
                  </div>
                  <input
                    className="round-slider"
                    type="range"
                    min={0}
                    max={2}
                    step={1}
                    value={[60, 90, 120].indexOf(state.roundSeconds ?? 90)}
                    aria-label="Round time"
                    onChange={(e) => {
                      const opts = [60, 90, 120] as const;
                      const next = opts[Number(e.target.value)];
                      if (next) {
                        unlockAudio();
                        setRoundSeconds(next);
                      }
                    }}
                  />
                  <div className="round-ticks" aria-hidden="true">
                    <span>1:00</span>
                    <span>1:30</span>
                    <span>2:00</span>
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
