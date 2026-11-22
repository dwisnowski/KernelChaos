import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("PRINCESSES", [
    c("spri0", "Which princess lost a glass slipper at the ball?", ["Cinderella", "Snow White", "Sleeping Beauty", "Rapunzel", "Belle", "Ariel", "Jasmine", "Merida"]),
    c("spri1", "Which princess ate a poisoned apple?", ["Snow White", "Cinderella", "Sleeping Beauty", "Rapunzel", "Belle", "Ariel", "Jasmine", "Tiana"]),
    c("spri2", "Which princess has very long golden hair and lives in a tower?", ["Rapunzel", "Cinderella", "Snow White", "Sleeping Beauty", "Belle", "Ariel", "Jasmine", "Mulan"]),
    c("spri3", "Which princess pricked her finger on a spinning wheel and slept for a hundred years?", ["Sleeping Beauty", "Cinderella", "Snow White", "Rapunzel", "Belle", "Ariel", "Jasmine", "Tiana"]),
    c("spri4", "Which story has a princess who could not sleep because of a tiny pea under her mattresses?", ["The Princess and the Pea", "Cinderella", "Snow White", "Thumbelina", "Rapunzel", "The Frog Prince", "Sleeping Beauty", "The Little Mermaid"]),
  ]),
  cat("ANIMAL TALES", [
    c("sani0", "In the story, who huffs and puffs to blow the house down?", ["The wolf", "The bear", "The fox", "The troll", "The giant", "The dragon", "The witch", "The lion"]),
    c("sani1", "How many little pigs are in the famous story?", ["Three", "Two", "Four", "Five", "Seven", "One", "Six", "Ten"]),
    c("sani2", "Which animal became a handsome prince after a kiss?", ["Frog", "Toad", "Bear", "Swan", "Lion", "Wolf", "Fox", "Cat"]),
    c("sani3", "In The Ugly Duckling, the duckling grows up to be a:", ["Swan", "Goose", "Eagle", "Peacock", "Flamingo", "Chicken", "Penguin", "Heron"]),
    c("sani4", "Which clever cat wears fancy boots and helps his master become rich?", ["Puss in Boots", "Tom the Cat", "Garfield", "Felix", "Salem", "Crookshanks", "Cheshire Cat", "Sylvester"]),
  ]),
  cat("GOLDILOCKS & FRIENDS", [
    c("sgol0", "Goldilocks visits the house of which family?", ["The three bears", "The three pigs", "The three kittens", "The seven dwarfs", "The three wolves", "The three goats", "The three mice", "The three owls"]),
    c("sgol1", "In Goldilocks, which porridge was just right?", ["Baby Bear's", "Papa Bear's", "Mama Bear's", "All of them", "None of them", "Goldilocks' own", "The neighbor's", "The wolf's"]),
    c("sgol2", "In Hansel and Gretel, what is the witch's house made of?", ["Candy and gingerbread", "Stone", "Straw", "Wood only", "Glass", "Ice", "Bricks", "Mud"]),
    c("sgol3", "In Jack and the Beanstalk, what does Jack trade for magic beans?", ["His cow", "His horse", "His dog", "His hat", "His boots", "His sheep", "His wagon", "His goat"]),
    c("sgol4", "In Little Red Riding Hood, where is the girl taking a basket of treats?", ["To her grandmother's house", "To school", "To the castle", "To the market", "To a party", "To the lake", "To a farm", "To a library"]),
  ]),
  cat("MAGIC STUFF", [
    c("smag0", "What do you wave to cast a spell?", ["A magic wand", "A spoon", "A banana", "A paintbrush", "A pillow", "A towel", "A flag", "A whistle"]),
    c("smag1", "In Cinderella, what does the fairy godmother turn into a coach?", ["A pumpkin", "A carrot", "A potato", "A watermelon", "An apple", "A tomato", "A cabbage", "A radish"]),
    c("smag2", "In Aladdin, a genie lives in a magic:", ["Lamp", "Bottle", "Carpet", "Mirror", "Ring", "Hat", "Boot", "Teapot"]),
    c("smag3", "How many wishes does a genie usually grant in stories?", ["Three", "One", "Five", "Seven", "Ten", "Two", "Four", "Twelve"]),
    c("smag4", "In Snow White, the evil queen asks a magic:", ["Mirror", "Lamp", "Book", "Crystal ball", "Wand", "Teapot", "Candle", "Window"]),
  ]),
  cat("CASTLES & KINGS", [
    c("scas0", "Who lives in a castle and wears a crown?", ["A king or queen", "A farmer", "A baker", "A sailor", "A shepherd", "A knight only", "A troll", "A chef"]),
    c("scas1", "A big stone building with towers and a moat is a:", ["Castle", "Barn", "Hut", "Igloo", "Skyscraper", "Tent", "Cabin", "Lighthouse"]),
    c("scas2", "What is water around a castle called?", ["A moat", "A pond", "A fountain", "A puddle", "A lake", "A well", "A stream", "A bath"]),
    c("scas3", "A brave soldier in shining armor is called a:", ["Knight", "Jester", "Baker", "Wizard", "Scribe", "Troll", "Giant", "Pirate"]),
    c("scas4", "Which fairy tale creature guards treasure and breathes fire?", ["Dragon", "Troll", "Giant", "Unicorn", "Elf", "Goblin", "Mermaid", "Fairy"]),
  ]),
  cat("STORYTELLERS", [
    c("ssto0", "Which phrase starts many fairy tales?", ["Once upon a time", "Meanwhile", "Breaking news", "Ready, set, go", "In conclusion", "Long ago and far away only", "The end", "Dear diary"]),
    c("ssto1", "Which phrase ends many fairy tales?", ["Happily ever after", "To be continued", "Never again", "The beginning", "Good night", "Hurry home", "And so it began", "Stay tuned"]),
    c("ssto2", "The Brothers Grimm were from which country?", ["Germany", "France", "England", "Italy", "Spain", "Russia", "Sweden", "Japan"]),
    c("ssto3", "Hans Christian Andersen wrote The Little Mermaid. He was from:", ["Denmark", "Germany", "France", "England", "Norway", "Italy", "Spain", "Sweden"]),
    c("ssto4", "Which Frenchman wrote Cinderella and Puss in Boots?", ["Charles Perrault", "Jacob Grimm", "Hans Christian Andersen", "Roald Dahl", "Dr. Seuss", "Aesop", "Lewis Carroll", "Beatrix Potter"]),
  ]),
];

