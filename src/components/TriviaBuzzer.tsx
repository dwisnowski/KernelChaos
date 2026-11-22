interface Props {
  disabled?: boolean;
  onBuzz: () => void;
}

export function TriviaBuzzer({ disabled = false, onBuzz }: Props) {
  return (
    <div className="trivia-buzzer-wrap">
      <button
        type="button"
        className={`trivia-buzzer${disabled ? " is-disabled" : ""}`}
        disabled={disabled}
        onClick={onBuzz}
        aria-label="Buzz in"
      >
        <span className="trivia-buzzer-label">BUZZ</span>
      </button>
    </div>
  );
}
