import Link from "next/link";
import { MessageSquareText, Mic, BookOpen } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="section py-12">
      {/* Hero */}
      <section className="mb-12 text-center">
        <h1 className="font-serif text-4xl font-bold text-ink sm:text-5xl">
          About Sprachy
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-ink-muted">
          Sprachy helps you go from textbook German to speaking real German —
          through AI-powered roleplay in everyday situations.
        </p>
      </section>

      {/* The problem */}
      <section className="mb-10 rounded-card border border-line bg-surface p-6">
        <h2 className="font-serif text-xl font-bold text-ink">The problem</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Most German learners hit the same wall: you study grammar, memorise vocabulary,
          and pass written tests — but when it comes to actually{" "}
          <em className="text-ink">speaking</em>, the words don&rsquo;t come.
        </p>
        <ul className="mt-3 space-y-2 text-sm text-ink-muted">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-accent">•</span>
            <span><strong className="text-ink">Textbook German ≠ real German.</strong> Real conversations are messy — they include filler words, slang, interrupted thoughts, and context you can&rsquo;t get from a chapter exercise.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-accent">•</span>
            <span><strong className="text-ink">Fear of speaking.</strong> Without practice, speaking a new language feels intimidating. You need a safe place where mistakes are welcome, not punished.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-accent">•</span>
            <span><strong className="text-ink">Grammar is hard.</strong> German cases (der/die/das), word order, and verb conjugations trip up even intermediate learners. You need feedback, not just a grade.</span>
          </li>
        </ul>
      </section>

      {/* How it works */}
      <section className="mb-10">
        <h2 className="font-serif text-center text-2xl font-bold text-ink">How it works</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StepCard
            n={1}
            icon={<MessageSquareText size={22} className="text-accent" />}
            title="Pick a scenario"
            desc="Choose from real-life situations — taxi rides, restaurants, doctor visits, or just a free chat."
          />
          <StepCard
            n={2}
            icon={<Mic size={22} className="text-accent" />}
            title="Speak or type"
            desc="Practice in German at your level (A1–C1). Use your mic to speak, or just type. No pressure."
          />
          <StepCard
            n={3}
            icon={<BookOpen size={22} className="text-accent" />}
            title="Learn as you go"
            desc="Get instant corrections, grammar tips, translations, and new vocabulary after every turn."
          />
        </div>
      </section>

      {/* Meet Lena */}
      <section className="mb-10 rounded-card border border-accent/20 bg-accent-soft/40 p-6">
        <h2 className="font-serif text-xl font-bold text-ink">Meet Lena</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Lena is Sprachy&rsquo;s AI conversation partner. She plays different roles — a
          Berlin taxi driver, a café barista, a hotel receptionist — and adapts her German
          to your CEFR level. She corrects your mistakes gently, suggests better ways to
          say things, and highlights useful vocabulary so you learn naturally through
          conversation, not drills.
        </p>
      </section>

      {/* Mission */}
      <section className="text-center">
        <h2 className="font-serif text-2xl font-bold text-ink">Our mission</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-muted">
          Make speaking practice accessible, judgment-free, and actually effective.
          Language learning should feel like a conversation, not a test.
        </p>
        <Link
          href="/"
          className="btn-primary mt-6 inline-flex text-sm"
        >
          Try a conversation
        </Link>
      </section>
    </div>
  );
}

function StepCard({
  n,
  icon,
  title,
  desc,
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-card border border-line bg-surface p-5 text-center">
      <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-accent-soft">
        {icon}
      </div>
      <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-ink-muted">
        Step {n}
      </p>
      <h3 className="text-sm font-bold text-ink">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-ink-muted">{desc}</p>
    </div>
  );
}
