import { GoogleGenAI, Type } from "@google/genai";
import type { AiTurn, Level, Scenario } from "./types";

/**
 * Server-side Gemini client. The API key is read from the environment and
 * never sent to the browser. All calls go through the /api/chat route.
 */

const LEVEL_DESCRIPTOR: Record<Level, { cefr: string; guidance: string }> = {
  beginner: {
    cefr: "A1",
    guidance:
      "Use very simple, short sentences (4–10 words). Basic everyday vocabulary, present tense only, der/die/das articles. One idea per sentence.",
  },
  intermediate: {
    cefr: "A2–B1",
    guidance:
      "Use everyday vocabulary and common tenses (present, Perfekt, Präteritum, future with 'werden'). Include modal verbs and simple subclauses (weil, dass, wenn). Sentences up to ~15 words.",
  },
  hard: {
    cefr: "B2–C1",
    guidance:
      "Use rich, idiomatic German with complex syntax: Konjunktiv II, passive voice, nested subclauses, advanced vocabulary and register appropriate to the scenario. Natural, native-like flow.",
  },
};

// JSON schema Gemini must respect for every reply.
export const AI_TURN_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    reply: {
      type: Type.STRING,
      description: "Lena's reply in German, at the learner's CEFR level.",
    },
    translation: {
      type: Type.STRING,
      description: "A natural English translation of the German reply.",
    },
    tip: {
      type: Type.STRING,
      description:
        "A short, friendly learning tip for the learner based on their last message. Empty string if nothing notable.",
    },
    corrections: {
      type: Type.ARRAY,
      description:
        "Grammar, spelling, or word-order mistakes in the learner's LAST message. Empty array if their message was correct.",
      items: {
        type: Type.OBJECT,
        properties: {
          wrong: { type: Type.STRING, description: "What the learner wrote." },
          right: {
            type: Type.STRING,
            description: "The corrected German version.",
          },
          note: {
            type: Type.STRING,
            description: "Optional one-line explanation in English.",
          },
        },
        required: ["wrong", "right"],
      },
    },
    newVocab: {
      type: Type.ARRAY,
      description:
        "1–3 useful German words/phrases that appeared this turn and are worth learning. Empty array allowed.",
      items: {
        type: Type.OBJECT,
        properties: {
          de: { type: Type.STRING, description: "German word or phrase." },
          en: { type: Type.STRING, description: "English meaning." },
        },
        required: ["de", "en"],
      },
    },
  },
  required: ["reply", "translation", "tip", "corrections", "newVocab"],
} as const;

function buildSystemInstruction(scenario: Scenario, level: Level): string {
  const lvl = LEVEL_DESCRIPTOR[level];
  return `You are "Lena", a warm, patient German language conversation partner and tutor.

# Your role in this scene
You are playing: ${scenario.aiRole}.
Scene: ${scenario.scene}

# The learner
CEFR level: ${lvl.cefr}.
Difficulty guidance: ${lvl.guidance}

# Rules
1. ALWAYS stay in character as ${scenario.aiRole}.
2. Reply in GERMAN at the learner's level (${lvl.cefr}).
3. Keep replies to 1–3 short sentences. One clear idea per turn to keep the learner engaged but not overwhelmed.
4. Be encouraging and natural — like a real conversation, not a textbook drill.
5. Gently advance the scene so the learner has something to respond to.
6. If the learner writes in English, gently reply in German and encourage them to try in German.
7. Correct major errors only (grammar, articles, word order, false friends). Do NOT nitpick minor things — keep it motivating.
8. Surface 1–3 genuinely useful new words per turn when relevant.
9. Your JSON "reply" is ONLY the German you say in character. Put teaching notes in "tip" and "corrections", never inside "reply".

Return strictly valid JSON matching the provided schema every single turn.`;
}

function buildHistoryContents(
  history: { role: "user" | "assistant"; text: string }[]
) {
  // Map our roles to Gemini roles: user -> "user", assistant -> "model".
  return history.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.text }],
  }));
}

export async function generateTurn(opts: {
  scenario: Scenario;
  level: Level;
  history: { role: "user" | "assistant"; text: string }[];
  userMessage: string;
  hint?: boolean;
}): Promise<AiTurn> {
  const apiKey = process.env.GEMINI_API_KEY;
  // gemini-2.0-flash has no free-tier quota on our key; 3-flash-preview works.
  const model = process.env.GEMINI_MODEL || "gemini-3-flash-preview";

  if (!apiKey) {
    const err = new Error(
      "GEMINI_API_KEY is not set. Add it to .env.local and restart the dev server."
    );
    (err as Error & { code?: number }).code = 500;
    throw err;
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = buildSystemInstruction(opts.scenario, opts.level);

  // Convert our structured history to plain model/user turns.
  const contents = buildHistoryContents(opts.history);

  const userText = opts.hint
    ? `[LEHRER-HINWEIS / off-character] Der Lernende braucht einen Tipp. Gib EINEN kurzen deutschen Satz vor, den er jetzt sagen könnte (als Vorschlag), plus eine winzige englische Erklärung. Bleibe beim Thema der Szene.`
    : opts.userMessage;

  contents.push({ role: "user", parts: [{ text: userText }] });

  let attempt = 0;
  const maxAttempts = 3;
  let lastError: any = null;

  while (attempt < maxAttempts) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: AI_TURN_SCHEMA as unknown as Record<string, unknown>,
          temperature: 0.7,
        },
      });

      const raw = response.text ?? "";

      let parsed: AiTurn;
      try {
        parsed = JSON.parse(raw) as AiTurn;
      } catch {
        // If Gemini returns malformed JSON, surface a safe fallback instead of crashing the chat.
        parsed = {
          reply: raw || "Entschuldigung, das habe ich nicht verstanden.",
          translation: "Sorry, I didn't quite catch that.",
          tip: "",
          corrections: [],
          newVocab: [],
        };
      }

      // Defensive defaults so the UI never hits undefined fields.
      return {
        reply: parsed.reply ?? "",
        translation: parsed.translation ?? "",
        tip: parsed.tip ?? "",
        corrections: Array.isArray(parsed.corrections) ? parsed.corrections : [],
        newVocab: Array.isArray(parsed.newVocab) ? parsed.newVocab : [],
      };
    } catch (e: any) {
      lastError = e;
      if ((e.status === 503 || e.status === 429) && attempt < maxAttempts - 1) {
        attempt++;
        const delayMs = attempt * 1500;
        console.warn(`Gemini API busy (status ${e.status}). Retrying in ${delayMs}ms (attempt ${attempt + 1}/${maxAttempts})...`);
        await new Promise(r => setTimeout(r, delayMs));
        continue;
      }
      throw e;
    }
  }
  
  throw lastError;
}
