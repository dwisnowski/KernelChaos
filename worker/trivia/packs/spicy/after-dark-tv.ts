import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("HBO HITS", [
    c("adt-s0-0", "Which HBO series follows New Jersey mob boss Tony Soprano?", ["The Sopranos", "The Wire", "Boardwalk Empire", "Entourage", "Oz", "Deadwood", "True Detective", "Veep"]),
    c("adt-s0-1", "'Game of Thrones' is based on novels by which author?", ["George R.R. Martin", "J.R.R. Tolkien", "Stephen King", "Neil Gaiman", "Patrick Rothfuss", "Brandon Sanderson", "J.K. Rowling", "Terry Pratchett"]),
    c("adt-s0-2", "HBO's 'The Wire' is set in which city?", ["Baltimore", "Philadelphia", "Detroit", "Chicago", "New Orleans", "Boston", "Newark", "Pittsburgh"]),
    c("adt-s0-3", "Season one of 'The White Lotus' takes place at a resort in which US state?", ["Hawaii", "Florida", "California", "Arizona", "Alaska", "Texas", "Nevada", "Puerto Rico"]),
    c("adt-s0-4", "In 'Succession,' the Roy family runs which media company?", ["Waystar Royco", "Pierce Global", "Dunder Mifflin", "Wayne Enterprises", "Vought International", "Sterling Cooper", "Gekko & Co", "Globex Media"]),
  ]),
  cat("SEX AND THE CITY", [
    c("adt-s1-0", "Which cocktail is most associated with Carrie and her friends?", ["Cosmopolitan", "Mojito", "Margarita", "Old Fashioned", "Manhattan", "Mimosa", "Daiquiri", "Martini"]),
    c("adt-s1-1", "Which actress plays Carrie Bradshaw?", ["Sarah Jessica Parker", "Kim Cattrall", "Cynthia Nixon", "Kristin Davis", "Jennifer Aniston", "Julia Roberts", "Courteney Cox", "Jennifer Garner"]),
    c("adt-s1-2", "Carrie is famously obsessed with shoes from which designer?", ["Manolo Blahnik", "Christian Louboutin", "Jimmy Choo", "Gucci", "Prada", "Steve Madden", "Salvatore Ferragamo", "Vera Wang"]),
    c("adt-s1-3", "Which actress plays the bold publicist Samantha Jones?", ["Kim Cattrall", "Cynthia Nixon", "Kristin Davis", "Sarah Jessica Parker", "Heather Locklear", "Sharon Stone", "Sela Ward", "Lucy Liu"]),
    c("adt-s1-4", "What is the title of the 2021 'Sex and the City' revival series?", ["And Just Like That...", "Still Single in the City", "Carrie Returns", "Sex and the City Reloaded", "The City Never Sleeps", "Manhattan Mornings", "Girls' Night Out", "Brunch and the City"]),
  ]),
  cat("PREMIUM CABLE", [
    c("adt-s2-0", "In 'Dexter,' the title character works as a blood-spatter analyst in which city?", ["Miami", "Las Vegas", "Los Angeles", "Houston", "New Orleans", "Tampa", "San Diego", "Phoenix"]),
    c("adt-s2-1", "In 'Weeds,' suburban mom Nancy Botwin sells what?", ["Marijuana", "Cupcakes", "Cosmetics", "Insurance", "Real estate", "Cookware", "Jewelry", "Vacuum cleaners"]),
    c("adt-s2-2", "Which actor plays writer Hank Moody in 'Californication'?", ["David Duchovny", "Jon Hamm", "Hugh Laurie", "Matthew Perry", "Kiefer Sutherland", "Bryan Cranston", "Michael C. Hall", "Gary Sinise"]),
    c("adt-s2-3", "'Shameless' follows the chaotic family with which last name?", ["Gallagher", "Soprano", "Bluth", "Kardashian", "Conner", "Belcher", "Roy", "Pritchett"]),
    c("adt-s2-4", "Which two actors star as rivals in the Showtime drama 'Billions'?", ["Paul Giamatti and Damian Lewis", "Bryan Cranston and Aaron Paul", "Michael Douglas and Matt Damon", "Jon Hamm and Kevin Spacey", "Hugh Laurie and Idris Elba", "Steve Carell and Jason Sudeikis", "Kit Harington and Sean Bean", "Mark Ruffalo and Chris Evans"]),
  ]),
  cat("STREAMING SIZZLE", [
    c("adt-s3-0", "The hit Netflix series 'Squid Game' comes from which country?", ["South Korea", "Japan", "China", "Thailand", "Vietnam", "Taiwan", "India", "Singapore"]),
    c("adt-s3-1", "Which actress plays Rue Bennett in HBO's 'Euphoria'?", ["Zendaya", "Sydney Sweeney", "Hunter Schafer", "Alexa Demie", "Maude Apatow", "Jacob Elordi", "Barbie Ferreira", "Storm Reid"]),
    c("adt-s3-2", "Which legendary actress voices Lady Whistledown in 'Bridgerton'?", ["Julie Andrews", "Judi Dench", "Maggie Smith", "Helen Mirren", "Emma Thompson", "Meryl Streep", "Angela Lansbury", "Olivia Colman"]),
    c("adt-s3-3", "Which actor plays Otis Milburn in 'Sex Education'?", ["Asa Butterfield", "Timothée Chalamet", "Tom Holland", "Finn Wolfhard", "Noah Jupe", "Freddie Highmore", "Ed Westwick", "Dylan O'Brien"]),
    c("adt-s3-4", "Which actor plays Pablo Escobar in the first seasons of 'Narcos'?", ["Wagner Moura", "Pedro Pascal", "Diego Luna", "Oscar Isaac", "Javier Bardem", "Gael García Bernal", "Edgar Ramírez", "Benicio del Toro"]),
  ]),
  cat("SITCOMS AFTER 9", [
    c("adt-s4-0", "Which Friends character is famous for the pickup line 'How you doin'?'", ["Joey", "Chandler", "Ross", "Gunther", "Mike", "Richard", "Tag", "Eddie"]),
    c("adt-s4-1", "The gang in 'It's Always Sunny in Philadelphia' runs which bar?", ["Paddy's Pub", "MacLaren's", "Moe's Tavern", "Cheers", "The Drunken Clam", "Merlotte's", "Rovers Return", "The Winchester"]),
    c("adt-s4-2", "Which 'How I Met Your Mother' character's catchphrase is 'Legen—wait for it—dary'?", ["Barney Stinson", "Ted Mosby", "Marshall Eriksen", "Robin Scherbatsky", "Lily Aldrin", "Ranjit", "Zoey", "Quinn"]),
    c("adt-s4-3", "Which actor replaced Charlie Sheen on 'Two and a Half Men' in 2011?", ["Ashton Kutcher", "Jon Cryer", "Hugh Laurie", "Seth Green", "Adam Brody", "Zach Braff", "Josh Radnor", "Topher Grace"]),
    c("adt-s4-4", "Which Seinfeld episode, famously never naming its subject, won an Emmy for writing?", ["The Contest", "The Soup Nazi", "The Puffy Shirt", "The Chinese Restaurant", "The Parking Garage", "The Marine Biologist", "The Opposite", "The Pez Dispenser"]),
  ]),
  cat("SULTRY SUPERNATURAL", [
    c("adt-s5-0", "In 'Twilight,' Bella falls for a vampire named Edward ___.", ["Cullen", "Salvatore", "Mason", "Blackwood", "Swan", "Black", "Hale", "Lestat"]),
    c("adt-s5-1", "Buffy fights vampires in which fictional California town?", ["Sunnydale", "Mystic Falls", "Bon Temps", "Sleepy Hollow", "Riverdale", "Salem", "Forks", "Derry"]),
    c("adt-s5-2", "HBO's 'True Blood' is set in Bon Temps in which state?", ["Louisiana", "Mississippi", "Alabama", "Georgia", "Texas", "Florida", "Tennessee", "Arkansas"]),
    c("adt-s5-3", "'The Vampire Diaries' takes place in the fictional town of Mystic Falls in which state?", ["Virginia", "Maine", "Georgia", "Ohio", "Oregon", "Louisiana", "Connecticut", "Vermont"]),
    c("adt-s5-4", "Who played the vampire Lestat in the 1994 film 'Interview with the Vampire'?", ["Tom Cruise", "Brad Pitt", "Antonio Banderas", "Johnny Depp", "Keanu Reeves", "Christian Slater", "Stephen Rea", "Robert Pattinson"]),
  ]),
];

