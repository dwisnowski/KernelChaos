import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("DIGITAL DAYS", [
    c("a20s00", "Which social network made 'Tom' everyone's first friend?", ["Myspace", "Friendster", "Facebook", "Bebo", "Orkut", "Xanga", "LiveJournal", "Piczo"]),
    c("a20s01", "Which Motorola flip phone was the must-have gadget of 2004?", ["Razr", "Nokia 3310", "T-Mobile Sidekick", "BlackBerry Pearl", "Palm Treo", "LG Chocolate", "Sony Ericsson K750", "Samsung Blackjack"]),
    c("a20s02", "Which chat service was famous for 'away messages' and buddy lists?", ["AOL Instant Messenger", "Discord", "Slack", "WhatsApp", "Skype", "Telegram", "Kik", "Snapchat"]),
    c("a20s03", "Which Apple service launched in 2003 selling songs for 99 cents?", ["iTunes Store", "Napster", "LimeWire", "Kazaa", "Spotify", "Pandora", "Rhapsody", "Zune"]),
    c("a20s04", "Which video site was founded in 2005?", ["YouTube", "Vimeo", "Netflix", "Hulu", "Twitch", "Vine", "Dailymotion", "Veoh"]),
  ]),
  cat("TV OF THE 2000S", [
    c("a20s10", "Which American Idol judge was famous for his blunt critiques?", ["Simon Cowell", "Randy Jackson", "Paula Abdul", "Ryan Seacrest", "Howie Mandel", "Piers Morgan", "Gordon Ramsay", "Heidi Klum"]),
    c("a20s11", "The O.C. is set in which California county?", ["Orange County", "Los Angeles County", "San Diego County", "Santa Barbara County", "San Francisco County", "Ventura County", "Riverside County", "Marin County"]),
    c("a20s12", "Desperate Housewives takes place on which street?", ["Wisteria Lane", "Elm Street", "Sesame Street", "Maple Avenue", "Cherry Lane", "Peach Street", "Pine Valley Road", "Fortune Drive"]),
    c("a20s13", "Which reality show begins its elimination ceremony with 'The tribe has spoken'?", ["Survivor", "Big Brother", "The Amazing Race", "The Bachelor", "Fear Factor", "Project Runway", "Top Chef", "America's Next Top Model"]),
    c("a20s14", "Gilmore Girls is set in which fictional Connecticut town?", ["Stars Hollow", "Pawnee", "Sunnydale", "Hawkins", "Capeside", "Tree Hill", "Riverdale", "Cabot Cove"]),
  ]),
  cat("2000S MOVIES", [
    c("a20s20", "Who voiced Shrek in the 2001 animated film?", ["Mike Myers", "Eddie Murphy", "Cameron Diaz", "John Lithgow", "Antonio Banderas", "Rob Schneider", "Jim Carrey", "Ben Stiller"]),
    c("a20s21", "Which 2004 comedy gave us 'Stop trying to make fetch happen'?", ["Mean Girls", "Clueless", "Legally Blonde", "Bring It On", "Easy A", "She's the Man", "13 Going on 30", "Aquamarine"]),
    c("a20s22", "Which 2008 Pixar film stars a lonely trash-compacting robot?", ["WALL-E", "Up", "Ratatouille", "Cars", "Finding Nemo", "Monsters, Inc.", "The Incredibles", "Brave"]),
    c("a20s23", "Which epic trilogy concluded in 2003 with The Return of the King?", ["The Lord of the Rings", "The Matrix", "Star Wars prequels", "Pirates of the Caribbean", "Spider-Man", "X-Men", "The Bourne films", "Harry Potter"]),
    c("a20s24", "Which 2007 indie comedy follows a quirky teen with a hamburger phone and an unplanned pregnancy?", ["Juno", "Superbad", "Knocked Up", "Easy A", "Mean Girls", "Napoleon Dynamite", "Thirteen", "Lady Bird"]),
  ]),
  cat("2000S MUSIC", [
    c("a20s30", "Which duo sang 'Hey Ya!' in 2003?", ["OutKast", "Black Eyed Peas", "N.E.R.D", "Gnarls Barkley", "Daft Punk", "Run the Jewels", "Salt-N-Pepa", "Cypress Hill"]),
    c("a20s31", "Which band sang 'Mr. Brightside'?", ["The Killers", "Kings of Leon", "The Strokes", "Franz Ferdinand", "Arctic Monkeys", "The Fray", "Maroon 5", "Paramore"]),
    c("a20s32", "Who sang 'Hollaback Girl' in 2005?", ["Gwen Stefani", "Avril Lavigne", "Pink", "Kelly Clarkson", "Fergie", "Ashlee Simpson", "Hilary Duff", "Kesha"]),
    c("a20s33", "Linkin Park's 'In the End' comes from which 2000 album?", ["Hybrid Theory", "Meteora", "Minutes to Midnight", "Reanimation", "A Thousand Suns", "Living Things", "One More Light", "The Hunting Party"]),
    c("a20s34", "Who won the first season of American Idol in 2002?", ["Kelly Clarkson", "Carrie Underwood", "Fantasia Barrino", "Ruben Studdard", "Taylor Hicks", "Jordin Sparks", "David Cook", "Clay Aiken"]),
  ]),
  cat("FADS & FASHION", [
    c("a20s40", "Which sneakers had wheels hidden in the heels?", ["Heelys", "Crocs", "Vans", "Skechers", "Converse", "Reebok Pumps", "Adidas Superstars", "Keds"]),
    c("a20s41", "Which brand made the velour tracksuit a must-have?", ["Juicy Couture", "Abercrombie & Fitch", "Hollister", "American Eagle", "Gap", "Aeropostale", "Old Navy", "Forever 21"]),
    c("a20s42", "What color was the Livestrong wristband?", ["Yellow", "Blue", "Red", "Pink", "Green", "Black", "White", "Orange"]),
    c("a20s43", "Which plush toys came with a code to unlock an online world in 2005?", ["Webkinz", "Beanie Babies", "Furby", "Build-A-Bear", "Squishmallows", "Tamagotchi", "Pillow Pets", "Neopets"]),
    c("a20s44", "Which MTV show starring Ashton Kutcher pranked celebrities?", ["Punk'd", "Jackass", "Pimp My Ride", "Cribs", "Newlyweds", "Laguna Beach", "Pranked", "TRL"]),
  ]),
  cat("GAME ON", [
    c("a20s50", "Which console launched in 2006 with Wii Sports?", ["Nintendo Wii", "Xbox 360", "PlayStation 3", "GameCube", "Dreamcast", "PSP", "Nintendo DS", "Game Boy Advance"]),
    c("a20s51", "Which 2004 MMORPG is set in the world of Azeroth?", ["World of Warcraft", "EverQuest", "RuneScape", "Second Life", "Guild Wars", "Final Fantasy XI", "Lineage", "Ultima Online"]),
    c("a20s52", "Which 2005 game let players shred on a plastic guitar controller?", ["Guitar Hero", "Rock Band", "Dance Dance Revolution", "SingStar", "Karaoke Revolution", "Wii Fit", "Just Dance", "Band Hero"]),
    c("a20s53", "Halo: Combat Evolved launched in 2001 on which console?", ["Xbox", "PlayStation 2", "GameCube", "Dreamcast", "Game Boy Advance", "N-Gage", "PSP", "Nintendo 64"]),
    c("a20s54", "Which 2004 Nintendo handheld had two screens?", ["Nintendo DS", "Game Boy Advance", "PSP", "Nintendo Switch", "Nintendo 3DS", "Game Gear", "N-Gage", "WonderSwan"]),
  ]),
];

