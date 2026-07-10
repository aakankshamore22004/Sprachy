"use client";

import { useState } from "react";
import {
  Volume2,
  Snail,
  Languages,
  Lightbulb,
  CheckCircle2,
  XCircle,
  BookOpen,
} from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { speakGerman, isTTSSupported } from "@/lib/speech";

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";
  const [showTranslation, setShowTranslation] = useState(false);
  const ttsOk = isTTSSupported();

  if (isUser) {
    return (
      <div className="flex animate-fade-rise justify-end">
        <div className="max-w-[82%] rounded-card rounded-br-sm bg-brand px-3.5 py-2.5 text-white shadow-brand">
          <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
            {message.text}
          </p>
        </div>
      </div>
    );
  }

  // Assistant message with controls + feedback card
  return (
    <div className="flex animate-fade-rise items-start gap-2">
      <Avatar />
      <div className="flex max-w-[85%] flex-col gap-1.5">
        <div className="rounded-card rounded-bl-sm bg-surface px-3.5 py-2.5 shadow-card border border-line">
          <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-ink">
            {message.text}
          </p>
        </div>

        {/* Translation (toggled) */}
        {showTranslation && message.translation && (
          <p className="px-1 text-xs italic text-ink-muted animate-fade-rise">
            {message.translation}
          </p>
        )}

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-1 px-0.5">
          {ttsOk && (
            <>
              <CtrlBtn label="Play audio" onClick={() => speakGerman(message.text)}>
                <Volume2 size={15} />
              </CtrlBtn>
              <CtrlBtn label="Slow audio" onClick={() => speakGerman(message.text, { slow: true })}>
                <Snail size={15} />
              </CtrlBtn>
            </>
          )}
          {message.translation && (
            <CtrlBtn
              label={showTranslation ? "Hide English" : "Show English"}
              active={showTranslation}
              onClick={() => setShowTranslation((v) => !v)}
            >
              <Languages size={15} />
            </CtrlBtn>
          )}
        </div>

        {/* Feedback card */}
        {(message.tip || (message.corrections?.length ?? 0) > 0 || (message.newVocab?.length ?? 0) > 0) && (
          <div className="mt-1 rounded-btn border border-line bg-brand-soft/60 p-2.5 text-xs animate-fade-rise">
            {message.tip && (
              <div className="mb-1.5 flex items-start gap-1.5 text-ink">
                <Lightbulb size={14} className="mt-0.5 shrink-0 text-accent" />
                <span>{message.tip}</span>
              </div>
            )}

            {message.corrections?.map((c, i) => (
              <div key={i} className="mb-1 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-error line-through">
                  <XCircle size={13} />
                  {c.wrong}
                </span>
                <span className="text-ink-muted">→</span>
                <span className="inline-flex items-center gap-1 font-semibold text-success">
                  <CheckCircle2 size={13} />
                  {c.right}
                </span>
                {c.note && <span className="text-ink-muted">({c.note})</span>}
              </div>
            ))}

            {message.newVocab && message.newVocab.length > 0 && (
              <div className="mt-1.5 flex items-start gap-1.5">
                <BookOpen size={14} className="mt-0.5 shrink-0 text-info" />
                <div className="flex flex-wrap gap-1">
                  {message.newVocab.map((v, i) => (
                    <span key={i} className="chip bg-surface border border-line text-ink">
                      <b className="text-brand">{v.de}</b>
                      <span className="text-ink-muted">— {v.en}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Avatar() {
  return (
    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-white text-xs font-bold shadow-brand">
      L
    </div>
  );
}

function CtrlBtn({
  children,
  label,
  onClick,
  active,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`grid h-7 w-7 place-items-center rounded-full transition active:scale-90
        ${active ? "bg-brand text-white" : "text-ink-muted hover:bg-brand-soft hover:text-brand"}`}
    >
      {children}
    </button>
  );
}
