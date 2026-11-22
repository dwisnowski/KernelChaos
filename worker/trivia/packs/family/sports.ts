import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("BASEBALL", [
    c("sps00", "How many strikes make an out in baseball?", ["Three", "Two", "Four", "Five", "One", "Six", "Seven", "Ten"]),
    c("sps01", "How many innings are in a regulation Major League Baseball game?", ["Nine", "Seven", "Eight", "Ten", "Six", "Twelve", "Five", "Eleven"]),
    c("sps02", "Which legendary slugger was nicknamed the \"Sultan of Swat\"?", ["Babe Ruth", "Lou Gehrig", "Hank Aaron", "Willie Mays", "Mickey Mantle", "Ty Cobb", "Joe DiMaggio", "Ted Williams"]),
    c("sps03", "Which jersey number is retired across all of Major League Baseball in honor of Jackie Robinson?", ["42", "7", "21", "3", "24", "44", "1", "14"]),
    c("sps04", "Which Baltimore Orioles star broke Lou Gehrig's record for consecutive games played?", ["Cal Ripken Jr.", "Derek Jeter", "Pete Rose", "Rickey Henderson", "Barry Bonds", "Ken Griffey Jr.", "Nolan Ryan", "Ozzie Smith"]),
  ]),
  cat("BASKETBALL", [
    c("sps10", "How many players from one team are on a basketball court at a time?", ["Five", "Four", "Six", "Seven", "Three", "Eight", "Ten", "Nine"]),
    c("sps11", "How many points is a shot from behind the arc worth?", ["Three", "Two", "One", "Four", "Five", "Six", "Seven", "Ten"]),
    c("sps12", "Michael Jordan won six NBA titles with which team?", ["Chicago Bulls", "Los Angeles Lakers", "Boston Celtics", "Detroit Pistons", "New York Knicks", "Miami Heat", "Houston Rockets", "Philadelphia 76ers"]),
    c("sps13", "Who invented basketball in 1891?", ["James Naismith", "Abner Doubleday", "Walter Camp", "Phog Allen", "John Wooden", "Red Auerbach", "Pete Maravich", "Dean Smith"]),
    c("sps14", "Which NBA legend scored 100 points in a single game in 1962?", ["Wilt Chamberlain", "Michael Jordan", "Kobe Bryant", "Bill Russell", "Kareem Abdul-Jabbar", "LeBron James", "Larry Bird", "Shaquille O'Neal"]),
  ]),
  cat("FOOTBALL", [
    c("sps20", "How many points is a touchdown worth before the extra point?", ["Six", "Three", "Seven", "Two", "Four", "Five", "Eight", "One"]),
    c("sps21", "How long is the main playing field in American football, goal line to goal line?", ["100 yards", "80 yards", "120 yards", "90 yards", "110 yards", "75 yards", "150 yards", "60 yards"]),
    c("sps22", "What is the Super Bowl trophy called?", ["Vince Lombardi Trophy", "Stanley Cup", "Heisman Trophy", "Commissioner's Trophy", "Larry O'Brien Trophy", "Lamar Hunt Trophy", "Grey Cup", "Jules Rimet Trophy"]),
    c("sps23", "Which quarterback won seven Super Bowl championships?", ["Tom Brady", "Peyton Manning", "Joe Montana", "Patrick Mahomes", "Aaron Rodgers", "Dan Marino", "Eli Manning", "Brett Favre"]),
    c("sps24", "Which NFL team plays its home games at Lambeau Field?", ["Green Bay Packers", "Chicago Bears", "Minnesota Vikings", "Detroit Lions", "Cleveland Browns", "Pittsburgh Steelers", "Denver Broncos", "Seattle Seahawks"]),
  ]),
  cat("SOCCER", [
    c("sps30", "Which player on a soccer team is allowed to use their hands during play?", ["Goalkeeper", "Striker", "Defender", "Midfielder", "Captain", "Winger", "Sweeper", "Coach"]),
    c("sps31", "How many players from one team are on a soccer field at a time?", ["Eleven", "Nine", "Ten", "Twelve", "Eight", "Seven", "Thirteen", "Fifteen"]),
    c("sps32", "How often is the men's FIFA World Cup held?", ["Every four years", "Every year", "Every two years", "Every three years", "Every five years", "Every six years", "Every eight years", "Every ten years"]),
    c("sps33", "Which country won the 2022 men's FIFA World Cup, led by Lionel Messi?", ["Argentina", "France", "Brazil", "Germany", "Spain", "Croatia", "England", "Morocco"]),
    c("sps34", "Which country has won the most men's FIFA World Cup titles, with five?", ["Brazil", "Germany", "Italy", "Argentina", "France", "Uruguay", "Spain", "England"]),
  ]),
  cat("OLYMPICS", [
    c("sps40", "How many rings are in the Olympic symbol?", ["Five", "Four", "Six", "Three", "Seven", "Eight", "Two", "Ten"]),
    c("sps41", "The Olympic flame is traditionally lit in which country?", ["Greece", "Italy", "France", "Egypt", "Turkey", "United Kingdom", "Spain", "Switzerland"]),
    c("sps42", "Which city hosted the 2024 Summer Olympics?", ["Paris", "Tokyo", "London", "Los Angeles", "Rio de Janeiro", "Beijing", "Sydney", "Athens"]),
    c("sps43", "Which American swimmer holds the record for most Olympic gold medals, with 23?", ["Michael Phelps", "Mark Spitz", "Ryan Lochte", "Caeleb Dressel", "Katie Ledecky", "Ian Thorpe", "Matt Biondi", "Aaron Peirsol"]),
    c("sps44", "In which city were the first modern Olympic Games held in 1896?", ["Athens", "Paris", "London", "Rome", "Berlin", "Stockholm", "Amsterdam", "St. Louis"]),
  ]),
  cat("MORE SPORTS", [
    c("sps50", "What do hockey players hit across the ice?", ["Puck", "Ball", "Shuttlecock", "Disc", "Cone", "Block", "Pin", "Rock"]),
    c("sps51", "In golf, scoring one stroke under par on a hole is called a:", ["Birdie", "Eagle", "Bogey", "Albatross", "Par", "Ace", "Condor", "Double bogey"]),
    c("sps52", "Which sport uses a shuttlecock?", ["Badminton", "Tennis", "Squash", "Table tennis", "Racquetball", "Pickleball", "Volleyball", "Lacrosse"]),
    c("sps53", "Which of tennis's four Grand Slam tournaments is played on grass?", ["Wimbledon", "French Open", "U.S. Open", "Australian Open", "Davis Cup", "Indian Wells", "Laver Cup", "ATP Finals"]),
    c("sps54", "Which golf tournament awards the winner a green jacket?", ["The Masters", "The U.S. Open", "The Open Championship", "The PGA Championship", "The Ryder Cup", "The Players Championship", "The Presidents Cup", "The Tour Championship"]),
  ]),
];

