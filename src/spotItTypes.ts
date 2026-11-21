export type SpotItPhase = "lobby" | "playing" | "quiz" | "between" | "results";

export type SpotItMode = "shared" | "tower" | "learning";

export type SpotItTarget = 10 | 25 | 50 | 75;

export type SpotItPackId = "food" | "kawaii" | "cyber" | "kana-restaurant";

export type SpotItPackKind = "image" | "kana";

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

export const SPOT_IT_MODES: SpotItMode[] = ["shared", "tower", "learning"];
export const SPOT_IT_TARGETS: SpotItTarget[] = [10, 25, 50, 75];
export const SPOT_IT_PACK_IDS: SpotItPackId[] = ["food", "kawaii", "cyber", "kana-restaurant"];

export const DEFAULT_SPOT_IT_MODE: SpotItMode = "shared";
export const DEFAULT_SPOT_IT_TARGET: SpotItTarget = 25;
export const DEFAULT_SPOT_IT_PACK: SpotItPackId = "food";
export const DEFAULT_KANA_PACK: SpotItPackId = "kana-restaurant";

export const SPOT_IT_MODE_LABELS: Record<SpotItMode, string> = {
  shared: "Shared pair",
  tower: "Tower",
  learning: "Learning",
};

export const SPOT_IT_PACK_LABELS: Record<SpotItPackId, string> = {
  food: "Funny Foods",
  kawaii: "Kawaii Animals",
  cyber: "Cyber Vehicles",
  "kana-restaurant": "Restaurant Kana",
};

export const SPOT_IT_PACK_KIND: Record<SpotItPackId, SpotItPackKind> = {
  food: "image",
  kawaii: "image",
  cyber: "image",
  "kana-restaurant": "kana",
};

export function isKanaPack(id: SpotItPackId): boolean {
  return SPOT_IT_PACK_KIND[id] === "kana";
}

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

/** Mirrors worker/spot-it/packs.ts kana-restaurant entries. */
export const KANA_RESTAURANT_ENTRIES: { kana: string; reading: string[]; english: string }[] = [
  { kana: "すし", reading: ["su", "shi"], english: "sushi" },
  { kana: "ラーメン", reading: ["ra", "a", "men"], english: "ramen" },
  { kana: "うどん", reading: ["u", "don"], english: "udon" },
  { kana: "そば", reading: ["so", "ba"], english: "soba" },
  { kana: "カレー", reading: ["ka", "re", "e"], english: "curry" },
  { kana: "ごはん", reading: ["go", "han"], english: "rice" },
  { kana: "みそしる", reading: ["mi", "so", "shi", "ru"], english: "miso soup" },
  { kana: "みそ", reading: ["mi", "so"], english: "miso" },
  { kana: "とうふ", reading: ["to", "u", "fu"], english: "tofu" },
  { kana: "てんぷら", reading: ["ten", "pu", "ra"], english: "tempura" },
  { kana: "やきとり", reading: ["ya", "ki", "to", "ri"], english: "yakitori" },
  { kana: "おにぎり", reading: ["o", "ni", "gi", "ri"], english: "rice ball" },
  { kana: "さしみ", reading: ["sa", "shi", "mi"], english: "sashimi" },
  { kana: "とんかつ", reading: ["ton", "ka", "tsu"], english: "pork cutlet" },
  { kana: "ぎょうざ", reading: ["gyo", "u", "za"], english: "gyoza" },
  { kana: "メニュー", reading: ["me", "nyu", "u"], english: "menu" },
  { kana: "みず", reading: ["mi", "zu"], english: "water" },
  { kana: "おちゃ", reading: ["o", "cha"], english: "tea" },
  { kana: "コーヒー", reading: ["ko", "o", "hi", "i"], english: "coffee" },
  { kana: "ビール", reading: ["bi", "i", "ru"], english: "beer" },
  { kana: "ジュース", reading: ["ju", "u", "su"], english: "juice" },
  { kana: "おかいけい", reading: ["o", "kai", "kei"], english: "check / bill" },
  { kana: "ください", reading: ["ku", "da", "sa", "i"], english: "please (give me)" },
  { kana: "ありがとう", reading: ["a", "ri", "ga", "to", "u"], english: "thank you" },
  { kana: "おいしい", reading: ["o", "i", "shi", "i"], english: "delicious" },
  { kana: "まずい", reading: ["ma", "zu", "i"], english: "tastes bad" },
  { kana: "あつい", reading: ["a", "tsu", "i"], english: "hot (temp)" },
  { kana: "つめたい", reading: ["tsu", "me", "ta", "i"], english: "cold (to touch)" },
  { kana: "からい", reading: ["ka", "ra", "i"], english: "spicy" },
  { kana: "あまい", reading: ["a", "ma", "i"], english: "sweet" },
  { kana: "しおからい", reading: ["shi", "o", "ka", "ra", "i"], english: "salty" },
  { kana: "すっぱい", reading: ["su", "ppa", "i"], english: "sour" },
  { kana: "にがい", reading: ["ni", "ga", "i"], english: "bitter" },
  { kana: "おおきい", reading: ["o", "o", "ki", "i"], english: "large" },
  { kana: "ちいさい", reading: ["chi", "i", "sa", "i"], english: "small" },
  { kana: "セット", reading: ["se", "tto"], english: "set meal" },
  { kana: "ていしょく", reading: ["te", "i", "sho", "ku"], english: "teishoku" },
  { kana: "べんとう", reading: ["ben", "to", "u"], english: "bento" },
  { kana: "デザート", reading: ["de", "za", "a", "to"], english: "dessert" },
  { kana: "アイス", reading: ["a", "i", "su"], english: "ice cream" },
  { kana: "ケーキ", reading: ["ke", "e", "ki"], english: "cake" },
  { kana: "サラダ", reading: ["sa", "ra", "da"], english: "salad" },
  { kana: "スープ", reading: ["su", "u", "pu"], english: "soup" },
  { kana: "パン", reading: ["pan"], english: "bread" },
  { kana: "たまご", reading: ["ta", "ma", "go"], english: "egg" },
  { kana: "にく", reading: ["ni", "ku"], english: "meat" },
  { kana: "さかな", reading: ["sa", "ka", "na"], english: "fish" },
  { kana: "やさい", reading: ["ya", "sa", "i"], english: "vegetables" },
  { kana: "くだもの", reading: ["ku", "da", "mo", "no"], english: "fruit" },
  { kana: "のり", reading: ["no", "ri"], english: "seaweed" },
  { kana: "しょうゆ", reading: ["sho", "u", "yu"], english: "soy sauce" },
  { kana: "わさび", reading: ["wa", "sa", "bi"], english: "wasabi" },
  { kana: "はし", reading: ["ha", "shi"], english: "chopsticks" },
  { kana: "スプーン", reading: ["su", "pu", "u", "n"], english: "spoon" },
  { kana: "フォーク", reading: ["fo", "o", "ku"], english: "fork" },
  { kana: "ナプキン", reading: ["na", "pu", "kin"], english: "napkin" },
  { kana: "トイレ", reading: ["to", "i", "re"], english: "restroom" },
];

