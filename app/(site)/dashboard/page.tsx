"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MessageSquare, PenLine, BookOpen, LayoutGrid,
  BarChart3, Flame, Zap, ArrowRight, TrendingUp,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const FEATURES = [
  { icon: MessageSquare, label: "Practice",   sub: "AI Conversation",  href: "/practice", color: "#B4632A", soft: "#F0E4D6" },
  { icon: PenLine,       label: "Writing",    sub: "Grammar Grading",  href: "/writing",      color: "#5B7A8C", soft: "#EBF2F6" },
  { icon: LayoutGrid,    label: "Quizzes",    sub: "4 Categories",     href: "/quizzes",      color: "#5C7C5A", soft: "#E8F0E7" },
  { icon: BookOpen,      label: "Flashcards", sub: "Spaced Repetition",href: "/flashcards",   color: "#D97757", soft: "#FDF2EF" },
];

const LEVEL_LABELS: Record<string, string> = {
  beginner:     "Beginner (A1)",
  intermediate: "Intermediate (A2–B1)",
  hard:         "Advanced (B2–C1)",
};

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !profile) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Guten Morgen" : hour < 17 ? "Guten Tag" : "Guten Abend";
  const firstName = profile.name?.split(" ")[0] ?? "Learner";
  const xp = profile.xp ?? 0;
  const levelPct = Math.min(100, ((xp % 500) / 500) * 100);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">

      {/* ── Greeting hero ──────────────────────────────────── */}
      <div
        className="card relative overflow-hidden p-6 animate-fade-rise"
       
      >
        {/* Decorative blob */}
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-30"
         
        />

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-1">
              {LEVEL_LABELS[profile.level] ?? "Beginner"}
            </p>
            <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">
              {greeting},{" "}
              <span className="gradient-text">{firstName}!</span>
            </h1>
            <p className="mt-1.5 text-sm text-ink-muted">
              Ready to practise some German today?
            </p>

            {/* XP bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1 text-xs font-semibold text-ink-muted">
                  <Zap size={12} className="text-accent" />
                  {xp} XP
                </span>
                <span className="text-xs text-ink-muted">
                  {Math.max(0, 500 - (xp % 500))} XP to next level
                </span>
              </div>
              <div className="h-2 w-full rounded-full overflow-hidden bg-line/50">
                <div
                  className="h-full rounded-full transition-all duration-700 bg-brand"
                  style={{
                    width: `${levelPct}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Streak */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div
              className="relative flex h-16 w-16 items-center justify-center rounded-full"
              style={{
                background: "#F0E4D6",
                border: "2px solid rgba(180,99,42,0.4)",
              }}
            >
              <Flame size={24} className="text-accent" />
            </div>
            <span className="text-xs font-bold text-accent">
              {profile.streak ?? 0}d streak
            </span>
          </div>
        </div>
      </div>

      {/* ── Stats row ──────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Flame,      val: `${profile.streak ?? 0}d`, label: "Streak",    color: "#B4632A" },
          { icon: Zap,        val: String(xp),                label: "Total XP",  color: "#16140F" },
          { icon: TrendingUp, val: profile.level === "beginner" ? "A1" : profile.level === "intermediate" ? "B1" : "C1", label: "CEFR Level", color: "#5C7C5A" },
        ].map(({ icon: Icon, val, label, color }) => (
          <div key={label} className="card p-3 text-center">
            <Icon size={18} className="mx-auto mb-1" />
            <p className="text-lg font-extrabold text-ink">{val}</p>
            <p className="text-[11px] text-ink-muted">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Quick start ────────────────────────────────────── */}
      <div>
        <h2 className="mb-3 text-sm font-bold text-ink-muted uppercase tracking-wider">Continue Learning</h2>
        <Link
          href="/practice"
          className="group card flex items-center gap-4 p-4 transition hover:-translate-y-0.5"
         
        >
          <div
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
           
          >
            <MessageSquare size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-ink">AI Conversation with Lena</p>
            <p className="text-xs text-ink-muted mt-0.5">Pick a scenario and start speaking German</p>
          </div>
          <ArrowRight size={18} className="text-ink-muted transition group-hover:text-brand group-hover:translate-x-1" />
        </Link>
      </div>

      {/* ── Feature grid ───────────────────────────────────── */}
      <div>
        <h2 className="mb-3 text-sm font-bold text-ink-muted uppercase tracking-wider">All Features</h2>
        <div className="grid grid-cols-2 gap-3">
          {FEATURES.map(({ icon: Icon, label, sub, href, color, soft }) => (
            <Link
              key={href}
              href={href}
              className="card group flex flex-col p-5 transition hover:-translate-y-0.5"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl">
                <Icon size={20} />
              </div>
              <p className="font-bold text-ink text-sm">{label}</p>
              <p className="mt-0.5 text-xs text-ink-muted">{sub}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Progress link ───────────────────────────────────── */}
      <Link
        href="/progress"
        className="flex items-center justify-between card p-4 transition hover:-translate-y-0.5"
       
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl">
            <BarChart3 size={18} />
          </div>
          <div>
            <p className="font-bold text-ink text-sm">View full progress</p>
            <p className="text-xs text-ink-muted">Skill bars, badges & analytics</p>
          </div>
        </div>
        <ArrowRight size={16} className="text-ink-muted" />
      </Link>
    </div>
  );
}
