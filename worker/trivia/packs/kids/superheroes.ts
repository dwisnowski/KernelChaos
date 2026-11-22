import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("SUPER POWERS", [
    c("spow0", "Which hero can fly and shoots heat from his eyes?", ["Superman", "Batman", "Spider-Man", "Iron Man", "Hulk", "Flash", "Aquaman", "Green Lantern"]),
    c("spow1", "Which hero can stick to walls and shoot webs?", ["Spider-Man", "Batman", "Superman", "Thor", "Hulk", "Flash", "Aquaman", "Hawkeye"]),
    c("spow2", "Which hero runs at super speed?", ["The Flash", "Superman", "Batman", "Thor", "Aquaman", "Hulk", "Black Panther", "Green Lantern"]),
    c("spow3", "Which hero is super strong and turns green when angry?", ["The Hulk", "Thor", "Captain America", "Iron Man", "Aquaman", "Green Lantern", "Hawkeye", "Ant-Man"]),
    c("spow4", "Which hero can talk to sea animals?", ["Aquaman", "Batman", "Superman", "Thor", "Hulk", "Spider-Man", "Flash", "Green Lantern"]),
  ]),
  cat("SECRET IDENTITIES", [
    c("side0", "Clark Kent is secretly which hero?", ["Superman", "Batman", "Spider-Man", "Iron Man", "Flash", "Aquaman", "Thor", "Hulk"]),
    c("side1", "Peter Parker is secretly which hero?", ["Spider-Man", "Batman", "Superman", "Iron Man", "Flash", "Hawkeye", "Thor", "Hulk"]),
    c("side2", "Bruce Wayne is secretly which hero?", ["Batman", "Superman", "Spider-Man", "Iron Man", "Flash", "Aquaman", "Thor", "Hulk"]),
    c("side3", "Tony Stark is secretly which hero?", ["Iron Man", "Batman", "Superman", "Spider-Man", "Flash", "Hulk", "Thor", "Captain America"]),
    c("side4", "Diana Prince is secretly which hero?", ["Wonder Woman", "Batgirl", "Supergirl", "Captain Marvel", "Black Widow", "Storm", "Catwoman", "Wasp"]),
  ]),
  cat("HERO GEAR", [
    c("sgea0", "What shape is on Superman's chest?", ["An S", "A bat", "A star", "A spider", "A lightning bolt", "A heart", "A circle", "A triangle"]),
    c("sgea1", "Captain America carries a:", ["Shield", "Hammer", "Bow", "Sword", "Staff", "Boomerang", "Bow and arrows", "Net"]),
    c("sgea2", "Thor swings a magic:", ["Hammer", "Sword", "Shield", "Bow", "Whip", "Staff", "Spear", "Net"]),
    c("sgea3", "Wonder Woman uses a golden:", ["Lasso", "Hammer", "Net", "Shield", "Bow", "Whip", "Boomerang", "Sword"]),
    c("sgea4", "Batman keeps his gadgets in a:", ["Utility belt", "Backpack", "Wallet", "Lunchbox", "Treasure chest", "Pocket watch", "Cape pocket", "Toolbox"]),
  ]),
  cat("SIDEKICKS & TEAMS", [
    c("ssid0", "Who is Batman's famous young sidekick?", ["Robin", "Aqualad", "Kid Flash", "Speedy", "Bucky", "Falcon", "Wonder Girl", "Spidey"]),
    c("ssid1", "Marvel's team of heroes is called the:", ["Avengers", "Justice League", "Power Rangers", "Teen Titans", "Fantastic Five", "Ninja Squad", "Super Friends", "Mighty Heroes"]),
    c("ssid2", "DC's team with Superman, Batman, and Wonder Woman is the:", ["Justice League", "Avengers", "X-Men", "Guardians", "Fantastic Four", "Power Rangers", "Teen Titans", "Minions"]),
    c("ssid3", "How many heroes are in the Fantastic Four?", ["Four", "Three", "Five", "Six", "Seven", "Two", "Eight", "Ten"]),
    c("ssid4", "Which Guardians of the Galaxy hero is a tree who only says three words?", ["Groot", "Rocket", "Drax", "Gamora", "Star-Lord", "Mantis", "Nebula", "Yondu"]),
  ]),
  cat("CITIES & HOMES", [
    c("scit0", "Which city does Superman protect?", ["Metropolis", "Gotham", "Wakanda", "Asgard", "Central City", "Atlantis", "Star City", "Springfield"]),
    c("scit1", "Which city does Batman protect?", ["Gotham City", "Metropolis", "New York", "Star City", "Central City", "Wakanda", "Atlantis", "Springfield"]),
    c("scit2", "Which hidden hero kingdom is home to Black Panther?", ["Wakanda", "Atlantis", "Asgard", "Themyscira", "Krypton", "Genovia", "Narnia", "Latveria"]),
    c("scit3", "Thor comes from which golden realm?", ["Asgard", "Wakanda", "Atlantis", "Krypton", "Metropolis", "Themyscira", "Midgard", "Olympus"]),
    c("scit4", "Wonder Woman grew up on which island?", ["Themyscira", "Atlantis", "Asgard", "Krypton", "Wakanda", "Neverland", "Hawaii", "Skull Island"]),
  ]),
  cat("MARVEL FRIENDS", [
    c("smar0", "Which hero is an iron suit with a genius inside?", ["Iron Man", "Thor", "Hawkeye", "Hulk", "Ant-Man", "Black Widow", "Captain America", "Falcon"]),
    c("smar1", "Which hero can shrink as small as an ant?", ["Ant-Man", "Spider-Man", "Hawkeye", "Hulk", "Falcon", "Iron Man", "Thor", "Vision"]),
    c("smar2", "Which hero is an expert archer?", ["Hawkeye", "Hulk", "Thor", "Iron Man", "Falcon", "Ant-Man", "Vision", "Doctor Strange"]),
    c("smar3", "Which wise hero casts spells in a red cape?", ["Doctor Strange", "Hulk", "Hawkeye", "Iron Man", "Thor", "Falcon", "Ant-Man", "Vision"]),
    c("smar4", "Which Spider-Man is a teen from Brooklyn named Miles?", ["Miles Morales", "Peter Parker", "Gwen Stacy", "Ned Leeds", "Harry Osborn", "Ben Reilly", "Eddie Brock", "Max Dillon"]),
  ]),
];

