import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("SING-ALONGS", [
    c("sgs00", "Complete the rhyme: \"Row, row, row your boat, gently down the stream. Merrily, merrily, merrily, merrily, life is but a...\"", ["Dream", "Stream", "Gleam", "Beam", "Scheme", "Team", "Seam", "Cream"]),
    c("sgs01", "In \"Itsy Bitsy Spider,\" what does the spider climb up?", ["Waterspout", "Drainpipe", "Wall", "Tree", "Window", "Rainbow", "Roof", "Chimney"]),
    c("sgs02", "In \"Baa, Baa, Black Sheep,\" how many bags of wool are there?", ["Three", "Two", "Four", "Five", "One", "Six", "Seven", "Ten"]),
    c("sgs03", "The \"Twinkle, Twinkle, Little Star\" melody is also used for which other children's song?", ["The ABC song", "Happy Birthday", "Jingle Bells", "Yankee Doodle", "London Bridge", "Hot Cross Buns", "Mary Had a Little Lamb", "Frère Jacques"]),
    c("sgs04", "Which famous composer wrote a set of piano variations on the \"Twinkle, Twinkle\" tune?", ["Mozart", "Beethoven", "Bach", "Chopin", "Tchaikovsky", "Haydn", "Brahms", "Handel"]),
  ]),
  cat("MOVIE HITS", [
    c("sgs10", "Which Disney movie features the song \"Let It Go\"?", ["Frozen", "Moana", "Tangled", "Encanto", "Brave", "Coco", "Aladdin", "Mulan"]),
    c("sgs11", "Which singer recorded \"Happy,\" featured in Despicable Me 2?", ["Pharrell Williams", "Bruno Mars", "Justin Timberlake", "Ed Sheeran", "Usher", "John Legend", "Jason Mraz", "Pitbull"]),
    c("sgs12", "Which pop star sings \"Can't Stop the Feeling!\" from the movie Trolls?", ["Justin Timberlake", "Pharrell Williams", "Bruno Mars", "Harry Styles", "Shawn Mendes", "Ed Sheeran", "Usher", "Charlie Puth"]),
    c("sgs13", "Which actress sang \"Over the Rainbow\" in The Wizard of Oz?", ["Judy Garland", "Julie Andrews", "Shirley Temple", "Audrey Hepburn", "Doris Day", "Ginger Rogers", "Debbie Reynolds", "Liza Minnelli"]),
    c("sgs14", "Which pop and rock legend composed the music for \"Circle of Life\" in The Lion King?", ["Elton John", "Billy Joel", "Paul McCartney", "Phil Collins", "Rod Stewart", "Michael Bolton", "Sting", "Bruce Springsteen"]),
  ]),
  cat("CLASSIC ROCK", [
    c("sgs20", "The Beatles formed in which English city?", ["Liverpool", "London", "Manchester", "Birmingham", "Leeds", "Bristol", "Sheffield", "Newcastle"]),
    c("sgs21", "Which Beatle played the drums?", ["Ringo Starr", "John Lennon", "Paul McCartney", "George Harrison", "Stuart Sutcliffe", "Brian Epstein", "George Martin", "Billy Preston"]),
    c("sgs22", "Who was the lead singer of Queen?", ["Freddie Mercury", "Roger Daltrey", "Mick Jagger", "Robert Plant", "Steven Tyler", "Bono", "David Bowie", "Elton John"]),
    c("sgs23", "Which band recorded \"Stairway to Heaven\"?", ["Led Zeppelin", "Pink Floyd", "The Rolling Stones", "Deep Purple", "The Who", "Black Sabbath", "Queen", "Fleetwood Mac"]),
    c("sgs24", "Which band released the 1973 album The Dark Side of the Moon?", ["Pink Floyd", "Led Zeppelin", "The Who", "Genesis", "Yes", "Queen", "Eagles", "Rush"]),
  ]),
  cat("POP STARS", [
    c("sgs30", "Which singer is known for the hit \"Shake It Off\"?", ["Taylor Swift", "Katy Perry", "Ariana Grande", "Miley Cyrus", "Selena Gomez", "Lady Gaga", "Demi Lovato", "Sia"]),
    c("sgs31", "Which singer's 1982 album Thriller became one of the best-selling albums ever?", ["Michael Jackson", "Prince", "Stevie Wonder", "Lionel Richie", "Whitney Houston", "Madonna", "Bruce Springsteen", "George Michael"]),
    c("sgs32", "Which singer is known as the \"King of Rock and Roll\"?", ["Elvis Presley", "Chuck Berry", "Little Richard", "Buddy Holly", "Johnny Cash", "Jerry Lee Lewis", "Fats Domino", "Roy Orbison"]),
    c("sgs33", "Before going solo, Beyoncé was a member of which girl group?", ["Destiny's Child", "TLC", "En Vogue", "Spice Girls", "The Supremes", "Fifth Harmony", "Pussycat Dolls", "Salt-N-Pepa"]),
    c("sgs34", "Which British singer is known for \"Rolling in the Deep\" and \"Hello\"?", ["Adele", "Dua Lipa", "Ellie Goulding", "Amy Winehouse", "Sam Smith", "Lily Allen", "Duffy", "Florence Welch"]),
  ]),
  cat("PARTY STARTERS", [
    c("sgs40", "Which Village People hit has dancers spelling out letters with their arms?", ["Y.M.C.A.", "Macho Man", "In the Navy", "Go West", "Disco Duck", "Staying Alive", "Celebration", "September"]),
    c("sgs41", "Which South Korean artist's 2012 hit \"Gangnam Style\" went viral worldwide?", ["Psy", "BTS", "BIGBANG", "Rain", "BoA", "Super Junior", "G-Dragon", "EXO"]),
    c("sgs42", "Which 2014 hit by Mark Ronson featuring Bruno Mars begins with \"This hit, that ice cold\"?", ["Uptown Funk", "Happy", "Shake It Off", "Blurred Lines", "Can't Stop the Feeling", "Get Lucky", "Counting Stars", "Roar"]),
    c("sgs43", "Which band sang \"Don't Stop Believin'\"?", ["Journey", "Boston", "Foreigner", "Toto", "Styx", "Survivor", "REO Speedwagon", "Kansas"]),
    c("sgs44", "Which Earth, Wind & Fire song asks you to remember \"the 21st night\"?", ["September", "Boogie Wonderland", "Shining Star", "Let's Groove", "After the Love Has Gone", "Fantasy", "Got to Get You into My Life", "Getaway"]),
  ]),
  cat("WHO SANG IT", [
    c("sgs50", "Which band sang \"We will, we will rock you!\"?", ["Queen", "Kiss", "AC/DC", "Aerosmith", "Journey", "Boston", "Foreigner", "Van Halen"]),
    c("sgs51", "Who sang \"Don't Worry, Be Happy\"?", ["Bobby McFerrin", "Bob Marley", "Billy Joel", "Michael Franti", "Jimmy Buffett", "Pharrell Williams", "Stevie Wonder", "Jack Johnson"]),
    c("sgs52", "Who sang \"Sweet Caroline\"?", ["Neil Diamond", "Elton John", "Billy Joel", "Rod Stewart", "Barry Manilow", "James Taylor", "Paul Simon", "Bruce Springsteen"]),
    c("sgs53", "Which band had the hit \"Livin' on a Prayer\"?", ["Bon Jovi", "Def Leppard", "Journey", "Poison", "Aerosmith", "Van Halen", "Mötley Crüe", "Guns N' Roses"]),
    c("sgs54", "Which singer-songwriter wrote and first recorded \"Hallelujah\"?", ["Leonard Cohen", "Bob Dylan", "Jeff Buckley", "Rufus Wainwright", "Neil Young", "Paul Simon", "Johnny Cash", "Willie Nelson"]),
  ]),
];

