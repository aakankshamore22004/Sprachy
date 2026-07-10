"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, MessageSquare } from "lucide-react";
import { ScenarioPicker } from "@/components/ScenarioPicker";
import { LevelSelector } from "@/components/LevelSelector";
import type { Level, Scenario } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

export default function PracticePage() {
  const router = useRouter();
  const { profile } = useAuth();
  
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [level, setLevel] = useState<Level | null>(profile?.level ?? "beginner");
  const ready = Boolean(scenario && level);

  function start() {
    if (!scenario || !level) return;
    router.push(`/conversation?${new URLSearchParams({ scenario: scenario.id, level })}`);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8 space-y-8 animate-fade-rise">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
          <MessageSquare size={28} />
        </div>
        <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">AI Conversation</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Pick a scenario and start speaking German with Lena.
        </p>
      </div>

      <div className="card p-6 space-y-6">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            1 · Your level
          </p>
          <LevelSelector selected={level} onSelect={setLevel} />
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            2 · Pick a scenario
          </p>
          <ScenarioPicker selected={scenario?.id ?? null} onSelect={setScenario} />
        </div>

        <button
          onClick={start}
          disabled={!ready}
          className="btn-primary w-full py-3.5 text-sm"
        >
          Start speaking
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
