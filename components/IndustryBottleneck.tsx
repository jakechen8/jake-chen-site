'use client'

import { useState } from 'react'

interface Industry {
  id: string
  name: string
  abundant: string
  bottleneck: string
  insight: string
}

const industries: Industry[] = [
  {
    id: 'healthcare',
    name: 'Healthcare',
    abundant: 'Diagnostic speed, medical knowledge access, administrative processing',
    bottleneck: 'Clinical judgment, patient trust, and liability frameworks',
    insight: 'AI can read a scan in seconds. But someone still has to look the patient in the eye and explain what it means — and take responsibility for the decision.',
  },
  {
    id: 'legal',
    name: 'Legal',
    abundant: 'Legal research, contract review, document drafting',
    bottleneck: 'Judgment under ambiguity, client relationships, courtroom presence',
    insight: 'Mid-tier legal work gets compressed. Partners who can navigate novel situations and earn trust in high-stakes moments become more valuable, not less.',
  },
  {
    id: 'finance',
    name: 'Financial Services',
    abundant: 'Market analysis, risk modeling, compliance monitoring',
    bottleneck: 'Relationship management, regulatory interpretation, fiduciary trust',
    insight: 'When everyone has the same AI-generated analysis, alpha shifts to the people who can read between the lines and maintain client confidence.',
  },
  {
    id: 'education',
    name: 'Education',
    abundant: 'Personalized tutoring, content creation, grading',
    bottleneck: 'Mentorship, motivation, social development, credentialing',
    insight: 'The teacher\'s job shifts from "deliver information" to "build humans." That\'s harder, more important, and requires completely different skills.',
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    abundant: 'Quality inspection, predictive maintenance, supply chain optimization',
    bottleneck: 'Process innovation, skilled technicians, local regulatory compliance',
    insight: 'AI can spot a defect. It can\'t redesign the line when the supplier changes specs and the customer wants a variant nobody planned for.',
  },
  {
    id: 'realestate',
    name: 'Real Estate',
    abundant: 'Market analysis, property valuation, lead generation',
    bottleneck: 'Local knowledge, negotiation skill, trust in high-stakes transactions',
    insight: 'Zillow gave everyone data. The best agents got more valuable because they know things Zillow can\'t: which block floods, which seller is motivated, which inspector is honest.',
  },
  {
    id: 'media',
    name: 'Media & Content',
    abundant: 'Content generation, translation, personalization, distribution',
    bottleneck: 'Editorial judgment, audience trust, original reporting, brand identity',
    insight: 'When anyone can produce content, the scarce thing isn\'t the article — it\'s the reputation that makes people believe it.',
  },
  {
    id: 'consulting',
    name: 'Consulting',
    abundant: 'Market sizing, benchmarking, scenario frameworks, slide decks',
    bottleneck: 'Organizational insight, implementation support, trusted advisory relationships',
    insight: 'The deck was never the work. The value was always in being present when the strategy meets reality. AI just makes that impossible to obscure.',
  },
  {
    id: 'retail',
    name: 'Retail & E-commerce',
    abundant: 'Product recommendations, inventory forecasting, customer service',
    bottleneck: 'Brand curation, experiential retail, supply chain resilience',
    insight: 'When AI can recommend anything to anyone, the stores that win are the ones that make you trust their taste — not their algorithm.',
  },
  {
    id: 'government',
    name: 'Government',
    abundant: 'Data analysis, citizen services, fraud detection, document processing',
    bottleneck: 'Policy judgment, democratic accountability, public trust, equity oversight',
    insight: 'Speed of analysis was never the government\'s constraint. Legitimacy and fairness were. AI accelerates the easy part and exposes the hard part.',
  },
]

export default function IndustryBottleneck() {
  const [selected, setSelected] = useState<string | null>(null)
  const industry = industries.find((i) => i.id === selected)

  return (
    <div
      className="rounded-lg border p-5 sm:p-6"
      style={{ borderColor: 'var(--border-strong)', background: 'var(--bg)' }}
    >
      <div className="mb-4">
        <p className="mb-3 text-sm font-medium" style={{ color: 'var(--fg)' }}>
          Pick your industry. I&apos;ll tell you what AI makes abundant — and where the new bottleneck&nbsp;forms.
        </p>
        <label htmlFor="industry-select" className="sr-only">Select your industry</label>
        <select
          id="industry-select"
          value={selected || ''}
          onChange={(e) => setSelected(e.target.value || null)}
          className="w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors focus:border-[color:var(--accent)]"
          style={{
            borderColor: 'var(--border-strong)',
            background: 'var(--bg)',
            color: selected ? 'var(--fg)' : 'var(--fg-subtle)',
          }}
        >
          <option value="">Choose an industry...</option>
          {industries.map((i) => (
            <option key={i.id} value={i.id}>{i.name}</option>
          ))}
        </select>
      </div>

      {industry && (
        <div className="space-y-3" aria-live="polite">
          <div
            className="rounded-md border px-4 py-3"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-warm)' }}
          >
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--fg-subtle)' }}>
              Becomes Abundant
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
              {industry.abundant}
            </p>
          </div>
          <div
            className="rounded-md border-2 px-4 py-3"
            style={{ borderColor: 'var(--accent)', background: 'var(--accent-light)' }}
          >
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
              New Bottleneck
            </p>
            <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--fg)' }}>
              {industry.bottleneck}
            </p>
          </div>
          <p className="text-sm italic leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
            {industry.insight}
          </p>
        </div>
      )}
    </div>
  )
}
