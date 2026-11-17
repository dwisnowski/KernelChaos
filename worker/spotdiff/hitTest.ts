import { SPOT_HIT_PADDING, type SpotBox, type SpotDifference } from "./protocol.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

/** Expand box slightly for touch-friendly hits; keep inside 0–1. */
export function paddedBox(box: SpotBox, pad = SPOT_HIT_PADDING): SpotBox {
  const x = clamp01(box.x - pad);
  const y = clamp01(box.y - pad);
  const right = clamp01(box.x + box.w + pad);
  const bottom = clamp01(box.y + box.h + pad);
  return { x, y, w: Math.max(0, right - x), h: Math.max(0, bottom - y) };
}

export function pointInBox(x: number, y: number, box: SpotBox): boolean {
  return x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h;
}

export function hitDifference(
  x: number,
  y: number,
  differences: SpotDifference[],
  alreadyFound: ReadonlySet<string>,
): SpotDifference | null {
  const nx = clamp01(x);
  const ny = clamp01(y);
  for (const diff of differences) {
    if (alreadyFound.has(diff.id)) continue;
    if (pointInBox(nx, ny, paddedBox(diff.box))) return diff;
  }
  return null;
}
