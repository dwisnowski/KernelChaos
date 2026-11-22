import type { WheelPuzzlePublic } from "./protocol.ts";

export interface WheelPuzzle {
  id: string;
  category: string;
  answer: string;
}

/** Original KernelChaos family pack — MIT-safe, no licensed show phrases. */
export const FAMILY_PUZZLES: WheelPuzzle[] = [
  { id: "f01", category: "PHRASE", answer: "BETTER LATE THAN NEVER" },
  { id: "f02", category: "PHRASE", answer: "EASY AS PIE" },
  { id: "f03", category: "PHRASE", answer: "BREAK A LEG" },
  { id: "f04", category: "PHRASE", answer: "PIECE OF CAKE" },
  { id: "f05", category: "PHRASE", answer: "HIT THE ROAD" },
  { id: "f06", category: "PHRASE", answer: "ONCE IN A BLUE MOON" },
  { id: "f07", category: "PHRASE", answer: "SPILL THE BEANS" },
  { id: "f08", category: "PHRASE", answer: "UNDER THE WEATHER" },
  { id: "f09", category: "THING", answer: "RUBBER DUCK" },
  { id: "f10", category: "THING", answer: "FLASHLIGHT" },
  { id: "f11", category: "THING", answer: "BACKPACK" },
  { id: "f12", category: "THING", answer: "TOOTHBRUSH" },
  { id: "f13", category: "THING", answer: "UMBRELLA" },
  { id: "f14", category: "THING", answer: "BOARD GAME" },
  { id: "f15", category: "FOOD", answer: "GRILLED CHEESE" },
  { id: "f16", category: "FOOD", answer: "BANANA SPLIT" },
  { id: "f17", category: "FOOD", answer: "PEANUT BUTTER" },
  { id: "f18", category: "FOOD", answer: "MACARONI AND CHEESE" },
  { id: "f19", category: "FOOD", answer: "APPLE PIE" },
  { id: "f20", category: "FOOD", answer: "HOT CHOCOLATE" },
  { id: "f21", category: "PLACE", answer: "LIVING ROOM" },
  { id: "f22", category: "PLACE", answer: "PUBLIC LIBRARY" },
  { id: "f23", category: "PLACE", answer: "AMUSEMENT PARK" },
  { id: "f24", category: "PLACE", answer: "FARMERS MARKET" },
  { id: "f25", category: "PLACE", answer: "TREE HOUSE" },
  { id: "f26", category: "PERSON", answer: "SCHOOL TEACHER" },
  { id: "f27", category: "PERSON", answer: "FIREFIGHTER" },
  { id: "f28", category: "PERSON", answer: "BEST FRIEND" },
  { id: "f29", category: "PERSON", answer: "NEXT DOOR NEIGHBOR" },
  { id: "f30", category: "EVENT", answer: "BIRTHDAY PARTY" },
  { id: "f31", category: "EVENT", answer: "FAMILY REUNION" },
  { id: "f32", category: "EVENT", answer: "MOVIE NIGHT" },
  { id: "f33", category: "EVENT", answer: "CAMPING TRIP" },
  { id: "f34", category: "AROUND THE HOUSE", answer: "KITCHEN SINK" },
  { id: "f35", category: "AROUND THE HOUSE", answer: "COUCH CUSHION" },
  { id: "f36", category: "AROUND THE HOUSE", answer: "REMOTE CONTROL" },
  { id: "f37", category: "AROUND THE HOUSE", answer: "LAUNDRY BASKET" },
  { id: "f38", category: "ON THE MAP", answer: "GRAND CANYON" },
  { id: "f39", category: "ON THE MAP", answer: "GREAT LAKES" },
  { id: "f40", category: "ON THE MAP", answer: "PACIFIC OCEAN" },
  { id: "f41", category: "FUN AND GAMES", answer: "HIDE AND SEEK" },
  { id: "f42", category: "FUN AND GAMES", answer: "CAPTURE THE FLAG" },
  { id: "f43", category: "FUN AND GAMES", answer: "JUMP ROPE" },
  { id: "f44", category: "WHAT ARE YOU DOING", answer: "BAKING COOKIES" },
  { id: "f45", category: "WHAT ARE YOU DOING", answer: "READING A BOOK" },
  { id: "f46", category: "WHAT ARE YOU DOING", answer: "WALKING THE DOG" },
  { id: "f47", category: "IN THE GARDEN", answer: "SUNFLOWER" },
  { id: "f48", category: "IN THE GARDEN", answer: "TOMATO PLANT" },
  { id: "f49", category: "TITLE", answer: "GOODNIGHT MOON" },
  { id: "f50", category: "TITLE", answer: "THE CAT IN THE HAT" },
  { id: "f51", category: "PHRASE", answer: "A BIRD IN THE HAND" },
  { id: "f52", category: "PHRASE", answer: "A BLESSING IN DISGUISE" },
  { id: "f53", category: "PHRASE", answer: "A DIME A DOZEN" },
  { id: "f54", category: "PHRASE", answer: "A FISH OUT OF WATER" },
  { id: "f55", category: "PHRASE", answer: "A HOT POTATO" },
  { id: "f56", category: "PHRASE", answer: "A PENNY FOR YOUR THOUGHTS" },
  { id: "f57", category: "PHRASE", answer: "A PICTURE IS WORTH A THOUSAND WORDS" },
  { id: "f58", category: "PHRASE", answer: "ACTIONS SPEAK LOUDER THAN WORDS" },
  { id: "f59", category: "PHRASE", answer: "ADD FUEL TO THE FIRE" },
  { id: "f60", category: "PHRASE", answer: "AGAINST ALL ODDS" },
  { id: "f61", category: "PHRASE", answer: "ALL BARK AND NO BITE" },
  { id: "f62", category: "PHRASE", answer: "ALL IN A DAYS WORK" },
  { id: "f63", category: "PHRASE", answer: "ALL THAT GLITTERS IS NOT GOLD" },
  { id: "f64", category: "PHRASE", answer: "AN APPLE A DAY" },
  { id: "f65", category: "PHRASE", answer: "APPLE OF MY EYE" },
  { id: "f66", category: "PHRASE", answer: "AS BUSY AS A BEE" },
  { id: "f67", category: "PHRASE", answer: "AS COOL AS A CUCUMBER" },
  { id: "f68", category: "PHRASE", answer: "AS LUCK WOULD HAVE IT" },
  { id: "f69", category: "PHRASE", answer: "AT THE DROP OF A HAT" },
  { id: "f70", category: "PHRASE", answer: "BACK TO SQUARE ONE" },
  { id: "f71", category: "PHRASE", answer: "BARKING UP THE WRONG TREE" },
  { id: "f72", category: "PHRASE", answer: "BEAT AROUND THE BUSH" },
  { id: "f73", category: "PHRASE", answer: "BETWEEN A ROCK AND A HARD PLACE" },
  { id: "f74", category: "PHRASE", answer: "BITE OFF MORE THAN YOU CAN CHEW" },
  { id: "f75", category: "PHRASE", answer: "BITE THE BULLET" },
  { id: "f76", category: "PHRASE", answer: "BLOW OFF STEAM" },
  { id: "f77", category: "PHRASE", answer: "BURNING THE MIDNIGHT OIL" },
  { id: "f78", category: "PHRASE", answer: "BY THE SKIN OF YOUR TEETH" },
  { id: "f79", category: "PHRASE", answer: "CALL IT A DAY" },
  { id: "f80", category: "PHRASE", answer: "CALM BEFORE THE STORM" },
  { id: "f81", category: "PHRASE", answer: "CATCH SOMEONE RED HANDED" },
  { id: "f82", category: "PHRASE", answer: "CHIP OFF THE OLD BLOCK" },
  { id: "f83", category: "PHRASE", answer: "CLEAN AS A WHISTLE" },
  { id: "f84", category: "PHRASE", answer: "CLOSE BUT NO CIGAR" },
  { id: "f85", category: "PHRASE", answer: "COME RAIN OR SHINE" },
  { id: "f86", category: "PHRASE", answer: "COSTS AN ARM AND A LEG" },
  { id: "f87", category: "PHRASE", answer: "CROSS THAT BRIDGE WHEN YOU COME TO IT" },
  { id: "f88", category: "PHRASE", answer: "CRY OVER SPILLED MILK" },
  { id: "f89", category: "PHRASE", answer: "CUT TO THE CHASE" },
  { id: "f90", category: "PHRASE", answer: "DO NOT COUNT YOUR CHICKENS" },
  { id: "f91", category: "PHRASE", answer: "DOWN TO EARTH" },
  { id: "f92", category: "PHRASE", answer: "EVERY CLOUD HAS A SILVER LINING" },
  { id: "f93", category: "PHRASE", answer: "FIND YOUR FEET" },
  { id: "f94", category: "PHRASE", answer: "FIT AS A FIDDLE" },
  { id: "f95", category: "PHRASE", answer: "FOLLOW YOUR HEART" },
  { id: "f96", category: "PHRASE", answer: "FOOD FOR THOUGHT" },
  { id: "f97", category: "PHRASE", answer: "GET COLD FEET" },
  { id: "f98", category: "PHRASE", answer: "GET OUT OF HAND" },
  { id: "f99", category: "PHRASE", answer: "GIVE SOMEONE THE COLD SHOULDER" },
  { id: "f100", category: "PHRASE", answer: "GO THE EXTRA MILE" },
  { id: "f101", category: "PHRASE", answer: "HANG IN THERE" },
  { id: "f102", category: "PHRASE", answer: "HAVE YOUR CAKE AND EAT IT TOO" },
  { id: "f103", category: "PHRASE", answer: "HEAD OVER HEELS" },
  { id: "f104", category: "PHRASE", answer: "HIT THE NAIL ON THE HEAD" },
  { id: "f105", category: "PHRASE", answer: "HOLD YOUR HORSES" },
  { id: "f106", category: "PHRASE", answer: "IN HOT WATER" },
  { id: "f107", category: "PHRASE", answer: "IN THE SAME BOAT" },
  { id: "f108", category: "PHRASE", answer: "IT TAKES TWO TO TANGO" },
  { id: "f109", category: "PHRASE", answer: "JUMP ON THE BANDWAGON" },
  { id: "f110", category: "PHRASE", answer: "KEEP YOUR CHIN UP" },
  { id: "f111", category: "PHRASE", answer: "KILL TWO BIRDS WITH ONE STONE" },
  { id: "f112", category: "PHRASE", answer: "KNOW THE ROPES" },
  { id: "f113", category: "PHRASE", answer: "LAST BUT NOT LEAST" },
  { id: "f114", category: "PHRASE", answer: "LET THE CAT OUT OF THE BAG" },
  { id: "f115", category: "PHRASE", answer: "LIKE TWO PEAS IN A POD" },
  { id: "f116", category: "PHRASE", answer: "MAKE A LONG STORY SHORT" },
  { id: "f117", category: "PHRASE", answer: "MISS THE BOAT" },
  { id: "f118", category: "PHRASE", answer: "NO PAIN NO GAIN" },
  { id: "f119", category: "PHRASE", answer: "ON CLOUD NINE" },
  { id: "f120", category: "PHRASE", answer: "ON THE TIP OF YOUR TONGUE" },
  { id: "f121", category: "PHRASE", answer: "OUT OF THE BLUE" },
  { id: "f122", category: "PHRASE", answer: "OUT OF THIS WORLD" },
  { id: "f123", category: "PHRASE", answer: "PLAY IT BY EAR" },
  { id: "f124", category: "PHRASE", answer: "PULL SOMEONES LEG" },
  { id: "f125", category: "PHRASE", answer: "PUT ALL YOUR EGGS IN ONE BASKET" },
  { id: "f126", category: "PHRASE", answer: "RAINING CATS AND DOGS" },
  { id: "f127", category: "PHRASE", answer: "READ BETWEEN THE LINES" },
  { id: "f128", category: "PHRASE", answer: "RING A BELL" },
  { id: "f129", category: "PHRASE", answer: "ROME WAS NOT BUILT IN A DAY" },
  { id: "f130", category: "PHRASE", answer: "SEE EYE TO EYE" },
  { id: "f131", category: "PHRASE", answer: "SIT ON THE FENCE" },
  { id: "f132", category: "PHRASE", answer: "SKELETON IN THE CLOSET" },
  { id: "f133", category: "PHRASE", answer: "SLEEP LIKE A LOG" },
  { id: "f134", category: "PHRASE", answer: "SLOW AND STEADY WINS THE RACE" },
  { id: "f135", category: "PHRASE", answer: "SPEAK OF THE DEVIL" },
  { id: "f136", category: "PHRASE", answer: "STEAL SOMEONES THUNDER" },
  { id: "f137", category: "PHRASE", answer: "STRAIGHT FROM THE HORSES MOUTH" },
  { id: "f138", category: "PHRASE", answer: "TAKE IT WITH A GRAIN OF SALT" },
  { id: "f139", category: "PHRASE", answer: "THE BALL IS IN YOUR COURT" },
  { id: "f140", category: "PHRASE", answer: "THE BEST OF BOTH WORLDS" },
  { id: "f141", category: "PHRASE", answer: "THE EARLY BIRD GETS THE WORM" },
  { id: "f142", category: "PHRASE", answer: "THROUGH THICK AND THIN" },
  { id: "f143", category: "PHRASE", answer: "TIME FLIES WHEN YOU ARE HAVING FUN" },
  { id: "f144", category: "PHRASE", answer: "TURN OVER A NEW LEAF" },
  { id: "f145", category: "PHRASE", answer: "TWO HEADS ARE BETTER THAN ONE" },
  { id: "f146", category: "THING", answer: "WATER BOTTLE" },
  { id: "f147", category: "THING", answer: "PENCIL CASE" },
  { id: "f148", category: "THING", answer: "SOCCER BALL" },
  { id: "f149", category: "THING", answer: "ALARM CLOCK" },
  { id: "f150", category: "THING", answer: "PICTURE FRAME" },
  { id: "f151", category: "THING", answer: "MUSIC BOX" },
  { id: "f152", category: "THING", answer: "TEDDY BEAR" },
  { id: "f153", category: "THING", answer: "SKATEBOARD" },
  { id: "f154", category: "THING", answer: "GARDEN HOSE" },
  { id: "f155", category: "THING", answer: "MAGNIFYING GLASS" },
  { id: "f156", category: "FOOD", answer: "PANCAKES AND SYRUP" },
  { id: "f157", category: "FOOD", answer: "CHICKEN NOODLE SOUP" },
  { id: "f158", category: "FOOD", answer: "FRENCH TOAST" },
  { id: "f159", category: "FOOD", answer: "ICE CREAM SUNDAE" },
  { id: "f160", category: "FOOD", answer: "CORN ON THE COB" },
  { id: "f161", category: "FOOD", answer: "BLUEBERRY MUFFIN" },
  { id: "f162", category: "FOOD", answer: "CHEESE PIZZA" },
  { id: "f163", category: "FOOD", answer: "CHOCOLATE CHIP COOKIE" },
  { id: "f164", category: "PLACE", answer: "SWIMMING POOL" },
  { id: "f165", category: "PLACE", answer: "POST OFFICE" },
  { id: "f166", category: "PLACE", answer: "SCIENCE MUSEUM" },
  { id: "f167", category: "PLACE", answer: "BASEBALL FIELD" },
  { id: "f168", category: "PLACE", answer: "CORNER STORE" },
  { id: "f169", category: "PLACE", answer: "CITY PARK" },
  { id: "f170", category: "PERSON", answer: "BUS DRIVER" },
  { id: "f171", category: "PERSON", answer: "MAIL CARRIER" },
  { id: "f172", category: "PERSON", answer: "LITTLE SISTER" },
  { id: "f173", category: "PERSON", answer: "GRANDPARENT" },
  { id: "f174", category: "PERSON", answer: "SOCCER COACH" },
  { id: "f175", category: "EVENT", answer: "SCHOOL PLAY" },
  { id: "f176", category: "EVENT", answer: "SCIENCE FAIR" },
  { id: "f177", category: "EVENT", answer: "HOLIDAY PARADE" },
  { id: "f178", category: "EVENT", answer: "BLOCK PARTY" },
  { id: "f179", category: "EVENT", answer: "TALENT SHOW" },
  { id: "f180", category: "AROUND THE HOUSE", answer: "DOOR KNOB" },
  { id: "f181", category: "AROUND THE HOUSE", answer: "CEILING FAN" },
  { id: "f182", category: "AROUND THE HOUSE", answer: "COFFEE TABLE" },
  { id: "f183", category: "AROUND THE HOUSE", answer: "BOOK SHELF" },
  { id: "f184", category: "AROUND THE HOUSE", answer: "NIGHT LIGHT" },
  { id: "f185", category: "ON THE MAP", answer: "ROCKY MOUNTAINS" },
  { id: "f186", category: "ON THE MAP", answer: "MISSISSIPPI RIVER" },
  { id: "f187", category: "ON THE MAP", answer: "NIAGARA FALLS" },
  { id: "f188", category: "ON THE MAP", answer: "ATLANTIC OCEAN" },
  { id: "f189", category: "FUN AND GAMES", answer: "TAG YOU ARE IT" },
  { id: "f190", category: "FUN AND GAMES", answer: "RED LIGHT GREEN LIGHT" },
  { id: "f191", category: "FUN AND GAMES", answer: "DUCK DUCK GOOSE" },
  { id: "f192", category: "FUN AND GAMES", answer: "MUSICAL CHAIRS" },
  { id: "f193", category: "WHAT ARE YOU DOING", answer: "FLYING A KITE" },
  { id: "f194", category: "WHAT ARE YOU DOING", answer: "BUILDING A FORT" },
  { id: "f195", category: "WHAT ARE YOU DOING", answer: "WASHING THE DISHES" },
  { id: "f196", category: "WHAT ARE YOU DOING", answer: "RIDING A BIKE" },
  { id: "f197", category: "IN THE GARDEN", answer: "PUMPKIN PATCH" },
  { id: "f198", category: "IN THE GARDEN", answer: "ROSE BUSH" },
  { id: "f199", category: "TITLE", answer: "JACK AND THE BEANSTALK" },
  { id: "f200", category: "TITLE", answer: "LITTLE RED RIDING HOOD" },
];

