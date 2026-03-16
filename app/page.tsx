import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import EmailCapture from '@/components/EmailCapture'
import Bookshelf from '@/components/Bookshelf'
import ParallaxHero from '@/components/ParallaxHero'
import StrategyQuiz from '@/components/StrategyQuiz'
import IndustryBottleneck from '@/components/IndustryBottleneck'

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
        {/* Signature gradient accent */}
        <div className="accent-gradient-bar" />

        <ParallaxHero>
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="relative z-10 py-20 sm:py-28">
            {/* Eyebrow */}
            <div className="mb-6 flex items-center gap-3">
              <div
                className="relative h-12 w-12 overflow-hidden rounded-full border-2"
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
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--fg)' }}>
                  Jake Chen
                </p>
                <p className="text-xs" style={{ color: 'var(--fg-subtle)' }}>
                  Strategy Lead at Waymo
                </p>
              </div>
            </div>

            {/* Main headline */}
            <h1
              className="max-w-2xl font-display text-4xl font-normal leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
              style={{ color: 'var(--fg)' }}
            >
              I study what happens when AI
              <span className="accent-text"> meets the real world.</span>
            </h1>

            <p
              className="mt-5 max-w-xl text-lg leading-relaxed"
              style={{ color: 'var(--fg-muted)' }}
            >
              How it reshapes decisions, organizations, and the systems that run them &mdash;
              and what the best teams do differently. Previously McKinsey, HubSpot, Microsoft.
              MIT&nbsp;Sloan&nbsp;MBA.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/writing" className="btn-primary">
                Read my essays
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="2" y1="7" x2="12" y2="7" />
                  <polyline points="8 3 12 7 8 11" />
                </svg>
              </Link>
              <Link href="/projects" className="btn-ghost">Things I&apos;ve built</Link>
            </div>
          </div>
        </div>
        </ParallaxHero>
        <div className="h-px" style={{ background: 'var(--border)' }} />
      </section>

      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        {/* ── Now ── */}
        <section className="py-16 sm:py-20">
          <div className="mb-8 flex items-center gap-3">
            <div className="now-indicator" />
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--accent)' }}
            >
              Now
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="now-card">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--fg-subtle)' }}>
                Day job
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--fg)' }}>
                Leading strategy at <strong>Waymo</strong> — helping autonomous mobility scale from prototype to product.
              </p>
            </div>
            <div className="now-card">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--fg-subtle)' }}>
                Writing about
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--fg)' }}>
                What happens when AI systems start making real decisions. Second-order effects. The gap between what gets announced and what actually&nbsp;ships.
              </p>
            </div>
            <div className="now-card">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--fg-subtle)' }}>
                After hours
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--fg)' }}>
                Tinkering with code. Built an <Link href="/play" className="underline underline-offset-2 transition-colors hover:text-[color:var(--accent)]" style={{ color: 'var(--accent)' }}>AI-themed game</Link> and this site from scratch.
              </p>
            </div>
          </div>
        </section>

        <div className="h-px" style={{ background: 'var(--border)' }} />

        {/* ── Featured Project ── */}
        <section className="py-16 sm:py-20">
          <div className="mb-8">
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--accent)' }}
            >
              Featured project
            </p>
          </div>
          <Link
            href="/play"
            className="group block rounded-lg border p-6 transition-all sm:p-8"
            style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-warm)' }}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3
                  className="mb-1 font-display text-xl font-normal tracking-tight sm:text-2xl"
                  style={{ color: 'var(--fg)' }}
                >
                  AI Runner
                </h3>
                <p className="max-w-md text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                  An endless runner where you deploy an AI agent through bugs, firewalls, and hallucinations. Built with Canvas and React. How far can your model go?
                </p>
              </div>
              <span
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium transition-colors group-hover:border-[color:var(--accent)] group-hover:text-[color:var(--accent)]"
                style={{ borderColor: 'var(--border-strong)', color: 'var(--fg-muted)' }}
              >
                Play it
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="2" y1="7" x2="12" y2="7" />
                  <polyline points="8 3 12 7 8 11" />
                </svg>
              </span>
            </div>
          </Link>
        </section>

        <div className="h-px" style={{ background: 'var(--border)' }} />

        {/* ── Try It Yourself ── */}
        <section className="py-16 sm:py-20">
          <div className="mb-8">
            <p
              className="mb-3 text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--accent)' }}
            >
              Try it yourself
            </p>
            <h2
              className="font-display text-2xl font-normal tracking-tight sm:text-3xl"
              style={{ color: 'var(--fg)' }}
            >
              Interactive experiments
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--fg)' }}>
                What&apos;s your AI strategy score?
              </h3>
              <StrategyQuiz />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--fg)' }}>
                The bottleneck finder
              </h3>
              <IndustryBottleneck />
            </div>
          </div>
        </section>

        <div className="h-px" style={{ background: 'var(--border)' }} />

        {/* ── Recent Writing ── */}
        {recentPosts.length > 0 && (
          <section className="py-16 sm:py-20">
            <div className="mb-8 flex items-end justify-between">
              <h2
                className="font-display text-2xl font-normal tracking-tight sm:text-3xl"
                style={{ color: 'var(--fg)' }}
              >
                Recent essays
              </h2>
              <Link
                href="/writing"
                className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[color:var(--accent)]"
                style={{ color: 'var(--fg-muted)' }}
              >
                All writing
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

        {/* ── Bookshelf ── */}
        <section className="py-16 sm:py-20">
          <Bookshelf />
        </section>

        <div className="h-px" style={{ background: 'var(--border)' }} />

        {/* ── Subscribe ── */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-lg text-center">
            <h2
              className="mb-3 font-display text-2xl font-normal tracking-tight sm:text-3xl"
              style={{ color: 'var(--fg)' }}
            >
              Join the conversation
            </h2>
            <p className="mb-8 text-sm leading-relaxed" style={{ color: 'var(--fg-subtle)' }}>
              I send essays when they&apos;re ready &mdash; honest thinking on how AI is reshaping
              decisions, industries, and the systems we rely on. No spam, no&nbsp;schedule.
            </p>
            <EmailCapture compact />
          </div>
        </section>
      </div>
    </div>
  )
}
