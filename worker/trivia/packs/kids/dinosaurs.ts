import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("FAMOUS DINOS", [
    c("sfam0", "Which dinosaur is called the \"tyrant lizard king\"?", ["Tyrannosaurus rex", "Triceratops", "Stegosaurus", "Velociraptor", "Brachiosaurus", "Diplodocus", "Ankylosaurus", "Spinosaurus"]),
    c("sfam1", "Which dinosaur has three horns on its face?", ["Triceratops", "Stegosaurus", "T. rex", "Velociraptor", "Diplodocus", "Ankylosaurus", "Allosaurus", "Spinosaurus"]),
    c("sfam2", "Which dinosaur has big plates along its back?", ["Stegosaurus", "Triceratops", "T. rex", "Velociraptor", "Brachiosaurus", "Allosaurus", "Spinosaurus", "Iguanodon"]),
    c("sfam3", "Which dinosaur had a club on the end of its tail?", ["Ankylosaurus", "Triceratops", "T. rex", "Velociraptor", "Stegosaurus", "Diplodocus", "Spinosaurus", "Allosaurus"]),
    c("sfam4", "Which dinosaur had a giant sail on its back and ate fish?", ["Spinosaurus", "Triceratops", "T. rex", "Stegosaurus", "Diplodocus", "Ankylosaurus", "Iguanodon", "Allosaurus"]),
  ]),
  cat("EATERS", [
    c("seat0", "Dinosaurs that ate only plants are called:", ["Herbivores", "Carnivores", "Omnivores", "Insectivores", "Predators", "Scavengers", "Hunters", "Pescatarians"]),
    c("seat1", "Dinosaurs that ate meat are called:", ["Carnivores", "Herbivores", "Omnivores", "Vegetarians", "Plant eaters", "Grazers", "Browsers", "Insectivores"]),
    c("seat2", "Which dinosaur ate plants?", ["Brachiosaurus", "T. rex", "Velociraptor", "Allosaurus", "Spinosaurus", "Utahraptor", "Giganotosaurus", "Carnotaurus"]),
    c("seat3", "Which dinosaur was a fierce meat eater?", ["Allosaurus", "Triceratops", "Stegosaurus", "Diplodocus", "Ankylosaurus", "Brachiosaurus", "Parasaurolophus", "Iguanodon"]),
    c("seat4", "Dinosaurs that ate both plants and meat are called:", ["Omnivores", "Herbivores", "Carnivores", "Insectivores", "Predators", "Browsers", "Grazers", "Scavengers"]),
  ]),
  cat("SIZE & SHAPE", [
    c("ssiz0", "Which dinosaur had a very long neck?", ["Brachiosaurus", "T. rex", "Triceratops", "Velociraptor", "Stegosaurus", "Ankylosaurus", "Allosaurus", "Spinosaurus"]),
    c("ssiz1", "T. rex had tiny:", ["Arms", "Legs", "Teeth", "Eyes", "Feet", "Tails", "Ears", "Toes"]),
    c("ssiz2", "Velociraptor was about the size of a:", ["Turkey", "Elephant", "Bus", "Mouse", "Giraffe", "Whale", "House", "Horse"]),
    c("ssiz3", "Argentinosaurus, one of the biggest dinosaurs ever, ate:", ["Plants", "Whales", "Other dinosaurs", "Fish", "Insects", "Birds", "Eggs", "Mammals"]),
    c("ssiz4", "Which tiny dinosaur was about the size of a chicken?", ["Compsognathus", "Brachiosaurus", "Argentinosaurus", "Triceratops", "Diplodocus", "Spinosaurus", "Allosaurus", "Stegosaurus"]),
  ]),
  cat("FOSSILS", [
    c("sfos0", "Scientists who study dinosaurs are called:", ["Paleontologists", "Astronomers", "Chefs", "Pilots", "Architects", "Botanists", "Meteorologists", "Librarians"]),
    c("sfos1", "A fossil is the preserved remains of:", ["Ancient life", "A new toy", "A sandwich", "A spaceship", "A cloud", "A car", "A tree house", "A snowman"]),
    c("sfos2", "Dinosaur bones are often found in:", ["Rock", "Water bottles", "Clouds", "Treetops", "Attics", "Cars", "Supermarkets", "Libraries"]),
    c("sfos3", "Who was a famous young fossil hunter in England in the 1800s?", ["Mary Anning", "Marie Curie", "Amelia Earhart", "Jane Goodall", "Rosa Parks", "Ada Lovelace", "Florence Nightingale", "Helen Keller"]),
    c("sfos4", "What are dinosaur footprints preserved in rock called?", ["Trackways", "Rock pools", "Sand castles", "Mud pies", "Fingerprints", "Crop circles", "Shadows", "Bubbles"]),
  ]),
  cat("TIME TRAVEL", [
    c("stim0", "Did people and dinosaurs live at the same time?", ["No", "Yes, always", "Only on islands", "Only in winter", "Only in deserts", "Only in the ocean", "Yes, on farms", "Only in cities"]),
    c("stim1", "About how long ago did the last non-bird dinosaurs die out?", ["66 million years ago", "66 years ago", "660 years ago", "6,600 years ago", "6 million years ago", "1 million years ago", "600 years ago", "6 billion years ago"]),
    c("stim2", "Which of these is the first dinosaur period?", ["Triassic", "Jurassic", "Cretaceous", "Pliocene", "Devonian", "Cambrian", "Ordovician", "Permian"]),
    c("stim3", "Jurassic Park is named after which period?", ["Jurassic", "Triassic", "Cretaceous", "Cambrian", "Permian", "Ordovician", "Devonian", "Silurian"]),
    c("stim4", "T. rex lived in which period?", ["Cretaceous", "Triassic", "Jurassic", "Cambrian", "Permian", "Devonian", "Ordovician", "Silurian"]),
  ]),
  cat("DINO BODIES", [
    c("sbod0", "What did baby dinosaurs hatch from?", ["Eggs", "Pods", "Seeds", "Cocoons", "Bubbles", "Nests only", "Shells", "Jars"]),
    c("sbod1", "Which part of a Stegosaurus had four spikes?", ["Tail", "Head", "Back foot", "Belly", "Neck", "Ear", "Nose", "Knee"]),
    c("sbod2", "Triceratops means \"three-horned\" what?", ["Face", "Tail", "Foot", "Back", "Eye", "Neck", "Toe", "Nose"]),
    c("sbod3", "Which dinosaur had a thick, bony dome on its head?", ["Pachycephalosaurus", "Triceratops", "Stegosaurus", "T. rex", "Velociraptor", "Diplodocus", "Spinosaurus", "Iguanodon"]),
    c("sbod4", "Many dinosaurs had feathers. Which dinosaur is famous for being feathered?", ["Velociraptor", "Triceratops", "Stegosaurus", "Ankylosaurus", "Diplodocus", "Brachiosaurus", "Iguanodon", "Edmontosaurus"]),
  ]),
];

