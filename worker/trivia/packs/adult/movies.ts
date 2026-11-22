import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("BLOCKBUSTERS", [
    c("amvs00", "Which 1975 Spielberg film made a generation nervous about swimming in the ocean?", ["Jaws", "Orca", "Piranha", "Deep Blue Sea", "The Shallows", "Open Water", "Cujo", "Sharknado"]),
    c("amvs01", "In Jurassic Park (1993), what preserved-in-amber insect supplies the dinosaur DNA?", ["Mosquito", "Horsefly", "Honeybee", "Tick", "Beetle", "Wasp", "Gnat", "Dragonfly"]),
    c("amvs02", "Who played Rose DeWitt Bukater in Titanic (1997)?", ["Kate Winslet", "Gwyneth Paltrow", "Cate Blanchett", "Claire Danes", "Winona Ryder", "Kirsten Dunst", "Reese Witherspoon", "Emily Watson"]),
    c("amvs03", "Which 2012 film first teamed up Iron Man, Thor, Hulk, and Captain America on screen?", ["The Avengers", "Iron Man 3", "Civil War", "Age of Ultron", "Justice League", "Thor: The Dark World", "Guardians of the Galaxy", "Captain America: The First Avenger"]),
    c("amvs04", "Christopher Nolan finally won his first Best Director Oscar for which film?", ["Oppenheimer", "Dunkirk", "Inception", "The Dark Knight", "Interstellar", "Memento", "Tenet", "The Prestige"]),
  ]),
  cat("SITCOMS", [
    c("amvs10", "Which sitcom bar is the place 'where everybody knows your name'?", ["Cheers", "Monk's Cafe", "MacLaren's", "Paddy's Pub", "Moe's Tavern", "The Peach Pit", "The Max", "The Drunken Clam"]),
    c("amvs11", "In the US version of The Office, the Dunder Mifflin branch is based in which Pennsylvania city?", ["Scranton", "Stamford", "Harrisburg", "Allentown", "Erie", "Pittsburgh", "Reading", "Altoona"]),
    c("amvs12", "Who is Jerry Seinfeld's lanky, door-bursting neighbor?", ["Kramer", "Newman", "George", "Puddy", "Frank Costanza", "Uncle Leo", "J. Peterman", "Elaine"]),
    c("amvs13", "Leslie Knope works for the Parks Department in which fictional Indiana town?", ["Pawnee", "Eagleton", "Stars Hollow", "Sunnydale", "Hawkins", "Quahog", "Springfield", "Cabot Cove"]),
    c("amvs14", "The Bluths are the dysfunctional family at the center of which sitcom?", ["Arrested Development", "Modern Family", "Malcolm in the Middle", "Schitt's Creek", "Married with Children", "The Middle", "Family Ties", "Roseanne"]),
  ]),
  cat("QUOTABLE LINES", [
    c("amvs20", "\"I'll be back\" is the famous line from which film?", ["The Terminator", "Total Recall", "Commando", "Predator", "RoboCop", "Conan the Barbarian", "True Lies", "Twins"]),
    c("amvs21", "\"Here's looking at you, kid\" comes from which classic?", ["Casablanca", "Gone with the Wind", "Citizen Kane", "The Maltese Falcon", "Rear Window", "Vertigo", "Sunset Boulevard", "Notorious"]),
    c("amvs22", "\"You can't handle the truth!\" is shouted in which courtroom drama?", ["A Few Good Men", "The Firm", "Philadelphia", "Jerry Maguire", "Top Gun", "Rain Man", "The Rock", "Courage Under Fire"]),
    c("amvs23", "\"Say hello to my little friend!\" is from which crime film?", ["Scarface", "Goodfellas", "Casino", "The Godfather", "Heat", "Carlito's Way", "Donnie Brasco", "Blow"]),
    c("amvs24", "\"I see dead people\" is whispered in which twisty thriller?", ["The Sixth Sense", "Signs", "Unbreakable", "The Others", "Poltergeist", "The Ring", "The Orphanage", "What Lies Beneath"]),
  ]),
  cat("DIRECTORS", [
    c("amvs30", "Who directed both Jaws and E.T.?", ["Steven Spielberg", "George Lucas", "Ridley Scott", "Robert Zemeckis", "Ron Howard", "Rob Reiner", "Francis Ford Coppola", "John Landis"]),
    c("amvs31", "Which director made both Titanic and Avatar?", ["James Cameron", "Michael Bay", "Peter Jackson", "Zack Snyder", "J.J. Abrams", "Roland Emmerich", "Ridley Scott", "Gore Verbinski"]),
    c("amvs32", "Who directed the 2019 Best Picture winner Parasite?", ["Bong Joon-ho", "Park Chan-wook", "Hirokazu Kore-eda", "Ang Lee", "Wong Kar-wai", "Akira Kurosawa", "Hayao Miyazaki", "Guillermo del Toro"]),
    c("amvs33", "Who directed the 2023 hit Barbie?", ["Greta Gerwig", "Sofia Coppola", "Jane Campion", "Kathryn Bigelow", "Chloe Zhao", "Ava DuVernay", "Nora Ephron", "Nancy Meyers"]),
    c("amvs34", "Which director is known for symmetrical pastel style in The Grand Budapest Hotel?", ["Wes Anderson", "Taika Waititi", "Noah Baumbach", "Spike Jonze", "Paul Thomas Anderson", "Joel Coen", "Sofia Coppola", "Michel Gondry"]),
  ]),
  cat("STREAMING HITS", [
    c("amvs40", "Stranger Things is set in which fictional Indiana town?", ["Hawkins", "Derry", "Sunnydale", "Twin Peaks", "Castle Rock", "Riverdale", "Woodsboro", "Haddonfield"]),
    c("amvs41", "The hit survival drama Squid Game comes from which country?", ["South Korea", "Japan", "China", "Thailand", "Taiwan", "Singapore", "Philippines", "Vietnam"]),
    c("amvs42", "What is the nickname fans gave the Mandalorian's tiny green sidekick, whose real name is Grogu?", ["Baby Yoda", "Baby Groot", "Mini Chewie", "Little Ewok", "Jawa Junior", "Porg Pup", "Wicket", "Grand Moff"]),
    c("amvs43", "Logan, Kendall, Shiv, and Roman are the Roy children in which HBO drama?", ["Succession", "Billions", "Yellowstone", "Ozark", "House of Cards", "Empire", "Dynasty", "Dallas"]),
    c("amvs44", "Ted Lasso coaches which fictional English soccer club?", ["AFC Richmond", "Manchester United", "Chelsea", "West Ham", "Everton", "Leeds United", "Crystal Palace", "Fulham"]),
  ]),
  cat("OSCAR NIGHT", [
    c("amvs50", "The golden Academy Award statuette is nicknamed what?", ["Oscar", "Emmy", "Tony", "Grammy", "Clio", "Edgar", "Razzie", "Golden Globe"]),
    c("amvs51", "Which film became the first non-English-language Best Picture winner in 2020?", ["Parasite", "Roma", "1917", "Joker", "Nomadland", "Drive My Car", "Life Is Beautiful", "Amelie"]),
    c("amvs52", "Which film was mistakenly announced as Best Picture in 2017 before Moonlight was corrected?", ["La La Land", "Arrival", "Fences", "Hidden Figures", "Lion", "Manchester by the Sea", "Hell or High Water", "Hacksaw Ridge"]),
    c("amvs53", "Who holds the record for the most Oscars won for acting, with four?", ["Katharine Hepburn", "Meryl Streep", "Jack Nicholson", "Daniel Day-Lewis", "Ingrid Bergman", "Frances McDormand", "Marlon Brando", "Bette Davis"]),
    c("amvs54", "Which fantasy epic won all 11 of its Oscar nominations in 2004?", ["The Return of the King", "The Fellowship of the Ring", "The Two Towers", "Harry Potter", "Avatar", "Gladiator", "Titanic", "The Hobbit"]),
  ]),
];

