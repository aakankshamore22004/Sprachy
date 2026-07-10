// Shared types for the conversation feature.

export type Level = "beginner" | "intermediate" | "hard";

export interface Scenario {
  id: string;
  title: string;
  titleDe: string;
  emoji: string;
  description: string;
  /** The role the AI ("Lena") plays in the scene. */
  aiRole: string;
  /** The situation given to the AI as scene context. */
  scene: string;
}

export interface Correction {
  wrong: string;
  right: string;
  note?: string;
}

export interface NewVocab {
  de: string;
  en: string;
}

/** Structured payload the Gemini API must return for every turn. */
export interface AiTurn {
  /** Lena's German reply. */
  reply: string;
  /** English translation of the reply. */
  translation: string;
  /** A short, friendly tip for the learner (empty string allowed). */
  tip: string;
  /** Mistakes spotted in the user's last message. Empty array if none. */
  corrections: Correction[];
  /** Useful new vocabulary surfaced this turn. Empty array allowed. */
  newVocab: NewVocab[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  translation?: string;
  tip?: string;
  corrections?: Correction[];
  newVocab?: NewVocab[];
  /** Only user messages: the raw (pre-correction) text if mic input. */
  createdAt: number;
}
