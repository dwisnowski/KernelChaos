import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("ANCIENT WORLD", [
    c("ahis00", "The Great Pyramids of Giza are in which country?", ["Egypt", "Mexico", "Sudan", "Iraq", "Greece", "Peru", "Libya", "Jordan"]),
    c("ahis01", "Which empire built the Colosseum?", ["Roman", "Greek", "Ottoman", "Byzantine", "Persian", "Egyptian", "Carthaginian", "Macedonian"]),
    c("ahis02", "Which Egyptian queen allied with Julius Caesar and later Mark Antony?", ["Cleopatra", "Nefertiti", "Hatshepsut", "Ankhesenamun", "Boudicca", "Zenobia", "Dido", "Isis"]),
    c("ahis03", "King Leonidas led 300 soldiers from which Greek city-state at Thermopylae?", ["Sparta", "Athens", "Thebes", "Corinth", "Troy", "Delphi", "Argos", "Macedon"]),
    c("ahis04", "Which philosopher tutored Alexander the Great?", ["Aristotle", "Plato", "Socrates", "Pythagoras", "Homer", "Herodotus", "Euclid", "Archimedes"]),
  ]),
  cat("US PRESIDENTS", [
    c("ahis10", "Who was the first President of the United States?", ["George Washington", "John Adams", "Thomas Jefferson", "Benjamin Franklin", "James Madison", "Alexander Hamilton", "James Monroe", "Andrew Jackson"]),
    c("ahis11", "Who was president during the American Civil War?", ["Abraham Lincoln", "Ulysses S. Grant", "Andrew Johnson", "James Buchanan", "Jefferson Davis", "Andrew Jackson", "Zachary Taylor", "Millard Fillmore"]),
    c("ahis12", "Which president was elected to four terms?", ["Franklin D. Roosevelt", "Theodore Roosevelt", "Grover Cleveland", "Dwight Eisenhower", "Woodrow Wilson", "Harry Truman", "Ronald Reagan", "Thomas Jefferson"]),
    c("ahis13", "Which president resigned in 1974?", ["Richard Nixon", "Gerald Ford", "Lyndon Johnson", "Jimmy Carter", "Ronald Reagan", "Andrew Johnson", "Herbert Hoover", "John F. Kennedy"]),
    c("ahis14", "Which president completed the 1803 Louisiana Purchase?", ["Thomas Jefferson", "James Madison", "John Adams", "James Monroe", "Andrew Jackson", "George Washington", "John Quincy Adams", "Martin Van Buren"]),
  ]),
  cat("WORLD WARS", [
    c("ahis20", "In what year did World War II end?", ["1945", "1944", "1946", "1943", "1947", "1941", "1939", "1950"]),
    c("ahis21", "Which attack on December 7, 1941 brought the U.S. into WWII?", ["Pearl Harbor", "D-Day", "Midway", "Bataan", "Guadalcanal", "Iwo Jima", "Okinawa", "Wake Island"]),
    c("ahis22", "D-Day landings in 1944 took place in which region of France?", ["Normandy", "Calais", "Brittany", "Marseille", "Dunkirk", "Alsace", "Provence", "Picardy"]),
    c("ahis23", "Whose 1914 assassination in Sarajevo sparked World War I?", ["Archduke Franz Ferdinand", "Kaiser Wilhelm II", "Tsar Nicholas II", "Otto von Bismarck", "Emperor Franz Joseph", "Woodrow Wilson", "Leon Trotsky", "King George V"]),
    c("ahis24", "Which treaty formally ended World War I with Germany?", ["Treaty of Versailles", "Treaty of Tordesillas", "Treaty of Westphalia", "Treaty of Ghent", "Treaty of Paris", "Potsdam Agreement", "Yalta Agreement", "Treaty of Brest-Litovsk"]),
  ]),
  cat("MEDIEVAL & RENAISSANCE", [
    c("ahis30", "Who painted the Mona Lisa?", ["Leonardo da Vinci", "Michelangelo", "Raphael", "Botticelli", "Titian", "Donatello", "Caravaggio", "Rembrandt"]),
    c("ahis31", "William the Conqueror won which 1066 battle?", ["Battle of Hastings", "Battle of Agincourt", "Battle of Bosworth", "Battle of Crecy", "Battle of Waterloo", "Battle of Poitiers", "Battle of Falkirk", "Battle of Naseby"]),
    c("ahis32", "Which disease killed tens of millions across Europe in the 14th century?", ["Black Death", "Spanish flu", "Smallpox", "Cholera", "Typhoid", "Polio", "Scurvy", "Measles"]),
    c("ahis33", "Which explorer sailed west under the Spanish crown in 1492?", ["Christopher Columbus", "Ferdinand Magellan", "Vasco da Gama", "Hernan Cortes", "John Cabot", "Francis Drake", "James Cook", "Amerigo Vespucci"]),
    c("ahis34", "Which English king famously had six wives?", ["Henry VIII", "Henry VII", "Edward VI", "Richard III", "Charles II", "George III", "King John", "Edward I"]),
  ]),
  cat("INVENTIONS", [
    c("ahis40", "Who was granted the first U.S. patent for the telephone in 1876?", ["Alexander Graham Bell", "Thomas Edison", "Nikola Tesla", "Guglielmo Marconi", "Samuel Morse", "George Westinghouse", "Benjamin Franklin", "Orville Wright"]),
    c("ahis41", "The Wright brothers made their first powered flight near Kitty Hawk in which state?", ["North Carolina", "Ohio", "Virginia", "Florida", "South Carolina", "Kentucky", "Indiana", "Maryland"]),
    c("ahis42", "Who introduced movable-type printing to Europe in the 1440s?", ["Johannes Gutenberg", "Martin Luther", "William Caxton", "Leonardo da Vinci", "Galileo Galilei", "Copernicus", "Marco Polo", "Erasmus"]),
    c("ahis43", "Who discovered penicillin in 1928?", ["Alexander Fleming", "Louis Pasteur", "Marie Curie", "Jonas Salk", "Joseph Lister", "Edward Jenner", "Robert Koch", "Florence Nightingale"]),
    c("ahis44", "Who was the scientific director of the Los Alamos lab during the Manhattan Project?", ["J. Robert Oppenheimer", "Albert Einstein", "Enrico Fermi", "Edward Teller", "Richard Feynman", "Niels Bohr", "Leo Szilard", "Werner Heisenberg"]),
  ]),
  cat("COLD WAR", [
    c("ahis50", "In what year did the Berlin Wall fall?", ["1989", "1991", "1987", "1985", "1990", "1979", "1961", "1993"]),
    c("ahis51", "Who became the first human in space in 1961?", ["Yuri Gagarin", "Alan Shepard", "John Glenn", "Neil Armstrong", "Valentina Tereshkova", "Laika", "Gherman Titov", "Buzz Aldrin"]),
    c("ahis52", "Who was U.S. president during the 1962 Cuban Missile Crisis?", ["John F. Kennedy", "Dwight Eisenhower", "Lyndon Johnson", "Richard Nixon", "Harry Truman", "Gerald Ford", "Jimmy Carter", "Ronald Reagan"]),
    c("ahis53", "Which Soviet leader championed 'glasnost' and 'perestroika'?", ["Mikhail Gorbachev", "Nikita Khrushchev", "Joseph Stalin", "Leonid Brezhnev", "Boris Yeltsin", "Yuri Andropov", "Vladimir Lenin", "Vladimir Putin"]),
    c("ahis54", "In what year did the Soviet Union dissolve?", ["1991", "1989", "1990", "1992", "1985", "1988", "1993", "1987"]),
  ]),
];

