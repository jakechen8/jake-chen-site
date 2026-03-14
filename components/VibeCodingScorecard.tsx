'use client'

import { useState } from 'react'

interface Dimension {
  id: string
  label: string
  jakeRating: number
  jakeComment: string
}

const dimensions: Dimension[] = [
  {
    id: 'speed',
    label: 'Speed',
    jakeRating: 5,
    jakeComment: 'No contest. What used to take me a weekend I can scaffold in an hour. The initial velocity is intoxicating.',
  },
  {
    id: 'quality',
    label: 'Code Quality',
    jakeRating: 2,
    jakeComment: 'This is where the wheels come off. Generated code works — until it doesn\'t. Subtle bugs, weird patterns, inconsistent naming. You end up with a codebase that feels like it was written by 12 different people.',
  },
  {
    id: 'learning',
    label: 'Learning',
    jakeRating: 3,
    jakeComment: 'Mixed. I learned what\'s possible faster, but I understood less of what I built. There\'s a real risk of cargo-culting your way through a project.',
  },
  {
    id: 'debugging',
    label: 'Debugging',
    jakeRating: 1,
    jakeComment: 'The worst part. When vibe-coded code breaks, you\'re debugging someone else\'s logic that you never fully understood. AI can help, but it often introduces new bugs while fixing old ones. I spent more time debugging than I saved generating.',
  },
  {
    id: 'maintainability',
    label: 'Maintainability',
    jakeRating: 2,
    jakeComment: 'Coming back to vibe-coded projects a month later is rough. The code works but the "why" behind decisions is missing. No comments, no clear architecture. Just vibes.',
  },
  {
    id: 'fun',
    label: 'Fun Factor',
    jakeRating: 5,
    jakeComment: 'Absolutely the most fun I\'ve had coding. Ideas become real in minutes. The creative loop is incredibly tight. This is the part that keeps people coming back despite everything else.',
  },
]

export default function VibeCodingScorecard() {
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  const handleRate = (id: string, value: number) => {
    setRatings((prev) => ({ ...prev, [id]: value }))
    // Reveal Jake's rating after user rates
    setTimeout(() => {
      setRevealed((prev) => ({ ...prev, [id]: true }))
    }, 300)
  }

  const allRated = dimensions.every((d) => ratings[d.id] !== undefined)

  return (
    <section
      role="region"
      aria-label="Vibe coding scorecard — rate each dimension and compare with Jake's ratings"
      className="my-10 rounded-lg border p-5 sm:p-8"
      style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-warm)' }}
    >
      <div className="mb-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
          Interactive
        </p>
        <h3 className="font-display text-lg font-normal tracking-tight" style={{ color: 'var(--fg)' }}>
          Rate Your Vibe Coding Experience
        </h3>
        <p className="mt-1 text-sm" style={{ color: 'var(--fg-subtle)' }}>
          Rate each dimension 1-5, then see how Jake scored it.
        </p>
      </div>

      <div className="space-y-5">
        {dimensions.map((d) => (
          <div
            key={d.id}
            className="rounded-md border p-4"
            style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: 'var(--fg)' }}>
                {d.label}
              </span>
              {revealed[d.id] && (
                <span className="text-xs" style={{ color: 'var(--fg-subtle)' }}>
                  Jake: {d.jakeRating}/5
                </span>
              )}
            </div>

            {/* Rating buttons */}
            <div className="mb-2 flex gap-1.5" role="group" aria-label={`Rate ${d.label} 1 to 5`}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => handleRate(d.id, n)}
                  aria-pressed={ratings[d.id] === n}
                  aria-label={`${n} out of 5`}
                  className="flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-all"
                  style={{
                    border: `1px solid ${ratings[d.id] === n ? 'var(--accent)' : 'var(--border-strong)'}`,
                    background: ratings[d.id] === n ? 'var(--accent)' : 'transparent',
                    color: ratings[d.id] === n ? '#fff' : 'var(--fg-muted)',
                  }}
                >
                  {n}
                </button>
              ))}
            </div>

            {/* Comparison bar */}
            {ratings[d.id] !== undefined && (
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-10 text-[10px] font-medium" style={{ color: 'var(--fg-subtle)' }}>You</span>
                  <div className="flex-1 rounded-full" style={{ background: 'var(--border)', height: '6px' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${ratings[d.id] * 20}%`, background: '#3B82F6' }}
                    />
                  </div>
                </div>
                {revealed[d.id] && (
                  <div className="flex items-center gap-2">
                    <span className="w-10 text-[10px] font-medium" style={{ color: 'var(--fg-subtle)' }}>Jake</span>
                    <div className="flex-1 rounded-full" style={{ background: 'var(--border)', height: '6px' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${d.jakeRating * 20}%`, background: 'var(--accent)' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Jake's comment */}
            {revealed[d.id] && (
              <div
                className="mt-3 rounded border-l-2 py-2 pl-3 text-xs leading-relaxed italic"
                style={{ borderColor: 'var(--accent)', color: 'var(--fg-muted)' }}
                role="status"
                aria-live="polite"
              >
                {d.jakeComment}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      {allRated && (
        <div
          className="mt-6 rounded-md border p-4 text-center"
          style={{ borderColor: 'var(--accent)', background: 'var(--accent-light)' }}
          role="status"
          aria-live="polite"
        >
          <p className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
            Your average: {(Object.values(ratings).reduce((a, b) => a + b, 0) / 6).toFixed(1)}/5
            {' · '}
            Jake&apos;s average: {(dimensions.reduce((a, d) => a + d.jakeRating, 0) / 6).toFixed(1)}/5
          </p>
          <p className="mt-1 text-xs" style={{ color: 'var(--fg-muted)' }}>
            The speed and fun scores always win. The question is whether the bottom half matters for what you&apos;re building.
          </p>
        </div>
      )}
    </section>
  )
}
