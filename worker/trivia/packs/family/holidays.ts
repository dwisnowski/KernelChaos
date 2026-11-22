import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("NEW YEAR", [
    c("hos00", "What famous object drops in Times Square at midnight on New Year's Eve?", ["A ball", "A star", "A giant clock", "A snowflake", "A bell", "A balloon", "A lantern", "A rocket"]),
    c("hos01", "In which Pennsylvania town does a groundhog named Phil predict the weather?", ["Punxsutawney", "Pittsburgh", "Hershey", "Scranton", "Gettysburg", "Erie", "Allentown", "Bethlehem"]),
    c("hos02", "Martin Luther King Jr. Day is observed in which month?", ["January", "February", "March", "April", "August", "September", "October", "December"]),
    c("hos03", "How many animals are in the repeating Chinese zodiac cycle?", ["12", "8", "10", "6", "7", "9", "14", "16"]),
    c("hos04", "Which Scottish poet wrote the words to \"Auld Lang Syne\"?", ["Robert Burns", "Walter Scott", "Robert Louis Stevenson", "William Wallace", "J. M. Barrie", "Arthur Conan Doyle", "Thomas Carlyle", "James Hogg"]),
  ]),
  cat("SPRING HOLIDAYS", [
    c("hos10", "Who hides colorful eggs for children on Easter morning?", ["The Easter Bunny", "Santa Claus", "The Tooth Fairy", "The Great Pumpkin", "Cupid", "Peter Pan", "The Leprechaun", "The Groundhog"]),
    c("hos11", "Which color is most linked to St. Patrick's Day?", ["Green", "Orange", "Blue", "Gold", "Purple", "Pink", "Red", "Yellow"]),
    c("hos12", "On what date is St. Patrick's Day celebrated?", ["March 17", "March 1", "April 17", "February 17", "March 21", "March 31", "April 1", "May 17"]),
    c("hos13", "Which flat unleavened bread is eaten during Passover?", ["Matzo", "Challah", "Pita", "Naan", "Bagel", "Tortilla", "Focaccia", "Rye"]),
    c("hos14", "Cinco de Mayo remembers a Mexican victory over which country's army?", ["France", "Spain", "United States", "Britain", "Portugal", "Germany", "Italy", "Russia"]),
  ]),
  cat("SUMMER & PATRIOTIC", [
    c("hos20", "Independence Day in the United States is celebrated on which date?", ["July 4", "July 1", "June 14", "May 30", "August 4", "September 4", "July 14", "June 4"]),
    c("hos21", "In 1776, the American colonies declared independence from which country?", ["Great Britain", "France", "Spain", "Germany", "Netherlands", "Portugal", "Italy", "Russia"]),
    c("hos22", "In the United States, Labor Day is celebrated in which month?", ["September", "May", "June", "July", "August", "October", "November", "April"]),
    c("hos23", "Juneteenth commemorates the end of what in the United States?", ["Slavery", "The Civil War battle at Gettysburg", "The Revolutionary War", "The Great Depression", "World War I", "Prohibition", "The Gold Rush", "The War of 1812"]),
    c("hos24", "In which city is the Liberty Bell displayed?", ["Philadelphia", "Boston", "Washington, D.C.", "New York City", "Baltimore", "Charleston", "Richmond", "Atlanta"]),
  ]),
  cat("HALLOWEEN", [
    c("hos30", "What do kids say when they knock on doors on Halloween?", ["Trick or treat", "Merry Christmas", "Happy Easter", "Say cheese", "Knock knock", "Open sesame", "Boo hoo", "Cheers"]),
    c("hos31", "Which orange vegetable is most often carved into a jack-o'-lantern in the U.S.?", ["Pumpkin", "Carrot", "Squash", "Sweet potato", "Turnip", "Cantaloupe", "Beet", "Gourd"]),
    c("hos32", "On which date is Halloween celebrated?", ["October 31", "October 13", "November 1", "October 30", "September 31", "November 2", "October 1", "October 21"]),
    c("hos33", "Halloween's roots trace to an ancient Celtic festival called:", ["Samhain", "Beltane", "Yule", "Lammas", "Imbolc", "Saturnalia", "Oktoberfest", "Mabon"]),
    c("hos34", "In Ireland, jack-o'-lanterns were originally carved from what?", ["Turnips", "Pumpkins", "Apples", "Potatoes", "Cabbages", "Melons", "Onions", "Radishes"]),
  ]),
  cat("THANKSGIVING", [
    c("hos40", "Which bird is the traditional main dish at a Thanksgiving feast?", ["Turkey", "Chicken", "Duck", "Goose", "Pheasant", "Quail", "Ostrich", "Pigeon"]),
    c("hos41", "In which city is the famous Macy's Thanksgiving Day Parade held?", ["New York City", "Chicago", "Los Angeles", "Boston", "Philadelphia", "Washington, D.C.", "Detroit", "Atlanta"]),
    c("hos42", "U.S. Thanksgiving falls on the fourth Thursday of which month?", ["November", "October", "December", "September", "August", "January", "March", "June"]),
    c("hos43", "Which ship carried the Pilgrims to America in 1620?", ["Mayflower", "Santa Maria", "Nina", "Pinta", "Half Moon", "Discovery", "Endeavour", "Golden Hind"]),
    c("hos44", "Which president proclaimed a national day of Thanksgiving in 1863?", ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "Theodore Roosevelt", "Ulysses S. Grant", "Andrew Jackson", "Franklin Roosevelt", "John Adams"]),
  ]),
  cat("WINTER HOLIDAYS", [
    c("hos50", "Who are Santa Claus's tiny workshop helpers?", ["Elves", "Gnomes", "Fairies", "Pixies", "Penguins", "Trolls", "Goblins", "Dwarfs"]),
    c("hos51", "What is the special candleholder used at Hanukkah called?", ["Menorah", "Kinara", "Candelabra", "Lantern", "Sconce", "Dreidel", "Torch", "Chandelier"]),
    c("hos52", "How many nights does Hanukkah last?", ["Eight", "Seven", "Five", "Ten", "Twelve", "Three", "Six", "Nine"]),
    c("hos53", "How many days does Kwanzaa last?", ["Seven", "Five", "Eight", "Ten", "Twelve", "Three", "Four", "Six"]),
    c("hos54", "The tradition of decorating a Christmas tree is most associated with which country?", ["Germany", "Italy", "Spain", "Australia", "Egypt", "Japan", "Brazil", "Greece"]),
  ]),
];

