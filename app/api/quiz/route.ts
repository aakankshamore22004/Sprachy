import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? "" });

export async function POST(req: NextRequest) {
  try {
    const { category, level, count = 5 } = await req.json();

    const categoryInstructions: Record<string, string> = {
      vocabulary: `Generate German vocabulary multiple-choice questions. Each question tests whether the learner knows what a German word or phrase means. Format: question asks "What does '...' mean?" with 4 English options.`,
      grammar: `Generate German grammar multiple-choice questions. Test things like: verb conjugation, sentence structure, modal verbs, cases (Nominativ/Akkusativ/Dativ). Show incomplete German sentences with 4 choices to fill the blank.`,
      articles: `Generate questions about German articles (der/die/das) for nouns. Question: "What is the correct article for '[noun]'?" Choices: der / die / das / des.`,
      conjugation: `Generate German verb conjugation questions. Show a verb + subject pronoun and ask which conjugation is correct. E.g., "ich ___ (haben)" → habe / bist / hat / haben.`,
    };

    const instrText = categoryInstructions[category] ?? categoryInstructions.vocabulary;

    const systemPrompt = `You are a German language teacher creating quiz questions.
Level: ${level ?? "beginner"}.
Category: ${category}.

${instrText}

Generate exactly ${count} questions. Return ONLY a JSON array with this structure:
[
  {
    "id": "q1",
    "question": "<the question text>",
    "options": ["<option A>", "<option B>", "<option C>", "<option D>"],
    "answer": "<the exact text of the correct option>",
    "explanation": "<brief friendly explanation of why this is correct>"
  }
]

Rules:
- Each question must have exactly 4 options.
- "answer" must be exactly one of the 4 options strings.
- For beginner: use A1-A2 vocabulary. For intermediate: A2-B1. For hard: B1-C1.
- Return ONLY the JSON array, no markdown fences, no extra text.`;

    let attempt = 0;
    const maxAttempts = 3;
    let raw = "";

    while (attempt < maxAttempts) {
      try {
        const response = await ai.models.generateContent({
          model: process.env.GEMINI_MODEL ?? "gemini-3-flash-preview",
          contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
          config: { temperature: 0.7 },
        });
        raw = (response.text ?? "").trim();
        break;
      } catch (e: any) {
        if ((e.status === 503 || e.status === 429) && attempt < maxAttempts - 1) {
          attempt++;
          const delayMs = attempt * 1500;
          console.warn(`Gemini API busy (status ${e.status}). Retrying in ${delayMs}ms...`);
          await new Promise(r => setTimeout(r, delayMs));
          continue;
        }
        throw e;
      }
    }
    
    const clean = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
    const questions = JSON.parse(clean);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("/api/quiz error:", error);
    return NextResponse.json(
      { error: "Quiz generation failed. Please try again." },
      { status: 500 }
    );
  }
}
