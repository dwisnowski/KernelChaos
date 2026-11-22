import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("POLITICAL SCANDALS", [
    c("sca-s0-0", "The Watergate scandal led to the resignation of which US president?", ["Richard Nixon", "Lyndon B. Johnson", "Gerald Ford", "Jimmy Carter", "Ronald Reagan", "John F. Kennedy", "Dwight Eisenhower", "George H.W. Bush"]),
    c("sca-s0-1", "In what year was Bill Clinton impeached by the House of Representatives?", ["1998", "1992", "1994", "1996", "1999", "2000", "1995", "1997"]),
    c("sca-s0-2", "The Iran-Contra affair took place during which president's administration?", ["Ronald Reagan", "Jimmy Carter", "George H.W. Bush", "Bill Clinton", "Richard Nixon", "Gerald Ford", "Lyndon B. Johnson", "Barack Obama"]),
    c("sca-s0-3", "The Teapot Dome scandal of the 1920s damaged which president's administration?", ["Warren G. Harding", "Calvin Coolidge", "Herbert Hoover", "Woodrow Wilson", "Franklin D. Roosevelt", "Theodore Roosevelt", "William Taft", "Harry Truman"]),
    c("sca-s0-4", "Which analyst leaked the 'Pentagon Papers' in 1971?", ["Daniel Ellsberg", "Edward Snowden", "Mark Felt", "Julian Assange", "Bob Woodward", "Carl Bernstein", "Chelsea Manning", "John Dean"]),
  ]),
  cat("SPORTS SCANDALS", [
    c("sca-s1-0", "Which cyclist was stripped of seven Tour de France titles for doping?", ["Lance Armstrong", "Greg LeMond", "Alberto Contador", "Chris Froome", "Miguel Induráin", "Jan Ullrich", "Floyd Landis", "Marco Pantani"]),
    c("sca-s1-1", "Which figure skater was attacked in 1994 before the Olympic Trials?", ["Nancy Kerrigan", "Tara Lipinski", "Michelle Kwan", "Kristi Yamaguchi", "Oksana Baiul", "Dorothy Hamill", "Peggy Fleming", "Sasha Cohen"]),
    c("sca-s1-2", "Which team's players were accused of throwing the 1919 World Series?", ["Chicago White Sox", "Boston Red Sox", "New York Giants", "Cincinnati Reds", "Brooklyn Dodgers", "St. Louis Cardinals", "Detroit Tigers", "Philadelphia Athletics"]),
    c("sca-s1-3", "Which baseball legend was banned for life in 1989 for betting on games?", ["Pete Rose", "Barry Bonds", "Mark McGwire", "Shoeless Joe Jackson", "Roger Clemens", "Ty Cobb", "Sammy Sosa", "Alex Rodriguez"]),
    c("sca-s1-4", "The 2017 Houston Astros sign-stealing scandal famously involved banging on what?", ["A trash can", "A dugout bench", "A bat rack", "A water cooler", "A locker", "A helmet", "A drum", "A cowbell"]),
  ]),
  cat("CORPORATE COLLAPSES", [
    c("sca-s2-0", "Which Houston energy company collapsed in a massive accounting scandal in 2001?", ["Enron", "WorldCom", "Lehman Brothers", "Tyco", "Arthur Andersen", "Halliburton", "Exxon", "Global Crossing"]),
    c("sca-s2-1", "Bernie Madoff ran the largest example of which type of fraud?", ["A Ponzi scheme", "A pyramid game", "A check kite", "A pump-and-dump", "Insider trading", "A phishing scam", "A shell game", "A bait-and-switch"]),
    c("sca-s2-2", "Elizabeth Holmes founded which blood-testing company that turned out to be a fraud?", ["Theranos", "Juul", "WeWork", "Uber", "Nikola", "Fyre Media", "Quibi", "Outcome Health"]),
    c("sca-s2-3", "Volkswagen's 2015 'Dieselgate' scandal involved cheating on which tests?", ["Emissions tests", "Crash tests", "Fuel tank tests", "Brake tests", "Airbag tests", "Noise tests", "Speed tests", "Battery tests"]),
    c("sca-s2-4", "Sam Bankman-Fried founded which collapsed cryptocurrency exchange?", ["FTX", "Coinbase", "Binance", "Celsius", "Kraken", "Gemini", "Mt. Gox", "Terraform Labs"]),
  ]),
  cat("HOLLYWOOD SCANDALS", [
    c("sca-s3-0", "Which Full House actress was caught up in the 2019 college admissions scandal?", ["Lori Loughlin", "Candace Cameron Bure", "Jodie Sweetin", "Felicity Huffman", "Kristin Davis", "Marcia Cross", "Teri Hatcher", "Jennie Garth"]),
    c("sca-s3-1", "The #MeToo movement went viral in 2017 after allegations against which producer?", ["Harvey Weinstein", "Jerry Bruckheimer", "Scott Rudin", "Brett Ratner", "Joel Silver", "Michael Bay", "Steven Spielberg", "Judd Apatow"]),
    c("sca-s3-2", "The Hays Code for Hollywood self-censorship began strict enforcement in what year?", ["1934", "1920", "1927", "1941", "1950", "1968", "1910", "1960"]),
    c("sca-s3-3", "Which Oscar-winning actor was replaced by Christopher Plummer in 'All the Money in the World' in 2017?", ["Kevin Spacey", "Russell Crowe", "Jeff Bridges", "Gary Oldman", "Jeremy Irons", "Michael Douglas", "Mark Wahlberg", "Matt Damon"]),
    c("sca-s3-4", "Silent-film star Roscoe 'Fatty' Arbuckle's 1921 scandal trials took place in which city?", ["San Francisco", "Los Angeles", "Chicago", "New York City", "Hollywood", "Seattle", "Las Vegas", "San Diego"]),
  ]),
  cat("HOAXES & FRAUDS", [
    c("sca-s4-0", "Orson Welles's 1938 radio broadcast of 'War of the Worlds' described an invasion from where?", ["Mars", "Venus", "The Moon", "Jupiter", "Saturn", "Another galaxy", "The sea floor", "The North Pole"]),
    c("sca-s4-1", "The 'Piltdown Man' hoax was a fake what?", ["Human ancestor fossil", "Dinosaur egg", "Meteorite", "Viking sword", "Egyptian mummy", "Cave painting", "Roman coin", "Giant footprint"]),
    c("sca-s4-2", "The 1934 'Surgeon's Photograph' was a hoax about which monster?", ["Loch Ness Monster", "Bigfoot", "Yeti", "Chupacabra", "Mothman", "Jersey Devil", "Kraken", "Champ"]),
    c("sca-s4-3", "In 1983, which German magazine published fake 'Hitler Diaries'?", ["Stern", "Der Spiegel", "Bild", "Die Zeit", "Focus", "Vogue Germany", "Brigitte", "Playboy Germany"]),
    c("sca-s4-4", "In 2003, which newspaper's reporter Jayson Blair was exposed for fabricating stories?", ["The New York Times", "The Washington Post", "USA Today", "The Wall Street Journal", "Los Angeles Times", "The Boston Globe", "Chicago Tribune", "New York Post"]),
  ]),
  cat("FALL FROM GRACE", [
    c("sca-s5-0", "O.J. Simpson's 1994 slow-speed chase involved which type of vehicle?", ["White Ford Bronco", "Black limousine", "Red Corvette", "Blue Cadillac", "White Mercedes", "Silver Jeep", "Black Range Rover", "Yellow taxi"]),
    c("sca-s5-1", "Which hotel heiress served jail time in 2007 after violating probation?", ["Paris Hilton", "Lindsay Lohan", "Nicole Richie", "Britney Spears", "Tara Reid", "Kim Kardashian", "Courtney Love", "Amy Winehouse"]),
    c("sca-s5-2", "Tiger Woods's 2009 scandal started with a car crash into what?", ["A fire hydrant", "A tree", "A fence", "A mailbox", "A garage", "A golf cart", "A lamp post", "A gate"]),
    c("sca-s5-3", "Which 'Desperate Housewives' star served time in 2019 over the college admissions scandal?", ["Felicity Huffman", "Marcia Cross", "Teri Hatcher", "Eva Longoria", "Nicollette Sheridan", "Lori Loughlin", "Vanessa Williams", "Dana Delany"]),
    c("sca-s5-4", "Bernie Madoff was sentenced in 2009 to how many years in prison?", ["150", "25", "50", "75", "100", "200", "20", "99"]),
  ]),
];

