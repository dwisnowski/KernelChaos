import { normalizeAnswer, startsWithLetter } from "./normalize.ts";
import type { AnswerStatus, CategoryAnswerView } from "./protocol.ts";

export interface PlayerAnswerInput {
  playerId: string;
  playerName: string;
  raw: string;
  hostRejected: boolean;
}

/** Score one category across all players. */
export function scoreCategory(
  letter: string,
  inputs: PlayerAnswerInput[],
): CategoryAnswerView[] {
  const prepared = inputs.map((input) => {
    const normalized = normalizeAnswer(input.raw);
    return { ...input, normalized };
  });

  const counts = new Map<string, number>();
  for (const p of prepared) {
    if (!p.normalized) continue;
    counts.set(p.normalized, (counts.get(p.normalized) ?? 0) + 1);
  }

  return prepared.map((p) => {
    let status: AnswerStatus;
    let points = 0;

    if (p.hostRejected) {
      status = "rejected";
    } else if (!p.normalized) {
      status = "empty";
    } else if (!startsWithLetter(p.normalized, letter)) {
      status = "invalidLetter";
    } else if ((counts.get(p.normalized) ?? 0) > 1) {
      status = "duplicate";
    } else {
      status = "unique";
      points = 1;
    }

    return {
      playerId: p.playerId,
      playerName: p.playerName,
      raw: p.raw.trim(),
      normalized: p.normalized,
      status,
      points,
      hostRejected: p.hostRejected,
    };
  });
}

export function scorePlayerAcrossCategories(
  playerId: string,
  letter: string,
  allPlayers: { id: string; name: string; answers: string[]; hostRejected: boolean[] }[],
): { total: number; categoryPoints: number[] } {
  const categoryPoints: number[] = [];
  let total = 0;
  for (let i = 0; i < 12; i++) {
    const views = scoreCategory(
      letter,
      allPlayers.map((p) => ({
        playerId: p.id,
        playerName: p.name,
        raw: p.answers[i] ?? "",
        hostRejected: p.hostRejected[i] ?? false,
      })),
    );
    const mine = views.find((v) => v.playerId === playerId);
    const pts = mine?.points ?? 0;
    categoryPoints.push(pts);
    total += pts;
  }
  return { total, categoryPoints };
}
