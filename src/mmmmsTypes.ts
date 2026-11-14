export const ORB_COLORS = [
  "red",
  "orange",
  "yellow",
  "green",
  "brown",
  "indigo",
  "violet",
] as const;

export type OrbColor = (typeof ORB_COLORS)[number];

export const ORB_COLOR_LABELS: Record<OrbColor, string> = {
  red: "Red",
  orange: "Orange",
  yellow: "Yellow",
  green: "Green",
  brown: "Brown",
  indigo: "Indigo",
  violet: "Violet",
};

export const ORB_COLOR_HEX: Record<OrbColor, string> = {
  red: "#e53935",
  orange: "#fb8c00",
  yellow: "#fdd835",
  green: "#43a047",
  brown: "#8d6e63",
  indigo: "#3949ab",
  violet: "#8e24aa",
};

export type MmmmsPhase = "lobby" | "organize" | "guess" | "attack" | "resolving" | "results";

export type OrbCount = 12 | 20 | 30;

export const ORB_COUNT_OPTIONS: OrbCount[] = [12, 20, 30];
export const DEFAULT_ORB_COUNT: OrbCount = 20;

export type AttackStep =
  | { kind: "explode"; color: OrbColor }
  | { kind: "halt"; color: OrbColor };

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
  /** False when the attack color was absent from the defender stack (go fish). */
  colorInStack: boolean;
}

export interface MmmmsRoomState {
  game: "mmmms";
  code: string;
  phase: MmmmsPhase;
  orbCount: OrbCount;
  players: MmmmsPlayerPublic[];
  attackerId: string | null;
  defenderId: string | null;
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
