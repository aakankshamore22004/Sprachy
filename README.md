# 🇩🇪 DeutschLernen — AI German Conversation

Practice real-life German conversations with **Lena**, an AI partner powered by Google Gemini.
Speak or type your way through taxi rides, restaurants, doctor visits, and more — with instant
grammar feedback, English translations, and German audio.

> **Phase 1 — Conversation feature only.** Quizzes, writing practice, flashcards, login,
> and progress tracking are planned for later phases (see `GERMAN-APP-BUILD-PROMPT.md`).

---

## ✨ Features
- **8 roleplay scenarios** — Taxi, Restaurant, Doctor, Hotel, Directions, Small Talk, Grocery, Job Interview.
- **3 levels** — Beginner (A1) · Intermediate (A2–B1) · Hard (B2–C1). Lena adapts her German to your level.
- **Voice + text** — 🎤 speak in German (mic) or type. 🔊 hear Lena's replies (with slow playback).
- **Live feedback** — every turn shows corrections, learning tips, and useful new vocabulary.
- **End-of-session summary** — score ring, your corrections, and words to remember.
- **Mobile-first**, clean UI (Indigo + Amber palette). Works on desktop too.

---

## 🚀 Quick start

### Prerequisites
This project was set up with a local Node.js install at `~/.local/node-bin` (Node v20.18.1).
If `node`/`npm` aren't on your PATH, prefix every command:

```bash
export PATH="$HOME/.local/node-bin/bin:$PATH"
```

> Tip: add that line to `~/.zshrc` to make it permanent. (Or run `sudo xcodebuild -license accept`
> then `brew install node` for a normal install.)

### Install & run
```bash
cd "/Users/aakankshamore/Downloads/G project"
npm install        # only first time
npm run dev
# open http://localhost:3000
```

### Gemini API key
The app calls **Google Gemini** server-side. Your key lives in `.env.local` (gitignored):

```
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.0-flash   # optional override
```

Get a key from **https://aistudio.google.com/apikey** (typical format `AIzaSy...`).
If the key is missing or invalid, the chat shows a friendly error guiding you to fix it.

---

## 🗣️ Voice (browser support)
Voice uses the **Web Speech API** (no extra keys, no cost):
- **Mic input (STT)** — best in **Chrome / Edge**. Safari/Firefox: type-only.
- **Audio output (TTS)** — German voice via `speechSynthesis` (most modern browsers).

If voice isn't supported, the mic button is hidden and the app stays fully usable by typing.

---

## 🧱 Tech stack
| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + lucide-react icons |
| AI | `@google/genai` (Gemini `gemini-2.0-flash`) |
| Voice | Browser Web Speech API (STT de-DE + TTS) |

No backend other than Next.js API routes. No database yet (Phase 1 has no auth/progress).

---

## 📂 Project structure
```
app/
  layout.tsx              # root layout + Inter font
  page.tsx                # home: scenario + level picker
  globals.css             # Tailwind + component classes
  conversation/page.tsx   # chat screen
  api/chat/route.ts       # POST → Gemini (server-side, structured JSON)
components/
  Logo, ScenarioPicker, LevelSelector,
  ChatWindow, ChatMessage, ChatInput, SessionSummary
lib/
  types.ts                # shared types
  scenarios.ts            # 8 scenarios
  gemini.ts               # Gemini client + Lena system prompt + JSON schema
  speech.ts               # Web Speech STT/TTS helpers
tailwind.config.ts        # color palette + design tokens
.env.local                # GEMINI_API_KEY (gitignored)
handoff.md                # 🤝 project state — read first, update each session
```

---

## 🔒 Security notes
- The Gemini key is **server-side only** — never sent to the browser.
- `.env.local` is gitignored. Don't commit it.
- If you ever paste a key into chat/screenshots, **rotate it** afterward.

---

## 🛣️ Roadmap (future phases)
- Phase 2: written practice + AI grading, more scenarios, scenario difficulty tuning.
- Phase 3: quizzes, grammar lessons, flashcards (SRS), progress analytics, gamification/streaks.
- Phase 4: login (Supabase), persistence, listening/reading modules, dark mode, premium tier.

Full spec: `GERMAN-APP-BUILD-PROMPT.md`. Session state: `handoff.md`.
