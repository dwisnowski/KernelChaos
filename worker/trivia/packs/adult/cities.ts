import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("LANDMARKS", [
    c("acit00", "In which city is the Eiffel Tower?", ["Paris", "London", "Rome", "Berlin", "Madrid", "Lyon", "Brussels", "Vienna"]),
    c("acit01", "Which city is home to Big Ben?", ["London", "Edinburgh", "Dublin", "Manchester", "Liverpool", "Cardiff", "Birmingham", "Oxford"]),
    c("acit02", "In which city would you find the Colosseum?", ["Rome", "Athens", "Florence", "Naples", "Milan", "Venice", "Pompeii", "Turin"]),
    c("acit03", "Which Australian city is home to the Opera House?", ["Sydney", "Melbourne", "Brisbane", "Perth", "Canberra", "Adelaide", "Darwin", "Hobart"]),
    c("acit04", "The Taj Mahal is located in which Indian city?", ["Agra", "Delhi", "Mumbai", "Jaipur", "Kolkata", "Varanasi", "Udaipur", "Lucknow"]),
  ]),
  cat("U.S. CITIES", [
    c("acit10", "Which city is home to the Hollywood sign?", ["Los Angeles", "San Diego", "San Francisco", "Las Vegas", "Santa Barbara", "Sacramento", "Phoenix", "Portland"]),
    c("acit11", "The Golden Gate Bridge spans the entrance to which city's bay?", ["San Francisco", "Los Angeles", "San Diego", "Seattle", "Portland", "Oakland", "Sacramento", "Monterey"]),
    c("acit12", "Which city's skyline is marked by the Space Needle?", ["Seattle", "Portland", "Denver", "San Diego", "Vancouver", "Boston", "Chicago", "Dallas"]),
    c("acit13", "Which city is nicknamed 'The Windy City'?", ["Chicago", "Boston", "Seattle", "Cleveland", "Detroit", "Buffalo", "Oklahoma City", "Milwaukee"]),
    c("acit14", "Which Texas city is home to the Alamo?", ["San Antonio", "Houston", "Austin", "Dallas", "El Paso", "Fort Worth", "Galveston", "Corpus Christi"]),
  ]),
  cat("EUROPE", [
    c("acit20", "Which Italian city is famous for its canals and gondolas?", ["Venice", "Florence", "Naples", "Milan", "Verona", "Bologna", "Genoa", "Turin"]),
    c("acit21", "The Brandenburg Gate is a symbol of which city?", ["Berlin", "Munich", "Vienna", "Prague", "Hamburg", "Warsaw", "Budapest", "Dresden"]),
    c("acit22", "Gaudi's Sagrada Familia is in which city?", ["Barcelona", "Madrid", "Seville", "Valencia", "Lisbon", "Granada", "Bilbao", "Toledo"]),
    c("acit23", "The Acropolis and the Parthenon overlook which city?", ["Athens", "Rome", "Istanbul", "Thessaloniki", "Cairo", "Delphi", "Sparta", "Nicosia"]),
    c("acit24", "Which city is the capital of Portugal?", ["Lisbon", "Porto", "Madrid", "Faro", "Coimbra", "Seville", "Valencia", "Braga"]),
  ]),
  cat("ASIA & PACIFIC", [
    c("acit30", "The Forbidden City is in which Chinese city?", ["Beijing", "Shanghai", "Hong Kong", "Xi'an", "Nanjing", "Chengdu", "Guangzhou", "Shenzhen"]),
    c("acit31", "Which city-state is home to Marina Bay Sands and Gardens by the Bay?", ["Singapore", "Bangkok", "Kuala Lumpur", "Hong Kong", "Jakarta", "Manila", "Dubai", "Hanoi"]),
    c("acit32", "Angkor Wat is a temple complex in which country?", ["Cambodia", "Thailand", "Vietnam", "Laos", "Myanmar", "Indonesia", "India", "Sri Lanka"]),
    c("acit33", "Which New Zealand city is nicknamed the 'City of Sails'?", ["Auckland", "Wellington", "Christchurch", "Hamilton", "Queenstown", "Dunedin", "Tauranga", "Napier"]),
    c("acit34", "Which Indian city is the home of Bollywood?", ["Mumbai", "Delhi", "Chennai", "Kolkata", "Bangalore", "Hyderabad", "Pune", "Jaipur"]),
  ]),
  cat("NICKNAMES", [
    c("acit40", "Which city is nicknamed 'The Big Apple'?", ["New York City", "Los Angeles", "Chicago", "Boston", "Philadelphia", "Washington, D.C.", "Atlanta", "Miami"]),
    c("acit41", "Which city goes by the nickname 'Sin City'?", ["Las Vegas", "Reno", "Atlantic City", "New Orleans", "Miami", "Los Angeles", "Phoenix", "Nashville"]),
    c("acit42", "Which city is called 'The Eternal City'?", ["Rome", "Athens", "Jerusalem", "Cairo", "Istanbul", "Florence", "Paris", "Vienna"]),
    c("acit43", "Which city is called 'The City of Light'?", ["Paris", "London", "Rome", "Berlin", "Vienna", "Prague", "Lyon", "Brussels"]),
    c("acit44", "Which city is nicknamed 'The Big Easy'?", ["New Orleans", "Memphis", "Nashville", "Savannah", "Charleston", "Mobile", "Houston", "Miami"]),
  ]),
  cat("WORLD CAPITALS", [
    c("acit50", "What is the capital of Canada?", ["Ottawa", "Toronto", "Vancouver", "Montreal", "Calgary", "Quebec City", "Edmonton", "Winnipeg"]),
    c("acit51", "What is the capital of Australia?", ["Canberra", "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Darwin", "Hobart"]),
    c("acit52", "What is the capital of Brazil?", ["Brasilia", "Rio de Janeiro", "Sao Paulo", "Salvador", "Recife", "Manaus", "Curitiba", "Fortaleza"]),
    c("acit53", "What is the capital of Turkey?", ["Ankara", "Istanbul", "Izmir", "Bursa", "Antalya", "Konya", "Adana", "Gaziantep"]),
    c("acit54", "What is the capital of Switzerland?", ["Bern", "Zurich", "Geneva", "Basel", "Lausanne", "Lucerne", "Lugano", "St. Gallen"]),
  ]),
];

