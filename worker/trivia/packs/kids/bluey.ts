import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

// Unofficial fan trivia. Not affiliated with Ludo Studio, BBC Studios, or Disney.

const SINGLE = [
  cat("THE HEELERS", [
    c("shee0", "What kind of dog is Bluey?", ["Blue heeler", "Poodle", "Beagle", "Dalmatian", "Labrador", "Bulldog", "Pug", "Husky"]),
    c("shee1", "What is the name of Bluey's little sister?", ["Bingo", "Muffin", "Socks", "Coco", "Honey", "Chloe", "Rusty", "Indy"]),
    c("shee2", "What is Bluey's dad called?", ["Bandit", "Stripe", "Rad", "Bob", "Lucky", "Rusty", "Jack", "Winton"]),
    c("shee3", "What is Bandit's job?", ["Archaeologist", "Chef", "Pilot", "Teacher", "Vet", "Firefighter", "Doctor", "Astronaut"]),
    c("shee4", "Where does Bluey's mum, Chilli, work?", ["At the airport", "At a zoo", "At a bakery", "At a school", "At a hospital", "At a toy store", "At a farm", "At a library"]),
  ]),
  cat("SCHOOL FRIENDS", [
    c("sfri0", "Which of Bluey's friends is a Dalmatian?", ["Chloe", "Rusty", "Snickers", "Coco", "Honey", "Indy", "Mackenzie", "Winton"]),
    c("sfri1", "Rusty is what kind of dog?", ["Red kelpie", "Dachshund", "Poodle", "Beagle", "Pug", "Bulldog", "Greyhound", "Corgi"]),
    c("sfri2", "Snickers is what kind of dog?", ["Dachshund", "Dalmatian", "Poodle", "Beagle", "Pug", "Husky", "Corgi", "Greyhound"]),
    c("sfri3", "Honey is what kind of dog?", ["Beagle", "Poodle", "Pug", "Dalmatian", "Husky", "Corgi", "Bulldog", "Dachshund"]),
    c("sfri4", "Indy is what kind of dog?", ["Afghan hound", "Poodle", "Beagle", "Pug", "Husky", "Corgi", "Bulldog", "Dachshund"]),
  ]),
  cat("GAMES & EPISODES", [
    c("sgam0", "In \"Keepy Uppy\", the goal is to keep a what off the ground?", ["Balloon", "Football", "Feather", "Kite", "Frisbee", "Beach ball", "Paper plane", "Teddy bear"]),
    c("sgam1", "In \"Magic Xylophone\", what happens when Bandit plays it?", ["People freeze", "People dance", "People disappear", "People fall asleep", "People shrink", "People fly", "People laugh", "People turn blue"]),
    c("sgam2", "In \"Mount Mumanjaro\", who is the mountain?", ["Mum (Chilli)", "Dad (Bandit)", "Bluey", "Bingo", "Nana", "Uncle Stripe", "Muffin", "Calypso"]),
    c("sgam3", "In which episode does Bandit pretend to be a baby?", ["Dad Baby", "Daddy Robot", "Hide and Seek", "Keepy Uppy", "Grannies", "Camping", "Mount Mumanjaro", "Sleepytime"]),
    c("sgam4", "In \"Sleepytime\", Bingo dreams about traveling to:", ["Space", "The beach", "A farm", "A jungle", "The North Pole", "Underwater", "A castle", "The desert"]),
  ]),
  cat("AUSTRALIA & THE SHOW", [
    c("saus0", "Bluey is a TV show from which country?", ["Australia", "Canada", "United States", "Ireland", "New Zealand", "Japan", "Brazil", "France"]),
    c("saus1", "Which Australian city do the Heelers live in?", ["Brisbane", "Sydney", "Melbourne", "Perth", "Adelaide", "Darwin", "Canberra", "Hobart"]),
    c("saus2", "Blue heelers are also called Australian ___ dogs.", ["Cattle", "Kangaroo", "Emu", "Koala", "Wombat", "Crocodile", "Platypus", "Camel"]),
    c("saus3", "Which Aussie party treat is bread with butter and sprinkles?", ["Fairy bread", "Toast tower", "Rainbow roll", "Sprinkle bun", "Sweet sandwich", "Candy loaf", "Jam rolls", "Magic bread"]),
    c("saus4", "Who created Bluey?", ["Joe Brumm", "Walt Disney", "Dr. Seuss", "Pete Docter", "Jim Henson", "Hayao Miyazaki", "Eric Carle", "Beatrix Potter"]),
  ]),
  cat("FAMILY & COUSINS", [
    c("sfam0", "Which of Bluey's cousins is a toddler named after a baked treat?", ["Muffin", "Cookie", "Cupcake", "Brownie", "Biscuit", "Scone", "Donut", "Pretzel"]),
    c("sfam1", "What is Muffin's baby sister called?", ["Socks", "Bingo", "Frisky", "Trixie", "Honey", "Coco", "Mia", "Chloe"]),
    c("sfam2", "Who is Bandit's brother?", ["Stripe", "Rad", "Bob", "Pat", "Lucky", "Rusty", "Calypso", "Jack"]),
    c("sfam3", "Uncle Rad is Chilli's:", ["Brother", "Father", "Cousin", "Husband", "Son", "Grandfather", "Neighbor", "Teacher"]),
    c("sfam4", "Who is Uncle Rad's fiancée?", ["Frisky", "Trixie", "Chilli", "Nana", "Calypso", "Honey", "Coco", "Chloe"]),
  ]),
  cat("BINGO & BLUEY", [
    c("sbin0", "Bluey and Bingo are:", ["Sisters", "Cousins", "Neighbors", "Twins", "Classmates", "Aunt and niece", "Mother and daughter", "Pen pals"]),
    c("sbin1", "What color is Bingo's fur?", ["Reddish-brown", "Blue", "Green", "Purple", "Yellow", "Pink", "Black", "White"]),
    c("sbin2", "What silly word does Bluey sometimes shout when she is excited?", ["Wackadoo!", "Yippee-ki-yay!", "Abracadabra!", "Cowabunga!", "Zippity-zap!", "Gobbledygook!", "Hooray-ka-doo!", "Supercalifragilistic!"]),
    c("sbin3", "Who is Bluey's teacher?", ["Calypso", "Chilli", "Honey", "Trixie", "Frisky", "Nana", "Coco", "Poppy"]),
    c("sbin4", "Mackenzie, Bluey's classmate, moved from which country?", ["New Zealand", "Canada", "England", "Ireland", "Scotland", "South Africa", "India", "Japan"]),
  ]),
];