const DOUBLE = [
  cat("SEVEN AND THREE", [
    c("dnum0", "How many dwarfs help Snow White?", ["Seven", "Three", "Five", "Six", "Eight", "Four", "Nine", "Ten"]),
    c("dnum1", "How many princesses are in The Twelve Dancing Princesses?", ["Twelve", "Ten", "Seven", "Three", "Six", "Nine", "Five", "Twenty"]),
    c("dnum2", "How many Billy Goats Gruff cross the bridge?", ["Three", "Two", "Four", "Five", "One", "Seven", "Six", "Ten"]),
    c("dnum3", "Who lives under the bridge in Billy Goats Gruff?", ["A troll", "A giant", "A dragon", "A wolf", "A witch", "A bear", "A goblin", "A fox"]),
    c("dnum4", "At what time does Cinderella's magic wear off?", ["Midnight", "Noon", "Dawn", "Dusk", "Bedtime", "Sunrise", "Teatime", "Breakfast"]),
  ]),
  cat("NURSERY RHYMES", [
    c("dnur0", "Twinkle, twinkle, little ___", ["Star", "Moon", "Bug", "Sun", "Cloud", "Bird", "Fish", "Light"]),
    c("dnur1", "Humpty Dumpty sat on a:", ["Wall", "Chair", "Fence", "Roof", "Bridge", "Tree", "Boat", "Rock"]),
    c("dnur2", "Mary had a little:", ["Lamb", "Cat", "Dog", "Cow", "Pig", "Bird", "Horse", "Mouse"]),
    c("dnur3", "Jack and Jill went up the hill to fetch a pail of:", ["Water", "Milk", "Juice", "Sand", "Apples", "Honey", "Soup", "Paint"]),
    c("dnur4", "Who put in her thumb and pulled out a plum?", ["Little Jack Horner", "Little Bo Peep", "Little Miss Muffet", "Little Boy Blue", "Jack Sprat", "Old King Cole", "Simple Simon", "Humpty Dumpty"]),
  ]),
  cat("OTHER FAIRY FOLK", [
    c("dfol0", "Which fairy tale star has a nose that grows when he tells a lie?", ["Pinocchio", "Peter Pan", "Aladdin", "Hansel", "Jack", "Tom Thumb", "Puss in Boots", "Rapunzel"]),
    c("dfol1", "Who made a wooden puppet that came to life?", ["Geppetto", "Merlin", "Peter", "Santa", "Gandalf", "Grimm", "Andersen", "Perrault"]),
    c("dfol2", "Which tiny girl is born inside a flower?", ["Thumbelina", "Tinker Bell", "Alice", "Dorothy", "Heidi", "Pippi", "Wendy", "Gretel"]),
    c("dfol3", "In Rumpelstiltskin, he spins straw into:", ["Gold", "Silk", "Wool", "Rope", "Thread", "Silver", "Jewels", "Cloth"]),
    c("dfol4", "Who plays a magic pipe to lead rats out of town?", ["The Pied Piper", "Peter Pan", "Pinocchio", "Aladdin", "Hansel", "The Frog Prince", "Merlin", "Jack"]),
  ]),
  cat("STORY CHARACTERS", [
    c("dcha0", "Who runs away in the story and says \"You can't catch me, I'm the Gingerbread Man!\"?", ["The Gingerbread Man", "Pinocchio", "Peter Pan", "Jack", "Tom Thumb", "Humpty Dumpty", "Puss in Boots", "Aladdin"]),
    c("dcha1", "Who is the heroine of Beauty and the Beast?", ["Belle", "Cinderella", "Aurora", "Jasmine", "Ariel", "Mulan", "Tiana", "Rapunzel"]),
    c("dcha2", "In Beauty and the Beast, the Beast's life depends on a magic:", ["Rose", "Mirror", "Lamp", "Book", "Wand", "Crown", "Clock", "Candle"]),
    c("dcha3", "In The Little Mermaid, what does the mermaid trade to the sea witch?", ["Her voice", "Her crown", "Her hair", "Her ring", "Her shell", "Her fish friend", "Her shoes", "Her treasure"]),
    c("dcha4", "In The Emperor's New Clothes, the emperor is tricked into wearing clothes that are:", ["Invisible", "Gold", "Too tight", "Heavy", "Itchy", "Rainbow", "Too big", "Wet"]),
  ]),
  cat("BAD GUYS (STORY EDITION)", [
    c("dbad0", "Which animal is the \"big bad\" in Little Red Riding Hood?", ["Wolf", "Bear", "Fox", "Snake", "Tiger", "Lion", "Crocodile", "Spider"]),
    c("dbad1", "Who does Cinderella have to live with that is unkind?", ["Her stepmother", "Her grandmother", "Her aunt", "Her cousin", "Her teacher", "Her neighbor", "Her mother", "Her best friend"]),
    c("dbad2", "In Sleeping Beauty, which fairy casts the sleeping curse?", ["Maleficent", "Flora", "Fauna", "Merryweather", "Tinker Bell", "Cruella", "Ursula", "Glinda"]),
    c("dbad3", "In Jack and the Beanstalk, who lives at the top of the beanstalk?", ["A giant", "A dragon", "A troll", "A witch", "A wizard", "A bear", "A fairy", "A wolf"]),
    c("dbad4", "In Snow White, who is the villain?", ["The evil queen", "The wolf", "The troll", "The dragon", "The goblin", "The sea witch", "The giant", "The ogre"]),
  ]),
  cat("HAPPY ENDINGS", [
    c("dhap0", "How do most fairy tales end?", ["Happily ever after", "With a storm", "In space", "With a cliffhanger", "With a nap", "With a pizza", "With a flood", "With a long list"]),
    c("dhap1", "What breaks the curse in Sleeping Beauty?", ["A kiss", "A song", "A wand", "A potion", "A ring", "A spell book", "A mirror", "A bell"]),
    c("dhap2", "Who helps Cinderella go to the ball?", ["Her fairy godmother", "Her stepsister", "A giant", "A troll", "A wizard", "A king", "A knight", "A witch"]),
    c("dhap3", "In The Ugly Duckling, the duckling feels happy when he finds out he is:", ["A beautiful swan", "A goose", "A chicken", "A rooster", "A crow", "A duck", "An owl", "A sparrow"]),
    c("dhap4", "Which fairy tale creature has a single horn and is white and shiny?", ["Unicorn", "Dragon", "Troll", "Elf", "Giant", "Gnome", "Goblin", "Centaur"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "ONCE UPON A TIME",
  prompt: "In Rumpelstiltskin, what must the queen guess to keep her baby?",
  choices: ["His name", "His age", "His home", "His favorite color", "His father's name", "His birthday", "His job", "His weight"],
  correctIndex: 0,
};

export const KIDS_FAIRY_TALES_PACK: TriviaPack = {
  id: "kids-fairy-tales",
  audience: "kids",
  title: "Fairy Tale Fun",
  tagline: "Princesses, giants, wolves, and happily ever after",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
