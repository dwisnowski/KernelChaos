import type { BoardSize } from "./dice.ts";
import { getDictionary } from "./dictionary.ts";
import {
  MIN_WORD_LEN,
  type LengthBucketKey,
  type LengthCount,
} from "./protocol.ts";
import { areAdjacent } from "./path.ts";

const LENGTH_ORDER: LengthBucketKey[] = ["3", "4", "5", "6", "7", "8+"];

function bucketKeyForLength(len: number): LengthBucketKey | null {
  if (len < MIN_WORD_LEN) return null;
  if (len >= 8) return "8+";
  return String(len) as LengthBucketKey;
}

function countByLength(words: Iterable<string>): LengthCount[] {
  const counts = new Map<LengthBucketKey, number>();
  for (const key of LENGTH_ORDER) counts.set(key, 0);
  for (const word of words) {
    const key = bucketKeyForLength(word.length);
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return LENGTH_ORDER.map((key) => ({
    key,
    count: counts.get(key) ?? 0,
  })).filter((b) => b.count > 0);
}

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

export interface BoardWordCoverage {
  missedWords: string[];
  possibleWordCount: number;
  possibleByLength: LengthCount[];
}

/** One solve pass: capped misses + full board coverage totals. */
export function computeBoardCoverage(
  board: string[],
  size: BoardSize,
  foundByPlayers: Iterable<string>,
): BoardWordCoverage {
  const all = findAllWords(board, size);
  const found = new Set(foundByPlayers);
  const missed = all.filter((w) => !found.has(w));
  missed.sort((a, b) => b.length - a.length || a.localeCompare(b));
  return {
    missedWords: missed.slice(0, MISSED_WORDS_CAP),
    possibleWordCount: all.length,
    possibleByLength: countByLength(all),
  };
}

