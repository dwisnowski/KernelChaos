import type { TriviaPack, TriviaPackId } from "../protocol.ts";
import { DEFAULT_TRIVIA_PACK } from "../protocol.ts";
import {
  ADULT_2000S_PACK,
  ADULT_BOOKS_PACK,
  ADULT_BRANDS_PACK,
  ADULT_CITIES_PACK,
  ADULT_FOOD_DRINK_PACK,
  ADULT_HISTORY_PACK,
  ADULT_MOVIES_PACK,
  ADULT_MUSIC_PACK,
  ADULT_SPORTS_PACK,
  ADULT_TECH_PACK,
} from "./adult/index.ts";
import {
  FAMILY_80S_90S_PACK,
  FAMILY_ANIMALS_PLUS_PACK,
  FAMILY_CLASSICS_PACK,
  FAMILY_FOOD_PACK,
  FAMILY_HOLIDAYS_PACK,
  FAMILY_MOVIES_PACK,
  FAMILY_SCIENCE_PACK,
  FAMILY_SONGS_PACK,
  FAMILY_SPORTS_PACK,
  FAMILY_WORLD_PACK,
} from "./family/index.ts";
import {
  KIDS_ANIMALS_PACK,
  KIDS_BLUEY_PACK,
  KIDS_CHRISTMAS_PACK,
  KIDS_DINOSAURS_PACK,
  KIDS_FAIRY_TALES_PACK,
  KIDS_SCHOOL_PACK,
  KIDS_SPACE_PACK,
  KIDS_SUPERHEROES_PACK,
  KIDS_THANKSGIVING_PACK,
  KIDS_UNDER_THE_SEA_PACK,
} from "./kids/index.ts";
import {
  SPICY_AFTER_DARK_TV_PACK,
  SPICY_BARS_PACK,
  SPICY_COLLEGE_PACK,
  SPICY_CRUDE_PACK,
  SPICY_DATING_PACK,
  SPICY_DIRTY_MIND_PACK,
  SPICY_LATE_NIGHT_PACK,
  SPICY_REALITY_PACK,
  SPICY_SCANDAL_PACK,
  SPICY_TABLOID_PACK,
  SPICY_URBAN_DICTIONARY_PACK,
} from "./spicy/index.ts";

const PACKS: Record<TriviaPackId, TriviaPack> = {
  "kids-thanksgiving": KIDS_THANKSGIVING_PACK,
  "kids-christmas": KIDS_CHRISTMAS_PACK,
  "kids-animals": KIDS_ANIMALS_PACK,
  "kids-bluey": KIDS_BLUEY_PACK,
  "kids-dinosaurs": KIDS_DINOSAURS_PACK,
  "kids-superheroes": KIDS_SUPERHEROES_PACK,
  "kids-space": KIDS_SPACE_PACK,
  "kids-fairy-tales": KIDS_FAIRY_TALES_PACK,
  "kids-school": KIDS_SCHOOL_PACK,
  "kids-under-the-sea": KIDS_UNDER_THE_SEA_PACK,
  "family-classics": FAMILY_CLASSICS_PACK,
  "family-movies": FAMILY_MOVIES_PACK,
  "family-holidays": FAMILY_HOLIDAYS_PACK,
  "family-animals-plus": FAMILY_ANIMALS_PLUS_PACK,
  "family-80s-90s": FAMILY_80S_90S_PACK,
  "family-food": FAMILY_FOOD_PACK,
  "family-sports": FAMILY_SPORTS_PACK,
  "family-world": FAMILY_WORLD_PACK,
  "family-songs": FAMILY_SONGS_PACK,
  "family-science": FAMILY_SCIENCE_PACK,
  "adult-movies": ADULT_MOVIES_PACK,
  "adult-music": ADULT_MUSIC_PACK,
  "adult-sports": ADULT_SPORTS_PACK,
  "adult-history": ADULT_HISTORY_PACK,
  "adult-food-drink": ADULT_FOOD_DRINK_PACK,
  "adult-tech": ADULT_TECH_PACK,
  "adult-2000s": ADULT_2000S_PACK,
  "adult-brands": ADULT_BRANDS_PACK,
  "adult-books": ADULT_BOOKS_PACK,
  "adult-cities": ADULT_CITIES_PACK,
  "spicy-dating": SPICY_DATING_PACK,
  "spicy-crude": SPICY_CRUDE_PACK,
  "spicy-after-dark-tv": SPICY_AFTER_DARK_TV_PACK,
  "spicy-bars": SPICY_BARS_PACK,
  "spicy-tabloid": SPICY_TABLOID_PACK,
  "spicy-college": SPICY_COLLEGE_PACK,
  "spicy-reality": SPICY_REALITY_PACK,
  "spicy-dirty-mind": SPICY_DIRTY_MIND_PACK,
  "spicy-scandal": SPICY_SCANDAL_PACK,
  "spicy-late-night": SPICY_LATE_NIGHT_PACK,
  "spicy-urban-dictionary": SPICY_URBAN_DICTIONARY_PACK,
};

export function getTriviaPack(id: TriviaPackId): TriviaPack {
  return PACKS[id] ?? PACKS[DEFAULT_TRIVIA_PACK];
}

export function listTriviaPacks(): { id: TriviaPackId; title: string; tagline: string }[] {
  return Object.values(PACKS).map((p) => ({
    id: p.id,
    title: p.title,
    tagline: p.tagline,
  }));
}
