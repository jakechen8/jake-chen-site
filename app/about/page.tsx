import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About — Jake Chen',
  description: 'Jake Chen — Strategy Lead at Waymo. 15+ years across McKinsey, HubSpot, Microsoft, and Deloitte. MIT Sloan MBA.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8">
      <div className="py-16 sm:py-24">

        {/* Photo + intro */}
        <div className="mb-16 flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:gap-12">
          <div
            className="relative h-40 w-40 shrink-0 overflow-hidden rounded-2xl border-2"
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
            <h1
              className="mb-3 font-display text-4xl font-normal tracking-tight sm:text-5xl"
              style={{ color: 'var(--fg)' }}
            >
              Jake Chen
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
              Strategy Lead at Waymo. I think about what happens when AI leaves the lab &mdash;
              how it changes decisions, organizations, and the systems that run&nbsp;them.
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
            I hold an MBA from{' '}
            <span style={{ color: 'var(--fg)' }} className="font-medium">MIT Sloan</span>{' '}
            and a double major in Finance and Information Systems from the University of Minnesota.
          </p>
        </div>

        <div className="h-px" style={{ background: 'var(--border)' }} />

        {/* Career timeline */}
        <div className="py-16">
          <h2
            className="mb-10 font-display text-2xl font-normal tracking-tight"
            style={{ color: 'var(--fg)' }}
          >
            Career
          </h2>
          <div className="space-y-8">
            {[
              { year: '2019 — Present', title: 'Strategy Lead', company: 'Waymo', desc: 'Executive-level strategy for autonomous mobility. Go-to-market, pricing, and competitive positioning.' },
              { year: '2016 — 2019', title: 'Engagement Manager', company: 'McKinsey & Company', desc: 'TMT, financial services, retail. Growth strategy, pricing, M&A.' },
              { year: '2015 — 2016', title: 'Analytics & Insights', company: 'HubSpot', desc: 'Prospect scoring models and A/B testing for inbound conversion.' },
              { year: '2015', title: 'Program Manager', company: 'Microsoft', desc: 'Office 365 product strategy — onboarding, churn, retention.' },
              { year: '2009 — 2014', title: 'Consultant → Senior Consultant', company: 'Deloitte', desc: 'Five years across TMT and financial services. Customer acquisition and platform strategy.' },
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
                <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px" style={{ background: 'var(--border)' }} />

        {/* Connect */}
        <div className="py-16 text-center">
          <h2
            className="mb-4 font-display text-2xl font-normal tracking-tight"
            style={{ color: 'var(--fg)' }}
          >
            Get in touch
          </h2>
          <p className="mb-6 text-base" style={{ color: 'var(--fg-muted)' }}>
            Always happy to connect with people thinking about AI, strategy, and what comes next.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn-primary">
              Say hello
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
      </div>
    </div>
  )
}
