const reported = new Set<string>();

/** Fire-and-forget: record a Free Dictionary miss for later dictionary cleanup. */
export function reportUndefinedWord(word: string): void {
  const key = word.trim().toLowerCase();
  if (!key || reported.has(key)) return;
  reported.add(key);

  void fetch("/api/boggle/undefined-words", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ word: key }),
  }).catch(() => {
    /* reporting must never affect play / TV UI */
  });
}
