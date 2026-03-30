'use client'

import { useState } from 'react'

interface Lane {
  id: string
  label: string
  subtitle: string
  traits: { label: string; value: string }[]
  examples: string[]
  color: 'accent' | 'muted'
}

const lanes: Lane[] = [
  {
    id: 'frontier',
    label: 'Frontier Intelligence',
    subtitle: 'Flexibility matters most. Costs stay high.',
    traits: [
      { label: 'Hardware', value: 'General-purpose accelerators' },
      { label: 'Model cycle', value: 'Fast — new versions every few months' },
      { label: 'Optimization for', value: 'Capability, research, benchmarks' },
      { label: 'Moat', value: 'Training compute, data, talent' },
    ],
    examples: [
      'Frontier labs',
      'Research teams',
      'High-stakes reasoning',
      'Novel problem spaces',
    ],
    color: 'muted',
  },
  {
    id: 'utility',
    label: 'Utility Intelligence',
    subtitle: 'Stable enough to compress, cache, compile, harden, or embody in silicon.',
    traits: [
      { label: 'Hardware', value: 'Specialized / model-specific silicon' },
      { label: 'Model cycle', value: 'Slow — stability is a feature' },
      { label: 'Optimization for', value: 'Cost, latency, power, reliability' },
      { label: 'Moat', value: 'Deployment economics, operational simplicity' },
    ],
    examples: [
      'Voice assistants',
      'Enterprise copilots',
      'Edge inference',
      'High-volume serving',
    ],
    color: 'accent',
  },
]

export default function MarketSplit() {
  const [activeId, setActiveId] = useState<string>(lanes[1].id)
  const active = lanes.find((l) => l.id === activeId)!

  return (
    <section
      role="region"
      aria-label="Market split explorer — compare frontier intelligence versus utility intelligence"
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
          The Market Split
        </h3>
        <p className="mt-1 text-sm" style={{ color: 'var(--fg-subtle)' }}>
          AI inference may bifurcate into two lanes with different economics, different moats, and
          different leaders. Compare them.
        </p>
      </div>

      {/* Lane selector */}
      <div className="mb-6 grid grid-cols-2 gap-2">
        {lanes.map((lane) => (
          <button
            key={lane.id}
            onClick={() => setActiveId(lane.id)}
            aria-pressed={activeId === lane.id}
            className="rounded-md border px-4 py-3 text-left transition-all"
            style={{
              borderColor: activeId === lane.id ? 'var(--accent)' : 'var(--border-strong)',
              background: activeId === lane.id ? 'var(--accent-light)' : 'transparent',
            }}
          >
            <span
              className="block text-sm font-medium"
              style={{ color: activeId === lane.id ? 'var(--accent)' : 'var(--fg)' }}
            >
              {lane.label}
            </span>
            <span
              className="mt-0.5 block text-xs"
              style={{ color: 'var(--fg-subtle)' }}
            >
              {lane.subtitle}
            </span>
          </button>
        ))}
      </div>

      {/* Detail view */}
      <div className="space-y-3" aria-live="polite">
        {/* Traits */}
        <div
          className="space-y-2 rounded-md border p-4"
          style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
        >
          {active.traits.map((trait) => (
            <div key={trait.label} className="flex items-start gap-3">
              <span
                className="mt-0.5 shrink-0 text-xs font-semibold uppercase tracking-wide"
                style={{ color: 'var(--fg-subtle)', minWidth: '7rem' }}
              >
                {trait.label}
              </span>
              <span className="text-sm" style={{ color: 'var(--fg)' }}>
                {trait.value}
              </span>
            </div>
          ))}
        </div>

        {/* Who lives here */}
        <div
          className="rounded-md border-2 px-4 py-3"
          style={{ borderColor: 'var(--accent)', background: 'var(--accent-light)' }}
        >
          <p
            className="mb-2 text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: 'var(--accent)' }}
          >
            Who lives here
          </p>
          <div className="flex flex-wrap gap-2">
            {active.examples.map((ex) => (
              <span
                key={ex}
                className="rounded-full border px-3 py-1 text-sm"
                style={{ borderColor: 'var(--accent)', color: 'var(--fg)' }}
              >
                {ex}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
