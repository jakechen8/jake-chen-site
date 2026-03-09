import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import EmailCapture from '@/components/EmailCapture'
import ReadingCard from '@/components/ReadingCard'

export const metadata: Metadata = {
  title: 'Jake Chen — AI Strategy, Trust, and the Systems Beneath',
  description:
    'Jake Chen writes about how AI reshapes strategy, coordination, and trust. 15+ years across Waymo, McKinsey, HubSpot, and Microsoft.',
  alternates: {
    canonical: 'https://jake-chen.com',
  },
}

const readingList = [
  {
    title: 'Situational Awareness',
    author: 'Leopold Aschenbrenner',
    url: 'https://situational-awareness.ai/',
    note: 'The clearest picture of where AI capability is heading and what it means for institutions.',
  },
  {
    title: 'The Bitter Lesson',
    author: 'Rich Sutton',
    url: 'http://www.incompleteideas.net/IncIdeas/BitterLesson.html',
    note: 'Why general methods that leverage computation always win. Still underrated.',
  },
  {
    title: 'Thinking in Systems',
    author: 'Donella Meadows',
    url: 'https://www.chelseagreen.com/product/thinking-in-systems/',
    note: 'The mental model behind everything I write about governance and infrastructure.',
  },
  {
    title: 'Working in Public',
    author: 'Nadia Asparouhova',
    url: 'https://press.stripe.com/working-in-public',
    note: 'How open-source maintenance maps to the coordination problems AI creates at scale.',
  },
]

