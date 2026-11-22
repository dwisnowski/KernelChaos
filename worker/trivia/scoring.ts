import { TRIVIA_CHEER_BONUS, TRIVIA_PARTY_TAX } from "./protocol.ts";

export function applyCorrect(
  score: number,
  value: number,
  opts?: { trapDoubleWrong?: boolean; cheerBonus?: number; partyTax?: boolean },
): { score: number; delta: number; tax: number } {
  let delta = value;
  if (opts?.cheerBonus) delta += opts.cheerBonus;
  let tax = 0;
  if (opts?.partyTax) {
    tax = Math.min(TRIVIA_PARTY_TAX, Math.max(0, score + delta));
    delta -= tax;
  }
  return { score: score + delta, delta, tax };
}

export function applyWrong(
  score: number,
  value: number,
  opts?: { trapMultiplier?: number },
): { score: number; delta: number } {
  const mult = opts?.trapMultiplier ?? 1;
  const delta = -(value * mult);
  return { score: score + delta, delta };
}

export function applyFinal(
  score: number,
  wager: number,
  correct: boolean,
): { score: number; delta: number } {
  const delta = correct ? wager : -wager;
  return { score: score + delta, delta };
}

export function cheerBonusFromMeter(cheerScore: number): number {
  if (cheerScore >= 3) return TRIVIA_CHEER_BONUS;
  if (cheerScore <= -3) return -TRIVIA_CHEER_BONUS;
  return 0;
}

export function pickWinners(
  players: { id: string; score: number }[],
): string[] {
  if (players.length === 0) return [];
  let best = -Infinity;
  const winners: string[] = [];
  for (const p of players) {
    if (p.score > best) {
      best = p.score;
      winners.length = 0;
      winners.push(p.id);
    } else if (p.score === best) {
      winners.push(p.id);
    }
  }
  return winners;
}
