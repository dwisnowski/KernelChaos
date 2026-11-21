export type SpotItPackId = "food" | "kawaii";

export interface SpotItSymbolMeta {
  /** Stable id within the pack (matches filename stem). */
  id: string;
  /** Public URL path served by Vite / Workers assets. */
  src: string;
  /** Short accessible label. */
  label: string;
}

export interface SpotItPack {
  id: SpotItPackId;
  label: string;
  /** Exactly 57 symbols, index-aligned with the projective-plane deck. */
  symbols: SpotItSymbolMeta[];
}

const FOOD_LABELS: string[] = [
  "Ice cream cool",
  "Pizza skateboarder",
  "Taco mariachi",
  "Burger crowned",
  "Hot dog surfer",
  "Sushi ninja",
  "Donut walker",
  "Fries rocket",
  "Cupcake wizard",
  "Avocado yogi",
  "Banana dancer",
  "Strawberry detective",
  "Blueberry astronaut",
  "Watermelon surfer",
  "Grape choir",
  "Lemon boxer",
  "Orange athlete",
  "Apple teacher",
  "Pear builder",
  "Cherry twins",
  "Peach princess",
  "Pineapple dancer",
  "Mango disco",
  "Kiwi explorer",
  "Coconut pirate",
  "Popcorn movie star",
  "Pretzel twist",
  "Cookie detective",
  "Brownie lounger",
  "Chocolate soldier",
  "Marshmallow camper",
  "Waffle buddy",
  "Pancake stack",
  "Bagel business",
  "Croissant chic",
  "Muffin baker",
  "Pie smile",
  "Cake party",
  "Lollipop rockstar",
  "Cotton candy cloud",
  "Gummy wrestler",
  "Candy corn witch",
  "Jalapeño firefighter",
  "Broccoli bodybuilder",
  "Carrot runner",
  "Corn cob cowboy",
  "Potato couch",
  "Onion comedian",
  "Garlic knight",
  "Mushroom wizard",
  "Eggplant violinist",
  "Tomato chef",
  "Pickle acrobat",
  "Olive spy",
  "Cheese wedge",
  "Ramen surfer",
  "Milkshake hero",
];

const KAWAII_LABELS: string[] = [
  "Seagull",
  "Rabbit",
  "Cat",
  "Dog",
  "Horse",
  "Lizard",
  "Raccoon",
  "Fox kit",
  "Panda",
  "Koala",
  "Frog",
  "Otter",
  "Bunny",
  "Whale",
  "Dolphin",
  "Seal",
  "Octopus",
  "Crab",
  "Starfish",
  "Fox",
  "Bear",
  "Deer",
  "Squirrel",
  "Hedgehog",
  "Duck",
  "Chicken",
  "Cow",
  "Pig",
  "Sheep",
  "Goat",
  "Llama",
  "Camel",
  "Elephant",
  "Giraffe",
  "Zebra",
  "Lion",
  "Tiger",
  "Monkey",
  "Penguin",
  "Owl",
  "Bat",
  "Mouse",
  "Hamster",
  "Parrot",
  "Flamingo",
  "Peacock",
  "Toucan",
  "Crocodile",
  "Turtle",
  "Snake",
  "Chameleon",
  "Axolotl",
  "Sloth",
  "Beaver",
  "Skunk",
  "Chipmunk",
  "Corgi",
];

function packSymbols(packId: SpotItPackId, labels: string[]): SpotItSymbolMeta[] {
  return labels.map((label, i) => {
    const id = String(i).padStart(2, "0");
    return {
      id,
      src: `/spot-it/${packId}/${id}.png`,
      label,
    };
  });
}

export const SPOT_IT_PACKS: Record<SpotItPackId, SpotItPack> = {
  food: {
    id: "food",
    label: "Funny Foods",
    symbols: packSymbols("food", FOOD_LABELS),
  },
  kawaii: {
    id: "kawaii",
    label: "Kawaii Animals",
    symbols: packSymbols("kawaii", KAWAII_LABELS),
  },
};

export const SPOT_IT_PACK_IDS: SpotItPackId[] = ["food", "kawaii"];
export const DEFAULT_SPOT_IT_PACK: SpotItPackId = "food";

export function isSpotItPackId(v: unknown): v is SpotItPackId {
  return v === "food" || v === "kawaii";
}

export function getSpotItPack(id: SpotItPackId): SpotItPack {
  return SPOT_IT_PACKS[id];
}
