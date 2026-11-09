import type { BoardSize } from "./dice.ts";
import { getDictionary } from "./dictionary.ts";
import { MIN_WORD_LEN } from "./protocol.ts";
import { areAdjacent } from "./path.ts";

interface TrieNode {
  kids: Map<string, TrieNode>;
  word: boolean;
}

let trie: TrieNode | null = null;

function emptyNode(): TrieNode {
  return { kids: new Map(), word: false };
}

function getTrie(): TrieNode {
  if (trie) return trie;
  const root = emptyNode();
  for (const word of getDictionary()) {
    let node = root;
    for (const ch of word) {
      let next = node.kids.get(ch);
      if (!next) {
        next = emptyNode();
        node.kids.set(ch, next);
      }
      node = next;
    }
    node.word = true;
  }
  trie = root;
  return root;
}

function cellLetters(cell: string): string {
  return cell === "Qu" ? "qu" : cell.toLowerCase();
}

/** All dictionary words of length ≥ MIN_WORD_LEN findable on the board. */
export function findAllWords(board: string[], size: BoardSize): string[] {
  const n = size * size;
  if (board.length !== n) return [];

  const root = getTrie();
  const found = new Set<string>();
  const used = new Uint8Array(n);

  const visit = (idx: number, node: TrieNode, built: string): void => {
    used[idx] = 1;
    const letters = cellLetters(board[idx]!);
    let cur: TrieNode | undefined = node;
    for (const ch of letters) {
      cur = cur.kids.get(ch);
      if (!cur) {
        used[idx] = 0;
        return;
      }
    }
    const nextBuilt = built + letters;
    if (cur.word && nextBuilt.length >= MIN_WORD_LEN) {
      found.add(nextBuilt);
    }
    for (let j = 0; j < n; j++) {
      if (used[j]) continue;
      if (!areAdjacent(size, idx, j)) continue;
      visit(j, cur, nextBuilt);
    }
    used[idx] = 0;
  };

  for (let i = 0; i < n; i++) {
    visit(i, root, "");
  }

  return [...found];
}

/** Cap for WS/TV payloads — longest first, then alpha. */
export const MISSED_WORDS_CAP = 120;

export function computeMissedWords(
  board: string[],
  size: BoardSize,
  foundByPlayers: Iterable<string>,
): string[] {
  const found = new Set(foundByPlayers);
  const missed = findAllWords(board, size).filter((w) => !found.has(w));
  missed.sort((a, b) => b.length - a.length || a.localeCompare(b));
  return missed.slice(0, MISSED_WORDS_CAP);
}
