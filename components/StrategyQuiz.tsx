'use client'

import { useState } from 'react'

interface Question {
  text: string
  options: { label: string; score: number }[]
}

const questions: Question[] = [
  {
    text: 'Your AI model makes a mistake that costs a customer money. What happens next?',
    options: [
      { label: 'Someone figures out who owns the model', score: 1 },
      { label: 'The on-call team follows an incident runbook', score: 2 },
      { label: 'Auto-rollback triggers and the post-mortem is scheduled by EOD', score: 3 },
      { label: 'The system self-corrects and the customer barely notices', score: 4 },
    ],
  },
  {
    text: 'How does your org decide whether to ship a new AI feature?',
    options: [
      { label: 'Whoever built it decides when it\'s ready', score: 1 },
      { label: 'Product and engineering agree, then ship', score: 2 },
      { label: 'Cross-functional review: product, eng, legal, and a bias check', score: 3 },
      { label: 'Staged rollout with automated quality gates at each phase', score: 4 },
    ],
  },
  {
    text: 'Your competitor announces a major AI product. What\'s your response?',
    options: [
      { label: 'Panic meeting. Accelerate the roadmap.', score: 1 },
      { label: 'Analyze the announcement and update our strategy deck', score: 2 },
      { label: 'Assess second-order effects on our positioning and adjust bets', score: 3 },
      { label: 'We already scenario-planned for this. Execute the playbook.', score: 4 },
    ],
  },
  {
    text: 'Where does "AI strategy" live in your org chart?',
    options: [
      { label: 'It\'s everyone\'s job (which means it\'s nobody\'s)', score: 1 },
      { label: 'A steering committee that meets quarterly', score: 2 },
      { label: 'A dedicated leader with cross-functional authority', score: 3 },
      { label: 'Embedded in every product team with central coordination', score: 4 },
    ],
  },
  {
    text: 'How do you measure whether your AI investments are working?',
    options: [
      { label: 'We track how many AI projects we launched', score: 1 },
      { label: 'Cost savings and efficiency metrics', score: 2 },
      { label: 'Business outcomes: revenue, retention, NPS attributed to AI', score: 3 },
      { label: 'Leading indicators of capability + lagging indicators of impact', score: 4 },
    ],
  },
]

interface Level {
  label: string
  range: [number, number]
  color: string
  take: string
}

const levels: Level[] = [
  { label: 'Reactive', range: [5, 8], color: 'var(--fg-subtle)', take: 'You\'re fighting fires. Most orgs start here. The fix isn\'t more AI — it\'s deciding who owns the model after it ships.' },
  { label: 'Developing', range: [9, 12], color: 'var(--fg-muted)', take: 'You have the pieces but they\'re not connected yet. The gap is usually between strategy and ops. Read my essay on AI operating models.' },
  { label: 'Mature', range: [13, 16], color: 'var(--accent)', take: 'You\'re ahead of most. The next edge is second-order thinking — not just what AI does for you, but what it changes around you.' },
  { label: 'Visionary', range: [17, 20], color: 'var(--accent)', take: 'Either you\'re at the frontier or you\'re being generous with yourself. Either way, we should talk.' },
]

export default function StrategyQuiz() {
  const [answers, setAnswers] = useState<number[]>([])
  const [current, setCurrent] = useState(0)

  const totalScore = answers.reduce((a, b) => a + b, 0)
  const done = answers.length === questions.length
  const level = levels.find((l) => totalScore >= l.range[0] && totalScore <= l.range[1]) || levels[0]

  const handleAnswer = (score: number) => {
    setAnswers([...answers, score])
    setCurrent(current + 1)
  }

  const restart = () => {
    setAnswers([])
    setCurrent(0)
  }

  if (done) {
    return (
      <div
        className="rounded-lg border p-5 sm:p-6"
        style={{ borderColor: 'var(--border-strong)', background: 'var(--bg)' }}
      >
        <div className="mb-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
            Your AI Strategy Maturity
          </p>
          <p className="mt-1 font-display text-3xl font-normal" style={{ color: level.color }}>
            {level.label}
          </p>
          <p className="mt-0.5 font-mono text-sm" style={{ color: 'var(--fg-subtle)' }}>
            {totalScore}/{questions.length * 4} points
          </p>
        </div>
        <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
          {level.take}
        </p>
        <div className="flex gap-2">
          <button onClick={restart} className="btn-ghost flex-1 text-sm">Retake</button>
          <button
            onClick={() => window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(`My AI Strategy Score: ${level.label} (${totalScore}/${questions.length * 4}) — take the quiz at jake-chen.com by @mitjake`)}`, '_blank')}
            className="btn-primary flex-1 text-sm"
          >
            Share
          </button>
        </div>
      </div>
    )
  }

  const q = questions[current]

  return (
    <div
      className="rounded-lg border p-5 sm:p-6"
      style={{ borderColor: 'var(--border-strong)', background: 'var(--bg)' }}
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
          Question {current + 1} of {questions.length}
        </p>
        {/* Progress dots */}
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: i < answers.length ? 'var(--accent)' : i === current ? 'var(--fg-muted)' : 'var(--border-strong)' }}
            />
          ))}
        </div>
      </div>

      <p className="mb-4 text-sm font-medium leading-relaxed" style={{ color: 'var(--fg)' }}>
        {q.text}
      </p>

      <div className="space-y-2" role="group" aria-label="Answer options">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt.score)}
            className="block w-full rounded-md border px-3 py-2.5 text-left text-sm transition-all hover:border-[color:var(--accent)]"
            style={{ borderColor: 'var(--border)', color: 'var(--fg-muted)' }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