const DOUBLE = [
  cat("SPIDER-MAN", [
    c("dspi0", "How did Peter Parker get his powers?", ["A spider bite", "A lightning strike", "A magic potion", "A rocket ride", "A space rock", "A radioactive bath", "A gift from a wizard", "A birthday wish"]),
    c("dspi1", "Which uncle said \"With great power comes great responsibility\"?", ["Uncle Ben", "Uncle Bob", "Uncle Tony", "Uncle Sam", "Uncle Max", "Uncle Joe", "Uncle Phil", "Uncle Ted"]),
    c("dspi2", "Spider-Man's aunt is named:", ["Aunt May", "Aunt Jane", "Aunt Rose", "Aunt Lily", "Aunt Kate", "Aunt Pepper", "Aunt Anna", "Aunt Sue"]),
    c("dspi3", "Which girl hero is known as Ghost-Spider?", ["Gwen Stacy", "Mary Jane", "Pepper Potts", "Black Widow", "Wasp", "Storm", "Scarlet Witch", "Shuri"]),
    c("dspi4", "Which newspaper does Peter Parker take photos for?", ["The Daily Bugle", "The Daily Planet", "Gotham Gazette", "The Daily Star", "The Metropolis Times", "The Hero Herald", "The City Chronicle", "The Spider Post"]),
  ]),
  cat("BATMAN & GOTHAM", [
    c("dbat0", "What animal is Batman named after?", ["Bat", "Owl", "Eagle", "Spider", "Fox", "Wolf", "Tiger", "Panther"]),
    c("dbat1", "What is the name of Batman's car?", ["Batmobile", "Batcycle", "Batboat", "Batplane", "Batmachine", "Batbus", "Batjet", "Batcar"]),
    c("dbat2", "What is the name of Batman's secret hideout?", ["The Batcave", "The Fortress", "The Treehouse", "The Bunker", "The Bat Castle", "The Lair", "The Cave Den", "The Bat Barn"]),
    c("dbat3", "What is the name of Bruce Wayne's helpful butler?", ["Alfred", "Jarvis", "Edwin", "Winston", "Jeeves", "Bernard", "Walter", "Oswald"]),
    c("dbat4", "Which member of the Bat-Family is a girl?", ["Batgirl", "Robin", "Alfred", "Nightwing", "Red Hood", "Gordon", "Lucius", "Penguin"]),
  ]),
  cat("SUPERMAN & FRIENDS", [
    c("dsup0", "Which planet is Superman from?", ["Krypton", "Mars", "Earth", "Venus", "Jupiter", "Neptune", "Pluto", "Saturn"]),
    c("dsup1", "Which glowing green rock can weaken Superman?", ["Kryptonite", "Emerald", "Jade", "Gold", "Quartz", "Coal", "Granite", "Jewel"]),
    c("dsup2", "Superman's reporter friend at the Daily Planet is:", ["Lois Lane", "Jane Foster", "Pepper Potts", "Mary Jane", "Wanda", "Natasha", "Diana", "Selina"]),
    c("dsup3", "What is Superman's name on Krypton?", ["Kal-El", "Bruce Wayne", "Jor-Ob", "Clark-El", "Zod", "Lex", "Kal-Zor", "Jimmy"]),
    c("dsup4", "What does Superman wear that flaps behind him?", ["A cape", "A scarf", "A backpack", "A towel", "A poncho", "A banner", "A kite", "A sail"]),
  ]),
  cat("HEROES ON SCREEN", [
    c("dscr0", "In Spidey and His Amazing Friends, Spidey's teammates are Ghost-Spider and:", ["Spin", "Batman", "Superman", "Hulk", "Thor", "Hawkeye", "Flash", "Aquaman"]),
    c("dscr1", "In The Incredibles, which family member stretches like rubber?", ["Elastigirl (Helen)", "Mr. Incredible", "Dash", "Violet", "Jack-Jack", "Frozone", "Edna", "Syndrome"]),
    c("dscr2", "In The Incredibles, Dash is super:", ["Fast", "Tall", "Strong", "Loud", "Quiet", "Small", "Hot", "Cold"]),
    c("dscr3", "In PJ Masks, which hero wears a cat costume?", ["Catboy", "Owlette", "Gekko", "Batboy", "Foxboy", "Lionel", "Tigerboy", "Pantherboy"]),
    c("dscr4", "In The Incredibles, which family member can turn invisible?", ["Violet", "Dash", "Helen", "Bob", "Jack-Jack", "Frozone", "Mirage", "Syndrome"]),
  ]),
  cat("GOOD VS. BAD GUYS", [
    c("dvil0", "Which villain is Superman's bald genius enemy?", ["Lex Luthor", "Joker", "Green Goblin", "Loki", "Thanos", "Bane", "Penguin", "Riddler"]),
    c("dvil1", "Which Marvel trickster is Thor's brother?", ["Loki", "Odin", "Thanos", "Hulk", "Hawkeye", "Ultron", "Hela", "Red Skull"]),
    c("dvil2", "Which villain asks riddles in Gotham?", ["The Riddler", "The Penguin", "Joker", "Bane", "Catwoman", "Mr. Freeze", "Scarecrow", "Two-Face"]),
    c("dvil3", "Which Spider-Man villain has eight metal arms?", ["Doctor Octopus", "Green Goblin", "Sandman", "Vulture", "Lizard", "Electro", "Rhino", "Mysterio"]),
    c("dvil4", "Which Spider-Man villain can turn into sand?", ["Sandman", "Doctor Octopus", "Green Goblin", "Vulture", "Lizard", "Electro", "Rhino", "Mysterio"]),
  ]),
  cat("WORLD OF HEROES", [
    c("dwor0", "What color is Superman's cape?", ["Red", "Blue", "Green", "Yellow", "Purple", "Black", "Orange", "White"]),
    c("dwor1", "Which hero is the king of Wakanda?", ["Black Panther", "Batman", "Spider-Man", "Hawkeye", "Falcon", "Iron Man", "Thor", "Aquaman"]),
    c("dwor2", "Who is the Marvel hero who is a super-soldier from World War II?", ["Captain America", "Iron Man", "Thor", "Hulk", "Black Panther", "Spider-Man", "Falcon", "Hawkeye"]),
    c("dwor3", "Which hero rules the oceans?", ["Aquaman", "Superman", "Batman", "Thor", "Flash", "Hulk", "Green Lantern", "Black Panther"]),
    c("dwor4", "A Green Lantern gets his power from a magic:", ["Ring", "Hat", "Cape", "Boot", "Staff", "Mask", "Belt", "Glove"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "SUPER STAR",
  prompt: "What is the name of Thor's magic hammer?",
  choices: ["Mjolnir", "Stormbreaker", "Excalibur", "Gungnir", "Vibranium", "Aegis", "Thunderstrike", "Hammerfall"],
  correctIndex: 0,
};

export const KIDS_SUPERHEROES_PACK: TriviaPack = {
  id: "kids-superheroes",
  audience: "kids",
  title: "Superhero Showdown",
  tagline: "Marvel, DC, and big heroes for little fans",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
