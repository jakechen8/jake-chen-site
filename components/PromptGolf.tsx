'use client'

import { useState, useEffect, useRef } from 'react'

interface Round {
  target: string
  hint: string
  keywords: string[]
  parScore: number
}

const rounds: Round[] = [
  {
    target: 'Hello, World!',
    hint: 'The classic first program output',
    keywords: ['hello', 'world'],
    parScore: 14,
  },
  {
    target: 'The model is overfitting.',
    hint: 'When training accuracy is suspiciously perfect',
    keywords: ['model', 'overfit'],
    parScore: 28,
  },
  {
    target: 'Trust, but verify.',
    hint: 'Reagan\'s favorite proverb, also good AI advice',
    keywords: ['trust', 'verify'],
    parScore: 20,
  },
  {
    target: 'Ship it.',
    hint: 'What the PM says on Friday at 4:59',
    keywords: ['ship'],
    parScore: 10,
  },
  {
    target: 'It works on my machine.',
    hint: 'The universal developer excuse',
    keywords: ['works', 'machine'],
    parScore: 26,
  },
  {
    target: 'Garbage in, garbage out.',
    hint: 'The oldest rule of data science',
    keywords: ['garbage'],
    parScore: 28,
  },
  {
    target: 'Move fast and break things.',
    hint: 'Silicon Valley\'s most regrettable mantra',
    keywords: ['move', 'fast', 'break'],
    parScore: 32,
  },
  {
    target: 'The demo worked perfectly.',
    hint: 'A sentence that ages poorly',
    keywords: ['demo', 'work', 'perfect'],
    parScore: 28,
  },
]

function scorePrompt(input: string, round: Round): { score: number; match: number } {
  const inputLower = input.toLowerCase().trim()
  const targetLower = round.target.toLowerCase()

  // Perfect match
  if (inputLower === targetLower || inputLower === targetLower.replace(/[.,!?]/g, '')) {
    return { score: input.length, match: 100 }
  }

  // Check keyword matches
  let matched = 0
  for (const kw of round.keywords) {
    if (inputLower.includes(kw.toLowerCase())) matched++
  }
  const keywordRatio = round.keywords.length > 0 ? matched / round.keywords.length : 0

  // Check character overlap with target
  const targetChars = new Set(targetLower.split(''))
  const inputChars = new Set(inputLower.split(''))
  let overlap = 0
  targetChars.forEach((c) => { if (inputChars.has(c)) overlap++ })
  const charRatio = targetChars.size > 0 ? overlap / targetChars.size : 0

  // Check if words from target appear in input
  const targetWords = targetLower.replace(/[.,!?]/g, '').split(/\s+/)
  const inputWords = new Set(inputLower.replace(/[.,!?]/g, '').split(/\s+/))
  let wordMatches = 0
  for (const w of targetWords) {
    if (inputWords.has(w)) wordMatches++
  }
  const wordRatio = targetWords.length > 0 ? wordMatches / targetWords.length : 0

  const matchPct = Math.round((keywordRatio * 40 + wordRatio * 40 + charRatio * 20))

  return {
    score: matchPct >= 70 ? input.length : 0,
    match: matchPct,
  }
}

const STORAGE_KEY = 'promptgolf-stats'

function loadStats() {
  if (typeof window === 'undefined') return { bestTotal: Infinity, gamesPlayed: 0 }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { bestTotal: Infinity, gamesPlayed: 0 }
  } catch { return { bestTotal: Infinity, gamesPlayed: 0 } }
}

function saveStats(stats: { bestTotal: number; gamesPlayed: number }) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(stats)) } catch {}
}

