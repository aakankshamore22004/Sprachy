# 🇩🇪 AI-Based German Conversation App — Build Prompt & Specification

> A complete, ready-to-use specification + copy-paste prompt for building an AI-powered German learning conversation web app (responsive + mobile web).

---

## 1. PROJECT OVERVIEW

**App Name (working):** `DeutschLernen` (or `SprachMit` / `LingoRide`)
**Type:** Responsive web app (desktop + mobile web, mobile-first)
**Purpose:** Help learners practice German through real-life scenario roleplay (taxi, small talk, restaurant, doctor, etc.), supported by AI voice + text chat, written practice, quizzes, and a structured level system.

### Core Pillars
1. **Speak** — AI roleplay + voice chat (STT + TTS)
2. **Write** — guided writing tasks with AI feedback
3. **Practice** — quizzes, flashcards, grammar drills
4. **Progress** — levels (Beginner → Intermediate → Hard), streaks, analytics

### Design Philosophy
- **Clean, calm, focused.** Generous whitespace, one clear action per screen.
- **Friendly, not childish.** Rounded shapes, soft shadows, approachable.
- **Mobile-first.** Thumb-friendly, bottom navigation, big tap targets.

---

## 2. RECOMMENDED TECH STACK

| Layer | Choice | Why |
|---|---|---|
| Frontend | **Next.js (App Router) + React + TypeScript** | SSR, routing, great DX |
| Styling | **Tailwind CSS** | Rapid, consistent design system |
| UI Components | **shadcn/ui** + Radix | Accessible, clean, customizable |
| Icons | **lucide-react** | Lightweight, consistent |
| State | **Zustand** or React Context | Simple global state (auth, progress) |
| Auth + DB | **Supabase** (Postgres + Auth + Storage) | Fast backend, free tier |
| AI Conversation | **OpenAI (GPT-4o-mini)** or **Google Gemini 1.5** | Cheap, multilingual, instruction-following |
| Speech-to-Text | **OpenAI Whisper API** | Accurate for German |
| Text-to-Speech | **OpenAI TTS** or **ElevenLabs** | Natural German voices |
| Payments (later) | **Stripe** | Subscriptions |

> This gives you real API accuracy for conversation, voice, and feedback — not canned scripts.

---

## 3. DESIGN SYSTEM

### 3.1 Color Palette — "Calm Indigo + Warm Amber"

A trustworthy, modern palette with a warm accent for energy/motivation. High contrast for readability, soft enough to feel calm.

| Role | Name | Hex | Usage |
|---|---|---|---|
| **Primary** | Indigo | `#4F46E5` | Main buttons, active states, brand |
| **Primary Dark** | Deep Indigo | `#3730A3` | Hover, headers |
| **Primary Soft** | Indigo Mist | `#EEF2FF` | Card backgrounds, highlights |
| **Accent** | Amber | `#F59E0B` | Streaks, rewards, energy, progress ring |
| **Accent Soft** | Amber Mist | `#FEF3C7` | Badge backgrounds |
| **Success** | Emerald | `#10B981` | Correct answers, completed |
| **Error** | Rose | `#EF4444` | Wrong answers, errors |
| **Warning** | Orange | `#F97316` | Hints, attention |
| **Info** | Sky | `#0EA5E9` | Tips, secondary info |
| **Background** | Off-White | `#F8FAFC` | App background |
| **Surface** | White | `#FFFFFF` | Cards, panels |
| **Text Primary** | Slate 900 | `#0F172A` | Body text |
| **Text Secondary** | Slate 500 | `#64748B` | Captions, meta |
| **Border** | Slate 200 | `#E2E8F0` | Dividers, inputs |
| **Dark BG (dark mode)** | Slate 950 | `#020617` | Dark theme background |

**Optional German-inspired accent:** subtle use of `#D4AF37` (soft gold) for premium/achievement moments only.

### 3.2 Typography
- **Font:** `Inter` (UI) — clean, highly legible. Optional `Poppins` for headings.
- **Scale (mobile):** H1 `28px/700`, H2 `22px/700`, Body `16px/400`, Small `13px/400`.
- **Line height:** 1.5 for body, 1.2 for headings.
- **Letter spacing:** `-0.01em` on headings for polish.

