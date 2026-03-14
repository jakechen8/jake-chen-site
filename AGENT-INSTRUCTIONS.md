# Agent Instructions: Make jake-chen.com World-Class

You are upgrading Jake Chen's personal website (jake-chen.com) from "good" to "the kind of site people send to friends." Jake is a Strategy Lead at Waymo with 15+ years across McKinsey, HubSpot, Microsoft, and Deloitte. MIT Sloan MBA. The site runs Next.js 14 App Router, TypeScript, Tailwind, MDX.

**Brand identity to preserve:** Dark, minimal, warm. Amber/orange accent (#B45309 light, #D97706 dark). Playfair Display for headings, Inter for body, JetBrains Mono for code. The voice is direct, confident, zero buzzwords — like talking to a sharp friend over drinks.

**DO NOT:** Change the color scheme, fonts, or voice. Don't add stock imagery. Don't make it feel corporate. Don't add a chatbot. Don't add testimonials. Don't break existing pages.

---

## Phase 1: Write 5 New Blog Posts (Estimated: 2-3 hours)

The site only has 3 posts. That's the single biggest gap. Write 5 new essays in Jake's voice. Each should be 800-1500 words, have an interactive MDX component, and feel like something worth sharing on Twitter/LinkedIn.

### Post 1: "The Demo Trap: Why Most AI Products Die After the Wow Moment"
- **File:** `content/posts/the-demo-trap.mdx`
- **Tags:** ["AI Strategy", "Product", "GTM"]
- **Angle:** The gap between a killer demo and a product that retains users. Why "wow" doesn't equal PMF. Use examples from the AI space (ChatGPT plugins dying, voice AI demos vs. actual adoption, etc.)
- **Interactive component:** Create `components/DemoToRetention.tsx` — a slider visualization. User drags a slider from "Demo Day" to "Day 90" and watches metrics change: excitement drops, support tickets rise, churn spikes. Shows why the "valley of disappointment" kills most AI products.
- **Voice reference:** Direct, opinionated, uses "I" and personal anecdotes from Waymo/McKinsey where relevant.

### Post 2: "Every Company Has an AI Strategy. Almost None Have an AI Operating Model."
- **File:** `content/posts/ai-operating-model.mdx`
- **Tags:** ["AI Strategy", "Enterprise", "Operations"]
- **Angle:** Strategy decks are easy. The hard part is who owns the model, who retrains it, who handles edge cases at 2am, who decides when to override the AI. Most companies skip this.
- **Interactive component:** Create `components/StrategyVsOps.tsx` — two columns: "What the Strategy Deck Says" vs "What Actually Happens at 2am." User clicks through 5 scenarios (model drift, edge case explosion, compliance audit, team disagreement, vendor lock-in). Each reveals the gap between theory and operations.
- **Voice:** Draw from real experience. "I've sat in the room when..." energy.

### Post 3: "The Autonomy Spectrum: Why 'How Much AI' Is the Wrong Question"
- **File:** `content/posts/the-autonomy-spectrum.mdx`
- **Tags:** ["Autonomy", "AI Systems", "Decision-Making"]
- **Angle:** People frame AI decisions as "human vs. machine." The real question is the spectrum between full human control and full autonomy — and most organizations are bad at picking where to sit on it.
- **Interactive component:** Create `components/AutonomySpectrum.tsx` — a horizontal spectrum from "Fully Human" to "Fully Autonomous" with 5 zones. User clicks each zone to see real examples (medical diagnosis, content moderation, trading, self-driving, spam filtering). Each zone shows trade-offs: speed vs. accountability, cost vs. risk, trust vs. efficiency.
- **Voice:** Use Waymo as a reference point without revealing anything confidential.

### Post 4: "What I Got Wrong About Vibe Coding"
- **File:** `content/posts/what-i-got-wrong-about-vibe-coding.mdx`
- **Tags:** ["Software", "Vibe Coding", "AI Tools"]
- **Angle:** Follow-up to "You Don't Need a Glossary." Jake tried full vibe-coding for a project. What worked, what broke, what surprised him. Honest retrospective.
- **Interactive component:** Create `components/VibeCodingScorecard.tsx` — a scorecard/rubric where user rates 6 dimensions of vibe coding (speed, quality, learning, debugging, maintainability, fun) on 1-5 scales. As they rate, Jake's actual ratings appear alongside theirs with short commentary for each. Shows a comparison radar chart at the end.
- **Voice:** Self-deprecating, honest about mistakes. "I thought I could..." → "here's what actually happened."

### Post 5: "Second-Order Effects: The AI Changes Nobody's Talking About"
- **File:** `content/posts/second-order-effects.mdx`
- **Tags:** ["AI Strategy", "Second-Order Effects", "Futures"]
- **Angle:** Everyone talks about first-order effects (AI replaces X job, AI makes Y faster). The interesting stuff is second-order: what happens to insurance when self-driving eliminates most accidents? What happens to real estate when remote work + AI assistants make location irrelevant? What happens to education when AI tutors are better than most teachers?
- **Interactive component:** Create `components/SecondOrderChain.tsx` — a branching cause-and-effect tree. User starts with a first-order effect ("AI drives most cars") and clicks to reveal second-order consequences branching outward. 3-4 chains total. Each node has a short explanation.
- **Voice:** Speculative but grounded. "I don't know the answer, but here's the question nobody's asking."

### Writing guidelines for ALL posts:
- Frontmatter: title, date (use dates spread across 2025-2026), excerpt (1-2 sentences), tags, published: true
- Start with a hook — no "In this essay I will..." energy
- Use `##` for sections, keep sections 3-6 paragraphs
- Place the interactive component mid-essay where it adds the most
- End with a sharp closing thought, not a summary
- Import and register each new component in `app/writing/[slug]/page.tsx`
- Each component should be accessible (ARIA labels, keyboard nav, prefers-reduced-motion support)
- Components should work in both light and dark mode using CSS variables (--fg, --fg-muted, --accent, --border, --bg, etc.)
- Components should be mobile-responsive

---

## Phase 2: Home Page Elevation (Estimated: 1 hour)

### 2a. Add a "Featured Project" spotlight
Below the "Now" section and above "Recent essays," add a featured project spotlight — a visually distinct card that rotates through projects. Start with AI Runner since it's the most fun.

- Animated canvas preview (tiny 300x100 version of the game running in attract mode, auto-playing)
- "Play it →" CTA
- Subtle glow/gradient that matches the brand

### 2b. Add a "What I'm Reading" or "Bookshelf" section
After the essays section, add a small "What I'm reading" row. 3-4 books with:
- Title and author
- One-sentence take from Jake
- These should be real, influential books relevant to AI/strategy/systems thinking. Good picks: "Thinking in Systems" by Donella Meadows, "The Alignment Problem" by Brian Christian, "Competing in the Age of AI" by Iansiti & Lakhani, "Thinking, Fast and Slow" by Kahneman.

### 2c. Micro-interactions
- Add a subtle parallax effect to the hero section (text moves slightly on scroll)
- Add number counting animation to any stats on the page
- Ensure all new animations respect `prefers-reduced-motion`

---

## Phase 3: Play Page Upgrade (Estimated: 1 hour)

### 3a. High score persistence
- Store high scores in localStorage
- Show a "Personal Best" badge on the play page
- Add a "Share your score" button that generates a tweet: "I scored [X] on @mitjake's AI Runner game. Can you beat it? jake-chen.com/play"

### 3b. Game enhancements
- Add a "combo" system — dodging consecutive obstacles without getting hit builds a multiplier
- Add particle effects when collecting power-ups
- Add screen shake on collision (subtle, respect reduced motion)
- Show a mini leaderboard of the player's last 5 runs

### 3c. Achievement system
Create 5-8 achievements that unlock during gameplay:
- "First Deploy" — complete your first run
- "Bug Dodger" — dodge 10 obstacles in a row
- "Speed Demon" — reach 500m
- "Marathon Runner" — reach 2000m
- "Boost Addict" — use boost 5 times in one run
- Show achievements as toast notifications during gameplay
- Display unlocked achievements below the game canvas

---

## Phase 4: About Page Enhancement (Estimated: 30 min)

### 4a. Interactive career timeline
Replace the static timeline with a more visual one:
- Horizontal scrollable timeline on desktop
- Each node expands on click to show more detail
- Subtle connecting line animation on scroll

### 4b. Skills/tools visualization
Add a section below career showing tools and technologies Jake uses:
- Strategy: McKinsey frameworks, competitive analysis, pricing models
- Technical: Python, TypeScript, React, Next.js, SQL
- Design: Figma, Tailwind, design systems
- Show as a clean tag cloud or grid — NOT a skills bar chart (those are cheesy)

---

## Phase 5: Writing Page Polish (Estimated: 30 min)

### 5a. Reading time estimates
Make sure all posts show reading time on the writing list page and individual post pages.

### 5b. Related posts
At the bottom of each blog post, show "You might also like" with 1-2 related posts based on tag overlap.

### 5c. Tag filtering
On the /writing page, add clickable tag pills that filter posts by tag. Simple, no page reload.

---

## Phase 6: New "Uses" Page (Estimated: 30 min)

Create `/app/uses/page.tsx` — a "Uses" page (popular in developer/tech personal sites). What Jake uses daily:

- **Hardware:** MacBook Pro, monitor, desk setup (keep it brief)
- **Software:** VS Code, Cursor, Arc browser, Notion, Figma, etc.
- **AI Tools:** Claude, ChatGPT, Midjourney, Cursor, etc.
- **Productivity:** Calendar blocking, note-taking system, reading workflow

This should be clean and minimal, not an affiliate link farm. Add it to the nav.

---

## Phase 7: Performance & Polish (Estimated: 30 min)

### 7a. Loading states
- Add skeleton loading states for dynamic content
- Add smooth page transitions between routes

### 7b. 404 page
Create a fun custom 404 page:
- "This page took a wrong turn" or similar
- Mini version of the AI Runner game character
- Links back to home, writing, projects

### 7c. Easter eggs
- Konami code on any page triggers a brief confetti animation in amber/orange
- Console.log message: "Hey, you're looking at the source? Nice. I built this site from scratch. If you want to talk code or strategy: hello@jake-chen.com"
- On the about page, clicking the headshot 5 times triggers a brief silly animation

### 7d. Footer enhancement
- Add a "Built with Next.js, TypeScript, and too much coffee" tagline
- Add a small "Last updated: [date]" indicator
- Add a fun rotating quote from Jake's essays in the footer

---

## Technical Rules

1. **Build after every major phase.** Run `npm run build` and fix all errors before moving to the next phase. The build command is run from the project root.

2. **File structure:**
   - New pages go in `app/[page-name]/page.tsx`
   - New components go in `components/[ComponentName].tsx`
   - New blog posts go in `content/posts/[slug].mdx`
   - Register new MDX components in `app/writing/[slug]/page.tsx` in the `mdxComponents` object

3. **Styling rules:**
   - Use CSS variables from globals.css (--fg, --fg-muted, --fg-subtle, --accent, --border, --bg, --bg-warm, etc.)
   - Use Tailwind utility classes
   - Dark mode works automatically via CSS variables — no need for `dark:` prefixes
   - Brand colors: amber accent #B45309 (light), #D97706 (dark)

4. **Component patterns:**
   - Use `'use client'` directive for any component with interactivity (useState, useEffect, onClick, etc.)
   - All interactive components need: ARIA labels, keyboard navigation, `prefers-reduced-motion` support
   - Use TypeScript with proper types
   - Mobile-first responsive design

5. **Content rules:**
   - Jake's voice: direct, no buzzwords, uses "I", conversational but smart
   - Don't use words like: "leverage," "synergy," "disrupt," "empower," "utilize," "paradigm"
   - Don't use: "Let's dive in," "In this article," "Without further ado"
   - Preferred closers: a sharp question, a provocative reframe, or a quiet observation
   - Keep paragraphs short (2-4 sentences). Use whitespace.

6. **Git:** Commit after each phase with a descriptive message. Don't force push. Don't amend.

7. **Sitemap:** If you add new pages, add them to `app/sitemap.ts`.

8. **Nav:** If you add a new top-level page (like /uses), add it to the Nav component in `components/Nav.tsx`.

---

## Priority Order

If time runs short, prioritize in this order:
1. **Blog posts** (Phase 1) — content is king, this is the #1 gap
2. **Play page upgrades** (Phase 3) — makes the site memorable and shareable
3. **Home page elevation** (Phase 2) — first impression matters
4. **Writing page polish** (Phase 5) — makes existing content more discoverable
5. **404 page + Easter eggs** (Phase 7c, 7b) — personality and polish
6. **About page** (Phase 4) — nice to have
7. **Uses page** (Phase 6) — nice to have
8. **Performance polish** (Phase 7a, 7d) — nice to have
