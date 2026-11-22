import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("PETS", [
    c("spet0", "Which pet says \"woof\"?", ["Dog", "Cat", "Fish", "Hamster", "Rabbit", "Parrot", "Turtle", "Guinea pig"]),
    c("spet1", "Which pet says \"meow\"?", ["Cat", "Dog", "Goldfish", "Hamster", "Frog", "Gecko", "Pony", "Duck"]),
    c("spet2", "Which pet has long ears and loves carrots in cartoons?", ["Rabbit", "Hamster", "Goldfish", "Parrot", "Snake", "Turtle", "Lizard", "Cat"]),
    c("spet3", "A hamster stuffs food in its:", ["Cheeks", "Tail", "Ears", "Paws", "Whiskers", "Belly button", "Back", "Nose"]),
    c("spet4", "Which pet bird can learn to copy human words?", ["Parrot", "Penguin", "Ostrich", "Eagle", "Owl", "Flamingo", "Pelican", "Vulture"]),
  ]),
  cat("FARM ANIMALS", [
    c("sfar0", "Which farm animal says \"moo\"?", ["Cow", "Pig", "Sheep", "Horse", "Goat", "Duck", "Hen", "Donkey"]),
    c("sfar1", "Which farm animal gives us wool?", ["Sheep", "Cow", "Pig", "Chicken", "Duck", "Horse", "Goose", "Turkey"]),
    c("sfar2", "A baby cow is called a:", ["Calf", "Kid", "Lamb", "Foal", "Piglet", "Chick", "Cub", "Pup"]),
    c("sfar3", "A group of chickens is called a:", ["Flock", "Pride", "Pack", "School", "Herd", "Pod", "Swarm", "Colony"]),
    c("sfar4", "A male chicken that crows at sunrise is a:", ["Rooster", "Hen", "Drake", "Gander", "Tom", "Stallion", "Ram", "Bull"]),
  ]),
  cat("WILD CATS & BIG ANIMALS", [
    c("swil0", "Which big cat is called the king of the jungle?", ["Lion", "Tiger", "Leopard", "Cheetah", "Jaguar", "Panther", "Lynx", "Puma"]),
    c("swil1", "Which animal has a long trunk?", ["Elephant", "Giraffe", "Hippo", "Rhino", "Zebra", "Camel", "Bison", "Gorilla"]),
    c("swil2", "Which animal has black and white stripes?", ["Zebra", "Horse", "Donkey", "Cow", "Elephant", "Giraffe", "Sheep", "Dalmatian"]),
    c("swil3", "Which is the tallest animal in the world?", ["Giraffe", "Elephant", "Ostrich", "Camel", "Moose", "Horse", "Bear", "Gorilla"]),
    c("swil4", "Which is the fastest land animal?", ["Cheetah", "Lion", "Horse", "Greyhound", "Gazelle", "Leopard", "Tiger", "Ostrich"]),
  ]),
  cat("BIRDS", [
    c("sbir0", "Which bird says \"hoot\"?", ["Owl", "Duck", "Robin", "Crow", "Hawk", "Parrot", "Pigeon", "Seagull"]),
    c("sbir1", "Which bird quacks?", ["Duck", "Owl", "Eagle", "Rooster", "Crow", "Penguin", "Flamingo", "Swan"]),
    c("sbir2", "Which bird is black and white and waddles on ice?", ["Penguin", "Pelican", "Crow", "Stork", "Magpie", "Toucan", "Parrot", "Skua"]),
    c("sbir3", "Which is the biggest bird in the world?", ["Ostrich", "Eagle", "Emu", "Albatross", "Penguin", "Swan", "Condor", "Pelican"]),
    c("sbir4", "Which tiny bird can hover and even fly backward?", ["Hummingbird", "Sparrow", "Robin", "Pigeon", "Crow", "Finch", "Swallow", "Wren"]),
  ]),
  cat("BUGS & CRAWLERS", [
    c("sbug0", "Which bug lights up at night?", ["Firefly", "Ant", "Beetle", "Fly", "Wasp", "Moth", "Cricket", "Ladybug"]),
    c("sbug1", "A caterpillar turns into a:", ["Butterfly", "Beetle", "Bee", "Ant", "Dragonfly", "Fly", "Spider", "Grasshopper"]),
    c("sbug2", "How many legs does an insect have?", ["Six", "Four", "Eight", "Ten", "Two", "Twelve", "Three", "Five"]),
    c("sbug3", "Which insect makes honey?", ["Bee", "Ant", "Wasp", "Fly", "Moth", "Beetle", "Cricket", "Ladybug"]),
    c("sbug4", "Spiders are not insects. They belong to a group called:", ["Arachnids", "Mammals", "Reptiles", "Amphibians", "Crustaceans", "Fish", "Birds", "Worms"]),
  ]),
  cat("BABY ANIMALS", [
    c("sbab0", "A baby dog is called a:", ["Puppy", "Kitten", "Cub", "Calf", "Foal", "Chick", "Lamb", "Kid"]),
    c("sbab1", "A baby cat is called a:", ["Kitten", "Puppy", "Cub", "Joey", "Fawn", "Duckling", "Piglet", "Calf"]),
    c("sbab2", "A baby kangaroo is called a:", ["Joey", "Cub", "Kit", "Pup", "Foal", "Calf", "Fawn", "Cygnet"]),
    c("sbab3", "A baby frog is called a:", ["Tadpole", "Pup", "Cub", "Kit", "Fry", "Chick", "Calf", "Kid"]),
    c("sbab4", "A baby swan is called a:", ["Cygnet", "Duckling", "Gosling", "Chick", "Squab", "Eaglet", "Owlet", "Poult"]),
  ]),
];

