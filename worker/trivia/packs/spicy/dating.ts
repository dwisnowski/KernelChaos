import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("DATING APPS", [
    c("dat-s0-0", "Which app made 'swipe right' a household phrase?", ["Tinder", "Bumble", "Hinge", "Grindr", "Match.com", "OkCupid", "Feeld", "Plenty of Fish"]),
    c("dat-s0-1", "On Bumble, who has to send the first message in a match between a man and a woman?", ["The woman", "The man", "Whoever swiped first", "Whoever is older", "The one with more matches", "Nobody, it's automatic", "Whoever pays", "A coin flip"]),
    c("dat-s0-2", "Hinge's famous slogan says it is 'designed to be' what?", ["Deleted", "Loved", "Swiped", "Matched", "Married", "Shared", "Ghosted", "Texted"]),
    c("dat-s0-3", "Whitney Wolfe Herd co-founded Tinder before founding which app?", ["Bumble", "Hinge", "Raya", "Grindr", "Coffee Meets Bagel", "The League", "Happn", "Tinder Gold"]),
    c("dat-s0-4", "In what year did Match.com launch?", ["1995", "1990", "1993", "1998", "2000", "2003", "2005", "2008"]),
  ]),
  cat("GHOSTING & FRIENDS", [
    c("dat-s1-0", "'Ghosting' someone means what?", ["Cutting off contact with no explanation", "Dressing up as a spirit on a date", "Texting them constantly", "Showing up unannounced", "Telling their friends everything", "Moving in too fast", "Dating their sibling", "Moving on from a crush"]),
    c("dat-s1-1", "'Breadcrumbing' is when someone does what?", ["Leads you on with occasional low-effort messages", "Sends you recipes", "Eats crackers on the first date", "Follows you home", "Splits the bill by item", "Dumps you via note", "Only dates bakers", "Sending a photo of toast"]),
    c("dat-s1-2", "'Benching' someone means you:", ["Keep them as a backup option", "Take them to the gym", "Introduce them to your parents", "Break up in a park", "Ignore them for a day", "Propose to them", "Ban them from your phone", "Seating them at the kids' table"]),
    c("dat-s1-3", "'Orbiting' is when an ex:", ["Vanishes from texts but keeps viewing your stories", "Moves to the other side of the world", "Only calls at midnight", "Shows up at your work", "Follows you in traffic", "Dates your best friend", "Sends a satellite photo", "Stalking someone's mail"]),
    c("dat-s1-4", "'Love bombing' is:", ["Overwhelming someone with affection early to gain control", "A very loud wedding", "Fighting over a ring", "Exploding a friendship", "Bringing chocolates to every date", "Breaking up in public", "Tossing flowers at a crush", "Dropping a surprise ring in a drink"]),
  ]),
  cat("DATE NIGHT LINGO", [
    c("dat-s2-0", "'Going Dutch' on a date means:", ["Everyone pays their own share", "Splitting a dessert", "Dining at a windmill", "Only drinking beer", "Letting the date choose", "Ordering wooden shoes", "Skipping dinner", "Alternating who orders"]),
    c("dat-s2-1", "A 'meet-cute' is what, in rom-coms?", ["A charming first encounter", "A first kiss", "A fight between exes", "A wedding montage", "A breakup scene", "A cute pet", "A blind date gone wrong", "A dating app glitch"]),
    c("dat-s2-2", "A 'third wheel' is:", ["The extra person tagging along with a couple", "A spare tire", "A jealous ex", "A matchmaker", "A wedding planner", "A bridesmaid", "A dating coach", "A getaway driver"]),
    c("dat-s2-3", "The 'friend zone' is where you land when:", ["The other person only sees you as a platonic friend", "You are on a double date", "Your friends set you up", "You are in a group chat", "You are exclusive", "You are engaged", "You are on a break", "You are in a long-distance relationship"]),
    c("dat-s2-4", "'Netflix and chill' is widely used as a:", ["Euphemism for hooking up", "Description of a quiet night alone", "Movie review show", "Streaming subscription tier", "Cooking technique", "Meditation class", "Name of a dating app", "A cooking show format"]),
  ]),
  cat("ROM-COM RUINS", [
    c("dat-s3-0", "In 'How to Lose a Guy in 10 Days,' how many days does Kate Hudson have?", ["Ten", "Seven", "Five", "Fourteen", "Three", "Thirty", "Twenty-one", "Two"]),
    c("dat-s3-1", "Which Cameron Diaz movie features a famously misused 'hair gel' scene?", ["There's Something About Mary", "Charlie's Angels", "The Holiday", "My Best Friend's Wedding", "The Mask", "Knight and Day", "Bad Teacher", "Something Wild"]),
    c("dat-s3-2", "Who stars as the title character in 'The 40-Year-Old Virgin'?", ["Steve Carell", "Seth Rogen", "Paul Rudd", "Jonah Hill", "Will Ferrell", "Ben Stiller", "Jason Segel", "Adam Sandler"]),
    c("dat-s3-3", "Which duo are professional wedding crashers in the 2005 comedy?", ["Owen Wilson and Vince Vaughn", "Ben Stiller and Jack Black", "Seth Rogen and James Franco", "Will Ferrell and John C. Reilly", "Adam Sandler and Rob Schneider", "Jonah Hill and Michael Cera", "Steve Carell and Paul Rudd", "Dane Cook and Kevin Hart"]),
    c("dat-s3-4", "In 'Bridesmaids,' the bridal party gets food poisoning after eating at what kind of restaurant?", ["Brazilian", "Thai", "Sushi", "Mexican", "Italian", "Indian", "Ethiopian", "Korean"]),
  ]),
  cat("SONGS ABOUT EXES", [
    c("dat-s4-0", "Who sang 'Since U Been Gone'?", ["Kelly Clarkson", "Pink", "Avril Lavigne", "Ashlee Simpson", "Christina Aguilera", "Jessica Simpson", "Hilary Duff", "Britney Spears"]),
    c("dat-s4-1", "In Beyoncé's 'Irreplaceable,' where should his things be?", ["To the left", "To the right", "By the door", "In the garage", "On the porch", "In the car", "On the lawn", "In the trash"]),
    c("dat-s4-2", "Justin Timberlake's 'Cry Me a River' was widely rumored to be about which ex?", ["Britney Spears", "Cameron Diaz", "Janet Jackson", "Alyssa Milano", "Jessica Biel", "Mandy Moore", "Christina Aguilera", "Katy Perry"]),
    c("dat-s4-3", "Olivia Rodrigo's 2021 breakout ballad about a lost relationship is titled:", ["Drivers License", "Deja Vu", "Good 4 U", "Brutal", "Traitor", "Vampire", "Happier", "Sour"]),
    c("dat-s4-4", "In Carrie Underwood's 'Before He Cheats,' she takes a Louisville Slugger to the truck's:", ["Headlights", "Windshield", "Bumper", "Radio", "Side mirrors", "Tailgate", "Hood ornament", "Tires"]),
  ]),
  cat("VALENTINE'S DAY", [
    c("dat-s5-0", "On what date is Valentine's Day?", ["February 14", "February 4", "March 14", "January 14", "February 20", "April 14", "December 14", "February 28"]),
    c("dat-s5-1", "Cupid's Greek counterpart is the god:", ["Eros", "Apollo", "Ares", "Hermes", "Dionysus", "Zeus", "Pan", "Aphrodite"]),
    c("dat-s5-2", "Candy hearts stamped 'BE MINE' are best known under which brand name?", ["Sweethearts", "Skittles", "Starburst", "Jolly Rancher", "Lifesavers", "Twizzlers", "Mike and Ike", "Dum Dums"]),
    c("dat-s5-3", "In Japan, who traditionally gives chocolate to whom on Valentine's Day?", ["Women give to men", "Men give to women", "Children give to teachers", "Couples swap with each other", "Bosses give to staff", "Parents give to children", "Nobody gives chocolate", "Grandparents give to grandkids"]),
    c("dat-s5-4", "The Roman festival often linked to Valentine's Day origins was:", ["Lupercalia", "Saturnalia", "Bacchanalia", "Vestalia", "Floralia", "Compitalia", "Quirinalia", "Fortunalia"]),
  ]),
];

