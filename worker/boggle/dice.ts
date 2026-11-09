/** Classic / Big Boggle dice faces. `Qu` is one cell. */

export type BoardSize = 4 | 5 | 6;

const DICE_4: string[][] = [
  ["A", "A", "E", "E", "G", "N"],
  ["A", "B", "B", "J", "O", "O"],
  ["A", "C", "H", "O", "P", "S"],
  ["A", "F", "F", "K", "P", "S"],
  ["A", "O", "O", "T", "T", "W"],
  ["C", "I", "M", "O", "T", "U"],
  ["D", "E", "I", "L", "R", "X"],
  ["D", "E", "L", "R", "V", "Y"],
  ["D", "I", "S", "T", "T", "Y"],
  ["E", "E", "G", "H", "N", "W"],
  ["E", "E", "I", "N", "S", "U"],
  ["E", "H", "R", "T", "V", "W"],
  ["E", "I", "O", "S", "S", "T"],
  ["E", "L", "R", "T", "T", "Y"],
  ["H", "I", "M", "N", "U", "Qu"],
  ["H", "L", "N", "N", "R", "Z"],
];

/** Big Boggle–style 5×5 set (25 dice). */
const DICE_5: string[][] = [
  ...DICE_4,
  ["A", "A", "A", "F", "R", "S"],
  ["A", "A", "E", "E", "E", "E"],
  ["A", "A", "F", "I", "R", "S"],
  ["A", "D", "E", "N", "N", "N"],
  ["A", "E", "E", "E", "E", "M"],
  ["A", "E", "E", "G", "M", "U"],
  ["A", "E", "G", "M", "N", "N"],
  ["A", "F", "I", "R", "S", "Y"],
  ["B", "J", "K", "Qu", "X", "Z"],
];

/** 6×6 extended set — classic 4×4 + Big Boggle extras + vowel-weighted faces. */
const DICE_6: string[][] = [
  ...DICE_5,
  ["A", "A", "E", "I", "O", "U"],
  ["A", "E", "I", "O", "U", "Y"],
  ["B", "C", "D", "F", "G", "H"],
  ["C", "L", "M", "N", "P", "R"],
  ["D", "L", "N", "R", "S", "T"],
  ["E", "E", "L", "R", "S", "T"],
  ["G", "H", "N", "P", "R", "Y"],
  ["I", "L", "M", "N", "P", "T"],
  ["O", "O", "T", "T", "U", "W"],
  ["R", "S", "T", "L", "N", "E"],
  ["S", "T", "E", "A", "L", "N"],
];

function shuffle<T>(items: T[], random: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
  }
  return arr;
}

/** Mulberry32 — deterministic when seeded. */
export function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateBoard(size: BoardSize, seed = Date.now()): string[] {
  const pool = size === 4 ? DICE_4 : size === 5 ? DICE_5 : DICE_6;
  const random = mulberry32(seed);
  const dice = shuffle(pool.slice(0, size * size), random);
  return dice.map((faces) => faces[Math.floor(random() * faces.length)]!);
}