const DOUBLE = [
  cat("ANIMAL HOMES", [
    c("dhom0", "Where does a bird lay its eggs?", ["Nest", "Den", "Burrow", "Hive", "Lodge", "Web", "Kennel", "Sty"]),
    c("dhom1", "A bee lives in a:", ["Hive", "Den", "Burrow", "Lodge", "Web", "Sty", "Pond", "Barn"]),
    c("dhom2", "A fox lives in a:", ["Den", "Hive", "Lodge", "Web", "Coop", "Stall", "Kennel", "Pen"]),
    c("dhom3", "A beaver builds a home called a:", ["Lodge", "Hive", "Den", "Web", "Coop", "Sty", "Kennel", "Stall"]),
    c("dhom4", "A rabbit digs a home underground called a:", ["Burrow", "Lodge", "Hive", "Coop", "Web", "Nest", "Pen", "Cage"]),
  ]),
  cat("WHAT DO THEY EAT?", [
    c("deat0", "What do cows mostly eat?", ["Grass", "Meat", "Fish", "Insects", "Seeds", "Bugs", "Cheese", "Candy"]),
    c("deat1", "What do koalas mostly eat?", ["Eucalyptus leaves", "Fish", "Meat", "Bananas", "Grass", "Bamboo", "Insects", "Berries"]),
    c("deat2", "What do giraffes eat from tall trees?", ["Leaves", "Fish", "Meat", "Bugs", "Rocks", "Honey", "Fruit only", "Seeds only"]),
    c("deat3", "An animal that eats only plants is called a:", ["Herbivore", "Carnivore", "Omnivore", "Insectivore", "Scavenger", "Predator", "Parasite", "Hibernator"]),
    c("deat4", "An animal that eats both plants and meat is called an:", ["Omnivore", "Herbivore", "Carnivore", "Insectivore", "Predator", "Vegetarian", "Scavenger", "Ruminant"]),
  ]),
  cat("ANIMAL SUPERPOWERS", [
    c("dsup0", "Which animal carries its home on its back?", ["Snail", "Ant", "Bee", "Frog", "Mouse", "Bird", "Worm", "Fish"]),
    c("dsup1", "Which animal can change color to blend in?", ["Chameleon", "Cow", "Pig", "Sheep", "Dog", "Horse", "Duck", "Rabbit"]),
    c("dsup2", "Which animal can regrow a lost tail?", ["Lizard", "Dog", "Cat", "Bird", "Mouse", "Horse", "Rabbit", "Pig"]),
    c("dsup3", "Bats find their way in the dark using:", ["Echolocation", "Night vision goggles", "Smell only", "Lanterns", "Magnets", "Radar towers", "Dreams", "Glow dust"]),
    c("dsup4", "Which animal has fingerprints almost like humans?", ["Koala", "Dog", "Cat", "Horse", "Elephant", "Rabbit", "Cow", "Pig"]),
  ]),
  cat("ZOO FAVORITES", [
    c("dzoo0", "Which zoo animal loves bamboo?", ["Panda", "Zebra", "Lion", "Penguin", "Monkey", "Elephant", "Giraffe", "Hippo"]),
    c("dzoo1", "Which zoo animal swings through trees and loves bananas?", ["Monkey", "Lion", "Hippo", "Snake", "Zebra", "Rhino", "Camel", "Tiger"]),
    c("dzoo2", "Which animal has a long neck and spotted coat?", ["Giraffe", "Zebra", "Leopard", "Camel", "Llama", "Horse", "Elephant", "Cheetah"]),
    c("dzoo3", "Which zoo animal has a hump (or two) for storing fat?", ["Camel", "Horse", "Bison", "Zebra", "Rhino", "Hippo", "Gorilla", "Moose"]),
    c("dzoo4", "A group of flamingos is called a:", ["Flamboyance", "Pride", "Pack", "School", "Herd", "Troop", "Gaggle", "Parade"]),
  ]),
  cat("ANIMAL SOUNDS", [
    c("dsou0", "Which animal says \"oink\"?", ["Pig", "Cow", "Sheep", "Horse", "Dog", "Cat", "Goat", "Duck"]),
    c("dsou1", "Which animal says \"baa\"?", ["Sheep", "Cow", "Pig", "Horse", "Dog", "Cat", "Owl", "Rooster"]),
    c("dsou2", "Which animal says \"neigh\"?", ["Horse", "Cow", "Pig", "Sheep", "Dog", "Cat", "Duck", "Frog"]),
    c("dsou3", "Which animal says \"ribbit\"?", ["Frog", "Turtle", "Duck", "Cow", "Cat", "Dog", "Owl", "Bee"]),
    c("dsou4", "What is a lion's loud sound called?", ["Roar", "Bark", "Chirp", "Buzz", "Hiss", "Quack", "Howl", "Squeak"]),
  ]),
  cat("AMAZING FACTS", [
    c("dfac0", "Which is the biggest land animal?", ["African elephant", "Rhino", "Hippo", "Giraffe", "Bison", "Moose", "Brown bear", "Gorilla"]),
    c("dfac1", "Which sleepy animal hangs upside down from trees and moves very slowly?", ["Sloth", "Koala", "Monkey", "Lemur", "Panda", "Bat", "Possum", "Raccoon"]),
    c("dfac2", "A group of owls is called a:", ["Parliament", "Herd", "School", "Pride", "Pod", "Swarm", "Troop", "Pack"]),
    c("dfac3", "An elephant's trunk is a combined nose and:", ["Upper lip", "Eyebrow", "Tongue", "Ear", "Tail", "Toe", "Whisker", "Chin"]),
    c("dfac4", "A newborn panda is about the size of a:", ["Stick of butter", "Baseball bat", "Dog", "Pillow", "Basketball", "Watermelon", "Cat", "Bowling ball"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "ANIMAL KINGDOM",
  prompt: "Which animal is the only mammal that can truly fly?",
  choices: ["Bat", "Flying squirrel", "Sugar glider", "Flying fish", "Colugo", "Pterodactyl", "Hummingbird", "Owl"],
  correctIndex: 0,
};

export const KIDS_ANIMALS_PACK: TriviaPack = {
  id: "kids-animals",
  audience: "kids",
  title: "Animal Safari",
  tagline: "Pets, farms, zoos, and wild critters",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
