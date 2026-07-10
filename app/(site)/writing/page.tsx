"use client";

import { useState } from "react";
import { Loader2, Send, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const PROMPTS = [
  { de: "Mein Wochenende", en: "Describe what you did last weekend in German (5+ sentences)." },
  { de: "Mein Lieblingsessen", en: "Write about your favourite food — what it is, why you love it, and where you eat it." },
  { de: "Meine Stadt", en: "Describe the city or town you live in. What's special about it?" },
  { de: "Ein typischer Tag", en: "Describe a typical day in your life from morning to evening." },
  { de: "Meine Zukunftspläne", en: "Write about your plans for the future — career, travel, or personal goals." },
];

interface GradeResult {
  score: number;
  overall_feedback: string;
  grammar: { error: string; fix: string; explanation: string }[];
  vocab_suggestions: { word: string; better: string; note: string }[];
  improved_version: string;
  strengths: string[];
}

function ScoreRing({ score }: { score: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444";
  return (
    <div className="relative flex h-24 w-24 items-center justify-center flex-shrink-0">
      <svg className="-rotate-90" width="96" height="96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#E7E1D6" strokeWidth="7" />
        <circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
      </svg>
      <div className="absolute text-center">
        <p className="text-2xl font-extrabold">{score}</p>
        <p className="text-[10px] text-ink-muted">/ 100</p>
      </div>
    </div>
  );
}

export default function WritingPage() {
  const { profile, updateUserProfile } = useAuth();
  const [prompt] = useState(() => PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  const [text, setText] = useState("");
  const [result, setResult] = useState<GradeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (text.trim().length < 20) { setError("Write at least 20 characters."); return; }
    setError(""); setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, prompt: prompt.en, level: "beginner" }),
      });
      if (!res.ok) throw new Error("Grading failed");
      const graded = await res.json();
      setResult(graded);
      
      if (profile && graded.score) {
        const xpEarned = Math.round(graded.score / 2);
        if (xpEarned > 0) {
          updateUserProfile({ xp: profile.xp + xpEarned });
        }
      }
    } catch { setError("Grading failed. Please try again."); }
    finally { setLoading(false); }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 space-y-5 animate-fade-rise">
      {/* Header */}
      <div className="text-center">
        <div className="chip mx-auto mb-3">✍️ Writing Practice</div>
        <h1 className="text-2xl font-extrabold text-ink">AI Writing Grader</h1>
        <p className="mt-1.5 text-sm text-ink-muted">Write in German — get instant grammar feedback</p>
      </div>

      {/* Prompt card */}
      <div className="card p-5">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-info">Today&apos;s Prompt</p>
        <p className="text-lg font-extrabold text-ink">{prompt.de}</p>
        <p className="mt-1 text-sm text-ink-muted">{prompt.en}</p>
      </div>

      {/* Textarea */}
      {!result && (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Schreibe hier auf Deutsch…"
            rows={7}
            className="input resize-none text-sm leading-relaxed"
           
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-muted">{text.length} chars</span>
            {error && <span className="text-xs text-error">{error}</span>}
          </div>
          <button onClick={submit} disabled={loading || text.trim().length < 20} className="btn-primary w-full py-3">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Grading…</> : <><Send size={15} /> Grade my writing</>}
          </button>
        </>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fade-rise">
          {/* Score */}
          <div className="card p-5 flex items-start gap-5">
            <ScoreRing score={result.score} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-1.5">Overall Feedback</p>
              <p className="text-sm leading-relaxed text-ink">{result.overall_feedback}</p>
            </div>
          </div>

          {/* Strengths */}
          {result.strengths?.length > 0 && (
            <div className="card p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-success">Strengths</p>
              <ul className="space-y-1.5">
                {result.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink">
                    <CheckCircle size={14} className="text-success mt-0.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Grammar */}
          {result.grammar?.length > 0 && (
            <div className="card p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-error">Grammar Corrections</p>
              <div className="space-y-3">
                {result.grammar.map((g, i) => (
                  <div key={i} className="text-sm">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="line-through text-error opacity-70">{g.error}</span>
                      <span className="text-ink-muted">→</span>
                      <span className="font-semibold text-success">{g.fix}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-ink-muted">{g.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Improved version */}
          {result.improved_version && (
            <div className="card p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-glow">Improved Version</p>
              <p className="text-sm leading-relaxed text-ink whitespace-pre-wrap">{result.improved_version}</p>
            </div>
          )}

          <button onClick={() => { setResult(null); setText(""); }} className="btn-ghost w-full gap-2">
            <RefreshCw size={14} /> Try another prompt
          </button>
        </div>
      )}
    </div>
  );
}
