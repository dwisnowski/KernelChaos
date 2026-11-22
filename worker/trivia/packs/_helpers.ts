import type { TriviaCategoryDef, TriviaClueDef } from "../protocol.ts";

/** Correct answer must be choices[0]; board shuffle randomizes at play time. */
export function c(id: string, prompt: string, choices: string[]): TriviaClueDef {
  return { id, prompt, choices, correctIndex: 0 };
}

export function cat(title: string, clues: TriviaClueDef[]): TriviaCategoryDef {
  return { title, clues };
}
