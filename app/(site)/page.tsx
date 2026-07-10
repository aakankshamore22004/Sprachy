"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Mic, Zap, Shield, Star } from "lucide-react";
import { ScenarioPicker } from "@/components/ScenarioPicker";
import { LevelSelector } from "@/components/LevelSelector";
import type { Level, Scenario } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

const FEATURES = [
  { icon: Mic,    label: "Voice Practice",     desc: "Speak German & get instant corrections" },
  { icon: Zap,    label: "AI-Powered",         desc: "Gemini AI adapts to your CEFR level" },
  { icon: Shield, label: "Safe Space",          desc: "Mistakes are welcome — that's how you grow" },
  { icon: Star,   label: "Track Progress",     desc: "XP, streaks, badges & skill analytics" },
];

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [level, setLevel] = useState<Level | null>(null);
  const ready = Boolean(scenario && level);

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);

  function start() {
    if (!scenario || !level) return;
    router.push(`/conversation?${new URLSearchParams({ scenario: scenario.id, level })}`);
  }

  if (loading) return (
    <div className="flex min-h-[90dvh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
    </div>
  );

  return (
    <div className="min-h-[90dvh]">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pb-16 pt-20 text-center">
        {/* Background blob */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(99,102,241,0.22) 0%, transparent 70%)",
          }}
        />

        <div className="chip mb-5 mx-auto">
          ✨ AI-powered German practice
        </div>

        <h1
          className="mx-auto max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl"
         
        >
          <span className="gradient-text">Speak German</span>
          <br />
          <span className="text-ink">like a native.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-ink-muted">
          Chat with <strong className="text-ink">Lena</strong> — your AI conversation partner.
          Roleplay real‑life scenarios, get live grammar feedback, and build confidence fast.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <a href="/signup" className="btn-primary text-base px-6 py-3">
            Start for free
            <ArrowRight size={18} />
          </a>
          <a href="/login" className="btn-ghost text-base px-6 py-3">
            Sign in
          </a>
        </div>

        {/* Feature pills */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {["Taxi 🚕", "Restaurant 🍽️", "Doctor 🏥", "Hotel 🏨", "Free chat 💬"].map((s) => (
            <span
              key={s}
              className="rounded-chip border border-line bg-surface px-3 py-1 text-xs font-medium text-ink-muted"
             
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* ── Feature grid ─────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 pb-16">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="card flex flex-col items-center gap-2 p-4 text-center transition hover:-translate-y-0.5"
            >
              <div
                className="mb-1 flex h-10 w-10 items-center justify-center rounded-xl"
               
              >
                <Icon size={18} />
              </div>
              <p className="text-xs font-bold text-ink">{label}</p>
              <p className="text-[11px] leading-relaxed text-ink-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Try it now ───────────────────────────────────────── */}
      <section className="mx-auto max-w-lg px-4 pb-20">
        <div className="card p-6">
          <h2 className="mb-6 text-center text-lg font-bold text-ink">
            Try a conversation — no signup needed
          </h2>

          <div className="mb-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
              1 · Your level
            </p>
            <LevelSelector selected={level} onSelect={setLevel} />
          </div>

          <div className="mb-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
              2 · Pick a scenario
            </p>
            <ScenarioPicker selected={scenario?.id ?? null} onSelect={setScenario} />
          </div>

          <button
            onClick={start}
            disabled={!ready}
            className="btn-primary w-full py-3 text-sm"
          >
            Start conversation
            <ArrowRight size={16} />
          </button>
          {!ready && (
            <p className="mt-2 text-center text-xs text-ink-muted">
              Choose a level and scenario to begin
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
