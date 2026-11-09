import { useCallback, useRef, useState } from "react";
import { areAdjacent, pathToWord } from "../lib/path.ts";

interface Props {
  board: string[];
  size: number;
  disabled?: boolean;
  onSubmitPath: (path: number[]) => void;
  onInvalid?: () => void;
}

/** Geometry hit-test — more reliable than elementFromPoint across iOS cell boundaries. */
function cellFromCoords(
  boardEl: HTMLElement,
  size: number,
  clientX: number,
  clientY: number,
): number | null {
  const rect = boardEl.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;

  const styles = getComputedStyle(boardEl);
  const gapX = parseFloat(styles.columnGap || styles.gap) || 0;
  const gapY = parseFloat(styles.rowGap || styles.gap) || 0;
  const cellW = (rect.width - gapX * (size - 1)) / size;
  const cellH = (rect.height - gapY * (size - 1)) / size;
  if (cellW <= 0 || cellH <= 0) return null;

  // Map into a cell + gap track; ignore pure gap hits by clamping to nearest cell.
  let col = Math.floor(x / (cellW + gapX));
  let row = Math.floor(y / (cellH + gapY));
  col = Math.min(size - 1, Math.max(0, col));
  row = Math.min(size - 1, Math.max(0, row));

  const localX = x - col * (cellW + gapX);
  const localY = y - row * (cellH + gapY);
  // Still count a hit if the finger is slightly in the gap toward this cell.
  if (localX > cellW + gapX * 0.5 || localY > cellH + gapY * 0.5) return null;

  return row * size + col;
}

function nextPath(current: number[], idx: number, size: number): number[] {
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
}

export function BoggleBoard({ board, size, disabled, onSubmitPath, onInvalid }: Props) {
  const [path, setPath] = useState<number[]>([]);
  const pathRef = useRef<number[]>([]);
  const dragging = useRef(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const pointerIdRef = useRef<number | null>(null);

  const setPathBoth = useCallback((next: number[]) => {
    pathRef.current = next;
    setPath(next);
  }, []);

  const finish = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    pointerIdRef.current = null;
    const current = pathRef.current;
    if (current.length >= 3) {
      onSubmitPath(current);
    } else if (current.length > 0) {
      onInvalid?.();
    }
    setPathBoth([]);
  }, [onInvalid, onSubmitPath, setPathBoth]);

  const extendAt = useCallback(
    (clientX: number, clientY: number) => {
      const boardEl = boardRef.current;
      if (!boardEl) return;
      const idx = cellFromCoords(boardEl, size, clientX, clientY);
      if (idx == null) return;
      const next = nextPath(pathRef.current, idx, size);
      if (next !== pathRef.current && next.length !== pathRef.current.length) {
        setPathBoth(next);
      } else if (next.join(",") !== pathRef.current.join(",")) {
        setPathBoth(next);
      }
    },
    [setPathBoth, size],
  );

  const startAt = useCallback(
    (clientX: number, clientY: number, pointerId: number, target: EventTarget | null) => {
      if (disabled) return;
      const boardEl = boardRef.current;
      if (!boardEl) return;

      // iOS implicitly captures to the touched cell; release so the board owns the gesture.
      if (target instanceof HTMLElement && target !== boardEl) {
        try {
          if (target.hasPointerCapture?.(pointerId)) {
            target.releasePointerCapture(pointerId);
          }
        } catch {
          /* ignore */
        }
      }

      try {
        boardEl.setPointerCapture(pointerId);
      } catch {
        /* ignore */
      }

      pointerIdRef.current = pointerId;
      dragging.current = true;
      const idx = cellFromCoords(boardEl, size, clientX, clientY);
      setPathBoth(idx != null ? [idx] : []);
    },
    [disabled, setPathBoth, size],
  );

  return (
    <div className="board-wrap">
      <div
        ref={boardRef}
        className={`boggle-board size-${size}${disabled ? " is-disabled" : ""}`}
        style={{ ["--n" as string]: size }}
        onPointerDown={(e) => {
          if (disabled || e.button !== 0) return;
          e.preventDefault();
          startAt(e.clientX, e.clientY, e.pointerId, e.target);
        }}
        onPointerMove={(e) => {
          if (!dragging.current || disabled) return;
          if (pointerIdRef.current != null && e.pointerId !== pointerIdRef.current) return;
          e.preventDefault();
          extendAt(e.clientX, e.clientY);
        }}
        onPointerUp={(e) => {
          if (pointerIdRef.current != null && e.pointerId !== pointerIdRef.current) return;
          e.preventDefault();
          finish();
        }}
        onPointerCancel={(e) => {
          if (pointerIdRef.current != null && e.pointerId !== pointerIdRef.current) return;
          finish();
        }}
        onLostPointerCapture={() => {
          if (dragging.current) finish();
        }}
      >
        <svg
          className="path-connectors"
          viewBox={`0 0 ${size} ${size}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {path.length > 1
            ? path.slice(1).map((idx, i) => {
                const prev = path[i]!;
                const x1 = (prev % size) + 0.5;
                const y1 = Math.floor(prev / size) + 0.5;
                const x2 = (idx % size) + 0.5;
                const y2 = Math.floor(idx / size) + 0.5;
                return (
                  <line
                    key={`${prev}-${idx}-${i}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    className="path-connector-line"
                  />
                );
              })
            : null}
          {path.map((idx, order) => {
            const cx = (idx % size) + 0.5;
            const cy = Math.floor(idx / size) + 0.5;
            return (
              <circle
                key={`node-${idx}-${order}`}
                cx={cx}
                cy={cy}
                r={order === path.length - 1 ? 0.18 : 0.12}
                className={`path-connector-node${order === path.length - 1 ? " is-tip" : ""}`}
              />
            );
          })}
        </svg>
        {board.map((letter, i) => (
          <div
            key={i}
            data-cell={i}
            className={`board-cell${path.includes(i) ? " is-selected" : ""}${
              path[path.length - 1] === i ? " is-tip" : ""
            }`}
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
