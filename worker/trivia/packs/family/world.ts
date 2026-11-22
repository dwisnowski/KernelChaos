import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("CAPITAL CITIES", [
    c("wos00", "What is the capital of Japan?", ["Tokyo", "Kyoto", "Osaka", "Hiroshima", "Nagoya", "Sapporo", "Yokohama", "Nara"]),
    c("wos01", "What is the capital of Canada?", ["Ottawa", "Toronto", "Vancouver", "Montreal", "Calgary", "Quebec City", "Winnipeg", "Halifax"]),
    c("wos02", "What is the capital of Australia?", ["Canberra", "Sydney", "Melbourne", "Perth", "Brisbane", "Adelaide", "Darwin", "Hobart"]),
    c("wos03", "What is the capital of Brazil?", ["Brasília", "Rio de Janeiro", "São Paulo", "Salvador", "Buenos Aires", "Lima", "Bogotá", "Recife"]),
    c("wos04", "What is the capital of Turkey?", ["Ankara", "Istanbul", "Izmir", "Antalya", "Bursa", "Athens", "Cairo", "Baghdad"]),
  ]),
  cat("CONTINENTS & OCEANS", [
    c("wos10", "How many continents are there on Earth?", ["Seven", "Five", "Six", "Eight", "Nine", "Four", "Ten", "Three"]),
    c("wos11", "Which is the largest ocean on Earth?", ["Pacific", "Atlantic", "Indian", "Arctic", "Southern", "Caribbean", "Mediterranean", "Baltic"]),
    c("wos12", "Which is the largest continent by land area?", ["Asia", "Africa", "North America", "Europe", "South America", "Antarctica", "Australia", "Oceania"]),
    c("wos13", "Which continent has the most countries?", ["Africa", "Asia", "Europe", "South America", "North America", "Oceania", "Antarctica", "Australia"]),
    c("wos14", "Which is the smallest of Earth's five commonly named oceans?", ["Arctic", "Southern", "Indian", "Atlantic", "Pacific", "Caribbean", "Mediterranean", "Black"]),
  ]),
  cat("FAMOUS LANDMARKS", [
    c("wos20", "In which city would you find Big Ben?", ["London", "Paris", "Dublin", "Edinburgh", "Manchester", "Berlin", "Rome", "Amsterdam"]),
    c("wos21", "In which city would you find the ancient Colosseum?", ["Rome", "Athens", "Paris", "Madrid", "Cairo", "Istanbul", "Florence", "Naples"]),
    c("wos22", "The Taj Mahal is located in which country?", ["India", "Pakistan", "Bangladesh", "Nepal", "Iran", "Turkey", "Sri Lanka", "Thailand"]),
    c("wos23", "The ancient Inca city of Machu Picchu is in which country?", ["Peru", "Mexico", "Chile", "Brazil", "Colombia", "Bolivia", "Argentina", "Ecuador"]),
    c("wos24", "The famous rose-red rock city of Petra is in which country?", ["Jordan", "Egypt", "Israel", "Saudi Arabia", "Syria", "Morocco", "Turkey", "Iraq"]),
  ]),
  cat("MOUNTAINS & RIVERS", [
    c("wos30", "What is the tallest mountain above sea level?", ["Mount Everest", "K2", "Kilimanjaro", "Mont Blanc", "Denali", "Mount Fuji", "Aconcagua", "Matterhorn"]),
    c("wos31", "Which river flows through Egypt and is often called the longest in the world?", ["Nile", "Amazon", "Mississippi", "Yangtze", "Danube", "Congo", "Ganges", "Tigris"]),
    c("wos32", "How many Great Lakes are there in North America?", ["Five", "Three", "Four", "Six", "Seven", "Eight", "Two", "Ten"]),
    c("wos33", "Which river carved the Grand Canyon?", ["Colorado River", "Mississippi River", "Rio Grande", "Columbia River", "Missouri River", "Snake River", "Hudson River", "Yukon River"]),
    c("wos34", "Which mountain range forms the traditional boundary between Europe and Asia?", ["Ural Mountains", "Alps", "Andes", "Rockies", "Himalayas", "Pyrenees", "Carpathians", "Atlas Mountains"]),
  ]),
  cat("FLAGS & LANGUAGES", [
    c("wos40", "What language is spoken in Mexico?", ["Spanish", "Portuguese", "French", "English", "Italian", "Nahuatl", "German", "Mandarin"]),
    c("wos41", "Which country's flag features a red maple leaf?", ["Canada", "Switzerland", "Austria", "Japan", "Denmark", "Peru", "Poland", "Norway"]),
    c("wos42", "What is the official language of Brazil?", ["Portuguese", "Spanish", "English", "French", "Italian", "Dutch", "German", "Latin"]),
    c("wos43", "Which language has the most native speakers in the world?", ["Mandarin Chinese", "English", "Spanish", "Hindi", "Arabic", "Russian", "Portuguese", "Bengali"]),
    c("wos44", "Which of these countries has a square national flag?", ["Switzerland", "France", "Japan", "Brazil", "Egypt", "Mexico", "Germany", "Italy"]),
  ]),
  cat("CULTURE CLUES", [
    c("wos50", "Kangaroos live wild in which country?", ["Australia", "New Zealand", "South Africa", "India", "Brazil", "Indonesia", "Argentina", "Canada"]),
    c("wos51", "Bagpipes are a famous musical symbol of which country?", ["Scotland", "Italy", "Japan", "Brazil", "Egypt", "Mexico", "Sweden", "Greece"]),
    c("wos52", "Flamenco is a passionate dance from which country?", ["Spain", "Argentina", "Italy", "Mexico", "Cuba", "Portugal", "Brazil", "Greece"]),
    c("wos53", "The haka is a traditional war dance of the Māori people of which country?", ["New Zealand", "Australia", "Fiji", "Hawaii", "Samoa", "Tonga", "Papua New Guinea", "Philippines"]),
    c("wos54", "Bollywood, the Hindi-language film industry, is based in which Indian city?", ["Mumbai", "Delhi", "Kolkata", "Chennai", "Bangalore", "Jaipur", "Hyderabad", "Pune"]),
  ]),
];

