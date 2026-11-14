/**
 * One-shot authoring helper: writes worker/scattergories/hunt/data/*.json
 * with ≥250 objects and ≥10 findable objectIds per Scattergories die letter.
 *
 * Run: node scripts/generate-hunt-catalogs.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../worker/scattergories/hunt/data");

const LETTER_DIE = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
  "N", "O", "P", "R", "S", "T", "W",
];

function normalize(raw) {
  return String(raw)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function startsWithLetter(normalized, letter) {
  if (!normalized) return false;
  const target = letter.toUpperCase();
  for (const ch of normalized) {
    if (/[a-z0-9]/i.test(ch)) return ch.toUpperCase() === target;
  }
  return false;
}

/** Shared fillers — each entry is [id, ...names] with synonyms spanning die letters. */
const FILLERS = [
  ["acorn", "acorn", "nut"],
  ["apron", "apron"],
  ["arrow", "arrow"],
  ["abacus", "abacus"],
  ["anchor", "anchor"],
  ["ant", "ant"],
  ["apple", "apple"],
  ["arm", "arm"],
  ["axe", "axe"],
  ["alarm", "alarm", "alarm clock"],
  ["bag", "bag", "sack"],
  ["ball", "ball", "orb"],
  ["balloon", "balloon"],
  ["banana", "banana"],
  ["basket", "basket", "hamper"],
  ["bat", "bat"],
  ["bead", "bead"],
  ["bean", "bean"],
  ["bear", "bear"],
  ["bee", "bee", "insect", "bug"],
  ["bell", "bell"],
  ["bench", "bench"],
  ["bike", "bike", "bicycle"],
  ["bird", "bird"],
  ["blanket", "blanket"],
  ["block", "block"],
  ["boat", "boat", "ship", "raft"],
  ["bone", "bone"],
  ["book", "book"],
  ["boot", "boot", "boots"],
  ["bottle", "bottle"],
  ["bowl", "bowl"],
  ["box", "box", "crate"],
  ["bracelet", "bracelet"],
  ["bread", "bread", "loaf"],
  ["broom", "broom"],
  ["brush", "brush"],
  ["bucket", "bucket", "pail"],
  ["button", "button"],
  ["cabbage", "cabbage"],
  ["cactus", "cactus"],
  ["cake", "cake"],
  ["calendar", "calendar"],
  ["camera", "camera"],
  ["candle", "candle"],
  ["candy", "candy", "sweet"],
  ["cane", "cane"],
  ["cap", "cap", "hat"],
  ["carrot", "carrot"],
  ["cart", "cart", "wagon"],
  ["cat", "cat", "kitten"],
  ["chain", "chain"],
  ["chair", "chair"],
  ["cheese", "cheese"],
  ["cherry", "cherry"],
  ["chest", "chest", "trunk"],
  ["chicken", "chicken", "hen", "rooster"],
  ["chili", "chili"],
  ["chip", "chip"],
  ["clock", "clock", "watch"],
  ["cloud", "cloud"],
  ["clown", "clown"],
  ["coat", "coat", "jacket"],
  ["coin", "coin"],
  ["comb", "comb"],
  ["compass", "compass"],
  ["cookie", "cookie", "biscuit"],
  ["cork", "cork"],
  ["corn", "corn"],
  ["cow", "cow"],
  ["crab", "crab"],
  ["crayon", "crayon"],
  ["crown", "crown"],
  ["cup", "cup", "mug", "teacup"],
  ["curtain", "curtain"],
  ["cushion", "cushion", "pillow"],
  ["daisy", "daisy", "flower"],
  ["deer", "deer", "fawn"],
  ["desk", "desk"],
  ["diamond", "diamond"],
  ["dice", "dice", "die"],
  ["dinosaur", "dinosaur"],
  ["dish", "dish", "plate"],
  ["dog", "dog", "puppy"],
  ["doll", "doll"],
  ["dolphin", "dolphin"],
  ["domino", "domino"],
  ["door", "door"],
  ["doughnut", "doughnut", "donut"],
  ["dragon", "dragon"],
  ["drum", "drum"],
  ["duck", "duck"],
  ["ear", "ear"],
  ["easel", "easel"],
  ["egg", "egg"],
  ["elbow", "elbow"],
  ["elephant", "elephant"],
  ["envelope", "envelope", "letter"],
  ["eraser", "eraser"],
  ["fan", "fan"],
  ["feather", "feather"],
  ["fence", "fence"],
  ["fern", "fern"],
  ["fiddle", "fiddle", "violin"],
  ["fig", "fig"],
  ["finch", "finch"],
  ["finger", "finger"],
  ["fire", "fire"],
  ["fish", "fish"],
  ["flag", "flag"],
  ["flashlight", "flashlight", "torch"],
  ["flute", "flute"],
  ["fly", "fly"],
  ["foam", "foam"],
  ["fork", "fork"],
  ["fox", "fox"],
  ["frame", "frame"],
  ["frog", "frog"],
  ["funnel", "funnel"],
  ["game", "game"],
  ["garlic", "garlic"],
  ["gate", "gate"],
  ["gift", "gift", "present"],
  ["giraffe", "giraffe"],
  ["glass", "glass"],
  ["globe", "globe"],
  ["glove", "glove", "mitten"],
  ["goat", "goat"],
  ["goggles", "goggles"],
  ["goose", "goose"],
  ["grape", "grape"],
  ["grass", "grass"],
  ["grill", "grill"],
  ["guitar", "guitar"],
  ["gum", "gum"],
  ["hammer", "hammer"],
  ["hand", "hand"],
  ["hanger", "hanger"],
  ["harp", "harp"],
  ["hat", "hat", "bonnet"],
  ["hay", "hay"],
  ["heart", "heart"],
  ["hedgehog", "hedgehog"],
  ["helmet", "helmet"],
  ["hook", "hook"],
  ["horn", "horn", "trumpet"],
  ["horse", "horse", "pony"],
  ["hose", "hose"],
  ["hourglass", "hourglass"],
  ["house", "house"],
  ["ice", "ice"],
  ["igloo", "igloo"],
  ["ink", "ink", "inkwell"],
  ["iron", "iron"],
  ["ivy", "ivy"],
  ["jack", "jack"],
  ["jacket", "jacket", "coat"],
  ["jam", "jam", "jelly"],
  ["jar", "jar"],
  ["jeep", "jeep"],
  ["jellybean", "jellybean"],
  ["jet", "jet"],
  ["jewel", "jewel", "gem"],
  ["jigsaw", "jigsaw", "puzzle"],
  ["joystick", "joystick"],
  ["jug", "jug", "pitcher"],
  ["juice", "juice"],
  ["jumper", "jumper", "sweater"],
  ["kangaroo", "kangaroo"],
  ["kayak", "kayak"],
  ["kettle", "kettle", "teapot"],
  ["key", "key"],
  ["keyboard", "keyboard"],
  ["kite", "kite"],
  ["kitten", "kitten", "cat"],
  ["kiwi", "kiwi"],
  ["knee", "knee"],
  ["knife", "knife"],
  ["knight", "knight"],
  ["knot", "knot"],
  ["koala", "koala"],
  ["ladder", "ladder"],
  ["ladle", "ladle"],
  ["lamp", "lamp"],
  ["lantern", "lantern"],
  ["leaf", "leaf"],
  ["lemon", "lemon"],
  ["lettuce", "lettuce"],
  ["lid", "lid"],
  ["light", "light"],
  ["lime", "lime"],
  ["lion", "lion"],
  ["lip", "lip"],
  ["lizard", "lizard"],
  ["lock", "lock", "padlock"],
  ["log", "log"],
  ["lollipop", "lollipop"],
  ["magnet", "magnet"],
  ["mailbox", "mailbox"],
  ["map", "map"],
  ["marble", "marble"],
  ["mask", "mask"],
  ["mat", "mat", "rug"],
  ["match", "match"],
  ["medal", "medal"],
  ["melon", "melon", "watermelon"],
  ["microphone", "microphone"],
  ["milk", "milk"],
  ["mirror", "mirror"],
  ["mole", "mole"],
  ["monkey", "monkey"],
  ["moon", "moon"],
  ["mop", "mop"],
  ["mosquito", "mosquito"],
  ["mouse", "mouse"],
  ["mushroom", "mushroom", "toadstool"],
  ["nail", "nail"],
  ["napkin", "napkin"],
  ["necklace", "necklace"],
  ["needle", "needle"],
  ["nest", "nest"],
  ["net", "net"],
  ["newspaper", "newspaper"],
  ["noodle", "noodle"],
  ["nose", "nose"],
  ["notebook", "notebook"],
  ["nut", "nut", "acorn"],
  ["oar", "oar"],
  ["octopus", "octopus"],
  ["oil", "oil"],
  ["olive", "olive"],
  ["onion", "onion"],
  ["orange", "orange"],
  ["ostrich", "ostrich"],
  ["otter", "otter"],
  ["oven", "oven"],
  ["owl", "owl"],
  ["ox", "ox"],
  ["oyster", "oyster"],
  ["paint", "paint"],
  ["pan", "pan", "skillet"],
  ["panda", "panda"],
  ["paper", "paper"],
  ["parrot", "parrot"],
  ["peach", "peach"],
  ["peacock", "peacock"],
  ["pear", "pear"],
  ["peas", "peas"],
  ["pen", "pen"],
  ["pencil", "pencil"],
  ["penguin", "penguin"],
  ["pepper", "pepper"],
  ["piano", "piano"],
  ["pickle", "pickle"],
  ["pie", "pie"],
  ["pig", "pig"],
  ["pillow", "pillow", "cushion"],
  ["pin", "pin"],
  ["pineapple", "pineapple"],
  ["pipe", "pipe"],
  ["pizza", "pizza"],
  ["plant", "plant"],
  ["plate", "plate", "dish"],
  ["plum", "plum"],
  ["pocket", "pocket"],
  ["popcorn", "popcorn"],
  ["pot", "pot"],
  ["potato", "potato"],
  ["pretzel", "pretzel"],
  ["pumpkin", "pumpkin"],
  ["puppet", "puppet"],
  ["rabbit", "rabbit", "bunny"],
  ["raccoon", "raccoon"],
  ["radio", "radio"],
  ["raft", "raft", "boat"],
  ["rake", "rake"],
  ["raspberry", "raspberry"],
  ["rat", "rat"],
  ["ribbon", "ribbon"],
  ["ring", "ring"],
  ["robot", "robot"],
  ["rock", "rock", "stone"],
  ["rocket", "rocket"],
  ["rope", "rope"],
  ["rose", "rose"],
  ["ruler", "ruler"],
  ["saddle", "saddle"],
  ["sail", "sail"],
  ["sandwich", "sandwich"],
  ["saw", "saw"],
  ["scarf", "scarf"],
  ["scissors", "scissors"],
  ["scooter", "scooter"],
  ["screw", "screw"],
  ["seahorse", "seahorse"],
  ["seal", "seal"],
  ["seed", "seed"],
  ["shark", "shark"],
  ["sheep", "sheep", "lamb"],
  ["shell", "shell"],
  ["shield", "shield"],
  ["shirt", "shirt"],
  ["shoe", "shoe"],
  ["shovel", "shovel", "spade"],
  ["shrimp", "shrimp", "prawn"],
  ["sign", "sign", "signpost"],
  ["sink", "sink"],
  ["skate", "skate", "skateboard"],
  ["skeleton", "skeleton"],
  ["ski", "ski"],
  ["skirt", "skirt"],
  ["sled", "sled"],
  ["slide", "slide"],
  ["snail", "snail"],
  ["snake", "snake"],
  ["soap", "soap"],
  ["sock", "sock", "socks"],
  ["sofa", "sofa", "couch"],
  ["spoon", "spoon"],
  ["spider", "spider"],
  ["sponge", "sponge"],
  ["spoon", "spoon"],
  ["squirrel", "squirrel"],
  ["stamp", "stamp"],
  ["star", "star"],
  ["starfish", "starfish"],
  ["stool", "stool"],
  ["stove", "stove"],
  ["strawberry", "strawberry"],
  ["string", "string"],
  ["suitcase", "suitcase", "luggage"],
  ["sun", "sun"],
  ["sunflower", "sunflower"],
  ["swing", "swing"],
  ["sword", "sword"],
  ["table", "table"],
  ["taco", "taco"],
  ["tambourine", "tambourine"],
  ["tape", "tape"],
  ["teapot", "teapot", "kettle"],
  ["teddy", "teddy", "teddy bear"],
  ["telescope", "telescope"],
  ["tent", "tent"],
  ["thermometer", "thermometer"],
  ["thimble", "thimble"],
  ["thread", "thread"],
  ["tiger", "tiger"],
  ["toast", "toast"],
  ["tomato", "tomato"],
  ["tongs", "tongs"],
  ["toothbrush", "toothbrush"],
  ["towel", "towel"],
  ["toy", "toy"],
  ["tractor", "tractor"],
  ["train", "train"],
  ["tree", "tree"],
  ["triangle", "triangle"],
  ["trombone", "trombone"],
  ["trophy", "trophy"],
  ["truck", "truck"],
  ["turtle", "turtle", "tortoise"],
  ["umbrella", "umbrella"],
  ["vase", "vase"],
  ["wagon", "wagon", "cart"],
  ["walnut", "walnut"],
  ["wand", "wand"],
  ["wasp", "wasp", "hornet"],
  ["water", "water"],
  ["watermelon", "watermelon", "melon"],
  ["wave", "wave"],
  ["whale", "whale"],
  ["wheel", "wheel"],
  ["wheelbarrow", "wheelbarrow"],
  ["whistle", "whistle"],
  ["wig", "wig"],
  ["window", "window"],
  ["wing", "wing"],
  ["wolf", "wolf"],
  ["worm", "worm"],
  ["wrench", "wrench"],
];

