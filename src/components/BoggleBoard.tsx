import { useCallback, useRef, useState } from "react";
import { areAdjacent, pathToWord } from "../lib/path.ts";

interface Props {
  board: string[];
  size: number;
  disabled?: boolean;
  onSubmitPath: (path: number[]) => void;
  onInvalid?: () => void;
}

interface CellCenter {
  idx: number;
  cx: number;
  cy: number;
}

/**
 * Cell centers in client coordinates.
 * Boggle letters adjoin horizontally, vertically, OR diagonally (Hasbro rules).
 */
function getCellCenters(boardEl: HTMLElement, size: number): CellCenter[] {
  const rect = boardEl.getBoundingClientRect();
  const styles = getComputedStyle(boardEl);
  const gapX = parseFloat(styles.columnGap || styles.gap) || 0;
  const gapY = parseFloat(styles.rowGap || styles.gap) || 0;
  const cellW = (rect.width - gapX * (size - 1)) / size;
  const cellH = (rect.height - gapY * (size - 1)) / size;
  const centers: CellCenter[] = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      centers.push({
        idx: row * size + col,
        cx: rect.left + col * (cellW + gapX) + cellW / 2,
        cy: rect.top + row * (cellH + gapY) + cellH / 2,
      });
    }
  }
  return centers;
}

function dist2(ax: number, ay: number, bx: number, by: number): number {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

/** Nearest cell under the finger (for starting a path). */
function nearestCellAt(
  centers: CellCenter[],
  clientX: number,
  clientY: number,
  maxDist: number,
): number | null {
  let best: number | null = null;
  let bestD = maxDist * maxDist;
  for (const c of centers) {
    const d = dist2(clientX, clientY, c.cx, c.cy);
    if (d <= bestD) {
      bestD = d;
      best = c.idx;
    }
  }
  return best;
}

/** Orthogonal stride between neighboring cell centers (average of first row step). */
function orthogonalStride(centers: CellCenter[], size: number): number {
  if (centers.length < 2) return 80;
  const a = centers[0]!;
  const b = centers[1]!;
  // Prefer horizontal neighbor when available.
  if (size > 1) {
    return Math.hypot(b.cx - a.cx, b.cy - a.cy);
  }
  return 80;
}

function neighborInDirection(size: number, idx: number, dr: number, dc: number): number | null {
  const row = Math.floor(idx / size) + dr;
  const col = (idx % size) + dc;
  if (row < 0 || row >= size || col < 0 || col >= size) return null;
  return row * size + col;
}

/**
 * Map finger angle from the current letter into one of 8 equal wedges.
 * Diagonals get the same ±22.5° share as orthogonals — nearest-center made
 * diagonals harder because those centers are √2 farther away.
 *
 * atan2(dy, dx): 0 = east, increases clockwise in screen coords (y down).
 * Sectors: E, SE, S, SW, W, NW, N, NE.
 */
function directionFromDelta(dx: number, dy: number): { dr: number; dc: number } {
  const angle = Math.atan2(dy, dx); // -PI..PI
  const step = Math.PI / 4;
  // Round to nearest 45° sector; shift so 0 maps to east.
  let sector = Math.round(angle / step);
  if (sector === -4) sector = 4;
  // sector: 0 E, 1 SE, 2 S, 3 SW, 4/-4 W, -3 NW, -2 N, -1 NE
  switch (sector) {
    case 0:
      return { dr: 0, dc: 1 };
    case 1:
      return { dr: 1, dc: 1 };
    case 2:
      return { dr: 1, dc: 0 };
    case 3:
      return { dr: 1, dc: -1 };
    case 4:
    case -4:
      return { dr: 0, dc: -1 };
    case -3:
      return { dr: -1, dc: -1 };
    case -2:
      return { dr: -1, dc: 0 };
    case -1:
      return { dr: -1, dc: 1 };
    default:
      return { dr: 0, dc: 1 };
  }
}

/**
 * Direction-wedge selection: once the finger leaves a small dead zone around
 * the current letter, snap to the adjacent letter in that compass direction
 * (including diagonals). Pull back toward the previous letter to undo.
 */
function extendPathToward(
  path: number[],
  size: number,
  centers: CellCenter[],
  clientX: number,
  clientY: number,
): number[] {
  if (path.length === 0) {
    const start = nearestCellAt(centers, clientX, clientY, Infinity);
    return start != null ? [start] : path;
  }

  const last = path[path.length - 1]!;
  const prev = path.length >= 2 ? path[path.length - 2]! : null;
  const byIdx = new Map(centers.map((c) => [c.idx, c]));
  const lastC = byIdx.get(last);
  if (!lastC) return path;

  const dx = clientX - lastC.cx;
  const dy = clientY - lastC.cy;
  const dist = Math.hypot(dx, dy);
  const stride = orthogonalStride(centers, size);

  // Stay on the current letter until the finger clearly commits to a direction.
  const commitRadius = stride * 0.32;
  if (dist < commitRadius) return path;

  // Prefer backtracking when pulling toward the previous letter.
  if (prev != null) {
    const prevC = byIdx.get(prev);
    if (prevC) {
      const toPrev = dist2(clientX, clientY, prevC.cx, prevC.cy);
      const toLast = dist2(clientX, clientY, lastC.cx, lastC.cy);
      if (toPrev < toLast * 0.92) {
        return path.slice(0, -1);
      }
    }
  }

  const { dr, dc } = directionFromDelta(dx, dy);
  const next = neighborInDirection(size, last, dr, dc);
  if (next == null) return path;
  if (prev != null && next === prev) return path.slice(0, -1);
  if (path.includes(next)) return path;
  if (!areAdjacent(size, last, next)) return path;
  return [...path, next];
}

export function BoggleBoard({ board, size, disabled, onSubmitPath, onInvalid }: Props) {
  const [path, setPath] = useState<number[]>([]);
  const pathRef = useRef<number[]>([]);
  const dragging = useRef(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const pointerIdRef = useRef<number | null>(null);
  const centersRef = useRef<CellCenter[]>([]);

  const setPathBoth = useCallback((next: number[]) => {
    pathRef.current = next;
    setPath(next);
  }, []);

  const refreshCenters = useCallback(() => {
    const boardEl = boardRef.current;
    if (!boardEl) return;
    centersRef.current = getCellCenters(boardEl, size);
  }, [size]);

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
      if (!centersRef.current.length) refreshCenters();
      const next = extendPathToward(pathRef.current, size, centersRef.current, clientX, clientY);
      if (next.join(",") !== pathRef.current.join(",")) {
        setPathBoth(next);
      }
    },
    [refreshCenters, setPathBoth, size],
  );

  const startAt = useCallback(
    (clientX: number, clientY: number, pointerId: number, target: EventTarget | null) => {
      if (disabled) return;
      const boardEl = boardRef.current;
      if (!boardEl) return;

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

      refreshCenters();
      const cellW =
        centersRef.current.length > 1
          ? Math.hypot(
              centersRef.current[1]!.cx - centersRef.current[0]!.cx,
              centersRef.current[1]!.cy - centersRef.current[0]!.cy,
            )
          : 80;
      const start = nearestCellAt(centersRef.current, clientX, clientY, cellW * 0.75);

      pointerIdRef.current = pointerId;
      dragging.current = true;
      setPathBoth(start != null ? [start] : []);
    },
    [disabled, refreshCenters, setPathBoth],
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
