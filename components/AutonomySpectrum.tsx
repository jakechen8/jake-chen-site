'use client'

import { useState } from 'react'

interface Zone {
  id: string
  label: string
  shortLabel: string
  examples: string[]
  tradeoffs: { speed: number; accountability: number; cost: number; trust: number }
  description: string
}

const zones: Zone[] = [
  {
    id: 'human',
    label: 'Fully Human',
    shortLabel: 'Human',
    examples: ['Judicial sentencing', 'Executive hiring', 'Military engagement rules'],
    tradeoffs: { speed: 1, accountability: 5, cost: 5, trust: 5 },
    description: 'Human makes every decision. AI provides zero input. Maximum accountability, maximum cost, slowest throughput. Works when stakes are existential and every case is unique.',
  },
  {
    id: 'ai-advises',
    label: 'AI Advises, Human Decides',
    shortLabel: 'AI Advises',
    examples: ['Medical diagnosis (radiology AI)', 'Credit underwriting', 'Legal research'],
    tradeoffs: { speed: 2, accountability: 4, cost: 4, trust: 4 },
    description: 'AI surfaces recommendations. Human has final authority and can override. This is where most enterprise AI lives today. Sounds safe — but "advisory" can quietly become "rubber-stamping" when humans approve 98% of AI suggestions without review.',
  },
  {
    id: 'human-exception',
    label: 'AI Decides, Human Reviews Exceptions',
    shortLabel: 'AI + Exceptions',
    examples: ['Content moderation', 'Insurance claims processing', 'Loan pre-approval'],
    tradeoffs: { speed: 4, accountability: 3, cost: 3, trust: 3 },
    description: 'AI handles the default path. Humans only see flagged cases. This is where efficiency gains actually materialize — but the edge cases humans review are the hardest, most fatiguing decisions. Burnout is real.',
  },
  {
    id: 'ai-auto',
    label: 'AI Decides, Human Monitors',
    shortLabel: 'AI + Monitor',
    examples: ['Algorithmic trading', 'Dynamic pricing', 'Spam filtering'],
    tradeoffs: { speed: 5, accountability: 2, cost: 2, trust: 2 },
    description: 'AI runs autonomously. Humans watch dashboards and intervene when things go wrong. The catch: by the time a human notices something on a dashboard, the damage is already done. Monitoring is not the same as control.',
  },
  {
    id: 'full-auto',
    label: 'Fully Autonomous',
    shortLabel: 'Autonomous',
    examples: ['Self-driving vehicles', 'Automated cyber defense', 'High-frequency trading'],
    tradeoffs: { speed: 5, accountability: 1, cost: 1, trust: 1 },
    description: 'No human in the loop at decision time. The system acts on its own. Accountability becomes institutional, not individual. Trust isn\'t earned by explaining — it\'s earned by track record over millions of decisions.',
  },
]

const tradeoffLabels: Record<string, string> = {
  speed: 'Speed',
  accountability: 'Accountability',
  cost: 'Cost',
  trust: 'Trust Required',
}

export default function AutonomySpectrum() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = zones.find((z) => z.id === activeId) || null

  return (
    <section
      role="region"
      aria-label="Autonomy spectrum — click each zone to explore trade-offs"
      className="my-10 rounded-lg border p-5 sm:p-8"
      style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-warm)' }}
    >
      <div className="mb-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
          Interactive
        </p>
        <h3 className="font-display text-lg font-normal tracking-tight" style={{ color: 'var(--fg)' }}>
          The Autonomy Spectrum
        </h3>
        <p className="mt-1 text-sm" style={{ color: 'var(--fg-subtle)' }}>
          Click a zone to see real examples and trade-offs.
        </p>
      </div>

      {/* Spectrum bar */}
      <div className="mb-6" role="group" aria-label="Autonomy zones">
        {/* Labels */}
        <div className="mb-2 flex justify-between text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--fg-subtle)' }}>
          <span>Fully Human</span>
          <span>Fully Autonomous</span>
        </div>

        {/* Clickable zones */}
        <div className="flex gap-1">
          {zones.map((z, i) => (
            <button
              key={z.id}
              onClick={() => setActiveId(activeId === z.id ? null : z.id)}
              aria-pressed={activeId === z.id}
              aria-label={z.label}
              className="relative flex-1 rounded-md py-3 text-center text-[11px] font-medium transition-all sm:text-xs"
              style={{
                background: activeId === z.id
                  ? 'var(--accent)'
                  : `rgba(180, 83, 9, ${0.05 + i * 0.06})`,
                color: activeId === z.id ? '#fff' : 'var(--fg-muted)',
                border: activeId === z.id ? '1px solid var(--accent)' : '1px solid var(--border)',
              }}
            >
              <span className="hidden sm:inline">{z.shortLabel}</span>
              <span className="sm:hidden">{i + 1}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      {active && (
        <div role="status" aria-live="polite">
          <div
            className="rounded-md border p-4 sm:p-5"
            style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
          >
            <h4 className="mb-2 text-sm font-semibold" style={{ color: 'var(--fg)' }}>
              {active.label}
            </h4>
            <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
              {active.description}
            </p>

            {/* Examples */}
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--fg-subtle)' }}>
              Real Examples
            </p>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {active.examples.map((ex) => (
                <span
                  key={ex}
                  className="rounded-full px-2.5 py-0.5 text-xs"
                  style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                >
                  {ex}
                </span>
              ))}
            </div>

            {/* Trade-off bars */}
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--fg-subtle)' }}>
              Trade-offs
            </p>
            <div className="space-y-2">
              {Object.entries(active.tradeoffs).map(([key, val]) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-24 text-xs" style={{ color: 'var(--fg-muted)' }}>
                    {tradeoffLabels[key]}
                  </span>
                  <div className="flex-1 rounded-full" style={{ background: 'var(--border)', height: '6px' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${val * 20}%`, background: 'var(--accent)' }}
                    />
                  </div>
                  <span className="w-6 text-right font-mono text-xs" style={{ color: 'var(--fg-subtle)' }}>
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!active && (
        <div
          className="rounded-md border py-6 text-center"
          style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
        >
          <p className="text-sm" style={{ color: 'var(--fg-subtle)' }}>
            Select a zone on the spectrum to explore.
          </p>
        </div>
      )}
    </section>
  )
}
