import { WORD_LIST } from "./words.ts";

let cached: Set<string> | null = null;

export function getDictionary(): Set<string> {
  if (!cached) {
    cached = new Set(WORD_LIST.split("\n").filter(Boolean));
  }
  return cached;
}

export function isDictionaryWord(word: string): boolean {
  return getDictionary().has(word.toLowerCase());
}
