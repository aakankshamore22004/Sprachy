"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, Trophy, RotateCcw, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

const CAT_META: Record<string, { label: string; emoji: string; color: string; soft: string }> = {
  vocabulary:  { label: "Vocabulary",  emoji: "📚", color: "#B4632A", soft: "#F0E4D6" },
  grammar:     { label: "Grammar",     emoji: "📝", color: "#5C7C5A", soft: "#E8F0E7" },
  articles:    { label: "Articles",    emoji: "🏷️", color: "#D97757", soft: "#FDF2EF" },
  conjugation: { label: "Conjugation", emoji: "🔤", color: "#5B7A8C", soft: "#EBF2F6" },
};

interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export default function QuizSessionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { profile, updateUserProfile } = useAuth();
  const meta = CAT_META[id] ?? CAT_META.vocabulary;

  const [level] = useState("beginner");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  useEffect(() => { loadQuiz(); }, [id]);

  async function loadQuiz() {
    setLoading(true); setError(""); setQuestions([]); setIdx(0); setSelected(null); setScore(0); setDone(false); setAnswers([]);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: id, level, count: 8 }),
      });
      if (!res.ok) throw new Error("Quiz generation failed");
      const data = await res.json();
      setQuestions(data.questions ?? []);
    } catch { setError("Failed to generate quiz. Please try again."); }
    finally { setLoading(false); }
  }

  function pick(opt: string) {
    if (selected) return;
    setSelected(opt);
    const correct = opt === questions[idx].answer;
    if (correct) setScore((s) => s + 1);
    setAnswers((a) => [...a, correct]);
  }

  function next() {
    if (idx + 1 >= questions.length) { 
      setDone(true); 
      if (profile && score > 0) {
        updateUserProfile({ xp: profile.xp + (score * 10) });
      }
      return; 
    }
    setIdx((i) => i + 1); setSelected(null);
  }

  const current = questions[idx];
  const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;

  if (loading) return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-3">
      <Loader2 size={28} className="animate-spin text-brand" />
      <p className="text-sm text-ink-muted">Generating quiz…</p>
    </div>
  );

  if (error) return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-4">
      <p className="text-sm text-error">{error}</p>
      <button onClick={loadQuiz} className="btn-primary">Try again</button>
    </div>
  );

  if (done) return (
    <div className="mx-auto max-w-sm px-4 py-12 text-center animate-fade-rise">
      <div
        className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full"
        style={{ background: pct >= 70 ? "#E8F0E7" : "#F0E4D6", border: `2px solid ${pct >= 70 ? "#5C7C5A" : "#B4632A"}` }}
      >
        <Trophy size={36} />
      </div>
      <h2 className="text-2xl font-extrabold text-ink mb-1">{pct >= 80 ? "Excellent!" : pct >= 60 ? "Good job!" : "Keep practising!"}</h2>
      <p className="text-ink-muted mb-5">You scored <strong className="text-ink">{score}/{questions.length}</strong> ({pct}%)</p>

      <div className="card mb-6 p-4 grid grid-cols-2 gap-3">
        {answers.map((correct, i) => (
          <div key={i} className={`flex items-center gap-2 text-xs font-medium rounded-btn px-2 py-1.5 ${correct ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}>
            {correct ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
            Question {i + 1}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <button onClick={loadQuiz} className="btn-primary w-full gap-2"><RotateCcw size={14} />New quiz</button>
        <Link href="/quizzes" className="btn-ghost w-full">All categories</Link>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-sm px-4 py-8 animate-fade-rise">
      {/* Progress header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{meta.emoji}</span>
            <span className="text-sm font-bold text-ink">{meta.label}</span>
          </div>
          <span className="text-xs font-medium text-ink-muted">{idx + 1} / {questions.length}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden bg-line/50">
          <div
            className="h-full rounded-full transition-all duration-500 bg-brand"
            style={{ width: `${((idx + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="card p-5 mb-4">
        <p className="text-base font-semibold text-ink leading-relaxed">{current.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-2 mb-4">
        {current.options.map((opt) => {
          const isCorrect = opt === current.answer;
          const isSelected = opt === selected;
          let bg = "transparent";
          let border = "#E7E1D6";
          let textCls = "text-ink";
          if (selected) {
            if (isCorrect) { bg = "#E8F0E7"; border = "#5C7C5A"; textCls = "text-success"; }
            else if (isSelected) { bg = "#F8E9E8"; border = "#B4423A"; textCls = "text-error"; }
          }
          return (
            <button
              key={opt}
              onClick={() => pick(opt)}
              disabled={!!selected}
              className={`w-full flex items-center gap-3 rounded-btn px-4 py-3 text-left text-sm font-medium transition ${textCls} ${!selected ? "hover:bg-brand-soft hover:border-brand/40" : ""}`}
              style={{ background: bg, border: `1px solid ${border}` }}
            >
              {selected && isCorrect && <CheckCircle2 size={14} className="flex-shrink-0 text-success" />}
              {selected && isSelected && !isCorrect && <XCircle size={14} className="flex-shrink-0 text-error" />}
              {(!selected || (!isCorrect && !isSelected)) && (
                <span
                  className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                 
                >
                  {["A","B","C","D"][current.options.indexOf(opt)]}
                </span>
              )}
              {opt}
            </button>
          );
        })}
      </div>

      {/* Explanation + Next */}
      {selected && (
        <div className="animate-slide-up space-y-3">
          <div
            className="rounded-btn p-3 text-xs leading-relaxed text-ink-muted"
           
          >
            💡 {current.explanation}
          </div>
          <button onClick={next} className="btn-primary w-full gap-2">
            {idx + 1 >= questions.length ? "See results" : "Next question"}
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
