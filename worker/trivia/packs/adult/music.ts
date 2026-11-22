import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("80S HITS", [
    c("amus00", "Who sang 'Billie Jean' in 1983?", ["Michael Jackson", "Prince", "Lionel Richie", "Madonna", "George Michael", "Rick Astley", "Bruce Springsteen", "Whitney Houston"]),
    c("amus01", "Which band's 1981 anthem is 'Don't Stop Believin''?", ["Journey", "Foreigner", "Toto", "Boston", "Styx", "REO Speedwagon", "Survivor", "Kansas"]),
    c("amus02", "Who is famously 'never gonna give you up'?", ["Rick Astley", "George Michael", "Simon Le Bon", "Morten Harket", "Boy George", "Phil Collins", "Howard Jones", "Sting"]),
    c("amus03", "Prince starred in which 1984 film and album?", ["Purple Rain", "Sign o' the Times", "1999", "Parade", "Lovesexy", "Controversy", "Dirty Mind", "Diamonds and Pearls"]),
    c("amus04", "Who co-wrote the 1985 charity single 'We Are the World' with Michael Jackson?", ["Lionel Richie", "Quincy Jones", "Stevie Wonder", "Bruce Springsteen", "Diana Ross", "Kenny Rogers", "Billy Joel", "Bob Geldof"]),
  ]),
  cat("90S POP", [
    c("amus10", "'Wannabe' was the 1996 debut single of which group?", ["Spice Girls", "Destiny's Child", "TLC", "All Saints", "En Vogue", "Bananarama", "Atomic Kitten", "Sugababes"]),
    c("amus11", "Who sang '...Baby One More Time' in 1998?", ["Britney Spears", "Christina Aguilera", "Jessica Simpson", "Mandy Moore", "Mariah Carey", "Celine Dion", "Shania Twain", "Jennifer Lopez"]),
    c("amus12", "Which boy band sang 'I Want It That Way'?", ["Backstreet Boys", "NSYNC", "98 Degrees", "Boyz II Men", "New Kids on the Block", "Hanson", "O-Town", "Take That"]),
    c("amus13", "Which 1991 Nirvana album contains 'Smells Like Teen Spirit'?", ["Nevermind", "In Utero", "Bleach", "Unplugged in New York", "Incesticide", "Ten", "Dirt", "Superunknown"]),
    c("amus14", "Which 1995 Alanis Morissette album contains 'Ironic'?", ["Jagged Little Pill", "Tidal", "Under Rug Swept", "Supposed Former Infatuation Junkie", "Flavors of Entanglement", "Havoc and Bright Lights", "Such Pretty Forks in the Road", "Crash"]),
  ]),
  cat("BANDS & DIVAS", [
    c("amus20", "Beyonce first found fame in which group?", ["Destiny's Child", "TLC", "Fifth Harmony", "Danity Kane", "En Vogue", "SWV", "Xscape", "Pussycat Dolls"]),
    c("amus21", "Which former One Direction member sang 'Watermelon Sugar'?", ["Harry Styles", "Zayn Malik", "Niall Horan", "Liam Payne", "Louis Tomlinson", "Ed Sheeran", "Shawn Mendes", "Justin Bieber"]),
    c("amus22", "Whitney Houston's biggest hit from The Bodyguard was which song?", ["I Will Always Love You", "Greatest Love of All", "I Wanna Dance with Somebody", "How Will I Know", "One Moment in Time", "Saving All My Love for You", "Exhale", "My Love Is Your Love"]),
    c("amus23", "Which Canadian singer performed 'My Heart Will Go On'?", ["Celine Dion", "Alanis Morissette", "Shania Twain", "Avril Lavigne", "Nelly Furtado", "Sarah McLachlan", "Anne Murray", "Joni Mitchell"]),
    c("amus24", "Taylor Swift's 'Shake It Off' appears on which album?", ["1989", "Red", "Fearless", "Reputation", "Lover", "Folklore", "Speak Now", "Midnights"]),
  ]),
  cat("HIP-HOP", [
    c("amus30", "Which rapper won an Oscar for 'Lose Yourself'?", ["Eminem", "Dr. Dre", "50 Cent", "Snoop Dogg", "Jay-Z", "Kanye West", "Nas", "Ice Cube"]),
    c("amus31", "Which rapper is married to Beyonce?", ["Jay-Z", "Kanye West", "Drake", "Nas", "Pharrell", "Common", "Diddy", "Nelly"]),
    c("amus32", "Which 2015 Kendrick Lamar album includes 'Alright'?", ["To Pimp a Butterfly", "good kid, m.A.A.d city", "DAMN.", "Mr. Morale & the Big Steppers", "Section.80", "untitled unmastered.", "GNX", "Black Panther: The Album"]),
    c("amus33", "Which group released 'Straight Outta Compton' in 1988?", ["N.W.A", "Public Enemy", "Run-DMC", "A Tribe Called Quest", "Wu-Tang Clan", "Beastie Boys", "De La Soul", "Cypress Hill"]),
    c("amus34", "The Notorious B.I.G. was from which New York borough?", ["Brooklyn", "Queens", "The Bronx", "Manhattan", "Staten Island", "Long Island", "Harlem", "Yonkers"]),
  ]),
  cat("ROCK LEGENDS", [
    c("amus40", "Who was the lead singer of Queen?", ["Freddie Mercury", "Robert Plant", "Mick Jagger", "Roger Daltrey", "Steven Tyler", "Axl Rose", "Bono", "Brian May"]),
    c("amus41", "Mick Jagger fronts which band?", ["The Rolling Stones", "The Who", "Led Zeppelin", "The Kinks", "Aerosmith", "The Doors", "Cream", "The Clash"]),
    c("amus42", "Which Pink Floyd album has a prism on the cover?", ["The Dark Side of the Moon", "Wish You Were Here", "The Wall", "Animals", "Meddle", "Atom Heart Mother", "Ummagumma", "The Division Bell"]),
    c("amus43", "'Bohemian Rhapsody' first appeared on which Queen album?", ["A Night at the Opera", "Sheer Heart Attack", "News of the World", "A Day at the Races", "Jazz", "The Game", "Queen II", "Innuendo"]),
    c("amus44", "Which Beatle wrote 'Here Comes the Sun'?", ["George Harrison", "John Lennon", "Paul McCartney", "Ringo Starr", "Pete Best", "George Martin", "Billy Preston", "Eric Clapton"]),
  ]),
  cat("AWARDS & CHARTS", [
    c("amus50", "Who became the first artist to win Album of the Year four times, in 2024?", ["Taylor Swift", "Beyonce", "Adele", "Billie Eilish", "Stevie Wonder", "Frank Sinatra", "Paul Simon", "Bruno Mars"]),
    c("amus51", "Adele's 2011 blockbuster album is named for her age. What is it called?", ["21", "19", "25", "30", "17", "23", "27", "29"]),
    c("amus52", "Which sibling co-writes and produces Billie Eilish's music?", ["Finneas", "Max Martin", "Jack Antonoff", "Pharrell", "Mike Dean", "Benny Blanco", "Skrillex", "Metro Boomin"]),
    c("amus53", "Which Lil Nas X song spent a record 19 weeks at No. 1?", ["Old Town Road", "Industry Baby", "Montero", "Panini", "Rodeo", "Holiday", "That's What I Want", "Sun Goes Down"]),
    c("amus54", "Rihanna's 'Umbrella' is on which album?", ["Good Girl Gone Bad", "Loud", "Anti", "Rated R", "Talk That Talk", "Unapologetic", "Music of the Sun", "A Girl Like Me"]),
  ]),
];