const THEME_EXTRAS = {
  kitchen: [
    ["blender", "blender"],
    ["toaster", "toaster"],
    ["whisk", "whisk"],
    ["rolling-pin", "rolling pin"],
    ["cutting-board", "cutting board", "board"],
    ["refrigerator", "refrigerator", "fridge"],
    ["oven-mitt", "oven mitt", "mitt"],
    ["spatula", "spatula"],
    ["colander", "colander", "strainer"],
    ["measuring-cup", "measuring cup"],
    ["pepper-mill", "pepper mill", "grinder"],
    ["salt-shaker", "salt shaker"],
    ["sugar-bowl", "sugar bowl"],
    ["butter", "butter"],
    ["syrup", "syrup"],
    ["waffle", "waffle"],
    ["pancake", "pancake"],
    ["muffin", "muffin"],
    ["bagel", "bagel"],
    ["cereal", "cereal"],
    ["oatmeal", "oatmeal"],
    ["honey", "honey"],
    ["mustard", "mustard"],
    ["ketchup", "ketchup"],
    ["recipe", "recipe", "recipe card"],
  ],
  playroom: [
    ["blocks", "blocks", "building blocks"],
    ["lego", "lego", "bricks"],
    ["yo-yo", "yo-yo"],
    ["hula-hoop", "hula hoop", "hoop"],
    ["jump-rope", "jump rope"],
    ["crayon-box", "crayon box"],
    ["chalkboard", "chalkboard", "blackboard"],
    ["chalk", "chalk"],
    ["puppet-theater", "puppet theater"],
    ["train-set", "train set"],
    ["racecar", "racecar", "car"],
    ["airplane", "airplane", "plane"],
    ["action-figure", "action figure", "figure"],
    ["stuffed-animal", "stuffed animal", "plush"],
    ["marbles", "marbles"],
    ["jacks", "jacks"],
    ["card", "card", "playing card"],
    ["board-game", "board game"],
    ["dice-cup", "dice cup"],
    ["puzzle-piece", "puzzle piece"],
    ["beanbag", "beanbag"],
    ["fort", "fort", "blanket fort"],
    ["flashlight-toy", "flashlight"],
    ["walkie", "walkie talkie"],
    ["helmet-toy", "bike helmet"],
  ],
  farm: [
    ["barn", "barn"],
    ["silo", "silo"],
    ["pitchfork", "pitchfork", "fork"],
    ["hay-bale", "hay bale", "bale"],
    ["chicken-coop", "chicken coop", "coop"],
    ["pigpen", "pigpen"],
    ["trough", "trough"],
    ["fence-post", "fence post", "post"],
    ["scarecrow", "scarecrow"],
    ["windmill", "windmill"],
    ["plow", "plow"],
    ["horseshoe", "horseshoe"],
    ["bridle", "bridle"],
    ["milking-stool", "milking stool"],
    ["egg-basket", "egg basket"],
    ["cornfield", "cornfield"],
    ["pumpkin-patch", "pumpkin patch"],
    ["rooster", "rooster", "cock"],
    ["lamb", "lamb", "sheep"],
    ["calf", "calf"],
    ["chick", "chick"],
    ["duck-pond", "duck pond", "pond"],
    ["well", "well"],
    ["bucket-well", "well bucket"],
    ["overalls", "overalls"],
  ],
  beach: [
    ["sandcastle", "sandcastle", "castle"],
    ["bucket-sand", "sand bucket", "pail"],
    ["shovel-sand", "sand shovel"],
    ["beach-ball", "beach ball"],
    ["towel-beach", "beach towel"],
    ["umbrella-beach", "beach umbrella"],
    ["surfboard", "surfboard", "board"],
    ["snorkel", "snorkel"],
    ["mask-dive", "dive mask", "mask"],
    ["fin", "fin", "flipper"],
    ["lifeguard", "lifeguard"],
    ["life-preserver", "life preserver", "ring buoy"],
    ["pier", "pier", "dock"],
    ["lighthouse", "lighthouse"],
    ["seashell", "seashell", "shell"],
    ["sand-dollar", "sand dollar"],
    ["crab-claw", "crab"],
    ["jellyfish", "jellyfish"],
    ["ice-cream", "ice cream", "cone"],
    ["popsicle", "popsicle"],
    ["cooler", "cooler"],
    ["chair-beach", "beach chair"],
    ["sunglasses", "sunglasses", "shades"],
    ["sunscreen", "sunscreen", "lotion"],
    ["kite-beach", "kite"],
  ],
  park: [
    ["picnic-blanket", "picnic blanket", "blanket"],
    ["picnic-basket", "picnic basket", "basket"],
    ["swing-set", "swing set"],
    ["see-saw", "see saw", "teeter totter"],
    ["slide-park", "slide"],
    ["sandbox", "sandbox"],
    ["frisbee", "frisbee", "disk"],
    ["kite-park", "kite"],
    ["dog-leash", "leash"],
    ["fire-hydrant", "fire hydrant", "hydrant"],
    ["bench-park", "park bench", "bench"],
    ["fountain", "fountain"],
    ["path", "path", "trail"],
    ["lamppost", "lamppost", "streetlamp"],
    ["mailbox-park", "mailbox"],
    ["birdhouse", "birdhouse"],
    ["squirrel-park", "squirrel"],
    ["butterfly", "butterfly"],
    ["ladybug", "ladybug"],
    ["dandelion", "dandelion"],
    ["soccer-ball", "soccer ball", "football"],
    ["baseball", "baseball"],
    ["glove-mitt", "baseball mitt", "mitt"],
    ["hot-dog", "hot dog"],
    ["lemonade-stand", "lemonade stand", "lemonade"],
  ],
  shop: [
    ["cash-register", "cash register", "register"],
    ["price-tag", "price tag", "tag"],
    ["receipt", "receipt"],
    ["shopping-bag", "shopping bag"],
    ["mannequin", "mannequin"],
    ["shelf", "shelf", "bookshelf"],
    ["ladder-shop", "ladder"],
    ["stroller", "stroller", "pram", "buggy", "carriage"],
    ["ship-bottle", "ship in a bottle", "ship", "boat"],
    ["television", "television", "tv"],
    ["calculator", "calculator"],
    ["fireplace", "fireplace", "hearth"],
    ["detective", "detective", "mole"],
    ["prawn", "prawn", "shrimp"],
  ],
  carnival: [
    ["ferris-wheel", "ferris wheel", "wheel"],
    ["carousel", "carousel", "merry go round"],
    ["ticket", "ticket"],
    ["booth", "booth"],
    ["cotton-candy", "cotton candy", "candy floss"],
    ["carousel-horse", "carousel horse", "horse"],
    ["unicycle", "unicycle"],
    ["marquee", "marquee", "tent"],
    ["tip-jar", "tip jar", "jar"],
    ["treasure-map", "treasure map", "map"],
    ["padlock", "padlock", "lock"],
  ],
};

