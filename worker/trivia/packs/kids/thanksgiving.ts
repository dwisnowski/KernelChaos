import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("FOOD FEAST", [
    c("sfoo0", "Which orange pie is a Thanksgiving favorite?", ["Pumpkin pie", "Lemon pie", "Blueberry pie", "Key lime pie", "Banana cream pie", "Cherry pie", "Chocolate pie", "Coconut pie"]),
    c("sfoo1", "Which tart red sauce goes with turkey?", ["Cranberry sauce", "Ketchup", "Salsa", "Strawberry jam", "Hot sauce", "Tomato sauce", "Raspberry syrup", "Beet juice"]),
    c("sfoo2", "Bread cubes baked inside or beside the turkey are called:", ["Stuffing", "Croutons only", "Pudding", "Pancakes", "Pizza", "Toast soup", "Cereal", "Biscuits"]),
    c("sfoo3", "Which orange vegetable is often baked with marshmallows on top?", ["Sweet potato", "Carrot", "Turnip", "Beet", "Corn", "Radish", "Parsnip", "Onion"]),
    c("sfoo4", "Cranberries grow in a flooded field called a:", ["Bog", "Barn", "Orchard", "Greenhouse", "Meadow", "Pond only", "Silo", "Garden bed"]),
  ]),
  cat("TURKEY TALK", [
    c("stur0", "What sound does a turkey make?", ["Gobble", "Moo", "Quack", "Oink", "Meow", "Baa", "Neigh", "Roar"]),
    c("stur1", "A female turkey is called a:", ["Hen", "Tom", "Poult", "Duck", "Rooster", "Drake", "Gander", "Cob"]),
    c("stur2", "The floppy red skin hanging under a turkey's beak is a:", ["Wattle", "Whisker", "Dewdrop", "Gill", "Mane", "Tassel", "Cape", "Fin"]),
    c("stur3", "Baby turkeys are called:", ["Poults", "Cubs", "Pups", "Kittens", "Calves", "Foals", "Fawns", "Joeys"]),
    c("stur4", "Wild turkeys can do which surprising thing?", ["Fly short distances", "Dig tunnels", "Glide like a bat", "Live underwater", "Hang upside down", "Sleep all winter", "Change color", "Walk backward only"]),
  ]),
  cat("PILGRIMS", [
    c("spil0", "The Pilgrims sailed on a ship called the:", ["Mayflower", "Santa Maria", "Nina", "Pinta", "Titanic", "Black Pearl", "Constitution", "Endeavour"]),
    c("spil1", "The Pilgrims sailed across the:", ["Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Arctic Ocean", "Red Sea", "Gulf of Mexico", "Mediterranean Sea", "Great Lakes"]),
    c("spil2", "Which Native American people shared the first harvest feast with the Pilgrims?", ["Wampanoag", "Apache", "Navajo", "Sioux", "Cherokee", "Cheyenne", "Inuit", "Comanche"]),
    c("spil3", "Squanto showed the Pilgrims how to grow corn using what in the soil?", ["Fish", "Pebbles", "Candy", "Feathers", "Coins", "Seashells", "Cotton", "Snow"]),
    c("spil4", "The Mayflower reached America in which year?", ["1620", "1492", "1776", "1607", "1820", "1700", "1565", "1850"]),
  ]),
  cat("GRATITUDE", [
    c("sgra0", "Which two words do we say to show we are grateful?", ["Thank you", "Go away", "Hurry up", "Not yet", "Too bad", "I win", "Look out", "Good luck"]),
    c("sgra1", "A card you write to say thanks is called a:", ["Thank-you note", "Complaint", "Bill", "Riddle", "Warning", "Permission slip", "Report card", "Menu"]),
    c("sgra2", "In a gratitude jar, you put notes about things you are:", ["Thankful for", "Afraid of", "Planning to buy", "Trying to forget", "Sad about", "Planning to eat", "Hoping to lose", "Late for"]),
    c("sgra3", "Which word means almost the same as grateful?", ["Appreciative", "Anxious", "Reluctant", "Hesitant", "Careless", "Jealous", "Restless", "Doubtful"]),
    c("sgra4", "Giving food, clothes, or money to help people in need is called:", ["Charity", "Bargaining", "Saving", "Collecting", "Selling", "Swapping", "Racing", "Hiding"]),
  ]),
  cat("AUTUMN", [
    c("saut0", "Which season comes right after summer?", ["Autumn", "Winter", "Spring", "Summer again", "Dry season", "Rainy season", "Snow season", "Blossom season"]),
    c("saut1", "What do many trees do with their leaves in fall?", ["Drop them", "Eat them", "Paint them", "Sell them", "Freeze them", "Hide them", "Swallow them", "Knit them"]),
    c("saut2", "Acorns come from which kind of tree?", ["Oak", "Pine", "Palm", "Apple", "Maple", "Birch", "Willow", "Cherry"]),
    c("saut3", "Which tree gives us sap for maple syrup?", ["Sugar maple", "Oak", "Pine", "Palm", "Birch only", "Apple", "Willow", "Cherry"]),
    c("saut4", "Leaves turn orange and red when they stop making green:", ["Chlorophyll", "Sugar water", "Paint", "Oxygen", "Helium", "Vitamin C", "Honey", "Salt"]),
  ]),
  cat("PARADES & FUN", [
    c("spar0", "Who rides in the last float of the Macy's parade?", ["Santa Claus", "The Easter Bunny", "The Tooth Fairy", "A pirate", "A dragon", "A snowman", "A clown", "An astronaut"]),
    c("spar1", "Which store hosts a famous Thanksgiving Day parade in New York City?", ["Macy's", "Target", "Walmart", "Costco", "Kohl's", "Sears", "Gap", "Home Depot"]),
    c("spar2", "Giant parade balloons are filled with:", ["Helium", "Oxygen", "Water", "Sand", "Steam", "Smoke", "Pudding", "Feathers"]),
    c("spar3", "Each year the U.S. president \"pardons\" a:", ["Turkey", "Pumpkin", "Squirrel", "Pie", "Goose", "Cow", "Horse", "Pig"]),
    c("spar4", "Thanksgiving in the U.S. falls on the:", ["Fourth Thursday of November", "First Monday of November", "Third Sunday of October", "Last Friday of October", "Second Saturday of December", "First Tuesday of November", "Fourth Wednesday of November", "Last day of November"]),
  ]),
];

