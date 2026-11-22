import type { TriviaChaosDashPublic } from "../triviaTypes.ts";

interface Props {
  dash: TriviaChaosDashPublic;
  disabled?: boolean;
  onSolve: (choiceIndex: number) => void;
}

export function TriviaChaosDash({ dash, disabled, onSolve }: Props) {
  if (dash.winnerId) {
    return (
      <div className="trivia-chaos-dash is-won">
        <p className="trivia-chaos-dash-title">Chaos Dash</p>
        <p>{dash.winnerName} won Chaos!</p>
      </div>
    );
  }
  return (
    <div className="trivia-chaos-dash">
      <p className="trivia-chaos-dash-title">Chaos Dash</p>
      <p className="trivia-chaos-dash-prompt">{dash.prompt}</p>
      <div className="trivia-chaos-dash-choices">
        {dash.choices.map((c, i) => (
          <button
            key={i}
            type="button"
            className="btn"
            disabled={disabled}
            onClick={() => onSolve(i)}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
