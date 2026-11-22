import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("80S TOYS & GAMES", [
    c("ens00", "Which colorful twisty puzzle cube was a worldwide craze in the early 1980s?", ["Rubik's Cube", "Magic 8 Ball", "Etch A Sketch", "Slinky", "Simon", "Lite-Brite", "Pop-Up Pirate", "Tangram Cube"]),
    c("ens01", "Which red-capped plumber is the hero of Super Mario Bros. (1985)?", ["Mario", "Luigi", "Wario", "Toad", "Link", "Pac-Man", "Sonic", "Mega Man"]),
    c("ens02", "Which adoptable dolls with unique birth certificates caused holiday shopping frenzies in the 1980s?", ["Cabbage Patch Kids", "Barbie Babies", "Strawberry Shortcake", "Care Bears", "Teddy Ruxpin", "Pound Puppies", "My Little Pony", "Glo Worms"]),
    c("ens03", "Which Nintendo handheld console launched in 1989?", ["Game Boy", "Game Gear", "Lynx", "PSP", "Nintendo DS", "Virtual Boy", "Neo Geo Pocket", "Switch"]),
    c("ens04", "The falling-block puzzle game Tetris was created in which country?", ["Soviet Union", "Japan", "United States", "Canada", "United Kingdom", "Germany", "Sweden", "France"]),
  ]),
  cat("90S TECH & TOYS", [
    c("ens10", "Which 1996 keychain toy required you to feed and care for a virtual pet?", ["Tamagotchi", "Furby", "Pet Rock", "Game Boy Color", "Tickle Me Elmo", "Talk Boy", "Polly Pocket", "Bop It"]),
    c("ens11", "Which small bean-filled plush animals became a huge 1990s collectible craze?", ["Beanie Babies", "Care Bears", "Squishmallows", "Teddy Ruxpin", "Furbys", "Webkinz", "Build-A-Bears", "Pound Puppies"]),
    c("ens12", "Which franchise's slogan is \"Gotta catch 'em all!\"?", ["Pokémon", "Digimon", "Yu-Gi-Oh!", "Power Rangers", "Sailor Moon", "Dragon Ball Z", "Sonic", "Bakugan"]),
    c("ens13", "Which colorful Apple computer, introduced in 1998, came in translucent \"Bondi Blue\"?", ["iMac", "iPod", "MacBook", "Apple II", "Newton", "PowerBook", "Mac mini", "iPad"]),
    c("ens14", "Which search engine, founded in 1998, started in a garage?", ["Google", "Yahoo", "Ask Jeeves", "AltaVista", "Bing", "AOL Search", "Lycos", "DuckDuckGo"]),
  ]),
  cat("80S MOVIES", [
    c("ens20", "In E.T. the Extra-Terrestrial, what does the alien want to do?", ["Phone home", "Fly home", "Eat candy", "Meet the president", "Build a rocket", "Go to school", "Find a pet", "Learn to dance"]),
    c("ens21", "In Back to the Future, the DeLorean needs to reach how many miles per hour to time travel?", ["88", "55", "66", "99", "100", "77", "120", "44"]),
    c("ens22", "Complete the 1984 movie theme song: \"If there's something strange in your neighborhood, who ya gonna call?\"", ["Ghostbusters", "Exterminators", "Poltergeist Patrol", "The Spook Squad", "Ghost Hunters", "The Paranormals", "Slimer Services", "The Stay Puft Men"]),
    c("ens23", "In The Goonies, which pirate's treasure are the kids hunting?", ["One-Eyed Willy", "Blackbeard", "Captain Hook", "Long John Silver", "Davy Jones", "Captain Kidd", "Barbarossa", "Calico Jack"]),
    c("ens24", "Which furry forest-dwelling creatures help the Rebels in Return of the Jedi?", ["Ewoks", "Wookiees", "Jawas", "Gungans", "Tusken Raiders", "Hutts", "Porgs", "Sullustans"]),
  ]),
  cat("90S MOVIES", [
    c("ens30", "Which 1994 Disney movie features a lion cub named Simba?", ["The Lion King", "Aladdin", "Beauty and the Beast", "Tarzan", "Pocahontas", "Hercules", "Mulan", "The Jungle Book"]),
    c("ens31", "In the 1997 movie Titanic, the ship sinks in which ocean?", ["Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Arctic Ocean", "Southern Ocean", "Mediterranean Sea", "Caribbean Sea", "Baltic Sea"]),
    c("ens32", "Who directed Jurassic Park (1993)?", ["Steven Spielberg", "George Lucas", "James Cameron", "Ron Howard", "Robert Zemeckis", "Tim Burton", "Chris Columbus", "Peter Jackson"]),
    c("ens33", "Home Alone 2: Lost in New York takes Kevin to which city?", ["New York City", "Los Angeles", "Chicago", "Boston", "Miami", "Seattle", "Orlando", "Washington, D.C."]),
    c("ens34", "Which actor voiced Buzz Lightyear in the original Toy Story?", ["Tim Allen", "Tom Hanks", "Billy Crystal", "Jim Carrey", "Chevy Chase", "Steve Martin", "Kevin Costner", "Michael Keaton"]),
  ]),
  cat("80S & 90S MUSIC", [
    c("ens40", "Which star released the best-selling album Thriller in 1982?", ["Michael Jackson", "Prince", "Madonna", "Whitney Houston", "Bruce Springsteen", "Lionel Richie", "Cyndi Lauper", "George Michael"]),
    c("ens41", "Which girl group sang \"Wannabe\" in 1996?", ["Spice Girls", "Destiny's Child", "TLC", "The Bangles", "Wilson Phillips", "All Saints", "En Vogue", "Bananarama"]),
    c("ens42", "Which boy band sang \"I Want It That Way\"?", ["Backstreet Boys", "*NSYNC", "New Kids on the Block", "Boyz II Men", "98 Degrees", "Hanson", "Take That", "Jonas Brothers"]),
    c("ens43", "Which singer starred in and recorded the 1984 album Purple Rain?", ["Prince", "David Bowie", "Michael Jackson", "Lionel Richie", "Stevie Wonder", "Rick James", "George Michael", "Billy Idol"]),
    c("ens44", "In what year did MTV launch?", ["1981", "1979", "1983", "1985", "1987", "1977", "1989", "1991"]),
  ]),
  cat("TV TIME", [
    c("ens50", "Which sitcom follows Danny Tanner raising three girls with help from Uncle Jesse and Joey?", ["Full House", "Family Matters", "Step by Step", "Growing Pains", "Boy Meets World", "Home Improvement", "Roseanne", "Blossom"]),
    c("ens51", "Which 1990s sitcom features six friends who hang out at the coffeehouse Central Perk?", ["Friends", "Seinfeld", "Frasier", "Cheers", "Mad About You", "Home Improvement", "Wings", "Family Ties"]),
    c("ens52", "In The Fresh Prince of Bel-Air, Will moves from West Philadelphia to live in which place?", ["Bel-Air", "Beverly Hills", "Malibu", "Brooklyn", "Hollywood", "Miami", "Chicago", "Santa Monica"]),
    c("ens53", "The Teenage Mutant Ninja Turtles are named after famous artists from which country?", ["Italy", "France", "Spain", "Japan", "Netherlands", "Germany", "England", "Mexico"]),
    c("ens54", "In what year did The Simpsons debut as a regular half-hour series?", ["1989", "1985", "1987", "1991", "1993", "1995", "1983", "1990"]),
  ]),
];

