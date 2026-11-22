import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("GOSSIP OUTLETS", [
    c("tab-s0-0", "Which magazine names a 'Sexiest Man Alive' every year?", ["People", "Vogue", "Time", "Rolling Stone", "GQ", "Esquire", "Us Weekly", "Vanity Fair"]),
    c("tab-s0-1", "The National Enquirer is famously sold where?", ["Supermarket checkout lines", "Airport lounges", "Vending machines", "Gas pumps only", "Subway cars", "Bookstores only", "Hotel lobbies", "Farmers markets"]),
    c("tab-s0-2", "'Page Six' is a gossip column in which newspaper?", ["New York Post", "The New York Times", "Daily News", "Washington Post", "Los Angeles Times", "Chicago Tribune", "USA Today", "Wall Street Journal"]),
    c("tab-s0-3", "The gossip site TMZ gets its name from the entertainment industry's:", ["Thirty Mile Zone", "Top Media Zone", "Tabloid Movie Zine", "Ten Minute Zoom", "Total Media Zeal", "Trending Media Zone", "Talent Management Zone", "Thirty Minute Zone"]),
    c("tab-s0-4", "Which gossip blogger became famous for scribbling on celebrity photos?", ["Perez Hilton", "Nick Denton", "Michael Musto", "Trisha Paytas", "Harvey Levin", "Lainey Gossip", "Ted Casablanca", "Perez Lopez"]),
  ]),
  cat("CELEB MELTDOWNS", [
    c("tab-s1-0", "Which actor famously jumped on Oprah's couch in 2005?", ["Tom Cruise", "Brad Pitt", "John Travolta", "Will Smith", "Matt Damon", "Jim Carrey", "Vince Vaughn", "Owen Wilson"]),
    c("tab-s1-1", "Which pop star shaved her head in 2007?", ["Britney Spears", "Christina Aguilera", "Lindsay Lohan", "Mariah Carey", "Jessica Simpson", "Paris Hilton", "Avril Lavigne", "Kesha"]),
    c("tab-s1-2", "Which actor's 2011 meltdown made 'Winning' a catchphrase?", ["Charlie Sheen", "Mel Gibson", "Robert Downey Jr.", "Shia LaBeouf", "Nick Nolte", "Gary Busey", "Christian Bale", "Jon Cryer"]),
    c("tab-s1-3", "Which rapper announced a 2020 run for US president?", ["Kanye West", "Jay-Z", "Drake", "Snoop Dogg", "Kendrick Lamar", "Lil Wayne", "Eminem", "Nicki Minaj"]),
    c("tab-s1-4", "Christian Bale's infamous on-set rant was recorded during which film?", ["Terminator Salvation", "The Dark Knight", "American Psycho", "The Machinist", "The Fighter", "American Hustle", "Exodus", "Equilibrium"]),
  ]),
  cat("ROYAL SCANDALS", [
    c("tab-s2-0", "Which Netflix drama chronicles the British royal family across decades?", ["The Crown", "Bridgerton", "Victoria", "Downton Abbey", "Outlander", "Spencer", "The Queen", "Windsor"]),
    c("tab-s2-1", "'Megxit' was the nickname for which couple's 2020 step back from royal duties?", ["Harry and Meghan", "William and Kate", "Charles and Camilla", "Andrew and Sarah", "Edward and Sophie", "Peter and Autumn", "Zara and Mike", "Eugenie and Jack"]),
    c("tab-s2-2", "Princess Diana died in a car crash in which city?", ["Paris", "London", "Rome", "Monaco", "Vienna", "Madrid", "Brussels", "Geneva"]),
    c("tab-s2-3", "In what year did Harry and Meghan sit down for their Oprah interview?", ["2021", "2018", "2019", "2020", "2022", "2023", "2017", "2016"]),
    c("tab-s2-4", "Edward VIII abdicated the British throne in 1936 to marry which American?", ["Wallis Simpson", "Grace Kelly", "Evelyn Nesbit", "Rita Hayworth", "Doris Duke", "Gloria Vanderbilt", "Barbara Hutton", "Clare Boothe Luce"]),
  ]),
  cat("HOLLYWOOD FEUDS", [
    c("tab-s3-0", "Taylor Swift's song 'Bad Blood' is widely believed to be about which pop star?", ["Katy Perry", "Kanye West", "Selena Gomez", "Lady Gaga", "Miley Cyrus", "Demi Lovato", "Jessie J", "Nicki Minaj"]),
    c("tab-s3-1", "Which two actresses famously feuded while making 'What Ever Happened to Baby Jane?'", ["Bette Davis and Joan Crawford", "Katharine Hepburn and Lauren Bacall", "Marilyn Monroe and Jayne Mansfield", "Elizabeth Taylor and Debbie Reynolds", "Judy Garland and Lana Turner", "Ginger Rogers and Rita Hayworth", "Audrey Hepburn and Grace Kelly", "Greta Garbo and Marlene Dietrich"]),
    c("tab-s3-2", "Which rapper's 2024 diss track 'Not Like Us' targeted Drake?", ["Kendrick Lamar", "Kanye West", "J. Cole", "Travis Scott", "Future", "Metro Boomin", "Rick Ross", "A$AP Rocky"]),
    c("tab-s3-3", "Solange Knowles's 2014 elevator incident involved which rapper?", ["Jay-Z", "Kanye West", "Drake", "Nas", "Pharrell", "Diddy", "Lil Wayne", "Common"]),
    c("tab-s3-4", "Which British band's feuding brothers Liam and Noel Gallagher announced a reunion tour for 2025?", ["Oasis", "Blur", "Pulp", "The Verve", "Coldplay", "Radiohead", "Arctic Monkeys", "The Stone Roses"]),
  ]),
  cat("CELEB RUN-INS", [
    c("tab-s4-0", "Which lifestyle mogul served prison time in 2004–2005 after an ImClone stock case?", ["Martha Stewart", "Oprah Winfrey", "Ina Garten", "Rachael Ray", "Paula Deen", "Gwyneth Paltrow", "Julia Child", "Giada De Laurentiis"]),
    c("tab-s4-1", "Which actor, arrested in 1996, later starred as Iron Man?", ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo", "Jeremy Renner", "Don Cheadle", "Chris Hemsworth", "Paul Bettany", "Jon Favreau"]),
    c("tab-s4-2", "Which British actor was arrested in 1995 in Los Angeles with Divine Brown?", ["Hugh Grant", "Colin Firth", "Jude Law", "Ewan McGregor", "Daniel Craig", "Rupert Everett", "Ralph Fiennes", "Liam Neeson"]),
    c("tab-s4-3", "Which actress was arrested for shoplifting at Saks Fifth Avenue in 2001?", ["Winona Ryder", "Lindsay Lohan", "Courtney Love", "Drew Barrymore", "Alicia Silverstone", "Uma Thurman", "Claire Danes", "Kate Moss"]),
    c("tab-s4-4", "Which Real Housewives of New Jersey star went to prison in 2015 for fraud?", ["Teresa Giudice", "Kim Zolciak", "NeNe Leakes", "Jill Zarin", "Dina Manzo", "Danielle Staub", "Ramona Singer", "Kyle Richards"]),
  ]),
  cat("SOCIAL MEDIA DRAMA", [
    c("tab-s5-0", "Which network aired 'Keeping Up with the Kardashians'?", ["E!", "Bravo", "MTV", "VH1", "TLC", "Lifetime", "Oxygen", "FX"]),
    c("tab-s5-1", "The disastrous 2017 Fyre Festival was supposed to take place in which island nation?", ["The Bahamas", "Jamaica", "Fiji", "Barbados", "The Maldives", "Bermuda", "Aruba", "Puerto Rico"]),
    c("tab-s5-2", "Who founded the Fyre Festival?", ["Billy McFarland", "Ja Rule", "Kendall Jenner", "Elon Musk", "Logan Paul", "Adam Neumann", "Anthony Scaramucci", "Mark Zuckerberg"]),
    c("tab-s5-3", "James Charles's 2019 feud with Tati Westbrook involved which vitamin brand?", ["Sugar Bear Hair", "Olly", "Goli", "Nature Made", "Vitafusion", "Hum Nutrition", "Ritual", "Emergen-C"]),
    c("tab-s5-4", "The con artist known as 'Anna Delvey' was born with which surname?", ["Sorokin", "Delvey", "Petrov", "Ivanov", "Kuznetsova", "Romanov", "Smirnova", "Volkov"]),
  ]),
];

