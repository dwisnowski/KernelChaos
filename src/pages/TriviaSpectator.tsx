import { useEffect, useRef } from "react";
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
import { TriviaDailyDouble } from "../components/TriviaDailyDouble.tsx";
import { TriviaScoreRail } from "../components/TriviaScoreRail.tsx";
import { useTriviaRoom } from "../hooks/useTriviaRoom.ts";

export function TriviaSpectator() {
  const { code = "" } = useParams();
  const roomCode = code.toUpperCase();
  const joined = useRef(false);
  const lastBuzzSeq = useRef(0);
  const lastChaosWin = useRef(0);
  const lastDd = useRef(false);
  const lastOutcome = useRef<string | null>(null);

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
    const dd = room.state.activeClue?.isDailyDouble && room.state.phase === "clue";
    if (dd && !lastDd.current) playTriviaDailyDouble();
    lastDd.current = Boolean(dd);
  }, [room.state]);

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
                <p className="spectator-tag">TV spectator · Trivia</p>
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
              <TriviaScoreRail state={state} variant="tv" />

              {state.phase === "board" && state.board ? (
                <>
                  <p className="trivia-status">
                    {(state.players.find((p) => p.id === state.controllerId)?.name ?? "Player") +
                      "'s pick"}
                  </p>
                  <TriviaBoard board={state.board} variant="tv" />
                </>
              ) : null}

              {state.phase === "clue" && state.activeClue?.isDailyDouble ? (
                <TriviaDailyDouble stage="reveal" />
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
              (state.phase === "clue" ||
                state.phase === "buzzOpen" ||
                state.phase === "answering" ||
                state.phase === "reveal") &&
              !(state.phase === "clue" && state.activeClue.isDailyDouble) ? (
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
                      {(state.players.find((p) => p.id === state.buzzedPlayerId)?.name ??
                        "Player") + " locked in"}
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
