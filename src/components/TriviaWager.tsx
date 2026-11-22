import { useState } from "react";

interface Props {
  min: number;
  max: number;
  label: string;
  onLock: (amount: number) => void;
}

export function TriviaWager({ min, max, label, onLock }: Props) {
  const [amount, setAmount] = useState(() => Math.min(max, Math.max(min, min)));

  function clamp(n: number) {
    return Math.max(min, Math.min(max, n));
  }

  return (
    <div className="trivia-wager">
      <p className="trivia-wager-label">{label}</p>
      <p className="trivia-wager-amount">{amount}</p>
      <div className="trivia-wager-controls">
        <button type="button" className="btn" onClick={() => setAmount((a) => clamp(a - 50))}>
          −
        </button>
        <button type="button" className="btn" onClick={() => setAmount((a) => clamp(a + 50))}>
          +
        </button>
        <button type="button" className="btn" onClick={() => setAmount(max)}>
          Max
        </button>
      </div>
      <button type="button" className="btn primary" onClick={() => onLock(amount)}>
        Lock wager
      </button>
    </div>
  );
}
