import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("THE BACHELOR", [
    c("rea-s0-0", "On 'The Bachelor,' contestants hope to receive what at the ceremony?", ["A rose", "A ring", "A key", "A trophy", "A kiss", "A lei", "A necklace", "A ticket"]),
    c("rea-s0-1", "Contestants traditionally arrive at the Bachelor mansion in a:", ["Limo", "Helicopter", "Taxi", "Hot-air balloon", "Sports car", "Bus", "Boat", "Horse carriage"]),
    c("rea-s0-2", "Which host led 'The Bachelor' franchise for nearly two decades until 2021?", ["Chris Harrison", "Ryan Seacrest", "Jesse Palmer", "Andy Cohen", "Phil Keoghan", "Jeff Probst", "Tom Bergeron", "Nick Lachey"]),
    c("rea-s0-3", "Who was the very first Bachelor in 2002?", ["Alex Michel", "Andrew Firestone", "Aaron Buerge", "Jesse Palmer", "Bob Guiney", "Matt Grant", "Brad Womack", "Byron Velvick"]),
    c("rea-s0-4", "Who was the first Bachelorette in 2003?", ["Trista Rehn", "Meredith Phillips", "Jennifer Schefft", "DeAnna Pappas", "Jillian Harris", "Ali Fedotowsky", "Emily Maynard", "Ashley Hebert"]),
  ]),
  cat("SURVIVOR", [
    c("rea-s1-0", "Who has hosted 'Survivor' since its start?", ["Jeff Probst", "Phil Keoghan", "Ryan Seacrest", "Chris Harrison", "Mark Burnett", "Bear Grylls", "Ben Stiller", "Dwayne Johnson"]),
    c("rea-s1-1", "When a contestant is voted out, the host snuffs out their:", ["Torch", "Buff", "Flag", "Machete", "Map", "Shelter", "Mask", "Vote"]),
    c("rea-s1-2", "A hidden item that can save you from elimination in 'Survivor' is a hidden immunity:", ["Idol", "Key", "Crown", "Map", "Flag", "Coin", "Mask", "Shield"]),
    c("rea-s1-3", "The first season of 'Survivor' in 2000 was set in:", ["Borneo", "Fiji", "Panama", "The Amazon", "Thailand", "Palau", "Vanuatu", "Samoa"]),
    c("rea-s1-4", "Who won the first season of 'Survivor'?", ["Richard Hatch", "Rudy Boesch", "Kelly Wiglesworth", "Sue Hawk", "Ethan Zohn", "Tina Wesson", "Jenna Morasca", "Sandra Diaz-Twine"]),
  ]),
  cat("DATING SHOWS", [
    c("rea-s2-0", "In 'Love Is Blind,' singles talk and fall for each other in private rooms called:", ["Pods", "Booths", "Cabanas", "Pods of Love", "Chambers", "Cubes", "Suites", "Capsules"]),
    c("rea-s2-1", "Love Island UK's summer villa is located on which island?", ["Mallorca", "Ibiza", "Crete", "Santorini", "Malta", "Sicily", "Tenerife", "Cyprus"]),
    c("rea-s2-2", "On 'Married at First Sight,' couples first meet where?", ["At the altar", "At brunch", "At a speed dating event", "On a beach", "At an airport", "At a party", "In a limo", "At a courthouse"]),
    c("rea-s2-3", "The artificial intelligence narrator on 'Too Hot to Handle' is named:", ["Lana", "Siri", "Alexa", "Ava", "Eve", "Cortana", "Mia", "Nova"]),
    c("rea-s2-4", "'Bachelor in Paradise' has been filmed mostly in which country?", ["Mexico", "Costa Rica", "Bahamas", "Fiji", "Jamaica", "Dominican Republic", "Spain", "Brazil"]),
  ]),
  cat("HOUSEWIVES", [
    c("rea-s3-0", "The 'Real Housewives' franchise airs on which network?", ["Bravo", "E!", "TLC", "MTV", "VH1", "Lifetime", "Oxygen", "Hulu"]),
    c("rea-s3-1", "Which Bravo executive hosts 'Watch What Happens Live'?", ["Andy Cohen", "Ryan Seacrest", "Chris Harrison", "Jeff Probst", "Seth Meyers", "Carson Daly", "Ellen DeGeneres", "Giuliana Rancic"]),
    c("rea-s3-2", "Which city was the setting of the first 'Real Housewives' series?", ["Orange County", "Atlanta", "New York City", "Beverly Hills", "Miami", "New Jersey", "Dallas", "Potomac"]),
    c("rea-s3-3", "Which Real Housewives of New Jersey star famously flipped a table at a 2011 dinner?", ["Teresa Giudice", "Danielle Staub", "Melissa Gorga", "Jacqueline Laurita", "Caroline Manzo", "Dina Manzo", "Kathy Wakile", "Margaret Josephs"]),
    c("rea-s3-4", "In what year did 'The Real Housewives of Orange County' premiere?", ["2006", "2001", "2003", "2008", "2010", "2012", "2004", "2007"]),
  ]),
  cat("JERSEY SHORE", [
    c("rea-s4-0", "On 'Jersey Shore,' 'GTL' stands for Gym, Tan, and what?", ["Laundry", "Lounge", "Lift", "Lotion", "Lobster", "Limo", "Love", "Lager"]),
    c("rea-s4-1", "What is Snooki's real name?", ["Nicole Polizzi", "Jenni Farley", "Sammi Giancola", "Deena Cortese", "Angelina Pivarnick", "Nicole Richie", "Kristen Doute", "Paige DeSorbo"]),
    c("rea-s4-2", "Mike Sorrentino is better known by which nickname?", ["The Situation", "Pauly D", "Vinny", "Ronnie", "JWoww", "Deena", "Snooki", "The Combination"]),
    c("rea-s4-3", "What does cast member Pauly D do for a living?", ["DJ", "Barber", "Bartender", "Personal trainer", "Chef", "Hairdresser", "Model", "Club promoter"]),
    c("rea-s4-4", "In season four of 'Jersey Shore,' the cast moved to which Italian city?", ["Florence", "Rome", "Venice", "Naples", "Milan", "Verona", "Bologna", "Pisa"]),
  ]),
  cat("COMPETITION SHOWS", [
    c("rea-s5-0", "Which judge on 'American Idol' was known for brutal honesty and later created 'The X Factor'?", ["Simon Cowell", "Randy Jackson", "Paula Abdul", "Ryan Seacrest", "Howie Mandel", "Piers Morgan", "Louis Walsh", "Nigel Lythgoe"]),
    c("rea-s5-1", "On 'The Voice,' the coaches' chairs do what if they like a singer?", ["Turn around", "Light up", "Rise", "Spin forever", "Buzz", "Flip over", "Slide forward", "Shake"]),
    c("rea-s5-2", "Who hosts 'The Amazing Race'?", ["Phil Keoghan", "Jeff Probst", "Ryan Seacrest", "Ant & Dec", "Chris Harrison", "Tom Bergeron", "Bear Grylls", "Nick Cannon"]),
    c("rea-s5-3", "'Big Brother' originated in which country?", ["The Netherlands", "United States", "United Kingdom", "Germany", "Sweden", "Australia", "Canada", "Belgium"]),
    c("rea-s5-4", "Which 'Project Runway' host says 'One day you're in, and the next day you're out'?", ["Heidi Klum", "Tim Gunn", "Tyra Banks", "Padma Lakshmi", "Nina Garcia", "Michael Kors", "Naomi Campbell", "Christian Siriano"]),
  ]),
];

