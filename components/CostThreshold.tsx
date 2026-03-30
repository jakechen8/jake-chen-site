'use client'

import { useState } from 'react'

interface Threshold {
  id: string
  costLabel: string
  latencyLabel: string
  description: string
  applications: string[]
  status: 'past' | 'present' | 'emerging'
}

const thresholds: Threshold[] = [
  {
    id: 'premium',
    costLabel: '$$$',
    latencyLabel: '5–30s',
    description:
      'Intelligence as premium compute. Powerful but expensive enough that every call has to justify itself. Used for high-value, low-frequency tasks.',
    applications: [
      'Research reports',
      'Code generation',
      'Complex analysis',
      'Document drafting',
    ],
    status: 'past',
  },
  {
    id: 'utility',
    costLabel: '$$',
    latencyLabel: '1–5s',
    description:
      'Intelligence as utility. Cheap enough to use routinely, fast enough to stay in the flow. This is where most commercial AI sits today.',
    applications: [
      'Chat assistants',
      'Code completion',
      'Search augmentation',
      'Content summarization',
    ],
    status: 'present',
  },
  {
    id: 'ambient',
    costLabel: '$',
    latencyLabel: '<500ms',
    description:
      'Intelligence as infrastructure. So fast and cheap it can run continuously in the background. You stop noticing it. This is where TurboQuant and ChatJimmy point.',
    applications: [
      'Real-time copilots',
      'Ambient voice agents',
      'Always-on monitoring',
      'Edge inference',
    ],
    status: 'emerging',
  },
  {
    id: 'embedded',
    costLabel: '¢',
    latencyLabel: '<100ms',
    description:
      'Intelligence as material. Embedded in every surface, every interaction, every workflow. Near-zero marginal cost. The generation after ambient.',
    applications: [
      'Per-keystroke assistance',
      'Sensor-level inference',
      'Ubiquitous personalization',
      'Autonomous micro-agents',
    ],
    status: 'emerging',
  },
]

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  past: { bg: 'var(--border)', text: 'var(--fg-subtle)', label: 'Established' },
  present: { bg: 'var(--accent-light)', text: 'var(--accent)', label: 'Current' },
  emerging: { bg: 'var(--accent)', text: '#fff', label: 'Emerging' },
}

export default function CostThreshold() {
  const [activeId, setActiveId] = useState<string>(thresholds[2].id)
  const active = thresholds.find((t) => t.id === activeId)!

  return (
    <section
      role="region"
      aria-label="Cost threshold explorer — see how cheaper intelligence unlocks new categories of application"
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
          The Cost Threshold Map
        </h3>
        <p className="mt-1 text-sm" style={{ color: 'var(--fg-subtle)' }}>
          Each drop in cost and latency unlocks a new category of what AI can become. Select a
          threshold.
        </p>
      </div>

      {/* Threshold selector */}
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Choose a cost threshold">
        {thresholds.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveId(t.id)}
            aria-pressed={activeId === t.id}
            className="rounded-md border px-3 py-1.5 text-sm font-medium transition-all"
            style={{
              borderColor: activeId === t.id ? 'var(--accent)' : 'var(--border-strong)',
              background: activeId === t.id ? 'var(--accent-light)' : 'transparent',
              color: activeId === t.id ? 'var(--accent)' : 'var(--fg-muted)',
            }}
          >
            {t.costLabel} · {t.latencyLabel}
          </button>
        ))}
      </div>

      {/* Detail view */}
      <div className="space-y-4" aria-live="polite">
        {/* Status badge and description */}
        <div
          className="rounded-md border px-4 py-3"
          style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
        >
          <div className="mb-2 flex items-center gap-2">
            <span
              className="rounded px-1.5 py-0.5 text-xs font-semibold uppercase"
              style={{
                background: statusColors[active.status].bg,
                color: statusColors[active.status].text,
              }}
            >
              {statusColors[active.status].label}
            </span>
            <span className="font-mono text-xs" style={{ color: 'var(--fg-subtle)' }}>
              Cost: {active.costLabel} · Latency: {active.latencyLabel}
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
            {active.description}
          </p>
        </div>

        {/* Applications grid */}
        <div
          className="rounded-md border-2 px-4 py-3"
          style={{ borderColor: 'var(--accent)', background: 'var(--accent-light)' }}
        >
          <p
            className="mb-2 text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: 'var(--accent)' }}
          >
            Applications that become viable
          </p>
          <div className="flex flex-wrap gap-2">
            {active.applications.map((app) => (
              <span
                key={app}
                className="rounded-full border px-3 py-1 text-sm"
                style={{ borderColor: 'var(--accent)', color: 'var(--fg)' }}
              >
                {app}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
