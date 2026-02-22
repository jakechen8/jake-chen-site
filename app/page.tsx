import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import EmailCapture from '@/components/EmailCapture'

export const metadata: Metadata = {
  title: 'Jake Chen',
  description:
    'Exploring how autonomous systems move from code into the physical world — and the trust infrastructure required to make them scale.',
}

export default async function HomePage() {
  const posts = await Promise.resolve(getAllPosts())
  const recentPosts = posts.slice(0, 3)

  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8">
      {/* Hero */}
      <section className="relative py-28 sm:py-36">
        <div className="hero-shape absolute -right-32 -top-32 h-96 w-96 rounded-full"
          style={{ background: 'radial-gradient(circle, var(--accent-light) 0%, transparent 70%)' }}
        />
        <div className="hero-shape absolute -left-20 bottom-0 h-64 w-64 rounded-full"
          style={{ background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-2xl">
          <h1
            className="animate-fade-up font-display text-4xl font-normal leading-tight tracking-tight sm:text-5xl lg:text-6xl"
            style={{ color: 'var(--fg)' }}
          >
            Jake Chen
          </h1>

          <p
            className="animate-fade-up-delay mt-6 text-lg leading-relaxed sm:text-xl"
            style={{ color: 'var(--fg-muted)' }}
          >
            I explore how autonomous systems move from code into the physical
            world &mdash; and the trust infrastructure required to make them scale.
          </p>

          <p
            className="animate-fade-up-delay mt-4 text-base leading-relaxed"
            style={{ color: 'var(--fg-subtle)' }}
          >
            15+ years in strategy across Waymo, McKinsey, and the companies
            building what comes next.
          </p>

          <div className="animate-fade-up-delay-2 mt-10 flex flex-wrap gap-3">
            <Link href="/writing" className="btn-primary">
              Read my writing
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="2" y1="7" x2="12" y2="7" />
                <polyline points="8 3 12 7 8 11" />
              </svg>
            </Link>
            <Link href="/about" className="btn-ghost">
              About
            </Link>
          </div>
        </div>
      </section>

      <hr className="rule" />

      {/* Thinking */}
      <section className="py-16 sm:py-20">
        <p className="section-tag mb-6">What I think about</p>

        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              title: 'Trust at Scale',
              desc: 'What does it take for an autonomous system to earn trust — not just pass a benchmark? The gap between lab performance and real-world reliability is where most systems fail.',
            },
            {
              title: 'Intelligence Meets Physics',
              desc: "When AI leaves the screen and enters the road, the failure modes change. How systems navigate uncertainty in environments that don\u2019t forgive errors.",
            },
            {
              title: 'The Invisible Infrastructure',
              desc: "Governance, incentives, verification, safety cases. The systems beneath the system — the ones nobody wants to build but everyone depends on.",
            },
          ].map((pillar, i) => (
            <div
              key={pillar.title}
              className="pillar-card animate-fade-up"
              style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}
            >
              <h3
                className="font-display text-lg font-normal tracking-tight"
                style={{ color: 'var(--fg)' }}
              >
                {pillar.title}
              </h3>
              <p
                className="mt-3 text-sm leading-relaxed"
                style={{ color: 'var(--fg-muted)' }}
              >
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <hr className="rule" />

      {/* Recent Writing */}
      {recentPosts.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="mb-10 flex items-center justify-between">
            <h2
              className="font-display text-2xl font-normal tracking-tight"
              style={{ color: 'var(--fg)' }}
            >
              Recent Writing
            </h2>
            <Link
              href="/writing"
              className="flex items-center gap-1 text-sm transition-colors hover:text-[color:var(--accent)]"
              style={{ color: 'var(--fg-muted)' }}
            >
              All essays
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="2" y1="6" x2="10" y2="6" />
                <polyline points="6.5 2.5 10 6 6.5 9.5" />
              </svg>
            </Link>
          </div>

          <div className="grid gap-4">
            {recentPosts.map((post, i) => (
              <div
                key={post.slug}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}
              >
                <PostCard post={post} featured={i === 0} />
              </div>
            ))}
          </div>
        </section>
      )}

      <hr className="rule" />

      {/* Subscribe */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-lg text-center">
          <p className="section-tag mb-4">
            On Autonomy, Trust &amp; the Systems Beneath AI
          </p>
          <h2
            className="mb-3 font-display text-2xl font-normal tracking-tight"
            style={{ color: 'var(--fg)' }}
          >
            Thoughtful essays on how intelligent systems scale in the real world
          </h2>
          <p className="mb-8 text-sm leading-relaxed" style={{ color: 'var(--fg-subtle)' }}>
            No noise. No hype. Just signal.
          </p>
          <EmailCapture compact />
        </div>
      </section>

      <hr className="rule" />

      {/* Let's Connect */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-xl text-center">
          <h2
            className="mb-4 font-display text-3xl font-normal tracking-tight"
            style={{ color: 'var(--fg)' }}
          >
            Let&apos;s start a conversation
          </h2>
          <p
            className="mb-8 text-base leading-relaxed"
            style={{ color: 'var(--fg-muted)' }}
          >
            I&apos;m interested in how trust, governance, and incentive design
            shape the future of autonomous systems. If you&apos;re thinking
            about similar problems, I&apos;d like to hear from you.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn-primary">
              Get in touch
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
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 3H3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V7" />
                <polyline points="8 1 11 1 11 4" />
                <line x1="5" y1="7" x2="11" y2="1" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
