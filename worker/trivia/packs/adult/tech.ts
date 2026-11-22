import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("SOCIAL MEDIA", [
    c("atec00", "Which app popularized short, looping dance videos with a For You feed?", ["TikTok", "Vine", "Instagram", "Snapchat", "YouTube", "Twitch", "Pinterest", "Reddit"]),
    c("atec01", "Who founded Facebook in 2004?", ["Mark Zuckerberg", "Jack Dorsey", "Evan Spiegel", "Kevin Systrom", "Jeff Bezos", "Elon Musk", "Larry Page", "Reid Hoffman"]),
    c("atec02", "What is the Snapchat logo?", ["A ghost", "A bird", "A camera", "A speech bubble", "A cat", "A flame", "A star", "A lightning bolt"]),
    c("atec03", "Which company bought Instagram in 2012 for about $1 billion?", ["Facebook", "Google", "Twitter", "Microsoft", "Apple", "Snap", "Yahoo", "Amazon"]),
    c("atec04", "Reddit's mascot, Snoo, is what kind of creature?", ["An alien", "A robot", "A frog", "A cat", "A dog", "A penguin", "An owl", "A ghost"]),
  ]),
  cat("GADGETS", [
    c("atec10", "In what year did Steve Jobs unveil the first iPhone?", ["2007", "2005", "2009", "2010", "2003", "2008", "2006", "2011"]),
    c("atec11", "Which company makes the PlayStation?", ["Sony", "Microsoft", "Nintendo", "Sega", "Atari", "Samsung", "Panasonic", "Philips"]),
    c("atec12", "Alexa is the voice assistant from which company?", ["Amazon", "Google", "Apple", "Samsung", "Microsoft", "Sonos", "Meta", "IBM"]),
    c("atec13", "Which Apple product launched in 2001 promising '1,000 songs in your pocket'?", ["iPod", "iPhone", "iPad", "MacBook", "Apple Watch", "iMac", "AirPods", "Apple TV"]),
    c("atec14", "In what year did the Nintendo Switch launch?", ["2017", "2015", "2016", "2018", "2014", "2019", "2013", "2012"]),
  ]),
  cat("GAMING", [
    c("atec20", "What is Mario's day job?", ["Plumber", "Carpenter", "Electrician", "Chef", "Mechanic", "Painter", "Janitor", "Builder"]),
    c("atec21", "Which battle royale game awards a 'Victory Royale'?", ["Fortnite", "Minecraft", "Roblox", "Among Us", "Overwatch", "Apex Legends", "PUBG", "Valorant"]),
    c("atec22", "In Pac-Man, the ghosts are Blinky, Pinky, Inky, and who?", ["Clyde", "Sue", "Tinky", "Winky", "Binky", "Dinky", "Casper", "Boo"]),
    c("atec23", "Who is the green-clad hero of The Legend of Zelda?", ["Link", "Zelda", "Ganon", "Navi", "Epona", "Sheik", "Mario", "Cloud"]),
    c("atec24", "Which block-building game is the best-selling video game of all time?", ["Minecraft", "Tetris", "Grand Theft Auto V", "Wii Sports", "Fortnite", "Mario Kart 8", "Skyrim", "Terraria"]),
  ]),
  cat("INTERNET CULTURE", [
    c("atec30", "What does the texting abbreviation 'LOL' stand for?", ["Laughing out loud", "Lots of love", "Lots of laughs", "Lack of life", "Love our lives", "Laugh on line", "Lord of laughs", "Little old lady"]),
    c("atec31", "The 'Doge' meme features which breed of dog?", ["Shiba Inu", "Corgi", "Husky", "Pug", "Golden Retriever", "Chihuahua", "Beagle", "Akita"]),
    c("atec32", "The first-ever YouTube video, 'Me at the zoo,' is about which animals?", ["Elephants", "Lions", "Monkeys", "Giraffes", "Penguins", "Bears", "Zebras", "Tigers"]),
    c("atec33", "Which site calls itself 'the front page of the internet'?", ["Reddit", "Digg", "Yahoo", "BuzzFeed", "Tumblr", "Pinterest", "Quora", "Medium"]),
    c("atec34", "In what year was Wikipedia launched?", ["2001", "1999", "2003", "2005", "1997", "2000", "2004", "2002"]),
  ]),
  cat("FOUNDERS", [
    c("atec40", "Which Apple co-founder died in 2011?", ["Steve Jobs", "Steve Wozniak", "Bill Gates", "Tim Cook", "Larry Ellison", "Jony Ive", "Michael Dell", "Paul Allen"]),
    c("atec41", "Bill Gates co-founded Microsoft with which partner?", ["Paul Allen", "Steve Ballmer", "Satya Nadella", "Larry Page", "Steve Wozniak", "Ray Ozzie", "Mark Cuban", "Jeff Bezos"]),
    c("atec42", "Which founder started Amazon as an online bookstore?", ["Jeff Bezos", "Jack Ma", "Elon Musk", "Sergey Brin", "Reed Hastings", "Pierre Omidyar", "Larry Ellison", "Marc Benioff"]),
    c("atec43", "Larry Page co-founded Google with whom?", ["Sergey Brin", "Eric Schmidt", "Sundar Pichai", "Jeff Dean", "Marissa Mayer", "Andy Rubin", "Susan Wojcicki", "Vint Cerf"]),
    c("atec44", "Reed Hastings co-founded Netflix with which partner?", ["Marc Randolph", "Jeff Bezos", "Mark Cuban", "Ted Sarandos", "Brian Chesky", "Travis Kalanick", "Jack Dorsey", "Evan Williams"]),
  ]),
  cat("TECH TERMS", [
    c("atec50", "What does 'WWW' stand for?", ["World Wide Web", "World Wide Wire", "Web Wide World", "Wireless World Web", "Wide Web Window", "World Web Window", "Web World Wire", "Whole World Web"]),
    c("atec51", "What does 'USB' stand for?", ["Universal Serial Bus", "Unified Serial Box", "Universal System Bus", "United Signal Bridge", "Ultra Speed Bus", "Universal Socket Bridge", "User Serial Bus", "Unified System Board"]),
    c("atec52", "What does 'URL' stand for?", ["Uniform Resource Locator", "Universal Resource Link", "United Resource Locator", "Unified Remote Link", "Uniform Remote Locator", "Universal Reference Locator", "Uniform Reference Link", "User Resource Locator"]),
    c("atec53", "Bitcoin was created by someone using which pseudonym?", ["Satoshi Nakamoto", "Vitalik Buterin", "Hal Finney", "Nick Szabo", "Charlie Lee", "Changpeng Zhao", "Sam Bankman-Fried", "Gavin Andresen"]),
    c("atec54", "Which company released ChatGPT in November 2022?", ["OpenAI", "Google", "Meta", "Microsoft", "Anthropic", "Amazon", "Apple", "Nvidia"]),
  ]),
];

