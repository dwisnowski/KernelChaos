import { FAMILY_PACK } from "./family.ts";
import type { TriviaPack, TriviaPackId } from "./protocol.ts";

const PACKS: Record<TriviaPackId, TriviaPack> = {
  family: FAMILY_PACK,
};

export function getTriviaPack(id: TriviaPackId): TriviaPack {
  return PACKS[id] ?? FAMILY_PACK;
}

export function listTriviaPacks(): { id: TriviaPackId; title: string; tagline: string }[] {
  return Object.values(PACKS).map((p) => ({
    id: p.id,
    title: p.title,
    tagline: p.tagline,
  }));
}
