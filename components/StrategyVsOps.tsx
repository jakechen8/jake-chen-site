'use client'

import { useState } from 'react'

interface Scenario {
  id: string
  title: string
  strategy: string
  reality: string
}

const scenarios: Scenario[] = [
  {
    id: 'drift',
    title: 'Model Drift',
    strategy: '"We\'ll monitor model performance with automated dashboards and retrain quarterly."',
    reality: 'It\'s 2am. The fraud model started flagging 40% of legitimate transactions six hours ago. Nobody noticed until a VP got their card declined at dinner. The data scientist who built it left three months ago. The dashboard says everything is green because it\'s measuring the wrong metric.',
  },
  {
    id: 'edge',
    title: 'Edge Case Explosion',
    strategy: '"Our model handles 95% of cases. For the remaining 5%, we\'ll route to human review."',
    reality: 'That 5% turns out to be 50,000 cases a month. You need 30 reviewers. Nobody budgeted for them. The backlog hits two weeks. Customers are furious. A product manager quietly asks: can we just auto-approve the low-risk ones? Nobody agrees on what "low-risk" means.',
  },
  {
    id: 'compliance',
    title: 'Compliance Audit',
    strategy: '"We\'ll maintain full documentation and model cards for every production model."',
    reality: 'The auditor asks for the training data lineage of a model deployed 14 months ago. The Jupyter notebook is on a former intern\'s laptop. The feature store was migrated twice since then. Someone says "it\'s probably in Confluence" and everyone knows what that means.',
  },
  {
    id: 'disagreement',
    title: 'Team Disagreement',
    strategy: '"An AI governance board will make deployment decisions with clear escalation paths."',
    reality: 'The ML team says the model is ready. Product says it needs two more weeks of testing. Legal wants a bias audit first. Sales already told a client it launches Monday. The governance board meets monthly and their last three meetings were canceled for "scheduling conflicts."',
  },
  {
    id: 'vendor',
    title: 'Vendor Lock-In',
    strategy: '"We\'ll maintain vendor optionality with a modular architecture and abstraction layers."',
    reality: 'Eighteen months in, your entire pipeline runs on one provider\'s proprietary embedding model. Switching means re-embedding 50 million documents. Your "abstraction layer" was a TODO comment from sprint 3 that nobody came back to. The vendor just raised prices 40%.',
  },
]

export default function StrategyVsOps() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = scenarios.find((s) => s.id === activeId) || null

  return (
    <section
      role="region"
      aria-label="Strategy deck vs operational reality — click a scenario to see the gap"
      className="my-10 rounded-lg border p-5 sm:p-8"
      style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-warm)' }}
    >
      <div className="mb-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
          Interactive
        </p>
        <h3 className="font-display text-lg font-normal tracking-tight" style={{ color: 'var(--fg)' }}>
          Strategy Deck vs. 2am Reality
        </h3>
        <p className="mt-1 text-sm" style={{ color: 'var(--fg-subtle)' }}>
          Pick a scenario. See what the deck promised — and what actually happens.
        </p>
      </div>

      {/* Scenario buttons */}
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Choose a scenario">
        {scenarios.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveId(activeId === s.id ? null : s.id)}
            aria-pressed={activeId === s.id}
            className="rounded-md border px-3 py-1.5 text-sm font-medium transition-all"
            style={{
              borderColor: activeId === s.id ? 'var(--accent)' : 'var(--border-strong)',
              background: activeId === s.id ? 'var(--accent-light)' : 'transparent',
              color: activeId === s.id ? 'var(--accent)' : 'var(--fg-muted)',
            }}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Comparison */}
      {active && (
        <div
          className="grid gap-4 sm:grid-cols-2"
          role="status"
          aria-live="polite"
        >
          {/* Strategy column */}
          <div
            className="rounded-md border p-4"
            style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
          >
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--fg-subtle)' }}>
              What the Strategy Deck Says
            </p>
            <p className="text-sm italic leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
              {active.strategy}
            </p>
          </div>

          {/* Reality column */}
          <div
            className="rounded-md border p-4"
            style={{ borderColor: 'var(--accent)', background: 'var(--accent-light)' }}
          >
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
              What Actually Happens at 2am
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--fg)' }}>
              {active.reality}
            </p>
          </div>
        </div>
      )}

      {!active && (
        <div
          className="rounded-md border py-8 text-center"
          style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
        >
          <p className="text-sm" style={{ color: 'var(--fg-subtle)' }}>
            Click a scenario above to see the gap.
          </p>
        </div>
      )}
    </section>
  )
}
