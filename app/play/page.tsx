import type { Metadata } from 'next'
import AIRunnerGame from '@/components/AIRunnerGame'

export const metadata: Metadata = {
  title: 'Play — AI Runner',
  description: 'A fast-paced endless runner where you deploy an AI agent through obstacles. How far can your model go before it crashes?',
  alternates: { canonical: 'https://jake-chen.com/play' },
}

export default function PlayPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8">
      <div className="py-16 sm:py-24">
        <div className="mb-8 max-w-xl">
          <p
            className="mb-3 text-xs font-medium uppercase tracking-widest"
            style={{ color: 'var(--accent)' }}
          >
            Just for fun
          </p>
          <h1
            className="mb-4 font-display text-4xl font-normal tracking-tight sm:text-5xl"
            style={{ color: 'var(--fg)' }}
          >
            AI Runner
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
            Deploy your AI agent and dodge the obstacles. Hit Space or tap to jump.
            How far can you go before the model crashes?
          </p>
        </div>

        <AIRunnerGame />

        <div
          className="mt-8 rounded-lg border p-5"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-warm)' }}
        >
          <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
            <span style={{ color: 'var(--fg)' }} className="font-medium">Why a game on a strategy site?</span>{' '}
            Because the best way to understand complex systems is to play with them.
            Also, I just think it&apos;s fun. Press Space to start.
          </p>
        </div>
      </div>
    </div>
  )
}