const DOUBLE = [
  cat("CELEB COUPLES & SPLITS", [
    c("dat-d0-0", "Brad Pitt and Angelina Jolie met filming which movie?", ["Mr. & Mrs. Smith", "Ocean's Eleven", "Troy", "Salt", "Maleficent", "Wanted", "The Tourist", "Gone Girl"]),
    c("dat-d0-1", "'Bennifer' refers to Ben Affleck and which star?", ["Jennifer Lopez", "Jennifer Aniston", "Jennifer Garner", "Jennifer Lawrence", "Jessica Alba", "Jennifer Love Hewitt", "Jennifer Connelly", "Jennifer Hudson"]),
    c("dat-d0-2", "Kim Kardashian's 2011 marriage to NBA player Kris Humphries lasted about how long?", ["72 days", "72 hours", "7 months", "3 weeks", "1 year", "2 years", "55 days", "72 weeks"]),
    c("dat-d0-3", "Britney Spears' 2004 Las Vegas wedding to Jason Alexander lasted about how long before annulment?", ["55 hours", "5 days", "72 hours", "2 weeks", "3 months", "1 year", "24 hours", "6 weeks"]),
    c("dat-d0-4", "In what year did Brad Pitt and Angelina Jolie's divorce filing happen?", ["2016", "2012", "2014", "2015", "2017", "2018", "2019", "2011"]),
  ]),
  cat("FAMOUS KISSES", [
    c("dat-d1-0", "In which Disney film do two dogs share a spaghetti strand?", ["Lady and the Tramp", "101 Dalmatians", "Bolt", "Oliver & Company", "The Aristocats", "Beauty and the Beast", "The Fox and the Hound", "Dumbo"]),
    c("dat-d1-1", "In 2002's 'Spider-Man,' the famous kiss with Mary Jane happens while Spidey hangs how?", ["Upside down", "Sideways", "On a rooftop ledge", "From a flagpole", "Underwater", "From a taxi", "Inside an elevator", "Hanging from a billboard"]),
    c("dat-d1-2", "The famous V-J Day kiss photo from 1945 was taken in which city?", ["New York City", "London", "Paris", "Chicago", "Los Angeles", "Washington, D.C.", "Boston", "San Francisco"]),
    c("dat-d1-3", "Which pop star kissed Britney Spears and Christina Aguilera at the 2003 MTV VMAs?", ["Madonna", "Janet Jackson", "Beyoncé", "Lady Gaga", "Pink", "Cher", "Gwen Stefani", "Dolly Parton"]),
    c("dat-d1-4", "A 2025 'kiss cam' moment caught a tech CEO and a colleague at a concert for which band?", ["Coldplay", "Imagine Dragons", "Maroon 5", "OneRepublic", "U2", "The Killers", "Train", "Kings of Leon"]),
  ]),
  cat("TEXTING TRAUMA", [
    c("dat-d2-0", "To be 'left on read' means:", ["They saw your message and didn't reply", "They muted you", "They blocked you", "They read it twice", "They called instead", "They replied instantly", "They sent a voice memo", "They deleted the chat"]),
    c("dat-d2-1", "'SMH' stands for:", ["Shaking my head", "So much hate", "Sorry, my honey", "See me here", "Say my heart", "Smile more, human", "Stay mad, honey", "Sleeping my homework"]),
    c("dat-d2-2", "'FOMO' stands for:", ["Fear of missing out", "Fun on my own", "Friends only, me only", "Follow my order", "Forget me, okay", "Fast online mobile", "First of many orders", "Feeling oddly merry often"]),
    c("dat-d2-3", "A 'situationship' is:", ["A romantic thing with no defined commitment", "A marriage on a boat", "A group date", "A long engagement", "A therapy session", "A double date", "A work romance", "A cruise-ship fling"]),
    c("dat-d2-4", "Which singer asked 'Hey, I just met you, and this is crazy' in a 2012 hit?", ["Carly Rae Jepsen", "Taylor Swift", "Selena Gomez", "Katy Perry", "Demi Lovato", "Meghan Trainor", "Ariana Grande", "Lorde"]),
  ]),
  cat("FICTIONAL DUMPSTER FIRES", [
    c("dat-d3-0", "In 'Friends,' Ross famously insisted that he and Rachel were:", ["On a break", "Just friends", "Engaged", "Separated forever", "Married in Vegas", "Taking a nap", "Over it", "Single again"]),
    c("dat-d3-1", "In 'Sex and the City,' Carrie's on-again, off-again love is known as:", ["Mr. Big", "Mr. Right", "Mr. Small", "Mr. Bond", "Mr. Brooks", "Mr. Wonderful", "Mr. Perfect", "Mr. Huge"]),
    c("dat-d3-2", "In 'Fatal Attraction,' which actress plays the obsessed Alex Forrest who boils a pet bunny?", ["Glenn Close", "Sharon Stone", "Meryl Streep", "Demi Moore", "Kim Basinger", "Sigourney Weaver", "Susan Sarandon", "Michelle Pfeiffer"]),
    c("dat-d3-3", "Which actress plays Amy Dunne in 'Gone Girl'?", ["Rosamund Pike", "Reese Witherspoon", "Charlize Theron", "Emily Blunt", "Jennifer Lawrence", "Amy Adams", "Keira Knightley", "Anne Hathaway"]),
    c("dat-d3-4", "In '(500) Days of Summer,' who plays Summer?", ["Zooey Deschanel", "Emma Stone", "Anna Kendrick", "Mila Kunis", "Kristen Stewart", "Jennifer Aniston", "Rashida Jones", "Blake Lively"]),
  ]),
  cat("ZODIAC LOVE", [
    c("dat-d4-0", "Which zodiac sign is symbolized by the twins?", ["Gemini", "Aries", "Taurus", "Cancer", "Libra", "Pisces", "Virgo", "Sagittarius"]),
    c("dat-d4-1", "Which zodiac sign is symbolized by the scales?", ["Libra", "Virgo", "Capricorn", "Aquarius", "Scorpio", "Taurus", "Cancer", "Leo"]),
    c("dat-d4-2", "Leo is which element?", ["Fire", "Water", "Earth", "Air", "Metal", "Wood", "Ice", "Lightning"]),
    c("dat-d4-3", "Venus rules Taurus and which other zodiac sign?", ["Libra", "Aries", "Scorpio", "Gemini", "Pisces", "Leo", "Virgo", "Capricorn"]),
    c("dat-d4-4", "During 'Mercury retrograde,' people jokingly blame it for problems with:", ["Communication and technology", "Weather and crops", "Cooking and cleaning", "Sleep and dreams", "Wealth and taxes", "Sports and exercise", "Pets and plants", "Pets and farm animals"]),
  ]),
  cat("WEDDING WEIRDNESS", [
    c("dat-d5-0", "'Something old, something new, something borrowed, something ___.'", ["Blue", "Red", "Green", "Gold", "Silver", "White", "Black", "Pink"]),
    c("dat-d5-1", "Tradition says whoever catches the bridal bouquet will be:", ["The next to marry", "The next to divorce", "The best man", "Lucky at cards", "The flower girl", "The first to have kids", "The maid of honor", "The wedding DJ"]),
    c("dat-d5-2", "Elvis impersonators famously officiate weddings in which city?", ["Las Vegas", "Memphis", "Nashville", "Reno", "Miami", "Atlantic City", "Orlando", "Branson"]),
    c("dat-d5-3", "The traditional gift for a 25th anniversary is:", ["Silver", "Gold", "Paper", "Pearl", "Crystal", "Diamond", "Ruby", "Wood"]),
    c("dat-d5-4", "The traditional gift for a 10th anniversary is:", ["Tin or aluminum", "Paper", "Leather", "Wood", "Ivory", "Pearl", "Cotton", "Steel"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "DATING DISASTERS",
  prompt: "The term 'catfishing,' for faking an online identity to lure someone, comes from a 2010 documentary titled:",
  choices: ["Catfish", "The Social Network", "Swipe Right", "Sleeping with Strangers", "Lonely Hearts", "Fake Love", "Online Date", "Hook, Line and Sinker"],
  correctIndex: 0,
};

export const SPICY_DATING_PACK: TriviaPack = {
  id: "spicy-dating",
  audience: "spicy",
  title: "Dating Disasters",
  tagline: "Swipes, ghosts, exes, and awkward first dates",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
