import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("PRODUCE AISLE", [
    c("fos00", "What do you get when you dry grapes in the sun?", ["Raisins", "Prunes", "Dates", "Figs", "Cranberries", "Apricots", "Apples", "Mango"]),
    c("fos01", "Which vegetable is famous for making your eyes water when you slice it?", ["Onion", "Carrot", "Celery", "Cucumber", "Potato", "Lettuce", "Pepper", "Radish"]),
    c("fos02", "Botanically speaking, a tomato is a:", ["Fruit", "Vegetable", "Root", "Nut", "Grain", "Herb", "Bean", "Leaf"]),
    c("fos03", "In French, what vegetable is a \"pomme de terre\"?", ["Potato", "Apple", "Turnip", "Carrot", "Beet", "Pumpkin", "Parsnip", "Radish"]),
    c("fos04", "Which fruit wears its seeds on the outside?", ["Strawberry", "Raspberry", "Blueberry", "Cherry", "Grape", "Peach", "Banana", "Plum"]),
  ]),
  cat("BAKING BASICS", [
    c("fos10", "Which ingredient makes bread dough rise?", ["Yeast", "Salt", "Sugar", "Flour", "Butter", "Eggs", "Milk", "Oil"]),
    c("fos11", "Which ingredient is the main component of most bread?", ["Flour", "Cornstarch", "Sugar", "Butter", "Baking soda", "Yeast", "Oats", "Salt"]),
    c("fos12", "Which sugar gets its moist texture and flavor from molasses?", ["Brown sugar", "Powdered sugar", "Granulated sugar", "Sanding sugar", "Corn syrup", "Honey", "Rock sugar", "Maple sugar"]),
    c("fos13", "A roux, used to thicken sauces, is made from flour and what?", ["Butter", "Water", "Milk", "Vinegar", "Eggs", "Sugar", "Yogurt", "Cream cheese"]),
    c("fos14", "Which ingredient is whipped to make meringue?", ["Egg whites", "Heavy cream", "Butter", "Egg yolks", "Milk", "Honey", "Gelatin", "Yogurt"]),
  ]),
  cat("AROUND THE TABLE", [
    c("fos20", "Pizza was born in which country?", ["Italy", "Greece", "France", "Spain", "Germany", "United States", "Mexico", "Turkey"]),
    c("fos21", "Tacos are most closely associated with which country?", ["Mexico", "Spain", "Peru", "Cuba", "Portugal", "Argentina", "Brazil", "Chile"]),
    c("fos22", "Pad Thai is a noodle dish from which country?", ["Thailand", "Vietnam", "China", "Japan", "India", "Korea", "Malaysia", "Cambodia"]),
    c("fos23", "Paella, a rice dish with saffron, comes from which country?", ["Spain", "Italy", "Mexico", "Portugal", "Greece", "France", "Morocco", "Argentina"]),
    c("fos24", "Pierogi, stuffed dumplings, are a beloved dish in which country?", ["Poland", "Italy", "China", "Greece", "Spain", "Portugal", "Sweden", "Brazil"]),
  ]),
  cat("KITCHEN TOOLS", [
    c("fos30", "Which tool do you use to flip pancakes?", ["Spatula", "Whisk", "Ladle", "Tongs", "Peeler", "Grater", "Rolling pin", "Colander"]),
    c("fos31", "Which bowl-shaped tool with holes drains cooked pasta?", ["Colander", "Whisk", "Mixing bowl", "Spoon", "Blender", "Skillet", "Casserole dish", "Ladle"]),
    c("fos32", "Which tool is used to whip cream or beat eggs?", ["Whisk", "Spatula", "Peeler", "Rolling pin", "Masher", "Tongs", "Grater", "Zester"]),
    c("fos33", "Which pair of tools is used to crush and grind spices?", ["Mortar and pestle", "Whisk and bowl", "Spatula and pan", "Peeler and grater", "Tongs and ladle", "Sieve and spoon", "Blender and tray", "Rolling pin and board"]),
    c("fos34", "Which tool, with an adjustable blade, is used to slice vegetables into uniform, paper-thin pieces?", ["Mandoline", "Cleaver", "Peeler", "Zester", "Grater", "Paring knife", "Pizza wheel", "Melon baller"]),
  ]),
  cat("SWEET TOOTH", [
    c("fos40", "Chocolate is made from the beans of which tree?", ["Cacao", "Coffee", "Vanilla", "Carob", "Cashew", "Almond", "Cola", "Maple"]),
    c("fos41", "Cotton candy is made mostly of what?", ["Spun sugar", "Cotton", "Marshmallow", "Cornstarch", "Gelatin", "Cream", "Syrup only", "Honey"]),
    c("fos42", "Neapolitan ice cream has vanilla, chocolate, and which flavor?", ["Strawberry", "Mint", "Cookie dough", "Pistachio", "Coffee", "Butter pecan", "Rocky road", "Lemon"]),
    c("fos43", "What does the French dessert name crème brûlée mean in English?", ["Burnt cream", "Sweet milk", "Golden custard", "Cooked egg", "Cream cake", "Whipped sugar", "Frozen cream", "Toasted milk"]),
    c("fos44", "The Italian dessert panna cotta means what in English?", ["Cooked cream", "Sweet cheese", "Burnt milk", "Frozen custard", "Little cake", "Cold pudding", "Baked egg", "Whipped sugar"]),
  ]),
  cat("BREAKFAST & DRINKS", [
    c("fos50", "Oatmeal is made from which grain?", ["Oats", "Wheat", "Rice", "Corn", "Barley", "Rye", "Quinoa", "Millet"]),
    c("fos51", "Maple syrup is made from the sap of which tree?", ["Maple", "Birch", "Oak", "Pine", "Palm", "Willow", "Elm", "Cedar"]),
    c("fos52", "Which Italian coffee drink combines espresso, steamed milk, and thick foam?", ["Cappuccino", "Americano", "Ristretto", "Macchiato", "Affogato", "Doppio", "Lungo", "Cortado"]),
    c("fos53", "What does the Italian word \"latte\" mean in English?", ["Milk", "Coffee", "Foam", "Sugar", "Cup", "Morning", "Cream", "Strong"]),
    c("fos54", "Coffee was first discovered in which country, according to legend?", ["Ethiopia", "Brazil", "Colombia", "Italy", "Turkey", "Vietnam", "Yemen", "Kenya"]),
  ]),
];

