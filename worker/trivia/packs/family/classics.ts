import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("ANIMALS", [
    c("sani0", "Which mammal lays eggs?", ["Platypus", "Kangaroo", "Dolphin", "Bat", "Whale", "Otter", "Seal", "Beaver"]),
    c("sani1", "A group of lions is called a:", ["Pride", "Herd", "Pack", "Flock", "School", "Swarm", "Colony", "Pod"]),
    c("sani2", "How many legs does a spider have?", ["Eight", "Six", "Ten", "Four", "Twelve", "Two", "Hundred", "Zero"]),
    c("sani3", "Which bird cannot fly?", ["Penguin", "Eagle", "Sparrow", "Robin", "Hawk", "Owl", "Falcon", "Crow"]),
    c("sani4", "What do pandas mainly eat?", ["Bamboo", "Fish", "Insects", "Fruit", "Meat", "Grass", "Nuts", "Berries"]),
  ]),
  cat("SPACE", [
    c("sspa0", "Which planet is known for its rings?", ["Saturn", "Mars", "Venus", "Earth", "Mercury", "Jupiter", "Neptune", "Uranus"]),
    c("sspa1", "Our star is called the:", ["Sun", "Moon", "Mars", "Polaris", "Sirius", "Comet", "Galaxy", "Nebula"]),
    c("sspa2", "How many planets are in our solar system?", ["Eight", "Seven", "Nine", "Ten", "Six", "Five", "Twelve", "Eleven"]),
    c("sspa3", "The first person on the Moon was:", ["Neil Armstrong", "Buzz Aldrin", "Yuri Gagarin", "John Glenn", "Sally Ride", "Alan Shepard", "Jim Lovell", "Michael Collins"]),
    c("sspa4", "A light-year measures:", ["Distance", "Time", "Weight", "Speed", "Temperature", "Brightness", "Mass", "Force"]),
  ]),
  cat("FOOD", [
    c("sfoo0", "Which fruit keeps doctors away in the saying?", ["Apple", "Banana", "Orange", "Grape", "Pear", "Mango", "Peach", "Plum"]),
    c("sfoo1", "Sushi traditionally includes:", ["Rice", "Pasta", "Bread", "Potato", "Corn", "Beans", "Noodles", "Couscous"]),
    c("sfoo2", "What is tofu made from?", ["Soybeans", "Milk", "Eggs", "Wheat", "Corn", "Rice", "Nuts", "Peas"]),
    c("sfoo3", "Which cheese is often on pizza?", ["Mozzarella", "Swiss", "Blue", "Feta", "Goat", "Brie", "Cheddar only", "Ricotta only"]),
    c("sfoo4", "Honey is made by:", ["Bees", "Ants", "Wasps", "Flies", "Butterflies", "Beetles", "Moths", "Spiders"]),
  ]),
  cat("EARTH", [
    c("sear0", "The largest ocean is the:", ["Pacific", "Atlantic", "Indian", "Arctic", "Southern", "Mediterranean", "Caribbean", "Red"]),
    c("sear1", "Mount Everest is in the:", ["Himalayas", "Andes", "Rockies", "Alps", "Appalachians", "Urals", "Cascades", "Pyrenees"]),
    c("sear2", "What percent of Earth is covered by water (about)?", ["70%", "50%", "30%", "90%", "10%", "40%", "60%", "80%"]),
    c("sear3", "The Sahara is a:", ["Desert", "Forest", "Ocean", "Mountain", "River", "Glacier", "Prairie", "Tundra"]),
    c("sear4", "Earth's hard outer layer is the:", ["Crust", "Core", "Mantle", "Lava", "Magma", "Atmosphere", "Hydrosphere", "Biosphere"]),
  ]),
  cat("WORDS", [
    c("swor0", "Synonym of 'happy':", ["Joyful", "Angry", "Tired", "Silent", "Empty", "Broken", "Heavy", "Distant"]),
    c("swor1", "Antonym of 'hot':", ["Cold", "Warm", "Spicy", "Bright", "Loud", "Fast", "Tall", "New"]),
    c("swor2", "A noun is a:", ["Person, place, or thing", "Action word", "Describing word", "Connecting word", "Sound", "Number", "Color", "Feeling only"]),
    c("swor3", "Plural of 'child':", ["Children", "Childs", "Childes", "Childrens", "Kidses", "Offspring", "Youngs", "Childer"]),
    c("swor4", "'Quickly' is usually a(n):", ["Adverb", "Noun", "Verb", "Adjective", "Pronoun", "Preposition", "Article", "Conjunction"]),
  ]),
  cat("INVENTIONS", [
    c("sinv0", "Who is credited with the telephone?", ["Alexander Graham Bell", "Thomas Edison", "Nikola Tesla", "Benjamin Franklin", "Wright Brothers", "Steve Jobs", "Guglielmo Marconi", "Henry Ford"]),
    c("sinv1", "The Wright brothers invented a practical:", ["Airplane", "Car", "Radio", "Computer", "Submarine", "Helicopter", "Rocket", "Train"]),
    c("sinv2", "Paper was first made in ancient:", ["China", "Egypt", "Greece", "Rome", "India", "Japan", "Persia", "Mexico"]),
    c("sinv3", "A thermometer measures:", ["Temperature", "Speed", "Weight", "Distance", "Time", "Pressure only", "Sound", "Light"]),
    c("sinv4", "GPS helps you find:", ["Location", "Recipes", "Music", "Friends only", "Weather only", "Money", "Dreams", "Colors"]),
  ]),
];

