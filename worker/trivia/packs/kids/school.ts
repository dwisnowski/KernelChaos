import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("MATH", [
    c("smat0", "What is 2 + 3?", ["5", "4", "6", "7", "3", "8", "2", "10"]),
    c("smat1", "What is 10 - 4?", ["6", "5", "7", "4", "8", "3", "14", "2"]),
    c("smat2", "What is 4 x 3?", ["12", "7", "10", "14", "9", "11", "15", "16"]),
    c("smat3", "What is 24 divided by 6?", ["4", "3", "6", "5", "8", "2", "18", "7"]),
    c("smat4", "What is 9 x 8?", ["72", "63", "81", "64", "56", "78", "70", "17"]),
  ]),
  cat("READING & WORDS", [
    c("srea0", "How many letters are in the English alphabet?", ["26", "24", "25", "27", "20", "30", "22", "28"]),
    c("srea1", "Which word rhymes with \"cat\"?", ["Hat", "Dog", "Cup", "Pen", "Sun", "Bed", "Pig", "Fish"]),
    c("srea2", "A word that means the opposite of \"big\" is:", ["Small", "Huge", "Large", "Tall", "Giant", "Wide", "Long", "Heavy"]),
    c("srea3", "Which sentence ends with a period?", ["A statement", "A question", "A shout of surprise", "A list", "A title", "A name", "A song", "A word"]),
    c("srea4", "A word that describes a noun, like \"red\" or \"tall\", is an:", ["Adjective", "Verb", "Noun", "Adverb", "Pronoun", "Article", "Preposition", "Conjunction"]),
  ]),
  cat("SCIENCE CLASS", [
    c("ssci0", "What do plants need to grow, besides water and soil?", ["Sunlight", "Candy", "Music", "Milk", "Plastic", "Snow", "Sand", "Salt"]),
    c("ssci1", "What is water called when it freezes?", ["Ice", "Steam", "Fog", "Rain", "Dew", "Cloud", "Frost", "Mist"]),
    c("ssci2", "Which body part pumps blood around your body?", ["Heart", "Lungs", "Stomach", "Brain", "Liver", "Kidney", "Ears", "Toes"]),
    c("ssci3", "A caterpillar changes into a butterfly in a:", ["Chrysalis", "Hive", "Burrow", "Web", "Pond", "Nest", "Cave", "Shell"]),
    c("ssci4", "What force pulls things down toward the ground?", ["Gravity", "Magnetism", "Friction", "Wind", "Electricity", "Light", "Sound", "Heat"]),
  ]),
  cat("SCHOOL SUPPLIES", [
    c("ssup0", "What do you write with that has lead (graphite) inside?", ["Pencil", "Spoon", "Ruler", "Scissors", "Eraser", "Glue", "Tape", "Crayon"]),
    c("ssup1", "What do you use to fix a pencil mistake?", ["Eraser", "Ruler", "Glue stick", "Stapler", "Scissors", "Tape", "Marker", "Paper clip"]),
    c("ssup2", "What do you use to cut paper?", ["Scissors", "Spoon", "Eraser", "Ruler", "Glue stick", "Crayon", "Stapler", "Pencil case"]),
    c("ssup3", "What do you use to draw a straight line?", ["Ruler", "Glue stick", "Paint", "Eraser", "Stapler", "Sharpener", "Calculator", "Backpack"]),
    c("ssup4", "What holds sheets of paper together with metal pins?", ["Stapler", "Glue stick", "Ruler", "Scissors", "Tape dispenser", "Paper clip", "Eraser", "Sharpener"]),
  ]),
  cat("RECESS & PE", [
    c("srec0", "What do you do on the playground slide?", ["Slide down", "Swim", "Read", "Cook", "Sleep", "Paint", "Write", "Count"]),
    c("srec1", "What do you spin around your waist for fun?", ["A hula hoop", "A jump rope", "A ball", "A kite", "A cone", "A net", "A skateboard", "A bat"]),
    c("srec2", "In which game do you tag someone and they become \"it\"?", ["Tag", "Chess", "Bingo", "Hopscotch", "Simon Says", "Marbles", "Checkers", "Dodgeball"]),
    c("srec3", "Which game uses chalk squares numbered 1 to 10 on the ground?", ["Hopscotch", "Tag", "Marbles", "Jacks", "Four square", "Dodgeball", "Kickball", "Duck, Duck, Goose"]),
    c("srec4", "In kickball, you kick a big rubber:", ["Ball", "Hat", "Block", "Bag", "Box", "Cone", "Shoe", "Cup"]),
  ]),
  cat("AROUND THE SCHOOL", [
    c("sar0", "Who teaches your class?", ["Teacher", "Pilot", "Chef", "Farmer", "Doctor", "Firefighter", "Driver", "Singer"]),
    c("sar1", "Where do you borrow books at school?", ["Library", "Gym", "Cafeteria", "Nurse's office", "Playground", "Music room", "Art room", "Hallway"]),
    c("sar2", "Where do you eat lunch at school?", ["Cafeteria", "Library", "Gym", "Playground slide", "Bus", "Nurse's office", "Music room", "Science lab"]),
    c("sar3", "Who runs the whole school?", ["The principal", "The janitor", "The bus driver", "The librarian", "The cook", "The nurse", "The crossing guard", "The coach"]),
    c("sar4", "What rings to tell you when class starts or ends?", ["A bell", "A drum", "A horn", "A whistle", "A phone", "A gong", "A clock", "A trumpet"]),
  ]),
];

