import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description: 'Jake Chen — 15+ years in strategy. Exploring how intelligence leaves the lab and enters the physical world.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8">
      <div className="py-16 sm:py-24">
        {/* Header */}
        <div className="mb-16">
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
          {/* Main Content */}
          <div className="space-y-6">
            {/* Headshot */}
            <div
              className="h-28 w-28 overflow-hidden rounded-full border-2"
              style={{ borderColor: 'var(--border)' }}
            >
              <img src="/images/headshot.png" alt="Jake Chen" className="h-full w-full object-cover" />
            </div>

            <div className="h-0.5 w-12" style={{ backgroundColor: 'var(--accent)' }} />

            {/* Bio */}
            <div
              className="space-y-5 text-base leading-relaxed"
              style={{ color: 'var(--fg-muted)' }}
            >
              <p>
                I think about how intelligence leaves the lab and enters the physical
                world — and the invisible infrastructure required to make it trustworthy.
              </p>
              <p>
                For the past six years, I&apos;ve worked at{' '}
                <span style={{ color: 'var(--fg)' }}>Waymo</span> as a Strategy Lead,
                advising the executive team on questions that sit at the intersection of
                autonomy, market readiness, and trust. Before that, I was an Engagement
                Manager at{' '}
                <span style={{ color: 'var(--fg)' }}>McKinsey &amp; Company</span>,
                where I worked across technology, financial services, and retail on
                go-to-market, pricing, and growth strategy.
              </p>
              <p>
                My earlier career spans analytics at HubSpot, product strategy at
                Microsoft, and five years of management consulting at Deloitte —
                building customer scoring models, launching digital video platforms,
                and designing data infrastructure. Across 15+ years, the through-line
                has been the same: understanding how complex systems create and
                capture value.
              </p>
              <p>
                I hold an MBA from{' '}
                <span style={{ color: 'var(--fg)' }}>MIT Sloan</span> and a double
                major in Finance and Information Systems from the University of
                Minnesota. I write not to build an audience, but to think more
                clearly about problems that resist easy answers.
              </p>
            </div>

            {/* What I think about */}
            <div className="pt-6">
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
                  'How autonomous systems earn trust under real-world conditions',
                  'The verification gap between what a system does and what we can confirm about why',
                  'Why deployment looks nothing like the benchmark',
                  'Governance and incentive design for AI in physical systems',
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

            {/* Career */}
            <div className="pt-10">
              <h2
                className="mb-8 font-display text-xl font-normal tracking-tight"
                style={{ color: 'var(--fg)' }}
              >
                Career
              </h2>
              <div className="space-y-8">
                {[
                  { year: '2019 — Present', title: 'Strategy Lead', company: 'Waymo', desc: 'Advise the executive team on go-to-market, pricing, and competitive strategy for autonomous mobility.' },
                  { year: '2016 — 2019', title: 'Engagement Manager', company: 'McKinsey & Company', desc: 'TMT, Financial Services, and Retail. Growth strategy, pricing, M&A, and multi-year roadmaps.' },
                  { year: '2015 — 2016', title: 'Analytics & Insights', company: 'HubSpot', desc: 'Prospect scoring models and A/B testing for inbound conversion.' },
                  { year: '2015', title: 'Program Manager', company: 'Microsoft', desc: 'Office 365 product strategy — onboarding, churn, and retention analysis.' },
                  { year: '2009 — 2014', title: 'Consultant → Senior Consultant', company: 'Deloitte', desc: 'Customer acquisition, video delivery platforms, data warehousing. Five years across TMT and financial services.' },
                ].map((item, idx) => (
                  <div key={idx} className="value-item">
                    <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
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
                className="mb-6 font-display text-xl font-normal tracking-tight"
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

            {/* Service */}
            <div className="pt-10">
              <h2
                className="mb-6 font-display text-xl font-normal tracking-tight"
                style={{ color: 'var(--fg)' }}
              >
                Service
              </h2>
              <div className="space-y-5">
                {[
                  { role: 'Strategy Committee', org: 'The SF Market', period: '2020 — Present' },
                  { role: 'Board of Advisors', org: 'Multiplying Good', period: '2010 — 2014' },
                  { role: 'Treasurer', org: 'St. Paul Public Schools Foundation', period: '2012 — 2014' },
                ].map((item, idx) => (
                  <div key={idx}>
                    <h3 className="font-display text-base font-normal" style={{ color: 'var(--fg)' }}>{item.role}</h3>
                    <p className="text-sm" style={{ color: 'var(--fg-subtle)' }}>{item.org} · {item.period}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="rounded-lg border p-5" style={{ borderColor: 'var(--border)' }}>
              <h3 className="mb-4 text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--fg-subtle)' }}>
                At a glance
              </h3>
              <dl className="space-y-3">
                {[
                  { label: 'Current', value: 'Waymo' },
                  { label: 'Focus', value: 'Autonomy & Trust' },
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
              <h3 className="mb-4 text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--fg-subtle)' }}>
                Elsewhere
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
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
