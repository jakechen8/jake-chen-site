'use client'

import { useState, useCallback, useMemo } from 'react'

interface PulseCheckProps {
  statement: string
  id: string
}

interface ResultBar {
  label: string
  percentage: number
  isUserChoice: boolean
}

/**
 * Simple seeded hash function to generate consistent results from an id.
 * Ensures the same id always produces the same percentages across renders.
 */
function seededHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

/**
 * Generates realistic simulated results based on the poll id.
 * The user's choice gets a small boost (+5-10%).
 */
function generateResults(id: string, userChoice: number): ResultBar[] {
  const seed = seededHash(id)
  const rng = seed % 100 / 100

  // Base percentages (before user boost)
  let agree = 45 + Math.floor(rng * 20) // 45-65%
  let disagree = 15 + Math.floor((rng * 7) % 15) // 15-30%
  let itDepends = 100 - agree - disagree

  // Apply user boost: +5-10% to the user's choice
  const boost = 5 + Math.floor((rng * 5) % 10)
  const choices = [agree, disagree, itDepends]
  choices[userChoice] += boost

  // Normalize to 100
  const total = choices.reduce((a, b) => a + b, 0)
  choices[0] = Math.round((choices[0] / total) * 100)
  choices[1] = Math.round((choices[1] / total) * 100)
  choices[2] = 100 - choices[0] - choices[1]

  return [
    { label: 'Agree', percentage: choices[0], isUserChoice: userChoice === 0 },
    { label: 'Disagree', percentage: choices[1], isUserChoice: userChoice === 1 },
    { label: 'It Depends', percentage: choices[2], isUserChoice: userChoice === 2 },
  ]
}

export default function PulseCheck({ statement, id }: PulseCheckProps) {
  const [selected, setSelected] = useState<number | null>(null)

  // Memoize results so they don't change on re-render
  const results = useMemo(() => {
    if (selected === null) return null
    return generateResults(id, selected)
  }, [selected, id])

  const handleVote = useCallback(
    (choice: number) => {
      if (selected !== null) return
      setSelected(choice)
    },
    [selected]
  )

  const buttonLabels = ['Agree', 'Disagree', 'It Depends']

  return (
    <div
      className="my-8 rounded-lg border px-6 py-5"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-warm)' }}
    >
      {/* Header */}
      <p
        className="font-mono text-xs font-medium uppercase tracking-widest"
        style={{ color: 'var(--accent)', marginBottom: '1rem' }}
      >
        Pulse Check
      </p>

      {/* Statement */}
      <p
        className="font-display text-lg font-normal"
        style={{ color: 'var(--fg)', marginBottom: '1.5rem', lineHeight: 1.5 }}
      >
        {statement}
      </p>

      {/* Voting buttons or results */}
      {selected === null ? (
        // Vote buttons
        <div className="flex flex-wrap gap-3">
          {buttonLabels.map((label, i) => (
            <button
              key={i}
              onClick={() => handleVote(i)}
              className="rounded-full border px-5 py-2 text-sm font-medium transition-all"
              style={{
                borderColor: 'var(--border-strong)',
                color: 'var(--fg)',
                cursor: 'pointer',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-light)'
                e.currentTarget.style.borderColor = 'var(--accent)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.borderColor = 'var(--border-strong)'
              }}
            >
              {label}
            </button>
          ))}
        </div>
      ) : (
        // Results bars
        <div className="space-y-4">
          {results!.map((result, i) => (
            <div key={i}>
              {/* Label and percentage */}
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--fg)' }}>
                    {result.label}
                  </span>
                  {result.isUserChoice && (
                    <span
                      className="rounded px-2 py-0.5 text-xs font-medium"
                      style={{
                        background: 'var(--accent-light)',
                        color: 'var(--accent)',
                      }}
                    >
                      You
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--fg-muted)' }}>
                  {result.percentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div
                className="h-2 overflow-hidden rounded-full"
                style={{ background: 'var(--border)' }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${result.percentage}%`,
                    background: result.isUserChoice ? 'var(--accent)' : 'var(--fg-subtle)',
                    animation: 'slideIn 0.6s ease-out',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: var(--final-width);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
