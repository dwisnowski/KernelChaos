/** Validate a path of cell indices on an N×N board. */

export function pathToWord(board: string[], path: number[]): string | null {
  if (path.length === 0) return null;
  const parts: string[] = [];
  for (const idx of path) {
    const cell = board[idx];
    if (!cell) return null;
    parts.push(cell === "Qu" ? "qu" : cell.toLowerCase());
  }
  return parts.join("");
}

export function isValidPath(size: number, path: number[]): boolean {
  const n = size * size;
  if (path.length === 0) return false;
  const seen = new Set<number>();
  for (let i = 0; i < path.length; i++) {
    const idx = path[i]!;
    if (!Number.isInteger(idx) || idx < 0 || idx >= n) return false;
    if (seen.has(idx)) return false;
    seen.add(idx);
    if (i === 0) continue;
    const prev = path[i - 1]!;
    if (!areAdjacent(size, prev, idx)) return false;
  }
  return true;
}

export function areAdjacent(size: number, a: number, b: number): boolean {
  const ar = Math.floor(a / size);
  const ac = a % size;
  const br = Math.floor(b / size);
  const bc = b % size;
  return Math.abs(ar - br) <= 1 && Math.abs(ac - bc) <= 1 && a !== b;
}
