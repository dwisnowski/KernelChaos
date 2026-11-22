import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useParams } from "react-router-dom";
import {
  playTriviaBuzzLock,
  playTriviaChaosWin,
  playTriviaCorrect,
  playTriviaDailyDouble,
  playTriviaFinal,
  playTriviaWrong,
  unlockAudio,
} from "../audio/sfx.ts";
import { Layout } from "../components/Layout.tsx";
import { TriviaBoard } from "../components/TriviaBoard.tsx";
import { TriviaChoices } from "../components/TriviaChoices.tsx";
import { TriviaClueReveal } from "../components/TriviaClueReveal.tsx";
import { TriviaDailyDouble } from "../components/TriviaDailyDouble.tsx";
import { TriviaScoreRail } from "../components/TriviaScoreRail.tsx";
import { useTriviaRoom } from "../hooks/useTriviaRoom.ts";
import { cancelTriviaSpeech, speakTriviaClue } from "../lib/triviaTts.ts";
import { TRIVIA_PACK_LABELS } from "../triviaTypes.ts";

export function TriviaSpectator() {
  const { code = "" } = useParams();
  const roomCode = code.toUpperCase();
  const joined = useRef(false);
  const lastBuzzSeq = useRef(0);
  const lastChaosWin = useRef(0);
  const lastDd = useRef(false);
  const lastOutcome = useRef<string | null>(null);
  const lastClueStage = useRef<string | null>(null);
  const lastSpokeKey = useRef<string | null>(null);
  const [cellFlash, setCellFlash] = useState(false);

  const room = useTriviaRoom({ code: roomCode || null, role: "spectator" });

  useEffect(() => {
    if (!room.connected || joined.current) return;
    joined.current = true;
    unlockAudio();
    room.spectate();
  }, [room.connected, room.spectate]);

  const joinUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/trivia/join?code=${roomCode}`
      : `/trivia/join?code=${roomCode}`;

  useEffect(() => {
    if (!room.state) return;
    if (room.state.buzzLockSeq > lastBuzzSeq.current) {
      lastBuzzSeq.current = room.state.buzzLockSeq;
      playTriviaBuzzLock();
    }
  }, [room.state]);

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
    if (dd && !lastDd.current) playTriviaDailyDouble();
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
    }
    if (room.state.phase === "finalCategory") playTriviaFinal();
  }, [room.state]);

  const state = room.state;

  return (
    <Layout
      title="KernelChaos · TV"
      playerRoom={roomCode ? { code: roomCode, game: "trivia" } : undefined}
    >
      {!state ? (
        <p className="muted">Connecting to Trivia…</p>
      ) : (
        <section className="spectator-screen trivia-tv">
          {state.phase === "lobby" ? (
            <div className="spectator-lobby">
              <div className="spectator-lobby-main">
                <p className="lobby-label">Room code</p>
                <p className="room-code" aria-label={`Room code ${state.code}`}>
                  {state.code}
                </p>
                <p className="spectator-tag">
                  TV spectator · Trivia · {TRIVIA_PACK_LABELS[state.packId]} pack
                </p>
                <div className="qr-wrap">
                  <QRCodeSVG
                    value={joinUrl}
                    size={240}
                    level="M"
                    includeMargin
                    bgColor="#f2f5fa"
                    fgColor="#0e1f35"
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
          ) : (
            <div className="trivia-tv-play">
              <header className="trivia-tv-title">
                <div className="trivia-tv-title-main">
                  <h1>Trivia</h1>
                  <p className="trivia-tv-pack">
                    {TRIVIA_PACK_LABELS[state.packId]} pack
                  </p>
                  <p className="room-code trivia-tv-code" aria-label={`Room code ${state.code}`}>
                    {state.code}
                  </p>
                </div>
                <div className="trivia-tv-join">
                  <div className="qr-wrap trivia-tv-qr">
                    <QRCodeSVG
                      value={joinUrl}
                      size={96}
                      level="M"
                      includeMargin
                      bgColor="#f2f5fa"
                      fgColor="#0e1f35"
                    />
                  </div>
                  <p className="muted trivia-tv-join-hint">Scan to join</p>
                </div>
              </header>

              {(state.phase === "board" ||
                (state.phase === "clue" &&
                  (state.clueStage === "highlight" ||
                    state.clueStage === "reveal"))) &&
              state.board ? (
                <div
                  className={
                    state.clueStage === "reveal"
                      ? "trivia-board-wrap is-dimmed"
                      : undefined
                  }
                >
                  <TriviaBoard
                    board={state.board}
                    variant="tv"
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
                    <p className="trivia-status trivia-status-tv">
                      {(state.players.find((p) => p.id === state.controllerId)?.name ??
                        "Player") + "'s pick"}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <TriviaScoreRail state={state} variant="tv" />

              {state.phase === "clue" &&
              state.clueStage === "reveal" &&
              state.activeClue?.isDailyDouble ? (
                <TriviaClueReveal
                  active
                  categoryIndex={state.activeClue.categoryIndex}
                  tier={state.activeClue.tier}
                  className="trivia-clue-expand-tv"
                >
                  <TriviaDailyDouble stage="reveal" />
                </TriviaClueReveal>
              ) : null}

              {state.phase === "dailyWager" ? (
                <TriviaDailyDouble
                  stage="wager"
                  playerName={
                    state.players.find((p) => p.id === state.controllerId)?.name
                  }
                  maxWager={state.dailyWagerMax}
                  category={state.activeClue?.categoryTitle}
                />
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
                    className="trivia-clue-expand-tv"
                  >
                    <div className="trivia-clue-stage trivia-clue-tv">
                      <p className="trivia-clue-cat">{state.activeClue.categoryTitle}</p>
                      <p className="trivia-clue-prompt">{state.activeClue.prompt}</p>
                    </div>
                  </TriviaClueReveal>
                ) : (
                  <div
                    className={`trivia-clue-stage trivia-clue-tv${
                      state.screenZapUntil && state.screenZapUntil > Date.now()
                        ? " is-zapped"
                        : ""
                    }`}
                  >
                    <p className="trivia-clue-cat">{state.activeClue.categoryTitle}</p>
                    <p className="trivia-clue-prompt">{state.activeClue.prompt}</p>
                    {state.phase === "buzzOpen" ? (
                      <p className="trivia-buzz-pulse">BUZZ!</p>
                    ) : null}
                    {state.phase === "answering" ? (
                      <p className="trivia-banner">
                        {(state.players.find((p) => p.id === state.buzzedPlayerId)
                          ?.name ?? "Player") + " locked in"}
                      </p>
                    ) : null}
                    {(state.phase === "answering" || state.phase === "reveal") &&
                    state.activeClue.choices ? (
                      <TriviaChoices
                        choices={state.activeClue.choices}
                        disabled
                        variant="tv"
                        correctIndex={
                          state.phase === "reveal"
                            ? state.activeClue.correctChoiceIndex
                            : null
                        }
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
                  <p className="spectator-tag">Final Trivia</p>
                  <h2>{state.finalCategory}</h2>
                </div>
              ) : null}

              {state.phase === "finalWager" ? (
                <div className="trivia-final">
                  <h2>Wagers in…</h2>
                  <ul>
                    {state.players.map((p) => (
                      <li key={p.id}>
                        {p.name} {p.finalWager != null ? "✓" : "…"}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {state.phase === "finalAnswer" && state.finalChoices ? (
                <div className="trivia-clue-stage trivia-clue-tv">
                  <p className="trivia-clue-cat">{state.finalCategory}</p>
                  <p className="trivia-clue-prompt">{state.finalPrompt}</p>
                  <TriviaChoices choices={state.finalChoices} disabled variant="tv" />
                </div>
              ) : null}

              {state.phase === "results" ? (
                <div className="trivia-final">
                  <p className="winner-banner">
                    {state.winners
                      .map((id) => state.players.find((p) => p.id === id)?.name)
                      .filter(Boolean)
                      .join(" & ")}{" "}
                    win!
                  </p>
                </div>
              ) : null}

              {state.lastOutcomePlayerName && state.lastOutcome === "chaosWin" ? (
                <p className="trivia-banner">{state.lastOutcomePlayerName} won Chaos!</p>
              ) : null}
            </div>
          )}
        </section>
      )}
    </Layout>
  );
}
