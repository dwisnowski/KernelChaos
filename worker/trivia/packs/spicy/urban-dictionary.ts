import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("DEFINE THIS", [
    c("urb-s0-0", "In slang, what does 'DTF' usually mean?", ["Down to fuck", "Down to fight", "Done too fast", "Don't text first", "Drink till full", "Drive that far", "Dead tired friend", "Date this Friday"]),
    c("urb-s0-1", "What does it mean if someone is 'horny'?", ["Sexually aroused", "Angry at work", "Hungry for spicy food", "Nervous before a test", "Tired after a run", "Drunk on beer only", "Bored at a party", "Cold in winter"]),
    c("urb-s0-2", "In slang, a 'booty call' is typically:", ["A late-night invite for sex", "A call from the gym", "A pirate radio show", "A bank fraud alert", "A babysitting request", "A ride-share pickup", "A work emergency", "A group chat roast"]),
    c("urb-s0-3", "What does 'NSFW' stand for on the internet?", ["Not safe for work", "New slang for weirdos", "No sex for weekends", "Nice stuff for writing", "Not sorry for wording", "Night shift for workers", "Need salt for water", "Next song for wireless"]),
    c("urb-s0-4", "If someone says they 'hit that', they most often mean they:", ["Had sex with that person", "Punched a wall", "Won a sports bet", "Sent a mean email", "Bought a new car", "Skipped a class", "Finished a workout", "Deleted an app"]),
  ]),
  cat("NAME THAT SLANG", [
    c("urb-s1-0", "Slang for oral sex performed on a man is commonly called a:", ["Blowjob", "Hand job only", "Lap dance", "Dry hump", "Pearl necklace (literal)", "Happy ending massage only", "Tea bag sale", "Motorboat ride"]),
    c("urb-s1-1", "What slang word means a woman's breasts?", ["Tits", "Knees", "Elbows", "Shins", "Wrists", "Ankles", "Toes", "Fingernails"]),
    c("urb-s1-2", "Slang for the buttocks is often:", ["Ass", "Elbow", "Chin", "Forehead", "Wrist", "Collarbone", "Shin", "Knuckle"]),
    c("urb-s1-3", "A vulgar slang word for penis is:", ["Dick", "Elbow", "Kneecap", "Eyelash", "Pinky toe", "Funny bone", "Adam's apple", "Wisdom tooth"]),
    c("urb-s1-4", "What slang term means vagina in crude speech?", ["Pussy", "Funny bone", "Belly button", "Earlobe", "Kneecap", "Shinbone", "Pinky", "Collarbone"]),
  ]),
  cat("SEX & DATING", [
    c("urb-s2-0", "In dating slang, what is a 'friends with benefits' arrangement?", ["Friends who also have sex", "Friends who share Netflix only", "Coworkers who carpool", "Roommates who split rent", "Pen pals who never meet", "Gym buddies who spot", "Group chat admins", "Study partners only"]),
    c("urb-s2-1", "What does it mean to 'ghost' someone after sex or dating?", ["Cut off all contact without explanation", "Send them a Halloween costume", "Invite them to a seance", "Block only their mom", "Like every old photo", "Move in together", "Propose immediately", "Introduce them to parents"]),
    c("urb-s2-2", "A 'one-night stand' is:", ["Sex with someone once, no ongoing relationship", "A comedy show ticket", "A night shift at work", "Sleeping in an airport", "Camping without a tent", "A solo movie marathon", "A hotel upgrade", "A wedding rehearsal"]),
    c("urb-s2-3", "In slang, 'netflix and chill' often implies:", ["Watching something as a pretext for sex", "Binge-watching documentaries only", "Studying for finals together", "Cooking a five-course meal", "Playing board games all night", "Cleaning the apartment", "Doing taxes together", "Building IKEA furniture"]),
    c("urb-s2-4", "What does 'cuffing season' refer to?", ["Cold months when people seek casual-to-serious pairing", "Baseball spring training", "Tax filing season", "Allergy season", "Back-to-school shopping", "Hurricane season", "Olympic trials", "Daylight saving time"]),
  ]),
  cat("PARTY & SUBSTANCES", [
    c("urb-s3-0", "What does it mean to be 'faded'?", ["High or very drunk", "Well-rested", "Overdressed", "Hungry", "Sunburned only", "Jet-lagged from travel only", "Allergic to pollen", "Lost in a mall"]),
    c("urb-s3-1", "In slang, 'edibles' usually means:", ["Cannabis-infused food", "Organic salad", "Protein bars", "Expired yogurt", "Spicy chips", "Energy drinks", "Sugar-free gum", "Frozen pizza"]),
    c("urb-s3-2", "What does 'rolling' often mean at a party?", ["On MDMA / ecstasy", "Doing yoga", "Baking bread", "Playing dice only", "Skating indoors", "Filming a vlog", "Ironing clothes", "Waiting in line"]),
    c("urb-s3-3", "A 'beer bong' is used to:", ["Chug beer quickly through a funnel", "Brew craft IPA", "Measure hops", "Clean keg lines", "Serve wine properly", "Age whiskey", "Foam milk for lattes", "Chill champagne"]),
    c("urb-s3-4", "What does 'blazed' usually mean?", ["Very high on cannabis", "Sunburned at the beach", "Angry at a referee", "Excited about sales", "Tired after cardio", "Lost in traffic", "Overcaffeinated only", "Hungry after gym"]),
  ]),
  cat("INTERNET & TEXTING", [
    c("urb-s4-0", "What does 'DMs' stand for when someone says 'slide into the DMs'?", ["Direct messages", "Dinner menus", "Daily meetings", "Dance moves", "Debt managers", "Dog memes", "Draft manuscripts", "Discount malls"]),
    c("urb-s4-1", "In sexting slang, a 'nude' is:", ["A naked photo of yourself", "A beige paint color", "A court filing", "A yoga pose", "A museum ticket", "A blank spreadsheet", "A silent playlist", "An unsigned contract"]),
    c("urb-s4-2", "What does 'thirsty' mean online?", ["Desperately craving attention or sex", "Dehydrated from sports", "Hungry for soup", "Tired of scrolling", "Broke after shopping", "Bored at work", "Lost without Wi-Fi", "Late to a meeting"]),
    c("urb-s4-3", "A 'catfish' in dating slang is someone who:", ["Uses a fake identity or photos online", "Owns many cats", "Only dates fishermen", "Sells seafood", "Hates seafood", "Works at an aquarium", "Posts only pet videos", "Collects fishing lures"]),
    c("urb-s4-4", "What does 'NSFL' warn about (stronger than NSFW)?", ["Not safe for life — extremely graphic content", "New songs for listening", "No salt for lunch", "Need socks for laundry", "Nice scenery for landscapes", "Next shift for logistics", "Not sorry for laughing", "Night school for lawyers"]),
  ]),
  cat("INSULTS & SHADE", [
    c("urb-s5-0", "Calling someone a 'basic bitch' usually means they are:", ["Unoriginal and mainstream", "A professional chef", "A math genius", "A skilled athlete", "A rare book collector", "A quiet introvert only", "A licensed therapist", "A military officer"]),
    c("urb-s5-1", "What does it mean to 'throw shade'?", ["Insult someone subtly", "Open a beach umbrella", "Paint a room dark", "Block sunlight with blinds", "Cancel outdoor plans", "Wear sunglasses indoors", "Plant a tree", "Turn off the lights"]),
    c("urb-s5-2", "A 'fuckboy' / 'fuckboi' is slang for a man who:", ["Uses people for sex and is unreliable", "Fixes cars professionally", "Knits sweaters", "Teaches kindergarten", "Runs a bakery", "Collects stamps", "Volunteers at shelters", "Writes poetry only"]),
    c("urb-s5-3", "Calling someone 'trash' in slang means they are:", ["Awful or worthless as a person/behavior", "Good at recycling", "A sanitation worker", "Neat and tidy", "Rich and fancy", "Quiet and polite", "A great cook", "Always on time"]),
    c("urb-s5-4", "What does 'eat shit' express when yelled at someone?", ["Hostile contempt / go away", "Please try the buffet", "Compliment their cooking", "Invite them to brunch", "Ask for restaurant tips", "Offer dessert", "Praise their diet", "Share a recipe"]),
  ]),
];

