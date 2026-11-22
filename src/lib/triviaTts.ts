import { isMuted } from "../audio/sfx.ts";

let speaking = false;

export function cancelTriviaSpeech(): void {
  speaking = false;
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

export function speakTriviaClue(opts: { category: string; prompt: string }): void {
  if (typeof window === "undefined") return;
  if (isMuted()) return;
  if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === "undefined") return;
  const text = [opts.category, opts.prompt].filter(Boolean).join(". ").trim();
  if (!text) return;
  cancelTriviaSpeech();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1;
  utter.pitch = 1;
  speaking = true;
  utter.onend = () => {
    speaking = false;
  };
  utter.onerror = () => {
    speaking = false;
  };
  window.speechSynthesis.speak(utter);
}

export function isTriviaSpeechActive(): boolean {
  return speaking;
}
