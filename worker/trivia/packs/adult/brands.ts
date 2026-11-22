import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("LOGOS", [
    c("abra00", "Which brand's logo is a swoosh?", ["Nike", "Adidas", "Puma", "Reebok", "Under Armour", "Fila", "New Balance", "Asics"]),
    c("abra01", "Which brand's logo is three stripes?", ["Adidas", "Nike", "Puma", "Fila", "Umbro", "Kappa", "Lacoste", "Champion"]),
    c("abra02", "Which coffee chain's logo is a green twin-tailed mermaid?", ["Starbucks", "Dunkin'", "Tim Hortons", "Costa", "Peet's", "Caribou Coffee", "Panera", "Whole Foods"]),
    c("abra03", "Which carmaker's badge is four interlocking rings?", ["Audi", "Subaru", "Mazda", "Volkswagen", "Opel", "Peugeot", "Citroen", "Toyota"]),
    c("abra04", "Which company's logo has an arrow from A to Z in its smile?", ["Amazon", "Alibaba", "Airbnb", "Allstate", "AT&T", "Aldi", "Acer", "Adobe"]),
  ]),
  cat("SLOGANS", [
    c("abra10", "'Just Do It' is the slogan of which brand?", ["Nike", "Adidas", "Reebok", "Under Armour", "Puma", "Asics", "New Balance", "Fila"]),
    c("abra11", "'Think Different' was a famous campaign for which company?", ["Apple", "Microsoft", "IBM", "Dell", "HP", "Sony", "Intel", "Samsung"]),
    c("abra12", "'Have it your way' was a long-running slogan of which chain?", ["Burger King", "Wendy's", "McDonald's", "Subway", "Arby's", "Carl's Jr.", "Jack in the Box", "Sonic"]),
    c("abra13", "'The Ultimate Driving Machine' is the slogan of which carmaker?", ["BMW", "Mercedes-Benz", "Audi", "Lexus", "Porsche", "Jaguar", "Volvo", "Cadillac"]),
    c("abra14", "'Because you're worth it' belongs to which beauty brand?", ["L'Oreal", "Maybelline", "Revlon", "Dove", "Garnier", "Clinique", "CoverGirl", "Olay"]),
  ]),
  cat("MASCOTS", [
    c("abra20", "Which insurance company's mascot is a talking gecko?", ["GEICO", "Progressive", "State Farm", "Allstate", "Liberty Mutual", "Farmers", "Nationwide", "Aflac"]),
    c("abra21", "Which insurer's mascot is a duck that quacks its name?", ["Aflac", "GEICO", "Progressive", "Allstate", "State Farm", "Farmers", "Nationwide", "USAA"]),
    c("abra22", "Flo, the cheery white-uniformed spokesperson, sells which insurance?", ["Progressive", "GEICO", "State Farm", "Allstate", "Liberty Mutual", "Farmers", "Nationwide", "Aflac"]),
    c("abra23", "Mr. Peanut is the monocled mascot of which brand?", ["Planters", "Skippy", "Jif", "Peter Pan", "Smucker's", "Lay's", "Frito-Lay", "Blue Diamond"]),
    c("abra24", "The Michelin Man, Bibendum, is made of what?", ["Tires", "Marshmallow", "Bubble wrap", "Pillows", "Balloons", "Sponges", "Snow", "Cotton"]),
  ]),
  cat("CAMPAIGNS", [
    c("abra30", "Which burger chain asked 'Where's the beef?' in the 1980s?", ["Wendy's", "McDonald's", "Burger King", "Hardee's", "Carl's Jr.", "White Castle", "Arby's", "Jack in the Box"]),
    c("abra31", "The 'Got Milk?' ads promoted which product?", ["Milk", "Eggs", "Orange juice", "Cheese", "Butter", "Yogurt", "Cereal", "Soda"]),
    c("abra32", "Which beer ran the famous 'Whassup?' commercials?", ["Budweiser", "Miller", "Coors", "Heineken", "Corona", "Pabst", "Michelob", "Busch"]),
    c("abra33", "Which company's 'Get a Mac' ads featured Justin Long as 'Mac'?", ["Apple", "Microsoft", "Dell", "HP", "IBM", "Gateway", "Sony", "Samsung"]),
    c("abra34", "'The Most Interesting Man in the World' starred in ads for which beer?", ["Dos Equis", "Corona", "Heineken", "Modelo", "Stella Artois", "Sol", "Tecate", "Pacifico"]),
  ]),
  cat("FASHION & LUXURY", [
    c("abra40", "Which jeweler is famous for its robin's-egg blue boxes?", ["Tiffany & Co.", "Cartier", "Bulgari", "Harry Winston", "Van Cleef & Arpels", "Pandora", "Zales", "Swarovski"]),
    c("abra41", "Which fashion house uses interlocking double G's in its logo?", ["Gucci", "Givenchy", "Gap", "Guess", "Versace", "Gant", "Armani", "Guerlain"]),
    c("abra42", "Which designer is famous for shoes with red soles?", ["Christian Louboutin", "Jimmy Choo", "Manolo Blahnik", "Gucci", "Prada", "Valentino", "Steve Madden", "Salvatore Ferragamo"]),
    c("abra43", "The Birkin bag is made by which luxury house?", ["Hermes", "Chanel", "Louis Vuitton", "Gucci", "Prada", "Dior", "Fendi", "Celine"]),
    c("abra44", "Which designer's logo is a polo player on horseback?", ["Ralph Lauren", "Lacoste", "Tommy Hilfiger", "Brooks Brothers", "Hugo Boss", "Calvin Klein", "Burberry", "Izod"]),
  ]),
  cat("CAR BRANDS", [
    c("abra50", "Which Italian carmaker's emblem is a prancing horse on a yellow shield?", ["Ferrari", "Lamborghini", "Maserati", "Alfa Romeo", "Pagani", "Bugatti", "Fiat", "Lancia"]),
    c("abra51", "Which American carmaker makes the Mustang?", ["Ford", "Chevrolet", "Dodge", "Pontiac", "Chrysler", "Buick", "Jeep", "Cadillac"]),
    c("abra52", "Which carmaker uses the slogan 'Zoom-Zoom'?", ["Mazda", "Toyota", "Honda", "Nissan", "Subaru", "Kia", "Hyundai", "Mitsubishi"]),
    c("abra53", "Which company makes the electric Model 3 and Model Y?", ["Tesla", "Rivian", "Lucid", "Polestar", "Nio", "Fisker", "Ford", "Chevrolet"]),
    c("abra54", "Which Swedish carmaker introduced the three-point seatbelt in 1959?", ["Volvo", "Saab", "Koenigsegg", "Polestar", "Scania", "Skoda", "Audi", "Lotus"]),
  ]),
];

