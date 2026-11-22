import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("GREEK LIFE", [
    c("col-s0-0", "Which letter starts the Greek alphabet?", ["Alpha", "Beta", "Gamma", "Delta", "Omega", "Sigma", "Zeta", "Theta"]),
    c("col-s0-1", "Which 1978 comedy starring John Belushi follows the Delta Tau Chi fraternity?", ["Animal House", "Revenge of the Nerds", "Old School", "Van Wilder", "PCU", "Accepted", "Neighbors", "Back to School"]),
    c("col-s0-2", "How many letters are in the Greek alphabet?", ["24", "20", "22", "26", "28", "18", "30", "32"]),
    c("col-s0-3", "In 'Legally Blonde,' Elle Woods is president of which sorority?", ["Delta Nu", "Alpha Phi", "Kappa Kappa Gamma", "Zeta Beta", "Pi Beta Phi", "Theta Chi", "Sigma Delta", "Gamma Gamma"]),
    c("col-s0-4", "In 'Revenge of the Nerds,' the nerds form which fraternity chapter?", ["Lambda Lambda Lambda", "Alpha Beta", "Sigma Nu", "Delta Tau Chi", "Pi Kappa Alpha", "Phi Beta Kappa", "Omega Mu", "Theta Delta"]),
  ]),
  cat("CAMPUS COMEDIES", [
    c("col-s1-0", "Which 2014 comedy has Seth Rogen and Zac Efron feuding over a fraternity next door?", ["Neighbors", "Project X", "Superbad", "Sex Drive", "Pitch Perfect", "22 Jump Street", "We're the Millers", "Sorority Row"]),
    c("col-s1-1", "Which Will Ferrell comedy features the 'streaking' scene and Frank 'The Tank'?", ["Old School", "Anchorman", "Step Brothers", "Blades of Glory", "Talladega Nights", "Elf", "Semi-Pro", "Kicking & Screaming"]),
    c("col-s1-2", "Which Ryan Reynolds comedy follows a perpetual student and 'party liaison'?", ["Van Wilder", "Waiting...", "Accepted", "Blade: Trinity", "Just Friends", "Definitely, Maybe", "Buried", "The Proposal"]),
    c("col-s1-3", "In the 2012 film 'Project X,' Thomas's out-of-control party celebrates which birthday?", ["17th", "16th", "18th", "21st", "15th", "19th", "20th", "14th"]),
    c("col-s1-4", "In which film did Matthew McConaughey first say 'Alright, alright, alright'?", ["Dazed and Confused", "Boogie Nights", "Sling Blade", "Lone Star", "A Time to Kill", "Contact", "Fast Times at Ridgemont High", "The Wedding Planner"]),
  ]),
  cat("CAMPUS LIFE", [
    c("col-s2-0", "An 'all-nighter' is when a student:", ["Stays up all night studying", "Sleeps through finals", "Attends a late class", "Works a night shift", "Plays video games on campus", "Throws a party", "Skips class", "Takes a road trip"]),
    c("col-s2-1", "The 'Freshman 15' refers to gaining about how many pounds?", ["15", "5", "10", "20", "25", "30", "50", "2"]),
    c("col-s2-2", "Making the 'Dean's List' means you:", ["Earned high grades", "Got into trouble", "Skipped a class", "Won an election", "Joined a fraternity", "Dropped out", "Live off campus", "Graduated early"]),
    c("col-s2-3", "Which Mexican resort city is a classic spring break destination?", ["Cancún", "Acapulco", "Tulum", "Puerto Vallarta", "Cabo San Lucas", "Tijuana", "Guadalajara", "Veracruz"]),
    c("col-s2-4", "Which cheap beer is nicknamed 'Natty Light'?", ["Natural Light", "Naturally Brewed", "Nutty Lager", "Natty Ice Pale", "National Light", "Nature's Lite", "Northern Light", "Nacho Light"]),
  ]),
  cat("COLLEGE FOOTBALL", [
    c("col-s3-0", "The Heisman Trophy is awarded to the best player in which sport?", ["College football", "Basketball", "Baseball", "Soccer", "Hockey", "Golf", "Track", "Tennis"]),
    c("col-s3-1", "Which university's teams are the Crimson Tide?", ["Alabama", "Auburn", "Harvard", "Oklahoma", "Georgia", "Florida State", "Ohio State", "Stanford"]),
    c("col-s3-2", "Bevo the longhorn is the mascot of which school?", ["Texas", "Texas A&M", "Oklahoma", "Baylor", "TCU", "Texas Tech", "Houston", "Arkansas"]),
    c("col-s3-3", "The Rose Bowl stadium is in which California city?", ["Pasadena", "Los Angeles", "San Diego", "Berkeley", "Anaheim", "Santa Monica", "Palo Alto", "San Francisco"]),
    c("col-s3-4", "The 'Iron Bowl' is played between Alabama and which school?", ["Auburn", "Georgia", "LSU", "Tennessee", "Ole Miss", "Florida", "Mississippi State", "Vanderbilt"]),
  ]),
  cat("PARTY PLAYLIST", [
    c("col-s4-0", "Which band sang 'Don't Stop Believin'?", ["Journey", "Foreigner", "Boston", "Toto", "Styx", "Bon Jovi", "Survivor", "REO Speedwagon"]),
    c("col-s4-1", "Who sang 'Party in the U.S.A.'?", ["Miley Cyrus", "Taylor Swift", "Selena Gomez", "Katy Perry", "Demi Lovato", "Ariana Grande", "Hilary Duff", "Ke$ha"]),
    c("col-s4-2", "Which singer is famous for the crowd chant 'Sweet Caroline'?", ["Neil Diamond", "Elton John", "Billy Joel", "Bruce Springsteen", "Elvis Presley", "Barry Manilow", "Rod Stewart", "Paul Simon"]),
    c("col-s4-3", "Which duo sang 'Party Rock Anthem'?", ["LMFAO", "Black Eyed Peas", "Pitbull", "Flo Rida", "Far East Movement", "Daft Punk", "The Chainsmokers", "Swedish House Mafia"]),
    c("col-s4-4", "Which band sang 'Mr. Brightside'?", ["The Killers", "Kings of Leon", "Maroon 5", "Fall Out Boy", "The Strokes", "Arctic Monkeys", "Panic! at the Disco", "Franz Ferdinand"]),
  ]),
  cat("CAMPUS SLANG", [
    c("col-s5-0", "To 'cram' for an exam means to:", ["Study intensely at the last minute", "Skip the test", "Cheat", "Write a long essay", "Join a study group", "Take notes in class", "Tutor a friend", "Retake the test"]),
    c("col-s5-1", "A 'tailgate' is a party held:", ["In a parking lot before a game", "At a library", "In a dorm lobby", "On a train", "In a cafeteria", "At a graduation", "During finals", "In a lecture hall"]),
    c("col-s5-2", "A 'rager' is a:", ["Wild party", "Strict professor", "Type of dorm", "Finals week", "Football penalty", "Campus tour", "Study group", "Fraternity handshake"]),
    c("col-s5-3", "The 'walk of shame' is when someone:", ["Returns home the next morning in last night's outfit", "Fails a final", "Gets expelled", "Walks across the stage late", "Leaves class early", "Misses graduation", "Gets caught cheating", "Moves out of a dorm"]),
    c("col-s5-4", "A 'keg stand' involves:", ["Drinking from a keg while held upside down", "Sitting on a keg", "Selling kegs", "Carrying a keg upstairs", "Brewing in a dorm", "Racing with kegs", "Hiding a keg", "Building a pyramid"]),
  ]),
];