const DOUBLE = [
  cat("NATURAL WONDERS", [
    c("acit60", "The Grand Canyon is located in which U.S. state?", ["Arizona", "Colorado", "Utah", "Nevada", "New Mexico", "California", "Wyoming", "Texas"]),
    c("acit61", "Niagara Falls lies on the border of New York and which Canadian province?", ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba", "Nova Scotia", "Saskatchewan", "New Brunswick"]),
    c("acit62", "The Great Barrier Reef lies off the coast of which Australian state?", ["Queensland", "New South Wales", "Western Australia", "Victoria", "Tasmania", "Northern Territory", "South Australia", "Australian Capital Territory"]),
    c("acit63", "Mount Kilimanjaro, Africa's tallest peak, is in which country?", ["Tanzania", "Kenya", "Uganda", "Ethiopia", "South Africa", "Rwanda", "Zambia", "Namibia"]),
    c("acit64", "Most of Yellowstone National Park lies in which state?", ["Wyoming", "Montana", "Idaho", "Colorado", "Utah", "South Dakota", "Nevada", "Oregon"]),
  ]),
  cat("SUPERLATIVES", [
    c("acit70", "The Burj Khalifa, the world's tallest building, stands in which city?", ["Dubai", "Abu Dhabi", "Doha", "Riyadh", "Kuwait City", "Manama", "Muscat", "Istanbul"]),
    c("acit71", "What is the world's smallest country by area?", ["Vatican City", "Monaco", "San Marino", "Liechtenstein", "Malta", "Nauru", "Andorra", "Tuvalu"]),
    c("acit72", "Which country is the largest by land area?", ["Russia", "Canada", "China", "United States", "Brazil", "Australia", "India", "Kazakhstan"]),
    c("acit73", "Which is the world's largest hot desert?", ["Sahara", "Gobi", "Kalahari", "Arabian", "Mojave", "Sonoran", "Thar", "Atacama"]),
    c("acit74", "Which mountain is the highest above sea level?", ["Mount Everest", "K2", "Kangchenjunga", "Denali", "Kilimanjaro", "Mont Blanc", "Aconcagua", "Lhotse"]),
  ]),
  cat("ISLANDS & BEACHES", [
    c("acit80", "What is the largest island in the Hawaiian chain?", ["Hawaii (the Big Island)", "Maui", "Oahu", "Kauai", "Molokai", "Lanai", "Niihau", "Kahoolawe"]),
    c("acit81", "Bora Bora is part of which island territory?", ["French Polynesia", "Fiji", "Maldives", "Seychelles", "Bahamas", "Cook Islands", "Samoa", "Tonga"]),
    c("acit82", "Havana is the capital of which island nation?", ["Cuba", "Jamaica", "Haiti", "Bahamas", "Dominican Republic", "Barbados", "Trinidad and Tobago", "Puerto Rico"]),
    c("acit83", "Santorini, famous for white buildings and blue domes, belongs to which country?", ["Greece", "Italy", "Spain", "Turkey", "Croatia", "Malta", "Cyprus", "Portugal"]),
    c("acit84", "Palermo is the capital of which Italian island?", ["Sicily", "Sardinia", "Capri", "Elba", "Ischia", "Lampedusa", "Corsica", "Malta"]),
  ]),
  cat("TRAVEL & TRANSIT", [
    c("acit90", "What is the airport code for Los Angeles International?", ["LAX", "LAS", "LGA", "LAN", "LSA", "LOS", "LXA", "LAL"]),
    c("acit91", "JFK Airport is located in which New York City borough?", ["Queens", "Brooklyn", "Manhattan", "The Bronx", "Staten Island", "Long Island", "Newark", "Yonkers"]),
    c("acit92", "The London Underground is nicknamed what?", ["The Tube", "The Metro", "The Subway", "The Loop", "The El", "The Chunnel", "The Tram", "The Rail"]),
    c("acit93", "What is the nickname of the tunnel linking England and France?", ["The Chunnel", "The Tube", "The Mersey", "The Holland", "The Lincoln", "The Gotthard", "The Seikan", "The Simplon"]),
    c("acit94", "Which U.S. city's rapid transit system is called the 'L'?", ["Chicago", "Boston", "New York", "Philadelphia", "Atlanta", "Washington, D.C.", "San Francisco", "Portland"]),
  ]),
  cat("FAMOUS STREETS", [
    c("acit100", "Which New York street is synonymous with theater?", ["Broadway", "Wall Street", "Fifth Avenue", "Madison Avenue", "Lexington Avenue", "Park Avenue", "Bleecker Street", "Canal Street"]),
    c("acit101", "Which Beverly Hills street is famed for luxury shopping?", ["Rodeo Drive", "Sunset Boulevard", "Melrose Avenue", "Hollywood Boulevard", "Wilshire Boulevard", "Santa Monica Boulevard", "Ventura Boulevard", "Mulholland Drive"]),
    c("acit102", "Bourbon Street is in which city's French Quarter?", ["New Orleans", "Memphis", "Nashville", "Louisville", "Austin", "Savannah", "Charleston", "St. Louis"]),
    c("acit103", "The British Prime Minister lives at No. 10 on which street?", ["Downing Street", "Baker Street", "Whitehall", "Fleet Street", "Pall Mall", "Abbey Road", "Oxford Street", "The Mall"]),
    c("acit104", "Which Tokyo district is famous for electronics and anime shops?", ["Akihabara", "Shibuya", "Shinjuku", "Ginza", "Harajuku", "Roppongi", "Asakusa", "Ueno"]),
  ]),
  cat("OVERSEAS ICONS", [
    c("acit110", "Which city is home to the Leaning Tower of Pisa?", ["Pisa", "Florence", "Rome", "Siena", "Bologna", "Verona", "Genoa", "Naples"]),
    c("acit111", "Petra, the 'Rose City' carved in rock, is in which country?", ["Jordan", "Egypt", "Israel", "Lebanon", "Syria", "Saudi Arabia", "Oman", "Turkey"]),
    c("acit112", "Machu Picchu overlooks which country's Sacred Valley region?", ["Peru", "Bolivia", "Ecuador", "Colombia", "Chile", "Argentina", "Mexico", "Brazil"]),
    c("acit113", "Which city's canals, bikes, and Anne Frank House draw crowds?", ["Amsterdam", "Copenhagen", "Brussels", "Stockholm", "Bruges", "Hamburg", "Rotterdam", "Oslo"]),
    c("acit114", "Table Mountain towers over which South African city?", ["Cape Town", "Johannesburg", "Durban", "Pretoria", "Port Elizabeth", "Bloemfontein", "Soweto", "Stellenbosch"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "CARNIVAL CITIES",
  prompt: "Which Brazilian city is known for its huge Carnival and the Christ the Redeemer statue?",
  choices: ["Rio de Janeiro", "Sao Paulo", "Salvador", "Brasilia", "Recife", "Manaus", "Curitiba", "Fortaleza"],
  correctIndex: 0,
};

export const ADULT_CITIES_PACK: TriviaPack = {
  id: "adult-cities",
  audience: "adult",
  title: "Cities & Travel",
  tagline: "Skylines, nicknames, and passport-stamp trivia",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
