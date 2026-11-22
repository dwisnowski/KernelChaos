import type { TriviaFinalDef, TriviaPack } from "../../protocol.ts";
import { c, cat } from "../_helpers.ts";

const SINGLE = [
  cat("CLASSIC NOVELS", [
    c("abok00", "Who wrote Pride and Prejudice?", ["Jane Austen", "Charlotte Bronte", "Emily Bronte", "George Eliot", "Mary Shelley", "Virginia Woolf", "Louisa May Alcott", "Elizabeth Gaskell"]),
    c("abok01", "Who wrote Frankenstein in 1818?", ["Mary Shelley", "Jane Austen", "Bram Stoker", "Emily Bronte", "Charlotte Bronte", "Charles Dickens", "Percy Shelley", "Lord Byron"]),
    c("abok02", "In The Great Gatsby, who narrates the story?", ["Nick Carraway", "Jay Gatsby", "Tom Buchanan", "Jordan Baker", "George Wilson", "Meyer Wolfsheim", "Dan Cody", "Daisy Buchanan"]),
    c("abok03", "Who wrote To Kill a Mockingbird?", ["Harper Lee", "Truman Capote", "Flannery O'Connor", "Carson McCullers", "Eudora Welty", "Toni Morrison", "Maya Angelou", "Margaret Mitchell"]),
    c("abok04", "Which dystopian novel warns that 'Big Brother is watching you'?", ["1984", "Brave New World", "Fahrenheit 451", "The Handmaid's Tale", "Animal Farm", "A Clockwork Orange", "We", "The Giver"]),
  ]),
  cat("FIRST LINES", [
    c("abok10", "'It was the best of times, it was the worst of times' opens which novel?", ["A Tale of Two Cities", "Great Expectations", "Oliver Twist", "Hard Times", "David Copperfield", "Bleak House", "Little Dorrit", "Nicholas Nickleby"]),
    c("abok11", "'Call me Ishmael' opens which novel?", ["Moby-Dick", "Treasure Island", "Robinson Crusoe", "The Old Man and the Sea", "Billy Budd", "Typee", "Huckleberry Finn", "Gulliver's Travels"]),
    c("abok12", "'In a hole in the ground there lived a hobbit' opens which book?", ["The Hobbit", "The Fellowship of the Ring", "The Lion, the Witch and the Wardrobe", "Eragon", "A Wizard of Earthsea", "Dune", "Alice in Wonderland", "The Silmarillion"]),
    c("abok13", "'All happy families are alike; each unhappy family is unhappy in its own way' opens which novel?", ["Anna Karenina", "War and Peace", "Crime and Punishment", "Madame Bovary", "The Brothers Karamazov", "Doctor Zhivago", "Middlemarch", "Les Miserables"]),
    c("abok14", "'Last night I dreamt I went to Manderley again' opens which novel?", ["Rebecca", "Jane Eyre", "Wuthering Heights", "Dracula", "Mrs. Dalloway", "Frankenstein", "The Turn of the Screw", "Persuasion"]),
  ]),
  cat("YA & FANTASY", [
    c("abok20", "Who wrote the Harry Potter series?", ["J.K. Rowling", "Suzanne Collins", "Stephenie Meyer", "Rick Riordan", "C.S. Lewis", "Philip Pullman", "Roald Dahl", "Cassandra Clare"]),
    c("abok21", "Who wrote The Hunger Games?", ["Suzanne Collins", "Veronica Roth", "Stephenie Meyer", "Rick Riordan", "Cassandra Clare", "Lois Lowry", "Scott Westerfeld", "James Dashner"]),
    c("abok22", "Who wrote The Lord of the Rings?", ["J.R.R. Tolkien", "C.S. Lewis", "George R.R. Martin", "Terry Pratchett", "Philip Pullman", "T.H. White", "Ursula K. Le Guin", "Neil Gaiman"]),
    c("abok23", "In the Percy Jackson books, Percy is the son of which god?", ["Poseidon", "Zeus", "Hades", "Apollo", "Ares", "Hermes", "Dionysus", "Hephaestus"]),
    c("abok24", "Who wrote the A Song of Ice and Fire series?", ["George R.R. Martin", "Brandon Sanderson", "Robert Jordan", "Patrick Rothfuss", "Joe Abercrombie", "Terry Brooks", "R.A. Salvatore", "Raymond Feist"]),
  ]),
  cat("AUTHORS", [
    c("abok30", "Which author wrote Carrie, The Shining, and It?", ["Stephen King", "Dean Koontz", "Anne Rice", "Clive Barker", "Peter Straub", "Edgar Allan Poe", "H.P. Lovecraft", "Shirley Jackson"]),
    c("abok31", "Agatha Christie's detective Hercule Poirot is of which nationality?", ["Belgian", "French", "British", "Swiss", "Dutch", "Italian", "German", "Austrian"]),
    c("abok32", "Sherlock Holmes lived at 221B which London street?", ["Baker Street", "Fleet Street", "Downing Street", "Oxford Street", "Abbey Road", "Carnaby Street", "Bond Street", "Regent Street"]),
    c("abok33", "What was Dr. Seuss's real name?", ["Theodor Geisel", "Theodore Gisel", "Theo Seuss", "Seth Geisel", "Ted Seuss", "Thomas Geisel", "Theo Gordon", "Tobias Geisel"]),
    c("abok34", "Which Hemingway novel won the 1953 Pulitzer Prize?", ["The Old Man and the Sea", "A Farewell to Arms", "The Sun Also Rises", "For Whom the Bell Tolls", "To Have and Have Not", "Islands in the Stream", "A Moveable Feast", "The Garden of Eden"]),
  ]),
  cat("POETRY & PLAYS", [
    c("abok40", "Who wrote Romeo and Juliet?", ["William Shakespeare", "Christopher Marlowe", "Ben Jonson", "John Milton", "Geoffrey Chaucer", "Oscar Wilde", "Charles Dickens", "John Donne"]),
    c("abok41", "'To be, or not to be' comes from which Shakespeare play?", ["Hamlet", "Macbeth", "Othello", "King Lear", "Julius Caesar", "The Tempest", "Twelfth Night", "Richard III"]),
    c("abok42", "Who wrote the poem 'The Raven'?", ["Edgar Allan Poe", "Robert Frost", "Walt Whitman", "Emily Dickinson", "Lord Byron", "William Blake", "Sylvia Plath", "T.S. Eliot"]),
    c("abok43", "Who wrote 'The Road Not Taken'?", ["Robert Frost", "Walt Whitman", "Edgar Allan Poe", "Langston Hughes", "Carl Sandburg", "Emily Dickinson", "Maya Angelou", "Ezra Pound"]),
    c("abok44", "Which Arthur Miller play is set during the Salem witch trials?", ["The Crucible", "Death of a Salesman", "A View from the Bridge", "All My Sons", "The Glass Menagerie", "Our Town", "A Streetcar Named Desire", "Fences"]),
  ]),
  cat("FAMOUS QUOTES", [
    c("abok50", "Who said 'I think, therefore I am'?", ["Rene Descartes", "Plato", "Aristotle", "Immanuel Kant", "Friedrich Nietzsche", "Socrates", "John Locke", "David Hume"]),
    c("abok51", "Who said 'The only thing we have to fear is fear itself'?", ["Franklin D. Roosevelt", "Winston Churchill", "Abraham Lincoln", "John F. Kennedy", "Ronald Reagan", "Barack Obama", "Harry Truman", "Dwight Eisenhower"]),
    c("abok52", "Who said, 'That's one small step for man, one giant leap for mankind'?", ["Neil Armstrong", "Buzz Aldrin", "John F. Kennedy", "Yuri Gagarin", "John Glenn", "Alan Shepard", "Gene Cernan", "Michael Collins"]),
    c("abok53", "Who said, 'Float like a butterfly, sting like a bee'?", ["Muhammad Ali", "Joe Frazier", "Sugar Ray Leonard", "Mike Tyson", "George Foreman", "Rocky Marciano", "Larry Holmes", "Floyd Mayweather"]),
    c("abok54", "'Elementary, my dear Watson' is attributed to which detective, though he never says it in the original stories?", ["Sherlock Holmes", "Hercule Poirot", "Miss Marple", "Sam Spade", "Philip Marlowe", "Nancy Drew", "Inspector Clouseau", "Columbo"]),
  ]),
];