const SCENES = [
  { id: "shop", title: "Cluttered Shop", imageUrl: "/hunt/shop.jpg" },
  { id: "carnival", title: "Carnival Park", imageUrl: "/hunt/carnival.jpg" },
  { id: "kitchen", title: "Busy Kitchen", imageUrl: "/hunt/kitchen.jpg" },
  { id: "playroom", title: "Toy Playroom", imageUrl: "/hunt/playroom.jpg" },
  { id: "farm", title: "Sunny Farmyard", imageUrl: "/hunt/farm.jpg" },
  { id: "beach", title: "Beach Boardwalk", imageUrl: "/hunt/beach.jpg" },
  { id: "park", title: "Neighborhood Park", imageUrl: "/hunt/park.jpg" },
];

function toObject(entry) {
  const [id, ...names] = entry;
  const normalized = [...new Set(names.map(normalize).filter(Boolean))];
  return { id, names: normalized.length ? normalized : [id] };
}

function letterCounts(objects) {
  const counts = Object.fromEntries(LETTER_DIE.map((l) => [l, new Set()]));
  for (const obj of objects) {
    for (const name of obj.names) {
      for (const letter of LETTER_DIE) {
        if (startsWithLetter(name, letter)) counts[letter].add(obj.id);
      }
    }
  }
  return Object.fromEntries(
    LETTER_DIE.map((l) => [l, counts[l].size]),
  );
}

