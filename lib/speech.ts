"use client";

/**
 * Browser-based German speech helpers using the Web Speech API.
 * - STT: SpeechRecognition (de-DE) for mic input.
 * - TTS: speechSynthesis for German audio playback + slow replay.
 *
 * These run only in the browser. If the APIs are unavailable (older
 * browsers), the UI gracefully falls back to text-only input.
 */

// The Web Speech API types aren't in the standard lib. Use a loose constructor type.
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;
type AnyWindow = typeof window & {
  SpeechRecognition?: SpeechRecognitionCtor;
  webkitSpeechRecognition?: SpeechRecognitionCtor;
};

// Minimal shape of the parts of SpeechRecognition we use.
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: unknown) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
}

export function isSTTSupported(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as AnyWindow;
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
}

export function isTTSSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export interface STTHandlers {
  onResult: (transcript: string) => void;
  onError?: (message: string) => void;
  onEnd?: () => void;
}

/**
 * Start listening for German speech. Returns a stop() function.
 * Throws if unsupported — caller should guard with isSTTSupported().
 */
export function startListening(handlers: STTHandlers): () => void {
  const w = window as AnyWindow;
  const Ctor: SpeechRecognitionCtor | undefined =
    w.SpeechRecognition || w.webkitSpeechRecognition;
  if (!Ctor) throw new Error("Speech recognition is not supported in this browser.");

  const recognition = new Ctor();
  recognition.lang = "de-DE";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;

  let finalTranscript = "";

  recognition.onresult = (event: unknown) => {
    const e = event as {
      resultIndex: number;
      results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>;
    };
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const result = e.results[i];
      if (result.isFinal) finalTranscript += result[0].transcript;
    }
  };
  recognition.onerror = (event: unknown) => {
    const e = event as { error?: string };
    handlers.onError?.(e.error || "Speech recognition error");
  };
  recognition.onend = () => {
    handlers.onResult?.(finalTranscript.trim());
    handlers.onEnd?.();
  };

  recognition.start();
  return () => {
    try {
      recognition.stop();
    } catch {
      /* noop */
    }
  };
}

let cachedGermanVoice: SpeechSynthesisVoice | null | undefined;

function pickGermanVoice(): SpeechSynthesisVoice | null {
  if (!isTTSSupported()) return null;
  if (cachedGermanVoice !== undefined) return cachedGermanVoice;
  const voices = window.speechSynthesis.getVoices();
  // Prefer a de-DE voice, then any de-* voice.
  cachedGermanVoice =
    voices.find((v) => v.lang === "de-DE") ||
    voices.find((v) => v.lang.toLowerCase().startsWith("de")) ||
    null;
  return cachedGermanVoice;
}

/** Some browsers populate voices asynchronously. Call once on mount. */
export function primeVoices(): void {
  if (!isTTSSupported()) return;
  // Trigger a read so the onvoiceschanged event can fire.
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedGermanVoice = undefined;
    pickGermanVoice();
  };
}

export function speakGerman(text: string, opts?: { slow?: boolean }): void {
  if (!isTTSSupported() || !text.trim()) return;
  const synth = window.speechSynthesis;
  synth.cancel(); // stop anything in progress
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "de-DE";
  const voice = pickGermanVoice();
  if (voice) utter.voice = voice;
  utter.rate = opts?.slow ? 0.6 : 0.95;
  utter.pitch = 1;
  synth.speak(utter);
}

export function stopSpeaking(): void {
  if (isTTSSupported()) window.speechSynthesis.cancel();
}
