"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { ChatMessage } from "./ChatMessage";

export function ChatWindow({
  messages,
  thinking,
}: {
  messages: ChatMessageType[];
  thinking: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, thinking]);

  return (
    <div className="scroll-slim flex-1 space-y-4 overflow-y-auto px-4 py-4">
      {messages.map((m) => (
        <ChatMessage key={m.id} message={m} />
      ))}
      {thinking && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex animate-fade-rise items-start gap-2">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-white text-xs font-bold shadow-brand">
        L
      </div>
      <div className="flex items-center gap-1 rounded-card rounded-bl-sm border border-line bg-surface px-4 py-3 shadow-card">
        <span className="h-2 w-2 rounded-full bg-ink-muted animate-blink" />
        <span className="h-2 w-2 rounded-full bg-ink-muted animate-blink [animation-delay:0.2s]" />
        <span className="h-2 w-2 rounded-full bg-ink-muted animate-blink [animation-delay:0.4s]" />
      </div>
    </div>
  );
}
