'use client'

import { useState } from 'react'

interface Model {
  id: string
  name: string
  released: string
  contextWindow: string
  inputCost: string
  outputCost: string
  strengths: string[]
  weaknesses: string[]
}

const models: Model[] = [
  {
    id: 'gpt',
    name: 'GPT-5.4',
    released: 'March 5, 2026',
    contextWindow: '272K tokens',
    inputCost: '$2.50 / 1M tokens',
    outputCost: '$15.00 / 1M tokens',
    strengths: [
      'General reasoning (ARC-AGI 2)',
      'Computer use automation (OSWorld)',
      'Professional knowledge work (GDPval)',
      'Command-line tasks (Terminal-Bench)',
    ],
    weaknesses: [
      'Smaller context than Gemini',
      'More expensive than Gemini at volume',
      'Behind Claude on coding benchmarks',
    ],
  },
  {
    id: 'claude',
    name: 'Claude Opus 4.6',
    released: 'February 5, 2026',
    contextWindow: '200K tokens',
    inputCost: '$5.00 / 1M tokens',
    outputCost: '$25.00 / 1M tokens',
    strengths: [
      'Production coding (SWE-Bench Verified)',
      'Code generation (HumanEval+)',
      'Deep reasoning chains',
      'Long-form analysis and writing',
    ],
    weaknesses: [
      'Highest per-token cost',
      'Smallest context window of the three',
      'Behind GPT on general reasoning',
    ],
  },
  {
    id: 'gemini',
    name: 'Gemini 3.1 Pro',
    released: 'February 19, 2026',
    contextWindow: '2M tokens',
    inputCost: '$2.00 / 1M tokens',
    outputCost: '$12.00 / 1M tokens',
    strengths: [
      'Mathematical reasoning (Deep Think)',
      'Expert science reasoning (GPQA Diamond)',
      'Web research (BrowseComp)',
      'Largest context window (2M tokens)',
    ],
    weaknesses: [
      'Still in Preview (GA expected Q2)',
      'Behind GPT on professional tasks',
      'Behind Claude on coding',
    ],
  },
]

interface BenchCategory {
  name: string
  leader: string
  score: string
}

const benchmarks: BenchCategory[] = [
  { name: 'General reasoning', leader: 'gpt', score: 'ARC-AGI 2' },
  { name: 'Production coding', leader: 'claude', score: 'SWE-Bench' },
  { name: 'Math reasoning', leader: 'gemini', score: 'Deep Think' },
  { name: 'Computer use', leader: 'gpt', score: 'OSWorld' },
  { name: 'Science reasoning', leader: 'gemini', score: 'GPQA Diamond' },
  { name: 'Code generation', leader: 'claude', score: 'HumanEval+' },
  { name: 'Web research', leader: 'gemini', score: 'BrowseComp' },
  { name: 'Professional tasks', leader: 'gpt', score: 'GDPval' },
]

const modelColors: Record<string, string> = {
  gpt: '#10b981',
  claude: 'var(--accent)',
  gemini: '#3b82f6',
}

export default function ModelConvergence() {
  const [activeId, setActiveId] = useState<string>(models[0].id)
  const active = models.find((m) => m.id === activeId)!

  const winsCount = (id: string) => benchmarks.filter((b) => b.leader === id).length

  return (
    <section
      role="region"
      aria-label="Model convergence explorer — compare GPT-5.4, Claude Opus 4.6, and Gemini 3.1 Pro"
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
          The March 2026 Frontier
        </h3>
        <p className="mt-1 text-sm" style={{ color: 'var(--fg-subtle)' }}>
          Three flagships launched within weeks. No clear winner. Select a model, then scroll down
          to see the benchmark split.
        </p>
      </div>

      {/* Model selector */}
      <div className="mb-6 grid grid-cols-3 gap-2">
        {models.map((m) => {
          const isActive = activeId === m.id
          return (
            <button
              key={m.id}
              onClick={() => setActiveId(m.id)}
              aria-pressed={isActive}
              className="rounded-md border px-3 py-3 text-center transition-all"
              style={{
                borderColor: isActive ? modelColors[m.id] : 'var(--border-strong)',
                background: isActive ? `${modelColors[m.id]}12` : 'transparent',
              }}
            >
              <span
                className="block text-sm font-medium"
                style={{ color: isActive ? modelColors[m.id] : 'var(--fg)' }}
              >
                {m.name}
              </span>
              <span className="mt-0.5 block text-xs" style={{ color: 'var(--fg-subtle)' }}>
                {winsCount(m.id)}/8 categories
              </span>
            </button>
          )
        })}
      </div>

      {/* Model details */}
      <div className="mb-6 space-y-3" aria-live="polite">
        <div
          className="grid grid-cols-3 gap-2"
        >
          <div
            className="rounded-md border px-3 py-2 text-center"
            style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--fg-subtle)' }}>
              Context
            </p>
            <p className="mt-0.5 text-sm font-medium" style={{ color: 'var(--fg)' }}>
              {active.contextWindow}
            </p>
          </div>
          <div
            className="rounded-md border px-3 py-2 text-center"
            style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--fg-subtle)' }}>
              Input cost
            </p>
            <p className="mt-0.5 text-sm font-medium" style={{ color: 'var(--fg)' }}>
              {active.inputCost}
            </p>
          </div>
          <div
            className="rounded-md border px-3 py-2 text-center"
            style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--fg-subtle)' }}>
              Output cost
            </p>
            <p className="mt-0.5 text-sm font-medium" style={{ color: 'var(--fg)' }}>
              {active.outputCost}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div
            className="rounded-md border p-3"
            style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
          >
            <p
              className="mb-2 text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: modelColors[active.id] }}
            >
              Where it leads
            </p>
            <div className="space-y-1">
              {active.strengths.map((s) => (
                <p key={s} className="text-sm" style={{ color: 'var(--fg-muted)' }}>
                  {s}
                </p>
              ))}
            </div>
          </div>
          <div
            className="rounded-md border p-3"
            style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
          >
            <p
              className="mb-2 text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: 'var(--fg-subtle)' }}
            >
              Where it trails
            </p>
            <div className="space-y-1">
              {active.weaknesses.map((w) => (
                <p key={w} className="text-sm" style={{ color: 'var(--fg-subtle)' }}>
                  {w}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Benchmark split visualization */}
      <div
        className="rounded-md border p-3"
        style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
      >
        <p
          className="mb-3 text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: 'var(--fg-subtle)' }}
        >
          Benchmark category leaders
        </p>
        <div className="space-y-1.5">
          {benchmarks.map((b) => (
            <div key={b.name} className="flex items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: modelColors[b.leader] }}
              />
              <span className="text-sm" style={{ color: 'var(--fg-muted)' }}>
                {b.name}
              </span>
              <span className="ml-auto text-xs font-mono" style={{ color: 'var(--fg-subtle)' }}>
                {b.score}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-4 border-t pt-2" style={{ borderColor: 'var(--border)' }}>
          {models.map((m) => (
            <div key={m.id} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: modelColors[m.id] }}
              />
              <span className="text-xs" style={{ color: 'var(--fg-subtle)' }}>
                {m.name.split(' ')[0]} ({winsCount(m.id)})
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
