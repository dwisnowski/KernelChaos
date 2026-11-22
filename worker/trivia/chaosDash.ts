export interface ChaosDashPuzzle {
  kind: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
}

function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = t;
  }
  return arr;
}

function withShuffledCorrect(prompt: string, kind: string, correct: string, wrong: string[]): ChaosDashPuzzle {
  const choices = shuffleInPlace([correct, ...wrong]);
  return {
    kind,
    prompt,
    choices,
    correctIndex: choices.indexOf(correct),
  };
}

function mathSprint(): ChaosDashPuzzle {
  const a = 2 + Math.floor(Math.random() * 9);
  const b = 2 + Math.floor(Math.random() * 9);
  const op = Math.random() < 0.5 ? "+" : "×";
  const correct = op === "+" ? a + b : a * b;
  const wrong = new Set<number>();
  while (wrong.size < 3) {
    const delta = (Math.floor(Math.random() * 5) + 1) * (Math.random() < 0.5 ? -1 : 1);
    const v = correct + delta;
    if (v !== correct && v > 0) wrong.add(v);
  }
  return withShuffledCorrect(
    `Quick! ${a} ${op} ${b} = ?`,
    "math",
    String(correct),
    [...wrong].map(String),
  );
}

function oddOneOut(): ChaosDashPuzzle {
  const sets = [
    { same: ["🐶", "🐱", "🐰"], odd: "🚗" },
    { same: ["🍎", "🍌", "🍇"], odd: "⚽" },
    { same: ["⭐", "✨", "🌟"], odd: "🍕" },
    { same: ["🔺", "🔺", "🔺"], odd: "⬤" },
  ];
  const s = sets[Math.floor(Math.random() * sets.length)]!;
  const choices = shuffleInPlace([...s.same, s.odd]);
  return {
    kind: "oddOneOut",
    prompt: "Tap the odd one out",
    choices,
    correctIndex: choices.indexOf(s.odd),
  };
}

function stroop(): ChaosDashPuzzle {
  const colors = [
    { word: "RED", ink: "Blue", inkKey: "Blue" },
    { word: "BLUE", ink: "Green", inkKey: "Green" },
    { word: "GREEN", ink: "Red", inkKey: "Red" },
    { word: "YELLOW", ink: "Purple", inkKey: "Purple" },
  ];
  const c = colors[Math.floor(Math.random() * colors.length)]!;
  const wrong = ["Red", "Blue", "Green", "Purple", "Yellow"].filter((x) => x !== c.inkKey);
  return withShuffledCorrect(
    `Word says ${c.word} but ink is ${c.ink}. Tap the INK color.`,
    "stroop",
    c.inkKey,
    wrong.slice(0, 3),
  );
}

function higherLower(): ChaosDashPuzzle {
  let a = 10 + Math.floor(Math.random() * 80);
  let b = 10 + Math.floor(Math.random() * 80);
  while (a === b) b = 10 + Math.floor(Math.random() * 80);
  const correct = a > b ? String(a) : String(b);
  return withShuffledCorrect(`Which is larger?`, "higherLower", correct, [
    a > b ? String(b) : String(a),
    String(a + b),
    String(Math.abs(a - b) || 1),
  ]);
}

function letterScramble(): ChaosDashPuzzle {
  const words = ["CAKE", "FROG", "STAR", "LAMP", "TREE", "BOOK", "FISH", "MOON"];
  const word = words[Math.floor(Math.random() * words.length)]!;
  const letters = word.split("");
  shuffleInPlace(letters);
  const scrambled = letters.join("");
  const wrongPool = words.filter((w) => w !== word);
  shuffleInPlace(wrongPool);
  return withShuffledCorrect(
    `Unscramble: ${scrambled}`,
    "scramble",
    word,
    wrongPool.slice(0, 3),
  );
}

function miniMemory(): ChaosDashPuzzle {
  const symbols = ["⭐", "🔵", "🟢", "🔺", "💜", "🍀"];
  shuffleInPlace(symbols);
  const seq = symbols.slice(0, 3);
  const prompt = `Remember: ${seq.join(" ")} — tap the MIDDLE symbol`;
  const correct = seq[1]!;
  const wrong = symbols.filter((s) => s !== correct).slice(0, 3);
  return withShuffledCorrect(prompt, "memory", correct, wrong);
}

const GENERATORS = [mathSprint, oddOneOut, stroop, higherLower, letterScramble, miniMemory];

export function generateChaosDash(): ChaosDashPuzzle {
  const gen = GENERATORS[Math.floor(Math.random() * GENERATORS.length)]!;
  return gen();
}