export default async function HomePage() {
  const posts = await Promise.resolve(getAllPosts())
  const recentPosts = posts.slice(0, 3)

  return (
    <div>
      {/* Hero — full width, dramatic */}
      <section className="relative overflow-hidden" style={{ background: 'var(--bg)' }}>
        <div className="hero-shape absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, var(--accent-light) 0%, transparent 60%)' }}
        />
        <div className="hero-shape absolute -left-32 bottom-0 h-80 w-80 rounded-full"
          style={{ background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 60%)' }}
        />

        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="relative z-10 grid items-center gap-10 py-24 sm:py-32 lg:grid-cols-[1fr_auto] lg:gap-16">
            <div className="max-w-2xl">
              <div className="animate-fade-up mb-5">
                <span
                  className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide"
                  style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: 'var(--accent)' }} />
                  Strategy Lead at Waymo
                </span>
              </div>

              <h1
                className="animate-fade-up font-display text-5xl font-normal leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl"
                style={{ color: 'var(--fg)' }}
              >
                Jake Chen
              </h1>

              <p
                className="animate-fade-up-delay mt-6 text-lg leading-relaxed sm:text-xl"
                style={{ color: 'var(--fg-muted)' }}
              >
                I write about the business side of AI — how it changes strategy,
                coordination, and the way organizations actually work. Not the hype.
                The implications.
              </p>

              <div className="animate-fade-up-delay-2 mt-10 flex flex-wrap gap-3">
                <Link href="/writing" className="btn-primary">
                  Read my essays
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="2" y1="7" x2="12" y2="7" />
                    <polyline points="8 3 12 7 8 11" />
                  </svg>
                </Link>
                <Link href="/about" className="btn-ghost">About me</Link>
                <Link href="/play" className="btn-ghost">
                  Play a game
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Photo */}
            <div className="hidden lg:block">
              <div
                className="animate-fade-up-delay relative h-72 w-72 overflow-hidden rounded-2xl border-2 shadow-xl"
                style={{ borderColor: 'var(--border-strong)' }}
              >
                <Image
                  src="/images/headshot.png"
                  alt="Jake Chen"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Subtle bottom border */}
        <div className="h-px" style={{ background: 'var(--border)' }} />
      </section>

      {/* Social proof / credentials strip */}
      <section style={{ background: 'var(--bg-warm)' }}>
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-8 px-5 py-5 sm:gap-12 sm:px-8">
          {['Waymo', 'McKinsey', 'MIT Sloan', 'HubSpot', 'Microsoft'].map((name) => (
            <span
              key={name}
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: 'var(--fg-subtle)' }}
            >
              {name}
            </span>
          ))}
        </div>
        <div className="h-px" style={{ background: 'var(--border)' }} />
      </section>

      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        {/* What I think about */}
        <section className="py-20 sm:py-24">
          <div className="mb-10 max-w-lg">
            <p className="section-tag mb-3">What I write about</p>
            <h2
              className="font-display text-3xl font-normal tracking-tight sm:text-4xl"
              style={{ color: 'var(--fg)' }}
            >
              The business implications of AI
            </h2>
            <p className="mt-3 text-base leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
              Not which model is best — but what changes for leaders, organizations, and strategy
              when intelligence becomes cheap and abundant.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                num: '01',
                title: 'Coordination & Decision-Making',
                desc: 'When everyone can generate analysis on demand, the bottleneck moves from information to alignment. Who decides what, and how fast?',
              },
              {
                num: '02',
                title: 'Platforms & Distribution',
                desc: 'The next platform war will be fought in protocols, not models. Interoperability is becoming the new distribution advantage.',
              },
              {
                num: '03',
                title: 'Trust & Governance',
                desc: 'Governance is not overhead — it\'s the accelerator. The right to automate depends on the ability to automate safely.',
              },
            ].map((pillar, i) => (
              <div
                key={pillar.title}
                className="pillar-card animate-fade-up group"
                style={{ animationDelay: `${i * 0.12}s`, animationFillMode: 'both' }}
              >
                <span
                  className="mb-4 inline-block font-mono text-2xl font-bold"
                  style={{ color: 'var(--accent)', opacity: 0.5 }}
                >
                  {pillar.num}
                </span>
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

        {/* Recent Writing */}
        {recentPosts.length > 0 && (
          <section className="py-20 sm:py-24">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="section-tag mb-3">Latest</p>
                <h2
                  className="font-display text-3xl font-normal tracking-tight"
                  style={{ color: 'var(--fg)' }}
                >
                  Recent essays
                </h2>
              </div>
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

        <div className="h-px" style={{ background: 'var(--border)' }} />

        {/* What I'm Reading */}
        <section className="py-20 sm:py-24">
          <div className="mb-10">
            <p className="section-tag mb-3">Influences</p>
            <h2
              className="font-display text-3xl font-normal tracking-tight"
              style={{ color: 'var(--fg)' }}
            >
              What I&apos;m reading
            </h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--fg-subtle)' }}>
              The essays and books shaping how I think about AI, systems, and strategy.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {readingList.map((item) => (
              <ReadingCard key={item.title} item={item} />
            ))}
          </div>
        </section>

        <div className="h-px" style={{ background: 'var(--border)' }} />

        {/* Subscribe */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-lg text-center">
            <h2
              className="mb-3 font-display text-3xl font-normal tracking-tight"
              style={{ color: 'var(--fg)' }}
            >
              Get the essays
            </h2>
            <p className="mb-8 text-base leading-relaxed" style={{ color: 'var(--fg-subtle)' }}>
              No spam. No hype. Just clear thinking on AI strategy, delivered when it&apos;s ready.
            </p>
            <EmailCapture compact />
          </div>
        </section>

        <div className="h-px" style={{ background: 'var(--border)' }} />

        {/* CTA */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-xl text-center">
            <h2
              className="mb-4 font-display text-3xl font-normal tracking-tight"
              style={{ color: 'var(--fg)' }}
            >
              Let&apos;s talk
            </h2>
            <p
              className="mb-8 text-base leading-relaxed"
              style={{ color: 'var(--fg-muted)' }}
            >
              If you&apos;re a leader thinking about AI strategy, organizational
              coordination, or trust infrastructure — I&apos;d like to hear from you.
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
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