const DOUBLE = [
  cat("ACRONYM DECODE", [
    c("urb-d0-0", "In dirty texting, what does 'WAP' famously refer to (explicit song slang)?", ["Wet-ass pussy", "Wireless access point only", "Work after party", "Wine and pasta", "Weekend apartment party", "World athletics program", "Wear a parka", "Write a paper"]),
    c("urb-d0-1", "What does 'MILF' stand for?", ["Mother I'd like to fuck", "Most important life fact", "My internet login fails", "Make it last forever", "Monthly income loan fund", "Music I love first", "Meet in lobby Friday", "Move in last fall"]),
    c("urb-d0-2", "What does 'DILF' stand for?", ["Dad I'd like to fuck", "Drive in left first", "Dinner is late Friday", "Do it like friends", "Daily internet life feed", "Don't invite loud friends", "Drink iced latte first", "Date in late fall"]),
    c("urb-d0-3", "In slang, 'FWB' usually means:", ["Friends with benefits", "Free wifi boost", "Friday work brunch", "Fast wifi band", "Full week bonus", "Fitness with buddies", "Food with beer", "Film with buddies"]),
    c("urb-d0-4", "What does 'GILF' parody?", ["Grandmother I'd like to fuck", "Great internet life filter", "Go in left first", "Gym is life forever", "Get iced latte free", "Green island leaf farm", "Group invite list fail", "Gift is late Friday"]),
  ]),
  cat("RELATIONSHIP LINGO", [
    c("urb-d1-0", "What is a 'situationship'?", ["A romantic/sexual thing without clear labels", "A legal marriage", "A business merger", "A group therapy session", "A timeshare contract", "A sports rivalry", "A roommate lease only", "A pen-pal program"]),
    c("urb-d1-1", "To 'cuff' someone in dating slang means to:", ["Couple up / get exclusive", "Handcuff them literally only", "Ignore their texts", "Steal their hoodie forever", "Meet their parents once", "Unfollow them online", "Propose on day one", "Move to another city"]),
    c("urb-d1-2", "A 'side piece' is:", ["A sexual partner outside a main relationship", "A furniture end table", "A backup singer", "A spare phone charger", "A second job", "A gym towel", "A dessert sampler", "A travel adapter"]),
    c("urb-d1-3", "What does 'breadcrumbing' mean in dating?", ["Leading someone on with tiny sporadic attention", "Baking sourdough together", "Sharing lunch leftovers", "Leaving a trail on a hike", "Tip-toeing into a room", "Collecting coupons", "Feeding ducks", "Writing a cookbook"]),
    c("urb-d1-4", "If someone is your 'ex with benefits', they are:", ["A former partner you still sleep with", "A coworker who shares snacks", "A landlord who fixes things", "A tutor who grades papers", "A trainer who spots lifts", "A neighbor who waters plants", "A sibling's friend", "A distant cousin"]),
  ]),
  cat("BODY TALK", [
    c("urb-d2-0", "What is a 'motorboat' in crude sexual slang?", ["Burying your face in breasts and making engine noises", "Driving a ski boat", "A ferry commute", "A yacht party", "A jet ski rental", "A canoe trip", "A submarine tour", "A paddleboard race"]),
    c("urb-d2-1", "A 'pearl necklace' in sexual slang refers to:", ["Semen on the neck/chest area", "A Tiffany jewelry gift", "A beach souvenir", "A Mardi Gras bead set", "A wedding accessory", "A costume necklace", "A diving weight belt", "A doctor's stethoscope"]),
    c("urb-d2-2", "What does 'blue balls' describe?", ["Aching from prolonged arousal without orgasm", "Bruised knees from sports", "Cold hands in winter", "Sadness after a breakup only", "Paint stains on jeans", "Swimming pool chlorine", "A sports team nickname only", "Hunger after fasting"]),
    c("urb-d2-3", "In slang, 'taint' refers to:", ["The perineum (between genitals and anus)", "A wine flaw only", "A spoiled apple", "A tattoo ink brand", "A perfume note", "A gym chalk brand", "A laundry stain stick", "A car paint scratch"]),
    c("urb-d2-4", "What is 'tea-bagging' in sexual slang?", ["Lowering the scrotum onto someone's face/mouth", "Steeping Earl Grey", "Grocery shopping", "A British brunch", "Dunking cookies", "Making iced tea", "A cricket strategy", "A hotel turndown service"]),
  ]),
  cat("UK vs US", [
    c("urb-d3-0", "In British slang, 'to shag' means to:", ["Have sex", "Dance the foxtrot", "Cut hair short", "Carpet a room", "Smoke a cigar", "Drive stick shift", "Knit a sweater", "Brew strong tea"]),
    c("urb-d3-1", "In British English, 'fanny' usually means:", ["Vagina (not the US 'butt')", "A backpack", "A rainy day", "A bus ticket", "A tea cozy", "A pub quiz", "A cricket bat", "A royal title"]),
    c("urb-d3-2", "American 'fanny pack' would sound especially awkward in the UK because 'fanny' there means:", ["Female genitals", "A wallet", "A hat", "A sandwich", "A raincoat", "A subway pass", "A biscuit", "A football"]),
    c("urb-d3-3", "British 'knickers' are what Americans usually call:", ["Underwear / panties", "Soccer cleats", "Winter gloves", "Suit jackets", "Rain boots", "Neck ties", "Baseball caps", "Dress socks"]),
    c("urb-d3-4", "In Aussie/UK crude slang, 'root' can mean:", ["Have sex", "Garden vegetables", "Math square roots only", "Tree stump removal only", "USB plug-in", "Wifi password", "Sports tryout", "Bank deposit"]),
  ]),
  cat("MEME & APP SLANG", [
    c("urb-d4-0", "On dating apps, 'looking for a unicorn' often means seeking:", ["A bisexual woman to join a couple", "A rare vinyl record", "A fantasy novel club", "A rainbow emoji pack", "A horse farm visit", "A crypto coin", "A VIP concert pass", "A tech internship"]),
    c("urb-d4-1", "What does 'thirst trap' mean?", ["A sexy photo posted to get attention/desire", "A plumbing hazard", "A desert mirage", "A phishing email", "A gym water bottle", "A locked Snapchat", "A spam filter", "A diet plan"]),
    c("urb-d4-2", "A 'sneaky link' is slang for:", ["A secret hookup partner", "A private Wi-Fi network", "A URL shortener", "A group chat admin", "A VPN subscription", "A burner email", "A hidden playlist", "A coupon code"]),
    c("urb-d4-3", "What does 'down bad' usually mean?", ["Extremely thirsty / desperate for someone", "Broke after shopping only", "Sick with a cold", "Lost in a city", "Failing a class only", "Hungry after work", "Tired from jet lag", "Angry at traffic"]),
    c("urb-d4-4", "In meme slang, 'horny jail' is a joke about:", ["Being too sexually online and needing a timeout", "An actual prison sentence", "A yoga retreat", "A sleepaway camp", "A library fine", "A parking ticket", "A DMV line", "A work suspension"]),
  ]),
  cat("WHICH MEANS WHAT", [
    c("urb-d5-0", "Which best matches 'rawdog' in modern slang?", ["Sex without a condom (also: do something without prep)", "Walk a dog without a leash only", "Eat sushi only", "Skip sunscreen only", "Drive without GPS only", "Swim without goggles only", "Cook without salt only", "Sleep without a pillow only"]),
    c("urb-d5-1", "Which is the meaning of 'creampie' in porn slang?", ["Semen left inside after sex", "A Boston dessert", "A pie-eating contest", "A bakery fail", "A food fight", "A wedding cake", "A fruit tart", "A cooking show challenge"]),
    c("urb-d5-2", "What does 'pegging' refer to?", ["A woman anally penetrating a man with a strap-on", "Hanging coats on a rack", "Climbing with pitons only", "Measuring fabric", "Golf tee placement", "Tent stake setup", "Clothes-line drying", "Scorekeeping in horseshoes"]),
    c("urb-d5-3", "A 'money shot' in adult-film slang is typically:", ["The visible ejaculation climax shot", "A lottery ticket win", "A bank heist scene", "A salary negotiation", "A product placement", "A tip jar selfie", "A crypto pump", "A sports buzzer-beater only"]),
    c("urb-d5-4", "What does 'scissoring' describe?", ["A sexual position with two vulvas rubbing together", "A haircut technique only", "A craft project", "A fencing move", "A paper craft", "A gym stretch only", "A dance kickline", "A sewing class"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "URBAN DICTIONARY",
  prompt: "In internet slang, what does 'GOAT' stand for when praising someone?",
  choices: [
    "Greatest of all time",
    "Get off after texting",
    "Gross old adult trash",
    "Going out after ten",
    "Give oral and leave",
    "Gang of anonymous trolls",
    "Get over a trauma",
    "Green olive and tuna",
  ],
  correctIndex: 0,
};

export const SPICY_URBAN_DICTIONARY_PACK: TriviaPack = {
  id: "spicy-urban-dictionary",
  audience: "spicy",
  title: "Urban Dictionary",
  tagline: "Anything-goes slang definitions — NSFW, 18+",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
