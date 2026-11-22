import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("DISNEY CLASSICS", [
    c("mvs00", "In Cinderella, the Fairy Godmother turns a pumpkin into a:", ["Coach", "Boat", "Castle", "Horse", "Dress", "Carousel", "Train", "Balloon"]),
    c("mvs01", "In The Little Mermaid, what is the young mermaid princess named?", ["Ariel", "Belle", "Jasmine", "Aurora", "Tiana", "Mulan", "Rapunzel", "Moana"]),
    c("mvs02", "Which Disney film follows a boy named Mowgli raised by wolves?", ["The Jungle Book", "Tarzan", "Bambi", "The Lion King", "Pinocchio", "Dumbo", "Robin Hood", "Peter Pan"]),
    c("mvs03", "Which Disney character is a baby elephant who learns to fly with his big ears?", ["Dumbo", "Babar", "Horton", "Elmer", "Tantor", "Colonel Hathi", "Heffalump", "Stampy"]),
    c("mvs04", "Which was Disney's first full-length animated feature film, released in 1937?", ["Snow White and the Seven Dwarfs", "Pinocchio", "Fantasia", "Bambi", "Cinderella", "Sleeping Beauty", "Dumbo", "Alice in Wonderland"]),
  ]),
  cat("PIXAR", [
    c("mvs10", "What kind of toy is Buzz Lightyear?", ["Space Ranger", "Cowboy", "Robot dog", "Dinosaur", "Race car", "Army man", "Piggy bank", "Etch A Sketch"]),
    c("mvs11", "In Finding Nemo, what kind of fish is forgetful Dory?", ["Blue tang", "Clownfish", "Angelfish", "Pufferfish", "Seahorse", "Goldfish", "Guppy", "Barracuda"]),
    c("mvs12", "In Up, what lifts Carl's house into the sky?", ["Balloons", "Rockets", "A tornado", "Giant kites", "Helicopter blades", "Birds", "A hot-air burner", "Magic dust"]),
    c("mvs13", "In Ratatouille, what is the name of the rat who dreams of being a chef?", ["Remy", "Emile", "Linguini", "Skinner", "Django", "Gusteau", "Colette", "Anton"]),
    c("mvs14", "In Monsters, Inc., the monsters discover which energy is more powerful than screams?", ["Laughter", "Singing", "Dancing", "Whispers", "Sneezes", "Hugs", "Snoring", "Clapping"]),
  ]),
  cat("FAMILY LIVE-ACTION", [
    c("mvs20", "In The Wizard of Oz, Dorothy follows what color road?", ["Yellow brick", "Red brick", "Emerald stone", "Silver cobble", "Blue tile", "Golden gravel", "Purple dirt", "White marble"]),
    c("mvs21", "What does Mary Poppins use to float down to the Banks family?", ["Umbrella", "Kite", "Balloon", "Broomstick", "Parasol cart", "Carpet bag", "Chimney soot", "Parachute"]),
    c("mvs22", "In Back to the Future, what kind of car is the time machine?", ["DeLorean", "Mustang", "Beetle", "Corvette", "Model T", "Camaro", "Thunderbird", "Mini Cooper"]),
    c("mvs23", "The Sound of Music is set in which country?", ["Austria", "Germany", "Switzerland", "Italy", "France", "Norway", "Hungary", "Poland"]),
    c("mvs24", "Which actor played Willy Wonka in the 1971 film Willy Wonka & the Chocolate Factory?", ["Gene Wilder", "Johnny Depp", "Robin Williams", "Dick Van Dyke", "Danny DeVito", "Jim Carrey", "Tim Curry", "Peter Sellers"]),
  ]),
  cat("MOVIE SONGS", [
    c("mvs30", "Which movie features the song \"Hakuna Matata\"?", ["The Lion King", "The Jungle Book", "Tarzan", "Moana", "Aladdin", "Madagascar", "Bambi", "Dumbo"]),
    c("mvs31", "Which movie features the song \"Under the Sea\"?", ["The Little Mermaid", "Finding Nemo", "Moana", "Frozen", "Luca", "The Princess and the Frog", "Pinocchio", "Peter Pan"]),
    c("mvs32", "Which movie features \"You've Got a Friend in Me\"?", ["Toy Story", "Monsters, Inc.", "Up", "Cars", "A Bug's Life", "Finding Nemo", "Shrek", "Despicable Me"]),
    c("mvs33", "Which movie features the duet \"A Whole New World\"?", ["Aladdin", "Beauty and the Beast", "Mulan", "Hercules", "Cinderella", "Pocahontas", "Tangled", "Sleeping Beauty"]),
    c("mvs34", "Which Pixar movie features the song \"Remember Me\"?", ["Coco", "Soul", "Onward", "Luca", "Brave", "Inside Out", "Turning Red", "Elemental"]),
  ]),
  cat("BIG FRANCHISES", [
    c("mvs40", "In Shrek, what is the name of the ogre princess who marries Shrek?", ["Fiona", "Rapunzel", "Snow White", "Cinderella", "Belle", "Elsa", "Merida", "Giselle"]),
    c("mvs41", "In Harry Potter, what sport is played on flying broomsticks?", ["Quidditch", "Broomball", "Wizard polo", "Snitch-ball", "Sky tag", "Gobstones", "Hoverball", "Kite rugby"]),
    c("mvs42", "Which Star Wars villain tells Luke Skywalker, \"I am your father\"?", ["Darth Vader", "Emperor Palpatine", "Kylo Ren", "Count Dooku", "Jabba the Hutt", "Boba Fett", "Darth Maul", "Grand Moff Tarkin"]),
    c("mvs43", "In How to Train Your Dragon, what is Hiccup's dragon named?", ["Toothless", "Stormfly", "Meatlug", "Hookfang", "Barf", "Skullcrusher", "Cloudjumper", "Spike"]),
    c("mvs44", "Which stylish designer in The Incredibles says \"No capes!\"?", ["Edna Mode", "Mirage", "Violet Parr", "Helen Parr", "Syndrome", "Frozone", "Evelyn Deavor", "Honey Best"]),
  ]),
  cat("FAMOUS CHARACTERS", [
    c("mvs50", "Which character shouts \"To infinity and beyond!\"?", ["Buzz Lightyear", "Woody", "Mr. Incredible", "WALL-E", "Lightning McQueen", "Mike Wazowski", "Flik", "Carl Fredricksen"]),
    c("mvs51", "Which character famously says \"Just keep swimming\"?", ["Dory", "Nemo", "Marlin", "Bruce", "Crush", "Gill", "Squirt", "Bubbles"]),
    c("mvs52", "In Aladdin, which blue character grants three wishes?", ["Genie", "Abu", "Iago", "Jafar", "Rajah", "Sultan", "Carpet", "Razoul"]),
    c("mvs53", "Which bear sings \"The Bare Necessities\" in The Jungle Book?", ["Baloo", "Winnie the Pooh", "Kenai", "Yogi", "Little John", "Paddington", "Koda", "Lotso"]),
    c("mvs54", "Which race car says \"Ka-chow!\"?", ["Lightning McQueen", "Mater", "Doc Hudson", "Chick Hicks", "Sally Carrera", "Francesco Bernoulli", "Jackson Storm", "Cruz Ramirez"]),
  ]),
];