const DOUBLE = [
  cat("ARCADE & VIDEO GAMES", [
    c("end00", "In Pac-Man, the hungry yellow hero is chased by what?", ["Ghosts", "Robots", "Aliens", "Monsters", "Ninjas", "Pirates", "Dinosaurs", "Wizards"]),
    c("end01", "Sonic the Hedgehog was the mascot of which video game company?", ["Sega", "Nintendo", "Atari", "Sony", "Capcom", "Namco", "Microsoft", "Konami"]),
    c("end02", "In The Legend of Zelda, who is the hero in the green tunic?", ["Link", "Zelda", "Ganon", "Mario", "Epona", "Navi", "Sheik", "Impa"]),
    c("end03", "Mario's original arcade name in Donkey Kong (1981) was:", ["Jumpman", "Mr. Video", "Plumber Pete", "Super Guy", "Red Cap", "Hammerman", "Leapman", "Mushroom Man"]),
    c("end04", "The Legend of Zelda: Ocarina of Time (1998) was released for which console?", ["Nintendo 64", "Super Nintendo", "Game Boy", "GameCube", "Sega Genesis", "PlayStation", "Dreamcast", "NES"]),
  ]),
  cat("SATURDAY MORNING CARTOONS", [
    c("end10", "Where does SpongeBob SquarePants live?", ["A pineapple under the sea", "A rock", "A shoe", "A shell", "A boat", "A castle", "A bucket", "A treasure chest"]),
    c("end11", "In Rugrats, which baby is the fearless leader of the group?", ["Tommy Pickles", "Chuckie Finster", "Phil DeVille", "Lil DeVille", "Dil Pickles", "Angelica Pickles", "Susie Carmichael", "Kimi Finster"]),
    c("end12", "Which 1980s cartoon hero shouts \"By the power of Grayskull!\"?", ["He-Man", "Optimus Prime", "Voltron", "Duke", "Skeletor", "Leonardo", "Thundercat Lion-O", "Inspector Gadget"]),
    c("end13", "Which 1990s cartoon follows a boy genius with a secret laboratory?", ["Dexter's Laboratory", "Rocko's Modern Life", "Hey Arnold!", "Doug", "Ren & Stimpy", "Johnny Bravo", "Cow and Chicken", "Recess"]),
    c("end14", "Who is the leader of the heroic Autobots in Transformers?", ["Optimus Prime", "Megatron", "Bumblebee", "Starscream", "Soundwave", "Jazz", "Ironhide", "Ratchet"]),
  ]),
  cat("FADS & CRAZES", [
    c("end20", "Which 1990s bracelet snapped around your wrist when you slapped it on?", ["Slap bracelet", "Friendship band", "Charm bracelet", "Mood ring", "Jelly bracelet", "Spring cuff", "Wristband watch", "Glow stick"]),
    c("end21", "Which Sony portable device let people play cassette tapes with headphones?", ["Walkman", "Discman", "iPod", "Boombox", "Mini Disc", "Gameboy", "Pager", "Camcorder"]),
    c("end22", "Which small cardboard discs were stacked and flipped in a popular 1990s playground game?", ["Pogs", "Beyblades", "Marbles", "Yo-yos", "Jacks", "Tamagotchis", "Trolls", "Bakugan"]),
    c("end23", "Which dance move did Michael Jackson famously perform in 1983?", ["Moonwalk", "Robot", "Macarena", "Running Man", "Worm", "Sprinkler", "Electric slide", "Twist"]),
    c("end24", "Which 1996 dance craze was set to a hit by the duo Los del Río?", ["Macarena", "Lambada", "Cha-Cha Slide", "Electric Slide", "Hokey Pokey", "Twist", "Conga", "Hustle"]),
  ]),
  cat("80S & 90S INVENTIONS", [
    c("end30", "What does CD stand for?", ["Compact Disc", "Computer Data", "Color Display", "Cable Drive", "Copy Device", "Central Disk", "Cassette Deck", "Command Drive"]),
    c("end31", "Which company released Windows 95?", ["Microsoft", "Apple", "IBM", "Intel", "Sun Microsystems", "Dell", "Netscape", "Atari"]),
    c("end32", "In 1990, NASA launched which famous space telescope?", ["Hubble", "Kepler", "Spitzer", "Chandra", "Webb", "Voyager", "Galileo", "Cassini"]),
    c("end33", "Which sheep, born in 1996, was the first mammal cloned from an adult cell?", ["Dolly", "Molly", "Polly", "Shaun", "Lambchop", "Wooly", "Bella", "Daisy"]),
    c("end34", "Who invented the World Wide Web in 1989?", ["Tim Berners-Lee", "Bill Gates", "Steve Jobs", "Marc Andreessen", "Vint Cerf", "Larry Page", "Jeff Bezos", "Mark Zuckerberg"]),
  ]),
  cat("SPORTS & EVENTS", [
    c("end40", "Michael Jordan won six NBA championships with which team?", ["Chicago Bulls", "Los Angeles Lakers", "Boston Celtics", "New York Knicks", "Detroit Pistons", "Miami Heat", "Houston Rockets", "Philadelphia 76ers"]),
    c("end41", "In 1992, a team of NBA stars nicknamed the \"Dream Team\" won Olympic gold in which sport?", ["Basketball", "Baseball", "Soccer", "Volleyball", "Hockey", "Football", "Tennis", "Water polo"]),
    c("end42", "Which country hosted the 1994 FIFA World Cup?", ["United States", "Brazil", "Italy", "France", "Mexico", "Germany", "Spain", "Japan"]),
    c("end43", "Which U.S. city hosted the 1996 Summer Olympics?", ["Atlanta", "Los Angeles", "Chicago", "New York City", "Seattle", "Houston", "Dallas", "Boston"]),
    c("end44", "At the 1980 Winter Olympics, the U.S. hockey team's \"Miracle on Ice\" beat which team?", ["Soviet Union", "Canada", "Sweden", "Finland", "Czechoslovakia", "West Germany", "Norway", "Switzerland"]),
  ]),
  cat("SNACKS & TREATS", [
    c("end50", "Which candy crackles and pops in your mouth?", ["Pop Rocks", "Skittles", "Jolly Ranchers", "Nerds", "Twizzlers", "Smarties", "Dum Dums", "Gobstoppers"]),
    c("end51", "Which drink comes in a foil pouch with a plastic straw?", ["Capri Sun", "Hawaiian Punch", "Kool-Aid", "Sunny D", "Yoo-hoo", "Gatorade", "Mountain Dew", "Hi-C"]),
    c("end52", "In 1985, which soft drink company released a controversial \"New\" version of its main drink?", ["Coca-Cola", "Pepsi", "Dr Pepper", "7 Up", "Sprite", "Fanta", "Mountain Dew", "Mug Root Beer"]),
    c("end53", "Dunkaroos were cookies served with a tub of what?", ["Frosting", "Peanut butter", "Chocolate syrup", "Jelly", "Honey", "Whipped cream", "Pudding", "Cream cheese"]),
    c("end54", "Which Pizza Hut reading program rewarded kids with free pizza?", ["Book It!", "Read Up!", "Page Turners", "Slice of Learning", "Story Time Pizza", "Pizza Pals", "Chapter Club", "Reading Rocks"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "DECADE DASH",
  prompt: "In which year did the Berlin Wall fall?",
  choices: ["1989", "1987", "1991", "1985", "1990", "1988", "1993", "1986"],
  correctIndex: 0,
};

export const FAMILY_80S_90S_PACK: TriviaPack = {
  id: "family-80s-90s",
  audience: "family",
  title: "80s & 90s Nostalgia",
  tagline: "Cartoons, cassettes, and Saturday morning memories",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