const DOUBLE = [
  cat("SKY & SEA REPTILES", [
    c("dsky0", "Flying reptiles from dinosaur times are called:", ["Pterosaurs", "Dragons", "Dragonflies", "Bats", "Eagles", "Griffins", "Birds", "Gliders"]),
    c("dsky1", "A giant sea reptile with a long neck and flippers was a:", ["Plesiosaur", "Stegosaurus", "T. rex", "Triceratops", "Velociraptor", "Brachiosaurus", "Spinosaurus", "Diplodocus"]),
    c("dsky2", "Which huge sea reptile was like a giant lizard of the ocean?", ["Mosasaurus", "Triceratops", "Stegosaurus", "T. rex", "Velociraptor", "Diplodocus", "Allosaurus", "Spinosaurus"]),
    c("dsky3", "Pterosaurs and sea reptiles were not true:", ["Dinosaurs", "Reptiles", "Animals", "Extinct", "Ancient", "Prehistoric", "Fossil finds", "Meat eaters"]),
    c("dsky4", "Quetzalcoatlus was one of the biggest pterosaurs. How did it travel?", ["It flew", "It swam", "It dug", "It galloped", "It climbed trees only", "It hopped", "It slithered", "It glided underwater"]),
  ]),
  cat("DINO NAMES", [
    c("dnam0", "\"Dinosaur\" means \"terrible\" or \"fearfully great\" what?", ["Lizard", "Bird", "Fish", "Frog", "Snake", "Turtle", "Bug", "Worm"]),
    c("dnam1", "Tyrannosaurus rex is often shortened to:", ["T. rex", "T. R.", "Rex T.", "Tyro", "Tri", "Ty", "Rexo", "Saurus"]),
    c("dnam2", "Maiasaura means \"good mother\" lizard because it:", ["Cared for its babies", "Was very tall", "Ate lots of plants", "Could fly", "Lived in the sea", "Had a long tail", "Was very fast", "Had horns"]),
    c("dnam3", "Which dinosaur's name means \"fast thief\"?", ["Velociraptor", "Triceratops", "Stegosaurus", "T. rex", "Diplodocus", "Brachiosaurus", "Allosaurus", "Ankylosaurus"]),
    c("dnam4", "What does Brachiosaurus mean?", ["Arm lizard", "Tail lizard", "Horn lizard", "Plate lizard", "Sail lizard", "Neck lizard", "Wing lizard", "Fast lizard"]),
  ]),
  cat("DINOS TODAY", [
    c("dtod0", "Which modern animals are the living relatives of dinosaurs?", ["Birds", "Dogs", "Cats", "Horses", "Frogs", "Fish", "Bats", "Cows"]),
    c("dtod1", "A chicken is most closely related to which dinosaur?", ["T. rex", "Triceratops", "Stegosaurus", "Brachiosaurus", "Diplodocus", "Ankylosaurus", "Spinosaurus", "Allosaurus"]),
    c("dtod2", "Which modern animal looks like a small dinosaur but is a lizard?", ["Komodo dragon", "Chicken", "Parrot", "Frog", "Snake", "Turtle", "Penguin", "Gecko"]),
    c("dtod3", "Crocodiles are alive today and look a lot like:", ["Ancient reptiles", "Dolphins", "Birds only", "Mammals", "Fish only", "Insects", "Worms", "Cats"]),
    c("dtod4", "Archaeopteryx is famous as an early:", ["Feathered bird-like dinosaur", "Whale", "Fish", "Bat", "Insect", "Mammal", "Turtle", "Sea star"]),
  ]),
  cat("DINO MOVIES & SHOWS", [
    c("dmov0", "In The Land Before Time, Littlefoot is a:", ["Apatosaurus (longneck)", "T. rex", "Triceratops", "Velociraptor", "Stegosaurus", "Ankylosaurus", "Pterodactyl", "Parasaurolophus"]),
    c("dmov1", "In the show Dinosaur Train, what do the dinosaurs ride?", ["A train", "A boat", "A plane", "A car", "A rocket", "A bike", "A bus", "A hot air balloon"]),
    c("dmov2", "In The Good Dinosaur, the dinosaur's name is:", ["Arlo", "Sam", "Rex", "Spike", "Max", "Leo", "Ted", "Danny"]),
    c("dmov3", "In the Toy Story movies, which toy dinosaur is shy and green?", ["Rex", "Trixie", "Buzz", "Woody", "Slinky", "Hamm", "Bullseye", "Jessie"]),
    c("dmov4", "In Jurassic Park, what are the dinosaurs brought back from?", ["DNA", "Seeds", "Snow", "Magic", "Rocks", "Paintings", "Candy", "Toy models"]),
  ]),
  cat("MUSEUM VISIT", [
    c("dmus0", "People digging for fossils at a site are on a:", ["Dig", "Parade", "Picnic", "Race", "Hike", "Voyage", "Safari", "Cruise"]),
    c("dmus1", "Which famous T. rex skeleton lives at the Field Museum in Chicago?", ["Sue", "Bob", "Stan", "Tina", "Jack", "Rex", "Ted", "Max"]),
    c("dmus2", "A scientist's brush is used to:", ["Gently clean fossils", "Paint dinosaurs", "Brush teeth", "Groom dinosaurs", "Draw maps", "Mix paint", "Clean windows", "Sweep floors"]),
    c("dmus3", "Fossilized tree sap that sometimes traps insects is called:", ["Amber", "Granite", "Marble", "Coal", "Ruby", "Quartz", "Gypsum", "Chalk"]),
    c("dmus4", "What is a replica of a dinosaur skeleton made of plaster called?", ["A cast", "A wall", "A rock", "A dig", "A shell", "A map", "A grid", "A tube"]),
  ]),
  cat("AMAZING DINO FACTS", [
    c("dama0", "Which dinosaur's name means \"roof lizard\"?", ["Stegosaurus", "Triceratops", "T. rex", "Velociraptor", "Diplodocus", "Allosaurus", "Spinosaurus", "Ankylosaurus"]),
    c("dama1", "About how many teeth did a T. rex have?", ["About 60", "About 6", "About 600", "About 6,000", "About 12", "About 2", "About 24", "About 1,000"]),
    c("dama2", "Dinosaur eggs were laid in:", ["Nests", "Trees only", "Water only", "Caves only", "Jars", "Boxes", "Pockets", "Snowdrifts"]),
    c("dama3", "How did scientists learn dinosaurs may have had feathers?", ["From fossils", "From photographs", "From old films", "From toy models", "From drawings by kids", "From ancient maps", "From sound recordings", "From storybooks"]),
    c("dama4", "A giant space rock hitting Earth may have helped end the dinosaurs. It is called an:", ["Asteroid", "Comet's tail", "Moon rock", "Sun rock", "Planet", "Star", "Black hole", "Meteor shower"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "DINOSAUR EXPERT",
  prompt: "What do we call the long-necked plant eaters like Diplodocus and Brachiosaurus?",
  choices: ["Sauropods", "Theropods", "Ceratopsians", "Ankylosaurs", "Stegosaurs", "Raptors", "Pterosaurs", "Ornithopods"],
  correctIndex: 0,
};

export const KIDS_DINOSAURS_PACK: TriviaPack = {
  id: "kids-dinosaurs",
  audience: "kids",
  title: "Dino Discovery",
  tagline: "T. rex, Triceratops, fossils, and prehistoric fun",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
