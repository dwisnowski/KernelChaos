import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("FISH FRIENDS", [
    c("sfis0", "Which fish is orange with white stripes and lives in an anemone?", ["Clownfish", "Tuna", "Salmon", "Goldfish", "Eel", "Angelfish", "Barracuda", "Swordfish"]),
    c("sfis1", "Which fish can puff up like a ball?", ["Pufferfish", "Tuna", "Salmon", "Clownfish", "Eel", "Angelfish", "Swordfish", "Sardine"]),
    c("sfis2", "Which fish has a long, flat sword-like nose?", ["Swordfish", "Tuna", "Clownfish", "Pufferfish", "Salmon", "Eel", "Angelfish", "Sardine"]),
    c("sfis3", "Which tiny fish carries its babies in a pouch on the dad?", ["Seahorse", "Clownfish", "Guppy", "Tuna", "Eel", "Angelfish", "Pufferfish", "Salmon"]),
    c("sfis4", "Which is the biggest fish in the sea?", ["Whale shark", "Great white shark", "Blue whale", "Manta ray", "Tuna", "Swordfish", "Barracuda", "Hammerhead"]),
  ]),
  cat("SEA MAMMALS", [
    c("ssea0", "Which sea mammal is smart, playful, and says clicks and whistles?", ["Dolphin", "Shark", "Tuna", "Octopus", "Crab", "Jellyfish", "Eel", "Starfish"]),
    c("ssea1", "Which is the largest animal in the world?", ["Blue whale", "Elephant", "Great white shark", "Giraffe", "Orca", "Whale shark", "Hippo", "Dinosaur"]),
    c("ssea2", "Which sea animal holds hands with others while it floats and sleeps?", ["Sea otter", "Seal", "Walrus", "Dolphin", "Crab", "Turtle", "Penguin", "Whale"]),
    c("ssea3", "Which sea animal has long tusks and flippers?", ["Walrus", "Dolphin", "Seal", "Otter", "Whale", "Manatee", "Sea lion", "Penguin"]),
    c("ssea4", "Which whale is known as the \"unicorn of the sea\" because of its long tusk?", ["Narwhal", "Orca", "Blue whale", "Humpback", "Sperm whale", "Beluga", "Minke whale", "Gray whale"]),
  ]),
  cat("SHELLS & CRABS", [
    c("sshe0", "Which sea animal walks sideways?", ["Crab", "Fish", "Dolphin", "Seal", "Octopus", "Jellyfish", "Shark", "Eel"]),
    c("sshe1", "What does a hermit crab live in?", ["A shell", "A cave", "A coral castle", "A burrow", "A net", "A bottle", "A treasure chest", "A boat"]),
    c("sshe2", "A shiny gem made inside an oyster is a:", ["Pearl", "Ruby", "Diamond", "Emerald", "Coin", "Pebble", "Gold nugget", "Glass bead"]),
    c("sshe3", "Which sea animal has a hard spiral shell and a soft body inside?", ["Snail", "Starfish", "Jellyfish", "Octopus", "Eel", "Crab", "Squid", "Seahorse"]),
    c("sshe4", "How many big claws does a lobster have?", ["Two", "One", "Three", "Four", "Six", "Eight", "Ten", "None"]),
  ]),
  cat("OCTOPUS & FRIENDS", [
    c("soct0", "How many arms does an octopus have?", ["Eight", "Six", "Ten", "Four", "Twelve", "Two", "Five", "Seven"]),
    c("soct1", "Which sea animal has no bones and a bell-shaped body with tentacles?", ["Jellyfish", "Octopus", "Starfish", "Crab", "Fish", "Seahorse", "Eel", "Shark"]),
    c("soct2", "Which star-shaped animal lives on the seafloor?", ["Starfish (sea star)", "Jellyfish", "Octopus", "Crab", "Eel", "Seahorse", "Squid", "Lobster"]),
    c("soct3", "How many hearts does an octopus have?", ["Three", "One", "Two", "Four", "Five", "Eight", "Six", "None"]),
    c("soct4", "When scared, an octopus can squirt out:", ["Ink", "Water balloons", "Bubbles of fire", "Sand", "Milk", "Paint", "Honey", "Glitter"]),
  ]),
  cat("CORAL REEFS", [
    c("scor0", "A coral reef is full of:", ["Colorful sea life", "Cars", "Snow", "Sand dunes only", "Trees", "Houses", "Roads", "Buses"]),
    c("scor1", "Which country has the Great Barrier Reef?", ["Australia", "Mexico", "Brazil", "Japan", "Canada", "India", "Egypt", "Italy"]),
    c("scor2", "Coral looks like a plant but is actually an:", ["Animal", "Rock", "Mushroom", "Sponge", "Shell", "Seaweed", "Flower", "Mineral"]),
    c("scor3", "Sea turtles come onto the beach to lay their:", ["Eggs", "Pearls", "Seeds", "Shells", "Teeth", "Fins", "Coral", "Jellyfish"]),
    c("scor4", "Which blue fish with a yellow tail is Dory's species?", ["Blue tang", "Clownfish", "Angelfish", "Pufferfish", "Guppy", "Tuna", "Salmon", "Barracuda"]),
  ]),
  cat("OCEAN BASICS", [
    c("soce0", "What is the ocean water like?", ["Salty", "Sweet", "Sour", "Spicy", "Bitter", "Minty", "Sugary", "Creamy"]),
    c("soce1", "Which is the largest ocean?", ["Pacific", "Atlantic", "Indian", "Arctic", "Southern", "Caribbean", "Mediterranean", "Red Sea"]),
    c("soce2", "What pulls the ocean up and down twice a day, causing tides?", ["The Moon", "The stars", "Wind", "Whales", "Boats", "Clouds", "Mars", "Fish"]),
    c("soce3", "What is the deepest part of the ocean called?", ["Mariana Trench", "Great Barrier Reef", "Bermuda Triangle", "Sargasso Sea", "Panama Canal", "Atlantis", "Suez Canal", "Gulf Stream"]),
    c("soce4", "About how much of Earth is covered by water?", ["About 70%", "About 10%", "About 30%", "About 50%", "About 95%", "About 20%", "About 40%", "About 15%"]),
  ]),
];