const DOUBLE = [
  cat("COUNTRY", [
    c("amus60", "Who begged Jolene not to take her man?", ["Dolly Parton", "Loretta Lynn", "Tammy Wynette", "Reba McEntire", "Shania Twain", "Patsy Cline", "Faith Hill", "Miranda Lambert"]),
    c("amus61", "Which country star sang 'Friends in Low Places'?", ["Garth Brooks", "George Strait", "Alan Jackson", "Tim McGraw", "Kenny Chesney", "Luke Bryan", "Brooks & Dunn", "Toby Keith"]),
    c("amus62", "Johnny Cash was known by what nickname?", ["The Man in Black", "The Boss", "The King", "The Outlaw", "The Gambler", "The Possum", "The Hag", "Old Blue Eyes"]),
    c("amus63", "Which trio sang 'Goodbye Earl' in 1999?", ["The Chicks", "Lady A", "Sugarland", "Pistol Annies", "Little Big Town", "The Judds", "Wilson Phillips", "Alabama"]),
    c("amus64", "Shania Twain's 'You're Still the One' is on which 1997 album?", ["Come On Over", "The Woman in Me", "Up!", "Now", "Queen of Me", "Shania Twain", "Wild & Free", "Greatest Hits"]),
  ]),
  cat("ALBUMS", [
    c("amus70", "Which Beatles album shows the band crossing a zebra crossing?", ["Abbey Road", "Revolver", "Help!", "Rubber Soul", "Let It Be", "Sgt. Pepper's Lonely Hearts Club Band", "The White Album", "Magical Mystery Tour"]),
    c("amus71", "Which Michael Jackson album is among the best-selling ever?", ["Thriller", "Bad", "Dangerous", "Off the Wall", "HIStory", "Invincible", "Number Ones", "Ben"]),
    c("amus72", "Which 1977 Fleetwood Mac album includes 'Dreams' and 'Go Your Own Way'?", ["Rumours", "Tusk", "Mirage", "Tango in the Night", "Fleetwood Mac", "Then Play On", "Bare Trees", "Mystery to Me"]),
    c("amus73", "Which Beyonce 2016 visual album features 'Formation'?", ["Lemonade", "Renaissance", "Cowboy Carter", "4", "Dangerously in Love", "B'Day", "I Am... Sasha Fierce", "Beyonce"]),
    c("amus74", "Who released the 2013 album Random Access Memories?", ["Daft Punk", "Justice", "Air", "The Chemical Brothers", "Moby", "Deadmau5", "The Prodigy", "Zedd"]),
  ]),
  cat("NAME THAT BAND", [
    c("amus80", "'Is this the real life? Is this just fantasy?' opens a song by which band?", ["Queen", "Led Zeppelin", "Pink Floyd", "Journey", "Boston", "Genesis", "Eagles", "Meat Loaf"]),
    c("amus81", "'Hello from the other side' is sung by whom?", ["Adele", "Beyonce", "Sia", "Rihanna", "Lorde", "Amy Winehouse", "Duffy", "Florence Welch"]),
    c("amus82", "'Welcome to the Hotel California' is a lyric by which band?", ["Eagles", "Fleetwood Mac", "Steely Dan", "The Doobie Brothers", "Chicago", "Lynyrd Skynyrd", "Boston", "America"]),
    c("amus83", "'Cause baby, you're a firework' is sung by whom?", ["Katy Perry", "Lady Gaga", "Pink", "Kesha", "Miley Cyrus", "Rihanna", "Ariana Grande", "Carly Rae Jepsen"]),
    c("amus84", "'I'm blue, da ba dee da ba di' is by which Eurodance act?", ["Eiffel 65", "Aqua", "Vengaboys", "Haddaway", "Snap!", "Ace of Base", "Daft Punk", "Lou Bega"]),
  ]),
  cat("FESTIVALS & STAGES", [
    c("amus90", "Which festival is held yearly in Indio, California?", ["Coachella", "Lollapalooza", "Bonnaroo", "Burning Man", "Glastonbury", "Outside Lands", "Ultra", "Governors Ball"]),
    c("amus91", "Glastonbury Festival takes place in which country?", ["England", "Scotland", "Ireland", "Wales", "Germany", "Netherlands", "Belgium", "Spain"]),
    c("amus92", "Which US city hosts Lollapalooza each summer in Grant Park?", ["Chicago", "Austin", "Nashville", "Las Vegas", "Seattle", "Los Angeles", "New Orleans", "Miami"]),
    c("amus93", "Which singer shared the 2020 Super Bowl halftime show with Jennifer Lopez?", ["Shakira", "Beyonce", "Rihanna", "Cardi B", "Katy Perry", "Lady Gaga", "Jennifer Hudson", "Selena Gomez"]),
    c("amus94", "In what year was the original Woodstock festival?", ["1969", "1967", "1970", "1971", "1968", "1972", "1965", "1975"]),
  ]),
  cat("MUSICALS & SCREEN", [
    c("amus100", "Which Disney film features the power ballad 'Let It Go'?", ["Frozen", "Moana", "Tangled", "Encanto", "Coco", "Brave", "Aladdin", "Mulan"]),
    c("amus101", "Who created the Broadway musical Hamilton?", ["Lin-Manuel Miranda", "Andrew Lloyd Webber", "Stephen Sondheim", "Jonathan Larson", "Alan Menken", "Tim Rice", "Stephen Schwartz", "Benj Pasek"]),
    c("amus102", "Which Andrew Lloyd Webber musical features the song 'Memory'?", ["Cats", "The Phantom of the Opera", "Les Miserables", "Evita", "Wicked", "Chicago", "Rent", "Grease"]),
    c("amus103", "Lady Gaga and Bradley Cooper sing 'Shallow' in which film?", ["A Star Is Born", "Joker", "Bohemian Rhapsody", "Rocketman", "La La Land", "Barbie", "House of Gucci", "Top Gun: Maverick"]),
    c("amus104", "Which musical tells the story of the witches of Oz before Dorothy arrives?", ["Wicked", "Matilda", "Hairspray", "Hadestown", "Six", "Rent", "Chicago", "Kinky Boots"]),
  ]),
  cat("DIVA DEEP CUTS", [
    c("amus110", "Who sang 'Respect' in 1967, making it a feminist and soul anthem?", ["Aretha Franklin", "Diana Ross", "Etta James", "Tina Turner", "Dionne Warwick", "Gladys Knight", "Janis Joplin", "Patti LaBelle"]),
    c("amus111", "Which Mariah Carey holiday song returns to the charts every December?", ["All I Want for Christmas Is You", "Last Christmas", "Santa Tell Me", "Jingle Bell Rock", "Underneath the Tree", "Merry Christmas Everyone", "Mistletoe", "Blue Christmas"]),
    c("amus112", "Which singer's stage persona is Sasha Fierce?", ["Beyonce", "Rihanna", "Nicki Minaj", "Lady Gaga", "Katy Perry", "Britney Spears", "Pink", "Janet Jackson"]),
    c("amus113", "Which pop star's 2020 album Future Nostalgia includes 'Levitating'?", ["Dua Lipa", "Ariana Grande", "Doja Cat", "Olivia Rodrigo", "Sabrina Carpenter", "Charli XCX", "Tate McRae", "Selena Gomez"]),
    c("amus114", "Who headlined the record-grossing 'Eras Tour' that began in 2023?", ["Taylor Swift", "Beyonce", "Adele", "Harry Styles", "Bruce Springsteen", "Madonna", "Ed Sheeran", "Bad Bunny"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "ROCK & ROLL",
  prompt: "Which band's lineup was John, Paul, George, and Ringo?",
  choices: ["The Beatles", "The Rolling Stones", "The Who", "The Kinks", "The Monkees", "The Beach Boys", "The Byrds", "The Animals"],
  correctIndex: 0,
};

export const ADULT_MUSIC_PACK: TriviaPack = {
  id: "adult-music",
  audience: "adult",
  title: "Music Charts",
  tagline: "From vinyl legends to streaming-era chart-toppers",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
