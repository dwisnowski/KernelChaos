import { WHEEL_VOWEL_COST } from "./protocol.ts";

export function canBuyVowel(roundBank: number): boolean {
  return roundBank >= WHEEL_VOWEL_COST;
}

export function applyVowelPurchase(roundBank: number): number {
  return Math.max(0, roundBank - WHEEL_VOWEL_COST);
}

export function addConsonantWinnings(roundBank: number, cashValue: number, count: number): number {
  if (count <= 0 || cashValue <= 0) return roundBank;
  return roundBank + cashValue * count;
}

export function bankRoundIntoTotal(totalScore: number, roundBank: number): {
  totalScore: number;
  roundBank: number;
} {
  return { totalScore: totalScore + roundBank, roundBank: 0 };
}