const DOUBLE = [
  cat("SPELLING BEE", [
    c("dspe0", "Which is the correct spelling?", ["Friend", "Freind", "Frend", "Frind", "Fiend", "Frieend", "Freend", "Frien"]),
    c("dspe1", "Which is the correct spelling?", ["Because", "Becuse", "Becaus", "Becouse", "Becase", "Beacause", "Bekaus", "Beecause"]),
    c("dspe2", "Which is the correct spelling?", ["Beautiful", "Beutiful", "Beautifull", "Butiful", "Beautifal", "Beautyful", "Beatiful", "Beuatiful"]),
    c("dspe3", "Which is the correct spelling?", ["Necessary", "Neccessary", "Necesary", "Necessery", "Nesessary", "Neccesary", "Necessarry", "Nescessary"]),
    c("dspe4", "Which is the correct spelling?", ["Rhythm", "Rythm", "Rhythem", "Rithm", "Rhythim", "Rhytm", "Rhitm", "Rhythum"]),
  ]),
  cat("GEOGRAPHY", [
    c("dgeo0", "How many continents are there?", ["Seven", "Five", "Six", "Eight", "Four", "Nine", "Three", "Ten"]),
    c("dgeo1", "What is the biggest ocean?", ["Pacific", "Atlantic", "Indian", "Arctic", "Southern", "Red Sea", "Mediterranean", "Caribbean"]),
    c("dgeo2", "What is the capital of the United States?", ["Washington, D.C.", "New York", "Los Angeles", "Chicago", "Boston", "Philadelphia", "Miami", "Dallas"]),
    c("dgeo3", "Which continent is the largest?", ["Asia", "Africa", "Europe", "North America", "South America", "Australia", "Antarctica", "Greenland"]),
    c("dgeo4", "Which is the longest river in the United States?", ["Missouri River", "Mississippi River", "Hudson River", "Colorado River", "Rio Grande", "Ohio River", "Columbia River", "Potomac River"]),
  ]),
  cat("ART & MUSIC", [
    c("dart0", "Which three colors are the primary colors?", ["Red, yellow, blue", "Red, green, pink", "Orange, purple, green", "Black, white, gray", "Pink, brown, green", "Gold, silver, bronze", "Blue, green, purple", "Red, orange, yellow"]),
    c("dart1", "Mixing blue and yellow makes:", ["Green", "Orange", "Purple", "Brown", "Pink", "Gray", "Black", "Red"]),
    c("dart2", "Mixing red and yellow makes:", ["Orange", "Green", "Purple", "Brown", "Pink", "Gray", "Black", "Blue"]),
    c("dart3", "How many strings does a standard violin have?", ["Four", "Six", "Three", "Five", "Eight", "Two", "Seven", "Twelve"]),
    c("dart4", "Who painted the Mona Lisa?", ["Leonardo da Vinci", "Pablo Picasso", "Vincent van Gogh", "Claude Monet", "Michelangelo", "Salvador Dali", "Frida Kahlo", "Andy Warhol"]),
  ]),
  cat("HISTORY & SOCIAL STUDIES", [
    c("dhis0", "Who was the first President of the United States?", ["George Washington", "Abraham Lincoln", "Thomas Jefferson", "John Adams", "Benjamin Franklin", "Theodore Roosevelt", "James Madison", "Andrew Jackson"]),
    c("dhis1", "The United States celebrates its birthday on July:", ["Fourth", "First", "Tenth", "Twenty-fifth", "Fourteenth", "Second", "Thirty-first", "Ninth"]),
    c("dhis2", "How many stars are on the U.S. flag?", ["50", "13", "48", "52", "100", "25", "51", "45"]),
    c("dhis3", "The most famous pyramids, at Giza, are in:", ["Egypt", "Greece", "Italy", "Mexico", "China", "India", "Spain", "Peru"]),
    c("dhis4", "Which ship carried the Pilgrims to America in 1620?", ["Mayflower", "Santa Maria", "Titanic", "Nina", "Pinta", "Endeavour", "Constitution", "Black Pearl"]),
  ]),
  cat("COOL CLASSROOM FACTS", [
    c("dfac0", "How many days are in a week?", ["Seven", "Five", "Six", "Eight", "Ten", "Four", "Nine", "Three"]),
    c("dfac1", "How many months are in a year?", ["Twelve", "Ten", "Eleven", "Nine", "Thirteen", "Eight", "Seven", "Fifteen"]),
    c("dfac2", "How many minutes are in an hour?", ["Sixty", "Thirty", "Fifty", "One hundred", "Twenty", "Twelve", "Ninety", "Twenty-four"]),
    c("dfac3", "What shape has three sides?", ["Triangle", "Square", "Circle", "Rectangle", "Pentagon", "Hexagon", "Oval", "Diamond"]),
    c("dfac4", "How many sides does a hexagon have?", ["Six", "Five", "Seven", "Eight", "Four", "Ten", "Three", "Nine"]),
  ]),
  cat("SCIENCE LAB", [
    c("dlab0", "What do we call the star at the center of our solar system?", ["The Sun", "The Moon", "Mars", "Polaris", "Sirius", "Venus", "Earth", "A comet"]),
    c("dlab1", "Which state of matter is water vapor?", ["Gas", "Solid", "Liquid", "Plasma", "Powder", "Ice", "Jelly", "Foam"]),
    c("dlab2", "What do bees collect from flowers?", ["Nectar", "Water", "Sand", "Seeds", "Leaves", "Dust", "Bugs", "Bark"]),
    c("dlab3", "What do we call animals that have backbones?", ["Vertebrates", "Invertebrates", "Insects", "Arachnids", "Crustaceans", "Mollusks", "Jellies", "Worms"]),
    c("dlab4", "What is the process where plants make food from sunlight called?", ["Photosynthesis", "Evaporation", "Condensation", "Digestion", "Migration", "Erosion", "Hibernation", "Pollination"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "SMARTY PANTS",
  prompt: "What is 12 x 12?",
  choices: ["144", "124", "112", "132", "122", "154", "142", "148"],
  correctIndex: 0,
};

export const KIDS_SCHOOL_PACK: TriviaPack = {
  id: "kids-school",
  audience: "kids",
  title: "School Days",
  tagline: "Math, reading, science, and recess",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