const DOUBLE = [
  cat("WHAT YEAR WAS IT?", [
    c("sca-d0-0", "In what year did the Watergate break-in occur?", ["1972", "1968", "1969", "1970", "1971", "1973", "1974", "1975"]),
    c("sca-d0-1", "In what year did Enron file for bankruptcy?", ["2001", "1998", "1999", "2000", "2002", "2003", "2004", "2005"]),
    c("sca-d0-2", "In what year did Janet Jackson's Super Bowl 'wardrobe malfunction' occur?", ["2004", "2001", "2002", "2003", "2005", "2006", "2007", "2008"]),
    c("sca-d0-3", "In what year was the 'Panama Papers' leak published?", ["2016", "2012", "2013", "2014", "2015", "2017", "2018", "2019"]),
    c("sca-d0-4", "In what year did the Cambridge Analytica Facebook scandal break?", ["2018", "2014", "2015", "2016", "2017", "2019", "2020", "2021"]),
  ]),
  cat("NINETIES SCANDAL FILES", [
    c("sca-d1-0", "In 1997, Mike Tyson bit which boxer's ear?", ["Evander Holyfield", "Lennox Lewis", "George Foreman", "Riddick Bowe", "Larry Holmes", "Muhammad Ali", "Michael Moorer", "Oscar De La Hoya"]),
    c("sca-d1-1", "Which White House intern was at the center of the late-1990s Clinton scandal?", ["Monica Lewinsky", "Linda Tripp", "Paula Jones", "Gennifer Flowers", "Kathleen Willey", "Juanita Broaddrick", "Hillary Clinton", "Anita Hill"]),
    c("sca-d1-2", "The 1992 Los Angeles riots followed the acquittal of officers in the beating of which man?", ["Rodney King", "Tyrone Brown", "Amadou Diallo", "Abner Louima", "Eric Garner", "Latasha Harlins", "Trayvon Martin", "Walter Scott"]),
    c("sca-d1-3", "Which duo had their 1990 Best New Artist Grammy revoked after a lip-sync scandal?", ["Milli Vanilli", "Wilson Phillips", "Roxette", "Kris Kross", "Right Said Fred", "Color Me Badd", "Boyz II Men", "Technotronic"]),
    c("sca-d1-4", "Princess Diana's famous 1995 BBC interview aired on which program?", ["Panorama", "Newsnight", "60 Minutes", "Dateline", "20/20", "Question Time", "Top of the Pops", "Horizon"]),
  ]),
  cat("LEAKS & WHISTLEBLOWERS", [
    c("sca-d2-0", "Which website founded by Julian Assange published US diplomatic cables in 2010?", ["WikiLeaks", "Snopes", "Gawker", "Pastebin", "Drudge Report", "ProPublica", "Reddit", "BuzzFeed"]),
    c("sca-d2-1", "Edward Snowden was granted asylum in which country after leaking NSA documents in 2013?", ["Russia", "China", "Cuba", "Venezuela", "Ecuador", "Iceland", "Brazil", "North Korea"]),
    c("sca-d2-2", "Watergate's famous source 'Deep Throat' was revealed in 2005 to be which FBI official?", ["Mark Felt", "Alexander Butterfield", "John Dean", "James McCord", "Howard Hunt", "Gordon Liddy", "L. Patrick Gray", "Jeb Magruder"]),
    c("sca-d2-3", "Which Army private leaked documents to WikiLeaks in 2010?", ["Chelsea Manning", "Reality Winner", "Edward Snowden", "Daniel Ellsberg", "Thomas Drake", "John Kiriakou", "Jeremy Hammond", "Aaron Swartz"]),
    c("sca-d2-4", "The 2016 'Panama Papers' came from which law firm?", ["Mossack Fonseca", "Baker McKenzie", "Clifford Chance", "Skadden", "Latham & Watkins", "Kirkland & Ellis", "Linklaters", "Sidley Austin"]),
  ]),
  cat("MUSIC MAYHEM", [
    c("sca-d3-0", "In the 1950s, which TV host famously showed Elvis only from the waist up?", ["Ed Sullivan", "Milton Berle", "Steve Allen", "Dick Clark", "Johnny Carson", "Perry Como", "Jack Paar", "Arthur Godfrey"]),
    c("sca-d3-1", "Ashlee Simpson's 2004 SNL moment went wrong when the wrong what played?", ["Backing track", "Microphone", "Song lyrics", "Guitar", "Drum solo", "Video intro", "Stage lights", "Audience applause"]),
    c("sca-d3-2", "Which soda company dropped Madonna's ad deal after the 'Like a Prayer' video in 1989?", ["Pepsi", "Coca-Cola", "Dr Pepper", "Sprite", "Mountain Dew", "Fanta", "7 Up", "RC Cola"]),
    c("sca-d3-3", "On SNL in 1992, Sinéad O'Connor tore up a photo of whom?", ["Pope John Paul II", "Ronald Reagan", "Queen Elizabeth II", "Prince Charles", "George H.W. Bush", "Bill Clinton", "Mother Teresa", "Margaret Thatcher"]),
    c("sca-d3-4", "John Lennon's 1966 'bigger than Jesus' comment led to Beatles record burnings mainly in which US region?", ["The South", "The Northeast", "The Midwest", "The West Coast", "New England", "The Southwest", "The Pacific Northwest", "The Mountain West"]),
  ]),
  cat("QUOTES THAT HAUNTED", [
    c("sca-d4-0", "Which president insisted 'I did not have sexual relations with that woman'?", ["Bill Clinton", "Jimmy Carter", "George H.W. Bush", "Ronald Reagan", "Barack Obama", "George W. Bush", "John F. Kennedy", "Lyndon B. Johnson"]),
    c("sca-d4-1", "'Let them eat cake' is falsely attributed to which queen?", ["Marie Antoinette", "Catherine the Great", "Elizabeth I", "Queen Victoria", "Cleopatra", "Empress Josephine", "Anne Boleyn", "Isabella of Spain"]),
    c("sca-d4-2", "Howard Dean's infamous 2004 'scream' came after losing which state's caucuses?", ["Iowa", "New Hampshire", "South Carolina", "Nevada", "Ohio", "Michigan", "Florida", "Vermont"]),
    c("sca-d4-3", "Which Delaware Senate candidate said 'I am not a witch' in a 2010 campaign ad?", ["Christine O'Donnell", "Sarah Palin", "Michele Bachmann", "Sharron Angle", "Carly Fiorina", "Linda McMahon", "Meg Whitman", "Kelly Ayotte"]),
    c("sca-d4-4", "Nixon declared 'I am not a crook' at a 1973 press event held at which Florida attraction?", ["Walt Disney World", "SeaWorld", "Cape Canaveral", "Busch Gardens", "Universal Studios", "Epcot", "Mar-a-Lago", "Kennedy Space Center"]),
  ]),
  cat("GATE GAMES", [
    c("sca-d5-0", "The '-gate' suffix for scandals comes from the break-in at which building complex?", ["Watergate", "Whitehall", "Windsor Gate", "Westgate", "Capitol Hill", "Camp David", "Blair House", "Mayflower Hotel"]),
    c("sca-d5-1", "'Bridgegate' involved lane closures on which bridge?", ["George Washington Bridge", "Brooklyn Bridge", "Golden Gate Bridge", "Verrazzano Bridge", "Tappan Zee Bridge", "Bay Bridge", "Triborough Bridge", "Lincoln Tunnel"]),
    c("sca-d5-2", "'Deflategate' was about the deflation of what?", ["Footballs", "Basketballs", "Tires", "Soccer balls", "Volleyballs", "Blimps", "Parade balloons", "Air mattresses"]),
    c("sca-d5-3", "In 2007's 'Spygate,' the New England Patriots were caught filming signals from which team?", ["New York Jets", "Miami Dolphins", "Buffalo Bills", "Indianapolis Colts", "Pittsburgh Steelers", "Baltimore Ravens", "New York Giants", "Oakland Raiders"]),
    c("sca-d5-4", "'Gamergate' in 2014 centered on controversy in which industry?", ["Video games", "Movies", "Music", "Fashion", "Publishing", "Sports", "Television", "Tech startups"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "SCANDAL TIMELINE",
  prompt: "The 1963 Profumo affair led to the resignation of which British Secretary of State for War?",
  choices: ["John Profumo", "Harold Macmillan", "Alec Douglas-Home", "Anthony Eden", "Hugh Gaitskell", "Edward Heath", "Harold Wilson", "Reginald Maudling"],
  correctIndex: 0,
};

export const SPICY_SCANDAL_PACK: TriviaPack = {
  id: "spicy-scandal",
  audience: "spicy",
  title: "Scandal Timeline",
  tagline: "From Watergate to wardrobe malfunctions, the cover-ups that rocked the world",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
