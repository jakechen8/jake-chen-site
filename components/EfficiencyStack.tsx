'use client'

import { useState } from 'react'

interface StackLayer {
  id: string
  label: string
  description: string
  example: string
  unlocks: string
}

const layers: StackLayer[] = [
  {
    id: 'compression',
    label: 'Compression & Quantization',
    description:
      'Algorithms that reduce memory footprint without meaningful accuracy loss. TurboQuant compresses KV cache to ~3 bits, cutting memory 6x.',
    example: 'TurboQuant (Google Research)',
    unlocks: 'Longer context windows on existing hardware. More concurrent users per GPU.',
  },
  {
    id: 'memory',
    label: 'Memory Architecture',
    description:
      'How token history is stored and retrieved during inference. KV cache grows linearly with context length and becomes the dominant memory cost.',
    example: 'KV cache optimization, paged attention, sparse attention',
    unlocks: 'Models that can hold entire codebases or documents in context without blowing up costs.',
  },
  {
    id: 'inference',
    label: 'Inference Hardware',
    description:
      'Specialized silicon designed to run models faster and cheaper. Taalas hard-wires individual models into chips, collapsing memory and compute.',
    example: 'ChatJimmy / Taalas ASIC',
    unlocks: '17K tokens/sec per user. 10x less power. 20x cheaper hardware.',
  },
  {
    id: 'deployment',
    label: 'Deployment & Serving',
    description:
      'The orchestration layer: batching, routing, caching, load balancing. This decides how many users a system can serve before economics break.',
    example: 'vLLM, TensorRT-LLM, speculative decoding',
    unlocks: 'Lower per-query cost. Better tail latency. Feasible always-on inference.',
  },
  {
    id: 'product',
    label: 'Product Experience',
    description:
      'The layer closest to the user. When latency and cost drop far enough, entirely new interaction patterns become possible.',
    example: 'Real-time copilots, ambient agents, voice-first workflows',
    unlocks: 'AI that feels like infrastructure instead of premium compute.',
  },
]

export default function EfficiencyStack() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = layers.find((l) => l.id === activeId) || null

  return (
    <section
      role="region"
      aria-label="Efficiency stack explorer — see the layers that make intelligence cheaper to deliver"
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
          The Efficiency Stack
        </h3>
        <p className="mt-1 text-sm" style={{ color: 'var(--fg-subtle)' }}>
          Intelligence gets cheaper layer by layer. Click a layer to see what it does and what it
          unlocks.
        </p>
      </div>

      {/* Stack visualization */}
      <div className="mb-6 space-y-1.5">
        {layers.map((l, i) => {
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
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold"
                style={{
                  background: isActive ? 'var(--accent)' : 'var(--border-strong)',
                  color: isActive ? '#fff' : 'var(--fg-muted)',
                }}
              >
                {i + 1}
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: isActive ? 'var(--accent)' : 'var(--fg)' }}
              >
                {l.label}
              </span>
              <svg
                className="ml-auto shrink-0 transition-transform"
                style={{
                  transform: isActive ? 'rotate(180deg)' : 'rotate(0)',
                  color: isActive ? 'var(--accent)' : 'var(--fg-subtle)',
                }}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="4 6 8 10 12 6" />
              </svg>
            </button>
          )
        })}
      </div>

      {/* Detail panel */}
      {active && (
        <div
          className="space-y-3"
          role="status"
          aria-live="polite"
        >
          <div
            className="rounded-md border p-4"
            style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
          >
            <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
              {active.description}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div
              className="rounded-md border p-4"
              style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
            >
              <p
                className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: 'var(--fg-subtle)' }}
              >
                Example
              </p>
              <p className="text-sm font-medium" style={{ color: 'var(--fg)' }}>
                {active.example}
              </p>
            </div>
            <div
              className="rounded-md border-2 p-4"
              style={{ borderColor: 'var(--accent)', background: 'var(--accent-light)' }}
            >
              <p
                className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: 'var(--accent)' }}
              >
                What it unlocks
              </p>
              <p className="text-sm font-medium" style={{ color: 'var(--fg)' }}>
                {active.unlocks}
              </p>
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
            Click a layer above to explore what it does.
          </p>
        </div>
      )}
    </section>
  )
}