const DOUBLE = [
  cat("ANIMATED FEATURES", [
    c("amvd00", "Peter Griffin lives in which fictional Rhode Island town?", ["Quahog", "Springfield", "South Park", "Arlen", "Langley Falls", "Bedrock", "Pawtucket", "Bikini Bottom"]),
    c("amvd01", "Which Pixar film follows an old man who ties thousands of balloons to his house?", ["Up", "Coco", "Soul", "Brave", "Cars", "Onward", "Luca", "Inside Out"]),
    c("amvd02", "Which Pixar film stars the emotions Joy and Sadness inside a girl's head?", ["Inside Out", "Soul", "Turning Red", "Coco", "Luca", "Elemental", "Up", "Onward"]),
    c("amvd03", "Who voices Woody in the original Toy Story?", ["Tom Hanks", "Tim Allen", "Billy Crystal", "Robin Williams", "John Goodman", "Steve Carell", "Mike Myers", "Eddie Murphy"]),
    c("amvd04", "Which film about Miles Morales won the 2018 Best Animated Feature Oscar?", ["Spider-Man: Into the Spider-Verse", "Incredibles 2", "Isle of Dogs", "Mirai", "Ralph Breaks the Internet", "Coco", "Ferdinand", "Smallfoot"]),
  ]),
  cat("SCI-FI", [
    c("amvd10", "In The Empire Strikes Back, who reveals he is Luke Skywalker's father?", ["Darth Vader", "Obi-Wan Kenobi", "Han Solo", "Emperor Palpatine", "Yoda", "Lando Calrissian", "Qui-Gon Jinn", "Jabba the Hutt"]),
    c("amvd11", "Which 1982 Ridley Scott film features hunted replicants?", ["Blade Runner", "Alien", "Total Recall", "Tron", "The Thing", "Dune", "Brazil", "Gattaca"]),
    c("amvd12", "In The Matrix, which pill color does Neo swallow to learn the truth?", ["Red", "Blue", "Green", "Yellow", "Black", "White", "Purple", "Orange"]),
    c("amvd13", "Which 2010 Nolan film takes place in layers of dreams within dreams?", ["Inception", "Interstellar", "Tenet", "Memento", "Shutter Island", "The Prestige", "Source Code", "Looper"]),
    c("amvd14", "How many gigawatts does the DeLorean need in Back to the Future?", ["1.21", "1.5", "2.4", "0.88", "3.14", "1.88", "12.1", "10"]),
  ]),
  cat("PRESTIGE TV", [
    c("amvd20", "In Breaking Bad, Walter White begins as a high school teacher of which subject?", ["Chemistry", "Physics", "Math", "Biology", "History", "English", "Art", "Gym"]),
    c("amvd21", "In Game of Thrones, which house's sigil is a direwolf?", ["Stark", "Lannister", "Targaryen", "Baratheon", "Greyjoy", "Tyrell", "Martell", "Arryn"]),
    c("amvd22", "The Sopranos is set primarily in which state?", ["New Jersey", "New York", "Connecticut", "Pennsylvania", "Delaware", "Massachusetts", "Rhode Island", "Maryland"]),
    c("amvd23", "Don Draper works for which fictional ad agency in Mad Men?", ["Sterling Cooper", "Pearson Hardman", "Wolfram & Hart", "Bluth Company", "Initech", "Vandelay Industries", "Dunder Mifflin", "Hooli"]),
    c("amvd24", "The Wire is set in which American city?", ["Baltimore", "Chicago", "Philadelphia", "Detroit", "Boston", "Newark", "Washington, D.C.", "St. Louis"]),
  ]),
  cat("ACTION HEROES", [
    c("amvd30", "Who plays the retired hitman in the John Wick films?", ["Keanu Reeves", "Liam Neeson", "Jason Statham", "Bruce Willis", "Tom Cruise", "Vin Diesel", "Dwayne Johnson", "Nicolas Cage"]),
    c("amvd31", "Which actor plays NYPD cop John McClane in Die Hard?", ["Bruce Willis", "Sylvester Stallone", "Arnold Schwarzenegger", "Mel Gibson", "Harrison Ford", "Kurt Russell", "Jean-Claude Van Damme", "Wesley Snipes"]),
    c("amvd32", "Who plays Imperator Furiosa in Mad Max: Fury Road?", ["Charlize Theron", "Tom Hardy", "Anya Taylor-Joy", "Zoe Kravitz", "Rosie Huntington-Whiteley", "Nicholas Hoult", "Hugh Keays-Byrne", "Riley Keough"]),
    c("amvd33", "Ethan Hunt is the daredevil spy in which Tom Cruise franchise?", ["Mission: Impossible", "Jack Reacher", "Top Gun", "Edge of Tomorrow", "Knight and Day", "Oblivion", "Collateral", "Minority Report"]),
    c("amvd34", "Which 1996 film has Sean Connery and Nicolas Cage on Alcatraz?", ["The Rock", "Con Air", "Face/Off", "Broken Arrow", "Speed", "Eraser", "Cliffhanger", "The Fugitive"]),
  ]),
  cat("COMEDIES", [
    c("amvd40", "Which 2004 Will Ferrell comedy follows a 1970s San Diego newsman named Ron Burgundy?", ["Anchorman", "Elf", "Talladega Nights", "Step Brothers", "Blades of Glory", "Old School", "Zoolander", "Semi-Pro"]),
    c("amvd41", "Which 2009 comedy has friends losing the groom after a Las Vegas bachelor party?", ["The Hangover", "Wedding Crashers", "Superbad", "Old School", "Dude, Where's My Car?", "Bridesmaids", "Horrible Bosses", "Role Models"]),
    c("amvd42", "Napoleon Dynamite is set in a small town in which state?", ["Idaho", "Utah", "Montana", "Nevada", "Wyoming", "Oregon", "Nebraska", "Colorado"]),
    c("amvd43", "In Mean Girls, on which day of the week do the Plastics wear pink?", ["Wednesday", "Monday", "Tuesday", "Thursday", "Friday", "Saturday", "Sunday", "Every day"]),
    c("amvd44", "Which comedian plays the Kazakh reporter Borat?", ["Sacha Baron Cohen", "Will Ferrell", "Jim Carrey", "Steve Carell", "Rowan Atkinson", "Simon Pegg", "Ricky Gervais", "Russell Brand"]),
  ]),
  cat("TV FINALES", [
    c("amvd50", "Which sitcom's 1983 finale 'Goodbye, Farewell and Amen' drew one of the biggest TV audiences ever?", ["M*A*S*H", "Cheers", "Dallas", "Happy Days", "Taxi", "Three's Company", "Barney Miller", "All in the Family"]),
    c("amvd51", "Where do the four main characters end up in the Seinfeld finale?", ["Jail", "Paris", "A hospital", "Monk's Cafe", "Kramer's apartment", "A courtroom roof", "Mexico", "An airplane"]),
    c("amvd52", "In Dallas, who was revealed to have shot J.R. Ewing?", ["Kristin Shepard", "Sue Ellen", "Bobby Ewing", "Pam Ewing", "Cliff Barnes", "Lucy Ewing", "Miss Ellie", "Clayton Farlow"]),
    c("amvd53", "What was the flight number of the doomed plane in Lost?", ["Oceanic 815", "Oceanic 237", "Oceanic 108", "Oceanic 4815", "Pan Am 103", "United 175", "Delta 8", "Flight 19"]),
    c("amvd54", "What is the title of the Breaking Bad series finale?", ["Felina", "Ozymandias", "Face Off", "Say My Name", "Crawl Space", "Granite State", "Gliding Over All", "Fly"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "TV FINALES",
  prompt: "Which sitcom's 2004 finale was titled 'The Last One'?",
  choices: ["Friends", "Frasier", "Will & Grace", "Everybody Loves Raymond", "Seinfeld", "Sex and the City", "ER", "The Sopranos"],
  correctIndex: 0,
};

export const ADULT_MOVIES_PACK: TriviaPack = {
  id: "adult-movies",
  audience: "adult",
  title: "Movies & TV",
  tagline: "Blockbusters, binge-worthy shows, and quotable lines",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
