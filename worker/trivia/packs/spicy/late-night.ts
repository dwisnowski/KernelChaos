import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("TONIGHT SHOW", [
    c("lat-s0-0", "Johnny Carson's famous intro line announced 'Heeere's ___!'", ["Johnny", "Jay", "Ed", "Conan", "Jimmy", "David", "Steve", "Carson"]),
    c("lat-s0-1", "The Tonight Show airs on which network?", ["NBC", "CBS", "ABC", "Fox", "Comedy Central", "HBO", "TBS", "Netflix"]),
    c("lat-s0-2", "Who replaced Johnny Carson as host of The Tonight Show in 1992?", ["Jay Leno", "David Letterman", "Conan O'Brien", "Jimmy Fallon", "Arsenio Hall", "Chevy Chase", "Dennis Miller", "Pat Sajak"]),
    c("lat-s0-3", "Who was Johnny Carson's longtime announcer and sidekick?", ["Ed McMahon", "Doc Severinsen", "Paul Shaffer", "Andy Richter", "Bill Wendell", "Hugh Downs", "Don Pardo", "Steve Allen"]),
    c("lat-s0-4", "Who was the original host of The Tonight Show in 1954?", ["Steve Allen", "Jack Paar", "Johnny Carson", "Ernie Kovacs", "Dick Cavett", "Merv Griffin", "Jackie Gleason", "Milton Berle"]),
  ]),
  cat("LETTERMAN & CO.", [
    c("lat-s1-0", "David Letterman is famous for his nightly:", ["Top Ten List", "Stupid Pet Tricks only", "Weather Report", "Karaoke Hour", "Cooking Segment", "Sidewalk Quiz", "Monologue Jokes", "Celebrity Roast"]),
    c("lat-s1-1", "Letterman's 'Late Show' aired on which network?", ["CBS", "NBC", "ABC", "Fox", "HBO", "Comedy Central", "PBS", "UPN"]),
    c("lat-s1-2", "Who took over 'The Late Show' on CBS in 2015?", ["Stephen Colbert", "Jimmy Kimmel", "James Corden", "Seth Meyers", "Trevor Noah", "Craig Ferguson", "Jon Stewart", "Conan O'Brien"]),
    c("lat-s1-3", "Who was Conan O'Brien's longtime sidekick?", ["Andy Richter", "Max Weinberg", "Paul Shaffer", "Ed McMahon", "Jon Stewart", "Steve Higgins", "Reggie Watts", "Kevin Eubanks"]),
    c("lat-s1-4", "'The Late Show' was taped at which New York theater?", ["Ed Sullivan Theater", "Radio City Music Hall", "Carnegie Hall", "The Apollo", "Majestic Theatre", "Beacon Theatre", "Roxy Theatre", "Palace Theatre"]),
  ]),
  cat("SNL LEGENDS", [
    c("lat-s2-0", "SNL opens with the line 'Live from New York, it's ___ Night!'", ["Saturday", "Friday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Midnight"]),
    c("lat-s2-1", "Who created 'Saturday Night Live'?", ["Lorne Michaels", "Dick Ebersol", "Chevy Chase", "Dan Aykroyd", "Johnny Carson", "Norman Lear", "Mel Brooks", "Neil Simon"]),
    c("lat-s2-2", "Which SNL cast member created the prim 'Church Lady'?", ["Dana Carvey", "Mike Myers", "Phil Hartman", "Jon Lovitz", "Will Ferrell", "Kevin Nealon", "Chris Rock", "Jim Belushi"]),
    c("lat-s2-3", "Who hosted the very first 'SNL' episode in 1975?", ["George Carlin", "Richard Pryor", "Chevy Chase", "John Belushi", "Steve Martin", "Robert Klein", "Lily Tomlin", "Buck Henry"]),
    c("lat-s2-4", "In the 'More Cowbell' sketch, Christopher Walken plays a producer working with which band?", ["Blue Öyster Cult", "Kiss", "Foreigner", "Boston", "Styx", "Journey", "Aerosmith", "Led Zeppelin"]),
  ]),
  cat("SKETCH SPOTLIGHT", [
    c("lat-s3-0", "The 'Weekend Update' segment on SNL is a parody of what?", ["The news", "A game show", "A talk show", "A cooking show", "A sports show", "A soap opera", "A weather report", "A reality show"]),
    c("lat-s3-1", "Chris Farley's motivational speaker Matt Foley famously lived where?", ["In a van down by the river", "In a tent in the woods", "In a camper in a parking lot", "In a basement", "In a trailer park", "In a treehouse", "In a mansion", "In a boat"]),
    c("lat-s3-2", "The 'Wayne's World' sketch was set in a basement in which Illinois suburb?", ["Aurora", "Naperville", "Evanston", "Joliet", "Peoria", "Schaumburg", "Rockford", "Oak Park"]),
    c("lat-s3-3", "Bill Hader plays which flamboyant Weekend Update city correspondent?", ["Stefon", "Gilly", "Vince", "Dieter", "Garth", "Derek", "Tony", "Brad"]),
    c("lat-s3-4", "On 'Celebrity Jeopardy,' who plays Sean Connery?", ["Darrell Hammond", "Will Ferrell", "Jimmy Fallon", "Bill Hader", "Kenan Thompson", "Seth Meyers", "Dana Carvey", "Fred Armisen"]),
  ]),
  cat("TALK SHOW SEGMENTS", [
    c("lat-s4-0", "On 'Jimmy Kimmel Live!,' celebrities read aloud what in a recurring segment?", ["Mean tweets", "Fan mail", "Bad reviews", "Text messages", "Diary entries", "Love letters", "Headlines", "Old poems"]),
    c("lat-s4-1", "Which late-night host is famous for 'Carpool Karaoke'?", ["James Corden", "Jimmy Fallon", "Seth Meyers", "Trevor Noah", "Stephen Colbert", "Conan O'Brien", "Jimmy Kimmel", "Craig Ferguson"]),
    c("lat-s4-2", "Jimmy Fallon's lip-sync bit became a TV show titled:", ["Lip Sync Battle", "Sing It", "Mic Drop", "The Voice Off", "Dance Dance", "Karaoke Wars", "Singing Showdown", "Pitch Fight"]),
    c("lat-s4-3", "Which network airs 'Last Week Tonight with John Oliver'?", ["HBO", "Showtime", "Netflix", "Comedy Central", "FX", "Hulu", "CNN", "TBS"]),
    c("lat-s4-4", "Each Halloween, Jimmy Kimmel asks parents to tell kids they did what to the candy?", ["Ate it all", "Gave it away", "Lost it", "Threw it out", "Hid it", "Sold it", "Donated it", "Burned it"]),
  ]),
  cat("DESK & SOFA", [
    c("lat-s5-0", "Jon Stewart long anchored which Comedy Central news satire?", ["The Daily Show", "The Colbert Report", "Last Week Tonight", "Tosh.0", "Real Time", "Chappelle's Show", "Nightly News", "South Park"]),
    c("lat-s5-1", "Who succeeded Jon Stewart as host of 'The Daily Show' in 2015?", ["Trevor Noah", "John Oliver", "Hasan Minhaj", "Samantha Bee", "Larry Wilmore", "Stephen Colbert", "Jordan Klepper", "Roy Wood Jr."]),
    c("lat-s5-2", "Seth Meyers hosts which NBC late-night show?", ["Late Night", "The Tonight Show", "The Late Late Show", "Last Call", "Saturday Night", "Nightline", "After Midnight", "Late Edition"]),
    c("lat-s5-3", "Whose studio audience famously barks 'Woof, woof, woof!'?", ["Arsenio Hall", "Montel Williams", "Jay Leno", "Jerry Springer", "Phil Donahue", "Tom Green", "Craig Kilborn", "Dennis Miller"]),
    c("lat-s5-4", "Which Scottish-born host preceded James Corden on 'The Late Late Show'?", ["Craig Ferguson", "Craig Kilborn", "Tom Snyder", "Carson Daly", "Drew Carey", "Bill Maher", "Jimmy Carr", "Jonathan Ross"]),
  ]),
];

