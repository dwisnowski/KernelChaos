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
import { TriviaClueReveal } from "../components/TriviaClueReveal.tsx";
import { TriviaDailyDouble } from "../components/TriviaDailyDouble.tsx";
import { TriviaLobby } from "../components/TriviaLobby.tsx";
import { TriviaScoreRail } from "../components/TriviaScoreRail.tsx";
import { TriviaWager } from "../components/TriviaWager.tsx";
import { useTriviaRoom } from "../hooks/useTriviaRoom.ts";
import { cancelTriviaSpeech, speakTriviaClue } from "../lib/triviaTts.ts";
import { TRIVIA_DAILY_WAGER_MIN } from "../triviaTypes.ts";

export function TriviaRoom() {
  const { code = "" } = useParams();
  const roomCode = code.toUpperCase();
  const location = useLocation();
  const navName = (location.state as { name?: string } | null)?.name;
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const joined = useRef(false);
  const lastBuzzSeq = useRef(0);
  const lastChaosWin = useRef(0);
  const lastDd = useRef(false);
  const lastOutcome = useRef<string | null>(null);
  const lastClueStage = useRef<string | null>(null);
  const lastSpokeKey = useRef<string | null>(null);
  const [cellFlash, setCellFlash] = useState(false);

  const room = useTriviaRoom({
    code: roomCode || null,
    onError: setError,
  });

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(id);
  }, []);

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
    const stage = room.state.clueStage;
    if (stage === "highlight" && lastClueStage.current !== "highlight") {
      setCellFlash(true);
      const t = window.setTimeout(() => setCellFlash(false), 220);
      lastClueStage.current = stage;
      return () => window.clearTimeout(t);
    }
    lastClueStage.current = stage;
  }, [room.state]);

  useEffect(() => {
    if (!room.state) return;
    const dd =
      room.state.activeClue?.isDailyDouble &&
      room.state.phase === "clue" &&
      room.state.clueStage === "reveal";
    if (dd && !lastDd.current) {
      playTriviaDailyDouble();
    }
    lastDd.current = Boolean(dd);
  }, [room.state]);

  useEffect(() => {
    if (!room.state) return;
    const s = room.state;
    const clue = s.activeClue;
    if (
      s.clueStage === "reveal" &&
      clue &&
      !clue.isDailyDouble &&
      clue.prompt
    ) {
      const key = `clue:${clue.categoryIndex}-${clue.tier}-${clue.prompt}`;
      if (lastSpokeKey.current !== key) {
        lastSpokeKey.current = key;
        speakTriviaClue({ category: clue.categoryTitle, prompt: clue.prompt });
      }
    } else if (
      s.phase === "answering" &&
      clue?.isDailyDouble &&
      clue.prompt
    ) {
      const key = `dd:${clue.categoryIndex}-${clue.tier}-${clue.prompt}`;
      if (lastSpokeKey.current !== key) {
        lastSpokeKey.current = key;
        speakTriviaClue({ category: clue.categoryTitle, prompt: clue.prompt });
      }
    } else if (s.phase === "board" || s.phase === "lobby" || s.phase === "results") {
      lastSpokeKey.current = null;
      cancelTriviaSpeech();
    }
  }, [room.state]);

  useEffect(() => () => cancelTriviaSpeech(), []);

  useEffect(() => {
    if (!room.state) return;
    const o = room.state.lastOutcome;
    if (o && o !== lastOutcome.current) {
      lastOutcome.current = o;
      if (o === "correct") playTriviaCorrect();
      else if (o === "wrong" || o === "timeout") playTriviaWrong();
      else if (
        o !== "boardClear" &&
        o !== "chaosWin" &&
        o !== "dailyDouble" &&
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
  const jammed = jamUntil > now;
  const buzzArmed =
    !lockedOut &&
    !jammed &&
    (state.buzzOpenAt == null
      ? state.phase === "buzzOpen"
      : now >= state.buzzOpenAt);
  const showBuzzer =
    (state.phase === "clue" &&
      state.clueStage === "reveal" &&
      !state.activeClue?.isDailyDouble) ||
    state.phase === "buzzOpen";
  const blindfold = Boolean(state.blindfoldUntil && state.blindfoldUntil > now);

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

          {(state.phase === "board" ||
            (state.phase === "clue" &&
              (state.clueStage === "highlight" || state.clueStage === "reveal"))) &&
          state.board ? (
            <div
              className={
                state.clueStage === "reveal" ? "trivia-board-wrap is-dimmed" : undefined
              }
            >
              <TriviaBoard
                board={state.board}
                interactive={
                  state.phase === "board" && me?.id === state.controllerId
                }
                onPick={room.pickCell}
                variant="phone"
                pickedCategory={
                  state.clueStage === "highlight" || state.clueStage === "reveal"
                    ? state.activeClue?.categoryIndex
                    : null
                }
                pickedTier={
                  state.clueStage === "highlight" || state.clueStage === "reveal"
                    ? state.activeClue?.tier
                    : null
                }
                pickedFlash={cellFlash}
              />
              {state.phase === "board" ? (
                <p className="trivia-status trivia-status-phone">
                  {state.round === "double" ? "Double · " : ""}
                  {me?.id === state.controllerId
                    ? "Your pick"
                    : `Waiting on ${controllerName}…`}
                </p>
              ) : null}
            </div>
          ) : null}

          {state.phase === "clue" &&
          state.clueStage === "reveal" &&
          state.activeClue?.isDailyDouble ? (
            <TriviaClueReveal
              active
              categoryIndex={state.activeClue.categoryIndex}
              tier={state.activeClue.tier}
            >
              <TriviaDailyDouble stage="reveal" />
            </TriviaClueReveal>
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
          ((state.phase === "clue" &&
            state.clueStage === "reveal" &&
            !state.activeClue.isDailyDouble) ||
            state.phase === "buzzOpen" ||
            state.phase === "answering" ||
            state.phase === "reveal") ? (
            state.phase === "clue" && state.clueStage === "reveal" ? (
              <TriviaClueReveal
                active
                categoryIndex={state.activeClue.categoryIndex}
                tier={state.activeClue.tier}
              >
                <div className="trivia-clue-stage">
                  <p className="trivia-clue-cat">{state.activeClue.categoryTitle}</p>
                  <p className="trivia-clue-prompt">{state.activeClue.prompt}</p>
                  {showBuzzer ? (
                    <TriviaBuzzer
                      disabled={!buzzArmed}
                      onBuzz={() => {
                        unlockAudio();
                        room.buzz();
                      }}
                    />
                  ) : null}
                </div>
              </TriviaClueReveal>
            ) : (
              <div className="trivia-clue-stage">
                <p className="trivia-clue-cat">{state.activeClue.categoryTitle}</p>
                <p className="trivia-clue-prompt">{state.activeClue.prompt}</p>
                {showBuzzer ? (
                  <TriviaBuzzer
                    disabled={!buzzArmed}
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
            )
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