function ensureCoverage(objects) {
  const out = [...objects];
  const usedIds = new Set(out.map((o) => o.id));
  let guard = 0;
  while (guard++ < 500) {
    const counts = letterCounts(out);
    const weak = LETTER_DIE.filter((l) => counts[l] < 10);
    if (out.length >= 250 && weak.length === 0) break;

    if (out.length < 250) {
      // Add next unused filler
      for (const entry of FILLERS) {
        const obj = toObject(entry);
        if (usedIds.has(obj.id)) continue;
        usedIds.add(obj.id);
        out.push(obj);
        break;
      }
      continue;
    }

    // Boost weak letters with dedicated fillers
    for (const letter of weak) {
      const candidates = FILLERS.filter((e) =>
        e.slice(1).some((n) => startsWithLetter(normalize(n), letter)),
      );
      for (const entry of candidates) {
        const baseId = `${entry[0]}-${letter.toLowerCase()}-${out.length}`;
        if (usedIds.has(baseId)) continue;
        const names = entry
          .slice(1)
          .map(normalize)
          .filter((n) => startsWithLetter(n, letter));
        if (!names.length) continue;
        usedIds.add(baseId);
        out.push({ id: baseId, names: [...new Set(names)] });
        break;
      }
    }
  }
  return out;
}

