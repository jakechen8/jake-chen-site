'use client'

import { useState } from 'react'

interface Shift {
  id: string
  trigger: string
  getsAbundant: string
  getsScarce: string
  newWork: string[]
}

const shifts: Shift[] = [
  {
    id: 'expertise',
    trigger: 'AI makes expertise cheap',
    getsAbundant: 'Information & analysis',
    getsScarce: 'Applied judgment & accountability',
    newWork: [
      'Implementation specialists',
      'Reviewers & auditors',
      'Coaches & trainers',
      'Context translators',
    ],
  },
  {
    id: 'production',
    trigger: 'AI makes production cheap',
    getsAbundant: 'Content, code, plans, recommendations',
    getsScarce: 'Trust, verification & provenance',
    newWork: [
      'Certification & compliance',
      'Editorial judgment',
      'Reputation management',
      'Quality assurance',
    ],
  },
  {
    id: 'customization',
    trigger: 'AI makes customization cheap',
    getsAbundant: 'Tailored software & services',
    getsScarce: 'Domain knowledge & local context',
    newWork: [
      'Niche operators',
      'Workflow designers',
      'Integration specialists',
      'Domain-expert founders',
    ],
  },
  {
    id: 'coordination',
    trigger: 'AI makes coordination cheap',
    getsAbundant: 'Organizational capacity',
    getsScarce: 'Configuration, oversight & ops',
    newWork: [
      'System configurators',
      'Vendor managers',
      'Data stewards',
      'Compliance operators',
    ],
  },
]

export default function BottleneckShift() {
  const [active, setActive] = useState<string>(shifts[0].id)
  const shift = shifts.find((s) => s.id === active)!

  return (
    <section
      role="region"
      aria-label="Bottleneck shift explorer — see what becomes scarce when AI makes something abundant"
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
          Where Does the Bottleneck Move?
        </h3>
        <p className="mt-1 text-sm" style={{ color: 'var(--fg-subtle)' }}>
          Pick a shift. See what becomes abundant, what becomes scarce, and where new work forms.
        </p>
      </div>

      {/* Shift selector */}
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Choose a shift">
        {shifts.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            aria-pressed={active === s.id}
            className="rounded-md border px-3 py-1.5 text-sm font-medium transition-all"
            style={{
              borderColor: active === s.id ? 'var(--accent)' : 'var(--border-strong)',
              background: active === s.id ? 'var(--accent-light)' : 'transparent',
              color: active === s.id ? 'var(--accent)' : 'var(--fg-muted)',
            }}
          >
            {s.trigger}
          </button>
        ))}
      </div>

      {/* Flow visualization */}
      <div className="space-y-4" aria-live="polite">
        {/* Abundant */}
        <div
          className="flex items-start gap-3 rounded-md border px-4 py-3"
          style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
        >
          <span
            className="mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold uppercase"
            style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
          >
            Abundant
          </span>
          <span className="text-sm leading-relaxed" style={{ color: 'var(--fg)' }}>
            {shift.getsAbundant}
          </span>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <svg
            width="20"
            height="24"
            viewBox="0 0 20 24"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="10" y1="2" x2="10" y2="18" />
            <polyline points="5 14 10 19 15 14" />
          </svg>
        </div>

        {/* Scarce */}
        <div
          className="flex items-start gap-3 rounded-md border-2 px-4 py-3"
          style={{ borderColor: 'var(--accent)', background: 'var(--accent-light)' }}
        >
          <span
            className="mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold uppercase"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            Scarce
          </span>
          <span className="text-sm font-medium leading-relaxed" style={{ color: 'var(--fg)' }}>
            {shift.getsScarce}
          </span>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <svg
            width="20"
            height="24"
            viewBox="0 0 20 24"
            fill="none"
            stroke="var(--fg-subtle)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="10" y1="2" x2="10" y2="18" />
            <polyline points="5 14 10 19 15 14" />
          </svg>
        </div>

        {/* New work */}
        <div
          className="rounded-md border px-4 py-3"
          style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
        >
          <p
            className="mb-2 text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--fg-subtle)' }}
          >
            New work that forms
          </p>
          <div className="flex flex-wrap gap-2">
            {shift.newWork.map((w) => (
              <span
                key={w}
                className="rounded-full border px-3 py-1 text-sm"
                style={{ borderColor: 'var(--border-strong)', color: 'var(--fg-muted)' }}
              >
                {w}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
