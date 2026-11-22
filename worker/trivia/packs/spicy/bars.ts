import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("COCKTAILS", [
    c("bar-s0-0", "A classic margarita is built on which spirit?", ["Tequila", "Vodka", "Rum", "Gin", "Whiskey", "Brandy", "Mezcal", "Absinthe"]),
    c("bar-s0-1", "A mojito is famously flavored with which herb?", ["Mint", "Basil", "Rosemary", "Thyme", "Sage", "Cilantro", "Parsley", "Dill"]),
    c("bar-s0-2", "A Moscow Mule is traditionally served in a mug made of which metal?", ["Copper", "Silver", "Gold", "Tin", "Steel", "Iron", "Brass", "Aluminum"]),
    c("bar-s0-3", "An Old Fashioned is traditionally made with which type of spirit?", ["Whiskey", "Vodka", "Gin", "Tequila", "Rum", "Brandy", "Vermouth", "Absinthe"]),
    c("bar-s0-4", "Which bitter red Italian liqueur goes into a Negroni with gin and vermouth?", ["Campari", "Aperol", "Amaretto", "Chambord", "Fernet", "Cointreau", "Limoncello", "Sambuca"]),
  ]),
  cat("BEER BASICS", [
    c("bar-s1-0", "Which beer is advertised as 'The King of Beers'?", ["Budweiser", "Coors", "Miller", "Heineken", "Corona", "Guinness", "Michelob", "Pabst"]),
    c("bar-s1-1", "Beer is brewed mainly from water, yeast, hops, and which grain?", ["Barley", "Rice", "Oats", "Rye", "Corn", "Quinoa", "Millet", "Buckwheat"]),
    c("bar-s1-2", "Guinness stout is brewed in which city?", ["Dublin", "Cork", "Belfast", "Edinburgh", "London", "Galway", "Limerick", "Glasgow"]),
    c("bar-s1-3", "Hops primarily add what to beer?", ["Bitterness", "Sweetness", "Color", "Carbonation", "Alcohol", "Foam", "Salt", "Heat"]),
    c("bar-s1-4", "The pilsner style of beer originated in which Czech city?", ["Plzeň", "Prague", "Brno", "Ostrava", "Olomouc", "Karlovy Vary", "Liberec", "Pardubice"]),
  ]),
  cat("WINE & BUBBLES", [
    c("bar-s2-0", "True Champagne must come from which country?", ["France", "Italy", "Spain", "Germany", "Portugal", "Austria", "Belgium", "Switzerland"]),
    c("bar-s2-1", "How many milliliters are in a standard wine bottle?", ["750", "500", "700", "1000", "330", "1500", "250", "600"]),
    c("bar-s2-2", "Prosecco is a sparkling wine from which country?", ["Italy", "France", "Spain", "Germany", "Portugal", "Greece", "Austria", "Hungary"]),
    c("bar-s2-3", "Cava is a sparkling wine from which country?", ["Spain", "Italy", "France", "Portugal", "Chile", "Argentina", "Greece", "Germany"]),
    c("bar-s2-4", "Which red grape is the star of French Burgundy?", ["Pinot Noir", "Cabernet Sauvignon", "Merlot", "Syrah", "Malbec", "Zinfandel", "Grenache", "Sangiovese"]),
  ]),
  cat("BAR LINGO", [
    c("bar-s3-0", "A drink served 'on the rocks' comes:", ["Over ice", "With salt on the rim", "Without ice", "In a frozen mug", "With a lime wedge", "With a cherry", "Shaken with cream", "In a shot glass"]),
    c("bar-s3-1", "'Last call' means:", ["Final chance to order before the bar closes", "The bartender is leaving", "A free round", "The bar is full", "The band is done", "The bar is out of ice", "Happy hour begins", "The kitchen is open"]),
    c("bar-s3-2", "A drink served 'neat' is:", ["Straight spirit with no ice or mixer", "Garnished with fruit", "Served in a tall glass", "Made with soda", "Poured last", "Shaken with ice", "Frozen", "Mixed with juice"]),
    c("bar-s3-3", "A 'dirty' martini includes a splash of:", ["Olive brine", "Soda water", "Tomato juice", "Pickle juice", "Cranberry juice", "Lemon juice", "Coffee liqueur", "Orange liqueur"]),
    c("bar-s3-4", "A 'well' drink is made with:", ["The bar's standard house liquor", "Top-shelf liquor", "Water only", "Fresh juice only", "Imported spirits only", "A secret recipe", "Free ingredients", "Premium mixers"]),
  ]),
  cat("FAMOUS DRINKS & PLACES", [
    c("bar-s4-0", "The Bellini cocktail was invented at Harry's Bar in which city?", ["Venice", "Rome", "Florence", "Milan", "Naples", "Paris", "Vienna", "Barcelona"]),
    c("bar-s4-1", "Raffles Hotel's Long Bar is credited with inventing which cocktail?", ["Singapore Sling", "Mai Tai", "Tom Collins", "Hurricane", "Zombie", "Painkiller", "Blue Hawaii", "Sidecar"]),
    c("bar-s4-2", "Ernest Hemingway's favorite daiquiri bar, El Floridita, is in which city?", ["Havana", "Key West", "Madrid", "Paris", "Mexico City", "Nassau", "San Juan", "Kingston"]),
    c("bar-s4-3", "Trader Vic claimed to invent which rum cocktail in 1944?", ["Mai Tai", "Piña Colada", "Zombie", "Hurricane", "Dark 'n' Stormy", "Painkiller", "Planter's Punch", "Rum Runner"]),
    c("bar-s4-4", "The Stonewall Inn, site of the 1969 riots, is in which New York neighborhood?", ["Greenwich Village", "Harlem", "Soho", "Tribeca", "Chelsea", "Brooklyn Heights", "Astoria", "Times Square"]),
  ]),
  cat("DRINKING AROUND THE WORLD", [
    c("bar-s5-0", "Oktoberfest is held annually in which German city?", ["Munich", "Berlin", "Hamburg", "Cologne", "Frankfurt", "Stuttgart", "Dresden", "Nuremberg"]),
    c("bar-s5-1", "Tequila is made from which plant?", ["Blue agave", "Cactus fruit", "Sugarcane", "Corn", "Potato", "Grapes", "Aloe vera", "Wheat"]),
    c("bar-s5-2", "Sake is brewed from fermented what?", ["Rice", "Barley", "Potatoes", "Wheat", "Corn", "Grapes", "Sweet potatoes", "Millet"]),
    c("bar-s5-3", "Ouzo, an anise-flavored spirit, is most associated with which country?", ["Greece", "Turkey", "Italy", "Spain", "Cyprus", "Bulgaria", "Lebanon", "Egypt"]),
    c("bar-s5-4", "Which two countries famously argue over the origin of pisco?", ["Peru and Chile", "Mexico and Spain", "Brazil and Argentina", "Cuba and Jamaica", "Ecuador and Colombia", "Portugal and Spain", "Bolivia and Paraguay", "Venezuela and Peru"]),
  ]),
];