const DOUBLE = [
  cat("WHAT KIND OF DOG?", [
    c("dbre0", "Coco is what kind of dog?", ["Poodle", "Beagle", "Pug", "Dalmatian", "Husky", "Corgi", "Bulldog", "Dachshund"]),
    c("dbre1", "Chilli is what kind of dog?", ["Red heeler", "Blue heeler", "Poodle", "Beagle", "Labrador", "Pug", "Husky", "Bulldog"]),
    c("dbre2", "Mackenzie is what kind of dog?", ["Border collie", "Poodle", "Beagle", "Pug", "Husky", "Corgi", "Bulldog", "Dachshund"]),
    c("dbre3", "Lucky, the neighbor kid, is what kind of dog?", ["Golden retriever", "Poodle", "Beagle", "Pug", "Husky", "Corgi", "Bulldog", "Dachshund"]),
    c("dbre4", "Jack, Bluey's classmate, is what kind of dog?", ["Jack Russell terrier", "Poodle", "Beagle", "Pug", "Husky", "Corgi", "Bulldog", "Dachshund"]),
  ]),
  cat("HEELER HOME", [
    c("dhom0", "What is the Heelers' family last name?", ["Heeler", "Barker", "Woof", "Biscuit", "Paws", "Fetch", "Collie", "Terrier"]),
    c("dhom1", "What is Bluey's mum called?", ["Chilli", "Trixie", "Frisky", "Nana", "Calypso", "Honey", "Coco", "Indy"]),
    c("dhom2", "Who is Muffin and Socks's mum?", ["Trixie", "Chilli", "Frisky", "Nana", "Calypso", "Honey", "Coco", "Chloe"]),
    c("dhom3", "The Heelers live in a raised wooden house called a:", ["Queenslander", "Igloo", "Skyscraper", "Castle", "Cabin", "Barn", "Treehouse", "Lighthouse"]),
    c("dhom4", "Blue heelers were originally bred to herd:", ["Cattle", "Penguins", "Ducks", "Fish", "Chickens", "Kangaroos", "Bees", "Camels"]),
  ]),
  cat("EPISODES & EXTRAS", [
    c("dep0", "In which episode does Bandit act like a robot?", ["Daddy Robot", "Dad Baby", "Keepy Uppy", "Hide and Seek", "Grannies", "Camping", "The Sign", "Sleepytime"]),
    c("dep1", "In \"Camping\", Bluey makes a friend named:", ["Jean-Luc", "Jean-Paul", "Pierre", "Antoine", "Henri", "Marcel", "Louis", "Luc"]),
    c("dep2", "\"Bluey's Big Play\" is a live show on a:", ["Stage", "Football field", "Beach", "Boat", "Mountain", "Farm", "Playground slide", "Ice rink"]),
    c("dep3", "Which two cousins often visit the Heelers?", ["Muffin and Socks", "Bluey and Bingo", "Rusty and Chloe", "Coco and Honey", "Rad and Frisky", "Stripe and Trixie", "Jack and Winton", "Lucky and Indy"]),
    c("dep4", "Compared to normal Bluey episodes, \"The Sign\" is:", ["Much longer", "Much shorter", "The same length", "Silent", "In black and white", "A cartoon in space", "Only a song", "A cooking show"]),
  ]),
  cat("SHOW FACTS", [
    c("dsho0", "Bluey is a cartoon about a family of:", ["Dogs", "Cats", "Rabbits", "Pigs", "Bears", "Mice", "Penguins", "Monkeys"]),
    c("dsho1", "In which year did Bluey first air?", ["2018", "1998", "2008", "2012", "2022", "2015", "1990", "2025"]),
    c("dsho2", "About how long is a typical Bluey episode?", ["Seven minutes", "One minute", "Twenty minutes", "One hour", "Two hours", "Thirty seconds", "Three hours", "Forty minutes"]),
    c("dsho3", "Which Australian studio makes Bluey?", ["Ludo Studio", "Pixar", "DreamWorks", "Studio Ghibli", "Aardman", "Illumination", "Blue Sky", "Laika"]),
    c("dsho4", "Which Australian TV channel first aired Bluey?", ["ABC Kids", "Nickelodeon", "Cartoon Network", "PBS Kids", "CBeebies", "Disney XD", "Boomerang", "Sprout"]),
  ]),
  cat("FAMILY GAMES", [
    c("dpla0", "In hide and seek, the seeker closes their eyes and:", ["Counts", "Sings", "Dances", "Naps", "Reads", "Paints", "Eats", "Swims"]),
    c("dpla1", "In musical statues, what do you do when the music stops?", ["Freeze", "Run away", "Jump up and down", "Sit down", "Clap", "Shout", "Spin around", "Hide"]),
    c("dpla2", "In pass the parcel, you unwrap one layer of:", ["Wrapping paper", "Pie crust", "Wool", "Bark", "Sand", "Snow", "Fur", "Tin foil"]),
    c("dpla3", "In charades, you act out clues without:", ["Talking", "Moving", "Smiling", "Standing", "Thinking", "Hands", "Friends", "Blinking"]),
    c("dpla4", "In a game of tag, the chaser is called:", ["It", "Boss", "King", "Seeker", "Captain", "Hunter", "Runner", "Winner"]),
  ]),
  cat("DOG DAYS", [
    c("ddog0", "Dogs wag their:", ["Tails", "Ears", "Noses", "Paws only", "Whiskers", "Elbows", "Teeth", "Knees"]),
    c("ddog1", "A baby dog is called a:", ["Puppy", "Kitten", "Cub", "Calf", "Foal", "Chick", "Lamb", "Kid"]),
    c("ddog2", "Which sense is strongest in dogs?", ["Smell", "Sight", "Taste", "Touch", "Color vision", "Telepathy", "Echolocation", "Magnetism"]),
    c("ddog3", "Dalmatian puppies are born:", ["All white", "With spots", "Completely black", "Brown", "Orange", "Striped", "Blue", "Gold"]),
    c("ddog4", "A group of puppies born together is called a:", ["Litter", "Flock", "Pride", "School", "Herd", "Pod", "Swarm", "Troop"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "BLUEY MASTER",
  prompt: "Which episode ends with Rad and Frisky getting married?",
  choices: ["The Sign", "Keepy Uppy", "Sleepytime", "Camping", "Dad Baby", "Mount Mumanjaro", "Daddy Robot", "Grannies"],
  correctIndex: 0,
};

export const KIDS_BLUEY_PACK: TriviaPack = {
  id: "kids-bluey",
  audience: "kids",
  title: "Bluey Fan Trivia",
  tagline: "Fan trivia for Heeler fans (unofficial)",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
