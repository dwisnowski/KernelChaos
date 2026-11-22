import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("SANTA & ELVES", [
    c("ssan0", "Where does Santa Claus live in the stories?", ["North Pole", "South Pole", "Hawaii", "Desert", "Moon", "Jungle", "Mountaintop in Peru", "Underwater"]),
    c("ssan1", "What does Santa say when he laughs?", ["Ho ho ho", "Hee hee hee", "Ha ha ha", "Boo hoo", "Ta-da", "Yippee", "Tee hee", "Hurray"]),
    c("ssan2", "How does Santa get into houses in the stories?", ["Down the chimney", "Through the window", "With a key", "By knocking", "Through the garage", "Via parachute", "By tunnel", "By ladder"]),
    c("ssan3", "What do many kids leave out for Santa?", ["Cookies and milk", "Pizza and soda", "Salad and water", "Soup and bread", "Ice cream", "Candy and juice", "Cake and tea", "Fruit and cereal"]),
    c("ssan4", "Santa keeps a list of who is naughty and who is:", ["Nice", "Loud", "Quiet", "Sleepy", "Tall", "Funny", "Clean", "Fast"]),
  ]),
  cat("REINDEER", [
    c("srei0", "Which reindeer has a glowing red nose?", ["Rudolph", "Dasher", "Dancer", "Comet", "Cupid", "Blitzen", "Vixen", "Prancer"]),
    c("srei1", "Santa's sleigh is pulled through the sky by:", ["Reindeer", "Horses", "Dogs", "Elephants", "Camels", "Goats", "Eagles", "Polar bears"]),
    c("srei2", "How many reindeer pull the sleigh before Rudolph joins (in the song)?", ["Eight", "Six", "Four", "Ten", "Twelve", "Nine", "Two", "Seven"]),
    c("srei3", "Which of these is one of Santa's original reindeer?", ["Dasher", "Sparky", "Twinkle", "Frosty", "Jingle", "Snowy", "Tinsel", "Holly"]),
    c("srei4", "Reindeer are also called what in North America?", ["Caribou", "Moose", "Elk", "Bison", "Antelope", "Yak", "Gazelle", "Llama"]),
  ]),
  cat("DECORATIONS", [
    c("sdec0", "What do we put lights and ornaments on at Christmas?", ["A Christmas tree", "A mailbox", "A bicycle", "A lawn mower", "A pumpkin", "A cactus", "A boat", "A bookshelf"]),
    c("sdec1", "What goes on the very top of many Christmas trees?", ["A star or angel", "A pumpkin", "A hat", "A fish", "A balloon", "A shoe", "A kite", "A teapot"]),
    c("sdec2", "A circle of evergreen branches hung on a door is a:", ["Wreath", "Banner", "Poster", "Curtain", "Kite", "Crown", "Pillow", "Hoop"]),
    c("sdec3", "Shiny, shimmery strands used to decorate a tree are called:", ["Tinsel", "Yarn", "Ribbon only", "Spaghetti", "Wire", "Cobwebs", "Rope", "Floss"]),
    c("sdec4", "Which red-leaved plant is a popular Christmas flower?", ["Poinsettia", "Daisy", "Tulip", "Sunflower", "Rose", "Daffodil", "Lily", "Violet"]),
  ]),
  cat("CHRISTMAS FOOD", [
    c("sfoo0", "Which striped candy is shaped like a hook?", ["Candy cane", "Lollipop", "Gumdrop", "Jelly bean", "Caramel", "Licorice", "Peppermint stick", "Chocolate bar"]),
    c("sfoo1", "What do we decorate and sometimes build houses from at Christmas?", ["Gingerbread", "Cornbread", "Sourdough", "Rye bread", "Pancakes", "Waffles", "Crackers", "Donuts"]),
    c("sfoo2", "Which holiday drink is creamy and made with eggs?", ["Eggnog", "Lemonade", "Orange juice", "Root beer", "Iced tea", "Cola", "Apple juice", "Milkshake"]),
    c("sfoo3", "Hot chocolate is often topped with:", ["Marshmallows", "Pickles", "Lettuce", "Croutons", "Olives", "Onions", "Peas", "Pepper"]),
    c("sfoo4", "In England, a traditional Christmas dessert is plum:", ["Pudding", "Soup", "Salad", "Juice", "Bread", "Pizza", "Sandwich", "Stew"]),
  ]),
  cat("CAROLS & MOVIES", [
    c("scar0", "Complete the song: Jingle bells, jingle bells, jingle all the:", ["Way", "Day", "Hay", "Play", "Say", "Bay", "Sway", "May"]),
    c("scar1", "Frosty the Snowman came to life because of a magic:", ["Hat", "Scarf", "Carrot", "Coat", "Broom", "Button", "Pipe", "Boot"]),
    c("scar2", "Which green character tries to steal Christmas?", ["The Grinch", "Shrek", "Kermit", "Oscar the Grouch", "Hulk", "Yoda", "Grover", "Mike Wazowski"]),
    c("scar3", "In Home Alone, which boy is left at home by accident?", ["Kevin", "Peter", "Charlie", "Max", "Harry", "Leo", "Tommy", "Oliver"]),
    c("scar4", "The Nutcracker is a famous Christmas:", ["Ballet", "Cartoon", "Board game", "Cookbook", "Race", "Parade", "Sport", "Puzzle"]),
  ]),
  cat("AROUND THE WORLD", [
    c("sar0", "On which date is Christmas Day?", ["December 25", "December 1", "January 1", "November 25", "December 31", "December 15", "February 25", "October 25"]),
    c("sar1", "In Australia, Christmas happens in which season?", ["Summer", "Winter", "Spring", "Fall", "Monsoon", "Dry season", "Snow season", "Autumn"]),
    c("sar2", "Which country started the tradition of the Christmas tree?", ["Germany", "Brazil", "Egypt", "Japan", "Australia", "India", "Canada", "Mexico"]),
    c("sar3", "In Mexico, kids break a candy-filled:", ["Piñata", "Pumpkin", "Drum", "Balloon", "Mirror", "Plate", "Kite", "Clock"]),
    c("sar4", "In the Netherlands, the gift-giver Sinterklaas arrives by:", ["Steamboat", "Hot air balloon", "Airplane", "Rocket", "Train only", "Camel", "Helicopter", "Submarine"]),
  ]),
];

