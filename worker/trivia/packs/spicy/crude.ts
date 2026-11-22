import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("GROSS-OUT MOVIES", [
    c("cru-s0-0", "Which 1999 teen comedy is famous for a scene involving a warm dessert pie?", ["American Pie", "Road Trip", "EuroTrip", "Superbad", "Porky's", "Old School", "Dude, Where's My Car?", "Scary Movie"]),
    c("cru-s0-1", "The 2009 comedy 'The Hangover' is set after a bachelor party in which city?", ["Las Vegas", "Atlantic City", "Miami", "New Orleans", "Reno", "Los Angeles", "Cancún", "Nashville"]),
    c("cru-s0-2", "Which two actors play the best friends Seth and Evan in 'Superbad'?", ["Jonah Hill and Michael Cera", "Seth Rogen and James Franco", "Jason Segel and Paul Rudd", "Zac Efron and Seth Rogen", "Jonah Hill and Channing Tatum", "Michael Cera and Paul Dano", "Adam Brody and Jason Bateman", "Dave Franco and Nick Kroll"]),
    c("cru-s0-3", "In 'Dumb and Dumber,' the dim duo are named Lloyd and what?", ["Harry", "Larry", "Barry", "Gary", "Jerry", "Terry", "Mary", "Perry"]),
    c("cru-s0-4", "The full title of the 2006 'Borat' film ends 'for Make Benefit Glorious Nation of ___.'", ["Kazakhstan", "Uzbekistan", "Turkmenistan", "Tajikistan", "Azerbaijan", "Kyrgyzstan", "Mongolia", "Belarus"]),
  ]),
  cat("BODY BASICS", [
    c("cru-s1-0", "About how many times a day does the average person pass gas?", ["About 14", "About 2", "About 5", "About 40", "About 75", "About 100", "About 200", "Exactly once"]),
    c("cru-s1-1", "Which vegetable can make your pee smell strongly?", ["Asparagus", "Carrots", "Broccoli", "Celery", "Spinach", "Cucumbers", "Corn", "Potatoes"]),
    c("cru-s1-2", "Hiccups are caused by a spasm of which muscle?", ["The diaphragm", "The bicep", "The stomach", "The tongue", "The heart", "The glutes", "The jaw", "The esophagus"]),
    c("cru-s1-3", "Which smelly compound is largely responsible for the odor of flatulence?", ["Hydrogen sulfide", "Carbon dioxide", "Methane", "Nitrogen", "Helium", "Oxygen", "Argon", "Neon"]),
    c("cru-s1-4", "Beans cause gas because of hard-to-digest sugars called:", ["Oligosaccharides", "Lactose", "Glucose", "Sucrose", "Fructose", "Maltose", "Dextrose", "Sorbitol"]),
  ]),
  cat("CRUDE CARTOONS", [
    c("cru-s2-0", "In 'South Park,' which hooded kid dies in most early episodes?", ["Kenny", "Kyle", "Stan", "Cartman", "Butters", "Token", "Jimmy", "Timmy"]),
    c("cru-s2-1", "'South Park' is set in a small town in which state?", ["Colorado", "Montana", "Wyoming", "Oregon", "Idaho", "Nevada", "Utah", "Alaska"]),
    c("cru-s2-2", "What is the name of the talking dog on 'Family Guy'?", ["Brian", "Stewie", "Peter", "Quagmire", "Cleveland", "Joe", "Lois", "Chris"]),
    c("cru-s2-3", "'Beavis and Butt-Head' originally aired on which network?", ["MTV", "Comedy Central", "Fox", "Nickelodeon", "Cartoon Network", "HBO", "Adult Swim", "VH1"]),
    c("cru-s2-4", "'Rick and Morty' was co-created by Justin Roiland and which writer?", ["Dan Harmon", "Seth MacFarlane", "Matt Stone", "Trey Parker", "Mike Judge", "Matt Groening", "Seth Green", "Loren Bouchard"]),
  ]),
  cat("BRITISH SLANG", [
    c("cru-s3-0", "In British slang, being 'knackered' means you are:", ["Exhausted", "Drunk", "Angry", "Broke", "Hungry", "Excited", "Embarrassed", "Lucky"]),
    c("cru-s3-1", "To be 'gobsmacked' is to be:", ["Astonished", "Punched", "Hungover", "Bored", "Furious", "Sleepy", "Sad", "Starving"]),
    c("cru-s3-2", "In the UK, being 'skint' means you are:", ["Out of money", "Bruised", "Hungry", "Sunburned", "Out of breath", "Drunk", "Lost", "Sleepy"]),
    c("cru-s3-3", "In British English, being 'chuffed' means:", ["Very pleased", "Very tired", "Very angry", "Very drunk", "Very cold", "Very hungry", "Very late", "Very nervous"]),
    c("cru-s3-4", "In Britain, a 'fortnight' is:", ["Two weeks", "Four nights", "One month", "Ten days", "Fourteen hours", "A weekend", "Three weeks", "A single night"]),
  ]),
  cat("PRANKS & DARES", [
    c("cru-s4-0", "April Fools' Day falls on which date?", ["April 1", "April 15", "March 31", "April 4", "May 1", "April 10", "March 1", "April 20"]),
    c("cru-s4-1", "Ashton Kutcher hosted which hidden-camera prank show?", ["Punk'd", "Candid Camera", "Jackass", "Girls Gone Wild", "The Tonight Show", "Wipeout", "Fear Factor", "Scare Tactics"]),
    c("cru-s4-2", "Candid Camera's catchphrase tells you to smile because you're:", ["On Candid Camera", "On the news", "On air", "Being watched", "Famous", "On YouTube", "Being punked", "On stage"]),
    c("cru-s4-3", "In a famous 1957 BBC April Fools' hoax, a report showed families harvesting what from trees?", ["Spaghetti", "Pizza", "Cheese", "Noodle soup", "Candy canes", "Cotton candy", "Bread", "Meatballs"]),
    c("cru-s4-4", "Which show's cast includes Steve-O, Chris Pontius, and Bam Margera?", ["Jackass", "Tosh.0", "Wild 'n Out", "The Tom Green Show", "Impractical Jokers", "Dirty Jobs", "Viva La Bam", "MythBusters"]),
  ]),
  cat("GROSS GRUB", [
    c("cru-s5-0", "Haggis is the national dish of which country?", ["Scotland", "Ireland", "Wales", "England", "Norway", "Iceland", "Germany", "Denmark"]),
    c("cru-s5-1", "The durian fruit is infamous for its:", ["Smell", "Color", "Weight", "Sweetness", "Shape of its seeds", "Sound", "Price", "Sourness"]),
    c("cru-s5-2", "Hákarl is a fermented shark dish from which country?", ["Iceland", "Norway", "Denmark", "Sweden", "Finland", "Greenland", "Faroe Islands", "Scotland"]),
    c("cru-s5-3", "Casu marzu, a cheese containing live insect larvae, comes from which Italian island?", ["Sardinia", "Sicily", "Capri", "Elba", "Ischia", "Corsica", "Malta", "Crete"]),
    c("cru-s5-4", "Surströmming, a notoriously smelly fermented herring, comes from which country?", ["Sweden", "Norway", "Finland", "Denmark", "Iceland", "Estonia", "Latvia", "Poland"]),
  ]),
];

