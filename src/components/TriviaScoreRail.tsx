import type { TriviaPlayerPublic, TriviaRoomState } from "../triviaTypes.ts";

interface Props {
  state: TriviaRoomState;
  meId?: string | null;
  variant?: "phone" | "tv";
}

export function TriviaScoreRail({ state, meId, variant = "phone" }: Props) {
  return (
    <ul className={`trivia-score-rail trivia-score-rail-${variant}`} aria-label="Scores">
      {state.players.map((p) => (
        <TriviaScoreSeat key={p.id} player={p} state={state} isMe={p.id === meId} />
      ))}
      {state.pot > 0 ? <li className="trivia-score-pot">Pot {state.pot}</li> : null}
    </ul>
  );
}

function TriviaScoreSeat({
  player,
  state,
  isMe,
}: {
  player: TriviaPlayerPublic;
  state: TriviaRoomState;
  isMe: boolean;
}) {
  const isController = state.controllerId === player.id && state.phase === "board";
  const isBuzzed = state.buzzedPlayerId === player.id && state.phase === "answering";
  const isFake = state.fakeBuzzPlayerId === player.id || state.spotlightPlayerId === player.id;
  const classes = [
    "trivia-score-seat",
    isMe ? "is-me" : "",
    isController ? "is-controller" : "",
    isBuzzed ? "is-buzzed" : "",
    isFake ? "is-fake-buzz" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <li className={classes}>
      <span className="trivia-score-name">
        {player.name}
        {player.chaosCharges > 0 ? (
          <span className="trivia-charge-pips" aria-label={`${player.chaosCharges} chaos`}>
            {"●".repeat(player.chaosCharges)}
          </span>
        ) : null}
      </span>
      <span className="trivia-score-pts">{player.score}</span>
    </li>
  );
}
