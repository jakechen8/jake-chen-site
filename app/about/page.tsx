import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import CareerTimeline from '@/components/CareerTimeline'
import HeadshotEasterEgg from '@/components/HeadshotEasterEgg'

export const metadata: Metadata = {
  title: 'About — Strategy Lead at Waymo, MIT Sloan MBA',
  description: 'Jake Chen — Strategy Lead at Waymo. 15+ years across McKinsey, HubSpot, Microsoft, and Deloitte. Writing about AI strategy, autonomous systems, and what changes when AI meets the real world. MIT Sloan MBA.',
  alternates: { canonical: 'https://jake-chen.com/about' },
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8">
      <div className="py-16 sm:py-24">

        {/* Photo + intro */}
        <div className="mb-16 flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:gap-12">
          <HeadshotEasterEgg />
          <div>
            <h1
              className="mb-3 font-display text-4xl font-normal tracking-tight sm:text-5xl"
              style={{ color: 'var(--fg)' }}
            >
              Jake Chen
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
              Strategy Lead at Waymo. I spend my days figuring out what happens when AI meets
              the real world &mdash; and my evenings writing about it and building&nbsp;things.
            </p>
          </div>
        </div>

        {/* Bio */}
        <div
          className="mb-16 space-y-5 text-base leading-relaxed"
          style={{ color: 'var(--fg-muted)' }}
        >
          <p>
            For the past six years, I&apos;ve been at{' '}
            <span style={{ color: 'var(--fg)' }} className="font-medium">Waymo</span>,
            advising the executive team on go-to-market, pricing, and competitive strategy
            for autonomous mobility. It&apos;s given me a front-row seat to what happens
            when AI enters the real world &mdash; the parts that don&apos;t fit in a demo.
          </p>
          <p>
            Before that, I was an Engagement Manager at{' '}
            <span style={{ color: 'var(--fg)' }} className="font-medium">McKinsey</span>{' '}
            across technology, financial services, and retail. My earlier career includes
            analytics at <span style={{ color: 'var(--fg)' }} className="font-medium">HubSpot</span>,
            product strategy at <span style={{ color: 'var(--fg)' }} className="font-medium">Microsoft</span>,
            and five years of management consulting at <span style={{ color: 'var(--fg)' }} className="font-medium">Deloitte</span>.
          </p>
          <p>
            The thread across 15+ years: understanding how complex systems create
            and capture value &mdash; and what breaks when they scale.
          </p>
          <p>
            Outside of work, I{' '}
            <Link
              href="/projects"
              className="underline underline-offset-2 transition-colors hover:text-[color:var(--accent)]"
              style={{ color: 'var(--accent)' }}
            >
              write code and build things
            </Link>{' '}
            for fun. I find that staying close to the craft &mdash; building a game,
            designing a site, tinkering with new frameworks &mdash; makes me a sharper
            strategist and a better collaborator with technical teams.
          </p>
          <p>
            I hold an MBA from{' '}
            <span style={{ color: 'var(--fg)' }} className="font-medium">MIT Sloan</span>{' '}
            and a double major in Finance and Information Systems from the University of Minnesota.
          </p>
        </div>

        <div className="h-px" style={{ background: 'var(--border)' }} />

        {/* Career timeline */}
        <div className="py-16">
          <h2
            className="mb-8 font-display text-2xl font-normal tracking-tight"
            style={{ color: 'var(--fg)' }}
          >
            Career
          </h2>
          <CareerTimeline />
        </div>

        <div className="h-px" style={{ background: 'var(--border)' }} />

        {/* Ask me about */}
        <div className="py-16">
          <h2
            className="mb-6 font-display text-2xl font-normal tracking-tight"
            style={{ color: 'var(--fg)' }}
          >
            Ask me about
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Second-order effects of AI', href: '/writing/second-order-effects' },
              { label: 'Trust in autonomous systems', href: '/writing/on-trust-in-systems' },
              { label: 'Why protocols beat models', href: '/writing/openclaw-new-operating-layer' },
              { label: 'The future of strategy work', href: '/writing/the-forward-deployed-strategist' },
              { label: 'Vibe coding (what works, what doesn\'t)', href: '/writing/what-i-got-wrong-about-vibe-coding' },
              { label: 'Autonomous vehicle strategy', href: '/about' },
              { label: 'Go-to-market for deep tech', href: '/about' },
              { label: 'Building things for fun', href: '/play' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full border px-3.5 py-1.5 text-sm transition-all hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                style={{ borderColor: 'var(--border-strong)', color: 'var(--fg-muted)' }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="h-px" style={{ background: 'var(--border)' }} />

        {/* Fun facts */}
        <div className="py-16">
          <h2
            className="mb-6 font-display text-2xl font-normal tracking-tight"
            style={{ color: 'var(--fg)' }}
          >
            Things you might not guess
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { emoji: '🎮', text: 'Built an AI-themed endless runner game from scratch — play it on this site.' },
              { emoji: '🏃', text: 'Ran a marathon. Once. That was enough data to make the decision not to do it again.' },
              { emoji: '🌏', text: 'Grew up in Minnesota, did grad school in Boston, now based in the Bay Area.' },
              { emoji: '📚', text: 'Re-read "Thinking in Systems" every year. It gets better each time.' },
            ].map((fact) => (
              <div
                key={fact.text}
                className="flex gap-3 rounded-lg border p-4"
                style={{ borderColor: 'var(--border)' }}
              >
                <span className="text-xl">{fact.emoji}</span>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                  {fact.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px" style={{ background: 'var(--border)' }} />

        {/* Tools & skills */}
        <div className="py-16">
          <h2
            className="mb-8 font-display text-2xl font-normal tracking-tight"
            style={{ color: 'var(--fg)' }}
          >
            Tools I reach for
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                category: 'Strategy',
                items: ['Competitive analysis', 'Pricing models', 'Go-to-market', 'Scenario planning', 'M&A diligence'],
              },
              {
                category: 'Technical',
                items: ['TypeScript', 'React', 'Next.js', 'Python', 'SQL', 'Tailwind', 'Node.js'],
              },
              {
                category: 'AI & Data',
                items: ['Claude', 'GPT-4', 'Cursor', 'Jupyter', 'pandas', 'Perplexity'],
              },
              {
                category: 'Design & Product',
                items: ['Figma', 'Excalidraw', 'Vercel', 'GitHub', 'Notion'],
              },
            ].map((group) => (
              <div key={group.category}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                  {group.category}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border px-2.5 py-1 text-xs"
                      style={{ borderColor: 'var(--border-strong)', color: 'var(--fg-muted)' }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px" style={{ background: 'var(--border)' }} />

        {/* Contact section — merged from /contact */}
        <div className="py-16" id="contact">
          <h2
            className="mb-4 font-display text-2xl font-normal tracking-tight"
            style={{ color: 'var(--fg)' }}
          >
            Say hello
          </h2>
          <p className="mb-6 max-w-lg text-base leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
            I&apos;m always happy to connect with people thinking about AI, how it reshapes
            industries, and what actually changes when these systems hit the real world. Drop me a note&nbsp;anytime.
          </p>

          <div className="flex flex-wrap gap-3">
            <a href="mailto:hello@jake-chen.com" className="btn-primary">
              hello@jake-chen.com
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="2" y1="7" x2="12" y2="7" />
                <polyline points="8 3 12 7 8 11" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/jiakechen"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              LinkedIn
            </a>
            <a
              href="https://x.com/mitjake"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              X / Twitter
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
