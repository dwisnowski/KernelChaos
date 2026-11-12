/** Classic Scattergories letter die — hard letters omitted. */
export const LETTER_DIE = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "R",
  "S",
  "T",
  "W",
] as const;

export function rollLetter(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(1));
  return LETTER_DIE[bytes[0]! % LETTER_DIE.length]!;
}
