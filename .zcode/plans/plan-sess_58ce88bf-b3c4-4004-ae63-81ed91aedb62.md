## Redesign + new pages for Sprachy

### A. New visual identity — "Soft Clay / Terracotta on paper"
Replace the indigo palette with an editorial off-white + near-black + clay scheme. Because every component already uses semantic Tailwind tokens, I change values in **one file** and it cascades.

`tailwind.config.ts` palette (token names unchanged so components auto-update):
| Token | New value | Role |
|---|---|---|
| `brand` (primary) | `#16140F` near-black | primary buttons, key text (was indigo) |
| `brand.dark` | `#000000` | hover |
| `brand.soft` | `#EFEAE0` warm sand | soft backgrounds / active card |
| `accent` | `#B4632A` soft clay | streaks, highlights, active states |
| `accent.soft` | `#F0E4D6` | badge backgrounds |
| `canvas` | `#FAF8F4` off-white paper | app background |
| `surface` | `#FFFFFF` | cards |
| `ink` | `#16140F` near-black | body text |
| `ink.muted` | `#6B6256` warm gray | captions |
| `line` | `#E7E1D6` sand | borders |
| `success` `#5C7C5A` · `error` `#B4423A` · `warning` = clay · `info` `#5B7A8C` | softened, tuned warm |

Also: update `shadow-brand` to `rgba(22,20,15,0.14)` (was indigo glow). Add a `font-serif` token (system serif stack: Georgia/Iowan) used **only** for hero + About headings — gives an editorial, human feel (the main anti-"AI look" lever beyond color). Add a subtle paper texture option. `globals.css` `.btn-primary` becomes black bg / off-white text.

### B. Rename to **Sprachy**
Update wordmark in `Logo.tsx` (placeholder mark you'll swap later), all `<title>`/metadata, README, handoff. Title: "Sprachy — AI German Conversation".

### C. Route groups for clean header/footer
Restructure so the chat stays fullscreen but site pages share chrome:
- `app/(site)/layout.tsx` — **SiteHeader** + **SiteFooter** wrapper
- Move `app/page.tsx` → `app/(site)/page.tsx` (home)
- `app/(site)/about|help|contact|login|signup/page.tsx`
- `app/conversation/page.tsx` stays **bare** (fullscreen chat, no header/footer)

### D. New components
- **`SiteHeader`** — sticky, off-white/blurred. Logo left; nav (About · Help · Contact) center/right; "Sign in" + "Get started" (clay/black) buttons. Mobile: collapses to a menu button → sheet.
- **`SiteFooter`** — one-liner brief ("Sprachy — practice real-life German with AI"), nav links, and **Contact: Aakanksha More · aakankshamore22004@gmail.com**.
- **`Logo`** updated to "Sprachy" wordmark + neutral mark (swappable later).

### E. New pages
1. **`/about`** — What Sprachy is, the problem it solves (textbook German ≠ real conversation; fear of speaking; articles/cases are hard), mission, how it works (3 steps), the AI partner "Lena". Editorial layout, serif headings.
2. **`/help`** — How to use (mic in Chrome/Edge, levels, scenarios) **+ "Common problems you may face"** section: Gemini quota/rate-limit (429/503) errors, mic permission denied, voice unsupported in Safari/Firefox → type-only, API key issues, slow responses. Each with a fix.
3. **`/contact`** — Card with **Aakanksha More**, email **aakankshamore22004@gmail.com** (clickable `mailto:`), and a simple message form (UI only).
4. **`/login`** + **`/signup`** — Real styled forms (email/password, show/hide password, inline validation, "Remember me", Google button visual). Stores nothing — submits show a "demo mode" note. Header "Get started" → signup; "Sign in" → login.

### F. Add "Free Casual Talk" scenario
Append to `lib/scenarios.ts`: id `casual`, emoji 💬, *"Free Casual Talk / Freie Unterhaltung"*, AI role "ein Freund/eine Freundin zum Plaudern", open-ended chit-chat (weather, day, hobbies, plans) — no fixed scene so it's the freeform practice option. Shows in the scenario picker like the others.

### G. Polish to reduce "AI look"
- Replace the indigo gradient hero with off-white card + near-black serif headline + clay accent line.
- Scenario cards: off-white + sand border, clay ring on active (not indigo glow).
- Tighter type scale, warmer borders, softer shadows, no candy colors except clay.

### Files touched
- **Rewrite:** `tailwind.config.ts`, `app/globals.css`, `components/Logo.tsx`.
- **New components:** `components/SiteHeader.tsx`, `components/SiteFooter.tsx`.
- **New pages:** `app/(site)/layout.tsx`, move `app/page.tsx`→`app/(site)/page.tsx`, `app/(site)/about/page.tsx`, `app/(site)/help/page.tsx`, `app/(site)/contact/page.tsx`, `app/(site)/login/page.tsx`, `app/(site)/signup/page.tsx`.
- **Edit:** `lib/scenarios.ts` (+ casual), `app/layout.tsx` (title), `README.md`, `handoff.md`.
- Conversation page: **no structural change** (it uses tokens → restyles automatically).

### Verify
`npm run build` (catch type/route errors), then `npm run dev` + curl home + a real `/api/chat` call to confirm the redesign didn't break the working Gemini flow. Update `handoff.md`.

### Out of scope (your call later)
Logo design, real backend auth, saving progress.