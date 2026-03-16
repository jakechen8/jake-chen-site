# 2-Hour Site Upgrade Sprint

You are working on jake-chen.com — a Next.js 14 personal site for Jake Chen (Strategy Lead at Waymo). The site uses TypeScript, Tailwind, MDX, and CSS custom properties (--fg, --fg-muted, --accent, --border, --bg, --bg-warm, --accent-light, etc.). Brand color is amber (#B45309 light / #D97706 dark). Font stack: Playfair Display for headings, Inter for body, JetBrains Mono for code. All interactive components must respect prefers-reduced-motion and use ARIA labels.

**IMPORTANT BUILD NOTE:** The mounted filesystem causes rsync deadlocks. You MUST copy changed files to `/sessions/epic-practical-mccarthy/jake-chen-site-build/` and build there. Never run `next build` from the mounted directory. After each phase, copy changed files and run `cd /sessions/epic-practical-mccarthy/jake-chen-site-build && npm run build` to verify.

**IMPORTANT GIT NOTE:** Do NOT `git add` these ghost files that keep reappearing: IntegrationRace.tsx, MythReality.tsx, PulseCheck.tsx, ReadingCard.tsx, SeriesNav.tsx. They are deleted and should stay deleted.

Your job: spend the next 2 hours making this site more impressive, fun, and polished. Build after every phase. Commit after every phase. Here's what to do:

---

## Phase 1: New Games on /play (45 min)

The site has an AI Runner endless runner game (components/AIRunnerGame.tsx, wrapped by GameWrapper.tsx). Add 2 more mini-games to the /play page, giving it a "game arcade" feel. Use the same design system.

### Game A: "Prompt Golf"
A word puzzle game where you try to get an AI to output a target phrase in the fewest tokens possible. Show a target output, give the player a text input for their "prompt," and score based on character count. Use 5-8 hardcoded rounds with clever AI/tech-themed targets. No API calls — everything client-side with simple string matching and fuzzy scoring.

- Canvas or DOM-based, your call
- Score tracking with localStorage
- Share button ("I scored X on Prompt Golf by @mitjake")
- Same card-style wrapper as GameWrapper

### Game B: "Token Trader"
A simple stock-ticker-style game where you buy/sell "tokens" for fictional AI companies (names like "LatentLabs," "HalluciCorp," "OverfitAI"). Prices fluctuate randomly each "day." Player starts with $10,000 and tries to maximize portfolio value over 30 days.

- Simple buy/sell UI with portfolio tracker
- Price chart visualization (canvas or inline SVG)
- News headlines that hint at price movements ("OverfitAI's model achieves 99.9% on training data")
- localStorage for high scores
- Share button

### Update /play page:
- Turn it into an arcade hub with tabs or cards for each game
- Keep AI Runner as the featured/first game
- Add a leaderboard section showing best scores across all games

---

## Phase 2: Interactive Experiments Section (30 min)

Add a new section to the home page between "Featured Project" and "Recent Essays" called "Try it yourself" — 2-3 small interactive experiments that visitors can play with right on the homepage.

### Experiment A: "What's Your AI Strategy Score?"
A 5-question quick quiz about AI strategy maturity. Questions like "How does your org handle model failures?" with 3-4 multiple choice answers. Show a score with a label (Reactive / Developing / Mature / Visionary) and a one-liner Jake would say about each level. Share button.

### Experiment B: "The Bottleneck Finder"
User picks their industry from a dropdown, then the component shows what AI will make abundant in their industry and what the new bottleneck will be. Use 8-10 industries with thoughtful, non-obvious insights. Style like the existing BottleneckShift component but simpler and more personal.

---

## Phase 3: Writing Page Upgrades (20 min)

- Add a "reading stats" banner at the top of /writing: "9 essays · ~45 min total reading time · Topics: AI Strategy, Trust, Futures..."  (computed dynamically from posts)
- Add a "Most Popular" section that highlights 3 hand-picked posts with a brief "why read this" note
- Add a "Start Here" callout for first-time visitors — a card that says "New here? Start with [The Demo Trap] — it's the essay that captures what this site is about."

---

## Phase 4: About Page Polish (15 min)

- Add a "What I'm reading" section with 2-3 current books and a one-liner take on each (different from the Bookshelf on the home page — these should be "currently reading" not "favorites")
- Add a "Fun facts" or "Things people don't expect" section with 3-4 bullet-style tidbits in Jake's voice (e.g., "I've played competitive poker," "I once built a fantasy football optimizer in Excel that my friends still use," etc. — make these feel authentic to Jake's vibe as a strategy-minded builder)
- Add an "Ask me about" section — a few topic pills that link to relevant essays (e.g., "Second-order effects" → the blog post, "AI operating models" → that post, etc.)

---

## Phase 5: Performance & Micro-interactions (10 min)

- Add smooth page transition animations (fade-in on route change)
- Add a subtle hover effect on the nav logo (e.g., slight color shift to accent)
- Add a "copy link" button on blog post pages next to the RSS link
- Ensure all new components have proper loading states

---

## General Rules
- Match the existing design system exactly — use CSS variables, not hardcoded colors
- Every interactive component needs aria-labels and keyboard navigation
- Respect prefers-reduced-motion everywhere
- Build and test after EVERY phase
- Commit after every phase with descriptive messages
- Keep the site's voice: smart, direct, slightly wry, never corporate
- If a phase is taking too long, ship a simpler version and move on