function buildScene(meta) {
  const extras = THEME_EXTRAS[meta.id] ?? [];
  const merged = new Map();
  for (const entry of [...extras, ...FILLERS]) {
    const obj = toObject(entry);
    if (!merged.has(obj.id)) merged.set(obj.id, obj);
    else {
      const prev = merged.get(obj.id);
      prev.names = [...new Set([...prev.names, ...obj.names])];
    }
  }
  let objects = ensureCoverage([...merged.values()]);
  // Deduplicate by id after ensure
  const byId = new Map();
  for (const o of objects) {
    if (!byId.has(o.id)) byId.set(o.id, o);
  }
  objects = ensureCoverage([...byId.values()]);
  return {
    id: meta.id,
    title: meta.title,
    imageUrl: meta.imageUrl,
    objects,
  };
}

mkdirSync(OUT, { recursive: true });
for (const meta of SCENES) {
  const scene = buildScene(meta);
  const counts = letterCounts(scene.objects);
  const minLetter = Math.min(...Object.values(counts));
  console.log(
    `${scene.id}: ${scene.objects.length} objects, min letter=${minLetter}`,
    counts,
  );
  writeFileSync(join(OUT, `${scene.id}.json`), JSON.stringify(scene, null, 2) + "\n");
}
console.log("Wrote catalogs to", OUT);
