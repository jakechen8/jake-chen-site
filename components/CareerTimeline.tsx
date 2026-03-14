'use client'

import { useState } from 'react'

interface CareerItem {
  year: string
  title: string
  company: string
  desc: string
  detail: string
}

const items: CareerItem[] = [
  {
    year: '2019 — Present',
    title: 'Strategy Lead',
    company: 'Waymo',
    desc: 'Executive-level strategy for autonomous mobility.',
    detail: 'Go-to-market strategy, pricing architecture, and competitive positioning for the executive team. Front-row seat to what happens when AI enters the real world — the parts that don\'t fit in a demo.',
  },
  {
    year: '2016 — 2019',
    title: 'Engagement Manager',
    company: 'McKinsey & Company',
    desc: 'TMT, financial services, retail.',
    detail: 'Led growth strategy, pricing, and M&A engagements across technology, media, telecom, financial services, and retail. Managed teams of 3-8 on projects ranging from market entry to operational transformation.',
  },
  {
    year: '2015 — 2016',
    title: 'Analytics & Insights',
    company: 'HubSpot',
    desc: 'Prospect scoring and A/B testing.',
    detail: 'Built prospect scoring models and ran A/B testing programs to optimize inbound conversion. Learned how growth teams actually operate — fast iteration, data-driven, allergic to vanity metrics.',
  },
  {
    year: '2015',
    title: 'Program Manager',
    company: 'Microsoft',
    desc: 'Office 365 product strategy.',
    detail: 'Product strategy for Office 365 focusing on onboarding, churn reduction, and retention. First exposure to the messy intersection of enterprise software and user behavior.',
  },
  {
    year: '2009 — 2014',
    title: 'Consultant → Senior Consultant',
    company: 'Deloitte',
    desc: 'Five years across TMT and financial services.',
    detail: 'Customer acquisition, platform strategy, and digital transformation across telecom and banking. Where I learned to structure ambiguous problems and communicate to executives.',
  },
]

export default function CareerTimeline() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)

  return (
    <div>
      {/* Desktop: Horizontal scrollable */}
      <div className="hidden sm:block">
        <div className="relative overflow-x-auto pb-4">
          {/* Connecting line */}
          <div
            className="absolute top-6 left-0 h-0.5"
            style={{ width: `${items.length * 240}px`, background: 'var(--border-strong)' }}
          />

          <div className="flex gap-0" style={{ width: `${items.length * 240}px` }}>
            {items.map((item, idx) => {
              const isExpanded = expandedIdx === idx
              return (
                <button
                  key={idx}
                  onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                  aria-expanded={isExpanded}
                  className="group relative w-60 shrink-0 px-2 text-left"
                >
                  {/* Dot */}
                  <div
                    className="relative z-10 mx-auto mb-4 h-3 w-3 rounded-full border-2 transition-all"
                    style={{
                      borderColor: isExpanded ? 'var(--accent)' : 'var(--border-strong)',
                      background: isExpanded ? 'var(--accent)' : 'var(--bg)',
                    }}
                  />

                  {/* Card */}
                  <div
                    className="rounded-lg border p-3 transition-all"
                    style={{
                      borderColor: isExpanded ? 'var(--accent)' : 'var(--border)',
                      background: isExpanded ? 'var(--accent-light)' : 'transparent',
                    }}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                      {item.year}
                    </p>
                    <p className="mt-1 text-sm font-medium" style={{ color: 'var(--fg)' }}>
                      {item.title}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--fg-subtle)' }}>
                      {item.company}
                    </p>

                    {isExpanded && (
                      <p
                        className="mt-2 text-xs leading-relaxed"
                        style={{ color: 'var(--fg-muted)' }}
                        role="status"
                        aria-live="polite"
                      >
                        {item.detail}
                      </p>
                    )}

                    {!isExpanded && (
                      <p className="mt-1 text-xs" style={{ color: 'var(--fg-muted)' }}>
                        {item.desc}
                      </p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
        <p className="mt-1 text-[10px]" style={{ color: 'var(--fg-subtle)' }}>
          Click a role to expand &middot; Scroll to see all
        </p>
      </div>

      {/* Mobile: Vertical list */}
      <div className="sm:hidden space-y-6">
        {items.map((item, idx) => {
          const isExpanded = expandedIdx === idx
          return (
            <button
              key={idx}
              onClick={() => setExpandedIdx(isExpanded ? null : idx)}
              aria-expanded={isExpanded}
              className="group relative w-full pl-6 text-left"
              style={{ borderLeft: `2px solid ${isExpanded ? 'var(--accent)' : 'var(--border-strong)'}` }}
            >
              <div
                className="absolute -left-[5px] top-1 h-2 w-2 rounded-full"
                style={{ background: isExpanded ? 'var(--accent)' : 'var(--border-strong)' }}
              />
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                {item.year}
              </p>
              <h3 className="mt-1 text-base font-medium" style={{ color: 'var(--fg)' }}>
                {item.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--fg-subtle)' }}>{item.company}</p>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                {isExpanded ? item.detail : item.desc}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