### 3.3 Spacing, Radius, Shadows
- **Spacing scale:** 4 / 8 / 12 / 16 / 24 / 32 / 48 px (8pt grid).
- **Radius:** Cards `16px`, Buttons `12px`, Inputs `10px`, Pills `999px`.
- **Shadows:** Soft — `0 1px 3px rgba(0,0,0,0.08)` (cards), `0 4px 12px rgba(79,70,229,0.25)` (primary buttons).
- **Max content width (desktop):** `480px` chat column centered, `1100px` for dashboard grids.

### 3.4 Motion
- Transitions `150–250ms ease-out`. Subtle fade+rise on screen enter. Micro-animations on correct answers (scale pop + confetti on milestone).

---

## 4. APP ARCHITECTURE & NAVIGATION

### Desktop
- Left sidebar nav (Home, Conversation, Writing, Quizzes, Flashcards, Progress, Profile).
- Main content area.

### Mobile (primary experience)
- **Top bar:** logo + streak flame + avatar.
- **Bottom tab bar (5 tabs):** Home · Speak · Write · Learn · Profile.
- Floating action or prominent CTA per screen.

### Routes
```
/                → Home/Dashboard
/login           → Login
/signup          → Sign up
/onboarding      → Level + goal selection
/conversation    → Scenario roleplay (voice/text)
/conversation/:id
/writing         → Written practice
/quizzes         → Quiz hub
/quizzes/:id     → Quiz session
/flashcards      → SRS deck
/progress        → Stats & analytics
/about           → About the app
/profile         → Settings
```

---

## 5. DETAILED SCREEN SPECS

### 5.1 Login / Signup
- Split layout (desktop): left = brand panel with tagline + illustration; right = form. Mobile: single centered card.
- Fields: Email, Password (+ "Remember me", "Forgot password"). Social login: Google.
- Primary button `Anmelden / Einloggen` (Indigo, full-width). Link to signup.
- Validation inline, clear error states (Rose).
- Friendly German microcopy: *"Willkommen zurück!"* (Welcome back).

### 5.2 Onboarding
- Step 1: **Choose level** — Beginner (A1) · Intermediate (A2–B1) · Hard (B2–C1). Big selectable cards with descriptions.
- Step 2: **Why are you learning?** (Travel, Work, Study, Daily life) — personalizes scenarios.
- Step 3: **Daily goal** (5 / 10 / 15 min) — sets streak target.
- Smooth multi-step with progress dots at top.

### 5.3 Home / Dashboard
- Greeting card: *"Guten Morgen, [Name]!"* + today's goal + streak ring (Amber).
- "Continue learning" resume card.
- Grid of feature tiles: Speak, Write, Quiz, Flashcards (icon + label + progress).
- "Scenario of the day" highlighted card (e.g., *Im Taxi*).
- Daily streak calendar strip.

### 5.4 Conversation (Roleplay) — THE HERO FEATURE
- Chat interface: AI messages left (with avatar + German text + English toggle), user messages right.
- **Scenario picker** before chat: Taxi Pickup 🚕, Small Talk ☕, Restaurant 🍽️, Doctor 🩺, Grocery Store 🛒, Hotel Check-in 🏨, Asking Directions 🧭, Job Interview 💼.
- **Controls bar:** 🎤 Hold-to-speak (STT) · ⌨️ Type · 🔊 Replay AI audio (TTS) · 🐢 Slow playback · 💡 Hint · 🌐 Translate.
- **Live AI feedback:** after each user turn, subtle inline tip (*"Try: 'Könnten Sie das wiederholen?' instead of 'Was?'."*).
- **End-of-session summary:** words used, mistakes, new vocabulary to save, accuracy score.
- Difficulty adapts to user level (A1 = simple sentences, B2 = complex/idiomatic).

### 5.5 Written Practice
- Prompt card with a task (e.g., *"Schreibe eine E-Mail an deinen Chef, dass du krank bist."*).
- Large textarea, live word count, char count.
- **Submit → AI grading:** returns grammar corrections (highlighted), vocabulary suggestions, tone feedback, and a rewritten improved version.
- Save past writings to history.

### 5.6 Quizzes
- Hub with categories: Vocabulary, Grammar, Articles (der/die/das), Verb Conjugation, Listening, Fill-in-the-blank.
- Question types: multiple choice, true/false, matching, tap-the-article, type-the-answer.
- Immediate feedback (green/red), explanation shown.
- Timer (optional), XP awarded, progress bar.

