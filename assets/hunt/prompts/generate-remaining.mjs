#!/usr/bin/env node
/**
 * One-shot author for the remaining Picture Hunt scene foundations (50 total).
 * Writes assets/hunt/prompts/scenes/*.md, worker/scattergories/hunt/data/*.json,
 * and regenerates worker/scattergories/hunt/scenes.ts imports.
 */
import { writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const repo = join(root, "../../..");
const scenesDir = join(root, "scenes");
const dataDir = join(repo, "worker/scattergories/hunt/data");

/** @type {{ id: string, title: string, tags: string[], foundation: string, weave: string, avoid: string }[]} */
const SCENES = [
  {
    id: "underwater-reef-party",
    title: "Underwater Reef Party",
    tags: ["underwater", "reef", "party"],
    foundation:
      "A cheerful **coral reef party** just below the surface: soft shafts of sunlight, colorful coral towers, a sandy dance floor of shells, bubble clusters rising past a sunken gazebo made of driftwood and kelp ribbons. Friendly fish and merfolk guests mingle; a distant shipwreck silhouette frames the background. Foreground tide-garden clutter; midground coral archways; background blue open water.",
    weave:
      "Reef-true props only: pearl clams, treasure chests ajar, starfish lanterns, kelp balloons, seashell trumpets, bubble pipes, coral cups, oyster platters, seahorse rocking toys, sand-dollar coasters, jellyfish lanterns (gentle), message bottles (blank seals), diving masks half-buried, friendly octopus holding trays, anemone flower bouquets, polished stones in bowls, net hammocks, barnacle stools.",
    avoid: "Land vehicles, castles, spaceports, classrooms. No readable writing on bottles or wrecks.",
  },
  {
    id: "pirate-cove",
    title: "Pirate Cove Hideout",
    tags: ["pirate", "cove", "ships"],
    foundation:
      "A bustling **pirate cove hideout** at golden hour: wooden docks, a beached galleon being patched, rope bridges between cliff caves, barrels stacked on sand, a campfire feast, and a turquoise lagoon. Layout: cliffs and cave mouths at back, docks midground, treasure-sorting tables and hammocks in the foreground.",
    weave:
      "Pirate-lore clutter: spyglasses, maps with blank seas, compasses, coiled ropes, cutlasses in scabbards (comic), parrot perches, rum bottles (corked, unlabeled), cannonballs in nets, lanterns, bandanas on pegs, gold coins in chests, hooks and peg-legs as props (playful), fishing nets, crates of fruit, ship wheels, flags with abstract shapes only, message bottles, wooden pegs, barrels of apples.",
    avoid: "Modern beach umbrellas, robots, medieval castles, neon cities. No letters on flags or maps.",
  },
  {
    id: "jungle-temple",
    title: "Jungle Temple Expedition",
    tags: ["jungle", "temple", "adventure"],
    foundation:
      "A mossy **jungle temple courtyard** mid-expedition: vine-wrapped stone stairs, carved animal statues (friendly), broken columns, a central reflecting pool, and dense canopy light. Explorers and local guides unpack gear. Foreground vine tangles and pack piles; midground plaza; background temple facade with abstract glyphs (not readable letters).",
    weave:
      "Jungle-expedition props: pith helmets, sketchbooks (blank pages), cameras, rope coils, lanterns, butterfly nets, orchids in pots, monkey friends with stolen hats, stone jaguar statues, mosaic tiles, canteens, machete sheaths, backpacks spilling binoculars, insect jars (friendly bugs), fern fronds, treasure idols (abstract), mossy pottery, hanging bridges of vine.",
    avoid: "Beaches, spaceports, snow, classrooms. No readable glyphs or alphabet carvings.",
  },
  {
    id: "winter-market",
    title: "Snowy Winter Market",
    tags: ["winter", "market", "holiday"],
    foundation:
      "A cozy **snowy winter night market** in a timbered town square: string lights (no lettered signs), wooden stalls with warm glow, a skating rink corner, steaming cocoa carts, and snow-dusted rooftops. Families in scarves stroll. Foreground stall counters; midground square; background church spire silhouette without clock numbers.",
    weave:
      "Winter-market only: mittens on strings, wool hats, ice skates, candy canes, gingerbread houses, pine wreaths, hot cocoa mugs, snow globes, wooden toys, sleigh bells, scarves, lantern poles, roasted chestnut pans, ice sculptures (animals), knitted socks, tin cookie cutters, sleds, snowmen with carrot noses, gift boxes with blank ribbons.",
    avoid: "Tropical plants, deserts, space gear, beaches. No readable stall signs or price tags.",
  },
  {
    id: "candy-kitchen",
    title: "Candy Kitchen Chaos",
    tags: ["candy", "kitchen", "sweets"],
    foundation:
      "A whimsical oversized **candy kitchen** in full production: copper pots of melted chocolate, marble counters dusted with sugar, conveyor belts of cookies, towering jars, and pastel tiled walls. Chefs and kids helpers swirl frosting. Foreground mixing stations; midground ovens and cooling racks; background giant candy molds.",
    weave:
      "Candy-kitchen props: whisks, rolling pins, cookie cutters, frosting bags, lollipops, gumdrop mountains, chocolate bars (no logos), sprinkles bowls, candy thermometers, apron strings, measuring cups, marshmallow piles, caramel drips, cupcake towers, candy-striped spoons, jelly molds, sugar crystals, cherry toppers, butter sticks.",
    avoid: "Outdoor landscapes, pirates, spaceships. No brand logos or letters on wrappers.",
  },
  {
    id: "circus-big-top",
    title: "Circus Big Top",
    tags: ["circus", "carnival", "tent"],
    foundation:
      "Inside a cheerful **circus big top** during intermission: red-and-cream striped canvas, sawdust ring, trapeze bars overhead, bleachers packed with families, side stalls of popcorn and balloons. Performers warm up. Foreground ring clutter; midground center ring; background tent peaks and banners with abstract shapes only.",
    weave:
      "Circus-true clutter: unicycles, juggling clubs, hoop stacks, clown shoes, stilts, popcorn boxes (blank), cotton candy sticks, ticket stubs (blank), drum kits, trumpet cases, lion plushies (friendly), balance balls, ribbon wands, makeup kits, sequined jackets on hooks, peanut bags, spotlights, trampolines, magic hats with rabbits.",
    avoid: "Scary animals, gore, beaches, spaceports. No readable posters or ticket text.",
  },
  {
    id: "dinosaur-museum",
    title: "Dinosaur Museum Hall",
    tags: ["museum", "dinosaurs", "science"],
    foundation:
      "A grand **natural history museum dinosaur hall**: towering skeleton mounts, glass cases, a fossil dig pit for kids, skylights, and a gift-shop corner without lettered signs. Families point and sketch. Foreground dig tools and benches; midground T-rex and long-neck mounts; background mural of prehistoric landscape (no labels).",
    weave:
      "Museum-native props: magnifying glasses, fossil brushes, bone fragments in trays, ammonite fossils, sketch pads (blank), backpacks, audio wands (blank screens), model volcanoes, amber chunks, dinosaur plush, hard hats in the dig pit, specimen jars, measuring tapes, rock hammers, field notebooks (blank), binoculars, museum badges (blank).",
    avoid: "Pirates, candy factories, castles. No readable placards or Latin names.",
  },
  {
    id: "train-station",
    title: "Grand Train Station Rush",
    tags: ["train", "station", "travel"],
    foundation:
      "A bustling vintage **grand train station** at departure time: soaring arched glass roof, steam locomotives at platforms, luggage carts, newsstands with blank papers, and a central clock face without numerals. Travelers hurry. Foreground luggage piles; midground platforms; background departing trains and ironwork.",
    weave:
      "Station-true clutter: steamer trunks, leather suitcases, hat boxes, porter carts, pocket watches, umbrellas, sandwich baskets, tea flasks, conductor caps, brass lanterns, ticket punches, railway lamps, satchels, steam whistles, picnic hampers, folded coats, toy trains on benches, floral corsages, binoculars.",
    avoid: "Airports with jets, beaches, jungles. No readable destination boards or numerals on clocks.",
  },
  {
    id: "farm-harvest",
    title: "Farm Harvest Festival",
    tags: ["farm", "harvest", "autumn"],
    foundation:
      "A sunny **farm harvest festival** in a barnyard: red barn, hay wagons, pumpkin patches, apple crates, a cider press, and fields stretching back. Families and farm animals mingle. Foreground produce stalls; midground barn yard; background orchard and hills.",
    weave:
      "Farm-harvest only: pumpkins, corn stalks, apple baskets, pie tins, scarecrows, pitchforks, milk cans, chicken feeders, tractor toys, sunflower bouquets, jam jars (blank lids), checkered blankets, wagon wheels, scarecrow hats, eggs in baskets, goats with ribbons, cornucopias, cider mugs, bales of hay.",
    avoid: "Oceans, spaceports, city neon. No readable farm signs.",
  },
  {
    id: "wizard-library",
    title: "Wizard Library Tower",
    tags: ["wizard", "library", "magic"],
    foundation:
      "A towering **wizard library** with spiral stairs, floating candle clusters, overflowing shelves, stained glass (abstract), and a central reading table with crystal ball. Apprentices study cheerfully — cozy magic, not dark. Foreground cluttered desks; midground stacks and ladders; background dome ceiling.",
    weave:
      "Wizard-library props: blank-spined tomes, scrolls with blank seals, quills, ink pots, crystal orbs, potion bottles, star charts (no glyphs), owl familiars, pointed hats, wand racks, hourglasses, celestial globes, reading glasses, bookmark ribbons, ladder wheels, tea cups, rune stones (abstract shapes only), spell component jars.",
    avoid: "Modern tech, beaches, farm tools. No readable spells or alphabet runes.",
  },
  {
    id: "toy-workshop",
    title: "Toy Workshop Midnight",
    tags: ["toys", "workshop", "craft"],
    foundation:
      "A magical **toy workshop** at night: wooden benches, paint pots, half-built toys, conveyor of finished gifts, a fireplace, and tall windows with snow outside. Friendly craftspeople and helper elves bustle. Foreground workbenches; midground assembly floor; background shelves of toys.",
    weave:
      "Workshop-true clutter: wooden trains, dolls, jack-in-boxes, paintbrushes, glue pots, saws (safe/comic), spare wheels, ribbon spools, wrapping paper rolls (blank patterns), nutcrackers, music boxes, teddy bears, tin soldiers, yo-yos, building blocks, work aprons, measuring sticks (no numbers), toolbox trays.",
    avoid: "Scary toys, beaches, spaceports. No brand logos or lettered tags.",
  },
  {
    id: "alpine-lodge",
    title: "Alpine Ski Lodge",
    tags: ["alpine", "ski", "lodge"],
    foundation:
      "A warm **alpine ski lodge** after a day on the slopes: timber beams, stone fireplace, boot racks, frosted windows showing peaks, and a communal table of cocoa. Skiers peel off layers. Foreground boot chaos; midground lounge; background mountain view through glass.",
    weave:
      "Lodge-true props: skis and poles, snowboards, goggles, mittens, wool socks steaming, cocoa mugs, trail maps (blank), ice axes, backpacks, beanie piles, snowboard wax tins, lodge blankets, snowshoes, hot soup bowls, pine cones, avalanche probes (comic), ski boots, firewood stacks.",
    avoid: "Beaches, deserts, tropical plants. No readable trail signs or numbers.",
  },
  {
    id: "desert-oasis",
    title: "Desert Oasis Caravan",
    tags: ["desert", "oasis", "caravan"],
    foundation:
      "A luminous **desert oasis caravan stop** at dusk: palm grove, turquoise pool, colorful tents, camel resting circles, and sand dunes glowing pink. Merchants unpack. Foreground carpet stalls; midground oasis water; background dune silhouettes and crescent moon.",
    weave:
      "Oasis-caravan props: brass lamps, tea sets, spice jars (blank), carpets, cushions, water jugs, camel saddlebags, dates in bowls, falcon perches, scimitars in ornate sheaths (decorative), drums, scarves, lantern poles, pottery, compasses, star-gazing tubes, fruit platters, sand toys for kids.",
    avoid: "Snow, oceanships, neon cities. No readable Arabic/Latin text on banners.",
  },
  {
    id: "rainforest-canopy",
    title: "Rainforest Canopy Village",
    tags: ["rainforest", "canopy", "village"],
    foundation:
      "A **rainforest canopy village** of treehouses linked by rope bridges: misty green light, hanging gardens, zip lines, and a central platform market. Birds and playful monkeys visit. Foreground bridge clutter; midground main platform; background endless canopy.",
    weave:
      "Canopy-village props: woven baskets, vine swings, binoculars, orchid pots, rain ponchos, fruit nets, wooden flutes, hanging planters, rope ladders, seed pods, butterfly nets, hammocks, water catchers, carved masks (friendly abstract), insect loupes, bird feeders, moss gardens, lantern gourds.",
    avoid: "Deserts, ice, spaceports, beaches. No readable signs on bridges.",
  },
  {
    id: "carnival-midway",
    title: "Carnival Midway Night",
    tags: ["carnival", "midway", "night"],
    foundation:
      "A glowing **carnival midway at night**: ferris wheel silhouette, game booths with blank prize boards, cotton-candy haze, carousel horses, and families with tickets (blank). Foreground booth counters; midground walkway; background rides against a dark sky.",
    weave:
      "Midway-true clutter: stuffed animal prizes, ring-toss rings, milk bottles, popcorn tubs (blank), balloons, carnival tickets (blank), rubber ducks, baseballs, plastic goldfish bowls, candy apples, glow sticks, clown noses, funnel cake plates, prize claws, whistle charms, carnival masks.",
    avoid: "Scary haunted gore, beaches, museums. No readable booth titles or scores.",
  },
  {
    id: "submarine-lab",
    title: "Deep-Sea Submarine Lab",
    tags: ["submarine", "lab", "ocean"],
    foundation:
      "Inside a cheerful **deep-sea research submarine**: portholes showing glowing fish, instrument panels with abstract dials (no digits), specimen tanks, bunks, and a galley. Scientists in bright jumpsuits celebrate a find. Foreground lab benches; midground control chairs; background curved hull and portholes.",
    weave:
      "Sub-lab props: specimen jars, coral samples, pressure gauges (blank faces), dive helmets, clipboards (blank), thermos flasks, underwater cameras, glowing plankton tubes, tool wrenches, sonar headphones, snack pouches, bunk curtains, starfish magnets, logbooks (blank), bubble machines, rubber ducks as mascots.",
    avoid: "Surface beaches as main setting, castles, farms. No readable screens or numbers.",
  },
  {
    id: "attic-treasure",
    title: "Grandma Attic Treasure Hunt",
    tags: ["attic", "vintage", "treasure"],
    foundation:
      "A dusty-but-cozy **attic treasure hunt** on a rainy afternoon: slanted roof beams, dormer windows, trunks overflowing, mannequins in old clothes, and shafts of light through dust. Kids explore safely. Foreground open trunks; midground piles of memories; background dormer and rafters.",
    weave:
      "Attic-true clutter: steamer trunks, hat boxes, photo frames (faces only), vinyl records (blank labels), sewing machines, quilts, board games (blank boards), marionettes, old radios, lanterns, keys, perfume bottles, lace gloves, toy soldiers, postage stamp books (blank pages), mirrors, suitcases, forgotten sports gear.",
    avoid: "Outdoor landscapes as main scene, spaceports, gore. No readable letters on boxes.",
  },
  {
    id: "bakery-street",
    title: "Bakery Street Morning",
    tags: ["bakery", "street", "morning"],
    foundation:
      "A cobblestone **bakery street at morning rush**: open shopfronts with pastry displays, outdoor cafe tables, bicycle deliveries, and warm window light. Neighbors chat. Foreground cafe tables; midground bakery counters; background street curve and flower boxes.",
    weave:
      "Bakery-street props: croissants, baguettes, cake stands, flour sacks, rolling pins, aprons, coffee cups, jam jars (blank), bicycle baskets of bread, chalkboard menus (blank swirls only), pie tins, cookie trays, sugar shakers, napkin stacks, flower bouquets, delivery crates, whisks, butter dishes.",
    avoid: "Factories, beaches, jungles. No readable shop names or prices.",
  },
  {
    id: "music-festival",
    title: "Lakeside Music Festival",
    tags: ["music", "festival", "outdoors"],
    foundation:
      "A sunny **lakeside music festival**: main stage with abstract backdrop (no text), picnic blankets on grass, food trucks (blank sides), a Ferris-like art installation, and lake sparkle behind. Crowds dance. Foreground blanket picnics; midground stage; background lake and hills.",
    weave:
      "Festival-true clutter: guitars, drum kits, headphones, glow bracelets, picnic baskets, folding chairs, frisbees, water bottles, flower crowns, vinyl crates (blank), microphone stands, cable coils, stage lights, merch tents with blank banners, kites, coolers, sunglasses, tambourines.",
    avoid: "Indoor classrooms, castles, spaceports. No readable band names or setlists.",
  },
  {
    id: "zen-garden-festival",
    title: "Garden Festival Pavilion",
    tags: ["garden", "festival", "pavilion"],
    foundation:
      "A serene-yet-busy **garden festival pavilion**: koi ponds, stone lanterns, cherry blossoms or seasonal blooms, tea houses, and winding pebble paths packed with visitors admiring blooms. Foreground pond edge; midground tea pavilion; background hills and trees.",
    weave:
      "Garden-festival props: paper fans, tea cups, bonsai pots, lanterns, koi feed scoops, origami cranes, picnic bentos, straw hats, pruning shears, seed packets (blank), wind chimes, stepping stones, calligraphy brushes with blank scrolls, flower crowns, bamboo flutes, umbrella stands.",
    avoid: "Neon carnivals, deserts, winter snow as dominant. No readable kanji or letters.",
  },
  {
    id: "arctic-camp",
    title: "Arctic Research Camp",
    tags: ["arctic", "camp", "science"],
    foundation:
      "A bright **arctic research camp** on ice: colorful insulated tents, snowmobiles, a greenhouse dome, aurora hints in the sky, and friendly scientists with huskies. Foreground gear piles; midground tents; background ice ridges and polar light.",
    weave:
      "Arctic-camp props: ice cores in tubes, thermometers (blank), parkas, snow goggles, sleds, husky harnesses, sample crates, thermos flasks, maps (blank), satellite dishes (small), ice axes, mittens, aurora cameras, fish from ice holes, stove pots, flags with abstract colors only, hot soup bowls.",
    avoid: "Tropical scenes, beaches, jungles. No readable labels on crates.",
  },
  {
    id: "frontier-town",
    title: "Frontier Town Afternoon",
    tags: ["frontier", "western", "town"],
    foundation:
      "A friendly **frontier town main street** at afternoon: wooden boardwalks, hitching posts, a general store porch, water tower silhouette, and dust motes in sun. Horses rest; kids play. Foreground porch clutter; midground street; background mesa hills.",
    weave:
      "Frontier-true clutter: cowboy hats, lassos, saddles, tin cups, wagon wheels, lanterns, wanted posters (blank faces only — no text), horseshoes, banjos, checkered cloths, barrels, spurs, canteens, rocking chairs, feed bags, sheriff stars (blank), candy jars in the store window.",
    avoid: "Gunfights/gore, modern cars, beaches. No readable shop signs or wanted text.",
  },
  {
    id: "agora-market",
    title: "Ancient Agora Market",
    tags: ["agora", "ancient", "market"],
    foundation:
      "A lively **ancient agora marketplace**: marble columns, olive trees, pottery stalls, a fountain, philosophers debating cheerfully, and acropolis silhouette beyond. Foreground stall rugs; midground colonnade; background temples with abstract pediment sculpture.",
    weave:
      "Agora-true props: amphorae, olive oil jugs, scrolls (blank), lyres, laurel wreaths, mosaic tiles, figs and grapes, clay lamps, statues (friendly), sandals stacked, dye pots, bronze mirrors, theater masks, fishing nets from the harbor, spice bowls, coins in bowls, marble chips.",
    avoid: "Modern tech, pirates with cannons, snow. No readable Greek letters.",
  },
  {
    id: "viking-longhouse",
    title: "Viking Longhouse Feast",
    tags: ["viking", "longhouse", "feast"],
    foundation:
      "A warm **viking longhouse feast**: long tables, shield walls with abstract patterns, a central hearth, carved wooden pillars, and night visible through the open doors. Families share stew. Foreground table clutter; midground hearth; background bunk platforms and hanging gear.",
    weave:
      "Longhouse props: drinking horns, wooden bowls, axes on racks (decorative), shields, wool cloaks, rune stones (abstract only), looms, dried fish racks, mead barrels, carving knives, fur pelts, bone combs, storyteller drums, ships models, herb bundles, iron pots, bench cushions.",
    avoid: "Raiding violence, beaches with umbrellas, spaceports. No readable runes-as-alphabet.",
  },
  {
    id: "treehouse-village",
    title: "Treehouse Village Day",
    tags: ["treehouse", "kids", "forest"],
    foundation:
      "A whimsical **treehouse village** among oak limbs: multiple cabins, rope bridges, a slide to a creek, tire swings, and kids running errands with baskets. Foreground ladder and porch; midground bridges; background canopy and birdhouses.",
    weave:
      "Treehouse props: rope ladders, tin-can phones, birdhouses, picnic baskets, comic books (blank covers), telescope, pillow forts, painted rocks, bug jars, flashlights, hammocks, pulley buckets, wooden swords (play), flower pots, chalkboards with doodles only (no letters), lanterns, snack crates.",
    avoid: "Adult offices, spaceports, horror. No readable writing on chalkboards.",
  },
  {
    id: "robot-factory",
    title: "Friendly Robot Factory",
    tags: ["robots", "factory", "futuristic"],
    foundation:
      "A bright **friendly robot factory** assembly floor: conveyor belts of cute robots, tool arms, glowing energy cores (soft), observation catwalks, and engineers in colorful overalls. Foreground parts bins; midground assembly line; background giant robot chassis being painted.",
    weave:
      "Factory-true clutter: wrenches, circuit boards (abstract), spare antennae, oil cans, welding masks, paint sprayers, gear piles, battery packs, blueprint rolls (blank diagrams), lunchboxes, safety goggles, robot pets, magnet trays, conveyor crates, stickers (abstract shapes), tool belts.",
    avoid: "Scary war machines, beaches, castles. No readable warning labels or digits.",
  },
  {
    id: "flower-market",
    title: "City Flower Market",
    tags: ["flowers", "market", "city"],
    foundation:
      "A packed **city flower market** under canvas awnings: buckets of blooms, bicycle deliveries, cafe corner, cobbles wet from misting, and soft morning light. Florists arrange. Foreground flower buckets; midground aisles; background city facades without shop lettering.",
    weave:
      "Flower-market props: shears, ribbon spools, watering cans, terracotta pots, seed packets (blank), wreath frames, bicycles with baskets, aprons, coffee cups, moss trays, bouquet paper (blank patterns), bees (friendly), butterfly visitors, wooden crates, chalk price boards with swirls only.",
    avoid: "Deserts, arctic, factories. No readable prices or shop names.",
  },
  {
    id: "lighthouse-keepers",
    title: "Lighthouse Keepers Day",
    tags: ["lighthouse", "coast", "keepers"],
    foundation:
      "A windy **lighthouse and keeper cottage** on a rocky point: spiral stairs visible through doorway, lantern room glowing, gulls, tide pools, and a supply boat at a tiny dock. Keepers tidy gear. Foreground cottage porch; midground lighthouse base; background sea and cliffs.",
    weave:
      "Lighthouse props: oil cans, spare lenses, rope coils, life rings, spyglasses, weather vanes, raincoats, boots, tide charts (blank), lanterns, signal flags (abstract colors), seagulls, shell collections, fishing rods, kettle on stove, logbooks (blank), life vests, foghorns.",
    avoid: "Inland farms, spaceports, jungles. No readable charts or numbers.",
  },
  {
    id: "camping-glade",
    title: "Forest Camping Glade",
    tags: ["camping", "forest", "outdoors"],
    foundation:
      "A sunny **forest camping glade**: colorful tents, a stone fire ring, clothesline, creek nearby, and tall pines. Families cook and explore. Foreground picnic table; midground tents; background trail into woods.",
    weave:
      "Camping-true clutter: sleeping bags, lanterns, coolers, hiking boots, backpacks, marshmallow sticks, compasses, binoculars, insect jars, canteens, camp stoves, folding chairs, trail mix bowls, fishing poles, maps (blank), first-aid kits (blank), guitars, pinecones, wildflower bunches.",
    avoid: "Cities, oceanships as main, castles. No readable trail markers.",
  },
  {
    id: "lantern-parade",
    title: "Lantern Parade Street",
    tags: ["lantern", "parade", "night"],
    foundation:
      "A festive **night lantern parade** down a decorated street: glowing paper lanterns of animals and shapes, balconies with spectators, food stalls, and a moonlit sky. Families carry lantern poles. Foreground parade float details; midground street; background rooftops and lantern strings.",
    weave:
      "Parade-true props: paper lanterns, poles, masks, drums, fans, snack skewers, confetti, ribbons, fireworks tubes (unlit/comic), tea cups, flower garlands, costume pieces, lion-dance heads (friendly), incense (mild smoke), gift envelopes (blank seals), toy drums, glowing balloons.",
    avoid: "Scary fireworks disasters, beaches, spaceports. No readable banners.",
  },
  {
    id: "balloon-fiesta",
    title: "Hot Air Balloon Fiesta",
    tags: ["balloons", "fiesta", "sky"],
    foundation:
      "A dawn **hot air balloon fiesta** in a wide meadow: dozens of inflated balloons in playful patterns (no logos), baskets, chase vans, and mountains beyond. Crews hold ropes. Foreground basket prep; midground balloon field; background pastel sky and peaks.",
    weave:
      "Fiesta props: woven baskets, propane tanks (comic/safe), rope coils, sandbags, pilot maps (blank), thermos flasks, checkered flags (no text), picnic blankets, cameras, wind socks, tool kits, spare fabric patches, breakfast pastries, binoculars, folding chairs, radio headsets (blank).",
    avoid: "Indoor scenes, underwater, castles. No readable balloon logos or race numbers.",
  },
  {
    id: "ice-cream-parlor",
    title: "Ice Cream Parlor Rush",
    tags: ["ice-cream", "parlor", "sweets"],
    foundation:
      "A pastel **ice cream parlor** at peak rush: soda fountain, glass display cases, checkerboard floor, spinning stools, and a patio through open doors. Scoopers work fast. Foreground counter mess; midground seating; background shelves of toppings.",
    weave:
      "Parlor props: waffle cones, scoops, sprinkles jars, cherry bowls, milkshake glasses, straws, napkins, banana boats, syrup pumps, whipped cream cans, ice cream tubs (blank), spoons, kid bibs, neon-shaped decor (no letters), jukebox (blank face), patio umbrellas, tip jars (blank).",
    avoid: "Outdoor wilderness as main, factories, horror. No brand logos or menu text.",
  },
  {
    id: "firehouse",
    title: "Busy Firehouse Day",
    tags: ["firehouse", "heroes", "community"],
    foundation:
      "A cheerful **community firehouse** open house: shiny engine in the bay, hose towers, dalmatians, kids touring, and a backyard barbecue. Firefighters wave. Foreground engine details; midground bay; background hose drying tower and flagpole with abstract flag.",
    weave:
      "Firehouse props: helmets, boots, hoses, axes (safe display), oxygen packs, dalmatian toys, station bells, checkered picnic, water buckets, spare badges (blank), radio handsets, polishing cloths, trophy cases (blank plaques), firefighter coats on hooks, hydrant toys, lemonade stands.",
    avoid: "Active burning buildings/gore, beaches, space. No readable station numbers or signs.",
  },
  {
    id: "safari-park",
    title: "Safari Park Overlook",
    tags: ["safari", "park", "animals"],
    foundation:
      "A family **safari park overlook**: open jeep boardwalk, watering hole with friendly animals, acacia trees, and soft golden light. Rangers chat with visitors. Foreground viewing rail clutter; midground watering hole; background savanna hills.",
    weave:
      "Safari props: binoculars, field guides (blank covers), cameras, safari hats, water bottles, jeep spare tires, radio packs, animal track casts, sketch pads, picnic coolers, rangefinder toys, ranger badges (blank), seed pods, butterfly nets, soft toy animals, maps (blank).",
    avoid: "Hunting violence, zoos with cages as prison vibes, oceans. No readable park signs.",
  },
  {
    id: "medieval-market",
    title: "Medieval Market Square",
    tags: ["medieval", "market", "square"],
    foundation:
      "A bustling **medieval market square**: timber stalls, a fountain, jugglers, a keep wall in the background, banners with abstract crests only. Merchants haggle cheerfully. Foreground stall goods; midground fountain plaza; background castle wall and towers.",
    weave:
      "Medieval-market props: bread loaves, cheese wheels, pottery, fabric bolts, wooden toys, candlesticks, herbs hanging, coin purses, lute cases, leather satchels, armor bits for sale (comic), apple crates, quills, blank parchment, chicken cages (friendly), flower garlands, barrels.",
    avoid: "Modern tech, beaches, spaceports. No readable guild signs or letters.",
  },
  {
    id: "coral-harbor",
    title: "Coral Harbor Market",
    tags: ["harbor", "coral", "boats"],
    foundation:
      "A sunny **coral harbor market** where colorful fishing boats dock beside a seaside square: fish stalls, net menders, a lighthouse distant, clear water showing reef shallows. Foreground dock clutter; midground boats; background town and cliffs.",
    weave:
      "Harbor props: fishing nets, buoys, lobster traps, fish crates, ropes, oars, boat hooks, shell jewelry, seaweed baskets, life rings, tide clocks (blank faces), seagulls, ice chests, float toys, sail patches, brass bells, picnic benches, lighthouse souvenirs (blank).",
    avoid: "Inland deserts, spaceports, alpine snow. No readable boat names.",
  },
  {
    id: "science-fair",
    title: "School Science Fair",
    tags: ["science", "fair", "school"],
    foundation:
      "A lively **school gym science fair**: folding tables with volcanoes and robots, hanging banners with abstract shapes only, parents and kids crowding aisles, skylights. Foreground table projects; midground aisles; background bleachers and basketball hoops.",
    weave:
      "Science-fair props: baking-soda volcanoes, circuit boards, plant jars, model rockets, magnets, microscopes, poster boards with doodle diagrams only (no letters), ribbons (blank), beakers, batteries, wire coils, robot arms, solar-system mobiles, clipboards (blank), trophy cups.",
    avoid: "Outdoor wilderness as main, castles, beaches. No readable project titles.",
  },
  {
    id: "pizza-kitchen",
    title: "Pizza Kitchen Frenzy",
    tags: ["pizza", "kitchen", "food"],
    foundation:
      "A roaring **open pizza kitchen** and dining room: wood-fired oven glow, flour-dusted counters, hanging pans, checkered tables, and a line of hungry families. Chefs spin dough. Foreground prep station; midground oven and pass; background dining booths.",
    weave:
      "Pizza-kitchen props: dough balls, rolling pins, sauce ladles, cheese mountains, toppings bowls, pizza peels, oven mitts, spice shakers, pizza cutters, checkered napkins, soda bottles (blank), garlic knots, oregano plants, delivery boxes (blank), tip jars, wall clocks without numbers.",
    avoid: "Outdoor landscapes as main, spaceports, horror. No brand logos or menu text.",
  },
  {
    id: "bookshop-maze",
    title: "Bookshop Maze",
    tags: ["bookshop", "books", "cozy"],
    foundation:
      "A cozy labyrinthine **independent bookshop**: floor-to-ceiling shelves, rolling ladders, reading nooks with lamps, a cafe corner, cats on stacks, and skylight dust motes. Readers browse. Foreground stacked new arrivals; midground aisles; background loft and spiral stair.",
    weave:
      "Bookshop props: blank-spined books, bookmarks, reading glasses, tea cups, library carts, typewriters, stamp pads, postcards (blank), string lights, cushions, ladders, magnifiers, ink bottles, paperweights, tote bags (blank), plant pots, sleepy cats, vinyl quietly playing (blank sleeve).",
    avoid: "Outdoor sports, factories, beaches. No readable titles on spines.",
  },
  {
    id: "airship-dock",
    title: "Cloud Airship Dock",
    tags: ["airship", "clouds", "steampunk"],
    foundation:
      "A whimsical **cloud-level airship dock**: wooden piers floating among clouds, brass dirigibles moored, ticket gazebos with blank boards, and sky bridges. Travelers in goggles embark. Foreground dock crates; midground airships; background endless cloudscape and distant peaks.",
    weave:
      "Airship-dock props: brass goggles, propeller parts, rope coils, sandbags, steam valves, map tubes (blank), tea sets, compasses, luggage trunks, boarding tickets (blank), spyglasses, wrench sets, balloon animals, cloud-cotton candy, signal flags (abstract), brass lanterns, picnic hampers.",
    avoid: "Underwater, deserts at ground level as main, horror. No readable destination boards.",
  },
  {
    id: "puppet-theater",
    title: "Puppet Theater Backstage",
    tags: ["puppet", "theater", "backstage"],
    foundation:
      "A colorful **puppet theater backstage** before curtain: hanging marionettes, costume racks, prop tables, a peek of the stage with footlights, and excited kids peeking. Puppeteers prep. Foreground prop chaos; midground stage wing; background painted backdrop (abstract scenery).",
    weave:
      "Theater props: marionettes, hand puppets, masks, costume hats, stage lights, scripts with blank pages, makeup kits, curtain ropes, wooden swords, cardboard castles, glitter jars, ticket stubs (blank), music boxes, feather boas, paint brushes, spare strings, applause signs with swirls only.",
    avoid: "Scary horror puppets, outdoor sports, spaceports. No readable playbills.",
  },
  {
    id: "vineyard-harvest",
    title: "Vineyard Harvest Picnic",
    tags: ["vineyard", "harvest", "picnic"],
    foundation:
      "A golden **vineyard harvest picnic**: rows of vines, grape crates, a long picnic table under shade sails, stone farmhouse, and hills beyond. Families stomp grapes playfully. Foreground picnic spread; midground vines; background farmhouse and sky.",
    weave:
      "Vineyard props: grape baskets, corkscrews, wine glasses (juice for kids), straw hats, pruning shears, wooden presses, checkered cloths, cheese boards, bread loaves, barrels, cork piles, lanterns, bikes with baskets, sunflowers, jam jars (blank), picnic baskets, stomping tubs.",
    avoid: "Drunk chaos, beaches, arctic. No readable estate signs.",
  },
  {
    id: "skate-park",
    title: "Neighborhood Skate Park",
    tags: ["skate", "park", "city"],
    foundation:
      "A lively **neighborhood skate park** at golden hour: concrete bowls, ramps, grind rails, murals with abstract shapes only, picnic tables, and city trees beyond. Skaters of all ages. Foreground bench gear; midground bowls; background fence and skyline soft.",
    weave:
      "Skate-park props: skateboards, helmets, knee pads, sneakers piles, water bottles, stickers (abstract), boomboxes, backpacks, graffiti art (shapes only), spare wheels, tools, energy snacks, cameras, benches with stickers, cones, chalk drawings (no letters), frisbees.",
    avoid: "Injuries/gore, beaches, castles. No readable brand logos on boards.",
  },
  {
    id: "yard-sale",
    title: "Block Yard Sale Morning",
    tags: ["yard-sale", "neighborhood", "morning"],
    foundation:
      "A sunny **block-wide yard sale**: driveways full of tables, clothes racks, lemonade stands, bikes for sale, neighbors chatting across lawns. Foreground folding-table clutter; midground street of sales; background suburban houses and trees.",
    weave:
      "Yard-sale props: lampshades, board games (blank), toys, teacups, vinyl (blank), tools, picture frames, sweaters on hangers, bikes, skateboards, plant pots, puzzles (blank boxes), sports gear, books (blank spines), jewelry boxes, lemonade pitchers, price tags with swirls only.",
    avoid: "Junkyard decay, horror, spaceports. No readable prices or street signs.",
  },
  {
    id: "grand-hotel",
    title: "Grand Hotel Lobby",
    tags: ["hotel", "lobby", "luxury"],
    foundation:
      "A sparkling **grand hotel lobby** at check-in rush: marble floors, a sweeping staircase, chandelier, luggage carts, concierge desk, and palm planters. Guests in travel clothes. Foreground luggage chaos; midground staircase; background elevators and mezzanine.",
    weave:
      "Hotel props: steamer trunks, bellhop carts, room keys on tassels, flower arrangements, champagne buckets (juice), umbrellas, coats on racks, newspapers (blank), concierge bells, fountain pens, guest books (blank), hat boxes, shoe shines kits, pocket watches, souvenir shops with blank windows.",
    avoid: "Outdoor wilderness as main, factories, beaches. No readable hotel names or room numbers.",
  },
  {
    id: "volcano-observatory",
    title: "Volcano Observatory Deck",
    tags: ["volcano", "observatory", "science"],
    foundation:
      "A dramatic but safe **volcano observatory deck**: viewing platforms, telescopes, colorful research cabins, steam vents far below (comic, not scary), and a bright sky. Scientists and kids visitors point. Foreground instrument clutter; midground deck; background crater and lava glow (distant, friendly).",
    weave:
      "Observatory props: telescopes, rock samples, heat-proof gloves, sample jars, clipboards (blank), binoculars, backpacks, seismograph drums (abstract wavy lines), thermos flasks, hard hats, cameras, trail snacks, radio packs, maps (blank), wind gauges (blank faces), souvenir lava rocks.",
    avoid: "Disaster panic, gore, beaches. No readable hazard signs or digits.",
  },
  {
    id: "aquarium-tunnel",
    title: "Aquarium Tunnel Wonder",
    tags: ["aquarium", "tunnel", "ocean"],
    foundation:
      "A magical **aquarium tunnel** walkthrough: arched glass with swimming fish above and beside, soft blue light, kids pointing, interactive touch pools at the exit glowing ahead. Foreground tunnel path clutter (strollers, bags); midground glass arch; background deeper ocean habitat.",
    weave:
      "Aquarium props: strollers, cameras, kid backpacks, stuffed sea creatures, maps (blank), snack pouches, headphones for audio tours (blank), touch-pool starfish (friendly), jellyfish exhibits beyond, dive helmet displays, coral models, guide badges (blank), water bottles, glow stickers (shapes).",
    avoid: "Open ocean diving as main, castles, farms. No readable exhibit labels.",
  },
];

function toMd(s) {
  return `---
id: ${s.id}
title: ${s.title}
tags: [${s.tags.join(", ")}]
---

## Foundation

${s.foundation}

## Object weave

${s.weave}

Props should sit in pockets, hang from straps, rest on counters, or clutter the floor between feet — never as a flat sticker grid.

## Avoid

${s.avoid}
`;
}

function toJson(s) {
  return JSON.stringify(
    { id: s.id, title: s.title, imageUrl: `/hunt/${s.id}.jpg` },
    null,
    2,
  ) + "\n";
}

function camel(id) {
  return id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

const existing = new Set(
  readdirSync(scenesDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, "")),
);

let written = 0;
for (const s of SCENES) {
  if (existing.has(s.id)) {
    console.error("skip existing", s.id);
    continue;
  }
  writeFileSync(join(scenesDir, `${s.id}.md`), toMd(s));
  writeFileSync(join(dataDir, `${s.id}.json`), toJson(s));
  written++;
}

// Regenerate scenes.ts from all scene JSON files
const allIds = readdirSync(dataDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""))
  .sort();