const DOUBLE = [
  cat("COOKING TERMS", [
    c("fod00", "What do you call cooking food in an oven with dry heat?", ["Baking", "Boiling", "Poaching", "Steaming", "Simmering", "Frying", "Blanching", "Grilling"]),
    c("fod01", "Pasta that is cooked \"al dente\" is:", ["Firm to the bite", "Very soft", "Burnt", "Cold", "Raw", "Frozen", "Mushy", "Fried"]),
    c("fod02", "To \"julienne\" vegetables means to cut them into:", ["Thin matchstick strips", "Small cubes", "Round slices", "Thick wedges", "Spirals", "Rings", "Halves", "Mash"]),
    c("fod03", "To \"blanch\" a vegetable is to briefly boil it and then:", ["Plunge it in ice water", "Fry it", "Freeze it overnight", "Roast it", "Smoke it", "Salt it", "Mash it", "Grill it"]),
    c("fod04", "The French cooking term \"mise en place\" means:", ["Everything in its place", "Cook it slowly", "Taste as you go", "Serve it hot", "Season generously", "Little by little", "Kitchen rules", "Table setting"]),
  ]),
  cat("ITALIAN KITCHEN", [
    c("fod10", "Which cheese is on a classic Margherita pizza?", ["Mozzarella", "Cheddar", "Parmesan", "Feta", "Gouda", "Swiss", "Brie", "Provolone"]),
    c("fod11", "The pasta shape farfalle means what in Italian?", ["Butterflies", "Little worms", "Dumplings", "Quills", "Little ears", "Shells", "Wheels", "Tubes"]),
    c("fod12", "Tiramisu translates roughly to:", ["Pick me up", "Little tower", "Sweet dream", "Cream hill", "Cake of kings", "Coffee cloud", "Morning kiss", "Golden layer"]),
    c("fod13", "Which Italian city is considered the birthplace of pizza?", ["Naples", "Rome", "Milan", "Venice", "Florence", "Bologna", "Turin", "Palermo"]),
    c("fod14", "The Margherita pizza is said to be named for which queen?", ["Margherita of Savoy", "Victoria", "Isabella", "Marie Antoinette", "Elizabeth", "Catherine", "Cleopatra", "Josephine"]),
  ]),
  cat("BRAND NAMES", [
    c("fod20", "What shape is a Cheerio?", ["Ring", "Square", "Star", "Triangle", "Heart", "Oval", "Pillow", "Spiral"]),
    c("fod21", "Which cereal features Tony the Tiger?", ["Frosted Flakes", "Froot Loops", "Lucky Charms", "Cheerios", "Honey Nut Cheerios", "Cinnamon Toast Crunch", "Trix", "Cocoa Puffs"]),
    c("fod22", "Which company makes Kit Kat bars outside of the United States?", ["Nestlé", "Mars", "Cadbury", "Ferrero", "Mondelez", "Hershey", "Lindt", "Godiva"]),
    c("fod23", "Which candy's slogan is \"Taste the rainbow\"?", ["Skittles", "M&M's", "Starburst", "Jelly Belly", "Nerds", "Lifesavers", "Twizzlers", "Reese's Pieces"]),
    c("fod24", "Which soft drink was originally called \"Brad's Drink\" in 1893?", ["Pepsi", "Coca-Cola", "Dr Pepper", "Sprite", "Root beer", "RC Cola", "Mountain Dew", "7 Up"]),
  ]),
  cat("KITCHEN SCIENCE", [
    c("fod30", "At sea level, at what temperature in Fahrenheit does water boil?", ["212°F", "100°F", "180°F", "250°F", "150°F", "200°F", "230°F", "300°F"]),
    c("fod31", "What is the name for heating sugar until it melts and turns golden brown?", ["Caramelizing", "Sautéing", "Blanching", "Proofing", "Whipping", "Curdling", "Fermenting", "Zesting"]),
    c("fod32", "Baking soda mixed with vinegar fizzes because it makes which gas?", ["Carbon dioxide", "Oxygen", "Helium", "Hydrogen", "Nitrogen", "Methane", "Neon", "Steam"]),
    c("fod33", "The browning reaction that gives toasted bread and seared steak their flavor is named after which scientist?", ["Maillard", "Pasteur", "Curie", "Newton", "Darwin", "Edison", "Tesla", "Franklin"]),
    c("fod34", "Mayonnaise is an emulsion of oil and what?", ["Egg yolk", "Milk", "Water only", "Honey", "Butter", "Cream", "Flour", "Cheese"]),
  ]),
  cat("CHEFS & FOODIES", [
    c("fod40", "What is a chef's tall white hat called?", ["Toque", "Beret", "Fedora", "Beanie", "Cloche", "Bowler", "Boater", "Fez"]),
    c("fod41", "What is the highest number of stars a restaurant can earn from the Michelin Guide?", ["Three", "Five", "Four", "Seven", "Ten", "Two", "Six", "One"]),
    c("fod42", "Which American chef introduced French cooking to U.S. TV audiences with The French Chef?", ["Julia Child", "Martha Stewart", "Rachael Ray", "Paula Deen", "Ina Garten", "Betty Crocker", "Giada De Laurentiis", "Emeril Lagasse"]),
    c("fod43", "Which British chef, known as the \"Naked Chef,\" hosts cooking shows?", ["Jamie Oliver", "Gordon Ramsay", "Nigella Lawson", "Anthony Bourdain", "Gino D'Acampo", "Mary Berry", "Heston Blumenthal", "Rick Stein"]),
    c("fod44", "Which TV chef is famous for the catchphrase \"Bam!\"?", ["Emeril Lagasse", "Bobby Flay", "Guy Fieri", "Alton Brown", "Wolfgang Puck", "Mario Batali", "Rachael Ray", "Tyler Florence"]),
  ]),
  cat("SURPRISING FOOD FACTS", [
    c("fod50", "Peanuts are technically which type of plant?", ["Legume", "Tree nut", "Grain", "Berry", "Root", "Fruit tree", "Seed pod only", "Herb"]),
    c("fod51", "Botanically, a banana is a type of:", ["Berry", "Nut", "Root", "Grass", "Vegetable", "Citrus", "Seed", "Stalk"]),
    c("fod52", "Fortune cookies were popularized in which U.S. state?", ["California", "New York", "Texas", "Florida", "Hawaii", "Illinois", "Washington", "Louisiana"]),
    c("fod53", "Which food never spoils when stored properly, even after thousands of years?", ["Honey", "Milk", "Bread", "Butter", "Rice cakes", "Eggs", "Cheese", "Mayonnaise"]),
    c("fod54", "Vanilla comes from the seed pod of which type of plant?", ["Orchid", "Palm", "Grass", "Bush", "Cactus", "Fern", "Vine", "Tree"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "KITCHEN CHAMPION",
  prompt: "Hummus is made mainly from which legume?",
  choices: ["Chickpeas", "Lentils", "Black beans", "Green peas", "Peanuts", "Soybeans", "Kidney beans", "Fava beans"],
  correctIndex: 0,
};

export const FAMILY_FOOD_PACK: TriviaPack = {
  id: "family-food",
  audience: "family",
  title: "Food & Kitchen",
  tagline: "Ingredients, gadgets, and tasty trivia for hungry players",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
