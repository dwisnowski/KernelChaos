import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("NFL", [
    c("aspo00", "Patrick Mahomes quarterbacks which team?", ["Kansas City Chiefs", "Dallas Cowboys", "Buffalo Bills", "Denver Broncos", "Baltimore Ravens", "Las Vegas Raiders", "Cincinnati Bengals", "Houston Texans"]),
    c("aspo01", "How many Super Bowls did Tom Brady win?", ["Seven", "Six", "Five", "Four", "Eight", "Three", "Nine", "Two"]),
    c("aspo02", "Which team won the very first Super Bowl in 1967?", ["Green Bay Packers", "Kansas City Chiefs", "Dallas Cowboys", "New York Jets", "Baltimore Colts", "Oakland Raiders", "Miami Dolphins", "Pittsburgh Steelers"]),
    c("aspo03", "Which team had the NFL's only perfect season, going 17-0 including the Super Bowl, in 1972?", ["Miami Dolphins", "Chicago Bears", "New England Patriots", "Pittsburgh Steelers", "San Francisco 49ers", "Dallas Cowboys", "Green Bay Packers", "Oakland Raiders"]),
    c("aspo04", "In Super Bowl LI, the Patriots came back from 28-3 against which team?", ["Atlanta Falcons", "Seattle Seahawks", "Carolina Panthers", "Philadelphia Eagles", "New York Giants", "Los Angeles Rams", "Green Bay Packers", "Pittsburgh Steelers"]),
  ]),
  cat("NBA", [
    c("aspo10", "Michael Jordan won six championships with which team?", ["Chicago Bulls", "Washington Wizards", "Los Angeles Lakers", "Boston Celtics", "Detroit Pistons", "New York Knicks", "Philadelphia 76ers", "Miami Heat"]),
    c("aspo11", "Which team did LeBron James lead back from a 3-1 deficit to beat the 73-win Warriors in 2016?", ["Cleveland Cavaliers", "Miami Heat", "Los Angeles Lakers", "Boston Celtics", "Toronto Raptors", "Houston Rockets", "Chicago Bulls", "Dallas Mavericks"]),
    c("aspo12", "Kobe Bryant scored 81 points in 2006 against which team?", ["Toronto Raptors", "Boston Celtics", "Miami Heat", "Utah Jazz", "Dallas Mavericks", "Chicago Bulls", "Memphis Grizzlies", "Phoenix Suns"]),
    c("aspo13", "Stephen Curry played college basketball at which school?", ["Davidson", "Duke", "North Carolina", "Kentucky", "Gonzaga", "Villanova", "Kansas", "UCLA"]),
    c("aspo14", "Who passed Kareem Abdul-Jabbar in 2023 to become the NBA's all-time leading scorer?", ["LeBron James", "Kobe Bryant", "Karl Malone", "Michael Jordan", "Wilt Chamberlain", "Dirk Nowitzki", "Kevin Durant", "Shaquille O'Neal"]),
  ]),
  cat("BASEBALL", [
    c("aspo20", "Which team plays home games at Fenway Park?", ["Boston Red Sox", "New York Yankees", "Chicago Cubs", "Los Angeles Dodgers", "Baltimore Orioles", "Philadelphia Phillies", "Detroit Tigers", "San Francisco Giants"]),
    c("aspo21", "The Chicago Cubs ended a 108-year World Series drought in which year?", ["2016", "2014", "2015", "2017", "2012", "2018", "2010", "2013"]),
    c("aspo22", "Babe Ruth was famously sold by the Red Sox to which team?", ["New York Yankees", "Brooklyn Dodgers", "Chicago Cubs", "St. Louis Cardinals", "Philadelphia Athletics", "Detroit Tigers", "Cleveland Indians", "New York Giants"]),
    c("aspo23", "Who holds the MLB career home run record with 762?", ["Barry Bonds", "Hank Aaron", "Babe Ruth", "Alex Rodriguez", "Willie Mays", "Sammy Sosa", "Mark McGwire", "Ken Griffey Jr."]),
    c("aspo24", "Cal Ripken Jr. played how many consecutive games, breaking Lou Gehrig's record?", ["2,632", "2,130", "2,500", "3,000", "1,999", "2,215", "2,401", "2,860"]),
  ]),
  cat("SOCCER", [
    c("aspo30", "How many players does each soccer team have on the field?", ["Eleven", "Ten", "Nine", "Twelve", "Seven", "Thirteen", "Eight", "Fifteen"]),
    c("aspo31", "Which country won the 2022 FIFA World Cup?", ["Argentina", "France", "Brazil", "Croatia", "Germany", "Spain", "Morocco", "England"]),
    c("aspo32", "Who has won the most Ballon d'Or awards?", ["Lionel Messi", "Cristiano Ronaldo", "Michel Platini", "Johan Cruyff", "Marco van Basten", "Pele", "Ronaldinho", "Zinedine Zidane"]),
    c("aspo33", "Which country hosted the 2014 World Cup and lost 7-1 to Germany in the semifinal?", ["Brazil", "Argentina", "South Africa", "Russia", "Qatar", "Mexico", "United States", "Netherlands"]),
    c("aspo34", "Lionel Messi joined which MLS club in 2023?", ["Inter Miami", "LA Galaxy", "New York Red Bulls", "LAFC", "Atlanta United", "Seattle Sounders", "Orlando City", "DC United"]),
  ]),
  cat("OLYMPICS", [
    c("aspo40", "How many rings are in the Olympic logo?", ["Five", "Four", "Six", "Seven", "Three", "Eight", "Ten", "Twelve"]),
    c("aspo41", "How many Olympic gold medals did Michael Phelps win?", ["23", "18", "21", "25", "15", "28", "20", "30"]),
    c("aspo42", "Sprinter Usain Bolt represents which country?", ["Jamaica", "Trinidad and Tobago", "Bahamas", "Barbados", "Kenya", "United States", "Nigeria", "Cuba"]),
    c("aspo43", "Which city hosted the 2024 Summer Olympics?", ["Paris", "London", "Los Angeles", "Tokyo", "Rio de Janeiro", "Brisbane", "Beijing", "Sydney"]),
    c("aspo44", "Which city hosted the first modern Olympics in 1896?", ["Athens", "Paris", "London", "St. Louis", "Stockholm", "Rome", "Berlin", "Antwerp"]),
  ]),
  cat("TENNIS & GOLF", [
    c("aspo50", "Wimbledon is played on which surface?", ["Grass", "Clay", "Hard court", "Carpet", "Wood", "Ice", "Gravel", "Artificial turf"]),
    c("aspo51", "Which sister is Serena Williams' older sibling and fellow champion?", ["Venus", "Maria", "Martina", "Steffi", "Naomi", "Coco", "Monica", "Chris"]),
    c("aspo52", "Which golf major awards the famous green jacket?", ["The Masters", "U.S. Open", "The Open Championship", "PGA Championship", "The Players", "Ryder Cup", "Tour Championship", "Arnold Palmer Invitational"]),
    c("aspo53", "How many Wimbledon singles titles did Roger Federer win?", ["Eight", "Seven", "Nine", "Six", "Five", "Ten", "Four", "Three"]),
    c("aspo54", "Which golf major awards the Claret Jug?", ["The Open Championship", "The Masters", "U.S. Open", "PGA Championship", "The Players", "Ryder Cup", "Presidents Cup", "Solheim Cup"]),
  ]),
];

