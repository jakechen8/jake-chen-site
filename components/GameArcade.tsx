'use client'

import { useState } from 'react'
import GameWrapper from './GameWrapper'
import PromptGolf from './PromptGolf'
import TokenTrader from './TokenTrader'

interface GameDef {
  id: string
  title: string
  tagline: string
  icon: string
}

const games: GameDef[] = [
  { id: 'runner', title: 'AI Runner', tagline: 'Endless runner — dodge obstacles, deploy boosts', icon: '🏃' },
  { id: 'golf', title: 'Prompt Golf', tagline: 'Match the target output in the fewest characters', icon: '⛳' },
  { id: 'trader', title: 'Token Trader', tagline: 'Trade fictional AI stocks over 30 days', icon: '📈' },
]

export default function GameArcade() {
  const [activeGame, setActiveGame] = useState<string>('runner')

  return (
    <div>
      {/* Game selector */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3" role="group" aria-label="Choose a game">
        {games.map((g) => (
          <button
            key={g.id}
            onClick={() => setActiveGame(g.id)}
            aria-pressed={activeGame === g.id}
            className="rounded-lg border p-4 text-left transition-all"
            style={{
              borderColor: activeGame === g.id ? 'var(--accent)' : 'var(--border-strong)',
              background: activeGame === g.id ? 'var(--accent-light)' : 'var(--bg)',
            }}
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="text-lg" aria-hidden="true">{g.icon}</span>
              <span
                className="text-sm font-semibold"
                style={{ color: activeGame === g.id ? 'var(--accent)' : 'var(--fg)' }}
              >
                {g.title}
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--fg-subtle)' }}>
              {g.tagline}
            </p>
          </button>
        ))}
      </div>

      {/* Game container */}
      <div
        className="rounded-lg border p-5 sm:p-8"
        style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-warm)' }}
      >
        {activeGame === 'runner' && <GameWrapper />}
        {activeGame === 'golf' && <PromptGolf />}
        {activeGame === 'trader' && <TokenTrader />}
      </div>

      {/* Why games? */}
      <div
        className="mt-6 rounded-lg border p-5"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-warm)' }}
      >
        <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
          <span style={{ color: 'var(--fg)' }} className="font-medium">Why games on a strategy site?</span>{' '}
          Because the best way to understand complex systems is to play with them.
          Also, I just think it&apos;s fun.
        </p>
      </div>
    </div>
  )
}
