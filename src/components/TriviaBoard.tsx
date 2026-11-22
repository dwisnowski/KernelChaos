import type { TriviaBoardPublic } from "../triviaTypes.ts";

interface Props {
  board: TriviaBoardPublic;
  interactive?: boolean;
  onPick?: (categoryIndex: number, tier: number) => void;
  variant?: "phone" | "tv";
}

export function TriviaBoard({ board, interactive = false, onPick, variant = "phone" }: Props) {
  return (
    <div className={`trivia-board trivia-board-${variant}`} role="grid" aria-label="Trivia board">
      <div className="trivia-board-cats" role="row">
        {board.categories.map((title, i) => (
          <div key={i} className="trivia-board-cat" role="columnheader">
            {title}
          </div>
        ))}
      </div>
      {[0, 1, 2, 3, 4].map((tier) => (
        <div key={tier} className="trivia-board-row" role="row">
          {board.categories.map((_, cat) => {
            const cell = board.cells.find((c) => c.categoryIndex === cat && c.tier === tier);
            if (!cell) return <div key={cat} className="trivia-cell is-empty" />;
            if (cell.cleared) {
              return <div key={cat} className="trivia-cell is-cleared" role="gridcell" />;
            }
            return (
              <button
                key={cat}
                type="button"
                className="trivia-cell"
                role="gridcell"
                disabled={!interactive}
                onClick={() => onPick?.(cat, tier)}
              >
                {cell.value}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