const DOUBLE = [
  cat("HOCKEY", [
    c("aspo60", "Wayne Gretzky is known by what nickname?", ["The Great One", "Mr. Hockey", "Super Mario", "The Rocket", "The Golden Jet", "Sid the Kid", "The Next One", "The Dominator"]),
    c("aspo61", "Which NHL franchise has won the most Stanley Cups?", ["Montreal Canadiens", "Toronto Maple Leafs", "Detroit Red Wings", "Boston Bruins", "Chicago Blackhawks", "Edmonton Oilers", "New York Rangers", "Pittsburgh Penguins"]),
    c("aspo62", "In the 1980 'Miracle on Ice,' the U.S. beat which team?", ["Soviet Union", "Canada", "Finland", "Sweden", "Czechoslovakia", "West Germany", "Norway", "Switzerland"]),
    c("aspo63", "Who broke Wayne Gretzky's all-time NHL goals record in 2025?", ["Alex Ovechkin", "Sidney Crosby", "Connor McDavid", "Auston Matthews", "Mario Lemieux", "Gordie Howe", "Jaromir Jagr", "Brett Hull"]),
    c("aspo64", "The Vegas Golden Knights won their first Stanley Cup in 2023 against which team?", ["Florida Panthers", "Boston Bruins", "Tampa Bay Lightning", "Colorado Avalanche", "Edmonton Oilers", "Dallas Stars", "Carolina Hurricanes", "New York Rangers"]),
  ]),
  cat("MOTORSPORT", [
    c("aspo70", "The Indianapolis 500 is run at which track?", ["Indianapolis Motor Speedway", "Daytona International Speedway", "Talladega Superspeedway", "Watkins Glen", "Sebring", "Laguna Seca", "Road America", "Charlotte Motor Speedway"]),
    c("aspo71", "Which Formula 1 driver tied Michael Schumacher's record of seven world titles?", ["Lewis Hamilton", "Max Verstappen", "Sebastian Vettel", "Ayrton Senna", "Alain Prost", "Fernando Alonso", "Niki Lauda", "Jim Clark"]),
    c("aspo72", "The Monaco Grand Prix winds through which city's streets?", ["Monte Carlo", "Nice", "Monza", "Silverstone", "Spa", "Suzuka", "Zandvoort", "Imola"]),
    c("aspo73", "Which F1 driver was nicknamed 'The Iceman'?", ["Kimi Raikkonen", "Lewis Hamilton", "Sebastian Vettel", "Mika Hakkinen", "Fernando Alonso", "Jenson Button", "Nico Rosberg", "Valtteri Bottas"]),
    c("aspo74", "The 24 Hours of Le Mans is held in which country?", ["France", "Italy", "Germany", "Belgium", "United Kingdom", "Spain", "United States", "Monaco"]),
  ]),
  cat("COLLEGE HOOPS", [
    c("aspo80", "Which award goes to the best player in college football?", ["Heisman Trophy", "Maxwell Award", "Biletnikoff Award", "Doak Walker Award", "Lombardi Award", "Butkus Award", "Outland Trophy", "Davey O'Brien Award"]),
    c("aspo81", "Coach K, Mike Krzyzewski, led which college program?", ["Duke", "North Carolina", "Kentucky", "Kansas", "UConn", "Syracuse", "Indiana", "Michigan State"]),
    c("aspo82", "How many teams are in the NCAA men's basketball tournament?", ["68", "64", "72", "65", "48", "32", "96", "76"]),
    c("aspo83", "In 2018, 16th-seeded UMBC stunned which No. 1 seed?", ["Virginia", "Kansas", "Villanova", "Xavier", "Gonzaga", "Duke", "Purdue", "North Carolina"]),
    c("aspo84", "Which school won back-to-back men's titles in 2023 and 2024?", ["UConn", "Duke", "Kansas", "Villanova", "Florida", "Houston", "UCLA", "Kentucky"]),
  ]),
  cat("SPORTS LINGO", [
    c("aspo90", "In bowling, three strikes in a row is called a what?", ["Turkey", "Hat trick", "Triple", "Gobbler", "Trifecta", "Eagle", "Birdie", "Hambone"]),
    c("aspo91", "In golf, one stroke under par on a hole is called a what?", ["Birdie", "Eagle", "Bogey", "Albatross", "Par", "Condor", "Ace", "Chip"]),
    c("aspo92", "In baseball, a 'perfect game' means what?", ["No opposing batter reaches base", "No hits allowed", "No runs allowed", "Pitcher strikes out 27", "No walks issued", "Only one hit allowed", "A shutout with no errors", "A win by ten runs"]),
    c("aspo93", "In tennis, what is a score of zero called?", ["Love", "Nil", "Zip", "Duck", "Blank", "Naught", "Goose egg", "Null"]),
    c("aspo94", "How many points is a safety worth in American football?", ["Two", "One", "Three", "Six", "Four", "Zero", "Five", "Seven"]),
  ]),
  cat("WOMEN IN SPORTS", [
    c("aspo100", "Who scored the 1999 Women's World Cup-winning penalty, then ripped off her jersey?", ["Brandi Chastain", "Mia Hamm", "Abby Wambach", "Megan Rapinoe", "Alex Morgan", "Carli Lloyd", "Julie Foudy", "Hope Solo"]),
    c("aspo101", "Caitlin Clark was the No. 1 pick in 2024 by which WNBA team?", ["Indiana Fever", "Las Vegas Aces", "Seattle Storm", "New York Liberty", "Chicago Sky", "Dallas Wings", "Phoenix Mercury", "Atlanta Dream"]),
    c("aspo102", "In what year did Billie Jean King win the 'Battle of the Sexes' against Bobby Riggs?", ["1973", "1969", "1975", "1971", "1977", "1979", "1981", "1965"]),
    c("aspo103", "Who earned the first perfect 10 in Olympic gymnastics in 1976?", ["Nadia Comaneci", "Mary Lou Retton", "Olga Korbut", "Simone Biles", "Kerri Strug", "Nastia Liukin", "Gabby Douglas", "Shawn Johnson"]),
    c("aspo104", "How many Grand Slam singles titles did Serena Williams win?", ["23", "24", "22", "21", "20", "19", "18", "25"]),
  ]),
  cat("CHAMPIONSHIP LORE", [
    c("aspo110", "Which trophy goes to the winner of the NFL's Super Bowl?", ["Vince Lombardi Trophy", "Stanley Cup", "Larry O'Brien Trophy", "Commissioner's Trophy", "Heisman Trophy", "Claret Jug", "Jules Rimet Trophy", "Ryder Cup"]),
    c("aspo111", "Which trophy is awarded to the NBA champion?", ["Larry O'Brien Trophy", "Stanley Cup", "Vince Lombardi Trophy", "Commissioner's Trophy", "Calder Cup", "Grey Cup", "Heisman Trophy", "Claret Jug"]),
    c("aspo112", "Which NFL team plays home games at Lambeau Field?", ["Green Bay Packers", "Chicago Bears", "Minnesota Vikings", "Detroit Lions", "Cleveland Browns", "Pittsburgh Steelers", "Buffalo Bills", "Tennessee Titans"]),
    c("aspo113", "In the 1974 'Rumble in the Jungle,' Muhammad Ali beat which heavyweight?", ["George Foreman", "Joe Frazier", "Sonny Liston", "Larry Holmes", "Mike Tyson", "Ken Norton", "Floyd Patterson", "Leon Spinks"]),
    c("aspo114", "Which baseball team won the 2004 World Series, ending the 'Curse of the Bambino'?", ["Boston Red Sox", "Chicago Cubs", "Chicago White Sox", "Cleveland Guardians", "Houston Astros", "Philadelphia Phillies", "Atlanta Braves", "Detroit Tigers"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "CURSES & DROUGHTS",
  prompt: "In 2005, which team ended an 88-year World Series drought?",
  choices: ["Chicago White Sox", "Boston Red Sox", "Chicago Cubs", "Cleveland Guardians", "Philadelphia Phillies", "Houston Astros", "Texas Rangers", "San Francisco Giants"],
  correctIndex: 0,
};

export const ADULT_SPORTS_PACK: TriviaPack = {
  id: "adult-sports",
  audience: "adult",
  title: "Sports Deep Cuts",
  tagline: "Hardwood, gridiron, diamond, and everything in between",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
