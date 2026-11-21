export type SpotItPhase = "lobby" | "playing" | "between" | "results";

export type SpotItMode = "shared" | "tower";

export type SpotItTarget = 10 | 25 | 50 | 75;

export type SpotItPackId = "food" | "kawaii" | "cyber";

export interface SpotItPlacement {
  symbolIndex: number;
  x: number;
  y: number;
  rotateDeg: number;
  scale: number;
}

export interface SpotItCardView {
  cardIndex: number;
  symbolIndices: number[];
  placements: SpotItPlacement[];
  seed: number;
}

export const SPOT_IT_MODES: SpotItMode[] = ["shared", "tower"];
export const SPOT_IT_TARGETS: SpotItTarget[] = [10, 25, 50, 75];
export const SPOT_IT_PACK_IDS: SpotItPackId[] = ["food", "kawaii", "cyber"];

export const DEFAULT_SPOT_IT_MODE: SpotItMode = "shared";
export const DEFAULT_SPOT_IT_TARGET: SpotItTarget = 25;
export const DEFAULT_SPOT_IT_PACK: SpotItPackId = "food";

export const SPOT_IT_MODE_LABELS: Record<SpotItMode, string> = {
  shared: "Shared pair",
  tower: "Tower",
};

export const SPOT_IT_PACK_LABELS: Record<SpotItPackId, string> = {
  food: "Funny Foods",
  kawaii: "Kawaii Animals",
  cyber: "Cyber Vehicles",
};

export const FOOD_SYMBOL_LABELS: string[] = [
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

export const KAWAII_SYMBOL_LABELS: string[] = [
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

export const CYBER_SYMBOL_LABELS: string[] = [
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

export function spotItSymbolSrc(packId: SpotItPackId, symbolIndex: number): string {
  const id = String(symbolIndex).padStart(2, "0");
  return `/spot-it/${packId}/${id}.png`;
}

export function spotItSymbolLabel(packId: SpotItPackId, symbolIndex: number): string {
  if (packId === "food") return FOOD_SYMBOL_LABELS[symbolIndex] ?? `Symbol ${symbolIndex}`;
  if (packId === "kawaii") return KAWAII_SYMBOL_LABELS[symbolIndex] ?? `Symbol ${symbolIndex}`;
  if (packId === "cyber") return CYBER_SYMBOL_LABELS[symbolIndex] ?? `Symbol ${symbolIndex}`;
  return `Symbol ${symbolIndex}`;
}

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
  cardA: SpotItCardView | null;
  cardB: SpotItCardView | null;
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
