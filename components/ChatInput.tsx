"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Send, Square, Loader2 } from "lucide-react";
import { isSTTSupported, startListening } from "@/lib/speech";

export function ChatInput({
  onSend,
  disabled,
  thinking,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
  thinking?: boolean;
}) {
  const [text, setText] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);
  const stopRef = useRef<(() => void) | null>(null);
  const [listening, setListening] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);

  const sttSupported = isSTTSupported();

  // auto-grow textarea
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
  }, [text]);

  function submit() {
    const trimmed = text.trim();
    if (!trimmed || disabled || thinking) return;
    onSend(trimmed);
    setText("");
  }

  function handleMic() {
    setMicError(null);
    if (!sttSupported) return;
    if (listening) {
      stopRef.current?.();
      return;
    }
    setListening(true);
    stopRef.current = startListening({
      onResult: (t) => {
        if (t) setText((prev) => (prev ? prev + " " + t : t));
      },
      onError: (msg) => setMicError(friendlyMicError(msg)),
      onEnd: () => setListening(false),
    });
  }

  const canSend = text.trim().length > 0 && !disabled && !thinking;

  return (
    <div className="border-t border-line bg-surface/95 px-3 pt-2.5 pb-safe backdrop-blur">
      {micError && (
        <p className="mb-1.5 px-1 text-xs text-error">{micError}</p>
      )}
      <div className="flex items-end gap-2">
        {sttSupported && (
          <button
            type="button"
            onClick={handleMic}
            disabled={disabled || thinking}
            aria-label={listening ? "Stop listening" : "Speak in German"}
            title={listening ? "Listening… tap to stop" : "Speak in German"}
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-btn transition active:scale-95
              ${listening
                ? "bg-error text-white animate-pop"
                : "bg-brand-soft text-brand hover:bg-brand hover:text-white"}`}
          >
            {listening ? <Square size={18} /> : <Mic size={20} />}
          </button>
        )}

        <div className="flex flex-1 items-end gap-2 rounded-btn border border-line bg-canvas px-3 py-1.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
          <textarea
            ref={taRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={1}
            placeholder={
              listening ? "Höre zu… (listening…)" : "Schreib auf Deutsch…"
            }
            disabled={disabled || thinking}
            className="max-h-[140px] flex-1 resize-none bg-transparent py-1.5 text-[15px] leading-relaxed text-ink placeholder:text-ink-muted/70 focus:outline-none disabled:opacity-50"
          />
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={!canSend}
          aria-label="Send message"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-btn bg-brand text-white shadow-brand transition hover:bg-brand-dark active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {thinking ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </div>
      {!sttSupported && (
        <p className="mt-1 px-1 text-[11px] text-ink-muted">
          Voice input needs Chrome/Edge. You can still type!
        </p>
      )}
    </div>
  );
}

function friendlyMicError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("not-allowed") || m.includes("denied"))
    return "Microphone permission was blocked. Allow mic access to use voice.";
  if (m.includes("network")) return "Speech recognition needs an internet connection.";
  if (m.includes("no-speech")) return "I didn't hear anything. Try again.";
  return `Voice input error: ${msg}`;
}
