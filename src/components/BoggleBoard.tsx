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

function adjacentIndices(size: number, idx: number): number[] {
  const row = Math.floor(idx / size);
  const col = idx % size;
  const out: number[] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const r = row + dr;
      const c = col + dc;
      if (r >= 0 && r < size && c >= 0 && c < size) {
        out.push(r * size + c);
      }
    }
  }
  return out;
}

function isDiagonalStep(size: number, from: number, to: number): boolean {
  const ar = Math.floor(from / size);
  const ac = from % size;
  const br = Math.floor(to / size);
  const bc = to % size;
  return ar !== br && ac !== bc;
}

/**
 * Nearest adjacent letter center, with diagonal distance shrunk so corner
 * neighbors compete with side neighbors (diagonal centers are √2 farther).
 * Bias a bit past 1/√2 so diagonals are easier to catch without wedge snapping.
 */
const DIAGONAL_DIST_SCALE = 0.62; // < 1/√2 ≈ 0.707 → favors diagonals slightly

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

  const candidates = new Set<number>([last]);
  if (prev != null) candidates.add(prev);
  for (const n of adjacentIndices(size, last)) {
    if (!path.includes(n) || n === prev) candidates.add(n);
  }

  let best = last;
  let bestScore = Infinity;
  for (const idx of candidates) {
    const c = byIdx.get(idx);
    if (!c) continue;
    let score = Math.hypot(clientX - c.cx, clientY - c.cy);
    if (idx !== last && idx !== prev && isDiagonalStep(size, last, idx)) {
      score *= DIAGONAL_DIST_SCALE;
    }
    if (score < bestScore) {
      bestScore = score;
      best = idx;
    }
  }

  if (best === last) return path;
  if (prev != null && best === prev) return path.slice(0, -1);
  if (!path.includes(best) && areAdjacent(size, last, best)) {
    return [...path, best];
  }
  return path;
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
