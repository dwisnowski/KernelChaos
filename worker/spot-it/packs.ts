export type SpotItPackId = "food" | "kawaii" | "cyber";

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

const CYBER_LABELS: string[] = [
  "Hoverbike",
  "Neon sports car",
  "Cyber truck",
  "Maglev train",
  "Drone taxi",
  "Mech walker",
  "Street racer",
  "Mono-wheel",
  "Cargo hauler",
  "Police cruiser",
  "Ambulance pod",
  "Firebot truck",
  "Taxi cab",
  "Delivery scooter",
  "Skateboarder bot",
  "Jet ski",
  "Submarine",
  "Airship",
  "Fighter jet",
  "VTOL shuttle",
  "Helicopter",
  "Spaceship",
  "Starfighter",
  "Tank",
  "APC",
  "Motorcycle",
  "Chopper bike",
  "Trike",
  "Bus",
  "Tram",
  "Bullet train",
  "Pickup",
  "Van",
  "Limousine",
  "Convertible",
  "SUV",
  "ATV",
  "Snowmobile",
  "Sand crawler",
  "Construction digger",
  "Forklift bot",
  "Crane truck",
  "Tow truck",
  "Food truck",
  "Ice cream hover",
  "Yacht",
  "Speedboat",
  "Sailboat cyber",
  "Glider",
  "Hot air neon",
  "Rocket",
  "Satellite tug",
  "Lunar rover",
  "Tunnel drill",
  "Cable car",
  "Rickshaw bot",
  "Tuk-tuk neon",
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
  cyber: {
    id: "cyber",
    label: "Cyber Vehicles",
    symbols: packSymbols("cyber", CYBER_LABELS),
  },
};

export const SPOT_IT_PACK_IDS: SpotItPackId[] = ["food", "kawaii", "cyber"];
export const DEFAULT_SPOT_IT_PACK: SpotItPackId = "food";

export function isSpotItPackId(v: unknown): v is SpotItPackId {
  return v === "food" || v === "kawaii" || v === "cyber";
}

export function getSpotItPack(id: SpotItPackId): SpotItPack {
  return SPOT_IT_PACKS[id];
}