const DOUBLE = [
  cat("TLC TRAIN WRECKS", [
    c("rea-d0-0", "'Say Yes to the Dress' is set in which famous New York bridal boutique?", ["Kleinfeld", "Vera Wang", "David's Bridal", "Bergdorf Goodman", "Saks", "Kleinfeld's Place", "Tiffany's", "Macy's Bridal"]),
    c("rea-d0-1", "'19 Kids and Counting' followed which family?", ["The Duggars", "The Gosselins", "The Bates", "The Waltons", "The Browns", "The Roloffs", "The Hiltons", "The Osbournes"]),
    c("rea-d0-2", "'Toddlers & Tiaras' follows children competing in what?", ["Beauty pageants", "Talent shows", "Spelling bees", "Gymnastics meets", "Baking contests", "Dance marathons", "Fashion shows", "Cheer competitions"]),
    c("rea-d0-3", "On '90 Day Fiancé,' the foreign partner arrives on which visa?", ["K-1", "H-1B", "F-1", "B-2", "J-1", "L-1", "O-1", "E-2"]),
    c("rea-d0-4", "In 'Sister Wives,' which man is the patriarch of the Brown family?", ["Kody Brown", "Jim Bob", "Tom Brown", "Kyle Brown", "Chris Brown", "Mark Brown", "Bob Brown", "Ricky Brown"]),
  ]),
  cat("TV TANTRUM CATCHPHRASES", [
    c("rea-d1-0", "Which 'Apprentice' host's catchphrase is 'You're fired!'?", ["Donald Trump", "Mark Cuban", "Martha Stewart", "Arnold Schwarzenegger", "Kevin O'Leary", "Richard Branson", "Simon Cowell", "Gordon Ramsay"]),
    c("rea-d1-1", "Which chef yells at contestants on 'Hell's Kitchen'?", ["Gordon Ramsay", "Guy Fieri", "Bobby Flay", "Wolfgang Puck", "Emeril Lagasse", "Anthony Bourdain", "Jamie Oliver", "Rachael Ray"]),
    c("rea-d1-2", "Which heiress popularized the catchphrase 'That's hot'?", ["Paris Hilton", "Kim Kardashian", "Nicole Richie", "Britney Spears", "Lindsay Lohan", "Ivanka Trump", "Olivia Palermo", "Tinsley Mortimer"]),
    c("rea-d1-3", "Paris Hilton starred in 'The Simple Life' with which co-star?", ["Nicole Richie", "Kim Kardashian", "Lindsay Lohan", "Khloé Kardashian", "Mary-Kate Olsen", "Jessica Simpson", "Brittny Gastineau", "Kathy Hilton"]),
    c("rea-d1-4", "Danielle Bregoli's 'Cash me outside' moment came on which TV show?", ["Dr. Phil", "Maury", "Jerry Springer", "The Steve Wilkos Show", "Ellen", "Judge Judy", "Oprah", "The Talk"]),
  ]),
  cat("BRAVO BLOWUPS", [
    c("rea-d2-0", "Which Lisa Vanderpump restaurant employs the cast of 'Vanderpump Rules'?", ["SUR", "Villa Blanca", "Pump", "Tom Tom", "Craig's", "Katsuya", "Jar", "Stk"]),
    c("rea-d2-1", "Who is the owner of SUR and star of 'Vanderpump Rules'?", ["Lisa Vanderpump", "Kyle Richards", "Lisa Rinna", "Erika Jayne", "Dorit Kemsley", "Camille Grammer", "Teddi Mellencamp", "Eileen Davidson"]),
    c("rea-d2-2", "'Scandoval' in 2023 involved Tom Sandoval cheating on which castmate?", ["Ariana Madix", "Katie Maloney", "Lala Kent", "Scheana Shay", "Kristen Doute", "Raquel Leviss", "Stassi Schroeder", "Brittany Cartwright"]),
    c("rea-d2-3", "In 2019, Colton Underwood did what to follow Cassie on 'The Bachelor'?", ["Jumped a fence", "Climbed a tree", "Swam a river", "Drove away", "Hid in a trunk", "Crashed a party", "Rode a motorcycle", "Flew a plane"]),
    c("rea-d2-4", "Who was the first Black lead of 'The Bachelorette' in 2017?", ["Rachel Lindsay", "Hannah Brown", "Tayshia Adams", "Michelle Young", "Kaitlyn Bristowe", "Becca Kufrin", "Rachel Recchia", "Gabby Windey"]),
  ]),
  cat("REALITY LEGENDS", [
    c("rea-d3-0", "Which rocker's family starred in MTV's 2002 hit 'The Osbournes'?", ["Ozzy Osbourne", "Gene Simmons", "Tommy Lee", "Steven Tyler", "Alice Cooper", "Rob Zombie", "Dee Snider", "Jon Bon Jovi"]),
    c("rea-d3-1", "In the opening of MTV's 'The Real World,' seven strangers are picked to do what?", ["Live in a house", "Compete for money", "Travel the world", "Start a band", "Open a business", "Find true love", "Survive on an island", "Work on a farm"]),
    c("rea-d3-2", "Who won the first season of 'American Idol' in 2002?", ["Kelly Clarkson", "Carrie Underwood", "Fantasia Barrino", "Ruben Studdard", "Jordin Sparks", "Taylor Hicks", "Kris Allen", "David Cook"]),
    c("rea-d3-3", "'Keeping Up with the Kardashians' ended after how many seasons?", ["20", "10", "12", "15", "18", "22", "25", "8"]),
    c("rea-d3-4", "Which producer created 'Survivor' for US audiences and also produced 'The Apprentice'?", ["Mark Burnett", "Simon Fuller", "Ryan Murphy", "Dick Wolf", "Jerry Bruckheimer", "Andy Cohen", "Mike Fleiss", "Chuck Lorre"]),
  ]),
  cat("COOKING CATFIGHTS", [
    c("rea-d4-0", "Which Food Network star's turf is nicknamed 'Flavortown'?", ["Guy Fieri", "Bobby Flay", "Rachael Ray", "Alton Brown", "Giada De Laurentiis", "Ina Garten", "Emeril Lagasse", "Paula Deen"]),
    c("rea-d4-1", "Contestants on 'Chopped' must use ingredients from a mystery:", ["Basket", "Box", "Bag", "Fridge", "Pantry", "Bowl", "Wheel", "Cabinet"]),
    c("rea-d4-2", "Which judge on 'The Great British Bake Off' is known for the 'Hollywood handshake'?", ["Paul Hollywood", "Mary Berry", "Prue Leith", "Gordon Ramsay", "Jamie Oliver", "Nigella Lawson", "Marcus Wareing", "James Martin"]),
    c("rea-d4-3", "Which longtime host of 'Top Chef' is also an author and model?", ["Padma Lakshmi", "Tom Colicchio", "Gail Simmons", "Kristen Kish", "Giada De Laurentiis", "Rachael Ray", "Nigella Lawson", "Ayesha Curry"]),
    c("rea-d4-4", "Which 'MasterChef' judge is a restaurateur and winemaker?", ["Joe Bastianich", "Gordon Ramsay", "Graham Elliot", "Aarón Sánchez", "Christina Tosi", "Tom Colicchio", "Mario Batali", "Wolfgang Puck"]),
  ]),
  cat("SHARK TANK", [
    c("rea-d5-0", "Which Shark is nicknamed 'Mr. Wonderful'?", ["Kevin O'Leary", "Mark Cuban", "Robert Herjavec", "Daymond John", "Barbara Corcoran", "Lori Greiner", "Richard Branson", "Chris Sacca"]),
    c("rea-d5-1", "Mark Cuban was long the owner of which NBA team?", ["Dallas Mavericks", "Houston Rockets", "San Antonio Spurs", "Phoenix Suns", "Miami Heat", "Los Angeles Lakers", "Brooklyn Nets", "Golden State Warriors"]),
    c("rea-d5-2", "Daymond John founded which clothing brand?", ["FUBU", "Rocawear", "Sean John", "Phat Farm", "Ecko Unltd", "Baby Phat", "Cross Colours", "Karl Kani"]),
    c("rea-d5-3", "Lori Greiner is nicknamed the 'Queen of' what?", ["QVC", "Retail", "Shark Tank", "Inventions", "Infomercials", "HSN", "Pitch", "Cash"]),
    c("rea-d5-4", "'Shark Tank' is the US version of which UK series?", ["Dragons' Den", "The Apprentice", "Money Tigers", "Tycoon Tank", "The Pitch", "Pitch Perfect", "Britain's Next Big Thing", "Business Class"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "REALITY DRAMA",
  prompt: "Lauren Conrad starred in 'Laguna Beach' and which spin-off?",
  choices: ["The Hills", "The O.C.", "Newport Harbor", "Gossip Girl", "Jersey Shore", "90210", "The City", "Rich Girls"],
  correctIndex: 0,
};

export const SPICY_REALITY_PACK: TriviaPack = {
  id: "spicy-reality",
  audience: "spicy",
  title: "Reality Drama",
  tagline: "Roses, tribal councils, Bravo breakdowns, and confessionals",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
