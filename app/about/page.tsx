import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Jake Chen — building autonomous systems at Waymo. Writing about trust, autonomy, and AI.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8">
      <div className="py-16 sm:py-20">
        {/* Header */}
        <div className="mb-12">
          <p
            className="mb-3 text-xs font-medium uppercase tracking-widest"
            style={{ color: 'var(--accent)' }}
          >
            About
          </p>
          <h1
            className="font-display text-4xl font-normal tracking-tight sm:text-5xl"
            style={{ color: 'var(--fg)' }}
          >
            Jake Chen
          </h1>
        </div>

        <div className="grid gap-16 lg:grid-cols-[1fr_280px]">
          {/* Bio */}
          <div className="space-y-6">
            {/* Headshot */}
            <div
              className="h-28 w-28 overflow-hidden rounded-full border-2"
              style={{ borderColor: 'var(--border)' }}
            >
              <img src="/images/headshot.png" alt="Jake Chen" className="h-full w-full object-cover" />
            </div>

            <div
              className="h-0.5 w-12"
              style={{ backgroundColor: 'var(--accent)' }}
            />
            <div
              className="space-y-5 text-base leading-relaxed"
              style={{ color: 'var(--fg-muted)' }}
            >
              <p>
                I work at{' '}
                <span style={{ color: 'var(--fg)' }}>Waymo</span>, where I
                focus on how autonomous systems understand, simulate, and
                navigate the real world.
              </p>
              <p>
                My work sits at the intersection of AI, autonomy, and
                deployment &mdash; the messy part where models meet physics and
                public roads. I think a lot about what it means for a system to
                earn trust when it can&apos;t explain its own decisions, and
                about the gap between benchmark performance and what actually
                matters when a system is live.
              </p>
              <p>
                I also write &mdash; not to build an audience, but to think
                more clearly about problems that don&apos;t fit into a slide
                deck.
              </p>
              <p>
                I&apos;m always open to thoughtful conversations, especially
                with people working on hard problems in AI, autonomy, or trust
                infrastructure.
              </p>
            </div>

            <div className="pt-4">
              <h2
                className="mb-4 font-display text-xl font-normal tracking-tight"
                style={{ color: 'var(--fg)' }}
              >
                What I think about
              </h2>
              <ul
                className="space-y-2 text-sm"
                style={{ color: 'var(--fg-muted)' }}
              >
                {[
                  'How autonomous systems make high-stakes decisions under uncertainty',
                  'The verification gap between what a system does and what we can confirm about how it does it',
                  'Why deployment conditions look nothing like benchmarks',
                  'Trust as a design problem, not a PR problem',
                  'The infrastructure nobody wants to build but everyone depends on',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span
                      className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                      style={{ backgroundColor: 'var(--accent)' }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Quick facts */}
            <div
              className="rounded-lg border p-5"
              style={{ borderColor: 'var(--border)' }}
            >
              <h3
                className="mb-4 text-xs font-medium uppercase tracking-widest"
                style={{ color: 'var(--fg-subtle)' }}
              >
                At a glance
              </h3>
              <dl className="space-y-3">
                {[
                  { label: 'Day job', value: 'Waymo' },
                  { label: 'Focus', value: 'Autonomous systems & AI' },
                  { label: 'Mode', value: 'Building & writing' },
                  { label: 'Writing', value: 'Long-form, when ready' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <dt
                      className="mb-0.5 text-xs"
                      style={{ color: 'var(--fg-subtle)' }}
                    >
                      {label}
                    </dt>
                    <dd
                      className="text-sm font-medium"
                      style={{ color: 'var(--fg)' }}
                    >
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Links */}
            <div
              className="rounded-lg border p-5"
              style={{ borderColor: 'var(--border)' }}
            >
              <h3
                className="mb-4 text-xs font-medium uppercase tracking-widest"
                style={{ color: 'var(--fg-subtle)' }}
              >
                Links
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'LinkedIn', href: 'https://linkedin.com/in/jiakechen' },
                  { label: 'RSS Feed', href: '/feed.xml' },
                ].map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center justify-between text-sm transition-colors hover:text-[color:var(--accent)]"
                    style={{ color: 'var(--fg-muted)' }}
                  >
                    {label}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 3H3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V7" />
                      <polyline points="8 1 11 1 11 4" />
                      <line x1="5" y1="7" x2="11" y2="1" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