const DOUBLE = [
  cat("SIDE DISHES", [
    c("dsid0", "Which green veggie is baked in a casserole with crispy onions?", ["Green beans", "Spinach", "Lettuce", "Cucumbers", "Cabbage", "Celery", "Zucchini", "Asparagus"]),
    c("dsid1", "Which warm, fluffy bread do we eat with butter at dinner?", ["Dinner rolls", "Waffles", "Tacos", "Noodles", "Nachos", "Cookies", "Donuts", "Pretzels"]),
    c("dsid2", "Which yellow vegetable grows on a cob?", ["Corn", "Peas", "Carrots", "Beans", "Celery", "Onions", "Potatoes", "Lettuce"]),
    c("dsid3", "Gravy is usually made from:", ["Turkey drippings", "Chocolate", "Orange juice", "Maple syrup", "Soda", "Honey", "Peanut butter", "Lemonade"]),
    c("dsid4", "Pumpkin pie spice has cinnamon, ginger, cloves, and:", ["Nutmeg", "Pepper", "Paprika", "Basil", "Garlic", "Oregano", "Chili powder", "Dill"]),
  ]),
  cat("HARVEST FARM", [
    c("dhar0", "Farmers gather ripe crops at:", ["Harvest time", "Bedtime", "Recess", "Picnic time", "Parade time", "Birthday time", "Storm time", "Naptime"]),
    c("dhar1", "Pumpkins grow on a:", ["Vine", "Tall tree", "Cactus", "Palm", "Hedge", "Fern", "Moss", "Reed"]),
    c("dhar2", "A scarecrow is meant to scare away:", ["Birds", "Cows", "Fish", "Whales", "Snails", "Horses", "Pigs", "Sheep"]),
    c("dhar3", "A cornucopia is also called a horn of:", ["Plenty", "Thunder", "Fire", "Water", "Gold", "Music", "Silver", "Wind"]),
    c("dhar4", "Which crop grows with beans and squash in the \"Three Sisters\"?", ["Corn", "Wheat", "Rice", "Potatoes", "Oats", "Tomatoes", "Carrots", "Barley"]),
  ]),
  cat("MAYFLOWER VOYAGE", [
    c("dmay0", "The Pilgrims traveled to America by:", ["Ship", "Airplane", "Train", "Rocket", "Bicycle", "Helicopter", "Bus", "Hot air balloon"]),
    c("dmay1", "About how long did the Mayflower trip take?", ["About 2 months", "About 2 days", "About 1 week", "About 1 year", "About 5 years", "About 10 days", "About 6 hours", "About 3 weeks"]),
    c("dmay2", "The Pilgrims named their new town:", ["Plymouth", "Boston", "Jamestown", "New York", "Salem", "Philadelphia", "Roanoke", "Providence"]),
    c("dmay3", "The first Thanksgiving feast lasted about:", ["Three days", "One hour", "One month", "One year", "Ten minutes", "Two weeks", "Six hours", "Ten days"]),
    c("dmay4", "The Pilgrims' agreement on the ship was called the:", ["Mayflower Compact", "Declaration of Independence", "Bill of Rights", "Magna Carta", "Constitution", "Emancipation Proclamation", "Treaty of Paris", "Pledge of Allegiance"]),
  ]),
  cat("TRADITIONS", [
    c("dtra0", "Many families say a thankful prayer, called grace, before:", ["Eating", "Sleeping", "Running", "Swimming", "Painting", "Driving", "Dancing", "Reading"]),
    c("dtra1", "Two people pull a turkey wishbone and make a:", ["Wish", "Face", "Cake", "Phone call", "Mess", "Drawing", "Sandwich", "Bet"]),
    c("dtra2", "Which body part do kids trace to make a turkey craft?", ["Hand", "Foot", "Elbow", "Nose", "Ear", "Knee", "Head", "Shoulder"]),
    c("dtra3", "Many families watch which TV show about dogs on Thanksgiving?", ["The National Dog Show", "The Soccer World Cup", "A space launch", "A snow parade", "The Cat Olympics", "A pie contest", "A horse race", "A spelling bee"]),
    c("dtra4", "In Canada, Thanksgiving is celebrated in which month?", ["October", "November", "December", "September", "August", "January", "July", "May"]),
  ]),
  cat("FALL CRITTERS", [
    c("dcri0", "Squirrels spend fall collecting:", ["Nuts", "Shells", "Candy", "Pebbles", "Feathers", "Sand", "Buttons", "Marbles"]),
    c("dcri1", "Which birds fly south in a V shape?", ["Geese", "Penguins", "Ostriches", "Emus", "Chickens", "Kiwis", "Dodos", "Cassowaries"]),
    c("dcri2", "Bears get ready for winter by eating a lot and then:", ["Hibernating", "Migrating", "Flying south", "Building nests", "Laying eggs", "Shedding scales", "Spinning webs", "Swimming away"]),
    c("dcri3", "Chipmunks carry food in their:", ["Cheeks", "Tails", "Ears", "Paws", "Fur", "Whiskers", "Wings", "Pockets"]),
    c("dcri4", "Monarch butterflies fly all the way to which country for winter?", ["Mexico", "Canada", "Iceland", "Greenland", "Antarctica", "Siberia", "Norway", "Alaska"]),
  ]),
  cat("NOVEMBER FUN", [
    c("dnov0", "Thanksgiving in the U.S. is in which month?", ["November", "October", "December", "September", "January", "July", "August", "March"]),
    c("dnov1", "Which spooky holiday comes before Thanksgiving?", ["Halloween", "Christmas", "Valentine's Day", "Easter", "New Year's Day", "Fourth of July", "Groundhog Day", "Mother's Day"]),
    c("dnov2", "Which sport is on TV at many Thanksgiving gatherings?", ["Football", "Golf", "Tennis", "Swimming", "Curling", "Rowing", "Archery", "Surfing"]),
    c("dnov3", "Which cartoon kid has a TV special called A Charlie Brown Thanksgiving?", ["Charlie Brown", "Mickey Mouse", "SpongeBob", "Winnie the Pooh", "Garfield", "Bugs Bunny", "Scooby-Doo", "Woody"]),
    c("dnov4", "About how many people sailed on the Mayflower?", ["About 100", "About 10", "About 20", "About 1,000", "About 5,000", "About 30", "About 500", "About 10,000"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "THANKSGIVING HISTORY",
  prompt: "Which U.S. president made Thanksgiving a national holiday in 1863?",
  choices: ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "Theodore Roosevelt", "John Adams", "Ulysses S. Grant", "Andrew Jackson", "James Madison"],
  correctIndex: 0,
};

export const KIDS_THANKSGIVING_PACK: TriviaPack = {
  id: "kids-thanksgiving",
  audience: "kids",
  title: "Thanksgiving Feast",
  tagline: "Turkeys, pies, Pilgrims, and being thankful",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
