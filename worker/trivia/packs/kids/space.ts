import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("PLANETS", [
    c("spla0", "Which planet do we live on?", ["Earth", "Mars", "Venus", "Jupiter", "Saturn", "Mercury", "Neptune", "Uranus"]),
    c("spla1", "Which planet is called the Red Planet?", ["Mars", "Venus", "Jupiter", "Mercury", "Saturn", "Neptune", "Earth", "Uranus"]),
    c("spla2", "Which planet is famous for its rings?", ["Saturn", "Mars", "Venus", "Earth", "Mercury", "The Sun", "Pluto", "Moon"]),
    c("spla3", "Which planet is the biggest in our solar system?", ["Jupiter", "Saturn", "Earth", "Neptune", "Uranus", "Mars", "Venus", "Mercury"]),
    c("spla4", "Which planet is closest to the Sun?", ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"]),
  ]),
  cat("THE SUN & MOON", [
    c("ssun0", "What is the bright star at the center of our solar system?", ["The Sun", "The Moon", "Mars", "Polaris", "Sirius", "A comet", "Venus", "Jupiter"]),
    c("ssun1", "What circles around Earth and glows at night?", ["The Moon", "The Sun", "Mars", "A comet", "A star", "Venus", "A satellite", "A balloon"]),
    c("ssun2", "How long does the Moon take to orbit Earth (about)?", ["One month", "One day", "One week", "One year", "One hour", "Ten years", "Ten days", "One minute"]),
    c("ssun3", "What do we call the Moon's changing shapes, like crescent and full?", ["Phases", "Seasons", "Tides", "Eclipses", "Orbits", "Cycles of color", "Waves", "Stages of day"]),
    c("ssun4", "When the Moon moves between the Sun and Earth, we can see a solar:", ["Eclipse", "Storm", "Rainbow", "Sunrise", "Flare", "Wind", "Cloud", "Tide"]),
  ]),
  cat("ASTRONAUTS", [
    c("sast0", "What do we call people who travel into space?", ["Astronauts", "Chefs", "Pilots only", "Sailors", "Farmers", "Doctors", "Teachers", "Drivers"]),
    c("sast1", "Which astronaut was the first person on the Moon?", ["Neil Armstrong", "Buzz Aldrin", "Yuri Gagarin", "John Glenn", "Sally Ride", "Alan Shepard", "Jim Lovell", "Michael Collins"]),
    c("sast2", "What do astronauts wear to stay safe outside a spaceship?", ["A space suit", "A raincoat", "A swimsuit", "A coat", "Pajamas", "A snowsuit", "A costume", "A backpack only"]),
    c("sast3", "In space, astronauts seem to:", ["Float", "Sink", "Shrink", "Glow", "Melt", "Freeze instantly", "Jump higher than rockets", "Turn blue"]),
    c("sast4", "Who was the first American woman in space?", ["Sally Ride", "Amelia Earhart", "Mae Jemison", "Valentina Tereshkova", "Christa McAuliffe", "Katherine Johnson", "Ellen Ochoa", "Peggy Whitson"]),
  ]),
  cat("ROCKETS & SHIPS", [
    c("sroc0", "What do we say when a rocket launches after the countdown?", ["Blast off!", "Touchdown!", "Time out!", "Bon voyage!", "Hang on!", "Strike!", "Bingo!", "Cheese!"]),
    c("sroc1", "A rocket needs a lot of what to launch?", ["Fuel", "Water balloons", "Wind", "Snow", "Sand", "Paper", "Feathers", "Glue"]),
    c("sroc2", "The International Space Station orbits:", ["Earth", "The Sun", "Mars", "The Moon", "Jupiter", "Venus", "Saturn", "Mercury"]),
    c("sroc3", "A robot that explores Mars is called a:", ["Rover", "Boat", "Train", "Rocket", "Submarine", "Bus", "Sled", "Skateboard"]),
    c("sroc4", "What is the name of NASA's Mars rover that landed in 2021?", ["Perseverance", "Opportunity", "Spirit", "Sojourner", "Curiosity", "Discovery", "Voyager", "Endeavour"]),
  ]),
  cat("STARS & SKY", [
    c("ssta0", "Stars look small because they are very:", ["Far away", "Cold", "Quiet", "Round", "Dark", "Heavy", "Old only", "Hungry"]),
    c("ssta1", "What do we call a picture made from stars, like the Big Dipper?", ["A constellation", "A galaxy", "A comet", "A planet", "A moon", "A rocket", "An orbit", "A crater"]),
    c("ssta2", "Which star is the closest to Earth?", ["The Sun", "Sirius", "Polaris", "Betelgeuse", "Alpha Centauri", "Vega", "Rigel", "Antares"]),
    c("ssta3", "A giant spinning group of stars is called a:", ["Galaxy", "Planet", "Comet", "Moon", "Asteroid", "Satellite", "Constellation", "Meteor"]),
    c("ssta4", "Our home galaxy is called the:", ["Milky Way", "Andromeda", "Whirlpool", "Sombrero", "Pinwheel", "Cartwheel", "Cigar", "Sunflower"]),
  ]),
  cat("SPACE ROCKS", [
    c("srok0", "A \"shooting star\" is really a:", ["Meteor", "Planet", "Moon", "Comet's tail", "Star", "Satellite", "Galaxy", "Rocket"]),
    c("srok1", "A space snowball with a glowing tail is a:", ["Comet", "Meteor", "Planet", "Moon", "Star", "Asteroid", "Satellite", "Galaxy"]),
    c("srok2", "Bowl-shaped holes on the Moon are called:", ["Craters", "Rings", "Valleys", "Tunnels", "Mines", "Pools", "Caves", "Waves"]),
    c("srok3", "Many rocky asteroids orbit in a belt between Mars and:", ["Jupiter", "Earth", "Venus", "Saturn", "Mercury", "Neptune", "Uranus", "The Sun"]),
    c("srok4", "Which dwarf planet was once called the ninth planet?", ["Pluto", "Ceres", "Eris", "Haumea", "Makemake", "Sedna", "Charon", "Titan"]),
  ]),
];

