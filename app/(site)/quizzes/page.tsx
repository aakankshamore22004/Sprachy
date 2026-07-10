"use client";

import Link from "next/link";
import { BookOpen, AlignLeft, Hash, MessageSquare, ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    id: "vocabulary",
    label: "Vocabulary",
    sub: "German word meanings",
    icon: BookOpen,
    color: "#B4632A",
    soft: "#F0E4D6",
    emoji: "📚",
  },
  {
    id: "grammar",
    label: "Grammar",
    sub: "Sentence structure & cases",
    icon: AlignLeft,
    color: "#5C7C5A",
    soft: "#E8F0E7",
    emoji: "📝",
  },
  {
    id: "articles",
    label: "Articles",
    sub: "der / die / das",
    icon: Hash,
    color: "#D97757",
    soft: "#FDF2EF",
    emoji: "🏷️",
  },
  {
    id: "conjugation",
    label: "Conjugation",
    sub: "Verb forms & tenses",
    icon: MessageSquare,
    color: "#5B7A8C",
    soft: "#EBF2F6",
    emoji: "🔤",
  },
];

export default function QuizzesPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-8 animate-fade-rise">
      <div className="text-center mb-8">
        <div className="chip mx-auto mb-3">🧠 Quizzes</div>
        <h1 className="text-2xl font-extrabold text-ink">Test Your German</h1>
        <p className="mt-1.5 text-sm text-ink-muted">
          AI-generated questions · earn XP · track progress
        </p>
      </div>

      <div className="space-y-3">
        {CATEGORIES.map(({ id, label, sub, icon: Icon, color, soft, emoji }) => (
          <Link
            key={id}
            href={`/quizzes/${id}`}
            className="group card flex items-center gap-4 p-5 transition hover:-translate-y-0.5"
          >
            {/* Icon */}
            <div
              className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl text-xl"
             
            >
              {emoji}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-ink">{label}</p>
              <p className="text-xs text-ink-muted mt-0.5">{sub}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
                  <span
                    key={lvl}
                    className="rounded-chip px-2 py-0.5 text-[10px] font-semibold"
                   
                  >
                    {lvl}
                  </span>
                ))}
              </div>
            </div>

            <ArrowRight
              size={18}
              className="flex-shrink-0 text-ink-muted transition group-hover:translate-x-1"
             
            />
          </Link>
        ))}
      </div>

      <div
        className="mt-6 rounded-card p-4 text-center text-sm text-ink-muted"
       
      >
        💡 Each quiz generates <strong className="text-ink">8 fresh questions</strong> powered by Gemini AI
      </div>
    </div>
  );
}
