/**
 * Picture Hunt themed packs — lobby picks a pack; each round picks a random
 * unused scene from that pack (ADR 0042).
 */
import { getScene, type HuntScene } from "./scenes.ts";

export type HuntPackId =
  | "seaside"
  | "wilds"
  | "legends"
  | "neighborhood"
  | "fairgrounds"
  | "horizons";

export interface HuntPack {
  id: HuntPackId;
  title: string;
  /** Short lobby blurb. */
  tagline: string;
  sceneIds: string[];
}

export const HUNT_PACKS: HuntPack[] = [
  {
    id: "seaside",
    title: "Seaside Escapes",
    tagline: "Beaches, reefs, harbors, and deep-sea fun",
    sceneIds: [
      "beach-chaos",
      "underwater-reef-party",
      "pirate-cove",
      "coral-harbor",
      "lighthouse-keepers",
      "aquarium-tunnel",
      "submarine-lab",
    ],
  },
  {
    id: "wilds",
    title: "Wild Expeditions",
    tagline: "Jungles, deserts, camps, and open sky",
    sceneIds: [
      "jungle-temple",
      "rainforest-canopy",
      "safari-park",
      "desert-oasis",
      "camping-glade",
      "volcano-observatory",
      "balloon-fiesta",
      "treehouse-village",
      "arctic-camp",
    ],
  },
  {
    id: "legends",
    title: "Legends & Lore",
    tagline: "Castles, wizards, markets, and tall tales",
    sceneIds: [
      "castle-transylvania",
      "wizard-library",
      "viking-longhouse",
      "medieval-market",
      "airship-dock",
      "puppet-theater",
      "agora-market",
      "frontier-town",
    ],
  },
  {
    id: "neighborhood",
    title: "Neighborhood Favorites",
    tagline: "Kitchens, shops, attics, and cozy streets",
    sceneIds: [
      "bakery-street",
      "pizza-kitchen",
      "ice-cream-parlor",
      "candy-kitchen",
      "flower-market",
      "winter-market",
      "bookshop-maze",
      "grand-hotel",
      "attic-treasure",
      "yard-sale",
    ],
  },
  {
    id: "fairgrounds",
    title: "Fairground Fun",
    tagline: "Circuses, festivals, toys, and big days out",
    sceneIds: [
      "circus-big-top",
      "carnival-midway",
      "music-festival",
      "lantern-parade",
      "skate-park",
      "toy-workshop",
      "science-fair",
      "firehouse",
      "dinosaur-museum",
      "farm-harvest",
    ],
  },
  {
    id: "horizons",
    title: "Far Horizons",
    tagline: "Space, robots, trains, peaks, and gardens",
    sceneIds: [
      "space-port",
      "robot-factory",
      "train-station",
      "alpine-lodge",
      "zen-garden-festival",
      "vineyard-harvest",
    ],
  },
];

export const DEFAULT_HUNT_PACK: HuntPackId = "seaside";

export function isHuntPackId(v: unknown): v is HuntPackId {
  return typeof v === "string" && HUNT_PACKS.some((p) => p.id === v);
}

export function getHuntPack(id: HuntPackId): HuntPack {
  return HUNT_PACKS.find((p) => p.id === id) ?? HUNT_PACKS[0]!;
}

export function packsCatalog(): HuntPack[] {
  return HUNT_PACKS.map((p) => ({ ...p, sceneIds: [...p.sceneIds] }));
}

/** Scenes belonging to a pack (skips unknown ids). */
export function scenesForPack(packId: HuntPackId): HuntScene[] {
  const pack = getHuntPack(packId);
  const out: HuntScene[] = [];
  for (const id of pack.sceneIds) {
    const scene = getScene(id);
    if (scene) out.push(scene);
  }
  return out;
}

/**
 * Random unused scene from the pack. When every pack scene has been used,
 * wrap and pick again from the full pack.
 */
export function pickSceneFromPack(packId: HuntPackId, usedIds: Set<string>): HuntScene {
  const packScenes = scenesForPack(packId);
  if (packScenes.length === 0) {
    throw new Error(`Hunt pack ${packId} has no scenes`);
  }
  const available = packScenes.filter((s) => !usedIds.has(s.id));
  const pool = available.length > 0 ? available : packScenes;
  const bytes = crypto.getRandomValues(new Uint8Array(1));
  return { ...pool[bytes[0]! % pool.length]! };
}
