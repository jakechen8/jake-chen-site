import type { Metadata } from 'next'
import ResumeRunner from '@/components/ResumeRunner'

export const metadata: Metadata = {
  title: 'Play — Run Through My Resume',
  description: 'An interactive game where you jump over career milestones to build Jake Chen\'s resume. From undergrad to Waymo — clear every block to see the full picture.',
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
            Interactive Resume
          </p>
          <h1
            className="mb-4 font-display text-4xl font-normal tracking-tight sm:text-5xl"
            style={{ color: 'var(--fg)' }}
          >
            Run through my career
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
            Jump over each milestone to build my resume below. Clear all seven to see the
            full picture &mdash; from undergrad to Waymo.
          </p>
        </div>

        <ResumeRunner />

        {/* Why this exists */}
        <div
          className="mt-10 rounded-lg border p-5"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-warm)' }}
        >
          <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
            <span style={{ color: 'var(--fg)' }} className="font-medium">Why a game instead of a PDF?</span>{' '}
            Because resumes are boring and building things is fun.
            This is a real Canvas game running at 60fps &mdash; the same instinct to build that drives
            everything on this site.
          </p>
        </div>
      </div>
    </div>
  )
}
