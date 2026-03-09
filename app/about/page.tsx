import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description: 'Jake Chen — 15+ years in strategy across Waymo, McKinsey, HubSpot, and Microsoft. Writing about how AI reshapes organizations.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8">
      <div className="py-16 sm:py-24">
        {/* Hero header with photo */}
        <div className="mb-16 grid items-start gap-10 lg:grid-cols-[1fr_250px]">
          <div>
            <p
              className="mb-3 text-xs font-medium uppercase tracking-widest"
              style={{ color: 'var(--accent)' }}
            >
              About
            </p>
            <h1
              className="mb-6 font-display text-4xl font-normal tracking-tight sm:text-5xl"
              style={{ color: 'var(--fg)' }}
            >
              Jake Chen
            </h1>
            <p
              className="text-lg leading-relaxed"
              style={{ color: 'var(--fg-muted)' }}
            >
              I think about the business side of AI — not which model is best, but what
              changes for leaders, organizations, and strategy when intelligence becomes
              cheap and abundant.
            </p>
          </div>

          <div className="hidden lg:block">
            <div
              className="relative h-64 w-full overflow-hidden rounded-xl border-2"
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

        <div className="grid gap-16 lg:grid-cols-[1fr_280px]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Mobile photo */}
            <div className="lg:hidden">
              <div
                className="relative h-48 w-48 overflow-hidden rounded-xl border-2"
                style={{ borderColor: 'var(--border-strong)' }}
              >
                <Image
                  src="/images/headshot.png"
                  alt="Jake Chen"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="h-0.5 w-12" style={{ backgroundColor: 'var(--accent)' }} />

            {/* Bio */}
            <div
              className="space-y-5 text-base leading-relaxed"
              style={{ color: 'var(--fg-muted)' }}
            >
              <p>
                For the past six years, I&apos;ve been a Strategy Lead at{' '}
                <span style={{ color: 'var(--fg)' }} className="font-medium">Waymo</span>,
                advising the executive team on go-to-market, pricing, and competitive strategy
                for autonomous mobility. It&apos;s given me a front-row seat to what happens
                when AI leaves the lab and enters the real world.
              </p>
              <p>
                Before Waymo, I was an Engagement Manager at{' '}
                <span style={{ color: 'var(--fg)' }} className="font-medium">McKinsey &amp; Company</span>,
                working across technology, financial services, and retail on growth strategy,
                pricing, and M&amp;A. My earlier career includes analytics at{' '}
                <span style={{ color: 'var(--fg)' }} className="font-medium">HubSpot</span>,
                product strategy at{' '}
                <span style={{ color: 'var(--fg)' }} className="font-medium">Microsoft</span>,
                and five years of management consulting at{' '}
                <span style={{ color: 'var(--fg)' }} className="font-medium">Deloitte</span>.
              </p>
              <p>
                The through-line across 15+ years: understanding how complex systems create
                and capture value — and what breaks when they scale.
              </p>
              <p>
                I hold an MBA from{' '}
                <span style={{ color: 'var(--fg)' }} className="font-medium">MIT Sloan</span> and
                a double major in Finance and Information Systems from the University of Minnesota.
              </p>
            </div>

            {/* Career timeline */}
            <div className="pt-10">
              <h2
                className="mb-8 font-display text-2xl font-normal tracking-tight"
                style={{ color: 'var(--fg)' }}
              >
                Career
              </h2>
              <div className="space-y-8">
                {[
                  { year: '2019 — Present', title: 'Strategy Lead', company: 'Waymo', desc: 'Executive-level strategy for autonomous mobility. Go-to-market, pricing, and competitive positioning.' },
                  { year: '2016 — 2019', title: 'Engagement Manager', company: 'McKinsey & Company', desc: 'TMT, Financial Services, Retail. Growth strategy, pricing, M&A, and multi-year roadmaps.' },
                  { year: '2015 — 2016', title: 'Analytics & Insights', company: 'HubSpot', desc: 'Prospect scoring models and A/B testing for inbound conversion optimization.' },
                  { year: '2015', title: 'Program Manager', company: 'Microsoft', desc: 'Office 365 product strategy — onboarding, churn analysis, and retention.' },
                  { year: '2009 — 2014', title: 'Consultant → Senior Consultant', company: 'Deloitte', desc: 'Five years across TMT and financial services. Customer acquisition, data infrastructure, and platform strategy.' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="group relative pl-6"
                    style={{ borderLeft: '2px solid var(--border-strong)' }}
                  >
                    <div
                      className="absolute -left-[5px] top-1 h-2 w-2 rounded-full"
                      style={{ background: 'var(--accent)' }}
                    />
                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                      {item.year}
                    </p>
                    <h3 className="mt-1 font-display text-base font-normal" style={{ color: 'var(--fg)' }}>
                      {item.title}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--fg-subtle)' }}>{item.company}</p>
                    <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="pt-10">
              <h2
                className="mb-6 font-display text-2xl font-normal tracking-tight"
                style={{ color: 'var(--fg)' }}
              >
                Education
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-base font-normal" style={{ color: 'var(--fg)' }}>MBA</h3>
                  <p className="text-sm" style={{ color: 'var(--fg-subtle)' }}>MIT Sloan School of Management</p>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                    Entrepreneurship &amp; Innovation. 4.9/5.0. TA for Negotiations, China Lab, and Game Theory.
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-base font-normal" style={{ color: 'var(--fg)' }}>Bachelor of Science in Business</h3>
                  <p className="text-sm" style={{ color: 'var(--fg-subtle)' }}>University of Minnesota — Carlson School of Management</p>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                    Double major: Finance &amp; Information Systems. 3.8/4.0. Completed in two years.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="rounded-lg border p-5" style={{ borderColor: 'var(--border)' }}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--fg-subtle)' }}>
                At a glance
              </h3>
              <dl className="space-y-3">
                {[
                  { label: 'Current', value: 'Waymo' },
                  { label: 'Focus', value: 'AI Strategy & Trust' },
                  { label: 'Education', value: 'MIT Sloan MBA' },
                  { label: 'Previously', value: 'McKinsey & Company' },
                  { label: 'Experience', value: '15+ years' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <dt className="mb-0.5 text-xs" style={{ color: 'var(--fg-subtle)' }}>{label}</dt>
                    <dd className="text-sm font-medium" style={{ color: 'var(--fg)' }}>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-lg border p-5" style={{ borderColor: 'var(--border)' }}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--fg-subtle)' }}>
                Connect
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'LinkedIn', href: 'https://linkedin.com/in/jiakechen' },
                  { label: 'Email', href: '/contact' },
                  { label: 'RSS Feed', href: '/feed.xml' },
                ].map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center justify-between text-sm transition-colors hover:text-[color:var(--accent)]"
                    style={{ color: 'var(--fg-muted)' }}
                  >
                    {label}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="2" y1="6" x2="10" y2="6" />
                      <polyline points="6.5 2.5 10 6 6.5 9.5" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