export default function PromptGolf() {
  const [currentRound, setCurrentRound] = useState(0)
  const [input, setInput] = useState('')
  const [scores, setScores] = useState<number[]>([])
  const [matches, setMatches] = useState<number[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [stats, setStats] = useState({ bestTotal: Infinity, gamesPlayed: 0 })
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setStats(loadStats()) }, [])

  const round = rounds[currentRound]
  const totalScore = scores.reduce((a, b) => a + b, 0)
  const totalPar = rounds.slice(0, scores.length).reduce((a, r) => a + r.parScore, 0)

  const handleSubmit = () => {
    if (!input.trim() || submitted) return
    const result = scorePrompt(input, round)
    if (result.match < 70) {
      // Not close enough — shake and let them retry
      setSubmitted(false)
      return
    }
    setScores([...scores, result.score])
    setMatches([...matches, result.match])
    setSubmitted(true)
  }

  const nextRound = () => {
    if (currentRound >= rounds.length - 1) {
      // Game over
      const finalTotal = [...scores].reduce((a, b) => a + b, 0)
      const newStats = {
        bestTotal: Math.min(stats.bestTotal, finalTotal),
        gamesPlayed: stats.gamesPlayed + 1,
      }
      setStats(newStats)
      saveStats(newStats)
      setGameOver(true)
    } else {
      setCurrentRound(currentRound + 1)
      setInput('')
      setSubmitted(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  const restart = () => {
    setCurrentRound(0)
    setInput('')
    setScores([])
    setMatches([])
    setSubmitted(false)
    setGameOver(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const shareText = `I scored ${totalScore} chars (par ${rounds.reduce((a, r) => a + r.parScore, 0)}) on Prompt Golf ⛳ by @mitjake\n\nhttps://jake-chen.com/play`

  const handleShare = () => {
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      '_blank'
    )
  }

  if (gameOver) {
    const fullPar = rounds.reduce((a, r) => a + r.parScore, 0)
    const diff = totalScore - fullPar
    const label = diff <= -10 ? 'Eagle! 🦅' : diff <= 0 ? 'Under par! 🏆' : diff <= 10 ? 'Bogey 😅' : 'Double bogey 😬'

    return (
      <div className="space-y-4">
        <div
          className="rounded-lg border p-6 text-center"
          style={{ borderColor: 'var(--accent)', background: 'var(--accent-light)' }}
        >
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
            Final Score
          </p>
          <p className="font-display text-4xl font-normal" style={{ color: 'var(--fg)' }}>
            {totalScore} chars
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--fg-muted)' }}>
            Par {fullPar} · {label}
          </p>
          {stats.bestTotal < Infinity && stats.bestTotal < totalScore && (
            <p className="mt-2 text-xs" style={{ color: 'var(--fg-subtle)' }}>
              Your best: {stats.bestTotal} chars
            </p>
          )}
        </div>

        {/* Round breakdown */}
        <div className="space-y-1">
          {rounds.map((r, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
              style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
            >
              <span style={{ color: 'var(--fg-muted)' }}>{r.target}</span>
              <span
                className="font-mono text-xs"
                style={{ color: scores[i] <= r.parScore ? 'var(--accent)' : 'var(--fg-subtle)' }}
              >
                {scores[i]} / {r.parScore}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={restart} className="btn-ghost flex-1">Play again</button>
          <button onClick={handleShare} className="btn-primary flex-1">Share on X</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
          Hole {currentRound + 1} of {rounds.length}
        </p>
        <p className="font-mono text-xs" style={{ color: 'var(--fg-subtle)' }}>
          {totalScore} chars {totalPar > 0 ? `(par ${totalPar})` : ''}
        </p>
      </div>

      {/* Target */}
      <div
        className="rounded-lg border p-5"
        style={{ borderColor: 'var(--border-strong)', background: 'var(--bg)' }}
      >
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--fg-subtle)' }}>
          Target Output
        </p>
        <p className="font-mono text-lg" style={{ color: 'var(--fg)' }}>
          &ldquo;{round.target}&rdquo;
        </p>
        <p className="mt-2 text-xs italic" style={{ color: 'var(--fg-subtle)' }}>
          Hint: {round.hint}
        </p>
        <p className="mt-1 text-xs" style={{ color: 'var(--fg-subtle)' }}>
          Par: {round.parScore} chars
        </p>
      </div>

      {/* Input */}
      {!submitted ? (
        <div>
          <label htmlFor="prompt-input" className="sr-only">Your prompt</label>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              id="prompt-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Type your prompt..."
              className="flex-1 rounded-md border px-3 py-2 text-sm outline-none transition-colors focus:border-[color:var(--accent)]"
              style={{
                borderColor: 'var(--border-strong)',
                background: 'var(--bg)',
                color: 'var(--fg)',
              }}
              autoFocus
            />
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="btn-primary"
              style={{ opacity: input.trim() ? 1 : 0.5 }}
            >
              Submit
            </button>
          </div>
          <p className="mt-1.5 text-xs" style={{ color: 'var(--fg-subtle)' }}>
            {input.length} chars · Get as close to the target as possible with the fewest characters
          </p>
        </div>
      ) : (
        <div>
          <div
            className="rounded-lg border p-4"
            style={{
              borderColor: scores[scores.length - 1] <= round.parScore ? 'var(--accent)' : 'var(--border)',
              background: scores[scores.length - 1] <= round.parScore ? 'var(--accent-light)' : 'var(--bg)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--fg)' }}>
                  {scores[scores.length - 1] <= round.parScore ? 'Under par! 🎯' : 'Over par 📝'}
                </p>
                <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>
                  Your prompt: {scores[scores.length - 1]} chars · Match: {matches[matches.length - 1]}%
                </p>
              </div>
              <span className="font-mono text-lg" style={{ color: 'var(--accent)' }}>
                {scores[scores.length - 1]}/{round.parScore}
              </span>
            </div>
          </div>
          <button onClick={nextRound} className="btn-primary mt-3 w-full">
            {currentRound >= rounds.length - 1 ? 'See final score' : 'Next hole →'}
          </button>
        </div>
      )}
    </div>
  )
}
