import { areAdjacent } from "./path.ts";

function cellLetters(cell: string): string {
  return cell === "Qu" ? "qu" : cell.toLowerCase();
}

/**
 * Find one valid Boggle path spelling `word` on the board (Qu consumes "qu").
 * Returns cell indices or null if the word is not on the board.
 */
export function findWordPath(
  board: string[],
  size: number,
  word: string,
): number[] | null {
  const target = word.toLowerCase();
  if (!target) return null;
  const n = size * size;
  if (board.length !== n) return null;

  const used = new Uint8Array(n);

  const visit = (idx: number, pos: number, path: number[]): number[] | null => {
    const letters = cellLetters(board[idx]!);
    if (target.slice(pos, pos + letters.length) !== letters) return null;
    const nextPos = pos + letters.length;
    const nextPath = [...path, idx];
    if (nextPos === target.length) return nextPath;

    used[idx] = 1;
    for (let j = 0; j < n; j++) {
      if (used[j]) continue;
      if (!areAdjacent(size, idx, j)) continue;
      const found = visit(j, nextPos, nextPath);
      if (found) {
        used[idx] = 0;
        return found;
      }
    }
    used[idx] = 0;
    return null;
  };

  for (let i = 0; i < n; i++) {
    const found = visit(i, 0, []);
    if (found) return found;
  }
  return null;
}
