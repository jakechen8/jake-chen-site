import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Jake Chen.',
}

const goodReasons = [
  "You're thinking about trust, safety, or governance in autonomous systems and want to exchange ideas",
  "You disagree with something I wrote — and have a thoughtful counterpoint",
  "You're working on the infrastructure layer of AI deployment and want a sounding board",
  "You have a question about how autonomous systems scale from prototype to the real world",
]

const noReply = [
  "Unsolicited pitches — if I'm interested, I'll reach out",
  "AI-generated outreach (I can tell)",
  "Requests for introductions to people I haven't worked with",
]

const links = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/jiakechen', desc: 'Professional updates' },
  { label: 'RSS Feed', href: '/feed.xml', desc: 'For reader apps' },
]

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8">
      <div className="py-16 sm:py-24">
        <div className="mb-16 max-w-xl">
          <p
            className="mb-3 text-xs font-medium uppercase tracking-widest"
            style={{ color: 'var(--accent)' }}
          >
            Contact
          </p>
          <h1
            className="mb-4 font-display text-4xl font-normal tracking-tight sm:text-5xl"
            style={{ color: 'var(--fg)' }}
          >
            Let&apos;s start a conversation
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
            The most interesting problems in autonomy and AI sit at the seams —
            between systems, between organizations, between what works in the lab
            and what survives deployment. If you&apos;re working on those problems,
            I&apos;d like to hear from you.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
          <div className="space-y-10">
            {/* Email */}
            <div
              className="rounded-lg border p-6"
              style={{ borderColor: 'var(--border)' }}
            >
              <h2
                className="mb-2 font-display text-xl font-normal tracking-tight"
                style={{ color: 'var(--fg)' }}
              >
                Email directly
              </h2>
              <p className="mb-5 text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                I read everything. I reply selectively, but thoughtfully.
              </p>
              <a href="mailto:hello@jake-chen.com" className="btn-primary inline-flex">
                hello@jake-chen.com
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="2" y1="7" x2="12" y2="7" />
                  <polyline points="8 3 12 7 8 11" />
                </svg>
              </a>
            </div>

            {/* Good reasons */}
            <div>
              <h2
                className="mb-4 font-display text-xl font-normal tracking-tight"
                style={{ color: 'var(--fg)' }}
              >
                Good reasons to reach out
              </h2>
              <ul className="space-y-2.5">
                {goodReasons.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm leading-relaxed"
                    style={{ color: 'var(--fg-muted)' }}
                  >
                    <span
                      className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                      style={{ backgroundColor: 'var(--accent)' }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* What I skip */}
            <div>
              <h2
                className="mb-4 font-display text-xl font-normal tracking-tight"
                style={{ color: 'var(--fg)' }}
              >
                What I don&apos;t respond to
              </h2>
              <ul className="space-y-2.5">
                {noReply.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm leading-relaxed"
                    style={{ color: 'var(--fg-muted)' }}
                  >
                    <span
                      className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                      style={{ backgroundColor: 'var(--border-strong)' }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <div className="rounded-lg border p-5" style={{ borderColor: 'var(--border)' }}>
              <h3
                className="mb-4 text-xs font-medium uppercase tracking-widest"
                style={{ color: 'var(--fg-subtle)' }}
              >
                Elsewhere
              </h3>
              <div className="space-y-3">
                {links.map(({ label, href, desc }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="group flex items-start gap-3 rounded-md p-2 -mx-2 transition-colors hover:bg-[color:var(--accent-light)]"
                  >
                    <div>
                      <div
                        className="text-sm font-medium transition-colors group-hover:text-[color:var(--accent)]"
                        style={{ color: 'var(--fg)' }}
                      >
                        {label}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--fg-subtle)' }}>
                        {desc}
                      </div>
                    </div>
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