const DOUBLE = [
  cat("SKETCH CLASSICS", [
    c("lat-d0-0", "Monty Python's most famous sketch involves a deceased:", ["Parrot", "Cat", "Dog", "Fish", "Rabbit", "Cow", "Canary", "Hamster"]),
    c("lat-d0-1", "In what year did 'Saturday Night Live' debut?", ["1975", "1965", "1970", "1972", "1978", "1980", "1985", "1968"]),
    c("lat-d0-2", "Which Wayans brother created 'In Living Color'?", ["Keenen Ivory Wayans", "Damon Wayans", "Marlon Wayans", "Shawn Wayans", "Kim Wayans", "Craig Wayans", "Dwayne Wayans", "Kyle Wayans"]),
    c("lat-d0-3", "'The Kids in the Hall' is a sketch troupe from which country?", ["Canada", "United Kingdom", "United States", "Australia", "Ireland", "New Zealand", "South Africa", "Scotland"]),
    c("lat-d0-4", "'SCTV' stands for Second City ___.", ["Television", "Tonight", "Theater", "Talent", "Time", "Tour", "Tapes", "Tales"]),
  ]),
  cat("STAND-UP SPECIALS", [
    c("lat-d1-0", "Which comedian performed her Netflix special 'Baby Cobra' while pregnant?", ["Ali Wong", "Amy Schumer", "Tiffany Haddish", "Iliza Shlesinger", "Sarah Silverman", "Mindy Kaling", "Whitney Cummings", "Chelsea Handler"]),
    c("lat-d1-1", "Which comedian's 2021 Netflix special 'Inside' was created alone in one room?", ["Bo Burnham", "John Mulaney", "Hasan Minhaj", "Pete Davidson", "Jim Gaffigan", "Nate Bargatze", "Ronny Chieng", "Neal Brennan"]),
    c("lat-d1-2", "Hannah Gadsby's 'Nanette' made her a star from which country?", ["Australia", "New Zealand", "Ireland", "England", "Canada", "South Africa", "Scotland", "United States"]),
    c("lat-d1-3", "Chris Rock's 1996 HBO special was titled 'Bring the ___.'", ["Pain", "Heat", "Noise", "Fire", "Funk", "Thunder", "Laughs", "Truth"]),
    c("lat-d1-4", "Which comedian's special 'Homecoming King' is about growing up as the child of Indian immigrants?", ["Hasan Minhaj", "Aziz Ansari", "Russell Peters", "Kumail Nanjiani", "Ronny Chieng", "Vir Das", "Aasif Mandvi", "Hari Kondabolu"]),
  ]),
  cat("AWARDS-SHOW HOSTS", [
    c("lat-d2-0", "Which host's 2014 Oscars selfie with Bradley Cooper and Meryl Streep set a Twitter record?", ["Ellen DeGeneres", "Chris Rock", "Whoopi Goldberg", "Jon Stewart", "Jimmy Kimmel", "Neil Patrick Harris", "Steve Martin", "Billy Crystal"]),
    c("lat-d2-1", "Which duo co-hosted the Golden Globes from 2013 to 2015?", ["Tina Fey and Amy Poehler", "Ricky Gervais and Seth Meyers", "Jimmy Fallon and Tina Fey", "Steve Carell and Ellen DeGeneres", "Sarah Silverman and Maya Rudolph", "Kristen Wiig and Maya Rudolph", "Andy Samberg and Sandra Oh", "Amy Schumer and Wanda Sykes"]),
    c("lat-d2-2", "Who hosted the 2025 Oscars?", ["Conan O'Brien", "Jimmy Kimmel", "Chris Rock", "Jon Stewart", "Seth Meyers", "Hugh Jackman", "Neil Patrick Harris", "Ellen DeGeneres"]),
    c("lat-d2-3", "Who has hosted the Oscars the most times?", ["Bob Hope", "Billy Crystal", "Johnny Carson", "Jimmy Kimmel", "Whoopi Goldberg", "Jack Lemmon", "Steve Martin", "Hugh Jackman"]),
    c("lat-d2-4", "Which British comedian hosted the Golden Globes five times, in 2010–12, 2016, and 2020?", ["Ricky Gervais", "Stephen Fry", "Russell Brand", "James Corden", "Jonathan Ross", "John Oliver", "Eddie Izzard", "Sacha Baron Cohen"]),
  ]),
  cat("MEMORABLE MOMENTS", [
    c("lat-d3-0", "In what year did Johnny Carson retire from The Tonight Show?", ["1992", "1985", "1988", "1990", "1994", "1996", "1980", "1998"]),
    c("lat-d3-1", "Whom did Jay Leno ask 'What the hell were you thinking?' after a 1995 arrest?", ["Hugh Grant", "Hugh Laurie", "Robert Downey Jr.", "Charlie Sheen", "Tom Cruise", "Mel Gibson", "Nick Nolte", "Colin Farrell"]),
    c("lat-d3-2", "Which actor appeared bearded and mumbling on Letterman in 2009 for the mockumentary 'I'm Still Here'?", ["Joaquin Phoenix", "Casey Affleck", "Jared Leto", "Shia LaBeouf", "Christian Bale", "Russell Crowe", "Jim Carrey", "Jake Gyllenhaal"]),
    c("lat-d3-3", "Conan O'Brien hosted The Tonight Show for about how long in 2009–2010?", ["Seven months", "Seven years", "Two weeks", "Three years", "One year", "Two months", "Four years", "Six weeks"]),
    c("lat-d3-4", "Which band closed David Letterman's final 'Late Show' in 2015 with 'Everlong'?", ["Foo Fighters", "Pearl Jam", "Nirvana", "Green Day", "Red Hot Chili Peppers", "Weezer", "Soundgarden", "Blink-182"]),
  ]),
  cat("SNL CAST KINGS & QUEENS", [
    c("lat-d4-0", "Which SNL star famously impersonated Alaska governor Sarah Palin in 2008?", ["Tina Fey", "Amy Poehler", "Kristen Wiig", "Maya Rudolph", "Rachel Dratch", "Cecily Strong", "Kate McKinnon", "Molly Shannon"]),
    c("lat-d4-1", "Who was the original 'Weekend Update' anchor, opening with 'I'm Chevy Chase, and you're not'?", ["Chevy Chase", "Dan Aykroyd", "Bill Murray", "Jane Curtin", "Garrett Morris", "Gilda Radner", "Laraine Newman", "Harry Shearer"]),
    c("lat-d4-2", "Which SNL cast member played 'Coffee Talk' host Linda Richman, who gets 'verklempt'?", ["Mike Myers", "Dana Carvey", "Jon Lovitz", "Adam Sandler", "David Spade", "Phil Hartman", "Chris Farley", "Rob Schneider"]),
    c("lat-d4-3", "Which SNL star played President Bill Clinton in many sketches?", ["Phil Hartman", "Dana Carvey", "Darrell Hammond", "Will Ferrell", "Jon Lovitz", "Kevin Nealon", "Mike Myers", "Dennis Miller"]),
    c("lat-d4-4", "Gilda Radner's Roseanne Roseannadanna ends every rant with 'It's always ___.'", ["Something", "Always", "Never", "Something else", "Funny", "Fine", "Okay", "Different"]),
  ]),
  cat("COMEDY CENTRAL CRUDE", [
    c("lat-d5-0", "Which comedian hosts 'Tosh.0'?", ["Daniel Tosh", "Jeff Ross", "Tom Green", "Steve-O", "Andy Samberg", "Nick Cannon", "Chris D'Elia", "Adam Carolla"]),
    c("lat-d5-1", "Which comedian is known as the 'Roastmaster General'?", ["Jeff Ross", "Lisa Lampanelli", "Greg Giraldo", "Anthony Jeselnik", "Pete Davidson", "Kevin Hart", "Bill Burr", "Sarah Silverman"]),
    c("lat-d5-2", "The 2011 Comedy Central Roast of which actor drew record ratings?", ["Charlie Sheen", "Justin Bieber", "Donald Trump", "Bob Saget", "William Shatner", "Flavor Flav", "Rob Lowe", "Joan Rivers"]),
    c("lat-d5-3", "Which 'Key & Peele' star directed the 2017 horror hit 'Get Out'?", ["Jordan Peele", "Keegan-Michael Key", "Dave Chappelle", "Chris Rock", "Donald Glover", "Kevin Hart", "Tyler Perry", "Spike Lee"]),
    c("lat-d5-4", "Which duo created and starred in Comedy Central's 'Broad City'?", ["Ilana Glazer and Abbi Jacobson", "Amy Poehler and Tina Fey", "Kate McKinnon and Aidy Bryant", "Phoebe Robinson and Jessica Williams", "Rachel Bloom and Aline Brosh McKenna", "Issa Rae and Yvonne Orji", "Maya Rudolph and Kristen Wiig", "Ali Wong and Randall Park"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "LATE NIGHT BITS",
  prompt: "In what year did Johnny Carson move The Tonight Show from New York to Burbank, California?",
  choices: ["1972", "1962", "1965", "1968", "1969", "1975", "1978", "1980"],
  correctIndex: 0,
};

export const SPICY_LATE_NIGHT_PACK: TriviaPack = {
  id: "spicy-late-night",
  audience: "spicy",
  title: "Late Night Bits",
  tagline: "Monologues, sketches, couches, and cowbell",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