const DOUBLE = [
  cat("RULES & RULEBOOKS", [
    c("spd00", "Knocking down all ten pins with your first ball in bowling is called a:", ["Strike", "Spare", "Gutter", "Split", "Turkey", "Frame", "Foul", "Ace"]),
    c("spd01", "How many players from one team are on the court in volleyball?", ["Six", "Five", "Seven", "Eight", "Four", "Nine", "Ten", "Three"]),
    c("spd02", "In tennis, a score of zero is called:", ["Love", "Nil", "Zip", "Duck", "Blank", "Naught", "Deuce", "Ace"]),
    c("spd03", "In which sport do teams form a \"scrum\"?", ["Rugby", "Cricket", "Lacrosse", "Handball", "Water polo", "Field hockey", "Ultimate", "Netball"]),
    c("spd04", "In baseball, what does ERA stand for?", ["Earned run average", "Every run allowed", "Extra runs added", "Early runner advance", "Errors recorded annually", "Equal run ratio", "Elite runner award", "Exact run average"]),
  ]),
  cat("FAMOUS ATHLETES", [
    c("spd10", "Serena Williams is a champion in which sport?", ["Tennis", "Golf", "Gymnastics", "Track and field", "Swimming", "Basketball", "Figure skating", "Volleyball"]),
    c("spd11", "Simone Biles is a champion in which sport?", ["Gymnastics", "Diving", "Figure skating", "Swimming", "Track and field", "Tennis", "Skiing", "Cheerleading"]),
    c("spd12", "Sprinter Usain Bolt, the world's fastest man, is from which country?", ["Jamaica", "United States", "Kenya", "Trinidad", "Nigeria", "Great Britain", "Ethiopia", "South Africa"]),
    c("spd13", "Wayne Gretzky, nicknamed \"The Great One,\" starred in which sport?", ["Ice hockey", "Baseball", "Basketball", "Soccer", "Football", "Golf", "Tennis", "Lacrosse"]),
    c("spd14", "Which boxer called himself \"The Greatest\"?", ["Muhammad Ali", "Mike Tyson", "Joe Frazier", "Floyd Mayweather", "George Foreman", "Sugar Ray Leonard", "Rocky Marciano", "Evander Holyfield"]),
  ]),
  cat("TEAMS & PLACES", [
    c("spd20", "The Los Angeles Lakers play which sport?", ["Basketball", "Baseball", "Football", "Hockey", "Soccer", "Volleyball", "Lacrosse", "Rugby"]),
    c("spd21", "Which NFL team has a star on its helmet and plays in Texas?", ["Dallas Cowboys", "Houston Texans", "Philadelphia Eagles", "Kansas City Chiefs", "Las Vegas Raiders", "Denver Broncos", "Tennessee Titans", "San Francisco 49ers"]),
    c("spd22", "The Maple Leafs are a hockey team from which Canadian city?", ["Toronto", "Montreal", "Vancouver", "Calgary", "Ottawa", "Edmonton", "Winnipeg", "Halifax"]),
    c("spd23", "Fenway Park, with its Green Monster wall, is home to which team?", ["Boston Red Sox", "New York Yankees", "Chicago Cubs", "Los Angeles Dodgers", "San Francisco Giants", "Philadelphia Phillies", "St. Louis Cardinals", "Atlanta Braves"]),
    c("spd24", "Wrigley Field, famous for its ivy-covered walls, is home to which team?", ["Chicago Cubs", "Chicago White Sox", "Boston Red Sox", "Milwaukee Brewers", "Cincinnati Reds", "St. Louis Cardinals", "Cleveland Guardians", "Detroit Tigers"]),
  ]),
  cat("WINTER SPORTS", [
    c("spd30", "Which winter sport has teams sliding stones across the ice toward a target?", ["Curling", "Bobsled", "Luge", "Skeleton", "Biathlon", "Speed skating", "Hockey", "Figure skating"]),
    c("spd31", "Which trophy is awarded to the NHL champion?", ["Stanley Cup", "Vince Lombardi Trophy", "Larry O'Brien Trophy", "Commissioner's Trophy", "Calder Cup", "Grey Cup", "Heisman Trophy", "Davis Cup"]),
    c("spd32", "Which American snowboarder is nicknamed \"The Flying Tomato\"?", ["Shaun White", "Chloe Kim", "Travis Rice", "Mark McMorris", "Lindsey Vonn", "Bode Miller", "Ted Ligety", "Tony Hawk"]),
    c("spd33", "Which winter sport combines cross-country skiing with rifle shooting?", ["Biathlon", "Slalom", "Luge", "Ski jumping", "Curling", "Skeleton", "Moguls", "Nordic combined"]),
    c("spd34", "Which city hosted the 2022 Winter Olympics?", ["Beijing", "Pyeongchang", "Sochi", "Vancouver", "Turin", "Salt Lake City", "Lillehammer", "Nagano"]),
  ]),
  cat("AROUND THE SPORTS WORLD", [
    c("spd40", "Sumo wrestling is the national sport of which country?", ["Japan", "China", "South Korea", "Thailand", "Mongolia", "Vietnam", "India", "Philippines"]),
    c("spd41", "The Tour de France is a famous race in which sport?", ["Cycling", "Running", "Swimming", "Rowing", "Skiing", "Motor racing", "Sailing", "Triathlon"]),
    c("spd42", "The Kentucky Derby is a famous contest in which sport?", ["Horse racing", "Greyhound racing", "Rodeo", "Polo", "Dog sledding", "Car racing", "Cycling", "Rowing"]),
    c("spd43", "The Ryder Cup is a competition in which sport?", ["Golf", "Tennis", "Cricket", "Rugby", "Sailing", "Polo", "Soccer", "Cycling"]),
    c("spd44", "Rugby is named for a school in which country?", ["England", "Scotland", "Ireland", "Wales", "Australia", "New Zealand", "South Africa", "France"]),
  ]),
  cat("SPORTS BY THE NUMBERS", [
    c("spd50", "How many players does a baseball team have on the field in defense at a time?", ["Nine", "Eight", "Ten", "Eleven", "Seven", "Twelve", "Six", "Five"]),
    c("spd51", "How many holes are in a standard round of golf?", ["18", "9", "12", "24", "16", "20", "27", "36"]),
    c("spd52", "How many miles is a marathon?", ["26.2", "13.1", "10", "20", "31", "42", "15.5", "50"]),
    c("spd53", "What is a perfect score in a single game of bowling?", ["300", "200", "250", "100", "150", "400", "500", "1,000"]),
    c("spd54", "How many Grand Slam tournaments are held in professional tennis each year?", ["Four", "Three", "Five", "Six", "Two", "Seven", "Eight", "Ten"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "HOOP DETAILS",
  prompt: "What is the inside diameter of a basketball hoop?",
  choices: ["18 inches", "12 inches", "15 inches", "20 inches", "24 inches", "16 inches", "14 inches", "22 inches"],
  correctIndex: 0,
};

export const FAMILY_SPORTS_PACK: TriviaPack = {
  id: "family-sports",
  audience: "family",
  title: "Sports Night",
  tagline: "From the diamond to the rink: games for every fan",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
