import { useCallback, useRef, useState } from "react";
import { areAdjacent, pathToWord } from "../lib/path.ts";

interface Props {
  board: string[];
  size: number;
  disabled?: boolean;
  onSubmitPath: (path: number[]) => void;
  onInvalid?: () => void;
}

function cellFromPoint(boardEl: HTMLElement, clientX: number, clientY: number): number | null {
  const el = document.elementFromPoint(clientX, clientY);
  if (!el || !(el instanceof HTMLElement)) return null;
  const cell = el.closest("[data-cell]") as HTMLElement | null;
  if (!cell || !boardEl.contains(cell)) return null;
  const idx = Number(cell.dataset.cell);
  return Number.isFinite(idx) ? idx : null;
}

export function BoggleBoard({ board, size, disabled, onSubmitPath, onInvalid }: Props) {
  const [path, setPath] = useState<number[]>([]);
  const dragging = useRef(false);
  const boardRef = useRef<HTMLDivElement>(null);

  const finish = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    setPath((current) => {
      if (current.length >= 3) {
        onSubmitPath(current);
      } else if (current.length > 0) {
        onInvalid?.();
      }
      return [];
    });
  }, [onInvalid, onSubmitPath]);

  const extend = useCallback(
    (idx: number) => {
      setPath((current) => {
        if (current.includes(idx)) {
          if (current.length >= 2 && current[current.length - 2] === idx) {
            return current.slice(0, -1);
          }
          return current;
        }
        const last = current[current.length - 1];
        if (last == null || areAdjacent(size, last, idx)) {
          return [...current, idx];
        }
        return current;
      });
    },
    [size],
  );

  return (
    <div className="board-wrap">
      <div
        ref={boardRef}
        className={`boggle-board size-${size}${disabled ? " is-disabled" : ""}`}
        style={{ ["--n" as string]: size }}
        onPointerDown={(e) => {
          if (disabled) return;
          unlockPointer(e.currentTarget, e.pointerId);
          dragging.current = true;
          const idx = cellFromPoint(e.currentTarget, e.clientX, e.clientY);
          if (idx != null) {
            setPath([idx]);
          }
        }}
        onPointerMove={(e) => {
          if (!dragging.current || disabled) return;
          const idx = cellFromPoint(e.currentTarget, e.clientX, e.clientY);
          if (idx != null) extend(idx);
        }}
        onPointerUp={finish}
        onPointerCancel={finish}
        onPointerLeave={(e) => {
          if (e.buttons === 0) finish();
        }}
      >
        {board.map((letter, i) => (
          <div
            key={i}
            data-cell={i}
            className={`board-cell${path.includes(i) ? " is-selected" : ""}`}
          >
            <span>{letter}</span>
          </div>
        ))}
      </div>
      <p className="path-preview" aria-live="polite">
        {path.length ? pathToWord(board, path) : "Drag letters to make a word"}
      </p>
    </div>
  );
}

function unlockPointer(el: HTMLElement, pointerId: number) {
  try {
    el.setPointerCapture(pointerId);
  } catch {
    /* ignore */
  }
}
