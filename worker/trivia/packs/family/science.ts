import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("HUMAN BODY", [
    c("scs00", "Which organ pumps blood around your body?", ["Heart", "Lungs", "Liver", "Brain", "Stomach", "Kidneys", "Spleen", "Pancreas"]),
    c("scs01", "What is the largest organ of the human body?", ["Skin", "Liver", "Brain", "Heart", "Lungs", "Stomach", "Intestines", "Kidneys"]),
    c("scs02", "How many bones does an adult human body have?", ["206", "106", "150", "300", "180", "250", "400", "88"]),
    c("scs03", "What is the longest bone in the human body?", ["Femur", "Tibia", "Humerus", "Fibula", "Spine", "Radius", "Pelvis", "Skull"]),
    c("scs04", "What is the smallest bone in the human body, found in the ear?", ["Stapes", "Femur", "Patella", "Clavicle", "Coccyx", "Rib", "Radius", "Hyoid"]),
  ]),
  cat("SPACE", [
    c("scs10", "Which planet is known as the Red Planet?", ["Mars", "Venus", "Jupiter", "Mercury", "Saturn", "Neptune", "Uranus", "Pluto"]),
    c("scs11", "Which is the largest planet in our solar system?", ["Jupiter", "Saturn", "Neptune", "Uranus", "Earth", "Mars", "Venus", "Mercury"]),
    c("scs12", "Our solar system is part of which galaxy?", ["Milky Way", "Andromeda", "Triangulum", "Whirlpool", "Sombrero", "Pinwheel", "Cartwheel", "Cigar"]),
    c("scs13", "Which planet has a day that is longer than its year?", ["Venus", "Mercury", "Mars", "Jupiter", "Saturn", "Neptune", "Earth", "Uranus"]),
    c("scs14", "Which moon of Saturn has a thick atmosphere and lakes of liquid methane?", ["Titan", "Europa", "Io", "Ganymede", "Callisto", "Triton", "Enceladus", "Phobos"]),
  ]),
  cat("CHEMISTRY", [
    c("scs20", "What is the chemical formula for water?", ["H2O", "CO2", "O2", "NaCl", "H2O2", "CH4", "NH3", "HCl"]),
    c("scs21", "What is the chemical symbol for gold?", ["Au", "Ag", "Go", "Gd", "Fe", "Cu", "Pt", "Gl"]),
    c("scs22", "Which is the lightest and most abundant element in the universe?", ["Hydrogen", "Helium", "Oxygen", "Carbon", "Nitrogen", "Lithium", "Iron", "Neon"]),
    c("scs23", "On the pH scale, what is the pH of pure water?", ["7", "0", "1", "10", "14", "5", "3", "9"]),
    c("scs24", "Which metal is liquid at room temperature?", ["Mercury", "Lead", "Tin", "Zinc", "Aluminum", "Copper", "Silver", "Iron"]),
  ]),
  cat("PHYSICS", [
    c("scs30", "Which force pulls objects toward the Earth?", ["Gravity", "Magnetism", "Friction", "Static", "Inertia", "Buoyancy", "Tension", "Pressure"]),
    c("scs31", "Which scientist is famous for the laws of motion and gravity?", ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Marie Curie", "Nikola Tesla", "Stephen Hawking", "Charles Darwin", "Thomas Edison"]),
    c("scs32", "Sound cannot travel through which of these?", ["A vacuum", "Water", "Air", "Steel", "Wood", "Glass", "Rock", "Helium"]),
    c("scs33", "About how fast does light travel?", ["186,000 miles per second", "1,000 miles per hour", "186 miles per second", "1 million miles per hour", "18,600 miles per second", "340 miles per second", "93 million miles per second", "100 miles per second"]),
    c("scs34", "Which scientist developed the famous equation E = mc²?", ["Albert Einstein", "Isaac Newton", "Niels Bohr", "Max Planck", "Galileo", "Richard Feynman", "James Clerk Maxwell", "Michael Faraday"]),
  ]),
  cat("EARTH SCIENCE", [
    c("scs40", "What causes the ocean's tides?", ["The Moon's gravity", "Wind", "Earthquakes", "Ocean currents", "Sunlight only", "Sea creatures", "Volcanoes", "Rain"]),
    c("scs41", "What is molten rock called while it is still underground?", ["Magma", "Lava", "Ash", "Obsidian", "Basalt", "Pumice", "Gravel", "Crust"]),
    c("scs42", "Which type of rock forms from cooled lava or magma?", ["Igneous", "Sedimentary", "Metamorphic", "Limestone", "Fossil", "Crystal", "Clay", "Chalk"]),
    c("scs43", "The Richter scale was designed to measure the magnitude of which natural event?", ["Earthquakes", "Hurricanes", "Tornadoes", "Tsunamis", "Volcano ash", "Floods", "Blizzards", "Avalanches"]),
    c("scs44", "The Mohs scale ranks minerals by what property?", ["Hardness", "Weight", "Color", "Age", "Shininess", "Size", "Smell", "Temperature"]),
  ]),
  cat("LIFE SCIENCE", [
    c("scs50", "What process do plants use to turn sunlight into food?", ["Photosynthesis", "Respiration", "Digestion", "Fermentation", "Evaporation", "Pollination", "Germination", "Osmosis"]),
    c("scs51", "What is the basic unit of all living things?", ["Cell", "Atom", "Organ", "Molecule", "Tissue", "Gene", "Cell wall", "Nucleus"]),
    c("scs52", "Which green pigment helps plants absorb sunlight?", ["Chlorophyll", "Carotene", "Melanin", "Hemoglobin", "Keratin", "Insulin", "Collagen", "Xanthophyll"]),
    c("scs53", "Which part of the cell is nicknamed its \"powerhouse\"?", ["Mitochondria", "Nucleus", "Ribosome", "Cell wall", "Vacuole", "Chloroplast", "Cytoplasm", "Golgi body"]),
    c("scs54", "What shape is the structure of DNA?", ["Double helix", "Circle", "Single strand", "Triangle", "Cube", "Triple helix", "Figure eight", "Zigzag"]),
  ]),
];

