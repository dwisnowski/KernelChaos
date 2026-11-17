import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  playCountdownTick,
  playLastSeconds,
  playRoundEnd,
  playSpotClear,
  playSpotFound,
  playSpotHint,
  playSpotMiss,
  playWinner,
  unlockAudio,
} from "../audio/sfx.ts";
import { Layout } from "../components/Layout.tsx";
import { SpotDiffPanels } from "../components/SpotDiffPanels.tsx";
import { SpotdiffLobby } from "../components/SpotdiffLobby.tsx";
import { useSpotdiffRoom } from "../hooks/useSpotdiffRoom.ts";
import { SPOT_MODE_LABELS } from "../spotdiffTypes.ts";

export function SpotdiffRoom() {
  const { code = "" } = useParams();
  const location = useLocation();
  const navName = (location.state as { name?: string } | null)?.name;
  const [name] = useState(() => navName || localStorage.getItem("kernelchaos.name") || "");
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [flash, setFlash] = useState<"ok" | "bad" | null>(null);
  const lastTick = useRef<number | null>(null);
  const lastUrgent = useRef<number | null>(null);
  const phaseRef = useRef<string | null>(null);
  const hintPlayed = useRef<string | null>(null);

  const roomCode = code.toUpperCase();

  const {
    state,
    me,
    playerId,
    connected,
    myFoundDiffIds,
    lockedUntil,
    join,
    setSpotMode,
    setSpotTimer,
    setSpotDiffCount,
    start,
    tapDiff,
    requestHint,
    playAgain,
  } = useSpotdiffRoom({
    code: roomCode,
    onError: (message) => setError(message),
    onTapResult: (hit) => {
      setFlash(hit ? "ok" : "bad");
      window.setTimeout(() => setFlash(null), 280);
      if (hit) playSpotFound();
      else playSpotMiss();
    },
  });

  useEffect(() => {
    if (!name || joined) return;
    join(name);
    setJoined(true);
  }, [join, joined, name]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(id);
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
      if (playerId && state.winners.includes(playerId)) playWinner();
      else if (state.spotMode === "coop" && state.winners.length > 0) playSpotClear();
    }
    phaseRef.current = state.phase;
  }, [state, now, playerId]);

  useEffect(() => {
    if (!state?.hintDiffId || !state.hintUntil || now >= state.hintUntil) return;
    const key = `${state.round}-${state.hintDiffId}-${state.hintUntil}`;
    if (hintPlayed.current === key) return;
    hintPlayed.current = key;
    playSpotHint();
  }, [state?.hintDiffId, state?.hintUntil, state?.round, now]);

  const joinUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/spotdiff/join?code=${roomCode}`;
  }, [roomCode]);

  const foundIds = useMemo(() => {
    if (!state) return [];
    if (state.spotMode === "coop") return state.foundDiffIds;
    if (state.phase === "results") {
      const mine = state.results.find((r) => r.id === playerId);
      return mine?.foundDiffIds ?? myFoundDiffIds;
    }
    return myFoundDiffIds;
  }, [state, myFoundDiffIds, playerId]);

  const hintBox = useMemo(() => {
    if (!state?.puzzle || !state.hintDiffId || !state.hintUntil || now >= state.hintUntil) {
      return null;
    }
    return state.puzzle.differences.find((d) => d.id === state.hintDiffId)?.box ?? null;
  }, [state, now]);

  const locked = lockedUntil != null && now < lockedUntil;
  const total = state?.puzzle?.differences.length ?? state?.diffCount ?? 0;
  const foundCount = foundIds.length;

  if (!name) {
    return (
      <Layout title="KernelChaos · Spot the Difference">
        <section className="entry">
          <p className="error">Missing name — go back and join again.</p>
          <Link className="btn" to="/spotdiff">
            Back
          </Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout
      title="KernelChaos · Spot the Difference"
      tvRoom={{
        code: roomCode,
        game: "spotdiff",
        roundActive: state?.phase === "playing" || state?.phase === "countdown",
      }}
    >
      <section className="spotdiff-room">
        {!connected ? <p className="muted">Connecting…</p> : null}
        {error ? <p className="error">{error}</p> : null}

        {state?.phase === "lobby" ? (
          <SpotdiffLobby
            state={state}
            me={me}
            joinUrl={joinUrl}
            onSetMode={setSpotMode}
            onSetTimer={setSpotTimer}
            onSetDiffCount={setSpotDiffCount}
            onStart={() => {
              unlockAudio();
              start();
            }}
          />
        ) : null}

        {state && (state.phase === "countdown" || state.phase === "playing") && state.puzzle ? (
          <div className="spot-play">
            <header className="spot-hud">
              <div>
                <p className="spot-hud-title">{state.puzzle.title}</p>
                <p className="muted">
                  {SPOT_MODE_LABELS[state.spotMode]} · {foundCount}/{total}
                </p>
              </div>
              <div className="spot-hud-timer" aria-live="polite">
                {state.phase === "countdown" && state.countdownEndsAt
                  ? Math.max(1, Math.ceil((state.countdownEndsAt - now) / 1000))
                  : state.phase === "playing" && state.endsAt
                    ? Math.max(0, Math.ceil((state.endsAt - now) / 1000))
                    : "—"}
              </div>
              {state.phase === "playing" ? (
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    unlockAudio();
                    requestHint();
                  }}
                >
                  Hint
                </button>
              ) : null}
            </header>

            {state.phase === "countdown" ? <p className="spot-countdown">Get ready…</p> : null}

            <SpotDiffPanels
              puzzle={state.puzzle}
              foundDiffIds={foundIds}
              hintBox={hintBox}
              interactive={state.phase === "playing"}
              locked={locked}
              flash={flash}
              onTap={({ x, y }) => {
                unlockAudio();
                tapDiff(x, y);
              }}
            />

            {state.phase === "playing" ? (
              <ul className="spot-progress">
                {state.players.map((p) => (
                  <li key={p.id}>
                    <span>{p.name}</span>
                    <strong>
                      {state.spotMode === "coop" ? foundCount : p.foundCount}/{total}
                    </strong>
                  </li>
                ))}
              </ul>
            ) : null}

            {locked ? <p className="spot-lock muted">Miss lock — wait a moment…</p> : null}
          </div>
        ) : null}

        {state?.phase === "results" ? (
          <div className="spot-results">
            <h2>Results</h2>
            <p className="muted">
              {SPOT_MODE_LABELS[state.spotMode]}
              {state.puzzle ? ` · ${state.puzzle.title}` : ""}
            </p>
            {state.puzzle ? (
              <SpotDiffPanels puzzle={state.puzzle} foundDiffIds={foundIds} showAllDiffs />
            ) : null}
            <ul className="spot-scoreboard">
              {state.results.map((r) => (
                <li key={r.id} className={state.winners.includes(r.id) ? "is-winner" : ""}>
                  <span>{r.name}</span>
                  <strong>
                    {r.foundCount}/{total}
                  </strong>
                  {state.winners.includes(r.id) ? <em>winner</em> : null}
                </li>
              ))}
            </ul>
            {me?.isHost ? (
              <button type="button" className="btn primary" onClick={() => playAgain()}>
                Play again
              </button>
            ) : (
              <p className="waiting">Waiting for host…</p>
            )}
          </div>
        ) : null}
      </section>
    </Layout>
  );
}