const DOUBLE = [
  cat("SPIRIT SCHOOL", [
    c("bar-d0-0", "Bourbon must be made from a mash bill of at least 51% of which grain?", ["Corn", "Rye", "Barley", "Wheat", "Oats", "Rice", "Millet", "Sorghum"]),
    c("bar-d0-1", "Gin's signature flavor comes from which berry?", ["Juniper", "Cranberry", "Blueberry", "Elderberry", "Raspberry", "Blackberry", "Gooseberry", "Currant"]),
    c("bar-d0-2", "Rum is distilled from sugarcane juice or which byproduct?", ["Molasses", "Honey", "Corn syrup", "Maple syrup", "Agave nectar", "Barley malt", "Rice bran", "Cane vinegar"]),
    c("bar-d0-3", "Absinthe's nickname is the 'Green ___.'", ["Fairy", "Dragon", "Devil", "Ghost", "Monster", "Elf", "Witch", "Serpent"]),
    c("bar-d0-4", "Scotch whisky must be aged at least how long?", ["Three years", "One year", "Six months", "Five years", "Ten years", "Twelve years", "Two years", "Eight years"]),
  ]),
  cat("BEHIND THE BAR", [
    c("bar-d1-0", "A standard US shot (jigger) is how many fluid ounces?", ["1.5", "1", "2", "0.5", "2.5", "3", "0.75", "4"]),
    c("bar-d1-1", "A bartender uses a muddler to:", ["Crush herbs and fruit", "Strain ice", "Cut garnishes", "Shake drinks", "Open bottles", "Measure liquor", "Stir martinis", "Pour wine"]),
    c("bar-d1-2", "Which cocktail is traditionally made with vodka and tomato juice?", ["Bloody Mary", "Screwdriver", "Cosmopolitan", "Sea Breeze", "Bellini", "Greyhound", "Mimosa", "Paloma"]),
    c("bar-d1-3", "The spring-coiled tool that holds ice back while pouring from a shaker is a:", ["Hawthorne strainer", "Julep strainer", "Muddler", "Jigger", "Bar spoon", "Zester", "Channel knife", "Speed pourer"]),
    c("bar-d1-4", "Which drink does 'The Dude' favor in 'The Big Lebowski'?", ["White Russian", "Black Russian", "Screwdriver", "Old Fashioned", "Manhattan", "Gin and tonic", "Margarita", "Mudslide"]),
  ]),
  cat("TOASTS WORLDWIDE", [
    c("bar-d2-0", "'Prost!' is a toast in which language?", ["German", "Dutch", "Russian", "Polish", "Swedish", "Italian", "Czech", "Greek"]),
    c("bar-d2-1", "'Sláinte!' is a toast in which country?", ["Ireland", "Spain", "Germany", "Poland", "Greece", "Italy", "France", "Portugal"]),
    c("bar-d2-2", "'Kanpai!' is a toast in which country?", ["Japan", "China", "Korea", "Thailand", "Vietnam", "Mongolia", "Taiwan", "Indonesia"]),
    c("bar-d2-3", "'L'chaim!' means:", ["To life", "To love", "To friends", "To victory", "To health only", "To the bride", "To peace", "To fortune"]),
    c("bar-d2-4", "'Na zdrowie!' is a toast in which country?", ["Poland", "Czech Republic", "Russia", "Hungary", "Ukraine", "Slovakia", "Croatia", "Serbia"]),
  ]),
  cat("HANGOVERS & MYTHS", [
    c("bar-d3-0", "The phrase 'hair of the dog' refers to:", ["Drinking more alcohol the morning after", "Eating a big breakfast", "A type of cocktail garnish", "A hangover tea", "Taking a cold shower", "A beer brand", "Sleeping all day", "Drinking only water"]),
    c("bar-d3-1", "Which organ does most of the work breaking down alcohol?", ["Liver", "Kidneys", "Stomach", "Heart", "Pancreas", "Lungs", "Spleen", "Brain"]),
    c("bar-d3-2", "What is the legal blood alcohol limit for driving in most US states?", ["0.08%", "0.02%", "0.05%", "0.10%", "0.15%", "0.01%", "0.12%", "0.20%"]),
    c("bar-d3-3", "Alcohol is called a diuretic because it:", ["Makes you urinate more", "Makes you sleepy", "Speeds up your heart", "Raises blood sugar", "Lowers body temperature", "Makes you hungry", "Slows digestion", "Makes you sweat"]),
    c("bar-d3-4", "Congeners, compounds linked to worse hangovers, are most abundant in:", ["Dark liquors like bourbon", "Vodka", "Light beer", "Seltzer", "Gin", "White wine", "Clear soda mixers", "Tequila blanco"]),
  ]),
  cat("FICTIONAL DRINKERS", [
    c("bar-d4-0", "James Bond famously orders his martini how?", ["Shaken, not stirred", "Stirred, not shaken", "With a twist only", "Extra dry", "On the rocks", "With two olives", "Very dirty", "In a tumbler"]),
    c("bar-d4-1", "Homer Simpson's beer of choice is:", ["Duff", "Buzz", "Squishee", "Flaming Moe", "Slurm", "Kwik Brew", "Pawtucket Patriot", "Heisler"]),
    c("bar-d4-2", "Captain Jack Sparrow is famous for pining over the loss of his:", ["Rum", "Compass", "Hat", "Ship", "Gold", "Map", "Pistol", "Monkey"]),
    c("bar-d4-3", "In 'Anchorman,' Ron Burgundy declares his love for which drink?", ["Scotch", "Bourbon", "Vodka", "Gin", "Beer", "Tequila", "Wine", "Brandy"]),
    c("bar-d4-4", "In 'The Shining,' Jack Torrance drinks with a ghostly bartender named Lloyd at which hotel?", ["The Overlook", "The Stanley", "The Bates Motel", "The Grand Budapest", "The Plaza", "The Waldorf", "The Chelsea", "The Continental"]),
  ]),
  cat("BEER BRANDS", [
    c("bar-d5-0", "Corona is brewed in which country?", ["Mexico", "Spain", "Brazil", "Colombia", "Argentina", "Cuba", "Peru", "Chile"]),
    c("bar-d5-1", "Heineken comes from which country?", ["The Netherlands", "Belgium", "Germany", "Denmark", "Ireland", "Luxembourg", "Czech Republic", "Austria"]),
    c("bar-d5-2", "Stella Artois is brewed in which country?", ["Belgium", "France", "Germany", "Netherlands", "Switzerland", "Luxembourg", "Ireland", "Spain"]),
    c("bar-d5-3", "Coors is brewed in Golden, in which US state?", ["Colorado", "Wyoming", "Montana", "Utah", "Wisconsin", "Oregon", "Idaho", "Texas"]),
    c("bar-d5-4", "Tsingtao beer comes from which country?", ["China", "Japan", "Thailand", "Vietnam", "Korea", "Singapore", "Taiwan", "Philippines"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "BARS & BOOZE",
  prompt: "Tom Cruise stars as bartender Brian Flanagan in which 1988 film?",
  choices: ["Cocktail", "Top Gun", "Days of Thunder", "Rain Man", "Cheers and Beers", "Last Call", "The Color of Money", "Shaken Up"],
  correctIndex: 0,
};

export const SPICY_BARS_PACK: TriviaPack = {
  id: "spicy-bars",
  audience: "spicy",
  title: "Bars & Booze",
  tagline: "Cocktails, pints, toasts, and last-call knowledge",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