const DOUBLE = [
  cat("IVY LEAGUE", [
    c("col-d0-0", "How many schools are in the Ivy League?", ["Eight", "Six", "Seven", "Nine", "Ten", "Twelve", "Five", "Four"]),
    c("col-d0-1", "Harvard University is in which Massachusetts city?", ["Cambridge", "Boston", "Worcester", "Springfield", "Amherst", "Lowell", "Salem", "Lexington"]),
    c("col-d0-2", "Yale's mascot is a:", ["Bulldog", "Tiger", "Bear", "Lion", "Eagle", "Crimson Fox", "Bobcat", "Husky"]),
    c("col-d0-3", "Which Ivy League school is located in Ithaca, New York?", ["Cornell", "Columbia", "Dartmouth", "Brown", "Princeton", "Penn", "Yale", "Harvard"]),
    c("col-d0-4", "In what year was Harvard founded?", ["1636", "1492", "1701", "1754", "1776", "1620", "1819", "1865"]),
  ]),
  cat("COLLEGE MOVIES", [
    c("col-d1-0", "Which actress plays Elle Woods in 'Legally Blonde'?", ["Reese Witherspoon", "Kirsten Dunst", "Anne Hathaway", "Amanda Seyfried", "Alicia Silverstone", "Jessica Simpson", "Hilary Duff", "Mandy Moore"]),
    c("col-d1-1", "In 'Good Will Hunting,' Will works as a janitor at which university?", ["MIT", "Harvard", "Yale", "Princeton", "Stanford", "Boston College", "Brown", "Northeastern"]),
    c("col-d1-2", "Which actor plays Mark Zuckerberg in 'The Social Network'?", ["Jesse Eisenberg", "Andrew Garfield", "Justin Timberlake", "Michael Cera", "Armie Hammer", "Ben Affleck", "Max Minghella", "Joseph Gordon-Levitt"]),
    c("col-d1-3", "In 'Pitch Perfect,' Beca joins which a cappella group?", ["The Barden Bellas", "The Trebles", "The Treblemakers", "The Harmonics", "The Pitches", "The Bellas of Barden", "The Warblers", "The Hummingbirds"]),
    c("col-d1-4", "In 'Accepted' (2006), Justin Long creates which fake college?", ["South Harmon Institute of Technology", "Northern Shore College", "Springfield State", "East Coast Tech", "Pacific Valley University", "Westside Academy", "Harmon Hill University", "Monroe Community College"]),
  ]),
  cat("SPRING BREAK", [
    c("col-d2-0", "Which Mexican city is the best-known international spring break hotspot?", ["Cancún", "Mexico City", "Monterrey", "Oaxaca", "Mérida", "Puebla", "Tijuana", "Guadalajara"]),
    c("col-d2-1", "South Padre Island, a spring break favorite, is in which state?", ["Texas", "Florida", "California", "Louisiana", "Mississippi", "Alabama", "North Carolina", "South Carolina"]),
    c("col-d2-2", "Panama City Beach, a spring break favorite, is in which state?", ["Florida", "Alabama", "Georgia", "Texas", "Mississippi", "California", "Louisiana", "Virginia"]),
    c("col-d2-3", "Who plays the cornrowed rapper-dealer Alien in 2012's 'Spring Breakers'?", ["James Franco", "Zac Efron", "Channing Tatum", "Ryan Gosling", "Jonah Hill", "Seth Rogen", "Dave Franco", "Robert Pattinson"]),
    c("col-d2-4", "The 1960 film 'Where the Boys Are' helped make which Florida city a spring break icon?", ["Fort Lauderdale", "Miami", "Tampa", "Orlando", "Daytona Beach", "Key West", "Jacksonville", "Pensacola"]),
  ]),
  cat("DROPOUTS WHO WON", [
    c("col-d3-0", "Which Harvard dropout co-founded Microsoft?", ["Bill Gates", "Steve Jobs", "Michael Dell", "Larry Ellison", "Jeff Bezos", "Elon Musk", "Larry Page", "Paul Allen"]),
    c("col-d3-1", "Which Harvard dropout founded Facebook?", ["Mark Zuckerberg", "Jack Dorsey", "Evan Spiegel", "Sergey Brin", "Jan Koum", "Reid Hoffman", "Peter Thiel", "Kevin Systrom"]),
    c("col-d3-2", "Steve Jobs dropped out of which college?", ["Reed College", "Stanford", "Harvard", "Berkeley", "MIT", "Dartmouth", "Oberlin", "Swarthmore"]),
    c("col-d3-3", "Lady Gaga left which university's Tisch School of the Arts?", ["New York University", "Columbia University", "Juilliard", "Yale", "Berklee", "Fordham", "The New School", "Brown University"]),
    c("col-d3-4", "Michael Dell dropped out of which university to build computers?", ["University of Texas at Austin", "Texas A&M", "Rice", "MIT", "Stanford", "Baylor", "SMU", "University of Houston"]),
  ]),
  cat("CAMPUS MASCOTS", [
    c("col-d4-0", "The Ducks are the mascot of which university?", ["Oregon", "Oregon State", "Washington", "Stanford", "UCLA", "Idaho", "Utah", "Colorado"]),
    c("col-d4-1", "Bucky Badger represents which university?", ["Wisconsin", "Michigan", "Minnesota", "Iowa", "Northwestern", "Purdue", "Illinois", "Indiana"]),
    c("col-d4-2", "The 'Fighting Irish' nickname belongs to which school?", ["Notre Dame", "Boston College", "Villanova", "Holy Cross", "Georgetown", "Fordham", "Marquette", "Seton Hall"]),
    c("col-d4-3", "Which University of California campus's mascot is the banana slug?", ["Santa Cruz", "Berkeley", "Davis", "Irvine", "San Diego", "Riverside", "Merced", "Santa Barbara"]),
    c("col-d4-4", "Evergreen State College's mascot, the geoduck, is a type of:", ["Clam", "Duck", "Snail", "Fish", "Crab", "Seal", "Oyster", "Eel"]),
  ]),
  cat("ALL-NIGHTER FUEL", [
    c("col-d5-0", "Red Bull's slogan says it gives you:", ["Wings", "Speed", "Power", "Focus", "Wake", "Energy", "Fire", "Lightning"]),
    c("col-d5-1", "Monster Energy's logo is shaped like:", ["Claw marks", "A lightning bolt", "A skull", "A can", "A flame", "A wing", "A fang", "A star"]),
    c("col-d5-2", "Red Bull was founded in which country?", ["Austria", "Germany", "Switzerland", "Thailand", "United States", "Italy", "Netherlands", "Japan"]),
    c("col-d5-3", "Starbucks was founded in which US city?", ["Seattle", "Portland", "San Francisco", "Chicago", "New York", "Boston", "Austin", "Los Angeles"]),
    c("col-d5-4", "Domino's Pizza was founded in 1960 in which state?", ["Michigan", "Ohio", "New York", "Indiana", "Illinois", "Wisconsin", "Pennsylvania", "Minnesota"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "COLLEGE PARTY",
  prompt: "The first intercollegiate football game, in 1869, was played between Rutgers and which school?",
  choices: ["Princeton", "Harvard", "Yale", "Columbia", "Penn", "Brown", "Dartmouth", "Cornell"],
  correctIndex: 0,
};

export const SPICY_COLLEGE_PACK: TriviaPack = {
  id: "spicy-college",
  audience: "spicy",
  title: "College Party",
  tagline: "Frats, finals, spring break, and campus legends",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
