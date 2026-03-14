'use client'

import { useState } from 'react'

interface Dimension {
  label: string
  analytical: string
  embedded: string
}

const dimensions: Dimension[] = [
  {
    label: 'Core output',
    analytical: 'Market maps, benchmarks, scenario frameworks, financial models',
    embedded: 'Iteration loop ownership, real-time adaptation, decision architecture',
  },
  {
    label: 'Producibility',
    analytical: 'AI-producible, template-driven, increasingly commoditized',
    embedded: 'Human, scarce, not scalable, requires accumulated context',
  },
  {
    label: 'Pricing trajectory',
    analytical: 'Falling — compressed by AI tooling and automation',
    embedded: 'Rising — premium concentrates as analytical work gets cheaper',
  },
  {
    label: 'Success metric',
    analytical: 'Was the analysis rigorous? Was the recommendation sound?',
    embedded: 'Did the strategy work? Did the organization actually change?',
  },
  {
    label: 'Client relationship',
    analytical: 'Project-based, fixed-term, clean handoffs',
    embedded: 'Continuous, fewer clients, deep context, no clean exit',
  },
  {
    label: 'Failure mode',
    analytical: 'Excellent deck, nothing happens — but nobody traces it back',
    embedded: 'Visible accountability — you\'re there when it breaks or succeeds',
  },
]

export default function StrategyBifurcation() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const [hoveredSide, setHoveredSide] = useState<'analytical' | 'embedded' | null>(null)

  return (
    <section
      role="region"
      aria-label="Strategy bifurcation — compare analytical products vs embedded strategic capacity"
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
          The Bifurcation
        </h3>
        <p className="mt-1 text-sm" style={{ color: 'var(--fg-subtle)' }}>
          Strategy is splitting into two professions. Click a dimension to compare them.
        </p>
      </div>

      {/* Column headers */}
      <div className="mb-4 grid grid-cols-[1fr_1fr] gap-3 sm:grid-cols-[140px_1fr_1fr]">
        <div className="hidden sm:block" />
        <div
          className="rounded-md px-3 py-2 text-center text-xs font-semibold uppercase tracking-widest"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--fg-muted)' }}
          onMouseEnter={() => setHoveredSide('analytical')}
          onMouseLeave={() => setHoveredSide(null)}
        >
          Analytical Products
        </div>
        <div
          className="rounded-md px-3 py-2 text-center text-xs font-semibold uppercase tracking-widest"
          style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)', color: 'var(--accent)' }}
          onMouseEnter={() => setHoveredSide('embedded')}
          onMouseLeave={() => setHoveredSide(null)}
        >
          Embedded Capacity
        </div>
      </div>

      {/* Dimension rows */}
      <div className="space-y-2" aria-live="polite">
        {dimensions.map((d, i) => {
          const isActive = activeIdx === i
          return (
            <button
              key={d.label}
              onClick={() => setActiveIdx(isActive ? null : i)}
              aria-pressed={isActive}
              className="grid w-full gap-3 rounded-md border px-3 py-3 text-left transition-all sm:grid-cols-[140px_1fr_1fr]"
              style={{
                borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                background: isActive ? 'var(--bg)' : 'transparent',
              }}
            >
              {/* Label */}
              <div className="flex items-start gap-2">
                <span
                  className="mt-0.5 inline-block shrink-0 text-xs transition-transform"
                  style={{
                    color: 'var(--accent)',
                    transform: isActive ? 'rotate(90deg)' : 'rotate(0deg)',
                  }}
                  aria-hidden="true"
                >
                  ▶
                </span>
                <span
                  className="text-sm font-medium"
                  style={{ color: isActive ? 'var(--accent)' : 'var(--fg)' }}
                >
                  {d.label}
                </span>
              </div>

              {/* Content — only visible when active */}
              {isActive && (
                <>
                  <div
                    className="rounded-md border px-3 py-2.5"
                    style={{
                      borderColor: hoveredSide === 'analytical' ? 'var(--fg-subtle)' : 'var(--border)',
                      background: 'var(--bg)',
                    }}
                  >
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                      {d.analytical}
                    </p>
                  </div>
                  <div
                    className="rounded-md border px-3 py-2.5"
                    style={{
                      borderColor: 'var(--accent)',
                      background: 'var(--accent-light)',
                    }}
                  >
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--fg)' }}>
                      {d.embedded}
                    </p>
                  </div>
                </>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}
