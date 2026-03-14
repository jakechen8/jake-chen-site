'use client'

import { useState } from 'react'

interface ChainNode {
  id: string
  text: string
  children?: ChainNode[]
}

interface Chain {
  id: string
  trigger: string
  description: string
  root: ChainNode
}

const chains: Chain[] = [
  {
    id: 'driving',
    trigger: 'AI drives most cars',
    description: 'Self-driving becomes mainstream. Then what?',
    root: {
      id: 'd-root',
      text: 'AI drives most cars',
      children: [
        {
          id: 'd-1',
          text: 'Accidents drop 90%',
          children: [
            { id: 'd-1a', text: 'Auto insurance industry shrinks dramatically' },
            { id: 'd-1b', text: 'Trauma surgeons and ER demand drops — hospital economics shift' },
            { id: 'd-1c', text: 'DUI laws become irrelevant — bars and nightlife boom in suburbs' },
          ],
        },
        {
          id: 'd-2',
          text: 'Commute time becomes productive time',
          children: [
            { id: 'd-2a', text: 'People tolerate longer commutes — exurbs grow, cities lose pricing power' },
            { id: 'd-2b', text: 'In-car commerce becomes a new ad market' },
          ],
        },
        {
          id: 'd-3',
          text: 'Car ownership declines',
          children: [
            { id: 'd-3a', text: 'Parking lots become developable land — urban planning transforms' },
            { id: 'd-3b', text: 'Gas stations disappear — roadside retail collapses or reinvents' },
          ],
        },
      ],
    },
  },
  {
    id: 'tutors',
    trigger: 'AI tutors match good teachers',
    description: 'Every student gets a personalized tutor. Then what?',
    root: {
      id: 't-root',
      text: 'AI tutors match good human teachers',
      children: [
        {
          id: 't-1',
          text: 'Learning speed becomes individual, not institutional',
          children: [
            { id: 't-1a', text: 'Age-based grade levels lose meaning — credentialing changes' },
            { id: 't-1b', text: 'Top students accelerate faster — inequality of outcomes grows' },
          ],
        },
        {
          id: 't-2',
          text: 'Teachers shift from instruction to mentorship',
          children: [
            { id: 't-2a', text: 'Social and emotional skills become the core curriculum' },
            { id: 't-2b', text: 'Hiring criteria for teachers change completely' },
          ],
        },
        {
          id: 't-3',
          text: 'Geography stops limiting access to quality education',
          children: [
            { id: 't-3a', text: 'Rural talent pool grows — changes where companies recruit' },
            { id: 't-3b', text: 'Elite university premium shrinks — but their networks don\'t' },
          ],
        },
      ],
    },
  },
  {
    id: 'knowledge',
    trigger: 'AI makes expert knowledge free',
    description: 'Legal, medical, financial expertise becomes accessible to everyone. Then what?',
    root: {
      id: 'k-root',
      text: 'AI makes expert knowledge free',
      children: [
        {
          id: 'k-1',
          text: 'Professionals compete on judgment, not information',
          children: [
            { id: 'k-1a', text: 'Mid-tier professionals lose work — top-tier command even higher premiums' },
            { id: 'k-1b', text: 'Professional school enrollment drops — law and MBA programs shrink' },
          ],
        },
        {
          id: 'k-2',
          text: 'Patients self-diagnose, citizens self-represent',
          children: [
            { id: 'k-2a', text: 'Malpractice and liability frameworks get rewritten' },
            { id: 'k-2b', text: 'Trust shifts from credentials to track record and reviews' },
          ],
        },
        {
          id: 'k-3',
          text: 'Information asymmetry disappears in negotiations',
          children: [
            { id: 'k-3a', text: 'Car dealers, realtors, contractors lose pricing power' },
            { id: 'k-3b', text: 'Consumer protection law shifts focus from disclosure to AI accuracy' },
          ],
        },
      ],
    },
  },
]

export default function SecondOrderChain() {
  const [activeChain, setActiveChain] = useState<string>(chains[0].id)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const chain = chains.find((c) => c.id === activeChain)!

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const resetAndSwitch = (chainId: string) => {
    setActiveChain(chainId)
    setExpanded(new Set())
  }

  const renderNode = (node: ChainNode, depth: number = 0) => {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = expanded.has(node.id)
    const isRoot = depth === 0

    return (
      <div key={node.id} className={depth > 0 ? 'ml-4 sm:ml-6' : ''}>
        <button
          onClick={() => hasChildren ? toggle(node.id) : undefined}
          aria-expanded={hasChildren ? isExpanded : undefined}
          className={`group flex w-full items-start gap-2 rounded-md border px-3 py-2.5 text-left text-sm transition-all ${
            hasChildren ? 'cursor-pointer' : 'cursor-default'
          }`}
          style={{
            borderColor: isRoot ? 'var(--accent)' : isExpanded ? 'var(--accent)' : 'var(--border)',
            background: isRoot ? 'var(--accent-light)' : 'var(--bg)',
            color: 'var(--fg)',
          }}
        >
          {hasChildren && (
            <span
              className="mt-0.5 inline-block shrink-0 text-xs transition-transform"
              style={{
                color: 'var(--accent)',
                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
              }}
              aria-hidden="true"
            >
              ▶
            </span>
          )}
          {!hasChildren && (
            <span className="mt-0.5 shrink-0 text-xs" style={{ color: 'var(--fg-subtle)' }} aria-hidden="true">
              ○
            </span>
          )}
          <span className="leading-relaxed">{node.text}</span>
        </button>

        {hasChildren && isExpanded && (
          <div className="mt-1.5 space-y-1.5 border-l-2 pl-0" style={{ borderColor: 'var(--accent-light)' }}>
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <section
      role="region"
      aria-label="Second-order effects chain — click to reveal cascading consequences"
      className="my-10 rounded-lg border p-5 sm:p-8"
      style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-warm)' }}
    >
      <div className="mb-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
          Interactive
        </p>
        <h3 className="font-display text-lg font-normal tracking-tight" style={{ color: 'var(--fg)' }}>
          Follow the Chain
        </h3>
        <p className="mt-1 text-sm" style={{ color: 'var(--fg-subtle)' }}>
          Pick a first-order effect. Click to unfold the second-order consequences.
        </p>
      </div>

      {/* Chain selector */}
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Choose a chain">
        {chains.map((c) => (
          <button
            key={c.id}
            onClick={() => resetAndSwitch(c.id)}
            aria-pressed={activeChain === c.id}
            className="rounded-md border px-3 py-1.5 text-sm font-medium transition-all"
            style={{
              borderColor: activeChain === c.id ? 'var(--accent)' : 'var(--border-strong)',
              background: activeChain === c.id ? 'var(--accent-light)' : 'transparent',
              color: activeChain === c.id ? 'var(--accent)' : 'var(--fg-muted)',
            }}
          >
            {c.trigger}
          </button>
        ))}
      </div>

      <p className="mb-4 text-xs italic" style={{ color: 'var(--fg-subtle)' }}>
        {chain.description}
      </p>

      {/* Tree */}
      <div className="space-y-1.5" aria-live="polite">
        {renderNode(chain.root)}
      </div>
    </section>
  )
}