const DOUBLE = [
  cat("ANIMATED HITS", [
    c("mvd00", "In Frozen, what is Elsa's younger sister named?", ["Anna", "Olaf", "Kristoff", "Hans", "Sven", "Rapunzel", "Moana", "Belle"]),
    c("mvd01", "In Zootopia, what kind of animal is police officer Judy Hopps?", ["Rabbit", "Fox", "Sloth", "Otter", "Cat", "Deer", "Squirrel", "Hamster"]),
    c("mvd02", "In Encanto, which Madrigal is the only family member without a magical gift?", ["Mirabel", "Isabela", "Luisa", "Dolores", "Camilo", "Antonio", "Pepa", "Julieta"]),
    c("mvd03", "Coco is centered on which Mexican holiday?", ["Day of the Dead", "Cinco de Mayo", "Three Kings Day", "Christmas Eve", "Independence Day", "Carnival", "Las Posadas", "Easter"]),
    c("mvd04", "Which Japanese animation studio made Spirited Away and My Neighbor Totoro?", ["Studio Ghibli", "Toei Animation", "Madhouse", "Sunrise", "Pierrot", "Bones", "Gainax", "Kyoto Animation"]),
  ]),
  cat("PIXAR DEEP CUTS", [
    c("mvd10", "What number is painted on Lightning McQueen?", ["95", "51", "00", "1", "43", "86", "7", "22"]),
    c("mvd11", "In Inside Out, which emotion is the bright yellow one?", ["Joy", "Sadness", "Anger", "Fear", "Disgust", "Anxiety", "Envy", "Ennui"]),
    c("mvd12", "In Brave, Merida is famous for her skill with which weapon?", ["Bow and arrow", "Sword", "Slingshot", "Spear", "Axe", "Dagger", "Crossbow", "Shield"]),
    c("mvd13", "In Toy Story 3, what is the name of the daycare the toys end up at?", ["Sunnyside", "Happy Days", "Rainbow Corner", "Little Stars", "Kiddie Cove", "Bright Futures", "Playtime Place", "Tiny Town"]),
    c("mvd14", "In The Incredibles, what is Mr. Incredible's real first name?", ["Bob", "Dash", "Frank", "Tony", "Lucius", "Gilbert", "Buddy", "Rick"]),
  ]),
  cat("DISNEY VILLAINS", [
    c("mvd20", "Who is the villain in The Lion King?", ["Scar", "Jafar", "Hades", "Gaston", "Shan Yu", "Ursula", "Kaa", "Shere Khan"]),
    c("mvd21", "Cruella de Vil wants to make a coat from which dogs?", ["Dalmatians", "Poodles", "Corgis", "Beagles", "Collies", "Pugs", "Terriers", "Huskies"]),
    c("mvd22", "In Peter Pan, which animal swallowed Captain Hook's hand?", ["Crocodile", "Shark", "Alligator", "Eagle", "Octopus", "Python", "Lion", "Whale"]),
    c("mvd23", "Which evil royal vizier schemes against Aladdin?", ["Jafar", "Scar", "Hades", "Frollo", "Gaston", "Yzma", "Ratcliffe", "Dr. Facilier"]),
    c("mvd24", "In Sleeping Beauty, Maleficent transforms into a giant what?", ["Dragon", "Raven", "Snake", "Wolf", "Spider", "Bat", "Tiger", "Bear"]),
  ]),
  cat("FAMILY COMEDIES", [
    c("mvd30", "In Home Alone, the McCallister family leaves Kevin behind just before which holiday?", ["Christmas", "Thanksgiving", "Halloween", "Easter", "New Year's Day", "Fourth of July", "Valentine's Day", "Labor Day"]),
    c("mvd31", "In Elf, which sticky topping does Buddy pour on his spaghetti?", ["Maple syrup", "Honey", "Chocolate sauce", "Caramel", "Peanut butter", "Marshmallow cream", "Jam", "Whipped cream"]),
    c("mvd32", "Night at the Museum is set at which New York museum?", ["American Museum of Natural History", "The Met", "Guggenheim", "MoMA", "Smithsonian", "Whitney Museum", "Brooklyn Museum", "Frick Collection"]),
    c("mvd33", "In Mrs. Doubtfire, Robin Williams disguises himself as a:", ["Nanny", "Chef", "Teacher", "Mail carrier", "Neighbor", "Principal", "Dentist", "Bus driver"]),
    c("mvd34", "In E.T. the Extra-Terrestrial, which candy does Elliott use to lure E.T.?", ["Reese's Pieces", "M&M's", "Skittles", "Twizzlers", "Snickers", "Milk Duds", "Jelly Beans", "Gummy Bears"]),
  ]),
  cat("ACTORS & VOICES", [
    c("mvd40", "Which actor voices Woody in Toy Story?", ["Tom Hanks", "Tim Allen", "Billy Crystal", "Robin Williams", "Tom Cruise", "Will Smith", "Jim Carrey", "John Goodman"]),
    c("mvd41", "Which actor voiced Shrek in the original films?", ["Mike Myers", "Eddie Murphy", "Jack Black", "Ben Stiller", "Steve Carell", "Seth Rogen", "Will Ferrell", "Adam Sandler"]),
    c("mvd42", "Who voiced the Genie in Disney's 1992 Aladdin?", ["Robin Williams", "Jim Carrey", "Eddie Murphy", "Billy Crystal", "Steve Martin", "Dan Aykroyd", "Danny DeVito", "John Candy"]),
    c("mvd43", "Which comedian voices Dory in Finding Nemo?", ["Ellen DeGeneres", "Tina Fey", "Amy Poehler", "Kristen Wiig", "Whoopi Goldberg", "Melissa McCarthy", "Rosie O'Donnell", "Wanda Sykes"]),
    c("mvd44", "Which actor gave Mufasa his deep voice in the original Lion King?", ["James Earl Jones", "Morgan Freeman", "Samuel L. Jackson", "Denzel Washington", "Danny Glover", "Idris Elba", "Forest Whitaker", "Laurence Fishburne"]),
  ]),
  cat("STORYBOOK MOVIES", [
    c("mvd50", "In Charlotte's Web, what kind of animal is Wilbur?", ["Pig", "Cow", "Lamb", "Goat", "Horse", "Duck", "Goose", "Rabbit"]),
    c("mvd51", "In The Wizard of Oz, what does the Scarecrow wish for?", ["A brain", "A heart", "Courage", "A home", "Wings", "A crown", "Magic shoes", "A broom"]),
    c("mvd52", "In Peter Pan, what is the fairy's name?", ["Tinker Bell", "Silvermist", "Fawn", "Rosetta", "Iridessa", "Vidia", "Periwinkle", "Zarina"]),
    c("mvd53", "In The Lion, the Witch and the Wardrobe, what is the great lion called?", ["Aslan", "Mufasa", "Simba", "Nala", "Leo", "Alex", "Elsa", "Clarence"]),
    c("mvd54", "In The NeverEnding Story, what is the luckdragon's name?", ["Falkor", "Draco", "Smaug", "Toothless", "Elliott", "Norbert", "Mushu", "Puff"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "MOVIE MARATHON",
  prompt: "Which 1995 film was the first entirely computer-animated feature-length movie?",
  choices: ["Toy Story", "A Bug's Life", "Antz", "Shrek", "Finding Nemo", "Monsters, Inc.", "Cars", "The Lion King"],
  correctIndex: 0,
};

export const FAMILY_MOVIES_PACK: TriviaPack = {
  id: "family-movies",
  audience: "family",
  title: "Family Movies",
  tagline: "Animated favorites and PG classics for movie night",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