const DOUBLE = [
  cat("JINGLES", [
    c("abra60", "'I'm lovin' it' is the jingle of which chain?", ["McDonald's", "Burger King", "Wendy's", "KFC", "Taco Bell", "Subway", "Pizza Hut", "Sonic"]),
    c("abra61", "'Like a good neighbor, ___ is there.'", ["State Farm", "Allstate", "Progressive", "GEICO", "Farmers", "Nationwide", "Liberty Mutual", "USAA"]),
    c("abra62", "'Snap! Crackle! Pop!' are the elves of which cereal?", ["Rice Krispies", "Cheerios", "Corn Flakes", "Cap'n Crunch", "Frosted Flakes", "Trix", "Lucky Charms", "Special K"]),
    c("abra63", "'It's finger lickin' good' is the slogan of which chain?", ["KFC", "Popeyes", "Church's", "Wendy's", "Chick-fil-A", "Bojangles", "Zaxby's", "Boston Market"]),
    c("abra64", "'What's in your wallet?' is asked by which company?", ["Capital One", "Visa", "Mastercard", "Chase", "American Express", "Discover", "Citi", "Wells Fargo"]),
  ]),
  cat("RETAIL & TECH", [
    c("abra70", "Which retailer's logo is a red bullseye?", ["Target", "Walmart", "Costco", "Kohl's", "Macy's", "Best Buy", "Kroger", "Home Depot"]),
    c("abra71", "IKEA was founded in which country?", ["Sweden", "Norway", "Denmark", "Finland", "Germany", "Netherlands", "Switzerland", "Poland"]),
    c("abra72", "Which athletic brand is named for the Greek goddess of victory?", ["Nike", "Puma", "Adidas", "Reebok", "Asics", "Fila", "Umbro", "Kappa"]),
    c("abra73", "Which warehouse club is famous for its $1.50 hot dog and soda combo?", ["Costco", "Sam's Club", "BJ's", "Walmart", "Target", "Aldi", "Trader Joe's", "Home Depot"]),
    c("abra74", "What was Google's original project name at Stanford?", ["BackRub", "Googol", "PageRank", "Netscape", "AltaVista", "Backlink", "SearchBot", "WebCrawl"]),
  ]),
  cat("ORIGIN STORIES", [
    c("abra80", "Amazon is named after what?", ["The Amazon River", "A mythical warrior", "A Greek island", "A local tribe", "The founder's dog", "A Seattle street", "A bookstore", "A jungle cat"]),
    c("abra81", "Starbucks takes its name from a character in which novel?", ["Moby-Dick", "Treasure Island", "Dracula", "Frankenstein", "Great Expectations", "Dune", "1984", "The Odyssey"]),
    c("abra82", "What was Pepsi originally called?", ["Brad's Drink", "Cola Cola", "Pep Kola", "Dr. Pep", "Pepper Kola", "Brown's Brew", "Pep Cola", "Pepsin Pop"]),
    c("abra83", "Nike began life under which original name?", ["Blue Ribbon Sports", "Swoosh Inc.", "Winged Victory", "Athletic Edge", "Oregon Footwear", "Bowerman Shoes", "Run Wild", "Pacific Sports"]),
    c("abra84", "Which soft drink began in 1885 in Waco, Texas?", ["Dr Pepper", "Coca-Cola", "Pepsi", "7 Up", "Sprite", "RC Cola", "Fanta", "Mountain Dew"]),
  ]),
  cat("LOGO LORE", [
    c("abra90", "Which French carmaker's emblem is a lion?", ["Peugeot", "Renault", "Citroen", "Bugatti", "Alpine", "DS", "Simca", "Delahaye"]),
    c("abra91", "Which Italian supercar maker's emblem is a charging bull?", ["Lamborghini", "Ferrari", "Maserati", "Pagani", "Bugatti", "McLaren", "Aston Martin", "Alfa Romeo"]),
    c("abra92", "Which streaming service's logo is a bold red letter N?", ["Netflix", "Hulu", "Disney+", "HBO Max", "Peacock", "Paramount+", "Apple TV+", "Prime Video"]),
    c("abra93", "Which Swiss chocolate's logo hides a bear in the mountain?", ["Toblerone", "Milka", "Lindt", "Ritter Sport", "Cadbury", "Hershey's", "Ghirardelli", "Godiva"]),
    c("abra94", "Which shipping company's logo has a hidden arrow between the E and x?", ["FedEx", "UPS", "DHL", "USPS", "TNT", "Maersk", "Amazon Logistics", "Purolator"]),
  ]),
  cat("SPOKESPEOPLE", [
    c("abra100", "'Can you hear me now?' was a famous slogan for which carrier?", ["Verizon", "AT&T", "Sprint", "T-Mobile", "Cricket", "MetroPCS", "Boost Mobile", "U.S. Cellular"]),
    c("abra101", "Which battery brand has a bunny that 'keeps going and going'?", ["Energizer", "Duracell", "Eveready", "Rayovac", "Panasonic", "Sony", "GE", "Philips"]),
    c("abra102", "The Jolly Green Giant is the mascot of which brand?", ["Green Giant", "Birds Eye", "Del Monte", "Dole", "Bush's", "Libby's", "Campbell's", "Heinz"]),
    c("abra103", "Mr. Clean is a mascot of which company?", ["Procter & Gamble", "Clorox", "SC Johnson", "Unilever", "Colgate-Palmolive", "Henkel", "Reckitt", "Kimberly-Clark"]),
    c("abra104", "Which cereal's cartoon tiger says 'They're gr-r-reat!'?", ["Frosted Flakes", "Froot Loops", "Cheerios", "Lucky Charms", "Cap'n Crunch", "Trix", "Cocoa Puffs", "Honey Smacks"]),
  ]),
  cat("SODA WARS", [
    c("abra110", "Which lemon-lime soda was marketed as 'The Uncola'?", ["7 Up", "Sprite", "Fanta", "Mountain Dew", "Dr Pepper", "RC Cola", "Sierra Mist", "Mug Root Beer"]),
    c("abra111", "Which soda's slogan is 'Do the Dew'?", ["Mountain Dew", "Pepsi", "Sprite", "Fanta", "7 Up", "Dr Pepper", "Mello Yello", "Sierra Mist"]),
    c("abra112", "Which energy drink 'gives you wings'?", ["Red Bull", "Monster", "Rockstar", "Bang", "Celsius", "5-hour Energy", "Prime", "Gatorade"]),
    c("abra113", "Gatorade was invented at which university?", ["University of Florida", "University of Alabama", "University of Texas", "University of Georgia", "Ohio State", "University of Michigan", "LSU", "USC"]),
    c("abra114", "'The Choice of a New Generation' was a famous slogan for which soda?", ["Pepsi", "Coca-Cola", "Dr Pepper", "RC Cola", "Mountain Dew", "Sprite", "Fanta", "7 Up"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "SLOGANS",
  prompt: "'Impossible Is Nothing' is the slogan of which sportswear brand?",
  choices: ["Adidas", "Nike", "Puma", "Reebok", "Under Armour", "Asics", "New Balance", "Fila"],
  correctIndex: 0,
};

export const ADULT_BRANDS_PACK: TriviaPack = {
  id: "adult-brands",
  audience: "adult",
  title: "Brands & Ads",
  tagline: "Logos, slogans, and jingles you can't unhear",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
