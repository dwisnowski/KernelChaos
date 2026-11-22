import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("MAMMAL MYSTERIES", [
    c("aps00", "What is a baby kangaroo called?", ["Joey", "Cub", "Pup", "Kit", "Calf", "Kid", "Foal", "Fawn"]),
    c("aps01", "Which big cat is the fastest land animal?", ["Cheetah", "Lion", "Leopard", "Jaguar", "Tiger", "Cougar", "Lynx", "Snow leopard"]),
    c("aps02", "A narwhal's long spiral \"horn\" is actually a:", ["Tooth", "Bone spike", "Antler", "Horn of keratin", "Fin", "Whisker", "Rib", "Claw"]),
    c("aps03", "Which is the only marsupial native to the United States and Canada?", ["Virginia opossum", "Koala", "Wombat", "Tasmanian devil", "Sugar glider", "Kangaroo rat", "Bandicoot", "Wallaby"]),
    c("aps04", "The name \"aardvark,\" from Afrikaans, means:", ["Earth pig", "Ant bear", "Night digger", "Long tongue", "Sand hog", "Termite king", "Hill rat", "Dust horse"]),
  ]),
  cat("BIRD BRAINS", [
    c("aps10", "Which flightless bird is the national symbol of New Zealand?", ["Kiwi", "Emu", "Ostrich", "Penguin", "Cassowary", "Dodo", "Rhea", "Kakapo"]),
    c("aps11", "Which is the largest living bird?", ["Ostrich", "Emu", "Albatross", "Condor", "Cassowary", "Eagle", "Pelican", "Crane"]),
    c("aps12", "Which bird keeps its egg warm on its feet through the Antarctic winter?", ["Emperor penguin", "Albatross", "Puffin", "Snowy owl", "Adélie penguin", "Skua", "Petrel", "Gull"]),
    c("aps13", "Which bird makes the longest yearly migration, from pole to pole?", ["Arctic tern", "Swallow", "Canada goose", "Snow goose", "Albatross", "Stork", "Crane", "Hummingbird"]),
    c("aps14", "A group of owls is called a:", ["Parliament", "Murder", "Flock", "Exaltation", "Gaggle", "Charm", "Wisdom", "Colony"]),
  ]),
  cat("OCEAN LIFE", [
    c("aps20", "How many arms does a typical starfish have?", ["Five", "Four", "Six", "Eight", "Ten", "Three", "Seven", "Twelve"]),
    c("aps21", "What is the largest animal ever known to have lived on Earth?", ["Blue whale", "Megalodon", "Sperm whale", "Whale shark", "Giant squid", "Brachiosaurus", "Fin whale", "Great white shark"]),
    c("aps22", "How many hearts does an octopus have?", ["Three", "One", "Two", "Four", "Five", "Eight", "Six", "Nine"]),
    c("aps23", "Shark skeletons are made of what instead of bone?", ["Cartilage", "Chitin", "Coral", "Keratin", "Calcium rock", "Enamel", "Collagen cables", "Shell"]),
    c("aps24", "Which ocean animal, Turritopsis dohrnii, is nicknamed \"immortal\" because it can reverse its life cycle?", ["Jellyfish", "Lobster", "Starfish", "Sea turtle", "Clam", "Octopus", "Seahorse", "Sea urchin"]),
  ]),
  cat("REPTILES & AMPHIBIANS", [
    c("aps30", "Which reptile carries its shell home on its back?", ["Turtle", "Lizard", "Gecko", "Snake", "Alligator", "Iguana", "Skink", "Chameleon"]),
    c("aps31", "What is the largest living lizard?", ["Komodo dragon", "Green iguana", "Gila monster", "Nile monitor", "Chameleon", "Gecko", "Bearded dragon", "Basilisk"]),
    c("aps32", "Which Mexican salamander can regrow lost limbs and even parts of its heart?", ["Axolotl", "Gecko", "Hellbender", "Mudpuppy", "Caecilian", "Tree frog", "Toad", "Olm"]),
    c("aps33", "Which snake is the longest in the world?", ["Reticulated python", "Green anaconda", "King cobra", "Boa constrictor", "Black mamba", "Rattlesnake", "Burmese python", "Gaboon viper"]),
    c("aps34", "Which reptile typically has a pointed, V-shaped snout, unlike the U-shaped snout of an alligator?", ["Crocodile", "Alligator", "Gila monster", "Komodo dragon", "Iguana", "Gecko", "Tortoise", "Skink"]),
  ]),
  cat("BUGS & INSECTS", [
    c("aps40", "How many legs does an insect have?", ["Six", "Four", "Eight", "Ten", "Twelve", "Two", "Fourteen", "Sixteen"]),
    c("aps41", "Which insect's cocoon is the source of silk thread?", ["Silkworm", "Honeybee", "Ladybug", "Spider", "Cricket", "Dragonfly", "Ant", "Beetle"]),
    c("aps42", "What is the stage called when a caterpillar is inside its chrysalis or cocoon?", ["Pupa", "Larva", "Egg", "Nymph", "Imago", "Embryo", "Instar", "Adult"]),
    c("aps43", "How do honeybees tell hive-mates where flowers are?", ["Waggle dance", "Singing", "Buzz code", "Leaving trails", "Light flashes", "Tapping antennae", "Spinning in circles", "Humming loudly"]),
    c("aps44", "Fireflies glow through a chemical process called:", ["Bioluminescence", "Phosphorescence", "Photosynthesis", "Incandescence", "Electrolysis", "Fluorescence", "Radiation", "Combustion"]),
  ]),
  cat("ANIMAL SUPERLATIVES", [
    c("aps50", "What is the tallest animal in the world?", ["Giraffe", "Elephant", "Ostrich", "Moose", "Camel", "Horse", "Bull", "Llama"]),
    c("aps51", "Which mammal is the slowest in the world?", ["Sloth", "Koala", "Turtle", "Snail", "Armadillo", "Manatee", "Hedgehog", "Wombat"]),
    c("aps52", "Which bird is the fastest animal in a dive, topping 200 mph?", ["Peregrine falcon", "Golden eagle", "Hummingbird", "Swift", "Albatross", "Osprey", "Hawk", "Ostrich"]),
    c("aps53", "Which animal sleeps up to about 20 hours a day, mostly because eucalyptus leaves are low in energy?", ["Koala", "Panda", "Sloth", "Wombat", "Bat", "Opossum", "Lemur", "Armadillo"]),
    c("aps54", "Which deep-sea creature has some of the largest eyes in the animal kingdom?", ["Giant squid", "Anglerfish", "Blue whale", "Great white shark", "Lanternfish", "Sea turtle", "Octopus", "Manta ray"]),
  ]),
];