export function spotItSymbolSrc(packId: SpotItPackId, symbolIndex: number): string | null {
  if (isKanaPack(packId)) return null;
  const id = String(symbolIndex).padStart(2, "0");
  return `/spot-it/${packId}/${id}.png`;
}

export function spotItSymbolKana(packId: SpotItPackId, symbolIndex: number): string | null {
  if (packId === "kana-restaurant") {
    return KANA_RESTAURANT_ENTRIES[symbolIndex]?.kana ?? null;
  }
  return null;
}

export function spotItSymbolLabel(packId: SpotItPackId, symbolIndex: number): string {
  if (packId === "food") return FOOD_SYMBOL_LABELS[symbolIndex] ?? `Symbol ${symbolIndex}`;
  if (packId === "kawaii") return KAWAII_SYMBOL_LABELS[symbolIndex] ?? `Symbol ${symbolIndex}`;
  if (packId === "cyber") return CYBER_SYMBOL_LABELS[symbolIndex] ?? `Symbol ${symbolIndex}`;
  if (packId === "kana-restaurant") {
    return KANA_RESTAURANT_ENTRIES[symbolIndex]?.english ?? `Symbol ${symbolIndex}`;
  }
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
  quizSymbolIndex: number | null;
  quizChoices: string[] | null;
  quizKana: string | null;
  quizReading: string[] | null;
  lastMatchKana: string | null;
  lastMatchReading: string[] | null;
  lastMatchEnglish: string | null;
}

export type SpotItClientMessage =
  | { type: "join"; name: string; resumeId?: string }
  | { type: "spectate" }
  | { type: "setSpotItMode"; spotItMode: SpotItMode }
  | { type: "setSpotItTarget"; targetScore: SpotItTarget }
  | { type: "setSpotItPack"; packId: SpotItPackId }
  | { type: "start" }
  | { type: "tapSymbol"; symbolIndex: number }
  | { type: "tapQuizChoice"; english: string }
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
