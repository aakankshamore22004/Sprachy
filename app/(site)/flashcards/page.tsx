"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import {
  collection, doc, setDoc, getDocs,
  query, where, orderBy, Timestamp,
} from "firebase/firestore";
import { Loader2, RotateCcw, Volume2 } from "lucide-react";

interface Card {
  id: string;
  german: string;
  english: string;
  example?: string;
  nextReview: Date;
  interval: number;
  ease: number;
}

const STARTER_CARDS = [
  { german: "Hallo",        english: "Hello",       example: "Hallo! Wie geht es Ihnen?" },
  { german: "Danke",        english: "Thank you",   example: "Vielen Danke!" },
  { german: "Bitte",        english: "Please / You're welcome", example: "Bitte schön." },
  { german: "Entschuldigung", english: "Excuse me / Sorry", example: "Entschuldigung, wo ist der Bahnhof?" },
  { german: "die Straße",   english: "the street",  example: "Ich gehe die Straße entlang." },
  { german: "der Bahnhof",  english: "the train station", example: "Der Bahnhof ist hier." },
  { german: "essen",        english: "to eat",      example: "Ich esse gerne Pizza." },
  { german: "trinken",      english: "to drink",    example: "Ich trinke Kaffee." },
  { german: "schön",        english: "beautiful / nice", example: "Das Wetter ist schön." },
  { german: "sprechen",     english: "to speak",    example: "Sprechen Sie Deutsch?" },
];

const RATINGS: { key: string; label: string; color: string; soft: string; days: number }[] = [
  { key: "again", label: "Again",  color: "#B4423A", soft: "#F8E9E8",  days: 0 },
  { key: "hard",  label: "Hard",   color: "#B4632A", soft: "#F0E4D6", days: 1 },
  { key: "good",  label: "Good",   color: "#5C7C5A", soft: "#E8F0E7", days: 3 },
  { key: "easy",  label: "Easy",   color: "#5B7A8C", soft: "#EBF2F6", days: 7 },
];

function scheduleCard(card: Card, rating: string): Partial<Card> {
  const now = new Date();
  const map: Record<string, { interval: number; ease: number }> = {
    again: { interval: 1,                    ease: Math.max(130, card.ease - 20) },
    hard:  { interval: card.interval,        ease: Math.max(130, card.ease - 15) },
    good:  { interval: Math.round(card.interval * card.ease / 100), ease: card.ease },
    easy:  { interval: Math.round(card.interval * card.ease / 100) + 4, ease: card.ease + 15 },
  };
  const { interval, ease } = map[rating] ?? map.good;
  const nextReview = new Date(now.getTime() + Math.max(1, interval) * 86400000);
  return { interval: Math.max(1, interval), ease, nextReview };
}

