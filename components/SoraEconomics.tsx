'use client'

import { useState } from 'react'

interface Metric {
  id: string
  label: string
  value: string
  context: string
  severity: 'critical' | 'warning' | 'neutral'
}

const metrics: Metric[] = [
  {
    id: 'daily-cost',
    label: 'Daily inference cost',
    value: '~$15M',
    context:
      'Forbes estimated Sora\'s peak inference costs at roughly $15 million per day based on analysis by Cantor Fitzgerald, assuming about $1.30 per 10-second video clip. Annualized, that approaches $5.4 billion.',
    severity: 'critical',
  },
  {
    id: 'lifetime-revenue',
    label: 'Total lifetime revenue',
    value: '$2.1M',
    context:
      'Appfigures estimates Sora made about $2.1 million from in-app purchases across its entire lifetime. That is roughly what the inference costs were every 3.4 hours.',
    severity: 'critical',
  },
  {
    id: 'peak-downloads',
    label: 'Peak monthly downloads',
    value: '3.3M',
    context:
      'Sora peaked in November 2025 at approximately 3.3 million downloads. It hit one million within five days of its September launch — clear product-market curiosity, but not product-market fit.',
    severity: 'neutral',
  },
  {
    id: 'download-decline',
    label: 'Download decline by February',
    value: '-66%',
    context:
      'By February 2026, monthly downloads had fallen to 1.13 million — a 66% drop from the November peak. The wow wore off. The use case did not stick.',
    severity: 'warning',
  },
  {
    id: 'disney-deal',
    label: 'Disney deal',
    value: 'Collapsed',
    context:
      'Disney had agreed to license hundreds of name-brand characters for Sora-powered virtual avatars. The deal reportedly did not proceed once OpenAI announced the shutdown.',
    severity: 'critical',
  },
  {
    id: 'time-to-shutdown',
    label: 'Time from app launch to shutdown',
    value: '~6 months',
    context:
      'Sora launched as a mobile app in late September 2025. OpenAI announced the shutdown on March 24, 2026. Six months from launch to sunset.',
    severity: 'warning',
  },
]

const severityStyles = {
  critical: { badge: 'var(--accent)', badgeText: '#fff' },
  warning: { badge: 'var(--accent-light)', badgeText: 'var(--accent)' },
  neutral: { badge: 'var(--border-strong)', badgeText: 'var(--fg-muted)' },
}

export default function SoraEconomics() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = metrics.find((m) => m.id === activeId) || null

  return (
    <section
      role="region"
      aria-label="Sora economics breakdown — explore the numbers behind the shutdown"
      className="my-10 rounded-lg border p-5 sm:p-8"
      style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-warm)' }}
    >
      <div className="mb-6">
        <p
          className="mb-1 text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--accent)' }}
        >
          Interactive
        </p>
        <h3
          className="font-display text-lg font-normal tracking-tight"
          style={{ color: 'var(--fg)' }}
        >
          The Sora Economics
        </h3>
        <p className="mt-1 text-sm" style={{ color: 'var(--fg-subtle)' }}>
          Click any metric to see the full picture behind the shutdown.
        </p>
      </div>

      {/* Metrics grid */}
      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {metrics.map((m) => {
          const isActive = activeId === m.id
          return (
            <button
              key={m.id}
              onClick={() => setActiveId(isActive ? null : m.id)}
              aria-pressed={isActive}
              className="rounded-md border px-3 py-3 text-left transition-all"
              style={{
                borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                background: isActive ? 'var(--accent-light)' : 'var(--bg)',
              }}
            >
              <span
                className="block font-display text-xl font-normal sm:text-2xl"
                style={{ color: isActive ? 'var(--accent)' : 'var(--fg)' }}
              >
                {m.value}
              </span>
              <span
                className="mt-0.5 block text-xs"
                style={{ color: 'var(--fg-subtle)' }}
              >
                {m.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Detail panel */}
      {active && (
        <div
          className="rounded-md border-2 px-4 py-3"
          style={{ borderColor: 'var(--accent)', background: 'var(--accent-light)' }}
          role="status"
          aria-live="polite"
        >
          <div className="mb-2 flex items-center gap-2">
            <span
              className="rounded px-1.5 py-0.5 text-xs font-semibold uppercase"
              style={{
                background: severityStyles[active.severity].badge,
                color: severityStyles[active.severity].badgeText,
              }}
            >
              {active.severity === 'critical'
                ? 'Critical'
                : active.severity === 'warning'
                  ? 'Warning sign'
                  : 'Context'}
            </span>
            <span className="font-mono text-xs" style={{ color: 'var(--fg-subtle)' }}>
              {active.label}
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--fg)' }}>
            {active.context}
          </p>
        </div>
      )}

      {!active && (
        <div
          className="rounded-md border py-5 text-center"
          style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
        >
          <p className="text-sm" style={{ color: 'var(--fg-subtle)' }}>
            Click a metric above to see the story behind it.
          </p>
        </div>
      )}
    </section>
  )
}