const DOUBLE = [
  cat("INVENTORS & DISCOVERERS", [
    c("scd00", "Which inventor is credited with creating the first practical electric light bulb?", ["Thomas Edison", "Nikola Tesla", "Alexander Graham Bell", "Benjamin Franklin", "Henry Ford", "James Watt", "Samuel Morse", "George Westinghouse"]),
    c("scd01", "Which scientist discovered penicillin?", ["Alexander Fleming", "Louis Pasteur", "Jonas Salk", "Edward Jenner", "Marie Curie", "Joseph Lister", "Robert Koch", "Florence Nightingale"]),
    c("scd02", "Which American scientist developed the first successful polio vaccine?", ["Jonas Salk", "Louis Pasteur", "Albert Sabin", "Edward Jenner", "Alexander Fleming", "Anthony Fauci", "Gregor Mendel", "Joseph Lister"]),
    c("scd03", "Which scientist discovered the elements polonium and radium?", ["Marie Curie", "Rosalind Franklin", "Ada Lovelace", "Jane Goodall", "Lise Meitner", "Dorothy Hodgkin", "Barbara McClintock", "Mary Anning"]),
    c("scd04", "Which astronomer first proposed that the Earth orbits the Sun, in the 1500s?", ["Copernicus", "Ptolemy", "Aristotle", "Kepler", "Newton", "Tycho Brahe", "Hubble", "Halley"]),
  ]),
  cat("WEATHER WATCH", [
    c("scd10", "Rainbows form when sunlight passes through what?", ["Raindrops", "Clouds", "Snow", "Smoke", "Dust", "Wind", "Fog banks", "Lightning"]),
    c("scd11", "Which instrument measures air pressure?", ["Barometer", "Thermometer", "Anemometer", "Hygrometer", "Rain gauge", "Seismograph", "Compass", "Sundial"]),
    c("scd12", "Which towering cloud brings thunderstorms?", ["Cumulonimbus", "Cirrus", "Stratus", "Altocumulus", "Nimbostratus", "Cumulus humilis", "Contrail", "Mammatus"]),
    c("scd13", "What is found in the very center of a hurricane?", ["Eye", "Wall", "Core of ice", "Crown", "Spiral band", "Heart", "Funnel", "Front"]),
    c("scd14", "Which scale rates the strength of tornadoes?", ["Enhanced Fujita Scale", "Richter Scale", "Beaufort Scale", "Saffir-Simpson Scale", "Mohs Scale", "Kelvin Scale", "Scoville Scale", "Decibel Scale"]),
  ]),
  cat("TECH & CODING", [
    c("scd20", "What does the \"brain\" of a computer, the CPU, stand for?", ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Core Power Unit", "Control Panel Unit", "Central Printing Unit", "Computer Processing Utility", "Command Process Unit"]),
    c("scd21", "Binary code is made up of which two digits?", ["0 and 1", "1 and 2", "0 and 9", "1 and 10", "2 and 3", "5 and 6", "A and B", "True and False"]),
    c("scd22", "Who is often called the world's first computer programmer?", ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Charles Babbage", "Bill Gates", "Steve Jobs", "Katherine Johnson", "Tim Berners-Lee"]),
    c("scd23", "What was the early network that grew into the internet called?", ["ARPANET", "Ethernet", "Intranet", "Telnet", "WWW", "NetBios", "AOL", "Usenet"]),
    c("scd24", "What does USB stand for?", ["Universal Serial Bus", "United Standard Bridge", "Universal System Base", "Unified Serial Board", "User Storage Box", "Universal Signal Bridge", "Ultra Speed Bus", "Utility Serial Block"]),
  ]),
  cat("MATH MAGIC", [
    c("scd30", "What is pi (π) approximately equal to?", ["3.14", "2.71", "1.62", "4.13", "3.41", "6.28", "9.81", "1.41"]),
    c("scd31", "What is the square root of 144?", ["12", "14", "11", "24", "16", "13", "72", "10"]),
    c("scd32", "Which is the only even prime number?", ["2", "4", "0", "6", "8", "10", "1", "12"]),
    c("scd33", "What do the three angles of any triangle add up to, in degrees?", ["180", "90", "270", "360", "120", "45", "100", "150"]),
    c("scd34", "In the Fibonacci sequence 1, 1, 2, 3, 5, 8, what comes next?", ["13", "11", "12", "15", "10", "14", "16", "21"]),
  ]),
  cat("NATURE SCIENCE", [
    c("scd40", "Which gas do plants release during photosynthesis?", ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen", "Helium", "Methane", "Argon", "Ozone"]),
    c("scd41", "What do we call animals that eat only plants?", ["Herbivores", "Carnivores", "Omnivores", "Insectivores", "Scavengers", "Decomposers", "Predators", "Piscivores"]),
    c("scd42", "What is the process called where a caterpillar changes into a butterfly?", ["Metamorphosis", "Migration", "Hibernation", "Mutation", "Evolution", "Photosynthesis", "Adaptation", "Pollination"]),
    c("scd43", "Which scientist wrote On the Origin of Species?", ["Charles Darwin", "Gregor Mendel", "Louis Pasteur", "Carl Linnaeus", "Alfred Wallace", "Jane Goodall", "Isaac Newton", "Jacques Cousteau"]),
    c("scd44", "Mushrooms belong to which kingdom of life?", ["Fungi", "Plants", "Animals", "Bacteria", "Protists", "Algae", "Archaea", "Viruses"]),
  ]),
  cat("LAB TOOLS & METHODS", [
    c("scd50", "Which tool lets scientists see tiny things, like cells, up close?", ["Microscope", "Telescope", "Stethoscope", "Periscope", "Kaleidoscope", "Barometer", "Thermometer", "Binoculars"]),
    c("scd51", "Which tool is used to view planets and stars?", ["Telescope", "Microscope", "Periscope", "Stethoscope", "Seismograph", "Barometer", "Magnifying glass", "Spectroscope"]),
    c("scd52", "What do we call an educated guess that can be tested in an experiment?", ["Hypothesis", "Conclusion", "Theory", "Law", "Variable", "Observation", "Control", "Result"]),
    c("scd53", "Which Russian chemist created the first widely recognized periodic table?", ["Dmitri Mendeleev", "Marie Curie", "Antoine Lavoisier", "John Dalton", "Niels Bohr", "Linus Pauling", "Robert Boyle", "Joseph Priestley"]),
    c("scd54", "Litmus paper turns red when it touches what kind of substance?", ["An acid", "A base", "Pure water", "Salt", "Oil", "Sugar", "An alcohol", "A gas"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "SCIENCE SHOWDOWN",
  prompt: "What is the chemical symbol for sodium?",
  choices: ["Na", "So", "S", "Sd", "N", "Nm", "Sa", "Ss"],
  correctIndex: 0,
};

export const FAMILY_SCIENCE_PACK: TriviaPack = {
  id: "family-science",
  audience: "family",
  title: "Science Lab",
  tagline: "Bubbling beakers, planets, and brainy facts",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
