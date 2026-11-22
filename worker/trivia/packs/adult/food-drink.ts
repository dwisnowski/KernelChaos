import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("COCKTAILS", [
    c("afod00", "A classic mojito is built on which spirit?", ["Rum", "Vodka", "Gin", "Tequila", "Whiskey", "Brandy", "Mezcal", "Sake"]),
    c("afod01", "A margarita is made with which spirit?", ["Tequila", "Rum", "Vodka", "Gin", "Bourbon", "Brandy", "Pisco", "Absinthe"]),
    c("afod02", "Which spirit is traditionally used in an Old Fashioned?", ["Whiskey", "Gin", "Rum", "Vodka", "Tequila", "Brandy", "Cognac", "Absinthe"]),
    c("afod03", "A classic martini is made from gin and which fortified wine?", ["Vermouth", "Port", "Sherry", "Madeira", "Marsala", "Sake", "Champagne", "Campari"]),
    c("afod04", "An Aperol Spritz is topped with which sparkling wine?", ["Prosecco", "Champagne", "Cava", "Lambrusco", "Moscato", "Asti", "Cremant", "Sekt"]),
  ]),
  cat("FAST FOOD", [
    c("afod10", "Which chain is known for its Golden Arches?", ["McDonald's", "Burger King", "Wendy's", "KFC", "Taco Bell", "Subway", "Chick-fil-A", "Five Guys"]),
    c("afod11", "Who is the 'Colonel' behind Kentucky Fried Chicken?", ["Harland Sanders", "Ray Kroc", "Dave Thomas", "Tom Monaghan", "Sam Walton", "Wally Amos", "Walt Disney", "Howard Johnson"]),
    c("afod12", "In-N-Out Burger was founded in which state?", ["California", "Texas", "Nevada", "Arizona", "Oregon", "Florida", "Utah", "Colorado"]),
    c("afod13", "Which chain invented the Crunchwrap Supreme?", ["Taco Bell", "Chipotle", "Del Taco", "Qdoba", "Moe's", "Taco John's", "Jack in the Box", "Wendy's"]),
    c("afod14", "Which sandwich chain's longtime slogan is 'Eat Fresh'?", ["Subway", "Quiznos", "Jimmy John's", "Jersey Mike's", "Panera", "Arby's", "Firehouse Subs", "Blimpie"]),
  ]),
  cat("WORLD CUISINE", [
    c("afod20", "Paella is a classic dish from which country?", ["Spain", "Italy", "Portugal", "Mexico", "Greece", "France", "Morocco", "Argentina"]),
    c("afod21", "Pad Thai is a famous noodle dish from which country?", ["Thailand", "Vietnam", "China", "Laos", "Cambodia", "Malaysia", "Singapore", "Indonesia"]),
    c("afod22", "Which cheese is traditionally crumbled over a Greek salad?", ["Feta", "Halloumi", "Gouda", "Brie", "Cheddar", "Mozzarella", "Parmesan", "Ricotta"]),
    c("afod23", "Kimchi is a staple of which country's cuisine?", ["Korea", "Japan", "China", "Vietnam", "Thailand", "Philippines", "Mongolia", "Taiwan"]),
    c("afod24", "Haggis is the national dish of which country?", ["Scotland", "Ireland", "Wales", "England", "Norway", "Iceland", "Denmark", "Germany"]),
  ]),
  cat("BEER, WINE & SPIRITS", [
    c("afod30", "True Champagne can only come from a region of which country?", ["France", "Italy", "Spain", "Germany", "Portugal", "Austria", "Switzerland", "Belgium"]),
    c("afod31", "Guinness stout is brewed in which country?", ["Ireland", "Scotland", "England", "Wales", "Belgium", "Germany", "Netherlands", "Canada"]),
    c("afod32", "Tequila is distilled from which plant?", ["Agave", "Sugarcane", "Potatoes", "Corn", "Barley", "Grapes", "Rye", "Rice"]),
    c("afod33", "Oktoberfest is held each year in which German city?", ["Munich", "Berlin", "Hamburg", "Cologne", "Frankfurt", "Dresden", "Stuttgart", "Nuremberg"]),
    c("afod34", "Which red grape is the backbone of Spain's Rioja wines?", ["Tempranillo", "Malbec", "Syrah", "Zinfandel", "Sangiovese", "Merlot", "Pinot Noir", "Nebbiolo"]),
  ]),
  cat("CHEFS & KITCHENS", [
    c("afod40", "Which celebrity chef hosts Hell's Kitchen?", ["Gordon Ramsay", "Bobby Flay", "Guy Fieri", "Anthony Bourdain", "Jamie Oliver", "Rachael Ray", "Emeril Lagasse", "Wolfgang Puck"]),
    c("afod41", "Guy Fieri hosts which road-trip food show?", ["Diners, Drive-Ins and Dives", "Chopped", "Iron Chef", "Top Chef", "MasterChef", "The Chew", "Man v. Food", "Kitchen Nightmares"]),
    c("afod42", "Which chef made 'Bam!' his kitchen catchphrase?", ["Emeril Lagasse", "Bobby Flay", "Mario Batali", "Paula Deen", "Giada De Laurentiis", "Wolfgang Puck", "Rachael Ray", "Alton Brown"]),
    c("afod43", "Julia Child co-authored which landmark 1961 cookbook?", ["Mastering the Art of French Cooking", "Joy of Cooking", "The Silver Palate Cookbook", "Salt Fat Acid Heat", "Essentials of Italian Cooking", "Larousse Gastronomique", "Betty Crocker's Cookbook", "The Joy of Pasta"]),
    c("afod44", "Anthony Bourdain's 2000 bestseller exposed restaurant life. What is it called?", ["Kitchen Confidential", "Medium Raw", "Parts Unknown", "A Cook's Tour", "Heat", "Blood, Bones & Butter", "Yes, Chef", "No Reservations"]),
  ]),
  cat("SNACKS & CANDY", [
    c("afod50", "Which candy 'melts in your mouth, not in your hands'?", ["M&M's", "Skittles", "Reese's", "Snickers", "Twix", "Starburst", "Kit Kat", "Hershey's Kisses"]),
    c("afod51", "Chester Cheetah is the mascot for which snack?", ["Cheetos", "Doritos", "Fritos", "Lay's", "Ruffles", "Tostitos", "Funyuns", "SunChips"]),
    c("afod52", "Which company makes Oreo cookies?", ["Nabisco", "Keebler", "Pepperidge Farm", "Little Debbie", "Famous Amos", "Mrs. Fields", "Hostess", "Entenmann's"]),
    c("afod53", "Which candy's slogan is 'Taste the rainbow'?", ["Skittles", "Starburst", "M&M's", "Jolly Rancher", "Nerds", "Twizzlers", "Sour Patch Kids", "Life Savers"]),
    c("afod54", "'Gimme a break, gimme a break, break me off a piece of that ___ bar.'", ["Kit Kat", "Twix", "Snickers", "Milky Way", "Butterfinger", "Baby Ruth", "Hershey's", "3 Musketeers"]),
  ]),
];

