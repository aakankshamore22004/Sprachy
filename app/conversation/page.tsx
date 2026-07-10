"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Lightbulb, Square, LogOut } from "lucide-react";
import { ChatWindow } from "@/components/ChatWindow";
import { ChatInput } from "@/components/ChatInput";
import { SessionSummary } from "@/components/SessionSummary";
import { getScenario } from "@/lib/scenarios";
import { primeVoices, stopSpeaking } from "@/lib/speech";
import { useAuth } from "@/lib/auth-context";
import type { AiTurn, ChatMessage, Level } from "@/lib/types";

const VALID_LEVELS: Level[] = ["beginner", "intermediate", "hard"];

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function ConversationPage() {
  return (
    <Suspense fallback={<LoadingShell />}>
      <ConversationInner />
    </Suspense>
  );
}

function ConversationInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { profile, updateUserProfile } = useAuth();

  const scenarioId = params.get("scenario");
  const levelRaw = params.get("level");
  const scenario = scenarioId ? getScenario(scenarioId) : undefined;
  const level: Level | null =
    levelRaw && VALID_LEVELS.includes(levelRaw as Level) ? (levelRaw as Level) : null;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ended, setEnded] = useState(false);
  const startedRef = useRef(false);

  // Prime TTS voices on mount.
  useEffect(() => {
    primeVoices();
    return () => stopSpeaking();
  }, []);

  // Validate params; if invalid, bounce home.
  useEffect(() => {
    if (!scenario || !level) {
      router.replace("/");
    }
  }, [scenario, level, router]);

  const callApi = useCallback(
    async (history: ChatMessage[], payload: { message?: string; hint?: boolean }) => {
      const apiHistory = history
        .filter((m) => m.text)
        .map((m) => ({ role: m.role, text: m.text }) as {
          role: "user" | "assistant";
          text: string;
        });

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: scenario?.id,
          level,
          history: apiHistory,
          ...payload,
        }),
      });

      const data = (await res.json()) as AiTurn & { error?: string };
      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      return data;
    },
    [scenario?.id, level]
  );

  // Kick off the opening line from Lena once params are ready.
  useEffect(() => {
    if (!scenario || !level || startedRef.current) return;
    startedRef.current = true;
    (async () => {
      setThinking(true);
      setError(null);
      try {
        // Empty message signals Lena to open the scene.
        const turn = await callApi([], { message: "(Szene starten)" });
        pushAssistant(turn);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      } finally {
        setThinking(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario?.id, level]);

  function pushAssistant(turn: AiTurn) {
    setMessages((prev) => [
      ...prev,
      {
        id: uid(),
        role: "assistant",
        text: turn.reply,
        translation: turn.translation,
        tip: turn.tip,
        corrections: turn.corrections,
        newVocab: turn.newVocab,
        createdAt: Date.now(),
      },
    ]);
  }

  async function handleSend(text: string) {
    if (!scenario || !level || thinking) return;
    setError(null);
    stopSpeaking();

    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      text,
      createdAt: Date.now(),
    };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setThinking(true);
    try {
      const turn = await callApi(nextHistory, { message: text });
      pushAssistant(turn);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setThinking(false);
    }
  }

  async function handleHint() {
    if (!scenario || !level || thinking) return;
    setError(null);
    setThinking(true);
    try {
      const turn = await callApi(messages, { hint: true, message: "" });
      // Hint comes back as a normal-looking assistant message (the suggested line).
      pushAssistant(turn);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setThinking(false);
    }
  }

  function restart() {
    stopSpeaking();
    setMessages([]);
    setEnded(false);
    setError(null);
    startedRef.current = false;
    // re-trigger opening line
    setTimeout(() => {
      startedRef.current = true;
      (async () => {
        setThinking(true);
        try {
          const turn = await callApi([], { message: "(Szene starten)" });
          pushAssistant(turn);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Something went wrong.");
        } finally {
          setThinking(false);
        }
      })();
    }, 50);
  }

  if (!scenario || !level) return <LoadingShell />;

  if (ended) {
    return (
      <SessionSummary
        messages={messages}
        scenarioTitle={scenario.title}
        onRestart={restart}
        onHome={() => router.push("/")}
      />
    );
  }

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col bg-canvas">
      {/* Header */}
      <header className="flex items-center gap-2 border-b border-line bg-surface px-3 py-2.5">
        <button
          onClick={() => router.push("/")}
          aria-label="Back"
          className="grid h-9 w-9 place-items-center rounded-full text-ink-muted transition hover:bg-brand-soft hover:text-brand active:scale-90"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="text-xl">{scenario.emoji}</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink">{scenario.title}</p>
            <p className="truncate text-[11px] font-medium uppercase tracking-wide text-ink-muted">
              {scenario.titleDe} · {level}
            </p>
          </div>
        </div>
        <button
          onClick={handleHint}
          disabled={thinking}
          aria-label="Get a hint"
          title="Get a hint"
          className="grid h-9 w-9 place-items-center rounded-full text-accent transition hover:bg-accent-soft active:scale-90 disabled:opacity-40"
        >
          <Lightbulb size={19} />
        </button>
        <button
          onClick={() => {
            if (!ended) {
              setEnded(true);
              if (profile) {
                const userCount = messages.filter(m => m.role === "user").length;
                if (userCount > 0) {
                  updateUserProfile({ xp: profile.xp + (userCount * 5) });
                }
              }
            }
          }}
          aria-label="End session"
          title="End session"
          className="grid h-9 w-9 place-items-center rounded-full text-ink-muted transition hover:bg-error/10 hover:text-error active:scale-90"
        >
          <LogOut size={18} />
        </button>
      </header>

      {/* Error banner */}
      {error && (
        <div className="border-b border-error/20 bg-error/5 px-4 py-2">
          <div className="flex items-start gap-2">
            <Square size={14} className="mt-0.5 shrink-0 fill-error text-error" />
            <p className="flex-1 text-xs text-error">{error}</p>
            <button
              onClick={() => {
                setError(null);
                if (messages.length === 0) {
                  // retry opening line
                  startedRef.current = false;
                }
              }}
              className="shrink-0 text-xs font-semibold text-error underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <ChatWindow messages={messages} thinking={thinking} />

      {/* Input */}
      <ChatInput onSend={handleSend} thinking={thinking} disabled={!scenario} />
    </div>
  );
}

function LoadingShell() {
  return (
    <div className="grid min-h-dvh place-items-center bg-canvas">
      <div className="flex flex-col items-center gap-3 text-ink-muted">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        <p className="text-sm">Loading…</p>
      </div>
    </div>
  );
}