const DOUBLE = [
  cat("ANIMAL GROUPS", [
    c("apd00", "A group of fish swimming together is called a:", ["School", "Pack", "Herd", "Flock", "Pride", "Colony", "Gaggle", "Troop"]),
    c("apd01", "A group of crows is called a:", ["Murder", "Parliament", "Pride", "Troop", "Pod", "Bloat", "Colony", "Cackle"]),
    c("apd02", "A group of giraffes is called a:", ["Tower", "Pride", "Pod", "Flock", "Pack", "Swarm", "Troop", "School"]),
    c("apd03", "A group of flamingos is called a:", ["Flamboyance", "Pride", "Pod", "Pack", "Swarm", "Murmuration", "Gaggle", "Herd"]),
    c("apd04", "A group of ferrets is called a:", ["Business", "Pride", "Pack", "Flock", "Pod", "Swarm", "Troop", "School"]),
  ]),
  cat("BABY ANIMALS", [
    c("apd10", "What is a baby goat called?", ["Kid", "Lamb", "Calf", "Joey", "Colt", "Piglet", "Cub", "Pup"]),
    c("apd11", "What is a baby swan called?", ["Cygnet", "Gosling", "Duckling", "Chick", "Squab", "Eaglet", "Owlet", "Poult"]),
    c("apd12", "What is a baby fox called?", ["Kit", "Cub", "Joey", "Calf", "Hatchling", "Fry", "Foal", "Leveret"]),
    c("apd13", "What is a baby eel called?", ["Elver", "Fry", "Smolt", "Tadpole", "Larva", "Whelp", "Fingerling", "Cygnet"]),
    c("apd14", "What is a baby echidna called?", ["Puggle", "Joey", "Pup", "Kit", "Hoglet", "Cub", "Calf", "Pinkie"]),
  ]),
  cat("WILD HOMES", [
    c("apd20", "Polar bears are found in which region?", ["The Arctic", "Antarctica", "The Sahara", "The Amazon", "The Himalayas", "The Outback", "The Serengeti", "Madagascar"]),
    c("apd21", "Giant pandas live in the mountains of which country?", ["China", "Japan", "India", "Nepal", "Thailand", "Russia", "Vietnam", "Mongolia"]),
    c("apd22", "Lemurs live wild only on which island?", ["Madagascar", "Sri Lanka", "Borneo", "Cuba", "Tasmania", "Iceland", "Sumatra", "New Guinea"]),
    c("apd23", "Komodo dragons live naturally on islands of which country?", ["Indonesia", "Australia", "Philippines", "Thailand", "Malaysia", "India", "Papua New Guinea", "Fiji"]),
    c("apd24", "The Galápagos Islands, famous for giant tortoises, belong to which country?", ["Ecuador", "Peru", "Chile", "Colombia", "Mexico", "Brazil", "Costa Rica", "Panama"]),
  ]),
  cat("ANIMAL ABILITIES", [
    c("apd30", "Bats find their way in the dark using:", ["Echolocation", "Night vision goggles", "Smell", "Magnetism", "Whiskers", "Infrared", "Radar", "Taste"]),
    c("apd31", "Which animal can sleep standing up?", ["Horse", "Dolphin", "Seal", "Octopus", "Frog", "Penguin", "Tiger", "Rabbit"]),
    c("apd32", "A snake \"smells\" the air using its:", ["Tongue", "Tail", "Scales", "Eyes", "Ears", "Fangs", "Belly", "Whiskers"]),
    c("apd33", "Which Australian animal famously produces cube-shaped droppings?", ["Wombat", "Koala", "Kangaroo", "Platypus", "Wallaby", "Echidna", "Quokka", "Dingo"]),
    c("apd34", "Which microscopic animal, the tardigrade, can survive even in outer space?", ["Tardigrade", "Plankton", "Amoeba", "Krill", "Flea", "Mite", "Rotifer", "Sea sponge"]),
  ]),
  cat("PETS & FARM", [
    c("apd40", "What is a male chicken called?", ["Rooster", "Hen", "Drake", "Gander", "Tom", "Cob", "Stag", "Capon"]),
    c("apd41", "How many chambers does a cow's stomach have?", ["Four", "One", "Two", "Three", "Five", "Six", "Seven", "Eight"]),
    c("apd42", "Which dog breed is known as the fastest, built for racing?", ["Greyhound", "Dalmatian", "Labrador", "Poodle", "Bulldog", "Beagle", "Boxer", "Corgi"]),
    c("apd43", "The name of which dog breed means \"badger dog\" in German?", ["Dachshund", "Schnauzer", "Rottweiler", "Pug", "Beagle", "Weimaraner", "Samoyed", "Doberman"]),
    c("apd44", "Which dog breed is known for its blue-black tongue?", ["Chow Chow", "Golden Retriever", "Husky", "Bulldog", "Pug", "Poodle", "Collie", "Great Dane"]),
  ]),
  cat("PREHISTORIC LIFE", [
    c("apd50", "Which dinosaur had three horns on its face?", ["Triceratops", "Stegosaurus", "Ankylosaurus", "Velociraptor", "Brachiosaurus", "Spinosaurus", "Pteranodon", "Diplodocus"]),
    c("apd51", "What do we call scientists who study fossils and ancient life?", ["Paleontologists", "Archaeologists", "Geologists", "Zoologists", "Botanists", "Biologists", "Astronomers", "Meteorologists"]),
    c("apd52", "Dinosaurs lived during which era?", ["Mesozoic", "Cenozoic", "Paleozoic", "Precambrian", "Holocene", "Ice Age", "Bronze Age", "Neolithic"]),
    c("apd53", "The extinct dodo bird once lived on which island?", ["Mauritius", "Madagascar", "Hawaii", "Iceland", "Borneo", "Cuba", "Fiji", "Sri Lanka"]),
    c("apd54", "Which period began the Age of Dinosaurs?", ["Triassic", "Jurassic", "Cretaceous", "Paleogene", "Neogene", "Quaternary", "Holocene", "Pleistocene"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "ANIMAL ACE",
  prompt: "Which is the only bird that can fly backward?",
  choices: ["Hummingbird", "Kingfisher", "Swift", "Swallow", "Sparrow", "Albatross", "Woodpecker", "Falcon"],
  correctIndex: 0,
};

export const FAMILY_ANIMALS_PLUS_PACK: TriviaPack = {
  id: "family-animals-plus",
  audience: "family",
  title: "Animals Plus",
  tagline: "Beyond the zoo basics: odd facts, groups, and wild records",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
