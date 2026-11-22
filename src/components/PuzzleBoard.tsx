import { useEffect, useRef, useState } from "react";
import type { WheelPuzzlePublic } from "../wheelTypes.ts";

interface Props {
  puzzle: WheelPuzzlePublic | null;
  className?: string;
  large?: boolean;
  /** Delay between newly revealed tiles (ms). Default 500. */
  staggerMs?: number;
  /** When true, show server display immediately (between / results). */
  instant?: boolean;
  /** Fired once per newly shown letter tile (or once when reduced-motion dumps all). */
  onLetterPlace?: () => void;
}

function puzzleKey(puzzle: WheelPuzzlePublic): string {
  return `${puzzle.category}|${puzzle.display.length}|${puzzle.spaceIndices.join(",")}`;
}

function clearTimers(timers: number[]): void {
  for (const id of timers) window.clearTimeout(id);
  timers.length = 0;
}

export function PuzzleBoard({
  puzzle,
  className,
  large,
  staggerMs = 500,
  instant = false,
  onLetterPlace,
}: Props) {
  const [shown, setShown] = useState<string[]>([]);
  const shownRef = useRef<string[]>([]);
  const timersRef = useRef<number[]>([]);
  const keyRef = useRef<string | null>(null);
  const onPlaceRef = useRef(onLetterPlace);
  onPlaceRef.current = onLetterPlace;

  useEffect(() => {
    return () => clearTimers(timersRef.current);
  }, []);

  useEffect(() => {
    clearTimers(timersRef.current);

    if (!puzzle) {
      keyRef.current = null;
      shownRef.current = [];
      setShown([]);
      return;
    }

    const key = puzzleKey(puzzle);
    const identityChanged = keyRef.current !== key;
    keyRef.current = key;
    const server = puzzle.display;
    const prev = identityChanged ? server.map(() => "") : [...shownRef.current];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const newIndices = server
      .map((ch, i) => (ch && ch !== " " && !prev[i] ? i : -1))
      .filter((i) => i >= 0)
      .sort((a, b) => a - b);

    if (identityChanged || instant || reduced) {
      shownRef.current = [...server];
      setShown([...server]);
      if (!identityChanged && newIndices.length > 0 && reduced && !instant) {
        onPlaceRef.current?.();
      }
      return;
    }

    if (newIndices.length === 0) {
      // Keep length aligned if server reshaped without new letters
      if (prev.length !== server.length) {
        const aligned = server.map((ch, i) => prev[i] ?? ch);
        shownRef.current = aligned;
        setShown(aligned);
      }
      return;
    }

    const working = server.map((_, i) => prev[i] ?? "");
    shownRef.current = working;
    setShown([...working]);

    newIndices.forEach((index, step) => {
      const id = window.setTimeout(() => {
        const next = [...shownRef.current];
        next[index] = server[index] ?? "";
        shownRef.current = next;
        setShown(next);
        onPlaceRef.current?.();
      }, step * staggerMs);
      timersRef.current.push(id);
    });
  }, [puzzle, instant, staggerMs]);

  if (!puzzle) {
    return (
      <div className={className ? `puzzle-board empty ${className}` : "puzzle-board empty"}>
        <p className="muted">Waiting for puzzle…</p>
      </div>
    );
  }

  const display = shown.length === puzzle.display.length ? shown : puzzle.display;

  const words: { ch: string; i: number }[][] = [];
  let current: { ch: string; i: number }[] = [];
  display.forEach((ch, i) => {
    const space = puzzle.spaceIndices.includes(i) || puzzle.display[i] === " ";
    if (space) {
      if (current.length) {
        words.push(current);
        current = [];
      }
    } else {
      current.push({ ch: ch === " " ? "" : ch, i });
    }
  });
  if (current.length) words.push(current);

  return (
    <div
      className={["puzzle-board", large ? "puzzle-board-large" : "", className ?? ""]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="puzzle-category">{puzzle.category}</p>
      <div className="puzzle-words" role="img" aria-label={`Puzzle: ${puzzle.category}`}>
        {words.map((word, wi) => (
          <div className="puzzle-word" key={wi}>
            {word.map((cell) => (
              <span key={cell.i} className={`puzzle-tile${cell.ch ? " revealed" : ""}`}>
                {cell.ch || ""}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