const DOUBLE = [
  cat("REALITY & SMALL SCREEN", [
    c("a20d00", "Which reality show ends each season with a 'final rose'?", ["The Bachelor", "Survivor", "Love Island", "Big Brother", "The Amazing Race", "Project Runway", "Top Chef", "American Idol"]),
    c("a20d01", "Which 2003 MTV series followed Nick Lachey and Jessica Simpson?", ["Newlyweds", "Laguna Beach", "The Hills", "The Osbournes", "Cribs", "Jersey Shore", "Teen Mom", "The Simple Life"]),
    c("a20d02", "Which rapper hosted MTV's Pimp My Ride?", ["Xzibit", "Ludacris", "Snoop Dogg", "Ja Rule", "Nelly", "Fabolous", "Eminem", "50 Cent"]),
    c("a20d03", "Who voiced the anonymous narrator of Gossip Girl?", ["Kristen Bell", "Blake Lively", "Leighton Meester", "Taylor Momsen", "Jessica Szohr", "Sarah Michelle Gellar", "Alexis Bledel", "Rachel Bilson"]),
    c("a20d04", "In How I Met Your Mother, which bar do the friends hang out at?", ["MacLaren's", "Cheers", "Paddy's Pub", "Moe's Tavern", "Monk's Cafe", "Central Perk", "The Drunken Clam", "The Bronze"]),
  ]),
  cat("WEB & TECH", [
    c("a20d10", "Which search engine used a butler as its mascot?", ["Ask Jeeves", "AltaVista", "Lycos", "Yahoo", "Excite", "Dogpile", "HotBot", "Bing"]),
    c("a20d11", "Napster, launched in 1999, let users share what?", ["MP3 files", "Photos", "Videos", "Emails", "Games", "Ringtones", "Text messages", "Contacts"]),
    c("a20d12", "In what year did Facebook open to the general public?", ["2006", "2004", "2008", "2007", "2005", "2009", "2010", "2003"]),
    c("a20d13", "Which web browser from Mozilla launched in 2004?", ["Firefox", "Chrome", "Safari", "Opera", "Edge", "Netscape", "Internet Explorer", "Brave"]),
    c("a20d14", "Which Microsoft messenger popularized the 'nudge' feature?", ["MSN Messenger", "AIM", "Yahoo Messenger", "Skype", "ICQ", "Trillian", "Google Talk", "Pidgin"]),
  ]),
  cat("POP CHARTS", [
    c("a20d20", "Who sang 'Complicated' in 2002?", ["Avril Lavigne", "Alanis Morissette", "Pink", "Michelle Branch", "Vanessa Carlton", "Kelly Clarkson", "Hilary Duff", "Ashlee Simpson"]),
    c("a20d21", "Beyonce's 2003 solo debut 'Crazy in Love' featured which rapper?", ["Jay-Z", "Kanye West", "Ludacris", "Nelly", "Lil Wayne", "T.I.", "Snoop Dogg", "Ja Rule"]),
    c("a20d22", "Which duo scored a hit with 'Seven Nation Army'?", ["The White Stripes", "The Strokes", "Franz Ferdinand", "The Black Keys", "Arctic Monkeys", "Vampire Weekend", "Jet", "Kings of Leon"]),
    c("a20d23", "Who sang 'Hips Don't Lie' in 2006?", ["Shakira", "Beyonce", "Jennifer Lopez", "Rihanna", "Christina Aguilera", "Nelly Furtado", "Fergie", "Gwen Stefani"]),
    c("a20d24", "Whose 2006 album Back to Black included 'Rehab'?", ["Amy Winehouse", "Adele", "Duffy", "Lily Allen", "Norah Jones", "Joss Stone", "Corinne Bailey Rae", "Leona Lewis"]),
  ]),
  cat("TEEN SCREEN", [
    c("a20d30", "Who starred as Elle Woods in Legally Blonde?", ["Reese Witherspoon", "Kirsten Dunst", "Amanda Bynes", "Hilary Duff", "Lindsay Lohan", "Anne Hathaway", "Mandy Moore", "Jessica Alba"]),
    c("a20d31", "Which 2000 cheerleading comedy starred Kirsten Dunst?", ["Bring It On", "Mean Girls", "She's All That", "Drive Me Crazy", "Sugar & Spice", "Stick It", "Pitch Perfect", "Cheaper by the Dozen"]),
    c("a20d32", "High School Musical's East High mascot is the what?", ["Wildcats", "Titans", "Tigers", "Panthers", "Eagles", "Spartans", "Bulldogs", "Jets"]),
    c("a20d33", "Twilight is set in which small Washington town?", ["Forks", "Port Angeles", "Seattle", "Spokane", "Tacoma", "Olympia", "Bellingham", "Walla Walla"]),
    c("a20d34", "Who played 'McLovin' in Superbad?", ["Christopher Mintz-Plasse", "Michael Cera", "Jonah Hill", "Seth Rogen", "Jason Segel", "Dave Franco", "Bill Hader", "Jesse Eisenberg"]),
  ]),
  cat("TOYS & TRENDS", [
    c("a20d40", "Which self-balancing two-wheeled transporter debuted in 2001?", ["Segway", "Hoverboard", "Razor scooter", "Heelys", "Onewheel", "Pogo stick", "Rollerblades", "Skateboard"]),
    c("a20d41", "Which fashion dolls challenged Barbie starting in 2001?", ["Bratz", "Monster High", "My Scene", "Polly Pocket", "American Girl", "Cabbage Patch Kids", "Strawberry Shortcake", "Blythe"]),
    c("a20d42", "Which colorful animal-shaped rubber bracelets were a 2008 craze?", ["Silly Bandz", "Livestrong bands", "Pogs", "Beanie Babies", "Bakugan", "Zhu Zhu Pets", "Webkinz", "Moon Shoes"]),
    c("a20d43", "Which Nintendo DS game let you raise virtual puppies?", ["Nintendogs", "Tamagotchi", "Pokemon", "Animal Crossing", "Webkinz", "Neopets", "Tetris", "Brain Age"]),
    c("a20d44", "Zhu Zhu Pets, a 2009 toy hit, were robotic versions of which animal?", ["Hamsters", "Hedgehogs", "Puppies", "Kittens", "Bunnies", "Mice", "Pandas", "Ferrets"]),
  ]),
  cat("HEADLINES", [
    c("a20d50", "The disputed 2000 U.S. presidential election hinged on a recount in which state?", ["Florida", "Ohio", "Texas", "Pennsylvania", "Michigan", "Georgia", "Arizona", "Wisconsin"]),
    c("a20d51", "Who won the 2008 U.S. presidential election?", ["Barack Obama", "John McCain", "Hillary Clinton", "Mitt Romney", "Ron Paul", "Al Gore", "John Kerry", "Mike Huckabee"]),
    c("a20d52", "Which city hosted the 2008 Summer Olympics, featuring the Bird's Nest stadium?", ["Beijing", "Athens", "Sydney", "London", "Rio de Janeiro", "Seoul", "Tokyo", "Atlanta"]),
    c("a20d53", "Which company held a famous Dutch-auction IPO in 2004?", ["Google", "Facebook", "Apple", "Amazon", "Yahoo", "eBay", "Microsoft", "Netflix"]),
    c("a20d54", "In what year did euro banknotes and coins enter circulation?", ["2002", "1999", "2000", "2004", "2001", "2005", "1998", "2003"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "HIT MOVIES",
  prompt: "The 2003 Pirates of the Caribbean film is subtitled 'The Curse of the ___'?",
  choices: ["Black Pearl", "Dead Man's Chest", "Flying Dutchman", "Golden Compass", "Silver Skull", "Black Spot", "Queen Anne's Revenge", "Jolly Roger"],
  correctIndex: 0,
};

export const ADULT_2000S_PACK: TriviaPack = {
  id: "adult-2000s",
  audience: "adult",
  title: "2000s Nostalgia",
  tagline: "Flip phones, reality TV, and dial-up dreams",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