const DOUBLE = [
  cat("GAME OF THRONES", [
    c("adt-d0-0", "What animal appears on the sigil of House Stark?", ["Direwolf", "Lion", "Dragon", "Stag", "Kraken", "Falcon", "Wolf pack", "Bear"]),
    c("adt-d0-1", "Which character is known as the 'Mother of Dragons'?", ["Daenerys Targaryen", "Cersei Lannister", "Sansa Stark", "Arya Stark", "Brienne of Tarth", "Margaery Tyrell", "Melisandre", "Yara Greyjoy"]),
    c("adt-d0-2", "Which actor plays Tyrion Lannister?", ["Peter Dinklage", "Kit Harington", "Nikolaj Coster-Waldau", "Sean Bean", "Iain Glen", "Jason Momoa", "Charles Dance", "Aidan Gillen"]),
    c("adt-d0-3", "The infamous 'Red Wedding' takes place in which season?", ["Season 3", "Season 1", "Season 2", "Season 4", "Season 5", "Season 6", "Season 7", "Season 8"]),
    c("adt-d0-4", "House Lannister's official motto is:", ["Hear Me Roar", "Winter Is Coming", "Fire and Blood", "Growing Strong", "Ours Is the Fury", "We Do Not Sow", "Unbowed, Unbent, Unbroken", "As High as Honor"]),
  ]),
  cat("ANTIHEROES", [
    c("adt-d1-0", "In 'Breaking Bad,' Walter White is a high school teacher of what subject?", ["Chemistry", "Physics", "Biology", "Math", "History", "English", "Shop", "Gym"]),
    c("adt-d1-1", "Tony Soprano's therapist is Dr. Jennifer ___.", ["Melfi", "Nelson", "Rosen", "Brennan", "Taylor", "Fisher", "Kessler", "Rhodes"]),
    c("adt-d1-2", "In 'Mad Men,' Don Draper works at which ad agency?", ["Sterling Cooper", "Pierce & Pierce", "Saatchi & Saatchi", "Wolfram & Hart", "Bluth Advertising", "Dunder Mifflin", "Cooper & Draper", "Kline Burns"]),
    c("adt-d1-3", "The Netflix crime drama 'Peaky Blinders' is set in which English city?", ["Birmingham", "Manchester", "Liverpool", "London", "Leeds", "Sheffield", "Bristol", "Newcastle"]),
    c("adt-d1-4", "In 'The Wire,' which stick-up man whistles 'A-Hunting We Will Go'?", ["Omar Little", "Stringer Bell", "Bubbles", "Avon Barksdale", "Marlo Stanfield", "Bunk Moreland", "Jimmy McNulty", "Proposition Joe"]),
  ]),
  cat("TV WATERING HOLES", [
    c("adt-d2-0", "Which sitcom is set in a Boston bar 'where everybody knows your name'?", ["Cheers", "Frasier", "Taxi", "Friends", "The Drew Carey Show", "Wings", "Night Court", "Becker"]),
    c("adt-d2-1", "Who owns the dive bar on 'The Simpsons'?", ["Moe Szyslak", "Homer Simpson", "Barney Gumble", "Lenny Leonard", "Carl Carlson", "Apu Nahasapeemapetilon", "Krusty", "Ned Flanders"]),
    c("adt-d2-2", "Which bar do the characters of 'How I Met Your Mother' frequent?", ["MacLaren's Pub", "Paddy's Pub", "The Drunken Clam", "Cheers", "Central Perk", "Rovers Return", "Moe's Tavern", "Merlotte's"]),
    c("adt-d2-3", "In 'The Sopranos,' the crew hangs out at which strip club?", ["Bada Bing", "Scores", "The Pink Pony", "Club Tropicana", "Satin Dolls", "The Cheetah", "Spearmint Rhino", "The Crazy Horse"]),
    c("adt-d2-4", "Which pub is the center of the British soap 'Coronation Street'?", ["The Rovers Return", "The Queen Vic", "The Woolpack", "The Winchester", "The Slaughtered Lamb", "The Drunken Duck", "The Red Lion", "The Prancing Pony"]),
  ]),
  cat("TALK SHOW TRASH", [
    c("adt-d3-0", "Which flying objects were famously hurled on 'The Jerry Springer Show'?", ["Chairs", "Pies", "Shoes", "Microphones", "Beer bottles", "Pillows", "Tomatoes", "Frisbees"]),
    c("adt-d3-1", "On 'Maury,' which test result is famously announced with 'You are NOT the father'?", ["A paternity test", "A lie detector test", "A drug test", "A blood-pressure test", "An eye exam", "A personality test", "A DNA ancestry test", "A pregnancy test"]),
    c("adt-d3-2", "Which talk show host is famous for asking 'How's that working for you?'", ["Dr. Phil", "Dr. Oz", "Maury Povich", "Montel Williams", "Ricki Lake", "Steve Wilkos", "Jenny Jones", "Sally Jessy Raphael"]),
    c("adt-d3-3", "Jerry Springer was once mayor of which Ohio city?", ["Cincinnati", "Cleveland", "Columbus", "Toledo", "Dayton", "Akron", "Youngstown", "Canton"]),
    c("adt-d3-4", "Jerry Springer's famous sign-off urged viewers to 'take care of yourselves, and each ___.'", ["Other", "Day", "Night", "Show", "Week", "Friend", "Family", "Neighbor"]),
  ]),
  cat("TEEN DRAMA", [
    c("adt-d4-0", "The 1990 teen drama is named after which famous zip code?", ["Beverly Hills, 90210", "The O.C., 92660", "Melrose Place, 90069", "Malibu, 90265", "Gossip Girl, 10021", "Riverdale, 10001", "Dawson's Creek, 02101", "Laguna Beach, 92651"]),
    c("adt-d4-1", "What is Gossip Girl's famous sign-off?", ["XOXO", "TTYL", "Laters, Upper East Siders", "Spill It", "Stay Fancy", "Kisses and Secrets", "Yours Truly", "Catch You Later"]),
    c("adt-d4-2", "'The O.C.' is set in which county?", ["Orange County", "Ocean County", "Olive County", "Oak County", "Ontario County", "Otero County", "Osage County", "Ouachita County"]),
    c("adt-d4-3", "Which actress voices the narrator of the original 'Gossip Girl'?", ["Kristen Bell", "Blake Lively", "Leighton Meester", "Taylor Momsen", "Jessica Szohr", "Hilary Duff", "Emma Roberts", "Anna Kendrick"]),
    c("adt-d4-4", "Which actor plays Jughead Jones on 'Riverdale'?", ["Cole Sprouse", "KJ Apa", "Lili Reinhart", "Camila Mendes", "Charles Melton", "Dylan Sprouse", "Ross Butler", "Casey Cott"]),
  ]),
  cat("DRAG RACE & GLAM", [
    c("adt-d5-0", "Who hosts 'RuPaul's Drag Race'?", ["RuPaul", "Jujubee", "Tyra Banks", "Michelle Visage", "Ross Mathews", "Alaska Thunderfuck", "Nina West", "Jinkx Monsoon"]),
    c("adt-d5-1", "A queen eliminated on 'Drag Race' is told to:", ["Sashay away", "Walk it out", "Pack your bags", "Strut home", "Slay away", "Shantay stay", "Fade away", "Dip out"]),
    c("adt-d5-2", "Which Netflix show features the 'Fab Five' makeover team?", ["Queer Eye", "Say Yes to the Dress", "Love Is Blind", "Next in Fashion", "Selling Sunset", "Glow Up", "Dating Around", "Too Hot to Handle"]),
    c("adt-d5-3", "The FX drama 'Pose' is set in which city's ballroom scene?", ["New York City", "Los Angeles", "Chicago", "Miami", "San Francisco", "New Orleans", "Atlanta", "Detroit"]),
    c("adt-d5-4", "Which 1990 documentary explored New York's drag ball culture?", ["Paris Is Burning", "The Queen", "Strike a Pose", "Shortbus", "Tongues Untied", "Venus Boyz", "Gay Pride Parade", "The Celluloid Closet"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "AFTER DARK TV",
  prompt: "Julia Louis-Dreyfus plays Vice President Selina Meyer in which HBO comedy?",
  choices: ["Veep", "Succession", "Curb Your Enthusiasm", "Girls", "Silicon Valley", "The Newsroom", "Entourage", "Barry"],
  correctIndex: 0,
};

export const SPICY_AFTER_DARK_TV_PACK: TriviaPack = {
  id: "spicy-after-dark-tv",
  audience: "spicy",
  title: "After Dark TV",
  tagline: "Premium cable, binge-worthy bad behavior, and talk-show chaos",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
