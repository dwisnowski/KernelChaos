import type { SpotItCardView } from "./layout.ts";
import type { SpotItPackId } from "./packs.ts";
import { DEFAULT_SPOT_IT_PACK, isSpotItPackId } from "./packs.ts";

export type SpotItPhase = "lobby" | "playing" | "between" | "results";

export type SpotItMode = "shared" | "tower";

export type SpotItTarget = 10 | 25 | 50 | 75;

export const SPOT_IT_MODES: SpotItMode[] = ["shared", "tower"];
export const SPOT_IT_TARGETS: SpotItTarget[] = [10, 25, 50, 75];

export const DEFAULT_SPOT_IT_MODE: SpotItMode = "shared";
export const DEFAULT_SPOT_IT_TARGET: SpotItTarget = 25;

export const SPOT_IT_BETWEEN_MS = 3000;
export const SPOT_IT_MISS_LOCK_MS = 800;

export function isSpotItMode(v: unknown): v is SpotItMode {
  return v === "shared" || v === "tower";
}

export function isSpotItTarget(n: unknown): n is SpotItTarget {
  return n === 10 || n === 25 || n === 50 || n === 75;
}

export { isSpotItPackId, DEFAULT_SPOT_IT_PACK };
export type { SpotItPackId };

export interface SpotItPlayerPublic {
  id: string;
  name: string;
  isHost: boolean;
  score: number;
}

export interface SpotItRoomState {
  game: "spot-it";
  code: string;
  phase: SpotItPhase;
  spotItMode: SpotItMode;
  targetScore: SpotItTarget;
  packId: SpotItPackId;
  countdownEndsAt: number | null;
  players: SpotItPlayerPublic[];
  /** Shared mode: both cards. Tower: center only on public state. */
  cardA: SpotItCardView | null;
  cardB: SpotItCardView | null;
  /** Tower center (also mirrored as cardA for convenience on clients). */
  centerCard: SpotItCardView | null;
  lastScorerId: string | null;
  lastScorerName: string | null;
  winners: string[];
  round: number;
  pileRemaining: number | null;
}

export type SpotItClientMessage =
  | { type: "join"; name: string; resumeId?: string }
  | { type: "spectate" }
  | { type: "setSpotItMode"; spotItMode: SpotItMode }
  | { type: "setSpotItTarget"; targetScore: SpotItTarget }
  | { type: "setSpotItPack"; packId: SpotItPackId }
  | { type: "start" }
  | { type: "tapSymbol"; symbolIndex: number }
  | { type: "playAgain" };

export type SpotItServerMessage =
  | {
      type: "welcome";
      playerId: string;
      state: SpotItRoomState;
      role?: "player" | "spectator";
      myCard?: SpotItCardView | null;
      lockedUntil?: number | null;
    }
  | {
      type: "state";
      state: SpotItRoomState;
      myCard?: SpotItCardView | null;
      lockedUntil?: number | null;
    }
  | {
      type: "tapResult";
      hit: boolean;
      lockedUntil?: number | null;
    }
  | { type: "error"; message: string };