const DOUBLE = [
  cat("WINTER WEATHER", [
    c("dwin0", "What soft white stuff falls from winter clouds?", ["Snow", "Sand", "Rice", "Sugar", "Flour", "Salt", "Confetti", "Glitter"]),
    c("dwin1", "Snowflakes are made of frozen:", ["Water", "Sugar", "Salt", "Milk", "Cotton", "Paper", "Ice cream", "Glass"]),
    c("dwin2", "How many sides does a snowflake have?", ["Six", "Four", "Five", "Eight", "Three", "Ten", "Seven", "Twelve"]),
    c("dwin3", "What do you roll up to make a snowman's body?", ["Snowballs", "Dough", "Paper", "Clay", "Yarn", "Leaves", "Sand", "Mud"]),
    c("dwin4", "A long pointed ice spike hanging from a roof is an:", ["Icicle", "Ice pop", "Ice cube", "Iceberg", "Igloo", "Ice rink", "Ice cap", "Ice sheet"]),
  ]),
  cat("GIFTS & GIVING", [
    c("dgif0", "What do we wrap presents in?", ["Wrapping paper", "Tin foil only", "Leaves", "Newspaper only", "Cloth only", "Plastic bags", "Cardboard only", "Bubble wrap only"]),
    c("dgif1", "A sock hung by the fireplace and filled with small gifts is a:", ["Stocking", "Mitten", "Boot", "Scarf", "Basket", "Bucket", "Bag", "Glove"]),
    c("dgif2", "A countdown calendar with a little door for each day is an:", ["Advent calendar", "Alarm clock", "Birthday card", "Report card", "Tide chart", "Map", "Phone book", "Menu"]),
    c("dgif3", "In the song, what did my true love give me on the first day of Christmas?", ["A partridge in a pear tree", "Two turtle doves", "Three French hens", "Four calling birds", "Five gold rings", "Six geese", "Seven swans", "Eight maids"]),
    c("dgif4", "In the song, how many drummers are drumming on the twelfth day?", ["Twelve", "Ten", "Eleven", "Nine", "Eight", "Six", "Seven", "Five"]),
  ]),
  cat("HOLIDAY STORIES", [
    c("dsto0", "In Frozen, which snowman loves warm hugs?", ["Olaf", "Frosty", "Sven", "Kristoff", "Hans", "Grover", "Buddy", "Marshmallow"]),
    c("dsto1", "In The Polar Express, the magic train goes to the:", ["North Pole", "Beach", "Desert", "Moon", "Jungle", "Zoo", "Farm", "Castle"]),
    c("dsto2", "Which Dr. Seuss town is home to the Whos?", ["Whoville", "Bikini Bottom", "Duckburg", "Hogsmeade", "Springfield", "Bedrock", "Gotham", "Sesame Street"]),
    c("dsto3", "What is the Grinch's dog named?", ["Max", "Buddy", "Rex", "Spot", "Toto", "Scooby", "Pluto", "Odie"]),
    c("dsto4", "In A Christmas Carol, which grumpy man learns to be kind?", ["Ebenezer Scrooge", "Bob Cratchit", "Jacob Marley", "Mr. Fezziwig", "Tiny Tim", "Mr. Darcy", "Oliver Twist", "Fagin"]),
  ]),
  cat("WINTER HOLIDAYS", [
    c("dwho0", "Hanukkah is also called the Festival of:", ["Lights", "Kites", "Snow", "Flowers", "Colors", "Stars", "Hats", "Bells"]),
    c("dwho1", "How many nights does Hanukkah last?", ["Eight", "Five", "Seven", "Ten", "Twelve", "Three", "Six", "Four"]),
    c("dwho2", "A spinning top used in Hanukkah games is called a:", ["Dreidel", "Yo-yo", "Kazoo", "Marble", "Frisbee", "Bubble", "Piñata", "Gyro"]),
    c("dwho3", "How many nights does Kwanzaa last?", ["Seven", "Three", "Five", "Eight", "Ten", "Twelve", "Four", "Nine"]),
    c("dwho4", "The Hanukkah candleholder with nine branches is a:", ["Menorah", "Kinara", "Candelabra tree", "Lantern", "Torch", "Chandelier", "Lamp post", "Sconce"]),
  ]),
  cat("TRADITIONS", [
    c("dtra0", "What sound do sleigh bells make?", ["Jingle", "Roar", "Buzz", "Honk", "Moo", "Splash", "Thud", "Crunch"]),
    c("dtra1", "People often kiss under which plant at Christmas?", ["Mistletoe", "Cactus", "Poison ivy", "Bamboo", "Clover", "Sunflower", "Fern", "Ivy only"]),
    c("dtra2", "Which Christmas helper is a toy elf that sits on a shelf?", ["Elf on the Shelf", "Tooth Fairy", "Easter Bunny", "Leprechaun", "Gnome in the Garden", "Genie", "Pixie Pete", "Jack Frost"]),
    c("dtra3", "Where is the famous giant Christmas tree and ice rink in New York?", ["Rockefeller Center", "Central Park Zoo", "Statue of Liberty", "Brooklyn Bridge", "Empire State Building", "Times Square Mall", "Yankee Stadium", "Grand Central"]),
    c("dtra4", "In the UK and some other countries, December 26 is called:", ["Boxing Day", "Gift Day", "Snow Day", "Pudding Day", "Cracker Day", "Bell Day", "Elf Day", "Tinsel Day"]),
  ]),
  cat("CHRISTMAS MUSIC", [
    c("dmus0", "Complete the song: Rudolph the Red-Nosed:", ["Reindeer", "Rabbit", "Raven", "Rooster", "Rhino", "Robin", "Raccoon", "Rat"]),
    c("dmus1", "Which song starts: Dashing through the snow?", ["Jingle Bells", "Silent Night", "Joy to the World", "Frosty the Snowman", "Deck the Halls", "Away in a Manger", "Jolly Old St. Nicholas", "Let It Snow"]),
    c("dmus2", "Which song says Fa la la la la, la la la la?", ["Deck the Halls", "Jingle Bells", "Silent Night", "O Christmas Tree", "Frosty the Snowman", "Up on the Housetop", "Feliz Navidad", "Joy to the World"]),
    c("dmus3", "Silent Night was first sung in which country?", ["Austria", "Brazil", "Japan", "Canada", "Egypt", "Australia", "Mexico", "India"]),
    c("dmus4", "Who wrote the music for The Nutcracker ballet?", ["Tchaikovsky", "Mozart", "Beethoven", "Bach", "Elvis", "Gershwin", "Vivaldi", "Chopin"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "CHRISTMAS TRIVIA",
  prompt: "In the song, which gift comes on the fifth day of Christmas?",
  choices: ["Five gold rings", "Five calling birds", "Five French hens", "Five turtle doves", "Five partridges", "Five silver bells", "Five dancing ladies", "Five drummers drumming"],
  correctIndex: 0,
};

export const KIDS_CHRISTMAS_PACK: TriviaPack = {
  id: "kids-christmas",
  audience: "kids",
  title: "Christmas Cheer",
  tagline: "Santa, snow, songs, and holiday fun",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