const DOUBLE = [
  cat("BESTSELLERS", [
    c("abok60", "Who wrote The Da Vinci Code?", ["Dan Brown", "John Grisham", "James Patterson", "Tom Clancy", "Michael Crichton", "Stephen King", "Nicholas Sparks", "Lee Child"]),
    c("abok61", "Which Gillian Flynn novel became a 2014 David Fincher thriller?", ["Gone Girl", "Sharp Objects", "Dark Places", "The Girl on the Train", "The Silent Patient", "Big Little Lies", "Where the Crawdads Sing", "Verity"]),
    c("abok62", "Who wrote Where the Crawdads Sing?", ["Delia Owens", "Colleen Hoover", "Taylor Jenkins Reid", "Liane Moriarty", "Paula Hawkins", "Gillian Flynn", "Celeste Ng", "Kristin Hannah"]),
    c("abok63", "Who wrote The Girl with the Dragon Tattoo?", ["Stieg Larsson", "Jo Nesbo", "Henning Mankell", "Camilla Lackberg", "Karin Slaughter", "Lee Child", "Dan Brown", "Michael Connelly"]),
    c("abok64", "Who wrote Ready Player One?", ["Ernest Cline", "Andy Weir", "Neal Stephenson", "William Gibson", "Cory Doctorow", "Blake Crouch", "Pierce Brown", "John Scalzi"]),
  ]),
  cat("CLASSICS", [
    c("abok70", "Which Bronte sister wrote Jane Eyre?", ["Charlotte", "Emily", "Anne", "Maria", "Elizabeth", "Jane", "Mary", "Margaret"]),
    c("abok71", "Which Dickens character asks 'Please, sir, I want some more'?", ["Oliver Twist", "Pip", "David Copperfield", "Ebenezer Scrooge", "Fagin", "Nicholas Nickleby", "Tiny Tim", "Bob Cratchit"]),
    c("abok72", "Who wrote The Catcher in the Rye?", ["J.D. Salinger", "Jack Kerouac", "Ernest Hemingway", "F. Scott Fitzgerald", "John Steinbeck", "Kurt Vonnegut", "John Updike", "Joseph Heller"]),
    c("abok73", "Scarlett O'Hara is the heroine of which novel?", ["Gone with the Wind", "Rebecca", "Jane Eyre", "Little Women", "Anna Karenina", "Emma", "Vanity Fair", "Wuthering Heights"]),
    c("abok74", "Who wrote Don Quixote?", ["Miguel de Cervantes", "Lope de Vega", "Gabriel Garcia Marquez", "Jorge Luis Borges", "Pablo Neruda", "Federico Garcia Lorca", "Isabel Allende", "Carlos Fuentes"]),
  ]),
  cat("DYSTOPIA & SCI-FI", [
    c("abok80", "Who wrote Fahrenheit 451?", ["Ray Bradbury", "Isaac Asimov", "Arthur C. Clarke", "Philip K. Dick", "Aldous Huxley", "George Orwell", "Kurt Vonnegut", "Robert Heinlein"]),
    c("abok81", "Which 1985 Margaret Atwood novel is set in the Republic of Gilead?", ["The Handmaid's Tale", "Oryx and Crake", "Alias Grace", "The Blind Assassin", "Cat's Eye", "Surfacing", "Hag-Seed", "The Edible Woman"]),
    c("abok82", "Dune is set largely on which desert planet?", ["Arrakis", "Caladan", "Giedi Prime", "Tatooine", "Mars", "Trantor", "Pandora", "Gallifrey"]),
    c("abok83", "In The Hitchhiker's Guide to the Galaxy, what is the answer to life, the universe, and everything?", ["42", "7", "24", "101", "12", "108", "3.14", "1"]),
    c("abok84", "Who wrote Brave New World?", ["Aldous Huxley", "George Orwell", "H.G. Wells", "Ray Bradbury", "Isaac Asimov", "Arthur C. Clarke", "Ursula K. Le Guin", "Jules Verne"]),
  ]),
  cat("KIDS' SHELF", [
    c("abok90", "Who wrote Where the Wild Things Are?", ["Maurice Sendak", "Dr. Seuss", "Eric Carle", "Shel Silverstein", "Roald Dahl", "Beatrix Potter", "Jan Brett", "Mo Willems"]),
    c("abok91", "Which Roald Dahl book features the fearsome headmistress Miss Trunchbull?", ["Matilda", "The BFG", "The Witches", "James and the Giant Peach", "Fantastic Mr Fox", "The Twits", "George's Marvellous Medicine", "Esio Trot"]),
    c("abok92", "Who wrote Winnie-the-Pooh?", ["A.A. Milne", "Beatrix Potter", "Lewis Carroll", "Kenneth Grahame", "J.M. Barrie", "E.B. White", "Roald Dahl", "C.S. Lewis"]),
    c("abok93", "Who wrote The Giving Tree?", ["Shel Silverstein", "Maurice Sendak", "Dr. Seuss", "Eric Carle", "Judy Blume", "Beverly Cleary", "Mo Willems", "Jon Scieszka"]),
    c("abok94", "In Charlotte's Web, what is the pig's name?", ["Wilbur", "Babe", "Napoleon", "Snowball", "Porky", "Piglet", "Hamm", "Olivia"]),
  ]),
  cat("QUOTES & WIT", [
    c("abok100", "Which cartoon beagle famously tries to write a novel starting 'It was a dark and stormy night'?", ["Snoopy", "Garfield", "Odie", "Scooby-Doo", "Pluto", "Goofy", "Droopy", "Brian Griffin"]),
    c("abok101", "Who wrote 'I wandered lonely as a cloud'?", ["William Wordsworth", "John Keats", "Percy Shelley", "Samuel Taylor Coleridge", "Lord Byron", "Alfred Tennyson", "William Blake", "Robert Browning"]),
    c("abok102", "Which Hamlet character says 'Brevity is the soul of wit'?", ["Polonius", "Hamlet", "Falstaff", "Iago", "Puck", "Prospero", "Macduff", "Mercutio"]),
    c("abok103", "Which character says 'Frankly, my dear, I don't give a damn'?", ["Rhett Butler", "Ashley Wilkes", "Scarlett O'Hara", "Atticus Finch", "Heathcliff", "Mr. Darcy", "Jay Gatsby", "Sam Spade"]),
    c("abok104", "Who wrote 'Not all those who wander are lost'?", ["J.R.R. Tolkien", "Robert Frost", "Walt Whitman", "Jack Kerouac", "Henry David Thoreau", "Mark Twain", "Ralph Waldo Emerson", "Ernest Hemingway"]),
  ]),
  cat("PRIZE WINNERS", [
    c("abok110", "Which songwriter won the 2016 Nobel Prize in Literature?", ["Bob Dylan", "Leonard Cohen", "Paul Simon", "Bruce Springsteen", "Joni Mitchell", "Patti Smith", "Neil Young", "Tom Waits"]),
    c("abok111", "Which Toni Morrison novel won the 1988 Pulitzer Prize?", ["Beloved", "Song of Solomon", "The Bluest Eye", "Sula", "Jazz", "Paradise", "Tar Baby", "A Mercy"]),
    c("abok112", "Who wrote Their Eyes Were Watching God?", ["Zora Neale Hurston", "Maya Angelou", "Alice Walker", "Toni Morrison", "Langston Hughes", "Richard Wright", "Ralph Ellison", "James Baldwin"]),
    c("abok113", "Which 1969 memoir did Maya Angelou write about her early life?", ["I Know Why the Caged Bird Sings", "Their Eyes Were Watching God", "The Color Purple", "Native Son", "Invisible Man", "Go Tell It on the Mountain", "Beloved", "Passing"]),
    c("abok114", "Which Colombian author won the 1982 Nobel Prize in Literature?", ["Gabriel Garcia Marquez", "Mario Vargas Llosa", "Isabel Allende", "Julio Cortazar", "Pablo Neruda", "Jorge Luis Borges", "Carlos Fuentes", "Octavio Paz"]),
  ]),
];

const FINAL: TriviaFinalDef = {
  category: "WORLD LITERATURE",
  prompt: "Who wrote the 1958 novel Things Fall Apart?",
  choices: ["Chinua Achebe", "Wole Soyinka", "Ngugi wa Thiong'o", "Chimamanda Ngozi Adichie", "Nadine Gordimer", "J.M. Coetzee", "Ben Okri", "Camara Laye"],
  correctIndex: 0,
};

export const ADULT_BOOKS_PACK: TriviaPack = {
  id: "adult-books",
  audience: "adult",
  title: "Books & Quotes",
  tagline: "From first lines to famous last words",
  single: SINGLE,
  double: DOUBLE,
  final: FINAL,
};
