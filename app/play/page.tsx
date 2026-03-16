import type { Metadata } from 'next'
import GameArcade from '@/components/GameArcade'

export const metadata: Metadata = {
  title: 'Play — AI Games & Experiments',
  description: 'A mini arcade of AI-themed games: an endless runner, a prompt word puzzle, and a fictional AI stock trading sim. Built for fun by Jake Chen.',
  alternates: { canonical: 'https://jake-chen.com/play' },
}

export default function PlayPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8">
      <div className="py-16 sm:py-24">
        <div className="mb-10 max-w-xl">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--accent)' }}
          >
            The Arcade
          </p>
          <h1
            className="mb-4 font-display text-4xl font-normal tracking-tight sm:text-5xl"
            style={{ color: 'var(--fg)' }}
          >
            Games &amp; Experiments
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
            AI-themed games I built for fun. No strategic insight here &mdash;
            just the belief that the best way to understand systems is to play with&nbsp;them.
          </p>
        </div>

        <GameArcade />
      </div>
    </div>
  )
}
