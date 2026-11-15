import { useEffect, useState } from "react";
import {
  fetchWordDefinition,
  type WordDefinition,
} from "../lib/wordDefinition.ts";

export type WordDefinitionStatus = "idle" | "loading" | "ready" | "missing" | "error";

export type WordDefinitionState = {
  status: WordDefinitionStatus;
  definition: WordDefinition | null;
};

const idle: WordDefinitionState = { status: "idle", definition: null };

/** Load a gloss when `word` is set; aborts in-flight fetches on change/unmount. */
export function useWordDefinition(word: string | null): WordDefinitionState {
  const [state, setState] = useState<WordDefinitionState>(idle);

  useEffect(() => {
    if (!word) {
      setState(idle);
      return;
    }

    const controller = new AbortController();
    setState({ status: "loading", definition: null });

    void fetchWordDefinition(word, controller.signal)
      .then((definition) => {
        if (controller.signal.aborted) return;
        setState(
          definition
            ? { status: "ready", definition }
            : { status: "missing", definition: null },
        );
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        if (err instanceof DOMException && err.name === "AbortError") return;
        setState({ status: "error", definition: null });
      });

    return () => controller.abort();
  }, [word]);

  return state;
}