const imports = allIds
  .map((id) => `import ${camel(id)} from "./data/${id}.json";`)
  .join("\n");
const loads = allIds
  .map((id) => `  loadScene(${camel(id)} as HuntSceneJson),`)
  .join("\n");

const scenesTs = `${imports}

/** Image-only hunt scene — no answer key; scoring is peer In/Out (ADR 0028 / 0041). */
export interface HuntScene {
  id: string;
  title: string;
  imageUrl: string;
}

/** Cap free-text finds per player per round. */
export const HUNT_MAX_ANSWERS = 40;

interface HuntSceneJson {
  id: string;
  title: string;
  imageUrl: string;
}

function loadScene(raw: HuntSceneJson): HuntScene {
  return {
    id: raw.id,
    title: raw.title,
    imageUrl: raw.imageUrl,
  };
}

export const HUNT_SCENES: HuntScene[] = [
${loads}
];

export function scenesCatalog(): HuntScene[] {
  return HUNT_SCENES.map((s) => ({ ...s }));
}

export function getScene(id: string): HuntScene | undefined {
  return HUNT_SCENES.find((s) => s.id === id);
}

export function isHuntSceneId(v: unknown): v is string {
  return typeof v === "string" && HUNT_SCENES.some((s) => s.id === v);
}

/** Pick a scene, preferring \`preferredId\` when still unused; else random unused (wrap when exhausted). */
export function pickScene(usedIds: Set<string>, preferredId: string | null): HuntScene {
  const all = HUNT_SCENES;
  if (preferredId) {
    const preferred = all.find((s) => s.id === preferredId);
    if (preferred && !usedIds.has(preferred.id)) {
      return { ...preferred };
    }
  }
  const available = all.filter((s) => !usedIds.has(s.id));
  const pool = available.length > 0 ? available : all;
  const bytes = crypto.getRandomValues(new Uint8Array(1));
  const scene = pool[bytes[0]! % pool.length]!;
  return { ...scene };
}
`;

writeFileSync(join(repo, "worker/scattergories/hunt/scenes.ts"), scenesTs);
console.log(`Wrote ${written} new scenes; catalog has ${allIds.length} total`);
console.log(allIds.join("\n"));
