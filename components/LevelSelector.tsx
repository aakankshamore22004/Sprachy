"use client";

import type { Level } from "@/lib/types";

const LEVELS: {
  id: Level;
  label: string;
  cefr: string;
  desc: string;
}[] = [
  { id: "beginner", label: "Beginner", cefr: "A1", desc: "Simple words & present tense" },
  { id: "intermediate", label: "Intermediate", cefr: "A2–B1", desc: "Everyday talk, past & future" },
  { id: "hard", label: "Hard", cefr: "B2–C1", desc: "Idiomatic, complex & fluent" },
];

export function LevelSelector({
  selected,
  onSelect,
}: {
  selected: Level | null;
  onSelect: (l: Level) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {LEVELS.map((l) => {
        const active = selected === l.id;
        return (
          <button
            key={l.id}
            type="button"
            onClick={() => onSelect(l.id)}
            aria-pressed={active}
            className={`flex items-center gap-3 rounded-btn border p-3 text-left transition active:scale-[0.99]
              ${active
                ? "border-brand bg-brand-soft shadow-brand"
                : "border-line bg-surface hover:border-brand/40 hover:bg-brand-soft/50"}`}
          >
            <span
              className={`chip shrink-0 ${active ? "bg-brand text-white" : "bg-brand-soft text-brand"}`}
            >
              {l.cefr}
            </span>
            <span className="flex flex-col">
              <span className={`text-sm font-semibold ${active ? "text-brand" : "text-ink"}`}>
                {l.label}
              </span>
              <span className="text-xs text-ink-muted">{l.desc}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
