'use client'

import { useState } from 'react'

interface Layer {
  id: string
  label: string
  deliverableValue: number
  presenceValue: number
  aiCapability: string
  humanPremium: string
}

const layers: Layer[] = [
  {
    id: 'research',
    label: 'Market Research & Sizing',
    deliverableValue: 90,
    presenceValue: 10,
    aiCapability: 'AI can synthesize public data, model TAM, benchmark competitors, and produce reports in hours instead of weeks.',
    humanPremium: 'Knowing which questions the CEO is actually asking — the ones that didn\'t make it into the brief.',
  },
  {
    id: 'analysis',
    label: 'Competitive Analysis',
    deliverableValue: 80,
    presenceValue: 25,
    aiCapability: 'AI can track competitors, parse earnings calls, monitor product changes, and map positioning across dozens of players simultaneously.',
    humanPremium: 'Reading the room when the VP of Product says "we\'re not worried about them" and everyone else goes quiet.',
  },
  {
    id: 'modeling',
    label: 'Financial Modeling & Scenarios',
    deliverableValue: 85,
    presenceValue: 15,
    aiCapability: 'AI can build scenario models, run Monte Carlo simulations, stress-test assumptions, and generate sensitivity analyses faster than any analyst.',
    humanPremium: 'Knowing that the CFO will never approve Scenario B because of a budget fight from last quarter that isn\'t in any document.',
  },
  {
    id: 'recommendation',
    label: 'Strategic Recommendation',
    deliverableValue: 60,
    presenceValue: 50,
    aiCapability: 'AI can synthesize findings into structured recommendations with supporting evidence and risk assessments.',
    humanPremium: 'Framing the recommendation in language that maps to how this specific leadership team makes decisions — not how they say they make decisions.',
  },
  {
    id: 'implementation',
    label: 'Implementation & Adaptation',
    deliverableValue: 15,
    presenceValue: 95,
    aiCapability: 'AI can generate project plans, track milestones, and flag risks. It cannot navigate organizational politics.',
    humanPremium: 'Being there when the plan breaks. Seeing which informal veto points will kill the strategy before it gets a name. Adapting in real time.',
  },
]

export default function ValueMigration() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = layers.find((l) => l.id === activeId) || null

  return (
    <section
      role="region"
      aria-label="Value migration explorer — see where AI replaces deliverables and where presence becomes the premium"
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
          Where Does Value Migrate?
        </h3>
        <p className="mt-1 text-sm" style={{ color: 'var(--fg-subtle)' }}>
          Click a layer of strategy work. See what AI can produce — and what only presence earns.
        </p>
      </div>

      {/* Layer list */}
      <div className="mb-6 space-y-2">
        {layers.map((l) => {
          const isActive = activeId === l.id
          return (
            <button
              key={l.id}
              onClick={() => setActiveId(isActive ? null : l.id)}
              aria-pressed={isActive}
              className="flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left transition-all"
              style={{
                borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                background: isActive ? 'var(--accent-light)' : 'var(--bg)',
              }}
            >
              <span
                className="shrink-0 text-sm font-medium"
                style={{ color: isActive ? 'var(--accent)' : 'var(--fg)' }}
              >
                {l.label}
              </span>
              <div className="ml-auto flex items-center gap-2">
                {/* Mini bar showing the ratio */}
                <div
                  className="hidden h-2 w-24 overflow-hidden rounded-full sm:block"
                  style={{ background: 'var(--border)' }}
                  aria-hidden="true"
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${l.presenceValue}%`,
                      background: 'var(--accent)',
                    }}
                  />
                </div>
                <span
                  className="text-xs tabular-nums"
                  style={{ color: 'var(--fg-subtle)' }}
                >
                  {l.presenceValue}% presence
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Detail panel */}
      {active && (
        <div
          className="grid gap-4 sm:grid-cols-2"
          role="status"
          aria-live="polite"
        >
          <div
            className="rounded-md border p-4"
            style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
          >
            <p
              className="mb-2 text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: 'var(--fg-subtle)' }}
            >
              What AI Can Produce
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
              {active.aiCapability}
            </p>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: 'var(--fg-subtle)' }}>Deliverable value</span>
                <div
                  className="h-1.5 flex-1 overflow-hidden rounded-full"
                  style={{ background: 'var(--border)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${active.deliverableValue}%`, background: 'var(--fg-subtle)' }}
                  />
                </div>
                <span className="font-mono text-xs" style={{ color: 'var(--fg-subtle)' }}>
                  {active.deliverableValue}%
                </span>
              </div>
            </div>
          </div>

          <div
            className="rounded-md border-2 p-4"
            style={{ borderColor: 'var(--accent)', background: 'var(--accent-light)' }}
          >
            <p
              className="mb-2 text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: 'var(--accent)' }}
            >
              What Only Presence Earns
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--fg)' }}>
              {active.humanPremium}
            </p>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: 'var(--accent)' }}>Presence premium</span>
                <div
                  className="h-1.5 flex-1 overflow-hidden rounded-full"
                  style={{ background: 'var(--border)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${active.presenceValue}%`, background: 'var(--accent)' }}
                  />
                </div>
                <span className="font-mono text-xs" style={{ color: 'var(--accent)' }}>
                  {active.presenceValue}%
                </span>
              </div>
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
            Click a layer above to explore the shift.
          </p>
        </div>
      )}
    </section>
  )
}
