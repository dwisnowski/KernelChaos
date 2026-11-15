const DICTIONARY_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";

export type WordSense = {
  partOfSpeech: string;
  definition: string;
};

export type WordDefinition = {
  word: string;
  phonetic: string | null;
  senses: WordSense[];
};

type ApiEntry = {
  word?: string;
  phonetic?: string;
  phonetics?: { text?: string }[];
  meanings?: {
    partOfSpeech?: string;
    definitions?: { definition?: string }[];
  }[];
};

const MAX_SENSES = 2;

/** Fetch a short English gloss for a Boggle word (Free Dictionary API). */
export async function fetchWordDefinition(
  word: string,
  signal?: AbortSignal,
): Promise<WordDefinition | null> {
  const query = word.trim().toLowerCase();
  if (!query) return null;

  const res = await fetch(`${DICTIONARY_URL}/${encodeURIComponent(query)}`, { signal });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Dictionary lookup failed (${res.status})`);

  const data = (await res.json()) as ApiEntry[];
  if (!Array.isArray(data) || data.length === 0) return null;

  const senses: WordSense[] = [];
  let phonetic: string | null = null;

  for (const entry of data) {
    if (!phonetic) {
      phonetic =
        entry.phonetic?.trim() ||
        entry.phonetics?.find((p) => p.text?.trim())?.text?.trim() ||
        null;
    }
    for (const meaning of entry.meanings ?? []) {
      const pos = meaning.partOfSpeech?.trim() || "word";
      for (const def of meaning.definitions ?? []) {
        const text = def.definition?.trim();
        if (!text) continue;
        senses.push({ partOfSpeech: pos, definition: text });
        if (senses.length >= MAX_SENSES) {
          return {
            word: entry.word?.trim() || query,
            phonetic,
            senses,
          };
        }
      }
    }
  }

  if (senses.length === 0) return null;
  return {
    word: data[0]?.word?.trim() || query,
    phonetic,
    senses,
  };
}
