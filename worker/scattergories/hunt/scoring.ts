import { normalizeAnswer, startsWithLetter } from "../normalize.ts";
import type { HuntScene } from "./scenes.ts";
import { HUNT_MAX_ANSWERS } from "./scenes.ts";

export type HuntFindStatus =
  | "unique"
  | "duplicate"
  | "invalidLetter"
  | "empty"
  | "unknown";

export interface HuntFindView {
  raw: string;
  normalized: string;
  objectId: string | null;
  status: HuntFindStatus;
  points: number;
}

export interface HuntPlayerScore {
  playerId: string;
  total: number;
  finds: HuntFindView[];
}

/** Build synonym → objectId for names that start with the round letter. */
function letterSynonymIndex(
  scene: HuntScene,
  letter: string,
): Map<string, string> {
  const index = new Map<string, string>();
  for (const obj of scene.objects) {
    for (const name of obj.names) {
      const n = normalizeAnswer(name);
      if (!n || !startsWithLetter(n, letter)) continue;
      if (!index.has(n)) index.set(n, obj.id);
    }
  }
  return index;
}

/**
 * Score a hunt round: match answers to synonym keys; uniqueness by object id.
 * Within one player, only the first claim of an object counts.
 */
export function scoreHuntRound(
  letter: string,
  scene: HuntScene,
  players: { id: string; answers: string[] }[],
): HuntPlayerScore[] {
  const index = letterSynonymIndex(scene, letter);

  // First pass: resolve each answer to an object (or status without uniqueness).
  const resolved = players.map((p) => {
    const seenObjects = new Set<string>();
    const finds: HuntFindView[] = [];
    const capped = p.answers.slice(0, HUNT_MAX_ANSWERS);

    for (const raw of capped) {
      const trimmed = typeof raw === "string" ? raw.trim() : "";
      const normalized = normalizeAnswer(trimmed);

      if (!normalized) {
        finds.push({
          raw: trimmed,
          normalized: "",
          objectId: null,
          status: "empty",
          points: 0,
        });
        continue;
      }

      if (!startsWithLetter(normalized, letter)) {
        finds.push({
          raw: trimmed,
          normalized,
          objectId: null,
          status: "invalidLetter",
          points: 0,
        });
        continue;
      }

      const objectId = index.get(normalized) ?? null;
      if (!objectId) {
        finds.push({
          raw: trimmed,
          normalized,
          objectId: null,
          status: "unknown",
          points: 0,
        });
        continue;
      }

      if (seenObjects.has(objectId)) {
        // Same object twice from one player — treat as non-scoring duplicate of self.
        finds.push({
          raw: trimmed,
          normalized,
          objectId,
          status: "duplicate",
          points: 0,
        });
        continue;
      }

      seenObjects.add(objectId);
      finds.push({
        raw: trimmed,
        normalized,
        objectId,
        status: "unique", // provisional until cross-player uniqueness
        points: 1,
      });
    }

    return { playerId: p.id, finds };
  });

  // Count how many players claim each object (first valid claim per player only).
  const objectClaimants = new Map<string, string[]>();
  for (const p of resolved) {
    const claimed = new Set<string>();
    for (const f of p.finds) {
      if (!f.objectId || f.status === "duplicate") continue;
      if (claimed.has(f.objectId)) continue;
      claimed.add(f.objectId);
      const list = objectClaimants.get(f.objectId) ?? [];
      list.push(p.playerId);
      objectClaimants.set(f.objectId, list);
    }
  }

  return resolved.map((p) => {
    const finds = p.finds.map((f) => {
      if (!f.objectId || f.status === "duplicate" || f.status === "empty" || f.status === "invalidLetter" || f.status === "unknown") {
        return { ...f, points: 0 };
      }
      const claimants = objectClaimants.get(f.objectId) ?? [];
      if (claimants.length > 1) {
        return { ...f, status: "duplicate" as const, points: 0 };
      }
      return { ...f, status: "unique" as const, points: 1 };
    });
    const total = finds.reduce((sum, f) => sum + f.points, 0);
    return { playerId: p.playerId, total, finds };
  });
}

export function scoreHuntPlayer(
  playerId: string,
  letter: string,
  scene: HuntScene,
  players: { id: string; answers: string[] }[],
): { total: number; findPoints: number[] } {
  const scored = scoreHuntRound(letter, scene, players);
  const mine = scored.find((s) => s.playerId === playerId);
  if (!mine) return { total: 0, findPoints: [] };
  return {
    total: mine.total,
    findPoints: mine.finds.map((f) => f.points),
  };
}