const DOUBLE = [
  cat("STREAMING & APPS", [
    c("atec60", "How did Netflix originally deliver movies to customers?", ["DVDs by mail", "Streaming only", "Cable boxes", "Movie theaters", "VHS rentals in stores", "Satellite dishes", "Digital downloads", "Vending kiosks"]),
    c("atec61", "Spotify was founded in which country?", ["Sweden", "Norway", "Denmark", "Finland", "Germany", "Netherlands", "United Kingdom", "United States"]),
    c("atec62", "Which dating app popularized swiping right?", ["Tinder", "Bumble", "Hinge", "Grindr", "Match", "OkCupid", "eHarmony", "Coffee Meets Bagel"]),
    c("atec63", "Which newspaper bought the word game Wordle in 2022?", ["The New York Times", "The Washington Post", "The Wall Street Journal", "USA Today", "The Guardian", "The Atlantic", "Gannett", "BuzzFeed"]),
    c("atec64", "Which live-streaming platform did Amazon buy in 2014?", ["Twitch", "YouTube", "Vimeo", "Mixer", "Periscope", "Dailymotion", "Kick", "Hulu"]),
  ]),
  cat("GAME LORE", [
    c("atec70", "What type is Pikachu in Pokemon?", ["Electric", "Fire", "Water", "Grass", "Normal", "Psychic", "Ghost", "Ice"]),
    c("atec71", "Master Chief is the hero of which video game franchise?", ["Halo", "Gears of War", "Call of Duty", "Destiny", "Doom", "Mass Effect", "Metroid", "Half-Life"]),
    c("atec72", "In Among Us, crewmates try to find which hidden foe?", ["The Impostor", "The Traitor", "The Spy", "The Killer", "The Saboteur", "The Mole", "The Wolf", "The Ghost"]),
    c("atec73", "Grand Theft Auto V is set in which fictional city?", ["Los Santos", "Vice City", "Liberty City", "San Fierro", "Las Venturas", "Carcer City", "Gotham", "Raccoon City"]),
    c("atec74", "Tetris was created in which country?", ["Soviet Union", "Japan", "United States", "Germany", "United Kingdom", "Poland", "China", "France"]),
  ]),
  cat("HARDWARE HISTORY", [
    c("atec80", "In what year was the first iPad released?", ["2010", "2008", "2012", "2007", "2009", "2011", "2013", "2014"]),
    c("atec81", "Which Finnish company dominated early mobile phones?", ["Nokia", "Ericsson", "Motorola", "Siemens", "BlackBerry", "Samsung", "HTC", "LG"]),
    c("atec82", "BlackBerry phones were made by a company from which country?", ["Canada", "Finland", "Sweden", "United States", "Japan", "South Korea", "Germany", "Taiwan"]),
    c("atec83", "Which 1977 console popularized cartridge-based home gaming?", ["Atari 2600", "Nintendo NES", "Intellivision", "ColecoVision", "Magnavox Odyssey", "Sega Genesis", "Commodore 64", "Vectrex"]),
    c("atec84", "Moore's Law predicts a doubling of what on a chip roughly every two years?", ["Transistors", "Internet speed", "Battery life", "Screen resolution", "Phone size", "Hard drive weight", "Memory price", "Clock cycles per hour"]),
  ]),
  cat("CODE & SECURITY", [
    c("atec90", "What do CAPTCHA tests try to tell apart?", ["Humans from bots", "Cats from dogs", "Hackers from admins", "Phones from laptops", "Real from fake emails", "Old from new users", "Servers from clients", "Adults from kids"]),
    c("atec91", "What does 'VPN' stand for?", ["Virtual Private Network", "Very Private Network", "Verified Public Network", "Virtual Protocol Node", "Visual Private Node", "Variable Packet Network", "Virtual Peer Network", "Voice Private Network"]),
    c("atec92", "What does 'HTTP' stand for?", ["HyperText Transfer Protocol", "HyperText Transmission Process", "High Transfer Text Protocol", "Hyperlink Text Transfer Program", "Host Transfer Text Protocol", "Hyper Terminal Transfer Protocol", "HyperText Transport Package", "Home Text Transfer Protocol"]),
    c("atec93", "The Python programming language is named after which British comedy troupe?", ["Monty Python", "The Goodies", "The Goons", "The Young Ones", "Little Britain", "The Mighty Boosh", "Fry and Laurie", "Spitting Image"]),
    c("atec94", "The Y2K bug came from computers storing years as how many digits?", ["Two", "Four", "Six", "Eight", "One", "Three", "Five", "Ten"]),
  ]),
  cat("EMOJI & TEXTING", [
    c("atec100", "Which emoji was Oxford's 2015 'Word of the Year'?", ["Face with Tears of Joy", "Red Heart", "Thumbs Up", "Fire", "Skull", "Loudly Crying Face", "Sparkles", "Eyes"]),
    c("atec101", "In what year was the first SMS text message ('Merry Christmas') sent?", ["1992", "1985", "1999", "1995", "1989", "2001", "1980", "1998"]),
    c("atec102", "What does 'BRB' stand for?", ["Be right back", "Big red button", "Bring really big", "Be real brave", "Back right behind", "Bye right bye", "Be right bold", "Better run back"]),
    c("atec103", "Ray Tomlinson picked the '@' symbol for email addresses in which year?", ["1971", "1965", "1975", "1983", "1969", "1979", "1991", "1960"]),
    c("atec104", "Emoji originated in which country?", ["Japan", "South Korea", "China", "United States", "Finland", "Sweden", "Taiwan", "Singapore"]),
  ]),
  cat("SILICON VALLEY", [
    c("atec110", "Apple's headquarters Apple Park is in which California city?", ["Cupertino", "Palo Alto", "Mountain View", "Menlo Park", "San Jose", "Sunnyvale", "Redwood City", "Santa Clara"]),
    c("atec111", "What is the name of Google's parent company?", ["Alphabet", "Meta", "Oracle", "Intel", "IBM", "Cisco", "Nvidia", "Adobe"]),
    c("atec112", "Facebook's parent company renamed itself Meta in which year?", ["2021", "2019", "2020", "2022", "2018", "2023", "2017", "2016"]),
    c("atec113", "In what year did Twitter rebrand as X?", ["2023", "2021", "2022", "2024", "2020", "2019", "2018", "2025"]),
    c("atec114", "Which company's GPUs became the backbone of the AI boom?", ["Nvidia", "AMD", "Intel", "Qualcomm", "Broadcom", "Micron", "Arm", "Texas Instruments"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "ACRONYMS",
  prompt: "What does the file format 'GIF' stand for?",
  choices: ["Graphics Interchange Format", "General Image Format", "Graphical Internet File", "Global Image Frame", "Gradient Image Format", "Graphic Input Frame", "Generic Interface File", "Giant Image Format"],
  correctIndex: 0,
};

export const ADULT_TECH_PACK: TriviaPack = {
  id: "adult-tech",
  audience: "adult",
  title: "Tech & Internet",
  tagline: "Apps, gadgets, memes, and the people behind them",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