### 5.7 Flashcards (SRS)
- Spaced repetition deck (like Anki): flip card (German ↔ English + example sentence + audio).
- Buttons: *Again · Hard · Good · Easy* scheduling next review.
- Daily review count.

### 5.8 Progress / Analytics
- Streak (days), total XP, lessons completed.
- Skills radar/bars: Speaking, Listening, Reading, Writing, Vocabulary, Grammar.
- Weekly activity chart, achievements/badges.
- CEFR level indicator (A1→C1).

### 5.9 About
- Mission statement, how it works, the team/creator note, tech credits, privacy & data policy, contact.
- Clean text-focused page, Indigo accents, footer with links.

### 5.10 Profile / Settings
- Avatar, name, current level, edit goals.
- Toggles: dark mode, notifications, audio autoplay, translation hints on/off.
- Sound effects volume, account/logout.

---

## 6. AI & API INTEGRATION (for accuracy)

Use real APIs (recommended) so conversation, pronunciation, and grading are accurate — not scripted.

### 6.1 Conversation Engine (OpenAI / Gemini)
- System prompt template:
  ```
  You are "Lena", a friendly German conversation partner.
  Level: {user_level}. Scenario: {scenario}.
  Rules:
  - Stay in character (e.g., taxi driver).
  - Reply in German at the user's CEFR level.
  - Keep replies short (1–3 sentences).
  - Gently correct major errors; praise good usage.
  - If user writes English, respond in German and encourage them.
  After each turn, append a hidden JSON: {tip, corrections[], new_vocab[]}.
  ```

### 6.2 Speech-to-Text (Whisper API)
- User holds mic → audio → Whisper → German transcript → sent to conversation engine.

### 6.3 Text-to-Speech (OpenAI TTS / ElevenLabs)
- Every AI reply gets German audio; user can replay / slow down.
- Optional: pick a native-sounding voice persona.

### 6.4 Writing Grader
- Send user's text + prompt to model → returns structured JSON: `{score, grammar:[{error, fix}], vocab_suggestions:[], improved_version, feedback}`.

### 6.5 Quiz Generation
- Pre-seed a content DB; optionally generate fresh questions per level via AI for variety. Store answers server-side to prevent leaking.

> **Security:** never expose API keys in the frontend — route all AI calls through a backend/Next.js API routes or Supabase Edge Functions. Add rate limiting + caching to control cost.

---

## 7. LEARNING CURRICULUM & CONTENT

### Levels (CEFR-aligned)
| Level | Band | Focus |
|---|---|---|
| Beginner | A1 | Greetings, numbers, basic verbs, present tense, articles, survival phrases |
| Intermediate | A2–B1 | Past/future tense, modal verbs, cases (Nominative/Accusative/Dative), opinions, longer conversations |
| Hard | B2–C1 | Subjunctive, passive voice, complex clauses, idioms, nuance, professional/academic German |

### Recommended Content Modules (my suggestions)
1. **Vocabulary** — themed decks (food, travel, work, home) with images.
2. **Grammar** — bite-sized lessons (articles, cases, word order, conjugation) + examples.
3. **Pronunciation** — listen, repeat, compare.
4. **Listening comprehension** — short audio clips + questions.
5. **Reading** — graded texts/articles with glossary.
6. **Verb conjugation drills** — practice strong/irregular verbs.
7. **der/die/das trainer** — article practice (notoriously hard!).
8. **Cultural notes** — etiquette, customs, regional differences.
9. **Daily challenge** — quick mixed drill to keep streak.
10. **Spaced repetition** — long-term retention of vocab.

### Real-Life Scenario Library (roleplay)
Taxi pickup · Small talk / weather · Ordering at restaurant · Grocery shopping · Doctor visit · Hotel check-in · Asking for directions · Train station · Job interview · Making friends · Renting an apartment · Phone call · Bank/Post office.

---