const DOUBLE = [
  cat("MOVIES & TV (PG)", [
    c("dmov0", "In The Lion King, Simba is a:", ["Lion", "Tiger", "Bear", "Wolf", "Fox", "Panther", "Cheetah", "Leopard"]),
    c("dmov1", "Frozen's Elsa can control:", ["Ice", "Fire", "Wind only", "Earth", "Water only", "Lightning", "Shadows", "Time"]),
    c("dmov2", "Toy Story's cowboy toy is:", ["Woody", "Buzz", "Rex", "Hamm", "Slinky", "Jessie", "Bullseye", "Forky"]),
    c("dmov3", "Finding Nemo is mostly about a:", ["Clownfish", "Shark", "Turtle", "Dolphin", "Whale", "Seahorse", "Octopus", "Crab"]),
    c("dmov4", "Harry Potter's school is:", ["Hogwarts", "Beauxbatons", "Durmstrang", "Ilvermorny", "Brakebills", "Xavier's", "Castelobruxo", "Uagadou"]),
  ]),
  cat("SPORTS", [
    c("dspo0", "A soccer game is played with a:", ["Ball", "Puck", "Shuttlecock", "Bat", "Racket only", "Stick", "Disc", "Hoop"]),
    c("dspo1", "Olympic gold means:", ["First place", "Second", "Third", "Fourth", "Participant", "Coach", "Judge", "Fan"]),
    c("dspo2", "Basketball hoop height (NBA) is:", ["10 feet", "8 feet", "12 feet", "9 feet", "11 feet", "15 feet", "7 feet", "6 feet"]),
    c("dspo3", "Swimming races happen in a:", ["Pool", "Court", "Field", "Track only", "Rink", "Diamond", "Pitch", "Cage"]),
    c("dspo4", "A marathon is about how many miles?", ["26.2", "10", "13.1", "5", "50", "100", "1", "20"]),
  ]),
  cat("MUSIC", [
    c("dmus0", "A piano has black and:", ["White keys", "Red keys", "Blue keys", "Gold keys", "Strings only", "Pedals only", "Buttons", "Dials"]),
    c("dmus1", "How many strings does a standard guitar have?", ["Six", "Four", "Five", "Seven", "Eight", "Twelve", "Three", "Nine"]),
    c("dmus2", "The Beatles were from:", ["Liverpool", "London", "Manchester", "Dublin", "New York", "Paris", "Berlin", "Sydney"]),
    c("dmus3", "A conductor usually holds a:", ["Baton", "Mic", "Guitar", "Trumpet", "Violin", "Drumstick only", "Whistle", "Flag"]),
    c("dmus4", "forte in music means:", ["Loud", "Soft", "Fast", "Slow", "High", "Low", "Short", "Silent"]),
  ]),
  cat("HISTORY LITE", [
    c("dhis0", "The ancient pyramids are in:", ["Egypt", "Greece", "Italy", "Mexico only", "China only", "India", "Peru only", "Spain"]),
    c("dhis1", "The Great Wall is mainly in:", ["China", "Japan", "Korea", "Mongolia only", "Russia", "India", "Vietnam", "Thailand"]),
    c("dhis2", "Independence Day in the USA is:", ["July 4", "July 1", "June 4", "May 4", "August 4", "September 4", "December 25", "January 1"]),
    c("dhis3", "Vikings came from:", ["Scandinavia", "Spain", "Italy", "Egypt", "China", "Brazil", "Australia", "India"]),
    c("dhis4", "The printing press helped spread:", ["Books", "Cars", "Airplanes", "Phones", "Television", "Plastic", "Electricity", "Radio only"]),
  ]),
  cat("SCIENCE", [
    c("dsci0", "Water freezes at:", ["0°C / 32°F", "100°C", "50°C", "−10°C only", "212°F only", "Room temp", "Boiling point", "Absolute zero"]),
    c("dsci1", "Humans need which gas to breathe?", ["Oxygen", "Nitrogen", "Carbon dioxide", "Helium", "Hydrogen", "Neon", "Argon", "Ozone only"]),
    c("dsci2", "A tadpole becomes a:", ["Frog", "Fish", "Snake", "Bird", "Lizard", "Turtle", "Newt only", "Salamander only"]),
    c("dsci3", "Magnets attract:", ["Iron", "Wood", "Plastic", "Glass", "Rubber", "Paper", "Cotton", "Gold pure"]),
    c("dsci4", "The center of an atom is the:", ["Nucleus", "Electron", "Proton only", "Neutron only", "Quark shell", "Orbit", "Cloud", "Ring"]),
  ]),
  cat("AROUND THE WORLD", [
    c("daro0", "The capital of France is:", ["Paris", "Lyon", "Marseille", "Nice", "Bordeaux", "Toulouse", "Lille", "Nantes"]),
    c("daro1", "Which continent is Australia on?", ["Australia", "Asia", "Europe", "Africa", "South America", "North America", "Antarctica", "None"]),
    c("daro2", "Sushi is associated with:", ["Japan", "China", "Korea", "Thailand", "Vietnam", "India", "Mexico", "Italy"]),
    c("daro3", "The Amazon rainforest is mostly in:", ["South America", "Africa", "Asia", "Europe", "Australia", "North America", "Antarctica", "Arctic"]),
    c("daro4", "Eiffel Tower is in:", ["Paris", "London", "Rome", "Berlin", "Madrid", "Lisbon", "Vienna", "Brussels"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "FAMILY FUN",
  prompt: "Which board game uses a racecar token and properties?",
  choices: ["Monopoly", "Chess", "Checkers", "Scrabble", "Clue", "Sorry!", "Uno", "Jenga"],
  correctIndex: 0,
};

export const FAMILY_CLASSICS_PACK: TriviaPack = {
  id: "family-classics",
  audience: "family",
  title: "Family Classics",
  tagline: "General-knowledge fun for the whole living room",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