const DOUBLE = [
  cat("FEBRUARY FUN", [
    c("hod00", "Cupid, the symbol of Valentine's Day, carries a:", ["Bow and arrow", "Sword", "Magic wand", "Fishing rod", "Lasso", "Harp only", "Shield", "Torch"]),
    c("hod01", "Valentine's Day is celebrated on which date?", ["February 14", "February 2", "January 14", "March 14", "February 28", "February 22", "February 1", "February 29"]),
    c("hod02", "Mardi Gras means what in English?", ["Fat Tuesday", "Happy Carnival", "Mask Day", "Big Parade", "Golden Feast", "Purple Monday", "Bead Festival", "King's Cake"]),
    c("hod03", "Presidents' Day traditionally honors which two presidents?", ["Washington and Lincoln", "Jefferson and Adams", "Lincoln and Grant", "Washington and Jefferson", "Roosevelt and Kennedy", "Adams and Madison", "Lincoln and Roosevelt", "Truman and Eisenhower"]),
    c("hod04", "Which 40-day season of reflection begins on Ash Wednesday?", ["Lent", "Advent", "Epiphany", "Pentecost", "Ramadan", "Passover", "Sukkot", "Easter"]),
  ]),
  cat("AROUND THE WORLD", [
    c("hod10", "Diwali is a festival of what?", ["Lights", "Kites", "Water", "Harvest moons", "Masks", "Flowers", "Snow", "Drums"]),
    c("hod11", "Día de los Muertos is a major holiday in which country?", ["Mexico", "Spain", "Argentina", "Italy", "Portugal", "Canada", "Greece", "Japan"]),
    c("hod12", "Oktoberfest is most famously held in which German city?", ["Munich", "Berlin", "Hamburg", "Frankfurt", "Cologne", "Dresden", "Stuttgart", "Bonn"]),
    c("hod13", "Eid al-Fitr marks the end of which month of fasting?", ["Ramadan", "Muharram", "Shawwal", "Rajab", "Safar", "Sha'ban", "Dhu al-Hijjah", "Rabi' al-awwal"]),
    c("hod14", "During the festival of Holi in India, people throw:", ["Colored powder", "Flower petals only", "Snowballs", "Paper lanterns", "Rice", "Confetti ribbons", "Sparklers", "Candy"]),
  ]),
  cat("CHRISTMAS", [
    c("hod20", "Which reindeer has a famously glowing red nose?", ["Rudolph", "Dasher", "Comet", "Blitzen", "Prancer", "Cupid", "Vixen", "Donner"]),
    c("hod21", "How many reindeer pull Santa's sleigh, not counting Rudolph?", ["Eight", "Six", "Nine", "Ten", "Twelve", "Four", "Seven", "Five"]),
    c("hod22", "In \"The Twelve Days of Christmas,\" what is given on the first day?", ["A partridge in a pear tree", "Two turtle doves", "Three French hens", "Five golden rings", "Six geese a-laying", "Seven swans a-swimming", "Eight maids a-milking", "Twelve drummers drumming"]),
    c("hod23", "Which author wrote A Christmas Carol?", ["Charles Dickens", "Mark Twain", "Jane Austen", "Louisa May Alcott", "Lewis Carroll", "Hans Christian Andersen", "Roald Dahl", "Beatrix Potter"]),
    c("hod24", "\"'Twas the night before Christmas\" begins which poem?", ["A Visit from St. Nicholas", "The Night Santa Came", "Jingle Bells", "Christmas Eve", "The Snowman's Tale", "Silent Night", "Winter Wonderland", "The Sleigh Ride"]),
  ]),
  cat("HOLIDAY TREATS", [
    c("hod30", "Which striped, hooked candy is hung on Christmas trees?", ["Candy cane", "Lollipop", "Gumdrop", "Licorice twist", "Peppermint stick", "Caramel apple", "Rock candy", "Taffy"]),
    c("hod31", "Which dessert is a classic at Thanksgiving dinner?", ["Pumpkin pie", "Cheesecake", "Chocolate lava cake", "Tiramisu", "Baklava", "Key lime pie", "Ice cream sundae", "Black Forest cake"]),
    c("hod32", "Eggnog is traditionally made from milk, cream, sugar, and what?", ["Eggs", "Oats", "Peanuts", "Coconut", "Butter", "Honey", "Maple sap", "Almonds"]),
    c("hod33", "Which potato pancakes are fried and eaten at Hanukkah?", ["Latkes", "Blintzes", "Knishes", "Kugel", "Gefilte fish", "Rugelach", "Challah", "Matzo balls"]),
    c("hod34", "Triangle-shaped hamantaschen cookies are eaten on which Jewish holiday?", ["Purim", "Hanukkah", "Passover", "Yom Kippur", "Rosh Hashanah", "Sukkot", "Shavuot", "Tu BiShvat"]),
  ]),
  cat("DATES & SYMBOLS", [
    c("hod40", "Which plant is hung in doorways at Christmas for a kiss underneath?", ["Mistletoe", "Holly", "Ivy", "Poinsettia", "Fern", "Rosemary", "Clover", "Pine"]),
    c("hod41", "How many leaves does a shamrock have?", ["Three", "Two", "Four", "Five", "Six", "One", "Seven", "Eight"]),
    c("hod42", "In the United States, Mother's Day is celebrated in which month?", ["May", "April", "June", "March", "July", "February", "September", "October"]),
    c("hod43", "Earth Day is celebrated every year on which date?", ["April 22", "March 22", "May 22", "June 5", "April 1", "April 15", "July 22", "September 22"]),
    c("hod44", "Flag Day in the United States falls on which date?", ["June 14", "July 4", "May 30", "June 1", "July 14", "June 4", "May 14", "June 19"]),
  ]),
  cat("HOLIDAY HISTORY", [
    c("hod50", "Santa Claus is inspired by which saint?", ["Saint Nicholas", "Saint Peter", "Saint Francis", "Saint Patrick", "Saint George", "Saint Valentine", "Saint Christopher", "Saint Andrew"]),
    c("hod51", "Poinsettias, popular at Christmas, are native to which country?", ["Mexico", "Brazil", "Canada", "Spain", "Italy", "India", "Egypt", "Australia"]),
    c("hod52", "Which Native American people shared the 1621 harvest feast with the Pilgrims?", ["Wampanoag", "Cherokee", "Navajo", "Sioux", "Apache", "Iroquois", "Cheyenne", "Seminole"]),
    c("hod53", "Hanukkah celebrates the rededication of the Temple in which city?", ["Jerusalem", "Bethlehem", "Cairo", "Babylon", "Damascus", "Athens", "Rome", "Nazareth"]),
    c("hod54", "Which U.S. president signed a law making Christmas a federal holiday in 1870?", ["Ulysses S. Grant", "Abraham Lincoln", "Theodore Roosevelt", "Andrew Johnson", "James Garfield", "Rutherford Hayes", "Grover Cleveland", "Benjamin Harrison"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "HOLIDAY CALENDAR",
  prompt: "Which U.S. federal holiday is observed on the third Monday of January?",
  choices: ["Martin Luther King Jr. Day", "Presidents' Day", "Memorial Day", "Labor Day", "Columbus Day", "Veterans Day", "Juneteenth", "Independence Day"],
  correctIndex: 0,
};

export const FAMILY_HOLIDAYS_PACK: TriviaPack = {
  id: "family-holidays",
  audience: "family",
  title: "Holidays All Year",
  tagline: "Celebrations from New Year's to Christmas and everything between",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
