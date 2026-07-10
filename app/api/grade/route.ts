import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? "" });

export async function POST(req: NextRequest) {
  try {
    const { text, prompt, level } = await req.json();
    if (!text || !prompt) {
      return NextResponse.json({ error: "text and prompt are required" }, { status: 400 });
    }

    const systemPrompt = `You are an expert German language teacher grading a student's written German.
Level: ${level ?? "beginner"}.

The student was given this writing prompt:
"${prompt}"

They wrote:
"${text}"

Grade their writing and return a JSON object with this exact structure:
{
  "score": <number 0-100>,
  "overall_feedback": "<2-3 sentence encouraging overall assessment>",
  "grammar": [
    {
      "error": "<the exact error text from their writing>",
      "fix": "<corrected version>",
      "explanation": "<brief, friendly explanation in English>"
    }
  ],
  "vocab_suggestions": [
    {
      "word": "<a word they used>",
      "better": "<a more precise/native word>",
      "note": "<why this is better>"
    }
  ],
  "improved_version": "<a fully rewritten, corrected version of their text in German>",
  "strengths": ["<strength 1>", "<strength 2>"]
}

Rules:
- Be encouraging, not harsh. Focus on 2-3 major corrections maximum for beginners.
- "score" should be between 40-95 (never give a crushing score to learners).
- grammar array: max 4 items.
- vocab_suggestions: max 3 items.
- Return ONLY the JSON object, no markdown fences, no extra text.`;

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

    // Strip markdown fences if present
    const clean = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("/api/grade error:", error);
    return NextResponse.json(
      { error: "Grading failed. Please try again." },
      { status: 500 }
    );
  }
}
