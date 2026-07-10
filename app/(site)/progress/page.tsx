"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Loader2, Flame, Zap, Trophy, Star, BookOpen, PenLine, LayoutGrid } from "lucide-react";

const SKILLS = [
  { label: "Speaking",    pct: 72, color: "#6366F1" },
  { label: "Grammar",     pct: 55, color: "#10B981" },
  { label: "Vocabulary",  pct: 63, color: "#F59E0B" },
  { label: "Listening",   pct: 48, color: "#A78BFA" },
  { label: "Writing",     pct: 39, color: "#38BDF8" },
];

const BADGES = [
  { emoji: "🔥", label: "First Streak",    earned: true  },
  { emoji: "⭐", label: "10 XP",           earned: true  },
  { emoji: "🎯", label: "Quiz Master",     earned: false },
  { emoji: "✍️", label: "Writer",          earned: false },
  { emoji: "📚", label: "Flashcard Fan",   earned: false },
  { emoji: "🏆", label: "Level Up",        earned: false },
];

const CEFR = ["A1","A2","B1","B2","C1","C2"];

export default function ProgressPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !profile) return (
    <div className="flex min-h-[60dvh] items-center justify-center">
      <Loader2 size={24} className="animate-spin text-brand" />
    </div>
  );

  const xp = profile.xp ?? 0;
  const level = profile.level ?? "beginner";
  const cefrIdx = level === "beginner" ? 0 : level === "intermediate" ? 2 : 4;
  const levelPct = Math.min(100, ((xp % 500) / 500) * 100);

  return (
    <div className="mx-auto max-w-xl px-4 py-8 space-y-5 animate-fade-rise">
      <div className="text-center mb-2">
        <div className="chip mx-auto mb-3">📊 Progress</div>
        <h1 className="text-2xl font-extrabold text-ink">Your Progress</h1>
        <p className="mt-1 text-sm text-ink-muted">Track your German learning journey</p>
      </div>

      {/* XP & Level */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Current Level</p>
            <p className="text-3xl font-extrabold gradient-text mt-0.5">CEFR {CEFR[cefrIdx]}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Total XP</p>
            <p className="text-3xl font-extrabold text-accent mt-0.5">{xp}</p>
          </div>
        </div>
        <div className="h-2 rounded-full overflow-hidden bg-line/50">
          <div
            className="h-full rounded-full transition-all duration-700 bg-brand"
            style={{ width: `${levelPct}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs text-ink-muted text-right">{Math.max(0, 500 - (xp % 500))} XP to next level</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Flame,  val: `${profile.streak ?? 0}d`, label: "Streak",  color: "#B4632A", bg: "#F0E4D6" },
          { icon: Zap,    val: String(xp),                label: "XP",      color: "#16140F", bg: "#EFEAE0" },
          { icon: Trophy, val: "1",                       label: "Badges",  color: "#5C7C5A", bg: "#E8F0E7" },
        ].map(({ icon: Icon, val, label, color, bg }) => (
          <div key={label} className="card p-4 text-center">
            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl">
              <Icon size={16} />
            </div>
            <p className="text-lg font-extrabold text-ink">{val}</p>
            <p className="text-[11px] text-ink-muted">{label}</p>
          </div>
        ))}
      </div>

      {/* CEFR Path */}
      <div className="card p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-4">CEFR Roadmap</p>
        <div className="flex items-center justify-between">
          {CEFR.map((lvl, i) => (
            <div key={lvl} className="flex flex-col items-center gap-1.5">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition"
                style={
                  i < cefrIdx ? { background: "#E8F0E7", color: "#5C7C5A", border: "2px solid #5C7C5A" }
                  : i === cefrIdx ? { background: "#16140F", color: "#FFFFFF", border: "2px solid #16140F" }
                  : { background: "#EFEAE0", color: "#6B6256", border: "2px solid #E7E1D6" }
                }
              >
                {i <= cefrIdx ? (i < cefrIdx ? "✓" : lvl) : lvl}
              </div>
              {i === cefrIdx && <span className="text-[10px] font-bold text-brand-glow">You</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Skill bars */}
      <div className="card p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-4">Skill Breakdown</p>
        <div className="space-y-3">
          {SKILLS.map(({ label, pct, color }) => (
            <div key={label}>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs font-semibold text-ink">{label}</span>
                <span className="text-xs font-semibold">{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}AA)`, boxShadow: `0 0 6px ${color}60` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="card p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-4">Badges</p>
        <div className="grid grid-cols-3 gap-3">
          {BADGES.map(({ emoji, label, earned }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1.5 rounded-btn p-3 text-center"
              style={{
                background: earned ? "#EFEAE0" : "transparent",
                border: `1px solid ${earned ? "#B4632A" : "#E7E1D6"}`,
                opacity: earned ? 1 : 0.45,
              }}
            >
              <span className="text-2xl">{emoji}</span>
              <p className="text-[10px] font-semibold text-ink-muted">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Activity */}
      <div className="card p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-4">Recent Activity</p>
        <div className="space-y-2.5">
          {[
            { icon: BookOpen, label: "Vocabulary quiz", time: "Today", xp: "+20 XP", color: "#6366F1" },
            { icon: PenLine,  label: "Writing practice", time: "Yesterday", xp: "+15 XP", color: "#38BDF8" },
            { icon: LayoutGrid,label:"AI Conversation",  time: "2 days ago", xp: "+25 XP", color: "#10B981" },
            { icon: Star,     label: "Daily streak",     time: "3 days ago", xp: "+5 XP",  color: "#F59E0B" },
          ].map(({ icon: Icon, label, time, xp: xpStr, color }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: `${color}18`, color }}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-ink">{label}</p>
                <p className="text-[10px] text-ink-muted">{time}</p>
              </div>
              <span className="text-xs font-bold text-accent">{xpStr}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