const DOUBLE = [
  cat("SHARKS & RAYS", [
    c("dsha0", "Which shark has a head shaped like a hammer?", ["Hammerhead", "Great white", "Tiger shark", "Whale shark", "Bull shark", "Nurse shark", "Mako", "Blue shark"]),
    c("dsha1", "A shark's skeleton is made of:", ["Cartilage", "Bone", "Steel", "Wood", "Rubber", "Plastic", "Stone", "Clay"]),
    c("dsha2", "Which gentle giant is the biggest fish but eats tiny plankton?", ["Whale shark", "Great white", "Hammerhead", "Tiger shark", "Bull shark", "Nurse shark", "Mako", "Blue shark"]),
    c("dsha3", "Which flat sea animal flaps like a wing and glides in the water?", ["Manta ray", "Starfish", "Crab", "Octopus", "Jellyfish", "Eel", "Seahorse", "Lobster"]),
    c("dsha4", "How many times can a shark replace its teeth?", ["Many, many times", "Never", "Once", "Twice", "Three times", "Only when sick", "Only in winter", "Only as a baby"]),
  ]),
  cat("DEEP DIVE", [
    c("ddee0", "Which deep-sea fish has a glowing light on its head to attract food?", ["Anglerfish", "Tuna", "Goldfish", "Salmon", "Clownfish", "Guppy", "Angelfish", "Barracuda"]),
    c("ddee1", "What do we call animals that make their own light, like some jellyfish?", ["Bioluminescent", "Invisible", "Nocturnal", "Magnetic", "Electric", "Magical", "Metallic", "Transparent"]),
    c("ddee2", "Deep in the ocean, it is very:", ["Dark and cold", "Bright and hot", "Sunny", "Sandy", "Dry", "Snowy", "Windy", "Warm"]),
    c("ddee3", "A vehicle that explores under the water is a:", ["Submarine", "Rocket", "Bus", "Airplane", "Train", "Scooter", "Bicycle", "Tractor"]),
    c("ddee4", "Which giant deep-sea animal has the biggest eyes and is rarely seen alive?", ["Giant squid", "Blue whale", "Octopus", "Starfish", "Turtle", "Crab", "Seahorse", "Eel"]),
  ]),
  cat("SEA FAMILIES", [
    c("dbab0", "A baby seal is called a:", ["Pup", "Cub", "Calf", "Kit", "Fry", "Chick", "Kid", "Joey"]),
    c("dbab1", "A baby whale is called a:", ["Calf", "Pup", "Cub", "Kit", "Fry", "Chick", "Kid", "Joey"]),
    c("dbab2", "A baby fish is called a:", ["Fry", "Pup", "Cub", "Calf", "Kit", "Chick", "Joey", "Kid"]),
    c("dbab3", "A baby sea turtle is called a:", ["Hatchling", "Pup", "Cub", "Calf", "Kit", "Fry", "Joey", "Kid"]),
    c("dbab4", "A group of fish swimming together is called a:", ["School", "Pride", "Flock", "Herd", "Pack", "Troop", "Colony", "Swarm"]),
  ]),
  cat("OCEAN HOMES", [
    c("dhom0", "Which bird cannot fly but swims in the icy Antarctic sea?", ["Penguin", "Parrot", "Eagle", "Owl", "Crow", "Robin", "Duck", "Sparrow"]),
    c("dhom1", "Where do dolphins live?", ["In the ocean", "In trees", "In deserts", "In caves", "In ponds only", "In clouds", "In burrows", "In nests"]),
    c("dhom2", "Seaweed that grows in tall, underwater forests is called:", ["Kelp", "Moss", "Algae paste", "Ferns", "Vines", "Grass", "Clover", "Bamboo"]),
    c("dhom3", "What is the home of a clownfish?", ["A sea anemone", "A shell", "A sunken ship", "A coral castle", "A kelp bed", "A cave", "A bottle", "A treasure chest"]),
    c("dhom4", "Which gentle sea animal is nicknamed the \"sea cow\"?", ["Manatee", "Walrus", "Seal", "Dolphin", "Orca", "Sea lion", "Narwhal", "Otter"]),
  ]),
  cat("SEA MOVIE STARS", [
    c("dmov0", "In Finding Nemo, Nemo is a:", ["Clownfish", "Seahorse", "Shark", "Turtle", "Dolphin", "Octopus", "Crab", "Jellyfish"]),
    c("dmov1", "In Finding Nemo, which forgetful blue fish helps find Nemo?", ["Dory", "Marlin", "Bruce", "Crush", "Gill", "Squirt", "Nigel", "Bloat"]),
    c("dmov2", "In The Little Mermaid, which crab sings \"Under the Sea\"?", ["Sebastian", "Flounder", "Scuttle", "Ursula", "Triton", "Eric", "Max", "Grimsby"]),
    c("dmov3", "In The Little Mermaid, Ariel's best friend is a fish named:", ["Flounder", "Sebastian", "Scuttle", "Nemo", "Dory", "Bruce", "Marlin", "Gill"]),
    c("dmov4", "In SpongeBob SquarePants, SpongeBob lives in a:", ["Pineapple", "Shell", "Boat", "Coconut", "Barrel", "Treasure chest", "Cave", "Sandcastle"]),
  ]),
  cat("OCEAN SUPER FACTS", [
    c("dfac0", "Which sea animal has three hearts and blue blood?", ["Octopus", "Dolphin", "Shark", "Tuna", "Crab", "Starfish", "Seahorse", "Whale"]),
    c("dfac1", "Which sea animal can regrow lost arms?", ["Starfish", "Dolphin", "Whale", "Shark", "Tuna", "Seahorse", "Turtle", "Walrus"]),
    c("dfac2", "Which sea animal uses a tool, like a rock, to crack open shells?", ["Sea otter", "Dolphin", "Seal", "Whale", "Crab", "Turtle", "Shark", "Walrus"]),
    c("dfac3", "Which sea creature has no brain and no heart?", ["Jellyfish", "Octopus", "Starfish", "Crab", "Dolphin", "Seahorse", "Shark", "Tuna"]),
    c("dfac4", "Dolphins and whales breathe air through a:", ["Blowhole", "Gill", "Mouth only", "Fin", "Flipper", "Tail", "Snout only", "Spiracle"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "OCEAN EXPERT",
  prompt: "What do we call the biggest animals on Earth that filter tiny krill through baleen?",
  choices: ["Baleen whales", "Sharks", "Walruses", "Dolphins", "Sea turtles", "Giant squid", "Manatees", "Orcas"],
  correctIndex: 0,
};

export const KIDS_UNDER_THE_SEA_PACK: TriviaPack = {
  id: "kids-under-the-sea",
  audience: "kids",
  title: "Under the Sea",
  tagline: "Fish, whales, coral reefs, and ocean wonders",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
