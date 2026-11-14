import type { AttackStep, OrbColor } from "./orbs.ts";
import { isOrbColor } from "./orbs.ts";

export type MmmmsPhase = "lobby" | "organize" | "guess" | "attack" | "resolving" | "results";

export type OrbCount = 12 | 20 | 30;

export const ORB_COUNT_OPTIONS: OrbCount[] = [12, 20, 30];
export const DEFAULT_ORB_COUNT: OrbCount = 20;

export function isOrbCount(n: unknown): n is OrbCount {
  return n === 12 || n === 20 || n === 30;
}

export interface MmmmsPlayerPublic {
  id: string;
  name: string;
  isHost: boolean;
  remainingCount: number;
  ready: boolean;
}

export interface MmmmsAttackResult {
  attackerId: string;
  defenderId: string;
  attackColor: OrbColor;
  guessCorrect: boolean;
  explodedCount: number;
  steps: AttackStep[];
}

export interface MmmmsRoomState {
  game: "mmmms";
  code: string;
  phase: MmmmsPhase;
  orbCount: OrbCount;
  players: MmmmsPlayerPublic[];
  attackerId: string | null;
  defenderId: string | null;
  /** True once the defender has locked a guess this turn (never leaks the color). */
  defenderHasGuessed: boolean;
  lastAttack: MmmmsAttackResult | null;
  winnerId: string | null;
  winnerName: string | null;
  round: number;
}

export type MmmmsClientMessage =
  | { type: "join"; name: string; resumeId?: string }
  | { type: "spectate" }
  | { type: "setOrbCount"; orbCount: OrbCount }
  | { type: "start" }
  | { type: "reorder"; orbs: OrbColor[] }
  | { type: "submitOrder" }
  | { type: "guessColor"; color: OrbColor }
  | { type: "attackColor"; color: OrbColor }
  | { type: "resolveDone" }
  | { type: "playAgain" };

export type MmmmsServerMessage =
  | {
      type: "welcome";
      playerId: string;
      state: MmmmsRoomState;
      role?: "player" | "spectator";
      myOrbs?: OrbColor[] | null;
    }
  | { type: "state"; state: MmmmsRoomState; myOrbs?: OrbColor[] | null }
  | { type: "error"; message: string };

export function isValidOrbList(orbs: unknown, expectedLen: number): orbs is OrbColor[] {
  if (!Array.isArray(orbs) || orbs.length !== expectedLen) return false;
  return orbs.every(isOrbColor);
}