export function normalizeAnswer(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/[^A-Z ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeGuess(raw: string): string {
  return normalizeAnswer(raw);
}

export function buildDisplay(answer: string, revealed: Set<string>): {
  display: string[];
  spaceIndices: number[];
} {
  const chars = [...answer];
  const spaceIndices: number[] = [];
  const display = chars.map((ch, i) => {
    if (ch === " ") {
      spaceIndices.push(i);
      return " ";
    }
    return revealed.has(ch) ? ch : "";
  });
  return { display, spaceIndices };
}

export function toPublicPuzzle(
  puzzle: WheelPuzzle,
  revealed: Set<string>,
): WheelPuzzlePublic {
  const { display, spaceIndices } = buildDisplay(puzzle.answer, revealed);
  return {
    category: puzzle.category,
    display,
    spaceIndices,
  };
}

export function countLetterInAnswer(answer: string, letter: string): number {
  const L = letter.toUpperCase();
  let n = 0;
  for (const ch of answer) {
    if (ch === L) n += 1;
  }
  return n;
}

export function isFullyRevealed(answer: string, revealed: Set<string>): boolean {
  for (const ch of answer) {
    if (ch === " ") continue;
    if (!revealed.has(ch)) return false;
  }
  return true;
}

export function pickPuzzle(usedIds: string[]): WheelPuzzle {
  const pool = FAMILY_PUZZLES.filter((p) => !usedIds.includes(p.id));
  const source = pool.length > 0 ? pool : FAMILY_PUZZLES;
  return source[Math.floor(Math.random() * source.length)]!;
}