const DOUBLE = [
  cat("HOLIDAY SONGS", [
    c("sgd00", "In \"Jingle Bells,\" what kind of sleigh are you riding in?", ["One-horse open", "Two-horse closed", "Reindeer-pulled", "Silver-bell", "Red velvet", "Wooden-runner", "Four-horse covered", "Golden"]),
    c("sgd01", "Which Mariah Carey song tops holiday playlists every December?", ["All I Want for Christmas Is You", "Silent Night", "O Holy Night", "Jingle Bell Rock", "Last Christmas", "Winter Wonderland", "Santa Baby", "Sleigh Ride"]),
    c("sgd02", "Which singer made \"White Christmas\" one of the best-selling singles of all time?", ["Bing Crosby", "Frank Sinatra", "Nat King Cole", "Elvis Presley", "Perry Como", "Dean Martin", "Andy Williams", "Tony Bennett"]),
    c("sgd03", "Which singer recorded \"Rockin' Around the Christmas Tree\" at age 13 in 1958?", ["Brenda Lee", "Dolly Parton", "Patsy Cline", "Connie Francis", "Judy Garland", "Doris Day", "Nancy Sinatra", "Dionne Warwick"]),
    c("sgd04", "In which language was \"Silent Night\" originally written?", ["German", "English", "Latin", "French", "Italian", "Spanish", "Dutch", "Polish"]),
  ]),
  cat("MOVIE MUSICALS", [
    c("sgd10", "Which movie features the song \"Do-Re-Mi\"?", ["The Sound of Music", "Mary Poppins", "The Wizard of Oz", "Oliver!", "Annie", "Grease", "West Side Story", "My Fair Lady"]),
    c("sgd11", "Which movie features the song \"Supercalifragilisticexpialidocious\"?", ["Mary Poppins", "Bedknobs and Broomsticks", "The Sound of Music", "Chitty Chitty Bang Bang", "Peter Pan", "Pete's Dragon", "Oliver!", "Annie"]),
    c("sgd12", "Which movie features the song \"Greased Lightnin'\"?", ["Grease", "Footloose", "Dirty Dancing", "Hairspray", "Saturday Night Fever", "Fame", "Flashdance", "Cars"]),
    c("sgd13", "Which musical features the song \"Tomorrow\"?", ["Annie", "Oliver!", "Matilda", "Les Misérables", "Oklahoma!", "Cats", "Newsies", "Hairspray"]),
    c("sgd14", "Which musical features the song \"Seventy-Six Trombones\"?", ["The Music Man", "Oklahoma!", "Hello, Dolly!", "Guys and Dolls", "Carousel", "Gigi", "Camelot", "Show Boat"]),
  ]),
  cat("MUSIC MAKERS", [
    c("sgd20", "How many keys does a standard piano have?", ["88", "76", "61", "100", "66", "92", "108", "120"]),
    c("sgd21", "Who was the lead singer of the Jackson 5 as a young boy?", ["Michael Jackson", "Jackie Jackson", "Tito Jackson", "Marlon Jackson", "Jermaine Jackson", "Randy Jackson", "Janet Jackson", "La Toya Jackson"]),
    c("sgd22", "Which legendary rock star played a guitar flipped upside down and famously set it on fire?", ["Jimi Hendrix", "Eric Clapton", "Jimmy Page", "Carlos Santana", "Pete Townshend", "Chuck Berry", "Eddie Van Halen", "Slash"]),
    c("sgd23", "The pop group ABBA came from which country?", ["Sweden", "Norway", "Denmark", "Finland", "Iceland", "Germany", "Netherlands", "England"]),
    c("sgd24", "The rock band U2 is from which country?", ["Ireland", "Scotland", "Wales", "England", "Canada", "Australia", "United States", "New Zealand"]),
  ]),
  cat("MUSIC ACROSS THE DECADES", [
    c("sgd30", "Which 1970s dance music style, with mirror balls and platform shoes, was big on dance floors?", ["Disco", "Punk", "Grunge", "Swing", "Bebop", "Ska", "New wave", "Polka"]),
    c("sgd31", "In which decade did Elvis Presley first burst onto the scene?", ["1950s", "1930s", "1940s", "1960s", "1970s", "1980s", "1920s", "1990s"]),
    c("sgd32", "Which genre of music began in the 1970s in the Bronx, New York?", ["Hip hop", "Country", "Jazz", "Blues", "Reggae", "Polka", "Opera", "Bluegrass"]),
    c("sgd33", "Which British band released \"(I Can't Get No) Satisfaction\" in 1965?", ["The Rolling Stones", "The Beatles", "The Who", "The Kinks", "The Animals", "The Zombies", "Herman's Hermits", "The Hollies"]),
    c("sgd34", "In which year was the famous Woodstock music festival held?", ["1969", "1965", "1967", "1971", "1973", "1975", "1963", "1977"]),
  ]),
  cat("KIDS' FAVORITES", [
    c("sgd40", "Which sea creature stars in the viral kids' song with the \"doo doo doo doo doo doo\"?", ["Shark", "Whale", "Dolphin", "Octopus", "Crab", "Seahorse", "Turtle", "Jellyfish"]),
    c("sgd41", "Which kids' TV show opens with \"Won't you be my neighbor?\"", ["Mister Rogers' Neighborhood", "Sesame Street", "Barney & Friends", "Blue's Clues", "Reading Rainbow", "Bluey", "Arthur", "Dora the Explorer"]),
    c("sgd42", "Which Disney Channel movie features the song \"We're All in This Together\"?", ["High School Musical", "Camp Rock", "Descendants", "Hannah Montana", "Lizzie McGuire", "Cheetah Girls", "Zenon", "Teen Beach Movie"]),
    c("sgd43", "Which Disney song about a family member nobody talks about hit #1 on the Billboard Hot 100 in 2022?", ["We Don't Talk About Bruno", "Let It Go", "How Far I'll Go", "A Whole New World", "Surface Pressure", "Dos Oruguitas", "You're Welcome", "Into the Unknown"]),
    c("sgd44", "Which songwriter and actor wrote the songs for Moana and Encanto?", ["Lin-Manuel Miranda", "Alan Menken", "Randy Newman", "Elton John", "Phil Collins", "Kristen Anderson-Lopez", "Stephen Schwartz", "Robert Lopez"]),
  ]),
  cat("FINISH THE LYRIC", [
    c("sgd50", "Complete the Frozen lyric: \"Do you want to build a...\"", ["Snowman", "Castle", "Sled", "Igloo", "Fort", "Fire", "Snowball", "Boat"]),
    c("sgd51", "Complete the Beatles lyric: \"Whisper words of wisdom, let it...\"", ["Be", "Go", "Rain", "Shine", "Snow", "Grow", "Play", "Ring"]),
    c("sgd52", "Complete the Beatles lyric: \"We all live in a yellow...\"", ["Submarine", "Taxi", "School bus", "Balloon", "Banana", "Sunflower", "Subway", "Tent"]),
    c("sgd53", "Complete the Neil Diamond lyric: \"Sweet Caroline, good times never seemed so...\"", ["Good", "Bright", "Fine", "Sweet", "Near", "Long", "Fun", "Real"]),
    c("sgd54", "Complete the Queen lyric: \"Is this the real life? Is this just...\"", ["Fantasy", "Pretend", "A dream", "A game", "Make-believe", "A movie", "Fiction", "A show"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "HIT PARADE",
  prompt: "Which term describes the 1960s wave of British bands, including the Beatles, that took over American radio?",
  choices: ["British Invasion", "Motown Sound", "Disco Fever", "Grunge Wave", "Surf Craze", "Folk Revival", "Boy Band Boom", "Swing Era"],
  correctIndex: 0,
};

export const FAMILY_SONGS_PACK: TriviaPack = {
  id: "family-songs",
  audience: "family",
  title: "Hit Songs",
  tagline: "Sing-alongs, chart-toppers, and lyrics everyone knows",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