const DOUBLE = [
  cat("FOUNDING ERA", [
    c("ahis60", "In what year was the Declaration of Independence adopted?", ["1776", "1775", "1789", "1783", "1781", "1792", "1770", "1812"]),
    c("ahis61", "Who was the principal author of the Declaration of Independence?", ["Thomas Jefferson", "John Adams", "Benjamin Franklin", "George Washington", "James Madison", "Alexander Hamilton", "John Hancock", "Patrick Henry"]),
    c("ahis62", "Which ship carried the Pilgrims to Plymouth in 1620?", ["Mayflower", "Santa Maria", "Beagle", "Endeavour", "Discovery", "Susan Constant", "Half Moon", "Golden Hind"]),
    c("ahis63", "Which 1781 battle effectively ended major fighting in the American Revolution?", ["Yorktown", "Saratoga", "Bunker Hill", "Lexington", "Trenton", "Gettysburg", "Cowpens", "Brandywine"]),
    c("ahis64", "Which constitutional amendment abolished slavery?", ["13th", "14th", "15th", "19th", "1st", "2nd", "18th", "21st"]),
  ]),
  cat("WOMEN WHO MADE HISTORY", [
    c("ahis70", "Rosa Parks refused to give up her bus seat in which Alabama city?", ["Montgomery", "Birmingham", "Selma", "Mobile", "Huntsville", "Tuscaloosa", "Atlanta", "Memphis"]),
    c("ahis71", "Marie Curie won Nobel Prizes in which two sciences?", ["Physics and Chemistry", "Chemistry and Medicine", "Physics and Medicine", "Physics and Peace", "Chemistry and Literature", "Medicine and Peace", "Math and Physics", "Chemistry and Biology"]),
    c("ahis72", "Amelia Earhart was the first woman to fly solo across which ocean?", ["Atlantic", "Pacific", "Indian", "Arctic", "Southern", "Mediterranean", "Caribbean", "Gulf"]),
    c("ahis73", "Which monarch reigned from 1837 to 1901?", ["Queen Victoria", "Elizabeth I", "Elizabeth II", "Queen Anne", "Mary I", "Catherine the Great", "Maria Theresa", "Isabella of Castile"]),
    c("ahis74", "Joan of Arc led armies on behalf of which country?", ["France", "England", "Spain", "Burgundy", "Italy", "Scotland", "Germany", "Flanders"]),
  ]),
  cat("EXPLORERS & EMPIRES", [
    c("ahis80", "Marco Polo traveled to the court of which Mongol ruler of China?", ["Kublai Khan", "Genghis Khan", "Qin Shi Huang", "Puyi", "Kangxi", "Sun Yat-sen", "Mao Zedong", "Confucius"]),
    c("ahis81", "Whose expedition completed the first voyage around the world in 1522?", ["Ferdinand Magellan", "Vasco da Gama", "Bartolomeu Dias", "Henry the Navigator", "Francis Drake", "James Cook", "Amerigo Vespucci", "Christopher Columbus"]),
    c("ahis82", "Montezuma II ruled which empire when Cortes arrived?", ["Aztec", "Inca", "Maya", "Olmec", "Toltec", "Ottoman", "Mughal", "Zapotec"]),
    c("ahis83", "Genghis Khan founded which empire?", ["Mongol Empire", "Ottoman Empire", "Mughal Empire", "Persian Empire", "Byzantine Empire", "Timurid Empire", "Qing Dynasty", "Khmer Empire"]),
    c("ahis84", "Suleiman the Magnificent ruled which empire?", ["Ottoman", "Mughal", "Persian", "Byzantine", "Roman", "Mongol", "Holy Roman", "Russian"]),
  ]),
  cat("REVOLUTIONS & LEADERS", [
    c("ahis90", "Which fortress did Parisians storm on July 14, 1789?", ["The Bastille", "The Louvre", "Versailles", "The Tuileries", "Notre-Dame", "The Sorbonne", "Montmartre", "Les Invalides"]),
    c("ahis91", "On which island did Napoleon spend his final exile?", ["Saint Helena", "Elba", "Corsica", "Malta", "Sicily", "Crete", "Capri", "Sardinia"]),
    c("ahis92", "Who led the Bolsheviks in the 1917 Russian Revolution?", ["Vladimir Lenin", "Joseph Stalin", "Leon Trotsky", "Tsar Nicholas II", "Alexander Kerensky", "Mikhail Gorbachev", "Nikita Khrushchev", "Leonid Brezhnev"]),
    c("ahis93", "Who was British Prime Minister for most of World War II?", ["Winston Churchill", "Neville Chamberlain", "Clement Attlee", "Margaret Thatcher", "Harold Macmillan", "Anthony Eden", "David Lloyd George", "Tony Blair"]),
    c("ahis94", "Which anti-apartheid leader was freed from prison in 1990?", ["Nelson Mandela", "Desmond Tutu", "Thabo Mbeki", "F. W. de Klerk", "Steve Biko", "Jacob Zuma", "Oliver Tambo", "Walter Sisulu"]),
  ]),
  cat("AMERICAN MILESTONES", [
    c("ahis100", "In what year did Apollo 11 land humans on the Moon?", ["1969", "1971", "1967", "1965", "1972", "1961", "1975", "1968"]),
    c("ahis101", "Who delivered the 'I Have a Dream' speech in 1963?", ["Martin Luther King Jr.", "Malcolm X", "John Lewis", "Frederick Douglass", "Jesse Jackson", "Booker T. Washington", "Thurgood Marshall", "Medgar Evers"]),
    c("ahis102", "In what year did the Titanic sink?", ["1912", "1915", "1909", "1920", "1905", "1898", "1914", "1923"]),
    c("ahis103", "In what year did the stock market crash that began the Great Depression?", ["1929", "1927", "1931", "1933", "1925", "1921", "1937", "1941"]),
    c("ahis104", "Which state became the 50th state of the U.S. in 1959?", ["Hawaii", "Alaska", "Arizona", "New Mexico", "Utah", "Oklahoma", "Wyoming", "Idaho"]),
  ]),
  cat("LANDMARKS & LORE", [
    c("ahis110", "The Statue of Liberty was a gift from which country?", ["France", "England", "Spain", "Italy", "Germany", "Canada", "Netherlands", "Russia"]),
    c("ahis111", "Stonehenge stands on a plain in which English county?", ["Wiltshire", "Cornwall", "Kent", "Yorkshire", "Devon", "Norfolk", "Cumbria", "Dorset"]),
    c("ahis112", "Machu Picchu was built by which civilization?", ["Inca", "Aztec", "Maya", "Olmec", "Toltec", "Nazca", "Moche", "Zapotec"]),
    c("ahis113", "Which wall did Emperor Hadrian build across northern Britain?", ["Hadrian's Wall", "The Antonine Wall", "The Great Wall", "The Berlin Wall", "Offa's Dyke", "The Wailing Wall", "The Aurelian Wall", "The Maginot Line"]),
    c("ahis114", "Which Roman emperor was reputedly fiddling when Rome burned in 64 AD?", ["Nero", "Caligula", "Augustus", "Tiberius", "Marcus Aurelius", "Trajan", "Constantine", "Claudius"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "MEDIEVAL",
  prompt: "In what year did King John seal the Magna Carta?",
  choices: ["1215", "1066", "1415", "1492", "1315", "1348", "1100", "1288"],
  correctIndex: 0,
};

export const ADULT_HISTORY_PACK: TriviaPack = {
  id: "adult-history",
  audience: "adult",
  title: "History Buff",
  tagline: "Empires, revolutions, and the dates you swore you'd remember",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
