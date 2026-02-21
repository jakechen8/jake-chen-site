# Jake Chen — Personal Site

A production-ready personal website built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and MDX.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS custom properties
- **Content**: MDX via `next-mdx-remote`
- **Themes**: `next-themes` (system-aware dark/light mode)
- **OG Images**: `next/og` (edge runtime)
- **RSS**: `rss` package
- **Fonts**: DM Serif Display + DM Sans + DM Mono (Google Fonts via `next/font`)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Hero, recent writing, email capture |
| `/about` | Professional bio, sidebar with links |
| `/writing` | MDX post listing with tags |
| `/writing/[slug]` | Individual post with full MDX rendering |
| `/frameworks` | Curated mental models (edit in `app/frameworks/page.tsx`) |
| `/now` | Current focus (edit in `app/now/page.tsx`) |
| `/contact` | Email + social links |
| `/feed.xml` | RSS 2.0 feed |
| `/sitemap.xml` | Auto-generated sitemap |
| `/robots.txt` | Auto-generated robots |
| `/api/og` | Dynamic OG image generation |
| `/api/subscribe` | Email capture endpoint |

---

## Local Development

### Prerequisites

- Node.js 18.17+
- npm, yarn, or pnpm

### Setup

```bash
# 1. Clone / copy the project
cd jake-chen-site

# 2. Install dependencies
npm install

# 3. Copy env file
cp .env.example .env.local
# Edit NEXT_PUBLIC_SITE_URL if needed

# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Adding a Post

Create a `.mdx` file in `/content/posts/`:

```bash
touch content/posts/my-new-post.mdx
```

Front matter schema:

```mdx
---
title: "Your Post Title"
date: "2025-02-01"
excerpt: "One sentence that summarizes the post."
tags: ["Tag One", "Tag Two"]
published: true
---

Your content here in **Markdown**...
```

- `published: false` hides a post from listing and RSS (draft mode)
- `slug` is derived from the filename — `my-new-post.mdx` → `/writing/my-new-post`
- Tags are displayed as pills on the listing and post pages

---

## Customization

### Hero text
Edit `app/page.tsx` — the h1 and subhead are plain strings.

### Frameworks
Edit the `frameworks` array in `app/frameworks/page.tsx`.

### Now page
Edit the `sections` array and `LAST_UPDATED` constant in `app/now/page.tsx`.

### Contact email
Replace `hello@jakechenai.com` with your real email in:
- `app/contact/page.tsx`
- `app/about/page.tsx`
- `app/feed.xml/route.ts`

### Social links
Update LinkedIn and Substack URLs in:
- `components/Footer.tsx`
- `app/contact/page.tsx`
- `app/about/page.tsx`
- `components/JsonLd.tsx`

### Site URL
Set `NEXT_PUBLIC_SITE_URL` in `.env.local` (and in Vercel settings):
```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## Wiring Up Email Subscriptions

The `/api/subscribe` route currently logs to server console. To wire up a real provider:

### Option A: Resend + Audience

```bash
npm install resend
```

In `app/api/subscribe/route.ts`:
```ts
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

// Replace the console.log with:
await resend.contacts.create({
  email: sanitized,
  audienceId: process.env.RESEND_AUDIENCE_ID!,
})
```

### Option B: ConvertKit / Kit

Use their API to add a subscriber to a form:
```ts
await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ api_key: process.env.CONVERTKIT_API_KEY, email: sanitized }),
})
```

### Option C: Substack RSS Import

Since you may already have a Substack, you can supplement the local MDX posts by fetching and displaying your Substack RSS in the writing page. Add to `app/writing/page.tsx`:

```ts
// Fetch Substack RSS (optional)
// const substackRes = await fetch('https://YOUR_SUBSTACK.substack.com/feed', { next: { revalidate: 3600 } })
// Parse and merge with local MDX posts
```

---

## Deploying to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (first time — follow prompts)
vercel

# Set environment variable
vercel env add NEXT_PUBLIC_SITE_URL

# Deploy to production
vercel --prod
```

Or connect the GitHub repo in the Vercel dashboard — it will auto-deploy on push.

### Required env vars on Vercel

| Variable | Example | Required |
|----------|---------|----------|
| `NEXT_PUBLIC_SITE_URL` | `https://jakechenai.com` | Yes |

---

## Build Verification

```bash
npm run build
```

This should complete without errors. The build outputs:
- Static pages for all routes with `generateStaticParams`
- Edge runtime for `/api/og`
- Dynamic routes for `/api/subscribe` and `/feed.xml`

---

## Project Structure

```
jake-chen-site/
├── app/
│   ├── layout.tsx              # Root layout, fonts, metadata
│   ├── page.tsx                # Home (hero, recent posts, email)
│   ├── globals.css             # Base styles, CSS vars, dark mode
│   ├── about/page.tsx
│   ├── writing/
│   │   ├── page.tsx            # Post listing
│   │   └── [slug]/page.tsx     # Individual post
│   ├── frameworks/page.tsx
│   ├── now/page.tsx
│   ├── contact/page.tsx
│   ├── api/
│   │   ├── subscribe/route.ts  # Email capture API
│   │   └── og/route.tsx        # OG image generation
│   ├── feed.xml/route.ts       # RSS feed
│   ├── sitemap.ts              # Auto-generated sitemap
│   └── robots.ts               # Robots.txt
├── components/
│   ├── ThemeProvider.tsx       # next-themes wrapper
│   ├── Nav.tsx                 # Sticky nav with mobile menu
│   ├── Footer.tsx
│   ├── ThemeToggle.tsx
│   ├── EmailCapture.tsx        # Controlled email form
│   ├── PostCard.tsx            # Writing list card
│   └── JsonLd.tsx              # Structured data
├── content/
│   └── posts/
│       └── hello-world.mdx     # Example post
├── lib/
│   └── posts.ts                # MDX file loader
├── .env.example
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```