const DOUBLE = [
  cat("BRUNCH", [
    c("afod60", "Eggs Benedict is topped with which sauce?", ["Hollandaise", "Bearnaise", "Mornay", "Bechamel", "Aioli", "Veloute", "Tartar sauce", "Mayonnaise"]),
    c("afod61", "Tony the Tiger sells which cereal?", ["Frosted Flakes", "Froot Loops", "Cheerios", "Lucky Charms", "Cap'n Crunch", "Trix", "Cocoa Puffs", "Honey Smacks"]),
    c("afod62", "A mimosa is made with Champagne and which juice?", ["Orange", "Grapefruit", "Cranberry", "Peach", "Pineapple", "Tomato", "Apple", "Lemon"]),
    c("afod63", "A Bloody Mary is based on which juice?", ["Tomato", "Cranberry", "Orange", "Pineapple", "Grapefruit", "Apple", "Clam", "Carrot"]),
    c("afod64", "Which cereal's mascot is a leprechaun named Lucky?", ["Lucky Charms", "Trix", "Froot Loops", "Cap'n Crunch", "Count Chocula", "Cocoa Puffs", "Apple Jacks", "Cinnamon Toast Crunch"]),
  ]),
  cat("DESSERTS", [
    c("afod70", "Tiramisu, the coffee-soaked layered dessert, comes from which country?", ["Italy", "France", "Spain", "Greece", "Austria", "Switzerland", "Portugal", "Turkey"]),
    c("afod71", "What forms the crackly top of a creme brulee?", ["Caramelized sugar", "Meringue", "Chocolate", "Fondant", "Nuts", "Cheese", "Gelatin", "Whipped cream"]),
    c("afod72", "Which pastry is layered with phyllo, nuts, and honey syrup?", ["Baklava", "Strudel", "Cannoli", "Eclair", "Churro", "Tarte Tatin", "Profiterole", "Beignet"]),
    c("afod73", "Key lime pie is the official pie of which state?", ["Florida", "Louisiana", "Texas", "California", "Hawaii", "Georgia", "Alabama", "Virginia"]),
    c("afod74", "Bananas Foster, flambeed in rum, was created in which city?", ["New Orleans", "Charleston", "Savannah", "Memphis", "Houston", "Miami", "Atlanta", "Nashville"]),
  ]),
  cat("COFFEE & TEA", [
    c("afod80", "Which coffee drink is traditionally espresso, steamed milk, and foam in equal parts?", ["Cappuccino", "Americano", "Macchiato", "Mocha", "Ristretto", "Cortado", "Lungo", "Affogato"]),
    c("afod81", "Starbucks opened its first store in which city?", ["Seattle", "Portland", "San Francisco", "Boston", "Chicago", "Vancouver", "Austin", "New York"]),
    c("afod82", "The Hindi word 'chai' means what?", ["Tea", "Spice", "Milk", "Sweet", "Hot", "Leaf", "Cup", "Water"]),
    c("afod83", "Matcha, the powdered green tea, is most associated with which country?", ["Japan", "China", "Korea", "India", "Vietnam", "Taiwan", "Sri Lanka", "Thailand"]),
    c("afod84", "Which country is the world's largest coffee producer?", ["Brazil", "Colombia", "Vietnam", "Ethiopia", "Indonesia", "Honduras", "Kenya", "Mexico"]),
  ]),
  cat("SIPS & STYLES", [
    c("afod90", "Prosecco is a sparkling wine from which country?", ["Italy", "France", "Spain", "Portugal", "Germany", "Austria", "Hungary", "Greece"]),
    c("afod91", "Which beer calls itself 'The King of Beers'?", ["Budweiser", "Miller", "Coors", "Heineken", "Corona", "Stella Artois", "Guinness", "Michelob"]),
    c("afod92", "A Cosmopolitan is built on which spirit?", ["Vodka", "Gin", "Rum", "Tequila", "Whiskey", "Brandy", "Cognac", "Champagne"]),
    c("afod93", "The Pilsner style of beer originated in which country?", ["Czech Republic", "Germany", "Belgium", "Austria", "Poland", "Slovakia", "Netherlands", "Denmark"]),
    c("afod94", "Chianti wine comes from which Italian region?", ["Tuscany", "Piedmont", "Veneto", "Sicily", "Lombardy", "Umbria", "Puglia", "Emilia-Romagna"]),
  ]),
  cat("RESTAURANT CHAINS", [
    c("afod100", "Which pizza chain's logo features a red roof?", ["Pizza Hut", "Domino's", "Papa John's", "Little Caesars", "Sbarro", "Round Table", "Papa Murphy's", "Marco's"]),
    c("afod101", "Which chicken chain is famously closed on Sundays?", ["Chick-fil-A", "Popeyes", "KFC", "Raising Cane's", "Zaxby's", "Wendy's", "Bojangles", "Church's"]),
    c("afod102", "Shake Shack began as a hot dog cart in which New York City park?", ["Madison Square Park", "Central Park", "Bryant Park", "Washington Square Park", "Prospect Park", "Union Square", "Battery Park", "Flushing Meadows"]),
    c("afod103", "Waffle House was founded in which state?", ["Georgia", "Alabama", "Tennessee", "Florida", "Texas", "South Carolina", "North Carolina", "Mississippi"]),
    c("afod104", "Which steakhouse chain serves the Bloomin' Onion?", ["Outback Steakhouse", "Texas Roadhouse", "Applebee's", "Chili's", "Olive Garden", "Red Lobster", "LongHorn Steakhouse", "TGI Fridays"]),
  ]),
  cat("FOOD ORIGINS", [
    c("afod110", "Caesar salad was invented in which city?", ["Tijuana", "Rome", "New York", "Los Angeles", "Athens", "Madrid", "Chicago", "Havana"]),
    c("afod111", "Traditional Genoese pesto is made with which nut?", ["Pine nuts", "Walnuts", "Almonds", "Cashews", "Pistachios", "Hazelnuts", "Peanuts", "Macadamias"]),
    c("afod112", "Nachos were invented in a border town in which country?", ["Mexico", "United States", "Spain", "Cuba", "Argentina", "Colombia", "Peru", "Chile"]),
    c("afod113", "Buffalo wings were famously created at which Buffalo bar?", ["Anchor Bar", "Hooters", "McSorley's", "Gibson's", "Blue Moon Tavern", "The Chicken Shack", "Cheers", "Dive Bar"]),
    c("afod114", "Pizza Margherita was reportedly named for which queen?", ["Margherita of Savoy", "Victoria", "Elizabeth II", "Isabella", "Marie Antoinette", "Catherine de Medici", "Maria Theresa", "Cleopatra"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "COCKTAIL HOUR",
  prompt: "A classic Negroni contains gin, sweet vermouth, and which bitter red liqueur?",
  choices: ["Campari", "Aperol", "Cynar", "Fernet-Branca", "Angostura", "Amaro Nonino", "Chartreuse", "Jagermeister"],
  correctIndex: 0,
};

export const ADULT_FOOD_DRINK_PACK: TriviaPack = {
  id: "adult-food-drink",
  audience: "adult",
  title: "Food & Drink",
  tagline: "Cocktails, chains, and cuisines worth arguing about",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
