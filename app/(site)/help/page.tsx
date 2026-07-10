import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="section py-12">
      <section className="mb-10 text-center">
        <h1 className="font-serif text-4xl font-bold text-ink">Help</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-ink-muted">
          How to use Sprachy and solutions for common issues.
        </p>
      </section>

      {/* How to use */}
      <section className="mb-10">
        <h2 className="font-serif text-xl font-bold text-ink mb-4">Using Sprachy</h2>
        <div className="space-y-3">
          <HelpItem
            q="How do I start a conversation?"
            a="Go to the home page, pick your CEFR level (Beginner / Intermediate / Hard), choose a scenario, then tap 'Start conversation'. Lena will greet you in character — just reply in German."
          />
          <HelpItem
            q="Can I use voice instead of typing?"
            a="Yes! Tap the microphone button in the chat input bar. Voice input works best in Chrome or Edge on desktop and Android. Safari and Firefox don't support speech recognition — in those browsers you can type instead, and audio playback still works."
          />
          <HelpItem
            q="What do the buttons under each AI reply do?"
            a={
              <>
                <strong>🔊 Play</strong> — hear Lena's reply spoken in German.{" "}
                <strong>🐢 Slow</strong> — same audio at 60% speed.{" "}
                <strong>🌐 Translate</strong> — toggles an English translation.{" "}
                <strong>💡 Hint</strong> (header) — asks Lena to suggest what you could say next.
              </>
            }
          />
          <HelpItem
            q="What are the levels?"
            a={
              <>
                <strong>Beginner (A1)</strong> — simple words, present tense.{" "}
                <strong>Intermediate (A2–B1)</strong> — everyday talk, past & future tenses.{" "}
                <strong>Hard (B2–C1)</strong> — idiomatic, complex grammar, Konjunktiv.
              </>
            }
          />
          <HelpItem
            q="What is 'Free Casual Talk'?"
            a="An open-ended scenario with no fixed script. Chat about anything — your day, hobbies, plans, the weather. Great for relaxed practice when you don't want a structured scene."
          />
        </div>
      </section>

      {/* Common problems */}
      <section className="mb-10">
        <h2 className="font-serif text-xl font-bold text-ink mb-4">
          Common problems you may face
        </h2>
        <div className="space-y-3">
          <ProblemItem
            title="Gemini error: 'quota exceeded' or 429"
            desc="The free-tier quota for the AI model can run out if you send many requests in a short time."
            fix="Wait 30–60 seconds and try again. If it persists, the daily quota may be exhausted — try again tomorrow. You can also change the model in .env.local (e.g. GEMINI_MODEL=gemini-flash-lite-latest)."
          />
          <ProblemItem
            title="Gemini error: 'high demand' or 503"
            desc="The AI model is temporarily overloaded."
            fix="Wait a few seconds and retry. This is usually brief (under a minute)."
          />
          <ProblemItem
            title="Gemini error: 'invalid API key' or 401/403"
            desc="The API key in .env.local is missing, wrong, or doesn't have access."
            fix="Check .env.local has GEMINI_API_KEY set. Keys usually start with 'AIza…'. Get a fresh one at aistudio.google.com/apikey."
          />
          <ProblemItem
            title="Microphone button is missing"
            desc="Your browser doesn't support the Web Speech API."
            fix="Try Chrome or Edge. Safari/Firefox support text-to-speech (audio playback) but not speech recognition. You can still type."
          />
          <ProblemItem
            title="Microphone says 'permission blocked'"
            desc="The browser blocked access to your mic."
            fix="Click the lock/info icon in the address bar → allow microphone → reload the page."
          />
          <ProblemItem
            title="Audio doesn't play"
            desc="Text-to-speech isn't working."
            fix="Make sure your device volume is up. Try a different browser. If no German voice is available, the browser will use its default voice."
          />
          <ProblemItem
            title="The page says 'Loading…' forever"
            desc="The app can't reach the server."
            fix="Make sure npm run dev is running. Check that localhost:3000 is accessible. If the network is slow, Gemini calls may take longer."
          />
        </div>
      </section>

      <div className="text-center">
        <p className="text-sm text-ink-muted">
          Still stuck?
        </p>
        <Link
          href="/contact"
          className="btn-accent mt-3 inline-flex text-sm"
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}

function HelpItem({ q, a }: { q: string; a: React.ReactNode }) {
  return (
    <div className="rounded-card border border-line bg-surface p-4">
      <p className="text-sm font-semibold text-ink">{q}</p>
      <p className="mt-1 text-sm leading-relaxed text-ink-muted">{a}</p>
    </div>
  );
}

function ProblemItem({ title, desc, fix }: { title: string; desc: string; fix: string }) {
  return (
    <div className="rounded-card border border-line bg-surface p-4">
      <p className="text-sm font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm text-ink-muted">{desc}</p>
      <div className="mt-2 rounded-btn bg-success/10 px-3 py-2 text-sm">
        <span className="font-semibold text-success">Fix: </span>
        <span className="text-ink-muted">{fix}</span>
      </div>
    </div>
  );
}
