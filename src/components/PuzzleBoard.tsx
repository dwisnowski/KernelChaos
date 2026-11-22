import type { WheelPuzzlePublic } from "../wheelTypes.ts";

interface Props {
  puzzle: WheelPuzzlePublic | null;
  className?: string;
  large?: boolean;
}

export function PuzzleBoard({ puzzle, className, large }: Props) {
  if (!puzzle) {
    return (
      <div className={className ? `puzzle-board empty ${className}` : "puzzle-board empty"}>
        <p className="muted">Waiting for puzzle…</p>
      </div>
    );
  }

  const words: { ch: string; space: boolean; i: number }[][] = [];
  let current: { ch: string; space: boolean; i: number }[] = [];
  puzzle.display.forEach((ch, i) => {
    const space = puzzle.spaceIndices.includes(i) || ch === " ";
    if (space) {
      if (current.length) {
        words.push(current);
        current = [];
      }
    } else {
      current.push({ ch, space: false, i });
    }
  });
  if (current.length) words.push(current);

  return (
    <div
      className={[
        "puzzle-board",
        large ? "puzzle-board-large" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="puzzle-category">{puzzle.category}</p>
      <div className="puzzle-words" role="img" aria-label={`Puzzle: ${puzzle.category}`}>
        {words.map((word, wi) => (
          <div className="puzzle-word" key={wi}>
            {word.map((cell) => (
              <span
                key={cell.i}
                className={`puzzle-tile${cell.ch ? " revealed" : ""}`}
              >
                {cell.ch || ""}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
