import { normalizeAnswer, startsWithLetter } from "../normalize.ts";
import type { AnswerStatus, CategoryAnswerView } from "../protocol.ts";

export interface HuntPeerFindInput {
  findKey: string;
  playerId: string;
  playerName: string;
  raw: string;
  x: number;
  y: number;
  hostRejected: boolean;
}

/** Score all hunt finds for review/results: letter + reject + uniqueness. */
export function scoreHuntPeerFinds(
  letter: string,
  finds: HuntPeerFindInput[],
): CategoryAnswerView[] {
  const prepared: Array<HuntPeerFindInput & { normalized: string; status: AnswerStatus }> =
    finds.map((f) => {
      const normalized = normalizeAnswer(f.raw);
      let status: AnswerStatus = "unique";
      if (!normalized) status = "empty";
      else if (!startsWithLetter(normalized, letter)) status = "invalidLetter";
      else if (f.hostRejected) status = "rejected";
      return { ...f, normalized, status };
    });

  const groups = new Map<string, string[]>();
  for (const f of prepared) {
    if (f.status !== "unique") continue;
    const list = groups.get(f.normalized) ?? [];
    list.push(f.findKey);
    groups.set(f.normalized, list);
  }

  for (const f of prepared) {
    if (f.status !== "unique") continue;
    const keys = groups.get(f.normalized) ?? [];
    if (keys.length > 1) f.status = "duplicate";
  }

  return prepared.map((f) => ({
    playerId: f.playerId,
    playerName: f.playerName,
    raw: f.raw,
    normalized: f.normalized,
    status: f.status,
    points: f.status === "unique" ? 1 : 0,
    hostRejected: f.hostRejected,
    votesIn: 0,
    votesOut: 0,
    findKey: f.findKey,
    x: f.x,
    y: f.y,
  }));
}

export function huntFindKey(playerId: string, findIndex: number): string {
  return `${playerId}:${findIndex}`;
}

export function parseHuntFindKey(
  key: string,
): { playerId: string; findIndex: number } | null {
  const i = key.lastIndexOf(":");
  if (i <= 0) return null;
  const playerId = key.slice(0, i);
  const findIndex = Number(key.slice(i + 1));
  if (!playerId || !Number.isInteger(findIndex) || findIndex < 0) return null;
  return { playerId, findIndex };
}

export function scoreHuntPeerPlayer(
  playerId: string,
  letter: string,
  finds: HuntPeerFindInput[],
): { total: number; findPoints: number[] } {
  const views = scoreHuntPeerFinds(letter, finds);
  const findPoints = finds
    .filter((f) => f.playerId === playerId)
    .map((f) => views.find((v) => v.findKey === f.findKey)?.points ?? 0);
  const total = findPoints.reduce((a, b) => a + b, 0);
  return { total, findPoints };
}
