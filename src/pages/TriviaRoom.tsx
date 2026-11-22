import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  playTriviaBuzzLock,
  playTriviaChaosPower,
  playTriviaChaosWin,
  playTriviaCorrect,
  playTriviaDailyDouble,
  playTriviaFinal,
  playTriviaWrong,
  unlockAudio,
} from "../audio/sfx.ts";
import { Layout } from "../components/Layout.tsx";
import { TriviaBoard } from "../components/TriviaBoard.tsx";
import { TriviaBuzzer } from "../components/TriviaBuzzer.tsx";
import { TriviaChaosDash } from "../components/TriviaChaosDash.tsx";
import { TriviaChaosTray } from "../components/TriviaChaosTray.tsx";
import { TriviaChoices } from "../components/TriviaChoices.tsx";
import { TriviaDailyDouble } from "../components/TriviaDailyDouble.tsx";
import { TriviaLobby } from "../components/TriviaLobby.tsx";
import { TriviaScoreRail } from "../components/TriviaScoreRail.tsx";
import { TriviaWager } from "../components/TriviaWager.tsx";
import { useTriviaRoom } from "../hooks/useTriviaRoom.ts";
import { TRIVIA_DAILY_WAGER_MIN } from "../triviaTypes.ts";

export function TriviaRoom() {
  const { code = "" } = useParams();
  const roomCode = code.toUpperCase();
  const location = useLocation();
  const navName = (location.state as { name?: string } | null)?.name;
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);
  const joined = useRef(false);
  const lastBuzzSeq = useRef(0);
  const lastChaosWin = useRef(0);
  const lastDd = useRef(false);
  const lastOutcome = useRef<string | null>(null);

  const room = useTriviaRoom({
    code: roomCode || null,
    onError: setError,
  });

  useEffect(() => {
    if (!room.connected || joined.current) return;
    const name = navName || localStorage.getItem("kernelchaos.name") || "";
    if (!name.trim()) {
      setError("Missing name — go back and join again");
      return;
    }
    joined.current = true;
    room.join(name.trim());
  }, [room.connected, room.join, navName]);

  useEffect(() => {
    if (!room.state) return;
    const s = room.state;
    if (s.buzzLockSeq > lastBuzzSeq.current) {
      lastBuzzSeq.current = s.buzzLockSeq;
      playTriviaBuzzLock();
      if (s.buzzedPlayerId && s.buzzedPlayerId === room.playerId) {
        setFlash(true);
        const t = window.setTimeout(() => setFlash(false), 450);
        return () => window.clearTimeout(t);
      }
    }
  }, [room.state, room.playerId]);

  useEffect(() => {
    if (!room.state) return;
    if (room.state.chaosWinSeq > lastChaosWin.current) {
      lastChaosWin.current = room.state.chaosWinSeq;
      playTriviaChaosWin();
    }
  }, [room.state]);

  useEffect(() => {
    if (!room.state) return;
    const dd = room.state.activeClue?.isDailyDouble && room.state.phase === "clue";
    if (dd && !lastDd.current) {
      playTriviaDailyDouble();
    }
    lastDd.current = Boolean(dd);
  }, [room.state]);

  useEffect(() => {
    if (!room.state) return;
    const o = room.state.lastOutcome;
    if (o && o !== lastOutcome.current) {
      lastOutcome.current = o;
      if (o === "correct") playTriviaCorrect();
      else if (o === "wrong" || o === "timeout") playTriviaWrong();
      else if (o === "dailyDouble") playTriviaDailyDouble();
      else if (
        o !== "boardClear" &&
        o !== "chaosWin" &&
        typeof o === "string"
      ) {
        playTriviaChaosPower();
      }
    }
    if (room.state.phase === "finalCategory") playTriviaFinal();
  }, [room.state]);

  const joinUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/trivia/join?code=${roomCode}`
      : `/trivia/join?code=${roomCode}`;

  if (!room.state) {
    return (
      <Layout title="KernelChaos · Trivia">
        <p className="muted">{error ?? "Connecting…"}</p>
        <Link to="/trivia">← Back</Link>
      </Layout>
    );
  }

  const state = room.state;
  const me = room.me;
  const controllerName =
    state.players.find((p) => p.id === state.controllerId)?.name ?? "Someone";
  const buzzedName =
    state.players.find((p) => p.id === state.buzzedPlayerId)?.name ?? "Someone";
  const lockedOut = Boolean(me && state.lockedOutIds.includes(me.id));
  const jamUntil = me ? state.buzzJamUntil[me.id] ?? 0 : 0;
  const jammed = jamUntil > Date.now();
  const blindfold = Boolean(state.blindfoldUntil && state.blindfoldUntil > Date.now());

  return (
    <Layout title="KernelChaos · Trivia">
      {flash ? <div className="trivia-buzz-flash" aria-hidden /> : null}
      {error ? <p className="error">{error}</p> : null}

      {state.phase === "lobby" || (state.phase === "results" && !state.board) ? (
        state.phase === "lobby" ? (
          <TriviaLobby
            state={state}
            me={me}
            joinUrl={joinUrl}
            onSetPack={room.setTriviaPack}
            onSetChaosMode={room.setTriviaChaosMode}
            onStart={() => {
              unlockAudio();
              room.start();
            }}
          />
        ) : (
          <section className="trivia-play">
            <h2>Results</h2>
            <TriviaScoreRail state={state} meId={room.playerId} />
            <p className="winner-banner">
              {state.winners
                .map((id) => state.players.find((p) => p.id === id)?.name)
                .filter(Boolean)
                .join(" & ") || "—"}{" "}
              win!
            </p>
            {me?.isHost ? (
              <button type="button" className="btn primary" onClick={room.playAgain}>
                Play again
              </button>
            ) : null}
          </section>
        )
      ) : (
        <section className="trivia-play">
          <TriviaScoreRail state={state} meId={room.playerId} />

          {state.phase === "board" && state.board ? (
            <>
              <p className="trivia-status">
                {state.round === "double" ? "Double · " : ""}
                {me?.id === state.controllerId
                  ? "Your pick"
                  : `Waiting on ${controllerName}…`}
              </p>
              <TriviaBoard
                board={state.board}
                interactive={me?.id === state.controllerId}
                onPick={room.pickCell}
                variant="phone"
              />
            </>
          ) : null}

          {state.phase === "clue" && state.activeClue?.isDailyDouble ? (
            <TriviaDailyDouble stage="reveal" />
          ) : null}

          {state.phase === "dailyWager" && state.activeClue ? (
            me?.id === state.controllerId ? (
              <>
                <TriviaDailyDouble
                  stage="wager"
                  playerName={me.name}
                  maxWager={state.dailyWagerMax}
                  category={state.activeClue.categoryTitle}
                />
                <TriviaWager
                  min={TRIVIA_DAILY_WAGER_MIN}
                  max={state.dailyWagerMax ?? state.activeClue.value}
                  label="Daily Double wager"
                  onLock={room.setDailyWager}
                />
              </>
            ) : (
              <TriviaDailyDouble
                stage="wager"
                playerName={controllerName}
                maxWager={state.dailyWagerMax}
                category={state.activeClue.categoryTitle}
              />
            )
          ) : null}

          {state.activeClue &&
          ((state.phase === "clue" && !state.activeClue.isDailyDouble) ||
            state.phase === "buzzOpen" ||
            state.phase === "answering" ||
            state.phase === "reveal") ? (
            <div className="trivia-clue-stage">
              <p className="trivia-clue-cat">{state.activeClue.categoryTitle}</p>
              <p className="trivia-clue-prompt">{state.activeClue.prompt}</p>
              {state.phase === "buzzOpen" ? (
                <TriviaBuzzer
                  disabled={lockedOut || jammed}
                  onBuzz={() => {
                    unlockAudio();
                    room.buzz();
                  }}
                />
              ) : null}
              {state.phase === "answering" && me?.id === state.buzzedPlayerId ? (
                <TriviaChoices
                  choices={state.activeClue?.choices ?? []}
                  blindfold={blindfold}
                  hintExcluded={state.hintExcluded}
                  onChoose={room.answer}
                />
              ) : null}
              {state.phase === "answering" && me?.id !== state.buzzedPlayerId ? (
                <>
                  <p className="trivia-status">{buzzedName} is answering…</p>
                  {state.chaosDash ? (
                    <TriviaChaosDash dash={state.chaosDash} onSolve={room.solveChaos} />
                  ) : null}
                </>
              ) : null}
              {state.phase === "reveal" && state.activeClue?.choices ? (
                <TriviaChoices
                  choices={state.activeClue.choices}
                  disabled
                  correctIndex={state.activeClue.correctChoiceIndex}
                  selectedIndex={state.activeClue.selectedChoiceIndex}
                />
              ) : null}
            </div>
          ) : null}

          {state.phase === "between" ? (
            <div className="trivia-between">
              <h2>Double Trivia</h2>
            </div>
          ) : null}

          {state.phase === "finalCategory" ? (
            <div className="trivia-final">
              <p className="muted">Final Trivia</p>
              <h2>{state.finalCategory}</h2>
            </div>
          ) : null}

          {state.phase === "finalWager" && me ? (
            <TriviaWager
              min={0}
              max={Math.max(0, me.score)}
              label="Final wager"
              onLock={room.setFinalWager}
            />
          ) : null}

          {state.phase === "finalAnswer" && state.finalChoices ? (
            <div className="trivia-clue-stage">
              <p className="trivia-clue-cat">{state.finalCategory}</p>
              <p className="trivia-clue-prompt">{state.finalPrompt}</p>
              <TriviaChoices
                choices={state.finalChoices}
                disabled={Boolean(me?.finalAnswered)}
                onChoose={room.finalAnswer}
              />
            </div>
          ) : null}

          {state.phase === "results" ? (
            <>
              <h2>Results</h2>
              <p className="winner-banner">
                {state.winners
                  .map((id) => state.players.find((p) => p.id === id)?.name)
                  .filter(Boolean)
                  .join(" & ")}{" "}
                win!
              </p>
              {me?.isHost ? (
                <button type="button" className="btn primary" onClick={room.playAgain}>
                  Play again
                </button>
              ) : null}
            </>
          ) : null}

          {me && state.chaosMode !== "off" ? (
            <TriviaChaosTray
              mode={state.chaosMode}
              phase={state.phase}
              me={me}
              players={state.players}
              onUse={room.useChaos}
              onCheer={room.cheer}
            />
          ) : null}

          {state.phase === "reveal" && state.challengeOpen ? (
            <div className="trivia-challenge">
              <p>Too easy?</p>
              <button type="button" className="btn" onClick={() => room.challengeVote(true)}>
                Yes
              </button>
              <button type="button" className="btn" onClick={() => room.challengeVote(false)}>
                No
              </button>
            </div>
          ) : null}
        </section>
      )}
    </Layout>
  );
}
