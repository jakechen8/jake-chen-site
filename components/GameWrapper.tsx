'use client'

import { useState, useEffect, useCallback } from 'react'
import AIRunnerGame from './AIRunnerGame'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  check: (stats: GameStats) => boolean
}

interface GameStats {
  highScore: number
  totalRuns: number
  bestDistance: number
  totalBoosts: number
  currentStreak: number
  bestStreak: number
}

const achievements: Achievement[] = [
  {
    id: 'first-deploy',
    title: 'First Deploy',
    description: 'Complete your first run',
    icon: '🚀',
    check: (s) => s.totalRuns >= 1,
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Score over 500 points',
    icon: '⚡',
    check: (s) => s.highScore >= 500,
  },
  {
    id: 'marathon',
    title: 'Marathon Runner',
    description: 'Score over 2000 points',
    icon: '🏃',
    check: (s) => s.highScore >= 2000,
  },
  {
    id: 'persistent',
    title: 'Persistent Process',
    description: 'Complete 10 runs',
    icon: '🔄',
    check: (s) => s.totalRuns >= 10,
  },
  {
    id: 'boost-addict',
    title: 'Boost Addict',
    description: 'Use boost 20 times total',
    icon: '🔥',
    check: (s) => s.totalBoosts >= 20,
  },
  {
    id: 'legend',
    title: 'AI Legend',
    description: 'Score over 5000 points',
    icon: '👑',
    check: (s) => s.highScore >= 5000,
  },
]

function loadStats(): GameStats {
  if (typeof window === 'undefined') return defaultStats()
  try {
    const raw = localStorage.getItem('ai-runner-stats')
    if (raw) return JSON.parse(raw)
  } catch {}
  return defaultStats()
}

function defaultStats(): GameStats {
  return {
    highScore: 0,
    totalRuns: 0,
    bestDistance: 0,
    totalBoosts: 0,
    currentStreak: 0,
    bestStreak: 0,
  }
}

function saveStats(stats: GameStats) {
  try {
    localStorage.setItem('ai-runner-stats', JSON.stringify(stats))
  } catch {}
}

function loadUnlocked(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem('ai-runner-achievements')
    if (raw) return new Set(JSON.parse(raw))
  } catch {}
  return new Set()
}

function saveUnlocked(ids: Set<string>) {
  try {
    localStorage.setItem('ai-runner-achievements', JSON.stringify(Array.from(ids)))
  } catch {}
}

export default function GameWrapper() {
  const [stats, setStats] = useState<GameStats>(defaultStats)
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState<string | null>(null)
  const [recentScores, setRecentScores] = useState<number[]>([])

  useEffect(() => {
    setStats(loadStats())
    setUnlocked(loadUnlocked())
    try {
      const raw = localStorage.getItem('ai-runner-recent')
      if (raw) setRecentScores(JSON.parse(raw))
    } catch {}
  }, [])

  // Listen for game-over events from the game canvas
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const { score, boostsUsed } = e.detail as { score: number; boostsUsed: number }

      setStats((prev) => {
        const next: GameStats = {
          ...prev,
          totalRuns: prev.totalRuns + 1,
          highScore: Math.max(prev.highScore, score),
          bestDistance: Math.max(prev.bestDistance, score),
          totalBoosts: prev.totalBoosts + (boostsUsed || 0),
          currentStreak: score > 100 ? prev.currentStreak + 1 : 0,
          bestStreak: Math.max(prev.bestStreak, prev.currentStreak + 1),
        }
        saveStats(next)

        // Check achievements
        setUnlocked((prevUnlocked) => {
          const newUnlocked = new Set(prevUnlocked)
          let newlyUnlockedTitle = ''
          for (const a of achievements) {
            if (!newUnlocked.has(a.id) && a.check(next)) {
              newUnlocked.add(a.id)
              newlyUnlockedTitle = `${a.icon} ${a.title}`
            }
          }
          if (newlyUnlockedTitle) {
            setToast(newlyUnlockedTitle)
            setTimeout(() => setToast(null), 3000)
          }
          saveUnlocked(newUnlocked)
          return newUnlocked
        })

        return next
      })

      // Track recent scores
      setRecentScores((prev) => {
        const next = [score, ...prev].slice(0, 5)
        try { localStorage.setItem('ai-runner-recent', JSON.stringify(next)) } catch {}
        return next
      })
    }

    window.addEventListener('game-over' as any, handler as EventListener)
    return () => window.removeEventListener('game-over' as any, handler as EventListener)
  }, [])

  const shareScore = useCallback(() => {
    const text = `I scored ${stats.highScore} on @mitjake's AI Runner game. Can you beat it? jake-chen.com/play`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [stats.highScore])

  return (
    <div>
      {/* Toast notification */}
      {toast && (
        <div
          className="fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-lg border px-4 py-2 text-sm font-medium shadow-lg"
          style={{
            borderColor: 'var(--accent)',
            background: 'var(--bg)',
            color: 'var(--accent)',
            animation: 'fadeUp 0.3s ease-out',
          }}
          role="alert"
        >
          Achievement Unlocked: {toast}
        </div>
      )}

      {/* Personal best badge */}
      {stats.highScore > 0 && (
        <div className="mb-4 flex items-center gap-3">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)', background: 'var(--accent-light)' }}
          >
            Personal Best: {stats.highScore}
          </span>
          <span className="text-xs" style={{ color: 'var(--fg-subtle)' }}>
            {stats.totalRuns} run{stats.totalRuns !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* The game */}
      <AIRunnerGame />

      {/* Post-game actions */}
      <div className="mt-4 flex flex-wrap gap-3">
        {stats.highScore > 0 && (
          <button
            onClick={shareScore}
            className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
            style={{ borderColor: 'var(--border-strong)', color: 'var(--fg-muted)' }}
          >
            Share on X
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5" />
            </svg>
          </button>
        )}
      </div>

      {/* Recent scores */}
      {recentScores.length > 1 && (
        <div className="mt-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--fg-subtle)' }}>
            Recent Runs
          </p>
          <div className="flex gap-2">
            {recentScores.map((score, i) => (
              <span
                key={i}
                className="rounded-md border px-2.5 py-1 font-mono text-xs"
                style={{
                  borderColor: i === 0 ? 'var(--accent)' : 'var(--border)',
                  color: i === 0 ? 'var(--accent)' : 'var(--fg-subtle)',
                }}
              >
                {score}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="mt-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--fg-subtle)' }}>
          Achievements
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {achievements.map((a) => {
            const isUnlocked = unlocked.has(a.id)
            return (
              <div
                key={a.id}
                className="rounded-md border px-3 py-2"
                style={{
                  borderColor: isUnlocked ? 'var(--accent)' : 'var(--border)',
                  background: isUnlocked ? 'var(--accent-light)' : 'transparent',
                  opacity: isUnlocked ? 1 : 0.5,
                }}
              >
                <p className="text-sm">
                  <span aria-hidden="true">{a.icon}</span>{' '}
                  <span className="font-medium" style={{ color: isUnlocked ? 'var(--accent)' : 'var(--fg-muted)' }}>
                    {a.title}
                  </span>
                </p>
                <p className="text-[10px]" style={{ color: 'var(--fg-subtle)' }}>
                  {a.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
