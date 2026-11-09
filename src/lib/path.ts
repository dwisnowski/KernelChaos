export function areAdjacent(size: number, a: number, b: number): boolean {
  const ar = Math.floor(a / size);
  const ac = a % size;
  const br = Math.floor(b / size);
  const bc = b % size;
  return Math.abs(ar - br) <= 1 && Math.abs(ac - bc) <= 1 && a !== b;
}

export function pathToWord(board: string[], path: number[]): string {
  return path
    .map((i) => {
      const cell = board[i] ?? "";
      return cell === "Qu" ? "Qu" : cell;
    })
    .join("");
}
