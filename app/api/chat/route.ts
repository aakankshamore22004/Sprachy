import { NextResponse } from "next/server";
import { generateTurn } from "@/lib/gemini";
import { getScenario } from "@/lib/scenarios";
import type { Level } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatRequestBody {
  scenarioId?: string;
  level?: Level;
  /** Prior turns, oldest first. text = what each side actually said. */
  history?: { role: "user" | "assistant"; text: string }[];
  message?: string;
  hint?: boolean;
}

export async function POST(req: Request) {
  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { scenarioId, level, history = [], message = "", hint } = body;

  // --- validation ---
  if (!scenarioId) {
    return NextResponse.json({ error: "Missing scenarioId." }, { status: 400 });
  }
  const scenario = getScenario(scenarioId);
  if (!scenario) {
    return NextResponse.json(
      { error: `Unknown scenario: ${scenarioId}` },
      { status: 400 }
    );
  }
  const validLevels: Level[] = ["beginner", "intermediate", "hard"];
  if (!level || !validLevels.includes(level)) {
    return NextResponse.json({ error: "Missing or invalid level." }, { status: 400 });
  }
  if (!hint && !message.trim()) {
    return NextResponse.json(
      { error: "Message is required (or set hint: true)." },
      { status: 400 }
    );
  }
  if (!Array.isArray(history)) {
    return NextResponse.json({ error: "history must be an array." }, { status: 400 });
  }

  try {
    const turn = await generateTurn({
      scenario,
      level,
      history,
      userMessage: message,
      hint: Boolean(hint),
    });
    return NextResponse.json(turn);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    // Surface actionable guidance for the most common Gemini auth failures.
    const lower = message.toLowerCase();
    const looksLikeKeyIssue =
      lower.includes("api key") ||
      lower.includes("api_key") ||
      lower.includes("permission") ||
      lower.includes("unauthorized") ||
      lower.includes("403") ||
      lower.includes("401") ||
      lower.includes("invalid_api_key") ||
      lower.includes("gemini_api_key");

    if (lower.includes("gemini_api_key") || lower.includes("is not set")) {
      return NextResponse.json(
        {
          error:
            "Server is missing GEMINI_API_KEY. Add it to .env.local and restart `npm run dev`.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: looksLikeKeyIssue
          ? "Gemini rejected the request — your API key may be invalid or lack access. Check .env.local (keys usually look like AIza...)."
          : `Gemini request failed: ${message}`,
      },
      { status: 502 }
    );
  }
}
