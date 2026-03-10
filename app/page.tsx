import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import EmailCapture from '@/components/EmailCapture'

export const metadata: Metadata = {
  title: 'Jake Chen — Strategy, AI, and What Actually Changes',
  description:
    'Jake Chen is a Strategy Lead at Waymo. He writes about what happens when AI leaves the lab — how it changes decisions, organizations, and the systems that run them.',
  alternates: {
    canonical: 'https://jake-chen.com',
  },
}

export default async function HomePage() {
  const posts = await Promise.resolve(getAllPosts())
  const recentPosts = posts.slice(0, 3)

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ background: 'var(--bg)' }}>
        <div
          className="hero-shape absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, var(--accent-light) 0%, transparent 60%)' }}
        />

        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="relative z-10 grid items-center gap-10 py-24 sm:py-32 lg:grid-cols-[1fr_auto] lg:gap-16">
            <div className="max-w-2xl">
              <h1
                className="font-display text-5xl font-normal leading-[1.1] tracking-tight sm:text-6xl"
                style={{ color: 'var(--fg)' }}
              >
                Jake Chen
              </h1>
              <p
                className="mt-4 text-lg leading-relaxed sm:text-xl"
                style={{ color: 'var(--fg-muted)' }}
              >
                Strategy Lead at Waymo. I write about what happens when AI leaves the lab
                &mdash; how it changes decisions, organizations, and the systems that run&nbsp;them.
              </p>
              <p
                className="mt-3 text-sm"
                style={{ color: 'var(--fg-subtle)' }}
              >
                Previously McKinsey, HubSpot, Microsoft. MBA from MIT&nbsp;Sloan.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/writing" className="btn-primary">
                  Read my essays
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="2" y1="7" x2="12" y2="7" />
                    <polyline points="8 3 12 7 8 11" />
                  </svg>
                </Link>
                <Link href="/about" className="btn-ghost">About me</Link>
              </div>
            </div>

            {/* Photo */}
            <div className="hidden lg:block">
              <div
                className="relative h-64 w-64 overflow-hidden rounded-2xl border-2 shadow-xl"
                style={{ borderColor: 'var(--border-strong)' }}
              >
                <Image
                  src="/images/headshot1.jpg"
                  alt="Jake Chen"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
        <div className="h-px" style={{ background: 'var(--border)' }} />
      </section>

      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        {/* ── What I Write About ── */}
        <section className="py-20 sm:py-24">
          <div className="mb-10 max-w-lg">
            <h2
              className="font-display text-3xl font-normal tracking-tight sm:text-4xl"
              style={{ color: 'var(--fg)' }}
            >
              What I think about
            </h2>
            <p className="mt-3 text-base leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
              Not which model is best &mdash; but what changes when intelligence becomes cheap.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                title: 'Decisions & Coordination',
                desc: 'When everyone can generate analysis on demand, the bottleneck moves from information to alignment. I write about how that shift plays out inside real organizations.',
              },
              {
                title: 'Platforms & Distribution',
                desc: 'The next platform war will be fought in protocols, not models. I think about how interoperability is quietly becoming the most important competitive advantage.',
              },
              {
                title: 'Trust & Governance',
                desc: 'Governance is not overhead &mdash; it\'s how you earn the right to automate. The companies that get this right will move fastest.',
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="pillar-card group"
              >
                <h3
                  className="mb-3 font-display text-lg font-normal tracking-tight"
                  style={{ color: 'var(--fg)' }}
                >
                  {pillar.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="h-px" style={{ background: 'var(--border)' }} />

        {/* ── Recent Writing ── */}
        {recentPosts.length > 0 && (
          <section className="py-20 sm:py-24">
            <div className="mb-10 flex items-end justify-between">
              <h2
                className="font-display text-3xl font-normal tracking-tight"
                style={{ color: 'var(--fg)' }}
              >
                Recent essays
              </h2>
              <Link
                href="/writing"
                className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[color:var(--accent)]"
                style={{ color: 'var(--fg-muted)' }}
              >
                View all
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="2" y1="7" x2="12" y2="7" />
                  <polyline points="8 3 12 7 8 11" />
                </svg>
              </Link>
            </div>

            <div className="grid gap-4">
              {recentPosts.map((post, i) => (
                <PostCard key={post.slug} post={post} featured={i === 0} />
              ))}
            </div>
          </section>
        )}

        <div className="h-px" style={{ background: 'var(--border)' }} />

        {/* ── Play ── */}
        <section className="py-20 sm:py-24">
          <div className="grid items-center gap-8 sm:grid-cols-[1fr_auto]">
            <div>
              <h2
                className="mb-3 font-display text-3xl font-normal tracking-tight"
                style={{ color: 'var(--fg)' }}
              >
                Play a game
              </h2>
              <p className="text-base leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                I built an endless runner where you deploy an AI agent through bugs, firewalls,
                and hallucinations. It gets faster. You will crash. Pick your difficulty.
              </p>
            </div>
            <Link href="/play" className="btn-primary whitespace-nowrap">
              Play AI Runner
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </Link>
          </div>
        </section>

        <div className="h-px" style={{ background: 'var(--border)' }} />

        {/* ── Subscribe ── */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-lg text-center">
            <h2
              className="mb-3 font-display text-3xl font-normal tracking-tight"
              style={{ color: 'var(--fg)' }}
            >
              Stay in the loop
            </h2>
            <p className="mb-8 text-base leading-relaxed" style={{ color: 'var(--fg-subtle)' }}>
              I send essays when they&apos;re ready. No spam, no schedule, just clear thinking on AI strategy.
            </p>
            <EmailCapture compact />
          </div>
        </section>

        <div className="h-px" style={{ background: 'var(--border)' }} />

        {/* ── CTA ── */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-xl text-center">
            <h2
              className="mb-4 font-display text-3xl font-normal tracking-tight"
              style={{ color: 'var(--fg)' }}
            >
              Get in touch
            </h2>
            <p
              className="mb-8 text-base leading-relaxed"
              style={{ color: 'var(--fg-muted)' }}
            >
              If you&apos;re thinking about AI strategy, organizational coordination, or trust
              infrastructure &mdash; I&apos;d like to hear from you.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn-primary">
                Say hello
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="2" y1="7" x2="12" y2="7" />
                  <polyline points="8 3 12 7 8 11" />
                </svg>
              </Link>
              <a
                href="https://linkedin.com/in/jiakechen"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