const DOUBLE = [
  cat("KARDASHIAN KRONICLES", [
    c("tab-d0-0", "Kris Jenner is famously known as the family's:", ["Momager", "Manager Mom", "Matriarch Queen", "Mama Mogul", "Boss Mom", "Momtrepreneur", "Mom Executive", "Queen Mum"]),
    c("tab-d0-1", "In what year did 'Keeping Up with the Kardashians' premiere?", ["2007", "2004", "2005", "2009", "2010", "2012", "2003", "2008"]),
    c("tab-d0-2", "Kim Kardashian's shapewear brand is called:", ["SKIMS", "Spanx", "Yitty", "Savage X Fenty", "Honeylove", "Kyte", "Lively", "Hanes"]),
    c("tab-d0-3", "Kim Kardashian and Kanye West held their 2014 wedding in which Italian city?", ["Florence", "Rome", "Venice", "Milan", "Naples", "Como", "Verona", "Capri"]),
    c("tab-d0-4", "Kardashian patriarch Robert Kardashian was part of which famous legal defense team?", ["O.J. Simpson's", "Michael Jackson's", "Menendez brothers'", "Casey Anthony's", "Martha Stewart's", "Bill Clinton's", "Jeffrey Dahmer's", "Rodney King's"]),
  ]),
  cat("RED CARPET RIOTS", [
    c("tab-d1-0", "The Met Gala is held at the Metropolitan Museum of Art in which city?", ["New York City", "Los Angeles", "Paris", "London", "Chicago", "Miami", "Milan", "Washington, D.C."]),
    c("tab-d1-1", "Which Vogue editor-in-chief is the longtime face of the Met Gala?", ["Anna Wintour", "Diane von Furstenberg", "Grace Coddington", "Tina Brown", "Carine Roitfeld", "Donatella Versace", "Edna Woolman Chase", "Giovanna Battaglia"]),
    c("tab-d1-2", "At the 2010 VMAs, Lady Gaga wore a dress made of what?", ["Raw meat", "Plastic bottles", "Feathers", "Duct tape", "Candy", "Newspapers", "Seashells", "Aluminum foil"]),
    c("tab-d1-3", "Jennifer Lopez's 2000 Grammys dress is credited with inspiring the creation of:", ["Google Image Search", "Instagram", "YouTube", "Twitter", "Facebook", "Snapchat", "Pinterest", "TikTok"]),
    c("tab-d1-4", "Which Icelandic singer wore a swan dress to the 2001 Oscars?", ["Björk", "Sigur Rós", "Emiliana Torrini", "Enya", "Sinéad O'Connor", "Dolores O'Riordan", "Annie Lennox", "Kate Bush"]),
  ]),
  cat("VIRAL MOMENTS", [
    c("tab-d2-0", "In 2015, the internet fought over a dress that was blue and black or white and what?", ["Gold", "Silver", "Red", "Green", "Pink", "Purple", "Yellow", "Orange"]),
    c("tab-d2-1", "Rebecca Black's 2011 viral song was titled:", ["Friday", "Saturday", "Monday", "Sunday", "Summer", "Party", "Weekend", "Thursday"]),
    c("tab-d2-2", "Which music video was the first to reach one billion YouTube views?", ["Gangnam Style", "Baby", "Call Me Maybe", "Harlem Shake", "Despacito", "Shake It Off", "Roar", "Blank Space"]),
    c("tab-d2-3", "The 2014 Ice Bucket Challenge raised money for research into which disease?", ["ALS", "Cancer", "Alzheimer's", "Diabetes", "Parkinson's", "Heart disease", "Multiple sclerosis", "Cystic fibrosis"]),
    c("tab-d2-4", "'Salt Bae,' the chef who went viral for sprinkling salt, is from which country?", ["Turkey", "Greece", "Italy", "Lebanon", "Spain", "Egypt", "Iran", "Brazil"]),
  ]),
  cat("CELEB BABY NAMES", [
    c("tab-d3-0", "Beyoncé and Jay-Z's first child is named:", ["Blue Ivy", "Sky Violet", "Rumi", "Willow", "Indigo", "Rose Carter", "Ivy Blue", "Aurora"]),
    c("tab-d3-1", "Gwyneth Paltrow named her daughter after which fruit?", ["Apple", "Peach", "Cherry", "Pear", "Plum", "Lemon", "Fig", "Mango"]),
    c("tab-d3-2", "Kim Kardashian and Kanye West's first child is named:", ["North", "South", "East", "West", "Saint", "Chicago", "Psalm", "Journey"]),
    c("tab-d3-3", "Frank Zappa named his daughter:", ["Moon Unit", "Sun Dial", "Star Child", "Sky Blue", "Planet Pearl", "Comet Rose", "Sunrise", "Galaxy Grace"]),
    c("tab-d3-4", "Elon Musk and Grimes's first child is known by which one-letter nickname?", ["X", "Y", "Z", "A", "Q", "K", "M", "E"]),
  ]),
  cat("CELEB BUSINESS", [
    c("tab-d4-0", "Rihanna's beauty brand is called:", ["Fenty Beauty", "Rare Beauty", "Kylie Cosmetics", "Fenty Glow", "Savage Beauty", "Riri Cosmetics", "Glossier", "Haus Labs"]),
    c("tab-d4-1", "George Clooney co-founded which tequila brand?", ["Casamigos", "Don Julio", "Patrón", "Herradura", "Cazadores", "Avión", "Teremana", "Clase Azul"]),
    c("tab-d4-2", "Jessica Alba founded which consumer products company?", ["The Honest Company", "Goop", "Beautycounter", "Seventh Generation", "Burt's Bees", "Method", "Dr. Bronner's", "Native"]),
    c("tab-d4-3", "Ryan Reynolds co-owns which gin brand?", ["Aviation", "Hendrick's", "Tanqueray", "Bombay Sapphire", "Beefeater", "Gordon's", "Empress 1908", "Sipsmith"]),
    c("tab-d4-4", "Dr. Dre and Jimmy Iovine sold Beats to which company in 2014?", ["Apple", "Google", "Samsung", "Sony", "Microsoft", "Amazon", "Bose", "Spotify"]),
  ]),
  cat("CELEB WEDDINGS", [
    c("tab-d5-0", "Prince Harry and Meghan Markle married in 2018 at a chapel in which castle?", ["Windsor Castle", "Balmoral Castle", "Edinburgh Castle", "Buckingham Palace", "Kensington Palace", "Hampton Court", "Sandringham House", "Warwick Castle"]),
    c("tab-d5-1", "Taylor Swift got engaged in 2025 to which NFL star?", ["Travis Kelce", "Patrick Mahomes", "Tom Brady", "Aaron Rodgers", "Jason Kelce", "Josh Allen", "Joe Burrow", "Matthew Stafford"]),
    c("tab-d5-2", "Which couple married in Las Vegas in July 2022 and again in Georgia that August?", ["Jennifer Lopez and Ben Affleck", "Kim Kardashian and Pete Davidson", "Britney Spears and Sam Asghari", "Kourtney Kardashian and Travis Barker", "Jessica Simpson and Nick Lachey", "Ariana Grande and Dalton Gomez", "Kylie Jenner and Travis Scott", "Selena Gomez and Benny Blanco"]),
    c("tab-d5-3", "Jeff Bezos married Lauren Sánchez in 2025 in which Italian city?", ["Venice", "Florence", "Rome", "Milan", "Naples", "Capri", "Verona", "Como"]),
    c("tab-d5-4", "Prince Charles and Lady Diana married in 1981 at which London cathedral?", ["St Paul's Cathedral", "Westminster Abbey", "Southwark Cathedral", "Canterbury Cathedral", "St George's Chapel", "York Minster", "Westminster Cathedral", "Salisbury Cathedral"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "TABLOID CHAOS",
  prompt: "The 2009 'Balloon Boy' hoax involved a family in which US state?",
  choices: ["Colorado", "Wyoming", "Nebraska", "Utah", "Kansas", "New Mexico", "Montana", "Idaho"],
  correctIndex: 0,
};

export const SPICY_TABLOID_PACK: TriviaPack = {
  id: "spicy-tabloid",
  audience: "spicy",
  title: "Tabloid Chaos",
  tagline: "Gossip, meltdowns, feuds, and front-page flops",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
