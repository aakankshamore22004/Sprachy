"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="section py-12">
      <section className="mb-10 text-center">
        <h1 className="font-serif text-4xl font-bold text-ink">Contact</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-ink-muted">
          Have feedback, found a bug, or just want to say hallo?
        </p>
      </section>

      <div className="mx-auto max-w-lg">
        {/* Contact card */}
        <div className="mb-6 rounded-card border border-line bg-surface p-6 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-accent-soft">
            <Mail size={22} className="text-accent" />
          </div>
          <p className="text-lg font-bold text-ink">Aakanksha More</p>
          <a
            href="mailto:aakankshamore22004@gmail.com"
            className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-accent transition hover:underline"
          >
            <Mail size={14} />
            aakankshamore22004@gmail.com
          </a>
        </div>

        {/* Message form (UI only) */}
        <div className="rounded-card border border-line bg-surface p-6">
          <h2 className="text-base font-bold text-ink mb-4">Send a message</h2>

          {sent ? (
            <div className="rounded-btn bg-success/10 p-4 text-center">
              <p className="text-sm font-semibold text-success">
                Thanks for reaching out! (Demo mode — this message wasn't sent.)
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="btn-ghost mt-3 text-sm"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                className="input"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your email"
                className="input"
                required
              />
              <textarea
                name="message"
                rows={4}
                placeholder="What's on your mind?"
                className="input resize-none"
                required
              />
              <button type="submit" className="btn-primary w-full text-sm">
                <Send size={16} />
                Send message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