const DOUBLE = [
  cat("UNITED STATES", [
    c("wod00", "What is the capital of the United States?", ["Washington, D.C.", "New York City", "Philadelphia", "Boston", "Los Angeles", "Chicago", "Atlanta", "Baltimore"]),
    c("wod01", "Which is the largest U.S. state by area?", ["Alaska", "Texas", "California", "Montana", "Arizona", "Nevada", "Colorado", "New Mexico"]),
    c("wod02", "The Grand Canyon is located in which U.S. state?", ["Arizona", "Utah", "Nevada", "Colorado", "New Mexico", "California", "Wyoming", "Texas"]),
    c("wod03", "Which is the smallest U.S. state by area?", ["Rhode Island", "Delaware", "Connecticut", "Vermont", "New Hampshire", "Maine", "Hawaii", "New Jersey"]),
    c("wod04", "Which was the last state admitted to the United States, in 1959?", ["Hawaii", "Alaska", "Arizona", "New Mexico", "Oklahoma", "Utah", "Nevada", "Puerto Rico"]),
  ]),
  cat("COUNTRIES & ISLANDS", [
    c("wod10", "Which European country is shaped like a boot?", ["Italy", "Greece", "Spain", "Portugal", "Croatia", "Norway", "Ireland", "Austria"]),
    c("wod11", "Which is the largest island in the world that is not a continent?", ["Greenland", "Madagascar", "Borneo", "New Guinea", "Iceland", "Baffin Island", "Sumatra", "Honshu"]),
    c("wod12", "Which is the smallest country in the world?", ["Vatican City", "Monaco", "San Marino", "Liechtenstein", "Malta", "Andorra", "Luxembourg", "Nauru"]),
    c("wod13", "Which country has the largest population in the world?", ["India", "China", "United States", "Indonesia", "Pakistan", "Brazil", "Nigeria", "Russia"]),
    c("wod14", "Madagascar lies off the coast of which continent?", ["Africa", "Asia", "Australia", "South America", "Europe", "Antarctica", "North America", "Oceania"]),
  ]),
  cat("WONDERS OF THE WORLD", [
    c("wod20", "The Great Pyramid of Giza is in which country?", ["Egypt", "Mexico", "Peru", "Sudan", "Iraq", "Libya", "Greece", "Jordan"]),
    c("wod21", "The Great Wall stretches across which country?", ["China", "Japan", "Mongolia", "India", "Korea", "Russia", "Vietnam", "Thailand"]),
    c("wod22", "The Great Barrier Reef, the largest coral reef system, is off the coast of which country?", ["Australia", "Mexico", "Belize", "Indonesia", "Philippines", "Fiji", "Brazil", "Egypt"]),
    c("wod23", "The ancient Maya city of Chichén Itzá is in which country?", ["Mexico", "Peru", "Guatemala", "Honduras", "Belize", "Colombia", "Cuba", "Bolivia"]),
    c("wod24", "The huge temple complex of Angkor Wat is in which country?", ["Cambodia", "Thailand", "Vietnam", "Laos", "Myanmar", "Indonesia", "Malaysia", "India"]),
  ]),
  cat("EXTREME EARTH", [
    c("wod30", "What is the largest hot desert in the world?", ["Sahara", "Gobi", "Kalahari", "Arabian", "Mojave", "Sonoran", "Thar", "Namib"]),
    c("wod31", "Which of Earth's poles is located in Antarctica?", ["South Pole", "North Pole", "Equator", "Prime Meridian", "Tropic of Cancer", "Arctic Circle", "Tropic of Capricorn", "Date Line"]),
    c("wod32", "What is the scientific name for the Northern Lights?", ["Aurora borealis", "Aurora australis", "Solar flare", "Zodiacal light", "Northern halo", "Polar wave", "Sun dogs", "Lunar glow"]),
    c("wod33", "Which South American desert is considered one of the driest places on Earth?", ["Atacama", "Patagonian", "Sechura", "Monte", "Gran Chaco", "Sahara", "Gobi", "Kalahari"]),
    c("wod34", "Which South American country is named for the imaginary line around the middle of Earth?", ["Ecuador", "Colombia", "Peru", "Chile", "Bolivia", "Venezuela", "Uruguay", "Paraguay"]),
  ]),
  cat("SAY HELLO", [
    c("wod40", "\"Hola\" is a greeting in which language?", ["Spanish", "Italian", "French", "Portuguese", "German", "Greek", "Dutch", "Russian"]),
    c("wod41", "\"Bonjour\" is a greeting in which language?", ["French", "Spanish", "Italian", "German", "Dutch", "Portuguese", "Greek", "Swedish"]),
    c("wod42", "\"Konnichiwa\" is a greeting in which language?", ["Japanese", "Chinese", "Korean", "Thai", "Vietnamese", "Hindi", "Tagalog", "Malay"]),
    c("wod43", "\"Aloha\" is a greeting in which language?", ["Hawaiian", "Samoan", "Tahitian", "Maori", "Fijian", "Tongan", "Filipino", "Chamorro"]),
    c("wod44", "\"Shalom\" is a greeting in which language?", ["Hebrew", "Arabic", "Turkish", "Persian", "Greek", "Armenian", "Amharic", "Hindi"]),
  ]),
  cat("GETTING AROUND", [
    c("wod50", "What is the London subway system nicknamed?", ["The Tube", "The Metro", "The Rail", "The Link", "The Loop", "The Underpass", "The Train Tunnel", "The Rapid"]),
    c("wod51", "What are the traditional boats of the canals of Venice called?", ["Gondolas", "Kayaks", "Ferries", "Barges", "Junks", "Dhows", "Sampans", "Catamarans"]),
    c("wod52", "Which country is famous for its Shinkansen \"bullet trains\"?", ["Japan", "France", "Germany", "China", "Italy", "Spain", "South Korea", "Switzerland"]),
    c("wod53", "The Panama Canal connects the Pacific Ocean with which other ocean?", ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Southern Ocean", "Mediterranean Sea", "Philippine Sea", "Red Sea", "Baltic Sea"]),
    c("wod54", "The Strait of Gibraltar separates Europe from which continent?", ["Africa", "Asia", "North America", "South America", "Australia", "Antarctica", "Oceania", "Arctic"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "LOWEST POINT",
  prompt: "Which body of water has the lowest shoreline elevation on Earth's land surface, about 430 meters below sea level?",
  choices: ["Dead Sea", "Caspian Sea", "Black Sea", "Red Sea", "Aral Sea", "Lake Victoria", "Mediterranean Sea", "Baltic Sea"],
  correctIndex: 0,
};

export const FAMILY_WORLD_PACK: TriviaPack = {
  id: "family-world",
  audience: "family",
  title: "World Traveler",
  tagline: "Capitals, landmarks, and cultures from every corner of the globe",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
