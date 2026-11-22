import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("INNOCENT WORDS", [
    c("dir-s0-0", "In 'Moby-Dick,' Captain Ahab obsessively hunts what?", ["A white whale", "A giant squid", "A great white shark", "A sea serpent", "A killer whale", "A narwhal", "A giant octopus", "A blue marlin"]),
    c("dir-s0-1", "Which furry animal famously builds dams out of sticks and logs?", ["Beaver", "Otter", "Muskrat", "Marmot", "Badger", "Mink", "Groundhog", "Raccoon"]),
    c("dir-s0-2", "In birdwatching, a 'blue tit' is a type of:", ["Small songbird", "Seabird", "Owl", "Woodpecker", "Hummingbird", "Duck", "Parrot", "Crow"]),
    c("dir-s0-3", "What do Americans call what Brits call a 'bum bag'?", ["Fanny pack", "Duffel bag", "Tote bag", "Messenger bag", "Backpack", "Purse", "Satchel", "Clutch"]),
    c("dir-s0-4", "A traditional 'Cockney' is a native of which part of London?", ["East End", "West End", "Soho", "Kensington", "Chelsea", "Camden", "Brixton", "Mayfair"]),
  ]),
  cat("TITLES WITH A WINK", [
    c("dir-s1-0", "Which actor played Johnny Castle in 'Dirty Dancing'?", ["Patrick Swayze", "Tom Cruise", "Kevin Bacon", "Patrick Dempsey", "John Travolta", "Rob Lowe", "Matt Dillon", "Christian Slater"]),
    c("dir-s1-1", "Which actor stars as male entertainer Mike in 'Magic Mike'?", ["Channing Tatum", "Zac Efron", "Matthew McConaughey", "Joe Manganiello", "Ryan Gosling", "Chris Evans", "Taylor Lautner", "Liam Hemsworth"]),
    c("dir-s1-2", "Which actress plays Catherine Tramell in 'Basic Instinct'?", ["Sharon Stone", "Demi Moore", "Kim Basinger", "Michelle Pfeiffer", "Julia Roberts", "Glenn Close", "Sigourney Weaver", "Meg Ryan"]),
    c("dir-s1-3", "The 1995 film 'Showgirls' is set in which city?", ["Las Vegas", "Atlantic City", "Reno", "Miami", "Los Angeles", "New Orleans", "Nashville", "Branson"]),
    c("dir-s1-4", "'The Full Monty,' about out-of-work men who decide to strip, is set in which English city?", ["Sheffield", "Manchester", "Liverpool", "Leeds", "Birmingham", "Newcastle", "Bristol", "Nottingham"]),
  ]),
  cat("SAUCY SONGS", [
    c("dir-s2-0", "Who sang 'Like a Virgin'?", ["Madonna", "Cyndi Lauper", "Tiffany", "Debbie Gibson", "Kylie Minogue", "Whitney Houston", "Pat Benatar", "Belinda Carlisle"]),
    c("dir-s2-1", "Which band sang 'Pour Some Sugar on Me'?", ["Def Leppard", "Mötley Crüe", "Poison", "Bon Jovi", "Guns N' Roses", "Whitesnake", "Warrant", "Twisted Sister"]),
    c("dir-s2-2", "'Let's Talk About Sex' is a hit by which trio?", ["Salt-N-Pepa", "TLC", "En Vogue", "Destiny's Child", "Wilson Phillips", "The Pointer Sisters", "Xscape", "SWV"]),
    c("dir-s2-3", "MC Hammer sampled which Rick James song in 'U Can't Touch This'?", ["Super Freak", "Give It to Me Baby", "Mary Jane", "Cold Blooded", "Superstition", "Brick House", "Funkytown", "Play That Funky Music"]),
    c("dir-s2-4", "In what year did Marvin Gaye release 'Sexual Healing'?", ["1982", "1971", "1975", "1979", "1985", "1988", "1969", "1991"]),
  ]),
  cat("NAUGHTY LITERATURE", [
    c("dir-s3-0", "Who wrote 'Lady Chatterley's Lover'?", ["D.H. Lawrence", "Henry Miller", "Ernest Hemingway", "James Joyce", "Aldous Huxley", "E.M. Forster", "Evelyn Waugh", "George Orwell"]),
    c("dir-s3-1", "Who wrote 'Fifty Shades of Grey'?", ["E.L. James", "Danielle Steel", "Nora Roberts", "Stephenie Meyer", "Jackie Collins", "Judith Krantz", "Candace Bushnell", "Sylvia Day"]),
    c("dir-s3-2", "The ancient Kama Sutra originated in which country?", ["India", "China", "Greece", "Egypt", "Persia", "Japan", "Turkey", "Thailand"]),
    c("dir-s3-3", "Which Shakespeare comedy's title plays on Elizabethan slang with 'Nothing'?", ["Much Ado About Nothing", "Twelfth Night", "As You Like It", "The Comedy of Errors", "A Midsummer Night's Dream", "The Taming of the Shrew", "Love's Labour's Lost", "The Tempest"]),
    c("dir-s3-4", "Who wrote the once-banned 1934 novel 'Tropic of Cancer'?", ["Henry Miller", "Vladimir Nabokov", "William S. Burroughs", "J.D. Salinger", "Charles Bukowski", "Jack Kerouac", "Anaïs Nin", "John Updike"]),
  ]),
  cat("BEDROOM BRANDS", [
    c("dir-s4-0", "Which man founded 'Playboy' magazine in 1953?", ["Hugh Hefner", "Bob Guccione", "Larry Flynt", "Al Goldstein", "Rupert Murdoch", "William Randolph Hearst", "Jann Wenner", "Steve Wynn"]),
    c("dir-s4-1", "Victoria's Secret models in the old fashion show were known as:", ["Angels", "Goddesses", "Muses", "Stars", "Doves", "Sirens", "Queens", "Supermodels"]),
    c("dir-s4-2", "The Hooters restaurant chain was founded in 1983 in which state?", ["Florida", "California", "Texas", "Georgia", "Nevada", "Ohio", "New York", "Louisiana"]),
    c("dir-s4-3", "Trojan condoms are named after warriors of which ancient city?", ["Troy", "Sparta", "Athens", "Rome", "Carthage", "Thebes", "Corinth", "Babylon"]),
    c("dir-s4-4", "Viagra was originally studied as a treatment for which kind of problem?", ["Heart-related chest pain", "Headaches", "Allergies", "Insomnia", "Back pain", "High cholesterol", "Anxiety", "Asthma"]),
  ]),
  cat("ANIMAL NAME SNICKERS", [
    c("dir-s5-0", "A male donkey is called a:", ["Jack", "Tom", "Buck", "Billy", "Bull", "Cob", "Stag", "Ram"]),
    c("dir-s5-1", "A female fox is called a:", ["Vixen", "Doe", "Hen", "Mare", "Sow", "Dame", "Queen", "Cub"]),
    c("dir-s5-2", "A male goat is commonly called a:", ["Billy", "Tom", "Jack", "Stag", "Buck", "Ram", "Bull", "Hob"]),
    c("dir-s5-3", "A female swan is called a:", ["Pen", "Cob", "Hen", "Doe", "Jenny", "Queen", "Cygnet", "Dame"]),
    c("dir-s5-4", "The seabird 'booby' got its name from a Spanish word meaning:", ["Fool or clown", "Bright feet", "Hungry one", "Diver", "Fisher", "Sea cow", "Noisy one", "Great bird"]),
  ]),
];