## 8. MOBILE WEB UI GUIDELINES
- Mobile-first layout, max-width container on desktop.
- **Bottom tab bar** fixed (5 tabs), 56px height, safe-area padding.
- Tap targets ≥ 44×44px.
- One primary action per screen; secondary actions in menus.
- Sticky chat input with mic + send; auto-grow textarea.
- Haptic-style feedback (scale animations) on answer.
- Pull-to-refresh on lists; swipe gestures for flashcards.
- Offline-friendly: cache vocabulary/flashcards for practice without network.
- Respect dark mode + system fonts + reduced motion.

---

## 9. SUGGESTED BUILD PHASES
- **Phase 1 (MVP):** Auth, onboarding, dashboard, 1 scenario conversation (text only), 1 quiz type, flashcards.
- **Phase 2:** Voice (STT + TTS), more scenarios, writing practice with AI grading.
- **Phase 3:** Full quiz suite, grammar lessons, progress analytics, streaks/gamification.
- **Phase 4:** Listening/reading modules, dark mode, polish, Stripe premium tier.

---

## 10. ✂️ COPY-PASTE MASTER PROMPT (hand this to an AI builder)

```
Build a responsive, mobile-first web app called "DeutschLernen" — an AI-powered German
conversation & learning platform. Use Next.js (App Router) + TypeScript + Tailwind CSS +
shadcn/ui + Supabase (auth + Postgres). Integrate OpenAI (or Gemini) for conversation,
Whisper for speech-to-text, and OpenAI TTS for German audio.

DESIGN SYSTEM:
- Palette: Primary Indigo #4F46E5 (dark #3730A3, soft #EEF2FF), Accent Amber #F59E0B
  (soft #FEF3C7), Success #10B981, Error #EF4444, Info #0EA5E9, Background #F8FAFC,
  Surface #FFFFFF, Text #0F172A / #64748B, Border #E2E8F0. Support dark mode.
- Font: Inter. Radius: cards 16px, buttons 12px. Soft shadows. 8pt spacing grid.
- Clean, calm, friendly UI. Big tap targets (>=44px). Mobile bottom tab bar (5 tabs:
  Home, Speak, Write, Learn, Profile). Generous whitespace.

SCREENS:
1. Login/Signup (email + Google) — Indigo full-width button, inline validation, German microcopy.
2. Onboarding — choose level (Beginner A1 / Intermediate A2-B1 / Hard B2-C1), goal, daily target.
3. Home/Dashboard — greeting, streak ring, resume card, feature tiles, scenario-of-the-day.
4. Conversation (hero feature) — chat UI with scenario picker (Taxi, Restaurant, Doctor, Hotel,
   Directions, Small Talk, Grocery, Job Interview). Controls: mic (STT), type, replay audio (TTS),
   slow playback, hint, translate. Inline AI corrections. End-of-session summary + accuracy score.
5. Written Practice — prompt + textarea, AI grades grammar/vocab/tone, returns improved version.
6. Quizzes — categories (Vocab, Grammar, der/die/das, Conjugation, Listening). Multiple choice,
   matching, fill-blank. Immediate feedback + explanations. XP + progress bar.
7. Flashcards — spaced repetition (Again/Hard/Good/Easy), German<->English, audio, example sentence.
8. Progress — streak, XP, skill bars (Speaking/Listening/Reading/Writing/Vocab/Grammar), badges.
9. About — mission, how it works, privacy, contact.
10. Profile/Settings — level, goals, dark mode, notifications, audio, logout.

AI INTEGRATION (all via backend routes, never expose keys):
- Conversation system prompt: act as German partner "Lena", stay in scenario, reply at user's
  CEFR level in 1-3 sentences, gently correct errors, append hidden JSON {tip, corrections, vocab}.
- STT: Whisper (German). TTS: OpenAI TTS German voice, with slow-replay.
- Writing grader returns {score, grammar[], suggestions[], improved_version, feedback}.
- Rate limit + cache to control cost.

CONTENT: CEFR levels A1->C1; vocab decks, grammar lessons, der/die/das trainer, verb drills,
listening + reading modules, cultural notes, daily challenge, spaced repetition.

Build it modular and accessible, mobile-first, with smooth 150-250ms transitions. Start with
Phase 1 MVP (auth, onboarding, dashboard, one text conversation scenario, one quiz, flashcards),
then add voice, writing grading, full quizzes, analytics, and gamification in later phases.
```

---

*Save this file and feed Section 10 (or any screen spec) to your AI builder. Each section is independently usable.*