export default function FlashcardsPage() {
  const { user } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => { if (user) loadCards(); }, [user]);

  async function loadCards() {
    setLoading(true);
    try {
      const colRef = collection(db, "users", user!.uid, "flashcards");
      const snap = await getDocs(query(colRef, orderBy("nextReview")));
      const now = new Date();
      let due: Card[] = snap.docs
        .map((d) => {
          const data = d.data();
          return {
            id: d.id,
            german: data.german, english: data.english, example: data.example,
            nextReview: data.nextReview?.toDate?.() ?? now,
            interval: data.interval ?? 1,
            ease: data.ease ?? 250,
          };
        })
        .filter((c) => c.nextReview <= now);

      if (snap.empty) {
        await seedCards();
        due = STARTER_CARDS.map((c, i) => ({ ...c, id: `starter_${i}`, nextReview: now, interval: 1, ease: 250 }));
      }

      setCards(due);
      setIdx(0); setFlipped(false);
      setDone(due.length === 0);
    } catch (e) {
      console.warn("Flashcard load error:", e);
      const now = new Date();
      setCards(STARTER_CARDS.map((c, i) => ({ ...c, id: `local_${i}`, nextReview: now, interval: 1, ease: 250 })));
    } finally { setLoading(false); }
  }

  async function seedCards() {
    try {
      const now = Timestamp.now();
      for (const c of STARTER_CARDS) {
        const id = c.german.replace(/\s+/g, "_").replace(/[^\w]/g, "");
        await setDoc(doc(db, "users", user!.uid, "flashcards", id), {
          ...c, nextReview: now, interval: 1, ease: 250,
        });
      }
    } catch (e) { console.warn("Seed cards error:", e); }
  }

  async function rate(rating: string) {
    const card = cards[idx];
    try {
      const updates = scheduleCard(card, rating);
      await setDoc(doc(db, "users", user!.uid, "flashcards", card.id), {
        nextReview: Timestamp.fromDate(updates.nextReview!),
        interval: updates.interval, ease: updates.ease,
      }, { merge: true });
    } catch (e) { console.warn("Rate card error:", e); }

    if (idx + 1 >= cards.length) { setDone(true); return; }
    setIdx((i) => i + 1); setFlipped(false);
  }

  function speak(text: string) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "de-DE"; utter.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  if (loading) return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-3">
      <Loader2 size={28} className="animate-spin text-brand" />
      <p className="text-sm text-ink-muted">Loading flashcards…</p>
    </div>
  );

  if (done) return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 text-center px-4">
      <div
        className="flex h-20 w-20 items-center justify-center rounded-full text-3xl bg-success-soft border-2 border-success/40"
      >
        🎉
      </div>
      <h2 className="text-xl font-extrabold text-ink">All done for today!</h2>
      <p className="text-sm text-ink-muted">No cards are due right now. Come back tomorrow!</p>
      <button onClick={loadCards} className="btn-primary gap-2">
        <RotateCcw size={14} /> Refresh
      </button>
    </div>
  );

  const card = cards[idx];

  return (
    <div className="mx-auto max-w-sm px-4 py-8 animate-fade-rise">
      {/* Header */}
      <div className="mb-5 text-center">
        <div className="chip mx-auto mb-2">📖 Flashcards</div>
        <p className="text-xs text-ink-muted">{idx + 1} of {cards.length} due today</p>
        <div className="mt-2 h-1.5 rounded-full overflow-hidden bg-line/50">
          <div
            className="h-full rounded-full transition-all duration-500 bg-brand"
            style={{ width: `${((idx) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div
        className="card mb-5 flex min-h-52 flex-col items-center justify-center cursor-pointer select-none p-8 text-center transition hover:scale-[1.01]"
        onClick={() => setFlipped((f) => !f)}
       
      >
        {!flipped ? (
          <>
            <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-3">German</p>
            <p className="text-3xl font-extrabold text-ink mb-4">{card.german}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); speak(card.german); }}
                className="flex items-center gap-1.5 rounded-btn px-3 py-1.5 text-xs font-medium text-ink-muted transition hover:text-brand bg-line/30 border border-line"
              >
                <Volume2 size={12} /> Listen
              </button>
            </div>
            <p className="mt-4 text-[11px] text-ink-subtle">Tap to reveal</p>
          </>
        ) : (
          <>
            <p className="text-xs font-bold uppercase tracking-widest text-success mb-3">English</p>
            <p className="text-2xl font-extrabold text-ink mb-3">{card.english}</p>
            {card.example && (
              <p className="text-xs text-ink-muted italic leading-relaxed max-w-xs">&ldquo;{card.example}&rdquo;</p>
            )}
          </>
        )}
      </div>

      {/* Rating buttons */}
      {flipped && (
        <div className="grid grid-cols-4 gap-2 animate-slide-up">
          {RATINGS.map(({ key, label, color, soft }) => (
            <button
              key={key}
              onClick={() => rate(key)}
              className="flex flex-col items-center gap-1 rounded-btn py-2.5 text-xs font-bold transition hover:-translate-y-0.5"
              style={{ background: soft, color, border: `1px solid ${color}30` }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
