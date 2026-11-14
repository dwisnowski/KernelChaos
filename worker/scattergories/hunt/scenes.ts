import { normalizeAnswer } from "../normalize.ts";

export interface HuntObject {
  id: string;
  names: string[];
}

export interface HuntScene {
  id: string;
  title: string;
  imageUrl: string;
  objects: HuntObject[];
}

/** Cap free-text finds per player per round. */
export const HUNT_MAX_ANSWERS = 40;

function obj(id: string, ...names: string[]): HuntObject {
  const normalized = names.map((n) => normalizeAnswer(n)).filter(Boolean);
  const unique = [...new Set(normalized)];
  return { id, names: unique.length > 0 ? unique : [id] };
}

const SHOP: HuntScene = {
  id: "shop",
  title: "Cluttered Shop",
  imageUrl: "/hunt/shop.jpg",
  objects: [
    obj("ladder", "ladder", "step ladder"),
    obj("key", "key"),
    obj("mole", "mole", "detective"),
    obj("shrimp", "shrimp", "prawn"),
    obj("ship", "ship", "boat", "ship in a bottle"),
    obj("cactus", "cactus"),
    obj("candle", "candle"),
    obj("clock", "clock", "watch"),
    obj("mug", "mug", "cup"),
    obj("lamp", "lamp"),
    obj("bucket", "bucket", "pail"),
    obj("suitcase", "suitcase", "luggage"),
    obj("trophy", "trophy"),
    obj("teapot", "teapot", "kettle"),
    obj("map", "map"),
    obj("whale", "whale"),
    obj("fish", "fish"),
    obj("bee", "bee", "insect", "bug", "wasp", "hornet"),
    obj("cat", "cat", "kitten"),
    obj("dog", "dog", "puppy"),
    obj("chicken", "chicken", "hen", "rooster", "bird"),
    obj("cowboy", "cowboy", "cowboy hat"),
    obj("hat", "hat", "cap"),
    obj("helmet", "helmet", "hard hat"),
    obj("gloves", "gloves"),
    obj("socks", "socks"),
    obj("broom", "broom"),
    obj("radio", "radio"),
    obj("tv", "tv", "television"),
    obj("calculator", "calculator"),
    obj("register", "register", "cash register"),
    obj("pencil", "pencil"),
    obj("envelope", "envelope", "letter"),
    obj("book", "book"),
    obj("bookshelf", "bookshelf", "shelf"),
    obj("plant", "plant", "hanging plant"),
    obj("flower", "flower", "flowers"),
    obj("frame", "frame", "picture frame"),
    obj("clown", "clown"),
    obj("pig", "pig"),
    obj("fireplace", "fireplace", "hearth"),
    obj("rug", "rug", "carpet"),
    obj("rope", "rope"),
    obj("bottle", "bottle"),
    obj("box", "box"),
    obj("bag", "bag", "backpack"),
    obj("boots", "boots"),
    obj("bed", "bed"),
    obj("desk", "desk"),
    obj("abacus", "abacus"),
    obj("arrow", "arrow"),
    obj("star", "star"),
    obj("shell", "shell"),
    obj("glasses", "glasses", "spectacles"),
    obj("horseshoe", "horseshoe"),
    obj("hanger", "hanger"),
    obj("inkwell", "inkwell", "ink"),
    obj("calendar", "calendar"),
    obj("corn", "corn"),
  ],
};

const CARNIVAL: HuntScene = {
  id: "carnival",
  title: "Carnival Park",
  imageUrl: "/hunt/carnival.jpg",
  objects: [
    obj("ferris-wheel", "ferris wheel", "wheel"),
    obj("windmill", "windmill"),
    obj("tent", "tent", "circus tent", "marquee"),
    obj("lemonade", "lemonade", "lemonade stand"),
    obj("popcorn", "popcorn", "popcorn cart"),
    obj("balloon", "balloon", "balloons"),
    obj("raccoon", "raccoon"),
    obj("goat", "goat"),
    obj("unicycle", "unicycle"),
    obj("octopus", "octopus"),
    obj("fox", "fox"),
    obj("kite", "kite"),
    obj("penguin", "penguin"),
    obj("camera", "camera"),
    obj("dog", "dog", "puppy"),
    obj("trumpet", "trumpet", "horn"),
    obj("hedgehog", "hedgehog"),
    obj("chest", "chest", "treasure chest", "treasure"),
    obj("squirrel", "squirrel"),
    obj("mushroom", "mushroom", "toadstool"),
    obj("frog", "frog"),
    obj("umbrella", "umbrella"),
    obj("duck", "duck"),
    obj("boat", "boat", "rowboat", "ship"),
    obj("crab", "crab"),
    obj("bee", "bee", "insect", "bug"),
    obj("sunflower", "sunflower"),
    obj("scarecrow", "scarecrow"),
    obj("horse", "horse", "carousel horse"),
    obj("robot", "robot"),
    obj("bicycle", "bicycle", "bike"),
    obj("apple", "apple"),
    obj("banana", "banana"),
    obj("watermelon", "watermelon"),
    obj("pretzel", "pretzel"),
    obj("teapot", "teapot", "kettle"),
    obj("cup", "cup", "mug", "teacup"),
    obj("telescope", "telescope"),
    obj("compass", "compass"),
    obj("hourglass", "hourglass"),
    obj("lantern", "lantern"),
    obj("wheelbarrow", "wheelbarrow"),
    obj("net", "net", "butterfly net"),
    obj("fishing-rod", "fishing rod", "fishing pole", "rod"),
    obj("drum", "drum"),
    obj("violin", "violin", "fiddle", "cello"),
    obj("starfish", "starfish"),
    obj("shell", "shell"),
    obj("basket", "basket", "picnic basket"),
    obj("map", "map", "treasure map"),
    obj("lock", "lock", "padlock"),
    obj("mailbox", "mailbox"),
    obj("sign", "sign", "signpost"),
    obj("jar", "jar", "tip jar"),
    obj("cloud", "cloud"),
    obj("star", "star"),
  ],
};

export const HUNT_SCENES: HuntScene[] = [SHOP, CARNIVAL];

export function scenesCatalog(): HuntScene[] {
  return HUNT_SCENES.map((s) => ({
    id: s.id,
    title: s.title,
    imageUrl: s.imageUrl,
    objects: s.objects.map((o) => ({ id: o.id, names: [...o.names] })),
  }));
}

export function getScene(id: string): HuntScene | undefined {
  return HUNT_SCENES.find((s) => s.id === id);
}

export function isHuntSceneId(v: unknown): v is string {
  return typeof v === "string" && HUNT_SCENES.some((s) => s.id === v);
}

/** Pick a scene, preferring `preferredId` when still unused; else random unused (wrap when exhausted). */
export function pickScene(usedIds: Set<string>, preferredId: string | null): HuntScene {
  const all = HUNT_SCENES;
  if (preferredId) {
    const preferred = all.find((s) => s.id === preferredId);
    if (preferred && !usedIds.has(preferred.id)) {
      return {
        id: preferred.id,
        title: preferred.title,
        imageUrl: preferred.imageUrl,
        objects: preferred.objects.map((o) => ({ id: o.id, names: [...o.names] })),
      };
    }
  }
  const available = all.filter((s) => !usedIds.has(s.id));
  const pool = available.length > 0 ? available : all;
  const bytes = crypto.getRandomValues(new Uint8Array(1));
  const scene = pool[bytes[0]! % pool.length]!;
  return {
    id: scene.id,
    title: scene.title,
    imageUrl: scene.imageUrl,
    objects: scene.objects.map((o) => ({ id: o.id, names: [...o.names] })),
  };
}
