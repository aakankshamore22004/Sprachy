"use client";

import { SCENARIOS } from "@/lib/scenarios";
import type { Scenario } from "@/lib/types";

export function ScenarioPicker({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (s: Scenario) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {SCENARIOS.map((s) => {
        const active = selected === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s)}
            aria-pressed={active}
            className={`group flex flex-col items-start gap-1 rounded-card border p-3 text-left transition active:scale-[0.98]
              ${active
                ? "border-brand bg-brand-soft shadow-brand"
                : "border-line bg-surface hover:border-brand/40 hover:bg-brand-soft/50"}`}
          >
            <span className="text-2xl leading-none">{s.emoji}</span>
            <span className={`text-sm font-semibold ${active ? "text-brand" : "text-ink"}`}>
              {s.title}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">
              {s.titleDe}
            </span>
            <span className="mt-0.5 text-xs leading-snug text-ink-muted">
              {s.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
