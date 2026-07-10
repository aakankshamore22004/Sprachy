"use client";

import { Award, CheckCircle2, BookOpen, RefreshCw, Home, MessageSquare } from "lucide-react";
import type { ChatMessage, Correction, NewVocab } from "@/lib/types";

function aggregate(messages: ChatMessage[]) {
  const corrections: Correction[] = [];
  const vocab: NewVocab[] = [];
  const seenVocab = new Set<string>();

  for (const m of messages) {
    if (m.role === "assistant") {
      m.corrections?.forEach((c) => corrections.push(c));
      m.newVocab?.forEach((v) => {
        const key = v.de.toLowerCase();
        if (!seenVocab.has(key)) {
          seenVocab.add(key);
          vocab.push(v);
        }
      });
    }
  }
  const userTurns = messages.filter((m) => m.role === "user").length;
  // Engagement score: turns * 6 + vocab learned * 4 + clean turns bonus, capped 99.
  const cleanTurns = Math.max(0, userTurns - corrections.length);
  const raw = userTurns * 6 + vocab.length * 4 + cleanTurns * 3;
  const score = Math.min(99, Math.round(raw));

  return { corrections, vocab, userTurns, score };
}

export function SessionSummary({
  messages,
  scenarioTitle,
  onRestart,
  onHome,
}: {
  messages: ChatMessage[];
  scenarioTitle: string;
  onRestart: () => void;
  onHome: () => void;
}) {
  const { corrections, vocab, userTurns, score } = aggregate(messages);

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-5 py-10">
      <div className="card w-full animate-pop p-6 text-center">
        <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full bg-accent-soft text-accent">
          <Award size={34} />
        </div>
        <h2 className="text-xl font-extrabold text-ink">Toll gemacht! 🎉</h2>
        <p className="mt-1 text-sm text-ink-muted">
          {scenarioTitle} · {userTurns} {userTurns === 1 ? "turn" : "turns"}
        </p>

        {/* Score ring */}
        <div className="my-5 flex flex-col items-center">
          <ScoreRing value={score} />
          <p className="mt-2 text-xs font-medium text-ink-muted">Engagement score</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-left">
          <Stat
            icon={<CheckCircle2 size={16} className="text-success" />}
            label="Corrections"
            value={corrections.length}
          />
          <Stat
            icon={<BookOpen size={16} className="text-info" />}
            label="New words"
            value={vocab.length}
          />
        </div>

        {/* Corrections list */}
        {corrections.length > 0 && (
          <div className="mt-4 rounded-btn border border-line bg-canvas p-3 text-left">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Your corrections
            </p>
            <ul className="space-y-1.5">
              {corrections.slice(0, 6).map((c, i) => (
                <li key={i} className="text-xs">
                  <span className="text-error line-through">{c.wrong}</span>{" "}
                  <span className="text-ink-muted">→</span>{" "}
                  <span className="font-semibold text-success">{c.right}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Vocab list */}
        {vocab.length > 0 && (
          <div className="mt-3 rounded-btn border border-line bg-canvas p-3 text-left">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Words to remember
            </p>
            <div className="flex flex-wrap gap-1.5">
              {vocab.slice(0, 10).map((v, i) => (
                <span key={i} className="chip bg-surface border border-line text-ink">
                  <b className="text-brand">{v.de}</b>
                  <span className="text-ink-muted">— {v.en}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 flex gap-2">
          <button onClick={onRestart} className="btn-primary flex-1">
            <RefreshCw size={16} /> Again
          </button>
          <button onClick={onHome} className="btn-ghost flex-1 border border-line">
            <Home size={16} /> Home
          </button>
        </div>
      </div>

      <p className="mt-4 flex items-center gap-1 text-xs text-ink-muted">
        <MessageSquare size={12} /> Keep your streak — practice daily!
      </p>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-btn border border-line bg-canvas p-3">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-xs font-medium text-ink-muted">{label}</span>
      </div>
      <p className="mt-1 text-2xl font-extrabold text-ink">{value}</p>
    </div>
  );
}

function ScoreRing({ value }: { value: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative h-24 w-24">
      <svg className="h-24 w-24 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#E2E8F0" strokeWidth="7" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="#F59E0B"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="text-2xl font-extrabold text-ink">{value}</span>
      </div>
    </div>
  );
}
