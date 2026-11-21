export type SpotItPackId = "food" | "kawaii" | "cyber" | "kana-restaurant" | "kana-shopping";

export type SpotItPackKind = "image" | "kana";

export interface SpotItSymbolMeta {
  /** Stable id within the pack (matches filename stem for image packs). */
  id: string;
  /** Public URL path for image packs. */
  src?: string;
  /** English label (quiz answer + a11y). */
  label: string;
  /** Kana display string (kana packs). */
  kana?: string;
  /** Romaji syllables for between-round teaching. */
  reading?: string[];
}

export interface SpotItPack {
  id: SpotItPackId;
  label: string;
  kind: SpotItPackKind;
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

/** Restaurant / eating-out vocab for learning mode (ADR 0037). Exactly 57. */
const KANA_RESTAURANT: { kana: string; reading: string[]; english: string }[] = [
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

/** Tourist shopping / retail vocab for learning mode (ADR 0038). Exactly 57. */
const KANA_SHOPPING: { kana: string; reading: string[]; english: string }[] = [
  { kana: "コンビニ", reading: ["kon", "bi", "ni"], english: "convenience store" },
  { kana: "デパート", reading: ["de", "pa", "a", "to"], english: "department store" },
  { kana: "スーパー", reading: ["su", "u", "pa", "a"], english: "supermarket" },
  { kana: "おみやげ", reading: ["o", "mi", "ya", "ge"], english: "souvenir" },
  { kana: "みせ", reading: ["mi", "se"], english: "shop" },
  { kana: "ばいてん", reading: ["bai", "ten"], english: "kiosk / stand" },
  { kana: "いくら", reading: ["i", "ku", "ra"], english: "how much" },
  { kana: "えん", reading: ["en"], english: "yen" },
  { kana: "おかね", reading: ["o", "ka", "ne"], english: "money" },
  { kana: "げんきん", reading: ["gen", "kin"], english: "cash" },
  { kana: "カード", reading: ["ka", "a", "do"], english: "card (credit)" },
  { kana: "レシート", reading: ["re", "shi", "i", "to"], english: "receipt" },
  { kana: "かいけい", reading: ["kai", "kei"], english: "checkout / register" },
  { kana: "かいます", reading: ["ka", "i", "ma", "su"], english: "I'll buy (it)" },
  { kana: "ください", reading: ["ku", "da", "sa", "i"], english: "please (give me)" },
  { kana: "みせて", reading: ["mi", "se", "te"], english: "please show me" },
  { kana: "これを", reading: ["ko", "re", "o"], english: "this one (object)" },
  { kana: "あれを", reading: ["a", "re", "o"], english: "that one (far)" },
  { kana: "やすい", reading: ["ya", "su", "i"], english: "cheap / inexpensive" },
  { kana: "たかい", reading: ["ta", "ka", "i"], english: "expensive" },
  { kana: "セール", reading: ["se", "e", "ru"], english: "sale" },
  { kana: "わりびき", reading: ["wa", "ri", "bi", "ki"], english: "discount" },
  { kana: "ぜいきん", reading: ["zei", "kin"], english: "tax" },
  { kana: "ぜいこみ", reading: ["zei", "ko", "mi"], english: "tax included" },
  { kana: "サイズ", reading: ["sa", "i", "zu"], english: "size" },
  { kana: "おおきい", reading: ["o", "o", "ki", "i"], english: "large" },
  { kana: "ちいさい", reading: ["chi", "i", "sa", "i"], english: "small" },
  { kana: "みどり", reading: ["mi", "do", "ri"], english: "green" },
  { kana: "あか", reading: ["a", "ka"], english: "red" },
  { kana: "あお", reading: ["a", "o"], english: "blue" },
  { kana: "しろ", reading: ["shi", "ro"], english: "white" },
  { kana: "くろ", reading: ["ku", "ro"], english: "black" },
  { kana: "ふく", reading: ["fu", "ku"], english: "clothes" },
  { kana: "シャツ", reading: ["sha", "tsu"], english: "shirt" },
  { kana: "ズボン", reading: ["zu", "bon"], english: "pants" },
  { kana: "スカート", reading: ["su", "ka", "a", "to"], english: "skirt" },
  { kana: "くつ", reading: ["ku", "tsu"], english: "shoes" },
  { kana: "かばん", reading: ["ka", "ban"], english: "bag" },
  { kana: "バッグ", reading: ["ba", "ggu"], english: "handbag" },
  { kana: "さいふ", reading: ["sa", "i", "fu"], english: "wallet" },
  { kana: "かさ", reading: ["ka", "sa"], english: "umbrella" },
  { kana: "ぼうし", reading: ["bo", "u", "shi"], english: "hat" },
  { kana: "めがね", reading: ["me", "ga", "ne"], english: "glasses" },
  { kana: "とけい", reading: ["to", "kei"], english: "watch / clock" },
  { kana: "カメラ", reading: ["ka", "me", "ra"], english: "camera" },
  { kana: "でんわ", reading: ["den", "wa"], english: "phone" },
  { kana: "バッテリー", reading: ["ba", "tte", "ri", "i"], english: "battery" },
  { kana: "ちず", reading: ["chi", "zu"], english: "map" },
  { kana: "えき", reading: ["e", "ki"], english: "train station" },
  { kana: "きっぷ", reading: ["ki", "ppu"], english: "ticket" },
  { kana: "はがき", reading: ["ha", "ga", "ki"], english: "postcard" },
  { kana: "きって", reading: ["ki", "tte"], english: "postage stamp" },
  { kana: "ゆうびんきょく", reading: ["yu", "u", "bin", "kyo", "ku"], english: "post office" },
  { kana: "ドラッグストア", reading: ["do", "ra", "ggu", "su", "to", "a"], english: "drugstore" },
  { kana: "くすり", reading: ["ku", "su", "ri"], english: "medicine" },
  { kana: "オープン", reading: ["o", "o", "pen"], english: "open (hours)" },
  { kana: "クローズ", reading: ["ku", "ro", "o", "zu"], english: "closed" },
];

function imageSymbols(packId: SpotItPackId, labels: string[]): SpotItSymbolMeta[] {
  return labels.map((label, i) => {
    const id = String(i).padStart(2, "0");
    return {
      id,
      src: `/spot-it/${packId}/${id}.png`,
      label,
    };
  });
}

function kanaSymbols(
  entries: { kana: string; reading: string[]; english: string }[],
): SpotItSymbolMeta[] {
  return entries.map((e, i) => ({
    id: String(i).padStart(2, "0"),
    label: e.english,
    kana: e.kana,
    reading: e.reading,
  }));
}

export const SPOT_IT_PACKS: Record<SpotItPackId, SpotItPack> = {
  food: {
    id: "food",
    label: "Funny Foods",
    kind: "image",
    symbols: imageSymbols("food", FOOD_LABELS),
  },
  kawaii: {
    id: "kawaii",
    label: "Kawaii Animals",
    kind: "image",
    symbols: imageSymbols("kawaii", KAWAII_LABELS),
  },
  cyber: {
    id: "cyber",
    label: "Cyber Vehicles",
    kind: "image",
    symbols: imageSymbols("cyber", CYBER_LABELS),
  },
  "kana-restaurant": {
    id: "kana-restaurant",
    label: "Restaurant Kana",
    kind: "kana",
    symbols: kanaSymbols(KANA_RESTAURANT),
  },
  "kana-shopping": {
    id: "kana-shopping",
    label: "Shopping Kana",
    kind: "kana",
    symbols: kanaSymbols(KANA_SHOPPING),
  },
};

export const SPOT_IT_PACK_IDS: SpotItPackId[] = [
  "food",
  "kawaii",
  "cyber",
  "kana-restaurant",
  "kana-shopping",
];
export const DEFAULT_SPOT_IT_PACK: SpotItPackId = "food";
export const DEFAULT_KANA_PACK: SpotItPackId = "kana-restaurant";

export function isSpotItPackId(v: unknown): v is SpotItPackId {
  return (
    v === "food" ||
    v === "kawaii" ||
    v === "cyber" ||
    v === "kana-restaurant" ||
    v === "kana-shopping"
  );
}

export function getSpotItPack(id: SpotItPackId): SpotItPack {
  return SPOT_IT_PACKS[id];
}

export function isKanaPack(id: SpotItPackId): boolean {
  return SPOT_IT_PACKS[id].kind === "kana";
}

/** Build 4 English choices (correct + 3 distractors) with seeded shuffle. */
export function buildQuizChoices(
  packId: SpotItPackId,
  correctIndex: number,
  seed: number,
): string[] {
  const pack = getSpotItPack(packId);
  const correct = pack.symbols[correctIndex]?.label;
  if (!correct) return [];
  const others = pack.symbols
    .map((s, i) => (i === correctIndex ? null : s.label))
    .filter((x): x is string => !!x);
  let t = seed >>> 0;
  const rand = () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = others.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = others[i]!;
    others[i] = others[j]!;
    others[j] = tmp;
  }
  const choices = [correct, ...others.slice(0, 3)];
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = choices[i]!;
    choices[i] = choices[j]!;
    choices[j] = tmp;
  }
  return choices;
}
