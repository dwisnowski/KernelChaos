import adult from "./packs/adult.ts";
import family from "./packs/family.ts";
import kids from "./packs/kids.ts";
import type { PackTier } from "./protocol.ts";
import { CATEGORIES_PER_LIST } from "./protocol.ts";

export interface CategoryList {
  id: string;
  title: string;
  categories: string[];
}

const PACKS: Record<PackTier, CategoryList[]> = {
  family: family.lists.map((l) => ({
    id: l.id,
    title: l.title,
    categories: [...l.categories],
  })),
  kids: kids.lists.map((l) => ({
    id: l.id,
    title: l.title,
    categories: [...l.categories],
  })),
  adult: adult.lists.map((l) => ({
    id: l.id,
    title: l.title,
    categories: [...l.categories],
  })),
};

export function listsForTier(tier: PackTier): CategoryList[] {
  return PACKS[tier];
}

export function pickList(
  tier: PackTier,
  usedIds: Set<string>,
): CategoryList {
  const all = listsForTier(tier);
  const available = all.filter((l) => !usedIds.has(l.id));
  const pool = available.length > 0 ? available : all;
  const bytes = crypto.getRandomValues(new Uint8Array(1));
  const list = pool[bytes[0]! % pool.length]!;
  if (list.categories.length !== CATEGORIES_PER_LIST) {
    throw new Error(`List ${list.id} must have ${CATEGORIES_PER_LIST} categories`);
  }
  return {
    id: list.id,
    title: list.title,
    categories: [...list.categories],
  };
}
