const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

interface Props {
  choices: string[];
  disabled?: boolean;
  blindfold?: boolean;
  hintExcluded?: number[];
  correctIndex?: number | null;
  selectedIndex?: number | null;
  onChoose?: (index: number) => void;
  variant?: "phone" | "tv";
}

export function TriviaChoices({
  choices,
  disabled = false,
  blindfold = false,
  hintExcluded = [],
  correctIndex = null,
  selectedIndex = null,
  onChoose,
  variant = "phone",
}: Props) {
  return (
    <div className={`trivia-choices trivia-choices-${variant}`} role="list">
      {choices.map((text, i) => {
        const classes = [
          "trivia-choice",
          hintExcluded.includes(i) ? "is-hinted-out" : "",
          correctIndex === i ? "is-correct" : "",
          selectedIndex === i && correctIndex != null && selectedIndex !== correctIndex
            ? "is-wrong"
            : "",
          selectedIndex === i ? "is-selected" : "",
        ]
          .filter(Boolean)
          .join(" ");
        return (
          <button
            key={i}
            type="button"
            className={classes}
            disabled={disabled || !onChoose || hintExcluded.includes(i)}
            onClick={() => onChoose?.(i)}
          >
            <span className="trivia-choice-letter">{LETTERS[i] ?? "?"}</span>
            <span className="trivia-choice-text">{blindfold ? "••••••" : text}</span>
          </button>
        );
      })}
    </div>
  );
}
