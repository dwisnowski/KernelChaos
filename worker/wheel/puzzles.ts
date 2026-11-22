import type { WheelPuzzlePublic } from "./protocol.ts";

export interface WheelPuzzle {
  id: string;
  category: string;
  answer: string;
}

/** Original KernelChaos family pack — MIT-safe, no licensed show phrases. */
export const FAMILY_PUZZLES: WheelPuzzle[] = [
  { id: "f01", category: "PHRASE", answer: "BETTER LATE THAN NEVER" },
  { id: "f02", category: "PHRASE", answer: "EASY AS PIE" },
  { id: "f03", category: "PHRASE", answer: "BREAK A LEG" },
  { id: "f04", category: "PHRASE", answer: "PIECE OF CAKE" },
  { id: "f05", category: "PHRASE", answer: "HIT THE ROAD" },
  { id: "f06", category: "PHRASE", answer: "ONCE IN A BLUE MOON" },
  { id: "f07", category: "PHRASE", answer: "SPILL THE BEANS" },
  { id: "f08", category: "PHRASE", answer: "UNDER THE WEATHER" },
  { id: "f09", category: "THING", answer: "RUBBER DUCK" },
  { id: "f10", category: "THING", answer: "FLASHLIGHT" },
  { id: "f11", category: "THING", answer: "BACKPACK" },
  { id: "f12", category: "THING", answer: "TOOTHBRUSH" },
  { id: "f13", category: "THING", answer: "UMBRELLA" },
  { id: "f14", category: "THING", answer: "BOARD GAME" },
  { id: "f15", category: "FOOD", answer: "GRILLED CHEESE" },
  { id: "f16", category: "FOOD", answer: "BANANA SPLIT" },
  { id: "f17", category: "FOOD", answer: "PEANUT BUTTER" },
  { id: "f18", category: "FOOD", answer: "MACARONI AND CHEESE" },
  { id: "f19", category: "FOOD", answer: "APPLE PIE" },
  { id: "f20", category: "FOOD", answer: "HOT CHOCOLATE" },
  { id: "f21", category: "PLACE", answer: "LIVING ROOM" },
  { id: "f22", category: "PLACE", answer: "PUBLIC LIBRARY" },
  { id: "f23", category: "PLACE", answer: "AMUSEMENT PARK" },
  { id: "f24", category: "PLACE", answer: "FARMERS MARKET" },
  { id: "f25", category: "PLACE", answer: "TREE HOUSE" },
  { id: "f26", category: "PERSON", answer: "SCHOOL TEACHER" },
  { id: "f27", category: "PERSON", answer: "FIREFIGHTER" },
  { id: "f28", category: "PERSON", answer: "BEST FRIEND" },
  { id: "f29", category: "PERSON", answer: "NEXT DOOR NEIGHBOR" },
  { id: "f30", category: "EVENT", answer: "BIRTHDAY PARTY" },
  { id: "f31", category: "EVENT", answer: "FAMILY REUNION" },
  { id: "f32", category: "EVENT", answer: "MOVIE NIGHT" },
  { id: "f33", category: "EVENT", answer: "CAMPING TRIP" },
  { id: "f34", category: "AROUND THE HOUSE", answer: "KITCHEN SINK" },
  { id: "f35", category: "AROUND THE HOUSE", answer: "COUCH CUSHION" },
  { id: "f36", category: "AROUND THE HOUSE", answer: "REMOTE CONTROL" },
  { id: "f37", category: "AROUND THE HOUSE", answer: "LAUNDRY BASKET" },
  { id: "f38", category: "ON THE MAP", answer: "GRAND CANYON" },
  { id: "f39", category: "ON THE MAP", answer: "GREAT LAKES" },
  { id: "f40", category: "ON THE MAP", answer: "PACIFIC OCEAN" },
  { id: "f41", category: "FUN AND GAMES", answer: "HIDE AND SEEK" },
  { id: "f42", category: "FUN AND GAMES", answer: "CAPTURE THE FLAG" },
  { id: "f43", category: "FUN AND GAMES", answer: "JUMP ROPE" },
  { id: "f44", category: "WHAT ARE YOU DOING", answer: "BAKING COOKIES" },
  { id: "f45", category: "WHAT ARE YOU DOING", answer: "READING A BOOK" },
  { id: "f46", category: "WHAT ARE YOU DOING", answer: "WALKING THE DOG" },
  { id: "f47", category: "IN THE GARDEN", answer: "SUNFLOWER" },
  { id: "f48", category: "IN THE GARDEN", answer: "TOMATO PLANT" },
  { id: "f49", category: "TITLE", answer: "GOODNIGHT MOON" },
  { id: "f50", category: "TITLE", answer: "THE CAT IN THE HAT" },
];

export function normalizeAnswer(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/[^A-Z ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeGuess(raw: string): string {
  return normalizeAnswer(raw);
}

export function buildDisplay(answer: string, revealed: Set<string>): {
  display: string[];
  spaceIndices: number[];
} {
  const chars = [...answer];
  const spaceIndices: number[] = [];
  const display = chars.map((ch, i) => {
    if (ch === " ") {
      spaceIndices.push(i);
      return " ";
    }
    return revealed.has(ch) ? ch : "";
  });
  return { display, spaceIndices };
}

export function toPublicPuzzle(
  puzzle: WheelPuzzle,
  revealed: Set<string>,
): WheelPuzzlePublic {
  const { display, spaceIndices } = buildDisplay(puzzle.answer, revealed);
  return {
    category: puzzle.category,
    display,
    spaceIndices,
  };
}

export function countLetterInAnswer(answer: string, letter: string): number {
  const L = letter.toUpperCase();
  let n = 0;
  for (const ch of answer) {
    if (ch === L) n += 1;
  }
  return n;
}

export function isFullyRevealed(answer: string, revealed: Set<string>): boolean {
  for (const ch of answer) {
    if (ch === " ") continue;
    if (!revealed.has(ch)) return false;
  }
  return true;
}

export function pickPuzzle(usedIds: string[]): WheelPuzzle {
  const pool = FAMILY_PUZZLES.filter((p) => !usedIds.includes(p.id));
  const source = pool.length > 0 ? pool : FAMILY_PUZZLES;
  return source[Math.floor(Math.random() * source.length)]!;
}