const DOUBLE = [
  cat("TOILET TRIVIA", [
    c("cru-d0-0", "In Britain, the toilet is commonly called the:", ["Loo", "Dunny", "Biffy", "Ablution", "Jakes", "Throne", "Facility", "Potty"]),
    c("cru-d0-1", "Which Japanese brand's 'Washlet' is a famous high-tech heated toilet seat?", ["TOTO", "Sony", "Panasonic", "Toshiba", "Hitachi", "Mitsubishi", "Sharp", "Yamaha"]),
    c("cru-d0-2", "Toilet paper was first used in which country?", ["China", "Japan", "Egypt", "Greece", "Rome", "India", "England", "France"]),
    c("cru-d0-3", "Sir John Harington designed an early flush toilet for which monarch?", ["Queen Elizabeth I", "Henry VIII", "Queen Victoria", "Charles II", "Mary I", "Edward VI", "James I", "Queen Anne"]),
    c("cru-d0-4", "Harington's 1596 book on the flush toilet was titled 'The Metamorphosis of ___.'", ["Ajax", "Achilles", "Apollo", "Atlas", "Hercules", "Odysseus", "Zeus", "Hermes"]),
  ]),
  cat("COMEDY LEGENDS", [
    c("cru-d1-0", "Which comedian starred in the 1983 stand-up film 'Delirious'?", ["Eddie Murphy", "Richard Pryor", "Robin Williams", "Chris Rock", "Dave Chappelle", "Bill Cosby", "Martin Lawrence", "Steve Martin"]),
    c("cru-d1-1", "Who hosted Netflix's 2024 'Roast of Tom Brady'?", ["Kevin Hart", "Dave Chappelle", "Jeff Ross", "Jimmy Fallon", "Chris Rock", "Seth Rogen", "Nikki Glaser", "Pete Davidson"]),
    c("cru-d1-2", "George Carlin's famous 1972 routine was about 'Seven Words You Can Never Say on' what?", ["Television", "Radio", "Stage", "Airplanes", "Church", "Cable", "Paper", "Movies"]),
    c("cru-d1-3", "Dave Chappelle abruptly left his Comedy Central show in 2005 and famously traveled to which continent?", ["Africa", "Asia", "Europe", "South America", "Australia", "Antarctica", "Central America", "The Middle East"]),
    c("cru-d1-4", "Which comedian suffered severe burns in a 1980 accident and later joked about it in 'Live on the Sunset Strip'?", ["Richard Pryor", "Redd Foxx", "Eddie Murphy", "Flip Wilson", "Bill Cosby", "Sam Kinison", "Robin Williams", "George Carlin"]),
  ]),
  cat("ROYALLY CRUDE HISTORY", [
    c("cru-d2-0", "How many wives did Henry VIII have?", ["Six", "Four", "Five", "Seven", "Eight", "Three", "Nine", "Two"]),
    c("cru-d2-1", "Henry VIII's close attendant for toilet matters held the title Groom of the ___.", ["Stool", "Chamber", "Bath", "Table", "Robes", "Horse", "Garden", "Hunt"]),
    c("cru-d2-2", "In medieval castles, a 'garderobe' was a:", ["Toilet", "Wardrobe", "Armory", "Kitchen", "Dungeon", "Drawbridge", "Watchtower", "Bedchamber"]),
    c("cru-d2-3", "Which Roman emperor taxed the use of public urinals?", ["Vespasian", "Nero", "Caligula", "Augustus", "Trajan", "Hadrian", "Domitian", "Claudius"]),
    c("cru-d2-4", "Vespasian's saying 'Pecunia non olet' means money doesn't:", ["Smell", "Lie", "Sleep", "Run out", "Matter", "Rust", "Talk", "Grow"]),
  ]),
  cat("CHEEKY HITS", [
    c("cru-d3-0", "Who sang the 1992 hit 'Baby Got Back'?", ["Sir Mix-a-Lot", "Coolio", "Vanilla Ice", "MC Hammer", "Salt-N-Pepa", "Naughty by Nature", "Tone Loc", "LL Cool J"]),
    c("cru-d3-1", "Which group sang 'My Humps'?", ["The Black Eyed Peas", "Destiny's Child", "Fergie", "Pussycat Dolls", "Salt-N-Pepa", "TLC", "Outkast", "The Neptunes"]),
    c("cru-d3-2", "Which singer claimed her milkshake 'brings all the boys to the yard'?", ["Kelis", "Rihanna", "Beyoncé", "Ciara", "Nelly Furtado", "Mya", "Christina Milian", "Ashanti"]),
    c("cru-d3-3", "Which Miley Cyrus single features the video of her swinging on a wrecking ball?", ["Wrecking Ball", "Party in the U.S.A.", "We Can't Stop", "Malibu", "Flowers", "The Climb", "Midnight Sky", "Can't Be Tamed"]),
    c("cru-d3-4", "Robin Thicke's 2013 hit 'Blurred Lines' featured Pharrell and which rapper?", ["T.I.", "Jay-Z", "Kanye West", "Drake", "2 Chainz", "Snoop Dogg", "Nelly", "Lil Wayne"]),
  ]),
  cat("EMBARRASSING MOMENTS", [
    c("cru-d4-0", "Whose 2004 Super Bowl halftime show produced the infamous 'wardrobe malfunction'?", ["Janet Jackson", "Britney Spears", "Madonna", "Beyoncé", "Jennifer Lopez", "Shakira", "Christina Aguilera", "Nelly"]),
    c("cru-d4-1", "At the 2009 VMAs, Kanye West famously interrupted which singer's speech?", ["Taylor Swift", "Beyoncé", "Rihanna", "Lady Gaga", "Katy Perry", "Miley Cyrus", "Selena Gomez", "Pink"]),
    c("cru-d4-2", "At which 2022 event did Will Smith slap Chris Rock?", ["The Oscars", "The Grammys", "The Emmys", "The Golden Globes", "The Tonys", "The VMAs", "The Met Gala", "The Super Bowl"]),
    c("cru-d4-3", "Steve Harvey mistakenly crowned which country's contestant as Miss Universe 2015?", ["Colombia", "Philippines", "Brazil", "Venezuela", "Mexico", "Spain", "Peru", "Argentina"]),
    c("cru-d4-4", "Which two presenters mistakenly announced 'La La Land' as Best Picture at the 2017 Oscars?", ["Warren Beatty and Faye Dunaway", "Leonardo DiCaprio and Brie Larson", "Matt Damon and Julia Roberts", "Jack Nicholson and Meryl Streep", "Tom Hanks and Emma Stone", "Robert De Niro and Jane Fonda", "Denzel Washington and Viola Davis", "Morgan Freeman and Cate Blanchett"]),
  ]),
  cat("PARTY GAMES", [
    c("cru-d5-0", "Beer pong is played by throwing what into cups?", ["Ping-pong balls", "Golf balls", "Tennis balls", "Dice", "Coins", "Marbles", "Darts", "Poker chips"]),
    c("cru-d5-1", "Which card game calls itself 'a party game for horrible people'?", ["Cards Against Humanity", "Apples to Apples", "Uno", "Exploding Kittens", "Taboo", "Munchkin", "Cranium", "Loaded Questions"]),
    c("cru-d5-2", "Which company originally sold Twister, once dismissed by a critic as 'sex in a box'?", ["Milton Bradley", "Hasbro", "Mattel", "Parker Brothers", "Fisher-Price", "Ideal", "Rubik's", "Spin Master"]),
    c("cru-d5-3", "'Jenga' comes from a Swahili word meaning what?", ["To build", "To fall", "To stack", "To balance", "To play", "To win", "To pull", "To tower"]),
    c("cru-d5-4", "Which party-game series includes 'Quiplash' and 'Fibbage'?", ["The Jackbox Party Pack", "Mario Party", "Heads Up!", "Wii Party", "Cards Against Humanity Online", "Kahoot", "Pictionary Air", "Words With Friends"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "CRUDE HUMOR",
  prompt: "Which R-rated 2016 animated comedy features Seth Rogen voicing a hot dog named Frank in a supermarket?",
  choices: ["Sausage Party", "Hot Dog: The Movie", "Food Fight", "Bun in the Oven", "Meatballs", "Wiener Takes All", "Deli Daze", "Grocery Games"],
  correctIndex: 0,
};

export const SPICY_CRUDE_PACK: TriviaPack = {
  id: "spicy-crude",
  audience: "spicy",
  title: "Crude Humor",
  tagline: "Gross-out gags, potty talk, and lowbrow legends",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