const DOUBLE = [
  cat("FILM FLIRTS", [
    c("dir-d0-0", "Which actress purred 'Why don't you come up sometime and see me?'", ["Mae West", "Jean Harlow", "Marilyn Monroe", "Rita Hayworth", "Betty Grable", "Lauren Bacall", "Jayne Mansfield", "Greta Garbo"]),
    c("dir-d0-1", "Marilyn Monroe's flying white dress moment comes from which film?", ["The Seven Year Itch", "Some Like It Hot", "Gentlemen Prefer Blondes", "How to Marry a Millionaire", "Niagara", "Bus Stop", "The Misfits", "River of No Return"]),
    c("dir-d0-2", "Which spy-spoof character shouts 'Yeah, baby, yeah!'?", ["Austin Powers", "Johnny English", "Maxwell Smart", "Derek Zoolander", "Ace Ventura", "Inspector Clouseau", "Ron Burgundy", "Napoleon Dynamite"]),
    c("dir-d0-3", "In 'Titanic,' Jack sketches Rose wearing only what?", ["A necklace", "A hat", "A scarf", "A ribbon", "A coat", "A bracelet", "Gloves", "A veil"]),
    c("dir-d0-4", "The famous deli scene in 'When Harry Met Sally...' was filmed at which New York deli?", ["Katz's Delicatessen", "Carnegie Deli", "2nd Ave Deli", "Russ & Daughters", "Zabar's", "Barney Greengrass", "Junior's", "Sarge's"]),
  ]),
  cat("BAWDY HISTORY", [
    c("dir-d1-0", "Which Egyptian queen allegedly romanced both Julius Caesar and Mark Antony?", ["Cleopatra", "Nefertiti", "Hatshepsut", "Isis", "Ankhesenamun", "Berenice", "Arsinoe", "Tiye"]),
    c("dir-d1-1", "Casanova, the famous lover, was born in which city?", ["Venice", "Rome", "Paris", "Florence", "Madrid", "Vienna", "Naples", "Milan"]),
    c("dir-d1-2", "Lady Godiva legendarily rode naked through which English city?", ["Coventry", "Leicester", "York", "Oxford", "Bath", "Chester", "Canterbury", "Lincoln"]),
    c("dir-d1-3", "Nell Gwyn, a famed actress, was a mistress of which English king?", ["Charles II", "Henry VIII", "George III", "Edward VII", "James I", "Charles I", "William III", "George IV"]),
    c("dir-d1-4", "In which language did Casanova write his famous memoirs?", ["French", "Italian", "Latin", "English", "German", "Spanish", "Portuguese", "Greek"]),
  ]),
  cat("LUST POTIONS", [
    c("dir-d2-0", "Aphrodite's Roman counterpart is:", ["Venus", "Juno", "Minerva", "Diana", "Ceres", "Vesta", "Flora", "Fortuna"]),
    c("dir-d2-1", "Which shellfish is the most famous legendary aphrodisiac?", ["Oysters", "Clams", "Mussels", "Lobster", "Scallops", "Shrimp", "Crab", "Squid"]),
    c("dir-d2-2", "The scientific name for the cacao tree, Theobroma, means 'food of the' what?", ["Gods", "Kings", "Lovers", "People", "Aztecs", "Angels", "Earth", "Sun"]),
    c("dir-d2-3", "'Spanish fly,' the legendary aphrodisiac, is actually made from a:", ["Blister beetle", "Firefly", "Housefly", "Dragonfly", "Butterfly", "Moth", "Wasp", "Cricket"]),
    c("dir-d2-4", "Which root, said to scream when pulled from the ground, was an ancient love charm?", ["Mandrake", "Ginseng", "Ginger", "Beet", "Turnip", "Radish", "Horseradish", "Valerian"]),
  ]),
  cat("SITCOM INNUENDO", [
    c("dir-d3-0", "In 'Friends,' which word does Ross yell while moving a couch up the stairs?", ["Pivot", "Turn", "Lift", "Shift", "Spin", "Rotate", "Twist", "Push"]),
    c("dir-d3-1", "Which 'Seinfeld' phrase means skipping the details of a story?", ["Yada yada yada", "Blah blah blah", "Et cetera", "And so on", "Long story short", "Cut to the chase", "Skip ahead", "Bada bing"]),
    c("dir-d3-2", "On 'The Office,' which Michael Scott catchphrase turns innocent remarks cheeky?", ["That's what she said", "Bazinga", "How you doin'", "Did I do that?", "I'm not superstitious", "Yada yada", "Well, excuse me", "Aw, nuts"]),
    c("dir-d3-3", "On 'Cheers,' bartender Sam Malone is a former pitcher for which team?", ["Boston Red Sox", "New York Yankees", "Chicago Cubs", "Los Angeles Dodgers", "Philadelphia Phillies", "Cleveland Indians", "Baltimore Orioles", "Detroit Tigers"]),
    c("dir-d3-4", "In 'Arrested Development,' there's always money in the:", ["Banana stand", "Cookie jar", "Piggy bank", "Freezer", "Mattress", "Candy store", "Lemonade stand", "Ice cream truck"]),
  ]),
  cat("UNDERWEAR & UNDERTHINGS", [
    c("dir-d4-0", "Which pop star wore a Jean Paul Gaultier cone bra on her 1990 Blond Ambition tour?", ["Madonna", "Cher", "Janet Jackson", "Cyndi Lauper", "Lady Gaga", "Tina Turner", "Kylie Minogue", "Gwen Stefani"]),
    c("dir-d4-1", "Which British designer is credited with popularizing the miniskirt in the 1960s?", ["Mary Quant", "Vivienne Westwood", "Stella McCartney", "Zandra Rhodes", "Laura Ashley", "Paul Smith", "Ossie Clark", "Barbara Hulanicki"]),
    c("dir-d4-2", "Victoria's Secret's first store opened in 1977 in which California city?", ["Palo Alto", "San Francisco", "Los Angeles", "San Diego", "Santa Barbara", "Sacramento", "San Jose", "Malibu"]),
    c("dir-d4-3", "Nylon stockings were introduced to the public in 1940 by which company?", ["DuPont", "3M", "Goodyear", "Dow Chemical", "General Electric", "Monsanto", "Kodak", "Procter & Gamble"]),
    c("dir-d4-4", "In 1914, socialite Mary Phelps Jacob patented which undergarment?", ["The brassiere", "The girdle", "The corset", "Nylon stockings", "The slip", "Garters", "The camisole", "Boxer shorts"]),
  ]),
  cat("DIRTY MIND RIDDLES", [
    c("dir-d5-0", "What gets bigger the more you take away from it?", ["A hole", "A shadow", "A debt", "A balloon", "A pile", "A crowd", "A bank account", "A fire"]),
    c("dir-d5-1", "What has a head and a tail but no body?", ["A coin", "A comet", "A snake", "A match", "A broom", "A river", "A hammer", "A tadpole"]),
    c("dir-d5-2", "What goes in hard and dry, but comes out soft and wet?", ["Chewing gum", "A tea bag", "A sponge", "A noodle", "A towel", "A bar of soap", "A cookie", "A pill"]),
    c("dir-d5-3", "What is stiff, brown, and pops up in the morning?", ["Toast", "A rooster", "An alarm clock", "A newspaper", "A pop-tart", "A bagel", "A waffle", "A jack-in-the-box"]),
    c("dir-d5-4", "A game with a stick, small balls, and getting a hole in one is:", ["Golf", "Billiards", "Croquet", "Mini golf", "Hockey", "Bowling", "Polo", "Pinball"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "DIRTY MIND",
  prompt: "Who plays Dr. Frank-N-Furter in the 1975 cult film 'The Rocky Horror Picture Show'?",
  choices: ["Tim Curry", "Mick Jagger", "David Bowie", "Meat Loaf", "Richard O'Brien", "Freddie Mercury", "Alan Cumming", "Eddie Izzard"],
  correctIndex: 0,
};

export const SPICY_DIRTY_MIND_PACK: TriviaPack = {
  id: "spicy-dirty-mind",
  audience: "spicy",
  title: "Dirty Mind",
  tagline: "Innuendo trivia where the answer is always innocent",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