const DOUBLE = [
  cat("EARTH IN SPACE", [
    c("dear0", "Earth spins once about every:", ["24 hours", "1 hour", "1 week", "1 year", "10 minutes", "1 month", "100 years", "12 minutes"]),
    c("dear1", "Earth goes around the Sun once about every:", ["365 days", "30 days", "24 hours", "7 days", "100 days", "10 years", "1,000 days", "5 days"]),
    c("dear2", "Earth looks mostly blue from space because of its:", ["Oceans", "Sky only", "Mountains", "Deserts", "Forests", "Cities", "Roads", "Snow"]),
    c("dear3", "What do we call the layer of air around Earth?", ["Atmosphere", "Hydrosphere", "Core", "Crust", "Ocean", "Mantle", "Biosphere", "Cloud layer only"]),
    c("dear4", "The seasons happen because Earth is:", ["Tilted", "Square", "Flat", "Shrinking", "Closer to Mars", "Blinking", "Spinning backward", "Cold inside"]),
  ]),
  cat("GIANT PLANETS", [
    c("dgia0", "Which planet has a giant red storm?", ["Jupiter", "Mars", "Venus", "Earth", "Mercury", "Saturn", "Uranus", "Neptune"]),
    c("dgia1", "Saturn's rings are made mostly of:", ["Ice and rock", "Gold", "Paper", "Gas only", "Glass", "Water balloons", "Candy", "Fire"]),
    c("dgia2", "Which planet spins on its side like a rolling ball?", ["Uranus", "Mars", "Venus", "Earth", "Mercury", "Jupiter", "Saturn", "Neptune"]),
    c("dgia3", "Which planet is farthest from the Sun?", ["Neptune", "Uranus", "Saturn", "Jupiter", "Mars", "Earth", "Venus", "Mercury"]),
    c("dgia4", "Which planet is hottest, even hotter than Mercury?", ["Venus", "Mars", "Jupiter", "Earth", "Saturn", "Uranus", "Neptune", "Mercury"]),
  ]),
  cat("MOON MISSIONS", [
    c("dmoo0", "In what year did people first walk on the Moon?", ["1969", "1869", "1959", "1979", "1999", "1929", "2009", "1949"]),
    c("dmoo1", "What was the name of the first Moon landing mission?", ["Apollo 11", "Apollo 1", "Gemini 4", "Voyager 2", "Sputnik 1", "Apollo 13", "Mercury 7", "Challenger"]),
    c("dmoo2", "What did the astronauts leave on the Moon to show they had visited?", ["A flag", "A pizza", "A bicycle", "A tent", "A piano", "A tree", "A mailbox", "A kite"]),
    c("dmoo3", "Moon walkers have to carry air because the Moon has no:", ["Atmosphere", "Gravity at all", "Rocks", "Craters", "Light", "Dust", "Sun", "Weather forecasts"]),
    c("dmoo4", "Which astronaut said: One small step for man, one giant leap for mankind?", ["Neil Armstrong", "Buzz Aldrin", "Alan Shepard", "John Glenn", "Michael Collins", "Gene Cernan", "Pete Conrad", "Jim Lovell"]),
  ]),
  cat("SPACE TECH", [
    c("dtec0", "A big telescope that orbits Earth and takes beautiful pictures is the:", ["Hubble Space Telescope", "Eiffel Tower", "Hover Camera", "Moon Lens", "Star Camera", "Sun Scope", "Orbit Lens", "Galaxy Eye"]),
    c("dtec1", "A satellite is something that:", ["Orbits a planet", "Cooks food", "Makes rain", "Digs holes", "Paints stars", "Blows wind", "Grows plants", "Builds houses"]),
    c("dtec2", "A telescope helps us see things that are:", ["Far away", "Under the sea", "Inside our house", "Very small", "In the future", "Very close", "In books", "In dreams"]),
    c("dtec3", "Voyager 1 is a probe that has traveled:", ["Out of our solar system", "To the Sun", "Under the ocean", "To the Moon only", "In circles around Earth", "To Mars only", "To Pluto and back", "To the Moon and back"]),
    c("dtec4", "Which space telescope launched in 2021 to see far-away galaxies?", ["James Webb Space Telescope", "Hubble Space Telescope", "Voyager", "Apollo", "Skylab", "Galileo", "Sputnik", "Cassini"]),
  ]),
  cat("BIG SPACE WORDS", [
    c("dwor0", "A big explosion at the end of a star's life is a:", ["Supernova", "Sunrise", "Eclipse", "Aurora", "Meteor shower", "Galaxy", "Orbit", "Crater"]),
    c("dwor1", "A place in space where gravity is so strong that light can't escape is a:", ["Black hole", "Crater", "Comet", "Orbit", "Eclipse", "Nebula", "Asteroid", "Satellite"]),
    c("dwor2", "A giant cloud of gas and dust where stars are born is a:", ["Nebula", "Comet", "Planet", "Moon", "Orbit", "Eclipse", "Satellite", "Crater"]),
    c("dwor3", "A light-year measures:", ["Distance", "Time", "Weight", "Speed", "Temperature", "Brightness", "Mass", "Force"]),
    c("dwor4", "The force that keeps us on the ground is:", ["Gravity", "Magnetism", "Friction", "Wind", "Electricity", "Light", "Sound", "Heat"]),
  ]),
  cat("AMAZING SPACE FACTS", [
    c("dama0", "How many planets are in our solar system?", ["Eight", "Seven", "Nine", "Ten", "Six", "Five", "Twelve", "Eleven"]),
    c("dama1", "Which planet has the most famous moon named Titan?", ["Saturn", "Jupiter", "Mars", "Venus", "Earth", "Neptune", "Uranus", "Mercury"]),
    c("dama2", "Mars has two small moons. Their names are Phobos and:", ["Deimos", "Titan", "Europa", "Io", "Triton", "Charon", "Luna", "Ganymede"]),
    c("dama3", "Which planet has the tallest volcano in the solar system, Olympus Mons?", ["Mars", "Venus", "Earth", "Jupiter", "Mercury", "Saturn", "Neptune", "Uranus"]),
    c("dama4", "The Northern Lights are also called the:", ["Aurora borealis", "Solar flare", "Shooting stars", "Milky Way", "Galaxy lights", "Moon halo", "Comet tail", "Star rain"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "SPACE EXPLORERS",
  prompt: "What is the name of NASA's rover that has been exploring Mars since 2012?",
  choices: ["Curiosity", "Perseverance", "Spirit", "Opportunity", "Sojourner", "Voyager", "Discovery", "Atlantis"],
  correctIndex: 0,
};

export const KIDS_SPACE_PACK: TriviaPack = {
  id: "kids-space",
  audience: "kids",
  title: "Space Explorers",
  tagline: "Planets, rockets, stars, and moon missions",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
